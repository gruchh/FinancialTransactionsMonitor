package com.financialtransactions.monitor.modules.trade.mapper;

import com.financialtransactions.monitor.domain.entity.Trade;
import com.financialtransactions.monitor.modules.fund.mapper.FundMapper;
import com.financialtransactions.monitor.modules.trade.dto.TradeDto;
import org.mapstruct.Mapper;
import org.mapstruct.ReportingPolicy;

import java.util.List;

@Mapper (componentModel = "spring", unmappedTargetPolicy = ReportingPolicy.IGNORE, uses = FundMapper.class)
public interface TradeMapper {

    TradeDto toDto(Trade trade);
    Trade toEntity(TradeDto tradeDto);
    List<TradeDto> toDtoList(List<Trade> trades);
}