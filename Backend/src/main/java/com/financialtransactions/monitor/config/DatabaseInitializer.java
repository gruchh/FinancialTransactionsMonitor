package com.financialtransactions.monitor.config;

import com.financialtransactions.monitor.model.Fund;
import com.financialtransactions.monitor.model.Trade;
import com.financialtransactions.monitor.model.TradeType;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import jakarta.transaction.Transactional;
import org.springframework.boot.context.event.ApplicationReadyEvent;
import org.springframework.context.event.EventListener;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Component
public class DatabaseInitializer {

    @PersistenceContext
    private EntityManager entityManager;

    @Transactional
    @EventListener(ApplicationReadyEvent.class)
    public void initDatabase() {
        Fund fund1 = new Fund(null, "AAPL", "Apple Inc.", "USD", "NASDAQ", "Technologia", new BigDecimal("192.50"), LocalDateTime.now());
        Fund fund2 = new Fund(null, "GOOGL", "Alphabet Inc.", "USD", "NASDAQ", "Technologia", new BigDecimal("172.30"), LocalDateTime.now());
        Fund fund3 = new Fund(null, "PKO", "PKO Bank Polski", "PLN", "GPW", "Finanse", new BigDecimal("56.75"), LocalDateTime.now());

        entityManager.persist(fund1);
        entityManager.persist(fund2);
        entityManager.persist(fund3);

        Trade trade1 = new Trade(
                null,
                fund1,
                LocalDate.now(),
                TradeType.BUY,
                new BigDecimal("100.0000"),
                new BigDecimal("192.50"),
                new BigDecimal("4.25"),
                new BigDecimal("3.95"),
                new BigDecimal("19250.00"),
                LocalDateTime.now(),
                LocalDateTime.now()
        );

        Trade trade2 = new Trade(
                null,
                fund2,
                LocalDate.now().minusDays(1),
                TradeType.SELL,
                new BigDecimal("50.0000"),
                new BigDecimal("172.30"),
                new BigDecimal("4.25"),
                new BigDecimal("3.95"),
                new BigDecimal("8615.00"),
                LocalDateTime.now(),
                LocalDateTime.now()
        );

        Trade trade3 = new Trade(
                null,
                fund3,
                LocalDate.now().minusDays(2),
                TradeType.BUY,
                new BigDecimal("200.0000"),
                new BigDecimal("56.75"),
                null,
                null,
                new BigDecimal("11350.00"),
                LocalDateTime.now(),
                LocalDateTime.now()
        );

        entityManager.persist(trade1);
        entityManager.persist(trade2);
        entityManager.persist(trade3);
    }
}