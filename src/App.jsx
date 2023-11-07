import { Routes, Route } from "react-router-dom";
import { useEffect } from "react";
import { axiosInstance } from "./axios/axiosInstance";
import { useNavigate, useLocation } from "react-router-dom";
import state from "./store/store";
import { lazy, Suspense } from "react";
import FetchingPage from "./routes/FetchingPage/FetchingPage";
import Navigation from "./routes/Navigation/Navigation";

// const Navigation = lazy(() => import("./routes/Navigation/Navigation"));
const Authentication = lazy(() =>
  import("./routes/Authentication/Authentication")
);
const Home = lazy(() => import("./routes/Home/Home"));
const Users = lazy(() => import("./routes/Users/Users"));
const Properties = lazy(() => import("./routes/Properties/Properties"));
const PropertyDetailsPage = lazy(() =>
  import("./routes/PropertyDetailsPage/PropertyDetailsPage")
);
const PropertyDetail = lazy(() =>
  import("./components/PropertyDetail/PropertyDetail")
);
const Gallery = lazy(() => import("./routes/Gallery/Gallery"));
const PropertyMap = lazy(() => import("./routes/PropertyMap/PropertyMap"));
const RequireAuth = lazy(() => import("./components/RequireAuth/RequireAuth"));
const Dashboard = lazy(() => import("./routes/Dashboard/Dashboard"));

const Unauthorized = lazy(() => import("./routes/Unauthorized/Unauthorized"));

const NotExistPage = lazy(() => import("./routes/NotExistPage/NotExistPage"));

function App() {
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname;

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
        </Route>
      </Route>
    </Routes>
  );
}

export default App;
