import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { api } from "../../services/api";
import Header from "../Header";

const PopularitySEO = () => {
  const navigate = useNavigate();
  const { analysisId } = useParams();
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [analysis, setAnalysis] = useState(null);
  const [popularityData, setPopularityData] = useState(null);

  // 🔐 Vérifier l'authentification
  useEffect(() => {
    if (!localStorage.getItem("token")) {
      navigate("/login?returnTo=/popularity-seo");
    }
  }, [navigate]);

  // 📡 Fetch data on mount
  useEffect(() => {
    fetchPopularityData();
  }, [analysisId]);

  const fetchPopularityData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      let data;
      if (analysisId) {
        data = await api.getAnalysisResults(analysisId);
      } else {
        const analyses = await api.getMyAnalyses();
        data = analyses.analyses?.[0] || null;
      }
      
      if (data) {
        setAnalysis(data);
        setPopularityData(transformRawToPopularity(data.raw_data, data.category_scores?.popularity));
      } else {
        setAnalysis(null);
        setPopularityData(null);
      }
    } catch (err) {
      console.error("Failed to fetch popularity data:", err);
      setError(err.message || "Failed to load analysis");
      
      if (err.message?.includes("401")) {
        localStorage.removeItem("token");
        navigate("/login");
      }
    } finally {
      setLoading(false);
    }
  };

  // 🔧 Transformer raw_data en format Popularity SEO
  const transformRawToPopularity = (raw, categoryScore) => {
    if (!raw) return null;
    
    const externalLinks = raw.links?.external || [];
    
    return {
      metrics: {
        domainAuthority: calculateDomainAuthority(raw),
        pageAuthority: calculatePageAuthority(raw),
        backlinks: externalLinks.length,
        referringDomains: countUniqueDomains(externalLinks),
      },
      backlinkQuality: analyzeBacklinkQuality(externalLinks),
      recentBacklinks: externalLinks.slice(0, 10).map(formatBacklink),
      toxicLinks: identifyToxicLinks(externalLinks),
      socialPresence: extractSocialSignals(raw),
      categoryScore: categoryScore || 0,
    };
  };

  // 🎯 Helpers de calcul
  const calculateDomainAuthority = (raw) => {
    // Simplified calculation based on backlink quality
    const externalLinks = raw.links?.external || [];
    const highQuality = externalLinks.filter(l => l.authority >= 70).length;
    return Math.min(100, Math.round(30 + (highQuality * 2) + (externalLinks.length * 0.1)));
  };

  const calculatePageAuthority = (raw) => {
    const da = calculateDomainAuthority(raw);
    return Math.max(0, Math.min(100, Math.round(da * 0.9)));
  };

  const countUniqueDomains = (links) => {
    const domains = new Set(links.map(l => {
      try { return new URL(l.url).hostname; } catch { return null; }
    }).filter(Boolean));
    return domains.size;
  };

  const analyzeBacklinkQuality = (links) => {
    const ranges = [
      { min: 90, max: 100, label: '90-100 (Excellent)', color: 'bg-green-500' },
      { min: 70, max: 89, label: '70-89 (Good)', color: 'bg-blue-500' },
      { min: 50, max: 69, label: '50-69 (Average)', color: 'bg-yellow-500' },
      { min: 30, max: 49, label: '30-49 (Below Average)', color: 'bg-orange-500' },
      { min: 0, max: 29, label: '0-29 (Poor)', color: 'bg-red-500', warning: true },
    ];
    
    return ranges.map(range => ({
      ...range,
      count: links.filter(l => {
        const authority = l.authority || 50; // Default if not provided
        return authority >= range.min && authority <= range.max;
      }).length
    }));
  };

  const formatBacklink = (link) => ({
    domain: (() => { try { return new URL(link.url).hostname; } catch { return 'Unknown'; }})(),
    authority: link.authority || 50,
    date: link.created_at ? new Date(link.created_at).toLocaleDateString() : 'Unknown',
    type: link.is_nofollow ? 'Nofollow' : 'Dofollow',
    url: link.url,
  });

  const identifyToxicLinks = (links) => {
    return links.filter(l => {
      const authority = l.authority || 50;
      const domain = (() => { try { return new URL(l.url).hostname; } catch { return ''; }})();
      // Simple heuristics for toxic links
      return authority < 20 || 
             domain.includes('spam') || 
             domain.includes('fake') || 
             domain.endsWith('.tk') || 
             domain.endsWith('.cf');
    }).map(l => ({
      domain: (() => { try { return new URL(l.url).hostname; } catch { return 'Unknown'; }})(),
      authority: l.authority || 5,
      reason: l.authority < 10 ? 'Very low authority' : 'Suspicious domain pattern',
      url: l.url,
    }));
  };

  const extractSocialSignals = (raw) => {
    // Placeholder - in real app, this would fetch social API data
    return [
      { platform: 'Facebook', followers: '2.4K', engagement: '3.2%', icon: 'fa-facebook', color: 'bg-blue-600' },
      { platform: 'Twitter', followers: '1.8K', engagement: '2.8%', icon: 'fa-twitter', color: 'bg-sky-500' },
      { platform: 'LinkedIn', followers: '3.2K', engagement: '4.5%', icon: 'fa-linkedin', color: 'bg-blue-700' },
      { platform: 'Instagram', followers: '890', engagement: '5.1%', icon: 'fa-instagram', color: 'bg-pink-600' },
    ];
  };

  // 🎨 Helpers UI
  const getScoreColor = (score) => {
    if (score >= 80) return 'from-green-400 to-green-600';
    if (score >= 60) return 'from-yellow-400 to-orange-500';
    return 'from-orange-400 to-red-500';
  };

  const getBarColor = (authority) => {
    if (authority >= 70) return 'bg-green-500';
    if (authority >= 50) return 'bg-blue-500';
    if (authority >= 30) return 'bg-yellow-500';
    return 'bg-red-500';
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
          <div className="grid grid-cols-2 gap-6">
            <div className="bg-white rounded-xl p-6 h-64"></div>
            <div className="bg-white rounded-xl p-6 h-64"></div>
          </div>
        </div>
      </div>
    );
  }

  // 🚫 Empty state
  if (!analysis || !popularityData) {
    return (
      <div className="bg-gray-50 min-h-screen">
        <Header />
        <div className="p-8 flex items-center justify-center min-h-[60vh]">
          <div className="text-center max-w-md">
            <div className="text-6xl mb-6">🔗</div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">No Popularity Data Available</h2>
            <p className="text-gray-600 mb-8">
              Run a new SEO analysis to generate backlink and authority insights for your website.
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

  const { metrics, backlinkQuality, recentBacklinks, toxicLinks, socialPresence, categoryScore } = popularityData;

  return (
    <div className="bg-gray-50 min-h-screen">
      <Header />
      <div className="p-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Popularity / Off-Page SEO</h1>
              <p className="text-gray-600 mt-1">
                {analysis.url ? new URL(analysis.url).hostname : 'Your website'} • 
                Score: <span className={`font-bold ${categoryScore >= 80 ? 'text-secondary' : categoryScore >= 50 ? 'text-yellow-500' : 'text-red-500'}`}>
                  {categoryScore}/100
                </span>
              </p>
            </div>
            <div className="flex items-center space-x-3">
              <button className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 font-medium transition">
                <i className="fa-solid fa-download mr-2"></i>Export
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
            <button onClick={fetchPopularityData} className="ml-2 underline">Retry</button>
          </div>
        )}

        {/* Key Metrics */}
        <div className="grid grid-cols-4 gap-6 mb-8">
          {[
            { label: 'Domain Authority', value: metrics.domainAuthority, max: '100', change: '+3', changeType: 'positive', width: `${metrics.domainAuthority}%`, color: 'bg-blue-500' },
            { label: 'Page Authority', value: metrics.pageAuthority, max: '100', change: '+2', changeType: 'positive', width: `${metrics.pageAuthority}%`, color: 'bg-blue-400' },
            { label: 'Backlinks', value: metrics.backlinks.toLocaleString(), max: '', change: '+24', changeType: 'positive', width: `${Math.min(metrics.backlinks / 20, 100)}%`, color: 'bg-secondary' },
            { label: 'Referring Domains', value: metrics.referringDomains, max: '', change: '+8', changeType: 'positive', width: `${Math.min(metrics.referringDomains / 2, 100)}%`, color: 'bg-secondary' },
          ].map((metric, idx) => (
            <div key={idx} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-gray-600 font-medium text-sm mb-2">{metric.label}</h3>
              <div className="flex items-baseline mb-2">
                <span className="text-3xl font-bold text-gray-900">{metric.value}</span>
                {metric.max && <span className="text-gray-500 text-sm ml-1">/{metric.max}</span>}
              </div>
              <div className="flex items-center mb-3">
                <i className={`fa-solid fa-arrow-${metric.changeType === 'positive' ? 'up' : 'down'} ${metric.changeType === 'positive' ? 'text-green-600' : 'text-red-600'} mr-1`}></i>
                <span className={`text-sm font-semibold ${metric.changeType === 'positive' ? 'text-green-600' : 'text-red-600'}`}>{metric.change}</span>
                <span className="text-xs text-gray-500 ml-1">this month</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className={`${metric.color} h-2 rounded-full transition-all duration-500`} style={{width: metric.width}}></div>
              </div>
            </div>
          ))}
        </div>

        {/* Backlink Quality + Recent Backlinks */}
        <div className="grid grid-cols-2 gap-6 mb-8">
          {/* Backlink Quality Distribution */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Backlink Quality Distribution</h2>
            <div className="space-y-4">
              {backlinkQuality.map((item, idx) => (
                <div key={idx}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm text-gray-700">{item.label}</span>
                    <span className={`text-sm font-semibold ${item.warning ? 'text-red-600' : 'text-gray-900'}`}>{item.count} links</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div className={`${item.color} h-2.5 rounded-full transition-all duration-500`} style={{width: `${(item.count / Math.max(1, backlinkQuality.reduce((sum, i) => sum + i.count, 0))) * 100}%`}}></div>
                  </div>
                </div>
              ))}
            </div>
            {toxicLinks.length > 0 && (
              <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                <div className="flex items-start space-x-3">
                  <i className="fa-solid fa-triangle-exclamation text-red-500 mt-1"></i>
                  <div>
                    <p className="text-sm font-semibold text-gray-900 mb-1">{toxicLinks.length} Toxic Links Detected</p>
                    <p className="text-sm text-gray-600">These links may harm your rankings. Consider disavowing them.</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Recent Backlinks */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Recent Backlinks</h2>
            <div className="space-y-3">
              {recentBacklinks.slice(0, 4).map((link, idx) => (
                <div key={idx} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
                      <i className="fa-solid fa-link text-primary"></i>
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900 text-sm truncate max-w-[150px]" title={link.domain}>{link.domain}</p>
                      <p className="text-xs text-gray-500">DA: {link.authority} • {link.date}</p>
                    </div>
                  </div>
                  <span className={`px-2 py-1 text-xs font-semibold rounded ${link.type === 'Dofollow' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>
                    {link.type}
                  </span>
                </div>
              ))}
              {recentBacklinks.length === 0 && (
                <p className="text-center text-gray-500 py-4">No backlinks detected yet.</p>
              )}
            </div>
            <button className="w-full mt-4 px-4 py-2 text-primary border border-primary rounded-lg hover:bg-blue-50 font-medium transition text-sm">
              View All Backlinks
            </button>
          </div>
        </div>

        {/* Toxic Links Section */}
        {toxicLinks.length > 0 && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-gray-900">Toxic Links Requiring Action</h2>
              <button className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 font-medium transition text-sm">
                <i className="fa-solid fa-ban mr-2"></i>
                Generate Disavow File
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600">Domain</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600">Authority</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600">Issue</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {toxicLinks.map((link, idx) => (
                    <tr key={idx}>
                      <td className="px-4 py-3 text-sm text-gray-900 font-medium">{link.domain}</td>
                      <td className="px-4 py-3 text-sm text-gray-600">{link.authority}</td>
                      <td className="px-4 py-3 text-sm text-red-600">{link.reason}</td>
                      <td className="px-4 py-3">
                        <button className="text-sm text-primary hover:text-blue-700 font-medium">Add to Disavow</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Social Presence */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Social Media Presence</h2>
          <div className="grid grid-cols-4 gap-4">
            {socialPresence.map((social, idx) => (
              <div key={idx} className="p-4 border border-gray-200 rounded-lg text-center hover:shadow-md transition">
                <div className={`w-12 h-12 ${social.color} rounded-full flex items-center justify-center mx-auto mb-3`}>
                  <i className={`fa-brands ${social.icon} text-white text-xl`}></i>
                </div>
                <h3 className="font-semibold text-gray-900 mb-1">{social.platform}</h3>
                <p className="text-2xl font-bold text-gray-900 mb-1">{social.followers}</p>
                <p className="text-sm text-gray-600">Followers</p>
                <div className="mt-2 pt-2 border-t border-gray-100">
                  <span className="text-sm font-semibold text-green-600">{social.engagement}</span>
                  <span className="text-xs text-gray-500 ml-1">engagement</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PopularitySEO;