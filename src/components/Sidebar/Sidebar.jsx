import React from "react";
import { NavLink } from "react-router-dom";
import { AiFillHome } from "react-icons/ai";
import { BiTimeFive } from "react-icons/bi";
import { GiAutoRepair } from "react-icons/gi";
import { MdDashboard, MdOutlineReceipt } from "react-icons/md";
import { IoMdMap } from "react-icons/io";
import { GiHouseKeys } from "react-icons/gi";
import logo from "../../assets/logo-cocobod.png";
import { ReactComponent as SidebarImage } from "../../assets/sidebarImg.svg";
import { PoweroffOutlined } from "@ant-design/icons";
import { useLocalStorage } from "../../Hooks/useLocalStorage";
import { useNavigate, useLocation } from "react-router-dom";
import { useState } from "react";
import axios from "axios";
import state from "../../store/store";

function Sidebar({ closeToggle }) {
  const [refreshToken, setRefreshToken] = useLocalStorage("refreshToken", null);
  const [accessToken, setAccessToken] = useLocalStorage("accessToken", null);
  const [loading, setLoading] = useState(false);

  const location = useLocation();
  const navigate = useNavigate();
  const from = location.state?.from?.pathname || "/login";

  const handleCloseSidebar = () => {
    if (closeToggle) closeToggle(false);
  };

  const handleLogout = async () => {
    try {
      setLoading(true);
      const response = await axios.delete(
        "https://cocobod-estates-api.onrender.com/api/v1/auth",
        {
          headers: {
            Authorization: `Bearer ${refreshToken}`,
          },
        }
      );

      state.currentUser = {};
      setRefreshToken(null);
      setAccessToken(null);
      navigate(from, { replace: true });
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const isNotActiveStyle =
    "px-5 py-2 flex items-center text-white gap-3 w-full hover:bg-[#c9976c] hover:font-semibold transition-all duration-200 ease-in-out capitalize";
  const isActiveStyle =
    "px-5 py-2 flex items-center text-white gap-3 bg-[#B67F4E] font-bold w-full transition-all duration-200 ease-in-out capitalize";

  // const isNotActiveStyle =
  //   "px-5 py-2 flex items-start text-white gap-3 w-full hover:bg-[#c9976c] hover:font-semibold transition-all duration-200 ease-in-out capitalize";
  // const isActiveStyle =
  //   "px-5 py-2 flex items-start text-white gap-3 bg-[#B67F4E] font-bold w-full transition-all duration-200 ease-in-out capitalize";

  return (
    <div
      style={{ minWidth: "220px" }}
      className="flex flex-col justify-between bg-[#6E431D] h-full overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:'none'] [scrollbar-width:'none']"
    >
      <div className="w-full h-[18vh] bg-[#F4EDE7] grid place-items-center px-5">
        <div className=" logo-box flex justify-center items-center gap-2 ">
          <img className="w-[45px] h-auto " src={logo} alt="logo" />
          <div className="line w-[1.2px] h-[25px] bg-[#6E431D] "></div>
          <h4 className="">
            <span className="block text-[12px] text-[#6E431D] font-semibold">
              Ghana Cocoa Board
            </span>
          </h4>
        </div>
      </div>
      <div className="flex flex-col h-[82%] justify-between gap-8 py-3">
        <nav className="flex flex-col gap-4 text-[15px] ">
          <NavLink
            to="/home"
            className={({ isActive }) =>
              isActive ? isActiveStyle : isNotActiveStyle
            }
            onClick={handleCloseSidebar}
          >
            <AiFillHome size={18} />
            Home
          </NavLink>
          <NavLink
            to="/dashboard"
            className={({ isActive }) =>
              isActive ? isActiveStyle : isNotActiveStyle
            }
            onClick={handleCloseSidebar}
          >
            <MdDashboard size={18} />
            Dasboard
          </NavLink>
          <NavLink
            to="/tenancy"
            className={({ isActive }) =>
              isActive ? isActiveStyleSpanText : isNotActiveStyle
            }
            onClick={handleCloseSidebar}
          >
            <BiTimeFive size={18} />
            Tenancy
          </NavLink>
          <NavLink
            to="/maintenance"
            className={({ isActive }) =>
              isActive ? isActiveStyle : isNotActiveStyle
            }
            onClick={handleCloseSidebar}
          >
            <GiAutoRepair size={18} />
            Maintenance
          </NavLink>
          <NavLink
            to="/reports"
            className={({ isActive }) =>
              isActive ? isActiveStyle : isNotActiveStyle
            }
            onClick={handleCloseSidebar}
          >
            <MdOutlineReceipt size={18} />
            Reports
          </NavLink>
          <NavLink
            to="/map"
            className={({ isActive }) =>
              isActive ? isActiveStyle : isNotActiveStyle
            }
            onClick={handleCloseSidebar}
          >
            <IoMdMap size={18} />
            Map
          </NavLink>
          <NavLink
            role="button"
            to="/loadingPage"
            className={({ isActive }) =>
              isActive
                ? `${isActiveStyle} hidden max-md:flex`
                : `${isNotActiveStyle} hidden max-md:flex`
            }
            onClick={handleLogout}
          >
            <PoweroffOutlined size={18} />
            Logout
          </NavLink>
        </nav>
        <div className="w-full px-4 mt-8 grid place-items-center">
          <SidebarImage className="w-[150px] h-auto" />
        </div>
      </div>
    </div>
  );
}

export default Sidebar;
