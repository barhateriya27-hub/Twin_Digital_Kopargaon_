import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider, useApp } from './context/AppContext';
import { Toast } from './components/Toast';
import { LandingPage } from './pages/LandingPage';
import { CitizenLogin } from './pages/citizen/CitizenLogin';
import { CitizenRegister } from './pages/citizen/CitizenRegister';
import { CitizenDashboard } from './pages/citizen/CitizenDashboard';
import { EmergencyServicesPage } from './pages/citizen/EmergencyServicesPage';
import { MunicipalityLoading } from './pages/municipality/MunicipalityLoading';
import { MunicipalityWowScreen } from './pages/municipality/MunicipalityWowScreen';
import { MunicipalityLogin } from './pages/municipality/MunicipalityLogin';
import { MunicipalityDashboard } from './pages/municipality/MunicipalityDashboard';
import { NotFoundPage } from './pages/NotFoundPage';

// Protected Route Wrappers (Require valid JWT session)
const ProtectedCitizenRoute = ({ children }) => {
  const { isCitizenAuthenticated } = useApp();
  if (!isCitizenAuthenticated) {
    return <Navigate to="/citizen/login" replace />;
  }
  return children;
};

const ProtectedOfficerRoute = ({ children }) => {
  const { isOfficerAuthenticated } = useApp();
  if (!isOfficerAuthenticated) {
    return <Navigate to="/municipality/login" replace />;
  }
  return children;
};

// Public-Only Route Wrappers (Prevent authenticated users from viewing login/register forms)
const PublicOnlyCitizenRoute = ({ children }) => {
  const { isCitizenAuthenticated } = useApp();
  if (isCitizenAuthenticated) {
    return <Navigate to="/citizen/dashboard" replace />;
  }
  return children;
};

const PublicOnlyOfficerRoute = ({ children }) => {
  const { isOfficerAuthenticated } = useApp();
  if (isOfficerAuthenticated) {
    return <Navigate to="/municipality/dashboard" replace />;
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
        <Route 
          path="/citizen/login" 
          element={
            <PublicOnlyCitizenRoute>
              <CitizenLogin />
            </PublicOnlyCitizenRoute>
          } 
        />
        <Route 
          path="/citizen/register" 
          element={
            <PublicOnlyCitizenRoute>
              <CitizenRegister />
            </PublicOnlyCitizenRoute>
          } 
        />
        <Route 
          path="/citizen/dashboard" 
          element={
            <ProtectedCitizenRoute>
              <CitizenDashboard />
            </ProtectedCitizenRoute>
          } 
        />
        <Route 
          path="/citizen/emergency" 
          element={
            <ProtectedCitizenRoute>
              <EmergencyServicesPage />
            </ProtectedCitizenRoute>
          } 
        />

        {/* Municipality Portal Sequence */}
        <Route path="/municipality/loading" element={<MunicipalityLoading />} />
        <Route path="/municipality/wow" element={<MunicipalityWowScreen />} />
        <Route 
          path="/municipality/login" 
          element={
            <PublicOnlyOfficerRoute>
              <MunicipalityLogin />
            </PublicOnlyOfficerRoute>
          } 
        />
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
      <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <AppContent />
      </Router>
    </AppProvider>
  );
}
