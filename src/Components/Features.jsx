const Features = () => {
  return (
    <section id="features-section" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-6">

        {/* Heading */}
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Comprehensive SEO Analysis
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Our AI-powered agents analyze every aspect of your website to provide actionable insights and recommendations
          </p>
        </div>

        {/* Feature Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

          {/* Feature Card 1 */}
          <div className="bg-white border-2 border-gray-200 rounded-2xl p-8 hover:border-primary hover:shadow-xl transition">
            <div className="w-14 h-14 bg-blue-100 rounded-xl flex items-center justify-center mb-6">
              <i className="fa-solid fa-wrench text-primary text-2xl"></i>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Technical SEO Analysis</h3>
            <p className="text-gray-600 mb-6 leading-relaxed">
              Identify and fix technical issues that impact your search rankings. Get insights on page speed, mobile-friendliness, meta tags, sitemaps, and Core Web Vitals.
            </p>
            <ul className="space-y-3">
              <li className="flex items-start">
                <i className="fa-solid fa-check text-secondary mr-3 mt-1"></i>
                <span className="text-gray-700">Performance & Core Web Vitals</span>
              </li>
              <li className="flex items-start">
                <i className="fa-solid fa-check text-secondary mr-3 mt-1"></i>
                <span className="text-gray-700">Meta tags & structured data</span>
              </li>
              <li className="flex items-start">
                <i className="fa-solid fa-check text-secondary mr-3 mt-1"></i>
                <span className="text-gray-700">Mobile responsiveness</span>
              </li>
            </ul>
          </div>

          {/* Feature Card 2 */}
          <div className="bg-white border-2 border-gray-200 rounded-2xl p-8 hover:border-primary hover:shadow-xl transition">
            <div className="w-14 h-14 bg-green-100 rounded-xl flex items-center justify-center mb-6">
              <i className="fa-solid fa-file-lines text-secondary text-2xl"></i>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Content Optimization</h3>
            <p className="text-gray-600 mb-6 leading-relaxed">
              Optimize your content for search engines and users. Analyze keyword usage, readability, content length, and originality to improve rankings.
            </p>
            <ul className="space-y-3">
              <li className="flex items-start">
                <i className="fa-solid fa-check text-secondary mr-3 mt-1"></i>
                <span className="text-gray-700">Keyword optimization analysis</span>
              </li>
              <li className="flex items-start">
                <i className="fa-solid fa-check text-secondary mr-3 mt-1"></i>
                <span className="text-gray-700">Content quality & readability</span>
              </li>
              <li className="flex items-start">
                <i className="fa-solid fa-check text-secondary mr-3 mt-1"></i>
                <span className="text-gray-700">Duplicate content detection</span>
              </li>
            </ul>
          </div>

          {/* Feature Card 3 */}
          <div className="bg-white border-2 border-gray-200 rounded-2xl p-8 hover:border-primary hover:shadow-xl transition">
            <div className="w-14 h-14 bg-purple-100 rounded-xl flex items-center justify-center mb-6">
              <i className="fa-solid fa-desktop text-purple-600 text-2xl"></i>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-4">UX & Performance</h3>
            <p className="text-gray-600 mb-6 leading-relaxed">
              Evaluate user experience and accessibility. Ensure your website is easy to navigate, loads quickly, and provides an excellent experience for all users.
            </p>
            <ul className="space-y-3">
              <li className="flex items-start">
                <i className="fa-solid fa-check text-secondary mr-3 mt-1"></i>
                <span className="text-gray-700">Navigation clarity score</span>
              </li>
              <li className="flex items-start">
                <i className="fa-solid fa-check text-secondary mr-3 mt-1"></i>
                <span className="text-gray-700">Accessibility compliance</span>
              </li>
              <li className="flex items-start">
                <i className="fa-solid fa-check text-secondary mr-3 mt-1"></i>
                <span className="text-gray-700">Mobile usability testing</span>
              </li>
            </ul>
          </div>

          {/* Feature Card 4 */}
          <div className="bg-white border-2 border-gray-200 rounded-2xl p-8 hover:border-primary hover:shadow-xl transition">
            <div className="w-14 h-14 bg-orange-100 rounded-xl flex items-center justify-center mb-6">
              <i className="fa-solid fa-robot text-orange-600 text-2xl"></i>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-4">AI Recommendations</h3>
            <p className="text-gray-600 mb-6 leading-relaxed">
              Get intelligent, prioritized recommendations from our AI agents. Each suggestion includes clear explanations and step-by-step guidance for implementation.
            </p>
            <ul className="space-y-3">
              <li className="flex items-start">
                <i className="fa-solid fa-check text-secondary mr-3 mt-1"></i>
                <span className="text-gray-700">Priority-based action items</span>
              </li>
              <li className="flex items-start">
                <i className="fa-solid fa-check text-secondary mr-3 mt-1"></i>
                <span className="text-gray-700">Step-by-step implementation</span>
              </li>
              <li className="flex items-start">
                <i className="fa-solid fa-check text-secondary mr-3 mt-1"></i>
                <span className="text-gray-700">Impact assessment</span>
              </li>
            </ul>
          </div>

        </div>
      </div>
    </section>
  );
};

export default Features;
