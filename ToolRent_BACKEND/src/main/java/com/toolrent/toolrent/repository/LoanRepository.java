package com.toolrent.toolrent.repository;

import com.toolrent.toolrent.entity.LoanEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface LoanRepository extends JpaRepository<LoanEntity, Long> {
  // Traer préstamos activos (no entregados) ordenados por fecha de creación descendente
  @Query(
      "SELECT l "
          + "FROM LoanEntity l "
          + "WHERE l.delivered = false "
          + "ORDER BY l.createdLoan DESC")
  List<LoanEntity> findActiveLoansOrderedByDateDesc();

  @Query(
      "SELECT l FROM LoanEntity l "
          + "WHERE l.delivered = false "
          + "AND l.startDate BETWEEN :startDate AND :endDate")
  List<LoanEntity> findActiveLoansByDateRange(LocalDate startDate, LocalDate endDate);

  @Query(
      "SELECT l FROM LoanEntity l "
          + "WHERE l.loanStatus = 'ATRASADO' "
          + "AND l.scheduledReturnDate < :today")
  List<LoanEntity> findOverdueLoans(LocalDate today);

  @Query(
      "SELECT l FROM LoanEntity l "
          + "WHERE l.loanStatus = 'ATRASADO' "
          + "AND l.scheduledReturnDate < :today "
          + "AND l.startDate BETWEEN :startDate AND :endDate")
  List<LoanEntity> findOverdueLoansByDate(LocalDate today, LocalDate startDate, LocalDate endDate);

  @Query(
      "SELECT l.tool.name, COUNT(l) "
          + "FROM LoanEntity l "
          + "WHERE l.startDate BETWEEN :startDate AND :endDate "
          + "GROUP BY l.tool.name "
          + "ORDER BY COUNT(l) DESC")
  List<Object[]> findTopLentToolsByName(LocalDate startDate, LocalDate endDate);

  @Query(
      "SELECT l.tool.name, COUNT(l) "
          + "FROM LoanEntity l "
          + "GROUP BY l.tool.name "
          + "ORDER BY COUNT(l) DESC")
  List<Object[]> findTopLentToolsAllTime();

  List<LoanEntity> findByFinePaidFalse();
}
