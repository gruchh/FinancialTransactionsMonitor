package com.financialtransactions.monitor.modules.fund.repository;

import com.financialtransactions.monitor.domain.entity.Fund;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface FundRepository extends JpaRepository<Fund, Long> {

}