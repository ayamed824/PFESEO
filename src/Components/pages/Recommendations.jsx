import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from "../../services/api";
import Header from "../Header";

const Recommendations = () => {
  const navigate = useNavigate();
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [recommendations, setRecommendations] = useState([]);
  const [filters, setFilters] = useState({ priority: 'all', category: 'all' });
  const [addressedIds, setAddressedIds] = useState([]);

  // 🔐 Vérifier l'authentification
  useEffect(() => {
    if (!localStorage.getItem("token")) {
      navigate("/login?returnTo=/recommendations");
    }
  }, [navigate]);

  // 📡 Fetch recommendations on mount
  useEffect(() => {
    fetchRecommendations();
  }, []);

  const fetchRecommendations = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Fetch latest analysis which contains recommendations
      const analyses = await api.getMyAnalyses();
      const latest = analyses.analyses?.[0];
      
      if (latest?.recommendations) {
        // Transform backend recommendations to UI format
        const formatted = latest.recommendations.map((rec, idx) => ({
          id: rec.id || idx + 1,
          priority: rec.priority || 'medium',
          category: rec.category || 'technical',
          icon: getIconForCategory(rec.category),
          color: getColorForCategory(rec.category),
          title: rec.title || rec.text,
          description: rec.description || rec.text,
          time: rec.effort || '1-2 hours',
          impact: rec.impact || '+5 SEO score',
          steps: rec.actions || [rec.text],
          agent: rec.agent,
        }));
        setRecommendations(formatted);
      } else {
        setRecommendations([]);
      }
    } catch (err) {
      console.error("Failed to fetch recommendations:", err);
      setError(err.message || "Failed to load recommendations");
      
      if (err.message?.includes("401")) {
        localStorage.removeItem("token");
        navigate("/login");
      }
    } finally {
      setLoading(false);
    }
  };

  // 🎨 Helpers
  const getIconForCategory = (cat) => {
    const icons = {
      technical: 'fa-wrench',
      content: 'fa-file-lines',
      ux: 'fa-paintbrush',
      popularity: 'fa-star',
    };
    return icons[cat] || 'fa-lightbulb';
  };

  const getColorForCategory = (cat) => {
    const colors = {
      technical: 'blue',
      content: 'green',
      ux: 'purple',
      popularity: 'orange',
    };
    return colors[cat] || 'indigo';
  };

  const getPriorityColor = (priority) => {
    switch(priority) {
      case 'high': return 'bg-red-100 text-red-700';
      case 'medium': return 'bg-orange-100 text-orange-700';
      case 'low': return 'bg-green-100 text-green-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getCategoryColor = (cat) => {
    const colors = {
      technical: 'bg-blue-100 text-primary',
      content: 'bg-green-100 text-green-700',
      ux: 'bg-purple-100 text-purple-700',
      popularity: 'bg-orange-100 text-orange-700',
    };
    return colors[cat] || 'bg-gray-100 text-gray-700';
  };

  // 🔄 Filter recommendations
  const filteredRecommendations = recommendations.filter(rec => {
    if (filters.priority !== 'all' && rec.priority !== filters.priority) return false;
    if (filters.category !== 'all' && rec.category !== filters.category) return false;
    if (addressedIds.includes(rec.id)) return false;
    return true;
  });

  // ✅ Mark recommendation as addressed
  const handleMarkAddressed = (id) => {
    setAddressedIds(prev => [...prev, id]);
    // TODO: Sync with backend if needed
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
          <div className="space-y-4">
            {[1,2,3].map(i => <div key={i} className="bg-white rounded-xl p-6 h-48"></div>)}
          </div>
        </div>
      </div>
    );
  }

  // 🚫 Empty state
  if (recommendations.length === 0 && !error) {
    return (
      <div className="bg-gray-50 min-h-screen">
        <Header />
        <div className="p-8 flex items-center justify-center min-h-[60vh]">
          <div className="text-center max-w-md">
            <div className="text-6xl mb-6">💡</div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">No Recommendations Yet</h2>
            <p className="text-gray-600 mb-8">
              Launch an SEO analysis to generate personalized recommendations for your website.
            </p>
            <button
              onClick={() => navigate("/")}
              className="px-6 py-3 bg-primary text-white rounded-xl font-medium hover:bg-blue-700 transition"
            >
              Launch Analysis →
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
              <h1 className="text-3xl font-bold text-gray-900">Recommendations Engine</h1>
              <p className="text-gray-600 mt-1">Actionable improvements prioritized by impact and implementation complexity</p>
            </div>
            <div className="flex items-center space-x-3">
              <button className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 font-medium transition">
                <i className="fa-solid fa-download mr-2"></i>Export
              </button>
              <button 
                onClick={fetchRecommendations}
                className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-blue-700 font-medium transition"
              >
                <i className="fa-solid fa-rotate mr-2"></i>Regenerate
              </button>
            </div>
          </div>
        </div>

        {/* Error message */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700">
            ❌ {error}
            <button onClick={fetchRecommendations} className="ml-2 underline">Retry</button>
          </div>
        )}

        {/* Summary Stats */}
        <div className="grid grid-cols-4 gap-6 mb-8">
          {[
            { label: 'Total', value: recommendations.length, icon: 'fa-list-check', color: 'blue' },
            { label: 'High Priority', value: recommendations.filter(r => r.priority === 'high').length, icon: 'fa-exclamation-triangle', color: 'red' },
            { label: 'Medium Priority', value: recommendations.filter(r => r.priority === 'medium').length, icon: 'fa-circle-exclamation', color: 'orange' },
            { label: 'Low Priority', value: recommendations.filter(r => r.priority === 'low').length, icon: 'fa-circle-info', color: 'green' },
          ].map((stat, idx) => (
            <div key={idx} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-2">
                <i className={`fa-solid ${stat.icon} text-${stat.color}-600 text-2xl`}></i>
                <span className={`px-2 py-1 bg-${stat.color}-100 text-${stat.color}-700 text-xs font-semibold rounded-full`}>
                  {stat.label.split(' ')[0]}
                </span>
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
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">Filter by Priority</label>
                  <div className="flex items-center space-x-2">
                    {['all', 'high', 'medium', 'low'].map((f) => (
                      <button
                        key={f}
                        onClick={() => setFilters(prev => ({ ...prev, priority: f }))}
                        className={`px-4 py-2 rounded-lg text-sm font-medium ${
                          filters.priority === f ? 'bg-primary text-white' : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
                        }`}
                      >
                        {f.charAt(0).toUpperCase() + f.slice(1)}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="border-l border-gray-300 pl-4">
                  <label className="text-sm font-medium text-gray-700 mb-2 block">Filter by Category</label>
                  <div className="flex items-center space-x-2">
                    {['all', 'technical', 'content', 'ux', 'popularity'].map((c) => (
                      <button
                        key={c}
                        onClick={() => setFilters(prev => ({ ...prev, category: c }))}
                        className={`px-4 py-2 rounded-lg text-sm font-medium ${
                          filters.category === c ? 'bg-primary text-white' : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
                        }`}
                      >
                        {c.charAt(0).toUpperCase() + c.slice(1)}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
              <button 
                onClick={() => setAddressedIds([])}
                className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 font-medium transition text-sm"
              >
                <i className="fa-solid fa-rotate mr-2"></i>
                Reset Addressed
              </button>
            </div>
          </div>
        </div>

        {/* Recommendations List */}
        <div className="space-y-4">
          {filteredRecommendations.map((rec) => {
            const colors = {
              bg: rec.color === 'blue' ? 'bg-blue-50' : rec.color === 'green' ? 'bg-green-50' : rec.color === 'purple' ? 'bg-purple-50' : rec.color === 'orange' ? 'bg-orange-50' : 'bg-indigo-50',
              border: rec.color === 'blue' ? 'border-primary' : `border-${rec.color}-600`,
              icon: rec.color === 'blue' ? 'text-primary' : `text-${rec.color}-600`,
            };
            
            return (
              <div key={rec.id} className="bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-all">
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-start space-x-4 flex-1">
                      <div className="flex items-center space-x-2">
                        <input 
                          type="checkbox" 
                          checked={addressedIds.includes(rec.id)}
                          onChange={() => handleMarkAddressed(rec.id)}
                          className="w-5 h-5 rounded border-gray-300 text-primary focus:ring-primary accent-primary cursor-pointer" 
                        />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-3">
                          <span className={`px-3 py-1 ${getPriorityColor(rec.priority)} text-xs font-bold rounded-full uppercase`}>
                            {rec.priority} Priority
                          </span>
                          <span className={`px-3 py-1 ${getCategoryColor(rec.category)} text-xs font-semibold rounded-full`}>
                            <i className={`fa-solid ${rec.icon} mr-1`}></i>
                            {rec.category.charAt(0).toUpperCase() + rec.category.slice(1)}
                          </span>
                          <span className="text-xs text-gray-500">
                            Impact: {rec.impact.includes('15') || rec.impact.includes('8') ? 'High' : rec.impact.includes('6') ? 'Medium-High' : rec.impact.includes('4') ? 'Medium' : 'Low'} 
                            • Effort: {rec.time.includes('30 min') ? 'Low' : rec.time.includes('1-2') ? 'Low' : rec.time.includes('2-4') ? 'Medium' : 'Medium'}
                          </span>
                        </div>
                        <h3 className="text-lg font-bold text-gray-900 mb-2">{rec.title}</h3>
                        <p className="text-gray-700 mb-4 leading-relaxed">{rec.description}</p>
                        
                        <div className={`${colors.bg} border-l-4 ${colors.border} rounded-lg p-4 mb-4`}>
                          <h4 className={`font-semibold text-gray-900 mb-2 flex items-center ${colors.icon}`}>
                            <i className={`fa-solid fa-tools mr-2`}></i>
                            How to Fix
                          </h4>
                          <ol className="space-y-2 text-sm text-gray-700">
                            {rec.steps.map((step, idx) => (
                              <li key={idx} className="flex items-start">
                                <span className="font-semibold mr-2">{idx + 1}.</span>
                                <span>{step}</span>
                              </li>
                            ))}
                          </ol>
                        </div>

                        <div className="flex items-center space-x-4">
                          <div className="flex items-center text-sm text-gray-600">
                            <i className="fa-solid fa-clock mr-2"></i>
                            Estimated time: {rec.time}
                          </div>
                          <div className="flex items-center text-sm text-gray-600">
                            <i className="fa-solid fa-chart-line mr-2"></i>
                            Expected improvement: {rec.impact}
                          </div>
                        </div>
                      </div>
                    </div>
                    <button className="text-gray-400 hover:text-gray-600 ml-4">
                      <i className="fa-solid fa-ellipsis-vertical text-xl"></i>
                    </button>
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                    <button className="px-4 py-2 text-primary hover:bg-blue-50 rounded-lg font-medium transition text-sm">
                      <i className="fa-solid fa-book mr-2"></i>
                      Learn More
                    </button>
                    <button 
                      onClick={() => handleMarkAddressed(rec.id)}
                      disabled={addressedIds.includes(rec.id)}
                      className={`px-4 py-2 rounded-lg font-medium transition text-sm flex items-center ${
                        addressedIds.includes(rec.id)
                          ? 'bg-green-100 text-green-700 cursor-default'
                          : 'bg-green-600 text-white hover:bg-green-700'
                      }`}
                    >
                      <i className={`fa-solid ${addressedIds.includes(rec.id) ? 'fa-check' : 'fa-check'} mr-2`}></i>
                      {addressedIds.includes(rec.id) ? 'Addressed ✓' : 'Mark as Addressed'}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
          
          {filteredRecommendations.length === 0 && (
            <div className="text-center py-12 bg-white rounded-xl border border-gray-200">
              <i className="fa-solid fa-circle-check text-green-500 text-4xl mb-4"></i>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">All caught up!</h3>
              <p className="text-gray-600">You've addressed all visible recommendations. Try adjusting your filters or launch a new analysis for more insights.</p>
            </div>
          )}
        </div>

        {/* Pagination (static for now, can be enhanced with backend pagination) */}
        {filteredRecommendations.length > 6 && (
          <div className="mt-8 flex items-center justify-center">
            <div className="flex items-center space-x-2">
              <button className="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium transition">
                <i className="fa-solid fa-chevron-left mr-2"></i>Previous
              </button>
              <button className="px-4 py-2 bg-primary text-white rounded-lg font-medium">1</button>
              <button className="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium transition">2</button>
              <span className="px-2 text-gray-500">...</span>
              <button className="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium transition">Next<i className="fa-solid fa-chevron-right ml-2"></i></button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Recommendations;