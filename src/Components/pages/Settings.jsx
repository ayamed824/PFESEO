import React, { useState } from 'react';

const Settings = () => {
  const [activeTab, setActiveTab] = useState('analysis');
  const [analysisPrefs, setAnalysisPrefs] = useState({
    technical: true,
    content: true,
    ux: true,
    popularity: false,
    aiAgents: true
  });
  const [notifications, setNotifications] = useState({
    analysisComplete: true,
    criticalIssues: true,
    weeklySummary: false,
    productUpdates: true
  });

  const toggleAnalysis = (key) => {
    setAnalysisPrefs(prev => ({...prev, [key]: !prev[key]}));
  };

  const toggleNotification = (key) => {
    setNotifications(prev => ({...prev, [key]: !prev[key]}));
  };

  const ToggleSwitch = ({ checked, onChange }) => (
    <label className="relative inline-flex items-center cursor-pointer">
      <input type="checkbox" checked={checked} onChange={onChange} className="sr-only peer" />
      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
    </label>
  );

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
        <p className="text-gray-600 mt-1">Manage your analysis preferences, notifications, and account settings</p>
      </div>

      <div className="flex gap-8">
        {/* Settings Sidebar */}
        <div className="w-64 flex-shrink-0">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sticky top-24">
            <div className="space-y-1">
              <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">General</div>
              <button 
                onClick={() => setActiveTab('analysis')}
                className={`w-full flex items-center px-3 py-2 rounded-lg font-medium ${activeTab === 'analysis' ? 'bg-blue-50 text-primary' : 'text-gray-700 hover:bg-gray-50'}`}
              >
                <i className="fa-solid fa-sliders mr-3 text-sm"></i>
                Analysis Preferences
              </button>
              <button 
                onClick={() => setActiveTab('notifications')}
                className={`w-full flex items-center px-3 py-2 rounded-lg font-medium ${activeTab === 'notifications' ? 'bg-blue-50 text-primary' : 'text-gray-700 hover:bg-gray-50'}`}
              >
                <i className="fa-solid fa-bell mr-3 text-sm"></i>
                Notifications
              </button>
              <button 
                onClick={() => setActiveTab('export')}
                className={`w-full flex items-center px-3 py-2 rounded-lg font-medium ${activeTab === 'export' ? 'bg-blue-50 text-primary' : 'text-gray-700 hover:bg-gray-50'}`}
              >
                <i className="fa-solid fa-download mr-3 text-sm"></i>
                Export Options
              </button>
              
              <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider mt-6 mb-3">Account</div>
              <button 
                onClick={() => setActiveTab('account')}
                className={`w-full flex items-center px-3 py-2 rounded-lg font-medium ${activeTab === 'account' ? 'bg-blue-50 text-primary' : 'text-gray-700 hover:bg-gray-50'}`}
              >
                <i className="fa-solid fa-user mr-3 text-sm"></i>
                Account Details
              </button>
              <button 
                onClick={() => setActiveTab('workspace')}
                className={`w-full flex items-center px-3 py-2 rounded-lg font-medium ${activeTab === 'workspace' ? 'bg-blue-50 text-primary' : 'text-gray-700 hover:bg-gray-50'}`}
              >
                <i className="fa-solid fa-briefcase mr-3 text-sm"></i>
                Workspace
              </button>
              
              <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider mt-6 mb-3">Advanced</div>
              <button 
                onClick={() => setActiveTab('integrations')}
                className={`w-full flex items-center px-3 py-2 rounded-lg font-medium ${activeTab === 'integrations' ? 'bg-blue-50 text-primary' : 'text-gray-700 hover:bg-gray-50'}`}
              >
                <i className="fa-solid fa-plug mr-3 text-sm"></i>
                Integrations
              </button>
            </div>
          </div>
        </div>

        {/* Settings Content */}
        <div className="flex-1">
          
          {/* Analysis Preferences */}
          {activeTab === 'analysis' && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 mb-6">
              <div className="mb-6">
                <h2 className="text-xl font-bold text-gray-900 mb-1">Analysis Preferences</h2>
                <p className="text-sm text-gray-600">Customize what aspects of your website to analyze</p>
              </div>

              <div className="space-y-5">
                {[
                  { key: 'technical', icon: 'fa-wrench', color: 'text-primary', title: 'Technical SEO Analysis', desc: 'Scan for technical issues, performance, and Core Web Vitals' },
                  { key: 'content', icon: 'fa-file-lines', color: 'text-secondary', title: 'Content Analysis', desc: 'Evaluate keyword optimization, readability, and content quality' },
                  { key: 'ux', icon: 'fa-paintbrush', color: 'text-purple-600', title: 'UX / UI Analysis', desc: 'Check navigation clarity, mobile usability, and accessibility' },
                  { key: 'popularity', icon: 'fa-star', color: 'text-orange-600', title: 'Popularity / Off-Page SEO', desc: 'Analyze domain authority, backlinks, and social presence' },
                  { key: 'aiAgents', icon: 'fa-robot', color: 'text-indigo-600', title: 'AI Agent Insights', desc: 'Enable intelligent agents to provide recommendations' },
                ].map((item) => (
                  <div key={item.key} className="flex items-start justify-between pb-5 border-b border-gray-200 last:border-0 last:pb-0">
                    <div className="flex-1">
                      <div className="flex items-center mb-1">
                        <i className={`fa-solid ${item.icon} ${item.color} mr-2`}></i>
                        <h3 className="font-semibold text-gray-900">{item.title}</h3>
                      </div>
                      <p className="text-sm text-gray-600">{item.desc}</p>
                    </div>
                    <ToggleSwitch 
                      checked={analysisPrefs[item.key]} 
                      onChange={() => toggleAnalysis(item.key)} 
                    />
                  </div>
                ))}
              </div>

              <div className="mt-6 pt-6 border-t border-gray-200">
                <button className="px-6 py-2.5 bg-primary text-white rounded-lg hover:bg-blue-700 font-medium transition shadow-sm">
                  Save Preferences
                </button>
              </div>
            </div>
          )}

          {/* Notifications */}
          {activeTab === 'notifications' && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 mb-6">
              <div className="mb-6">
                <h2 className="text-xl font-bold text-gray-900 mb-1">Notification Settings</h2>
                <p className="text-sm text-gray-600">Control how and when you receive updates</p>
              </div>

              <div className="space-y-5">
                {[
                  { key: 'analysisComplete', title: 'Analysis Complete', desc: 'Get notified when your SEO analysis is complete' },
                  { key: 'criticalIssues', title: 'Critical Issues Detected', desc: 'Alert me when critical SEO issues are found' },
                  { key: 'weeklySummary', title: 'Weekly Summary Reports', desc: 'Receive weekly email summaries of your SEO progress' },
                  { key: 'productUpdates', title: 'Product Updates & Tips', desc: 'Stay updated with new features and SEO best practices' },
                ].map((item) => (
                  <div key={item.key} className="flex items-start justify-between pb-5 border-b border-gray-200 last:border-0 last:pb-0">
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 mb-1">{item.title}</h3>
                      <p className="text-sm text-gray-600">{item.desc}</p>
                    </div>
                    <ToggleSwitch 
                      checked={notifications[item.key]} 
                      onChange={() => toggleNotification(item.key)} 
                    />
                  </div>
                ))}
              </div>

              <div className="mt-6 pt-6 border-t border-gray-200">
                <button className="px-6 py-2.5 bg-primary text-white rounded-lg hover:bg-blue-700 font-medium transition shadow-sm">
                  Save Notification Settings
                </button>
              </div>
            </div>
          )}

          {/* Export Options */}
          {activeTab === 'export' && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 mb-6">
              <div className="mb-6">
                <h2 className="text-xl font-bold text-gray-900 mb-1">Export Options</h2>
                <p className="text-sm text-gray-600">Configure default export format and preferences</p>
              </div>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-3">Default Export Format</label>
                  <div className="grid grid-cols-3 gap-4">
                    {[
                      { format: 'PDF', icon: 'fa-file-pdf', color: 'text-primary', selected: true },
                      { format: 'CSV', icon: 'fa-file-csv', color: 'text-gray-600', selected: false },
                      { format: 'JSON', icon: 'fa-file-code', color: 'text-gray-600', selected: false },
                    ].map((fmt) => (
                      <label key={fmt.format} className={`relative flex items-center justify-center p-4 border-2 ${fmt.selected ? 'border-primary bg-blue-50' : 'border-gray-200 hover:border-gray-300'} rounded-lg cursor-pointer`}>
                        <input type="radio" name="export-format" defaultChecked={fmt.selected} className="sr-only" />
                        <div className="text-center">
                          <i className={`fa-solid ${fmt.icon} text-2xl ${fmt.color} mb-2`}></i>
                          <div className="font-semibold text-gray-900">{fmt.format}</div>
                        </div>
                        {fmt.selected && (
                          <div className="absolute top-2 right-2 w-5 h-5 bg-primary rounded-full flex items-center justify-center">
                            <i className="fa-solid fa-check text-white text-xs"></i>
                          </div>
                        )}
                      </label>
                    ))}
                  </div>
                </div>

                <div className="pt-5 border-t border-gray-200 space-y-4">
                  {[
                    'Include AI agent recommendations in exports',
                    'Include historical comparison data',
                    'Include detailed technical metrics'
                  ].map((label, idx) => (
                    <label key={idx} className="flex items-center">
                      <input type="checkbox" defaultChecked={idx < 2} className="w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary accent-primary cursor-pointer" />
                      <span className="ml-3 text-sm font-medium text-gray-900">{label}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="mt-6 pt-6 border-t border-gray-200">
                <button className="px-6 py-2.5 bg-primary text-white rounded-lg hover:bg-blue-700 font-medium transition shadow-sm">
                  Save Export Settings
                </button>
              </div>
            </div>
          )}

          {/* Account Details */}
          {activeTab === 'account' && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 mb-6">
              <div className="mb-6">
                <h2 className="text-xl font-bold text-gray-900 mb-1">Account Details</h2>
                <p className="text-sm text-gray-600">Manage your personal information</p>
              </div>

              <div className="space-y-5">
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">Full Name</label>
                  <input type="text" defaultValue="John Smith" className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">Email Address</label>
                  <input type="email" defaultValue="john.smith@example.com" className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">Company / Organization</label>
                  <input type="text" placeholder="Optional" className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary" />
                </div>
              </div>

              <div className="mt-6 pt-6 border-t border-gray-200 flex items-center justify-between">
                <button className="px-6 py-2.5 bg-primary text-white rounded-lg hover:bg-blue-700 font-medium transition shadow-sm">
                  Update Account
                </button>
                <button className="text-sm text-red-600 hover:text-red-700 font-medium">
                  Delete Account
                </button>
              </div>
            </div>
          )}

          {/* Workspace */}
          {activeTab === 'workspace' && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 mb-6">
              <div className="mb-6">
                <h2 className="text-xl font-bold text-gray-900 mb-1">Workspace Settings</h2>
                <p className="text-sm text-gray-600">Manage your workspace and monitored websites</p>
              </div>

              <div className="space-y-5">
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">Workspace Name</label>
                  <input type="text" defaultValue="My SEO Projects" className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary" />
                </div>

                <div className="pt-5 border-t border-gray-200">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold text-gray-900">Monitored Websites</h3>
                    <button className="text-sm text-primary font-medium hover:text-blue-700">
                      <i className="fa-solid fa-plus mr-1"></i>
                      Add Website
                    </button>
                  </div>

                  <div className="space-y-3">
                    {[
                      { url: 'www.example.com', lastAnalyzed: '7 days ago', active: true },
                      { url: 'www.demo-site.com', lastAnalyzed: '14 days ago', active: false },
                    ].map((site, idx) => (
                      <div key={idx} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200">
                        <div className="flex items-center">
                          <i className={`fa-solid fa-globe ${site.active ? 'text-primary' : 'text-gray-400'} mr-3`}></i>
                          <div>
                            <div className="font-semibold text-gray-900">{site.url}</div>
                            <div className="text-xs text-gray-500">Last analyzed {site.lastAnalyzed}</div>
                          </div>
                        </div>
                        <button className="text-sm text-red-600 hover:text-red-700 font-medium">
                          Remove
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-6 border-t border-gray-200">
                <button className="px-6 py-2.5 bg-primary text-white rounded-lg hover:bg-blue-700 font-medium transition shadow-sm">
                  Save Workspace Settings
                </button>
              </div>
            </div>
          )}

          {/* Integrations */}
          {activeTab === 'integrations' && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 mb-6">
              <div className="mb-6">
                <h2 className="text-xl font-bold text-gray-900 mb-1">Integrations</h2>
                <p className="text-sm text-gray-600">Connect with third-party tools and services (optional)</p>
              </div>

              <div className="space-y-5">
                {[
                  { icon: 'fa-google', color: 'bg-blue-100 text-blue-600', name: 'Google Search Console', desc: 'Import search performance data', connected: false },
                  { icon: 'fa-google', color: 'bg-orange-100 text-orange-600', name: 'Google Analytics', desc: 'Sync traffic and behavior data', connected: false },
                  { icon: 'fa-key', color: 'bg-gray-100 text-gray-700', name: 'API Access', desc: 'Generate API keys for custom integrations', connected: true, special: true },
                ].map((integration, idx) => (
                  <div key={idx} className={`p-5 border-2 ${integration.special ? 'border-green-200 bg-green-50' : 'border-gray-200'} rounded-lg`}>
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center">
                        <div className={`w-12 h-12 ${integration.color} rounded-lg flex items-center justify-center mr-4`}>
                          <i className={`${idx < 2 ? 'fa-brands' : 'fa-solid'} ${integration.icon} text-2xl`}></i>
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900">{integration.name}</h3>
                          <p className="text-sm text-gray-600">{integration.desc}</p>
                        </div>
                      </div>
                      <button className={`px-4 py-2 ${integration.special ? 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50' : 'text-primary border border-primary hover:bg-blue-50'} rounded-lg font-medium transition text-sm`}>
                        {integration.special ? 'Manage Keys' : 'Connect'}
                      </button>
                    </div>
                    {integration.special && (
                      <div className="text-xs text-green-700 font-medium">
                        <i className="fa-solid fa-circle-info mr-1"></i>
                        Advanced feature - Documentation available
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};

export default Settings;