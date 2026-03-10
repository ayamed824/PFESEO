import React, { useState } from 'react';

const Recommendations = () => {
  const [filter, setFilter] = useState('all');
  const [category, setCategory] = useState('all');

  const recommendations = [
    {
      id: 1,
      priority: 'high',
      category: 'technical',
      icon: 'fa-wrench',
      color: 'blue',
      title: 'Fix Core Web Vitals - Reduce Largest Contentful Paint (LCP)',
      description: 'Your LCP is currently 3.8 seconds, exceeding Google\'s recommended 2.5s threshold. This directly impacts your page experience score and search rankings.',
      time: '2-4 hours',
      impact: '+15 SEO score',
      steps: [
        'Defer non-critical JavaScript using defer or async attributes',
        'Inline critical CSS and defer non-critical stylesheets',
        'Optimize and compress images using WebP format with lazy loading',
        'Use a CDN to serve static resources faster globally'
      ]
    },
    {
      id: 2,
      priority: 'high',
      category: 'popularity',
      icon: 'fa-star',
      color: 'orange',
      title: 'Disavow 14 Toxic Backlinks to Protect Domain Authority',
      description: 'Our Popularity Agent detected 14 low-quality backlinks from spammy domains (DA <10) that could trigger a manual penalty or algorithmic devaluation.',
      time: '30 minutes',
      impact: '+8 SEO score',
      steps: [
        'Download the list of toxic backlinks from the Popularity Analysis section',
        'Create a disavow file (disavow.txt) with one domain per line prefixed with "domain:"',
        'Submit the file to Google Search Console → Disavow Links Tool',
        'Monitor your domain authority over the next 4-6 weeks for improvements'
      ]
    },
    {
      id: 3,
      priority: 'high',
      category: 'ux',
      icon: 'fa-paintbrush',
      color: 'purple',
      title: 'Increase Mobile Tap Target Sizes to 48x48px Minimum',
      description: '12 interactive buttons and links on your site have tap targets smaller than the recommended 48x48 pixels, causing poor mobile usability.',
      time: '1-2 hours',
      impact: '+6 SEO score',
      steps: [
        'Review the list of affected elements in the UX/UI Analysis section',
        'Update CSS to ensure minimum 48x48px touch target',
        'Add adequate padding around small elements to increase clickable area',
        'Test on real mobile devices to verify comfortable tap targets'
      ]
    },
    {
      id: 4,
      priority: 'medium',
      category: 'content',
      icon: 'fa-file-lines',
      color: 'green',
      title: 'Reduce Keyword Density on 5 Pages from 4.2% to 1-2%',
      description: 'Five pages have keyword density exceeding 4%, which appears unnatural to search engines and may be flagged as keyword stuffing.',
      time: '3-5 hours',
      impact: '+4 SEO score',
      steps: [
        'Review affected pages in Content Analysis section',
        'Replace exact-match keywords with natural synonyms and related terms',
        'Expand content with valuable information rather than repetitive phrases',
        'Use LSI keywords (latent semantic indexing) to add topical relevance'
      ]
    },
    {
      id: 5,
      priority: 'medium',
      category: 'technical',
      icon: 'fa-wrench',
      color: 'blue',
      title: 'Add Missing Alt Text to 18 Images',
      description: '18 images across your site are missing alt text, which harms both SEO and accessibility.',
      time: '1 hour',
      impact: '+3 SEO score',
      steps: [
        'Export the list of images missing alt text from Technical SEO Analysis',
        'Write descriptive, concise alt text (5-15 words) that describes the image purpose',
        'Include target keywords naturally where relevant',
        'Add alt attributes to all <img> tags in your HTML or CMS'
      ]
    },
    {
      id: 6,
      priority: 'low',
      category: 'content',
      icon: 'fa-file-lines',
      color: 'green',
      title: 'Expand Thin Content Pages to 800+ Words',
      description: '7 pages have less than 300 words of content, which is considered "thin content" by search engines.',
      time: '4-6 hours',
      impact: '+2 SEO score',
      steps: [
        'Identify thin content pages in Content Analysis section',
        'Research user intent and common questions related to each page topic',
        'Add sections covering: benefits, how-to guides, FAQs, examples',
        'Include relevant images, videos, or infographics to enhance value'
      ]
    }
  ];

  const filteredRecommendations = recommendations.filter(rec => {
    if (filter !== 'all' && rec.priority !== filter) return false;
    if (category !== 'all' && rec.category !== category) return false;
    return true;
  });

  const getPriorityColor = (priority) => {
    switch(priority) {
      case 'high': return 'bg-red-100 text-red-700';
      case 'medium': return 'bg-orange-100 text-orange-700';
      case 'low': return 'bg-green-100 text-green-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getCategoryColor = (cat) => {
    switch(cat) {
      case 'technical': return 'bg-blue-100 text-primary';
      case 'content': return 'bg-green-100 text-green-700';
      case 'ux': return 'bg-purple-100 text-purple-700';
      case 'popularity': return 'bg-orange-100 text-orange-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div>
      <div className="mb-8">
        <div className="flex items-center justify-between mb-2">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Recommendations Engine</h1>
            <p className="text-gray-600 mt-1">Actionable improvements prioritized by impact and implementation complexity</p>
          </div>
          <div className="flex items-center space-x-3">
            <button className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 font-medium transition">
              <i className="fa-solid fa-download mr-2"></i>
              Export Report
            </button>
            <button className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-blue-700 font-medium transition">
              <i className="fa-solid fa-refresh mr-2"></i>
              Regenerate
            </button>
          </div>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-2">
            <i className="fa-solid fa-list-check text-primary text-2xl"></i>
            <span className="px-2 py-1 bg-blue-100 text-primary text-xs font-semibold rounded-full">Total</span>
          </div>
          <div className="text-3xl font-bold text-gray-900 mb-1">42</div>
          <div className="text-sm text-gray-600">Recommendations</div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-2">
            <i className="fa-solid fa-exclamation-triangle text-red-600 text-2xl"></i>
            <span className="px-2 py-1 bg-red-100 text-red-700 text-xs font-semibold rounded-full">High</span>
          </div>
          <div className="text-3xl font-bold text-gray-900 mb-1">12</div>
          <div className="text-sm text-gray-600">High Priority</div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-2">
            <i className="fa-solid fa-circle-exclamation text-orange-600 text-2xl"></i>
            <span className="px-2 py-1 bg-orange-100 text-orange-700 text-xs font-semibold rounded-full">Medium</span>
          </div>
          <div className="text-3xl font-bold text-gray-900 mb-1">18</div>
          <div className="text-sm text-gray-600">Medium Priority</div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-2">
            <i className="fa-solid fa-circle-info text-green-600 text-2xl"></i>
            <span className="px-2 py-1 bg-green-100 text-green-700 text-xs font-semibold rounded-full">Low</span>
          </div>
          <div className="text-3xl font-bold text-gray-900 mb-1">12</div>
          <div className="text-sm text-gray-600">Low Priority</div>
        </div>
      </div>

      {/* Filters */}
      <div className="mb-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">Filter by Priority</label>
                <div className="flex items-center space-x-2">
                  {['all', 'high', 'medium', 'low'].map((f) => (
                    <button
                      key={f}
                      onClick={() => setFilter(f)}
                      className={`px-4 py-2 rounded-lg text-sm font-medium ${filter === f ? 'bg-primary text-white' : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'}`}
                    >
                      {f.charAt(0).toUpperCase() + f.slice(1)}
                    </button>
                  ))}
                </div>
              </div>
              <div className="border-l border-gray-300 pl-4">
                <label className="text-sm font-medium text-gray-700 mb-2 block">Filter by Category</label>
                <div className="flex items-center space-x-2">
                  {['all', 'technical', 'content', 'ux', 'popularity'].map((c) => (
                    <button
                      key={c}
                      onClick={() => setCategory(c)}
                      className={`px-4 py-2 rounded-lg text-sm font-medium ${category === c ? 'bg-primary text-white' : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'}`}
                    >
                      {c.charAt(0).toUpperCase() + c.slice(1)}
                    </button>
                  ))}
                </div>
              </div>
            </div>
            <button className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 font-medium transition text-sm">
              <i className="fa-solid fa-check-double mr-2"></i>
              Mark All Addressed
            </button>
          </div>
        </div>
      </div>

      {/* Recommendations List */}
      <div className="space-y-4">
        {filteredRecommendations.map((rec) => (
          <div key={rec.id} className="bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-all">
            <div className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-start space-x-4 flex-1">
                  <div className="flex items-center space-x-2">
                    <input type="checkbox" className="w-5 h-5 rounded border-gray-300 text-primary focus:ring-primary accent-primary cursor-pointer" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-3">
                      <span className={`px-3 py-1 ${getPriorityColor(rec.priority)} text-xs font-bold rounded-full uppercase`}>
                        {rec.priority} Priority
                      </span>
                      <span className={`px-3 py-1 ${getCategoryColor(rec.category)} text-xs font-semibold rounded-full`}>
                        <i className={`fa-solid ${rec.icon} mr-1`}></i>
                        {rec.category.charAt(0).toUpperCase() + rec.category.slice(1)}
                      </span>
                      <span className="text-xs text-gray-500">Impact: {rec.impact.includes('15') ? 'High' : rec.impact.includes('8') ? 'High' : rec.impact.includes('6') ? 'Medium-High' : rec.impact.includes('4') ? 'Medium' : 'Low-Medium'} • Effort: {rec.time.includes('30') ? 'Low' : rec.time.includes('1-2') ? 'Low' : rec.time.includes('2-4') ? 'Medium' : 'Medium'}</span>
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 mb-2">{rec.title}</h3>
                    <p className="text-gray-700 mb-4 leading-relaxed">{rec.description}</p>
                    
                    <div className={`bg-${rec.color}-50 border-l-4 border-${rec.color === 'blue' ? 'primary' : rec.color} rounded-lg p-4 mb-4`}>
                      <h4 className="font-semibold text-gray-900 mb-2 flex items-center">
                        <i className={`fa-solid fa-tools text-${rec.color === 'blue' ? 'primary' : rec.color} mr-2`}></i>
                        How to Fix
                      </h4>
                      <ol className="space-y-2 text-sm text-gray-700">
                        {rec.steps.map((step, idx) => (
                          <li key={idx} className="flex items-start">
                            <span className="font-semibold mr-2">{idx + 1}.</span>
                            <span>{step}</span>
                          </li>
                        ))}
                      </ol>
                    </div>

                    <div className="flex items-center space-x-4">
                      <div className="flex items-center text-sm text-gray-600">
                        <i className="fa-solid fa-clock mr-2"></i>
                        Estimated time: {rec.time}
                      </div>
                      <div className="flex items-center text-sm text-gray-600">
                        <i className="fa-solid fa-chart-line mr-2"></i>
                        Expected improvement: {rec.impact}
                      </div>
                    </div>
                  </div>
                </div>
                <button className="text-gray-400 hover:text-gray-600 ml-4">
                  <i className="fa-solid fa-ellipsis-vertical text-xl"></i>
                </button>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                <button className="px-4 py-2 text-primary hover:bg-blue-50 rounded-lg font-medium transition text-sm">
                  <i className="fa-solid fa-book mr-2"></i>
                  Learn More
                </button>
                <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium transition text-sm">
                  <i className="fa-solid fa-check mr-2"></i>
                  Mark as Addressed
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      <div className="mt-8 flex items-center justify-center">
        <div className="flex items-center space-x-2">
          <button className="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium transition">
            <i className="fa-solid fa-chevron-left mr-2"></i>
            Previous
          </button>
          <button className="px-4 py-2 bg-primary text-white rounded-lg font-medium">1</button>
          <button className="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium transition">2</button>
          <button className="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium transition">3</button>
          <span className="px-2 text-gray-500">...</span>
          <button className="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium transition">7</button>
          <button className="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium transition">
            Next
            <i className="fa-solid fa-chevron-right ml-2"></i>
          </button>
        </div>
      </div>

      {/* Educational Section */}
      <div className="mt-8 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl border border-blue-200 p-8">
        <div className="flex items-start space-x-4 mb-6">
          <div className="w-16 h-16 bg-primary rounded-xl flex items-center justify-center flex-shrink-0">
            <i className="fa-solid fa-graduation-cap text-white text-2xl"></i>
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Understanding SEO Recommendations</h2>
            <p className="text-gray-700">How to prioritize and implement improvements effectively</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-6">
          <div className="bg-white rounded-lg p-5 border border-blue-200">
            <h3 className="font-semibold text-gray-900 mb-3 flex items-center">
              <i className="fa-solid fa-flag text-primary mr-2"></i>
              Priority Levels Explained
            </h3>
            <div className="space-y-3">
              <div>
                <div className="flex items-center mb-1">
                  <span className="px-2 py-1 bg-red-100 text-red-700 text-xs font-bold rounded mr-2">HIGH</span>
                  <span className="text-sm font-semibold text-gray-900">Critical issues affecting rankings</span>
                </div>
                <p className="text-sm text-gray-700 ml-14">Address within 1-2 weeks for maximum impact</p>
              </div>
              <div>
                <div className="flex items-center mb-1">
                  <span className="px-2 py-1 bg-orange-100 text-orange-700 text-xs font-bold rounded mr-2">MEDIUM</span>
                  <span className="text-sm font-semibold text-gray-900">Important optimizations</span>
                </div>
                <p className="text-sm text-gray-700 ml-14">Implement within 2-4 weeks for steady improvement</p>
              </div>
              <div>
                <div className="flex items-center mb-1">
                  <span className="px-2 py-1 bg-green-100 text-green-700 text-xs font-bold rounded mr-2">LOW</span>
                  <span className="text-sm font-semibold text-gray-900">Enhancements for long-term gains</span>
                </div>
                <p className="text-sm text-gray-700 ml-14">Schedule for ongoing optimization cycles</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg p-5 border border-blue-200">
            <h3 className="font-semibold text-gray-900 mb-3 flex items-center">
              <i className="fa-solid fa-route text-primary mr-2"></i>
              Implementation Strategy
            </h3>
            <ol className="space-y-2 text-sm text-gray-700">
              <li className="flex items-start">
                <span className="font-semibold mr-2">1.</span>
                <span>Start with high-priority items that have low implementation effort</span>
              </li>
              <li className="flex items-start">
                <span className="font-semibold mr-2">2.</span>
                <span>Group similar recommendations to batch work efficiently</span>
              </li>
              <li className="flex items-start">
                <span className="font-semibold mr-2">3.</span>
                <span>Mark items as addressed to track progress over time</span>
              </li>
              <li className="flex items-start">
                <span className="font-semibold mr-2">4.</span>
                <span>Monitor SEO score changes after each implementation</span>
              </li>
              <li className="flex items-start">
                <span className="font-semibold mr-2">5.</span>
                <span>Regenerate recommendations monthly to catch new issues</span>
              </li>
            </ol>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Recommendations;