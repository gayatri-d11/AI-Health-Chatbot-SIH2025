import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import AdminLoginPage from './pages/AdminLoginPage';
import RegisterPage from './pages/RegisterPage';
import AdminSetup from './pages/AdminSetup';
import UserDashboard from './pages/UserDashboard';
import AdminDashboard from './pages/AdminDashboard';
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
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/admin-login" element={<AdminLoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/admin-setup" element={<AdminSetup />} />
            <Route path="/dashboard" element={<UserDashboard />} />
            <Route path="/admin" element={<AdminDashboard />} />
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