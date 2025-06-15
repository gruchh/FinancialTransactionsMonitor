package com.financialtransactions.monitor.service;

import com.financialtransactions.monitor.mapper.FundMapper;
import com.financialtransactions.monitor.model.Fund;
import com.financialtransactions.monitor.model.dto.FundDto;
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
    private final FundMapper fundMapper;

    public List<FundDto> getAllFunds() {
        return fundMapper.toDtoList(fundRepository.findAll());
    }

    public Optional<FundDto> getFundById(Long id) {
        return fundRepository.findById(id)
                .map(fundMapper::toDto);
    }

    public Optional<FundDto> getFundBySymbol(String symbol) {
        return fundRepository.findBySymbol(symbol)
                .map(fundMapper::toDto);
    }

    public FundDto saveFund(FundDto fundDto) {
        if (fundRepository.existsBySymbol(fundDto.getSymbol())) {
            throw new RuntimeException("Fund with symbol " + fundDto.getSymbol() + " already exists");
        }
        Fund fund = fundMapper.toEntity(fundDto);
        Fund savedFund = fundRepository.save(fund);
        return fundMapper.toDto(savedFund);
    }

    public FundDto updateFund(Long id, FundDto fundDto) {
        Fund fund = fundRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Fund not found with id " + id));

        fund.setName(fundDto.getName());
        fund.setCurrency(fundDto.getCurrency());
        fund.setMarket(fundDto.getMarket());
        fund.setSector(fundDto.getSector());

        Fund updatedFund = fundRepository.save(fund);
        return fundMapper.toDto(updatedFund);
    }

    public void deleteFund(Long id) {
        fundRepository.deleteById(id);
    }

    public FundDto updateFundPrice(Long id) {
        Fund fund = fundRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Fund not found with id " + id));

        fund.setCurrentPrice(externalApiService.getFundPrice(fund.getSymbol()));
        fund.setLastUpdated(LocalDateTime.now());

        Fund updatedFund = fundRepository.save(fund);
        return fundMapper.toDto(updatedFund);
    }
}