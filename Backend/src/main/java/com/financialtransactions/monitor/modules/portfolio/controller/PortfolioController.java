package com.financialtransactions.monitor.modules.portfolio.controller;

import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RequiredArgsConstructor
@RestController
@RequestMapping("/api/portfolio")
@CrossOrigin(origins = "*")
@Tag(name = "Portfolio", description = "API for managing portfolio-related operations")
public class PortfolioController {

}