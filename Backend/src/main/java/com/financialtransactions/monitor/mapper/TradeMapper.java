package com.financialtransactions.monitor.mapper;

import com.financialtransactions.monitor.model.Trade;
import com.financialtransactions.monitor.model.dto.TradeDto;
import org.mapstruct.Mapper;
import org.mapstruct.ReportingPolicy;

import java.util.List;

@Mapper (componentModel = "spring", unmappedTargetPolicy = ReportingPolicy.IGNORE, uses = FundMapper.class)
public interface TradeMapper {

    TradeDto toDto(Trade trade);
    Trade toEntity(TradeDto tradeDto);
    List<TradeDto> toDtoList(List<Trade> trades);
}