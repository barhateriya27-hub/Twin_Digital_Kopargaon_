import React, { useState } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { AdminHeader } from '../components/gov/AdminHeader';
import { AdminSidebar } from '../components/dashboard/AdminSidebar';
import { NotificationDrawer } from '../components/NotificationDrawer';
import { CompletionReportModal } from '../components/CompletionReportModal';
import { PublicReportModal } from '../components/PublicReportModal';
import { GlobalAIAssistant } from '../components/ai/GlobalAIAssistant';
import { Bot, X } from 'lucide-react';

/**
 * Official Municipality Portal Layout Shell
 * Structure:
 * 1. Persistent Top Header (Full Width)
 * 2. Split Body (Below Header):
 *    - Left: Persistent Admin Sidebar (Independent Scroll)
 *    - Right: Dynamic Page Workspace (Independent Scroll)
 */
export const MunicipalityLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { 
    officerUser, 
    activeGovernanceRole,
    setActiveGovernanceRole,
    complaints = [], 
    notifications = [], 
    logoutOfficer,
    submitCompletionReport
  } = useApp();

  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isNotifDrawerOpen, setIsNotifDrawerOpen] = useState(false);
  const [completionTargetComplaint, setCompletionTargetComplaint] = useState(null);
  const [publicReportTargetComplaint, setPublicReportTargetComplaint] = useState(null);

  // Floating AI Assistant drawer state
  const [isAiOpen, setIsAiOpen] = useState(false);

  const unreadNotifCount = notifications.filter(
    (n) => !n.read && (n.recipientRole === 'officer' || n.recipientRole === 'higher_authority')
  ).length;

  const escalatedCount = complaints.filter(c => c.isEscalated || c.status === 'Escalated').length;

  const handleLogout = () => {
    logoutOfficer();
    navigate('/municipality/login');
  };

  const getPageTitle = (pathname) => {
    if (pathname.includes('/municipality/overview')) return 'Municipal Overview & Telemetry';
    if (pathname.includes('/municipality/complaints')) return 'Complaints Directory & SLA Lifecycle';
    if (pathname.includes('/municipality/gis')) return 'Smart City Spatial GIS Engine';
    if (pathname.includes('/municipality/wards')) return 'Ward Management & Inspection';
    if (pathname.includes('/municipality/water')) return 'Water Supply Telemetry & Reservoir Grid';
    if (pathname.includes('/municipality/waste')) return 'Sanitation & Waste Management Fleet';
    if (pathname.includes('/municipality/roads')) return 'Traffic & PWD Road Infrastructure';
    if (pathname.includes('/municipality/permissions')) return 'Building Permissions & Trade Licensing';
    if (pathname.includes('/municipality/revenue')) return 'Revenue Admin & Tax Collection';
    if (pathname.includes('/municipality/notices')) return 'Public Announcements & Gazette Notices';
    if (pathname.includes('/municipality/emergency')) return 'Emergency & Disaster Control Room';
    if (pathname.includes('/municipality/reports')) return 'Reports & Governance Analytics';
    if (pathname.includes('/municipality/ai-assistant')) return 'Governance AI Intelligence Assistant';
    if (pathname.includes('/municipality/settings')) return 'Administrative System Settings';
    if (pathname.includes('/municipality/higher-authority')) return 'Higher Authority Commissioner Portal';
    return 'Executive Administration Dashboard';
  };

  return (
    <div className="h-screen w-screen flex flex-col bg-[#F8FAFC] dark:bg-slate-900 overflow-hidden text-slate-800 dark:text-slate-100 font-sans selection:bg-[#0B2545] selection:text-white">
      {/* 1. PERSISTENT TOP HEADER (FULL WIDTH AT TOP) */}
      <AdminHeader
        officerUser={officerUser}
        activeTabTitle={getPageTitle(location.pathname)}
        unreadCount={unreadNotifCount}
        onOpenNotifications={() => setIsNotifDrawerOpen(true)}
        onOpenProfile={() => navigate('/municipality/settings')}
        onLogout={handleLogout}
        onToggleMobileMenu={() => setIsMobileOpen(!isMobileOpen)}
        activeGovernanceRole={activeGovernanceRole}
        setActiveGovernanceRole={setActiveGovernanceRole}
      />

      {/* 2. SPLIT BODY AREA BELOW NAVBAR */}
      <div className="flex-1 flex overflow-hidden relative">
        
        {/* 2A. PERSISTENT LEFT SIDEBAR (INDEPENDENT SCROLL) */}
        <AdminSidebar
          activePath={location.pathname}
          onSelectTab={(tabId, path) => {
            if (path) navigate(path);
            setIsMobileOpen(false);
          }}
          onLogout={handleLogout}
          mobileOpen={isMobileOpen}
          onCloseMobile={() => setIsMobileOpen(false)}
          complaintCount={complaints.length}
          escalatedCount={escalatedCount}
        />

        {/* 2B. DYNAMIC MAIN WORKSPACE AREA (INDEPENDENT SCROLL) */}
        <div className="flex-1 min-w-0 flex flex-col justify-between overflow-y-auto h-full">
          <main className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto w-full flex-1">
            <Outlet context={{
              setCompletionTargetComplaint,
              setPublicReportTargetComplaint
            }} />
          </main>

          {/* OFFICIAL GOVERNMENT FOOTER */}
          <footer className="py-4 px-6 text-center text-xs text-slate-600 dark:text-slate-400 border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shrink-0">
            <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-[#0B2545]">कोपरगाव नगर परिषद</span>
                <span>• Kopargaon Municipal Council Administration</span>
              </div>
              <div className="text-slate-500 font-mono text-[11px]">
                NIC Integrated Smart City Administrative Portal • Govt. of Maharashtra
              </div>
            </div>
          </footer>
        </div>
      </div>

      {/* 3. GLOBAL AI CHATBOT ASSISTANT */}
      <GlobalAIAssistant />

      {/* 4. MODALS & NOTIFICATION DRAWER */}
      <NotificationDrawer
        isOpen={isNotifDrawerOpen}
        onClose={() => setIsNotifDrawerOpen(false)}
        userRole={activeGovernanceRole === 'higher_authority' ? 'higher_authority' : 'officer'}
      />

      <CompletionReportModal
        isOpen={!!completionTargetComplaint}
        onClose={() => setCompletionTargetComplaint(null)}
        complaint={completionTargetComplaint}
        onSubmitReport={submitCompletionReport}
      />

      <PublicReportModal
        isOpen={!!publicReportTargetComplaint}
        onClose={() => setPublicReportTargetComplaint(null)}
        complaint={publicReportTargetComplaint}
      />
    </div>
  );
};

export default MunicipalityLayout;
