// src/pages/Hero.jsx
import { useState } from "react";

function Hero() {
  const [url, setUrl] = useState("");
  const [error, setError] = useState(false);

  const analyze = () => {
    if (!url) {
      setError(true);
      return;
    }

    const pattern = /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/;
    if (!pattern.test(url)) {
      alert("Please enter a valid URL");
      setError(true);
      return;
    }

    setError(false);
    console.log("Analyzing:", url);
  };

  return (
    <section id="hero-section" className="bg-gradient-to-b from-blue-50 to-white py-20">
      <div className="max-w-6xl mx-auto px-6 text-center">

        {/* Badge */}
        <div className="inline-flex items-center px-4 py-2 bg-blue-100 text-primary rounded-full text-sm font-medium mb-6">
          <i className="fa-solid fa-sparkles mr-2"></i>
          AI-Powered SEO Analysis
        </div>

        {/* Heading */}
        <h1 className="text-5xl font-bold text-gray-900 mb-6 leading-tight">
          Analyze, Score & Improve Your<br />Website SEO with Intelligent Agents
        </h1>

        {/* Description */}
        <p className="text-xl text-gray-600 mb-10 max-w-3xl mx-auto">
          Get comprehensive SEO insights powered by AI agents. Identify technical issues, optimize content, and improve your search rankings with actionable recommendations.
        </p>

        {/* Input Section */}
        <div id="url-input-section" className="max-w-2xl mx-auto">
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex flex-col space-y-4">

              {/* URL Input */}
              <div className="relative">
                <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                  <i className="fa-solid fa-globe text-gray-400"></i>
                </div>
                <input
                  type="url"
                  id="website-url"
                  placeholder="Enter your website URL (e.g., https://example.com)"
                  value={url}
                  onChange={(e) => {
                    setUrl(e.target.value);
                    setError(false);
                  }}
                  className={`w-full pl-12 py-4 border-2 rounded-lg ${
                    error ? "border-red-500" : "border-gray-200"
                  } focus:outline-none focus:border-primary text-gray-900 text-lg transition`}
                />
                {error && (
                  <p className="text-red-500 text-sm mt-2 text-left">
                    Please enter a valid URL
                  </p>
                )}
              </div>

              {/* Analyze Button */}
              <button
                onClick={analyze}
                className="w-full bg-primary text-white py-4 rounded-lg font-semibold text-lg hover:bg-blue-700 transition flex items-center justify-center"
              >
                <i className="fa-solid fa-magnifying-glass mr-2"></i>
                Analyze Website
              </button>

            </div>

            {/* Info Text */}
            <p className="text-sm text-gray-500 mt-4 text-center">
              <i className="fa-solid fa-shield-halved mr-1"></i>
              Free analysis • No credit card required • Results in 60 seconds
            </p>
          </div>
        </div>

        {/* Trusted Users & Rating */}
        <div className="flex items-center justify-center space-x-8 mt-12">
          <div className="flex items-center">
            <div className="flex -space-x-2">
              <img src="https://storage.googleapis.com/uxpilot-auth.appspot.com/avatars/avatar-1.jpg" alt="User" className="w-10 h-10 rounded-full border-2 border-white" />
              <img src="https://storage.googleapis.com/uxpilot-auth.appspot.com/avatars/avatar-2.jpg" alt="User" className="w-10 h-10 rounded-full border-2 border-white" />
              <img src="https://storage.googleapis.com/uxpilot-auth.appspot.com/avatars/avatar-3.jpg" alt="User" className="w-10 h-10 rounded-full border-2 border-white" />
              <img src="https://storage.googleapis.com/uxpilot-auth.appspot.com/avatars/avatar-4.jpg" alt="User" className="w-10 h-10 rounded-full border-2 border-white" />
            </div>
            <span className="ml-3 text-sm text-gray-600">
              Trusted by <span className="font-semibold">10,000+</span> users
            </span>
          </div>

          <div className="flex items-center text-yellow-500">
            <i className="fa-solid fa-star"></i>
            <i className="fa-solid fa-star"></i>
            <i className="fa-solid fa-star"></i>
            <i className="fa-solid fa-star"></i>
            <i className="fa-solid fa-star"></i>
            <span className="ml-2 text-sm text-gray-600">4.9/5 rating</span>
          </div>
        </div>

      </div>
    </section>
  );
}

export default Hero;
