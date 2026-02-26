package com.ToolRent.ToolRent.Entity;
import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.*;
import lombok.Data;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;


@Entity
@Table(name = "kardex")
@Data
@Getter
@NoArgsConstructor
public class KardexEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(unique = true, nullable = false)
    private Long id;

    @Column(nullable = false)
    private String type;

    @Column(nullable = false)
    private LocalDateTime dateTime;

    @Column(nullable = false)
    private int quantity;

    @ManyToOne
    @JoinColumn(name = "tool_id", nullable = false)
    @JsonBackReference(value = "tool-kardex")
    private ToolsEntity tool;

    @JsonProperty("toolName")
    public String getToolName() {
        return tool.getName();
    }

    @JsonProperty("toolId")
    public Long getToolId() {
        return tool.getId();
    }

    private String userRut;


    @ManyToOne
    @JoinColumn(name = "loan_id")
    @JsonBackReference(value = "loan-kardex")
    private LoanEntity loan;

}
