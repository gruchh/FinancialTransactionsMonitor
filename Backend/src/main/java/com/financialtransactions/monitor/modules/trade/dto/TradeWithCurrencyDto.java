package com.financialtransactions.monitor.modules.trade.dto;

import com.financialtransactions.monitor.domain.enums.CurrencyType;
import com.financialtransactions.monitor.domain.enums.TradeType;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDate;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class TradeWithCurrencyDto {
    private Long id;
    private LocalDate tradeDate;
    private TradeType type;
    private BigDecimal quantity;
    private BigDecimal pricePerUnit;
    private BigDecimal eurPlnRate;
    private BigDecimal usdPlnRate;
    private BigDecimal totalValuePln;
    private CurrencyType currencyType;

    private Long userId;
    private String username;
    private String userEmail;

    private Long portfolioId;
    private String portfolioName;
    private CurrencyType portfolioCurrency;

    private Long fundId;
    private String fundName;
    private String fundSymbol;
}