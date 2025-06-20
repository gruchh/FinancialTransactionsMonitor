package com.financialtransactions.monitor.model.dto;

import com.financialtransactions.monitor.model.CurrencyType;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PortfolioDto {

    private Long id;
    private Long userId;
    private String username;
    private CurrencyType currency;
    private String name;
    private String description;
    private Boolean isActive;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    private Integer tradesCount;
    private java.math.BigDecimal totalValue;
}