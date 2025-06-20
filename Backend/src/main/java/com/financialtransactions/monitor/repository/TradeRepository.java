package com.financialtransactions.monitor.repository;

import com.financialtransactions.monitor.model.Fund;
import com.financialtransactions.monitor.model.Trade;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface TradeRepository extends JpaRepository<Trade, Long> {

    @Query("SELECT t FROM Trade t WHERE t.fund = :fund AND t.portfolio.user.id = :userId ORDER BY t.tradeDate DESC")
    List<Trade> findByFundAndPortfolioUserIdOrderByTradeDateDesc(@Param("fund") Fund fund, @Param("userId") Long userId);

    @Query("SELECT t FROM Trade t WHERE t.fund.id = :fundId AND t.portfolio.user.id = :userId ORDER BY t.tradeDate DESC")
    List<Trade> findByFundIdAndPortfolioUserIdOrderByTradeDateDesc(@Param("fundId") Long fundId, @Param("userId") Long userId);

    @Query("SELECT t FROM Trade t WHERE t.portfolio.user.id = :userId ORDER BY t.tradeDate DESC")
    List<Trade> findByPortfolioUserIdOrderByTradeDateDesc(@Param("userId") Long userId);

    @Query("SELECT DISTINCT t.fund FROM Trade t WHERE t.portfolio.user.id = :userId")
    List<Fund> findDistinctFundsByPortfolioUserId(@Param("userId") Long userId);

    @Query("SELECT t FROM Trade t WHERE t.id = :id AND t.portfolio.user.id = :userId")
    Optional<Trade> findByIdAndPortfolioUserId(@Param("id") Long id, @Param("userId") Long userId);

    @Query("SELECT t FROM Trade t WHERE t.portfolio.id = :portfolioId ORDER BY t.tradeDate DESC")
    List<Trade> findByPortfolioIdOrderByTradeDateDesc(@Param("portfolioId") Long portfolioId);
}
