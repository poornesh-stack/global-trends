import "./App.css";
import { Route, Routes } from "react-router-dom";
import Dashboard from "./views/Dashboard";
import PermanentDrawer from "./components/PermanentDrawer";
import Stocks from "./views/Stocks";
import Cryptocurrencies from "./views/Cryptocurrencies";
import Converter from "./views/Converter";

export default function App() {
  return (
    <>
      <PermanentDrawer />
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/stocks" element={<Stocks />} />
        <Route path="/cryptocurrencies" element={<Cryptocurrencies />} />
        <Route path="/converter" element={<Converter />} />
      </Routes>
    </>
  );
}
