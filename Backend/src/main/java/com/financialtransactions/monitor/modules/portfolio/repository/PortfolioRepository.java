package com.financialtransactions.monitor.modules.portfolio.repository;

import com.financialtransactions.monitor.domain.entity.Portfolio;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface PortfolioRepository extends JpaRepository<Portfolio, Long> {

}