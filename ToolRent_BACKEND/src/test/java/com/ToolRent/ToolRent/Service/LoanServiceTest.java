package com.ToolRent.ToolRent.Service;

import com.ToolRent.ToolRent.Entity.*;
import com.ToolRent.ToolRent.Repository.LoanRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.*;

import java.time.LocalDate;
import java.util.*;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class LoanServiceTest {

    @InjectMocks
    private LoanService loanService;

    @Mock
    private LoanRepository loanRepository;

    @Mock
    private UserService userService;

    @Mock
    private ToolsService toolsService;

    @Mock
    private KardexService kardexService;

    private String rut = "12.345.678-9";

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    // ========== CREATE LOAN ==========
    @Test
    void testCreateLoanHappyPath() {
        UserEntity user = new UserEntity();
        user.setId(1L);
        user.setStatus("Activo");

        ToolsEntity tool = new ToolsEntity();
        tool.setId(1L);
        tool.setDailyRate(100.0);
        tool.setName("Taladro");

        LoanEntity loan = new LoanEntity();
        loan.setClient(user);
        loan.setTool(tool);
        loan.setStartDate(LocalDate.now());
        loan.setScheduledReturnDate(LocalDate.now().plusDays(2));

        when(userService.findById(1L)).thenReturn(user);
        when(toolsService.getAvailableTool(1L)).thenReturn(tool);
        doNothing().when(toolsService).loanTool(1L);
        when(loanRepository.save(any())).thenAnswer(i -> i.getArgument(0));

        LoanEntity savedLoan = loanService.createLoan(loan,rut);

        assertNotNull(savedLoan);
        assertEquals(200.0, savedLoan.getLoanPrice()); // 2 días * 100
        verify(kardexService, times(1)).save(any(KardexEntity.class));
    }

    @Test
    void testCreateLoanWithoutClient() {
        LoanEntity loan = new LoanEntity();
        loan.setTool(new ToolsEntity());
        loan.setStartDate(LocalDate.now());
        loan.setScheduledReturnDate(LocalDate.now().plusDays(1));

        IllegalArgumentException ex = assertThrows(IllegalArgumentException.class,
                () -> loanService.createLoan(loan, rut));
        assertTrue(ex.getMessage().contains("cliente"));
    }

    @Test
    void testCreateLoanWithInvalidDates() {
        // Crear usuario
        UserEntity user = new UserEntity();
        user.setId(1L);
        user.setStatus("Activo");

        // Crear herramienta
        ToolsEntity tool = new ToolsEntity();
        tool.setId(1L);

        // Crear préstamo con fecha de devolución anterior a la de inicio
        LoanEntity loan = new LoanEntity();
        loan.setClient(user);
        loan.setTool(tool);
        loan.setStartDate(LocalDate.now());
        loan.setScheduledReturnDate(LocalDate.now().minusDays(1));

        // Mock para ToolsService
        when(toolsService.getAvailableTool(1L)).thenReturn(tool);
        doNothing().when(toolsService).loanTool(1L);

        // Mock para UserService.findById (importante para validateClient)
        when(userService.findById(1L)).thenReturn(user);


        // Ahora sí se lanza IllegalArgumentException por fecha inválida
        IllegalArgumentException ex = assertThrows(IllegalArgumentException.class,
                () -> loanService.createLoan(loan, rut));
        assertTrue(ex.getMessage().contains("devolución no puede ser anterior"));
    }


    // ========== RETURN LOAN ==========
    @Test
    void testReturnLoanWithoutDamage() {
        UserEntity user = new UserEntity();
        user.setId(1L);

        ToolsEntity tool = new ToolsEntity();
        tool.setId(1L);
        tool.setDailyRate(50.0);

        LoanEntity loan = new LoanEntity();
        loan.setId(1L);
        loan.setClient(user);
        loan.setTool(tool);
        loan.setDelivered(false);
        loan.setLoanPrice(100.0); // precio ya definido
        loan.setFine(0);

        when(loanRepository.findById(1L)).thenReturn(Optional.of(loan));
        doNothing().when(toolsService).returnTool(tool.getId());
        when(loanRepository.save(any())).thenAnswer(i -> i.getArgument(0));

        LoanEntity returned = loanService.returnLoan(1L, false, false, rut);

        assertTrue(returned.isDelivered());
        assertEquals(100.0, returned.getLoanPrice());
        assertEquals(100.0, returned.getTotal());
        verify(kardexService, times(1)).save(any(KardexEntity.class)); // solo devolución
        verify(toolsService, times(1)).returnTool(tool.getId());
    }

    @Test
    void testReturnLoanWithIrreparableDamage() {
        UserEntity user = new UserEntity();
        user.setId(1L);

        ToolsEntity tool = new ToolsEntity();
        tool.setId(1L);
        tool.setDailyRate(50.0);
        tool.setReplacementValue(300.0);

        LoanEntity loan = new LoanEntity();
        loan.setId(1L);
        loan.setClient(user);
        loan.setTool(tool);
        loan.setDelivered(false);
        loan.setLoanPrice(100.0);
        loan.setFine(0);

        when(loanRepository.findById(1L)).thenReturn(Optional.of(loan));
        when(toolsService.decommissionTool(tool.getId(), rut)).thenReturn(tool);
        when(loanRepository.save(any())).thenAnswer(i -> i.getArgument(0));

        LoanEntity returned = loanService.returnLoan(1L, true, true, rut);

        assertTrue(returned.isDelivered());
        assertEquals(300.0, returned.getDamagePrice());
        assertEquals(100.0 + 300.0, returned.getTotal());
        assertEquals("DEVUELTO", returned.getLoanStatus());
        verify(kardexService, times(1)).save(any(KardexEntity.class)); // solo devolución
        verify(toolsService, times(1)).decommissionTool(tool.getId(), rut);
    }

    @Test
    void testReturnLoanInRepair() {
        ToolsEntity tool = new ToolsEntity();
        tool.setId(1L);
        tool.setDailyRate(10.0);
        tool.setRepairValue(50.0);
        tool.setStatus(ToolStatus.DISPONIBLE);

        UserEntity client = new UserEntity();
        client.setId(1L);
        client.setStatus("Activo");

        LoanEntity loan = new LoanEntity();
        loan.setId(1L);
        loan.setTool(tool);
        loan.setClient(client);
        loan.setDelivered(false);
        loan.setLoanPrice(30.0); // precio ya definido
        loan.setFine(0);

        when(loanRepository.findById(1L)).thenReturn(Optional.of(loan));
        when(loanRepository.save(any(LoanEntity.class))).thenAnswer(i -> i.getArgument(0));

        LoanEntity returnedLoan = loanService.returnLoan(1L, true, false, rut);

        assertTrue(returnedLoan.isDelivered());
        assertEquals("DEVUELTO", returnedLoan.getLoanStatus());
        assertEquals(ToolStatus.EN_REPARACION, returnedLoan.getTool().getStatus());
        assertEquals(50.0, returnedLoan.getDamagePrice());
        assertEquals(50.0, returnedLoan.getFineTotal());
        assertEquals(30.0 + 50.0, returnedLoan.getTotal()); // loanPrice + damagePrice

        verify(kardexService, times(2)).save(any(KardexEntity.class)); // reparación + devolución
        verify(toolsService, never()).decommissionTool(anyLong(), eq(rut));
        verify(toolsService, never()).returnTool(anyLong());
    }

    // ========== UPDATE FINE PAID ==========
    @Test
    void testUpdateFinePaid() {
        UserEntity user = new UserEntity();
        user.setId(1L);

        LoanEntity loan = new LoanEntity();
        loan.setId(1L);
        loan.setClient(user);

        when(loanRepository.findById(1L)).thenReturn(Optional.of(loan));
        when(loanRepository.save(any())).thenAnswer(i -> i.getArgument(0));

        LoanEntity updated = loanService.updateFinePaid(1L, true);

        assertTrue(updated.isFinePaid());
        verify(userService, times(1)).updateUserStatus(1L, true);
    }

    // ========== GET ALL LOANS ==========
    @Test
    void testGetAllLoans() {
        LoanEntity loan = new LoanEntity();
        when(loanRepository.findAll()).thenReturn(List.of(loan));

        List<LoanEntity> loans = loanService.getAllLoans();
        assertEquals(1, loans.size());
    }

    @Test
    void testGetActiveLoans() {
        List<LoanEntity> loans = new ArrayList<>();
        loans.add(new LoanEntity());

        when(loanRepository.findActiveLoansOrderedByDateDesc()).thenReturn(loans);

        List<LoanEntity> result = loanService.getActiveLoans();
        assertEquals(1, result.size());
    }

    @Test
    void testGetActiveLoansByDate() {
        List<LoanEntity> loans = new ArrayList<>();
        loans.add(new LoanEntity());

        LocalDate start = LocalDate.now().minusDays(5);
        LocalDate end = LocalDate.now();

        when(loanRepository.findActiveLoansByDateRange(start, end)).thenReturn(loans);

        List<LoanEntity> result = loanService.getActiveLoansByDate(start, end);
        assertEquals(1, result.size());
    }

    @Test
    void testGetOverdueLoans() {
        List<LoanEntity> loans = new ArrayList<>();
        loans.add(new LoanEntity());

        LocalDate today = LocalDate.now();
        when(loanRepository.findOverdueLoans(today)).thenReturn(loans);

        List<LoanEntity> result = loanService.getOverdueLoans(today);
        assertEquals(1, result.size());
    }

    @Test
    void testGetOverdueLoansByDate() {
        List<LoanEntity> loans = new ArrayList<>();
        loans.add(new LoanEntity());

        LocalDate today = LocalDate.now();
        LocalDate start = today.minusDays(7);
        LocalDate end = today;

        when(loanRepository.findOverdueLoansByDate(today, start, end)).thenReturn(loans);

        List<LoanEntity> result = loanService.getOverdueLoansByDate(today, start, end);
        assertEquals(1, result.size());
    }

    @Test
    void testGetTopLentToolsAllTime() {
        List<Object[]> tools = new ArrayList<>();
        tools.add(new Object[]{"Hammer", 5L});

        when(loanRepository.findTopLentToolsAllTime()).thenReturn(tools);

        List<Object[]> result = loanService.getTopLentToolsAllTime();
        assertEquals(1, result.size());
    }

    @Test
    void testGetTopLentToolsByDate() {
        List<Object[]> tools = new ArrayList<>();
        tools.add(new Object[]{"Drill", 3L});

        LocalDate start = LocalDate.now().minusDays(10);
        LocalDate end = LocalDate.now();

        when(loanRepository.findTopLentToolsByName(start, end)).thenReturn(tools);

        List<Object[]> result = loanService.getTopLentTools(start, end);
        assertEquals(1, result.size());
    }

    @Test
    void testGetUnpaidLoans() {
        List<LoanEntity> loans = new ArrayList<>();
        loans.add(new LoanEntity());

        when(loanRepository.findByFinePaidFalse()).thenReturn(loans);

        List<LoanEntity> result = loanService.getUnpaidLoans();
        assertEquals(1, result.size());
    }

    @Test
    void testCheckOverdueLoansOnStartup() {
        // Mockear préstamos activos
        List<LoanEntity> loans = new ArrayList<>();
        LoanEntity loan = mock(LoanEntity.class);
        when(loan.isDelivered()).thenReturn(false);
        when(loan.getScheduledReturnDate()).thenReturn(LocalDate.now().minusDays(1));
        when(loan.getClient()).thenReturn(mock(com.ToolRent.ToolRent.Entity.UserEntity.class));
        when(loan.getTool()).thenReturn(mock(com.ToolRent.ToolRent.Entity.ToolsEntity.class));
        loans.add(loan);

        when(loanRepository.findActiveLoansOrderedByDateDesc()).thenReturn(loans);

        loanService.checkOverdueLoansOnStartup();

        // Verificar que updateOverdueLoans haya interactuado con repository
        verify(loanRepository, atLeastOnce()).save(any(LoanEntity.class));
    }

}