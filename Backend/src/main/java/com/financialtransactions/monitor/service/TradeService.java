package com.financialtransactions.monitor.service;

import com.financialtransactions.monitor.mapper.FundMapper;
import com.financialtransactions.monitor.mapper.TradeMapper;
import com.financialtransactions.monitor.model.Fund;
import com.financialtransactions.monitor.model.Portfolio;
import com.financialtransactions.monitor.model.Trade;
import com.financialtransactions.monitor.model.dto.FundDto;
import com.financialtransactions.monitor.model.dto.TradeDto;
import com.financialtransactions.monitor.repository.PortfolioRepository;
import com.financialtransactions.monitor.repository.TradeRepository;
import com.financialtransactions.monitor.security.model.User;
import com.financialtransactions.monitor.security.repository.UserRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@RequiredArgsConstructor
@Service
public class TradeService {

    private final TradeRepository tradeRepository;
    private final PortfolioRepository portfolioRepository;
    private final UserRepository userRepository;
    private final ExternalApiService externalApiService;
    private final TradeMapper tradeMapper;
    private final FundMapper fundMapper;

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

    public List<Trade> getCurrentUserTrades() {
        User currentUser = getCurrentUser();
        return tradeRepository.findByPortfolioUserIdOrderByTradeDateDesc(currentUser.getId());
    }

    public List<Trade> getTradesByPortfolio(Long portfolioId) {
        User currentUser = getCurrentUser();
        Portfolio portfolio = portfolioRepository.findById(portfolioId)
                .filter(p -> p.getUser().getId().equals(currentUser.getId()))
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND, "Portfolio not found or access denied"));

        return tradeRepository.findByPortfolioIdOrderByTradeDateDesc(portfolioId);
    }

    public List<Trade> getCurrentUserTradesByFund(Fund fund) {
        User currentUser = getCurrentUser();
        return tradeRepository.findByFundAndPortfolioUserIdOrderByTradeDateDesc(fund, currentUser.getId());
    }

    public List<Trade> getCurrentUserTradesByFundId(Long fundId) {
        User currentUser = getCurrentUser();
        return tradeRepository.findByFundIdAndPortfolioUserIdOrderByTradeDateDesc(fundId, currentUser.getId());
    }

    public List<Fund> getCurrentUserFunds() {
        User currentUser = getCurrentUser();
        return tradeRepository.findDistinctFundsByPortfolioUserId(currentUser.getId());
    }

    public Trade getTradeById(Long tradeId) {
        User currentUser = getCurrentUser();
        return tradeRepository.findByIdAndPortfolioUserId(tradeId, currentUser.getId())
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "Trade not found or access denied"));
    }

    @Transactional
    public TradeDto saveTrade(TradeDto tradeDto) {
        User currentUser = getCurrentUser();
        Portfolio portfolio = portfolioRepository.findById(tradeDto.getPortfolio().getId())
                .filter(p -> p.getUser().getId().equals(currentUser.getId()))
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND, "Portfolio not found or access denied"));

        Trade trade = tradeMapper.toEntity(tradeDto);
        trade.setPortfolio(portfolio);

        trade.setEurPlnRate(externalApiService.getEurPlnRate());
        trade.setUsdPlnRate(externalApiService.getUsdPlnRate());
        calculateTradeValues(trade);
        trade.setCreatedAt(LocalDateTime.now());
        trade.setUpdatedAt(LocalDateTime.now());

        Trade savedTrade = tradeRepository.save(trade);
        return tradeMapper.toDto(savedTrade);
    }

    @Transactional
    public TradeDto updateTrade(Long id, TradeDto tradeDto) {
        Trade trade = getTradeById(id);

        trade.setTradeDate(tradeDto.getTradeDate());
        trade.setType(tradeDto.getType());
        trade.setQuantity(tradeDto.getQuantity());
        trade.setPricePerUnit(tradeDto.getPricePerUnit());
        calculateTradeValues(trade);
        trade.setUpdatedAt(LocalDateTime.now());

        Trade updatedTrade = tradeRepository.save(trade);
        return tradeMapper.toDto(updatedTrade);
    }

    @Transactional
    public void deleteTrade(Long id) {
        Trade trade = getTradeById(id);
        tradeRepository.delete(trade);
    }

    public List<FundDto> getPortfolioFunds() {
        return fundMapper.toDtoList(getCurrentUserFunds());
    }

    private void calculateTradeValues(Trade trade) {
        BigDecimal totalValue = trade.getPricePerUnit().multiply(trade.getQuantity());
        Fund fund = trade.getFund();
        Portfolio portfolio = trade.getPortfolio();

        BigDecimal exchangeRateToPln = BigDecimal.ONE;
        if ("EUR".equals(fund.getCurrency())) {
            exchangeRateToPln = trade.getEurPlnRate();
        } else if ("USD".equals(fund.getCurrency())) {
            exchangeRateToPln = trade.getUsdPlnRate();
        }

        trade.setTotalValuePln(totalValue.multiply(exchangeRateToPln));

        BigDecimal exchangeRateToPortfolioCurrency = BigDecimal.ONE;

        if (!fund.getCurrency().equals(portfolio.getCurrency().name())) {
            if ("PLN".equals(portfolio.getCurrency().name())) {
                exchangeRateToPortfolioCurrency = exchangeRateToPln;
            } else if ("EUR".equals(portfolio.getCurrency().name())) {
                if ("USD".equals(fund.getCurrency())) {
                    exchangeRateToPortfolioCurrency = trade.getUsdPlnRate().divide(trade.getEurPlnRate(), 4, BigDecimal.ROUND_HALF_UP);
                } else if ("PLN".equals(fund.getCurrency())) {
                    exchangeRateToPortfolioCurrency = BigDecimal.ONE.divide(trade.getEurPlnRate(), 4, BigDecimal.ROUND_HALF_UP);
                }
            } else if ("USD".equals(portfolio.getCurrency().name())) {
                if ("EUR".equals(fund.getCurrency())) {
                    exchangeRateToPortfolioCurrency = trade.getEurPlnRate().divide(trade.getUsdPlnRate(), 4, BigDecimal.ROUND_HALF_UP);
                } else if ("PLN".equals(fund.getCurrency())) {
                    exchangeRateToPortfolioCurrency = BigDecimal.ONE.divide(trade.getUsdPlnRate(), 4, BigDecimal.ROUND_HALF_UP);
                }
            }
        }

        trade.setTotalValuePortfolioCurrency(totalValue.multiply(exchangeRateToPortfolioCurrency));
    }
}