import React from 'react';

const ContentAnalysis = () => {
  const primaryKeywords = [
    { keyword: 'SEO optimization', status: 'Excellent', statusColor: 'text-secondary', density: '2.3%', frequency: 42, location: 'In title, H1, H2', bgColor: 'bg-green-50', borderColor: 'border-green-200' },
    { keyword: 'content strategy', status: 'Good', statusColor: 'text-secondary', density: '1.8%', frequency: 28, location: 'In H2, body', bgColor: 'bg-green-50', borderColor: 'border-green-200' },
    { keyword: 'digital marketing', status: 'Moderate', statusColor: 'text-yellow-700', density: '0.9%', frequency: 14, location: 'In body only', bgColor: 'bg-yellow-50', borderColor: 'border-yellow-200' },
  ];

  const recommendations = [
    { 
      color: 'green', 
      icon: 'fa-check-double', 
      title: 'Maintain Your Keyword Strategy', 
      badge: 'Strength',
      badgeColor: 'bg-green-100 text-secondary',
      content: 'Your primary keywords are well-optimized with natural placement throughout the content. Continue this approach for future pages.',
      tip: 'Search engines recognize when keywords appear naturally in important places like titles, headings, and early paragraphs. Your 2.3% keyword density is in the ideal 1-3% range.'
    },
    { 
      color: 'yellow', 
      icon: 'fa-link', 
      title: 'Add More Internal Links', 
      badge: 'Priority: Medium',
      badgeColor: 'bg-yellow-100 text-yellow-700',
      content: 'You have only 3 internal links. Adding 5-8 more links to related pages will improve navigation and help search engines understand your site structure better.',
      steps: ['Link to your related blog posts or service pages when mentioning relevant topics', 'Use descriptive anchor text (e.g., "learn about keyword research" instead of "click here")', 'Add a "Related Articles" section at the bottom of your page']
    },
    { 
      color: 'blue', 
      icon: 'fa-spell-check', 
      title: 'Incorporate LSI Keywords', 
      badge: 'Priority: High',
      badgeColor: 'bg-blue-100 text-primary',
      content: 'Add semantically related keywords to help search engines better understand your content context and improve rankings for related searches.',
      keywords: ['search engine ranking', 'on-page SEO', 'keyword research', 'meta descriptions', 'organic traffic']
    },
    { 
      color: 'purple', 
      icon: 'fa-image', 
      title: 'Enhance with Visual Content', 
      badge: 'Priority: Medium',
      badgeColor: 'bg-purple-100 text-purple-700',
      content: 'Adding images, infographics, or videos can increase engagement and time-on-page. Currently, your content has minimal visual elements.',
      steps: ['Add 3-5 relevant images with descriptive alt text', 'Create an infographic summarizing key points', 'Consider adding a short explainer video (1-2 minutes)']
    },
    { 
      color: 'green', 
      icon: 'fa-clock', 
      title: 'Update Content Regularly', 
      badge: 'Best Practice',
      badgeColor: 'bg-green-100 text-secondary',
      content: 'Fresh content signals relevance to search engines. Plan to review and update this page every 3-6 months with new information, statistics, or examples.',
      tip: 'When you update content, add a "Last Updated" date at the top of the page. This builds trust with readers and tells search engines the content is current.'
    },
  ];

  return (
    <div>
      <div className="mb-8">
        <div className="flex items-center justify-between mb-2">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Content Analysis</h1>
            <p className="text-gray-600 mt-1">Evaluate content quality, keyword optimization, and SEO effectiveness</p>
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

      {/* Content Overview */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Content Overview</h2>
        <div className="grid grid-cols-4 gap-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-green-50 rounded-lg flex items-center justify-center">
                <i className="fa-solid fa-key text-secondary text-xl"></i>
              </div>
              <span className="px-3 py-1 bg-green-100 text-secondary text-xs font-semibold rounded-full">Good</span>
            </div>
            <h3 className="text-gray-600 font-medium text-sm mb-2">Keyword Optimization</h3>
            <div className="flex items-baseline">
              <span className="text-3xl font-bold text-gray-900">78</span>
              <span className="text-gray-500 text-sm ml-1">/100</span>
            </div>
            <div className="mt-4 w-full bg-gray-200 rounded-full h-2">
              <div className="bg-secondary h-2 rounded-full" style={{width: '78%'}}></div>
            </div>
            <p className="text-xs text-gray-500 mt-3">Primary keywords well-distributed</p>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center">
                <i className="fa-solid fa-align-left text-primary text-xl"></i>
              </div>
              <span className="px-3 py-1 bg-blue-100 text-primary text-xs font-semibold rounded-full">Optimal</span>
            </div>
            <h3 className="text-gray-600 font-medium text-sm mb-2">Content Length</h3>
            <div className="flex items-baseline">
              <span className="text-3xl font-bold text-gray-900">2,847</span>
              <span className="text-gray-500 text-sm ml-1">words</span>
            </div>
            <div className="mt-4 w-full bg-gray-200 rounded-full h-2">
              <div className="bg-primary h-2 rounded-full" style={{width: '85%'}}></div>
            </div>
            <p className="text-xs text-gray-500 mt-3">Ideal for comprehensive coverage</p>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-green-50 rounded-lg flex items-center justify-center">
                <i className="fa-solid fa-book-open text-secondary text-xl"></i>
              </div>
              <span className="px-3 py-1 bg-green-100 text-secondary text-xs font-semibold rounded-full">Easy</span>
            </div>
            <h3 className="text-gray-600 font-medium text-sm mb-2">Readability Score</h3>
            <div className="flex items-baseline">
              <span className="text-3xl font-bold text-gray-900">82</span>
              <span className="text-gray-500 text-sm ml-1">/100</span>
            </div>
            <div className="mt-4 w-full bg-gray-200 rounded-full h-2">
              <div className="bg-secondary h-2 rounded-full" style={{width: '82%'}}></div>
            </div>
            <p className="text-xs text-gray-500 mt-3">Grade 8 reading level (accessible)</p>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-green-50 rounded-lg flex items-center justify-center">
                <i className="fa-solid fa-fingerprint text-secondary text-xl"></i>
              </div>
              <span className="px-3 py-1 bg-green-100 text-secondary text-xs font-semibold rounded-full">Unique</span>
            </div>
            <h3 className="text-gray-600 font-medium text-sm mb-2">Originality Score</h3>
            <div className="flex items-baseline">
              <span className="text-3xl font-bold text-gray-900">94</span>
              <span className="text-gray-500 text-sm ml-1">%</span>
            </div>
            <div className="mt-4 w-full bg-gray-200 rounded-full h-2">
              <div className="bg-secondary h-2 rounded-full" style={{width: '94%'}}></div>
            </div>
            <p className="text-xs text-gray-500 mt-3">Minimal duplicate content found</p>
          </div>
        </div>
      </div>

      {/* Keyword Analysis */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Keyword Analysis</h2>
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="grid grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold text-gray-900 mb-4 flex items-center">
                <i className="fa-solid fa-star text-yellow-500 mr-2"></i>
                Primary Keywords
              </h3>
              <div className="space-y-4">
                {primaryKeywords.map((kw, idx) => (
                  <div key={idx} className={`flex items-center justify-between p-4 ${kw.bgColor} border ${kw.borderColor} rounded-lg`}>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium text-gray-900">{kw.keyword}</span>
                        <span className={`text-sm font-semibold ${kw.statusColor}`}>{kw.status}</span>
                      </div>
                      <div className="flex items-center space-x-4 text-xs text-gray-600">
                        <span><i className="fa-solid fa-hashtag mr-1"></i>Density: {kw.density}</span>
                        <span><i className="fa-solid fa-repeat mr-1"></i>Frequency: {kw.frequency}</span>
                        <span><i className="fa-solid fa-map-marker-alt mr-1"></i>{kw.location}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h3 className="font-semibold text-gray-900 mb-4 flex items-center">
                <i className="fa-solid fa-lightbulb text-primary mr-2"></i>
                Keyword Opportunities
              </h3>
              <div className="space-y-4">
                <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <div className="flex items-start space-x-3">
                    <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center flex-shrink-0">
                      <i className="fa-solid fa-arrow-trend-up text-white text-sm"></i>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-1">Missing LSI Keywords</h4>
                      <p className="text-sm text-gray-600 mb-2">Add related terms to improve semantic relevance</p>
                      <div className="flex flex-wrap gap-2">
                        {['search engine ranking', 'on-page SEO', 'keyword research'].map((tag, tidx) => (
                          <span key={tidx} className="px-2 py-1 bg-white border border-blue-300 rounded text-xs text-gray-700">{tag}</span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <div className="flex items-start space-x-3">
                    <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center flex-shrink-0">
                      <i className="fa-solid fa-magnifying-glass text-white text-sm"></i>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-1">Long-Tail Opportunities</h4>
                      <p className="text-sm text-gray-600 mb-2">Target these low-competition phrases</p>
                      <div className="flex flex-wrap gap-2">
                        {['how to improve SEO rankings', 'best SEO practices 2024'].map((tag, tidx) => (
                          <span key={tidx} className="px-2 py-1 bg-white border border-blue-300 rounded text-xs text-gray-700">{tag}</span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-purple-50 border border-purple-200 rounded-lg">
                  <div className="flex items-start space-x-3">
                    <div className="w-8 h-8 bg-purple-600 rounded-lg flex items-center justify-center flex-shrink-0">
                      <i className="fa-solid fa-chart-simple text-white text-sm"></i>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-1">Competitor Keywords</h4>
                      <p className="text-sm text-gray-600">Top-ranking competitors use these terms more frequently</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content Quality */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Content Quality Indicators</h2>
        <div className="grid grid-cols-2 gap-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-semibold text-gray-900 flex items-center">
                <i className="fa-solid fa-glasses text-primary mr-2"></i>
                Readability Analysis
              </h3>
              <span className="px-3 py-1 bg-green-100 text-secondary text-xs font-semibold rounded-full">Score: 82</span>
            </div>
            <div className="space-y-4">
              {[
                { label: 'Average Sentence Length', value: '18 words' },
                { label: 'Average Word Length', value: '4.8 characters' },
                { label: 'Flesch Reading Ease', value: '68 (Easy)' },
                { label: 'Passive Voice', value: '12% (Good)', color: 'text-secondary' },
                { label: 'Transition Words', value: '28% (Excellent)', color: 'text-secondary' },
              ].map((item, idx) => (
                <div key={idx} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <span className="text-sm text-gray-700">{item.label}</span>
                  <span className={`font-semibold ${item.color || 'text-gray-900'}`}>{item.value}</span>
                </div>
              ))}
            </div>
            <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-sm text-gray-700">
                <i className="fa-solid fa-circle-info text-primary mr-2"></i>
                <strong>Student-Friendly Tip:</strong> Your content is easy to read! Aim to keep sentences under 20 words and use simple language when possible.
              </p>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-semibold text-gray-900 flex items-center">
                <i className="fa-solid fa-sitemap text-primary mr-2"></i>
                Content Structure
              </h3>
            </div>
            <div className="space-y-4">
              <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium text-gray-900">Heading Hierarchy</span>
                  <i className="fa-solid fa-check-circle text-secondary"></i>
                </div>
                <div className="text-xs text-gray-600 space-y-1">
                  <div>H1: 1 (Perfect)</div>
                  <div>H2: 8 (Well-structured)</div>
                  <div>H3: 14 (Good depth)</div>
                  <div>H4: 6 (Detailed)</div>
                </div>
              </div>

              <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium text-gray-900">Paragraph Length</span>
                  <i className="fa-solid fa-check-circle text-secondary"></i>
                </div>
                <p className="text-xs text-gray-600">Average 3.2 sentences per paragraph (Optimal for web reading)</p>
              </div>

              <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium text-gray-900">Lists & Formatting</span>
                  <i className="fa-solid fa-check-circle text-secondary"></i>
                </div>
                <div className="text-xs text-gray-600">
                  <div>Bullet points: 12</div>
                  <div>Numbered lists: 4</div>
                  <div>Bold text: Well-used</div>
                </div>
              </div>

              <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium text-gray-900">Internal Links</span>
                  <i className="fa-solid fa-exclamation-triangle text-yellow-600"></i>
                </div>
                <p className="text-xs text-gray-600">Only 3 internal links found. Add 5-8 more to improve navigation.</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Duplicate Content */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Duplicate Content Check</h2>
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-start space-x-4 mb-6">
            <div className="w-16 h-16 bg-green-50 rounded-xl flex items-center justify-center flex-shrink-0">
              <i className="fa-solid fa-shield-check text-secondary text-2xl"></i>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 text-lg mb-2">94% Original Content</h3>
              <p className="text-gray-600">Your content is highly unique with minimal duplication detected across the web.</p>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="p-4 bg-gray-50 rounded-lg text-center">
              <div className="text-2xl font-bold text-gray-900 mb-1">0</div>
              <div className="text-xs text-gray-600">Exact Duplicates</div>
            </div>
            <div className="p-4 bg-gray-50 rounded-lg text-center">
              <div className="text-2xl font-bold text-gray-900 mb-1">2</div>
              <div className="text-xs text-gray-600">Partial Matches</div>
            </div>
            <div className="p-4 bg-gray-50 rounded-lg text-center">
              <div className="text-2xl font-bold text-gray-900 mb-1">6%</div>
              <div className="text-xs text-gray-600">Similar Passages</div>
            </div>
          </div>

          <div className="space-y-3">
            <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-start space-x-3">
                  <i className="fa-solid fa-exclamation-triangle text-yellow-600 mt-1"></i>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1">Partial Match Found</h4>
                    <p className="text-sm text-gray-600 mb-2">47% similarity with external source</p>
                    <a href="#" className="text-xs text-primary hover:underline">https://competitor-site.com/blog/seo-guide</a>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-sm text-gray-700">
                <i className="fa-solid fa-circle-info text-primary mr-2"></i>
                <strong>What This Means:</strong> Some sentences are similar to content elsewhere online, but this is normal for industry-standard information. Your unique perspective and examples make the content valuable.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Recommendations */}
      <div>
        <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
          <i className="fa-solid fa-wand-magic-sparkles text-primary mr-2"></i>
          Content Improvement Recommendations
        </h2>
        <div className="space-y-4">
          {recommendations.map((rec, idx) => (
            <div key={idx} className={`bg-white rounded-xl shadow-sm border-l-4 ${rec.color === 'green' ? 'border-green-500' : rec.color === 'yellow' ? 'border-yellow-500' : rec.color === 'blue' ? 'border-blue-500' : 'border-purple-500'} p-6`}>
              <div className="flex items-start space-x-4">
                <div className={`w-12 h-12 ${rec.color === 'green' ? 'bg-green-50' : rec.color === 'yellow' ? 'bg-yellow-50' : rec.color === 'blue' ? 'bg-blue-50' : 'bg-purple-50'} rounded-lg flex items-center justify-center flex-shrink-0`}>
                  <i className={`fa-solid ${rec.icon} ${rec.color === 'green' ? 'text-secondary' : rec.color === 'yellow' ? 'text-yellow-600' : rec.color === 'blue' ? 'text-primary' : 'text-purple-600'} text-lg`}></i>
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-semibold text-gray-900 text-lg">{rec.title}</h3>
                    <span className={`px-3 py-1 ${rec.badgeColor} text-xs font-semibold rounded-full`}>{rec.badge}</span>
                  </div>
                  <p className="text-gray-600 text-sm mb-4">{rec.content}</p>
                  
                  {rec.tip && (
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                      <p className="text-sm font-medium text-gray-900 mb-2">
                        <i className="fa-solid fa-graduation-cap text-primary mr-2"></i>
                        Why This Works:
                      </p>
                      <p className="text-sm text-gray-700">{rec.tip}</p>
                    </div>
                  )}
                  
                  {rec.steps && (
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                      <p className="text-sm font-medium text-gray-900 mb-3">
                        <i className="fa-solid fa-lightbulb text-primary mr-2"></i>
                        How to Implement:
                      </p>
                      <ul className="text-sm text-gray-700 space-y-2">
                        {rec.steps.map((step, sidx) => (
                          <li key={sidx} className="flex items-start">
                            <i className="fa-solid fa-circle text-xs text-primary mr-2 mt-1"></i>
                            {step}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  
                  {rec.keywords && (
                    <div className="mb-4">
                      <p className="text-sm font-medium text-gray-900 mb-2">Suggested LSI Keywords to Add:</p>
                      <div className="flex flex-wrap gap-2">
                        {rec.keywords.map((kw, kidx) => (
                          <span key={kidx} className="px-3 py-1.5 bg-blue-50 border border-blue-200 rounded-lg text-sm text-gray-700">{kw}</span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ContentAnalysis;