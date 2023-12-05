import { lazy, Suspense, useEffect, useState } from "react";

import { Routes, Route, useNavigate, useLocation } from "react-router-dom";

import FetchingPage from "./routes/FetchingPage/FetchingPage";
import Navigation from "./routes/Navigation/Navigation";

import { axiosInstance } from "./axios/axiosInstance";
import state from "./store/store";

import Authentication from "./routes/Authentication/Authentication";
import Capture from "./routes/Capture/capture";

import Home from "./routes/Home/Home";
import Users from "./routes/Users/Users";
import Departments from "./routes/Departments/Departments";
import Divisions from "./routes/Divisions/Divisions";
import Roles from "./routes/Roles/Roles";
import Properties from "./routes/Properties/Properties";
import Property from "./routes/Property/Property";
import Locations from "./routes/Locations/Locations";
import Areas from "./routes/Areas/Areas";
import PropertyTypes from "./routes/PropertyTypes/PropertyTypes";
import PropertyDetailsPage from "./routes/PropertyDetailsPage/PropertyDetailsPage";

import PropertyDetail from "./components/PropertyDetail/PropertyDetail";

import AddPropertyForm from "./routes/AddPropertyForm/AddPropertyForm";

import Gallery from "./routes/Gallery/Gallery";
import PropertyMap from "./routes/PropertyMap/PropertyMap";
import RequireAuth from "./components/RequireAuth/RequireAuth";
import Dashboard from "./routes/Dashboard/Dashboard";

import Unauthorized from "./routes/Unauthorized/Unauthorized";

import NotExistPage from "./routes/NotExistPage/NotExistPage";

function App() {
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname;
  // const [online, setonline] = useState(navigator.onLine);

  window.addEventListener(
    "online",
    () => {
      state.isOnLine = true;
    },
    false
  );

  window.addEventListener(
    "offline",
    () => {
      state.isOnLine = false;
    },
    false
  );

  const fetchUser = async () => {
    try {
      state.loadingState = true;
      const response = await axiosInstance.get("/auth/user");

      if (response.status === 200) {
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
      <Route
        index
        element={
          <Suspense>
            <Authentication />
          </Suspense>
        }
      />

      <Route
        path="login"
        element={
          <Suspense>
            <Authentication />
          </Suspense>
        }
      />
      <Route
        path="unauthorized"
        element={
          <Suspense>
            <Unauthorized />
          </Suspense>
        }
      />

      <Route path="fetching" element={<FetchingPage />} />

      <Route
        path="*"
        element={
          <Suspense>
            <NotExistPage />
          </Suspense>
        }
      />

      <Route element={<Navigation />}>
        {/*********  Public Routes **********/}

        <Route
          element={
            <RequireAuth
              allowedRoles={["Super Administrator", "Divisional Administrator"]}
            />
          }
        >
          <Route
            element={
              <Suspense>
                <Home />
              </Suspense>
            }
          >
            <Route
              path="/home"
              element={
                <Suspense>
                  <Properties />
                </Suspense>
              }
            />
            <Route
              path="/home/*"
              element={
                <Suspense>
                  <NotExistPage />
                </Suspense>
              }
            />
            <Route
              path="home/category/:categoryId"
              element={
                <Suspense>
                  <Properties />
                </Suspense>
              }
            />
            <Route
              path="home/category/*"
              element={
                <Suspense>
                  <NotExistPage />
                </Suspense>
              }
            />
          </Route>
          <Route
            element={
              <Suspense>
                <PropertyDetailsPage />
              </Suspense>
            }
          >
            <Route
              path="property-detail/:propId"
              element={
                <Suspense>
                  <PropertyDetail />
                </Suspense>
              }
            />
          </Route>
          <Route
            path="gallery"
            element={
              <Suspense>
                <Gallery />
              </Suspense>
            }
          />
          <Route
            path="map"
            element={
              <Suspense>
                <PropertyMap />
              </Suspense>
            }
          />
        </Route>

        {/******* Private Routes ********/}

        <Route
          element={
            <RequireAuth
              allowedRoles={["Super Administrator", "Divisional Administrator"]}
            />
          }
        >
          <Route
            path="/dashboard"
            element={
              <Suspense>
                <Dashboard />
              </Suspense>
            }
          />

          <Route
            path="/users"
            element={
              <Suspense>
                <Users />
              </Suspense>
            }
          />

          {/* <Route
            path="/property-capture"
            element={
              <Suspense>
                <AddPropertyForm />
              </Suspense>
            }
          /> */}

          <Route
            path="/capture"
            element={
              <Suspense>
                <Capture />
              </Suspense>
            }
          />

          <Route
            path="/departments"
            element={
              <Suspense>
                <Departments />
              </Suspense>
            }
          />

          <Route
            path="/divisions"
            element={
              <Suspense>
                <Divisions />
              </Suspense>
            }
          />

          <Route
            path="/roles"
            element={
              <Suspense>
                <Roles />
              </Suspense>
            }
          />

          <Route
            path="/properties"
            element={
              <Suspense>
                <Property />
              </Suspense>
            }
          />

          <Route
            path="/locations"
            element={
              <Suspense>
                <Locations />
              </Suspense>
            }
          />

          <Route
            path="/areas"
            element={
              <Suspense>
                <Areas />
              </Suspense>
            }
          />

          <Route
            path="/property-types"
            element={
              <Suspense>
                <PropertyTypes />
              </Suspense>
            }
          />
        </Route>
      </Route>
    </Routes>
  );
}

export default App;
