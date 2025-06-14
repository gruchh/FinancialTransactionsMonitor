package com.financialtransactions.monitor.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Entity
@Table(name = "trades")
public class Trade {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "fund_id")
    @NotNull
    private Fund fund;

    @NotNull
    @Column(name="owner_name")
    private String ownerUsername;

    @NotNull
    @Column(name = "trade_date")
    private LocalDate tradeDate;

    @NotNull
    @Enumerated(EnumType.STRING)
    private TradeType type;

    @NotNull
    @Column(precision = 10, scale = 4)
    private BigDecimal quantity;

    @NotNull
    @Column(name = "price_per_unit", precision = 10, scale = 4)
    private BigDecimal pricePerUnit;

    @Column(name = "eur_pln_rate", precision = 10, scale = 4)
    private BigDecimal eurPlnRate;

    @Column(name = "usd_pln_rate", precision = 10, scale = 4)
    private BigDecimal usdPlnRate;

    @Column(name = "total_value_pln", precision = 12, scale = 2)
    private BigDecimal totalValuePln;

    @Column(name = "created_at")
    private LocalDateTime createdAt = LocalDateTime.now();

    @Column(name = "updated_at")
    private LocalDateTime updatedAt = LocalDateTime.now();
}