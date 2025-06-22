package com.financialtransactions.monitor.model.dto;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.financialtransactions.monitor.model.CurrencyType;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Builder
public class FundDto {

    private Long id;
    private String symbol;
    private String name;
    private CurrencyType currencyType;
    private String market;
    private String sector;
    private String exchange;
    private BigDecimal currentPrice;

    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private LocalDateTime lastUpdated;
}