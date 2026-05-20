
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { api } from "../../services/api";
import Header from "../Header";
import ExportModal from "./ExportModal";        // ✅ Import du modal d'export
import ExportProgress from "./ExportProgress";  // ✅ Import de la barre de progression

const priorityStyles = {
  critical: "border-red-500 bg-red-50 text-red-700",
  high: "border-red-500 bg-red-50 text-red-700",
  medium: "border-yellow-500 bg-yellow-50 text-yellow-700",
  low: "border-blue-500 bg-blue-50 text-blue-700",
};

const getScoreColor = (score) => {
  if (score >= 80) return "text-green-600";
  if (score >= 60) return "text-yellow-600";
  return "text-red-600";
};

const getBarColor = (score) => {
  if (score >= 80) return "bg-green-500";
  if (score >= 60) return "bg-yellow-500";
  return "bg-red-500";
};

const hostnameFromUrl = (url) => {
  try {
    return new URL(url).hostname;
  } catch {
    return url || "Unknown";
  }
};

const uniqueDomains = (links) => {
  const domains = new Set();
  links.forEach((link) => {
    try {
      domains.add(new URL(link.url).hostname);
    } catch {
      // Ignore malformed URLs from the crawler.
    }
  });
  return domains.size;
};

const PopularitySEO = () => {
  const navigate = useNavigate();
  const { analysisId } = useParams();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [analysis, setAnalysis] = useState(null);
  
  // 🆕 États pour l'export
  const [showExportModal, setShowExportModal] = useState(false);
  const [exportTaskId, setExportTaskId] = useState(null);
  const [exportUserId, setExportUserId] = useState(null);
  const [showProgress, setShowProgress] = useState(false);

  useEffect(() => {
    if (!localStorage.getItem("token")) {
      navigate("/login?returnTo=/popularity-seo");
    }
  }, [navigate]);

  useEffect(() => {
    fetchPopularityData();
  }, [analysisId]);

  const fetchPopularityData = async () => {
    try {
      setLoading(true);
      setError(null);

      let data = null;
      const finalId = analysisId || localStorage.getItem("analysisId");

      if (finalId) {
        data = await api.getAnalysisResults(finalId);
      } else {
        const analyses = await api.getMyAnalyses();
        const latest = analyses.analyses?.[0];
        data = latest ? await api.getAnalysisResults(latest.id) : null;
      }

      if (data?.id) {
        localStorage.setItem("analysisId", data.id);
      }
      setAnalysis(data);
    } catch (err) {
      setError(err.message || "Failed to load popularity data");
      if (err.message?.includes("Session expired")) {
        navigate("/login?returnTo=/popularity-seo");
      }
    } finally {
      setLoading(false);
    }
  };

  // 🚀 Export Handlers
  const handleExportClick = () => {
    setShowExportModal(true);
  };

  const handleExportStarted = (taskId) => {
    setExportTaskId(taskId);
    setShowExportModal(false);
    setShowProgress(true);
  };

  const handleExportComplete = () => {
    setShowProgress(false);
    setExportTaskId(null);
  };

  const handleCancelExport = () => {
    setShowExportModal(false);
    setShowProgress(false);
    setExportTaskId(null);
  };

  if (loading) {
    return (
      <div className="bg-gray-50 min-h-screen">
        <Header />
        <div className="p-8 animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/3 mb-8" />
          <div className="grid grid-cols-4 gap-6 mb-8">
            {[1, 2, 3, 4].map((item) => (
              <div key={item} className="bg-white rounded-xl p-6 h-32" />
            ))}
          </div>
          <div className="bg-white rounded-xl p-6 h-80" />
        </div>
      </div>
    );
  }

  if (!analysis) {
    return (
      <div className="bg-gray-50 min-h-screen">
        <Header />
        <div className="p-8 flex items-center justify-center min-h-[60vh]">
          <div className="text-center max-w-md">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">No Popularity Data Available</h2>
            <p className="text-gray-600 mb-8">Run a new SEO analysis to generate popularity insights.</p>
            <button onClick={() => navigate("/")} className="px-6 py-3 bg-primary text-white rounded-lg">
              Launch Analysis
            </button>
          </div>
        </div>
      </div>
    );
  }

  const raw = analysis.raw_data || {};
  const links = raw.links || {};
  const internalLinks = links.internal || [];
  const externalLinks = links.external || [];
  const score = analysis.category_scores?.popularity ?? analysis.scores?.popularity ?? 0;
  const issues = (analysis.issues || []).filter((issue) => issue.category === "popularity");
  const recommendations = (analysis.recommendations || []).filter((item) => item.category === "popularity");
  const nofollowCount = externalLinks.filter((link) => link.is_nofollow).length;

  return (
    <div className="bg-gray-50 min-h-screen">
      <Header />
      
      {/* 🆕 EXPORT MODAL */}
      {showExportModal && (
        <ExportModal
          section="popularity"
          url={analysis?.url || ""}
          onExportStarted={handleExportStarted}
          onCancel={handleCancelExport}
        />
      )}

      {/* 🆕 EXPORT PROGRESS BAR */}
      {showProgress && exportTaskId && exportUserId && (
        <div className="fixed top-20 right-6 w-80 bg-white rounded-xl shadow-lg border border-blue-200 p-4 z-40 animate-fade-in">
          <div className="flex justify-between items-center mb-2">
            <h4 className="text-sm font-semibold text-gray-800">📄 Exporting Popularity Report...</h4>
            <button 
              onClick={() => setShowProgress(false)}
              className="text-gray-400 hover:text-gray-600"
            >
              ✕
            </button>
          </div>
          <ExportProgress
            taskId={exportTaskId}
            userId={exportUserId}
            onComplete={handleExportComplete}
          />
        </div>
      )}
      
      <div className="p-8">
        <div className="mb-8 flex items-start justify-between gap-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Popularity / Off-Page SEO</h1>
            <p className="text-gray-600 mt-1">
              {hostnameFromUrl(analysis.url)} - Score:{" "}
              <span className={`font-bold ${getScoreColor(score)}`}>{score}/100</span>
            </p>
          </div>
          <div className="flex items-center space-x-3">
            {/* ✅ EXPORT BUTTON */}
            <button 
              onClick={handleExportClick}
              className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 font-medium transition flex items-center"
            >
              <i className="fa-solid fa-download mr-2"></i>Export
            </button>
            <button
              onClick={() => navigate("/")}
              className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-blue-700 font-medium transition"
            >
              <i className="fa-solid fa-rotate mr-2" />
              Re-analyze
            </button>
          </div>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700">
            {error}
            <button onClick={fetchPopularityData} className="ml-3 underline">
              Retry
            </button>
          </div>
        )}

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-xl font-semibold text-gray-900">Popularity Score</h2>
              <p className="text-sm text-gray-600 mt-1">
                {analysis.score_explanations?.popularity ||
                  "Popularity is based on visible internal/external link signals from the crawl."}
              </p>
            </div>
            <div className="text-right">
              <span className={`text-4xl font-bold ${getScoreColor(score)}`}>{score}</span>
              <span className="text-gray-500">/100</span>
            </div>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div className={`${getBarColor(score)} h-3 rounded-full`} style={{ width: `${score}%` }} />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          {[
            { label: "Internal Links", value: internalLinks.length, note: "Visible crawl links" },
            { label: "External Links", value: externalLinks.length, note: "Outgoing links" },
            { label: "External Domains", value: uniqueDomains(externalLinks), note: "Unique outgoing domains" },
            { label: "Nofollow Links", value: nofollowCount, note: "External nofollow count" },
          ].map((metric) => (
            <div key={metric.label} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-sm font-medium text-gray-600 mb-2">{metric.label}</h3>
              <p className="text-3xl font-bold text-gray-900">{metric.value}</p>
              <p className="text-xs text-gray-500 mt-2">{metric.note}</p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Popularity Issues</h2>
            {issues.length === 0 ? (
              <p className="text-gray-600">No popularity issues were detected in the saved analysis.</p>
            ) : (
              <div className="space-y-4">
                {issues.map((issue, index) => (
                  <div
                    key={issue.id || index}
                    className={`border-l-4 rounded-lg p-4 ${priorityStyles[issue.priority] || priorityStyles.medium}`}
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <h3 className="font-semibold text-gray-900">{issue.title}</h3>
                        <p className="text-sm text-gray-700 mt-1">{issue.description}</p>
                        {issue.impact && <p className="text-sm text-gray-600 mt-2">Impact: {issue.impact}</p>}
                      </div>
                      <span className="text-xs font-semibold uppercase">{issue.priority || "medium"}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Recommendations</h2>
            {recommendations.length === 0 ? (
              <p className="text-gray-600">No popularity recommendations were generated for this analysis.</p>
            ) : (
              <div className="space-y-4">
                {recommendations.map((rec, index) => (
                  <div key={rec.id || index} className="p-4 border border-gray-200 rounded-lg">
                    <div className="flex items-start justify-between gap-4">
                      <h3 className="font-semibold text-gray-900">{rec.title}</h3>
                      <span className="text-xs font-semibold uppercase text-gray-500">{rec.priority}</span>
                    </div>
                    <p className="text-sm text-gray-600 mt-2">{rec.description}</p>
                    {rec.actions?.length > 0 && (
                      <ul className="mt-3 space-y-1 text-sm text-gray-700">
                        {rec.actions.map((action, idx) => (
                          <li key={idx}>- {action}</li>
                        ))}
                      </ul>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-xl p-5 text-blue-900">
          <h2 className="font-semibold mb-1">Measurement note</h2>
          <p className="text-sm">
            This page does not invent backlink counts, domain authority, page authority, social followers, or engagement.
            It only shows what the crawler measured. Full off-page authority needs a backlink or analytics provider.
          </p>
        </div>
      </div>
    </div>
  );
};

export default PopularitySEO;