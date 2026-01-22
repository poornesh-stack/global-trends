import "./App.css";
import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import Dashboard from "./views/Dashboard";
import PermanentDrawer from "./components/PermanentDrawer";
import Crypto from "./views/Crypto";
import Currency from "./views/Currency";
import Weather from "./views/Weather";
import About from "./views/About";
import Contact from "./views/Contact";
import Login from "./views/Login";
import Signup from "./views/Signup";
import { useAuthContext } from "./context/AuthContextProvider";

// Protected Route Component
function ProtectedRoute({ children }) {
  const { user } = useAuthContext();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

// Auth Route Component (redirects to home if already logged in)
function AuthRoute({ children }) {
  const { user } = useAuthContext();

  if (user) {
    return <Navigate to="/" replace />;
  }

  return children;
}

export default function App() {
  const location = useLocation();
  const isAuthPage =
    location.pathname === "/login" || location.pathname === "/signup";

  return (
    <>
      {!isAuthPage && <PermanentDrawer />}
      <Routes>
        {/* Auth Routes - redirect to home if already logged in */}
        <Route
          path="/login"
          element={
            <AuthRoute>
              <Login />
            </AuthRoute>
          }
        />
        <Route
          path="/signup"
          element={
            <AuthRoute>
              <Signup />
            </AuthRoute>
          }
        />

        {/* Protected Routes - require authentication */}
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/crypto"
          element={
            <ProtectedRoute>
              <Crypto />
            </ProtectedRoute>
          }
        />
        <Route
          path="/currency"
          element={
            <ProtectedRoute>
              <Currency />
            </ProtectedRoute>
          }
        />
        <Route
          path="/weather"
          element={
            <ProtectedRoute>
              <Weather />
            </ProtectedRoute>
          }
        />
        <Route
          path="/about"
          element={
            <ProtectedRoute>
              <About />
            </ProtectedRoute>
          }
        />
        <Route
          path="/contact"
          element={
            <ProtectedRoute>
              <Contact />
            </ProtectedRoute>
          }
        />
      </Routes>
    </>
  );
}
