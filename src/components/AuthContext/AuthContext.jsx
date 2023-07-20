import { useState, createContext } from "react";

export const AuthContext = createContext({
  authState: {},
  setAuthState: () => {},
});

export const AuthProvider = ({ children }) => {
  const [authState, setAuthState] = useState({});

  const value = { authState, setAuthState };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
