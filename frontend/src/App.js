import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
// Professional UI Components
import ProfessionalLandingPage from './pages/ProfessionalLandingPage';
import EnhancedLoginPage from './pages/EnhancedLoginPage';
import EnhancedRegisterPage from './pages/EnhancedRegisterPage';
import ProfessionalUserDashboard from './pages/ProfessionalUserDashboard';
import AdminDashboard from './pages/AdminDashboard';
import AdminLoginPage from './pages/AdminLoginPage';
// Legacy Components (kept for compatibility)
import AdminSetup from './pages/AdminSetup';
import ChatInterface from './components/ChatInterface';
import HealthQuiz from './components/HealthQuiz';
import VaccinationAlert from './components/VaccinationAlert';
import VaccinationPage from './pages/VaccinationPage';
import CoWINTest from './components/CoWINTest';
import './App.css';

function App() {
  return (
    <AuthProvider>
      <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <div className="App">
          <Routes>
            {/* Professional UI Routes */}
            <Route path="/" element={<ProfessionalLandingPage />} />
            <Route path="/login" element={<EnhancedLoginPage />} />
            <Route path="/register" element={<EnhancedRegisterPage />} />
            <Route path="/dashboard" element={<ProfessionalUserDashboard />} />
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/admin-login" element={<AdminLoginPage />} />
            
            {/* Legacy Routes (kept for compatibility) */}
            <Route path="/legacy-admin-login" element={<AdminLoginPage />} />
            <Route path="/admin-setup" element={<AdminSetup />} />
            <Route path="/chat" element={<ChatInterface />} />
            <Route path="/quiz" element={<HealthQuiz />} />
            <Route path="/vaccination" element={<VaccinationAlert />} />
            <Route path="/vaccination-centers" element={<VaccinationPage />} />
            <Route path="/cowin-test" element={<CoWINTest />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
