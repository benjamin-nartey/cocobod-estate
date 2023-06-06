import React from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../axios/axios";

const defaultFormFields = {
  email: "",
  password: "",
};

function LoginForm() {
  const [formFields, setFormfields] = useState(defaultFormFields);
  const { email, password } = formFields;
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormfields({ ...formFields, [name]: value });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await api.get("/users", { params: { email, password } });
      if (response.data.length === 1) {
        setIsAuthenticated(true);
      } else {
        alert("Invalid credentials!");
      }
      console.log(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  if (isAuthenticated) {
    navigate("/home");
  }

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
