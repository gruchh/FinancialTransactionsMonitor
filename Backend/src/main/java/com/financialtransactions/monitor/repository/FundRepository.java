package com.financialtransactions.monitor.repository;

import com.financialtransactions.monitor.model.Fund;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface FundRepository extends JpaRepository<Fund, Long> {
    Optional<Fund> findBySymbol(String symbol);

    boolean existsBySymbol(String symbol);
}