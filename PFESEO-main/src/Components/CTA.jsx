// src/pages/CTA.jsx
import React from "react";

const CTA = () => {
  return (
    <section id="cta-section" className="py-20 bg-gradient-to-br from-primary to-accent">
      <div className="max-w-4xl mx-auto px-6 text-center">

        <h2 className="text-4xl font-bold text-white mb-6">
          Ready to Improve Your SEO?
        </h2>

        <p className="text-xl text-blue-100 mb-10">
          Start your free analysis today and discover how to boost your search rankings
        </p>

        <button className="px-8 py-4 bg-white text-primary rounded-lg font-semibold text-lg hover:bg-gray-100 transition inline-flex items-center justify-center">
          <i className="fa-solid fa-rocket mr-2"></i>
          Get Started Free
        </button>

        <p className="text-blue-100 mt-6">
          No credit card required • Free forever plan available
        </p>

      </div>
    </section>
  );
};

export default CTA;
