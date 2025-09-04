import "./App.css";
import { Route, Routes } from "react-router-dom";
import Dashboard from "./views/Dashboard";
import PermanentDrawer from "./components/PermanentDrawer";
import Crypto from "./views/Crypto";
import Currency from "./views/Currency";
import Weather from "./views/Weather";

export default function App() {
  return (
    <>
      <PermanentDrawer />
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/crypto" element={<Crypto />} />
        <Route path="/currency" element={<Currency />} />
        <Route path="/weather" element={<Weather />} />
      </Routes>
    </>
  );
}
