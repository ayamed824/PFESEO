import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { api } from "../../services/api";
import Header from "../Header";

const TechnicalSEO = () => {
  const navigate = useNavigate();
  const { analysisId } = useParams();
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [analysis, setAnalysis] = useState(null);
  const [technicalData, setTechnicalData] = useState(null);

  // 🔐 Check authentication
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login?returnTo=/technical-seo");
    }
  }, [navigate]);

  // 📡 Fetch analysis data on mount or when analysisId changes
  useEffect(() => {
    fetchAnalysisData();
  }, [analysisId]);

  const fetchAnalysisData = async () => {
  try {
    setLoading(true);
    setError(null);

    // 🔥 PRIORITY: URL → localStorage
    const idFromUrl = analysisId;
    const idFromStorage = localStorage.getItem("analysisId");

    const finalId = idFromUrl || idFromStorage;

    let data = null;

    if (finalId) {
      data = await api.getAnalysisResults(finalId);

      // 🔥 نحفظو باش باقي pages يستعملوه
      localStorage.setItem("analysisId", finalId);
    } else {
      const analyses = await api.getMyAnalyses();
      data = analyses?.analyses?.[0] || null;

      if (data?.id) {
        localStorage.setItem("analysisId", data.id);
      }
    }

    if (data) {
      setAnalysis(data);

      setTechnicalData(
        transformRawToTechnical(
          data.raw_data,
          data?.scores?.technical_seo ?? 0
        )
      );
    } else {
      setAnalysis(null);
      setTechnicalData(null);
    }

  } catch (err) {
    console.error("Failed to fetch:", err);
    setError(err.message || "Failed to load analysis");

    if (err.message?.includes("401")) {
      localStorage.removeItem("token");
      navigate("/login");
    }

  } finally {
    setLoading(false);
  }
};

  // 🔧 Transform raw_data from crawler into technical SEO format
  const transformRawToTechnical = (raw, categoryScore) => {
    if (!raw) return null;
     let imagesArray = [];

      if (Array.isArray(raw.images)) {
       imagesArray = raw.images;
        } else if (raw.images?.items) {
          imagesArray = raw.images.items;
        }

    
    return {
      categoryScore: categoryScore ?? 0,
      performance: {
        loadTime: raw.technical?.load_time_ms 
          ? `${(raw.technical.load_time_ms / 1000).toFixed(2)}s` 
          : 'N/A',
        loadTimeMs: raw.technical?.load_time_ms || 0,
        htmlSize: raw.technical?.html_size_kb 
          ? `${raw.technical.html_size_kb} KB` 
          : 'N/A',
        wordCount: raw.technical?.word_count || 0,
      },
      metaTags: {
        title: {
          value: raw.meta_tags?.title || null,
          length: raw.meta_tags?.title_length || 0,
          status: raw.meta_tags?.title_length >= 30 && raw.meta_tags?.title_length <= 60 ? 'good' : 'warning',
          recommendation: raw.meta_tags?.title_length < 30 
            ? 'Title too short (min 30 chars)' 
            : raw.meta_tags?.title_length > 60 
              ? 'Title too long (max 60 chars)' 
              : null,
        },
        description: {
          value: raw.meta_tags?.description || null,
          length: raw.meta_tags?.description_length || 0,
          status: raw.meta_tags?.description_length >= 120 && raw.meta_tags?.description_length <= 160 ? 'good' : 'warning',
          recommendation: raw.meta_tags?.description_length < 120
            ? 'Description too short (min 120 chars)'
            : raw.meta_tags?.description_length > 160
              ? 'Description too long (max 160 chars)'
              : null,
        },
        keywords: raw.meta_tags?.keywords || null,
        canonical: raw.meta_tags?.canonical || null,
        robots: raw.meta_tags?.robots || null,
        ogTags: {
          title: raw.meta_tags?.og_title || null,
          description: raw.meta_tags?.og_description || null,
          image: raw.meta_tags?.og_image || null,
        },
      },
      headings: {
        h1: raw.headings?.h1 || [],
        h1Count: raw.headings?.h1_count || 0,
        h1Status: raw.headings?.h1_count === 1 ? 'good' : raw.headings?.h1_count === 0 ? 'critical' : 'warning',
        h2: raw.headings?.h2 || [],
        h3: raw.headings?.h3 || [],
        hierarchy: raw.headings?.has_proper_hierarchy ?? true,
      },
      technical: {
        hasSitemap: raw.technical?.has_sitemap || false,
        sitemapUrl: raw.technical?.sitemap_url || null,
        hasRobots: raw.technical?.has_robots_txt || false,
        isHttps: raw.technical?.is_https || false,
        hasViewport: raw.technical?.has_viewport || false,
        hasLang: raw.technical?.has_lang || false,
        hasCharset: !!raw.technical?.charset,
        hasStructuredData: raw.technical?.has_structured_data || false,
        hasFavicon: raw.technical?.has_favicon || false,
      },
      
    images: {
          total: imagesArray.length,
          withAlt: imagesArray.filter(i => i.has_alt).length,
          missingAlt: imagesArray.filter(i => !i.has_alt).length,
          lazyLoaded: imagesArray.filter(i => i.is_lazy).length,
        },
      links: {
        internal: raw.links?.internal?.length || 0,
        external: raw.links?.external?.length || 0,
        nofollow: raw.links?.external?.filter(l => l.is_nofollow)?.length || 0,
      },
      issues: generateTechnicalIssues(raw),
    };
  };

  // 🎯 Generate technical issues list from raw_data
  const generateTechnicalIssues = (raw) => {
  const issues = { critical: [], medium: [], low: [] };
  
  if (!raw) return issues;

  // ✅ FIX images هنا
  let imagesArray = [];

  if (Array.isArray(raw.images)) {
    imagesArray = raw.images;
  } else if (raw.images?.items) {
    imagesArray = raw.images.items;
  }

  // 🔴 Critical Issues
  if (!raw.meta_tags?.title) {
    issues.critical.push({
      id: 'missing-title',
      icon: 'fa-tag',
      title: 'Missing Title Tag',
      description: 'Pages without title tags are harder for search engines to understand and rank.',
      impact: 'High - Affects search visibility and click-through rates',
      solution: 'Add a unique, descriptive <title> element to each page (50-60 characters)',
    });
  }

  if (!raw.meta_tags?.description) {
    issues.critical.push({
      id: 'missing-description',
      icon: 'fa-file-lines',
      title: 'Missing Meta Description',
      description: 'Meta descriptions influence click-through rates from search results.',
      impact: 'High - Lower CTR from search results',
      solution: 'Add a compelling meta description (120-160 characters)',
    });
  }

  if (raw.headings?.h1_count === 0) {
    issues.critical.push({
      id: 'missing-h1',
      icon: 'fa-heading',
      title: 'No H1 Heading Found',
    });
  }

  if (!raw.technical?.is_https) {
    issues.critical.push({
      id: 'no-https',
      icon: 'fa-lock',
      title: 'Site Not Using HTTPS',
    });
  }

  // 🟡 Medium
  if (raw.technical?.load_time_ms > 3000) {
    issues.medium.push({
      id: 'slow-load',
      icon: 'fa-gauge-high',
      title: 'Slow Page Load Time',
    });
  }

  // ✅ هنا يصلح
  const imagesWithoutAlt = imagesArray.filter(i => !i.has_alt).length;

  if (imagesWithoutAlt > 0) {
    issues.medium.push({
      id: 'missing-alt',
      icon: 'fa-image',
      title: 'Images Missing Alt Text',
      description: `${imagesWithoutAlt} images missing alt`,
    });
  }

  // 🟢 Low
  if (!raw.technical?.has_structured_data) {
    issues.low.push({
      id: 'no-structured-data',
      icon: 'fa-code',
      title: 'No Structured Data',
    });
  }

  return issues;
};

  // 🎨 Helper functions for UI
  const getStatusColor = (status) => {
    switch(status) {
      case 'good': return 'bg-green-100 text-green-700 border-green-200';
      case 'warning': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'critical': return 'bg-red-100 text-red-700 border-red-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const getStatusIcon = (status) => {
    switch(status) {
      case 'good': return 'fa-circle-check text-green-500';
      case 'warning': return 'fa-circle-exclamation text-yellow-500';
      case 'critical': return 'fa-circle-xmark text-red-500';
      default: return 'fa-circle-info text-gray-500';
    }
  };

  const getScoreColor = (score) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 50) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getProgressBarColor = (score) => {
    if (score >= 80) return 'bg-green-500';
    if (score >= 50) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  // 🎨 Skeleton loading state
  if (loading) {
    return (
      <div className="bg-gray-50 min-h-screen">
        <Header />
        <div className="p-8 animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/3 mb-8"></div>
          <div className="grid grid-cols-4 gap-6 mb-8">
            {[1,2,3,4].map(i => (
              <div key={i} className="bg-white rounded-xl p-6 h-32">
                <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
                <div className="h-6 bg-gray-200 rounded w-1/4"></div>
              </div>
            ))}
          </div>
          <div className="grid grid-cols-2 gap-6">
            <div className="bg-white rounded-xl p-6 h-96">
              <div className="h-6 bg-gray-200 rounded w-1/3 mb-6"></div>
              <div className="space-y-4">
                {[1,2,3,4].map(i => (
                  <div key={i} className="h-16 bg-gray-200 rounded"></div>
                ))}
              </div>
            </div>
            <div className="bg-white rounded-xl p-6 h-96">
              <div className="h-6 bg-gray-200 rounded w-1/3 mb-6"></div>
              <div className="space-y-4">
                {[1,2,3,4].map(i => (
                  <div key={i} className="h-16 bg-gray-200 rounded"></div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // 🚫 Empty state - no analysis data
  if (!analysis || !technicalData) {
    return (
      <div className="bg-gray-50 min-h-screen">
        <Header />
        <div className="p-8 flex items-center justify-center min-h-[60vh]">
          <div className="text-center max-w-md">
            <div className="text-6xl mb-6">🔍</div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">No Technical Data Available</h2>
            <p className="text-gray-600 mb-8">
              Run a new SEO analysis to generate technical insights for your website.
            </p>
          </div>
        </div>
      </div>
    );
  }

  const { categoryScore, performance, metaTags, headings, technical, images, links, issues } = technicalData;
  const siteUrl = analysis.url ? new URL(analysis.url).hostname : 'Your website';

  return (
    <div className="bg-gray-50 min-h-screen">
      <Header />
      
      <main className="p-8">
        {/* Page Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Technical SEO Analysis</h1>
              <p className="text-gray-600 mt-1">
                {siteUrl} • 
                Score: <span className={`font-bold ${getScoreColor(categoryScore)}`}>
                  {categoryScore}/100
                </span>
              </p>
            </div>
            <div className="flex items-center space-x-3">
              <button className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 font-medium transition flex items-center">
                <i className="fa-solid fa-download mr-2"></i>Export
              </button>
              <button 
                onClick={() => navigate("/analysis")}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium transition flex items-center"
              >
                <i className="fa-solid fa-rotate mr-2"></i>Re-analyze
              </button>
            </div>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 flex items-center justify-between">
            <span>❌ {error}</span>
            <button onClick={fetchAnalysisData} className="underline hover:text-red-900">Retry</button>
          </div>
        )}

        {/* Category Score Progress */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-gray-900">Technical SEO Score</h3>
              <p className="text-sm text-gray-600">Based on {performance.wordCount} words analyzed</p>
            </div>
            <div className="text-right">
              <span className={`text-3xl font-bold ${getScoreColor(categoryScore)}`}>
                {categoryScore}
              </span>
              <span className="text-gray-500">/100</span>
            </div>
          </div>
          <div className="mt-4 w-full bg-gray-200 rounded-full h-3">
            <div 
              className={`${getProgressBarColor(categoryScore)} h-3 rounded-full transition-all duration-500`}
              style={{ width: `${categoryScore}%` }}
            ></div>
          </div>
        </div>

        {/* Performance Metrics */}
        <section className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Performance Metrics</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {/* Load Time */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-3">
                <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
                  <i className="fa-solid fa-gauge-high text-blue-600"></i>
                </div>
                <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                  performance.loadTimeMs <= 2000 ? 'bg-green-100 text-green-700' :
                  performance.loadTimeMs <= 4000 ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'
                }`}>
                  {performance.loadTimeMs <= 2000 ? 'Fast' : performance.loadTimeMs <= 4000 ? 'Moderate' : 'Slow'}
                </span>
              </div>
              <h3 className="text-gray-600 text-sm mb-1">Load Time</h3>
              <p className="text-2xl font-bold text-gray-900">{performance.loadTime}</p>
              <p className="text-xs text-gray-500 mt-1">Target: &lt; 2s</p>
            </div>

            {/* HTML Size */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-3">
                <div className="w-10 h-10 bg-purple-50 rounded-lg flex items-center justify-center">
                  <i className="fa-solid fa-file-code text-purple-600"></i>
                </div>
              </div>
              <h3 className="text-gray-600 text-sm mb-1">HTML Size</h3>
              <p className="text-2xl font-bold text-gray-900">{performance.htmlSize}</p>
              <p className="text-xs text-gray-500 mt-1">Smaller = Faster</p>
            </div>

            {/* Word Count */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-3">
                <div className="w-10 h-10 bg-green-50 rounded-lg flex items-center justify-center">
                  <i className="fa-solid fa-font text-green-600"></i>
                </div>
              </div>
              <h3 className="text-gray-600 text-sm mb-1">Word Count</h3>
              <p className="text-2xl font-bold text-gray-900">{performance.wordCount.toLocaleString()}</p>
              <p className="text-xs text-gray-500 mt-1">Content depth indicator</p>
            </div>

            {/* Text Ratio */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-3">
                <div className="w-10 h-10 bg-orange-50 rounded-lg flex items-center justify-center">
                  <i className="fa-solid fa-chart-pie text-orange-600"></i>
                </div>
              </div>
              <h3 className="text-gray-600 text-sm mb-1">Text Ratio</h3>
              <p className="text-2xl font-bold text-gray-900">
                {technical?.has_viewport ? 'Good' : 'N/A'}
              </p>
              <p className="text-xs text-gray-500 mt-1">Content vs code balance</p>
            </div>
          </div>
        </section>

        {/* Meta Tags & Technical Config */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Meta Tags */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Meta Tags Status</h2>
            <div className="space-y-4">
              {/* Title */}
              <div className={`p-4 rounded-lg border ${getStatusColor(metaTags.title.status)}`}>
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-3">
                    <i className={`fa-solid ${getStatusIcon(metaTags.title.status)} mt-0.5`}></i>
                    <div>
                      <h4 className="font-semibold text-gray-900">Title Tag</h4>
                      <p className="text-sm text-gray-600">
                        {metaTags.title.length} characters
                        {metaTags.title.recommendation && ` • ${metaTags.title.recommendation}`}
                      </p>
                      {metaTags.title.value && (
                        <p className="text-xs text-gray-500 mt-1 italic truncate max-w-xs">
                          "{metaTags.title.value}"
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Description */}
              <div className={`p-4 rounded-lg border ${getStatusColor(metaTags.description.status)}`}>
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-3">
                    <i className={`fa-solid ${getStatusIcon(metaTags.description.status)} mt-0.5`}></i>
                    <div>
                      <h4 className="font-semibold text-gray-900">Meta Description</h4>
                      <p className="text-sm text-gray-600">
                        {metaTags.description.length} characters
                        {metaTags.description.recommendation && ` • ${metaTags.description.recommendation}`}
                      </p>
                      {metaTags.description.value && (
                        <p className="text-xs text-gray-500 mt-1 italic truncate max-w-xs">
                          "{metaTags.description.value.substring(0, 80)}..."
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Canonical */}
              <div className={`p-4 rounded-lg border ${getStatusColor(metaTags.canonical ? 'good' : 'warning')}`}>
                <div className="flex items-start space-x-3">
                  <i className={`fa-solid ${getStatusIcon(metaTags.canonical ? 'good' : 'warning')} mt-0.5`}></i>
                  <div>
                    <h4 className="font-semibold text-gray-900">Canonical URL</h4>
                    <p className="text-sm text-gray-600">
                      {metaTags.canonical ? 'Present' : 'Missing - add to avoid duplicate content'}
                    </p>
                    {metaTags.canonical && (
                      <p className="text-xs text-gray-500 mt-1 truncate max-w-xs">{metaTags.canonical}</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Open Graph */}
              <div className="p-4 rounded-lg border bg-gray-50">
                <h4 className="font-semibold text-gray-900 mb-2">Open Graph Tags</h4>
                <div className="grid grid-cols-3 gap-2 text-xs">
                  <div>
                    <span className="text-gray-500">OG Title:</span>
                    <p className="text-gray-700 truncate">{metaTags.ogTags.title || '—'}</p>
                  </div>
                  <div>
                    <span className="text-gray-500">OG Desc:</span>
                    <p className="text-gray-700 truncate">{metaTags.ogTags.description || '—'}</p>
                  </div>
                  <div>
                    <span className="text-gray-500">OG Image:</span>
                    <p className="text-gray-700 truncate">{metaTags.ogTags.image ? '✓' : '—'}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Technical Configuration */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Technical Configuration</h2>
            <div className="space-y-3">
              {[
                { icon: 'fa-sitemap', label: 'XML Sitemap', value: technical.hasSitemap, detail: technical.sitemapUrl },
                { icon: 'fa-robot', label: 'Robots.txt', value: technical.hasRobots },
                { icon: 'fa-lock', label: 'HTTPS', value: technical.isHttps },
                { icon: 'fa-mobile-screen', label: 'Mobile Viewport', value: technical.hasViewport },
                { icon: 'fa-language', label: 'Language Attribute', value: technical.hasLang },
                { icon: 'fa-code', label: 'Structured Data', value: technical.hasStructuredData },
                { icon: 'fa-image', label: 'Favicon', value: technical.hasFavicon },
              ].map((item, idx) => (
                <div key={idx} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <i className={`fa-solid ${item.icon} ${item.value ? 'text-green-600' : 'text-gray-400'}`}></i>
                    <span className="text-sm text-gray-700">{item.label}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    {item.value ? (
                      <span className="px-2 py-1 bg-green-100 text-green-700 text-xs font-semibold rounded">
                        ✓ Present
                      </span>
                    ) : (
                      <span className="px-2 py-1 bg-red-100 text-red-700 text-xs font-semibold rounded">
                        ✗ Missing
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Headings Structure */}
        <section className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Heading Structure</h2>
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <i className={`fa-solid ${getStatusIcon(headings.h1Status)} text-lg`}></i>
                <span className={`font-semibold ${
                  headings.h1Status === 'good' ? 'text-green-700' : 
                  headings.h1Status === 'warning' ? 'text-yellow-700' : 'text-red-700'
                }`}>
                  H1: {headings.h1Count} found
                </span>
              </div>
              <span className={`px-3 py-1 text-xs font-semibold rounded-full ${getStatusColor(headings.h1Status)}`}>
                {headings.h1Status === 'good' ? 'Optimal' : headings.h1Status === 'warning' ? 'Fix Needed' : 'Critical'}
              </span>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {['h1', 'h2', 'h3'].map((tag) => (
                <div key={tag} className="p-4 bg-gray-50 rounded-lg">
                  <h4 className="font-semibold text-gray-900 mb-2 uppercase text-sm">{tag}</h4>
                  <p className="text-2xl font-bold text-gray-900">{headings[tag]?.length || 0}</p>
                  <p className="text-xs text-gray-500">
                    {headings[tag]?.length === 0 ? 'None found' : 
                     headings[tag]?.length === 1 ? '1 item' : `${headings[tag]?.length} items`}
                  </p>
                </div>
              ))}
            </div>
            
            {headings.h1.length > 0 && (
              <div className="mt-4 pt-4 border-t border-gray-200">
                <p className="text-sm text-gray-600 mb-2">H1 Content:</p>
                <p className="text-gray-900 font-medium">{headings.h1[0]}</p>
              </div>
            )}
          </div>
        </section>

        {/* Images & Links Summary */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* Images */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Images</h2>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Total Images</span>
                <span className="font-semibold">{images.total}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">With Alt Text</span>
                <span className={`font-semibold ${images.withAlt === images.total ? 'text-green-600' : 'text-yellow-600'}`}>
                  {images.withAlt}/{images.total}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Missing Alt</span>
                <span className={`font-semibold ${images.missingAlt === 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {images.missingAlt}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Lazy Loaded</span>
                <span className="font-semibold text-blue-600">{images.lazyLoaded}</span>
              </div>
            </div>
            {images.missingAlt > 0 && (
              <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                <p className="text-sm text-yellow-800">
                  ⚠️ Add alt text to {images.missingAlt} images for better accessibility and SEO
                </p>
              </div>
            )}
          </div>

          {/* Links */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Links</h2>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Internal Links</span>
                <span className="font-semibold text-blue-600">{links.internal}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">External Links</span>
                <span className="font-semibold">{links.external}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Nofollow Links</span>
                <span className="font-semibold text-purple-600">{links.nofollow}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Ratio</span>
                <span className="font-semibold">
                  {links.internal + links.external > 0 
                    ? Math.round((links.internal / (links.internal + links.external)) * 100) 
                    : 0}% internal
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* Issues Section */}
        <section className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Technical Issues</h2>
          
          {/* Critical Issues */}
          {issues.critical.length > 0 && (
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <div className="w-2 h-6 bg-red-500 rounded mr-3"></div>
                Critical Issues ({issues.critical.length})
              </h3>
              <div className="space-y-4">
                {issues.critical.map((issue, idx) => (
                  <div key={issue.id || idx} className="bg-white rounded-xl border-l-4 border-red-500 shadow-sm p-6">
                    <div className="flex items-start space-x-4">
                      <div className="w-10 h-10 bg-red-50 rounded-lg flex items-center justify-center flex-shrink-0">
                        <i className={`fa-solid ${issue.icon} text-red-500 text-lg`}></i>
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-900 text-lg mb-2">{issue.title}</h4>
                        <p className="text-gray-600 text-sm mb-3">{issue.description}</p>
                        <p className="text-sm text-red-700 mb-3">
                          <strong>Impact:</strong> {issue.impact}
                        </p>
                        {issue.code && (
                          <div className="bg-gray-900 text-gray-100 rounded-lg p-3 mb-3 overflow-x-auto">
                            <code className="text-xs">{issue.code}</code>
                          </div>
                        )}
                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                          <p className="text-sm font-medium text-gray-900 mb-2">
                            <i className="fa-solid fa-lightbulb text-blue-600 mr-2"></i>
                            Solution:
                          </p>
                          <p className="text-sm text-gray-700">{issue.solution}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Medium Issues */}
          {issues.medium.length > 0 && (
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <div className="w-2 h-6 bg-orange-500 rounded mr-3"></div>
                Medium Priority ({issues.medium.length})
              </h3>
              <div className="space-y-4">
                {issues.medium.map((issue, idx) => (
                  <div key={issue.id || idx} className="bg-white rounded-xl border-l-4 border-orange-500 shadow-sm p-6">
                    <div className="flex items-start space-x-4">
                      <div className="w-10 h-10 bg-orange-50 rounded-lg flex items-center justify-center flex-shrink-0">
                        <i className={`fa-solid ${issue.icon} text-orange-500 text-lg`}></i>
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-900 mb-2">{issue.title}</h4>
                        <p className="text-gray-600 text-sm mb-3">{issue.description}</p>
                        <p className="text-sm text-orange-700 mb-3">
                          <strong>Impact:</strong> {issue.impact}
                        </p>
                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                          <p className="text-sm font-medium text-gray-900 mb-1">
                            <i className="fa-solid fa-wrench text-blue-600 mr-2"></i>
                            Fix:
                          </p>
                          <p className="text-sm text-gray-700">{issue.solution}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Low Issues */}
          {issues.low.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <div className="w-2 h-6 bg-green-500 rounded mr-3"></div>
                Low Priority ({issues.low.length})
              </h3>
              <div className="space-y-4">
                {issues.low.map((issue, idx) => (
                  <div key={issue.id || idx} className="bg-white rounded-xl border-l-4 border-green-500 shadow-sm p-6">
                    <div className="flex items-start space-x-4">
                      <div className="w-10 h-10 bg-green-50 rounded-lg flex items-center justify-center flex-shrink-0">
                        <i className={`fa-solid ${issue.icon} text-green-600 text-lg`}></i>
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-900 mb-2">{issue.title}</h4>
                        <p className="text-gray-600 text-sm mb-2">{issue.description}</p>
                        <p className="text-sm text-gray-700">
                          <strong>Tip:</strong> {issue.solution}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* No Issues */}
          {issues.critical.length === 0 && issues.medium.length === 0 && issues.low.length === 0 && (
            <div className="bg-green-50 border border-green-200 rounded-xl p-6 text-center">
              <i className="fa-solid fa-circle-check text-green-600 text-4xl mb-3"></i>
              <p className="text-green-700 font-semibold text-lg">No technical issues found!</p>
              <p className="text-green-600">Great job! Your site follows technical SEO best practices. 🎉</p>
            </div>
          )}
        </section>
      </main>
    </div>
  );
};

export default TechnicalSEO;