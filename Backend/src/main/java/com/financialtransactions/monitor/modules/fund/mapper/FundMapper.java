package com.financialtransactions.monitor.modules.fund.mapper;

import com.financialtransactions.monitor.domain.entity.Fund;
import com.financialtransactions.monitor.modules.fund.dto.FundDto;
import org.mapstruct.Mapper;
import org.mapstruct.ReportingPolicy;

import java.util.List;

@Mapper(componentModel = "spring", unmappedTargetPolicy = ReportingPolicy.IGNORE)
public interface FundMapper {

    FundDto toDto(Fund fund);
    Fund toEntity(FundDto fundDto);
    List<FundDto> toDtoList(List<Fund> funds);
}
