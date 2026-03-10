import React from 'react';

const UXAnalysis = () => {
  const metrics = [
    { label: 'Navigation Clarity', score: 85, status: 'Excellent', color: 'bg-green-100 text-green-700', barColor: 'bg-secondary' },
    { label: 'Mobile Usability', score: 87, status: 'Good', color: 'bg-green-100 text-green-700', barColor: 'bg-secondary' },
    { label: 'Accessibility Score', score: 72, status: 'Moderate', color: 'bg-yellow-100 text-yellow-700', barColor: 'bg-yellow-400' },
    { label: 'Page Layout', score: 90, status: 'Excellent', color: 'bg-green-100 text-green-700', barColor: 'bg-secondary' },
  ];

  const issues = [
    {
      severity: 'high',
      icon: 'fa-mobile-screen',
      title: 'Mobile Tap Targets Too Small',
      description: '12 interactive elements have tap targets smaller than 48x48px, making them difficult to tap on mobile devices.',
      impact: 'Affects mobile usability score and user experience',
      solution: 'Increase touch target size to minimum 48x48px using CSS padding or larger elements.'
    },
    {
      severity: 'medium',
      icon: 'fa-universal-access',
      title: 'Missing ARIA Labels',
      description: '8 interactive elements lack ARIA labels, making them inaccessible to screen readers.',
      impact: 'Reduces accessibility for visually impaired users',
      solution: 'Add descriptive aria-label attributes to buttons and links.'
    },
    {
      severity: 'medium',
      icon: 'fa-eye-slash',
      title: 'Low Color Contrast',
      description: '3 text elements have insufficient color contrast ratio (below 4.5:1).',
      impact: 'Hard to read for users with visual impairments',
      solution: 'Darken text color or lighten background to achieve 4.5:1 contrast ratio.'
    },
    {
      severity: 'low',
      icon: 'fa-heading',
      title: 'Skipped Heading Levels',
      description: 'Heading hierarchy jumps from H2 to H4 in 2 sections.',
      impact: 'Confuses screen reader navigation',
      solution: 'Maintain logical heading order (H1 → H2 → H3 → H4).'
    }
  ];

  const recommendations = [
    { priority: 'high', title: 'Implement Responsive Images', description: 'Add srcset attributes to serve appropriately sized images for different screen widths.', impact: '+5 Mobile Score' },
    { priority: 'high', title: 'Fix Touch Target Spacing', description: 'Ensure at least 8px spacing between adjacent touch targets.', impact: '+4 Mobile Score' },
    { priority: 'medium', title: 'Add Skip Navigation Link', description: 'Implement "Skip to main content" link for keyboard users.', impact: '+3 Accessibility' },
    { priority: 'medium', title: 'Improve Focus Indicators', description: 'Make focus outlines more visible for keyboard navigation.', impact: '+2 Accessibility' },
  ];

  return (
    <div>
      <div className="mb-8">
        <div className="flex items-center justify-between mb-2">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">UX / UI Analysis</h1>
            <p className="text-gray-600 mt-1">Evaluate user experience, accessibility, and interface design</p>
          </div>
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
      </div>

      {/* Overall UX Score */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 mb-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-6">
            <div className="relative w-32 h-32">
              <svg className="transform -rotate-90 w-32 h-32">
                <circle cx="64" cy="64" r="56" stroke="#e5e7eb" strokeWidth="10" fill="none"></circle>
                <circle cx="64" cy="64" r="56" stroke="#10b981" strokeWidth="10" fill="none" 
                  strokeDasharray="351.86" strokeDashoffset="87.97" strokeLinecap="round"></circle>
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-4xl font-bold text-gray-900">75</span>
                <span className="text-xs text-gray-500">/100</span>
              </div>
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Overall UX Score</h2>
              <p className="text-gray-600 mb-3">Your site provides a good user experience with room for improvement in accessibility.</p>
              <div className="flex items-center space-x-2">
                <span className="px-3 py-1 bg-green-100 text-green-700 text-sm font-semibold rounded-full">Good</span>
                <span className="text-sm text-gray-500">Last updated: 6 hours ago</span>
              </div>
            </div>
          </div>
          <div className="text-right">
            <div className="text-3xl font-bold text-gray-900 mb-1">87/100</div>
            <div className="text-sm text-gray-600">Mobile Usability</div>
          </div>
        </div>
      </div>

      {/* Category Scores */}
      <div className="grid grid-cols-4 gap-6 mb-8">
        {metrics.map((metric, idx) => (
          <div key={idx} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-gray-600 font-medium text-sm">{metric.label}</h3>
              <span className={`px-2 py-1 ${metric.color} text-xs font-semibold rounded-full`}>{metric.status}</span>
            </div>
            <div className="flex items-baseline mb-3">
              <span className="text-3xl font-bold text-gray-900">{metric.score}</span>
              <span className="text-gray-500 text-sm ml-1">/100</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div className={`${metric.barColor} h-2 rounded-full`} style={{width: `${metric.score}%`}}></div>
            </div>
          </div>
        ))}
      </div>

      {/* Issues Found */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Issues Found</h2>
        <div className="space-y-4">
          {issues.map((issue, idx) => (
            <div key={idx} className={`bg-white rounded-xl shadow-sm border-l-4 ${issue.severity === 'high' ? 'border-red-500' : issue.severity === 'medium' ? 'border-orange-500' : 'border-green-500'} p-6`}>
              <div className="flex items-start space-x-4">
                <div className={`w-12 h-12 ${issue.severity === 'high' ? 'bg-red-50' : issue.severity === 'medium' ? 'bg-orange-50' : 'bg-green-50'} rounded-lg flex items-center justify-center flex-shrink-0`}>
                  <i className={`fa-solid ${issue.icon} ${issue.severity === 'high' ? 'text-red-500' : issue.severity === 'medium' ? 'text-orange-500' : 'text-secondary'} text-xl`}></i>
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-lg font-bold text-gray-900">{issue.title}</h3>
                    <span className={`px-3 py-1 ${issue.severity === 'high' ? 'bg-red-100 text-red-700' : issue.severity === 'medium' ? 'bg-orange-100 text-orange-700' : 'bg-green-100 text-green-700'} text-xs font-bold rounded-full uppercase`}>
                      {issue.severity} Priority
                    </span>
                  </div>
                  <p className="text-gray-600 mb-3">{issue.description}</p>
                  <div className="bg-gray-50 rounded-lg p-3 mb-3">
                    <p className="text-sm text-gray-700"><strong>Impact:</strong> {issue.impact}</p>
                  </div>
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <p className="text-sm font-medium text-gray-900 mb-1 flex items-center">
                      <i className="fa-solid fa-lightbulb text-primary mr-2"></i>
                      Recommended Solution:
                    </p>
                    <p className="text-sm text-gray-700">{issue.solution}</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* UX Recommendations */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">UX Improvement Recommendations</h2>
        <div className="grid grid-cols-2 gap-6">
          {recommendations.map((rec, idx) => (
            <div key={idx} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition">
              <div className="flex items-start justify-between mb-3">
                <span className={`px-3 py-1 ${rec.priority === 'high' ? 'bg-red-100 text-red-700' : 'bg-orange-100 text-orange-700'} text-xs font-bold rounded-full uppercase`}>
                  {rec.priority} Priority
                </span>
                <span className="text-sm text-green-600 font-semibold">{rec.impact}</span>
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">{rec.title}</h3>
              <p className="text-gray-600 text-sm mb-4">{rec.description}</p>
              <button className="w-full px-4 py-2 bg-primary text-white rounded-lg hover:bg-blue-700 font-medium transition text-sm">
                View Implementation Guide
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Mobile Preview */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Mobile Responsiveness Preview</h2>
        <div className="flex items-center justify-center p-8 bg-gray-50 rounded-lg">
          <div className="bg-white border-4 border-gray-800 rounded-3xl p-4 w-64 h-96 overflow-hidden relative">
            <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-20 h-6 bg-gray-800 rounded-b-lg"></div>
            <div className="mt-6 space-y-3">
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              <div className="h-3 bg-gray-200 rounded w-full"></div>
              <div className="h-3 bg-gray-200 rounded w-5/6"></div>
              <div className="h-20 bg-gray-200 rounded w-full"></div>
              <div className="h-3 bg-gray-200 rounded w-full"></div>
              <div className="h-3 bg-gray-200 rounded w-4/5"></div>
            </div>
            <div className="absolute bottom-4 left-4 right-4">
              <div className="h-10 bg-primary rounded-lg w-full"></div>
            </div>
          </div>
          <div className="ml-8 space-y-4">
            <div className="flex items-center space-x-3">
              <i className="fa-solid fa-check-circle text-secondary text-xl"></i>
              <span className="text-gray-700">Responsive layout detected</span>
            </div>
            <div className="flex items-center space-x-3">
              <i className="fa-solid fa-check-circle text-secondary text-xl"></i>
              <span className="text-gray-700">Viewport meta tag present</span>
            </div>
            <div className="flex items-center space-x-3">
              <i className="fa-solid fa-exclamation-circle text-yellow-500 text-xl"></i>
              <span className="text-gray-700">Some elements overflow on small screens</span>
            </div>
            <div className="flex items-center space-x-3">
              <i className="fa-solid fa-check-circle text-secondary text-xl"></i>
              <span className="text-gray-700">Font sizes readable on mobile</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UXAnalysis;