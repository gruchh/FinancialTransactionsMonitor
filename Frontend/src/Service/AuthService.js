import api from "./api";

export const authService = {
  getCurrentUser: async () => {
    try {
      const response = await api.get("/auth/getCurrentUser");
      return response.data;
    } catch (error) {
      console.error("getCurrentUser error:", error);
      const errorData = error.response?.data;
      const errorMessage =
        errorData?.message || errorData?.error || "Failed to fetch user data";
      throw new Error(errorMessage);
    }
  },

  login: async (credentials) => {
    try {
      const response = await api.post("/auth/login", credentials);
      return response.data;
    } catch (error) {
      console.error("Login API error:", error);
      const errorData = error.response?.data;
      const errorMessage =
        errorData?.message || errorData?.error || "Login failed";
      throw new Error(errorMessage);
    }
  },

  register: async (userData) => {
    try {
      const response = await api.post("/auth/register", userData);
      return response.data;
    } catch (error) {
      console.error("Register API error:", error);
      const errorData = error.response?.data;
      const errorMessage =
        errorData?.message || errorData?.error || "Registration failed";
      throw new Error(errorMessage);
    }
  },
};