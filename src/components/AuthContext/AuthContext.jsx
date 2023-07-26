import { useState, createContext, useEffect } from "react";
import { useLocalStorage } from "../../Hooks/useLocalStorage";
import axiosInstance from "../../axios/axiosInstance";
import { useNavigate, useLocation } from "react-router-dom";

export const AuthContext = createContext({
  authState: {},
  setAuthState: () => {},
  tokens: null,
  setTokens: () => {},
  userAccess: false,
  setUserAccess: () => false,
});

export const AuthProvider = ({ children }) => {
  const [authState, setAuthState] = useState({});
  const [tokens, setTokens] = useLocalStorage("accessToken", null);
  const [userAccess, setUserAccess] = useState(false);
    const [newAuthState, setNewAuthState] = useLocalStorage("authState", null);

  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname;

  const fetchUser = async () => {
    const response = await axiosInstance.get("/auth/user");
    if (response.status === 200) {
      console.log("fetched", response.data);

      const currentUser = response?.data;
      setAuthState({ currentUser });
      console.log({ authState });
        setNewAuthState({ currentUser });
      setUserAccess(true);
      navigate(from, { replace: true });
    }
  };

  useEffect(() => {
    fetchUser();
    console.log({ authState });
    console.log({ tokens });
  }, [tokens]);

  const value = { authState, setAuthState, setTokens, userAccess };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
