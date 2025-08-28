import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import MapPage from "./pages/MapPage";
import "./App.css";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<></>} />
          <Route path="/map" element={<MapPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
