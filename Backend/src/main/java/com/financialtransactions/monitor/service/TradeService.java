package com.financialtransactions.monitor.service;

import com.financialtransactions.monitor.mapper.FundMapper;
import com.financialtransactions.monitor.mapper.TradeMapper;
import com.financialtransactions.monitor.model.Fund;
import com.financialtransactions.monitor.model.Trade;
import com.financialtransactions.monitor.model.dto.FundDto;
import com.financialtransactions.monitor.model.dto.TradeDto;
import com.financialtransactions.monitor.repository.FundRepository;
import com.financialtransactions.monitor.repository.TradeRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@RequiredArgsConstructor
@Service
public class TradeService {

    private final TradeRepository tradeRepository;
    private final ExternalApiService externalApiService;
    private final TradeMapper tradeMapper;
    private final FundMapper fundMapper;

    public List<TradeDto> getAllTrades() {
        return tradeMapper.toDtoList(tradeRepository.findAllOrderByTradeDateDesc());
    }

    public Optional<TradeDto> getTradeById(Long id) {
        return tradeRepository.findById(id)
                .map(tradeMapper::toDto);
    }

    public List<TradeDto> getTradesByFund(Long fundId) {
        return tradeMapper.toDtoList(tradeRepository.findByFundIdOrderByTradeDateDesc(fundId));
    }

    public TradeDto saveTrade(TradeDto tradeDto) {
        Trade trade = tradeMapper.toEntity(tradeDto);

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
        Trade trade = tradeRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Trade not found with id " + id));

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
        tradeRepository.deleteById(id);
    }

    public List<FundDto> getPortfolioFunds() {
        return fundMapper.toDtoList(tradeRepository.findDistinctFunds());
    }
}
