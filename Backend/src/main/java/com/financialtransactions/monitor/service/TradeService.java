package com.financialtransactions.monitor.service;

import com.financialtransactions.monitor.model.Fund;
import com.financialtransactions.monitor.model.Trade;
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
    private final FundRepository fundRepository;
    private final ExternalApiService externalApiService;

    public List<Trade> getAllTrades() {
        return tradeRepository.findAllOrderByTradeDateDesc();
    }

    public Optional<Trade> getTradeById(Long id) {
        return tradeRepository.findById(id);
    }

    public List<Trade> getTradesByFund(Long fundId) {
        return tradeRepository.findByFundIdOrderByTradeDateDesc(fundId);
    }

    public Trade saveTrade(Trade trade) {
        // Get current exchange rates
        trade.setEurPlnRate(externalApiService.getEurPlnRate());
        trade.setUsdPlnRate(externalApiService.getUsdPlnRate());

        // Calculate total value in PLN
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

        return tradeRepository.save(trade);
    }

    public Trade updateTrade(Long id, Trade tradeDetails) {
        Trade trade = tradeRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Trade not found with id " + id));

        trade.setTradeDate(tradeDetails.getTradeDate());
        trade.setType(tradeDetails.getType());
        trade.setQuantity(tradeDetails.getQuantity());
        trade.setPricePerUnit(tradeDetails.getPricePerUnit());

        // Recalculate PLN value
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

        return tradeRepository.save(trade);
    }

    public void deleteTrade(Long id) {
        tradeRepository.deleteById(id);
    }

    public List<Fund> getPortfolioFunds() {
        return tradeRepository.findDistinctFunds();
    }
}
