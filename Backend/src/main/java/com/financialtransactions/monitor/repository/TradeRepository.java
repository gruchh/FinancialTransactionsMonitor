package com.financialtransactions.monitor.repository;

import com.financialtransactions.monitor.model.Fund;
import com.financialtransactions.monitor.model.Trade;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TradeRepository extends JpaRepository<Trade, Long> {

    List<Trade> findByFundOrderByTradeDateDesc(Fund fund);

    @Query("SELECT t FROM Trade t WHERE t.fund.id = :fundId ORDER BY t.tradeDate DESC")
    List<Trade> findByFundIdOrderByTradeDateDesc(@Param("fundId") Long fundId);

    @Query("SELECT t FROM Trade t ORDER BY t.tradeDate DESC")
    List<Trade> findAllOrderByTradeDateDesc();

    @Query("SELECT DISTINCT t.fund FROM Trade t")
    List<Fund> findDistinctFunds();
}
