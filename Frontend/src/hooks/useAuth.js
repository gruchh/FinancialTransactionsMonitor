import { useAppContext } from "../context/AppContext";

export const useAuth = () => {
  const { user, isAuthenticated, isLoading, login, logout } = useAppContext();
  
  return {
    user,
    isAuthenticated,
    isLoading,
    login,
    logout,
  };
};