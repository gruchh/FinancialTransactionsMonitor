package com.financialtransactions.monitor.controller;

import com.financialtransactions.monitor.mapper.TradeMapper;
import com.financialtransactions.monitor.model.Trade;
import com.financialtransactions.monitor.model.dto.FundDto;
import com.financialtransactions.monitor.model.dto.TradeDto;
import com.financialtransactions.monitor.service.TradeService;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RequiredArgsConstructor
@RestController
@RequestMapping("/api/trades")
@CrossOrigin(origins = "*")
@Tag(name = "Trades", description = "API for managing trade-related operations")
@PreAuthorize("hasRole('TRADER')")
public class TradeController {

    private final TradeService tradeService;
    private final TradeMapper tradeMapper;

    @GetMapping
    public ResponseEntity<List<TradeDto>> getAllTrades() {
        List<Trade> trades = tradeService.getCurrentUserTrades();
        List<TradeDto> tradesDto = tradeMapper.toDtoList(trades);
        return ResponseEntity.ok(tradesDto);
    }

    @GetMapping("/{id}")
    public ResponseEntity<TradeDto> getTradeById(@PathVariable Long id) {
        try {
            Trade trade = tradeService.getTradeById(id);
            TradeDto tradeDto = tradeMapper.toDto(trade);
            return ResponseEntity.ok(tradeDto);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping("/fund/{fundId}")
    public ResponseEntity<List<TradeDto>> getTradesByFund(@PathVariable Long fundId) {
        List<Trade> trades = tradeService.getCurrentUserTradesByFundId(fundId);
        List<TradeDto> tradesDto = tradeMapper.toDtoList(trades);
        return ResponseEntity.ok(tradesDto);
    }

    @PostMapping
    public ResponseEntity<TradeDto> createTrade(@RequestBody TradeDto tradeDto) {
        try {
            TradeDto createdTradeDto = tradeService.saveTrade(tradeDto);
            return ResponseEntity.status(HttpStatus.CREATED).body(createdTradeDto);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<TradeDto> updateTrade(@PathVariable Long id, @RequestBody TradeDto tradeDto) {
        try {
            TradeDto updatedTradeDto = tradeService.updateTrade(id, tradeDto);
            return ResponseEntity.ok(updatedTradeDto);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteTrade(@PathVariable Long id) {
        try {
            tradeService.deleteTrade(id);
            return ResponseEntity.noContent().build();
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping("/portfolio/funds")
    public ResponseEntity<List<FundDto>> getPortfolioFunds() {
        List<FundDto> portfolioFundsDto = tradeService.getPortfolioFunds();
        return ResponseEntity.ok(portfolioFundsDto);
    }
}