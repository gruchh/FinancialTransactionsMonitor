import { createContext, useState, useEffect } from "react";

export const AppContext = createContext(null);

const AppContextProvider = (props) => {
  const [auth, setAuth] = useState({
    token: null,
    role: null,
  });

  useEffect(() => {
    const savedToken = localStorage.getItem("token");
    const savedRole = localStorage.getItem("role");

    if (savedToken && savedRole) {
      setAuth({
        token: savedToken,
        role: savedRole,
      });
    }
  }, []);

  const setAuthData = (token, role) => {
    setAuth({
      token: token,
      role: role,
    });
  };

  const logout = () => {
    setAuth({
      token: null,
      role: null,
    });
    localStorage.removeItem("token");
    localStorage.removeItem("role");
  };

  const contextValue = {
    auth,
    setAuthData,
    logout
  };

  return (
    <AppContext.Provider value={contextValue}>
      {props.children}
    </AppContext.Provider>
  );
};

export default AppContextProvider;