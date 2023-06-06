import React from "react";
import { NavLink } from "react-router-dom";
import { AiFillHome } from "react-icons/ai";
import { BiTimeFive } from "react-icons/bi";
import { GiAutoRepair } from "react-icons/gi";
import { MdOutlineReceipt } from "react-icons/md";
import { IoMdMap } from "react-icons/io";
import { GiHouseKeys } from "react-icons/gi";
import logo from "../../assets/logo-cocobod.png";
import { ReactComponent as SidebarImage } from "../../assets/sidebarImg.svg";

function Sidebar({ closeToggle }) {
  const handleCloseSidebar = () => {
    if (closeToggle) closeToggle(false);
  };

  const isNotActiveStyle =
    "px-5 py-2 flex items-center text-white gap-3 w-full hover:bg-[#c9976c] hover:font-semibold transition-all duration-200 ease-in-out capitalize";
  const isActiveStyle =
    "px-5 py-2 flex items-center text-white gap-3 bg-[#B67F4E] font-bold w-full transition-all duration-200 ease-in-out capitalize";

  const isNotActiveStyleSpanText =
    "px-5 py-2 flex items-start text-white gap-3 w-full hover:bg-[#c9976c] hover:font-semibold transition-all duration-200 ease-in-out capitalize";
  const isActiveStyleSpanText =
    "px-5 py-2 flex items-start text-white gap-3 bg-[#B67F4E] font-bold w-full transition-all duration-200 ease-in-out capitalize";

  return (
    <div
      style={{ minWidth: "210px" }}
      className="flex flex-col justify-between bg-[#6E431D] h-full overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:'none'] [scrollbar-width:'none']"
    >
      <div className="flex flex-col">
        <div className="w-full h-[120px] bg-[#F4EDE7] grid place-items-center px-5">
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
        <div className="pt-4 flex flex-col gap-4 text-[15px]">
          <NavLink
            to="/home"
            className={({ isActive }) =>
              isActive ? isActiveStyle : isNotActiveStyle
            }
            onClick={handleCloseSidebar}
          >
            <AiFillHome />
            Home
          </NavLink>
          <NavLink
            to="/tenantRate"
            className={({ isActive }) =>
              isActive ? isActiveStyleSpanText : isNotActiveStyleSpanText
            }
            onClick={handleCloseSidebar}
          >
            <BiTimeFive />
            <p>
              <span className="block">Tenant Rate</span>
              <span className="block">Schedule</span>
            </p>
          </NavLink>
          <NavLink
            to="/maintenance"
            className={({ isActive }) =>
              isActive ? isActiveStyleSpanText : isNotActiveStyleSpanText
            }
            onClick={handleCloseSidebar}
          >
            <GiAutoRepair />
            <p>
              <span className="block">Maintenance</span>
              <span className="block">Scheme</span>
            </p>
          </NavLink>
          <NavLink
            to="/recommendation"
            className={({ isActive }) =>
              isActive ? isActiveStyleSpanText : isNotActiveStyleSpanText
            }
            onClick={handleCloseSidebar}
          >
            <MdOutlineReceipt />
            <p>
              <span className="block">Summary of</span>
              <span className="block">Recommendation</span>
            </p>
          </NavLink>
          <NavLink
            to="/map"
            className={({ isActive }) =>
              isActive ? isActiveStyle : isNotActiveStyle
            }
            onClick={handleCloseSidebar}
          >
            <IoMdMap />
            Map
          </NavLink>
          <NavLink
            to="/Accomodation"
            className={({ isActive }) =>
              isActive ? isActiveStyle : isNotActiveStyle
            }
            onClick={handleCloseSidebar}
          >
            <GiHouseKeys />
            Accomodation
          </NavLink>
        </div>
        <div className="w-full px-4 my-8 grid place-items-center">
          <SidebarImage className="w-[150px] h-auto" />
        </div>
      </div>
    </div>
  );
}

export default Sidebar;
