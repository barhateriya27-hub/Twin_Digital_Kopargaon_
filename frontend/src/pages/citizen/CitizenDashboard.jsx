import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { 
  LayoutDashboard, 
  PlusCircle, 
  ClipboardList, 
  Bell, 
  User, 
  LogOut, 
  Building2, 
  MapPin, 
  Upload, 
  CheckCircle2, 
  Clock, 
  AlertTriangle, 
  ChevronRight, 
  FileText, 
  Shield, 
  Layers,
  ArrowUpRight,
  Download,
  ShieldAlert,
  PhoneCall,
  Receipt,
  Search,
  X,
  Navigation,
  Menu,
  Bot,
  Settings,
  CloudSun,
  Send,
  Calendar,
  Globe
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { LanguageSelector } from '../../components/LanguageSelector';
import { SLAIndicator } from '../../components/SLAIndicator';
import { NotificationDrawer } from '../../components/NotificationDrawer';
import { PublicReportModal } from '../../components/PublicReportModal';
import { PermissionsDashboardView } from '../../components/permissions/PermissionsDashboardView';
import { CitizenTaxPortalView } from '../../components/tax/CitizenTaxPortalView';

// Smart City Dashboard Sub-components & Services
import { CitizenSidebar } from '../../components/dashboard/CitizenSidebar';
import { WelcomeWidget } from '../../components/dashboard/WelcomeWidget';
import { WeatherWidget } from '../../components/dashboard/WeatherWidget';
import { TrafficWidget } from '../../components/dashboard/TrafficWidget';
import { EmergencyQuickContacts } from '../../components/dashboard/EmergencyQuickContacts';
import { QuickServiceCategories } from '../../components/dashboard/QuickServiceCategories';
import { SmartCityMap } from '../../components/dashboard/SmartCityMap';
import { getKopargaonPOIs } from '../../services/poiService';
import { getUserLocation } from '../../services/mapService';

export const CitizenDashboard = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { 
    citizenUser, 
    complaints = [], 
    notifications = [], 
    announcements = [], 
    addComplaint, 
    updateCitizenProfile,
    logoutCitizen, 
    showToast 
  } = useApp();

  const [activeTab, setActiveTab] = useState('dashboard');
  const [selectedComplaint, setSelectedComplaint] = useState(null);
  const [publicReportTarget, setPublicReportTarget] = useState(null);
  const [isNotifDrawerOpen, setIsNotifDrawerOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Live Date & Time for Top Bar
  const [currentDateTime, setCurrentDateTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentDateTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Smart City Spatial & Search State
  const [userLocation, setUserLocation] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  // Complaint Form state
  const [reportTitle, setReportTitle] = useState('');
  const [reportCategory, setReportCategory] = useState('Garbage');
  const [reportWard, setReportWard] = useState(citizenUser?.ward || 4);
  const [reportLocation, setReportLocation] = useState('');
  const [reportDescription, setReportDescription] = useState('');
  const [imagePreview, setImagePreview] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const userComplaints = complaints;
  const unreadCount = notifications.filter(n => !n.read && (n.recipientRole === 'citizen' || n.recipientRole === 'all')).length;

  const emergencyNotice = announcements.find(a => a.priority === 'Urgent/Emergency' && a.status === 'Published');

  useEffect(() => {
    getUserLocation().then(loc => setUserLocation(loc));

    // Listen for custom AI Assistant navigation events
    const handleSwitchTab = (e) => {
      if (e.detail) setActiveTab(e.detail);
    };
    window.addEventListener('SWITCH_CITIZEN_TAB', handleSwitchTab);
    return () => window.removeEventListener('SWITCH_CITIZEN_TAB', handleSwitchTab);
  }, []);

  const handleReportSubmit = (e) => {
    e.preventDefault();
    if (!reportTitle || !reportDescription) {
      showToast('Please complete all required fields', 'warning');
      return;
    }

    setIsSubmitting(true);

    setTimeout(() => {
      const created = addComplaint({
        title: reportTitle,
        category: reportCategory,
        ward: reportWard,
        locationName: reportLocation || `Ward ${reportWard}, Kopargaon`,
        description: reportDescription,
        imageUrl: imagePreview || 'https://images.unsplash.com/photo-1584467735871-8e85353a8413?auto=format&fit=crop&w=600&q=80'
      });

      setIsSubmitting(false);
      setReportTitle('');
      setReportDescription('');
      setReportLocation('');
      setImagePreview(null);
      setActiveTab('track');
      setSelectedComplaint(created);
    }, 800);
  };

  const handleLogout = () => {
    logoutCitizen();
    navigate('/');
  };

  const activePois = getKopargaonPOIs(
    selectedCategory,
    searchQuery,
    userLocation?.lat,
    userLocation?.lng
  );

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex text-slate-800 font-sans selection:bg-[#0B1F3A] selection:text-white">
      
      {/* SINGLE REUSABLE SIDEBAR COMPONENT */}
      <CitizenSidebar
        activeTab={activeTab}
        onSelectTab={(tab) => {
          setActiveTab(tab);
          setIsMobileMenuOpen(false);
        }}
        onOpenEmergencyModal={() => setActiveTab('emergency_page')}
        onLogout={handleLogout}
        mobileOpen={isMobileMenuOpen}
        onCloseMobile={() => setIsMobileMenuOpen(false)}
      />

      {/* RIGHT MAIN CONTENT AREA & OFFICIAL STICKY HEADER */}
      <div className="flex-1 min-w-0 overflow-y-auto flex flex-col justify-between">
        
        {/* OFFICIAL STICKY TOP HEADER */}
        <header className="sticky top-0 z-40 bg-[#0B1F3A] text-white shadow-md border-b-2 border-[#FF9933]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 py-2.5 flex items-center justify-between gap-4">
            
            {/* Left: Mobile Menu & Emblem */}
            <div className="flex items-center gap-3">
              <button
                onClick={() => setIsMobileMenuOpen(true)}
                className="p-1.5 rounded-lg hover:bg-white/10 text-white lg:hidden"
              >
                <Menu className="w-5 h-5" />
              </button>

              <div className="flex items-center gap-2.5">
                {/* National Emblem Icon */}
                <div className="w-8 h-8 rounded bg-white/10 border border-white/20 flex items-center justify-center p-1 shrink-0">
                  <svg viewBox="0 0 24 24" className="w-6 h-6 fill-[#FF9933]">
                    <path d="M12 2L4 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-8-3zm0 4a3 3 0 1 1 0 6 3 3 0 0 1 0-6zm-5 11c0-2.5 3.33-4 5-4s5 1.5 5 4H7z"/>
                  </svg>
                </div>

                <div>
                  <h1 className="text-xs font-black uppercase tracking-widest text-white leading-tight">
                    कोपरगाव नगर परिषद
                  </h1>
                  <p className="text-[10px] text-slate-300 font-medium leading-tight hidden sm:block">
                    Kopargaon Municipal Council • Govt. of Maharashtra
                  </p>
                </div>
              </div>
            </div>

            {/* Right: Live Clock, Weather, Language, Notifications, Profile */}
            <div className="flex items-center gap-3 text-xs">
              
              {/* Date & Time */}
              <div className="hidden md:flex items-center gap-1.5 text-slate-300 font-mono bg-white/10 px-2.5 py-1 rounded-lg border border-white/10">
                <Calendar className="w-3.5 h-3.5 text-[#FF9933]" />
                <span>
                  {currentDateTime.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                </span>
                <span className="text-[#FF9933] font-bold">
                  {currentDateTime.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>

              {/* Language Selector */}
              <div className="hidden sm:block">
                <LanguageSelector variant="topbar" />
              </div>

              {/* Notification Trigger */}
              <button
                onClick={() => setIsNotifDrawerOpen(true)}
                className="relative p-2 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors"
                title="Notifications"
              >
                <Bell className="w-4 h-4" />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 bg-[#C62828] text-white font-black text-[9px] rounded-full flex items-center justify-center border-2 border-[#0B1F3A]">
                    {unreadCount}
                  </span>
                )}
              </button>

              {/* User Profile Pill */}
              <div
                onClick={() => setActiveTab('profile')}
                className="flex items-center gap-2 px-2.5 py-1 bg-white/10 hover:bg-white/20 rounded-lg cursor-pointer transition-colors border border-white/10"
              >
                <div className="w-6 h-6 rounded-full bg-[#FF9933] text-[#0B1F3A] font-black flex items-center justify-center text-[10px]">
                  {(citizenUser?.fullName || citizenUser?.name) ? (citizenUser.fullName || citizenUser.name).charAt(0).toUpperCase() : 'C'}
                </div>
                <div className="hidden xl:block text-left">
                  <p className="text-[11px] font-bold text-white leading-tight truncate">
                    {citizenUser?.fullName || citizenUser?.name || 'Citizen'}
                  </p>
                  <p className="text-[9px] text-[#FF9933] font-mono leading-tight">
                    Ward {citizenUser?.ward || 4} Resident
                  </p>
                </div>
              </div>

            </div>
          </div>
        </header>

        {/* Emergency Notice Top Banner */}
        {emergencyNotice && (
          <div className="bg-[#C62828] text-white px-4 py-2 text-xs font-semibold flex items-center justify-between shadow-md">
            <div className="flex items-center gap-2 max-w-7xl mx-auto">
              <ShieldAlert className="w-4 h-4 text-[#FF9933] shrink-0 animate-pulse" />
              <span className="font-extrabold uppercase tracking-wider text-[#FF9933]">EMERGENCY ADVISORY:</span>
              <span>{emergencyNotice.title} - {emergencyNotice.description}</span>
            </div>
          </div>
        )}

        {/* MAIN BODY AREA */}
        <main className="p-4 sm:p-6 lg:p-8 space-y-6 flex-1 max-w-7xl w-full mx-auto">

          {/* TAB 1: DASHBOARD & GIS MAP */}
          {activeTab === 'dashboard' && (
            <div className="space-y-6">
              
              <WelcomeWidget
                citizenName={citizenUser?.fullName || citizenUser?.name || ''}
                wardNumber={citizenUser?.ward || 4}
              />

              <EmergencyQuickContacts />

              {/* Search & Categories */}
              <div className="space-y-3">
                <div className="relative flex items-center w-full">
                  <Search className="w-5 h-5 text-[#0B1F3A] absolute left-4 pointer-events-none" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search Kopargaon spatial locations (e.g. Civil Hospital, Somaiya College, Yeola Naka, SBI ATM)..."
                    className="w-full pl-12 pr-10 py-3 bg-white border-2 border-[#0B1F3A]/20 rounded-2xl text-xs font-semibold text-[#0B1F3A] placeholder:text-slate-400 focus:outline-none focus:border-[#0B1F3A] shadow-sm transition-all"
                  />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery('')}
                      className="absolute right-3.5 p-1 rounded-full text-slate-400 hover:text-slate-600"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>

                <QuickServiceCategories
                  selectedCategory={selectedCategory}
                  setSelectedCategory={setSelectedCategory}
                />
              </div>

              {/* Smart City Digital Twin Map & Side Widgets */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                <div className="lg:col-span-8 space-y-2">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-extrabold text-[#0B1F3A] flex items-center gap-2">
                      <Navigation className="w-4 h-4 text-[#FF9933]" />
                      PM Gati Shakti GIS Digital Twin Map
                    </h3>
                    <span className="text-[11px] font-semibold text-slate-500">
                      Active Spatial Assets: {activePois.length} Locations
                    </span>
                  </div>

                  <SmartCityMap
                    pois={activePois}
                    userLocation={userLocation}
                    selectedCategory={selectedCategory}
                    searchQuery={searchQuery}
                  />
                </div>

                <div className="lg:col-span-4 space-y-4">
                  <WeatherWidget />
                  <TrafficWidget />
                </div>
              </div>

              {/* Public Notices */}
              <div className="bg-white rounded-2xl p-6 border border-[#0B1F3A]/15 shadow-sm space-y-4">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <div className="flex items-center gap-2">
                    <Building2 className="w-5 h-5 text-[#FF9933]" />
                    <h2 className="text-sm font-black uppercase tracking-wider text-[#0B1F3A]">
                      Official Municipal Notices & SLA Bulletins
                    </h2>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {announcements.slice(0, 3).map((item) => (
                    <div
                      key={item.id}
                      className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2"
                    >
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-[#0B1F3A]/10 text-[#0B1F3A] border border-[#0B1F3A]/20">
                        {item.category || 'Public Advisory'}
                      </span>
                      <h3 className="font-extrabold text-xs text-[#0B1F3A] leading-tight">
                        {item.title}
                      </h3>
                      <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                        {item.description}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          )}

          {/* TAB 2: COMPLAINTS & GRIEVANCES */}
          {activeTab === 'complaints' && (
            <div className="space-y-6">
              <div className="max-w-3xl mx-auto bg-white rounded-2xl p-6 sm:p-8 border border-[#0B1F3A]/15 shadow-md space-y-6">
                <div className="border-b border-slate-100 pb-4">
                  <span className="px-3 py-1 bg-[#FF9933]/15 text-[#C2410C] rounded-full text-xs font-bold uppercase tracking-wider inline-block mb-2 border border-[#FF9933]/30">
                    National Grievance Portal (SLA Enforced)
                  </span>
                  <h2 className="text-lg font-black text-[#0B1F3A]">
                    Register Citizen Grievance Ticket (३-दिवसीय SLA प्रणाली)
                  </h2>
                  <p className="text-xs text-slate-500 mt-1">
                    Direct electronic dispatch to Municipal Sanitation & Field Engineers.
                  </p>
                </div>

                <form onSubmit={handleReportSubmit} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-[#0B1F3A] uppercase tracking-wider mb-1.5">
                      Grievance Title *
                    </label>
                    <input
                      type="text"
                      value={reportTitle}
                      onChange={(e) => setReportTitle(e.target.value)}
                      placeholder="e.g. Broken Water Main Line on Station Road"
                      className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:border-[#0B1F3A]"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-[#0B1F3A] uppercase tracking-wider mb-1.5">
                        Category *
                      </label>
                      <select
                        value={reportCategory}
                        onChange={(e) => setReportCategory(e.target.value)}
                        className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:border-[#0B1F3A] cursor-pointer"
                      >
                        <option value="Garbage">Garbage / Sanitation (स्वच्छता)</option>
                        <option value="Road Pothole">Road Maintenance (रस्ते दुरुस्ती)</option>
                        <option value="Water Leakage">Water Pipeline Leak (पाणी पुरवठा)</option>
                        <option value="Streetlight">Streetlight Maintenance (पथदिवे)</option>
                        <option value="Drainage Rupture">Drainage Rupture (गटार तुंबणे)</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-[#0B1F3A] uppercase tracking-wider mb-1.5">
                        Municipal Ward Number *
                      </label>
                      <select
                        value={reportWard}
                        onChange={(e) => setReportWard(Number(e.target.value))}
                        className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:border-[#0B1F3A] cursor-pointer"
                      >
                        {Array.from({ length: 28 }, (_, i) => i + 1).map((w) => (
                          <option key={w} value={w}>Ward {w}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#0B1F3A] uppercase tracking-wider mb-1.5">
                      Landmark & Location *
                    </label>
                    <input
                      type="text"
                      value={reportLocation}
                      onChange={(e) => setReportLocation(e.target.value)}
                      placeholder="e.g. Near Government Sub-District Civil Hospital Gate"
                      className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:border-[#0B1F3A]"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#0B1F3A] uppercase tracking-wider mb-1.5">
                      Grievance Description *
                    </label>
                    <textarea
                      rows={4}
                      value={reportDescription}
                      onChange={(e) => setReportDescription(e.target.value)}
                      placeholder="Provide precise details to enable rapid field response..."
                      className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:border-[#0B1F3A]"
                      required
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-3.5 bg-[#0B1F3A] hover:bg-[#071426] text-white font-bold rounded-xl shadow-md text-xs uppercase tracking-wider transition-all border border-[#0B1F3A]"
                  >
                    {isSubmitting ? 'Registering Ticket...' : 'Register Grievance & Dispatch 72-Hour SLA'}
                  </button>
                </form>
              </div>

              {/* User Complaints List */}
              <div className="bg-white rounded-2xl p-6 border border-[#0B1F3A]/15 shadow-sm space-y-4">
                <h3 className="text-sm font-extrabold uppercase tracking-wider text-[#0B1F3A]">
                  Your Registered Tickets ({userComplaints.length})
                </h3>

                <div className="space-y-3">
                  {userComplaints.map((item) => (
                    <div
                      key={item.id}
                      className="p-4 bg-slate-50 rounded-xl border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                    >
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-mono text-xs font-bold text-[#0B1F3A]">{item.id}</span>
                          <span className="text-xs font-extrabold text-[#0B1F3A]">{item.category}</span>
                          <span className="text-xs text-slate-500">• Ward {item.ward}</span>
                        </div>
                        <h4 className="font-bold text-xs text-slate-800">{item.title}</h4>
                        <p className="text-xs text-slate-500 mt-0.5">{item.locationName}</p>
                      </div>

                      <div className="flex items-center gap-3 shrink-0">
                        <SLAIndicator
                          submittedAt={item.createdAt || item.submittedAt}
                          dueDate={item.slaDueDate}
                          currentStatus={item.status}
                        />

                        {(item.status === 'Completed' || item.status === 'Resolved') && (
                          <button
                            onClick={() => setPublicReportTarget(item)}
                            className="px-3 py-1.5 bg-[#138808] hover:bg-emerald-800 text-white font-bold text-xs rounded-lg flex items-center gap-1 shadow-sm"
                          >
                            <Download className="w-3.5 h-3.5" /> Certificate
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* PERMISSIONS & TAXES INTEGRATION */}
          {activeTab === 'tax' && <CitizenTaxPortalView />}
          {activeTab === 'permissions' && <PermissionsDashboardView />}

          {/* EMERGENCY DIRECTORY */}
          {activeTab === 'emergency_page' && (
            <div className="space-y-6">
              <EmergencyQuickContacts />
            </div>
          )}

          {/* ANNOUNCEMENTS */}
          {activeTab === 'announcements' && (
            <div className="bg-white rounded-2xl p-6 border border-[#0B1F3A]/15 shadow-sm space-y-4">
              <h2 className="text-base font-extrabold text-[#0B1F3A] uppercase tracking-wider">
                Official Municipal Bulletins & Advisories
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {announcements.map((item) => (
                  <div key={item.id} className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                    <span className="text-xs font-bold text-[#FF9933] uppercase">{item.category}</span>
                    <h3 className="font-bold text-xs text-[#0B1F3A]">{item.title}</h3>
                    <p className="text-xs text-slate-600 leading-relaxed">{item.description}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* HELP DESK & FAQ */}
          {activeTab === 'faq' && (
            <div className="bg-white rounded-2xl p-6 border border-[#0B1F3A]/15 shadow-sm space-y-4 max-w-3xl mx-auto">
              <h2 className="text-base font-extrabold text-[#0B1F3A] uppercase tracking-wider">
                NIC Government Citizen Help Desk
              </h2>
              <div className="space-y-3 text-xs">
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                  <h3 className="font-bold text-[#0B1F3A]">How is the 72-Hour Grievance SLA enforced?</h3>
                  <p className="text-slate-600 leading-relaxed">Tickets registered on the portal are automatically routed to the Ward Sanitation Officer. Escalations trigger to Municipal Chief Officer upon expiration.</p>
                </div>
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                  <h3 className="font-bold text-[#0B1F3A]">Where can I download Property Tax Receipts?</h3>
                  <p className="text-slate-600 leading-relaxed">Navigate to Property & Water Tax menu, locate your Property Assessment ID, and click Download Official Receipt.</p>
                </div>
              </div>
            </div>
          )}

        </main>

        {/* Modals & Notification Drawer */}
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

        {/* OFFICIAL GOVERNMENT FOOTER */}
        <footer className="py-4 px-6 text-center text-xs text-slate-600 border-t border-[#0B1F3A]/15 bg-white shrink-0">
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <span className="font-bold text-[#0B1F3A]">कोपरगाव नगर परिषद</span>
              <span>• Kopargaon Municipal Council</span>
            </div>
            <div className="text-slate-500 font-mono text-[11px]">
              NIC Smart City Command Center Portal • Toll-Free: 1800-233-1042
            </div>
          </div>
        </footer>

      </div>

    </div>
  );
};

export default CitizenDashboard;
