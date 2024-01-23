import { lazy, Suspense, useEffect, useState } from "react";

import {
  Routes,
  Route,
  useNavigate,
  useLocation,
  json,
} from "react-router-dom";

import FetchingPage from "./routes/FetchingPage/FetchingPage";
import Navigation from "./routes/Navigation/Navigation";
import { useOnlineStatus } from "./Hooks/useIsOnlineStatus";

import { axiosInstance } from "./axios/axiosInstance";
import state from "./store/store";

import Deployment from "./routes/Deployment/Deployment";
import ActivateUser from "./routes/ActivateUser/ActivateUser";

import Capture from "./routes/Capture/Capture";
import Home from "./routes/Home/Home";
import Users from "./routes/Users/Users";
import Departments from "./routes/Departments/Departments";
import Divisions from "./routes/Divisions/Divisions";
import Roles from "./routes/Roles/Roles";
import Properties from "./routes/Properties/Properties";
// import Property from './routes/Property/Property';
import Locations from "./routes/Locations/Locations";
import Areas from "./routes/Areas/Areas";
import PropertyTypes from "./routes/PropertyTypes/PropertyTypes";
import PropertyDetailsPage from "./routes/PropertyDetailsPage/PropertyDetailsPage";
import PropertyMerge from "./routes/PropertyMerge/PropertyMerge";

import DeploymentDetail from "./routes/Deployment/DeploymentDetail";

import District from "./routes/District/District";

import PropertyMergeIndex from "./routes/PropertyMerge/PropertyMergeIndex";

import ModerationDetails from "./routes/Moderation/ModerationDetails";

import ModerationDashboard from "./routes/Moderation/ModerationDashboard";

import ModerationPopertyUnitList from "./routes/Moderation/ModerationPopertyUnitList";

import ModerationPoperties from "./routes/Moderation/ModerationProperties";

import Authentication from "./routes/Authentication/Authentication";

import PropertyDetail from "./components/PropertyDetail/PropertyDetail";
import Gallery from "./routes/Gallery/Gallery";
import PropertyMap from "./routes/PropertyMap/PropertyMap";
import RequireAuth from "./components/RequireAuth/RequireAuth";
import Dashboard from "./routes/Dashboard/Dashboard";

import Unauthorized from "./routes/Unauthorized/Unauthorized";

import NotExistPage from "./routes/NotExistPage/NotExistPage";
import PropertiesMain from "./routes/PropertiesMain/PropertiesMain";
import PropertyUnitsMain from "./routes/PropertyUnitsMain/PropertUnitsMain";
import Report from "./routes/Report/Report";
import PropertyReferences from "./routes/PropertyReferences/PropertyReferences";
import PropertyCapture from "./routes/PropertyCapture/PropertyCapture";

// import state from "./store/store";
import { useSnapshot } from "valtio";
import { useLocalStorage } from "./Hooks/useLocalStorage";
import Property from "./components/Property/Property";
import PropertyUpload from "./routes/PropertyUpload/PropertyUpload";
import Town from "./routes/Towns/Town";
import PoliticalDistrict from "./routes/Political District/PoliticalDistrict";
import PoliticalRegion from "./routes/Political Region/PoliticalRegion";
import PropertyMergeDetail from "./routes/PropertyMerge/PropertyMergeDetail";
import { initDB, useIndexedDB } from "react-indexed-db-hook";
import { PERMISSIONS } from "./utils/common";

function App() {
  // const [offlineUser, setOfflineUser] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname;
  const isOnLine = useOnlineStatus();

  const { getAll: getOfflineUser } = useIndexedDB("offlineUser");
  const [offlineUser, setOfflineUser] = useLocalStorage("offlineUser", null);

  const fetchUser = async () => {
    try {
      if (isOnLine) {
        const response = await axiosInstance.get("/auth/user");

        if (response.status === 200) {
          const currentUser = {
            name: response.data.name,
            email: response.data.email,
            staff: response.data.staff,
            roles: response.data.roles,
          };

          state.auth.currentUser = currentUser;
          state.auth.loadingState = false;

          navigate(from, { replace: true });
        }
      } else {
        state.auth.currentUser = offlineUser;
        navigate(from, { replace: true });
      }
    } catch (error) {
      console.log(error);
    } finally {
      state.auth.loadingState = false;
    }
  };

  useEffect(() => {
    fetchUser();
  }, [offlineUser]);

  return (
    <Routes>
      <Route index element={<Authentication />} />

      <Route path="login" element={<Authentication />} />
      <Route path="unauthorized" element={<Unauthorized />} />

      <Route path="fetching" element={<FetchingPage />} />

      <Route path="*" element={<NotExistPage />} />

      <Route path="/user-activation" element={<ActivateUser />} />

      <Route element={<Navigation />}>
        {/********* Public **********/}
        <Route path="/dashboard" element={<Dashboard />} />

        <Route element={<RequireAuth allowedPermissions={["view.property"]} />}>
          <Route element={<Home />}>
            <Route path="/home" element={<Properties />} />
            <Route path="/home/*" element={<NotExistPage />} />
            <Route path="home/category/:categoryId" element={<Properties />} />
            <Route path="home/category/*" element={<NotExistPage />} />
          </Route>

          <Route element={<PropertyDetailsPage />}>
            <Route
              path="property-detail/:propId"
              element={<PropertyDetail />}
            />
          </Route>

          <Route path="gallery" element={<Gallery />} />
          <Route path="map" element={<PropertyMap />} />
        </Route>

        {/******* Field Inspection Routes ********/}
        <Route
          element={
            <RequireAuth
              allowedPermissions={[
                PERMISSIONS.VIEW_ALLOCATION,
                PERMISSIONS.LIST_DISTRICT,
                PERMISSIONS.LIST_LOCATION,
                PERMISSIONS.LIST_PROPERTY_TYPE,
                PERMISSIONS.CREATE_PROPERTY_CAPTURE,
                PERMISSIONS.LIST_PROPERTY_REFERENCE,
                PERMISSIONS.LIST_PROPERTY_REFERENCE_CATEGORY,
                PERMISSIONS.LIST_CLIENT_OCCUPANT,
              ]}
            />
          }
        >
          <Route path="/capture" element={<Capture />} />
          <Route path="/property-capture">
            <Route index element={<Capture />} />
            <Route path=":id" element={<PropertyCapture />} />
          </Route>
          <Route path="/property-upload">
            <Route index element={<PropertyUpload />} />
            <Route path=":id" element={<PropertyCapture />} />
          </Route>
        </Route>

        {/********* Roles Routes *******/}
        <Route
          element={
            <RequireAuth
              allowedPermissions={[
                PERMISSIONS.LIST_ROLE,
                PERMISSIONS.VIEW_ROLE,
                PERMISSIONS.CREATE_ROLE,
                PERMISSIONS.UPDATE_ROLE,
              ]}
            />
          }
        >
          <Route path="/roles" element={<Roles />} />
        </Route>

        {/******* Users Routes ********/}
        <Route
          element={
            <RequireAuth
              allowedPermissions={[
                PERMISSIONS.LIST_USER,
                PERMISSIONS.VIEW_USER,
                PERMISSIONS.CREATE_USER,
                PERMISSIONS.LIST_USER_STAFF,
                PERMISSIONS.UPDATE_USER,
              ]}
            />
          }
        >
          <Route path="/users" element={<Users />} />
        </Route>

        {/******* Department Routes ********/}
        <Route
          element={
            <RequireAuth
              allowedPermissions={[
                PERMISSIONS.LIST_DEPARTMENT,
                PERMISSIONS.VIEW_DEPARTMENT,
                PERMISSIONS.CREATE_DEPARTMENT,
                PERMISSIONS.DELETE_DEPARTMENT,
                PERMISSIONS.UPDATE_DEPARTMENT,
              ]}
            />
          }
        >
          <Route path="/departments" element={<Departments />} />
        </Route>

        {/******* Division Routes ********/}
        <Route
          element={
            <RequireAuth
              allowedPermissions={[
                PERMISSIONS.LIST_DIVISION,
                ,
                PERMISSIONS.VIEW_DIVISION,
                PERMISSIONS.CREATE_DIVISION,
                PERMISSIONS.DELETE_DIVISION,
                PERMISSIONS.UPDATE_DIVISION,
              ]}
            />
          }
        >
          <Route path="/divisions" element={<Divisions />} />
        </Route>

        {/******* location Routes ********/}
        <Route
          element={
            <RequireAuth
              allowedPermissions={[
                PERMISSIONS.LIST_LOCATION,
                PERMISSIONS.VIEW_LOCATION,
                PERMISSIONS.CREATE_LOCATION,
                PERMISSIONS.DELETE_LOCATION,
                PERMISSIONS.UPDATE_LOCATION,
              ]}
            />
          }
        >
          <Route path="/locations" element={<Town />} />
          <Route path="/towns" element={<Town />} />
        </Route>

        {/******* deployment Routes ********/}
        <Route
          element={
            <RequireAuth
              allowedPermissions={[
                PERMISSIONS.LIST_DEPLOYMENT,
                PERMISSIONS.VIEW_DEPLOYMENT,
                PERMISSIONS.CREATE_DEPLOYMENT,
                PERMISSIONS.DELETE_DEPLOYMENT,
                PERMISSIONS.UPDATE_DEPLOYMENT,
              ]}
            />
          }
        >
          <Route path="/deployment">
            <Route index element={<Deployment />} />
            <Route path=":id" element={<DeploymentDetail />} />
          </Route>
        </Route>

        {/******* District Routes ********/}
        <Route
          element={
            <RequireAuth
              allowedPermissions={[
                PERMISSIONS.LIST_DISTRICT,
                PERMISSIONS.VIEW_DISTRICT,
                PERMISSIONS.CREATE_DISTRICT,
                PERMISSIONS.DELETE_DISTRICT,
                PERMISSIONS.UPDATE_DISTRICT,
              ]}
            />
          }
        >
          <Route path="/district" element={<District />} />
          <Route path="/political-districts" element={<PoliticalDistrict />} />
          <Route path="/political-regions" element={<PoliticalRegion />} />
          <Route path="/areas" element={<Areas />} />
        </Route>

        {/******* Area Routes ********/}
        {/* <Route
          element={
            <RequireAuth
              allowedPermissions={[
                "list.area",
                "view.area",
                "create.area",
                "delete.area",
              ]}
            />
          }
        >
          <Route path="/areas" element={<Areas />} />
        </Route> */}

        {/******* Property-type Routes ********/}
        <Route
          element={
            <RequireAuth
              allowedPermissions={[
                PERMISSIONS.LIST_PROPERTY_TYPE,
                PERMISSIONS.VIEW_PROPERTY_TYPE,
                PERMISSIONS.CREATE_PROPERTY_TYPE,
                PERMISSIONS.DELETE_PROPERTY_TYPE,
                PERMISSIONS.UPDATE_PROPERTY_TYPE,
              ]}
            />
          }
        >
          <Route path="/property-types" element={<PropertyTypes />} />
        </Route>

        {/******* Property Routes ********/}
        <Route
          element={
            <RequireAuth
              allowedPermissions={[
                PERMISSIONS.LIST_PROPERTY,
                PERMISSIONS.VIEW_PROPERTY,
                PERMISSIONS.CREATE_PROPERTY,
                PERMISSIONS.DELETE_PROPERTY,
                PERMISSIONS.UPDATE_PROPERTY,
              ]}
            />
          }
        >
          <Route path="/properties-main" element={<PropertiesMain />} />
        </Route>

        {/******* Property-unit Routes ********/}
        <Route
          element={
            <RequireAuth
              allowedPermissions={[
                PERMISSIONS.LIST_PROPERTY_UNIT,
                PERMISSIONS.VIEW_PROPERTY_UNIT,
                PERMISSIONS.CREATE_PROPERTY_UNIT,
                PERMISSIONS.DELETE_PROPERTY_UNIT,
                PERMISSIONS.UPDATE_PROPERTY_UNIT,
              ]}
            />
          }
        >
          <Route
            path="/property-units-main/:propertyId"
            element={<PropertyUnitsMain />}
          />
        </Route>

        {/******* Property-reference Routes ********/}
        <Route
          element={
            <RequireAuth
              allowedPermissions={[
                PERMISSIONS.LIST_PROPERTY_REFERENCE,
                PERMISSIONS.VIEW_PROPERTY_REFERENCE,
                PERMISSIONS.CREATE_PROPERTY_REFERENCE_BATCH,
              ]}
            />
          }
        >
          <Route path="/property-references" element={<PropertyReferences />} />
        </Route>

        {/*******Moderation Route******/}
        <Route
          element={
            <RequireAuth
              allowedPermissions={[
                PERMISSIONS.LIST_PROPERTY,
                PERMISSIONS.LIST_PROPERTY_UNIT,
                PERMISSIONS.VIEW_PROPERTY_UNIT,
                PERMISSIONS.UPDATE_PROPERTY_UNIT,
              ]}
            />
          }
        >
          <Route path="moderation">
            <Route index element={<ModerationDashboard />} />
            <Route
              path="properties/:regionId"
              element={<ModerationPoperties />}
            />
            <Route
              path="properties/:regionId/:propertyId"
              element={<ModerationPopertyUnitList />}
            />
            <Route
              path="properties/review/:propertyUnitId"
              element={<ModerationDetails />}
            />
          </Route>
        </Route>

        {/*******Merge Route******/}
        <Route
          element={
            <RequireAuth
              allowedPermissions={[
                PERMISSIONS.LIST_PROPERTY_REFERENCE,
                PERMISSIONS.LIST_PROPERTY_REFERENCE_CATEGORY,
                PERMISSIONS.UPDATE_PROPERTY_REFERENCE_CATEGORY,
                PERMISSIONS.DELETE_PROPERTY_REFERENCE_CATEGORY,
                PERMISSIONS.CREATE_PROPERTY_REFERENCE_CATEGORY,
              ]}
            />
          }
        >
          <Route path="/merge">
            <Route index element={<PropertyMergeIndex />} />
            <Route path="create" element={<PropertyMerge />} />
            <Route path=":id" element={<PropertyMergeDetail />} />
          </Route>
        </Route>

        {/*******Report******/}
        <Route element={<RequireAuth allowedPermissions={["view.property"]} />}>
          <Route path="/report" element={<Report />} />
        </Route>
      </Route>
    </Routes>
  );
}

export default App;
