package com.financialtransactions.monitor.service;

import com.financialtransactions.monitor.mapper.FundMapper;
import com.financialtransactions.monitor.mapper.TradeMapper;
import com.financialtransactions.monitor.model.Fund;
import com.financialtransactions.monitor.model.Trade;
import com.financialtransactions.monitor.model.dto.FundDto;
import com.financialtransactions.monitor.model.dto.TradeDto;
import com.financialtransactions.monitor.repository.TradeRepository;
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
    private final ExternalApiService externalApiService;
    private final TradeMapper tradeMapper;
    private final FundMapper fundMapper;

    /**
     * Pobiera aktualnie zalogowanego użytkownika z kontekstu Spring Security
     */
    private String getCurrentUsername() {
        return SecurityContextHolder.getContext()
                .getAuthentication()
                .getName();
    }

    public List<Trade> getCurrentUserTrades() {
        return tradeRepository.findByOwnerUsernameOrderByTradeDateDesc(getCurrentUsername());
    }

    public List<Trade> getCurrentUserTradesByFund(Fund fund) {
        return tradeRepository.findByFundAndOwnerUsernameOrderByTradeDateDesc(fund, getCurrentUsername());
    }

    public List<Trade> getCurrentUserTradesByFundId(Long fundId) {
        return tradeRepository.findByFundIdAndOwnerUsernameOrderByTradeDateDesc(fundId, getCurrentUsername());
    }

    public List<Fund> getCurrentUserFunds() {
        return tradeRepository.findDistinctFundsByOwnerUsername(getCurrentUsername());
    }

    public Trade getTradeById(Long tradeId) {
        return tradeRepository.findByIdAndOwnerUsername(tradeId, getCurrentUsername())
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "Trade not found or access denied"));
    }

    public TradeDto saveTrade(TradeDto tradeDto) {
        Trade trade = tradeMapper.toEntity(tradeDto);

        trade.setOwnerUsername(getCurrentUsername());

        trade.setEurPlnRate(externalApiService.getEurPlnRate());
        trade.setUsdPlnRate(externalApiService.getUsdPlnRate());

        BigDecimal totalValue = trade.getPricePerUnit().multiply(trade.getQuantity());
        BigDecimal exchangeRate = BigDecimal.ONE;

        Fund fund = trade.getFund();
        if ("EUR".equals(fund.getCurrency())) {
            exchangeRate = trade.getEurPlnRate();
        } else if ("USD".equals(fund.getCurrency())) {
            exchangeRate = trade.getUsdPlnRate();
        }

        trade.setTotalValuePln(totalValue.multiply(exchangeRate));
        trade.setCreatedAt(LocalDateTime.now());
        trade.setUpdatedAt(LocalDateTime.now());

        Trade savedTrade = tradeRepository.save(trade);
        return tradeMapper.toDto(savedTrade);
    }

    public TradeDto updateTrade(Long id, TradeDto tradeDto) {
        Trade trade = getTradeById(id);
        trade.setTradeDate(tradeDto.getTradeDate());
        trade.setType(tradeDto.getType());
        trade.setQuantity(tradeDto.getQuantity());
        trade.setPricePerUnit(tradeDto.getPricePerUnit());

        BigDecimal totalValue = trade.getPricePerUnit().multiply(trade.getQuantity());
        BigDecimal exchangeRate = BigDecimal.ONE;

        Fund fund = trade.getFund();
        if ("EUR".equals(fund.getCurrency())) {
            exchangeRate = trade.getEurPlnRate();
        } else if ("USD".equals(fund.getCurrency())) {
            exchangeRate = trade.getUsdPlnRate();
        }

        trade.setTotalValuePln(totalValue.multiply(exchangeRate));
        trade.setUpdatedAt(LocalDateTime.now());

        Trade updatedTrade = tradeRepository.save(trade);
        return tradeMapper.toDto(updatedTrade);
    }

    public void deleteTrade(Long id) {
        String currentUsername = getCurrentUsername();
        Trade trade = tradeRepository.findByIdAndOwnerUsername(id, currentUsername)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "Trade not found or access denied"));

        tradeRepository.delete(trade);
    }

    public List<FundDto> getPortfolioFunds() {
        return fundMapper.toDtoList(getCurrentUserFunds());
    }
}