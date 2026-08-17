import React, { useState } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { GovHeader } from '../components/gov/GovHeader';
import { CitizenSidebar } from '../components/dashboard/CitizenSidebar';
import { NotificationDrawer } from '../components/NotificationDrawer';
import { PublicReportModal } from '../components/PublicReportModal';
import { GlobalAIAssistant } from '../components/ai/GlobalAIAssistant';
import { ShieldAlert } from 'lucide-react';

/**
 * Official Citizen Portal Layout Shell
 * Structure:
 * 1. Persistent Top Header (Full Width)
 * 2. Split Body (Below Header):
 *    - Left: Persistent Sidebar (Independent Scroll)
 *    - Right: Dynamic Page Workspace (Independent Scroll)
 */
export const CitizenLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { citizenUser, officerUser, notifications = [], announcements = [], logoutCitizen } = useApp();

  const [isNotifDrawerOpen, setIsNotifDrawerOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [publicReportTarget, setPublicReportTarget] = useState(null);

  const unreadCount = notifications.filter(
    (n) => !n.read && (n.recipientRole === 'citizen' || n.recipientRole === 'all')
  ).length;

  const emergencyNotice = announcements.find(
    (a) => a.priority === 'Urgent/Emergency' && a.status === 'Published'
  );

  const handleLogout = () => {
    logoutCitizen();
    navigate('/citizen/login');
  };

  return (
    <div className="h-screen w-screen flex flex-col bg-[#F8FAFC] overflow-hidden text-slate-800 font-sans selection:bg-[#0B2545] selection:text-white">
      {/* 1. PERSISTENT TOP HEADER (FULL WIDTH AT TOP) */}
      <GovHeader
        citizenUser={officerUser || citizenUser}
        unreadCount={unreadCount}
        onOpenNotifications={() => setIsNotifDrawerOpen(true)}
        onOpenProfile={() => navigate('/citizen/profile')}
        onLogout={handleLogout}
        onToggleMobileMenu={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
      />

      {/* 2. SPLIT BODY AREA BELOW NAVBAR */}
      <div className="flex-1 flex overflow-hidden relative">
        
        {/* 2A. PERSISTENT LEFT SIDEBAR (INDEPENDENT SCROLL) */}
        <CitizenSidebar
          activePath={location.pathname}
          onSelectTab={(tabId, path) => {
            if (path) navigate(path);
            setIsMobileMenuOpen(false);
          }}
          onOpenEmergencyModal={() => {
            navigate('/citizen/emergency');
            setIsMobileMenuOpen(false);
          }}
          onLogout={handleLogout}
          mobileOpen={isMobileMenuOpen}
          onCloseMobile={() => setIsMobileMenuOpen(false)}
        />

        {/* 2B. DYNAMIC MAIN WORKSPACE AREA (INDEPENDENT SCROLL) */}
        <div className="flex-1 min-w-0 flex flex-col justify-between overflow-y-auto h-full">
          
          {/* Disaster Advisory Banner if present */}
          {emergencyNotice && (
            <div className="bg-[#B71C1C] text-white px-4 py-2 text-xs font-semibold flex items-center justify-between shadow-md shrink-0 border-b border-red-900">
              <div className="flex items-center gap-2 max-w-7xl mx-auto">
                <ShieldAlert className="w-4 h-4 text-[#FF9933] shrink-0 animate-pulse" />
                <span className="font-extrabold uppercase tracking-wider text-[#FF9933]">DISASTER ADVISORY:</span>
                <span>{emergencyNotice.title} - {emergencyNotice.description}</span>
              </div>
            </div>
          )}

          {/* DYNAMIC PAGE CONTENT AREA */}
          <main className="p-4 sm:p-6 lg:p-8 space-y-6 flex-1 max-w-7xl w-full mx-auto">
            <Outlet context={{ setPublicReportTarget }} />
          </main>

          {/* MODALS & NOTIFICATION DRAWER */}
          <NotificationDrawer
            isOpen={isNotifDrawerOpen}
            onClose={() => setIsNotifDrawerOpen(false)}
            userRole="citizen"
          />

          {publicReportTarget && (
            <PublicReportModal
              isOpen={!!publicReportTarget}
              onClose={() => setPublicReportTarget(null)}
              complaint={publicReportTarget}
            />
          )}

          {/* GLOBAL AI CHATBOT ASSISTANT */}
          <GlobalAIAssistant />

          {/* OFFICIAL GOVERNMENT FOOTER */}
          <footer className="py-4 px-6 text-center text-xs text-slate-600 border-t border-slate-200 bg-white shrink-0">
            <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-[#0B2545]">कोपरगाव नगर परिषद</span>
                <span>• Kopargaon Municipal Council • Govt. of Maharashtra</span>
              </div>
              <div className="text-slate-500 font-mono text-[11px]">
                NIC Smart City Command & Control Centre Portal • Toll-Free: 1800-233-1042
              </div>
            </div>
          </footer>
        </div>
      </div>
    </div>
  );
};

export default CitizenLayout;
