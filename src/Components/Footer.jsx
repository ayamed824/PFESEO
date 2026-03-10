const Footer = () => {
  return (
    <footer id="footer" className="bg-gray-900 text-gray-300 py-12">
      <div className="max-w-7xl mx-auto px-6">

        {/* Top Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          
          {/* Brand */}
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-8 h-8 bg-gradient-to-br from-primary to-accent rounded-lg flex items-center justify-center">
                <i className="fa-solid fa-chart-line text-white"></i>
              </div>
              <span className="text-lg font-bold text-white">SEO Insights</span>
            </div>
            <p className="text-sm text-gray-400">
              AI-powered SEO analysis platform for businesses and students
            </p>
          </div>

          {/* Product */}
          <div>
            <h3 className="text-white font-semibold mb-4">Product</h3>
            <ul className="space-y-2 text-sm">
              <li><a href="#!" className="hover:text-white transition">Features</a></li>
              <li><a href="#!" className="hover:text-white transition">Pricing</a></li>
              <li><a href="#!" className="hover:text-white transition">Documentation</a></li>
              <li><a href="#!" className="hover:text-white transition">API</a></li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="text-white font-semibold mb-4">Company</h3>
            <ul className="space-y-2 text-sm">
              <li><a href="#!" className="hover:text-white transition">About Us</a></li>
              <li><a href="#!" className="hover:text-white transition">Blog</a></li>
              <li><a href="#!" className="hover:text-white transition">Careers</a></li>
              <li><a href="#!" className="hover:text-white transition">Contact</a></li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="text-white font-semibold mb-4">Legal</h3>
            <ul className="space-y-2 text-sm">
              <li><a href="#!" className="hover:text-white transition">Privacy Policy</a></li>
              <li><a href="#!" className="hover:text-white transition">Terms of Service</a></li>
              <li><a href="#!" className="hover:text-white transition">Cookie Policy</a></li>
            </ul>
          </div>

        </div>

        {/* Bottom */}
        <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row items-center justify-between">
          <p className="text-sm text-gray-400">© 2024 SEO Insights. All rights reserved.</p>
          <div className="flex items-center space-x-4 mt-4 md:mt-0">
            <a href="#!" className="text-gray-400 hover:text-white transition"><i className="fa-brands fa-twitter"></i></a>
            <a href="#!" className="text-gray-400 hover:text-white transition"><i className="fa-brands fa-linkedin"></i></a>
            <a href="#!" className="text-gray-400 hover:text-white transition"><i className="fa-brands fa-github"></i></a>
          </div>
        </div>

      </div>
    </footer>
  );
};

export default Footer;
