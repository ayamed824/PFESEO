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
  Shield,
  SlidersHorizontal,
  ChevronLeft,
  ChevronRight,
  Globe,
  Sparkles,
  Tag
} from 'lucide-react';
import { api } from '../../services/api';

const Sidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [currentUrl, setCurrentUrl] = useState('');
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

useEffect(() => {
  fetchCurrentUrl();
  checkAdminStatus();
  
  // Relire is_admin à chaque changement de route
  const handleRouteChange = () => checkAdminStatus();
  window.addEventListener('popstate', handleRouteChange);
  
  return () => window.removeEventListener('popstate', handleRouteChange);
}, [location.pathname]);  // ← Dépend de la route actuelle

const checkAdminStatus = () => {
  const adminStatus = localStorage.getItem("role") === "admin";
  setIsAdmin(adminStatus);
};

  const fetchCurrentUrl = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setLoading(false);
        return;
      }
      const data = await api.getMyAnalyses();
      if (data.analyses && data.analyses.length > 0) {
        const url = new URL(data.analyses[0].url);
        setCurrentUrl(url.hostname);
      }
    } catch (error) {
      setCurrentUrl('www.example.com');
    } finally {
      setLoading(false);
    }
  };

  // 📌 MENU pour utilisateurs normaux
  const userMenuItems = [
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

  // 📌 MENU pour admins (UNIQUEMENT les pages admin)
  const adminMenuItems = [
    { path: '/AdminActivity', icon: Shield, label: 'Admin Activity' },
    { path: '/AdminConfiguration', icon: SlidersHorizontal, label: 'Admin Configuration' },
    { path: '/admin-pricing', icon: Tag, label: 'Pricing Management' },
  ];

  // Choisir le menu selon le rôle
  const menuItems = isAdmin ? adminMenuItems : userMenuItems;

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

        {/* 🔍 URL Section (cachée pour les admins) */}
        {!isCollapsed && !isAdmin && (
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
          {menuItems.map((item) => {
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
              >
                <Icon className="w-5 h-5" />
                {!isCollapsed && (
                  <span className="ml-3 text-sm">{item.label}</span>
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
          from { opacity: 0; transform: translateX(-10px); }
          to { opacity: 1; transform: translateX(0); }
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
      `}</style>
    </aside>
  );
};

export default Sidebar;