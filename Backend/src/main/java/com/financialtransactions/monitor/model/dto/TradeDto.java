package com.financialtransactions.monitor.model.dto;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.financialtransactions.monitor.model.TradeType;
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
public class TradeDto {

    private Long id;
    private FundDto fund;

    @JsonFormat(pattern = "yyyy-MM-dd")
    private LocalDate tradeDate;

    private TradeType type;
    private BigDecimal quantity;
    private BigDecimal pricePerUnit;
    private BigDecimal eurPlnRate;
    private BigDecimal usdPlnRate;
    private BigDecimal totalValuePln;

    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private LocalDateTime createdAt;

    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private LocalDateTime updatedAt;
}