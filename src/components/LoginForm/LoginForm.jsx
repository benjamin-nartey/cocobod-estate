import React from "react";
import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import api from "../../axios/axios";
import axios from "axios";
import useAuth from "../../Hooks/useAuth";
import { useLocalStorage } from "../../Hooks/useLocalStorage";

const defaultFormFields = {
  email: "",
  password: "",
};

function LoginForm() {
  const [formFields, setFormfields] = useState(defaultFormFields);
  const { email, password } = formFields;
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [ipAddress, setIPAddress] = useState("");

  const [accessTokenAuth, setAccessTokenAuth] = useLocalStorage(
    "accessToken",
    null
  );
  const [refreshTokenAuth, setRefreshTokenAuth] = useLocalStorage(
    "refreshToken",
    null
  );

  const { setTokens, setAuthState } = useAuth();

  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/home";

  // useEffect(() => {
  //   if (userAccess) {
  //     navigate(location.state?.from?.pathname, { replace: true });
  //   }
  // }, []);

  useEffect(() => {
    axios
      .get("https://ipapi.co/json")
      .then((response) => response.data)
      .then((data) => setIPAddress(data.ip))
      .catch((error) => console.log(error));
  }, []);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormfields({ ...formFields, [name]: value });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const response = await axios.post(
        "https://cocobod-estates-api.onrender.com/api/v1/auth",
        { email, password },
        {
          headers: {
            "Content-Type": "application/json",
            "X-IP-Address": ipAddress,
          },
        }
      );

      const userResponse = await axios.get(
        "https://cocobod-estates-api.onrender.com/api/v1/auth/user",

        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${response?.data?.accessToken}`,
          },
        }
      );

      const currentUser = userResponse?.data;

      setAuthState({ currentUser });

      console.log(userResponse);

      setAccessTokenAuth(response?.data?.accessToken);
      setRefreshTokenAuth(response?.data?.refreshToken);
      setTokens(response?.data?.accessToken);

      console.log("response", response.data);

      navigate(from, { replace: true });
    } catch (error) {
      console.log(error);
    }
  };

  console.log(formFields);

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        name="email"
        value={email}
        placeholder="Enter Email"
        className="w-full h-[35px] pl-2 bg-transparent border-b-[1px] border-solid border-[#6E431D] max-md:border-white max-md:placeholder:text-white focus:outline-none focus:border-b-[2px] mb-4 max-md:text-white"
        onChange={handleChange}
      />
      <input
        type="password"
        name="password"
        value={password}
        placeholder="Enter Password"
        className="w-full h-[35px] pl-2 bg-transparent border-b-[1px] border-solid border-[#6E431D] max-md:border-white  max-md:placeholder:text-white focus:outline-none focus:border-b-[2px] mb-4 max-md:text-white"
        onChange={handleChange}
      />
      <button className="max-md:bg-white max-md:text-[#6E431D] max-md:hover:bg-white w-full h-[35px] outline-none bg-[#6E431D] text-white rounded mb-2 hover:bg-[#B67F4E] hover:font-black hover:translate-y-[-2px] active:translate-y-[3px] transition-all hover:shadow-md active:shadow-sm">
        Login
      </button>
    </form>
  );
}

export default LoginForm;
