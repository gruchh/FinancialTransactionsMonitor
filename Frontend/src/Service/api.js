import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:8080",
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
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

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      removeStoredToken();
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export const getStoredToken = () => {
  return localStorage.getItem("token");
};

export const setStoredToken = (token) => {
  localStorage.setItem("token", token);
};

export const removeStoredToken = () => {
localStorage.removeItem("token");
};

export default api;