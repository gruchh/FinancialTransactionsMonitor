import { createContext, useState, useEffect, useContext } from "react";
import { 
  getStoredUserData, 
  getStoredToken, 
  logout as authLogout,
  login as authLogin 
} from "../service/AuthService";

export const AppContext = createContext(null);

export const useAppContext = () => {
  return useContext(AppContext);
};

const AppContextProvider = ({ children }) => {
  const [auth, setAuth] = useState({
    token: null,
    user: null,
    isAuthenticated: false,
    isLoading: true,
  });

  useEffect(() => {
    const initializeAuth = () => {
      try {
        const token = getStoredToken();
        const userData = getStoredUserData();

        if (token && userData) {
          setAuth({
            token,
            user: userData,
            isAuthenticated: true,
            isLoading: false,
          });
        } else {
          setAuth({
            token: null,
            user: null,
            isAuthenticated: false,
            isLoading: false,
          });
        }
      } catch (error) {
        console.error("Błąd inicjalizacji autoryzacji:", error);
        setAuth({
          token: null,
          user: null,
          isAuthenticated: false,
          isLoading: false,
        });
      }
    };

    initializeAuth();
  }, []);

  const login = async (credentials) => {
    try {
      setAuth(prev => ({ ...prev, isLoading: true }));

      const userData = await authLogin(credentials);
      const token = getStoredToken();

      setAuth({
        token,
        user: userData,
        isAuthenticated: true,
        isLoading: false,
      });

      return userData;
    } catch (error) {
      setAuth({
        token: null,
        user: null,
        isAuthenticated: false,
        isLoading: false,
      });
      throw error;
    }
  };

  const setAuthData = (token, roles, additionalUserData = {}) => {
    const userData = {
      roles,
      ...additionalUserData
    };

    setAuth({
      token,
      user: userData,
      isAuthenticated: true,
      isLoading: false,
    });
  };

  const logout = () => {
    authLogout();
    setAuth({
      token: null,
      user: null,
      isAuthenticated: false,
      isLoading: false,
    });
  };

  const getPrimaryRole = () => {
    if (!auth.user?.roles || auth.user.roles.length === 0) return null;

    const roleHierarchy = ["ADMIN", "TRADER"];
    return auth.user.roles.find(role => roleHierarchy.includes(role)) || auth.user.roles[0];
  };

  const contextValue = {
    auth,    
    login,
    logout,
    setAuthData,
    getPrimaryRole, 
    isAuthenticated: auth.isAuthenticated,
    isLoading: auth.isLoading,
    user: auth.user,
    token: auth.token,
    roles: auth.user?.roles || [],
    primaryRole: getPrimaryRole(),
  };

  return (
    <AppContext.Provider value={contextValue}>
      {children}
    </AppContext.Provider>
  );
};

export default AppContextProvider;