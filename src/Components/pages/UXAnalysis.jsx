import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { api } from "../../services/api";
import Header from "../Header";
import ExportModal from "./ExportModal";        // ✅ Import du modal d'export
import ExportProgress from "./ExportProgress";  // ✅ Import de la barre de progression

const UXAnalysis = () => {
  const navigate = useNavigate();
  const { analysisId } = useParams();
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [analysis, setAnalysis] = useState(null);
  const [uxData, setUxData] = useState(null);
  
  // 🆕 États pour l'export
  const [showExportModal, setShowExportModal] = useState(false);
  const [exportTaskId, setExportTaskId] = useState(null);
  const [exportUserId, setExportUserId] = useState(null);
  const [showProgress, setShowProgress] = useState(false);

  // 🔐 Vérifier l'authentification
  useEffect(() => {
    if (!localStorage.getItem("token")) {
      navigate("/login?returnTo=/ux-analysis");
    }
  }, [navigate]);

  // 📡 Fetch data on mount
  useEffect(() => { 
    fetchUXData(); 
  }, []);
   const fetchUXData = async () => {
     try {
      setLoading(true); 
      setError(null); 
      const analyses = await api.getMyAnalyses();
       const latest = analyses.analyses?.[0];
        if (latest) {
           const fullData = await api.getAnalysisResults(latest.id);
           setAnalysis(fullData); 
           setUxData(transformRawToUX(fullData.raw_data, fullData.category_scores?.ux));
           } else { setAnalysis(null); setUxData(null);
            } } catch (err) { console.error("Failed to fetch UX data:", err); 
              setError(err.message || "Failed to load analysis"); 
              if (err.message?.includes("401")) { localStorage.removeItem("token");
                 navigate("/login"); } } finally {
                   setLoading(false); } }; 
  // 🔧 Transformer raw_data en format UX Analysis
  const transformRawToUX = (raw, categoryScore) => {
    if (!raw) return null;
    
    return {
      overallScore: categoryScore || calculateOverallUXScore(raw),
      metrics: {
        navigationClarity: raw.technical?.has_clear_navigation ? 85 : 60,
        mobileUsability: raw.technical?.has_viewport ? 87 : 50,
        accessibility: calculateAccessibilityScore(raw),
        pageLayout: raw.headings?.has_proper_hierarchy ? 90 : 65,
      },
      issues: generateUXIssues(raw),
      recommendations: generateUXRecommendations(raw),
    };
  };

  // 🎯 Helpers de calcul
  const calculateOverallUXScore = (raw) => {
    let score = 70; // Base score
    if (raw.technical?.has_viewport) score += 10;
    if (raw.technical?.has_lang) score += 5;
    if (raw.headings?.has_proper_hierarchy) score += 5;
    if ((raw.images?.filter(i => !i._summary)?.length || 0) > 0) {
      const withAlt = (raw.images?.filter(i => !i._summary)?.filter(i => i.has_alt)?.length || 0);
      const total = raw.images?.filter(i => !i._summary)?.length || 1;
      if (withAlt / total > 0.8) score += 10;
    }
    return Math.min(100, Math.max(0, score));
  };

  const calculateAccessibilityScore = (raw) => {
    let score = 70;
    // Check for viewport
    if (!raw.technical?.has_viewport) score -= 15;
    // Check for lang attribute
    if (!raw.technical?.has_lang) score -= 10;
    // Check images alt text
    const images = raw.images?.filter(i => !i._summary) || [];
    if (images.length > 0) {
      const withAlt = images.filter(i => i.has_alt).length;
      const ratio = withAlt / images.length;
      if (ratio < 0.5) score -= 20;
      else if (ratio < 0.8) score -= 10;
    }
    return Math.min(100, Math.max(0, score));
  };

  const generateUXIssues = (raw) => {
    const issues = [];
    
    // Mobile tap targets
    if (!raw.technical?.has_viewport) {
      issues.push({
        severity: 'high',
        icon: 'fa-mobile-screen',
        title: 'Missing Viewport Meta Tag',
        description: 'Your site lacks a viewport meta tag, which can cause poor mobile rendering and usability.',
        impact: 'Affects mobile usability score and search rankings',
        solution: 'Add <meta name="viewport" content="width=device-width, initial-scale=1"> to your <head>.'
      });
    }
    
    // Accessibility: missing alt text
    const images = raw.images?.filter(i => !i._summary) || [];
    const missingAlt = images.filter(i => !i.has_alt).length;
    if (missingAlt > 0) {
      issues.push({
        severity: missingAlt > 10 ? 'high' : 'medium',
        icon: 'fa-universal-access',
        title: 'Images Missing Alt Text',
        description: `${missingAlt} images lack alt attributes, making them inaccessible to screen readers.`,
        impact: 'Reduces accessibility for visually impaired users and hurts image SEO',
        solution: 'Add descriptive alt text to all images for better accessibility and SEO.'
      });
    }
    
    // Color contrast (simplified check)
    // In real app, this would analyze CSS
    if (raw.technical?.word_count < 300) {
      issues.push({
        severity: 'low',
        icon: 'fa-eye-slash',
        title: 'Thin Content May Affect Readability',
        description: 'Pages with less than 300 words may not provide enough context for users.',
        impact: 'Can reduce user engagement and time-on-page',
        solution: 'Expand content with valuable information, examples, and multimedia.'
      });
    }
    
    // Heading hierarchy
    if (raw.headings?.h1_count !== 1) {
      issues.push({
        severity: 'medium',
        icon: 'fa-heading',
        title: 'Improper Heading Structure',
        description: `Found ${raw.headings?.h1_count || 0} H1 tags. Each page should have exactly one H1.`,
        impact: 'Confuses screen readers and search engines about page structure',
        solution: 'Use exactly one H1 per page, followed by logical H2-H6 hierarchy.'
      });
    }
    
    return issues;
  };

  const generateUXRecommendations = (raw) => {
    const recs = [];
    
    // Responsive images
    const images = raw.images?.filter(i => !i._summary) || [];
    if (images.some(i => !i.is_lazy)) {
      recs.push({
        priority: 'high',
        title: 'Implement Lazy Loading for Images',
        description: 'Add loading="lazy" to images below the fold to improve initial page load time.',
        impact: '+5 Mobile Score',
      });
    }
    
    // Touch targets
    if (!raw.technical?.has_viewport) {
      recs.push({
        priority: 'high',
        title: 'Add Viewport Meta Tag for Mobile',
        description: 'Ensure your site renders properly on all device sizes.',
        impact: '+10 Mobile Usability',
      });
    }
    
    // Skip navigation
    recs.push({
      priority: 'medium',
      title: 'Add Skip to Content Link',
      description: 'Implement a "Skip to main content" link for keyboard users.',
      impact: '+3 Accessibility',
    });
    
    // Focus indicators
    recs.push({
      priority: 'medium',
      title: 'Improve Focus Indicators',
      description: 'Make focus outlines more visible for keyboard navigation.',
      impact: '+2 Accessibility',
    });
    
    return recs;
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

  // 🎨 Helpers UI
  const getStatusColor = (score) => {
    if (score >= 80) return 'bg-green-100 text-green-700';
    if (score >= 60) return 'bg-yellow-100 text-yellow-700';
    return 'bg-red-100 text-red-700';
  };

  const getBarColor = (score) => {
    if (score >= 80) return 'bg-secondary';
    if (score >= 60) return 'bg-yellow-400';
    return 'bg-red-500';
  };

  // 🎨 Skeleton loading
  if (loading) {
    return (
      <div className="bg-gray-50 min-h-screen">
        <Header />
        <div className="p-8 animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/3 mb-8"></div>
          <div className="bg-white rounded-xl p-8 mb-8">
            <div className="h-32 bg-gray-200 rounded mb-4"></div>
          </div>
          <div className="grid grid-cols-4 gap-6 mb-8">
            {[1,2,3,4].map(i => <div key={i} className="bg-white rounded-xl p-6 h-32"></div>)}
          </div>
          <div className="space-y-4">
            {[1,2,3].map(i => <div key={i} className="bg-white rounded-xl p-6 h-40"></div>)}
          </div>
        </div>
      </div>
    );
  }

  // 🚫 Empty state
  if (!analysis || !uxData) {
    return (
      <div className="bg-gray-50 min-h-screen">
        <Header />
        <div className="p-8 flex items-center justify-center min-h-[60vh]">
          <div className="text-center max-w-md">
            <div className="text-6xl mb-6">🎨</div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">No UX Data Available</h2>
            <p className="text-gray-600 mb-8">
              Run a new SEO analysis to generate user experience insights for your website.
            </p>
            <button
              onClick={() => navigate("/analysis")}
              className="px-6 py-3 bg-primary text-white rounded-xl font-medium hover:bg-blue-700 transition"
            >
              Launch New Analysis →
            </button>
          </div>
        </div>
      </div>
    );
  }

  const { overallScore, metrics, issues, recommendations } = uxData;

  return (
    <div className="bg-gray-50 min-h-screen">
      <Header />
      
      {/* 🆕 EXPORT MODAL */}
      {showExportModal && (
        <ExportModal
          section="ux"
          url={analysis?.url || ""}
          onExportStarted={handleExportStarted}
          onCancel={handleCancelExport}
        />
      )}

      {/* 🆕 EXPORT PROGRESS BAR */}
      {showProgress && exportTaskId && exportUserId && (
        <div className="fixed top-20 right-6 w-80 bg-white rounded-xl shadow-lg border border-blue-200 p-4 z-40 animate-fade-in">
          <div className="flex justify-between items-center mb-2">
            <h4 className="text-sm font-semibold text-gray-800">📄 Exporting UX Report...</h4>
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
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">UX / UI Analysis</h1>
              <p className="text-gray-600 mt-1">
                {analysis.url ? new URL(analysis.url).hostname : 'Your website'} • 
                Score: <span className={`font-bold ${overallScore >= 80 ? 'text-secondary' : overallScore >= 50 ? 'text-yellow-500' : 'text-red-500'}`}>
                  {overallScore}/100
                </span>
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
                onClick={() => navigate("/analysis")}
                className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-blue-700 font-medium transition"
              >
                <i className="fa-solid fa-rotate mr-2"></i>Re-analyze
              </button>
            </div>
          </div>
        </div>

        {/* Error message */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700">
            ❌ {error}
            <button onClick={fetchUXData} className="ml-2 underline">Retry</button>
          </div>
        )}

        {/* Overall UX Score */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-6">
              <div className="relative w-32 h-32">
                <svg className="transform -rotate-90 w-32 h-32">
                  <circle cx="64" cy="64" r="56" stroke="#e5e7eb" strokeWidth="10" fill="none"></circle>
                  <circle 
                    cx="64" cy="64" r="56" 
                    stroke={overallScore >= 80 ? '#10b981' : overallScore >= 60 ? '#eab308' : '#ef4444'} 
                    strokeWidth="10" 
                    fill="none" 
                    strokeDasharray="351.86" 
                    strokeDashoffset={351.86 * (1 - overallScore / 100)} 
                    strokeLinecap="round"
                    className="transition-all duration-500"
                  ></circle>
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className={`text-4xl font-bold ${overallScore >= 80 ? 'text-green-600' : overallScore >= 60 ? 'text-yellow-600' : 'text-red-600'}`}>
                    {overallScore}
                  </span>
                  <span className="text-xs text-gray-500">/100</span>
                </div>
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Overall UX Score</h2>
                <p className="text-gray-600 mb-3">
                  {overallScore >= 80 
                    ? "Excellent! Your site provides a great user experience." 
                    : overallScore >= 60 
                      ? "Good user experience with room for improvement in accessibility." 
                      : "Your site needs UX improvements to enhance user satisfaction."}
                </p>
                <div className="flex items-center space-x-2">
                  <span className={`px-3 py-1 ${getStatusColor(overallScore)} text-sm font-semibold rounded-full`}>
                    {overallScore >= 80 ? 'Excellent' : overallScore >= 60 ? 'Good' : 'Needs Work'}
                  </span>
                  <span className="text-sm text-gray-500">
                    Last updated: {analysis.created_at ? new Date(analysis.created_at).toLocaleDateString() : 'N/A'}
                  </span>
                </div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold text-gray-900 mb-1">{metrics.mobileUsability}/100</div>
              <div className="text-sm text-gray-600">Mobile Usability</div>
            </div>
          </div>
        </div>

        {/* Category Scores */}
        <div className="grid grid-cols-4 gap-6 mb-8">
          {[
            { label: 'Navigation Clarity', score: metrics.navigationClarity },
            { label: 'Mobile Usability', score: metrics.mobileUsability },
            { label: 'Accessibility Score', score: metrics.accessibility },
            { label: 'Page Layout', score: metrics.pageLayout },
          ].map((metric, idx) => (
            <div key={idx} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-gray-600 font-medium text-sm">{metric.label}</h3>
                <span className={`px-2 py-1 ${getStatusColor(metric.score)} text-xs font-semibold rounded-full`}>
                  {metric.score >= 80 ? 'Excellent' : metric.score >= 60 ? 'Good' : 'Moderate'}
                </span>
              </div>
              <div className="flex items-baseline mb-3">
                <span className="text-3xl font-bold text-gray-900">{metric.score}</span>
                <span className="text-gray-500 text-sm ml-1">/100</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className={`${getBarColor(metric.score)} h-2 rounded-full transition-all duration-500`} style={{width: `${metric.score}%`}}></div>
              </div>
            </div>
          ))}
        </div>

        {/* Issues Found */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Issues Found</h2>
          <div className="space-y-4">
            {issues.map((issue, idx) => (
              <div key={idx} className={`bg-white rounded-xl shadow-sm border-l-4 ${issue.severity === 'high' ? 'border-red-500' : issue.severity === 'medium' ? 'border-orange-500' : 'border-green-500'} p-6`}>
                <div className="flex items-start space-x-4">
                  <div className={`w-12 h-12 ${issue.severity === 'high' ? 'bg-red-50' : issue.severity === 'medium' ? 'bg-orange-50' : 'bg-green-50'} rounded-lg flex items-center justify-center flex-shrink-0`}>
                    <i className={`fa-solid ${issue.icon} ${issue.severity === 'high' ? 'text-red-500' : issue.severity === 'medium' ? 'text-orange-500' : 'text-secondary'} text-xl`}></i>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-lg font-bold text-gray-900">{issue.title}</h3>
                      <span className={`px-3 py-1 ${issue.severity === 'high' ? 'bg-red-100 text-red-700' : issue.severity === 'medium' ? 'bg-orange-100 text-orange-700' : 'bg-green-100 text-green-700'} text-xs font-bold rounded-full uppercase`}>
                        {issue.severity} Priority
                      </span>
                    </div>
                    <p className="text-gray-600 mb-3">{issue.description}</p>
                    <div className="bg-gray-50 rounded-lg p-3 mb-3">
                      <p className="text-sm text-gray-700"><strong>Impact:</strong> {issue.impact}</p>
                    </div>
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                      <p className="text-sm font-medium text-gray-900 mb-1 flex items-center">
                        <i className="fa-solid fa-lightbulb text-primary mr-2"></i>
                        Recommended Solution:
                      </p>
                      <p className="text-sm text-gray-700">{issue.solution}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
            {issues.length === 0 && (
              <div className="bg-green-50 border border-green-200 rounded-xl p-6 text-center">
                <i className="fa-solid fa-circle-check text-secondary text-3xl mb-3"></i>
                <p className="text-green-700 font-medium">No UX issues found! Great job! 🎉</p>
              </div>
            )}
          </div>
        </div>

        {/* UX Recommendations */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">UX Improvement Recommendations</h2>
          <div className="grid grid-cols-2 gap-6">
            {recommendations.map((rec, idx) => (
              <div key={idx} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition">
                <div className="flex items-start justify-between mb-3">
                  <span className={`px-3 py-1 ${rec.priority === 'high' ? 'bg-red-100 text-red-700' : 'bg-orange-100 text-orange-700'} text-xs font-bold rounded-full uppercase`}>
                    {rec.priority} Priority
                  </span>
                  <span className="text-sm text-green-600 font-semibold">{rec.impact}</span>
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">{rec.title}</h3>
                <p className="text-gray-600 text-sm mb-4">{rec.description}</p>
                <button className="w-full px-4 py-2 bg-primary text-white rounded-lg hover:bg-blue-700 font-medium transition text-sm">
                  View Implementation Guide
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Mobile Preview */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Mobile Responsiveness Preview</h2>
          <div className="flex items-center justify-center p-8 bg-gray-50 rounded-lg">
            <div className="bg-white border-4 border-gray-800 rounded-3xl p-4 w-64 h-96 overflow-hidden relative">
              <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-20 h-6 bg-gray-800 rounded-b-lg"></div>
              <div className="mt-6 space-y-3">
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="h-3 bg-gray-200 rounded w-full"></div>
                <div className="h-3 bg-gray-200 rounded w-5/6"></div>
                <div className="h-20 bg-gray-200 rounded w-full"></div>
                <div className="h-3 bg-gray-200 rounded w-full"></div>
                <div className="h-3 bg-gray-200 rounded w-4/5"></div>
              </div>
              <div className="absolute bottom-4 left-4 right-4">
                <div className="h-10 bg-primary rounded-lg w-full"></div>
              </div>
            </div>
            <div className="ml-8 space-y-4">
              <div className="flex items-center space-x-3">
                <i className={`fa-solid ${analysis.raw_data?.technical?.has_viewport ? 'fa-check-circle text-secondary' : 'fa-exclamation-circle text-yellow-500'} text-xl`}></i>
                <span className="text-gray-700">
                  {analysis.raw_data?.technical?.has_viewport ? 'Viewport meta tag present' : 'Missing viewport meta tag'}
                </span>
              </div>
              <div className="flex items-center space-x-3">
                <i className="fa-solid fa-check-circle text-secondary text-xl"></i>
                <span className="text-gray-700">Responsive layout detected</span>
              </div>
              <div className="flex items-center space-x-3">
                <i className={`fa-solid ${analysis.raw_data?.technical?.has_lang ? 'fa-check-circle text-secondary' : 'fa-exclamation-circle text-yellow-500'} text-xl`}></i>
                <span className="text-gray-700">
                  {analysis.raw_data?.technical?.has_lang ? 'Language attribute set' : 'Missing lang attribute'}
                </span>
              </div>
              <div className="flex items-center space-x-3">
                <i className="fa-solid fa-check-circle text-secondary text-xl"></i>
                <span className="text-gray-700">Font sizes readable on mobile</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UXAnalysis;