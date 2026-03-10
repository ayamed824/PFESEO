import React from 'react';

const PopularitySEO = () => {
  const metrics = [
    { label: 'Domain Authority', value: '42', max: '100', change: '+3', changeType: 'positive', width: '42%', color: 'bg-blue-500' },
    { label: 'Page Authority', value: '38', max: '100', change: '+5', changeType: 'positive', width: '38%', color: 'bg-blue-400' },
    { label: 'Backlinks', value: '1,247', max: '', change: '+24', changeType: 'positive', width: '60%', color: 'bg-secondary' },
    { label: 'Referring Domains', value: '89', max: '', change: '+8', changeType: 'positive', width: '45%', color: 'bg-secondary' },
  ];

  const backlinkQuality = [
    { range: '90-100 (Excellent)', count: 12, color: 'bg-green-500' },
    { range: '70-89 (Good)', count: 34, color: 'bg-blue-500' },
    { range: '50-69 (Average)', count: 28, color: 'bg-yellow-500' },
    { range: '30-49 (Below Average)', count: 15, color: 'bg-orange-500' },
    { range: '0-29 (Poor)', count: 14, color: 'bg-red-500', warning: true },
  ];

  const recentBacklinks = [
    { domain: 'techblog.com', authority: 78, date: '2 days ago', type: 'Dofollow' },
    { domain: 'marketingpro.net', authority: 65, date: '3 days ago', type: 'Dofollow' },
    { domain: 'seoguide.org', authority: 72, date: '5 days ago', type: 'Dofollow' },
    { domain: 'webdevdaily.io', authority: 58, date: '1 week ago', type: 'Nofollow' },
  ];

  const toxicLinks = [
    { domain: 'spam-site-123.xyz', authority: 5, reason: 'Low quality directory' },
    { domain: 'link-farm.biz', authority: 3, reason: 'Link farm detected' },
    { domain: 'suspicious-blog.tk', authority: 8, reason: 'Spam content' },
    { domain: 'auto-generated-links.cf', authority: 2, reason: 'Auto-generated content' },
  ];

  const socialPresence = [
    { platform: 'Facebook', followers: '2.4K', engagement: '3.2%', icon: 'fa-facebook', color: 'bg-blue-600' },
    { platform: 'Twitter', followers: '1.8K', engagement: '2.8%', icon: 'fa-twitter', color: 'bg-sky-500' },
    { platform: 'LinkedIn', followers: '3.2K', engagement: '4.5%', icon: 'fa-linkedin', color: 'bg-blue-700' },
    { platform: 'Instagram', followers: '890', engagement: '5.1%', icon: 'fa-instagram', color: 'bg-pink-600' },
  ];

  return (
    <div>
      <div className="mb-8">
        <div className="flex items-center justify-between mb-2">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Popularity / Off-Page SEO</h1>
            <p className="text-gray-600 mt-1">Analyze backlinks, domain authority, and social presence</p>
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

      {/* Key Metrics */}
      <div className="grid grid-cols-4 gap-6 mb-8">
        {metrics.map((metric, idx) => (
          <div key={idx} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-gray-600 font-medium text-sm mb-2">{metric.label}</h3>
            <div className="flex items-baseline mb-2">
              <span className="text-3xl font-bold text-gray-900">{metric.value}</span>
              {metric.max && <span className="text-gray-500 text-sm ml-1">/{metric.max}</span>}
            </div>
            <div className="flex items-center mb-3">
              <i className={`fa-solid fa-arrow-${metric.changeType === 'positive' ? 'up' : 'down'} ${metric.changeType === 'positive' ? 'text-green-600' : 'text-red-600'} mr-1`}></i>
              <span className={`text-sm font-semibold ${metric.changeType === 'positive' ? 'text-green-600' : 'text-red-600'}`}>{metric.change}</span>
              <span className="text-xs text-gray-500 ml-1">this month</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div className={`${metric.color} h-2 rounded-full`} style={{width: metric.width}}></div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-6 mb-8">
        {/* Backlink Quality Distribution */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Backlink Quality Distribution</h2>
          <div className="space-y-4">
            {backlinkQuality.map((item, idx) => (
              <div key={idx}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm text-gray-700">{item.range}</span>
                  <span className={`text-sm font-semibold ${item.warning ? 'text-red-600' : 'text-gray-900'}`}>{item.count} links</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div className={`${item.color} h-2.5 rounded-full`} style={{width: `${(item.count / 103) * 100}%`}}></div>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-start space-x-3">
              <i className="fa-solid fa-triangle-exclamation text-red-500 mt-1"></i>
              <div>
                <p className="text-sm font-semibold text-gray-900 mb-1">14 Toxic Links Detected</p>
                <p className="text-sm text-gray-600">These links may harm your rankings. Consider disavowing them.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Backlinks */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Recent Backlinks</h2>
          <div className="space-y-3">
            {recentBacklinks.map((link, idx) => (
              <div key={idx} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
                    <i className="fa-solid fa-link text-primary"></i>
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900 text-sm">{link.domain}</p>
                    <p className="text-xs text-gray-500">DA: {link.authority} • {link.date}</p>
                  </div>
                </div>
                <span className={`px-2 py-1 text-xs font-semibold rounded ${link.type === 'Dofollow' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>
                  {link.type}
                </span>
              </div>
            ))}
          </div>
          <button className="w-full mt-4 px-4 py-2 text-primary border border-primary rounded-lg hover:bg-blue-50 font-medium transition text-sm">
            View All Backlinks
          </button>
        </div>
      </div>

      {/* Toxic Links Section */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-900">Toxic Links Requiring Action</h2>
          <button className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 font-medium transition text-sm">
            <i className="fa-solid fa-ban mr-2"></i>
            Generate Disavow File
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600">Domain</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600">Authority</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600">Issue</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {toxicLinks.map((link, idx) => (
                <tr key={idx}>
                  <td className="px-4 py-3 text-sm text-gray-900 font-medium">{link.domain}</td>
                  <td className="px-4 py-3 text-sm text-gray-600">{link.authority}</td>
                  <td className="px-4 py-3 text-sm text-red-600">{link.reason}</td>
                  <td className="px-4 py-3">
                    <button className="text-sm text-primary hover:text-blue-700 font-medium">Add to Disavow</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Social Presence */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Social Media Presence</h2>
        <div className="grid grid-cols-4 gap-4">
          {socialPresence.map((social, idx) => (
            <div key={idx} className="p-4 border border-gray-200 rounded-lg text-center hover:shadow-md transition">
              <div className={`w-12 h-12 ${social.color} rounded-full flex items-center justify-center mx-auto mb-3`}>
                <i className={`fa-brands ${social.icon} text-white text-xl`}></i>
              </div>
              <h3 className="font-semibold text-gray-900 mb-1">{social.platform}</h3>
              <p className="text-2xl font-bold text-gray-900 mb-1">{social.followers}</p>
              <p className="text-sm text-gray-600">Followers</p>
              <div className="mt-2 pt-2 border-t border-gray-100">
                <span className="text-sm font-semibold text-green-600">{social.engagement}</span>
                <span className="text-xs text-gray-500 ml-1">engagement</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PopularitySEO;