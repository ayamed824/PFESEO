import React, { useState, useEffect } from 'react';
import Header from "../Header";
import { getProfile, updateProfile, changePassword } from "../../services/userApi";
import { 
  User, Building2, Mail, Lock, Eye, EyeOff, Save, 
  AlertCircle, CheckCircle 
} from 'lucide-react';

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
  const [profile, setProfile] = useState({
    full_name: '',
    email: '',
    company: ''
  });
  const [passwordData, setPasswordData] = useState({
    current_password: '',
    new_password: '',
    confirm_password: ''
  });
  const [showPassword, setShowPassword] = useState({
    current: false,
    new: false,
    confirm: false
  });
  const [loadingProfile, setLoadingProfile] = useState(true);
  const [saving, setSaving] = useState(false);
  const [passwordSaving, setPasswordSaving] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [passwordMessage, setPasswordMessage] = useState({ type: '', text: '' });

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

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      const data = await getProfile();
      setProfile({
        full_name: data.full_name || '',
        email: data.email || '',
        company: data.company || ''
      });
    } catch (err) {
      setMessage({ type: 'error', text: 'Failed to load profile' });
    }
    setLoadingProfile(false);
  };

  const handleProfileChange = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  const handleSaveProfile = async () => {
    setSaving(true);
    setMessage({ type: '', text: '' });
    try {
      await updateProfile({
        full_name: profile.full_name,
        email: profile.email,
        company: profile.company
      });
      setMessage({ type: 'success', text: 'Profile updated successfully!' });
    } catch (err) {
      setMessage({ type: 'error', text: err.message || 'Failed to update profile' });
    }
    setSaving(false);
  };

  const handlePasswordChange = (e) => {
    setPasswordData({ ...passwordData, [e.target.name]: e.target.value });
  };

  const handleSavePassword = async (e) => {
    e.preventDefault();
    setPasswordMessage({ type: '', text: '' });

    if (passwordData.new_password !== passwordData.confirm_password) {
      setPasswordMessage({ type: 'error', text: 'New passwords do not match' });
      return;
    }
    if (passwordData.new_password.length < 8) {
      setPasswordMessage({ type: 'error', text: 'Password must be at least 8 characters' });
      return;
    }

    setPasswordSaving(true);
    try {
      await changePassword(passwordData.current_password, passwordData.new_password);
      setPasswordMessage({ type: 'success', text: 'Password changed successfully!' });
      setPasswordData({ current_password: '', new_password: '', confirm_password: '' });
    } catch (err) {
      setPasswordMessage({ type: 'error', text: err.message || 'Failed to change password' });
    }
    setPasswordSaving(false);
  };

  return (
    <div>
      <Header />
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
              
              {/* ✅ Analysis Preferences - KEPT */}
              <button 
                onClick={() => setActiveTab('analysis')}
                className={`w-full flex items-center px-3 py-2 rounded-lg font-medium ${activeTab === 'analysis' ? 'bg-blue-50 text-primary' : 'text-gray-700 hover:bg-gray-50'}`}
              >
                <i className="fa-solid fa-sliders mr-3 text-sm"></i>
                Analysis Preferences
              </button>
              
              {/* ❌ Export Options - REMOVED */}
              
              <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider mt-6 mb-3">Account</div>
              
              {/* ✅ Account Details - KEPT */}
              <button 
                onClick={() => setActiveTab('account')}
                className={`w-full flex items-center px-3 py-2 rounded-lg font-medium ${activeTab === 'account' ? 'bg-blue-50 text-primary' : 'text-gray-700 hover:bg-gray-50'}`}
              >
                <i className="fa-solid fa-user mr-3 text-sm"></i>
                Account Details
              </button>
              
              <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider mt-6 mb-3">Advanced</div>
              
              {/* ✅ Integrations - KEPT */}
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
          
          {/* ✅ Analysis Preferences - KEPT */}
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

          {/* ✅ Notifications - KEPT */}
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

          {/* ✅ Account Details - KEPT */}
          {activeTab === 'account' && (
            <div className="space-y-6">
              {/* Profile Info */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
                <div className="mb-6">
                  <h2 className="text-xl font-bold text-gray-900 mb-1">Account Details</h2>
                  <p className="text-sm text-gray-600">Manage your personal information</p>
                </div>

                {message.text && (
                  <div className={`mb-6 p-4 rounded-lg flex items-center gap-2 ${
                    message.type === 'success' ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'
                  }`}>
                    {message.type === 'success' ? <CheckCircle className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
                    {message.text}
                  </div>
                )}

                {loadingProfile ? (
                  <div className="flex justify-center py-8">
                    <div className="animate-spin w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full"></div>
                  </div>
                ) : (
                  <div className="space-y-5">
                    <div>
                      <label className="block text-sm font-semibold text-gray-900 mb-2">Full Name</label>
                      <div className="relative">
                        <User className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                        <input
                          type="text"
                          name="full_name"
                          value={profile.full_name}
                          onChange={handleProfileChange}
                          placeholder="Your full name"
                          className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-900 mb-2">Email Address</label>
                      <div className="relative">
                        <Mail className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                        <input
                          type="email"
                          name="email"
                          value={profile.email}
                          onChange={handleProfileChange}
                          placeholder="your@email.com"
                          className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-900 mb-2">Company / Organization</label>
                      <div className="relative">
                        <Building2 className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                        <input
                          type="text"
                          name="company"
                          value={profile.company}
                          onChange={handleProfileChange}
                          placeholder="Optional"
                          className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                    </div>

                    <div className="pt-4">
                      <button
                        onClick={handleSaveProfile}
                        disabled={saving}
                        className="px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium transition shadow-sm disabled:opacity-50 flex items-center gap-2"
                      >
                        {saving ? (
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        ) : (
                          <Save className="w-4 h-4" />
                        )}
                        {saving ? 'Saving...' : 'Update Account'}
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Change Password */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
                <div className="mb-6">
                  <h2 className="text-xl font-bold text-gray-900 mb-1">Change Password</h2>
                  <p className="text-sm text-gray-600">Update your password for security</p>
                </div>

                {passwordMessage.text && (
                  <div className={`mb-6 p-4 rounded-lg flex items-center gap-2 ${
                    passwordMessage.type === 'success' ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'
                  }`}>
                    {passwordMessage.type === 'success' ? <CheckCircle className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
                    {passwordMessage.text}
                  </div>
                )}

                <form onSubmit={handleSavePassword} className="space-y-5">
                  {/* Current Password */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-2">Current Password</label>
                    <div className="relative">
                      <Lock className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type={showPassword.current ? "text" : "password"}
                        name="current_password"
                        value={passwordData.current_password}
                        onChange={handlePasswordChange}
                        placeholder="Enter current password"
                        required
                        className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword({ ...showPassword, current: !showPassword.current })}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        {showPassword.current ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>
                  </div>

                  {/* New Password */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-2">New Password</label>
                    <div className="relative">
                      <Lock className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type={showPassword.new ? "text" : "password"}
                        name="new_password"
                        value={passwordData.new_password}
                        onChange={handlePasswordChange}
                        placeholder="Min. 8 characters"
                        required
                        minLength={8}
                        className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword({ ...showPassword, new: !showPassword.new })}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        {showPassword.new ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>
                  </div>

                  {/* Confirm New Password */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-2">Confirm New Password</label>
                    <div className="relative">
                      <Lock className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type={showPassword.confirm ? "text" : "password"}
                        name="confirm_password"
                        value={passwordData.confirm_password}
                        onChange={handlePasswordChange}
                        placeholder="Repeat new password"
                        required
                        className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword({ ...showPassword, confirm: !showPassword.confirm })}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        {showPassword.confirm ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>
                  </div>

                  <div className="pt-4">
                    <button
                      type="submit"
                      disabled={passwordSaving}
                      className="px-6 py-2.5 bg-gray-900 text-white rounded-lg hover:bg-gray-800 font-medium transition shadow-sm disabled:opacity-50 flex items-center gap-2"
                    >
                      {passwordSaving ? (
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      ) : (
                        <Lock className="w-4 h-4" />
                      )}
                      {passwordSaving ? 'Changing...' : 'Change Password'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* ✅ Integrations - KEPT */}
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