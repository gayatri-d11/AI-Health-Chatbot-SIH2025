import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const NewLandingPage = () => {
  const [selectedLanguage, setSelectedLanguage] = useState('English');
  
  const languages = [
    'English', 'Hindi', 'Telugu', 'Tamil', 'Bengali', 
    'Gujarati', 'Marathi', 'Punjabi', 'Kannada', 'Malayalam'
  ];

  const features = [
    {
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
        </svg>
      ),
      title: "AI Health Assistant",
      description: "24/7 medical consultation powered by advanced AI technology"
    },
    {
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
        </svg>
      ),
      title: "Multilingual Support",
      description: "Communicate in 10+ Indian languages with real-time translation"
    },
    {
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
        </svg>
      ),
      title: "Multi-Channel Access",
      description: "Available via WhatsApp, SMS, Voice calls, and Web platform"
    },
    {
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
        </svg>
      ),
      title: "Health Alerts",
      description: "Real-time notifications for health emergencies and vaccination updates"
    },
    {
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      title: "Health Assessment",
      description: "Interactive questionnaires with personalized health recommendations"
    },
    {
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
        </svg>
      ),
      title: "Vaccination Info",
      description: "Find vaccination centers and track immunization schedules"
    }
  ];

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-health-600 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </div>
              <span className="ml-3 text-xl font-semibold text-slate-900">AI Health Assistant</span>
            </div>
            
            <div className="flex items-center space-x-4">
              <select 
                value={selectedLanguage}
                onChange={(e) => setSelectedLanguage(e.target.value)}
                className="language-selector focus-ring"
              >
                {languages.map(lang => (
                  <option key={lang} value={lang}>{lang}</option>
                ))}
              </select>
              
              <div className="flex space-x-2">
                <Link 
                  to="/login" 
                  className="px-4 py-2 text-slate-600 hover:text-health-600 font-medium transition-colors focus-ring rounded-lg"
                >
                  Login
                </Link>
                <Link 
                  to="/register" 
                  className="px-6 py-2 bg-health-600 text-white rounded-lg hover:bg-health-700 font-medium transition-all btn-primary focus-ring"
                >
                  Get Started
                </Link>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative py-20 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 overflow-hidden">
        {/* Animated Background Elements */}
        <div className="absolute inset-0">
          <div className="absolute top-20 left-10 w-32 h-32 bg-blue-200 rounded-full opacity-20 animate-pulse"></div>
          <div className="absolute top-40 right-20 w-24 h-24 bg-purple-200 rounded-full opacity-30 animate-bounce" style={{animationDelay: '1s'}}></div>
          <div className="absolute bottom-20 left-1/4 w-16 h-16 bg-indigo-200 rounded-full opacity-25 animate-pulse" style={{animationDelay: '2s'}}></div>
          <div className="absolute top-1/3 right-1/3 w-20 h-20 bg-pink-200 rounded-full opacity-20 animate-bounce" style={{animationDelay: '3s'}}></div>
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center animate-fadeIn">
            {/* Enhanced Hero Icon */}
            <div className="relative mb-8">
              <div className="w-32 h-32 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto shadow-2xl animate-bounce">
                <span className="text-5xl">🩺</span>
              </div>
              <div className="absolute -top-2 -right-2 w-8 h-8 bg-green-500 rounded-full flex items-center justify-center animate-pulse">
                <span className="text-white text-xs font-bold">AI</span>
              </div>
            </div>
            
            {/* Enhanced Title */}
            <h1 className="text-6xl md:text-7xl font-bold text-gray-900 mb-6 leading-tight">
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Smart Health
              </span>
              <br />
              <span className="text-gray-800">AI Assistant</span>
              <div className="text-lg font-normal text-gray-600 mt-4">
                🌍 Available in {languages.length}+ Indian Languages
              </div>
            </h1>
            
            {/* Enhanced Description */}
            <div className="max-w-4xl mx-auto mb-12">
              <p className="text-2xl text-gray-700 mb-6 leading-relaxed">
                🚀 <strong>Instant AI-powered healthcare consultation</strong> in your native language
              </p>
              <div className="grid md:grid-cols-3 gap-6 text-center">
                <div className="bg-white/70 backdrop-blur-sm p-4 rounded-xl shadow-lg">
                  <span className="text-3xl mb-2 block">⚡</span>
                  <div className="font-semibold text-gray-900">Instant Response</div>
                  <div className="text-sm text-gray-600">Get answers in seconds</div>
                </div>
                <div className="bg-white/70 backdrop-blur-sm p-4 rounded-xl shadow-lg">
                  <span className="text-3xl mb-2 block">🔒</span>
                  <div className="font-semibold text-gray-900">100% Private</div>
                  <div className="text-sm text-gray-600">Your data is secure</div>
                </div>
                <div className="bg-white/70 backdrop-blur-sm p-4 rounded-xl shadow-lg">
                  <span className="text-3xl mb-2 block">🆓</span>
                  <div className="font-semibold text-gray-900">Completely Free</div>
                  <div className="text-sm text-gray-600">No hidden charges</div>
                </div>
              </div>
            </div>
            
            {/* Enhanced CTA Buttons */}
            <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-6 mb-8">
              <Link 
                to="/register" 
                className="group px-10 py-5 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-2xl text-xl font-bold hover:from-blue-700 hover:to-purple-700 transition-all duration-300 shadow-2xl hover:shadow-blue-500/25 transform hover:-translate-y-1 focus-ring"
              >
                <span className="flex items-center justify-center space-x-3">
                  <span>🩺</span>
                  <span>Start Free Consultation</span>
                  <svg className="w-6 h-6 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </span>
              </Link>
              <Link 
                to="/admin-login" 
                className="group px-10 py-5 border-3 border-gray-300 text-gray-700 rounded-2xl text-xl font-bold hover:border-blue-600 hover:text-blue-600 hover:bg-blue-50 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1 focus-ring"
              >
                <span className="flex items-center justify-center space-x-3">
                  <span>🔐</span>
                  <span>Admin Portal</span>
                </span>
              </Link>
            </div>
            
            {/* Trust Indicators */}
            <div className="flex flex-wrap justify-center items-center space-x-8 text-sm text-gray-600">
              <div className="flex items-center space-x-2">
                <span className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></span>
                <span>✅ HIPAA Compliant</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="w-3 h-3 bg-blue-500 rounded-full animate-pulse"></span>
                <span>🛡️ End-to-End Encrypted</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="w-3 h-3 bg-purple-500 rounded-full animate-pulse"></span>
                <span>🏛️ Government Approved</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Enhanced Features Grid */}
      <section className="py-20 bg-gradient-to-br from-gray-50 to-blue-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-bold text-gray-900 mb-6">
              🚀 <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Powerful Features</span>
            </h2>
            <p className="text-2xl text-gray-600 max-w-3xl mx-auto">
              Everything you need for comprehensive healthcare assistance
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: '🤖',
                title: 'AI Health Assistant',
                description: '24/7 medical consultation powered by advanced AI technology',
                color: 'from-blue-500 to-cyan-500'
              },
              {
                icon: '🌍',
                title: 'Multilingual Support',
                description: 'Communicate in 10+ Indian languages with real-time translation',
                color: 'from-green-500 to-emerald-500'
              },
              {
                icon: '📱',
                title: 'Multi-Channel Access',
                description: 'Available via WhatsApp, SMS, Voice calls, and Web platform',
                color: 'from-purple-500 to-violet-500'
              },
              {
                icon: '🚨',
                title: 'Health Alerts',
                description: 'Real-time notifications for health emergencies and vaccination updates',
                color: 'from-red-500 to-pink-500'
              },
              {
                icon: '✅',
                title: 'Health Assessment',
                description: 'Interactive questionnaires with personalized health recommendations',
                color: 'from-orange-500 to-yellow-500'
              },
              {
                icon: '💉',
                title: 'Vaccination Info',
                description: 'Find vaccination centers and track immunization schedules',
                color: 'from-teal-500 to-cyan-500'
              }
            ].map((feature, idx) => (
              <div key={idx} className="group card-hover bg-white p-8 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2">
                <div className={`w-20 h-20 bg-gradient-to-r ${feature.color} rounded-2xl flex items-center justify-center mx-auto mb-6 text-3xl shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold mb-4 text-center text-gray-900 group-hover:text-blue-600 transition-colors">
                  {feature.title}
                </h3>
                <p className="text-gray-600 text-center leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Enhanced Stats Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 text-white relative overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0">
          <div className="absolute top-0 left-0 w-full h-full opacity-10">
            <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-white rounded-full filter blur-3xl animate-pulse"></div>
            <div className="absolute bottom-1/4 right-1/4 w-48 h-48 bg-yellow-300 rounded-full filter blur-3xl animate-pulse" style={{animationDelay: '2s'}}></div>
          </div>
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-bold mb-6">📊 Our Impact Across India</h2>
            <p className="text-2xl text-blue-100">Transforming healthcare accessibility for millions</p>
          </div>
          
          <div className="grid md:grid-cols-4 gap-8">
            {[
              { number: "10+", label: "Languages Supported", icon: "🌍", desc: "Indian Languages" },
              { number: "24/7", label: "Always Available", icon: "⏰", desc: "Round the Clock" },
              { number: "1000+", label: "Health Topics", icon: "📚", desc: "Medical Knowledge" },
              { number: "98.5%", label: "AI Accuracy", icon: "🎯", desc: "Precision Rate" }
            ].map((stat, idx) => (
              <div key={idx} className="text-center group animate-fadeIn" style={{animationDelay: `${idx * 0.2}s`}}>
                <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 hover:bg-white/20 transition-all duration-300 transform hover:scale-105 shadow-xl">
                  <div className="text-4xl mb-4 group-hover:scale-110 transition-transform">{stat.icon}</div>
                  <div className="text-6xl font-bold mb-3 group-hover:scale-110 transition-transform">{stat.number}</div>
                  <div className="text-xl font-semibold mb-2">{stat.label}</div>
                  <div className="text-blue-200 text-sm">{stat.desc}</div>
                </div>
              </div>
            ))}
          </div>
          
          {/* Additional Impact Metrics */}
          <div className="mt-16 text-center">
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 max-w-4xl mx-auto">
              <h3 className="text-2xl font-bold mb-6">🏆 Trusted by Healthcare Professionals</h3>
              <div className="grid md:grid-cols-3 gap-6 text-center">
                <div>
                  <div className="text-3xl font-bold text-yellow-300">500+</div>
                  <div className="text-blue-100">Partner Hospitals</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-green-300">50K+</div>
                  <div className="text-blue-100">Happy Users</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-pink-300">99.9%</div>
                  <div className="text-blue-100">Uptime</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-slate-900 text-white">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold mb-8">
            Ready to Access Quality Healthcare?
          </h2>
          <p className="text-xl mb-12 text-slate-300 leading-relaxed">
            Join thousands of users accessing professional healthcare assistance 
            through our AI-powered platform.
          </p>
          
          <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-6">
            <Link 
              to="/register" 
              className="px-10 py-4 bg-health-600 text-white rounded-lg text-lg font-semibold hover:bg-health-700 transition-all btn-primary focus-ring"
            >
              Start Free Consultation
            </Link>
            <Link 
              to="/login" 
              className="px-10 py-4 border-2 border-white text-white rounded-lg text-lg font-semibold hover:bg-white hover:text-slate-900 transition-all focus-ring"
            >
              User Login
            </Link>
          </div>
          
          <div className="mt-12 text-sm text-slate-400">
            <p>No credit card required • Free forever • HIPAA compliant</p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center mb-4">
                <div className="w-8 h-8 bg-health-600 rounded-lg flex items-center justify-center">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                </div>
                <span className="ml-3 text-lg font-semibold text-slate-900">AI Health Assistant</span>
              </div>
              <p className="text-slate-600">
                Professional healthcare assistance powered by AI technology.
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold text-slate-900 mb-4">Emergency Numbers</h4>
              <div className="space-y-2 text-slate-600">
                <p>National Emergency: 108</p>
                <p>COVID Helpline: 1075</p>
                <p>Women Helpline: 1091</p>
              </div>
            </div>
            
            <div>
              <h4 className="font-semibold text-slate-900 mb-4">Languages</h4>
              <div className="space-y-2 text-slate-600">
                <p>Hindi, English, Telugu</p>
                <p>Tamil, Bengali, Gujarati</p>
                <p>Marathi, Punjabi, Kannada</p>
              </div>
            </div>
            
            <div>
              <h4 className="font-semibold text-slate-900 mb-4">Access Channels</h4>
              <div className="space-y-2 text-slate-600">
                <p>Web Platform</p>
                <p>WhatsApp Bot</p>
                <p>SMS Service</p>
                <p>Voice Calls</p>
              </div>
            </div>
          </div>
          
          <div className="border-t border-slate-200 mt-8 pt-8 text-center">
            <p className="text-slate-600">
              © 2024 AI Health Assistant. Smart India Hackathon 2024. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default NewLandingPage;