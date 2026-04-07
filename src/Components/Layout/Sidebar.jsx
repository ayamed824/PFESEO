import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Wrench,
  FileText,
  Palette,
  Star,
  Bot,
  Lightbulb,
  History,
  Settings,
  ChevronLeft,
  ChevronRight,
  Globe,
  Sparkles
} from 'lucide-react';

const Sidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [currentUrl, setCurrentUrl] = useState('');
  const [loading, setLoading] = useState(true);

  // 📡 Fetch current analysis URL from API
  useEffect(() => {
    fetchCurrentUrl();
  }, []);

  const fetchCurrentUrl = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:8000/api/analysis/', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        if (data.analyses && data.analyses.length > 0) {
          // Extract domain from URL
          const url = new URL(data.analyses[0].url);
          setCurrentUrl(url.hostname);
        }
      }
    } catch (error) {
      console.error('Failed to fetch current URL:', error);
      setCurrentUrl('www.example.com');
    } finally {
      setLoading(false);
    }
  };

  const menuItems = [
    { path: '/dashboard', icon: LayoutDashboard, label: 'Main Dashboard' },
    { path: '/technical-seo', icon: Wrench, label: 'Technical SEO' },
    { path: '/content-analysis', icon: FileText, label: 'Content Analysis' },
    { path: '/ux-analysis', icon: Palette, label: 'UX / UI Analysis' },
    { path: '/popularity-seo', icon: Star, label: 'Popularity SEO' },
    { path: '/intelligent-agents', icon: Bot, label: 'AI Agents' },
    { path: '/recommendations', icon: Lightbulb, label: 'Recommendations' },
    { path: '/report-history', icon: History, label: 'Report History' },
    { path: '/settings', icon: Settings, label: 'Settings' },
  ];

  return (
    <aside 
      className={`fixed left-0 top-16 bottom-0 bg-white border-r border-gray-200 overflow-y-auto transition-all duration-300 ease-in-out ${
        isCollapsed ? 'w-20' : 'w-64'
      }`}
    >
      <div className="p-4">
        {/* 🎯 Collapse Toggle Button */}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="absolute top-4 right-2 p-2 rounded-lg hover:bg-gray-100 transition-colors duration-200 group"
          aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {isCollapsed ? (
            <ChevronRight className="w-5 h-5 text-gray-600 group-hover:text-primary transition-colors" />
          ) : (
            <ChevronLeft className="w-5 h-5 text-gray-600 group-hover:text-primary transition-colors" />
          )}
        </button>

        {/* 🔍 URL Section with Animation */}
        {!isCollapsed && (
          <div className="mb-8 animate-fadeIn">
            <div className="flex items-center space-x-3 mb-4 p-3 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-100">
              <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center shadow-sm">
                <Globe className="w-5 h-5 text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs text-gray-500 font-medium mb-0.5">Analyzing</p>
                {loading ? (
                  <div className="h-4 bg-gray-200 rounded animate-pulse w-24"></div>
                ) : (
                  <p className="text-sm font-semibold text-gray-900 truncate" title={currentUrl}>
                    {currentUrl}
                  </p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* 📌 MENU */}
        <nav className="space-y-1">
          {menuItems.map((item, index) => {
            const isActive = location.pathname === item.path;
            const Icon = item.icon;

            return (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                className={`
                  flex items-center w-full rounded-xl transition-all duration-200 group relative
                  ${isCollapsed ? 'justify-center px-2 py-3' : 'px-4 py-3'}
                  ${isActive 
                    ? 'bg-gradient-to-r from-blue-50 to-indigo-50 text-primary font-semibold shadow-sm border border-blue-100' 
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'}
                `}
                style={{
                  animation: `slideIn 0.3s ease-out ${index * 0.05}s both`
                }}
              >
                {/* Icon with animation */}
                <div className={`
                  relative transition-transform duration-200
                  ${isActive ? 'scale-110' : 'group-hover:scale-110'}
                `}>
                  <Icon className={`w-5 h-5 ${isActive ? 'text-primary' : ''}`} />
                  {isActive && (
                    <span className="absolute -right-1 -top-1 w-2 h-2 bg-primary rounded-full animate-ping"></span>
                  )}
                </div>

                {/* Label with tooltip when collapsed */}
                {!isCollapsed ? (
                  <span className="ml-3 whitespace-nowrap overflow-hidden text-sm">
                    {item.label}
                  </span>
                ) : (
                  <div className="absolute left-full ml-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap z-50 pointer-events-none">
                    {item.label}
                    <div className="absolute left-0 top-1/2 transform -translate-x-1 -translate-y-1/2 border-4 border-transparent border-r-gray-900"></div>
                  </div>
                )}

                {/* Active indicator */}
                {isActive && !isCollapsed && (
                  <div className="ml-auto w-1.5 h-1.5 bg-primary rounded-full animate-pulse"></div>
                )}
              </button>
            );
          })}
        </nav>

        {/* 🎨 Decorative Footer */}
        {!isCollapsed && (
          <div className="mt-8 pt-6 border-t border-gray-200 animate-fadeIn">
            <div className="flex items-center space-x-2 text-xs text-gray-400 px-2">
              <Sparkles className="w-4 h-4" />
              <span>SEO Insights Pro v1.0</span>
            </div>
          </div>
        )}
      </div>

      {/* CSS Animations */}
      <style>{`
        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateX(-10px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
        
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
      `}</style>
    </aside>
  );
};

export default Sidebar;