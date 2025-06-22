import { createContext, useContext, useEffect, useState } from "react";
import { getStoredToken } from "../service/api";
import { authService } from "../service/AuthService";

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
            const userData = await authService.getCurrentUser();
            console.log("User data fetched successfully:", userData);
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

  const loginUser = async (credentials) => {
    try {
      console.log("Attempting to log in with:", credentials);
      setAuthData((prev) => ({ ...prev, isLoading: true }));
      const result = await authService.login(credentials);
      console.log("Login result:", result);
      
      if (!result || (!result.token && !result.accessToken)) {
        throw new Error("No authentication token received");
      }
      
      const token = result.accessToken || result.token;
      localStorage.setItem("token", token);
      
      const userData = await authService.getCurrentUser();
      
      if (!userData) {
        throw new Error("Failed to fetch user data after login");
      }
      
      setAuthData((prev) => ({
        ...prev,
        user: userData,
        accessToken: token,
        isAuthenticated: true,
        isLoading: false,
      }));
             
      return { success: true, user: userData };
    } catch (error) {
      console.error("Login error in context:", error);
      setAuthData((prev) => ({ ...prev, isLoading: false }));
      localStorage.removeItem("token");
      
      return { 
        success: false, 
        message: error.message || "Login failed" 
      };
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
    login: loginUser,
    logout,
  };

  return (
    <AppContext.Provider value={contextValue}>{children}</AppContext.Provider>
  );
};

export default AppContextProvider;