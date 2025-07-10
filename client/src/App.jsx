import React from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import NotePage from "./pages/NotePage";
import Navbar from "./components/Navbar";

const App = () => {
  const token = localStorage.getItem("token");
  const location = useLocation();

  const hideNavbar = ["/login", "/signup"].includes(location.pathname);

  const PrivateRoute = ({ children }) => {
    return token ? children : <Navigate to="/login" replace />;
  };

  return (
<div className="min-h-screen bg-white text-black dark:bg-gray-900 dark:text-white transition-all duration-300">
      {!hideNavbar && <Navbar />}
      <Routes>
        <Route path="/" element={<Navigate to="/dashboard" />} />
        <Route
          path="/login"
          element={!token ? <Login /> : <Navigate to="/dashboard" />}
        />
        <Route
          path="/signup"
          element={!token ? <Signup /> : <Navigate to="/dashboard" />}
        />

        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          }
        />
        <Route
          path="/note/:id"
          element={
            <PrivateRoute>
              <NotePage />
            </PrivateRoute>
          }
        />
        <Route
          path="/note"
          element={
            <PrivateRoute>
              <NotePage />
            </PrivateRoute>
          }
        />
      </Routes>
    </div>
  );
};

export default App;
