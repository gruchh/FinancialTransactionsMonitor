package com.financialtransactions.monitor.controller;

import com.financialtransactions.monitor.model.Trade;
import com.financialtransactions.monitor.service.TradeService;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RequiredArgsConstructor
@RestController
@RequestMapping("/api/trades")
@CrossOrigin(origins = "*")
@Tag(name = "Trades", description = "API for managing trade-related operations")
public class TradeController {

    private final TradeService tradeService;

    @GetMapping
    public List<Trade> getAllTrades() {
        return tradeService.getAllTrades();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Trade> getTradeById(@PathVariable Long id) {
        return tradeService.getTradeById(id)
                .map(trade -> ResponseEntity.ok().body(trade))
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/fund/{fundId}")
    public List<Trade> getTradesByFund(@PathVariable Long fundId) {
        return tradeService.getTradesByFund(fundId);
    }

    @PostMapping
    public Trade createTrade(@RequestBody Trade trade) {
        return tradeService.saveTrade(trade);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Trade> updateTrade(@PathVariable Long id, @RequestBody Trade tradeDetails) {
        try {
            Trade updatedTrade = tradeService.updateTrade(id, tradeDetails);
            return ResponseEntity.ok(updatedTrade);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteTrade(@PathVariable Long id) {
        tradeService.deleteTrade(id);
        return ResponseEntity.ok().build();
    }
}