package com.financialtransactions.monitor.modules.trade.service;

import com.financialtransactions.monitor.domain.entity.Fund;
import com.financialtransactions.monitor.domain.entity.Portfolio;
import com.financialtransactions.monitor.domain.entity.Trade;
import com.financialtransactions.monitor.domain.enums.CurrencyType;
import com.financialtransactions.monitor.modules.fund.repository.FundRepository;
import com.financialtransactions.monitor.modules.portfolio.repository.PortfolioRepository;
import com.financialtransactions.monitor.modules.trade.dto.TradeWithCurrencyDto;
import com.financialtransactions.monitor.modules.trade.repository.TradeRepository;
import com.financialtransactions.monitor.security.model.User;
import com.financialtransactions.monitor.security.repository.UserRepository;
import com.financialtransactions.monitor.service.external.CurrencyExchangeService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.List;

@Slf4j
@RequiredArgsConstructor
@Service
@Transactional
public class TradeService {

    private final TradeRepository tradeRepository;
    private final UserRepository userRepository;
    private final PortfolioRepository portfolioRepository;
    private final FundRepository fundRepository;
    private final CurrencyExchangeService currencyExchangeService;

    private String getCurrentUsername() {
        return SecurityContextHolder.getContext()
                .getAuthentication()
                .getName();
    }

    private User getCurrentUser() {
        return userRepository.findByUsername(getCurrentUsername())
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.UNAUTHORIZED, "User not found"));
    }

    @Transactional(readOnly = true)
    public List<TradeWithCurrencyDto> getAllTradesWithCurrency() {
        User currentUser = getCurrentUser();
        log.info("Getting all trades for user: {}", currentUser.getUsername());
        return tradeRepository.findAllTradesWithCurrencyByUserId(currentUser.getId());
    }

    @Transactional(readOnly = true)
    public List<TradeWithCurrencyDto> getTradesByPortfolioId(Long portfolioId) {
        User currentUser = getCurrentUser();
        Portfolio portfolio = portfolioRepository.findById(portfolioId)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND, "Portfolio not found"));
        if (!portfolio.getUser().getId().equals(currentUser.getId())) {
            throw new ResponseStatusException(
                    HttpStatus.FORBIDDEN, "Access denied to this portfolio");
        }
        return tradeRepository.findAllTradesWithCurrencyByPortfolioId(portfolioId);
    }

    @Transactional(readOnly = true)
    public Trade getTradeById(Long id) {
        User currentUser = getCurrentUser();
        Trade trade = tradeRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND, "Trade not found with id: " + id));
        if (!trade.getPortfolio().getUser().getId().equals(currentUser.getId())) {
            throw new ResponseStatusException(
                    HttpStatus.FORBIDDEN, "Access denied to this trade");
        }
        return trade;
    }

    public Trade createTrade(Trade trade) {
        User currentUser = getCurrentUser();
        Portfolio portfolio = portfolioRepository.findById(trade.getPortfolio().getId())
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND, "Portfolio not found"));
        if (!portfolio.getUser().getId().equals(currentUser.getId())) {
            throw new ResponseStatusException(
                    HttpStatus.FORBIDDEN, "Access denied to this portfolio");
        }
        Fund fund = fundRepository.findById(trade.getFund().getId())
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND, "Fund not found"));

        try {
            BigDecimal eurRate = currencyExchangeService.getEurPlnRate(trade.getTradeDate());
            BigDecimal usdRate = currencyExchangeService.getUsdPlnRate(trade.getTradeDate());

            trade.setEurPlnRate(eurRate);
            trade.setUsdPlnRate(usdRate);

            BigDecimal totalValuePln = calculateTotalValueInPln(
                    trade.getQuantity(),
                    trade.getPricePerUnit(),
                    fund.getCurrencyType(),
                    eurRate,
                    usdRate
            );
            trade.setTotalValuePln(totalValuePln);

        } catch (Exception e) {
            log.error("Error fetching exchange rates for trade date {}: {}", trade.getTradeDate(), e.getMessage());
            throw new ResponseStatusException(
                    HttpStatus.SERVICE_UNAVAILABLE,
                    "Unable to fetch exchange rates for trade date");
        }

        trade.setPortfolio(portfolio);
        trade.setFund(fund);

        log.info("Creating new trade for user: {}, portfolio: {} and fund: {}",
                currentUser.getUsername(), portfolio.getName(), fund.getName());
        return tradeRepository.save(trade);
    }

    private BigDecimal calculateTotalValueInPln(BigDecimal quantity, BigDecimal pricePerUnit,
                                                CurrencyType currencyType, BigDecimal eurRate, BigDecimal usdRate) {
        BigDecimal totalValue = quantity.multiply(pricePerUnit);

        switch (currencyType) {
            case PLN:
                return totalValue.setScale(2, RoundingMode.HALF_EVEN);
            case EUR:
                return totalValue.multiply(eurRate).setScale(2, RoundingMode.HALF_EVEN);
            case USD:
                return totalValue.multiply(usdRate).setScale(2, RoundingMode.HALF_EVEN);
            default:
                throw new IllegalArgumentException("Unsupported currency type: " + currencyType);
        }
    }
}