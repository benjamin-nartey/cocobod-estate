import { lazy, Suspense, useEffect, useState } from 'react';

import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';

import FetchingPage from './routes/FetchingPage/FetchingPage';
import Navigation from './routes/Navigation/Navigation';
import { useOnlineStatus } from './Hooks/useIsOnlineStatus';

import { axiosInstance } from './axios/axiosInstance';
import state from './store/store';

import Deployment from './routes/Deployment/Deployment';

import Capture from './routes/Capture/Capture';
import Home from './routes/Home/Home';
import Users from './routes/Users/Users';
import Departments from './routes/Departments/Departments';
import Divisions from './routes/Divisions/Divisions';
import Roles from './routes/Roles/Roles';
import Properties from './routes/Properties/Properties';
// import Property from './routes/Property/Property';
import Locations from './routes/Locations/Locations';
import Areas from './routes/Areas/Areas';
import PropertyTypes from './routes/PropertyTypes/PropertyTypes';
import PropertyDetailsPage from './routes/PropertyDetailsPage/PropertyDetailsPage';
import PropertyMerge from './routes/PropertyMerge/PropertyMerge';

import DeploymentDetail from './routes/Deployment/DeploymentDetail';

import District from './routes/District/District';

import PropertyMergeIndex from './routes/PropertyMerge/PropertyMergeIndex';

import ModerationDetails from './routes/Moderation/ModerationDetails';

import ModerationDashboard from './routes/Moderation/ModerationDashboard';

import ModerationPopertyUnitList from './routes/Moderation/ModerationPopertyUnitList';

import ModerationPoperties from './routes/Moderation/ModerationProperties';

import Authentication from './routes/Authentication/Authentication';

import PropertyDetail from './components/PropertyDetail/PropertyDetail';
import Gallery from './routes/Gallery/Gallery';
import PropertyMap from './routes/PropertyMap/PropertyMap';
import RequireAuth from './components/RequireAuth/RequireAuth';
import Dashboard from './routes/Dashboard/Dashboard';

import Unauthorized from './routes/Unauthorized/Unauthorized';

import NotExistPage from './routes/NotExistPage/NotExistPage';
import PropertiesMain from './routes/PropertiesMain/PropertiesMain';
import PropertyUnitsMain from './routes/PropertyUnitsMain/PropertUnitsMain';
import Report from './routes/Report/Report';
import PropertyReferences from './routes/PropertyReferences/PropertyReferences';
import PropertyCapture from './routes/PropertyCapture/PropertyCapture';

// import state from "./store/store";
import { useSnapshot } from 'valtio';
import { useLocalStorage } from './Hooks/useLocalStorage';
import Property from './components/Property/Property';
import PropertyUpload from './routes/PropertyUpload/PropertyUpload';
import Town from './routes/Towns/Town';
import PoliticalDistrict from './routes/Political District/PoliticalDistrict';
import PoliticalRegion from './routes/Political Region/PoliticalRegion';
import PropertyMergeDetail from './routes/PropertyMerge/PropertyMergeDetail';
import { useIndexedDB } from 'react-indexed-db-hook';

function App() {
  // const [offlineUser, setOfflineUser] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname;
  const isOnLine = useOnlineStatus();

  const { getAll: getOfflineUser } = useIndexedDB("offlineUser");
  const [offlineUser, setOfflineUser] = useLocalStorage("offlineUser", null);

  // useEffect(() => {
  //   getOfflineUser().then((data) => setOfflineUser(data[0]));
  // }, []);
  console.log({ offlineUser });
  // const [currentUserState, setCurrentUserState] = useLocalStorage(
  //   'currentUserState',
  //   null
  // );

  // useEffect(() => {
  //   if (location.pathname !== '/merge/create') {
  //     state.mergeSlice.selectedRowsInTable = [];
  //     console.log('reset');
  //   }
  // }, [location.pathname]);

  const fetchUser = async () => {
    try {
      if (isOnLine) {
        const response = await axiosInstance.get("/auth/user");
        // const allocationResponse = await axiosInstance.get("/allocation/me");

        if (response.status === 200 ) {
          const currentUser = {
            name: response.data.name,
            email: response.data.email,
            staff: response.data.staff,
            roles: response.data.roles,
            // allocationData: allocationResponse.data.region,
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

      <Route element={<Navigation />}>
        {/********* Home Routes **********/}
        <Route element={<RequireAuth allowedPermissions={['view.property']} />}>
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
                'view.allocation',
                'list.district',
                'list.location',
                'list.property-type',
                'create.property-capture',
                ' list.property-reference',
                'list.property-reference-category',
                'list.client-occupant',
              ]}
            />
          }
        >
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/capture" element={<Capture />} />
          <Route path="/property-capture">
            <Route index element={<Capture />} />
            <Route path=":id" element={<PropertyCapture />} />
          </Route>
          <Route path="/property-upload" element={<PropertyUpload />} />
        </Route>

        {/********* Roles Routes *******/}
        <Route
          element={
            <RequireAuth
              allowedPermissions={[
                "list.role",
                "view.role",
                "create.role,",
                "update.role",
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
                "list.user",
                "view.user",
                "create.user",
                "list.user.staff",
                "update.user",
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
                "list.department",
                "view.department",
                "create.department",
                "delete.department",
                "update.department",
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
                "list.division",
                "view.division",
                "create.division",
                "delete.division",
                "update.division",
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
                "list.location",
                "view.location",
                "create.location",
                "delete.location",
                "update.location",
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
                "list.deployment",
                "view.deployment",
                "create.deployment",
                "delete.deployment",
                "update.deployment",
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
                "list.district",
                "view.district",
                "create.district",
                "delete.district",
                "update.district",
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
                "list.property-type",
                "view.property-type",
                "create.property-type",
                "delete.property-type",
                "update.property-type",
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
                "list.property",
                "view.property",
                "create.property",
                "delete.property",
                "update.property",
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
                "list.property-unit",
                "view.property-unit",
                "create.property-unit",
                "delete.property-unit",
                "update.property-unit",
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
                "list.property-reference",
                "view.property-reference",
                "create.property-reference",
                "delete.property-reference",
                "update.property-reference",
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
                "list.property",
                "list.property-unit",
                "view.property-unit",
                
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
                "list.property-reference",
                "list.property-reference-category",
                "update.property-reference-category",
                "delete.property-reference-category",
                "create.property-reference-category",
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
        <Route element={<RequireAuth allowedPermissions={['view.property']} />}>
          <Route path="/report" element={<Report />} />
        </Route>
      </Route>
    </Routes>
  );
}

export default App;
