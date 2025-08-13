import "./App.css";
import { Route, Routes } from "react-router-dom";
import Dashboard from "./views/Dashboard";
import PermanentDrawer from "./components/PermanentDrawer";

export default function App() {
  return (
    <>
      <PermanentDrawer />
      <Routes>
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </>
  );
}
