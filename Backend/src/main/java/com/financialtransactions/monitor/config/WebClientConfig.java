package com.financialtransactions.monitor.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.reactive.function.client.ExchangeStrategies;
import org.springframework.web.reactive.function.client.WebClient;

@Configuration
public class WebClientConfig {

    @Bean
    public WebClient nbpWebClient() {
        return WebClient.builder()
                .baseUrl("https://api.nbp.pl/api/exchangerates/rates/a")
                .exchangeStrategies(ExchangeStrategies.builder()
                        .codecs(configurer -> configurer.defaultCodecs().maxInMemorySize(1024 * 1024))
                        .build())
                .defaultHeader("Accept", "application/json")
                .build();
    }
}