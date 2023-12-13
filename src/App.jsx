import { lazy, Suspense, useEffect } from 'react';

import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';

import FetchingPage from './routes/FetchingPage/FetchingPage';
import Navigation from './routes/Navigation/Navigation';

import { axiosInstance } from './axios/axiosInstance';
import state from './store/store';

import Deployment from './routes/Deployment/Deployment';

import PropertyMerge from './routes/PropertyMerge/PropertyMerge';

import DeploymentDetail from './routes/Deployment/DeploymentDetail';

import District from './routes/District/District';

import PropertyMergeIndex from './routes/PropertyMerge/PropertyMergeIndex';

import ModerationDetails from './routes/Moderation/ModerationDetails';

import ModerationDashboard from './routes/Moderation/ModerationDashboard';

import ModerationPopertyUnitList from './routes/Moderation/ModerationPopertyUnitList';

import ModerationPoperties from './routes/Moderation/ModerationProperties';

import Authentication from './routes/Authentication/Authentication';
import Home from './routes/Home/Home';

import Users from './routes/Users/Users';
import Departments from './routes/Departments/Departments';
import Divisions from './routes/Divisions/Divisions';
import Roles from './routes/Roles/Roles';
import Properties from './routes/Properties/Properties';
import Property from './components/Property/Property';
import Locations from './routes/Locations/Locations';
import Areas from './routes/Areas/Areas';
import PropertyTypes from './routes/PropertyTypes/PropertyTypes';
import PropertyDetailsPage from './routes/PropertyDetailsPage/PropertyDetailsPage';

import PropertyDetail from './components/PropertyDetail/PropertyDetail';
import Gallery from './routes/Gallery/Gallery';
import PropertyMap from './routes/PropertyMap/PropertyMap';
import RequireAuth from './components/RequireAuth/RequireAuth';
import Dashboard from './routes/Dashboard/Dashboard';

import Unauthorized from './routes/Unauthorized/Unauthorized';

import NotExistPage from './routes/NotExistPage/NotExistPage';
import PropertiesMain from './routes/PropertiesMain/PropertiesMain';
import PropertyUnitsMain from './routes/PropertyUnitsMain/PropertUnitsMain';
import Report from './routes/Report/report';
import PropertyReferences from './routes/PropertyReferences/PropertyReferences';

function App() {
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname;

  const fetchUser = async () => {
    try {
      state.loadingState = true;
      const response = await axiosInstance.get('/auth/user');

      if (response.status === 200) {
        const currentUser = response?.data;

        state.auth.currentUser = currentUser;

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

          <Route path="/departments" element={<Departments />} />

          <Route path="/divisions" element={<Divisions />} />

          <Route path="/roles" element={<Roles />} />

          <Route path="/property-references" element={<PropertyReferences />} />

          <Route path="/properties" element={<Property />} />
          <Route path="/properties-main" element={<PropertiesMain />} />
          <Route path="/property-units-main" element={<PropertyUnitsMain />} />

          <Route path="/locations" element={<Locations />} />

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
