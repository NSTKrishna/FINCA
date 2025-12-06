import React from "react";
import Signup from "./pages/signup";
import Login from "./pages/login";
import LandingPage from "./pages/landing";
import UploadPage from "./pages/upload";
import ReportPage from "./pages/report";
import { AuthProvider } from "./context/AuthContext";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import MainContent from "./component/dashboard/main_content";
import DashboardLayout from "./component/dashboard/dashboard_layout";

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login />} />

          {/* Dashboard Routes with Sidebar */}
          <Route element={<DashboardLayout />}>
            <Route path="/dashboard" element={<MainContent />} />
            <Route path="/upload" element={<UploadPage />} />
            <Route path="/reports" element={<ReportPage />} />
          </Route>

          <Route path="/landing" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
