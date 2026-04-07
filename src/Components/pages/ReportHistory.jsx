import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from "../../services/api";
import Header from "../Header";

const ReportHistory = () => {
  const navigate = useNavigate();
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [analyses, setAnalyses] = useState([]);
  const [selectedReports, setSelectedReports] = useState([]);
  const [filters, setFilters] = useState({
    search: '',
    dateRange: 'all',
    website: 'all'
  });

  // 🔐 Vérifier l'authentification
  useEffect(() => {
    if (!localStorage.getItem("token")) {
      navigate("/login?returnTo=/reports");
    }
  }, [navigate]);

  // 📡 Fetch analyses on mount
  useEffect(() => {
    fetchAnalyses();
  }, []);

  const fetchAnalyses = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const data = await api.getMyAnalyses();
      
      if (data.analyses) {
        // Transformer les données backend en format UI
        const formatted = data.analyses.map((analysis, idx) => ({
          id: analysis.id || idx + 1,
          date: analysis.created_at ? new Date(analysis.created_at).toLocaleDateString('en-US', { 
            year: 'numeric', month: 'short', day: 'numeric' 
          }) : 'N/A',
          time: analysis.created_at ? new Date(analysis.created_at).toLocaleTimeString('en-US', {
            hour: '2-digit', minute: '2-digit'
          }) : 'N/A',
          url: analysis.url || 'Unknown',
          score: analysis.global_score || 0,
          status: getScoreLabel(analysis.global_score),
          change: calculateScoreChange(analysis, idx, data.analyses),
          changeType: getChangeType(analysis, idx, data.analyses),
          critical: analysis.issues?.filter(i => i.severity === 'critical').length || 0,
          medium: analysis.issues?.filter(i => i.severity === 'medium').length || 0,
          raw: analysis // Keep original for comparison feature
        }));
        setAnalyses(formatted);
      } else {
        setAnalyses([]);
      }
    } catch (err) {
      console.error("Failed to fetch analyses:", err);
      setError(err.message || "Failed to load report history");
      
      if (err.message?.includes("401")) {
        localStorage.removeItem("token");
        navigate("/login");
      }
    } finally {
      setLoading(false);
    }
  };

  // 🎨 Helpers
  const getScoreLabel = (score) => {
    if (score >= 80) return 'Good';
    if (score >= 60) return 'Fair';
    if (score >= 50) return 'Needs Work';
    return 'Poor';
  };

  const getScoreColor = (score) => {
    if (score >= 80) return 'from-green-400 to-green-600';
    if (score >= 60) return 'from-yellow-400 to-orange-500';
    return 'from-orange-400 to-red-500';
  };

  const calculateScoreChange = (current, idx, all) => {
    if (idx >= all.length - 1) return '0'; // First analysis, no previous
    const previous = all[idx + 1]; // Analyses are sorted newest first
    const diff = (current.global_score || 0) - (previous.global_score || 0);
    return diff >= 0 ? `+${diff}` : `${diff}`;
  };

  const getChangeType = (current, idx, all) => {
    if (idx >= all.length - 1) return 'neutral';
    const previous = all[idx + 1];
    const diff = (current.global_score || 0) - (previous.global_score || 0);
    if (diff > 0) return 'positive';
    if (diff < 0) return 'negative';
    return 'neutral';
  };

  // 🔄 Toggle selection for comparison
  const toggleSelection = (id) => {
    setSelectedReports(prev => 
      prev.includes(id) ? prev.filter(r => r !== id) : [...prev, id].slice(0, 2) // Max 2 for comparison
    );
  };

  // 🔄 Filter analyses
  const filteredAnalyses = analyses.filter(analysis => {
    // Search filter
    if (filters.search && !analysis.url.toLowerCase().includes(filters.search.toLowerCase()) 
        && !analysis.date.toLowerCase().includes(filters.search.toLowerCase())) {
      return false;
    }
    
    // Date range filter
    if (filters.dateRange !== 'all') {
      const analysisDate = new Date(analysis.raw.created_at);
      const now = new Date();
      const daysDiff = (now - analysisDate) / (1000 * 60 * 60 * 24);
      
      if (filters.dateRange === '7days' && daysDiff > 7) return false;
      if (filters.dateRange === '30days' && daysDiff > 30) return false;
      if (filters.dateRange === '3months' && daysDiff > 90) return false;
      if (filters.dateRange === '1year' && daysDiff > 365) return false;
    }
    
    // Website filter
    if (filters.website !== 'all' && !analysis.url.includes(filters.website)) {
      return false;
    }
    
    return true;
  });

  // 📊 Calculate summary stats
  const stats = {
    total: analyses.length,
    improvement: analyses.length > 1 
      ? (analyses[0]?.score || 0) - (analyses[analyses.length - 1]?.score || 0)
      : 0,
    daysSinceLast: analyses[0]?.raw?.created_at 
      ? Math.floor((new Date() - new Date(analyses[0].raw.created_at)) / (1000 * 60 * 60 * 24))
      : 0,
    currentScore: analyses[0]?.score || 0,
  };

  // 🎨 Skeleton loading
  if (loading) {
    return (
      <div className="bg-gray-50 min-h-screen">
        <Header />
        <div className="p-8 animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/3 mb-8"></div>
          <div className="grid grid-cols-4 gap-6 mb-8">
            {[1,2,3,4].map(i => <div key={i} className="bg-white rounded-xl p-6 h-24"></div>)}
          </div>
          <div className="bg-white rounded-xl p-6 h-96"></div>
        </div>
      </div>
    );
  }

  // 🚫 Empty state
  if (analyses.length === 0 && !error) {
    return (
      <div className="bg-gray-50 min-h-screen">
        <Header />
        <div className="p-8 flex items-center justify-center min-h-[60vh]">
          <div className="text-center max-w-md">
            <div className="text-6xl mb-6">📊</div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">No Reports Yet</h2>
            <p className="text-gray-600 mb-8">
              Launch your first SEO analysis to start tracking your progress over time.
            </p>
            <button
              onClick={() => navigate("/")}
              className="px-6 py-3 bg-primary text-white rounded-xl font-medium hover:bg-blue-700 transition"
            >
              Launch First Analysis →
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      <Header />
      <div className="p-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Report History</h1>
              <p className="text-gray-600 mt-1">Track your SEO analysis progress over time and compare historical reports</p>
            </div>
            <button 
              onClick={() => navigate("/")}
              className="px-6 py-3 bg-primary text-white rounded-lg hover:bg-blue-700 font-medium transition shadow-sm"
            >
              <i className="fa-solid fa-plus mr-2"></i>
              New Analysis
            </button>
          </div>
        </div>

        {/* Error message */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700">
            ❌ {error}
            <button onClick={fetchAnalyses} className="ml-2 underline">Retry</button>
          </div>
        )}

        {/* Summary Stats */}
        <div className="grid grid-cols-4 gap-6 mb-8">
          {[
            { label: 'Analyses Completed', value: stats.total, icon: 'fa-file-lines', color: 'blue' },
            { label: 'Score Improvement', value: stats.improvement >= 0 ? `+${stats.improvement}` : stats.improvement, icon: 'fa-arrow-trend-up', color: stats.improvement >= 0 ? 'green' : 'red' },
            { label: 'Days Since Last Run', value: stats.daysSinceLast, icon: 'fa-calendar-day', color: 'orange' },
            { label: 'Current SEO Score', value: stats.currentScore, icon: 'fa-gauge-high', color: 'purple' },
          ].map((stat, idx) => (
            <div key={idx} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-2">
                <i className={`fa-solid ${stat.icon} text-${stat.color}-600 text-2xl`}></i>
                {stat.label.includes('Improvement') && (
                  <span className={`px-2 py-1 ${stat.improvement >= 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'} text-xs font-semibold rounded-full`}>
                    {stat.improvement >= 0 ? '↑' : '↓'}
                  </span>
                )}
              </div>
              <div className="text-3xl font-bold text-gray-900 mb-1">{stat.value}</div>
              <div className="text-sm text-gray-600">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Filters */}
        <div className="mb-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <input 
                    type="text" 
                    placeholder="Search by URL or date..." 
                    value={filters.search}
                    onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
                    className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm w-80 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                  />
                  <i className="fa-solid fa-search absolute left-3 top-3 text-gray-400 text-sm"></i>
                </div>
                <div className="border-l border-gray-300 pl-4">
                  <select 
                    value={filters.dateRange}
                    onChange={(e) => setFilters(prev => ({ ...prev, dateRange: e.target.value }))}
                    className="px-4 py-2 border border-gray-300 rounded-lg text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                  >
                    <option value="all">All Time</option>
                    <option value="7days">Last 7 Days</option>
                    <option value="30days">Last 30 Days</option>
                    <option value="3months">Last 3 Months</option>
                    <option value="1year">Last Year</option>
                  </select>
                </div>
                <div>
                  <select 
                    value={filters.website}
                    onChange={(e) => setFilters(prev => ({ ...prev, website: e.target.value }))}
                    className="px-4 py-2 border border-gray-300 rounded-lg text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                  >
                    <option value="all">All Websites</option>
                    {[...new Set(analyses.map(a => {
                      try { return new URL(a.url).hostname; } catch { return 'Unknown'; }
                    }))].map(hostname => (
                      <option key={hostname} value={hostname}>{hostname}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <button className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 font-medium transition text-sm">
                  <i className="fa-solid fa-download mr-2"></i>
                  Export History
                </button>
                <button 
                  disabled={selectedReports.length !== 2}
                  className={`px-4 py-2 rounded-lg font-medium transition text-sm flex items-center ${
                    selectedReports.length === 2
                      ? 'bg-primary text-white hover:bg-blue-700'
                      : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  }`}
                >
                  <i className="fa-solid fa-code-compare mr-2"></i>
                  Compare ({selectedReports.length}/2)
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Reports Table */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    <input 
                      type="checkbox" 
                      checked={selectedReports.length === filteredAnalyses.length && filteredAnalyses.length > 0}
                      onChange={(e) => setSelectedReports(e.target.checked ? filteredAnalyses.map(a => a.id) : [])}
                      className="w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary accent-primary cursor-pointer"
                    />
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Date & Time</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Website URL</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Global Score</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Score Change</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Key Issues</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredAnalyses.map((report) => (
                  <tr key={report.id} className="hover:bg-gray-50 transition cursor-pointer"
                      onClick={() => navigate(`/analysis/${report.raw.id}`)}>
                    <td className="px-6 py-4 whitespace-nowrap" onClick={(e) => e.stopPropagation()}>
                      <input 
                        type="checkbox" 
                        checked={selectedReports.includes(report.id)}
                        onChange={() => toggleSelection(report.id)}
                        className="w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary accent-primary cursor-pointer"
                      />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div>
                          <div className="text-sm font-semibold text-gray-900">{report.date}</div>
                          <div className="text-xs text-gray-500">{report.time}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <i className="fa-solid fa-globe text-gray-400 mr-2"></i>
                        <span className="text-sm text-gray-900 font-medium truncate max-w-[200px]" title={report.url}>
                          {(() => { try { return new URL(report.url).hostname; } catch { return report.url; }})()}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className={`w-12 h-12 rounded-full bg-gradient-to-br ${getScoreColor(report.score)} flex items-center justify-center text-white font-bold text-sm mr-3`}>
                          {report.score}
                        </div>
                        <span className="text-sm text-gray-600">{report.status}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        {report.changeType === 'positive' && <i className="fa-solid fa-arrow-up text-green-600 mr-1"></i>}
                        {report.changeType === 'negative' && <i className="fa-solid fa-arrow-down text-red-600 mr-1"></i>}
                        {report.changeType === 'neutral' && <i className="fa-solid fa-minus text-gray-600 mr-1"></i>}
                        <span className={`text-sm font-semibold ${
                          report.changeType === 'positive' ? 'text-green-600' : 
                          report.changeType === 'negative' ? 'text-red-600' : 'text-gray-600'
                        }`}>
                          {report.change}
                        </span>
                        <span className="text-xs text-gray-500 ml-1">vs previous</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-2">
                        {report.critical > 0 && (
                          <span className="px-2 py-1 bg-red-100 text-red-700 text-xs font-semibold rounded-full">
                            {report.critical} Critical
                          </span>
                        )}
                        {report.medium > 0 && (
                          <span className="px-2 py-1 bg-orange-100 text-orange-700 text-xs font-semibold rounded-full">
                            {report.medium} Medium
                          </span>
                        )}
                        {report.critical === 0 && report.medium === 0 && (
                          <span className="px-2 py-1 bg-green-100 text-green-700 text-xs font-semibold rounded-full">
                            No Issues ✓
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap" onClick={(e) => e.stopPropagation()}>
                      <div className="flex items-center space-x-2">
                        <button 
                          onClick={() => navigate(`/analysis/${report.raw.id}`)}
                          className="px-3 py-1.5 bg-primary text-white rounded-lg hover:bg-blue-700 text-xs font-medium transition"
                        >
                          <i className="fa-solid fa-eye mr-1"></i>
                          View
                        </button>
                        <button className="px-3 py-1.5 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 text-xs font-medium transition">
                          <i className="fa-solid fa-download mr-1"></i>
                          Export
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                
                {filteredAnalyses.length === 0 && (
                  <tr>
                    <td colSpan={7} className="px-6 py-12 text-center text-gray-500">
                      No reports match your filters. Try adjusting your search criteria.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {filteredAnalyses.length > 6 && (
            <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
              <div className="text-sm text-gray-600">
                Showing <span className="font-semibold">1-{Math.min(6, filteredAnalyses.length)}</span> of <span className="font-semibold">{filteredAnalyses.length}</span> reports
              </div>
              <div className="flex items-center space-x-2">
                <button className="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium transition text-sm">
                  <i className="fa-solid fa-chevron-left mr-2"></i>Previous
                </button>
                <button className="px-4 py-2 bg-primary text-white rounded-lg font-medium text-sm">1</button>
                {filteredAnalyses.length > 6 && (
                  <>
                    <button className="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium transition text-sm">2</button>
                    <span className="px-2 text-gray-500">...</span>
                    <button className="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium transition text-sm">
                      Next<i className="fa-solid fa-chevron-right ml-2"></i>
                    </button>
                  </>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Compare Section (only show if 2 reports selected) */}
        {selectedReports.length === 2 && (
          <div className="mt-8 bg-white rounded-xl shadow-sm border border-gray-200 p-8">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Compare Reports</h2>
                <p className="text-gray-600">Side-by-side comparison of selected analyses</p>
              </div>
              <button 
                onClick={() => setSelectedReports([])}
                className="text-gray-400 hover:text-gray-600"
              >
                <i className="fa-solid fa-xmark text-xl"></i>
              </button>
            </div>

            <div className="grid grid-cols-2 gap-8">
              {selectedReports.map(reportId => {
                const report = analyses.find(a => a.id === reportId);
                if (!report) return null;
                
                return (
                  <div key={reportId} className="border border-gray-200 rounded-xl p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-semibold text-gray-900">{report.date}</h3>
                      <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${getScoreColor(report.score)} flex items-center justify-center text-white font-bold`}>
                        {report.score}
                      </div>
                    </div>
                    
                    <p className="text-sm text-gray-600 mb-4 truncate">{report.url}</p>
                    
                    <div className="space-y-3">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Critical Issues:</span>
                        <span className="font-semibold text-red-600">{report.critical}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Medium Issues:</span>
                        <span className="font-semibold text-orange-600">{report.medium}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Status:</span>
                        <span className={`font-semibold ${
                          report.status === 'Good' ? 'text-green-600' : 
                          report.status === 'Fair' ? 'text-yellow-600' : 'text-orange-600'
                        }`}>{report.status}</span>
                      </div>
                    </div>
                    
                    <button 
                      onClick={() => navigate(`/analysis/${report.raw.id}`)}
                      className="mt-4 w-full px-4 py-2 bg-primary text-white rounded-lg hover:bg-blue-700 font-medium transition text-sm"
                    >
                      View Full Report
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Educational Section */}
        <div className="mt-8 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl border border-blue-200 p-8">
          <div className="flex items-start space-x-4 mb-6">
            <div className="w-16 h-16 bg-primary rounded-xl flex items-center justify-center flex-shrink-0">
              <i className="fa-solid fa-lightbulb text-white text-2xl"></i>
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Tracking SEO Progress Over Time</h2>
              <p className="text-gray-700">Understanding your historical data helps optimize your SEO strategy</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div className="bg-white rounded-lg p-5 border border-blue-200">
              <h3 className="font-semibold text-gray-900 mb-3 flex items-center">
                <i className="fa-solid fa-chart-line text-primary mr-2"></i>
                Why Track History?
              </h3>
              <ul className="space-y-2 text-sm text-gray-700">
                <li className="flex items-start">
                  <i className="fa-solid fa-check text-green-600 mr-2 mt-0.5"></i>
                  <span>Identify which optimizations had the biggest impact on your score</span>
                </li>
                <li className="flex items-start">
                  <i className="fa-solid fa-check text-green-600 mr-2 mt-0.5"></i>
                  <span>Track improvement trends over weeks and months</span>
                </li>
                <li className="flex items-start">
                  <i className="fa-solid fa-check text-green-600 mr-2 mt-0.5"></i>
                  <span>Detect regressions or new issues that arise</span>
                </li>
                <li className="flex items-start">
                  <i className="fa-solid fa-check text-green-600 mr-2 mt-0.5"></i>
                  <span>Measure ROI of your SEO efforts with concrete data</span>
                </li>
              </ul>
            </div>

            <div className="bg-white rounded-lg p-5 border border-blue-200">
              <h3 className="font-semibold text-gray-900 mb-3 flex items-center">
                <i className="fa-solid fa-calendar-check text-primary mr-2"></i>
                Best Practices
              </h3>
              <ul className="space-y-2 text-sm text-gray-700">
                <li className="flex items-start">
                  <i className="fa-solid fa-check text-green-600 mr-2 mt-0.5"></i>
                  <span>Run analyses weekly after implementing changes</span>
                </li>
                <li className="flex items-start">
                  <i className="fa-solid fa-check text-green-600 mr-2 mt-0.5"></i>
                  <span>Compare reports before and after major updates</span>
                </li>
                <li className="flex items-start">
                  <i className="fa-solid fa-check text-green-600 mr-2 mt-0.5"></i>
                  <span>Export historical data for stakeholder reports</span>
                </li>
                <li className="flex items-start">
                  <i className="fa-solid fa-check text-green-600 mr-2 mt-0.5"></i>
                  <span>Use score deltas to prioritize future optimization work</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportHistory;