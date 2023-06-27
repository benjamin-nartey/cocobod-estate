import React from "react";
import Sidebar from "../../components/Sidebar/Sidebar";
import navBg from "../../assets/navbg.png";
import { HiMenu } from "react-icons/hi";
import { FaMapMarkerAlt } from "react-icons/fa";
import { useState } from "react";
import { AiFillCloseCircle } from "react-icons/ai";
import { Outlet } from "react-router-dom/dist";

function Navigation() {
  const [toggleSidebar, setToggleSidebar] = useState(false);

  return (
    <div className="flex bg-[#F4EDE7] max-md:flex-col min-h-screen transition-height duration-75 ease-out overflow-hidden  ">
      <div className="flex flex-initial h-screen max-md:hidden">
        <Sidebar />
      </div>
      <div className="main-content-column h-screen w-full overflow-y-auto overflow-x-hidden">
        <div
          style={{
            backgroundImage: `url(${navBg})`,
          }}
          className="bg-cover navigation flex h-[18vh] w-full justify-between items-center shadow-md sticky top-0 z-10"
        >
          <div
            style={{ backgroundColor: "rgba(0,0,0,0.4)" }}
            className="w-full h-full p-5"
          >
            <div className="w-full flex justify-between items-center">
              <HiMenu
                onClick={() => setToggleSidebar(true)}
                className="text-[25px] text-white cursor-pointer hidden max-md:block"
              />
              {/* <div className="w-[25px] h-[25px] bg-white grid place-items-center rounded-full">
              <FaMapMarkerAlt className="text-[16px] text-[#6E431D] cursor-pointer " />
            </div> */}
            </div>
          </div>
        </div>
        <Outlet />
      </div>
      {toggleSidebar && (
        <div className="fixed w-4/5 bg-white h-screen overflow-y-auto shadow-md z-10 animate-slide-in">
          <div className="absolute w-full flex justify-end items-center p-2">
            <AiFillCloseCircle
              fontSize={30}
              className="cursor-pointer text-[#6E431D] "
              onClick={() => setToggleSidebar(false)}
            />
          </div>
          <Sidebar closeToggle={setToggleSidebar} />
        </div>
      )}
    </div>
  );
}

export default Navigation;
