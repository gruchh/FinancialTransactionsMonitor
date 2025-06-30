package com.financialtransactions.monitor.modules.trade.dto;

import com.financialtransactions.monitor.domain.enums.TradeType;
import jakarta.validation.constraints.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDate;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class CreateTradeDto {

    @NotNull(message = "Fund ID is required")
    @Positive(message = "Fund ID must be positive")
    private Long fundId;

    @NotNull(message = "Trade date is required")
    @PastOrPresent(message = "Trade date cannot be in the future")
    private LocalDate tradeDate;

    @NotNull(message = "Trade type is required")
    private TradeType type;

    @NotNull(message = "Quantity is required")
    @DecimalMin(value = "0.0001", message = "Quantity must be greater than 0")
    @Digits(integer = 10, fraction = 4, message = "Invalid quantity format")
    private BigDecimal quantity;

    @NotNull(message = "Price per unit is required")
    @DecimalMin(value = "0.0001", message = "Price per unit must be greater than 0")
    @Digits(integer = 10, fraction = 4, message = "Invalid price format")
    private BigDecimal pricePerUnit;
}