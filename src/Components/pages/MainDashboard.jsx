import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import Plotly from 'plotly.js-dist-min';
import Header from "../Header";

const MainDashboard = () => {
  const chartRef = useRef(null);

  useEffect(() => {
    if (!chartRef.current) return;

    const categoryData = [{
      type: 'bar',
      x: ['Technical SEO', 'Content Quality', 'Popularity', 'UX / UI'],
      y: [82, 65, 58, 75],
      marker: {
        color: ['#10b981', '#eab308', '#f97316', '#10b981']
      },
      text: ['82', '65', '58', '75'],
      textposition: 'outside',
      textfont: {
        size: 14,
        color: '#111827',
        family: 'Inter'
      }
    }];

    const categoryLayout = {
      title: { text: '', font: { size: 16 } },
      xaxis: {
        title: '',
        tickfont: { size: 12, color: '#6b7280' }
      },
      yaxis: {
        title: 'Score',
        range: [0, 100],
        tickfont: { size: 12, color: '#6b7280' }
      },
      margin: { t: 20, r: 20, b: 60, l: 60 },
      plot_bgcolor: '#ffffff',
      paper_bgcolor: '#ffffff',
      showlegend: false
    };

    const config = {
      responsive: true,
      displayModeBar: false,
      displaylogo: false
    };

    Plotly.newPlot(chartRef.current, categoryData, categoryLayout, config);

    return () => {
      if (chartRef.current) {
        Plotly.purge(chartRef.current);
      }
    };
  }, []);

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Ajout du Header en haut */}
      <Header />

    <div>
      <div className="mb-8">
        <div className="flex items-center justify-between mb-2">
          <h1 className="text-3xl font-bold text-gray-900">SEO Dashboard</h1>
          <div className="flex items-center space-x-3">
            <button className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 font-medium transition">
              <i className="fa-solid fa-download mr-2"></i>
              Export Report
            </button>
            <button className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-blue-700 font-medium transition">
              <i className="fa-solid fa-rotate mr-2"></i>
              Re-analyze
            </button>
          </div>
        </div>
        <p className="text-gray-600">Complete overview of your website's SEO performance and health</p>
      </div>

      <div className="grid grid-cols-3 gap-6 mb-8">
        <div className="col-span-1 bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-6 text-center">Global SEO Score</h2>
          <div className="flex items-center justify-center mb-6">
            <div className="relative w-48 h-48">
              <svg className="transform -rotate-90 w-48 h-48">
                <circle cx="96" cy="96" r="88" stroke="#e5e7eb" strokeWidth="12" fill="none"></circle>
                <circle cx="96" cy="96" r="88" stroke="#2563eb" strokeWidth="12" fill="none"
                  strokeDasharray="552.92" strokeDashoffset="165.88" strokeLinecap="round"></circle>
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-5xl font-bold text-gray-900">70</span>
                <span className="text-sm text-gray-500 font-medium">out of 100</span>
              </div>
            </div>
          </div>
          <div className="flex items-center justify-center space-x-2 mb-4">
            <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
            <span className="text-sm font-medium text-gray-700">Moderate Optimization</span>
          </div>
          <p className="text-center text-sm text-gray-600">Your site is moderately optimized. Priority improvements detected.</p>
        </div>

        <div className="col-span-2 bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-6">Category Scores</h2>
          <div className="space-y-5">
            {[
              { icon: 'fa-wrench', color: 'bg-blue-50', iconColor: 'text-primary', label: 'Technical SEO', score: 82, barColor: 'bg-secondary' },
              { icon: 'fa-file-lines', color: 'bg-purple-50', iconColor: 'text-purple-600', label: 'Content Quality', score: 65, barColor: 'bg-yellow-400' },
              { icon: 'fa-star', color: 'bg-orange-50', iconColor: 'text-orange-500', label: 'Popularity', score: 58, barColor: 'bg-orange-500' },
              { icon: 'fa-paintbrush', color: 'bg-green-50', iconColor: 'text-secondary', label: 'UX / UI', score: 75, barColor: 'bg-secondary' },
            ].map((item, idx) => (
              <div key={idx}>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-3">
                    <div className={`w-10 h-10 ${item.color} rounded-lg flex items-center justify-center`}>
                      <i className={`fa-solid ${item.icon} ${item.iconColor}`}></i>
                    </div>
                    <span className="font-medium text-gray-900">{item.label}</span>
                  </div>
                  <span className="text-2xl font-bold text-gray-900">{item.score}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div className={`${item.barColor} h-2.5 rounded-full`} style={{ width: `${item.score}%` }}></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-6 mb-8">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Category Performance</h2>
          <div ref={chartRef} style={{ height: '350px' }}></div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">SEO Health Indicator</h2>
          <div className="flex flex-col items-center justify-center h-80">
            <div className="relative w-64 h-32 mb-6">
              <svg viewBox="0 0 200 100" className="w-full">
                <path d="M 10 90 A 90 90 0 0 1 190 90" fill="none" stroke="#e5e7eb" strokeWidth="20" strokeLinecap="round"></path>
                <path d="M 10 90 A 90 90 0 0 1 190 90" fill="none" stroke="url(#gradient)" strokeWidth="20" strokeLinecap="round"
                  strokeDasharray="282.74" strokeDashoffset="84.82"></path>
                <defs>
                  <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" style={{ stopColor: '#ef4444', stopOpacity: 1 }} />
                    <stop offset="50%" style={{ stopColor: '#eab308', stopOpacity: 1 }} />
                    <stop offset="100%" style={{ stopColor: '#10b981', stopOpacity: 1 }} />
                  </linearGradient>
                </defs>
              </svg>
              <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 text-center">
                <div className="text-4xl font-bold text-gray-900 mb-1">70%</div>
                <div className="text-sm text-gray-600 font-medium">Health Score</div>
              </div>
            </div>
            <div className="flex items-center space-x-6">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                <span className="text-sm text-gray-600">Poor (0-50)</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
                <span className="text-sm text-gray-600">Moderate (51-79)</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-secondary rounded-full"></div>
                <span className="text-sm text-gray-600">Good (80-100)</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-6 mb-8">
        <div className="col-span-2 bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl p-6 border border-blue-200">
          <div className="flex items-start space-x-4">
            <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center flex-shrink-0">
              <i className="fa-solid fa-info text-white text-xl"></i>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Summary</h3>
              <p className="text-gray-700 mb-4">Your site is moderately optimized with a global score of 70/100. While your technical infrastructure is solid (82/100), there are priority improvements needed in content optimization and off-page SEO strategies.</p>
              <div className="flex flex-wrap gap-2">
                <span className="px-3 py-1 bg-white text-gray-700 text-sm font-medium rounded-full">5 Critical Issues</span>
                <span className="px-3 py-1 bg-white text-gray-700 text-sm font-medium rounded-full">12 Warnings</span>
                <span className="px-3 py-1 bg-white text-gray-700 text-sm font-medium rounded-full">8 Opportunities</span>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
          <div className="space-y-3">
            <Link to="/recommendations" className="w-full px-4 py-3 bg-primary text-white rounded-lg hover:bg-blue-700 font-medium transition text-left flex items-center">
              <i className="fa-solid fa-lightbulb mr-3"></i>
              View Recommendations
            </Link>
            <Link to="/intelligent-agents" className="w-full px-4 py-3 bg-white text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 font-medium transition text-left flex items-center">
              <i className="fa-solid fa-robot mr-3"></i>
              Talk to AI Agents
            </Link>
            <button className="w-full px-4 py-3 bg-white text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 font-medium transition text-left flex items-center">
              <i className="fa-solid fa-file-pdf mr-3"></i>
              Download Report
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-4">
        {[
          { to: '/technical-seo', icon: 'fa-wrench', color: 'bg-blue-50', iconColor: 'text-primary', hoverColor: 'group-hover:bg-blue-100', title: 'Technical Details', desc: 'View in-depth technical analysis' },
          { to: '/content-analysis', icon: 'fa-file-lines', color: 'bg-purple-50', iconColor: 'text-purple-600', hoverColor: 'group-hover:bg-purple-100', title: 'Content Analysis', desc: 'Optimize your content quality' },
          { to: '/ux-analysis', icon: 'fa-paintbrush', color: 'bg-green-50', iconColor: 'text-secondary', hoverColor: 'group-hover:bg-green-100', title: 'UX / UI Report', desc: 'Improve user experience' },
          { to: '/popularity-seo', icon: 'fa-star', color: 'bg-orange-50', iconColor: 'text-orange-500', hoverColor: 'group-hover:bg-orange-100', title: 'Popularity Metrics', desc: 'Check backlinks & authority' },
        ].map((link, idx) => (
          <Link key={idx} to={link.to} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition group">
            <div className={`w-12 h-12 ${link.color} rounded-lg flex items-center justify-center mb-4 ${link.hoverColor} transition`}>
              <i className={`fa-solid ${link.icon} ${link.iconColor} text-xl`}></i>
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">{link.title}</h3>
            <p className="text-sm text-gray-600">{link.desc}</p>
            <div className={`mt-4 flex items-center ${link.iconColor} text-sm font-medium`}>
              View Report
              <i className="fa-solid fa-arrow-right ml-2"></i>
            </div>
          </Link>
        ))}
      </div>
    </div>
    </div>
  );
};

export default MainDashboard;