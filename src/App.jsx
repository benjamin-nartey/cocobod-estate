import { Routes, Route } from "react-router-dom";
import { useEffect } from "react";
import { axiosInstance } from "./axios/axiosInstance";
import { useNavigate, useLocation } from "react-router-dom";
import state from "./store/store";
import { lazy, Suspense } from "react";

import Navigation from "./routes/Navigation/Navigation";
import LoadingPage from "./routes/LoadingPage/LoadingPage";

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
// const LoadingPage = lazy(() => import("./routes/LoadingPage/LoadingPage"));
const Unauthorized = lazy(() => import("./routes/Unauthorized/Unauthorized"));

const NotExistPage = lazy(() => import("./routes/NotExistPage/NotExistPage"));

const renderLoader = () => <LoadingPage />;

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
          <Suspense fallback={renderLoader()}>
            <Authentication />
          </Suspense>
        }
      />
      <Route
        path="login"
        element={
          <Suspense fallback={renderLoader()}>
            <Authentication />
          </Suspense>
        }
      />
      <Route
        path="unauthorized"
        element={
          <Suspense fallback={renderLoader()}>
            <Unauthorized />
          </Suspense>
        }
      />

      <Route path="loadingPage" element={<LoadingPage />} />

      <Route
        path="*"
        element={
          <Suspense fallback={renderLoader()}>
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
              <Suspense fallback={renderLoader()}>
                <Home />
              </Suspense>
            }
          >
            <Route
              path="/home"
              element={
                <Suspense fallback={renderLoader()}>
                  <Properties />
                </Suspense>
              }
            />
            <Route
              path="/home/*"
              element={
                <Suspense fallback={renderLoader()}>
                  <NotExistPage />
                </Suspense>
              }
            />
            <Route
              path="home/category/:categoryId"
              element={
                <Suspense fallback={renderLoader()}>
                  <Properties />
                </Suspense>
              }
            />
            <Route
              path="home/category/*"
              element={
                <Suspense fallback={renderLoader()}>
                  <NotExistPage />
                </Suspense>
              }
            />
          </Route>
          <Route
            element={
              <Suspense fallback={renderLoader()}>
                <PropertyDetailsPage />
              </Suspense>
            }
          >
            <Route
              path="property-detail/:propId"
              element={
                <Suspense fallback={renderLoader()}>
                  <PropertyDetail />
                </Suspense>
              }
            />
          </Route>
          <Route
            path="gallery"
            element={
              <Suspense fallback={renderLoader()}>
                <Gallery />
              </Suspense>
            }
          />
          <Route
            path="map"
            element={
              <Suspense fallback={renderLoader()}>
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
              <Suspense fallback={renderLoader()}>
                <Dashboard />
              </Suspense>
            }
          />

          <Route
            path="/users"
            element={
              <Suspense fallback={renderLoader()}>
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
