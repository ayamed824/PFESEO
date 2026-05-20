import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../services/api";

function Hero() {
  const navigate = useNavigate();
  const [url, setUrl] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [debugMessage, setDebugMessage] = useState(""); // Pour afficher les erreurs à l'écran

  const analyze = async () => {
    // 1️⃣ Validation de base de l'URL
    if (!url.trim()) {
      setError("Please enter a website URL");
      return;
    }

    // 2️⃣ Formatage de l'URL
    let formattedUrl = url.trim();
    if (!formattedUrl.startsWith("http://") && !formattedUrl.startsWith("https://")) {
      formattedUrl = "https://" + formattedUrl;
    }

    // 3️⃣ Validation format URL
    try {
      new URL(formattedUrl);
    } catch {
      setError("Please enter a valid URL (e.g., https://example.com)");
      return;
    }

    // 4️⃣ Vérifier l'authentification AVANT d'appeler l'API
    const token = localStorage.getItem("token");
    if (!token) {
      setDebugMessage("🔐 Redirecting to login...");
      navigate(`/login?returnTo=/${encodeURIComponent(`?pendingUrl=${formattedUrl}`)}`);
      return;
    }

    // 5️⃣ Lancer l'analyse via l'API (UN SEUL appel)
    setLoading(true);
    setError("");
    setDebugMessage("🔄 Lancement de l'analyse...");

    try {
      const result = await api.launchAnalysis(formattedUrl);
      if (result.analysis_id) {
        localStorage.setItem("analysisId", result.analysis_id);
      }
      
      // ✅ Succès
      setDebugMessage(`✅ Analyse terminée! Score: ${result.global_score}`);
      
      // Rediriger vers le dashboard avec les résultats
      navigate("/dashboard", {
        state: { 
          newAnalysis: true,
          analysisId: result.analysis_id,
          message: "✅ Analysis completed!"
        }
      });
      
    } catch (err) {
      // ❌ Gestion des erreurs
      console.error("Analysis launch error:", err);
      
      let userMessage = "❌ Failed to launch analysis";
      
      if (
        err.message?.includes("401") ||
        err.message?.includes("Unauthorized") ||
        err.message?.includes("expired authentication token") ||
        err.message?.includes("Session expired")
      ) {
        userMessage = "🔐 Session expired. Please login again.";
        localStorage.removeItem("token");
        navigate("/login?returnTo=/");
        return;
      }
      if (err.message?.includes("403") || err.message?.includes("quota")) {
        userMessage = "❌ Analysis quota exceeded. Please upgrade your plan.";
      } else if (err.message?.includes("CORS") || err.message?.includes("Failed to fetch")) {
        userMessage = "🌐 Connection error. Please check if backend is running.";
      } else if (err.message?.includes("Invalid URL")) {
        userMessage = "❌ Please enter a valid website URL";
      } else {
        userMessage = `❌ Error: ${err.message || "Unknown error"}`;
      }
      
      setError(userMessage);
      setDebugMessage(userMessage);
      
    } finally {
      setLoading(false);
    }
  };

  // Handle Enter key press
  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !loading) {
      analyze();
    }
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
                    setError("");
                    setDebugMessage("");
                  }}
                  onKeyPress={handleKeyPress}
                  disabled={loading}
                  className={`w-full pl-12 py-4 border-2 rounded-lg ${
                    error ? "border-red-500" : "border-gray-200"
                  } focus:outline-none focus:border-primary text-gray-900 text-lg transition disabled:bg-gray-50 disabled:cursor-not-allowed`}
                />
                {error && (
                  <p className="text-red-500 text-sm mt-2 text-left flex items-center">
                    <i className="fa-solid fa-circle-exclamation mr-1"></i>
                    {error}
                  </p>
                )}
              </div>

              {/* Debug Message Display */}
              {debugMessage && !error && (
                <p className="text-blue-600 text-sm mt-2 text-left flex items-center">
                  <i className="fa-solid fa-info-circle mr-1"></i>
                  {debugMessage}
                </p>
              )}

              {/* Analyze Button */}
              <button
                onClick={analyze}
                disabled={loading || !url.trim()}
                className={`w-full py-4 rounded-lg font-semibold text-lg transition flex items-center justify-center ${
                  loading || !url.trim()
                    ? "bg-primary/50 text-white/70 cursor-not-allowed"
                    : "bg-primary text-white hover:bg-blue-700"
                }`}
              >
                {loading ? (
                  <>
                    <i className="fa-solid fa-spinner fa-spin mr-2"></i>
                    Launching Analysis...
                  </>
                ) : (
                  <>
                    <i className="fa-solid fa-magnifying-glass mr-2"></i>
                    Analyze Website
                  </>
                )}
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
