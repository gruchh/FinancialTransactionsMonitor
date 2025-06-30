package com.financialtransactions.monitor.modules.trade.repository;

import com.financialtransactions.monitor.domain.entity.Trade;
import com.financialtransactions.monitor.modules.trade.dto.TradeWithCurrencyDto;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TradeRepository extends JpaRepository<Trade, Long> {

    @Query("SELECT new com.financialtransactions.monitor.modules.trade.dto.TradeWithCurrencyDto(" +
            "t.id, t.tradeDate, t.type, t.quantity, t.pricePerUnit, t.eurPlnRate, t.usdPlnRate, t.totalValuePln, " +
            "f.currencyType, " +
            "u.id, u.username, u.email, " +
            "p.id, p.name, p.currency, " +
            "f.id, f.name, f.symbol) " +
            "FROM Trade t " +
            "JOIN t.fund f " +
            "JOIN t.portfolio p " +
            "JOIN p.user u " +
            "WHERE u.id = :userId")
    List<TradeWithCurrencyDto> findAllTradesWithCurrencyByUserId(@Param("userId") Long userId);

    @Query("SELECT new com.financialtransactions.monitor.modules.trade.dto.TradeWithCurrencyDto(" +
            "t.id, t.tradeDate, t.type, t.quantity, t.pricePerUnit, t.eurPlnRate, t.usdPlnRate, t.totalValuePln, " +
            "f.currencyType, " +
            "u.id, u.username, u.email, " +
            "p.id, p.name, p.currency, " +
            "f.id, f.name, f.symbol) " +
            "FROM Trade t " +
            "JOIN t.fund f " +
            "JOIN t.portfolio p " +
            "JOIN p.user u " +
            "WHERE p.id = :portfolioId")
    List<TradeWithCurrencyDto> findAllTradesWithCurrencyByPortfolioId(@Param("portfolioId") Long portfolioId);
}
