import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import UserProfile from '../components/UserProfile';
import AIInterface from '../components/AIInterface';

const ProfessionalUserDashboard = () => {
  const [activeSection, setActiveSection] = useState('chatbot');

  const [messages, setMessages] = useState([
    { id: 1, type: 'ai', text: 'Hello! I am your AI health assistant. How can I help you today?', time: new Date() }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();



  const sidebarItems = [
    {
      id: 'chatbot',
      label: 'YOGIC.ai Chat',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
        </svg>
      ),
      description: 'Chat with AI Doctor'
    },
    {
      id: 'alerts',
      label: 'Health Alerts',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
        </svg>
      ),
      description: 'Emergency & Alerts'
    },
    {
      id: 'vaccination',
      label: 'Vaccination',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 8.172V5L8 4z" />
        </svg>
      ),
      description: 'Vaccine Centers'
    },
    {
      id: 'resources',
      label: 'Health Resources',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
        </svg>
      ),
      description: 'Health Resources'
    },
    {
      id: 'profile',
      label: 'My Profile',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
      ),
      description: 'Account Settings'
    }
  ];

  useEffect(() => {
    if (!currentUser) {
      navigate('/login');
    }
  }, [currentUser, navigate]);

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;
    
    const userMessage = {
      id: Date.now(),
      type: 'user',
      text: inputMessage,
      time: new Date()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsTyping(true);
    
    setTimeout(() => {
      const aiResponse = {
        id: Date.now() + 1,
        type: 'ai',
        text: 'Thank you for your question. Based on your symptoms, I recommend consulting with a healthcare professional. In the meantime, ensure you stay hydrated and get adequate rest.',
        time: new Date()
      };
      setMessages(prev => [...prev, aiResponse]);
      setIsTyping(false);
    }, 2000);
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };



  const renderContent = () => {
    switch (activeSection) {
      case 'chatbot':
        return <AIInterface />;
      case 'alerts':
        return <HealthAlertsSection />;
      case 'vaccination':
        return <VaccinationSection />;
      case 'resources':
        return <ResourcesSection />;
      case 'profile':
        return <UserProfile user={currentUser} />;
      default:
        return <AIInterface />;
    }
  };

  return (
    <div className="h-screen bg-gray-50 flex overflow-hidden">
      <div className="w-64 bg-white shadow-lg border-r border-gray-200 flex flex-col flex-shrink-0">
        <div className="p-4 bg-prussian text-white">
          <div className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-white bg-opacity-20 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            </div>
            <div>
              <h2 className="text-lg font-bold">YOGIC.ai</h2>
              <p className="text-blue-100 text-xs">AI-Powered Healthcare</p>
            </div>
          </div>
        </div>

        <div className="p-3 bg-blue-50 border-b">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-prussian rounded-full flex items-center justify-center text-white font-bold text-sm">
              {currentUser?.name?.charAt(0)?.toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-gray-900 text-sm truncate">{currentUser?.name}</p>
              <p className="text-xs text-gray-600">Premium User</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 p-2 space-y-1 overflow-y-auto">
          {sidebarItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveSection(item.id)}
              className={`w-full flex items-center space-x-3 p-3 rounded-lg transition-all text-left ${
                activeSection === item.id 
                  ? 'bg-prussian text-white shadow-lg' 
                  : 'hover:bg-gray-50 text-gray-700 hover:shadow-md'
              }`}
            >
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                activeSection === item.id 
                  ? 'bg-white bg-opacity-20' 
                  : 'bg-gray-100'
              }`}>
                {item.icon}
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-semibold text-sm">{item.label}</div>
                <div className={`text-xs truncate ${
                  activeSection === item.id ? 'text-blue-100' : 'text-gray-500'
                }`}>
                  {item.description}
                </div>
              </div>
            </button>
          ))}
        </nav>


      </div>

      <div className="flex-1 flex flex-col min-w-0">
        <header className="bg-white shadow-sm border-b border-gray-200 p-3 flex-shrink-0">
          <div className="flex items-center justify-between">
            <div className="flex-1 min-w-0">
              <h1 className="text-xl font-bold text-gray-900 truncate">
                {sidebarItems.find(item => item.id === activeSection)?.label}
              </h1>
              <p className="text-gray-600 text-sm">Professional healthcare at your fingertips</p>
            </div>
            <div className="flex items-center space-x-3">
              <div className="flex items-center space-x-2 bg-green-50 px-2 py-1 rounded-lg">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-green-700 text-xs font-medium">AI Online</span>
              </div>
              <button className="bg-red-600 text-white px-3 py-1 rounded-lg text-xs font-semibold hover:bg-red-700 transition-all flex items-center space-x-1">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
                <span>Emergency 108</span>
              </button>
              <button
                onClick={handleLogout}
                className="bg-gray-100 text-gray-700 px-3 py-1 rounded-lg text-xs font-medium hover:bg-gray-200 transition-all flex items-center space-x-1"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                <span>Logout</span>
              </button>
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto">
          {renderContent()}
        </main>
      </div>
    </div>
  );
};

const HealthAlertsSection = () => (
  <div className="h-full bg-white rounded-lg shadow-lg p-6 overflow-y-auto">
    <div className="mb-6">
      <h3 className="text-2xl font-bold text-gray-900 mb-2">Health Alerts & Notifications</h3>
      <p className="text-gray-600">Stay informed about health emergencies and important updates</p>
    </div>
    
    <div className="space-y-4">
      <div className="bg-red-50 border-l-4 border-red-500 p-6 rounded-r-lg">
        <div className="flex items-start justify-between">
          <div className="flex items-start space-x-3">
            <svg className="w-6 h-6 text-red-500 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
            <div>
              <h4 className="font-bold text-lg text-red-800">High Priority Alert</h4>
              <p className="text-red-700 mt-1">Dengue outbreak reported in your area. Take immediate precautions.</p>
              <div className="mt-3 flex space-x-2">
                <span className="bg-red-100 px-3 py-1 rounded-full text-xs font-medium text-red-800">URGENT</span>
                <span className="bg-red-100 px-3 py-1 rounded-full text-xs font-medium text-red-800">2 hours ago</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="bg-orange-50 border-l-4 border-orange-500 p-6 rounded-r-lg">
        <div className="flex items-start space-x-3">
          <svg className="w-6 h-6 text-orange-500 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <div>
            <h4 className="font-bold text-lg text-orange-800">Weather Health Advisory</h4>
            <p className="text-orange-700 mt-1">Extreme heat wave expected. Stay hydrated and avoid outdoor activities.</p>
            <div className="mt-3 flex space-x-2">
              <span className="bg-orange-100 px-3 py-1 rounded-full text-xs font-medium text-orange-800">MEDIUM</span>
              <span className="bg-orange-100 px-3 py-1 rounded-full text-xs font-medium text-orange-800">5 hours ago</span>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <div className="mt-8 bg-gray-50 p-6 rounded-lg">
      <h4 className="font-bold text-gray-900 mb-4">Emergency Contacts</h4>
      <div className="grid grid-cols-2 gap-4">
        <button className="bg-red-500 text-white p-4 rounded-lg font-semibold hover:bg-red-600 transition-colors">
          Emergency: 108
        </button>
        <button className="bg-blue-500 text-white p-4 rounded-lg font-semibold hover:bg-blue-600 transition-colors">
          COVID Help: 1075
        </button>
      </div>
    </div>
  </div>
);

const VaccinationSection = () => (
  <div className="h-full bg-white rounded-lg shadow-lg p-6 overflow-y-auto">
    <div className="mb-6">
      <h3 className="text-2xl font-bold text-gray-900 mb-2">Vaccination Center Finder</h3>
      <p className="text-gray-600">Find nearby vaccination centers and book appointments</p>
    </div>
    
    <div className="grid md:grid-cols-2 gap-6 mb-6">
      <div className="bg-slimy text-white p-6 rounded-lg shadow-lg">
        <div className="flex items-center space-x-3 mb-4">
          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
          </svg>
          <div>
            <h4 className="font-bold text-xl">Find Centers</h4>
            <p className="opacity-90">Locate vaccination centers near you</p>
          </div>
        </div>
        <button className="bg-white text-slimy px-6 py-3 rounded-lg font-semibold hover:bg-gray-50 transition-colors w-full">
          Search Centers
        </button>
      </div>
      
      <div className="bg-steel text-white p-6 rounded-lg shadow-lg">
        <div className="flex items-center space-x-3 mb-4">
          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <div>
            <h4 className="font-bold text-xl">My Schedule</h4>
            <p className="opacity-90">Track your vaccination timeline</p>
          </div>
        </div>
        <button className="bg-white text-steel px-6 py-3 rounded-lg font-semibold hover:bg-gray-50 transition-colors w-full">
          View Schedule
        </button>
      </div>
    </div>
  </div>
);

const ResourcesSection = () => {
  const { currentUser } = useAuth();
  const [isEditingResources, setIsEditingResources] = useState(false);
  const [selectedResource, setSelectedResource] = useState(null);
  const [resources, setResources] = useState([
    {
      id: 1,
      title: "Daily Health Tips",
      description: "Evidence-based wellness advice for better living",
      content: "• **Drink 8-10 glasses of water daily** for proper hydration\n• **Exercise for 30 minutes daily** to maintain cardiovascular health\n• **Get 7-8 hours of sleep** for optimal recovery and mental health\n• **Eat 5 servings of fruits and vegetables** for essential nutrients\n• **Practice stress management techniques** like meditation and deep breathing",
      category: "General Wellness",
      lastUpdated: "2024-01-15",
      source: "WHO Guidelines"
    },
    {
      id: 2,
      title: "Emergency First Aid",
      description: "Essential first aid procedures and emergency protocols",
      content: "**CPR Steps (Cardiopulmonary Resuscitation):**\n1. **Check responsiveness** - Tap shoulders and shout\n2. **Call 108 immediately** - Get emergency help\n3. **30 chest compressions** - Push hard and fast on center of chest\n4. **2 rescue breaths** - Tilt head back, lift chin\n5. **Repeat cycles** until help arrives\n\n**Choking Emergency:**\n1. **5 back blows** - Between shoulder blades\n2. **5 abdominal thrusts** - Heimlich maneuver\n3. **Repeat until object dislodged** or person becomes unconscious",
      category: "Emergency Care",
      lastUpdated: "2024-01-10",
      source: "Red Cross Guidelines"
    },
    {
      id: 3,
      title: "Nutrition Guidelines",
      description: "Balanced diet recommendations for optimal health",
      content: "**Daily Nutritional Requirements:**\n• **Carbohydrates: 45-65% of total calories** - Choose whole grains\n• **Proteins: 10-35% of total calories** - Include lean meats, legumes\n• **Healthy Fats: 20-35% of total calories** - Avoid trans fats\n• **Fiber: 25-35g daily** - From fruits, vegetables, whole grains\n• **Limit sodium to 2300mg daily** - Reduce processed foods\n• **Limit added sugars to 10% of calories** - Avoid sugary drinks",
      category: "Nutrition",
      lastUpdated: "2024-01-12",
      source: "ICMR Guidelines"
    },
    {
      id: 4,
      title: "Exercise & Fitness",
      description: "Physical activity guidelines and workout plans",
      content: "**Weekly Exercise Goals (WHO Guidelines):**\n• **150 minutes moderate aerobic activity** - Brisk walking, cycling\n• **2+ days muscle strengthening** - Weight training, resistance exercises\n• **Balance and flexibility exercises** - Yoga, stretching routines\n\n**Sample Daily Routine:**\n• **30 minutes brisk walking** - Morning or evening\n• **10 minutes stretching** - Focus on major muscle groups\n• **2-3 strength exercises** - Push-ups, squats, planks",
      category: "Fitness",
      lastUpdated: "2024-01-08",
      source: "Ministry of Sports"
    },
    {
      id: 5,
      title: "Mental Health Support",
      description: "Stress management and psychological wellness",
      content: "**Stress Management Techniques:**\n• **Practice deep breathing** - 4-7-8 technique (inhale 4, hold 7, exhale 8)\n• **Regular meditation** - 10-15 minutes daily for mental clarity\n• **Maintain social connections** - Stay connected with family and friends\n• **Limit screen time before bed** - Avoid devices 1 hour before sleep\n• **Seek professional help when needed** - Don't hesitate to consult experts\n\n**24/7 Mental Health Helplines:**\n• **NIMHANS Helpline: 080-46110007**\n• **Vandrevala Foundation: 9999666555**\n• **iCall Helpline: 9152987821**",
      category: "Mental Health",
      lastUpdated: "2024-01-14",
      source: "NIMHANS Guidelines"
    },
    {
      id: 6,
      title: "Vaccination Schedule",
      description: "Immunization guidelines and vaccine information",
      content: "**Essential Adult Vaccines:**\n• **COVID-19 Vaccine** - As per current government guidelines\n• **Influenza Vaccine** - Annual vaccination recommended\n• **Tetanus Vaccine** - Booster every 10 years\n• **Hepatitis B Vaccine** - 3-dose series for protection\n\n**Find Vaccination Centers:**\n• **CoWIN Portal:** cowin.gov.in - Official government portal\n• **COVID Helpline: 1075** - 24/7 assistance\n• **Aarogya Setu App** - Mobile application for booking",
      category: "Prevention",
      lastUpdated: "2024-01-16",
      source: "CoWIN Portal"
    }
  ]);

  const handleEditResource = (resource) => {
    setSelectedResource(resource);
    setIsEditingResources(true);
  };

  const handleSaveResource = (updatedResource) => {
    setResources(prev => prev.map(r => r.id === updatedResource.id ? updatedResource : r));
    setIsEditingResources(false);
    setSelectedResource(null);
  };

  const handleAddResource = () => {
    const newResource = {
      id: Date.now(),
      title: "New Health Resource",
      description: "Add description here",
      content: "Add detailed content here",
      category: "General",
      lastUpdated: new Date().toISOString().split('T')[0],
      source: "Custom"
    };
    setSelectedResource(newResource);
    setIsEditingResources(true);
  };

  return (
    <div className="h-full bg-white rounded-lg shadow-lg p-6 overflow-y-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-2xl font-bold text-gray-900 mb-2">Health Resources & Guidelines</h3>
          <p className="text-gray-600">Evidence-based health information and wellness guidance</p>
        </div>
        {currentUser?.role === 'admin' && (
          <button
            onClick={handleAddResource}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            <span>Add Resource</span>
          </button>
        )}
      </div>
      
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {resources.map((resource) => (
          <div key={resource.id} className="bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-all">
            <div className="p-6">
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <h4 className="font-bold text-lg text-gray-900 mb-2">{resource.title}</h4>
                  <p className="text-gray-600 text-sm mb-3">{resource.description}</p>
                  <div className="flex items-center space-x-4 text-xs text-gray-500 mb-4">
                    <span className="bg-gray-100 px-2 py-1 rounded">{resource.category}</span>
                    <span>Updated: {new Date(resource.lastUpdated).toLocaleDateString()}</span>
                  </div>
                </div>
                {currentUser?.role === 'admin' && (
                  <button
                    onClick={() => handleEditResource(resource)}
                    className="text-gray-400 hover:text-blue-600 transition-colors"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                  </button>
                )}
              </div>
              
              <div className="bg-gray-50 p-3 rounded text-sm">
                <div className="whitespace-pre-line text-gray-700 text-left">
                  {resource.content.length > 150 ? (
                    <>
                      {resource.content.substring(0, 150).split('**').map((part, index) => 
                        index % 2 === 1 ? <strong key={index}>{part}</strong> : part
                      )}
                      ...
                    </>
                  ) : (
                    resource.content.split('**').map((part, index) => 
                      index % 2 === 1 ? <strong key={index}>{part}</strong> : part
                    )
                  )}
                </div>
              </div>
              
              <div className="mt-3 flex items-center justify-between">
                <span className="text-xs text-gray-500">Source: {resource.source}</span>
                <button
                  onClick={() => setSelectedResource(resource)}
                  className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                >
                  View Details
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {/* Edit Modal */}
      {isEditingResources && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full mx-4 max-h-[80vh] overflow-y-auto">
            <div className="p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Edit Health Resource</h3>
              <form onSubmit={(e) => {
                e.preventDefault();
                handleSaveResource(selectedResource);
              }} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                  <input
                    type="text"
                    value={selectedResource?.title || ''}
                    onChange={(e) => setSelectedResource({...selectedResource, title: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                  <input
                    type="text"
                    value={selectedResource?.description || ''}
                    onChange={(e) => setSelectedResource({...selectedResource, description: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Content</label>
                  <textarea
                    value={selectedResource?.content || ''}
                    onChange={(e) => setSelectedResource({...selectedResource, content: e.target.value})}
                    rows={8}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                    placeholder="Use **text** for bold formatting"
                    required
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                    <select
                      value={selectedResource?.category || ''}
                      onChange={(e) => setSelectedResource({...selectedResource, category: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="General Wellness">General Wellness</option>
                      <option value="Emergency Care">Emergency Care</option>
                      <option value="Nutrition">Nutrition</option>
                      <option value="Fitness">Fitness</option>
                      <option value="Mental Health">Mental Health</option>
                      <option value="Prevention">Prevention</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Source</label>
                    <input
                      type="text"
                      value={selectedResource?.source || ''}
                      onChange={(e) => setSelectedResource({...selectedResource, source: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>
                </div>
                <div className="flex justify-end space-x-4 pt-4">
                  <button
                    type="button"
                    onClick={() => {
                      setIsEditingResources(false);
                      setSelectedResource(null);
                    }}
                    className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  >
                    Save Resource
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
      
      {/* Detail Modal */}
      {selectedResource && !isEditingResources && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full mx-4 max-h-[80vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-gray-900">{selectedResource.title}</h3>
                <div className="flex space-x-2">
                  {currentUser?.role === 'admin' && (
                    <button
                      onClick={() => handleEditResource(selectedResource)}
                      className="text-blue-600 hover:text-blue-800"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                    </button>
                  )}
                  <button
                    onClick={() => setSelectedResource(null)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>
              
              <div className="mb-4">
                <p className="text-gray-600 mb-3">{selectedResource.description}</p>
                <div className="flex items-center space-x-4 text-sm text-gray-500 mb-4">
                  <span className="bg-gray-100 px-2 py-1 rounded">{selectedResource.category}</span>
                  <span>Updated: {new Date(selectedResource.lastUpdated).toLocaleDateString()}</span>
                  <span>Source: {selectedResource.source}</span>
                </div>
              </div>
              
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="whitespace-pre-line text-gray-700 text-left">
                  {selectedResource.content.split('**').map((part, index) => 
                    index % 2 === 1 ? <strong key={index}>{part}</strong> : part
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// ProfileSection removed - now using UserProfile component

export default ProfessionalUserDashboard;