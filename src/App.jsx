import { Routes, Route, Navigate, useLocation } from "react-router-dom";

// Public pages
import Home from "./Components/pages/Home";
import Login from "./Components/pages/Login";
import SignUp from "./Components/pages/SignUp";
import Pricing from "./Components/pages/Pricing";
import Features from "./Components/pages/Features";
import HowItWorks from "./Components/pages/HowItWorks";
// Dashboard layout + pages
import AdminPricing from "./Components/pages/AdminPricing";
import ForgotPassword from "./Components/pages/ForgotPassword";
import ResetPassword from "./Components/pages/ResetPassword";
import { Toaster } from 'react-hot-toast';


import Layout from "./Components/Layout/Layout";
import Checkout from "./Components/pages/Checkout"; 
import MainDashboard from "./Components/pages/MainDashboard";
import TechnicalSEO from "./Components/pages/TechnicalSEO";
import ContentAnalysis from "./Components/pages/ContentAnalysis";
import UXAnalysis from "./Components/pages/UXAnalysis";
import PopularitySEO from "./Components/pages/PopularitySEO";
import IntelligentAgents from "./Components/pages/IntelligentAgents";
import Recommendations from "./Components/pages/Recommendations";
import ReportHistory from "./Components/pages/ReportHistory";
import Settings from "./Components/pages/Settings";
import AdminActivity from "./Components/pages/AdminActivity";
import AdminConfiguration from "./Components/pages/AdminConfiguration";

function App() {
  const location = useLocation();
  const isAdmin = localStorage.getItem("is_admin") === "true";
  const isAuthenticated = () => !!localStorage.getItem("token");

  // 🔒 Protection pour les utilisateurs normaux (dashboard classique)
  const protect = (component) => {
    if (!isAuthenticated()) {
      return <Navigate to={`/login?returnTo=${encodeURIComponent(location.pathname)}`} replace />;
    }
    // Si c'est un admin, redirige vers AdminActivity
    if (isAdmin) {
      return <Navigate to="/AdminActivity" replace />;
    }
    return <Layout>{component}</Layout>;
  };

  // 🔒 Protection pour les routes admin uniquement
  const protectAdmin = (component) => {
    if (!isAuthenticated()) {
      return <Navigate to={`/login?returnTo=${encodeURIComponent(location.pathname)}`} replace />;
    }
    if (!isAdmin) {
      return <Navigate to="/dashboard" replace />;
    }
    return <Layout>{component}</Layout>;
  };
  

  return (
    
    <Routes>
      {/* Public pages */}
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<SignUp />} />
      <Route path="/pricing" element={<Pricing />} />
      <Route path="/features" element={<Features />} />
      <Route path="/how-it-works" element={<HowItWorks />} />

      {/* ==================== ROUTES UTILISATEUR NORMAL ==================== */}
      <Route path="/dashboard" element={protect(<MainDashboard />)} />
      <Route path="/technical-seo" element={protect(<TechnicalSEO />)} />
      <Route path="/content-analysis" element={protect(<ContentAnalysis />)} />
      <Route path="/ux-analysis" element={protect(<UXAnalysis />)} />
      <Route path="/popularity-seo" element={protect(<PopularitySEO />)} />
      <Route path="/intelligent-agents" element={protect(<IntelligentAgents />)} />
      <Route path="/recommendations" element={protect(<Recommendations />)} />
      <Route path="/report-history" element={protect(<ReportHistory />)} />
      <Route path="/settings" element={protect(<Settings />)} />
      <Route path="/checkout" element={<Checkout />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password" element={<ResetPassword />} />

      {/* ==================== ROUTES ADMIN UNIQUEMENT ==================== */}
      <Route path="/AdminActivity" element={protectAdmin(<AdminActivity />)} />
      <Route path="/AdminConfiguration" element={protectAdmin(<AdminConfiguration />)} />
      <Route path="/admin-pricing" element={protectAdmin(<AdminPricing />)} />
    </Routes>
    
  );
}

export default App;