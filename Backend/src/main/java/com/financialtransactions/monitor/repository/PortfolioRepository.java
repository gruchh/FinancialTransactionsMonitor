package com.financialtransactions.monitor.repository;

import com.financialtransactions.monitor.model.CurrencyType;
import com.financialtransactions.monitor.model.Portfolio;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface PortfolioRepository extends JpaRepository<Portfolio, Long> {

    List<Portfolio> findByUserIdAndIsActiveTrue(Long userId);
    List<Portfolio> findByUserId(Long userId);
    Optional<Portfolio> findByUserIdAndCurrency(Long userId, CurrencyType currency);
    boolean existsByUserIdAndCurrency(Long userId, CurrencyType currency);
    List<Portfolio> findByUserIdAndCurrencyAndIsActiveTrue(Long userId, CurrencyType currency);

    @Query("SELECT p FROM Portfolio p WHERE p.user.id = :userId AND LOWER(p.name) LIKE LOWER(CONCAT('%', :name, '%'))")
    List<Portfolio> findByUserIdAndNameContainingIgnoreCase(@Param("userId") Long userId, @Param("name") String name);

    long countByUserIdAndIsActiveTrue(Long userId);
    long countByUserId(Long userId);

    @Query("SELECT DISTINCT p FROM Portfolio p LEFT JOIN p.trades t WHERE p.user.id = :userId AND t IS NOT NULL")
    List<Portfolio> findPortfoliosWithTrades(@Param("userId") Long userId);

    @Query("SELECT p FROM Portfolio p WHERE p.user.id = :userId AND (p.trades IS EMPTY OR p.trades IS NULL)")
    List<Portfolio> findPortfoliosWithoutTrades(@Param("userId") Long userId);

    @Query("DELETE FROM Portfolio p WHERE p.user.id = :userId")
    void deleteByUserId(@Param("userId") Long userId);
    List<Portfolio> findByCurrency(CurrencyType currency);

    @Query(value = "SELECT p FROM Portfolio p WHERE p.user.id = :userId ORDER BY p.createdAt DESC")
    List<Portfolio> findLatestPortfoliosByUserId(@Param("userId") Long userId, @Param("limit") int limit);
}