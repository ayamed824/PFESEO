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

  return (
    <Routes>
      {/* Public pages */}
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<SignUp />} />
      <Route path="/pricing" element={<Pricing />} />
      <Route path="/features" element={<Features />} />
      <Route path="/how-it-works" element={<HowItWorks />} />

      {/* Protected dashboard */}
      <Route
        path="/dashboard"
        element={
          isAuthenticated() ? (
            <Layout><MainDashboard /></Layout>
          ) : (
            <Navigate to="/login" />
          )
        }
      />
      <Route path="/technical-seo" element={<Layout><TechnicalSEO /></Layout>} />
      <Route path="/content-analysis" element={<Layout><ContentAnalysis /></Layout>} />
      <Route path="/ux-analysis" element={<Layout><UXAnalysis /></Layout>} />
      <Route path="/popularity-seo" element={<Layout><PopularitySEO /></Layout>} />
      <Route path="/intelligent-agents" element={<Layout><IntelligentAgents /></Layout>} />
      <Route path="/recommendations" element={<Layout><Recommendations /></Layout>} />
      <Route path="/report-history" element={<Layout><ReportHistory /></Layout>} />
      <Route path="/settings" element={<Layout><Settings /></Layout>} />
    </Routes>
  );
}

export default App;