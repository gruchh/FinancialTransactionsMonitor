package com.financialtransactions.monitor.unit.trade;

import com.financialtransactions.monitor.modules.trade.controller.TradeController;
import com.financialtransactions.monitor.domain.entity.Trade;
import com.financialtransactions.monitor.modules.trade.dto.TradeWithCurrencyDto;
import com.financialtransactions.monitor.modules.trade.service.TradeService;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.server.ResponseStatusException;

import java.util.Collections;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class TradeControllerTest {

    @Mock
    private TradeService tradeService;

    @InjectMocks
    private TradeController tradeController;

    @Test
    void getAllTradesWithCurrency_ShouldReturnTrades_WhenServiceReturnsDataSuccessfully() {
        TradeWithCurrencyDto tradeDto = new TradeWithCurrencyDto();
        List<TradeWithCurrencyDto> expectedTrades = Collections.singletonList(tradeDto);
        when(tradeService.getAllTradesWithCurrency()).thenReturn(expectedTrades);
        ResponseEntity<List<TradeWithCurrencyDto>> response = tradeController.getAllTradesWithCurrency();
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals(expectedTrades, response.getBody());
        verify(tradeService, times(1)).getAllTradesWithCurrency();
    }

    @Test
    void getAllTradesWithCurrency_ShouldThrowInternalServerError_WhenServiceThrowsException() {
        when(tradeService.getAllTradesWithCurrency()).thenThrow(new RuntimeException("Unexpected error"));
        ResponseStatusException exception = assertThrows(ResponseStatusException.class, () -> {
            tradeController.getAllTradesWithCurrency();
        });
        assertEquals(HttpStatus.INTERNAL_SERVER_ERROR, exception.getStatusCode());
        assertEquals("Internal server error", exception.getReason());
        verify(tradeService, times(1)).getAllTradesWithCurrency();
    }

    @Test
    void getAllTradesWithCurrency_ShouldThrowForbidden_WhenServiceThrowsForbidden() {
        when(tradeService.getAllTradesWithCurrency())
                .thenThrow(new ResponseStatusException(HttpStatus.FORBIDDEN, "Forbidden"));
        ResponseStatusException exception = assertThrows(ResponseStatusException.class, () -> {
            tradeController.getAllTradesWithCurrency();
        });
        assertEquals(HttpStatus.FORBIDDEN, exception.getStatusCode());
        assertEquals("Forbidden", exception.getReason());
        verify(tradeService, times(1)).getAllTradesWithCurrency();
    }

    @Test
    void getTradesByPortfolioId_ShouldReturnTrades_WhenPortfolioExists() {
        TradeWithCurrencyDto tradeDto = new TradeWithCurrencyDto();
        List<TradeWithCurrencyDto> expectedTrades = Collections.singletonList(tradeDto);
        when(tradeService.getTradesByPortfolioId(1L)).thenReturn(expectedTrades);
        ResponseEntity<List<TradeWithCurrencyDto>> response = tradeController.getTradesByPortfolioId(1L);
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals(expectedTrades, response.getBody());
        verify(tradeService, times(1)).getTradesByPortfolioId(1L);
    }

    @Test
    void getTradesByPortfolioId_ShouldThrowNotFound_WhenPortfolioDoesNotExist() {
        when(tradeService.getTradesByPortfolioId(1L))
                .thenThrow(new ResponseStatusException(HttpStatus.NOT_FOUND, "Portfolio not found"));
        ResponseStatusException exception = assertThrows(ResponseStatusException.class, () -> {
            tradeController.getTradesByPortfolioId(1L);
        });
        assertEquals(HttpStatus.NOT_FOUND, exception.getStatusCode());
        assertEquals("Portfolio not found", exception.getReason());
        verify(tradeService, times(1)).getTradesByPortfolioId(1L);
    }

    @Test
    void getTradesByPortfolioId_ShouldThrowInternalServerError_WhenServiceThrowsException() {
        when(tradeService.getTradesByPortfolioId(1L)).thenThrow(new RuntimeException("Unexpected error"));
        ResponseStatusException exception = assertThrows(ResponseStatusException.class, () -> {
            tradeController.getTradesByPortfolioId(1L);
        });
        assertEquals(HttpStatus.INTERNAL_SERVER_ERROR, exception.getStatusCode());
        assertEquals("Internal server error", exception.getReason());
        verify(tradeService, times(1)).getTradesByPortfolioId(1L);
    }

    @Test
    void getTradeById_ShouldReturnTrade_WhenTradeExists() {
        Trade expectedTrade = new Trade();
        when(tradeService.getTradeById(1L)).thenReturn(expectedTrade);
        ResponseEntity<Trade> response = tradeController.getTradeById(1L);
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals(expectedTrade, response.getBody());
        verify(tradeService, times(1)).getTradeById(1L);
    }

    @Test
    void getTradeById_ShouldThrowNotFound_WhenTradeDoesNotExist() {
        when(tradeService.getTradeById(1L))
                .thenThrow(new ResponseStatusException(HttpStatus.NOT_FOUND, "Trade not found"));
        ResponseStatusException exception = assertThrows(ResponseStatusException.class, () -> {
            tradeController.getTradeById(1L);
        });
        assertEquals(HttpStatus.NOT_FOUND, exception.getStatusCode());
        assertEquals("Trade not found", exception.getReason());
        verify(tradeService, times(1)).getTradeById(1L);
    }

    @Test
    void getTradeById_ShouldThrowInternalServerError_WhenServiceThrowsException() {
        when(tradeService.getTradeById(1L)).thenThrow(new RuntimeException("Unexpected error"));
        ResponseStatusException exception = assertThrows(ResponseStatusException.class, () -> {
            tradeController.getTradeById(1L);
        });
        assertEquals(HttpStatus.INTERNAL_SERVER_ERROR, exception.getStatusCode());
        assertEquals("Internal server error", exception.getReason());
        verify(tradeService, times(1)).getTradeById(1L);
    }

    @Test
    void createTrade_ShouldReturnCreatedTrade_WhenTradeIsValid() {
        Trade trade = new Trade();
        Trade createdTrade = new Trade();
        when(tradeService.createTrade(any(Trade.class))).thenReturn(createdTrade);
        ResponseEntity<Trade> response = tradeController.createTrade(trade);
        assertEquals(HttpStatus.CREATED, response.getStatusCode());
        assertEquals(createdTrade, response.getBody());
        verify(tradeService, times(1)).createTrade(trade);
    }

    @Test
    void createTrade_ShouldThrowBadRequest_WhenTradeDataIsInvalid() {
        Trade trade = new Trade();
        when(tradeService.createTrade(any(Trade.class)))
                .thenThrow(new ResponseStatusException(HttpStatus.BAD_REQUEST, "Invalid trade data"));
        ResponseStatusException exception = assertThrows(ResponseStatusException.class, () -> {
            tradeController.createTrade(trade);
        });
        assertEquals(HttpStatus.BAD_REQUEST, exception.getStatusCode());
        assertEquals("Invalid trade data", exception.getReason());
        verify(tradeService, times(1)).createTrade(trade);
    }

    @Test
    void createTrade_ShouldThrowInternalServerError_WhenServiceThrowsException() {
        Trade trade = new Trade();
        when(tradeService.createTrade(any(Trade.class))).thenThrow(new RuntimeException("Unexpected error"));
        ResponseStatusException exception = assertThrows(ResponseStatusException.class, () -> {
            tradeController.createTrade(trade);
        });
        assertEquals(HttpStatus.INTERNAL_SERVER_ERROR, exception.getStatusCode());
        assertEquals("Internal server error", exception.getReason());
        verify(tradeService, times(1)).createTrade(trade);
    }
}