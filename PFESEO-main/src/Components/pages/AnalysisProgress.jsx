import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from "../Header";

const AnalysisProgress = ({ url }) => {
  const navigate = useNavigate();
  const [progress, setProgress] = useState(25);
  const [currentStep, setCurrentStep] = useState(1);
  const [timeRemaining, setTimeRemaining] = useState(45);

  useEffect(() => {
    const progressInterval = setInterval(() => {
      setProgress(prev => {
        const newProgress = prev + Math.random() * 15;
        if (newProgress >= 100) {
          clearInterval(progressInterval);
          setTimeout(() => navigate('/dashboard'), 1000);
          return 100;
        }
        return newProgress;
      });
    }, 2000);

    const timeInterval = setInterval(() => {
      setTimeRemaining(prev => Math.max(0, prev - 1));
    }, 1000);

    return () => {
      clearInterval(progressInterval);
      clearInterval(timeInterval);
    };
  }, [navigate]);

  useEffect(() => {
    if (progress >= 50 && currentStep === 1) setCurrentStep(2);
    if (progress >= 75 && currentStep === 2) setCurrentStep(3);
    if (progress >= 100 && currentStep === 3) setCurrentStep(4);
  }, [progress, currentStep]);

  const getStepStatus = (step) => {
    if (step < currentStep) return 'completed';
    if (step === currentStep) return 'loading';
    return 'pending';
  };

  const StepItem = ({ step, title, description, icon, stepNum }) => {
    const status = getStepStatus(stepNum);
    
    return (
      <div>
      <Header />
      <div className={`flex items-start space-x-4 pb-6 ${stepNum !== 4 ? 'border-b border-gray-100' : ''}`}>
        <div className="flex-shrink-0 mt-1">
          <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
            status === 'completed' ? 'bg-green-100' : 
            status === 'loading' ? 'bg-blue-100' : 'bg-gray-200'
          }`}>
            {status === 'completed' ? (
              <i className="fa-solid fa-check text-secondary text-lg"></i>
            ) : status === 'loading' ? (
              <i className="fa-solid fa-spinner spin-slow text-primary text-lg"></i>
            ) : (
              <i className="fa-solid fa-circle text-gray-400 text-xs"></i>
            )}
          </div>
        </div>
        <div className="flex-grow">
          <div className="flex items-center justify-between mb-2">
            <h3 className={`text-lg font-semibold ${status === 'pending' ? 'text-gray-400' : 'text-gray-900'}`}>
              {title}
            </h3>
            <span className={`px-3 py-1 text-xs font-semibold rounded-full ${
              status === 'completed' ? 'bg-green-100 text-secondary' :
              status === 'loading' ? 'bg-blue-100 text-primary pulse-subtle' :
              'bg-gray-100 text-gray-500'
            }`}>
              {status === 'completed' ? 'Completed' : status === 'loading' ? 'In Progress' : 'Pending'}
            </span>
          </div>
          <p className={`text-sm mb-3 ${status === 'pending' ? 'text-gray-500' : 'text-gray-600'}`}>
            {description}
          </p>
          <div className="w-full bg-gray-200 rounded-full h-1.5">
            <div className={`h-1.5 rounded-full transition-all duration-500 ${
              status === 'completed' ? 'bg-secondary w-full' :
              status === 'loading' ? 'bg-primary w-3/5' :
              'bg-gray-300 w-0'
            }`}></div>
          </div>
        </div>
      </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200">
        <nav className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-gradient-to-br from-primary to-accent rounded-lg flex items-center justify-center">
              <i className="fa-solid fa-chart-line text-white text-lg"></i>
            </div>
            <span className="text-xl font-bold text-gray-900">SEO Insights</span>
          </div>
        </nav>
      </header>

      <main className="min-h-screen flex items-center justify-center py-20 px-6">
        <div className="max-w-3xl w-full">
          
          <div className="bg-white rounded-2xl shadow-lg p-8 mb-8 border border-gray-200">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center">
                  <i className="fa-solid fa-globe text-primary text-xl"></i>
                </div>
                <div>
                  <p className="text-sm text-gray-500 font-medium">Analyzing Website</p>
                  <p className="text-lg font-semibold text-gray-900">{url}</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <button className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition">
                  <i className="fa-solid fa-minimize mr-2"></i>
                  Run in Background
                </button>
                <button 
                  onClick={() => navigate('/')}
                  className="px-4 py-2 text-sm font-medium text-red-600 bg-red-50 rounded-lg hover:bg-red-100 transition"
                >
                  <i className="fa-solid fa-xmark mr-2"></i>
                  Cancel
                </button>
              </div>
            </div>

            <div className="bg-gray-50 rounded-xl p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-700">Overall Progress</span>
                <span className="text-sm font-bold text-primary">{Math.round(progress)}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div 
                  className="bg-gradient-to-r from-primary to-accent h-2.5 rounded-full transition-all duration-500"
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-200">
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Analysis in Progress</h2>
              <p className="text-gray-600">Our AI agents are examining your website. This typically takes 30-60 seconds.</p>
            </div>

            <div className="space-y-6">
              <StepItem 
                stepNum={1}
                title="Technical Analysis"
                description="Scanning page speed, Core Web Vitals, meta tags, and mobile responsiveness"
              />
              <StepItem 
                stepNum={2}
                title="Content Analysis"
                description="Evaluating keyword optimization, content quality, and readability"
              />
              <StepItem 
                stepNum={3}
                title="UX/UI Analysis"
                description="Assessing navigation clarity, accessibility, and user experience"
              />
              <StepItem 
                stepNum={4}
                title="Popularity & Backlinks"
                description="Analyzing domain authority, backlinks, and social presence"
              />
            </div>

            <div className="mt-8 bg-blue-50 rounded-xl p-4 border border-blue-100">
              <div className="flex items-start space-x-3">
                <i className="fa-solid fa-info-circle text-primary text-lg mt-0.5"></i>
                <div>
                  <p className="text-sm font-medium text-gray-900 mb-1">What's happening now?</p>
                  <p className="text-sm text-gray-600">Our AI agents are thoroughly examining your website across multiple dimensions. Each analysis provides actionable insights to improve your search rankings.</p>
                </div>
              </div>
            </div>
          </div>

          <div className="text-center mt-6">
            <p className="text-sm text-gray-500">
              <i className="fa-regular fa-clock mr-2"></i>
              Estimated time remaining: <span className="font-semibold text-gray-700">{timeRemaining} seconds</span>
            </p>
          </div>

        </div>
      </main>
    </div>
  );
};

export default AnalysisProgress;