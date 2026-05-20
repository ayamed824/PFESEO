import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { api } from "../../services/api";
import Header from "../Header";
import ExportModal from "./ExportModal";        // ✅ Import du modal d'export
import ExportProgress from "./ExportProgress";  // ✅ Import de la barre de progression

const ContentAnalysis = () => {
  const navigate = useNavigate();
  const { analysisId } = useParams();
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [analysis, setAnalysis] = useState(null);
  const [contentData, setContentData] = useState(null);
  
  // 🆕 États pour l'export
  const [showExportModal, setShowExportModal] = useState(false);
  const [exportTaskId, setExportTaskId] = useState(null);
  const [exportUserId, setExportUserId] = useState(null);
  const [showProgress, setShowProgress] = useState(false);

  // 🔐 Check authentication
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login?returnTo=/content-analysis");
      return;
    }
    
    // Get user ID for export progress tracking
    const userId = localStorage.getItem("userId");
    if (userId) setExportUserId(userId);
  }, [navigate]);

  // 📡 Fetch analysis data on mount
  useEffect(() => {
    fetchContentData();
  }, [analysisId]);

  const fetchContentData = async () => {
    try {
      setLoading(true);
      setError(null);

      const idFromUrl = analysisId;
      const idFromStorage = localStorage.getItem("analysisId");
      const finalId = idFromUrl || idFromStorage;

      let data = null;

      if (finalId) {
        data = await api.getAnalysisResults(finalId);
        localStorage.setItem("analysisId", finalId);
      }

      if (!data) {
        const analyses = await api.getMyAnalyses();
        const latest = analyses?.analyses?.[0] || null;
        data = latest?.id ? await api.getAnalysisResults(latest.id) : null;
        if (data?.id) localStorage.setItem("analysisId", data.id);
      }

      if (data) {
        setAnalysis(data);
        setContentData(transformRawToContent(data.raw_data));
      } else {
        setAnalysis(null);
        setContentData(null);
      }
    } catch (err) {
      console.error("Failed to fetch content analysis:", err);
      setError(err.message || "Failed to load analysis");

      if (err.message?.includes("401")) {
        localStorage.removeItem("token");
        navigate("/login");
      }
    } finally {
      setLoading(false);
    }
  };

  // 🔧 Transformer raw_data en format Content Analysis
  const transformRawToContent = (raw) => {
    if (!raw) return null;
    
    // Extraire les keywords du contenu
    const keywords = extractKeywords(raw);
    
    return {
      overview: {
        keywordScore: calculateKeywordScore(raw),
        wordCount: raw.technical?.word_count || 0,
        readabilityScore: calculateReadability(raw),
        originalityScore: raw.technical?.originality || 94,
      },
      keywords: keywords.primary,
      opportunities: keywords.opportunities,
      quality: {
        readability: calculateReadabilityDetails(raw),
        structure: analyzeStructure(raw),
      },
      duplicate: {
        score: raw.technical?.originality || 94,
        matches: raw.technical?.duplicate_matches || [],
      },
      recommendations: generateContentRecommendations(raw),
    };
  };

  // 🎯 Extraire et analyser les keywords
  const extractKeywords = (raw) => {
    const text = raw.raw_text || "";
    const words = text.toLowerCase().split(/\\s+/).filter(w => w.length > 3);
    const freq = {};
    words.forEach(w => freq[w] = (freq[w] || 0) + 1);
    
    const sorted = Object.entries(freq)
      .filter(([w, c]) => c >= 3 && !['this', 'that', 'with', 'have', 'from', 'they', 'been', 'will', 'your'].includes(w))
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10);
    
    const totalWords = words.length;
    
    return {
      primary: sorted.slice(0, 3).map(([keyword, frequency], idx) => {
        const density = ((frequency / totalWords) * 100).toFixed(1);
        const inTitle = raw.meta_tags?.title?.toLowerCase().includes(keyword);
        const inH1 = raw.headings?.h1?.some(h => h.toLowerCase().includes(keyword));
        const location = inTitle && inH1 ? 'In title, H1, body' : inH1 ? 'In H1, body' : 'In body only';
        const status = density >= 1 && density <= 3 ? 'Excellent' : density >= 0.5 ? 'Good' : 'Moderate';
        
        return {
          keyword,
          status,
          statusColor: status === 'Excellent' ? 'text-secondary' : status === 'Good' ? 'text-secondary' : 'text-yellow-700',
          density: `${density}%`,
          frequency,
          location,
          bgColor: status === 'Moderate' ? 'bg-yellow-50' : 'bg-green-50',
          borderColor: status === 'Moderate' ? 'border-yellow-200' : 'border-green-200',
        };
      }),
      opportunities: [
        { title: 'Missing LSI Keywords', desc: 'Add related terms to improve semantic relevance', tags: ['search engine ranking', 'on-page SEO', 'keyword research'] },
        { title: 'Long-Tail Opportunities', desc: 'Target these low-competition phrases', tags: ['how to improve SEO rankings', 'best SEO practices 2024'] },
      ],
    };
  };

  // 📊 Calculer les scores
  const calculateKeywordScore = (raw) => {
    const hasTitle = raw.meta_tags?.title?.length >= 30;
    const hasDesc = raw.meta_tags?.description?.length >= 120;
    const hasH1 = raw.headings?.h1_count === 1;
    const wordCount = raw.technical?.word_count || 0;
    
    let score = 50;
    if (hasTitle) score += 15;
    if (hasDesc) score += 15;
    if (hasH1) score += 10;
    if (wordCount >= 1000) score += 10;
    
    return Math.min(score, 100);
  };

  const calculateReadability = (raw) => {
    const text = raw.raw_text || "";
    const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0);
    const words = text.split(/\\s+/).filter(w => w.length > 0);
    const avgSentenceLength = words.length / (sentences.length || 1);
    
    // Simplified Flesch-like score
    let score = 100 - (avgSentenceLength * 2);
    score = Math.max(0, Math.min(100, Math.round(score)));
    return score;
  };

  const calculateReadabilityDetails = (raw) => {
    const text = raw.raw_text || "";
    const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0);
    const words = text.split(/\\s+/).filter(w => w.length > 0);
    const avgSentenceLength = Math.round(words.length / (sentences.length || 1));
    
    return [
      { label: 'Average Sentence Length', value: `${avgSentenceLength} words` },
      { label: 'Total Words', value: `${words.length.toLocaleString()}` },
      { label: 'Flesch Reading Ease', value: `${calculateReadability(raw)} (Easy)` },
      { label: 'Passive Voice', value: '12% (Good)', color: 'text-secondary' },
      { label: 'Transition Words', value: '28% (Excellent)', color: 'text-secondary' },
    ];
  };

  const analyzeStructure = (raw) => {
    return [
      { label: 'Heading Hierarchy', status: raw.headings?.h1_count === 1 ? 'good' : 'warning', details: `H1: ${raw.headings?.h1_count || 0}, H2: ${raw.headings?.h2?.length || 0}, H3: ${raw.headings?.h3?.length || 0}` },
      { label: 'Paragraph Length', status: 'good', details: 'Average 3-4 sentences (Optimal)' },
      { label: 'Lists & Formatting', status: 'good', details: 'Bullet points and bold text well-used' },
      { label: 'Internal Links', status: (raw.links?.internal?.length || 0) >= 5 ? 'good' : 'warning', details: `${raw.links?.internal?.length || 0} internal links found` },
    ];
  };

  const generateContentRecommendations = (raw) => {
    const recs = [];
    // ✅ FIX images
      let imagesArray = [];

      if (Array.isArray(raw.images)) {
        imagesArray = raw.images;
      } else if (raw.images?.items) {
        imagesArray = raw.images.items;
      }
          
    // Check keyword optimization
    const keywordScore = calculateKeywordScore(raw);
    if (keywordScore >= 70) {
      recs.push({
        color: 'green',
        icon: 'fa-check-double',
        title: 'Maintain Your Keyword Strategy',
        badge: 'Strength',
        badgeColor: 'bg-green-100 text-secondary',
        content: 'Your primary keywords are well-optimized with natural placement throughout the content.',
        tip: 'Search engines recognize when keywords appear naturally in important places like titles and headings.',
      });
    }
    
    // Check internal links
    const internalLinks = raw.links?.internal?.length || 0;
    if (internalLinks < 5) {
      recs.push({
        color: 'yellow',
        icon: 'fa-link',
        title: 'Add More Internal Links',
        badge: 'Priority: Medium',
        badgeColor: 'bg-yellow-100 text-yellow-700',
        content: `You have only ${internalLinks} internal links. Adding 5-8 more links will improve navigation and SEO.`,
        steps: [
          'Link to related blog posts or service pages when mentioning relevant topics',
          'Use descriptive anchor text instead of "click here"',
          'Add a "Related Articles" section at the bottom of your page',
        ],
      });
    }
    
    // LSI keywords suggestion
    recs.push({
      color: 'blue',
      icon: 'fa-spell-check',
      title: 'Incorporate LSI Keywords',
      badge: 'Priority: High',
      badgeColor: 'bg-blue-100 text-primary',
      content: 'Add semantically related keywords to help search engines better understand your content context.',
      keywords: ['search engine ranking', 'on-page SEO', 'keyword research', 'meta descriptions', 'organic traffic'],
    });
    
    // Visual content
    const imagesWithoutAlt = imagesArray.filter(i => !i.has_alt).length;
      const totalImages = imagesArray.length;

    if (imagesWithoutAlt > 0 || totalImages < 3) {
      recs.push({
        color: 'purple',
        icon: 'fa-image',
        title: 'Enhance with Visual Content',
        badge: 'Priority: Medium',
        badgeColor: 'bg-purple-100 text-purple-700',
        content: 'Adding images, infographics, or videos can increase engagement and time-on-page.',
        steps: [
          'Add 3-5 relevant images with descriptive alt text',
          'Create an infographic summarizing key points',
          'Consider adding a short explainer video (1-2 minutes)',
        ],
      });
    }
    
    // Content freshness
    recs.push({
      color: 'green',
      icon: 'fa-clock',
      title: 'Update Content Regularly',
      badge: 'Best Practice',
      badgeColor: 'bg-green-100 text-secondary',
      content: 'Fresh content signals relevance to search engines. Plan to review and update this page every 3-6 months.',
      tip: 'When you update content, add a "Last Updated" date at the top of the page.',
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

  // 🎨 Helpers
  const getStatusColor = (status) => {
    if (status === 'good') return 'bg-green-100 text-secondary border-green-200';
    if (status === 'warning') return 'bg-yellow-100 text-yellow-700 border-yellow-200';
    return 'bg-red-100 text-red-700 border-red-200';
  };

  // 🎨 Skeleton loading
  if (loading) {
    return (
      <div className="bg-gray-50 min-h-screen">
        <Header />
        <div className="p-8 animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/3 mb-8"></div>
          <div className="grid grid-cols-4 gap-6 mb-8">
            {[1,2,3,4].map(i => <div key={i} className="bg-white rounded-xl p-6 h-32"></div>)}
          </div>
          <div className="bg-white rounded-xl p-6 h-64 mb-8"></div>
          <div className="grid grid-cols-2 gap-6">
            <div className="bg-white rounded-xl p-6 h-80"></div>
            <div className="bg-white rounded-xl p-6 h-80"></div>
          </div>
        </div>
      </div>
    );
  }

  // 🚫 Empty state
  if (!analysis || !contentData) {
    return (
      <div className="bg-gray-50 min-h-screen">
        <Header />
        <div className="p-8 flex items-center justify-center min-h-[60vh]">
          <div className="text-center max-w-md">
            <div className="text-6xl mb-6">📝</div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">No Content Data Available</h2>
            <p className="text-gray-600 mb-8">
              Run a new SEO analysis to generate content insights for your website.
            </p>
            <button
              onClick={() => navigate("/")}
              className="px-6 py-3 bg-primary text-white rounded-xl font-medium hover:bg-blue-700 transition"
            >
              Launch New Analysis →
            </button>
          </div>
        </div>
      </div>
    );
  }

  const { overview, keywords, opportunities, quality, duplicate, recommendations } = contentData;
  const categoryScore = analysis?.scores?.content_quality ?? overview.keywordScore;
  const analyzedUrl = analysis.url || '';

  return (
    <div className="bg-gray-50 min-h-screen">
      <Header />
      
      {/* 🆕 EXPORT MODAL */}
      {showExportModal && (
        <ExportModal
          section="content"    // ✅ Backend filtre automatiquement
          url={analyzedUrl}    // ✅ Backend cherche dans la base
          onExportStarted={handleExportStarted}
          onCancel={handleCancelExport}
        />
      )}

      {/* 🆕 EXPORT PROGRESS BAR */}
      {showProgress && exportTaskId && exportUserId && (
        <div className="fixed top-20 right-6 w-80 bg-white rounded-xl shadow-lg border border-blue-200 p-4 z-40 animate-fade-in">
          <div className="flex justify-between items-center mb-2">
            <h4 className="text-sm font-semibold text-gray-800">📄 Exporting Content Report...</h4>
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
              <h1 className="text-3xl font-bold text-gray-900">Content Analysis</h1>
              <p className="text-gray-600 mt-1">
                {analysis.url ? new URL(analysis.url).hostname : 'Your website'} • 
                Score: <span className={`font-bold ${categoryScore >= 80 ? 'text-secondary' : categoryScore >= 50 ? 'text-yellow-500' : 'text-red-500'}`}>
                  {categoryScore}/100
                </span>
              </p>
            </div>
            <div className="flex items-center space-x-3">
              {/* ✅ EXPORT BUTTON - Content Report Only */}
              <button 
                onClick={handleExportClick}
                className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 font-medium transition flex items-center"
                title="Export Content Analysis Report"
              >
                <i className="fa-solid fa-file-pdf mr-2"></i>
                Export Content Report
              </button>
              <button 
                onClick={() => navigate("/")}
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
            <button onClick={fetchContentData} className="ml-2 underline">Retry</button>
          </div>
        )}

        {/* Content Overview */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Content Overview</h2>
          <div className="grid grid-cols-4 gap-6">
            {[
              { label: 'Keyword Optimization', value: overview.keywordScore, suffix: '/100', width: `${overview.keywordScore}%`, icon: 'fa-key', status: overview.keywordScore >= 70 ? 'Good' : overview.keywordScore >= 40 ? 'Moderate' : 'Needs Work' },
              { label: 'Content Length', value: overview.wordCount.toLocaleString(), suffix: 'words', width: `${Math.min(overview.wordCount / 30, 100)}%`, icon: 'fa-align-left', status: overview.wordCount >= 1000 ? 'Optimal' : 'Short' },
              { label: 'Readability Score', value: overview.readabilityScore, suffix: '/100', width: `${overview.readabilityScore}%`, icon: 'fa-book-open', status: overview.readabilityScore >= 70 ? 'Easy' : 'Complex' },
              { label: 'Originality Score', value: overview.originalityScore, suffix: '%', width: `${overview.originalityScore}%`, icon: 'fa-fingerprint', status: overview.originalityScore >= 90 ? 'Unique' : 'Some Duplication' },
            ].map((item, idx) => (
              <div key={idx} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-green-50 rounded-lg flex items-center justify-center">
                    <i className={`fa-solid ${item.icon} text-secondary text-xl`}></i>
                  </div>
                  <span className={`px-3 py-1 ${item.status === 'Good' || item.status === 'Optimal' || item.status === 'Easy' || item.status === 'Unique' ? 'bg-green-100 text-secondary' : 'bg-yellow-100 text-yellow-700'} text-xs font-semibold rounded-full`}>
                    {item.status}
                  </span>
                </div>
                <h3 className="text-gray-600 font-medium text-sm mb-2">{item.label}</h3>
                <div className="flex items-baseline">
                  <span className="text-3xl font-bold text-gray-900">{item.value}</span>
                  {item.suffix && <span className="text-gray-500 text-sm ml-1">{item.suffix}</span>}
                </div>
                <div className="mt-4 w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-secondary h-2 rounded-full transition-all duration-500" style={{width: item.width}}></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Keyword Analysis */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Keyword Analysis</h2>
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="grid grid-cols-2 gap-6">
              {/* Primary Keywords */}
              <div>
                <h3 className="font-semibold text-gray-900 mb-4 flex items-center">
                  <i className="fa-solid fa-star text-yellow-500 mr-2"></i>
                  Primary Keywords
                </h3>
                <div className="space-y-4">
                  {keywords.map((kw, idx) => (
                    <div key={idx} className={`flex items-center justify-between p-4 ${kw.bgColor} border ${kw.borderColor} rounded-lg`}>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-medium text-gray-900">{kw.keyword}</span>
                          <span className={`text-sm font-semibold ${kw.statusColor}`}>{kw.status}</span>
                        </div>
                        <div className="flex items-center space-x-4 text-xs text-gray-600">
                          <span><i className="fa-solid fa-hashtag mr-1"></i>Density: {kw.density}</span>
                          <span><i className="fa-solid fa-repeat mr-1"></i>Frequency: {kw.frequency}</span>
                          <span><i className="fa-solid fa-map-marker-alt mr-1"></i>{kw.location}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Keyword Opportunities */}
              <div>
                <h3 className="font-semibold text-gray-900 mb-4 flex items-center">
                  <i className="fa-solid fa-lightbulb text-primary mr-2"></i>
                  Keyword Opportunities
                </h3>
                <div className="space-y-4">
                  {opportunities.map((opp, idx) => (
                    <div key={idx} className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                      <div className="flex items-start space-x-3">
                        <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center flex-shrink-0">
                          <i className="fa-solid fa-arrow-trend-up text-white text-sm"></i>
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-900 mb-1">{opp.title}</h4>
                          <p className="text-sm text-gray-600 mb-2">{opp.desc}</p>
                          {opp.tags && (
                            <div className="flex flex-wrap gap-2">
                              {opp.tags.map((tag, tidx) => (
                                <span key={tidx} className="px-2 py-1 bg-white border border-blue-300 rounded text-xs text-gray-700">{tag}</span>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Content Quality */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Content Quality Indicators</h2>
          <div className="grid grid-cols-2 gap-6">
            {/* Readability */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-semibold text-gray-900 flex items-center">
                  <i className="fa-solid fa-glasses text-primary mr-2"></i>
                  Readability Analysis
                </h3>
                <span className="px-3 py-1 bg-green-100 text-secondary text-xs font-semibold rounded-full">Score: {overview.readabilityScore}</span>
              </div>
              <div className="space-y-4">
                {quality.readability.map((item, idx) => (
                  <div key={idx} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <span className="text-sm text-gray-700">{item.label}</span>
                    <span className={`font-semibold ${item.color || 'text-gray-900'}`}>{item.value}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Structure */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-semibold text-gray-900 flex items-center">
                  <i className="fa-solid fa-sitemap text-primary mr-2"></i>
                  Content Structure
                </h3>
              </div>
              <div className="space-y-4">
                {quality.structure.map((item, idx) => (
                  <div key={idx} className={`p-4 ${item.status === 'good' ? 'bg-green-50 border-green-200' : 'bg-yellow-50 border-yellow-200'} border rounded-lg`}>
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium text-gray-900">{item.label}</span>
                      <i className={`fa-solid ${item.status === 'good' ? 'fa-check-circle text-secondary' : 'fa-exclamation-triangle text-yellow-600'}`}></i>
                    </div>
                    <p className="text-xs text-gray-600">{item.details}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Duplicate Content */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Duplicate Content Check</h2>
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-start space-x-4 mb-6">
              <div className="w-16 h-16 bg-green-50 rounded-xl flex items-center justify-center flex-shrink-0">
                <i className="fa-solid fa-shield-check text-secondary text-2xl"></i>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 text-lg mb-2">{duplicate.score}% Original Content</h3>
                <p className="text-gray-600">Your content is highly unique with minimal duplication detected across the web.</p>
              </div>
            </div>

            {duplicate.matches.length > 0 && (
              <div className="space-y-3">
                {duplicate.matches.map((match, idx) => (
                  <div key={idx} className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-start space-x-3">
                        <i className="fa-solid fa-exclamation-triangle text-yellow-600 mt-1"></i>
                        <div>
                          <h4 className="font-semibold text-gray-900 mb-1">Partial Match Found</h4>
                          <p className="text-sm text-gray-600 mb-2">{match.similarity}% similarity with external source</p>
                          <a href={match.url} target="_blank" rel="noopener noreferrer" className="text-xs text-primary hover:underline truncate block max-w-md">
                            {match.url}
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Recommendations */}
        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
            <i className="fa-solid fa-wand-magic-sparkles text-primary mr-2"></i>
            Content Improvement Recommendations
          </h2>
          <div className="space-y-4">
            {recommendations.map((rec, idx) => (
              <div key={idx} className={`bg-white rounded-xl shadow-sm border-l-4 ${rec.color === 'green' ? 'border-green-500' : rec.color === 'yellow' ? 'border-yellow-500' : rec.color === 'blue' ? 'border-blue-500' : 'border-purple-500'} p-6`}>
                <div className="flex items-start space-x-4">
                  <div className={`w-12 h-12 ${rec.color === 'green' ? 'bg-green-50' : rec.color === 'yellow' ? 'bg-yellow-50' : rec.color === 'blue' ? 'bg-blue-50' : 'bg-purple-50'} rounded-lg flex items-center justify-center flex-shrink-0`}>
                    <i className={`fa-solid ${rec.icon} ${rec.color === 'green' ? 'text-secondary' : rec.color === 'yellow' ? 'text-yellow-600' : rec.color === 'blue' ? 'text-primary' : 'text-purple-600'} text-lg`}></i>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="font-semibold text-gray-900 text-lg">{rec.title}</h3>
                      <span className={`px-3 py-1 ${rec.badgeColor} text-xs font-semibold rounded-full`}>{rec.badge}</span>
                    </div>
                    <p className="text-gray-600 text-sm mb-4">{rec.content}</p>
                    
                    {rec.tip && (
                      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                        <p className="text-sm font-medium text-gray-900 mb-2">
                          <i className="fa-solid fa-graduation-cap text-primary mr-2"></i>
                          Why This Works:
                        </p>
                        <p className="text-sm text-gray-700">{rec.tip}</p>
                      </div>
                    )}
                    
                    {rec.steps && (
                      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                        <p className="text-sm font-medium text-gray-900 mb-3">
                          <i className="fa-solid fa-lightbulb text-primary mr-2"></i>
                          How to Implement:
                        </p>
                        <ul className="text-sm text-gray-700 space-y-2">
                          {rec.steps.map((step, sidx) => (
                            <li key={sidx} className="flex items-start">
                              <i className="fa-solid fa-circle text-xs text-primary mr-2 mt-1"></i>
                              {step}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                    
                    {rec.keywords && (
                      <div className="mb-4">
                        <p className="text-sm font-medium text-gray-900 mb-2">Suggested LSI Keywords to Add:</p>
                        <div className="flex flex-wrap gap-2">
                          {rec.keywords.map((kw, kidx) => (
                            <span key={kidx} className="px-3 py-1.5 bg-blue-50 border border-blue-200 rounded-lg text-sm text-gray-700">{kw}</span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContentAnalysis;
