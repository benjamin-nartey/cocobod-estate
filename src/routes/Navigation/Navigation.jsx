import { Fragment, useState } from "react";

import {
  HiArrowDown,
  HiArrowLeft,
  HiArrowNarrowLeft,
  HiMenu,
} from 'react-icons/hi';
import { MdOutlineArrowLeft, MdOutlineKeyboardArrowDown } from 'react-icons/md';
import {
  AiFillCloseCircle,
  AiOutlineArrowLeft,
  AiOutlineDown,
  AiOutlinePoweroff,
} from "react-icons/ai";

import Sidebar from "../../components/Sidebar/Sidebar";
import navBg from "../../assets/navbg.png";
import { LogoutContext } from "../../context/logout.context";
import { useLocalStorage } from "../../Hooks/useLocalStorage";
import { useContext } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { getContrastingColor } from "../../config/helpers";
import state from "../../store/store";
import Loader from "../../components/Loader/Loader";

import { useSnapshot } from 'valtio';
import { Outlet } from 'react-router-dom/dist';
import { GiArrowDunk, GiArrowFlights } from 'react-icons/gi';

function Navigation() {
  const [toggleSidebar, setToggleSidebar] = useState(false);
  const [toggleLogout, setToggleLogout] = useState(false);
  const [refreshToken, setRefreshToken] = useLocalStorage("refreshToken", null);
  const [accessToken, setAccessToken] = useLocalStorage("accessToken", null);
  const [avatarBackground, setAvatarBackground] = useState(getRandomColor());
  const [avatarText, setAvatarText] = useState(
    getContrastingColor(avatarBackground)
  );

  const location = useLocation();

  const navigate = useNavigate();

  const { logout } = useContext(LogoutContext);

  const snap = useSnapshot(state);
  function getRandomColor() {
    const letters = "0123456789ABCDEF";
    let color = "#";
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  }

  return (
    <Fragment>
      <div className="absolute right-8 top-16 z-[99]">
        {toggleLogout && (
          <button
            onClick={logout}
            className="px-4 py-2 z-50 bg-white rounded-md text-base font-medium flex items-center justify-center gap-2 max-md:hidden"
          >
            {snap.auth.loadingState ? (
              <>
                {" "}
                <Loader
                  width="w-5"
                  height="h-5"
                  fillColor="fill-[#6E431D]"
                />{" "}
                Loging...
              </>
            ) : (
              <>
                <AiOutlinePoweroff size={18} /> Logout
              </>
            )}
          </button>
        )}
      </div>
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
              className="w-full relative h-full p-5"
            >
              <div className="flex flex-col absolute left-6 bottom-[1rem] text-gray-300 md:hidden">
                  <span className="font-semibold text-base">
                    {snap?.auth?.currentUser?.name}
                  </span>
                  <span className="font-normal text-sm">
                    {snap?.auth?.currentUser?.deployedRegion?.name}
                  </span>
                </div>
              <div className="w-full flex justify-between items-center">
                <div
                  className="flex items-center gap-2 cursor-pointer"
                  onClick={() => navigate(-1)}
                >
                  <HiArrowLeft className="text-white cursor-pointer" />
                  <span className="text-white/75">Back</span>
                </div>
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
                      {snap?.auth?.currentUser?.name[0]}
                    </div>
                    <div className="flex flex-col ">
                      <div className="text-[14px] text-gray-200">
                        {snap?.auth?.currentUser?.name}
                      </div>
                      <div className="text-xs text-gray-300">
                        {snap?.auth?.currentUser?.email}
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
            <div className="absolute w-full flex justify-end items-center p-2 z-20">
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
    </Fragment>
  );
}

export default Navigation;
