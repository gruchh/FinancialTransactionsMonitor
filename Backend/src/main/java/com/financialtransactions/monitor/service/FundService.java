package com.financialtransactions.monitor.service;

import com.financialtransactions.monitor.mapper.FundMapper;
import com.financialtransactions.monitor.model.Fund;
import com.financialtransactions.monitor.model.dto.FundDto;
import com.financialtransactions.monitor.repository.FundRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

@Slf4j
@RequiredArgsConstructor
@Service
@Transactional
public class FundService {

    private final FundRepository fundRepository;
    private final ExternalApiService externalApiService;
    private final FundMapper fundMapper;

    @Transactional(readOnly = true)
    public List<FundDto> getAllFunds() {
        log.debug("Fetching all funds");
        return fundMapper.toDtoList(fundRepository.findAll());
    }

    @Transactional(readOnly = true)
    public Optional<FundDto> getFundById(Long id) {
        if (id == null || id <= 0) {
            throw new IllegalArgumentException("Fund ID must be positive");
        }
        log.debug("Fetching fund by id: {}", id);
        return fundRepository.findById(id)
                .map(fundMapper::toDto);
    }

    @Transactional(readOnly = true)
    public Optional<FundDto> getFundBySymbol(String symbol) {
        if (symbol == null || symbol.trim().isEmpty()) {
            throw new IllegalArgumentException("Fund symbol cannot be null or empty");
        }
        log.debug("Fetching fund by symbol: {}", symbol);
        return fundRepository.findBySymbol(symbol.trim().toUpperCase())
                .map(fundMapper::toDto);
    }

    @Transactional(readOnly = true)
    public List<FundDto> getFundsByCurrency(String currency) {
        if (currency == null || currency.trim().isEmpty()) {
            throw new IllegalArgumentException("Currency cannot be null or empty");
        }
        log.debug("Fetching funds by currency: {}", currency);
        return fundMapper.toDtoList(fundRepository.findByCurrency(currency.trim().toUpperCase()));
    }

    public FundDto saveFund(FundDto fundDto) {
        if (fundDto == null) {
            throw new IllegalArgumentException("Fund data cannot be null");
        }
        if (fundDto.getSymbol() == null || fundDto.getSymbol().trim().isEmpty()) {
            throw new IllegalArgumentException("Fund symbol is required");
        }

        String symbol = fundDto.getSymbol().trim().toUpperCase();
        if (fundRepository.existsBySymbol(symbol)) {
            throw new RuntimeException("Fund with symbol " + symbol + " already exists");
        }

        log.info("Creating new fund with symbol: {}", symbol);
        Fund fund = fundMapper.toEntity(fundDto);
        fund.setSymbol(symbol);

        Fund savedFund = fundRepository.save(fund);
        log.info("Fund created successfully with id: {}", savedFund.getId());
        return fundMapper.toDto(savedFund);
    }

    public FundDto updateFund(Long id, FundDto fundDto) {
        if (id == null || id <= 0) {
            throw new IllegalArgumentException("Fund ID must be positive");
        }
        if (fundDto == null) {
            throw new IllegalArgumentException("Fund data cannot be null");
        }

        log.info("Updating fund with id: {}", id);
        Fund fund = fundRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Fund not found with id " + id));

        if (fundDto.getName() != null && !fundDto.getName().trim().isEmpty()) {
            fund.setName(fundDto.getName().trim());
        }
        if (fundDto.getCurrency() != null && !fundDto.getCurrency().trim().isEmpty()) {
            fund.setCurrency(fundDto.getCurrency().trim().toUpperCase());
        }
        if (fundDto.getMarket() != null && !fundDto.getMarket().trim().isEmpty()) {
            fund.setMarket(fundDto.getMarket().trim());
        }
        if (fundDto.getSector() != null && !fundDto.getSector().trim().isEmpty()) {
            fund.setSector(fundDto.getSector().trim());
        }

        Fund updatedFund = fundRepository.save(fund);
        log.info("Fund updated successfully with id: {}", updatedFund.getId());
        return fundMapper.toDto(updatedFund);
    }

    public void deleteFund(Long id) {
        if (id == null || id <= 0) {
            throw new IllegalArgumentException("Fund ID must be positive");
        }

        log.info("Deleting fund with id: {}", id);
        if (!fundRepository.existsById(id)) {
            throw new RuntimeException("Fund not found with id " + id);
        }

        fundRepository.deleteById(id);
        log.info("Fund deleted successfully with id: {}", id);
    }

    public FundDto updateFundPrice(Long id) {
        if (id == null || id <= 0) {
            throw new IllegalArgumentException("Fund ID must be positive");
        }

        log.info("Updating price for fund with id: {}", id);
        Fund fund = fundRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Fund not found with id " + id));

        try {
            BigDecimal newPrice = externalApiService.getFundPrice(fund.getSymbol());
            if (newPrice == null || newPrice.compareTo(BigDecimal.ZERO) <= 0) {
                throw new RuntimeException("Invalid price received from external API");
            }

            fund.setCurrentPrice(newPrice);

            Fund updatedFund = fundRepository.save(fund);
            log.info("Price updated successfully for fund with id: {}, new price: {}", id, newPrice);
            return fundMapper.toDto(updatedFund);
        } catch (Exception e) {
            log.error("Failed to update price for fund with id: {}", id, e);
            throw new RuntimeException("Failed to update fund price: " + e.getMessage());
        }
    }
}