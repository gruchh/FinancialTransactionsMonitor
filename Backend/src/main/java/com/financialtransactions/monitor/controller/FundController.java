package com.financialtransactions.monitor.controller;

import com.financialtransactions.monitor.model.dto.FundDto;
import com.financialtransactions.monitor.service.FundService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
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
    @Operation(summary = "Get all funds", description = "Retrieve a list of all funds")
    @ApiResponse(responseCode = "200", description = "Successfully retrieved funds")
    public ResponseEntity<List<FundDto>> getAllFunds() {
        List<FundDto> fundsDto = fundService.getAllFunds();
        return ResponseEntity.ok(fundsDto);
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get fund by ID", description = "Retrieve a specific fund by its ID")
    @ApiResponse(responseCode = "200", description = "Fund found")
    @ApiResponse(responseCode = "404", description = "Fund not found")
    public ResponseEntity<FundDto> getFundById(
            @Parameter(description = "Fund ID") @PathVariable Long id) {
        return fundService.getFundById(id)
                .map(fundDto -> ResponseEntity.ok().body(fundDto))
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/symbol/{symbol}")
    @Operation(summary = "Get fund by symbol", description = "Retrieve a specific fund by its symbol")
    @ApiResponse(responseCode = "200", description = "Fund found")
    @ApiResponse(responseCode = "404", description = "Fund not found")
    public ResponseEntity<FundDto> getFundBySymbol(
            @Parameter(description = "Fund symbol") @PathVariable String symbol) {
        return fundService.getFundBySymbol(symbol)
                .map(fundDto -> ResponseEntity.ok().body(fundDto))
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/currency/{currency}")
    @Operation(summary = "Get funds by currency", description = "Retrieve funds filtered by currency")
    @ApiResponse(responseCode = "200", description = "Successfully retrieved funds")
    public ResponseEntity<List<FundDto>> getFundsByCurrency(
            @Parameter(description = "Currency code") @PathVariable String currency) {
        List<FundDto> fundsDto = fundService.getFundsByCurrency(currency);
        return ResponseEntity.ok(fundsDto);
    }

    @PostMapping
    @Operation(summary = "Create new fund", description = "Create a new fund")
    @ApiResponse(responseCode = "201", description = "Fund created successfully")
    @ApiResponse(responseCode = "400", description = "Invalid input or fund already exists")
    public ResponseEntity<FundDto> createFund(@Valid @RequestBody FundDto fundDto) {
        try {
            FundDto createdFund = fundService.saveFund(fundDto);
            return ResponseEntity.status(HttpStatus.CREATED).body(createdFund);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().build();
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.CONFLICT).build();
        }
    }

    @PutMapping("/{id}")
    @Operation(summary = "Update fund", description = "Update an existing fund")
    @ApiResponse(responseCode = "200", description = "Fund updated successfully")
    @ApiResponse(responseCode = "404", description = "Fund not found")
    @ApiResponse(responseCode = "400", description = "Invalid input")
    public ResponseEntity<FundDto> updateFund(
            @Parameter(description = "Fund ID") @PathVariable Long id,
            @Valid @RequestBody FundDto fundDto) {
        try {
            FundDto updatedFund = fundService.updateFund(id, fundDto);
            return ResponseEntity.ok(updatedFund);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().build();
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @PutMapping("/{id}/price")
    @Operation(summary = "Update fund price", description = "Update fund price from external API")
    @ApiResponse(responseCode = "200", description = "Price updated successfully")
    @ApiResponse(responseCode = "404", description = "Fund not found")
    @ApiResponse(responseCode = "500", description = "External API error")
    public ResponseEntity<FundDto> updateFundPrice(
            @Parameter(description = "Fund ID") @PathVariable Long id) {
        try {
            FundDto updatedFundDto = fundService.updateFundPrice(id);
            return ResponseEntity.ok(updatedFundDto);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.notFound().build();
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Delete fund", description = "Delete a fund by ID")
    @ApiResponse(responseCode = "204", description = "Fund deleted successfully")
    @ApiResponse(responseCode = "404", description = "Fund not found")
    public ResponseEntity<Void> deleteFund(
            @Parameter(description = "Fund ID") @PathVariable Long id) {
        try {
            fundService.deleteFund(id);
            return ResponseEntity.noContent().build();
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }
}