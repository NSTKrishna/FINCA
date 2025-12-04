import React from "react";
import Signup from "./pages/signup";
import Login from "./pages/login";
import LandingPage from "./pages/landing";
import Dashboard from "./pages/dashboard";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/landing" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
