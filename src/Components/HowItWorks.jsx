const HowItWorks = () => {
  return (
    <section id="how-it-works-section" className="py-20 bg-gray-50">
      <div className="max-w-6xl mx-auto px-6">

        {/* Heading */}
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">How It Works</h2>
          <p className="text-xl text-gray-600">
            Get comprehensive SEO insights in three simple steps
          </p>
        </div>

        {/* Steps Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

          {/* Step 1 */}
          <div id="step-1" className="text-center">
            <div className="w-20 h-20 bg-primary rounded-full flex items-center justify-center mx-auto mb-6">
              <span className="text-3xl font-bold text-white">1</span>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">Enter Your URL</h3>
            <p className="text-gray-600">
              Simply paste your website URL into our analyzer and click the analyze button
            </p>
          </div>

          {/* Step 2 */}
          <div id="step-2" className="text-center">
            <div className="w-20 h-20 bg-primary rounded-full flex items-center justify-center mx-auto mb-6">
              <span className="text-3xl font-bold text-white">2</span>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">AI Analysis</h3>
            <p className="text-gray-600">
              Our intelligent agents scan your website for technical, content, and UX issues
            </p>
          </div>

          {/* Step 3 */}
          <div id="step-3" className="text-center">
            <div className="w-20 h-20 bg-primary rounded-full flex items-center justify-center mx-auto mb-6">
              <span className="text-3xl font-bold text-white">3</span>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">Get Recommendations</h3>
            <p className="text-gray-600">
              Receive actionable insights and prioritized recommendations to improve your SEO
            </p>
          </div>

        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
