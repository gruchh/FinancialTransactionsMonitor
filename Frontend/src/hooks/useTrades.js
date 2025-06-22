import { TRADES_ACTIONS, useTradesContext } from "../context/TradesContext";
import { tradesService } from "../service/tradesService";

export const useTrades = () => {
  const { state, dispatch } = useTradesContext();

  const fetchTrades = async () => {
    try {
      dispatch({ type: TRADES_ACTIONS.SET_LOADING, payload: true });
      const trades = await tradesService.getAllTrades();
      dispatch({ type: TRADES_ACTIONS.SET_TRADES, payload: trades });
    } catch (error) {
      dispatch({ type: TRADES_ACTIONS.SET_ERROR, payload: error.message });
    }
  };

  const createTrade = async (tradeData) => {
    try {
      dispatch({ type: TRADES_ACTIONS.SET_LOADING, payload: true });
      const newTrade = await tradesService.createTrade(tradeData);
      dispatch({ type: TRADES_ACTIONS.ADD_TRADE, payload: newTrade });
      return { success: true, trade: newTrade };
    } catch (error) {
      dispatch({ type: TRADES_ACTIONS.SET_ERROR, payload: error.message });
      return { success: false, message: error.message };
    }
  };

  const updateTrade = async (id, tradeData) => {
    try {
      dispatch({ type: TRADES_ACTIONS.SET_LOADING, payload: true });
      const updatedTrade = await tradesService.updateTrade(id, tradeData);
      dispatch({ type: TRADES_ACTIONS.UPDATE_TRADE, payload: updatedTrade });
      return { success: true, trade: updatedTrade };
    } catch (error) {
      dispatch({ type: TRADES_ACTIONS.SET_ERROR, payload: error.message });
      return { success: false, message: error.message };
    }
  };

  const deleteTrade = async (id) => {
    try {
      dispatch({ type: TRADES_ACTIONS.SET_LOADING, payload: true });
      await tradesService.deleteTrade(id);
      dispatch({ type: TRADES_ACTIONS.DELETE_TRADE, payload: id });
      return { success: true };
    } catch (error) {
      dispatch({ type: TRADES_ACTIONS.SET_ERROR, payload: error.message });
      return { success: false, message: error.message };
    }
  };

  const clearError = () => {
    dispatch({ type: TRADES_ACTIONS.CLEAR_ERROR });
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
  };
};