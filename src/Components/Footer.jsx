const Footer = () => {
  return (
    <footer className="bg-[#0B0F19] text-gray-300 pt-16 pb-10">
      <div className="max-w-6xl mx-auto px-6">

        {/* Header */}
        <div className="text-center mb-14">
          <h2 className="text-3xl font-bold text-white tracking-wide">
            SEO Insights
          </h2>
          <p className="text-gray-400 mt-2 text-sm">
            AI-powered SEO platform for smarter growth & performance
          </p>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

          {/* Card 1 */}
          <div className="bg-[#111827] p-6 rounded-2xl border border-gray-800 hover:border-indigo-500 transition">
            <h3 className="text-white text-lg font-semibold mb-4">About</h3>
            <p className="text-gray-400 text-sm leading-relaxed">
              We help businesses and students analyze SEO performance,
              optimize content, and grow online visibility using AI-driven insights.
            </p>
          </div>

          {/* Card 2 */}
          <div className="bg-[#111827] p-6 rounded-2xl border border-gray-800 hover:border-indigo-500 transition space-y-2">
            <h3 className="text-white text-lg font-semibold mb-4">Contact</h3>

            <p><span className="text-white">Email:</span> contact@seoinsights.com</p>
            <p><span className="text-white">Phone:</span> +216 00 000 000</p>
            <p><span className="text-white">Address:</span> Tunis, Tunisia</p>
            <p><span className="text-white">Support:</span> 24/7 Online</p>
          </div>

          {/* Card 3 */}
          <div className="bg-[#111827] p-6 rounded-2xl border border-gray-800 hover:border-indigo-500 transition space-y-2">
            <h3 className="text-white text-lg font-semibold mb-4">Social</h3>

            <p>Instagram: @seoinsights</p>
            <p>Facebook: SEO Insights</p>
            <p>LinkedIn: SEO Insights Official</p>

            <div className="pt-4 text-gray-500 text-xs">
              <p className="text-white mb-1">Working Hours</p>
              <p>Mon - Fri: 9AM - 6PM</p>
              <p>Sat: 10AM - 2PM</p>
            </div>
          </div>

        </div>

        {/* Bottom */}
        <div className="mt-14 border-t border-gray-800 pt-6 text-center text-gray-500 text-xs">
          © {new Date().getFullYear()} SEO Insights — All rights reserved
        </div>

      </div>
    </footer>
  );
};

export default Footer;