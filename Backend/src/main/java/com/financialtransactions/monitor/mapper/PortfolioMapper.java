package com.financialtransactions.monitor.mapper;

import com.financialtransactions.monitor.model.Portfolio;
import com.financialtransactions.monitor.model.dto.PortfolioDto;
import org.mapstruct.Mapper;
import org.mapstruct.ReportingPolicy;

import java.util.List;

@Mapper(componentModel = "spring", unmappedTargetPolicy = ReportingPolicy.IGNORE)
public interface PortfolioMapper {

    PortfolioDto toDto(Portfolio portfolio);
    Portfolio toEntity(PortfolioDto portfolioDto);
    List<PortfolioDto> toDtoList(List<Portfolio> portfolios);
}