package com.toolrent.toolrent.service;

import com.toolrent.toolrent.entity.*;
import com.toolrent.toolrent.repository.LoanRepository;
import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class LoanService {

  private final LoanRepository loanRepository;

  private final UserService userService;

  private final ToolsService toolsService;

  private final KardexService kardexService;

  @Transactional
  public LoanEntity createLoan(LoanEntity loan, String rut) {

    if (loan.getClient() == null) {
      throw new IllegalArgumentException("Se debe ingresar un cliente");
    }
    if (loan.getTool() == null || loan.getTool().getId() == null) {
      throw new IllegalArgumentException("Se debe ingresar una herramienta válida");
    }

    Long userId = loan.getClient().getId();
    Long toolUnitId = loan.getTool().getId();

    // Verificar que no tenga más de 5 préstamos activos
    userService.checkActiveLoans(userId);

    // Validar cliente adicional
    validateClient(userId);

    // Validar fechas
    if (loan.getStartDate() == null || loan.getScheduledReturnDate() == null) {
      throw new IllegalArgumentException("Se deben ingresar fechas de préstamo y devolución");
    }
    if (loan.getScheduledReturnDate().isBefore(loan.getStartDate())) {
      throw new IllegalArgumentException(
          "La fecha de devolución no puede ser anterior a la fecha de entrega");
    }

    // Obtener unidad disponible desde ToolsService
    ToolsEntity availableUnit = toolsService.getAvailableTool(toolUnitId);

    // Marcar la unidad como prestada
    toolsService.loanTool(toolUnitId);

    // Asociar la unidad al préstamo
    loan.setTool(availableUnit);

    // Verificar que no tenga un préstamo activo de la misma herramienta
    userService.checkDuplicateToolLoan(userId, loan.getTool().getName());

    // Calcular el precio del pretamo
    long days =
        java.time.temporal.ChronoUnit.DAYS.between(
            loan.getStartDate(), loan.getScheduledReturnDate());
    if (days <= 0) {
      days = 1; // mínimo 1 día de cobro
    }
    double price = days * availableUnit.getDailyRate();
    loan.setLoanPrice(price);

    KardexEntity movement = new KardexEntity();
    movement.setType("PRESTAMO");
    movement.setQuantity(1);
    movement.setTool(loan.getTool());
    movement.setDateTime(LocalDateTime.now());
    movement.setLoan(loan);
    movement.setUserRut(rut);
    kardexService.save(movement);

    return loanRepository.save(loan);
  }

  private void validateClient(long userId) {
    UserEntity user = userService.findById(userId);
    String status = user.getStatus();
    if (!"Activo".equalsIgnoreCase(status)) {
      throw new IllegalStateException("El cliente no esta disponible para realizar un prestamo");
    }
  }

  public LoanEntity returnLoan(Long loanId, boolean damaged, boolean irreparable, String rut) {
    LoanEntity loan =
        loanRepository
            .findById(loanId)
            .orElseThrow(() -> new RuntimeException("Préstamo no encontrado"));

    if (loan.isDelivered()) {
      throw new IllegalStateException("El préstamo ya fue devuelto");
    }

    LocalDate today = LocalDate.now();
    loan.setReturnDate(today);
    loan.setDelivered(true);

    // Manejar daños
    double damagePrice = 0.0;
    ToolsEntity tool = loan.getTool();
    if (damaged) {
      if (irreparable) {
        toolsService.decommissionTool(tool.getId(), rut);
        damagePrice = tool.getReplacementValue();
      } else {
        tool.setStatus(ToolStatus.EN_REPARACION);

        KardexEntity reparacion = new KardexEntity();
        reparacion.setType("REPARACION");
        reparacion.setQuantity(1);
        reparacion.setTool(loan.getTool());
        reparacion.setDateTime(LocalDateTime.now());
        reparacion.setLoan(loan);
        reparacion.setUserRut(rut);
        kardexService.save(reparacion);

        damagePrice = tool.getRepairValue();
      }
    } else {
      // Solo liberar si no hay daño
      toolsService.returnTool(tool.getId());
    }

    loan.setDamagePrice(damagePrice);
    loan.setTotal(loan.getLoanPrice() + damagePrice + loan.getFine());
    loan.setFineTotal(loan.getFine() + damagePrice);
    loan.setLoanStatus("DEVUELTO");

    // Registrar la devolución en Kardex
    KardexEntity devolucion = new KardexEntity();
    devolucion.setType("DEVOLUCION");
    devolucion.setTool(loan.getTool());
    devolucion.setQuantity(1);
    devolucion.setDateTime(LocalDateTime.now());
    devolucion.setLoan(loan);
    devolucion.setUserRut(rut);
    kardexService.save(devolucion);

    return loanRepository.save(loan);
  }

  public List<LoanEntity> getAllLoans() {
    return loanRepository.findAll();
  }

  // Obtener préstamos activos ordenados

  public List<LoanEntity> getActiveLoans() {
    return loanRepository.findActiveLoansOrderedByDateDesc();
  }

  public List<LoanEntity> getActiveLoansByDate(LocalDate startDate, LocalDate endDate) {
    return loanRepository.findActiveLoansByDateRange(startDate, endDate);
  }

  @Scheduled(cron = "0 0 0 * * ?", zone = "America/Santiago") // todos los días a medianoche
  public void updateOverdueLoans() {
    LocalDate today = LocalDate.now();
    List<LoanEntity> activeLoans = loanRepository.findActiveLoansOrderedByDateDesc();

    for (LoanEntity loan : activeLoans) {
      if (!loan.isDelivered() && loan.getScheduledReturnDate().isBefore(today)) {
        loan.setLoanStatus("ATRASADO");

        // Restringir al cliente por futuros prestamos
        long client = loan.getClient().getId();
        userService.restrictUserById(client);

        // Calcular días de atraso
        long daysLate =
            java.time.temporal.ChronoUnit.DAYS.between(loan.getScheduledReturnDate(), today);
        if (daysLate < 0) {
          daysLate = 0;
        }

        // Calcular multa acumulada
        double fine = daysLate * loan.getTool().getDailyLateRate();
        loan.setFine(fine);

        loanRepository.save(loan);
      }
    }
  }

  public LoanEntity updateFinePaid(Long loanId, boolean finePaid) {
    LoanEntity loan =
        loanRepository
            .findById(loanId)
            .orElseThrow(() -> new RuntimeException("Préstamo no encontrado"));
    loan.setFinePaid(finePaid);
    userService.updateUserStatus(loan.getClient().getId(), finePaid);
    return loanRepository.save(loan);
  }

  // Clientes con préstamos atrasados
  public List<LoanEntity> getOverdueLoans(LocalDate today) {
    return loanRepository.findOverdueLoans(today);
  }

  // Clientes con préstamos atrasados - filtrados por rango de fechas
  public List<LoanEntity> getOverdueLoansByDate(
      LocalDate today, LocalDate startDate, LocalDate endDate) {
    return loanRepository.findOverdueLoansByDate(today, startDate, endDate);
  }

  @PostConstruct
  public void checkOverdueLoansOnStartup() {
    updateOverdueLoans();
  }

  public List<Object[]> getTopLentToolsAllTime() {
    return loanRepository.findTopLentToolsAllTime();
  }

  public List<Object[]> getTopLentTools(LocalDate startDate, LocalDate endDate) {
    return loanRepository.findTopLentToolsByName(startDate, endDate);
  }

  public List<LoanEntity> getUnpaidLoans() {
    return loanRepository.findByFinePaidFalse();
  }
}
