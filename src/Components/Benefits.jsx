const Benefits = () => {
  return (
    <section id="benefits-section" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

          {/* Left Column */}
          <div>
            <h2 className="text-4xl font-bold text-gray-900 mb-6">
              Why Choose SEO Insights?
            </h2>
            <p className="text-lg text-gray-600 mb-8">
              Our platform combines advanced AI technology with industry best practices to deliver comprehensive SEO analysis that's easy to understand and implement.
            </p>

            <div className="space-y-6">
              {/* Benefit 1 */}
              <div className="flex items-start">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mr-4 flex-shrink-0">
                  <i className="fa-solid fa-gauge-high text-primary text-xl"></i>
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2">Fast & Accurate</h3>
                  <p className="text-gray-600">
                    Get detailed analysis results in under 60 seconds with 99% accuracy
                  </p>
                </div>
              </div>

              {/* Benefit 2 */}
              <div className="flex items-start">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mr-4 flex-shrink-0">
                  <i className="fa-solid fa-graduation-cap text-secondary text-xl"></i>
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2">Educational</h3>
                  <p className="text-gray-600">
                    Learn SEO best practices with clear explanations and guides
                  </p>
                </div>
              </div>

              {/* Benefit 3 */}
              <div className="flex items-start">
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mr-4 flex-shrink-0">
                  <i className="fa-solid fa-chart-line text-purple-600 text-xl"></i>
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2">Actionable Insights</h3>
                  <p className="text-gray-600">
                    Prioritized recommendations with step-by-step implementation guides
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl p-8">
            <div className="bg-white rounded-xl shadow-lg p-6">
              
              {/* SEO Health Score Header */}
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-bold text-gray-900">SEO Health Score</h3>
                <span className="px-3 py-1 bg-green-100 text-secondary rounded-full text-sm font-semibold">
                  Good
                </span>
              </div>

              {/* Circular Score */}
              <div className="flex items-center justify-center mb-6">
                <div className="relative w-40 h-40">
                  <svg className="w-40 h-40 transform -rotate-90">
                    <circle cx="80" cy="80" r="70" stroke="#e5e7eb" strokeWidth="12" fill="none"></circle>
                    <circle
                      cx="80"
                      cy="80"
                      r="70"
                      stroke="#10b981"
                      strokeWidth="12"
                      fill="none"
                      strokeDasharray="440"
                      strokeDashoffset="88"
                      strokeLinecap="round"
                    ></circle>
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-4xl font-bold text-gray-900">78</span>
                  </div>
                </div>
              </div>

              {/* Bars */}
              <div className="space-y-4">

                {/* Technical SEO */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700">Technical SEO</span>
                    <span className="text-sm font-bold text-gray-900">85/100</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-secondary h-2 rounded-full" style={{ width: "85%" }}></div>
                  </div>
                </div>

                {/* Content Quality */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700">Content Quality</span>
                    <span className="text-sm font-bold text-gray-900">72/100</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-yellow-500 h-2 rounded-full" style={{ width: "72%" }}></div>
                  </div>
                </div>

                {/* UX & Performance */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700">UX & Performance</span>
                    <span className="text-sm font-bold text-gray-900">80/100</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-secondary h-2 rounded-full" style={{ width: "80%" }}></div>
                  </div>
                </div>

                {/* Popularity */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700">Popularity</span>
                    <span className="text-sm font-bold text-gray-900">65/100</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-orange-500 h-2 rounded-full" style={{ width: "65%" }}></div>
                  </div>
                </div>

              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default Benefits;
