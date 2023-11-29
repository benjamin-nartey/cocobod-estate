import React from 'react';
import { NavLink } from 'react-router-dom';
import { useNavigate, useLocation } from 'react-router-dom';

import { AiFillHome } from 'react-icons/ai';
import { AiFillCalendar } from 'react-icons/ai';
import { BiTimeFive } from 'react-icons/bi';
import { GiAutoRepair } from 'react-icons/gi';
import {
  MdAreaChart,
  MdDashboard,
  MdLocationPin,
  MdOutlineReceipt,
  MdOutlineSafetyDivider,
  MdProductionQuantityLimits,
  MdWorkspacePremium,
} from 'react-icons/md';
import { IoMdMap } from 'react-icons/io';
import { BsFillBuildingsFill } from 'react-icons/bs';
import { PoweroffOutlined } from '@ant-design/icons';
import { HiArrowsExpand, HiScissors, HiUsers } from 'react-icons/hi';

import logo from '../../assets/logo-cocobod.png';
import { ReactComponent as SidebarImage } from '../../assets/sidebarImg.svg';
import { Logout } from '../../utils/logout';
import Loader from '../Loader/Loader';

import { useSnapshot } from 'valtio';

import state from '../../store/store';

function Sidebar({ closeToggle }) {
  const allowedRoles = ['Super Administrator', 'Divisional Administrator'];
  const snap = useSnapshot(state);

  const location = useLocation();
  const navigate = useNavigate();
  const from = location.state?.from?.pathname || '/login';

  const handleLogout = async () => {
    const response = await Logout();
    if (!response) return;

    navigate(from, { replace: true });
  };

  const handleCloseSidebar = () => {
    if (closeToggle) closeToggle(false);
  };

  const isNotActiveStyle =
    'px-5 py-2 flex items-center text-white gap-3 w-full hover:bg-[#c9976c] hover:font-semibold transition-all duration-200 ease-in-out capitalize';
  const isActiveStyle =
    'px-5 py-2 flex items-center text-white gap-3 bg-[#B67F4E] font-bold w-full transition-all duration-200 ease-in-out capitalize';

  return (
    <div
      style={{ minWidth: '220px' }}
      className="flex flex-col justify-between bg-[#6E431D] h-full overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:'none'] [scrollbar-width:'none']"
    >
      <div className="w-full h-[18vh] sticky top-0 z-10 bg-[#F4EDE7] grid place-items-center px-5">
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
          {snap?.auth?.currentUser?.roles.find((role) =>
            allowedRoles.includes(role.name)
          ) && (
            <>
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
                to="/properties"
                className={({ isActive }) =>
                  isActive ? isActiveStyle : isNotActiveStyle
                }
                onClick={handleCloseSidebar}
              >
                <AiFillCalendar size={18} />
                Properties
              </NavLink>

              <NavLink
                to="/users"
                className={({ isActive }) =>
                  isActive ? isActiveStyle : isNotActiveStyle
                }
                onClick={handleCloseSidebar}
              >
                <HiUsers size={18} />
                Users
              </NavLink>

              <NavLink
                to="/departments"
                className={({ isActive }) =>
                  isActive ? isActiveStyle : isNotActiveStyle
                }
                onClick={handleCloseSidebar}
              >
                <BsFillBuildingsFill size={18} />
                Departments
              </NavLink>

              <NavLink
                to="/divisions"
                className={({ isActive }) =>
                  isActive ? isActiveStyle : isNotActiveStyle
                }
                onClick={handleCloseSidebar}
              >
                <MdOutlineSafetyDivider size={25} />
                Divisions
              </NavLink>

              <NavLink
                to="/roles"
                className={({ isActive }) =>
                  isActive ? isActiveStyle : isNotActiveStyle
                }
                onClick={handleCloseSidebar}
              >
                <MdWorkspacePremium size={25} />
                Roles
              </NavLink>

              <NavLink
                to="/locations"
                className={({ isActive }) =>
                  isActive ? isActiveStyle : isNotActiveStyle
                }
                onClick={handleCloseSidebar}
              >
                <MdLocationPin size={25} />
                Locations
              </NavLink>

              <NavLink
                to="/areas"
                className={({ isActive }) =>
                  isActive ? isActiveStyle : isNotActiveStyle
                }
                onClick={handleCloseSidebar}
              >
                <MdAreaChart size={25} />
                Areas
              </NavLink>

              <NavLink
                to="/property-types"
                className={({ isActive }) =>
                  isActive ? isActiveStyle : isNotActiveStyle
                }
                onClick={handleCloseSidebar}
              >
                <MdProductionQuantityLimits size={25} />
                Property types
              </NavLink>
            </>
          )}
          <NavLink
            to="/tenancy"
            className={({ isActive }) =>
              isActive ? isActiveStyle : isNotActiveStyle
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
            to="/deployment"
            className={({ isActive }) =>
              isActive ? isActiveStyle : isNotActiveStyle
            }
            onClick={handleCloseSidebar}
          >
            <HiArrowsExpand size={18} />
            Deployment
          </NavLink>
          <NavLink
            to="/merge"
            className={({ isActive }) =>
              isActive ? isActiveStyle : isNotActiveStyle
            }
            onClick={handleCloseSidebar}
          >
            <HiScissors size={18} />
            Property Merge
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
          <button
            onClick={handleLogout}
            className={`${isNotActiveStyle} hidden max-md:flex`}
          >
            {snap.auth?.loadingState ? (
              <Loader width="w-5" height="h-5" fillColor="fill-[#6E431D]" />
            ) : (
              <>
                <PoweroffOutlined size={18} /> Logout
              </>
            )}
          </button>
        </nav>
        <div className="w-full px-4 mt-8 grid place-items-center">
          <SidebarImage className="w-[150px] h-auto" />
        </div>
      </div>
    </div>
  );
}

export default Sidebar;
