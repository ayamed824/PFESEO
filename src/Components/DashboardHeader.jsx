function DashboardHeader() {
  return (
    <header className="bg-white border-b fixed top-0 w-full z-50">
      <nav className="max-w-7xl mx-auto px-6 py-4 flex justify-between">

        <div className="flex items-center space-x-2">
          <div className="w-10 h-10 bg-gradient-to-br from-primary to-accent rounded-lg flex items-center justify-center">
            <i className="fa-solid fa-chart-line text-white"></i>
          </div>
          <span className="font-bold text-xl">SEO Insights</span>
        </div>

        <div className="flex space-x-6">
          <button className="text-gray-600 hover:text-black">Dashboard</button>
          <button className="text-gray-600 hover:text-black">Pricing</button>
        </div>

      </nav>
    </header>
  );
}

export default DashboardHeader;
