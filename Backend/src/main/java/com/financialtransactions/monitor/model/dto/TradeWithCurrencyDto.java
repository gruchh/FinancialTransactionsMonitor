package com.financialtransactions.monitor.model.dto;

import com.financialtransactions.monitor.model.CurrencyType;
import com.financialtransactions.monitor.model.TradeType;
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
}