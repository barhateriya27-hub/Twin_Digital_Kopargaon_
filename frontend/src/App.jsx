import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { AppProvider, useApp } from './context/AppContext';
import { Toast } from './components/Toast';
import { AccessDeniedView } from './components/AccessDeniedView';
import { SessionExpiredModal } from './components/SessionExpiredModal';
import { isTokenValid } from './utils/jwtUtils';

// Layout Shells
import { CitizenLayout } from './layouts/CitizenLayout';
import { MunicipalityLayout } from './layouts/MunicipalityLayout';

// Public & Auth Pages
import { LandingPage } from './pages/LandingPage';
import { CitizenLogin } from './pages/citizen/CitizenLogin';
import { CitizenRegister } from './pages/citizen/CitizenRegister';
import { CitizenDashboard } from './pages/citizen/CitizenDashboard';
import { EmergencyServicesPage } from './pages/citizen/EmergencyServicesPage';

// Municipality Pages
import { MunicipalityLoading } from './pages/municipality/MunicipalityLoading';
import { MunicipalityWowScreen } from './pages/municipality/MunicipalityWowScreen';
import { MunicipalityLogin } from './pages/municipality/MunicipalityLogin';
import { MunicipalityDashboard } from './pages/municipality/MunicipalityDashboard';
import { HigherAuthorityDashboard } from './pages/municipality/HigherAuthorityDashboard';
import { PermissionsDashboardView } from './components/permissions/PermissionsDashboardView';
import { OfficerTaxManagementView } from './components/tax/OfficerTaxManagementView';
import { AnnouncementManager } from './components/AnnouncementManager';
import { IncidentArchive } from './components/IncidentArchive';
import { NotFoundPage } from './pages/NotFoundPage';

// Protected Route Wrappers (Require valid JWT session & Role Clearance)
const ProtectedCitizenRoute = ({ children }) => {
  const { isCitizenAuthenticated, citizenUser, isOfficerAuthenticated, officerUser } = useApp();
  
  // If user is authenticated as an officer (staff or admin), they are authorized to view citizen pages
  if (isOfficerAuthenticated && officerUser) {
    return children;
  }
  
  if (!isCitizenAuthenticated) {
    return <Navigate to="/citizen/login" replace />;
  }
  const userRole = citizenUser?.role ? citizenUser.role.toLowerCase() : 'citizen';
  if (userRole !== 'citizen') {
    return <AccessDeniedView requiredRole="Citizen" attemptedPath="/citizen/dashboard" />;
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

const ProtectedAdminRoute = ({ children }) => {
  const { isOfficerAuthenticated, officerUser } = useApp();
  if (!isOfficerAuthenticated) {
    return <Navigate to="/municipality/login" replace />;
  }
  const role = officerUser?.role ? officerUser.role.toLowerCase() : 'officer';
  if (role !== 'admin' && role !== 'higher_authority' && role !== 'commissioner' && role !== 'officer' && role !== 'staff') {
    return <AccessDeniedView requiredRole="Smart City Commissioner (Admin)" attemptedPath="/municipality/higher-authority" />;
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
  const { isSessionExpired, setIsSessionExpired, logoutCitizen, logoutOfficer } = useApp();
  const navigate = useNavigate();

  return (
    <>
      <Toast />

      {/* Global Session Expired Re-authentication Modal */}
      <SessionExpiredModal
        isOpen={isSessionExpired}
        onReAuthenticate={() => {
          setIsSessionExpired(false);
          const cToken = localStorage.getItem('kpg_citizen_token');
          const oToken = localStorage.getItem('kpg_officer_token');
          if (cToken && !isTokenValid(cToken)) {
            logoutCitizen();
            navigate('/citizen/login');
          } else if (oToken && !isTokenValid(oToken)) {
            logoutOfficer();
            navigate('/municipality/login');
          }
        }}
        onLogout={() => {
          setIsSessionExpired(false);
          logoutCitizen();
          logoutOfficer();
        }}
      />

      <Routes>
        {/* Landing Page */}
        {/* Landing Page */}
        <Route path="/" element={<LandingPage />} />

        {/* Citizen Authentication Routes */}
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

        {/* 1. CITIZEN PORTAL PERSISTENT LAYOUT SHELL */}
        <Route 
          element={
            <ProtectedCitizenRoute>
              <CitizenLayout />
            </ProtectedCitizenRoute>
          }
        >
          <Route path="/citizen/dashboard" element={<CitizenDashboard activeTab="dashboard" embedded />} />
          <Route path="/citizen/smart-map" element={<CitizenDashboard activeTab="smart_map" embedded />} />
          <Route path="/citizen/register-complaint" element={<CitizenDashboard activeTab="register_complaint" embedded />} />
          <Route path="/citizen/track-complaint" element={<CitizenDashboard activeTab="track_complaint" embedded />} />
          <Route path="/citizen/property-tax" element={<CitizenDashboard activeTab="property_tax" embedded />} />
          <Route path="/citizen/water-tax" element={<CitizenDashboard activeTab="water_tax" embedded />} />
          <Route path="/citizen/water-supply" element={<CitizenDashboard activeTab="water_supply" embedded />} />
          <Route path="/citizen/electricity" element={<CitizenDashboard activeTab="electricity" embedded />} />
          <Route path="/citizen/weather" element={<CitizenDashboard activeTab="weather" embedded />} />
          <Route path="/citizen/emergency" element={<EmergencyServicesPage embedded />} />
          <Route path="/citizen/announcements" element={<CitizenDashboard activeTab="announcements" embedded />} />
          <Route path="/citizen/nearby-services" element={<CitizenDashboard activeTab="nearby_services" embedded />} />
          <Route path="/citizen/ai-assistant" element={<CitizenDashboard activeTab="ai_assistant" embedded />} />
          <Route path="/citizen/profile" element={<CitizenDashboard activeTab="profile" embedded />} />
          <Route path="/citizen/settings" element={<CitizenDashboard activeTab="settings" embedded />} />
        </Route>

        {/* Municipality Authentication & Intro Sequence */}
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

        {/* 2. MUNICIPALITY PORTAL PERSISTENT LAYOUT SHELL */}
        <Route 
          element={
            <ProtectedOfficerRoute>
              <MunicipalityLayout />
            </ProtectedOfficerRoute>
          }
        >
          <Route path="/municipality/dashboard" element={<MunicipalityDashboard defaultTab="dashboard" embedded />} />
          <Route path="/municipality/overview" element={<MunicipalityDashboard defaultTab="overview" embedded />} />
          <Route path="/municipality/complaints" element={<MunicipalityDashboard defaultTab="complaints" embedded />} />
          <Route path="/municipality/gis" element={<MunicipalityDashboard defaultTab="gis" embedded />} />
          <Route path="/municipality/wards" element={<MunicipalityDashboard defaultTab="ward_mgmt" embedded />} />
          <Route path="/municipality/water" element={<MunicipalityDashboard defaultTab="water_supply" embedded />} />
          <Route path="/municipality/waste" element={<MunicipalityDashboard defaultTab="waste_mgmt" embedded />} />
          <Route path="/municipality/roads" element={<MunicipalityDashboard defaultTab="traffic_roads" embedded />} />
          <Route path="/municipality/permissions" element={<PermissionsDashboardView />} />
          <Route path="/municipality/revenue" element={<OfficerTaxManagementView />} />
          <Route path="/municipality/notices" element={<AnnouncementManager />} />
          <Route path="/municipality/emergency" element={<IncidentArchive />} />
          <Route path="/municipality/reports" element={<MunicipalityDashboard defaultTab="reports_analytics" embedded />} />
          <Route path="/municipality/ai-assistant" element={<MunicipalityDashboard defaultTab="ai_assistant" embedded />} />
          <Route path="/municipality/settings" element={<MunicipalityDashboard defaultTab="settings" embedded />} />

          {/* ADMIN ONLY ROUTE: Higher Authority Dashboard */}
          <Route 
            path="/municipality/higher-authority" 
            element={
              <ProtectedAdminRoute>
                <HigherAuthorityDashboard />
              </ProtectedAdminRoute>
            } 
          />
        </Route>

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
