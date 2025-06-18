import axios from "axios";

const STORAGE_KEYS = {
  ACCESS_TOKEN: "app_access_token",
  REFRESH_TOKEN: "app_refresh_token",
  USER_DATA: "app_user_data",
};

export const logout = () => {
  localStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN);
  localStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN);
  localStorage.removeItem(STORAGE_KEYS.USER_DATA);
};

export const getStoredToken = () => {
  return localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN);
};

export const getStoredUserData = () => {
  try {
    const user = localStorage.getItem(STORAGE_KEYS.USER_DATA);
    return user ? JSON.parse(user) : null;
  } catch (error) {
    console.error("Błąd parsowania danych użytkownika:", error);
    localStorage.removeItem(STORAGE_KEYS.USER_DATA);
    return null;
  }
};

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

export const login = async (credentials) => {
  try {
    const loginResponse = await api.post("/auth/login", credentials);
    
    if (!loginResponse.data) {
      throw new Error("Nieprawidłowa odpowiedź serwera podczas logowania");
    }
    
    const { accessToken, refreshToken } = loginResponse.data;

    if (!accessToken) {
      throw new Error("Token nie został zwrócony przez serwer");
    }

    localStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, accessToken);
    if (refreshToken) {
      localStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, refreshToken);
    }

    const userResponse = await api.get("/auth/getCurrentUserInfo");
    
    if (!userResponse.data || !userResponse.data.data) {
      throw new Error("Nie udało się pobrać danych użytkownika");
    }
    
    const responseData = userResponse.data;

    const userToStore = {
      status: responseData.status,
      message: responseData.message,
      data: {
        id: responseData.data.id,
        username: responseData.data.username,
        email: responseData.data.email,
        avatarUrl: responseData.data.avatarUrl,
        roles: responseData.data.roles || [],
        createdAt: responseData.data.createdAt,
        token: accessToken,
      },
    };

    localStorage.setItem(STORAGE_KEYS.USER_DATA, JSON.stringify(userToStore));

    return userToStore;
    
  } catch (error) {
    logout();
    throw new Error(
      error.message || "Wystąpił błąd podczas logowania. Spróbuj ponownie."
    );
  }
};

export default api;