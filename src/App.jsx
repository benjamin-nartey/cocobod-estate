import { Routes, Route } from "react-router-dom";
import Navigation from "./routes/Navigation/Navigation";
import Authentication from "./routes/Authentication/Authentication";
import Home from "./routes/home/Home";
import Properties from "./components/Properties/Properties";
function App() {
  return (
    <Routes>
      <Route index element={<Authentication />} />
      <Route element={<Navigation />}>
        <Route element={<Home />}>
          <Route path="/home" element={<Properties />} />
          <Route path="home/category/:categoryId" element={<Properties/>} />
        </Route>
      </Route>
    </Routes>
  );
}

export default App;
