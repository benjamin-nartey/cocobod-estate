import React, { useState } from "react";
import { Button, Popconfirm } from "antd";
import { QuestionCircleOutlined } from "@ant-design/icons";
import { AiOutlinePoweroff } from "react-icons/ai";
import { useNavigate, useLocation } from "react-router-dom";
import { useLocalStorage } from "../../Hooks/useLocalStorage";
import axios from "axios";
// import useAuth from "../../Hooks/useAuth";

const Logout = () => {
  const [open, setOpen] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [refreshToken, setRefreshToken] = useLocalStorage("refreshToken", null);
  const [authState, setAuthState] = useLocalStorage("authState", null);
  const [accessToken, setAccessToken] = useLocalStorage("accessToken", null);

  const location = useLocation();
  const navigate = useNavigate();
  const from = location.state?.from?.pathname || "/login";

  //   const { logout } = useAuth();

  const showPopconfirm = () => {
    setOpen(true);
  };
  const handleLogout = async () => {
    setConfirmLoading(true);
    const response = await axios.delete(
      "https://cocobod-estates-api.onrender.com/api/v1/auth",
      {
        headers: {
          Authorization: `Bearer ${refreshToken}`,
        },
      }
    );
    setOpen(false);
    setConfirmLoading(false);
    console.log({ response });
    setAuthState(null);
    setRefreshToken(null);
    setAccessToken(null);
    navigate(from, { replace: true });
  };

  const handleOk = () => {
    handleLogout();
  };

  const handleCancel = () => {
    setOpen(false);
  };

  return (
    <Popconfirm
      title="Logout"
      description="Are you sure you want to logout?"
      open={open}
      okType="default"
      onConfirm={handleOk}
      okButtonProps={{ loading: confirmLoading }}
      onCancel={handleCancel}
    >
      <p onClick={showPopconfirm}>
        <AiOutlinePoweroff className="text-[25px] text-red-300 cursor-pointer rounded-full hover:bg-white hover:shadow-md" />
      </p>
    </Popconfirm>
  );
};

export default Logout;
