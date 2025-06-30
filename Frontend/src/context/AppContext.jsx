import { createContext, useContext, useEffect, useReducer } from "react";
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

export const AUTH_ACTIONS = {
  SET_LOADING: "SET_LOADING",
  SET_USER: "SET_USER",
  SET_TOKEN: "SET_TOKEN",
  SET_AUTHENTICATED: "SET_AUTHENTICATED",
  LOGIN_SUCCESS: "LOGIN_SUCCESS",
  LOGIN_FAILURE: "LOGIN_FAILURE",
  LOGOUT: "LOGOUT",
  CLEAR_ERROR: "CLEAR_ERROR",
  SET_ERROR: "SET_ERROR",
};

const initialState = {
  user: null,
  accessToken: null,
  isAuthenticated: false,
  isLoading: true,
  error: null,
};

const authReducer = (state, action) => {
  switch (action.type) {
    case AUTH_ACTIONS.SET_LOADING:
      return { ...state, isLoading: action.payload };
    
    case AUTH_ACTIONS.SET_USER:
      return { ...state, user: action.payload };
    
    case AUTH_ACTIONS.SET_TOKEN:
      return { ...state, accessToken: action.payload };
    
    case AUTH_ACTIONS.SET_AUTHENTICATED:
      return { ...state, isAuthenticated: action.payload };
    
    case AUTH_ACTIONS.LOGIN_SUCCESS:
      return {
        ...state,
        user: action.payload.user,
        accessToken: action.payload.token,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      };
    
    case AUTH_ACTIONS.LOGIN_FAILURE:
      return {
        ...state,
        user: null,
        accessToken: null,
        isAuthenticated: false,
        isLoading: false,
        error: action.payload,
      };
    
    case AUTH_ACTIONS.LOGOUT:
      return {
        ...state,
        user: null,
        accessToken: null,
        isAuthenticated: false,
        isLoading: false,
        error: null,
      };
    
    case AUTH_ACTIONS.SET_ERROR:
      return { ...state, error: action.payload };
    
    case AUTH_ACTIONS.CLEAR_ERROR:
      return { ...state, error: null };
    
    default:
      return state;
  }
};

const AppContextProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  useEffect(() => {
    const initializeSession = async () => {
      try {
        const token = getStoredToken();
        if (token) {
          try {
            const userData = await authService.getCurrentUser();            
            if (userData) {
              dispatch({
                type: AUTH_ACTIONS.LOGIN_SUCCESS,
                payload: { user: userData, token }
              });
            } else {
              dispatch({
                type: AUTH_ACTIONS.SET_TOKEN,
                payload: token
              });
              dispatch({
                type: AUTH_ACTIONS.SET_AUTHENTICATED,
                payload: false
              });
            }
          } catch (userDataError) {
            console.error("Failed to get user data:", userDataError);
            localStorage.removeItem("token");
            dispatch({
              type: AUTH_ACTIONS.SET_ERROR,
              payload: "Failed to fetch user data"
            });
          }
        }
      } catch (error) {
        console.error("Session initialization failed:", error);
        localStorage.removeItem("token");
        dispatch({
          type: AUTH_ACTIONS.SET_ERROR,
          payload: "Session initialization failed"
        });
      } finally {
        dispatch({
          type: AUTH_ACTIONS.SET_LOADING,
          payload: false
        });
      }
    };

    initializeSession();
  }, []);

  const loginUser = async (credentials) => {
    try {
      dispatch({ type: AUTH_ACTIONS.SET_LOADING, payload: true });
      
      const result = await authService.login(credentials);
      
      if (!result || (!result.token && !result.accessToken)) {
        throw new Error("No authentication token received");
      }
      
      const token = result.accessToken || result.token;
      localStorage.setItem("token", token);
      
      const userData = await authService.getCurrentUser();
      
      if (!userData) {
        throw new Error("Failed to fetch user data after login");
      }
      
      dispatch({
        type: AUTH_ACTIONS.LOGIN_SUCCESS,
        payload: { user: userData, token }
      });
             
      return { success: true, user: userData };
    } catch (error) {
      console.error("Login error in context:", error);
      localStorage.removeItem("token");
      
      dispatch({
        type: AUTH_ACTIONS.LOGIN_FAILURE,
        payload: error.message || "Login failed"
      });
      
      return { 
        success: false, 
        message: error.message || "Login failed" 
      };
    }
  };

  const logout = async () => {
    try {
      localStorage.removeItem("token");
      dispatch({ type: AUTH_ACTIONS.LOGOUT });
    } catch (error) {
      console.error("Logout failed:", error);
      dispatch({
        type: AUTH_ACTIONS.SET_ERROR,
        payload: "Logout failed"
      });
    }
  };

  const contextValue = {
    user: state.user,
    accessToken: state.accessToken,
    isAuthenticated: state.isAuthenticated,
    isLoading: state.isLoading,
    error: state.error,
    login: loginUser,
    logout,
    dispatch,
    clearError: () => dispatch({ type: AUTH_ACTIONS.CLEAR_ERROR }),
  };

  return (
    <AppContext.Provider value={contextValue}>{children}</AppContext.Provider>
  );
};

export default AppContextProvider;