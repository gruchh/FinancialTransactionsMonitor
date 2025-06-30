package com.financialtransactions.monitor.modules.trade.dto;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.financialtransactions.monitor.domain.enums.TradeType;
import com.financialtransactions.monitor.modules.fund.dto.FundDto;
import com.financialtransactions.monitor.modules.portfolio.dto.PortfolioDto;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Builder
public class TradeDto {

    private Long id;

    private PortfolioDto portfolio;
    private FundDto fund;
    private String ownerUsername;

    @JsonFormat(pattern = "yyyy-MM-dd")
    private LocalDate tradeDate;

    private TradeType type;
    private BigDecimal quantity;
    private BigDecimal pricePerUnit;
    private BigDecimal eurPlnRate;
    private BigDecimal usdPlnRate;
    private BigDecimal totalValuePln;
    private BigDecimal totalValuePortfolioCurrency;

    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private LocalDateTime createdAt;

    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private LocalDateTime updatedAt;
}