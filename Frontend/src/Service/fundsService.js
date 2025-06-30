import api from "./api";

export const fundsService = {
  fetchFunds: async () => {
    try {
      const response = await api.get("/api/funds");
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: "Failed to fetch funds" };
    }
  },
};