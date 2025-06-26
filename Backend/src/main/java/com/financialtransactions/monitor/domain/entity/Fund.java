package com.financialtransactions.monitor.domain.entity;

import com.financialtransactions.monitor.domain.enums.CurrencyType;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

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
    @Column(unique = true, nullable = false)
    private String symbol;

    @NotBlank
    @Column(nullable = false)
    private String name;

    @NotNull
    @Column(nullable = false)
    private CurrencyType currencyType;

    @NotBlank
    @Column(nullable = false)
    private String market;

    @NotBlank
    @Column(nullable = false)
    private String sector;

    @NotBlank
    @Column(name = "exchange", nullable = false)
    private String exchange;

    @Column(name = "current_price", precision = 10, scale = 4)
    private BigDecimal currentPrice;

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
}