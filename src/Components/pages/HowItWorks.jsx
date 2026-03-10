import React from "react";
import Header from "../Header"; // import ok

export default function HowItWorks() {
  const steps = [
    { number: 1, title: "Enter Your URL", desc: "Simply paste your website URL into our analyzer and click the analyze button" },
    { number: 2, title: "AI Analysis", desc: "Our intelligent agents scan your website for technical, content, and UX issues" },
    { number: 3, title: "Get Recommendations", desc: "Receive actionable insights and prioritized recommendations to improve your SEO" },
  ];

  return (
    <>
      <Header /> {/* ← ajoute le Header ici */}
      <section id="how-it-works-section" className="py-20 bg-gray-50">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">How It Works</h2>
          <p className="text-xl text-gray-600 mb-16">
            Get comprehensive SEO insights in three simple steps
          </p>

          <div className="grid grid-cols-3 gap-8">
            {steps.map((step) => (
              <div key={step.number}>
                <div className="w-20 h-20 bg-primary rounded-full flex items-center justify-center mx-auto mb-6">
                  <span className="text-3xl font-bold text-white">{step.number}</span>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{step.title}</h3>
                <p className="text-gray-600">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}