import React from "react";
import Header from "../Header"; // import ok

function FeatureCard({ icon, color, title, description, items }) {
  return (
    <div className="bg-white border-2 border-gray-200 rounded-2xl p-8 hover:border-primary hover:shadow-xl transition">
      <div className={`w-14 h-14 ${color} rounded-xl flex items-center justify-center mb-6`}>
        <i className={`fa-solid ${icon} text-2xl`}></i>
      </div>
      <h3 className="text-2xl font-bold text-gray-900 mb-4">{title}</h3>
      <p className="text-gray-600 mb-6 leading-relaxed">{description}</p>
      <ul className="space-y-3">
        {items.map((item, index) => (
          <li key={index} className="flex items-start">
            <i className="fa-solid fa-check text-secondary mr-3 mt-1"></i>
            <span className="text-gray-700">{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function Features() {
  const features = [
    {
      icon: "fa-wrench",
      color: "bg-blue-100 text-primary",
      title: "Technical SEO Analysis",
      description:
        "Identify and fix technical issues that impact your search rankings. Get insights on page speed, mobile-friendliness, meta tags, sitemaps, and Core Web Vitals.",
      items: ["Performance & Core Web Vitals", "Meta tags & structured data", "Mobile responsiveness"],
    },
    {
      icon: "fa-file-lines",
      color: "bg-green-100 text-secondary",
      title: "Content Optimization",
      description:
        "Optimize your content for search engines and users. Analyze keyword usage, readability, content length, and originality to improve rankings.",
      items: ["Keyword optimization analysis", "Content quality & readability", "Duplicate content detection"],
    },
    {
      icon: "fa-desktop",
      color: "bg-purple-100 text-purple-600",
      title: "UX & Performance",
      description:
        "Evaluate user experience and accessibility. Ensure your website is easy to navigate, loads quickly, and provides an excellent experience for all users.",
      items: ["Navigation clarity score", "Accessibility compliance", "Mobile usability testing"],
    },
    {
      icon: "fa-robot",
      color: "bg-orange-100 text-orange-600",
      title: "AI Recommendations",
      description:
        "Get intelligent, prioritized recommendations from our AI agents. Each suggestion includes clear explanations and step-by-step guidance for implementation.",
      items: ["Priority-based action items", "Step-by-step implementation", "Impact assessment"],
    },
  ];

  return (
    <>
      <Header /> {/* ← ajoute le Header ici */}
      <section id="features-section" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Comprehensive SEO Analysis</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Our AI-powered agents analyze every aspect of your website to provide actionable insights and recommendations
            </p>
          </div>
          <div className="grid grid-cols-2 gap-8">
            {features.map((feature, idx) => (
              <FeatureCard key={idx} {...feature} />
            ))}
          </div>
        </div>
      </section>
    </>
  );
}