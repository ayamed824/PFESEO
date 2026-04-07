import React, { useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Plotly from 'plotly.js-dist-min';
import { api } from "../../services/api";
import Header from "../Header";

const MainDashboard = () => {
  const chartRef = useRef(null);
  const navigate = useNavigate();
  
  // 📡 États pour les données dynamiques
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [latestAnalysis, setLatestAnalysis] = useState(null);
  const [userName, setUserName] = useState("");

  // 🔐 Vérifier l'authentification au montage
  // 🔐 Vérifier l'authentification au montage
useEffect(() => {
  const token = localStorage.getItem("token");

  if (!token) {
    navigate("/login?returnTo=/dashboard");
    return;
  }

  fetchUser();
}, [navigate]);

// ✅ fetch user (برا useEffect)
const fetchUser = async () => {
  try {
    const user = await api.getMe();
    setUserName(user.full_name || user.email || "User");
  } catch (err) {
    console.error("User fetch failed", err);
  }
};

  // 📡 Fetch latest analysis on mount
  useEffect(() => {
    fetchLatestAnalysis();
  }, []);

  // 🔄 Refresh chart quand les données changent
  useEffect(() => {
    if (latestAnalysis && chartRef.current) {
      renderChart(latestAnalysis.category_scores);
    }
  }, [latestAnalysis]);

  const fetchLatestAnalysis = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const data = await api.getMyAnalyses();
      
      if (data.analyses && data.analyses.length > 0) {
        // Prendre la plus récente (déjà triée par created_at desc côté backend)
        setLatestAnalysis(data.analyses[0]);
      } else {
        setLatestAnalysis(null);
      }
    } catch (err) {
      console.error("Failed to fetch analyses:", err);
      setError(err.message || "Failed to load dashboard data");
      
      // Auto-redirect si token expiré (401)
      if (err.message?.includes("401") || err.message?.includes("Unauthorized")) {
        localStorage.removeItem("token");
        localStorage.removeItem("userName");
        navigate("/login");
      }
    } finally {
      setLoading(false);
    }
  };

  // 🎨 Render Plotly chart avec données dynamiques
  const renderChart = (categoryScores) => {
    if (!chartRef.current) return;
    
    const categories = ['Technical SEO', 'Content Quality', 'Popularity', 'UX / UI'];
    const keys = ['technical', 'content', 'popularity', 'ux'];
    
    const scores = keys.map(key => categoryScores?.[key] ?? 0);
    const colors = scores.map(s => 
      s >= 80 ? '#10b981' : s >= 50 ? '#eab308' : '#f97316'
    );

    const categoryData = [{
      type: 'bar',
      x: categories,
      y: scores,
      marker: { color: colors },
      text: scores.map(String),
      textposition: 'outside',
      textfont: { size: 14, color: '#111827', family: 'Inter' }
    }];

    const categoryLayout = {
      title: { text: '', font: { size: 16 } },
      xaxis: { title: '', tickfont: { size: 12, color: '#6b7280' } },
      yaxis: { title: 'Score', range: [0, 100], tickfont: { size: 12, color: '#6b7280' } },
      margin: { t: 20, r: 20, b: 60, l: 60 },
      plot_bgcolor: '#ffffff',
      paper_bgcolor: '#ffffff',
      showlegend: false
    };

    const config = { responsive: true, displayModeBar: false, displaylogo: false };

    Plotly.react(chartRef.current, categoryData, categoryLayout, config);
  };

  // 🚀 Handlers
  const handleReAnalyze = () => navigate("/");
  const handleRefresh = () => fetchLatestAnalysis();
  const handleExport = () => {
    // TODO: Implement PDF export (Task #20)
    alert("Export feature coming soon! 📄");
  };

  // 🎨 Skeleton loading
  if (loading) {
    return (
      <div className="bg-gray-50 min-h-screen">
        <Header />
        <div className="p-8 animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/3 mb-8"></div>
          <div className="grid grid-cols-3 gap-6 mb-8">
            <div className="col-span-1 bg-white rounded-2xl p-8">
              <div className="h-48 bg-gray-200 rounded mb-4"></div>
              <div className="h-4 bg-gray-200 rounded w-3/4 mx-auto"></div>
            </div>
            <div className="col-span-2 bg-white rounded-2xl p-8">
              <div className="space-y-4">
                {[1,2,3,4].map(i => (
                  <div key={i} className="h-16 bg-gray-200 rounded"></div>
                ))}
              </div>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-6">
            <div className="bg-white rounded-2xl p-6 h-80"></div>
            <div className="bg-white rounded-2xl p-6 h-80"></div>
          </div>
        </div>
      </div>
    );
  }

  // 🚫 Empty state: no analyses yet
  if (!latestAnalysis) {
    return (
      <div className="bg-gray-50 min-h-screen">
        <Header />
        <div className="p-8 flex items-center justify-center min-h-[60vh]">
          <div className="text-center max-w-md">
            <div className="text-6xl mb-6">🔍</div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">No analyses yet</h2>
            <p className="text-gray-600 mb-8">
              Launch your first SEO analysis to see your dashboard come to life!
            </p>
            <button
              onClick={handleReAnalyze}
              className="px-6 py-3 bg-primary text-white rounded-xl font-medium hover:bg-blue-700 transition"
            >
              Launch Analysis →
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ✅ Données réelles
  const global_score = latestAnalysis?.scores?.global_score ?? 0;

const category_scores = {
  technical: latestAnalysis?.scores?.technical_seo ?? 0,
  content: latestAnalysis?.scores?.content_quality ?? 0,
  ux: latestAnalysis?.scores?.ux_ui ?? 0,
  popularity: latestAnalysis?.scores?.popularity ?? 0
};

const url = latestAnalysis?.url ?? "";
const created_at = latestAnalysis?.created_at;
const issues = latestAnalysis?.issues ?? [];
const recommendations = latestAnalysis?.recommendations ?? [];
  // Helper pour couleur du score
  const getScoreColor = (score) => {
    if (score >= 80) return "text-secondary border-secondary";
    if (score >= 50) return "text-yellow-500 border-yellow-500";
    return "text-red-500 border-red-500";
  };

  const getBarColor = (score) => {
    if (score >= 80) return "bg-secondary";
    if (score >= 50) return "bg-yellow-400";
    return "bg-red-500";
  };

  // Calculer le strokeDashoffset pour le cercle de score
  const radius = 88;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (global_score / 100) * circumference;

  return (
    <div className="bg-gray-50 min-h-screen">
      <Header />

      <div className="p-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Welcome back, {userName?.split(" ")[0] || "User"} 👋
              </h1>
              {url && (
                <p className="text-gray-600 text-sm mt-1">
                  Analyzing: <span className="font-medium">{new URL(url).hostname}</span>
                </p>
              )}
            </div>
            <div className="flex items-center space-x-3">
              <button 
                onClick={handleExport}
                className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 font-medium transition"
              >
                <i className="fa-solid fa-download mr-2"></i>
                Export Report
              </button>
              <button 
                onClick={handleReAnalyze}
                className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-blue-700 font-medium transition"
              >
                <i className="fa-solid fa-rotate mr-2"></i>
                Re-analyze
              </button>
            </div>
          </div>
          <p className="text-gray-600">
            Complete overview of your website's SEO performance and health
          </p>
        </div>

        {/* Error message */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 flex items-center justify-between">
            <span>❌ {error}</span>
            <button onClick={handleRefresh} className="underline hover:text-red-900">Retry</button>
          </div>
        )}

        {/* Score Cards */}
        <div className="grid grid-cols-3 gap-6 mb-8">
          {/* Global Score */}
          <div className="col-span-1 bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
            <h2 className="text-lg font-semibold text-gray-900 mb-6 text-center">Global SEO Score</h2>
            <div className="flex items-center justify-center mb-6">
              <div className="relative w-48 h-48">
                <svg className="transform -rotate-90 w-48 h-48">
                  <circle cx="96" cy="96" r={radius} stroke="#e5e7eb" strokeWidth="12" fill="none"></circle>
                  <circle 
                    cx="96" cy="96" r={radius} 
                    stroke="currentColor" 
                    strokeWidth="12" 
                    fill="none"
                    strokeDasharray={circumference} 
                    strokeDashoffset={offset} 
                    strokeLinecap="round"
                    className={`${getScoreColor(global_score).split(' ')[0]} transition-all duration-500`}
                  ></circle>
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className={`text-5xl font-bold ${getScoreColor(global_score).split(' ')[0]}`}>
                    {global_score}
                  </span>
                  <span className="text-sm text-gray-500 font-medium">out of 100</span>
                </div>
              </div>
            </div>
            <div className="flex items-center justify-center space-x-2 mb-4">
              <div className={`w-3 h-3 rounded-full ${
                global_score >= 80 ? 'bg-secondary' : global_score >= 50 ? 'bg-yellow-400' : 'bg-red-500'
              }`}></div>
              <span className="text-sm font-medium text-gray-700">
                {global_score >= 80 ? "Good Optimization" : global_score >= 50 ? "Moderate Optimization" : "Needs Improvement"}
              </span>
            </div>
            <p className="text-center text-sm text-gray-600">
              {global_score >= 80 
                ? "Great job! Your site is well optimized." 
                : global_score >= 50 
                  ? "Your site is moderately optimized. Priority improvements detected." 
                  : "Your site needs significant SEO improvements."}
            </p>
          </div>

          {/* Category Bars */}
          <div className="col-span-2 bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
            <h2 className="text-lg font-semibold text-gray-900 mb-6">Category Scores</h2>
            <div className="space-y-5">
              {[
                { key: 'technical', icon: 'fa-wrench', color: 'bg-blue-50', iconColor: 'text-primary', label: 'Technical SEO' },
                { key: 'content', icon: 'fa-file-lines', color: 'bg-purple-50', iconColor: 'text-purple-600', label: 'Content Quality' },
                { key: 'popularity', icon: 'fa-star', color: 'bg-orange-50', iconColor: 'text-orange-500', label: 'Popularity' },
                { key: 'ux', icon: 'fa-paintbrush', color: 'bg-green-50', iconColor: 'text-secondary', label: 'UX / UI' },
              ].map((item) => {
                const score = category_scores[item.key] ?? 0;
                return (
                  <div key={item.key}>
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-3">
                        <div className={`w-10 h-10 ${item.color} rounded-lg flex items-center justify-center`}>
                          <i className={`fa-solid ${item.icon} ${item.iconColor}`}></i>
                        </div>
                        <span className="font-medium text-gray-900">{item.label}</span>
                      </div>
                      <span className="text-2xl font-bold text-gray-900">{score}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                      <div 
                        className={`${getBarColor(score)} h-2.5 rounded-full transition-all duration-500`} 
                        style={{ width: `${score}%` }}
                      ></div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-2 gap-6 mb-8">
          {/* Category Performance Chart */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Category Performance</h2>
            <div ref={chartRef} style={{ height: '350px' }}></div>
          </div>

          {/* Health Gauge */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">SEO Health Indicator</h2>
            <div className="flex flex-col items-center justify-center h-80">
              <div className="relative w-64 h-32 mb-6">
                <svg viewBox="0 0 200 100" className="w-full">
                  <path d="M 10 90 A 90 90 0 0 1 190 90" fill="none" stroke="#e5e7eb" strokeWidth="20" strokeLinecap="round"></path>
                  <path 
                    d="M 10 90 A 90 90 0 0 1 190 90" 
                    fill="none" 
                    stroke="url(#gradient)" 
                    strokeWidth="20" 
                    strokeLinecap="round"
                    strokeDasharray="282.74" 
                    strokeDashoffset={282.74 * (1 - global_score / 100)}
                  ></path>
                  <defs>
                    <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" style={{ stopColor: '#ef4444', stopOpacity: 1 }} />
                      <stop offset="50%" style={{ stopColor: '#eab308', stopOpacity: 1 }} />
                      <stop offset="100%" style={{ stopColor: '#10b981', stopOpacity: 1 }} />
                    </linearGradient>
                  </defs>
                </svg>
                <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 text-center">
                  <div className={`text-4xl font-bold ${getScoreColor(global_score).split(' ')[0]}`}>{global_score}%</div>
                  <div className="text-sm text-gray-600 font-medium">Health Score</div>
                </div>
              </div>
              <div className="flex items-center space-x-6">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                  <span className="text-sm text-gray-600">Poor (0-50)</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
                  <span className="text-sm text-gray-600">Moderate (51-79)</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-secondary rounded-full"></div>
                  <span className="text-sm text-gray-600">Good (80-100)</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Summary + Quick Actions */}
        <div className="grid grid-cols-3 gap-6 mb-8">
          {/* Summary */}
          <div className="col-span-2 bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl p-6 border border-blue-200">
            <div className="flex items-start space-x-4">
              <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center flex-shrink-0">
                <i className="fa-solid fa-info text-white text-xl"></i>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Summary</h3>
                <p className="text-gray-700 mb-4">
                  {global_score >= 80 
                    ? "Excellent work! Your site follows SEO best practices. Keep monitoring for continuous improvement." 
                    : global_score >= 50 
                      ? `Your site is moderately optimized with a global score of ${global_score}/100. While some areas are solid, there are priority improvements needed.` 
                      : `Your site needs significant SEO improvements (score: ${global_score}/100). Focus on the critical issues below to boost your rankings.`}
                </p>
                <div className="flex flex-wrap gap-2">
                  {issues.length > 0 && (
                    <span className="px-3 py-1 bg-white text-gray-700 text-sm font-medium rounded-full">
                      {issues.length} Issues Found
                    </span>
                  )}
                  {recommendations.length > 0 && (
                    <span className="px-3 py-1 bg-white text-gray-700 text-sm font-medium rounded-full">
                      {recommendations.length} Recommendations
                    </span>
                  )}
                  <span className="px-3 py-1 bg-white text-gray-700 text-sm font-medium rounded-full">
                    Analyzed: {created_at ? new Date(created_at).toLocaleDateString() : "N/A"}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
            <div className="space-y-3">
              <Link to="/recommendations" className="w-full px-4 py-3 bg-primary text-white rounded-lg hover:bg-blue-700 font-medium transition text-left flex items-center">
                <i className="fa-solid fa-lightbulb mr-3"></i>
                View Recommendations
              </Link>
              <Link to="/intelligent-agents" className="w-full px-4 py-3 bg-white text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 font-medium transition text-left flex items-center">
                <i className="fa-solid fa-robot mr-3"></i>
                Talk to AI Agents
              </Link>
              <button 
                onClick={handleExport}
                className="w-full px-4 py-3 bg-white text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 font-medium transition text-left flex items-center"
              >
                <i className="fa-solid fa-file-pdf mr-3"></i>
                Download Report
              </button>
            </div>
          </div>
        </div>

        {/* Detail Cards */}
        <div className="grid grid-cols-4 gap-4">
          {[
            { to: '/technical-seo', icon: 'fa-wrench', color: 'bg-blue-50', iconColor: 'text-primary', hoverColor: 'group-hover:bg-blue-100', title: 'Technical Details', desc: 'View in-depth technical analysis' },
            { to: '/content-analysis', icon: 'fa-file-lines', color: 'bg-purple-50', iconColor: 'text-purple-600', hoverColor: 'group-hover:bg-purple-100', title: 'Content Analysis', desc: 'Optimize your content quality' },
            { to: '/ux-analysis', icon: 'fa-paintbrush', color: 'bg-green-50', iconColor: 'text-secondary', hoverColor: 'group-hover:bg-green-100', title: 'UX / UI Report', desc: 'Improve user experience' },
            { to: '/popularity-seo', icon: 'fa-star', color: 'bg-orange-50', iconColor: 'text-orange-500', hoverColor: 'group-hover:bg-orange-100', title: 'Popularity Metrics', desc: 'Check backlinks & authority' },
          ].map((link, idx) => (
            <Link key={idx} to={link.to} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition group">
              <div className={`w-12 h-12 ${link.color} rounded-lg flex items-center justify-center mb-4 ${link.hoverColor} transition`}>
                <i className={`fa-solid ${link.icon} ${link.iconColor} text-xl`}></i>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">{link.title}</h3>
              <p className="text-sm text-gray-600">{link.desc}</p>
              <div className={`mt-4 flex items-center ${link.iconColor} text-sm font-medium`}>
                View Report
                <i className="fa-solid fa-arrow-right ml-2"></i>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MainDashboard;