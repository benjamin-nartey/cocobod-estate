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

function App() {
  return (
    <Routes>
      <Route index element={<Authentication />} />
      <Route path="login" element={<Authentication />} />

      <Route element={<Navigation />}>
        {/* Public Routes */}

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
      </Route>
    </Routes>
  );
}

export default App;
