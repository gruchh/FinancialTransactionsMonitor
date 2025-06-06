package com.financialtransactions.monitor.controller;

import com.financialtransactions.monitor.model.Fund;
import com.financialtransactions.monitor.service.FundService;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RequiredArgsConstructor
@RestController
@RequestMapping("/api/funds")
@CrossOrigin(origins = "*")
@Tag(name = "Funds", description = "API for managing funds")
public class FundController {

    private final FundService fundService;

    @GetMapping
    public List<Fund> getAllFunds() {
        return fundService.getAllFunds();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Fund> getFundById(@PathVariable Long id) {
        return fundService.getFundById(id)
                .map(fund -> ResponseEntity.ok().body(fund))
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/symbol/{symbol}")
    public ResponseEntity<Fund> getFundBySymbol(@PathVariable String symbol) {
        return fundService.getFundBySymbol(symbol)
                .map(fund -> ResponseEntity.ok().body(fund))
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public Fund createFund(@RequestBody Fund fund) {
        return fundService.saveFund(fund);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Fund> updateFund(@PathVariable Long id, @RequestBody Fund fundDetails) {
        try {
            Fund updatedFund = fundService.updateFund(id, fundDetails);
            return ResponseEntity.ok(updatedFund);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @PutMapping("/{id}/price")
    public ResponseEntity<Fund> updateFundPrice(@PathVariable Long id) {
        try {
            Fund updatedFund = fundService.updateFundPrice(id);
            return ResponseEntity.ok(updatedFund);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteFund(@PathVariable Long id) {
        fundService.deleteFund(id);
        return ResponseEntity.ok().build();
    }
}