import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const LandingPage = () => {
  const [showDemo, setShowDemo] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [currentLanguage, setCurrentLanguage] = useState(0);
  
  const languages = ['Hindi', 'English', 'Telugu', 'Tamil', 'Bengali', 'Gujarati', 'Marathi', 'Punjabi'];
  
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    
    const languageInterval = setInterval(() => {
      setCurrentLanguage(prev => (prev + 1) % languages.length);
    }, 2000);
    
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
      clearInterval(languageInterval);
    };
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className={`sticky top-0 z-50 transition-all duration-300 ${
        isScrolled ? 'bg-white/95 backdrop-blur-md shadow-lg' : 'bg-white shadow-sm'
      } border-b border-gray-200`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center group">
              <div className="w-10 h-10 bg-gradient-to-br from-teal-500 to-teal-700 rounded-lg flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </div>
              <span className="ml-3 text-2xl font-semibold text-gray-900 group-hover:text-teal-600 transition-colors">
                Dr. AI HealthBot
              </span>
            </div>
            <div className="flex space-x-4">
              <div className="relative group">
                <button className="text-gray-600 hover:text-teal-600 px-4 py-2 rounded-lg transition-all duration-300 font-medium hover:bg-teal-50 flex items-center gap-1">
                  Login
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                <div className="absolute top-full left-0 mt-2 w-48 bg-white rounded-lg shadow-xl border border-gray-200 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-50">
                  <Link to="/login" className="block px-4 py-3 text-gray-700 hover:bg-teal-50 hover:text-teal-600 transition-colors rounded-t-lg">
                    <div className="flex items-center gap-2">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                      User Portal
                    </div>
                  </Link>
                  <Link to="/admin-login" className="block px-4 py-3 text-gray-700 hover:bg-red-50 hover:text-red-600 transition-colors rounded-b-lg border-t border-gray-100">
                    <div className="flex items-center gap-2">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                      </svg>
                      Admin Portal
                    </div>
                  </Link>
                </div>
              </div>
              <Link to="/register" className="bg-gradient-to-r from-teal-600 to-teal-700 text-white px-6 py-2 rounded-lg hover:from-teal-700 hover:to-teal-800 transition-all duration-300 font-medium shadow-lg hover:shadow-xl transform hover:-translate-y-0.5">
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative py-20 bg-gradient-to-br from-white via-teal-50/30 to-blue-50/30 overflow-hidden">
        {/* Floating Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-teal-100 rounded-full opacity-20 animate-pulse"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-100 rounded-full opacity-20 animate-pulse" style={{animationDelay: '1s'}}></div>
          <div className="absolute top-1/2 left-1/4 w-20 h-20 bg-purple-100 rounded-full opacity-30 animate-bounce" style={{animationDelay: '2s'}}></div>
          <div className="absolute top-1/3 right-1/4 w-16 h-16 bg-green-100 rounded-full opacity-30 animate-bounce" style={{animationDelay: '3s'}}></div>
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="mb-8 animate-fadeIn">
            <div className="w-24 h-24 bg-gradient-to-br from-teal-400 to-teal-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-2xl animate-bounce">
              <svg className="w-14 h-14 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
            </div>
          </div>
          <h1 className="text-6xl font-bold text-gray-900 mb-6 animate-fadeIn">
            🤖 Dr. AI ChatBot
            <span className="block text-4xl text-gradient mt-3 font-medium">
              Chat in <span className="inline-block min-w-[120px] text-left">{languages[currentLanguage]}</span> & More
            </span>
          </h1>
          <p className="text-xl text-gray-600 mb-10 max-w-4xl mx-auto leading-relaxed animate-fadeIn" style={{animationDelay: '0.3s'}}>
            💬 <strong>Chat instantly</strong> with your AI doctor! Get medical advice, symptom analysis & health tips in Hindi, English & 8+ Indian languages. 
            <strong>Free 24/7 service</strong> - just like texting a friend!
          </p>
          <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-6 animate-fadeIn" style={{animationDelay: '0.6s'}}>
            <Link to="/register" className="group bg-gradient-to-r from-teal-600 to-teal-700 text-white px-10 py-4 rounded-xl text-lg font-semibold hover:from-teal-700 hover:to-teal-800 transition-all duration-300 shadow-xl hover:shadow-2xl transform hover:-translate-y-1">
              <span className="flex items-center justify-center gap-2">
                Start Consultation
                <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </span>
            </Link>
            <button 
              onClick={() => setShowDemo(true)}
              className="group border-2 border-teal-600 text-teal-600 px-10 py-4 rounded-xl text-lg font-semibold hover:bg-teal-600 hover:text-white transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
            >
              <span className="flex items-center justify-center gap-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1m4 0h1m-6 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                View Demo
              </span>
            </button>
          </div>
          
          {/* Trust Indicators */}
          <div className="mt-16 animate-fadeIn" style={{animationDelay: '0.9s'}}>
            <p className="text-sm text-gray-500 mb-6">Trusted by healthcare professionals across India</p>
            <div className="flex justify-center items-center space-x-8 opacity-60">
              <div className="flex items-center space-x-2">
                <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span className="text-sm font-medium">HIPAA Compliant</span>
              </div>
              <div className="flex items-center space-x-2">
                <svg className="w-5 h-5 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                </svg>
                <span className="text-sm font-medium">End-to-End Encrypted</span>
              </div>
              <div className="flex items-center space-x-2">
                <svg className="w-5 h-5 text-purple-500" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="text-sm font-medium">Government Approved</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Demo Modal */}
      {showDemo && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fadeIn">
          <div className="bg-white rounded-2xl p-8 max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl animate-slideIn">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                <div className="w-8 h-8 bg-gradient-to-br from-teal-500 to-teal-700 rounded-lg flex items-center justify-center">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                </div>
                AI Assistant Demo
              </h3>
              <button 
                onClick={() => setShowDemo(false)}
                className="text-gray-400 hover:text-gray-600 text-3xl hover:bg-gray-100 w-10 h-10 rounded-full flex items-center justify-center transition-all"
              >
                ×
              </button>
            </div>
            <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl p-8 space-y-6">
              <div className="bg-white border-l-4 border-blue-500 p-6 rounded-xl shadow-sm">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0">
                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                  <div>
                    <strong className="text-blue-800 text-lg">User:</strong>
                    <p className="text-gray-700 mt-1 text-lg">मुझे बुखार है और सिर दर्द हो रहा है</p>
                  </div>
                </div>
              </div>
              <div className="bg-white border-l-4 border-teal-500 p-6 rounded-xl shadow-sm">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-gradient-to-br from-teal-500 to-teal-700 rounded-full flex items-center justify-center flex-shrink-0">
                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <strong className="text-teal-800 text-lg">Dr. AI:</strong>
                    <div className="text-gray-700 mt-3 space-y-4">
                      <div className="bg-teal-50 p-4 rounded-lg">
                        <strong className="text-teal-800">बुखार और सिरदर्द का उपचार:</strong>
                      </div>
                      <div className="grid md:grid-cols-2 gap-4">
                        <div className="bg-green-50 p-4 rounded-lg">
                          <strong className="text-green-800">तत्काल राहत:</strong><br/>
                          • पैरासिटामोल 500mg (8 घंटे में एक बार)<br/>
                          • पर्याप्त आराम और तरल पदार्थ<br/>
                          • ठंडी पट्टी माथे पर
                        </div>
                        <div className="bg-orange-50 p-4 rounded-lg">
                          <strong className="text-orange-800">डॉक्टर से संपर्क करें यदि:</strong><br/>
                          • 102°F से अधिक बुखार<br/>
                          • 3 दिन से अधिक समय तक बुखार
                        </div>
                      </div>
                      <div className="bg-red-50 p-4 rounded-lg text-center">
                        <strong className="text-red-800">आपातकाल: 108</strong>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="mt-8 text-center">
              <Link to="/register" className="inline-flex items-center gap-2 bg-gradient-to-r from-teal-600 to-teal-700 text-white px-8 py-4 rounded-xl hover:from-teal-700 hover:to-teal-800 font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                Try Now - Free
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Features Grid */}
      <section className="py-20 bg-gradient-to-br from-gray-50 to-white relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
          }}></div>
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16 animate-fadeIn">
            <h2 className="text-5xl font-bold text-gray-900 mb-6">
              Advanced Healthcare Features
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Comprehensive AI-driven health assistance with cutting-edge technology
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: (
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
                  </svg>
                ),
                title: "Multilingual Support",
                desc: "Hindi, English, Telugu, Tamil, Bengali, Gujarati, Marathi, Punjabi, Kannada, Malayalam",
                color: "teal"
              },
              {
                icon: (
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                ),
                title: "Instant AI Response",
                desc: "Google Gemini AI provides medical consultation in under 2 seconds, available 24/7",
                color: "blue"
              },
              {
                icon: (
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                  </svg>
                ),
                title: "Health Alerts",
                desc: "Real-time COVID updates, vaccination reminders, outbreak notifications from Government APIs",
                color: "red"
              },
              {
                icon: (
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                  </svg>
                ),
                title: "Multi-Channel Access",
                desc: "WhatsApp, SMS, Voice calls, Web dashboard - accessible on any device",
                color: "purple"
              },
              {
                icon: (
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                ),
                title: "Health Assessment",
                desc: "Interactive health questionnaires with personalized recommendations",
                color: "green"
              },
              {
                icon: (
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                ),
                title: "Government Integration",
                desc: "Connected to CoWIN, MoHFW, State Health APIs for authentic medical information",
                color: "indigo"
              }
            ].map((feature, idx) => (
              <div key={idx} className="group card-hover animate-fadeIn" style={{animationDelay: `${idx * 0.1}s`}}>
                <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl border border-gray-100 h-full relative overflow-hidden">
                  {/* Gradient overlay */}
                  <div className="absolute inset-0 bg-gradient-to-br from-transparent to-gray-50/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  
                  <div className="relative z-10">
                    <div className={`w-18 h-18 bg-gradient-to-br from-${feature.color}-400 to-${feature.color}-600 rounded-2xl flex items-center justify-center mx-auto mb-6 text-white shadow-lg group-hover:scale-110 group-hover:rotate-3 transition-all duration-300`}>
                      {feature.icon}
                    </div>
                    <h3 className="text-xl font-semibold mb-4 text-center text-gray-900 group-hover:text-teal-600 transition-colors">{feature.title}</h3>
                    <p className="text-gray-600 text-center leading-relaxed">{feature.desc}</p>
                  </div>
                  
                  {/* Hover effect border */}
                  <div className="absolute inset-0 rounded-2xl border-2 border-transparent group-hover:border-teal-200 transition-colors duration-300"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-gradient-to-r from-teal-600 via-teal-700 to-blue-600 text-white relative overflow-hidden">
        {/* Animated background */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-black/10"></div>
          <div className="absolute top-0 left-0 w-full h-full">
            <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-white/5 rounded-full animate-pulse"></div>
            <div className="absolute bottom-1/4 right-1/4 w-24 h-24 bg-white/5 rounded-full animate-pulse" style={{animationDelay: '1s'}}></div>
          </div>
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16 animate-fadeIn">
            <h2 className="text-5xl font-bold mb-6">Impact & Reach</h2>
            <p className="text-xl text-teal-100">Transforming healthcare accessibility across India</p>
          </div>
          <div className="grid md:grid-cols-4 gap-8 text-center">
            {[
              { 
                number: "10+", 
                label: "Indian Languages", 
                icon: (
                  <svg className="w-8 h-8 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
                  </svg>
                )
              },
              { 
                number: "24/7", 
                label: "Availability", 
                icon: (
                  <svg className="w-8 h-8 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                )
              },
              { 
                number: "1000+", 
                label: "Health Topics", 
                icon: (
                  <svg className="w-8 h-8 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                )
              },
              { 
                number: "98%", 
                label: "AI Accuracy", 
                icon: (
                  <svg className="w-8 h-8 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                )
              }
            ].map((stat, idx) => (
              <div key={idx} className="group animate-fadeIn" style={{animationDelay: `${idx * 0.2}s`}}>
                <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 hover:bg-white/20 transition-all duration-300 transform hover:scale-105">
                  <div className="text-white/80 group-hover:text-white transition-colors">
                    {stat.icon}
                  </div>
                  <div className="text-6xl font-bold mb-3 group-hover:scale-110 transition-transform">{stat.number}</div>
                  <div className="text-teal-100 text-lg font-medium">{stat.label}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              How It Works
            </h2>
            <p className="text-xl text-gray-600">Simple, fast, and reliable healthcare assistance</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                step: "01",
                title: "Ask Your Question",
                desc: "Type your health query in any Indian language via WhatsApp, SMS, Voice, or Web",
                icon: (
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                )
              },
              {
                step: "02",
                title: "AI Analysis",
                desc: "Advanced Google Gemini AI analyzes your query with comprehensive medical knowledge",
                icon: (
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                )
              },
              {
                step: "03",
                title: "Expert Guidance",
                desc: "Receive detailed medical recommendations in your preferred language with follow-up care",
                icon: (
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                )
              }
            ].map((step, idx) => (
              <div key={idx} className="text-center relative">
                <div className="w-20 h-20 bg-teal-600 rounded-full flex items-center justify-center mx-auto mb-6 text-white font-bold text-xl">
                  {step.step}
                </div>
                <div className="w-16 h-16 bg-teal-100 rounded-full flex items-center justify-center mx-auto mb-6 text-teal-600">
                  {step.icon}
                </div>
                <h3 className="text-2xl font-semibold mb-4 text-gray-900">{step.title}</h3>
                <p className="text-gray-600 text-lg leading-relaxed">{step.desc}</p>
                {idx < 2 && (
                  <div className="hidden md:block absolute top-10 left-full w-full">
                    <div className="text-4xl text-teal-600">→</div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white relative overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute inset-0">
          <div className="absolute top-0 left-0 w-full h-full opacity-10">
            <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-teal-500 rounded-full filter blur-3xl animate-pulse"></div>
            <div className="absolute bottom-1/4 right-1/4 w-48 h-48 bg-purple-500 rounded-full filter blur-3xl animate-pulse" style={{animationDelay: '2s'}}></div>
          </div>
        </div>
        
        <div className="relative max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <div className="animate-fadeIn">
            <h2 className="text-6xl font-bold mb-8 text-gradient">Ready to Transform Healthcare?</h2>
            <p className="text-xl mb-12 text-gray-300 max-w-2xl mx-auto leading-relaxed">
              Join thousands of Indians accessing quality healthcare through AI-powered assistance. 
              Start your journey to better health today.
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-6 animate-fadeIn" style={{animationDelay: '0.3s'}}>
            <Link to="/register" className="group bg-gradient-to-r from-teal-600 to-teal-700 text-white px-10 py-5 rounded-xl text-lg font-semibold hover:from-teal-700 hover:to-teal-800 transition-all duration-300 shadow-2xl hover:shadow-teal-500/25 transform hover:-translate-y-1">
              <span className="flex items-center justify-center gap-3">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                Start Free Consultation
                <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </span>
            </Link>
            <Link to="/quiz" className="group border-2 border-white text-white px-10 py-5 rounded-xl text-lg font-semibold hover:bg-white hover:text-gray-900 transition-all duration-300 shadow-xl hover:shadow-2xl transform hover:-translate-y-1">
              <span className="flex items-center justify-center gap-3">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Take Health Assessment
              </span>
            </Link>
          </div>
          
          {/* Additional CTA elements */}
          <div className="mt-16 animate-fadeIn" style={{animationDelay: '0.6s'}}>
            <p className="text-sm text-gray-400 mb-6">No credit card required • Free forever • HIPAA compliant</p>
            <div className="flex justify-center items-center space-x-8 text-gray-500">
              <div className="flex items-center space-x-2">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span className="text-sm">Instant Setup</span>
              </div>
              <div className="flex items-center space-x-2">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span className="text-sm">24/7 Support</span>
              </div>
              <div className="flex items-center space-x-2">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span className="text-sm">Multi-language</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center mb-6">
                <div className="w-10 h-10 bg-teal-600 rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                </div>
                <span className="ml-3 text-2xl font-semibold text-gray-900">Dr. AI HealthBot</span>
              </div>
              <p className="text-gray-600 mb-4">AI-powered health assistant making healthcare accessible to every Indian in their native language.</p>
            </div>
            <div>
              <h4 className="font-semibold text-lg mb-6 text-gray-900">Emergency Numbers</h4>
              <div className="space-y-2 text-gray-600">
                <p>National Emergency: <span className="font-semibold text-gray-900">108</span></p>
                <p>COVID Helpline: <span className="font-semibold text-gray-900">1075</span></p>
                <p>Women Helpline: <span className="font-semibold text-gray-900">1091</span></p>
                <p>Child Helpline: <span className="font-semibold text-gray-900">1098</span></p>
              </div>
            </div>
            <div>
              <h4 className="font-semibold text-lg mb-6 text-gray-900">Supported Languages</h4>
              <div className="space-y-2 text-gray-600">
                <p>Hindi, English</p>
                <p>Telugu, Tamil</p>
                <p>Bengali, Gujarati</p>
                <p>Marathi, Punjabi</p>
                <p>Kannada, Malayalam</p>
              </div>
            </div>
            <div>
              <h4 className="font-semibold text-lg mb-6 text-gray-900">Contact Channels</h4>
              <div className="space-y-2 text-gray-600">
                <p>WhatsApp: <span className="font-semibold text-gray-900">+91-98765-43210</span></p>
                <p>SMS: <span className="font-semibold text-gray-900">+91-98765-43210</span></p>
                <p>Voice: <span className="font-semibold text-gray-900">+91-98765-43210</span></p>
                <p>Email: <span className="font-semibold text-gray-900">help@draibot.in</span></p>
                <p>Web: <span className="font-semibold text-gray-900">24/7 Available</span></p>
              </div>
            </div>
          </div>
          <div className="border-t border-gray-200 mt-12 pt-8">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <p className="text-gray-600 mb-4 md:mb-0">
                © 2024 Dr. AI HealthBot. Made for SIH 2024. All rights reserved.
              </p>
              <div className="flex space-x-6 text-gray-600">
                <Link to="/privacy" className="hover:text-teal-600">Privacy Policy</Link>
                <Link to="/terms" className="hover:text-teal-600">Terms of Service</Link>
                <Link to="/admin-login" className="hover:text-teal-600">Admin Portal</Link>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;