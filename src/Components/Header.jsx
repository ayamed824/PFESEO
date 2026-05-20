import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import logo from "../assets/logo.jpeg";

function Header() {
  const navigate = useNavigate();
  const location = useLocation();

  const isHomePage = location.pathname === "/";
  const isAuthenticated = Boolean(localStorage.getItem("token"));

  const handleStart = () => {
    if (isAuthenticated) navigate("/dashboard");
    else navigate("/signup");
  };

  const goToSection = (id, fallbackPage) => {
    if (isHomePage) {
      const section = document.getElementById(id);
      if (section) section.scrollIntoView({ behavior: "smooth" });
    } else {
      navigate(fallbackPage);
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <header className="bg-white border-b border-gray-200 fixed top-0 left-0 right-0 z-50">
      <nav className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">

        {/* Logo */}
        <div
          className="flex items-center space-x-3 cursor-pointer"
          onClick={() => navigate("/")}
        >
          <div className="w-10 h-10 bg-gradient-to-br from-primary to-accent rounded-lg flex items-center justify-center overflow-hidden">
            <img src={logo} alt="SEO Insights" className="w-6 h-6 object-contain" />
          </div>
          <span className="text-xl font-bold text-gray-900">SEO Insights</span>
        </div>

        {/* Navigation */}
        <div className="flex items-center space-x-8">
          <button onClick={() => navigate("/")} className="text-gray-600 hover:text-gray-900 font-medium">
            Home
          </button>

          <button
            onClick={() => goToSection("features-section", "/features")}
            className="text-gray-600 hover:text-gray-900 font-medium"
          >
            Features
          </button>

          <button
            onClick={() => goToSection("how-it-works-section", "/how-it-works")}
            className="text-gray-600 hover:text-gray-900 font-medium"
          >
            How It Works
          </button>

          <button
            onClick={() => navigate("/pricing")}
            className="text-gray-600 hover:text-gray-900 font-medium"
          >
            Pricing
          </button>

          {!isAuthenticated ? (
            <>
              <button
                onClick={() => navigate("/login")}
                className="px-5 py-2 text-primary border border-primary rounded-lg hover:bg-blue-50 font-medium"
              >
                Sign In
              </button>

              <button
                onClick={handleStart}
                className="px-5 py-2 bg-primary text-white rounded-lg hover:bg-blue-700 font-medium"
              >
                Get Started
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => navigate("/dashboard")}
                className="px-5 py-2 bg-primary text-white rounded-lg hover:bg-blue-700 font-medium"
              >
                Dashboard
              </button>

              <button
                onClick={logout}
                className="px-4 py-2 border rounded-lg hover:bg-gray-100"
              >
                Logout
              </button>
            </>
          )}
        </div>
      </nav>
    </header>
  );
}

export default Header;