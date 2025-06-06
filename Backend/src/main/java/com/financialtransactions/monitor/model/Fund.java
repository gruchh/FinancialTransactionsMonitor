package com.financialtransactions.monitor.model;

import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Entity
@Table(name = "funds")
public class Fund {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank
    @Column(unique = true)
    private String symbol;

    @NotBlank
    private String name;

    @NotBlank
    private String currency;

    @NotBlank
    private String market;

    private String sector;

    @Column(name = "current_price", precision = 10, scale = 4)
    private BigDecimal currentPrice;

    @Column(name = "last_updated")
    private LocalDateTime lastUpdated;
}