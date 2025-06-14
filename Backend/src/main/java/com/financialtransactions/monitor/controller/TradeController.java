 package com.financialtransactions.monitor.controller;

 import com.financialtransactions.monitor.model.dto.FundDto;
 import com.financialtransactions.monitor.model.dto.TradeDto;
 import com.financialtransactions.monitor.service.TradeService;
 import io.swagger.v3.oas.annotations.tags.Tag;
 import lombok.RequiredArgsConstructor;
 import org.springframework.http.ResponseEntity;
 import org.springframework.security.access.prepost.PreAuthorize;
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
    @PreAuthorize("hasRole('TRADER')")
    public ResponseEntity<List<TradeDto>> getAllTrades() {
        List<TradeDto> tradesDto = tradeService.getAllTrades();
        return ResponseEntity.ok(tradesDto);
    }

    @GetMapping("/{id}")
    public ResponseEntity<TradeDto> getTradeById(@PathVariable Long id) {
        return tradeService.getTradeById(id)
                .map(tradeDto -> ResponseEntity.ok().body(tradeDto))
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/fund/{fundId}")
    public ResponseEntity<List<TradeDto>> getTradesByFund(@PathVariable Long fundId) {
        List<TradeDto> tradesDto = tradeService.getTradesByFund(fundId);
        return ResponseEntity.ok(tradesDto);
    }

    @PostMapping
    public ResponseEntity<TradeDto> createTrade(@RequestBody TradeDto tradeDto) {
        TradeDto createdTradeDto = tradeService.saveTrade(tradeDto);
        return ResponseEntity.ok(createdTradeDto);
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
        tradeService.deleteTrade(id);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/portfolio/funds")
    public ResponseEntity<List<FundDto>> getPortfolioFunds() {
        List<FundDto> portfolioFundsDto = tradeService.getPortfolioFunds();
        return ResponseEntity.ok(portfolioFundsDto);
    }
}