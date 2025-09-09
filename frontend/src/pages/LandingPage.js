import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const LandingPage = () => {
  const [showDemo, setShowDemo] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow-lg sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
                <span className="text-white font-bold text-xl">🩺</span>
              </div>
              <span className="ml-3 text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Dr. AI HealthBot
              </span>
            </div>
            <div className="flex space-x-4">
              <Link to="/login" className="text-gray-600 hover:text-blue-600 px-4 py-2 rounded-lg transition-colors">
                Login
              </Link>
              <Link to="/register" className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-2 rounded-lg hover:shadow-lg transition-all">
                Get Started Free
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-purple-600/10"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative">
          <div className="animate-bounce mb-8">
            <span className="text-6xl">🤖</span>
          </div>
          <h1 className="text-6xl font-bold text-gray-900 mb-6">
            AI-Powered Health Assistant
            <span className="block text-4xl bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mt-2">
              स्वास्थ्य सहायक | ಆರೋಗ್ಯ ಸಹಾಯಕ | স্বাস্থ্য সহায়ক
            </span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-4xl mx-auto leading-relaxed">
            Get instant medical advice in 10+ Indian languages. Available 24/7 via WhatsApp, SMS, Voice calls, and Web. 
            Powered by Google Gemini AI with real-time health data from Government APIs.
          </p>
          <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-6">
            <Link to="/register" className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-xl text-lg font-semibold hover:shadow-xl transition-all transform hover:scale-105">
              🚀 Start Free Consultation
            </Link>
            <button 
              onClick={() => setShowDemo(true)}
              className="border-2 border-blue-600 text-blue-600 px-8 py-4 rounded-xl text-lg font-semibold hover:bg-blue-50 transition-all"
            >
              🎥 Watch Live Demo
            </button>
          </div>
        </div>
      </section>

      {/* Live Demo Modal */}
      {showDemo && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-8 max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-bold">Live AI Demo</h3>
              <button 
                onClick={() => setShowDemo(false)}
                className="text-gray-500 hover:text-gray-700 text-2xl"
              >
                ×
              </button>
            </div>
            <div className="bg-gray-100 rounded-xl p-6 space-y-4">
              <div className="bg-blue-100 p-4 rounded-lg">
                <strong>User:</strong> मुझे बुखार है और सिर दर्द हो रहा है
              </div>
              <div className="bg-green-100 p-4 rounded-lg">
                <strong>Dr. AI:</strong> 🌡️ **बुखार और सिरदर्द का इलाज:**<br/><br/>
                **तत्काल राहत:**<br/>
                • पैरासिटामोल 500mg (8 घंटे में एक बार)<br/>
                • पर्याप्त आराम और तरल पदार्थ<br/>
                • ठंडी पट्टी माथे पर<br/><br/>
                **डॉक्टर से मिलें अगर:**<br/>
                • 102°F से ज्यादा बुखार<br/>
                • 3 दिन से ज्यादा बुखार<br/><br/>
                **आपातकाल:** 108
              </div>
            </div>
            <div className="mt-6 text-center">
              <Link to="/register" className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700">
                Try It Now - Free!
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Features Grid */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-center text-gray-900 mb-16">
            🚀 Revolutionary Features
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: "🗣️",
                title: "10+ Indian Languages",
                desc: "Hindi, English, Telugu, Tamil, Bengali, Gujarati, Marathi, Punjabi, Kannada, Malayalam",
                color: "from-blue-500 to-cyan-500"
              },
              {
                icon: "⚡",
                title: "Instant AI Responses",
                desc: "Google Gemini AI provides medical advice in under 2 seconds, available 24/7",
                color: "from-green-500 to-emerald-500"
              },
              {
                icon: "🚨",
                title: "Real-time Health Alerts",
                desc: "COVID updates, vaccination reminders, outbreak notifications from Government APIs",
                color: "from-red-500 to-pink-500"
              },
              {
                icon: "📱",
                title: "Multi-Channel Access",
                desc: "WhatsApp, SMS, Voice calls, Web dashboard - choose your preferred method",
                color: "from-purple-500 to-indigo-500"
              },
              {
                icon: "🎯",
                title: "Interactive Health Quiz",
                desc: "Gamified health assessments with personalized recommendations",
                color: "from-yellow-500 to-orange-500"
              },
              {
                icon: "🏥",
                title: "Government Integration",
                desc: "Connected to CoWIN, MoHFW, State Health APIs for authentic information",
                color: "from-teal-500 to-green-500"
              }
            ].map((feature, idx) => (
              <div key={idx} className="group hover:scale-105 transition-all duration-300">
                <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl border border-gray-100">
                  <div className={`w-16 h-16 bg-gradient-to-r ${feature.color} rounded-2xl flex items-center justify-center mx-auto mb-6 text-2xl group-hover:rotate-12 transition-transform`}>
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-bold mb-4 text-center">{feature.title}</h3>
                  <p className="text-gray-600 text-center leading-relaxed">{feature.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-center mb-16">📊 Impact & Reach</h2>
          <div className="grid md:grid-cols-4 gap-8 text-center">
            {[
              { number: "10+", label: "Indian Languages", icon: "🌐" },
              { number: "24/7", label: "Availability", icon: "⏰" },
              { number: "1000+", label: "Health Topics", icon: "📚" },
              { number: "98%", label: "AI Accuracy", icon: "🎯" }
            ].map((stat, idx) => (
              <div key={idx} className="group">
                <div className="text-6xl mb-4 group-hover:scale-110 transition-transform">{stat.icon}</div>
                <div className="text-5xl font-bold mb-2">{stat.number}</div>
                <div className="text-blue-200 text-lg">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-center text-gray-900 mb-16">
            🔄 How It Works
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                step: "1",
                title: "Ask Your Question",
                desc: "Type in any Indian language via WhatsApp, SMS, Voice, or Web",
                icon: "💬"
              },
              {
                step: "2",
                title: "AI Analysis",
                desc: "Google Gemini AI analyzes your query with medical expertise",
                icon: "🧠"
              },
              {
                step: "3",
                title: "Get Expert Advice",
                desc: "Receive detailed medical guidance in your preferred language",
                icon: "✅"
              }
            ].map((step, idx) => (
              <div key={idx} className="text-center relative">
                <div className="w-20 h-20 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-6 text-3xl text-white font-bold">
                  {step.step}
                </div>
                <div className="text-4xl mb-4">{step.icon}</div>
                <h3 className="text-2xl font-bold mb-4">{step.title}</h3>
                <p className="text-gray-600 text-lg">{step.desc}</p>
                {idx < 2 && (
                  <div className="hidden md:block absolute top-10 left-full w-full">
                    <div className="text-4xl text-blue-600">→</div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-green-600 to-blue-600 text-white">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-5xl font-bold mb-6">Ready to Transform Healthcare?</h2>
          <p className="text-xl mb-8 opacity-90">
            Join thousands of Indians getting instant health advice in their native language
          </p>
          <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-6">
            <Link to="/register" className="bg-white text-blue-600 px-8 py-4 rounded-xl text-lg font-bold hover:shadow-xl transition-all transform hover:scale-105">
              🚀 Start Free Now
            </Link>
            <Link to="/quiz" className="border-2 border-white text-white px-8 py-4 rounded-xl text-lg font-bold hover:bg-white hover:text-blue-600 transition-all">
              🎯 Take Health Quiz
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center mb-6">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
                  <span className="text-white font-bold">🩺</span>
                </div>
                <span className="ml-3 text-2xl font-bold">Dr. AI HealthBot</span>
              </div>
              <p className="text-gray-400 mb-4">AI-powered health assistant making healthcare accessible to every Indian in their native language.</p>
              <div className="flex space-x-4">
                <span className="text-2xl cursor-pointer hover:text-blue-400">📱</span>
                <span className="text-2xl cursor-pointer hover:text-blue-400">💬</span>
                <span className="text-2xl cursor-pointer hover:text-blue-400">📧</span>
              </div>
            </div>
            <div>
              <h4 className="font-bold text-lg mb-6 text-blue-400">🚨 Emergency Numbers</h4>
              <div className="space-y-2 text-gray-400">
                <p>National Emergency: <span className="text-white font-bold">108</span></p>
                <p>COVID Helpline: <span className="text-white font-bold">1075</span></p>
                <p>Women Helpline: <span className="text-white font-bold">1091</span></p>
                <p>Child Helpline: <span className="text-white font-bold">1098</span></p>
              </div>
            </div>
            <div>
              <h4 className="font-bold text-lg mb-6 text-blue-400">🌐 Supported Languages</h4>
              <div className="space-y-2 text-gray-400">
                <p>Hindi (हिंदी), English</p>
                <p>Telugu (తెలుగు), Tamil (தமிழ்)</p>
                <p>Bengali (বাংলা), Gujarati (ગુજરાતી)</p>
                <p>Marathi (मराठी), Punjabi (ਪੰਜਾਬੀ)</p>
                <p>Kannada (ಕನ್ನಡ), Malayalam (മലയാളം)</p>
              </div>
            </div>
            <div>
              <h4 className="font-bold text-lg mb-6 text-blue-400">📞 Contact Channels</h4>
              <div className="space-y-2 text-gray-400">
                <p>WhatsApp: <span className="text-white">+91-98765-43210</span></p>
                <p>SMS: <span className="text-white">+91-98765-43210</span></p>
                <p>Voice: <span className="text-white">+91-98765-43210</span></p>
                <p>Email: <span className="text-white">help@draibot.in</span></p>
                <p>Web: <span className="text-white">24/7 Available</span></p>
              </div>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-12 pt-8">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <p className="text-gray-400 mb-4 md:mb-0">
                &copy; 2024 Dr. AI HealthBot. Made with ❤️ for SIH 2024. All rights reserved.
              </p>
              <div className="flex space-x-6 text-gray-400">
                <Link to="/privacy" className="hover:text-white">Privacy Policy</Link>
                <Link to="/terms" className="hover:text-white">Terms of Service</Link>
                <Link to="/admin" className="hover:text-white">Admin Portal</Link>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;