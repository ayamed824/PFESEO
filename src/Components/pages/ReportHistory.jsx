import React, { useState } from 'react';

const ReportHistory = () => {
  const [selectedReports, setSelectedReports] = useState([]);

  const reports = [
    { id: 1, date: 'Jan 20, 2024', time: '2:45 PM', url: 'www.example.com', score: 78, status: 'Good', change: '+3', changeType: 'positive', critical: 2, medium: 5 },
    { id: 2, date: 'Jan 13, 2024', time: '10:20 AM', url: 'www.example.com', score: 75, status: 'Fair', change: '+5', changeType: 'positive', critical: 3, medium: 7 },
    { id: 3, date: 'Jan 6, 2024', time: '4:15 PM', url: 'www.example.com', score: 70, status: 'Needs Work', change: '+2', changeType: 'positive', critical: 5, medium: 8 },
    { id: 4, date: 'Dec 30, 2023', time: '11:30 AM', url: 'www.example.com', score: 68, status: 'Needs Work', change: '-2', changeType: 'negative', critical: 6, medium: 10 },
    { id: 5, date: 'Dec 23, 2023', time: '3:00 PM', url: 'www.example.com', score: 70, status: 'Needs Work', change: '+4', changeType: 'positive', critical: 5, medium: 9 },
    { id: 6, date: 'Dec 16, 2023', time: '9:45 AM', url: 'www.example.com', score: 66, status: 'Poor', change: '0', changeType: 'neutral', critical: 7, medium: 11 },
  ];

  const toggleSelection = (id) => {
    setSelectedReports(prev => 
      prev.includes(id) ? prev.filter(r => r !== id) : [...prev, id]
    );
  };

  const getScoreColor = (score) => {
    if (score >= 80) return 'from-green-400 to-green-600';
    if (score >= 60) return 'from-yellow-400 to-orange-500';
    return 'from-orange-400 to-red-500';
  };

  const getScoreLabel = (score) => {
    if (score >= 80) return 'Good';
    if (score >= 60) return 'Fair';
    if (score >= 50) return 'Needs Work';
    return 'Poor';
  };

  return (
    <div>
      <div className="mb-8">
        <div className="flex items-center justify-between mb-2">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Report History</h1>
            <p className="text-gray-600 mt-1">Track your SEO analysis progress over time and compare historical reports</p>
          </div>
          <button className="px-6 py-3 bg-primary text-white rounded-lg hover:bg-blue-700 font-medium transition shadow-sm">
            <i className="fa-solid fa-plus mr-2"></i>
            New Analysis
          </button>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-2">
            <i className="fa-solid fa-file-lines text-primary text-2xl"></i>
            <span className="px-2 py-1 bg-blue-100 text-primary text-xs font-semibold rounded-full">Total</span>
          </div>
          <div className="text-3xl font-bold text-gray-900 mb-1">23</div>
          <div className="text-sm text-gray-600">Analyses Completed</div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-2">
            <i className="fa-solid fa-arrow-trend-up text-green-600 text-2xl"></i>
          </div>
          <div className="text-3xl font-bold text-gray-900 mb-1">+12</div>
          <div className="text-sm text-gray-600">Score Improvement</div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-2">
            <i className="fa-solid fa-calendar-day text-orange-600 text-2xl"></i>
          </div>
          <div className="text-3xl font-bold text-gray-900 mb-1">7</div>
          <div className="text-sm text-gray-600">Days Since Last Run</div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-2">
            <i className="fa-solid fa-gauge-high text-purple-600 text-2xl"></i>
          </div>
          <div className="text-3xl font-bold text-gray-900 mb-1">78</div>
          <div className="text-sm text-gray-600">Current SEO Score</div>
        </div>
      </div>

      {/* Filters */}
      <div className="mb-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="relative">
                <input 
                  type="text" 
                  placeholder="Search by URL or date..." 
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm w-80 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                />
                <i className="fa-solid fa-search absolute left-3 top-3 text-gray-400 text-sm"></i>
              </div>
              <div className="border-l border-gray-300 pl-4">
                <select className="px-4 py-2 border border-gray-300 rounded-lg text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary">
                  <option>All Time</option>
                  <option>Last 7 Days</option>
                  <option>Last 30 Days</option>
                  <option>Last 3 Months</option>
                  <option>Last Year</option>
                </select>
              </div>
              <div>
                <select className="px-4 py-2 border border-gray-300 rounded-lg text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary">
                  <option>All Websites</option>
                  <option>www.example.com</option>
                  <option>www.demo-site.com</option>
                  <option>www.test-site.org</option>
                </select>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <button className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 font-medium transition text-sm">
                <i className="fa-solid fa-download mr-2"></i>
                Export History
              </button>
              <button className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 font-medium transition text-sm">
                <i className="fa-solid fa-code-compare mr-2"></i>
                Compare Reports
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Reports Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  <input 
                    type="checkbox" 
                    className="w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary accent-primary cursor-pointer"
                  />
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Date & Time</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Website URL</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Global Score</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Score Change</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Key Issues</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {reports.map((report) => (
                <tr key={report.id} className="hover:bg-gray-50 transition cursor-pointer">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <input 
                      type="checkbox" 
                      checked={selectedReports.includes(report.id)}
                      onChange={() => toggleSelection(report.id)}
                      className="w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary accent-primary cursor-pointer"
                    />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div>
                        <div className="text-sm font-semibold text-gray-900">{report.date}</div>
                        <div className="text-xs text-gray-500">{report.time}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <i className="fa-solid fa-globe text-gray-400 mr-2"></i>
                      <span className="text-sm text-gray-900 font-medium">{report.url}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className={`w-12 h-12 rounded-full bg-gradient-to-br ${getScoreColor(report.score)} flex items-center justify-center text-white font-bold text-sm mr-3`}>
                        {report.score}
                      </div>
                      <span className="text-sm text-gray-600">{getScoreLabel(report.score)}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      {report.changeType === 'positive' && <i className="fa-solid fa-arrow-up text-green-600 mr-1"></i>}
                      {report.changeType === 'negative' && <i className="fa-solid fa-arrow-down text-red-600 mr-1"></i>}
                      {report.changeType === 'neutral' && <i className="fa-solid fa-minus text-gray-600 mr-1"></i>}
                      <span className={`text-sm font-semibold ${report.changeType === 'positive' ? 'text-green-600' : report.changeType === 'negative' ? 'text-red-600' : 'text-gray-600'}`}>
                        {report.change}
                      </span>
                      <span className="text-xs text-gray-500 ml-1">vs previous</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-2">
                      <span className="px-2 py-1 bg-red-100 text-red-700 text-xs font-semibold rounded-full">{report.critical} Critical</span>
                      <span className="px-2 py-1 bg-orange-100 text-orange-700 text-xs font-semibold rounded-full">{report.medium} Medium</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center space-x-2">
                      <button className="px-3 py-1.5 bg-primary text-white rounded-lg hover:bg-blue-700 text-xs font-medium transition">
                        <i className="fa-solid fa-eye mr-1"></i>
                        View
                      </button>
                      <button className="px-3 py-1.5 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 text-xs font-medium transition">
                        <i className="fa-solid fa-download mr-1"></i>
                        Export
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
          <div className="text-sm text-gray-600">
            Showing <span className="font-semibold">1-6</span> of <span className="font-semibold">23</span> reports
          </div>
          <div className="flex items-center space-x-2">
            <button className="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium transition text-sm">
              <i className="fa-solid fa-chevron-left mr-2"></i>
              Previous
            </button>
            <button className="px-4 py-2 bg-primary text-white rounded-lg font-medium text-sm">1</button>
            <button className="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium transition text-sm">2</button>
            <button className="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium transition text-sm">3</button>
            <button className="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium transition text-sm">4</button>
            <button className="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium transition text-sm">
              Next
              <i className="fa-solid fa-chevron-right ml-2"></i>
            </button>
          </div>
        </div>
      </div>

      {/* Compare Section */}
      <div className="mt-8 bg-white rounded-xl shadow-sm border border-gray-200 p-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Compare Reports</h2>
            <p className="text-gray-600">Select two reports to view side-by-side comparison</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-3">Select First Report</label>
            <select className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary">
              {reports.map(r => (
                <option key={r.id}>{r.date} - Score: {r.score}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-3">Select Second Report</label>
            <select className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary">
              {reports.slice(1).map(r => (
                <option key={r.id}>{r.date} - Score: {r.score}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="mt-6 flex items-center justify-center">
          <button className="px-8 py-3 bg-primary text-white rounded-lg hover:bg-blue-700 font-medium transition shadow-sm">
            <i className="fa-solid fa-code-compare mr-2"></i>
            Compare Selected Reports
          </button>
        </div>
      </div>

      {/* Educational Section */}
      <div className="mt-8 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl border border-blue-200 p-8">
        <div className="flex items-start space-x-4 mb-6">
          <div className="w-16 h-16 bg-primary rounded-xl flex items-center justify-center flex-shrink-0">
            <i className="fa-solid fa-lightbulb text-white text-2xl"></i>
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Tracking SEO Progress Over Time</h2>
            <p className="text-gray-700">Understanding your historical data helps optimize your SEO strategy</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-6">
          <div className="bg-white rounded-lg p-5 border border-blue-200">
            <h3 className="font-semibold text-gray-900 mb-3 flex items-center">
              <i className="fa-solid fa-chart-line text-primary mr-2"></i>
              Why Track History?
            </h3>
            <ul className="space-y-2 text-sm text-gray-700">
              <li className="flex items-start">
                <i className="fa-solid fa-check text-green-600 mr-2 mt-0.5"></i>
                <span>Identify which optimizations had the biggest impact on your score</span>
              </li>
              <li className="flex items-start">
                <i className="fa-solid fa-check text-green-600 mr-2 mt-0.5"></i>
                <span>Track improvement trends over weeks and months</span>
              </li>
              <li className="flex items-start">
                <i className="fa-solid fa-check text-green-600 mr-2 mt-0.5"></i>
                <span>Detect regressions or new issues that arise</span>
              </li>
              <li className="flex items-start">
                <i className="fa-solid fa-check text-green-600 mr-2 mt-0.5"></i>
                <span>Measure ROI of your SEO efforts with concrete data</span>
              </li>
            </ul>
          </div>

          <div className="bg-white rounded-lg p-5 border border-blue-200">
            <h3 className="font-semibold text-gray-900 mb-3 flex items-center">
              <i className="fa-solid fa-calendar-check text-primary mr-2"></i>
              Best Practices
            </h3>
            <ul className="space-y-2 text-sm text-gray-700">
              <li className="flex items-start">
                <i className="fa-solid fa-check text-green-600 mr-2 mt-0.5"></i>
                <span>Run analyses weekly after implementing changes</span>
              </li>
              <li className="flex items-start">
                <i className="fa-solid fa-check text-green-600 mr-2 mt-0.5"></i>
                <span>Compare reports before and after major updates</span>
              </li>
              <li className="flex items-start">
                <i className="fa-solid fa-check text-green-600 mr-2 mt-0.5"></i>
                <span>Export historical data for stakeholder reports</span>
              </li>
              <li className="flex items-start">
                <i className="fa-solid fa-check text-green-600 mr-2 mt-0.5"></i>
                <span>Use score deltas to prioritize future optimization work</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportHistory;