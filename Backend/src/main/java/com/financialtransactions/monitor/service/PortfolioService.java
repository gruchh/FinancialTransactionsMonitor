package com.financialtransactions.monitor.service;

import com.financialtransactions.monitor.mapper.PortfolioMapper;
import com.financialtransactions.monitor.model.CurrencyType;
import com.financialtransactions.monitor.model.Portfolio;
import com.financialtransactions.monitor.model.dto.PortfolioDto;
import com.financialtransactions.monitor.repository.PortfolioRepository;
import com.financialtransactions.monitor.security.model.User;
import com.financialtransactions.monitor.security.repository.UserRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@RequiredArgsConstructor
@Service
public class PortfolioService {

    private final PortfolioRepository portfolioRepository;
    private final UserRepository userRepository;
    private final PortfolioMapper portfolioMapper;

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

    public List<PortfolioDto> getCurrentUserPortfolios() {
        User currentUser = getCurrentUser();
        List<Portfolio> portfolios = portfolioRepository.findByUserIdAndIsActiveTrue(currentUser.getId());
        return portfolioMapper.toDtoList(portfolios);
    }

    public List<PortfolioDto> getAllCurrentUserPortfolios() {
        User currentUser = getCurrentUser();
        List<Portfolio> portfolios = portfolioRepository.findByUserId(currentUser.getId());
        return portfolioMapper.toDtoList(portfolios);
    }

    public PortfolioDto getPortfolioById(Long portfolioId) {
        User currentUser = getCurrentUser();
        Portfolio portfolio = portfolioRepository.findById(portfolioId)
                .filter(p -> p.getUser().getId().equals(currentUser.getId()))
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND, "Portfolio not found or access denied"));
        return portfolioMapper.toDto(portfolio);
    }

    /**
     * Pobiera portfel po walucie dla aktualnego użytkownika
     */
    public Optional<PortfolioDto> getPortfolioByCurrency(CurrencyType currency) {
        User currentUser = getCurrentUser();
        return portfolioRepository.findByUserIdAndCurrency(currentUser.getId(), currency)
                .map(portfolioMapper::toDto);
    }

    @Transactional
    public PortfolioDto createPortfolio(PortfolioDto portfolioDto) {
        User currentUser = getCurrentUser();

        if (portfolioRepository.existsByUserIdAndCurrency(currentUser.getId(), portfolioDto.getCurrency())) {
            throw new ResponseStatusException(HttpStatus.CONFLICT,
                    "Portfolio for currency " + portfolioDto.getCurrency() + " already exists");
        }

        Portfolio portfolio = portfolioMapper.toEntity(portfolioDto);
        portfolio.setUser(currentUser);
        portfolio.setIsActive(true);

        Portfolio savedPortfolio = portfolioRepository.save(portfolio);
        return portfolioMapper.toDto(savedPortfolio);
    }

    @Transactional
    public void createDefaultPortfoliosForUser(User user) {
        for (CurrencyType currency : CurrencyType.values()) {
            if (!portfolioRepository.existsByUserIdAndCurrency(user.getId(), currency)) {
                Portfolio portfolio = Portfolio.builder()
                        .user(user)
                        .currency(currency)
                        .name("Portfolio " + currency.name())
                        .description("Default " + currency.name() + " portfolio")
                        .isActive(true)
                        .build();
                portfolioRepository.save(portfolio);
            }
        }
    }

    @Transactional
    public PortfolioDto updatePortfolio(Long portfolioId, PortfolioDto portfolioDto) {
        User currentUser = getCurrentUser();
        Portfolio portfolio = portfolioRepository.findById(portfolioId)
                .filter(p -> p.getUser().getId().equals(currentUser.getId()))
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND, "Portfolio not found or access denied"));

        portfolio.setName(portfolioDto.getName());
        portfolio.setDescription(portfolioDto.getDescription());
        portfolio.setIsActive(portfolioDto.getIsActive());
        portfolio.setUpdatedAt(LocalDateTime.now());

        Portfolio updatedPortfolio = portfolioRepository.save(portfolio);
        return portfolioMapper.toDto(updatedPortfolio);
    }

    @Transactional
    public void deactivatePortfolio(Long portfolioId) {
        User currentUser = getCurrentUser();
        Portfolio portfolio = portfolioRepository.findById(portfolioId)
                .filter(p -> p.getUser().getId().equals(currentUser.getId()))
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND, "Portfolio not found or access denied"));

        portfolio.setIsActive(false);
        portfolio.setUpdatedAt(LocalDateTime.now());
        portfolioRepository.save(portfolio);
    }

    @Transactional
    public void activatePortfolio(Long portfolioId) {
        User currentUser = getCurrentUser();
        Portfolio portfolio = portfolioRepository.findById(portfolioId)
                .filter(p -> p.getUser().getId().equals(currentUser.getId()))
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND, "Portfolio not found or access denied"));

        portfolio.setIsActive(true);
        portfolio.setUpdatedAt(LocalDateTime.now());
        portfolioRepository.save(portfolio);
    }

    @Transactional
    public void deletePortfolio(Long portfolioId) {
        User currentUser = getCurrentUser();
        Portfolio portfolio = portfolioRepository.findById(portfolioId)
                .filter(p -> p.getUser().getId().equals(currentUser.getId()))
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND, "Portfolio not found or access denied"));

        if (portfolio.getTrades() != null && !portfolio.getTrades().isEmpty()) {
            throw new ResponseStatusException(HttpStatus.CONFLICT,
                    "Cannot delete portfolio with existing trades");
        }

        portfolioRepository.delete(portfolio);
    }
}