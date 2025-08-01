package com.financialtransactions.monitor.modules.trade.controller;

import com.financialtransactions.monitor.domain.entity.Trade;
import com.financialtransactions.monitor.modules.trade.dto.CreateTradeDto;
import com.financialtransactions.monitor.modules.trade.dto.TradeWithCurrencyDto;
import com.financialtransactions.monitor.modules.trade.service.TradeService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

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
    @Operation(summary = "Get all trades with currency information for current user")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Successfully retrieved trades"),
            @ApiResponse(responseCode = "401", description = "Unauthorized"),
            @ApiResponse(responseCode = "403", description = "Forbidden")
    })
    public ResponseEntity<List<TradeWithCurrencyDto>> getAllTradesWithCurrency() {
        try {
            List<TradeWithCurrencyDto> trades = tradeService.getAllTradesWithCurrency();
            return ResponseEntity.ok(trades);
        } catch (ResponseStatusException e) {
            throw e;
        } catch (Exception e) {
            log.error("Error getting all trades: ", e);
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Internal server error");
        }
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get trade by ID")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Successfully retrieved trade"),
            @ApiResponse(responseCode = "401", description = "Unauthorized"),
            @ApiResponse(responseCode = "403", description = "Forbidden - Access denied to trade"),
            @ApiResponse(responseCode = "404", description = "Trade not found")
    })
    public ResponseEntity<Trade> getTradeById(
            @Parameter(description = "Trade ID", required = true)
            @PathVariable Long id) {
        try {
            Trade trade = tradeService.getTradeById(id);
            return ResponseEntity.ok(trade);
        } catch (ResponseStatusException e) {
            throw e;
        } catch (Exception e) {
            log.error("Error getting trade {}: ", id, e);
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Internal server error");
        }
    }


    @PostMapping
    @Operation(summary = "Create new trade")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "201", description = "Trade created successfully"),
            @ApiResponse(responseCode = "400", description = "Invalid trade data"),
            @ApiResponse(responseCode = "401", description = "Unauthorized"),
            @ApiResponse(responseCode = "403", description = "Forbidden - Access denied to portfolio"),
            @ApiResponse(responseCode = "404", description = "Portfolio or Fund not found")
    })
    public ResponseEntity<Trade> createTrade(
            @Parameter(description = "Trade creation data", required = true)
            @Valid @RequestBody CreateTradeDto createTradeDto) {
        try {
            Trade createdTrade = tradeService.createTrade(createTradeDto);
            return ResponseEntity.status(HttpStatus.CREATED).body(createdTrade);
        } catch (ResponseStatusException e) {
            throw e;
        } catch (Exception e) {
            log.error("Error creating trade: ", e);
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Internal server error");
        }
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Delete trade by ID")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "204", description = "Trade deleted successfully"),
            @ApiResponse(responseCode = "401", description = "Unauthorized"),
            @ApiResponse(responseCode = "403", description = "Forbidden - Access denied to trade"),
            @ApiResponse(responseCode = "404", description = "Trade not found"),
            @ApiResponse(responseCode = "500", description = "Internal server error")
    })
    public ResponseEntity<Void> deleteTrade(
            @Parameter(description = "Trade ID", required = true)
            @PathVariable Long id) {

        if (id == null || id <= 0) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Invalid trade ID");
        }

        tradeService.deleteTrade(id);
        log.info("Trade with id {} deleted successfully", id);
        return ResponseEntity.noContent().build();
    }
}