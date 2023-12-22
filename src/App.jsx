import { lazy, Suspense, useEffect } from 'react';

import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';

import FetchingPage from './routes/FetchingPage/FetchingPage';
import Navigation from './routes/Navigation/Navigation';

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

function App() {
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname;
  // const [online, setonline] = useState(navigator.onLine);

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
      const response = await axiosInstance.get('/auth/user');
      const allocationResponse = await axiosInstance.get('/allocation/me');

      if (response.status === 200 && allocationResponse.status === 200) {
        const currentUser = {
          name: response.data.name,
          email: response.data.email,
          staff: response.data.staff,
          roles: response.data.roles,
          allocationData: allocationResponse.data.region,
        };

        state.auth.currentUser = currentUser;
        state.auth.loadingState = false;

        navigate(from, { replace: true });
      }
    } catch (error) {
      state.auth.loadingState = false;
      console.log(error);
    } finally {
      state.auth.loadingState = false;
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  return (
    <Routes>
      <Route index element={<Authentication />} />

      <Route path="login" element={<Authentication />} />
      <Route path="unauthorized" element={<Unauthorized />} />

      <Route path="fetching" element={<FetchingPage />} />

      <Route path="*" element={<NotExistPage />} />

      <Route element={<Navigation />}>
        {/*********  Public Routes **********/}

        <Route
          element={
            <RequireAuth
              allowedRoles={['Super Administrator', 'Divisional Administrator']}
            />
          }
        >
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

        {/******* Private Routes ********/}

        <Route
          element={
            <RequireAuth
              allowedRoles={['Super Administrator', 'Divisional Administrator']}
            />
          }
        >
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/report" element={<Report />} />

          <Route path="/users" element={<Users />} />
          <Route path="/capture" element={<Capture />} />

          <Route path="/departments" element={<Departments />} />

          <Route path="/divisions" element={<Divisions />} />
          <Route path="/political-districts" element={<PoliticalDistrict />} />
          <Route path="/political-regions" element={<PoliticalRegion />} />
          <Route path="/towns" element={<Town />} />

          <Route path="/roles" element={<Roles />} />

          <Route path="/property-references" element={<PropertyReferences />} />
          <Route path="/property-upload" element={<PropertyUpload />} />

          <Route path="/property-capture">
            <Route index element={<Capture />} />
            <Route path=":id" element={<PropertyCapture />} />
          </Route>

          {/* <Route path="/property-capture" element={<Capture />} /> */}

          <Route path="/properties-main" element={<PropertiesMain />} />
          <Route path="/property-units-main" element={<PropertyUnitsMain />} />

          <Route path="/locations" element={<Town />} />

          <Route path="/areas" element={<Areas />} />
          <Route path="/district" element={<District />} />

          <Route path="/property-types" element={<PropertyTypes />} />

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
          <Route path="/deployment">
            <Route index element={<Deployment />} />
            <Route path=":id" element={<DeploymentDetail />} />
          </Route>
          <Route path="/merge">
            <Route index element={<PropertyMergeIndex />} />
            <Route path="create" element={<PropertyMerge />} />
          </Route>
        </Route>
      </Route>
    </Routes>
  );
}

export default App;
