import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:8080",
});

api.interceptors.request.use(
  (config) => {
    const token = getStoredToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export const getStoredToken = () => {
  return localStorage.getItem("token");
};

export const getStoredUserData = async () => {
  try {
    const response = await api.get("/api/getCurrentUser");
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: "Failed to fetch user data" };
  }
};

export const login = async (credentials) => {
  console.log("Login credentials:", credentials);
  try {
    const loginResponse = await api.post("/auth/login", credentials);
    return loginResponse.data; 
  } catch (error) {
    throw error.response?.data || { message: "Login failed" };
  }
};

export const register = async (userData) => {
  try {
    const registerResponse = await api.post("/auth/register", userData);
    return registerResponse.data;
  } catch (error) {
    throw error.response?.data || { message: "Registration failed" };
  }
};

export const getUser = async () => {
  try {
    const userResponse = await api.get("/api/user");
    return userResponse.data;
  } catch (error) {
    throw error.response?.data || { message: "Failed to fetch user data" };
  }
};

export default api;