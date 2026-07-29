import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { 
  Home, 
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
  Sparkles, 
  Shield, 
  Layers,
  ArrowUpRight,
  Award,
  Megaphone,
  Download,
  Share2,
  ShieldAlert,
  PhoneCall,
  DollarSign,
  Receipt,
  Search,
  X,
  Navigation,
  Menu,
  Bot,
  Settings,
  Map,
  CloudSun,
  Car,
  Send
} from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { ThemeToggle } from '../../components/ThemeToggle';
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

  const [activeTab, setActiveTab] = useState('overview'); // 'overview' | 'map' | 'weather' | 'traffic' | 'services' | 'updates' | 'ai_assistant' | 'report' | 'track' | 'permissions' | 'taxes' | 'profile' | 'settings'
  const [selectedComplaint, setSelectedComplaint] = useState(null);
  const [publicReportTarget, setPublicReportTarget] = useState(null);
  const [isNotifDrawerOpen, setIsNotifDrawerOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Smart City Spatial & Search State
  const [userLocation, setUserLocation] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  // AI Assistant Chat State
  const [aiQuery, setAiQuery] = useState('');
  const [aiMessages, setAiMessages] = useState([
    { sender: 'ai', text: 'Namaste! I am the Kopargaon Smart City AI Assistant. How can I assist you with municipal services, local routes, or emergency contacts today?' }
  ]);

  // Complaint Form state
  const [reportTitle, setReportTitle] = useState('');
  const [reportCategory, setReportCategory] = useState('Garbage');
  const [reportWard, setReportWard] = useState(citizenUser?.ward || 4);
  const [reportLocation, setReportLocation] = useState('');
  const [reportDescription, setReportDescription] = useState('');
  const [reportImage, setReportImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const userComplaints = complaints;
  const unreadCount = notifications.filter(n => !n.read && (n.recipientRole === 'citizen' || n.recipientRole === 'all')).length;

  // Emergency Announcement for Top Banner
  const emergencyNotice = announcements.find(a => a.priority === 'Urgent/Emergency' && a.status === 'Published');

  useEffect(() => {
    getUserLocation().then(loc => setUserLocation(loc));
  }, []);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setReportImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

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

  const handleAiSend = (e) => {
    e.preventDefault();
    if (!aiQuery.trim()) return;

    const userText = aiQuery;
    setAiQuery('');
    setAiMessages(prev => [...prev, { sender: 'user', text: userText }]);

    setTimeout(() => {
      let reply = `Kopargaon Smart City Intelligence Engine: Query parsed for "${userText}". All municipal emergency nodes, property tax gateways, and GIS spatial layers are fully active.`;
      if (userText.toLowerCase().includes('hospital')) reply = 'Nearby emergency hospital: Kopargaon Sub-District Civil Hospital on Station Road (02423-222340).';
      if (userText.toLowerCase().includes('police')) reply = 'Kopargaon City Police Station Control Room: 02423-222233 / National Emergency 112.';
      if (userText.toLowerCase().includes('tax')) reply = 'Property Tax prompt discount of 5% is active until July 31st. Proceed to Tax Dues tab to pay via UPI.';

      setAiMessages(prev => [...prev, { sender: 'ai', text: reply }]);
    }, 600);
  };

  // Get active POIs based on search query and category
  const activePois = getKopargaonPOIs(
    selectedCategory,
    searchQuery,
    userLocation?.lat,
    userLocation?.lng
  );

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0B0F17] flex text-slate-800 dark:text-slate-200 font-sans selection:bg-sky-600 selection:text-white">
      
      {/* 1. PERMANENT LEFT SIDEBAR (DESKTOP) */}
      <div className="hidden lg:block">
        <CitizenSidebar
          activeTab={activeTab}
          setActiveTab={(tab) => {
            setActiveTab(tab);
            setIsMobileMenuOpen(false);
          }}
          citizenUser={citizenUser}
          onLogout={handleLogout}
          userComplaintsCount={userComplaints.length}
        />
      </div>

      {/* 2. MOBILE / TABLET HEADER & DRAWER */}
      <div className="lg:hidden flex flex-col w-full">
        {/* Mobile Header Bar */}
        <header className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 p-3.5 flex items-center justify-between sticky top-0 z-30 shadow-xs">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsMobileMenuOpen(true)}
              className="p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              <Menu className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-[#0A2540] flex items-center justify-center text-emerald-400 font-bold border border-sky-900">
                <Building2 className="w-4 h-4" />
              </div>
              <span className="font-extrabold text-sm text-slate-900 dark:text-slate-100">
                Kopargaon Citizen Portal
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <ThemeToggle />
            <button
              onClick={() => setIsNotifDrawerOpen(true)}
              className="relative p-2 rounded-xl text-slate-600 dark:text-slate-300"
            >
              <Bell className="w-5 h-5" />
              {unreadCount > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 bg-orange-600 text-white font-extrabold text-[9px] rounded-full flex items-center justify-center animate-pulse">
                  {unreadCount}
                </span>
              )}
            </button>
          </div>
        </header>

        {/* Mobile Slide-Out Drawer */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <div className="fixed inset-0 z-50 overflow-hidden lg:hidden">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setIsMobileMenuOpen(false)}
                className="absolute inset-0 bg-slate-900/60 backdrop-blur-xs"
              />

              <motion.div
                initial={{ x: '-100%' }}
                animate={{ x: 0 }}
                exit={{ x: '-100%' }}
                transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                className="relative w-[280px] h-full bg-white dark:bg-slate-900 shadow-2xl"
              >
                <button
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600"
                >
                  <X className="w-5 h-5" />
                </button>

                <CitizenSidebar
                  activeTab={activeTab}
                  setActiveTab={(tab) => {
                    setActiveTab(tab);
                    setIsMobileMenuOpen(false);
                  }}
                  citizenUser={citizenUser}
                  onLogout={handleLogout}
                  userComplaintsCount={userComplaints.length}
                />
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </div>

      {/* 3. RIGHT MAIN CONTENT AREA */}
      <div className="flex-1 min-w-0 overflow-y-auto flex flex-col justify-between">
        
        {/* Banner Notification */}
        {emergencyNotice && (
          <div className="bg-rose-600 text-white px-4 py-2 text-xs font-semibold flex items-center justify-between shadow-md">
            <div className="flex items-center gap-2 max-w-5xl mx-auto">
              <ShieldAlert className="w-4 h-4 text-amber-300 shrink-0 animate-pulse" />
              <span className="font-bold">EMERGENCY ADVISORY:</span>
              <span>{emergencyNotice.title} - {emergencyNotice.description}</span>
            </div>
          </div>
        )}

        <main className="p-4 sm:p-6 lg:p-8 space-y-6 flex-1 max-w-7xl w-full mx-auto">

          {/* TAB 1: SMART CITY HOMEPAGE DASHBOARD */}
          {(activeTab === 'overview' || activeTab === 'map') && (
            <div className="space-y-6">
              <WelcomeWidget
                citizenName={citizenUser?.fullName || citizenUser?.name || ''}
                wardNumber={citizenUser?.ward || 4}
              />

              <EmergencyQuickContacts />

              {/* Search & Categories */}
              <div className="space-y-3">
                <div className="relative flex items-center w-full">
                  <Search className="w-5 h-5 text-emerald-600 absolute left-4 pointer-events-none" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search any place in Kopargaon (e.g. Civil Hospital, Somaiya College, Yeola Naka, ATM, Restaurant)..."
                    className="w-full pl-12 pr-10 py-3.5 bg-white dark:bg-slate-900 border-2 border-emerald-100 dark:border-slate-800 rounded-2xl text-sm font-semibold text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:border-emerald-500 shadow-sm transition-all"
                  />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery('')}
                      className="absolute right-3.5 p-1 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
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

              {/* Smart City Map & Side Widgets */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                <div className="lg:col-span-8 space-y-2">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-extrabold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                      <Navigation className="w-4 h-4 text-emerald-600" />
                      Kopargaon Spatial Digital Twin Map
                    </h3>
                    <span className="text-[11px] font-semibold text-slate-500">
                      Showing {activePois.length} Real Spatial Places
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

              {/* City Announcements */}
              <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
                <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                  <div className="flex items-center gap-2">
                    <Megaphone className="w-5 h-5 text-amber-500" />
                    <h2 className="text-base font-extrabold text-slate-900 dark:text-slate-100">
                      Kopargaon Municipal Announcements & Notices
                    </h2>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {announcements.slice(0, 3).map((item) => (
                    <div
                      key={item.id}
                      className="p-4 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-200 dark:border-slate-700 space-y-2"
                    >
                      <span className="px-2.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-sky-100 text-sky-800 dark:bg-sky-950/60 dark:text-sky-300 border border-sky-200 dark:border-sky-800">
                        {item.category || 'Public Advisory'}
                      </span>
                      <h3 className="font-extrabold text-sm text-slate-900 dark:text-slate-100 leading-tight">
                        {item.title}
                      </h3>
                      <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">
                        {item.description}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: WEATHER TELEMETRY VIEW */}
          {activeTab === 'weather' && (
            <div className="space-y-6">
              <WeatherWidget />
            </div>
          )}

          {/* TAB 3: LIVE TRAFFIC TELEMETRY VIEW */}
          {activeTab === 'traffic' && (
            <div className="space-y-6">
              <TrafficWidget />
            </div>
          )}

          {/* TAB 4: PUBLIC SERVICES POI DIRECTORY */}
          {activeTab === 'services' && (
            <div className="space-y-6">
              <QuickServiceCategories
                selectedCategory={selectedCategory}
                setSelectedCategory={setSelectedCategory}
              />
              <SmartCityMap pois={activePois} userLocation={userLocation} />
            </div>
          )}

          {/* TAB 5: CITY ADVISORIES & ANNOUNCEMENTS */}
          {activeTab === 'updates' && (
            <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
              <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">
                Official Municipal Bulletins & Advisories
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {announcements.map((item) => (
                  <div key={item.id} className="p-4 bg-slate-50 dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 space-y-2">
                    <span className="text-xs font-bold text-sky-600">{item.category}</span>
                    <h3 className="font-bold text-sm text-slate-900 dark:text-slate-100">{item.title}</h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">{item.description}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 6: AI ASSISTANT CHAT */}
          {activeTab === 'ai_assistant' && (
            <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm max-w-3xl mx-auto space-y-4">
              <div className="flex items-center gap-3 border-b border-slate-100 dark:border-slate-800 pb-3">
                <div className="w-10 h-10 rounded-2xl bg-purple-600 text-white flex items-center justify-center font-bold">
                  <Bot className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="text-base font-extrabold text-slate-900 dark:text-slate-100">
                    Kopargaon AI Assistant & City Query Desk
                  </h2>
                  <p className="text-xs text-slate-400 font-mono">
                    Powered by Digital Twin Spatial Intelligence
                  </p>
                </div>
              </div>

              <div className="h-80 overflow-y-auto space-y-3 p-3 bg-slate-50 dark:bg-slate-950 rounded-2xl border border-slate-200 dark:border-slate-800">
                {aiMessages.map((msg, i) => (
                  <div
                    key={i}
                    className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-md p-3 rounded-2xl text-xs leading-relaxed font-semibold ${
                        msg.sender === 'user'
                          ? 'bg-sky-600 text-white rounded-br-none'
                          : 'bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700 rounded-bl-none shadow-xs'
                      }`}
                    >
                      {msg.text}
                    </div>
                  </div>
                ))}
              </div>

              <form onSubmit={handleAiSend} className="flex gap-2">
                <input
                  type="text"
                  value={aiQuery}
                  onChange={(e) => setAiQuery(e.target.value)}
                  placeholder="Ask about hospital phone numbers, tax discounts, or police stations..."
                  className="flex-1 p-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-purple-500"
                />
                <button
                  type="submit"
                  className="px-5 py-3 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-xl text-xs flex items-center gap-1 shadow-sm"
                >
                  <Send className="w-4 h-4" /> Ask
                </button>
              </form>
            </div>
          )}

          {/* TAB 7: REPORT COMPLAINT */}
          {activeTab === 'report' && (
            <div className="max-w-2xl mx-auto bg-white dark:bg-slate-800 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-700 shadow-xl space-y-6">
              <div className="border-b border-slate-100 dark:border-slate-700 pb-4">
                <span className="px-3 py-1 bg-orange-100 dark:bg-orange-950/40 text-orange-600 rounded-full text-xs font-bold uppercase tracking-wider inline-block mb-2">
                  Grievance Redressal
                </span>
                <h2 className="text-xl font-extrabold text-slate-900 dark:text-slate-100">
                  Register Citizen Complaint (३-दिवसीय SLA कार्यप्रणाली)
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  Report potholes, sanitation, water pipe rupture, or streetlight failures with direct field officer assignment.
                </p>
              </div>

              <form onSubmit={handleReportSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                    Complaint Title *
                  </label>
                  <input
                    type="text"
                    value={reportTitle}
                    onChange={(e) => setReportTitle(e.target.value)}
                    placeholder="e.g. Major Water Pipeline Leak near Station Chowk"
                    className="w-full p-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-orange-500"
                    required
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                      Category *
                    </label>
                    <select
                      value={reportCategory}
                      onChange={(e) => setReportCategory(e.target.value)}
                      className="w-full p-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-orange-500 cursor-pointer"
                    >
                      <option value="Garbage">Garbage / Sanitation (कचरा व स्वच्छता)</option>
                      <option value="Road Pothole">Road Pothole (खड्डे व रस्ते)</option>
                      <option value="Water Leakage">Water Rupture (पाणी पुरवठा लीकेज)</option>
                      <option value="Streetlight">Streetlight Issue (पथदिवे बंद)</option>
                      <option value="Drainage Rupture">Drainage Overflow (सांडपाणी)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                      Ward Number *
                    </label>
                    <select
                      value={reportWard}
                      onChange={(e) => setReportWard(Number(e.target.value))}
                      className="w-full p-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-orange-500 cursor-pointer"
                    >
                      {Array.from({ length: 28 }, (_, i) => i + 1).map((w) => (
                        <option key={w} value={w}>Ward {w}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                    Location Landmark *
                  </label>
                  <input
                    type="text"
                    value={reportLocation}
                    onChange={(e) => setReportLocation(e.target.value)}
                    placeholder="e.g. Near S.G. Vidyalaya Gate, Station Road, Kopargaon"
                    className="w-full p-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-orange-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                    Detailed Description *
                  </label>
                  <textarea
                    rows={4}
                    value={reportDescription}
                    onChange={(e) => setReportDescription(e.target.value)}
                    placeholder="Describe the issue in detail so municipal engineers can dispatch exact repair gear..."
                    className="w-full p-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-orange-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                    Upload Incident Image
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="w-full text-xs text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-orange-50 file:text-orange-600 dark:file:bg-orange-950/40 cursor-pointer"
                  />
                  {imagePreview && (
                    <img src={imagePreview} alt="Preview" className="mt-2 h-32 object-cover rounded-xl border border-slate-200" />
                  )}
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3.5 bg-orange-600 hover:bg-orange-700 text-white font-bold rounded-xl shadow-lg shadow-orange-600/20 text-xs uppercase tracking-wide transition-all"
                >
                  {isSubmitting ? 'Submitting Grievance...' : 'Submit Ticket & Activate 3-Day SLA'}
                </button>
              </form>
            </div>
          )}

          {/* TAB 8: TRACK TICKETS */}
          {activeTab === 'track' && (
            <div className="space-y-4">
              <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 border border-slate-200 dark:border-slate-700 shadow-sm">
                <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100 mb-4">
                  Your Registered Grievance Tickets ({userComplaints.length})
                </h2>

                <div className="grid grid-cols-1 gap-3">
                  {userComplaints.map((item) => (
                    <div
                      key={item.id}
                      className="p-4 bg-slate-50 dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-700 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                    >
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-mono text-xs font-bold text-sky-600">{item.id}</span>
                          <span className="text-xs font-extrabold text-slate-800 dark:text-slate-200">{item.category}</span>
                          <span className="text-xs text-slate-400">• Ward {item.ward}</span>
                        </div>
                        <h3 className="font-bold text-sm text-slate-900 dark:text-slate-100">{item.title}</h3>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{item.locationName}</p>
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
                            className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl flex items-center gap-1 shadow-sm"
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

          {/* TAB 9: PROFILE VIEW */}
          {activeTab === 'profile' && (
            <div className="max-w-xl mx-auto bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
              <div className="text-center pb-4 border-b border-slate-100 dark:border-slate-800">
                <div className="w-16 h-16 rounded-full bg-[#0A2540] text-emerald-400 flex items-center justify-center font-bold text-2xl mx-auto mb-2 shadow-inner">
                  {(citizenUser?.fullName || citizenUser?.name) ? (citizenUser.fullName || citizenUser.name).charAt(0).toUpperCase() : 'C'}
                </div>
                <h2 className="text-lg font-extrabold text-slate-900 dark:text-slate-100">
                  {citizenUser?.fullName || citizenUser?.name || 'Citizen'}
                </h2>
                <p className="text-xs text-slate-500 font-mono">Verified Citizen Identity</p>
              </div>

              <form onSubmit={(e) => {
                e.preventDefault();
                const formData = new FormData(e.currentTarget);
                const updatedName = formData.get('fullName');
                if (updatedName && updatedName.trim()) {
                  updateCitizenProfile({ fullName: updatedName.trim(), name: updatedName.trim() });
                }
              }} className="space-y-3 text-xs">
                <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-xl space-y-1">
                  <label className="text-slate-500 font-bold block">Full Name:</label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      name="fullName"
                      defaultValue={citizenUser?.fullName || citizenUser?.name || ''}
                      key={citizenUser?.fullName || citizenUser?.name}
                      className="flex-1 p-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-slate-100 font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      required
                    />
                    <button
                      type="submit"
                      className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg text-xs transition-colors shrink-0"
                    >
                      Update Profile
                    </button>
                  </div>
                </div>
                <div className="flex justify-between p-3 bg-slate-50 dark:bg-slate-800 rounded-xl">
                  <span className="text-slate-500 font-bold">Email Address:</span>
                  <span className="font-semibold text-slate-900 dark:text-slate-100">{citizenUser?.email || ''}</span>
                </div>
                <div className="flex justify-between p-3 bg-slate-50 dark:bg-slate-800 rounded-xl">
                  <span className="text-slate-500 font-bold">Mobile Number:</span>
                  <span className="font-semibold text-slate-900 dark:text-slate-100">{citizenUser?.mobile || citizenUser?.phone || ''}</span>
                </div>
                <div className="flex justify-between p-3 bg-slate-50 dark:bg-slate-800 rounded-xl">
                  <span className="text-slate-500 font-bold">Aadhaar Number:</span>
                  <span className="font-mono font-bold text-sky-600">{citizenUser?.aadhaar || ''}</span>
                </div>
                <div className="flex justify-between p-3 bg-slate-50 dark:bg-slate-800 rounded-xl">
                  <span className="text-slate-500 font-bold">Assigned Ward:</span>
                  <span className="font-bold text-emerald-600">Ward {citizenUser?.ward || 4}</span>
                </div>
              </form>
            </div>
          )}

          {/* TAB 10: SETTINGS VIEW */}
          {activeTab === 'settings' && (
            <div className="max-w-xl mx-auto bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
              <h2 className="text-base font-extrabold text-slate-900 dark:text-slate-100">
                Citizen Portal Preferences & Settings
              </h2>
              <div className="space-y-3 text-xs">
                <div className="flex items-center justify-between p-3.5 bg-slate-50 dark:bg-slate-800 rounded-xl">
                  <div>
                    <span className="font-bold text-slate-900 dark:text-slate-100 block">Multilingual Interface</span>
                    <span className="text-slate-400">Select language from sidebar selector</span>
                  </div>
                  <LanguageSelector variant="topbar" />
                </div>
                <div className="flex items-center justify-between p-3.5 bg-slate-50 dark:bg-slate-800 rounded-xl">
                  <div>
                    <span className="font-bold text-slate-900 dark:text-slate-100 block">Dark / Light Visual Mode</span>
                    <span className="text-slate-400">Toggle dark mode interface styling</span>
                  </div>
                  <ThemeToggle />
                </div>
              </div>
            </div>
          )}

          {/* PERMISSIONS & TAXES VIEWS */}
          {activeTab === 'permissions' && <PermissionsDashboardView />}
          {activeTab === 'taxes' && <CitizenTaxPortalView />}

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

        <footer className="py-4 text-center text-xs text-slate-500 dark:text-slate-400 border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shrink-0">
          कोपरगाव नगरपरिषद • 24/7 Citizen Information Portal • Toll-Free: 1800-233-1042
        </footer>

      </div>

    </div>
  );
};
