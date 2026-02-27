package com.ToolRent.ToolRent.Controller;

import com.ToolRent.ToolRent.Entity.LoanEntity;
import com.ToolRent.ToolRent.Service.LoanService;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/loans")
@CrossOrigin("*")
@RequiredArgsConstructor
public class LoanController {

    private final LoanService loanService;

    @PostMapping("/createLoan/{rut}")
    public ResponseEntity<LoanEntity> createLoan(
            @PathVariable String rut,
            @RequestBody LoanEntity loan
    ) {
        LoanEntity createdLoan = loanService.createLoan(loan, rut);
        return ResponseEntity.ok(createdLoan);
    }

    @PostMapping("/returnLoan/{loanId}/{rut}")
    public ResponseEntity<LoanEntity> returnLoan(
            @PathVariable Long loanId,
            @PathVariable String rut,
            @RequestParam(required = false, defaultValue = "false") boolean damaged,
            @RequestParam(required = false, defaultValue = "false") boolean irreparable
    ) {
        LoanEntity returnedLoan = loanService.returnLoan(loanId, damaged, irreparable, rut);
        return ResponseEntity.ok(returnedLoan);
    }


    @GetMapping("/getLoans")
    public ResponseEntity<List<LoanEntity>> getAllLoans() {
        List<LoanEntity> loans = loanService.getAllLoans();
        return ResponseEntity.ok(loans);
    }

    @GetMapping("/loansActive")
    public ResponseEntity<List<LoanEntity>> getActiveLoans() {
        List<LoanEntity> loans = loanService.getActiveLoans();
        return ResponseEntity.ok(loans);
    }

    @PutMapping("/{loanId}/finePaid")
    public LoanEntity updateFinePaid(@PathVariable Long loanId, @RequestParam boolean finePaid) {
        return loanService.updateFinePaid(loanId, finePaid);
    }

    @GetMapping("/loansActiveByDate")
    public ResponseEntity<List<LoanEntity>> getActiveLoansByDate(
            @RequestParam LocalDate startDate,
            @RequestParam LocalDate endDate) {

        List<LoanEntity> loans = loanService.getActiveLoansByDate(startDate, endDate);
        return ResponseEntity.ok(loans);
    }

    // Obtener todos los clientes con préstamos atrasados
    @GetMapping("/overdueClients")
    public List<LoanEntity> getOverdueClients() {
        LocalDate today = LocalDate.now();
        return loanService.getOverdueLoans(today);
    }

    // Obtener clientes con préstamos atrasados filtrados por rango de fechas
    @GetMapping("/overdueClients/dateRange")
    public List<LoanEntity> getOverdueClientsByDate(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate
    ) {
        LocalDate today = LocalDate.now();
        return loanService.getOverdueLoansByDate(today, startDate, endDate);
    }

    @GetMapping("/topToolsByDate")
    public List<Object[]> getTopToolsByDate(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate
    ) {
        return loanService.getTopLentTools(startDate, endDate);
    }

    @GetMapping("/topTools")
    public List<Object[]> getTopTools() {
        return loanService.getTopLentToolsAllTime();
    }

    @GetMapping("/unpaid")
    public ResponseEntity<List<LoanEntity>> getUnpaidLoans() {
        List<LoanEntity> unpaidLoans = loanService.getUnpaidLoans();
        return ResponseEntity.ok(unpaidLoans);
    }

}
