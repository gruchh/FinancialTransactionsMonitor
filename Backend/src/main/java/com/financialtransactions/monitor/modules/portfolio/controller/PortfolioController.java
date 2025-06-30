package com.financialtransactions.monitor.modules.portfolio.controller;

import com.financialtransactions.monitor.modules.trade.dto.TradeWithCurrencyDto;
import com.financialtransactions.monitor.modules.trade.service.TradeService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
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
@RequestMapping("/api/portfolio")
@CrossOrigin(origins = "*")
@Tag(name = "Portfolios", description = "API for managing portfolio-related trade operations")
@PreAuthorize("hasRole('TRADER')")
public class PortfolioController {

    private final TradeService tradeService;

    @GetMapping("/{portfolioId}/trades")
    @Operation(summary = "Get trades by portfolio ID with currency information")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Successfully retrieved trades"),
            @ApiResponse(responseCode = "401", description = "Unauthorized"),
            @ApiResponse(responseCode = "403", description = "Forbidden - Access denied to portfolio"),
            @ApiResponse(responseCode = "404", description = "Portfolio not found")
    })
    public ResponseEntity<List<TradeWithCurrencyDto>> getTradesByPortfolioId(
            @Parameter(description = "Portfolio ID", required = true)
            @PathVariable Long portfolioId) {
        try {
            List<TradeWithCurrencyDto> trades = tradeService.getTradesByPortfolioId(portfolioId);
            return ResponseEntity.ok(trades);
        } catch (ResponseStatusException e) {
            throw e;
        } catch (Exception e) {
            log.error("Error getting trades for portfolio {}: ", portfolioId, e);
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Internal server error");
        }
    }


}