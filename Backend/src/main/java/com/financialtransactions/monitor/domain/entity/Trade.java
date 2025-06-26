package com.financialtransactions.monitor.domain.entity;

import com.financialtransactions.monitor.domain.enums.TradeType;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Builder
@Entity
@Table(name = "trades")
public class Trade {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "portfolio_id", nullable = false)
    @NotNull
    private Portfolio portfolio;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "fund_id", nullable = false)
    @NotNull
    private Fund fund;

    @NotNull
    @Column(name = "trade_date", nullable = false)
    private LocalDate tradeDate;

    @NotNull
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private TradeType type;

    @NotNull
    @Column(precision = 10, scale = 4, nullable = false)
    private BigDecimal quantity;

    @NotNull
    @Column(name = "price_per_unit", precision = 10, scale = 4, nullable = false)
    private BigDecimal pricePerUnit;

    @Column(name = "eur_pln_rate", precision = 10, scale = 4)
    private BigDecimal eurPlnRate;

    @Column(name = "usd_pln_rate", precision = 10, scale = 4)
    private BigDecimal usdPlnRate;

    @Column(name = "total_value_pln", precision = 12, scale = 2)
    private BigDecimal totalValuePln;

    @Column(name = "total_value_portfolio_currency", precision = 12, scale = 2)
    private BigDecimal totalValuePortfolioCurrency;

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
}