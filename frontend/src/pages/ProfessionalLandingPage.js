import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const ProfessionalLandingPage = () => {
  const [selectedLanguage, setSelectedLanguage] = useState('English');
  
  const languages = [
    'English', 'Hindi', 'Telugu', 'Tamil', 'Bengali', 
    'Gujarati', 'Marathi', 'Punjabi', 'Kannada', 'Malayalam'
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-prussian rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </div>
              <span className="ml-3 text-xl font-semibold text-gray-900">YOGIC.ai</span>
            </div>
            
            <div className="flex items-center space-x-4">
              <select 
                value={selectedLanguage}
                onChange={(e) => setSelectedLanguage(e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-prussian focus:border-transparent"
              >
                {languages.map(lang => (
                  <option key={lang} value={lang}>{lang}</option>
                ))}
              </select>
              
              <div className="flex space-x-2">
                <Link 
                  to="/login" 
                  className="px-4 py-2 text-gray-600 hover:text-prussian font-medium transition-colors"
                >
                  Login
                </Link>
                <Link 
                  to="/register" 
                  className="px-6 py-2 bg-prussian text-white rounded-lg hover:bg-opacity-90 font-medium transition-all"
                >
                  Get Started
                </Link>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-br from-gray-50 to-blue-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="mb-8">
            <div className="w-24 h-24 bg-prussian rounded-full flex items-center justify-center mx-auto mb-8">
              <svg className="w-14 h-14 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
            </div>
            
            <h1 className="text-5xl font-bold text-gray-900 mb-6">
              Professional Healthcare
              <span className="block text-prussian mt-2">AI Assistant Platform</span>
            </h1>
            
            <p className="text-xl text-gray-600 mb-10 max-w-3xl mx-auto leading-relaxed">
              Access quality healthcare consultation in your preferred language. 
              Get instant medical advice, health assessments, and emergency support 24/7.
            </p>
            
            <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-6">
              <Link 
                to="/register" 
                className="px-8 py-4 bg-prussian text-white rounded-lg text-lg font-semibold hover:bg-opacity-90 transition-all"
              >
                Start Consultation
              </Link>
              <Link 
                to="/admin-login" 
                className="px-8 py-4 border-2 border-gray-300 text-gray-700 rounded-lg text-lg font-semibold hover:border-prussian hover:text-prussian transition-all"
              >
                Admin Portal
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Comprehensive Healthcare Features
            </h2>
            <p className="text-xl text-gray-600">
              Advanced AI-powered health assistance for everyone
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: (
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                ),
                title: 'AI Health Assistant',
                description: '24/7 medical consultation powered by advanced AI technology',
                color: 'prussian'
              },
              {
                icon: (
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
                  </svg>
                ),
                title: 'Multilingual Support',
                description: 'Communicate in 10+ Indian languages with real-time translation',
                color: 'palm'
              },
              {
                icon: (
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                  </svg>
                ),
                title: 'Multi-Channel Access',
                description: 'Available via WhatsApp, SMS, Voice calls, and Web platform',
                color: 'steel'
              },
              {
                icon: (
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                  </svg>
                ),
                title: 'Health Alerts',
                description: 'Real-time notifications for health emergencies and vaccination updates',
                color: 'slimy'
              },
              {
                icon: (
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                ),
                title: 'Health Assessment',
                description: 'Interactive questionnaires with personalized health recommendations',
                color: 'palm'
              },
              {
                icon: (
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 8.172V5L8 4z" />
                  </svg>
                ),
                title: 'Vaccination Info',
                description: 'Find vaccination centers and track immunization schedules',
                color: 'steel'
              }
            ].map((feature, idx) => (
              <div key={idx} className="bg-white p-8 rounded-xl border border-gray-200 shadow-sm hover:shadow-lg transition-shadow">
                <div className={`w-16 h-16 bg-${feature.color} rounded-lg flex items-center justify-center mx-auto mb-6 text-white`}>
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold mb-4 text-center text-gray-900">
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

      {/* Stats Section */}
      <section className="py-20 bg-prussian text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Healthcare Impact</h2>
            <p className="text-xl text-blue-100">Serving communities across India</p>
          </div>
          
          <div className="grid md:grid-cols-4 gap-8 text-center">
            {[
              { number: "10+", label: "Languages Supported" },
              { number: "24/7", label: "Availability" },
              { number: "1000+", label: "Health Topics" },
              { number: "98%", label: "AI Accuracy" }
            ].map((stat, idx) => (
              <div key={idx}>
                <div className="text-5xl font-bold mb-3">{stat.number}</div>
                <div className="text-blue-100 text-lg">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gray-900 text-white">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold mb-8">
            Ready to Access Quality Healthcare?
          </h2>
          <p className="text-xl mb-12 text-gray-300 leading-relaxed">
            Join thousands of users accessing professional healthcare assistance 
            through our AI-powered platform.
          </p>
          
          <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-6">
            <Link 
              to="/register" 
              className="px-10 py-4 bg-prussian text-white rounded-lg text-lg font-semibold hover:bg-opacity-90 transition-all"
            >
              Start Free Consultation
            </Link>
            <Link 
              to="/login" 
              className="px-10 py-4 border-2 border-white text-white rounded-lg text-lg font-semibold hover:bg-white hover:text-gray-900 transition-all"
            >
              User Login
            </Link>
          </div>
          
          <div className="mt-12 text-sm text-gray-400">
            <p>No credit card required • Free forever • HIPAA compliant</p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center mb-4">
                <div className="w-8 h-8 bg-prussian rounded-lg flex items-center justify-center">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                </div>
                <span className="ml-3 text-lg font-semibold text-gray-900">YOGIC.ai</span>
              </div>
              <p className="text-gray-600">
                Professional healthcare assistance powered by AI technology.
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold text-gray-900 mb-4">Emergency Numbers</h4>
              <div className="space-y-2 text-gray-600">
                <p>National Emergency: 108</p>
                <p>COVID Helpline: 1075</p>
                <p>Women Helpline: 1091</p>
              </div>
            </div>
            
            <div>
              <h4 className="font-semibold text-gray-900 mb-4">Languages</h4>
              <div className="space-y-2 text-gray-600">
                <p>Hindi, English, Telugu</p>
                <p>Tamil, Bengali, Gujarati</p>
                <p>Marathi, Punjabi, Kannada</p>
              </div>
            </div>
            
            <div>
              <h4 className="font-semibold text-gray-900 mb-4">Access Channels</h4>
              <div className="space-y-2 text-gray-600">
                <p>Web Platform</p>
                <p>WhatsApp Bot</p>
                <p>SMS Service</p>
                <p>Voice Calls</p>
              </div>
            </div>
          </div>
          
          <div className="border-t border-gray-200 mt-8 pt-8 text-center">
            <p className="text-gray-600">
              © 2024 YOGIC.ai. Smart India Hackathon 2024. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default ProfessionalLandingPage;