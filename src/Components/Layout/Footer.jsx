const Footer = () => {
  return (
    <footer className="bg-white border-t border-gray-100 pt-16 pb-10">
      <div className="max-w-6xl mx-auto px-6">

        {/* Header */}
        <div className="text-center mb-14">
          <div className="flex items-center justify-center gap-3 mb-3">
            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
            </div>
            <h2 className="text-3xl font-bold text-gray-900 tracking-wide">
              SEO Insights
            </h2>
          </div>
          <p className="text-gray-500 mt-2 text-sm">
            AI-powered SEO platform for smarter growth & performance
          </p>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

          {/* Card 1 - About */}
          <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100 hover:border-blue-200 hover:shadow-md transition duration-300">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-gray-900 text-lg font-semibold">About</h3>
            </div>
            <p className="text-gray-500 text-sm leading-relaxed">
              We help businesses and students analyze SEO performance,
              optimize content, and grow online visibility using AI-driven insights.
            </p>
          </div>

          {/* Card 2 - Contact */}
          <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100 hover:border-blue-200 hover:shadow-md transition duration-300">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-gray-900 text-lg font-semibold">Contact</h3>
            </div>
            <div className="space-y-2.5 text-sm">
              <p className="flex items-center gap-2 text-gray-500">
                <span className="w-1.5 h-1.5 bg-blue-500 rounded-full"></span>
                <span className="text-gray-700 font-medium">Email:</span> contact@seoinsights.com
              </p>
              <p className="flex items-center gap-2 text-gray-500">
                <span className="w-1.5 h-1.5 bg-blue-500 rounded-full"></span>
                <span className="text-gray-700 font-medium">Phone:</span> +216 00 000 000
              </p>
              <p className="flex items-center gap-2 text-gray-500">
                <span className="w-1.5 h-1.5 bg-blue-500 rounded-full"></span>
                <span className="text-gray-700 font-medium">Address:</span> Tunis, Tunisia
              </p>
              <p className="flex items-center gap-2 text-gray-500">
                <span className="w-1.5 h-1.5 bg-green-500 rounded-full"></span>
                <span className="text-gray-700 font-medium">Support:</span> 24/7 Online
              </p>
            </div>
          </div>

          {/* Card 3 - Social & Hours */}
          <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100 hover:border-blue-200 hover:shadow-md transition duration-300">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h3 className="text-gray-900 text-lg font-semibold">Social</h3>
            </div>
            <div className="space-y-2 text-sm text-gray-500 mb-4">
              <p>Instagram: @seoinsights</p>
              <p>Facebook: SEO Insights</p>
              <p>LinkedIn: SEO Insights Official</p>
            </div>
            <div className="pt-3 border-t border-gray-200">
              <p className="text-gray-700 font-medium text-sm mb-1.5">Working Hours</p>
              <div className="space-y-1 text-xs text-gray-500">
                <p>Mon - Fri: 9AM - 6PM</p>
                <p>Sat: 10AM - 2PM</p>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom */}
        <div className="mt-14 border-t border-gray-100 pt-6 flex flex-col md:flex-row items-center justify-between gap-3">
          <p className="text-gray-400 text-xs">
            © {new Date().getFullYear()} SEO Insights — All rights reserved
          </p>
          <div className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></span>
            <span className="text-xs text-gray-400">All systems operational</span>
          </div>
        </div>

      </div>
    </footer>
  );
};

export default Footer;