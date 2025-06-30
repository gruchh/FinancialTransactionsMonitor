package com.financialtransactions.monitor.modules.portfolio.service;

import com.financialtransactions.monitor.domain.entity.Portfolio;
import com.financialtransactions.monitor.domain.enums.CurrencyType;
import com.financialtransactions.monitor.modules.portfolio.repository.PortfolioRepository;
import com.financialtransactions.monitor.security.model.User;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

@Slf4j
@RequiredArgsConstructor
@Service
@Transactional
public class PortfolioService {

    private final PortfolioRepository portfolioRepository;

    @Transactional(readOnly = true)
    public Optional<Portfolio> findByUserAndCurrency(User user, CurrencyType currencyType) {
        return portfolioRepository.findByUserAndCurrency(user, currencyType);
    }

    public Portfolio findOrCreatePortfolio(User user, CurrencyType currencyType) {
        Optional<Portfolio> existingPortfolio = portfolioRepository.findByUserAndCurrency(user, currencyType);

        if (existingPortfolio.isPresent()) {
            log.info("Found existing {} portfolio for user: {}", currencyType, user.getUsername());
            return existingPortfolio.get();
        }

        log.info("Creating new {} portfolio for user: {}", currencyType, user.getUsername());

        Portfolio newPortfolio = Portfolio.builder()
                .user(user)
                .currency(currencyType)
                .name(generatePortfolioName(currencyType))
                .description(generatePortfolioDescription(currencyType))
                .isActive(true)
                .build();

        return portfolioRepository.save(newPortfolio);
    }

    private String generatePortfolioName(CurrencyType currencyType) {
        switch (currencyType) {
            case PLN:
                return "Portfolio PLN";
            case USD:
                return "Portfolio USD";
            case EUR:
                return "Portfolio EUR";
            default:
                return "Portfolio " + currencyType.name();
        }
    }

    private String generatePortfolioDescription(CurrencyType currencyType) {
        switch (currencyType) {
            case PLN:
                return "Automatycznie utworzone portfolio dla inwestycji w złotych polskich";
            case USD:
                return "Automatycznie utworzone portfolio dla inwestycji w dolarach amerykańskich";
            case EUR:
                return "Automatycznie utworzone portfolio dla inwestycji w euro";
            default:
                return "Automatycznie utworzone portfolio dla waluty " + currencyType.name();
        }
    }
}