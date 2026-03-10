import React from 'react';

const IntelligentAgents = () => {
  const agents = [
    {
      id: 'technical',
      name: 'Technical SEO Agent',
      role: 'Performance & Infrastructure Specialist',
      icon: 'fa-wrench',
      color: 'blue',
      status: 'Active',
      insights: 34,
      critical: 8,
      lastAnalysis: '2 hours ago',
      latestInsight: 'Your Core Web Vitals have improved by 18% this week. LCP is now 2.1s (target: <2.5s). However, I detected 3 render-blocking resources that could be optimized further.'
    },
    {
      id: 'content',
      name: 'Content Agent',
      role: 'Content Quality & Optimization Expert',
      icon: 'fa-file-lines',
      color: 'green',
      status: 'Active',
      insights: 28,
      critical: 5,
      lastAnalysis: '4 hours ago',
      latestInsight: 'Your blog posts average 1,847 words, which is excellent. However, I noticed keyword density is too high (4.2%) on 5 pages. Recommend reducing to 1-2% for more natural content.'
    },
    {
      id: 'ux',
      name: 'UX/UI Agent',
      role: 'User Experience & Accessibility Analyst',
      icon: 'fa-paintbrush',
      color: 'purple',
      status: 'Active',
      insights: 22,
      critical: 12,
      lastAnalysis: '6 hours ago',
      latestInsight: 'Mobile usability score is 87/100—good progress! Main concern: 12 buttons have tap targets smaller than 48x48px. This affects mobile user experience and could impact rankings.'
    },
    {
      id: 'popularity',
      name: 'Popularity Agent',
      role: 'Backlinks & Authority Strategist',
      icon: 'fa-star',
      color: 'orange',
      status: 'Active',
      insights: 26,
      critical: 14,
      lastAnalysis: '1 hour ago',
      latestInsight: 'Great news! You gained 24 new backlinks this month, with 8 from high-authority domains (DA 60+). However, I identified 14 toxic links that should be disavowed to protect your domain authority.'
    }
  ];

  const activities = [
    { agent: 'Technical SEO Agent', icon: 'fa-wrench', color: 'blue', time: '2 hours ago', description: 'Completed performance audit. Identified 3 render-blocking resources affecting Core Web Vitals.', tags: [{text: '8 Issues Found', color: 'orange'}, {text: 'Action Required', color: 'blue'}] },
    { agent: 'Popularity Agent', icon: 'fa-star', color: 'orange', time: '1 hour ago', description: 'Detected 24 new backlinks from 8 referring domains. 14 toxic links flagged for disavowal.', tags: [{text: '+24 Backlinks', color: 'green'}, {text: '14 Toxic Links', color: 'red'}] },
    { agent: 'Content Agent', icon: 'fa-file-lines', color: 'green', time: '4 hours ago', description: 'Analyzed keyword density across 23 pages. 5 pages exceed recommended 2% threshold.', tags: [{text: '5 Pages Need Optimization', color: 'yellow'}] },
    { agent: 'UX/UI Agent', icon: 'fa-paintbrush', color: 'purple', time: '6 hours ago', description: 'Mobile usability assessment completed. 12 buttons have tap targets below 48x48px minimum.', tags: [{text: '12 UX Issues', color: 'blue'}, {text: '87/100 Score', color: 'green'}] },
    { agent: 'Recommendation Agent', icon: 'fa-lightbulb', color: 'indigo', time: '30 minutes ago', description: 'Synthesized insights from all agents. Generated 17 prioritized recommendations for next 30 days.', tags: [{text: '17 Recommendations', color: 'indigo'}, {text: '3 High Priority', color: 'red'}] },
  ];

  return (
    <div>
      <div className="mb-8">
        <div className="flex items-center justify-between mb-2">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Intelligent Agents Panel</h1>
            <p className="text-gray-600 mt-1">AI-powered agents providing expert insights across all SEO categories</p>
          </div>
          <div className="flex items-center space-x-3">
            <button className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 font-medium transition">
              <i className="fa-solid fa-filter mr-2"></i>
              Filter Agents
            </button>
            <button className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-blue-700 font-medium transition">
              <i className="fa-solid fa-message mr-2"></i>
              Ask All Agents
            </button>
          </div>
        </div>
      </div>

      {/* Agents Overview */}
      <div className="mb-8">
        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl border border-blue-200 p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-14 h-14 bg-primary rounded-xl flex items-center justify-center">
                <i className="fa-solid fa-brain text-white text-2xl"></i>
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900">5 AI Agents Active</h2>
                <p className="text-sm text-gray-700">Continuously analyzing your website across all SEO dimensions</p>
              </div>
            </div>
            <div className="flex items-center space-x-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900">127</div>
                <div className="text-xs text-gray-600">Total Insights</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900">42</div>
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
        {agents.map((agent) => (
          <div key={agent.id} className="bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-lg transition-all">
            <div className="p-6 border-b border-gray-100">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className={`w-12 h-12 bg-${agent.color}-50 rounded-xl flex items-center justify-center`}>
                    <i className={`fa-solid ${agent.icon} text-${agent.color === 'blue' ? 'primary' : agent.color === 'green' ? 'secondary' : agent.color === 'purple' ? 'purple-600' : 'orange-600'} text-xl`}></i>
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-gray-900">{agent.name}</h3>
                    <p className="text-sm text-gray-500">{agent.role}</p>
                  </div>
                </div>
                <span className="px-2 py-1 bg-green-100 text-green-700 text-xs font-semibold rounded-full">{agent.status}</span>
              </div>
              
              <div className={`bg-${agent.color}-50 border-l-4 border-${agent.color === 'blue' ? 'primary' : agent.color === 'green' ? 'secondary' : agent.color === 'purple' ? 'purple-600' : 'orange-600'} rounded-lg p-4 mb-4`}>
                <div className="flex items-start space-x-3">
                  <i className={`fa-solid fa-lightbulb text-${agent.color === 'blue' ? 'primary' : agent.color === 'green' ? 'secondary' : agent.color === 'purple' ? 'purple-600' : 'orange-600'} mt-1`}></i>
                  <div>
                    <p className="text-sm font-semibold text-gray-900 mb-1">Latest Insight</p>
                    <p className="text-sm text-gray-700 leading-relaxed">{agent.latestInsight}</p>
                  </div>
                </div>
              </div>

              <div className="space-y-2 mb-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Insights Generated</span>
                  <span className="font-semibold text-gray-900">{agent.insights}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Critical Issues</span>
                  <span className="font-semibold text-orange-600">{agent.critical}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Last Analysis</span>
                  <span className="font-semibold text-gray-900">{agent.lastAnalysis}</span>
                </div>
              </div>
            </div>
            
            <div className="p-6 bg-gray-50">
              <button className="w-full px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 font-medium transition">
                <i className="fa-solid fa-comments mr-2"></i>
                View Full Analysis
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Recommendation Agent */}
      <div className="mb-8">
        <div className="bg-gradient-to-br from-indigo-600 to-purple-700 rounded-xl shadow-lg overflow-hidden">
          <div className="p-8">
            <div className="flex items-start justify-between mb-6">
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                  <i className="fa-solid fa-lightbulb text-white text-3xl"></i>
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-white mb-1">Recommendation Agent</h3>
                  <p className="text-indigo-100">Strategic Advisor & Priority Optimizer</p>
                </div>
              </div>
              <span className="px-3 py-1 bg-white/20 backdrop-blur-sm text-white text-sm font-semibold rounded-full">Master Agent</span>
            </div>

            <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg p-5 mb-6">
              <div className="flex items-start space-x-3">
                <i className="fa-solid fa-brain text-white text-xl mt-1"></i>
                <div>
                  <p className="text-sm font-semibold text-white mb-2">Synthesized Insight from All Agents</p>
                  <p className="text-sm text-indigo-100 leading-relaxed mb-4">
                    Based on comprehensive analysis from all specialized agents, I've identified your top 3 priorities for maximum SEO impact over the next 30 days.
                  </p>
                  <div className="space-y-3">
                    {[
                      { priority: 'PRIORITY 1', color: 'bg-red-500', title: 'Fix Core Web Vitals Issues', impact: 'Impact: High', desc: 'Technical SEO Agent detected 3 render-blocking resources affecting LCP. Fixing these will improve page speed by ~25%.' },
                      { priority: 'PRIORITY 2', color: 'bg-orange-500', title: 'Disavow 14 Toxic Backlinks', impact: 'Impact: Medium-High', desc: 'Popularity Agent identified low-quality links that risk penalizing your domain authority.' },
                      { priority: 'PRIORITY 3', color: 'bg-yellow-500', title: 'Optimize Mobile Tap Targets', impact: 'Impact: Medium', desc: 'UX/UI Agent found 12 buttons below 48x48px minimum. Quick CSS fix will improve mobile usability.' },
                    ].map((item, idx) => (
                      <div key={idx} className="bg-white/10 rounded-lg p-4 border border-white/20">
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex items-center space-x-2">
                            <span className={`px-2 py-1 ${item.color} text-white text-xs font-bold rounded`}>{item.priority}</span>
                            <span className="text-white font-semibold">{item.title}</span>
                          </div>
                          <span className="text-xs text-indigo-200">{item.impact}</span>
                        </div>
                        <p className="text-sm text-indigo-100 leading-relaxed">{item.desc}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4 mb-6">
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 text-center border border-white/20">
                <div className="text-3xl font-bold text-white mb-1">17</div>
                <div className="text-sm text-indigo-100">Total Recommendations</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 text-center border border-white/20">
                <div className="text-3xl font-bold text-white mb-1">3</div>
                <div className="text-sm text-indigo-100">High Priority</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 text-center border border-white/20">
                <div className="text-3xl font-bold text-white mb-1">30d</div>
                <div className="text-sm text-indigo-100">Estimated Timeline</div>
              </div>
            </div>

            <button className="w-full px-6 py-3 bg-white text-indigo-700 rounded-lg hover:bg-indigo-50 font-semibold transition shadow-lg">
              <i className="fa-solid fa-list-check mr-2"></i>
              View Full Recommendations Report
            </button>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Recent Agent Activity</h2>
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="space-y-4">
            {activities.map((activity, idx) => (
              <div key={idx} className={`flex items-start space-x-4 pb-4 ${idx !== activities.length - 1 ? 'border-b border-gray-100' : ''}`}>
                <div className={`w-10 h-10 bg-${activity.color}-50 rounded-lg flex items-center justify-center flex-shrink-0`}>
                  <i className={`fa-solid ${activity.icon} text-${activity.color === 'blue' ? 'primary' : activity.color === 'orange' ? 'orange-600' : activity.color === 'green' ? 'secondary' : activity.color === 'purple' ? 'purple-600' : 'indigo-600'}`}></i>
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <p className="font-semibold text-gray-900">{activity.agent}</p>
                    <span className="text-xs text-gray-500">{activity.time}</span>
                  </div>
                  <p className="text-sm text-gray-700">{activity.description}</p>
                  <div className="mt-2 flex items-center space-x-2">
                    {activity.tags.map((tag, tidx) => (
                      <span key={tidx} className={`px-2 py-1 bg-${tag.color}-100 text-${tag.color}-700 text-xs font-medium rounded`}>{tag.text}</span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
          <button className="w-full mt-6 text-sm text-primary font-medium hover:underline">
            View Complete Activity Log →
          </button>
        </div>
      </div>

      {/* Educational Section */}
      <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl border border-blue-200 p-8">
        <div className="flex items-start space-x-4 mb-6">
          <div className="w-16 h-16 bg-primary rounded-xl flex items-center justify-center flex-shrink-0">
            <i className="fa-solid fa-graduation-cap text-white text-2xl"></i>
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Understanding AI Agents in SEO</h2>
            <p className="text-gray-700">How intelligent agents work together to optimize your website</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-6 mb-6">
          <div className="bg-white rounded-lg p-5 border border-blue-200">
            <h3 className="font-semibold text-gray-900 mb-3 flex items-center">
              <i className="fa-solid fa-brain text-primary mr-2"></i>
              What Are AI Agents?
            </h3>
            <p className="text-sm text-gray-700 leading-relaxed mb-3">
              AI agents are specialized autonomous programs that continuously monitor, analyze, and provide insights about specific aspects of your website's SEO.
            </p>
            <p className="text-sm text-gray-700 leading-relaxed">
              Unlike traditional SEO tools that provide one-time reports, agents work 24/7, learning from patterns and adapting their analysis as your site evolves.
            </p>
          </div>

          <div className="bg-white rounded-lg p-5 border border-blue-200">
            <h3 className="font-semibold text-gray-900 mb-3 flex items-center">
              <i className="fa-solid fa-network-wired text-primary mr-2"></i>
              How Agents Collaborate
            </h3>
            <p className="text-sm text-gray-700 leading-relaxed mb-3">
              The five specialized agents share data and coordinate their findings through the Recommendation Agent, which acts as a master coordinator.
            </p>
            <p className="text-sm text-gray-700 leading-relaxed">
              The result is a holistic view of your SEO health with actionable, prioritized recommendations that consider dependencies and ROI.
            </p>
          </div>
        </div>

        <div className="bg-white rounded-lg p-5 border border-blue-200">
          <h3 className="font-semibold text-gray-900 mb-3 flex items-center">
            <i className="fa-solid fa-rocket text-primary mr-2"></i>
            Making the Most of Agent Insights
          </h3>
          <p className="text-sm text-gray-700 leading-relaxed mb-4">
            To maximize the value of your AI agents, review the Recommendation Agent's prioritized list weekly and implement high-priority items first.
          </p>
          <div className="flex items-center space-x-3">
            <button className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-blue-700 font-medium transition">
              <i className="fa-solid fa-play mr-2"></i>
              Watch Agent Demo Video
            </button>
            <button className="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium transition">
              <i className="fa-solid fa-book mr-2"></i>
              Read Full Documentation
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IntelligentAgents;