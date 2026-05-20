import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from "../../services/api";
import Header from "../Header";

const IntelligentAgents = () => {
  const navigate = useNavigate();
  const chatEndRef = useRef(null);
  
  // 📡 États pour les données dynamiques
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [agents, setAgents] = useState([]);
  const [latestAnalysis, setLatestAnalysis] = useState(null);
  
  // 💬 États pour le chat interactif
  const [selectedAgent, setSelectedAgent] = useState(null);
  const [chatMessages, setChatMessages] = useState([]);
  const [userMessage, setUserMessage] = useState("");
  const [chatLoading, setChatLoading] = useState(false);

  // 🔐 Vérifier l'authentification
  useEffect(() => {
    if (!localStorage.getItem("token")) {
      navigate("/login?returnTo=/intelligent-agents");
    }
  }, [navigate]);

  // 📡 Fetch data on mount
  useEffect(() => {
    fetchAgentsData();
    fetchLatestAnalysis();
  }, []);

  // 🔄 Scroll to bottom of chat when new message arrives
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatMessages]);

  const fetchAgentsData = async () => {
    try {
      // Fetch available agent types from backend
      const response = await fetch("http://localhost:8000/api/agents/types", {
        headers: { "Authorization": `Bearer ${localStorage.getItem("token")}` }
      });
      
      if (response.ok) {
        const data = await response.json();
        setAgents(data.agents || []);
      }
    } catch (err) {
      console.error("Failed to fetch agents:", err);
    }
  };

  const fetchLatestAnalysis = async () => {
    try {
      const data = await api.getMyAnalyses();
      if (data.analyses?.[0]) {
        setLatestAnalysis(data.analyses[0]);
      }
    } catch (err) {
      console.error("Failed to fetch analysis:", err);
    } finally {
      setLoading(false);
    }
  };

  // 💬 Send message to agent via OpenRouter
  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!userMessage.trim() || !selectedAgent || chatLoading) return;

    const message = userMessage.trim();
    setUserMessage("");
    setChatLoading(true);

    // Add user message to chat
    setChatMessages(prev => [...prev, { role: "user", content: message }]);

    try {
      // Call backend agent endpoint (which calls OpenRouter)
      const response = await api.chatWithAgent(
        selectedAgent.type,
        message,
        latestAnalysis ? { analysis: latestAnalysis } : {}
      );

      // Add AI response to chat
      setChatMessages(prev => [...prev, { 
        role: "assistant", 
        content: response.response,
        model: response.model_used 
      }]);

    } catch (err) {
      console.error("Chat error:", err);
      setChatMessages(prev => [...prev, { 
        role: "error", 
        content: `❌ Error: ${err.message || "Failed to get response"}` 
      }]);
    } finally {
      setChatLoading(false);
    }
  };

  // 🎨 Helper pour les couleurs des agents
  const getAgentColor = (type) => {
    const colors = {
      technical: { bg: 'bg-blue-50', border: 'border-blue-200', text: 'text-primary', icon: 'text-primary' },
      content: { bg: 'bg-green-50', border: 'border-green-200', text: 'text-secondary', icon: 'text-secondary' },
      ux: { bg: 'bg-purple-50', border: 'border-purple-200', text: 'text-purple-600', icon: 'text-purple-600' },
      popularity: { bg: 'bg-orange-50', border: 'border-orange-200', text: 'text-orange-600', icon: 'text-orange-600' },
      recommendation: { bg: 'bg-indigo-50', border: 'border-indigo-200', text: 'text-indigo-600', icon: 'text-indigo-600' },
    };
    return colors[type] || colors.technical;
  };

  // 🎨 Skeleton loading
  if (loading) {
    return (
      <div className="bg-gray-50 min-h-screen">
        <Header />
        <div className="p-8 animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/3 mb-8"></div>
          <div className="grid grid-cols-2 gap-6 mb-8">
            {[1,2,3,4].map(i => <div key={i} className="bg-white rounded-xl p-6 h-48"></div>)}
          </div>
          <div className="bg-white rounded-xl p-6 h-96"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      <Header />
      <div className="p-8">
        {/* Agents Overview */}
        <div className="mb-8">
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl border border-blue-200 p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="w-14 h-14 bg-primary rounded-xl flex items-center justify-center">
                  <i className="fa-solid fa-brain text-white text-2xl"></i>
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-900">{agents.length} AI Agents Active</h2>
                  <p className="text-sm text-gray-700">Continuously analyzing your website across all SEO dimensions</p>
                </div>
              </div>
              <div className="flex items-center space-x-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-900">{latestAnalysis?.recommendations?.length || 0}</div>
                  <div className="text-xs text-gray-600">Total Insights</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-900">{latestAnalysis?.issues?.length || 0}</div>
                  <div className="text-xs text-gray-600">Critical Alerts</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">Active</div>
                  <div className="text-xs text-gray-600">Status</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Agents Grid */}
        <div className="grid grid-cols-2 gap-6 mb-8">
          {agents.map((agent) => {
            const colors = getAgentColor(agent.type);
            const latestInsight = latestAnalysis?.recommendations?.find(r => r.agent === agent.type)?.text 
              || `No recent insights for ${agent.name}`;
            
            return (
              <div key={agent.type} className="bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-lg transition-all">
                <div className="p-6 border-b border-gray-100">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className={`w-12 h-12 ${colors.bg} rounded-xl flex items-center justify-center`}>
                        <i className={`fa-solid ${agent.icon} ${colors.icon} text-xl`}></i>
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-gray-900">{agent.name}</h3>
                        <p className="text-sm text-gray-500">{agent.description}</p>
                      </div>
                    </div>
                    <span className="px-2 py-1 bg-green-100 text-green-700 text-xs font-semibold rounded-full">Active</span>
                  </div>
                  
                  <div className={`${colors.bg} border-l-4 ${colors.border.replace('border', 'border-l')} rounded-lg p-4 mb-4`}>
                    <div className="flex items-start space-x-3">
                      <i className={`fa-solid fa-lightbulb ${colors.icon} mt-1`}></i>
                      <div>
                        <p className="text-sm font-semibold text-gray-900 mb-1">Latest Insight</p>
                        <p className="text-sm text-gray-700 leading-relaxed">{latestInsight}</p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2 mb-4">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Insights Generated</span>
                      <span className="font-semibold text-gray-900">{latestAnalysis?.recommendations?.filter(r => r.agent === agent.type).length || 0}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Critical Issues</span>
                      <span className="font-semibold text-orange-600">{latestAnalysis?.issues?.filter(i => i.category === agent.type).length || 0}</span>
                    </div>
                  </div>
                </div>
                
                <div className="p-6 bg-gray-50">
                  <button 
                    onClick={() => {
                      setSelectedAgent(agent);
                      setChatMessages([]);
                    }}
                    className="w-full px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 font-medium transition"
                  >
                    <i className="fa-solid fa-comments mr-2"></i>
                    Chat with {agent.name.split(' ')[0]}
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Interactive Chat Panel (appears when agent selected) */}
        {selectedAgent && (
          <div className="mb-8 bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            {/* Chat Header */}
            <div className={`p-4 border-b border-gray-200 flex items-center justify-between ${getAgentColor(selectedAgent.type).bg}`}>
              <div className="flex items-center space-x-3">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${getAgentColor(selectedAgent.type).bg}`}>
                  <i className={`fa-solid ${selectedAgent.icon} ${getAgentColor(selectedAgent.type).icon}`}></i>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">{selectedAgent.name}</h3>
                  <p className="text-xs text-gray-600">{selectedAgent.description}</p>
                </div>
              </div>
              <button 
                onClick={() => setSelectedAgent(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                <i className="fa-solid fa-xmark text-xl"></i>
              </button>
            </div>

            {/* Chat Messages */}
            <div className="h-80 overflow-y-auto p-4 space-y-4">
              {chatMessages.length === 0 && (
                <div className="text-center text-gray-500 py-8">
                  <i className="fa-solid fa-robot text-4xl mb-3"></i>
                  <p>Ask {selectedAgent.name.split(' ')[0]} anything about your SEO!</p>
                  <p className="text-xs mt-1">Example: "What's the most important issue to fix first?"</p>
                </div>
              )}
              
              {chatMessages.map((msg, idx) => (
                <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[80%] rounded-2xl p-4 ${
                    msg.role === 'user' 
                      ? 'bg-primary text-white rounded-br-none' 
                      : msg.role === 'error'
                        ? 'bg-red-50 text-red-700 border border-red-200'
                        : 'bg-gray-100 text-gray-900 rounded-bl-none'
                  }`}>
                    <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                    {msg.model && (
                      <p className="text-xs opacity-70 mt-2">🤖 {msg.model}</p>
                    )}
                  </div>
                </div>
              ))}
              
              {chatLoading && (
                <div className="flex justify-start">
                  <div className="bg-gray-100 rounded-2xl p-4 rounded-bl-none">
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    </div>
                  </div>
                </div>
              )}
              
              <div ref={chatEndRef} />
            </div>

            {/* Chat Input */}
            <form onSubmit={handleSendMessage} className="p-4 border-t border-gray-200">
              <div className="flex items-center space-x-3">
                <input
                  type="text"
                  value={userMessage}
                  onChange={(e) => setUserMessage(e.target.value)}
                  placeholder={`Ask ${selectedAgent.name.split(' ')[0]}...`}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary"
                  disabled={chatLoading}
                />
                <button
                  type="submit"
                  disabled={chatLoading || !userMessage.trim()}
                  className={`px-6 py-2 rounded-xl font-medium text-white transition ${
                    chatLoading || !userMessage.trim()
                      ? 'bg-primary/50 cursor-not-allowed'
                      : 'bg-primary hover:bg-blue-700'
                  }`}
                >
                  {chatLoading ? <i className="fa-solid fa-spinner fa-spin"></i> : <i className="fa-solid fa-paper-plane"></i>}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Recent Activity */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Recent Agent Activity</h2>
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            {latestAnalysis?.recommendations?.slice(0, 5).map((rec, idx) => {
              const agent = agents.find(a => a.type === rec.agent);
              const colors = agent ? getAgentColor(agent.type) : getAgentColor('technical');
              
              return (
                <div key={idx} className={`flex items-start space-x-4 pb-4 ${idx !== 4 ? 'border-b border-gray-100' : ''}`}>
                  <div className={`w-10 h-10 ${colors.bg} rounded-lg flex items-center justify-center flex-shrink-0`}>
                    <i className={`fa-solid ${agent?.icon || 'fa-robot'} ${colors.icon}`}></i>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <p className="font-semibold text-gray-900">{agent?.name || 'Unknown Agent'}</p>
                      <span className="text-xs text-gray-500">{new Date().toLocaleTimeString()}</span>
                    </div>
                    <p className="text-sm text-gray-700">{rec.text}</p>
                    <div className="mt-2 flex items-center space-x-2">
                      <span className={`px-2 py-1 ${colors.bg} ${colors.text} text-xs font-medium rounded`}>
                        {rec.priority || 'Insight'}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
            
            {(!latestAnalysis || latestAnalysis.recommendations?.length === 0) && (
              <p className="text-center text-gray-500 py-4">No recent activity. Launch an analysis to see agent insights!</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default IntelligentAgents;