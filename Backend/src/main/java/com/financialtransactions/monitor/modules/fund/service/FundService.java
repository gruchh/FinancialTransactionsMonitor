package com.financialtransactions.monitor.modules.fund.service;

import com.financialtransactions.monitor.modules.fund.dto.FundDto;
import com.financialtransactions.monitor.modules.fund.mapper.FundMapper;
import com.financialtransactions.monitor.modules.fund.repository.FundRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Slf4j
@RequiredArgsConstructor
@Service
@Transactional
public class FundService {

    private final FundRepository fundRepository;
    private final FundMapper fundMapper;

    @Transactional(readOnly = true)
    public List<FundDto> getAllFunds() {
        log.debug("Fetching all funds");
        return fundMapper.toDtoList(fundRepository.findAll());
    }

}