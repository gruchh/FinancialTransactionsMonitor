package com.financialtransactions.monitor.controller;

import com.financialtransactions.monitor.model.dto.TradeWithCurrencyDto;
import com.financialtransactions.monitor.service.TradeService;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@Slf4j
@RequiredArgsConstructor
@RestController
@RequestMapping("/api/trades")
@CrossOrigin(origins = "*")
@Tag(name = "Trades", description = "API for managing trade-related operations")
@PreAuthorize("hasRole('TRADER')")
public class TradeController {

    private final TradeService tradeService;

    @GetMapping("/with-currency")
    public ResponseEntity<List<TradeWithCurrencyDto>> getAllTradesWithCurrency() {
        List<TradeWithCurrencyDto> trades = tradeService.getAllTradesWithCurrency();
        return ResponseEntity.ok(trades);
    }

}