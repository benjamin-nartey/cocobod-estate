import { Routes, Route } from "react-router-dom";
import Navigation from "./routes/Navigation/Navigation";
import Authentication from "./routes/Authentication/Authentication";
import Home from "./routes/Home/Home";
import Properties from "./routes/Properties/Properties";
import PropertyDetailsPage from "./routes/PropertyDetailsPage/PropertyDetailsPage";
import PropertyDetail from "./components/PropertyDetail/PropertyDetail";
import Gallery from "./routes/Gallery/Gallery";
import PropertyMap from "./routes/PropertyMap/PropertyMap";
import RequireAuth from "./components/RequireAuth/RequireAuth";
import Dashboard from "./routes/Dashboard/Dashboard";
import axiosInstance from "./axios/axiosInstance";
import { useNavigate, useLocation } from "react-router-dom";
import LoadingPage from "./routes/LoadingPage/LoadingPage";
import Unauthorized from "./routes/Unauthorized/Unauthorized";
import state from "./store/store";

import { useEffect } from "react";

function App() {
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname;

  const fetchUser = async () => {
    try {
      state.loadingState = true;
      const response = await axiosInstance.get("/auth/user");

      if (response.status === 200) {
        console.log("fetched", response.data);

        const currentUser = response?.data;

        state.currentUser = { currentUser };

        navigate(from, { replace: true });
      }
    } catch (error) {
      console.log(error);
    } finally {
      state.loadingState = false;
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

      <Route path="loadingPage" element={<LoadingPage />} />

      <Route element={<Navigation />}>
        {/*********  Public Routes **********/}

        <Route element={<RequireAuth allowedRoles={["view"]} />}>
          <Route element={<Home />}>
            <Route path="/home" element={<Properties />} />
            <Route path="home/category/:categoryId" element={<Properties />} />
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

        <Route element={<RequireAuth allowedRoles={["create-user"]} />}>
          <Route path="/dashboard" element={<Dashboard />} />
        </Route>
      </Route>
    </Routes>
  );
}

export default App;
