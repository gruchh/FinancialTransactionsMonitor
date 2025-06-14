package com.financialtransactions.monitor.controller;

import com.financialtransactions.monitor.model.dto.FundDto;
import com.financialtransactions.monitor.service.FundService;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
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
    public ResponseEntity<List<FundDto>> getAllFunds() {
        List<FundDto> fundsDto = fundService.getAllFunds();
        return ResponseEntity.ok(fundsDto);
    }

    @GetMapping("/{id}")
    public ResponseEntity<FundDto> getFundById(@PathVariable Long id) {
        return fundService.getFundById(id)
                .map(fundDto -> ResponseEntity.ok().body(fundDto))
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/symbol/{symbol}")
    public ResponseEntity<FundDto> getFundBySymbol(@PathVariable String symbol) {
        return fundService.getFundBySymbol(symbol)
                .map(fundDto -> ResponseEntity.ok().body(fundDto))
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<FundDto> createFund(@RequestBody FundDto fundDto) {
        try {
            FundDto createdFund = fundService.saveFund(fundDto);
            return ResponseEntity.status(HttpStatus.CREATED).body(createdFund);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<FundDto> updateFund(@PathVariable Long id, @RequestBody FundDto fundDto) {
        try {
            FundDto updatedFund = fundService.updateFund(id, fundDto);
            return ResponseEntity.ok(updatedFund);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @PutMapping("/{id}/price")
    public ResponseEntity<FundDto> updateFundPrice(@PathVariable Long id) {
        try {
            FundDto updatedFundDto = fundService.updateFundPrice(id);
            return ResponseEntity.ok(updatedFundDto);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteFund(@PathVariable Long id) {
        fundService.deleteFund(id);
        return ResponseEntity.noContent().build();
    }
}