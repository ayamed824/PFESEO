import React from 'react';

const TechnicalSEO = () => {
  const performanceMetrics = [
    { id: 'page-speed', icon: 'fa-gauge-high', color: 'bg-green-50', iconColor: 'text-secondary', status: 'Good', statusColor: 'bg-green-100 text-secondary', label: 'Page Speed', value: '2.4', unit: 's', width: '76%' },
    { id: 'lcp', icon: 'fa-image', color: 'bg-green-50', iconColor: 'text-secondary', status: 'Good', statusColor: 'bg-green-100 text-secondary', label: 'Largest Contentful Paint', value: '1.8', unit: 's', width: '72%' },
    { id: 'fid', icon: 'fa-hand-pointer', color: 'bg-yellow-50', iconColor: 'text-yellow-500', status: 'Moderate', statusColor: 'bg-yellow-100 text-yellow-700', label: 'First Input Delay', value: '150', unit: 'ms', width: '60%', barColor: 'bg-yellow-400' },
    { id: 'cls', icon: 'fa-arrows-up-down', color: 'bg-green-50', iconColor: 'text-secondary', status: 'Good', statusColor: 'bg-green-100 text-secondary', label: 'Cumulative Layout Shift', value: '0.05', unit: '', width: '95%' },
  ];

  const metaTags = [
    { id: 'title-tag', status: 'good', title: 'Title Tag', desc: 'Optimal length (58 characters)', detail: '"Professional SEO Services | Example Company"' },
    { id: 'meta-description', status: 'good', title: 'Meta Description', desc: 'Good length (148 characters)', detail: '"Boost your online presence with our expert SEO services..."' },
    { id: 'h1-tag', status: 'warning', title: 'H1 Heading', desc: 'Multiple H1 tags detected (2 found)', recommendation: 'Recommendation: Use only one H1 per page' },
    { id: 'h2-h6-tags', status: 'good', title: 'Heading Structure (H2-H6)', desc: 'Proper hierarchy detected', detail: 'H2: 5, H3: 8, H4: 3' },
  ];

  const criticalIssues = [
    {
      id: 1,
      icon: 'fa-triangle-exclamation',
      title: 'Broken Internal Links Detected',
      desc: 'Found 12 broken internal links that lead to 404 error pages. This negatively impacts user experience and crawlability.',
      example: '/products/discontinued-item-2022',
      actions: ['Audit all internal links using a crawler tool', 'Update or remove broken links from content', 'Implement 301 redirects for moved pages', 'Set up automated link monitoring']
    },
    {
      id: 2,
      icon: 'fa-shield-halved',
      title: 'Missing SSL Certificate on Subdomains',
      desc: '2 subdomains are not using HTTPS, which can harm trust and SEO rankings. Modern browsers flag these as insecure.',
      example: 'blog.example.com, shop.example.com',
      actions: ['Install SSL certificates for all subdomains', 'Configure automatic HTTPS redirects', 'Update internal links to use HTTPS', 'Enable HSTS (HTTP Strict Transport Security)']
    },
    {
      id: 3,
      icon: 'fa-copy',
      title: 'Duplicate Content Issues',
      desc: '8 pages have duplicate or near-duplicate content, which can cause search engines to devalue your pages.',
      example: '/services/seo-consulting, /seo-consulting-services',
      actions: ['Implement canonical tags for similar pages', 'Consolidate duplicate pages with 301 redirects', 'Rewrite content to make it unique', 'Use parameter handling in Google Search Console']
    }
  ];

  const mediumIssues = [
    { icon: 'fa-image', title: 'Missing Alt Text on Images', desc: '23 images are missing alt attributes, affecting accessibility and image SEO.', step: 'Add descriptive alt text to all images for better accessibility and SEO.' },
    { icon: 'fa-compress', title: 'Large Image File Sizes', desc: '15 images exceed 500KB, slowing down page load times significantly.', step: 'Compress images using modern formats (WebP) and implement lazy loading.' },
    { icon: 'fa-code', title: 'Render-Blocking JavaScript', desc: '5 JavaScript files are blocking initial page render, delaying content visibility.', step: 'Defer or async load non-critical JavaScript files.' },
  ];

  const lowIssues = [
    { icon: 'fa-font', title: 'Font Loading Optimization', desc: 'Custom fonts are not using font-display property, which can cause text rendering delays.', step: 'Add font-display: swap to CSS for better text rendering.' },
    { icon: 'fa-link', title: 'External Links Without rel="noopener"', desc: '18 external links are missing rel="noopener" attribute, a minor security consideration.', step: 'Add rel="noopener noreferrer" to external links for security.' },
  ];

  return (
    <div>
      <div className="mb-8">
        <div className="flex items-center justify-between mb-2">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Technical SEO Analysis</h1>
            <p className="text-gray-600 mt-1">Comprehensive technical health assessment of your website</p>
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

      <div className="mb-8">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Performance Metrics</h2>
        <div className="grid grid-cols-4 gap-6">
          {performanceMetrics.map((metric) => (
            <div key={metric.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <div className={`w-12 h-12 ${metric.color} rounded-lg flex items-center justify-center`}>
                  <i className={`fa-solid ${metric.icon} ${metric.iconColor} text-xl`}></i>
                </div>
                <span className={`px-3 py-1 ${metric.statusColor} text-xs font-semibold rounded-full`}>{metric.status}</span>
              </div>
              <h3 className="text-gray-600 font-medium text-sm mb-2">{metric.label}</h3>
              <div className="flex items-baseline">
                <span className="text-3xl font-bold text-gray-900">{metric.value}</span>
                {metric.unit && <span className="text-gray-500 text-sm ml-1">{metric.unit}</span>}
              </div>
              <div className="mt-4 w-full bg-gray-200 rounded-full h-2">
                <div className={`${metric.barColor || 'bg-secondary'} h-2 rounded-full`} style={{width: metric.width}}></div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Meta Tags Status</h2>
          <div className="space-y-4">
            {metaTags.map((tag) => (
              <div key={tag.id} className={`flex items-start justify-between p-4 ${tag.status === 'good' ? 'bg-green-50 border-green-200' : 'bg-yellow-50 border-yellow-200'} border rounded-lg`}>
                <div className="flex items-start space-x-3">
                  <div className={`w-6 h-6 ${tag.status === 'good' ? 'bg-secondary' : 'bg-yellow-500'} rounded-full flex items-center justify-center flex-shrink-0 mt-0.5`}>
                    <i className={`fa-solid ${tag.status === 'good' ? 'fa-check' : 'fa-exclamation'} text-white text-xs`}></i>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1">{tag.title}</h4>
                    <p className="text-sm text-gray-600 mb-2">{tag.desc}</p>
                    {tag.detail && <p className="text-xs text-gray-500 italic">{tag.detail}</p>}
                    {tag.recommendation && <p className="text-xs text-yellow-700 mt-1">{tag.recommendation}</p>}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Sitemap & Configuration</h2>
          <div className="space-y-4">
            <div className="p-6 bg-green-50 border border-green-200 rounded-lg">
              <div className="flex items-start space-x-3 mb-4">
                <div className="w-10 h-10 bg-secondary rounded-full flex items-center justify-center flex-shrink-0">
                  <i className="fa-solid fa-sitemap text-white text-lg"></i>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-1">XML Sitemap</h4>
                  <span className="px-2 py-1 bg-green-200 text-secondary text-xs font-semibold rounded">Found</span>
                </div>
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between"><span className="text-gray-600">Location:</span><span className="text-gray-900 font-medium">/sitemap.xml</span></div>
                <div className="flex justify-between"><span className="text-gray-600">Total URLs:</span><span className="text-gray-900 font-medium">247</span></div>
                <div className="flex justify-between"><span className="text-gray-600">Last Modified:</span><span className="text-gray-900 font-medium">2 days ago</span></div>
              </div>
            </div>

            <div className="p-6 bg-green-50 border border-green-200 rounded-lg">
              <div className="flex items-start space-x-3 mb-4">
                <div className="w-10 h-10 bg-secondary rounded-full flex items-center justify-center flex-shrink-0">
                  <i className="fa-solid fa-robot text-white text-lg"></i>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-1">Robots.txt</h4>
                  <span className="px-2 py-1 bg-green-200 text-secondary text-xs font-semibold rounded">Valid</span>
                </div>
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between"><span className="text-gray-600">Location:</span><span className="text-gray-900 font-medium">/robots.txt</span></div>
                <div className="flex justify-between"><span className="text-gray-600">Sitemap Reference:</span><span className="text-secondary font-medium">Present</span></div>
                <div className="flex justify-between"><span className="text-gray-600">Blocked Paths:</span><span className="text-gray-900 font-medium">3</span></div>
              </div>
            </div>

            <div className="p-6 bg-green-50 border border-green-200 rounded-lg">
              <div className="flex items-start space-x-3 mb-4">
                <div className="w-10 h-10 bg-secondary rounded-full flex items-center justify-center flex-shrink-0">
                  <i className="fa-solid fa-mobile-screen text-white text-lg"></i>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-1">Mobile-Friendly Test</h4>
                  <span className="px-2 py-1 bg-green-200 text-secondary text-xs font-semibold rounded">Passed</span>
                </div>
              </div>
              <p className="text-sm text-gray-600">Your site is optimized for mobile devices with responsive design implementation.</p>
            </div>
          </div>
        </div>
      </div>

      <div className="mb-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-900">Technical Issues</h2>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-red-500 rounded-full"></div>
              <span className="text-sm text-gray-600">Critical: 3</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
              <span className="text-sm text-gray-600">Medium: 7</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <span className="text-sm text-gray-600">Low: 5</span>
            </div>
          </div>
        </div>

        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <div className="w-2 h-6 bg-red-500 rounded mr-3"></div>
            Critical Issues
          </h3>
          <div className="space-y-4">
            {criticalIssues.map((issue) => (
              <div key={issue.id} className="bg-white rounded-xl border-l-4 border-red-500 shadow-sm p-6">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-start space-x-4">
                    <div className="w-10 h-10 bg-red-50 rounded-lg flex items-center justify-center flex-shrink-0">
                      <i className={`fa-solid ${issue.icon} text-red-500 text-lg`}></i>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 text-lg mb-2">{issue.title}</h4>
                      <p className="text-gray-600 text-sm mb-3">{issue.desc}</p>
                      <div className="bg-gray-50 rounded-lg p-3 mb-3">
                        <p className="text-xs text-gray-500 font-medium mb-1">Example:</p>
                        <code className="text-xs text-red-600">{issue.example}</code>
                      </div>
                      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                        <p className="text-sm font-medium text-gray-900 mb-2 flex items-center">
                          <i className="fa-solid fa-lightbulb text-primary mr-2"></i>
                          Recommended Action:
                        </p>
                        <ul className="text-sm text-gray-700 space-y-1 ml-6">
                          {issue.actions.map((action, idx) => (
                            <li key={idx}>• {action}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <div className="w-2 h-6 bg-orange-500 rounded mr-3"></div>
            Medium Priority Issues
          </h3>
          <div className="space-y-4">
            {mediumIssues.map((issue, idx) => (
              <div key={idx} className="bg-white rounded-xl border-l-4 border-orange-500 shadow-sm p-6">
                <div className="flex items-start space-x-4">
                  <div className="w-10 h-10 bg-orange-50 rounded-lg flex items-center justify-center flex-shrink-0">
                    <i className={`fa-solid ${issue.icon} text-orange-500 text-lg`}></i>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">{issue.title}</h4>
                    <p className="text-gray-600 text-sm mb-3">{issue.desc}</p>
                    <p className="text-sm text-gray-700"><strong>Next Step:</strong> {issue.step}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <div className="w-2 h-6 bg-green-500 rounded mr-3"></div>
            Low Priority Issues
          </h3>
          <div className="space-y-4">
            {lowIssues.map((issue, idx) => (
              <div key={idx} className="bg-white rounded-xl border-l-4 border-green-500 shadow-sm p-6">
                <div className="flex items-start space-x-4">
                  <div className="w-10 h-10 bg-green-50 rounded-lg flex items-center justify-center flex-shrink-0">
                    <i className={`fa-solid ${issue.icon} text-secondary text-lg`}></i>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">{issue.title}</h4>
                    <p className="text-gray-600 text-sm mb-3">{issue.desc}</p>
                    <p className="text-sm text-gray-700"><strong>Next Step:</strong> {issue.step}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TechnicalSEO;