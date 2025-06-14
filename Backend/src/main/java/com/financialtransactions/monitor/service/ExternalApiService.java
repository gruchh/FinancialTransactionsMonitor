package com.financialtransactions.monitor.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@RequiredArgsConstructor
@Service
public class ExternalApiService {

    private final WebClient webClient;
    private final ObjectMapper objectMapper;
    private final Map<String, BigDecimal> currencyCache = new ConcurrentHashMap<>();
    private final Map<String, BigDecimal> priceCache = new ConcurrentHashMap<>();
    private LocalDateTime lastCurrencyUpdate = LocalDateTime.now().minusHours(1);
    private LocalDateTime lastPriceUpdate = LocalDateTime.now().minusMinutes(10);

    public BigDecimal getEurPlnRate() {
        if (shouldUpdateCurrency()) {
            updateCurrencyRates();
        }
        return currencyCache.getOrDefault("EUR_PLN", BigDecimal.valueOf(4.30));
    }

    public BigDecimal getUsdPlnRate() {
        if (shouldUpdateCurrency()) {
            updateCurrencyRates();
        }
        return currencyCache.getOrDefault("USD_PLN", BigDecimal.valueOf(4.00));
    }

    public BigDecimal getFundPrice(String symbol) {
        String cacheKey = symbol.toUpperCase();
        if (shouldUpdatePrice()) {
            updateFundPrice(symbol);
        }
        return priceCache.getOrDefault(cacheKey, BigDecimal.valueOf(100.0));
    }

    private boolean shouldUpdateCurrency() {
        return lastCurrencyUpdate.isBefore(LocalDateTime.now().minusHours(1));
    }

    private boolean shouldUpdatePrice() {
        return lastPriceUpdate.isBefore(LocalDateTime.now().minusMinutes(5));
    }

    private void updateCurrencyRates() {
        try {
            String nbpUrl = "https://api.nbp.pl/api/exchangerates/tables/A?format=json";
            String response = webClient.get()
                    .uri(nbpUrl)
                    .retrieve()
                    .bodyToMono(String.class)
                    .block();

            JsonNode jsonNode = objectMapper.readTree(response);
            JsonNode rates = jsonNode.get(0).get("rates");

            for (JsonNode rate : rates) {
                String code = rate.get("code").asText();
                BigDecimal mid = BigDecimal.valueOf(rate.get("mid").asDouble());

                if ("EUR".equals(code)) {
                    currencyCache.put("EUR_PLN", mid);
                } else if ("USD".equals(code)) {
                    currencyCache.put("USD_PLN", mid);
                }
            }
            lastCurrencyUpdate = LocalDateTime.now();
        } catch (Exception e) {
            currencyCache.put("EUR_PLN", BigDecimal.valueOf(4.30));
            currencyCache.put("USD_PLN", BigDecimal.valueOf(4.00));
        }
    }

    private void updateFundPrice(String symbol) {
        try {
            BigDecimal mockPrice = BigDecimal.valueOf(Math.random() * 200 + 50);
            priceCache.put(symbol.toUpperCase(), mockPrice);
            lastPriceUpdate = LocalDateTime.now();
        } catch (Exception e) {
            priceCache.put(symbol.toUpperCase(), BigDecimal.valueOf(100.0));
        }
    }
}