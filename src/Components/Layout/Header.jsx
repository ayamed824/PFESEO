import React from 'react';
import { Link } from 'react-router-dom';
import logo from '../../assets/logo.jpeg'; // Ajustez le chemin selon votre structure

const Header = () => {
  return (
    <header id="header" className="bg-white border-b border-gray-200 fixed top-0 left-0 right-0 z-50">
      <nav className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <Link to="/dashboard" className="flex items-center space-x-3">
            {/* Logo dans le carré bleu */}
            <div className="w-10 h-10 bg-gradient-to-br from-primary to-accent rounded-lg flex items-center justify-center overflow-hidden">
              <img 
                src={logo} 
                alt="SEO Insights Logo" 
                className="w-6 h-6 object-contain"
              />
            </div>
            <span className="text-xl font-bold text-gray-900">SEO Insights</span>
          </Link>
          
          <div className="flex items-center space-x-8">
            <Link to="/features" className="text-gray-600 hover:text-gray-900 font-medium transition">Features</Link>
            <a href="/how-it-works" className="text-gray-600 hover:text-gray-900 font-medium transition">How It Works</a>
            <a href="/pricing" className="text-gray-600 hover:text-gray-900 font-medium transition">Pricing</a>
            
            <Link 
              to="/login" 
              className="px-5 py-2 text-primary border border-primary rounded-lg hover:bg-blue-50 font-medium transition"
            >
              Sign In
            </Link>
            
            <Link 
              to="/signup" 
              className="px-5 py-2 bg-primary text-white rounded-lg hover:bg-blue-700 font-medium transition"
            >
              Get Started
            </Link>
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Header;