import "./App.css";
import { Route, Routes, useLocation } from "react-router-dom";
import Dashboard from "./views/Dashboard";
import PermanentDrawer from "./components/PermanentDrawer";
import Crypto from "./views/Crypto";
import Currency from "./views/Currency";
import Weather from "./views/Weather";
import About from "./views/About";
import Contact from "./views/Contact";
import Login from "./views/Login";
import Signup from "./views/Signup";

export default function App() {
  const location = useLocation();
  const isAuthPage =
    location.pathname === "/login" || location.pathname === "/signup";

  return (
    <>
      {!isAuthPage && <PermanentDrawer />}
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/" element={<Dashboard />} />
        <Route path="/crypto" element={<Crypto />} />
        <Route path="/currency" element={<Currency />} />
        <Route path="/weather" element={<Weather />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
      </Routes>
    </>
  );
}
