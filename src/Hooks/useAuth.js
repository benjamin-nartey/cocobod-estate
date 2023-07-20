import { useContext } from "react";
import { AuthContext } from "../components/AuthContext/AuthContext";

const useAuth = () => {
  return useContext(AuthContext);
};

export default useAuth;
