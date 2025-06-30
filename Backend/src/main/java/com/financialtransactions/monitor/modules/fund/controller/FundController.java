package com.financialtransactions.monitor.modules.fund.controller;

import com.financialtransactions.monitor.modules.fund.dto.FundDto;
import com.financialtransactions.monitor.modules.fund.service.FundService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RequiredArgsConstructor
@RestController
@RequestMapping("/api/funds")
@CrossOrigin(origins = "*")
@Tag(name = "Funds", description = "API for managing funds")
public class FundController {

    private final FundService fundService;

    @GetMapping
    @Operation(summary = "Get all funds", description = "Retrieve a list of all funds")
    @ApiResponse(responseCode = "200", description = "Successfully retrieved funds")
    public ResponseEntity<List<FundDto>> getAllFunds() {
        List<FundDto> fundsDto = fundService.getAllFunds();
        return ResponseEntity.ok(fundsDto);
    }

}