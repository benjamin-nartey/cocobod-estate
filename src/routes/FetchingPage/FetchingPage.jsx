import { useState } from "react";

import Sidebar from "../../components/Sidebar/Sidebar";
import logo from "../../assets/logo-cocobod.png";
import navBg from "../../assets/navbg.png";
import { Logout } from "../../utils/logout";
import { useLocalStorage } from "../../Hooks/useLocalStorage";
import { getContrastingColor } from "../../config/helpers";
import state from "../../store/store";

import { HiMenu } from "react-icons/hi";
import { AiFillCloseCircle, AiOutlinePoweroff } from "react-icons/ai";
import { MdOutlineKeyboardArrowDown } from "react-icons/md";

import { Outlet } from "react-router-dom/dist";
import { useNavigate, useLocation } from "react-router-dom";

import { useSnapshot } from "valtio";

function FetchingPage() {
  const [toggleSidebar, setToggleSidebar] = useState(false);
  const [toggleLogout, setToggleLogout] = useState(false);
  const [loading, setLoading] = useState(false);
  const [refreshToken, setRefreshToken] = useLocalStorage("refreshToken", null);
  const [accessToken, setAccessToken] = useLocalStorage("accessToken", null);
  const [avatarBackground, setAvatarBackground] = useState(getRandomColor());
  const [avatarText, setAvatarText] = useState(
    getContrastingColor(avatarBackground)
  );

  const snap = useSnapshot(state);

  const currentUser = snap.auth.currentUser;

  const location = useLocation();
  const navigate = useNavigate();
  const from = location.state?.from?.pathname || "/login";

  const handleLogout = () => {
    Logout();
    navigate(from, { replace: true });
  };

  function getRandomColor() {
    const letters = "0123456789ABCDEF";
    let color = "#";
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  }

  return (
    <>
      <div className="absolute right-8 top-16 z-[99]">
        {toggleLogout && (
          <button
            onClick={handleLogout}
            className="px-4 py-2 bg-white rounded-md text-base font-medium flex items-center justify-center gap-2 max-md:hidden"
          >
            <AiOutlinePoweroff /> Logout
          </button>
        )}
      </div>
      <div className="flex bg-[#F4EDE7] max-md:flex-col min-h-screen transition-height duration-75 ease-out overflow-hidden  ">
        <div className="flex flex-initial h-screen max-md:hidden">
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
          </div>
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
                <div className=" fixed top-5 right-10 block max-md:hidden">
                  <div className="flex items-center gap-4 max-md:gap-2">
                    <div
                      style={{
                        backgroundColor: `${avatarBackground}`,
                        color: `${avatarText}`,
                      }}
                      className={`w-10 h-10 text-center  text-white max-md:text-sm rounded-full grid place-items-center font-bold uppercase`}
                    >
                      {currentUser?.name[0]}
                    </div>
                    <div className="flex flex-col ">
                      <div className="text-[14px] text-gray-200">
                        {currentUser?.name}
                      </div>
                      <div className="text-xs text-gray-300">
                        {currentUser?.email}
                      </div>
                    </div>
                    <div>
                      <button onClick={() => setToggleLogout(!toggleLogout)}>
                        <MdOutlineKeyboardArrowDown size={24} color="#fff" />
                      </button>
                    </div>
                  </div>
                </div>
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
    </>
  );
}

export default FetchingPage;
