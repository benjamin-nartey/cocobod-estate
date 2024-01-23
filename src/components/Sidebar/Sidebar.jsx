import React, { useContext } from 'react';
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
  MdOutlineAddAPhoto,
  MdOutlineReceipt,
  MdOutlineSafetyDivider,
  MdPieChart,
  MdProductionQuantityLimits,
  MdUpload,
  MdWorkspacePremium,
} from 'react-icons/md';
import { IoMdMap } from 'react-icons/io';
import { BsFillBuildingsFill } from 'react-icons/bs';
import { PoweroffOutlined } from '@ant-design/icons';
import {
  HiArrowsExpand,
  HiInbox,
  HiLightningBolt,
  HiScissors,
  HiUsers,
} from 'react-icons/hi';

import logo from '../../assets/logo-cocobod.png';
import { ReactComponent as SidebarImage } from '../../assets/sidebarImg.svg';

import { LogoutContext } from '../../context/logout.context';
import Loader from '../Loader/Loader';

import { useSnapshot } from 'valtio';

import state from '../../store/store';
import { PERMISSIONS, hasAllowedPermission } from '../../utils/common';
import { current } from '@reduxjs/toolkit';

function Sidebar({ closeToggle }) {
  const snap = useSnapshot(state);
  const { currentUser } = snap.auth;

  const { logout } = useContext(LogoutContext);

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
          {hasAllowedPermission(currentUser, [PERMISSIONS.LIST_PROPERTY]) && (
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
          )}

          <>
            {
              <NavLink
                to="/dashboard"
                className={({ isActive }) =>
                  isActive ? isActiveStyle : isNotActiveStyle
                }
                onClick={handleCloseSidebar}
              >
                <MdDashboard size={18} />
                Dashboard
              </NavLink>
            }

            {hasAllowedPermission(currentUser, [
              PERMISSIONS.LIST_PROPERTY_UNIT,
            ]) && (
              <NavLink
                to="/report"
                className={({ isActive }) =>
                  isActive ? isActiveStyle : isNotActiveStyle
                }
                onClick={handleCloseSidebar}
              >
                <MdPieChart size={18} />
                Report
              </NavLink>
            )}
            {hasAllowedPermission(currentUser, [PERMISSIONS.LIST_PROPERTY]) && (
              <NavLink
                to="/properties-main"
                className={({ isActive }) =>
                  isActive ? isActiveStyle : isNotActiveStyle
                }
                onClick={handleCloseSidebar}
              >
                <AiFillCalendar size={18} />
                Properties
              </NavLink>
            )}

            {/* <NavLink
                to="/property-capture"
                className={({ isActive }) =>
                  isActive ? isActiveStyle : isNotActiveStyle
                }
                onClick={handleCloseSidebar}
              >
                <MdOutlineAddAPhoto size={18} />
                Property Capture
              </NavLink> */}

            {hasAllowedPermission(currentUser, [
              PERMISSIONS.CREATE_PROPERTY_CAPTURE,
              PERMISSIONS.LIST_PROPERTY_REFERENCE,
              PERMISSIONS.LIST_PROPERTY_REFERENCE_CATEGORY,
            ]) && (
              <NavLink
                to="/property-capture"
                className={({ isActive }) =>
                  isActive ? isActiveStyle : isNotActiveStyle
                }
                onClick={handleCloseSidebar}
              >
                <MdUpload size={18} />
                Property Capture
              </NavLink>
            )}

            {hasAllowedPermission(currentUser, [
              PERMISSIONS.CREATE_PROPERTY_CAPTURE,
            ]) && (
              <NavLink
                to="/property-upload"
                className={({ isActive }) =>
                  isActive ? isActiveStyle : isNotActiveStyle
                }
                onClick={handleCloseSidebar}
              >
                <MdOutlineAddAPhoto size={18} />
                Property Upload
              </NavLink>
            )}

            {/* <NavLink
                to="/property-capture"
                className={({ isActive }) =>
                  isActive ? isActiveStyle : isNotActiveStyle
                }
                onClick={handleCloseSidebar}
              >
                <MdOutlineAddAPhoto size={18} />
                Property Capture
              </NavLink> */}
            {hasAllowedPermission(currentUser, [
              PERMISSIONS.LIST_USER_STAFF,
            ]) && (
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
            )}

            {hasAllowedPermission(currentUser, [
              PERMISSIONS.LIST_DEPARTMENT,
            ]) && (
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
            )}

            {hasAllowedPermission(currentUser, [PERMISSIONS.LIST_DIVISION]) && (
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
            )}

            {hasAllowedPermission(currentUser, [PERMISSIONS.LIST_ROLE]) && (
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
            )}

            {hasAllowedPermission(currentUser, [
              PERMISSIONS.CREATE_LOCATION,
            ]) && (
              <NavLink
                to="/locations"
                className={({ isActive }) =>
                  isActive ? isActiveStyle : isNotActiveStyle
                }
                onClick={handleCloseSidebar}
              >
                <MdLocationPin size={25} />
                Towns
              </NavLink>
            )}

            {hasAllowedPermission(currentUser, [PERMISSIONS.CREATE_REGION]) && (
              <NavLink
                to="/areas"
                className={({ isActive }) =>
                  isActive ? isActiveStyle : isNotActiveStyle
                }
                onClick={handleCloseSidebar}
              >
                <MdAreaChart size={25} />
                Cocoa Regions
              </NavLink>
            )}

            {hasAllowedPermission(currentUser, [PERMISSIONS.CREATE_REGION]) && (
              <NavLink
                to="/political-regions"
                className={({ isActive }) =>
                  isActive ? isActiveStyle : isNotActiveStyle
                }
                onClick={handleCloseSidebar}
              >
                <MdAreaChart size={25} />
                Political Regions
              </NavLink>
            )}

            {hasAllowedPermission(currentUser, [
              PERMISSIONS.CREATE_DISTRICT,
            ]) && (
              <NavLink
                to="/district"
                className={({ isActive }) =>
                  isActive ? isActiveStyle : isNotActiveStyle
                }
                onClick={handleCloseSidebar}
              >
                <MdAreaChart size={25} />
                Cocoa Districts
              </NavLink>
            )}

            {hasAllowedPermission(currentUser, [
              PERMISSIONS.CREATE_DISTRICT,
            ]) && (
              <NavLink
                to="/political-districts"
                className={({ isActive }) =>
                  isActive ? isActiveStyle : isNotActiveStyle
                }
                onClick={handleCloseSidebar}
              >
                <MdAreaChart size={25} />
                Political Districts
              </NavLink>
            )}

            {hasAllowedPermission(currentUser, [
              PERMISSIONS.MODERATE_PROPERTY_UNIT,
            ]) && (
              <NavLink
                to="/moderation"
                className={({ isActive }) =>
                  isActive ? isActiveStyle : isNotActiveStyle
                }
                onClick={handleCloseSidebar}
              >
                <HiLightningBolt size={25} />
                Moderation
              </NavLink>
            )}

            {hasAllowedPermission(currentUser, [
              PERMISSIONS.CREATE_PROPERTY_REFERENCE_BATCH,
            ]) && (
              <NavLink
                to="property-references"
                className={({ isActive }) =>
                  isActive ? isActiveStyle : isNotActiveStyle
                }
                onClick={handleCloseSidebar}
              >
                <HiInbox size={25} />
                References
              </NavLink>
            )}
            {hasAllowedPermission(currentUser, [
              PERMISSIONS.CREATE_PROPERTY_TYPE,
            ]) && (
              <NavLink
                to="/property-types"
                className={({ isActive }) =>
                  isActive ? isActiveStyle : isNotActiveStyle
                }
                onClick={handleCloseSidebar}
              >
                <MdProductionQuantityLimits size={25} />
                Category
              </NavLink>
            )}
          </>

          {/* <NavLink
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
          </NavLink> */}

          {hasAllowedPermission(currentUser, [PERMISSIONS.LIST_DEPLOYMENT]) && (
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
          )}

          {hasAllowedPermission(currentUser, [
            PERMISSIONS.CREATE_PROPERTY_REFERENCE_CATEGORY,
          ]) && (
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
          )}

          {hasAllowedPermission(currentUser, [PERMISSIONS.LIST_PROPERTY]) && (
            <NavLink
              to="/map"
              className={({ isActive }) =>
                isActive ? isActiveStyle : isNotActiveStyle
              }
              onClick={() => {
                state.mapSlice.selectedProperty = null;
                handleCloseSidebar();
              }}
            >
              <IoMdMap size={18} />
              Map
            </NavLink>
          )}
          <button
            onClick={logout}
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
