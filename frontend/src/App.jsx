import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider, useApp } from './context/AppContext';
import { Toast } from './components/Toast';
import { LandingPage } from './pages/LandingPage';
import { CitizenLogin } from './pages/citizen/CitizenLogin';
import { CitizenRegister } from './pages/citizen/CitizenRegister';
import { CitizenDashboard } from './pages/citizen/CitizenDashboard';
import { MunicipalityLoading } from './pages/municipality/MunicipalityLoading';
import { MunicipalityWowScreen } from './pages/municipality/MunicipalityWowScreen';
import { MunicipalityLogin } from './pages/municipality/MunicipalityLogin';
import { MunicipalityDashboard } from './pages/municipality/MunicipalityDashboard';
import { NotFoundPage } from './pages/NotFoundPage';

// Protected Route wrappers
const ProtectedCitizenRoute = ({ children }) => {
  const { citizenUser } = useApp();
  if (!citizenUser) {
    return <Navigate to="/citizen/login" replace />;
  }
  return children;
};

const ProtectedOfficerRoute = ({ children }) => {
  const { officerUser } = useApp();
  if (!officerUser) {
    return <Navigate to="/municipality/login" replace />;
  }
  return children;
};

export function AppContent() {
  return (
    <>
      <Toast />
      <Routes>
        {/* Landing Page */}
        <Route path="/" element={<LandingPage />} />

        {/* Citizen Portal */}
        <Route path="/citizen/login" element={<CitizenLogin />} />
        <Route path="/citizen/register" element={<CitizenRegister />} />
        <Route 
          path="/citizen/dashboard" 
          element={
            <ProtectedCitizenRoute>
              <CitizenDashboard />
            </ProtectedCitizenRoute>
          } 
        />

        {/* Municipality Portal Sequence */}
        <Route path="/municipality/loading" element={<MunicipalityLoading />} />
        <Route path="/municipality/wow" element={<MunicipalityWowScreen />} />
        <Route path="/municipality/login" element={<MunicipalityLogin />} />
        <Route 
          path="/municipality/dashboard" 
          element={
            <ProtectedOfficerRoute>
              <MunicipalityDashboard />
            </ProtectedOfficerRoute>
          } 
        />

        {/* 404 Fallback */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </>
  );
}

export default function App() {
  return (
    <AppProvider>
      <Router>
        <AppContent />
      </Router>
    </AppProvider>
  );
}
