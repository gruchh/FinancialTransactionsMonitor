package com.financialtransactions.monitor.controller;

import com.financialtransactions.monitor.model.Fund;
import com.financialtransactions.monitor.service.ExternalApiService;
import com.financialtransactions.monitor.service.TradeService;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.math.BigDecimal;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RequiredArgsConstructor
@RestController
@RequestMapping("/api/portfolio")
@CrossOrigin(origins = "*")
@Tag(name = "Portfolio", description = "API for managing portfolio-related operations")
public class PortfolioController {

    private final TradeService tradeService;
    private final ExternalApiService externalApiService;

    @GetMapping("/funds")
    public List<Fund> getPortfolioFunds() {
        return tradeService.getPortfolioFunds();
    }

    @GetMapping("/rates")
    public Map<String, BigDecimal> getCurrentRates() {
        Map<String, BigDecimal> rates = new HashMap<>();
        rates.put("EUR_PLN", externalApiService.getEurPlnRate());
        rates.put("USD_PLN", externalApiService.getUsdPlnRate());
        return rates;
    }
}