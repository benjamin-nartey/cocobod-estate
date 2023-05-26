import { Routes, Route } from "react-router-dom";
import Home from "./routes/home/Home";
import Authentication from "./routes/Authentication/Authentication";
function App() {
  return (
    <Routes>
      <Route index element={<Authentication />} />
      <Route path="home" element={<Home />} />
    </Routes>
  );
}

export default App;
