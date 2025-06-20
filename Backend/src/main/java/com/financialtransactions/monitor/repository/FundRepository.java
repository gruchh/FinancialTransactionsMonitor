package com.financialtransactions.monitor.repository;

import com.financialtransactions.monitor.model.Fund;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface FundRepository extends JpaRepository<Fund, Long> {

    Optional<Fund> findBySymbol(String symbol);
    boolean existsBySymbol(String symbol);
    List<Fund> findByCurrency(String currency);
    List<Fund> findBySector(String sector);
    List<Fund> findByExchange(String exchange);

    @Query("SELECT f FROM Fund f WHERE LOWER(f.name) LIKE LOWER(CONCAT('%', :name, '%'))")
    List<Fund> findByNameContainingIgnoreCase(@Param("name") String name);

    @Query("SELECT f FROM Fund f WHERE LOWER(f.symbol) LIKE LOWER(CONCAT('%', :symbol, '%'))")
    List<Fund> findBySymbolContainingIgnoreCase(@Param("symbol") String symbol);
    List<Fund> findAllByOrderByCurrentPriceAsc();
    List<Fund> findAllByOrderByCurrentPriceDesc();
    List<Fund> findAllByOrderByNameAsc();
    List<Fund> findByCurrencyAndSector(String currency, String sector);
    long countByCurrency(String currency);
    long countBySector(String sector);
}