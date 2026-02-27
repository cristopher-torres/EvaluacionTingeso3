package com.toolrent.toolrent.entity;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import lombok.Data;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "loans")
@Data
@Getter
@NoArgsConstructor
public class LoanEntity {
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  @Column(unique = true, nullable = false)
  private Long id;

  @ManyToOne
  @JoinColumn(name = "tool_id", nullable = false)
  @JsonIgnoreProperties({"loans", "kardexMovements"})
  private ToolsEntity tool;

  @ManyToOne
  @JoinColumn(name = "client_id")
  @JsonIgnoreProperties({"loans", "kardexMovements"})
  private UserEntity client;

  @Column(nullable = false)
  private LocalDate startDate; // La fecha en que el cliente retira la herramienta.

  @Column(nullable = false)
  private LocalDate scheduledReturnDate; // La fecha límite para devolver la herramienta.

  private LocalDate returnDate; // La fecha en que el cliente devuelve la herramienta.

  private boolean delivered = false;
  private String loanStatus = "Vigente";

  private double fine;
  private double loanPrice;
  private double damagePrice;
  private double fineTotal;
  private double total;

  @Column(name = "is_fine_paid", nullable = false)
  private boolean finePaid = true;

  @Column(nullable = false)
  private LocalDateTime createdLoan;

  @OneToMany(mappedBy = "loan", cascade = CascadeType.ALL, orphanRemoval = true)
  @JsonManagedReference(value = "loan-kardex")
  private List<KardexEntity> kardexMovements;
}
