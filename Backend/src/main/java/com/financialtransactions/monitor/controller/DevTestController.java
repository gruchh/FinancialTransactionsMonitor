package com.financialtransactions.monitor.controller;

import com.financialtransactions.monitor.service.ExternalApiService;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Profile;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

@Profile("dev")
@RequiredArgsConstructor
@RestController
@RequestMapping("/api/dev")
public class DevTestController {

    private final ExternalApiService externalApiService;

    @GetMapping("/currency/eur-pln")
    public ResponseEntity<Map<String, Object>> getEurPlnRate() {
        BigDecimal rate = externalApiService.getEurPlnRate();

        Map<String, Object> response = new HashMap<>();
        response.put("currency_pair", "EUR/PLN");
        response.put("rate", rate);
        response.put("timestamp", LocalDateTime.now());

        return ResponseEntity.ok(response);
    }

    @GetMapping("/currency/usd-pln")
    public ResponseEntity<Map<String, Object>> getUsdPlnRate() {
        BigDecimal rate = externalApiService.getUsdPlnRate();

        Map<String, Object> response = new HashMap<>();
        response.put("currency_pair", "USD/PLN");
        response.put("rate", rate);
        response.put("timestamp", LocalDateTime.now());

        return ResponseEntity.ok(response);
    }

    @GetMapping("/currency/all")
    public ResponseEntity<Map<String, Object>> getAllCurrencyRates() {
        BigDecimal eurRate = externalApiService.getEurPlnRate();
        BigDecimal usdRate = externalApiService.getUsdPlnRate();

        Map<String, BigDecimal> rates = new HashMap<>();
        rates.put("EUR/PLN", eurRate);
        rates.put("USD/PLN", usdRate);

        Map<String, Object> response = new HashMap<>();
        response.put("rates", rates);
        response.put("timestamp", LocalDateTime.now());

        return ResponseEntity.ok(response);
    }

    @GetMapping("/fund/{symbol}")
    public ResponseEntity<Map<String, Object>> getFundPrice(@PathVariable String symbol) {
        BigDecimal price = externalApiService.getFundPrice(symbol);

        Map<String, Object> response = new HashMap<>();
        response.put("symbol", symbol.toUpperCase());
        response.put("price", price);
        response.put("timestamp", LocalDateTime.now());

        return ResponseEntity.ok(response);
    }

    @GetMapping("/test/multiple-funds")
    public ResponseEntity<Map<String, Object>> getMultipleFundPrices() {
        String[] testSymbols = {"AAPL", "GOOGL", "MSFT", "AMZN"};
        Map<String, BigDecimal> prices = new HashMap<>();

        for (String symbol : testSymbols) {
            prices.put(symbol, externalApiService.getFundPrice(symbol));
        }

        Map<String, Object> response = new HashMap<>();
        response.put("fund_prices", prices);
        response.put("timestamp", LocalDateTime.now());

        return ResponseEntity.ok(response);
    }

    @GetMapping("/health")
    public ResponseEntity<Map<String, Object>> healthCheck() {
        Map<String, Object> response = new HashMap<>();
        response.put("status", "OK");
        response.put("service", "ExternalApiService Test Controller");
        response.put("profile", "dev");
        response.put("timestamp", LocalDateTime.now());

        return ResponseEntity.ok(response);
    }
}