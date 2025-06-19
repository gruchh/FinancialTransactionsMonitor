import { createContext, useContext, useEffect, useState } from "react";
import { getStoredToken, getStoredUserData, login as authLogin } from "../service/AuthService";

export const AppContext = createContext(null);

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within an AppContextProvider');
  }
  return context;
};

const AppContextProvider = ({ children }) => {
  const [authData, setAuthData] = useState({
    user: null,
    accessToken: null,
    isAuthenticated: false,
    isLoading: true,
  });

  useEffect(() => {
    const initializeSession = async () => {
      try {
        const token = getStoredToken();
        if (token) {
          try {
            const userData = await getStoredUserData();
            if (userData) {
              setAuthData((prev) => ({
                ...prev,
                user: userData,
                accessToken: token,
                isAuthenticated: true,
              }));
            } else {
              setAuthData((prev) => ({
                ...prev,
                accessToken: token,
                isAuthenticated: false,
              }));
            }
          } catch (userDataError) {
            console.error("Failed to get user data:", userDataError);
            localStorage.removeItem("token");
          }
        }
      } catch (error) {
        console.error("Session initialization failed:", error);
        localStorage.removeItem("token");
      } finally {
        setAuthData((prev) => ({ ...prev, isLoading: false }));
      }
    };

    initializeSession();
  }, []);

  const setAuthDataExternal = (data) => {
    if (data.token || data.accessToken) {
      const token = data.token || data.accessToken;
      localStorage.setItem("token", token);
    }

    setAuthData((prev) => ({
      ...prev,
      user: data.user || prev.user,
      accessToken: data.token || data.accessToken || prev.accessToken,
      isAuthenticated: !!(data.token || data.accessToken || prev.accessToken),
    }));
  };

  const loginUser = async (username, password) => {
    try {
      setAuthData((prev) => ({ ...prev, isLoading: true }));
      const result = await authLogin({ username, password });
      
      if (result.token) {
        localStorage.setItem("token", result.token);
      }
      
      const userData = await getStoredUserData();
      if (!userData) {
        throw new Error("Failed to fetch user data");
      }
      
      setAuthData((prev) => ({
        ...prev,
        user: userData,
        accessToken: result.token,
        isAuthenticated: true,
        isLoading: false,
      }));
             
      return { success: true, user: userData };
    } catch (error) {
      setAuthData((prev) => ({ ...prev, isLoading: false }));
      return { success: false, message: error.message || "Login failed" };
    }
  };

  const logout = async () => {
    try {
      localStorage.removeItem("token");
      setAuthData({
        user: null,
        accessToken: null,
        isAuthenticated: false,
        isLoading: false,
      });
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const contextValue = {
    user: authData.user,
    accessToken: authData.accessToken,
    isAuthenticated: authData.isAuthenticated,
    isLoading: authData.isLoading,
    setAuthData: setAuthDataExternal,
    login: loginUser,
    logout,
  };

  return (
    <AppContext.Provider value={contextValue}>{children}</AppContext.Provider>
  );
};

export default AppContextProvider;