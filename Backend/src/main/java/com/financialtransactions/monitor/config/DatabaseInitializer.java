package com.financialtransactions.monitor.config;

import com.financialtransactions.monitor.domain.entity.Fund;
import com.financialtransactions.monitor.domain.entity.Portfolio;
import com.financialtransactions.monitor.domain.entity.Trade;
import com.financialtransactions.monitor.domain.enums.CurrencyType;
import com.financialtransactions.monitor.domain.enums.TradeType;
import com.financialtransactions.monitor.modules.fund.repository.FundRepository;
import com.financialtransactions.monitor.modules.portfolio.repository.PortfolioRepository;
import com.financialtransactions.monitor.modules.trade.repository.TradeRepository;
import com.financialtransactions.monitor.security.model.Role;
import com.financialtransactions.monitor.security.model.User;
import com.financialtransactions.monitor.security.repository.UserRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.context.event.ApplicationReadyEvent;
import org.springframework.context.event.EventListener;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.Set;

@Component
@RequiredArgsConstructor
public class DatabaseInitializer {

    private final PortfolioRepository portfolioRepository;
    private final TradeRepository tradeRepository;
    private final FundRepository fundRepository;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Transactional
    @EventListener(ApplicationReadyEvent.class)
    public void initDatabase() {

        User user1 = User.builder()
                .username("admin")
                .email("trader1@example.com")
                .password(passwordEncoder.encode("admin"))
                .avatarUrl("https://ui-avatars.com/api/?name=Administrator+System&background=0d47a1&color=fff")
                .roles(Set.of(Role.ADMIN, Role.TRADER))
                .build();

        User user2 = User.builder()
                .username("trader")
                .password(passwordEncoder.encode("trader"))
                .email("trader@example.com")
                .avatarUrl("https://ui-avatars.com/api/?name=Jan+Kowalski&background=2e7d32&color=fff")
                .roles(Set.of(Role.TRADER))
                .build();

        userRepository.saveAll(List.of(user1, user2));

        Portfolio portfolio1 = Portfolio.builder()
                .user(user1)
                .currency(CurrencyType.USD)
                .name("USD Portfolio - Trader1")
                .description("Default USD portfolio for trader1")
                .isActive(true)
                .build();

        Portfolio portfolio2 = Portfolio.builder()
                .user(user2)
                .currency(CurrencyType.USD)
                .name("USD Portfolio - Trader2")
                .description("Default USD portfolio for trader2")
                .isActive(true)
                .build();

        Portfolio portfolio3 = Portfolio.builder()
                .user(user1)
                .currency(CurrencyType.PLN)
                .name("PLN Portfolio - Trader1")
                .description("Default PLN portfolio for trader1")
                .isActive(true)
                .build();

        portfolioRepository.saveAll(List.of(portfolio1, portfolio2, portfolio3));

        Fund fund1 = Fund.builder()
                .symbol("AAPL")
                .name("Apple Inc.")
                .market("Stock Market")
                .currencyType(CurrencyType.USD)
                .sector("Technology")
                .exchange("NASDAQ")
                .currentPrice(new BigDecimal("192.50"))
                .build();

        Fund fund2 = Fund.builder()
                .symbol("GOOGL")
                .name("Alphabet Inc.")
                .market("Stock Market")
                .currencyType(CurrencyType.USD)
                .sector("Technology")
                .exchange("NASDAQ")
                .currentPrice(new BigDecimal("172.30"))
                .build();

        Fund fund3 = Fund.builder()
                .symbol("PKO")
                .name("PKO Bank Polski")
                .market("Stock Market")
                .currencyType(CurrencyType.PLN)
                .sector("Banking")
                .exchange("WSE")
                .currentPrice(new BigDecimal("56.75"))
                .build();

        fundRepository.saveAll(List.of(fund1, fund2, fund3));

        Trade trade1 = Trade.builder()
                .portfolio(portfolio1)
                .fund(fund1)
                .tradeDate(LocalDate.now())
                .type(TradeType.BUY)
                .quantity(new BigDecimal("100.0000"))
                .pricePerUnit(new BigDecimal("192.50"))
                .eurPlnRate(new BigDecimal("4.25"))
                .usdPlnRate(new BigDecimal("3.95"))
                .totalValuePln(new BigDecimal("19250.00"))
                .totalValuePortfolioCurrency(new BigDecimal("19250.00"))
                .build();

        Trade trade2 = Trade.builder()
                .portfolio(portfolio2)
                .fund(fund2)
                .tradeDate(LocalDate.now().minusDays(1))
                .type(TradeType.BUY)
                .quantity(new BigDecimal("50.0000"))
                .pricePerUnit(new BigDecimal("172.30"))
                .eurPlnRate(new BigDecimal("4.25"))
                .usdPlnRate(new BigDecimal("3.95"))
                .totalValuePln(new BigDecimal("8615.00"))
                .totalValuePortfolioCurrency(new BigDecimal("8615.00"))
                .build();

        Trade trade3 = Trade.builder()
                .portfolio(portfolio3)
                .fund(fund3)
                .tradeDate(LocalDate.now().minusDays(2))
                .type(TradeType.BUY)
                .quantity(new BigDecimal("200.0000"))
                .pricePerUnit(new BigDecimal("56.75"))
                .eurPlnRate(null)
                .usdPlnRate(null)
                .totalValuePln(new BigDecimal("11350.00"))
                .totalValuePortfolioCurrency(new BigDecimal("11350.00"))
                .build();

        tradeRepository.saveAll(List.of(trade1, trade2, trade3));
    }
}