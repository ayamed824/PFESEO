import React from 'react';
import { useLocation } from 'react-router-dom';

const Sidebar = () => {
  const location = useLocation();
  const currentUrl = 'www.example.com';

  const menuItems = [
    { path: '/dashboard', icon: 'fa-chart-pie', label: 'Main Dashboard' },
    { path: '/technical-seo', icon: 'fa-wrench', label: 'Technical SEO Analysis' },
    { path: '/content-analysis', icon: 'fa-file-lines', label: 'Content Analysis' },
    { path: '/ux-analysis', icon: 'fa-paintbrush', label: 'UX / UI Analysis' },
    { path: '/popularity-seo', icon: 'fa-star', label: 'Popularity / Off-Page SEO' },
    { path: '/intelligent-agents', icon: 'fa-robot', label: 'Intelligent Agents Panel' },
    { path: '/recommendations', icon: 'fa-lightbulb', label: 'Recommendations Engine' },
    { path: '/report-history', icon: 'fa-clock-rotate-left', label: 'Report History' },
    { path: '/settings', icon: 'fa-gear', label: 'Settings' },
  ];

  return (
    <aside id="sidebar" className="fixed left-0 top-16 bottom-0 w-64 bg-white border-r border-gray-200 overflow-y-auto">
      <div className="p-6">
        <div className="mb-8">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
              <i className="fa-solid fa-globe text-primary"></i>
            </div>
            <div>
              <p className="text-xs text-gray-500 font-medium">Analyzing</p>
              <p className="text-sm font-semibold text-gray-900">{currentUrl}</p>
            </div>
          </div>
        </div>

        <nav className="space-y-1">
          {menuItems.map((item) => (
            <button
              key={item.path}
              onClick={() => window.location.href = item.path}
              className="flex items-center px-4 py-3 w-full text-left"
            >
              <i className={`fa-solid ${item.icon} mr-3`}></i>
              {item.label}
            </button>
          ))}
        </nav>
      </div>
    </aside>
  );
};

export default Sidebar;