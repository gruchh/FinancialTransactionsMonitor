package com.financialtransactions.monitor.modules.portfolio.repository;

import com.financialtransactions.monitor.domain.entity.Portfolio;
import com.financialtransactions.monitor.domain.enums.CurrencyType;
import com.financialtransactions.monitor.security.model.User;
import jakarta.validation.constraints.NotNull;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface PortfolioRepository extends JpaRepository<Portfolio, Long> {

    Optional<Portfolio> findByUserAndCurrency(User user, CurrencyType currency);
}