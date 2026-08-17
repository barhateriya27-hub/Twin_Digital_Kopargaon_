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
  Globe,
  Droplets,
  Zap,
  Activity,
  HeartPulse
} from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { SLAIndicator } from '../../components/SLAIndicator';
import { NotificationDrawer } from '../../components/NotificationDrawer';
import { PublicReportModal } from '../../components/PublicReportModal';
import { PermissionsDashboardView } from '../../components/permissions/PermissionsDashboardView';
import { CitizenTaxPortalView } from '../../components/tax/CitizenTaxPortalView';

// Government Smart City Command Center Redesign Sub-components
import { GovHeader } from '../../components/gov/GovHeader';
import { CitizenSidebar as GovSidebar } from '../../components/dashboard/CitizenSidebar';
import { WelcomeWidget } from '../../components/dashboard/WelcomeWidget';
import { TopStatsCards } from '../../components/dashboard/TopStatsCards';
import { CommandCenterMap } from '../../components/dashboard/CommandCenterMap';
import { RightCommandPanel } from '../../components/dashboard/RightCommandPanel';
import { CityHealthScore } from '../../components/digitaltwin/CityHealthScore';
import { QuickActionsGrid } from '../../components/dashboard/QuickActionsGrid';
import { RecentActivityTimeline } from '../../components/dashboard/RecentActivityTimeline';
import { NoticeBoard } from '../../components/dashboard/NoticeBoard';
import { WeatherWidget } from '../../components/dashboard/WeatherWidget';
import { TrafficWidget } from '../../components/dashboard/TrafficWidget';
import { AIInsightsCard } from '../../components/dashboard/AIInsightsCard';
import { useCityIntelligence } from '../../hooks/useCityIntelligence';
import { getUserLocation } from '../../services/mapService';

export const CitizenDashboard = ({ activeTab: propActiveTab, initialActiveTab, embedded = true }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const {
    citizenUser,
    officerUser,
    complaints,
    addComplaint,
    notifications,
    announcements,
    updateCitizenProfile,
    showToast,
    logoutCitizen
  } = useApp();

  const getTabFromPath = (path) => {
    if (!path) return 'dashboard';
    if (path.includes('/citizen/smart-map')) return 'smart_map';
    if (path.includes('/citizen/register-complaint')) return 'register_complaint';
    if (path.includes('/citizen/track-complaint')) return 'track_complaint';
    if (path.includes('/citizen/property-tax')) return 'property_tax';
    if (path.includes('/citizen/water-tax')) return 'water_tax';
    if (path.includes('/citizen/water-supply')) return 'water_supply';
    if (path.includes('/citizen/electricity')) return 'electricity';
    if (path.includes('/citizen/weather')) return 'weather';
    if (path.includes('/citizen/emergency')) return 'emergency';
    if (path.includes('/citizen/announcements')) return 'announcements';
    if (path.includes('/citizen/nearby-services')) return 'nearby_services';
    if (path.includes('/citizen/ai-assistant')) return 'ai_assistant';
    if (path.includes('/citizen/profile')) return 'profile';
    if (path.includes('/citizen/settings')) return 'profile';
    return 'dashboard';
  };

  const initialTab = propActiveTab || initialActiveTab || getTabFromPath(location.pathname);
  const [activeTab, setActiveTab] = useState(initialTab);
  const [isNotifDrawerOpen, setIsNotifDrawerOpen] = useState(false);
  const [publicReportTarget, setPublicReportTarget] = useState(null);
  const [timelineModalTarget, setTimelineModalTarget] = useState(null);
  const [selectedComplaint, setSelectedComplaint] = useState(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Synchronize activeTab when changed via props or URL route navigation
  useEffect(() => {
    const currentTab = propActiveTab || initialActiveTab || getTabFromPath(location.pathname);
    setActiveTab(currentTab);
  }, [location.pathname, propActiveTab, initialActiveTab]);

  // Spatial location state
  const [userLocation, setUserLocation] = useState(null);

  // Grievance Ticket Form state
  const [reportTitle, setReportTitle] = useState('');
  const [reportCategory, setReportCategory] = useState('Garbage');
  const [reportWard, setReportWard] = useState(citizenUser?.ward || 4);
  const [reportLocation, setReportLocation] = useState('');
  const [reportDescription, setReportDescription] = useState('');
  const [imagePreview, setImagePreview] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Profile Edit State
  const [profileName, setProfileName] = useState(citizenUser?.fullName || citizenUser?.name || '');
  const [profilePhone, setProfilePhone] = useState(citizenUser?.phone || citizenUser?.phoneNumber || '');
  const [profileWard, setProfileWard] = useState(citizenUser?.ward || 4);
  const [profileAddress, setProfileAddress] = useState(citizenUser?.address || '');

  const userComplaints = complaints;
  const unreadCount = notifications.filter(n => !n.read && (n.recipientRole === 'citizen' || n.recipientRole === 'all')).length;
  const emergencyNotice = announcements.find(a => a.priority === 'Urgent/Emergency' && a.status === 'Published');
  const cityIntel = useCityIntelligence({ complaints, notifications, announcements });

  useEffect(() => {
    getUserLocation().then(loc => setUserLocation(loc));

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
        locationName: reportLocation,
        description: reportDescription,
        imageUrl: imagePreview || ''
      });

      setIsSubmitting(false);
      setReportTitle('');
      setReportDescription('');
      setReportLocation('');
      setImagePreview(null);
      setActiveTab('track_complaint');
      setSelectedComplaint(created);
      showToast('Grievance Ticket Registered Successfully (72-Hr SLA)', 'success');
    }, 800);
  };

  const handleUpdateProfileSubmit = (e) => {
    e.preventDefault();
    if (updateCitizenProfile) {
      updateCitizenProfile({
        fullName: profileName,
        name: profileName,
        phone: profilePhone,
        ward: profileWard,
        address: profileAddress
      });
      showToast('Citizen Profile Updated Successfully', 'success');
    }
  };

  const handleLogout = () => {
    logoutCitizen();
    navigate('/');
  };

  const mainContent = (
    <div className="space-y-6 flex-1 max-w-7xl w-full mx-auto">

      {/* TAB 1: MAIN DASHBOARD OVERVIEW */}
          {activeTab === 'dashboard' && (
            <div className="space-y-6">
              
              {/* WELCOME BANNER WITH DYNAMIC GREETING & CLOCK */}
              <WelcomeWidget 
                citizenName={officerUser?.name || citizenUser?.fullName || citizenUser?.name || 'Swanandi Kathale'} 
                wardNumber={officerUser ? 'N/A' : (citizenUser?.ward || 4)} 
              />

              {/* QUICK ACTION BAR */}
              <div className="bg-gradient-to-r from-[#0B2545] via-[#103459] to-[#0B2545] p-3 sm:p-4 rounded-2xl border border-sky-900/50 shadow-lg flex flex-wrap items-center justify-between gap-3 text-white">
                <div className="flex items-center gap-2 font-black text-xs uppercase tracking-wider text-slate-200">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
                  <span>Citizen Quick Action Portal:</span>
                </div>
                <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
                  <button
                    onClick={() => setActiveTab('register_complaint')}
                    className="px-4 py-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white rounded-xl text-xs font-extrabold transition-all shadow-md hover:scale-[1.02] active:scale-95 flex items-center gap-2 border border-emerald-400/30 cursor-pointer"
                  >
                    <PlusCircle className="w-4 h-4 text-emerald-200" />
                    Register Complaint
                  </button>
                  <button
                    onClick={() => setActiveTab('track_complaint')}
                    className="px-4 py-2.5 bg-gradient-to-r from-sky-600 to-blue-600 hover:from-sky-500 hover:to-blue-500 text-white rounded-xl text-xs font-extrabold transition-all shadow-md hover:scale-[1.02] active:scale-95 flex items-center gap-2 border border-sky-400/30 cursor-pointer"
                  >
                    <ClipboardList className="w-4 h-4 text-sky-200" />
                    Track Complaint
                  </button>
                  <button
                    onClick={() => {
                      window.dispatchEvent(new CustomEvent('OPEN_GLOBAL_AI_ASSISTANT'));
                    }}
                    className="px-4 py-2.5 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-white rounded-xl text-xs font-extrabold transition-all shadow-md hover:scale-[1.02] active:scale-95 flex items-center gap-2 border border-amber-300/30 cursor-pointer"
                  >
                    <Bot className="w-4 h-4 text-amber-100" />
                    AI Assistant
                  </button>
                </div>
              </div>

              {/* TOP STATISTICS CARDS */}
              <TopStatsCards complaints={complaints} />

              {/* CITY HEALTH SCORE */}
              <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <CityHealthScore cityHealth={cityIntel.cityHealth} compact />
                <div className="text-xs text-slate-500 dark:text-slate-400 sm:text-right space-y-0.5">
                  <p className="font-bold text-slate-700 dark:text-slate-300">Kopargaon Municipal Services</p>
                  <p>All service metrics are derived from real complaint data.</p>
                  <p className="font-mono text-[10px]">{complaints.length} total registered complaints • {cityIntel.metrics.open} open</p>
                </div>
              </div>

              {/* COMMAND CENTER GRID */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                <div className="lg:col-span-8 space-y-3">
                  <div className="flex items-center justify-between">
                    <h2 className="text-sm font-extrabold uppercase tracking-wider text-[#0B2545] flex items-center gap-2">
                      <Navigation className="w-4 h-4 text-[#FF9933]" />
                      PM Gati Shakti Smart City GIS Command Map
                    </h2>
                    <span className="text-[11px] font-mono text-slate-500">
                      NIC Real-Time Spatial Feed Active
                    </span>
                  </div>

                  <CommandCenterMap
                    userLocation={userLocation}
                    complaints={complaints}
                    onSelectComplaint={(inc) => {
                      setSelectedComplaint(inc);
                      setActiveTab('track_complaint');
                    }}
                  />
                </div>

                <div className="lg:col-span-4">
                  <RightCommandPanel
                    complaints={complaints}
                    announcements={announcements}
                    onSelectComplaint={(inc) => {
                      setSelectedComplaint(inc);
                      setActiveTab('track_complaint');
                    }}
                    onSelectTab={setActiveTab}
                  />
                </div>
              </div>

              <AIInsightsCard onActionClick={(tab) => setActiveTab(tab)} />

              <QuickActionsGrid
                onSelectTab={setActiveTab}
                onOpenEmergency={() => setActiveTab('emergency')}
              />

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                <div className="lg:col-span-6">
                  <RecentActivityTimeline />
                </div>
                <div className="lg:col-span-6">
                  <NoticeBoard announcements={announcements} />
                </div>
              </div>

            </div>
          )}

          {/* TAB 2: SMART CITY MAP FULLSCREEN */}
          {activeTab === 'smart_map' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between bg-[#0B2545] text-white p-4 rounded-xl shadow-xs">
                <div>
                  <h2 className="text-base font-extrabold uppercase text-white">
                    Kopargaon GIS Spatial Digital Twin
                  </h2>
                  <p className="text-xs text-slate-300">
                    ISRO Bhuvan & ArcGIS Layer Engine • 17 Asset Marker Layers
                  </p>
                </div>
              </div>

              <CommandCenterMap
                userLocation={userLocation}
                complaints={complaints}
                onSelectComplaint={(inc) => {
                  setSelectedComplaint(inc);
                  setActiveTab('track_complaint');
                }}
              />
            </div>
          )}

          {/* TAB 3: REGISTER COMPLAINT */}
          {(activeTab === 'register_complaint' || activeTab === 'complaints') && (
            <div className="max-w-3xl mx-auto space-y-6">
              <div className="bg-white rounded-xl p-6 sm:p-8 border border-slate-200 shadow-md space-y-6">
                <div className="border-b border-slate-100 pb-4">
                  <span className="px-3 py-1 bg-[#FF9933]/15 text-[#D97706] rounded-full text-xs font-bold uppercase tracking-wider inline-block mb-2 border border-[#FF9933]/30">
                    National Grievance Portal (72-Hour SLA Enforced)
                  </span>
                  <h2 className="text-lg font-black text-[#0B2545]">
                    Register Citizen Grievance Ticket (कोपरगाव नगर परिषद तक्रार नोंदणी)
                  </h2>
                  <p className="text-xs text-slate-500 mt-1">
                    Direct electronic dispatch to Ward Sanitation & Field Engineers.
                  </p>
                </div>

                <form onSubmit={handleReportSubmit} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-[#0B2545] uppercase tracking-wider mb-1.5">
                      Grievance Title *
                    </label>
                    <input
                      type="text"
                      value={reportTitle}
                      onChange={(e) => setReportTitle(e.target.value)}
                      placeholder="e.g. Broken Water Main Line on Station Road Corridor"
                      className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:border-[#0B2545]"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-[#0B2545] uppercase tracking-wider mb-1.5">
                        Category *
                      </label>
                      <select
                        value={reportCategory}
                        onChange={(e) => setReportCategory(e.target.value)}
                        className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:border-[#0B2545] cursor-pointer"
                      >
                        <option value="Garbage">Garbage / Sanitation (स्वच्छता)</option>
                        <option value="Road Pothole">Road Maintenance (रस्ते दुरुस्ती)</option>
                        <option value="Water Leakage">Water Pipeline Leak (पाणी पुरवठा)</option>
                        <option value="Streetlight">Streetlight Maintenance (पथदिवे)</option>
                        <option value="Drainage Rupture">Drainage Rupture (गटार तुंबणे)</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-[#0B2545] uppercase tracking-wider mb-1.5">
                        Municipal Ward Number *
                      </label>
                      <select
                        value={reportWard}
                        onChange={(e) => setReportWard(Number(e.target.value))}
                        className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:border-[#0B2545] cursor-pointer"
                      >
                        {Array.from({ length: 28 }, (_, i) => i + 1).map((w) => (
                          <option key={w} value={w}>Ward {w}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#0B2545] uppercase tracking-wider mb-1.5">
                      Landmark & Location Details *
                    </label>
                    <input
                      type="text"
                      value={reportLocation}
                      onChange={(e) => setReportLocation(e.target.value)}
                      placeholder="e.g. Near Civil Hospital Gate, Ward 4"
                      className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:border-[#0B2545]"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#0B2545] uppercase tracking-wider mb-1.5">
                      Detailed Description *
                    </label>
                    <textarea
                      rows={4}
                      value={reportDescription}
                      onChange={(e) => setReportDescription(e.target.value)}
                      placeholder="Provide precise details to enable rapid field inspection..."
                      className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:border-[#0B2545]"
                      required
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-3.5 bg-[#0B2545] hover:bg-[#07192E] text-white font-bold rounded-xl shadow-md text-xs uppercase tracking-wider transition-all border border-[#0B2545]"
                  >
                    {isSubmitting ? 'Registering Grievance Ticket...' : 'Register Grievance & Dispatch 72-Hour SLA'}
                  </button>
                </form>
              </div>
            </div>
          )}

          {/* TAB 4: TRACK COMPLAINT */}
          {(activeTab === 'track_complaint' || activeTab === 'track') && (
            <div className="space-y-6">
              <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-xs space-y-4">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <h3 className="text-sm font-black uppercase tracking-wider text-[#0B2545]">
                    Your Registered Grievance Tickets ({userComplaints.length})
                  </h3>
                  <button
                    onClick={() => setActiveTab('register_complaint')}
                    className="px-3 py-1.5 bg-[#0B2545] text-white font-bold text-xs rounded-lg flex items-center gap-1 shadow-xs cursor-pointer"
                  >
                    <PlusCircle className="w-3.5 h-3.5" /> File New Ticket
                  </button>
                </div>

                <div className="space-y-3">
                  {userComplaints.map((item) => (
                    <div
                      key={item.id}
                      className="p-4 bg-slate-50 rounded-xl border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                    >
                      <div>
                        <div className="flex items-center gap-2 mb-1 flex-wrap">
                          <span className="font-mono text-xs font-bold text-[#0B2545]">{item.id}</span>
                          <span className="text-xs font-extrabold text-[#0B2545]">{item.category}</span>
                          <span className="text-xs text-slate-500">• Ward {item.ward}</span>
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            item.status === 'Resolved' || item.status === 'Completed' || item.status === 'Closed' ? 'bg-emerald-100 text-emerald-800' :
                            item.status === 'In Progress' ? 'bg-blue-100 text-blue-800' :
                            item.status === 'Assigned' ? 'bg-purple-100 text-purple-800' :
                            'bg-amber-100 text-amber-800'
                          }`}>
                            {item.status}
                          </span>
                        </div>
                        <h4 className="font-bold text-xs text-slate-800">{item.title}</h4>
                        <p className="text-xs text-slate-500 mt-0.5">{item.address || item.locationName}</p>
                        {item.assignedOfficer && (
                          <p className="text-[11px] font-semibold text-purple-700 mt-1">
                            Squad Assigned: {item.assignedOfficer}
                          </p>
                        )}
                      </div>

                      <div className="flex items-center gap-2 shrink-0 flex-wrap">
                        <button
                          onClick={() => setTimelineModalTarget(item)}
                          className="px-3 py-1.5 bg-[#0B2545] hover:bg-[#07192E] text-white font-bold text-xs rounded-lg flex items-center gap-1 shadow-xs cursor-pointer"
                        >
                          <Clock className="w-3.5 h-3.5" /> View Live Timeline
                        </button>

                        <SLAIndicator
                          submittedAt={item.createdAt || item.submittedAt}
                          dueDate={item.slaDueDate}
                          currentStatus={item.status}
                        />

                        {(item.status === 'Completed' || item.status === 'Resolved' || item.status === 'Closed') && (
                          <button
                            onClick={() => setPublicReportTarget(item)}
                            className="px-3 py-1.5 bg-[#138808] hover:bg-emerald-800 text-white font-bold text-xs rounded-lg flex items-center gap-1 shadow-xs cursor-pointer"
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

          {/* TAB 5 & 6: PROPERTY & WATER TAX */}
          {(activeTab === 'property_tax' || activeTab === 'water_tax' || activeTab === 'tax') && (
            <CitizenTaxPortalView />
          )}

          {/* TAB 7 & 8: WATER SUPPLY & ELECTRICITY GRID STATUS */}
          {(activeTab === 'water_supply' || activeTab === 'electricity') && (
            <div className="space-y-6">
              <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-xs space-y-4">
                <div className="flex items-center gap-2.5 border-b border-slate-100 pb-3">
                  <div className="p-2 rounded-lg bg-[#0B2545] text-[#FF9933]">
                    {activeTab === 'water_supply' ? <Droplets className="w-5 h-5" /> : <Zap className="w-5 h-5" />}
                  </div>
                  <div>
                    <h2 className="text-base font-extrabold uppercase text-[#0B2545]">
                      {activeTab === 'water_supply' ? 'Municipal Water Supply & Reservoir Telemetry' : 'MSEDCL Electrical Power Grid Telemetry'}
                    </h2>
                    <p className="text-xs text-slate-500">Real-time IoT grid performance & pressure distribution</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                    <span className="text-xs font-bold text-slate-500 uppercase">Grid Status</span>
                    <h3 className="text-lg font-black text-[#138808] mt-1">Operational (99.8%)</h3>
                  </div>
                  <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                    <span className="text-xs font-bold text-slate-500 uppercase">Primary Intake</span>
                    <h3 className="text-lg font-black text-[#0B2545] mt-1">Godavari Headworks</h3>
                  </div>
                  <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                    <span className="text-xs font-bold text-slate-500 uppercase">SLA Compliance</span>
                    <h3 className="text-lg font-black text-[#138808] mt-1">24x7 Uninterrupted</h3>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 9: WEATHER DETAIL */}
          {activeTab === 'weather' && (
            <div className="grid grid-cols-1 gap-6">
              <WeatherWidget />
              <TrafficWidget />
            </div>
          )}

          {/* TAB 10: EMERGENCY DIRECTORY */}
          {(activeTab === 'emergency' || activeTab === 'emergency_page') && (
            <div className="space-y-6">
              <div className="bg-[#B71C1C] text-white p-4 rounded-xl shadow-md flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <ShieldAlert className="w-6 h-6 text-[#FF9933] animate-pulse" />
                  <div>
                    <h2 className="text-sm font-black uppercase tracking-wider">Kopargaon 24x7 Emergency SOS Directory</h2>
                    <p className="text-xs text-red-100">National Disaster Control Room & Hospital Responders</p>
                  </div>
                </div>
                <a href="tel:108" className="px-4 py-2 bg-white text-[#B71C1C] rounded-lg font-black text-xs uppercase tracking-wider">
                  CALL 108 AMBULANCE
                </a>
              </div>
            </div>
          )}

          {/* TAB 11: PERMISSIONS & LICENSES */}
          {(activeTab === 'permissions' || activeTab === 'applications') && (
            <PermissionsDashboardView />
          )}

          {/* TAB 12: PROFILE MANAGEMENT */}
          {activeTab === 'profile' && (
            <div className="max-w-2xl mx-auto bg-white p-6 sm:p-8 rounded-xl border border-slate-200 shadow-md space-y-6">
              <div className="border-b border-slate-100 pb-4 flex items-center justify-between">
                <div>
                  <h2 className="text-base font-black text-[#0B2545]">
                    Citizen Digital Profile Settings (नागरिक माहिती)
                  </h2>
                  <p className="text-xs text-slate-500">Verified Aadhaar & Resident Record</p>
                </div>
                <span className="px-3 py-1 bg-emerald-100 text-emerald-800 rounded-full text-xs font-bold">
                  Aadhaar Verified
                </span>
              </div>

              <form onSubmit={handleUpdateProfileSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-[#0B2545] uppercase tracking-wider mb-1">
                    Full Legal Name
                  </label>
                  <input
                    type="text"
                    value={profileName}
                    onChange={(e) => setProfileName(e.target.value)}
                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-[#0B2545] uppercase tracking-wider mb-1">
                      Mobile Number
                    </label>
                    <input
                      type="text"
                      value={profilePhone}
                      onChange={(e) => setProfilePhone(e.target.value)}
                      className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#0B2545] uppercase tracking-wider mb-1">
                      Municipal Ward Number
                    </label>
                    <select
                      value={profileWard}
                      onChange={(e) => setProfileWard(Number(e.target.value))}
                      className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold"
                    >
                      {Array.from({ length: 28 }, (_, i) => i + 1).map((w) => (
                        <option key={w} value={w}>Ward {w}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#0B2545] uppercase tracking-wider mb-1">
                    Residential Address
                  </label>
                  <input
                    type="text"
                    value={profileAddress}
                    onChange={(e) => setProfileAddress(e.target.value)}
                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3 bg-[#0B2545] text-white font-bold rounded-xl text-xs uppercase tracking-wider shadow-md hover:bg-[#07192E] cursor-pointer"
                >
                  Save Updated Profile Record
                </button>
              </form>
            </div>
          )}

    </div>
  );

  // When embedded in CitizenLayout shell, return content & modals without duplicate layout shell
  if (embedded) {
    return (
      <div className="space-y-6 flex-1 max-w-7xl w-full mx-auto">
        {mainContent}

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

        {/* LIVE TIMELINE & WORKFLOW MODAL */}
        {timelineModalTarget && (
          <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="bg-white dark:bg-slate-900 rounded-2xl max-w-xl w-full p-6 shadow-2xl border border-slate-200 dark:border-slate-800 max-h-[90vh] overflow-y-auto space-y-5"
            >
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                <div>
                  <span className="font-mono text-xs font-bold text-[#0B2545] dark:text-sky-400 block">
                    Ticket #{timelineModalTarget.id}
                  </span>
                  <h3 className="font-black text-slate-900 dark:text-slate-100 text-sm">
                    {timelineModalTarget.title}
                  </h3>
                </div>
                <button
                  onClick={() => setTimelineModalTarget(null)}
                  className="p-1 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Status Pipeline Badges */}
              <div className="space-y-1">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                  Lifecycle Pipeline Stage
                </span>
                <div className="flex items-center gap-1.5 flex-wrap pt-1">
                  {['Reported', 'Assigned', 'In Progress', 'Resolved', 'Closed'].map((st, idx) => {
                    const isCurrent = timelineModalTarget.status === st;
                    return (
                      <span
                        key={st}
                        className={`px-2.5 py-1 rounded-md text-[11px] font-extrabold transition-all border ${
                          isCurrent
                            ? 'bg-[#0B2545] text-white border-[#0B2545] shadow-xs'
                            : 'bg-slate-50 dark:bg-slate-800 text-slate-500 border-slate-200 dark:border-slate-700'
                        }`}
                      >
                        {idx + 1}. {st}
                      </span>
                    );
                  })}
                </div>
              </div>

              {/* Maintenance Squad Assigned */}
              <div className="p-3 bg-purple-50 dark:bg-purple-950/40 rounded-xl border border-purple-200 dark:border-purple-900/50 flex items-center justify-between text-xs">
                <span className="font-bold text-purple-900 dark:text-purple-300">Assigned Squad / Officer:</span>
                <span className="font-extrabold text-purple-700 dark:text-purple-400">
                  {timelineModalTarget.assignedOfficer || timelineModalTarget.assignedTeamId || 'Awaiting Assignment'}
                </span>
              </div>

              {/* Audit Timeline */}
              <div className="space-y-3 pt-2">
                <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-sky-600" /> Complete Audit Timeline & Lifecycle History
                </h4>

                <div className="relative pl-6 space-y-4 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200 dark:before:bg-slate-700">
                  {timelineModalTarget.timeline && timelineModalTarget.timeline.length > 0 ? (
                    timelineModalTarget.timeline.map((evt, index) => (
                      <div key={evt.id || index} className="relative">
                        <span className="absolute -left-6 top-1.5 w-3 h-3 rounded-full bg-[#0B2545] ring-4 ring-[#F8FAFC]"></span>
                        <div className="bg-slate-50 dark:bg-slate-800/80 p-3 rounded-xl border border-slate-200 dark:border-slate-700 space-y-1">
                          <div className="flex items-center justify-between text-xs">
                            <span className="font-extrabold text-slate-900 dark:text-slate-100">{evt.action || evt.status}</span>
                            <span className="text-[10px] font-mono text-slate-400">
                              {evt.timestamp ? new Date(evt.timestamp).toLocaleString() : 'Just now'}
                            </span>
                          </div>
                          <p className="text-xs text-slate-600 dark:text-slate-300">{evt.note}</p>
                          {evt.actor && (
                            <span className="text-[10px] font-semibold text-sky-700 dark:text-sky-400 block pt-0.5">
                              Actor: {evt.actor.name} ({evt.actor.role || 'Officer'})
                            </span>
                          )}
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-xl text-xs text-slate-500">
                      Ticket registered under 72-Hour SLA monitoring. Awaiting field officer response.
                    </div>
                  )}
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex justify-end">
                <button
                  onClick={() => setTimelineModalTarget(null)}
                  className="px-4 py-2 bg-[#0B2545] text-white font-bold rounded-xl text-xs cursor-pointer"
                >
                  Close Timeline
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </div>
    );
  }

  // Standalone fallback layout
  return (
    <div className="min-h-screen bg-slate-100 text-slate-800 flex flex-col font-sans">
      <GovSidebar
        activeTab={activeTab}
        onSelectTab={(tab) => {
          setActiveTab(tab);
          setIsMobileMenuOpen(false);
        }}
        onOpenEmergencyModal={() => setActiveTab('emergency')}
        onLogout={handleLogout}
        mobileOpen={isMobileMenuOpen}
        onCloseMobile={() => setIsMobileMenuOpen(false)}
      />

      <div className="flex-1 min-w-0 flex flex-col justify-between overflow-y-auto min-h-screen">
        <GovHeader
          citizenUser={citizenUser}
          unreadCount={unreadCount}
          onOpenNotifications={() => setIsNotifDrawerOpen(true)}
          onOpenProfile={() => setActiveTab('profile')}
          onLogout={handleLogout}
          onToggleMobileMenu={() => setIsMobileMenuOpen(true)}
        />

        <main className="p-4 sm:p-6 lg:p-8 flex-1 max-w-7xl w-full mx-auto">
          {mainContent}
        </main>

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

        {/* LIVE TIMELINE & WORKFLOW MODAL */}
        {timelineModalTarget && (
          <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="bg-white dark:bg-slate-900 rounded-2xl max-w-xl w-full p-6 shadow-2xl border border-slate-200 dark:border-slate-800 max-h-[90vh] overflow-y-auto space-y-5"
            >
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                <div>
                  <span className="font-mono text-xs font-bold text-[#0B2545] dark:text-sky-400 block">
                    Ticket #{timelineModalTarget.id}
                  </span>
                  <h3 className="font-black text-slate-900 dark:text-slate-100 text-sm">
                    {timelineModalTarget.title}
                  </h3>
                </div>
                <button
                  onClick={() => setTimelineModalTarget(null)}
                  className="p-1 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Status Pipeline Badges */}
              <div className="space-y-1">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                  Lifecycle Pipeline Stage
                </span>
                <div className="flex items-center gap-1.5 flex-wrap pt-1">
                  {['Reported', 'Assigned', 'In Progress', 'Resolved', 'Closed'].map((st, idx) => {
                    const isCurrent = timelineModalTarget.status === st;
                    return (
                      <span
                        key={st}
                        className={`px-2.5 py-1 rounded-md text-[11px] font-extrabold transition-all border ${
                          isCurrent
                            ? 'bg-[#0B2545] text-white border-[#0B2545] shadow-xs'
                            : 'bg-slate-50 dark:bg-slate-800 text-slate-500 border-slate-200 dark:border-slate-700'
                        }`}
                      >
                        {idx + 1}. {st}
                      </span>
                    );
                  })}
                </div>
              </div>

              {/* Maintenance Squad Assigned */}
              <div className="p-3 bg-purple-50 dark:bg-purple-950/40 rounded-xl border border-purple-200 dark:border-purple-900/50 flex items-center justify-between text-xs">
                <span className="font-bold text-purple-900 dark:text-purple-300">Assigned Squad / Officer:</span>
                <span className="font-extrabold text-purple-700 dark:text-purple-400">
                  {timelineModalTarget.assignedOfficer || timelineModalTarget.assignedTeamId || 'Awaiting Assignment'}
                </span>
              </div>

              {/* Audit Timeline */}
              <div className="space-y-3 pt-2">
                <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-sky-600" /> Complete Audit Timeline & Lifecycle History
                </h4>

                <div className="relative pl-6 space-y-4 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200 dark:before:bg-slate-700">
                  {timelineModalTarget.timeline && timelineModalTarget.timeline.length > 0 ? (
                    timelineModalTarget.timeline.map((evt, index) => (
                      <div key={evt.id || index} className="relative">
                        <span className="absolute -left-6 top-1.5 w-3 h-3 rounded-full bg-[#0B2545] ring-4 ring-white dark:ring-slate-900"></span>
                        <div className="bg-slate-50 dark:bg-slate-800/80 p-3 rounded-xl border border-slate-200 dark:border-slate-700 space-y-1">
                          <div className="flex items-center justify-between text-xs">
                            <span className="font-extrabold text-slate-900 dark:text-slate-100">{evt.action || evt.status}</span>
                            <span className="text-[10px] font-mono text-slate-400">
                              {evt.timestamp ? new Date(evt.timestamp).toLocaleString() : 'Just now'}
                            </span>
                          </div>
                          <p className="text-xs text-slate-600 dark:text-slate-300">{evt.note}</p>
                          {evt.actor && (
                            <span className="text-[10px] font-semibold text-sky-700 dark:text-sky-400 block pt-0.5">
                              Actor: {evt.actor.name} ({evt.actor.role || 'Officer'})
                            </span>
                          )}
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-xl text-xs text-slate-500">
                      Ticket registered under 72-Hour SLA monitoring. Awaiting field officer response.
                    </div>
                  )}
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex justify-end">
                <button
                  onClick={() => setTimelineModalTarget(null)}
                  className="px-4 py-2 bg-[#0B2545] text-white font-bold rounded-xl text-xs cursor-pointer"
                >
                  Close Timeline
                </button>
              </div>
            </motion.div>
          </div>
        )}

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
  );
};

export default CitizenDashboard;
