import { TRADES_ACTIONS, useTradesContext } from "../context/TradesContext";
import { tradesService } from "../service/tradesService";

export const useTrades = () => {
  const { state, dispatch } = useTradesContext();

  const fetchTrades = async () => {
    try {
      dispatch({ type: TRADES_ACTIONS.SET_LOADING, payload: true });
      const trades = await tradesService.getAllTrades();
      dispatch({ type: TRADES_ACTIONS.SET_TRADES, payload: trades });
      return { success: true, trades };
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message || 'Failed to fetch trades';
      dispatch({ type: TRADES_ACTIONS.SET_ERROR, payload: errorMessage });
      return { success: false, message: errorMessage };
    } finally {
      dispatch({ type: TRADES_ACTIONS.SET_LOADING, payload: false });
    }
  };

  const createTrade = async (tradeData) => {
    try {
      dispatch({ type: TRADES_ACTIONS.SET_LOADING, payload: true });
      
      // Walidacja danych przed wysłaniem
      if (!tradeData.fundId) {
        throw new Error('Fund ID is required');
      }
      
      if (!tradeData.quantity || tradeData.quantity <= 0) {
        throw new Error('Valid quantity is required');
      }
      
      if (!tradeData.pricePerUnit || tradeData.pricePerUnit <= 0) {
        throw new Error('Valid price per unit is required');
      }

      const newTrade = await tradesService.createTrade(tradeData);
      dispatch({ type: TRADES_ACTIONS.ADD_TRADE, payload: newTrade });
      return { success: true, trade: newTrade };
    } catch (error) {
      const errorResponse = {
        success: false,
        message: error.response?.data?.message || error.message || 'Failed to create trade'
      };

      // Obsługa błędów walidacji pól
      if (error.response?.data?.fieldErrors) {
        errorResponse.fieldErrors = error.response.data.fieldErrors;
      }

      dispatch({ type: TRADES_ACTIONS.SET_ERROR, payload: errorResponse.message });
      return errorResponse;
    } finally {
      dispatch({ type: TRADES_ACTIONS.SET_LOADING, payload: false });
    }
  };

  const updateTrade = async (id, tradeData) => {
    try {
      dispatch({ type: TRADES_ACTIONS.SET_LOADING, payload: true });
      
      // Walidacja danych przed wysłaniem
      if (!id) {
        throw new Error('Trade ID is required');
      }
      
      if (!tradeData.fundId) {
        throw new Error('Fund ID is required');
      }
      
      if (!tradeData.quantity || tradeData.quantity <= 0) {
        throw new Error('Valid quantity is required');
      }
      
      if (!tradeData.pricePerUnit || tradeData.pricePerUnit <= 0) {
        throw new Error('Valid price per unit is required');
      }

      const updatedTrade = await tradesService.updateTrade(id, tradeData);
      dispatch({ type: TRADES_ACTIONS.UPDATE_TRADE, payload: updatedTrade });
      return { success: true, trade: updatedTrade };
    } catch (error) {
      const errorResponse = {
        success: false,
        message: error.response?.data?.message || error.message || 'Failed to update trade'
      };

      // Obsługa błędów walidacji pól
      if (error.response?.data?.fieldErrors) {
        errorResponse.fieldErrors = error.response.data.fieldErrors;
      }

      dispatch({ type: TRADES_ACTIONS.SET_ERROR, payload: errorResponse.message });
      return errorResponse;
    } finally {
      dispatch({ type: TRADES_ACTIONS.SET_LOADING, payload: false });
    }
  };

  const deleteTrade = async (id) => {
    try {
      dispatch({ type: TRADES_ACTIONS.SET_LOADING, payload: true });
      
      if (!id) {
        throw new Error('Trade ID is required');
      }

      await tradesService.deleteTrade(id);
      dispatch({ type: TRADES_ACTIONS.DELETE_TRADE, payload: id });
      return { success: true };
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message || 'Failed to delete trade';
      dispatch({ type: TRADES_ACTIONS.SET_ERROR, payload: errorMessage });
      return { success: false, message: errorMessage };
    } finally {
      dispatch({ type: TRADES_ACTIONS.SET_LOADING, payload: false });
    }
  };

  const clearError = () => {
    dispatch({ type: TRADES_ACTIONS.CLEAR_ERROR });
  };

  const clearTrades = () => {
    dispatch({ type: TRADES_ACTIONS.SET_TRADES, payload: [] });
  };

  // Dodatkowe utility funkcje
  const getTradeById = (id) => {
    return state.trades.find(trade => trade.id === id) || null;
  };

  const getTradesByFund = (fundId) => {
    return state.trades.filter(trade => trade.fundId === fundId);
  };

  const getTradesByType = (type) => {
    return state.trades.filter(trade => trade.type === type);
  };

  const getTotalValue = () => {
    return state.trades.reduce((total, trade) => {
      return total + (parseFloat(trade.totalValuePln) || 0);
    }, 0);
  };

  const getTradesStats = () => {
    const trades = state.trades;
    const buyTrades = trades.filter(t => t.type === 'BUY');
    const sellTrades = trades.filter(t => t.type === 'SELL');
    
    return {
      total: trades.length,
      buyCount: buyTrades.length,
      sellCount: sellTrades.length,
      totalValue: getTotalValue(),
      buyValue: buyTrades.reduce((sum, t) => sum + (parseFloat(t.totalValuePln) || 0), 0),
      sellValue: sellTrades.reduce((sum, t) => sum + (parseFloat(t.totalValuePln) || 0), 0)
    };
  };

  return {
    trades: state.trades,
    loading: state.loading,
    error: state.error,
    fetchTrades,
    createTrade,
    updateTrade,
    deleteTrade,
    clearError,
    clearTrades,
    getTradeById,
    getTradesByFund,
    getTradesByType,
    getTotalValue,
    getTradesStats
  };
};