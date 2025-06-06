package com.financialtransactions.monitor.service;

import com.financialtransactions.monitor.model.Fund;
import com.financialtransactions.monitor.repository.FundRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@RequiredArgsConstructor
@Service
public class FundService {

    private final FundRepository fundRepository;
    private final ExternalApiService externalApiService;

    public List<Fund> getAllFunds() {
        return fundRepository.findAll();
    }

    public Optional<Fund> getFundById(Long id) {
        return fundRepository.findById(id);
    }

    public Optional<Fund> getFundBySymbol(String symbol) {
        return fundRepository.findBySymbol(symbol);
    }

    public Fund saveFund(Fund fund) {
        if (fundRepository.existsBySymbol(fund.getSymbol())) {
            throw new RuntimeException("Fund with symbol " + fund.getSymbol() + " already exists");
        }
        return fundRepository.save(fund);
    }

    public Fund updateFund(Long id, Fund fundDetails) {
        Fund fund = fundRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Fund not found with id " + id));

        fund.setName(fundDetails.getName());
        fund.setCurrency(fundDetails.getCurrency());
        fund.setMarket(fundDetails.getMarket());
        fund.setSector(fundDetails.getSector());

        return fundRepository.save(fund);
    }

    public void deleteFund(Long id) {
        fundRepository.deleteById(id);
    }

    public Fund updateFundPrice(Long id) {
        Fund fund = fundRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Fund not found with id " + id));

        fund.setCurrentPrice(externalApiService.getFundPrice(fund.getSymbol()));
        fund.setLastUpdated(LocalDateTime.now());

        return fundRepository.save(fund);
    }
}