import { Routes, Route, Navigate } from "react-router-dom";

// Public pages
import Home from "./Components/pages/Home";
import Login from "./Components/pages/Login";
import SignUp from "./Components/pages/SignUp";
import Pricing from "./Components/pages/Pricing";
import Features from "./Components/pages/Features";
import HowItWorks from "./Components/pages/HowItWorks";

// Dashboard layout + pages
import Layout from "./Components/Layout/Layout";
import MainDashboard from "./Components/pages/MainDashboard";
import TechnicalSEO from "./Components/pages/TechnicalSEO";
import ContentAnalysis from "./Components/pages/ContentAnalysis";
import UXAnalysis from "./Components/pages/UXAnalysis";
import PopularitySEO from "./Components/pages/PopularitySEO";
import IntelligentAgents from "./Components/pages/IntelligentAgents";
import Recommendations from "./Components/pages/Recommendations";
import ReportHistory from "./Components/pages/ReportHistory";
import Settings from "./Components/pages/Settings";

function App() {

  const isAuthenticated = () => !!localStorage.getItem("token");

  const protect = (component) => {
    return isAuthenticated() ? (
      <Layout>{component}</Layout>
    ) : (
      <Navigate to="/login" />
    );
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

      {/* Protected pages */}
      <Route path="/dashboard" element={protect(<MainDashboard />)} />
      <Route path="/technical-seo" element={protect(<TechnicalSEO />)} />
      <Route path="/content-analysis" element={protect(<ContentAnalysis />)} />
      <Route path="/ux-analysis" element={protect(<UXAnalysis />)} />
      <Route path="/popularity-seo" element={protect(<PopularitySEO />)} />
      <Route path="/intelligent-agents" element={protect(<IntelligentAgents />)} />
      <Route path="/recommendations" element={protect(<Recommendations />)} />
      <Route path="/report-history" element={protect(<ReportHistory />)} />
      <Route path="/settings" element={protect(<Settings />)} />

    </Routes>
  );
}

export default App;