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

    List<Trade> findByFundAndOwnerUsernameOrderByTradeDateDesc(Fund fund, String ownerUsername);

    @Query("SELECT t FROM Trade t WHERE t.fund.id = :fundId AND t.ownerUsername = :ownerUsername ORDER BY t.tradeDate DESC")
    List<Trade> findByFundIdAndOwnerUsernameOrderByTradeDateDesc(@Param("fundId") Long fundId, @Param("ownerUsername") String ownerUsername);

    @Query("SELECT t FROM Trade t WHERE t.ownerUsername = :ownerUsername ORDER BY t.tradeDate DESC")
    List<Trade> findByOwnerUsernameOrderByTradeDateDesc(@Param("ownerUsername") String ownerUsername);

    @Query("SELECT DISTINCT t.fund FROM Trade t WHERE t.ownerUsername = :ownerUsername")
    List<Fund> findDistinctFundsByOwnerUsername(@Param("ownerUsername") String ownerUsername);

    Optional<Trade> findByIdAndOwnerUsername(Long id, String ownerUsername);

    List<Trade> findByOwnerUsername(String ownerUsername);
}
