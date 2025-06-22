package com.financialtransactions.monitor.repository;

import com.financialtransactions.monitor.model.Trade;
import com.financialtransactions.monitor.model.dto.TradeWithCurrencyDto;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TradeRepository extends JpaRepository<Trade, Long> {

    @Query("SELECT new com.financialtransactions.monitor.model.dto.TradeWithCurrencyDto(t.id, t.tradeDate, t.type, t.quantity, t.pricePerUnit, t.eurPlnRate, t.usdPlnRate, t.totalValuePln, f.currencyType) " +
            "FROM Trade t JOIN t.fund f")
    List<TradeWithCurrencyDto> findAllTradesWithCurrency();
}
