import api from "./api";

export const tradesService = {
  getAllTrades: async () => {
    try {
      const response = await api.get("/api/trades/with-currency");
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: "Failed to fetch trades" };
    }
  },

  createTrade: async (tradeData) => {
    try {
      const response = await api.post("/api/trades", tradeData);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: "Failed to create trade" };
    }
  },

  updateTrade: async (id, tradeData) => {
    try {
      const response = await api.put(`/api/trades/${id}`, tradeData);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: "Failed to update trade" };
    }
  },

  deleteTrade: async (id) => {
    try {
      await api.delete(`/api/trades/${id}`);
      return true;
    } catch (error) {
      throw error.response?.data || { message: "Failed to delete trade" };
    }
  },

  getTradeById: async (id) => {
    try {
      const response = await api.get(`/api/trades/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: "Failed to fetch trade" };
    }
  },
};