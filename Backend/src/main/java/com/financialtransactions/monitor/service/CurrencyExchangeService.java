package com.financialtransactions.monitor.service;

import com.financialtransactions.monitor.model.dto.NbpExchangeRateResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import org.springframework.web.reactive.function.client.WebClientResponseException;
import org.springframework.web.server.ResponseStatusException;
import reactor.util.retry.Retry;

import java.math.BigDecimal;
import java.time.Duration;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;

@Slf4j
@RequiredArgsConstructor
@Service
public class CurrencyExchangeService {

    private final WebClient nbpWebClient;
    private static final DateTimeFormatter DATE_FORMATTER = DateTimeFormatter.ofPattern("yyyy-MM-dd");

    public BigDecimal getExchangeRate(String currencyCode, LocalDate date) {
        log.info("Fetching exchange rate for {} on {}", currencyCode, date);

        String formattedDate = date.format(DATE_FORMATTER);
        String url = String.format("/%s/%s", currencyCode.toLowerCase(), formattedDate);

        try {
            NbpExchangeRateResponse response = nbpWebClient
                    .get()
                    .uri(url)
                    .retrieve()
                    .bodyToMono(NbpExchangeRateResponse.class)
                    .retryWhen(Retry.backoff(3, Duration.ofSeconds(1))
                            .filter(throwable -> throwable instanceof WebClientResponseException &&
                                    ((WebClientResponseException) throwable).getStatusCode().is5xxServerError()))
                    .timeout(Duration.ofSeconds(10))
                    .block();

            if (response != null && response.getRates() != null && !response.getRates().isEmpty()) {
                BigDecimal rate = response.getRates().get(0).getMid();
                log.info("Retrieved exchange rate for {}: {}", currencyCode, rate);
                return rate;
            } else {
                log.warn("No exchange rate data found for {} on {}", currencyCode, date);
                throw new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "Exchange rate not found for " + currencyCode + " on " + date);
            }
        } catch (WebClientResponseException e) {
            log.error("Error fetching exchange rate for {} on {}: {}", currencyCode, date, e.getMessage());
            if (e.getStatusCode() == HttpStatus.NOT_FOUND) {
                return getExchangeRateForPreviousWorkingDay(currencyCode, date);
            }
            throw new ResponseStatusException(
                    HttpStatus.SERVICE_UNAVAILABLE,
                    "Unable to fetch exchange rate from NBP API");
        } catch (Exception e) {
            log.error("Unexpected error fetching exchange rate for {} on {}: {}", currencyCode, date, e.getMessage());
            throw new ResponseStatusException(
                    HttpStatus.INTERNAL_SERVER_ERROR,
                    "Error processing exchange rate request");
        }
    }

    private BigDecimal getExchangeRateForPreviousWorkingDay(String currencyCode, LocalDate date) {
        LocalDate previousDay = date.minusDays(1);
        int attempts = 0;

        while (attempts < 7) {
            try {
                return getExchangeRate(currencyCode, previousDay);
            } catch (ResponseStatusException e) {
                if (e.getStatusCode() != HttpStatus.NOT_FOUND) {
                    throw e;
                }
                previousDay = previousDay.minusDays(1);
                attempts++;
            }
        }

        throw new ResponseStatusException(
                HttpStatus.NOT_FOUND,
                "No exchange rate found for " + currencyCode + " within the last week");
    }

    public BigDecimal getEurPlnRate(LocalDate date) {
        return getExchangeRate("EUR", date);
    }

    public BigDecimal getUsdPlnRate(LocalDate date) {
        return getExchangeRate("USD", date);
    }
}