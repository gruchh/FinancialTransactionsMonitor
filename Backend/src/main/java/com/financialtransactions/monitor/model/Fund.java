package com.financialtransactions.monitor.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Builder
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