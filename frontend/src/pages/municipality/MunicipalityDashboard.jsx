import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { 
  LayoutDashboard, 
  Map, 
  ClipboardList, 
  Bot, 
  BarChart3, 
  Sliders, 
  Bell, 
  Settings, 
  LogOut, 
  Building2, 
  ShieldCheck, 
  Activity, 
  AlertTriangle, 
  CheckCircle2, 
  Clock, 
  UserCheck, 
  Send, 
  Filter, 
  Sparkles, 
  ChevronRight, 
  TrendingUp, 
  Layers, 
  Search, 
  CheckSquare, 
  AlertCircle,
  Menu,
  X,
  FileText,
  Download,
  Eye,
  User,
  RefreshCw,
  Inbox,
  BarChart2,
  SlidersHorizontal,
  Info,
  Calendar,
  Check,
  ChevronDown,
  ShieldAlert,
  Megaphone,
  Archive,
  Award,
  DollarSign
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { KopargaonMap } from '../../components/KopargaonMap';
import { ThemeToggle } from '../../components/ThemeToggle';
import { LanguageSelector } from '../../components/LanguageSelector';
import { SLAIndicator } from '../../components/SLAIndicator';
import { NotificationDrawer } from '../../components/NotificationDrawer';
import { CompletionReportModal } from '../../components/CompletionReportModal';
import { PublicReportModal } from '../../components/PublicReportModal';
import { AnnouncementManager } from '../../components/AnnouncementManager';
import { IncidentArchive } from '../../components/IncidentArchive';
import { HigherAuthorityDashboard } from './HigherAuthorityDashboard';
import { PermissionsDashboardView } from '../../components/permissions/PermissionsDashboardView';
import { OfficerTaxManagementView } from '../../components/tax/OfficerTaxManagementView';

export const MunicipalityDashboard = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { 
    officerUser, 
    activeGovernanceRole,
    setActiveGovernanceRole,
    complaints = [], 
    notifications = [],
    announcements = [],
    cityAlerts = [], 
    logoutOfficer, 
    updateComplaintStatus, 
    assignComplaint, 
    submitCompletionReport,
    showToast 
  } = useApp();

  const [activeTab, setActiveTab] = useState('dashboard');
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [lastSyncTime, setLastSyncTime] = useState('Just now');
  const [isSyncing, setIsSyncing] = useState(false);

  // Notification Drawer state
  const [isNotifDrawerOpen, setIsNotifDrawerOpen] = useState(false);

  // Governance Modals State
  const [completionTargetComplaint, setCompletionTargetComplaint] = useState(null);
  const [publicReportTargetComplaint, setPublicReportTargetComplaint] = useState(null);

  const [selectedComplaint, setSelectedComplaint] = useState(null);
  const [statusFilter, setStatusFilter] = useState('All');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  // AI Assistant state
  const [chatMessages, setChatMessages] = useState([
    { sender: 'ai', text: 'Municipal Governance AI Engine ready. Monitoring SLA performance, ward telemetry, and auto-escalation pathways.' }
  ]);
  const [chatInput, setChatInput] = useState('');
  const [isAiThinking, setIsAiThinking] = useState(false);

  // What-If Simulation state
  const [simGarbageTrucks, setSimGarbageTrucks] = useState(5);
  const [simRoadBudget, setSimRoadBudget] = useState(50);
  const [simWaterSensors, setSimWaterSensors] = useState(false);
  const [hasRunSim, setHasRunSim] = useState(false);

  // Stats calculations
  const totalComplaints = complaints.length;
  const pendingCount = complaints.filter(c => c.status === 'Pending').length;
  const inProgressCount = complaints.filter(c => c.status === 'In Progress').length;
  const resolvedCount = complaints.filter(c => c.status === 'Completed' || c.status === 'Resolved').length;
  const escalatedCount = complaints.filter(c => c.isEscalated || c.status === 'Escalated').length;

  const unreadNotifCount = notifications.filter(n => !n.read && (n.recipientRole === 'officer' || n.recipientRole === 'higher_authority')).length;

  const handleManualSync = () => {
    setIsSyncing(true);
    setTimeout(() => {
      setLastSyncTime(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
      setIsSyncing(false);
      showToast('Municipal Telemetry & Data Synced with Server.');
    }, 600);
  };

  const handleLogout = () => {
    logoutOfficer();
    navigate('/');
  };

  const handleAiQuery = (queryText) => {
    setChatMessages(prev => [...prev, { sender: 'user', text: queryText }]);
    setIsAiThinking(true);

    setTimeout(() => {
      let aiResponse = `Municipal Audit Engine (${complaints.length} Active Records): SLA compliance tracking active. ${escalatedCount} overdue tickets flagged for Higher Authority review.`;
      setChatMessages(prev => [...prev, { sender: 'ai', text: aiResponse }]);
      setIsAiThinking(false);
    }, 500);
  };

  const handleSendChatMessage = (e) => {
    e.preventDefault();
    if (!chatInput.trim()) return;
    const userText = chatInput;
    setChatInput('');
    handleAiQuery(userText);
  };

  // Filtered complaints calculation
  const filteredComplaints = complaints.filter(c => {
    const matchesStatus = statusFilter === 'All' || c.status === statusFilter;
    const matchesCategory = categoryFilter === 'All' || c.category === categoryFilter;
    const matchesSearch = !searchQuery || 
      c.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
      c.id.toLowerCase().includes(searchQuery.toLowerCase()) || 
      (c.address && c.address.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesStatus && matchesCategory && matchesSearch;
  });

  const navGroups = [
    {
      groupTitle: 'Core Control',
      items: [
        { id: 'dashboard', label: 'Executive Overview', icon: LayoutDashboard },
        { id: 'map', label: 'Digital Twin GIS Map', icon: Map },
        { id: 'complaints', label: 'Complaints Directory', icon: ClipboardList, badge: totalComplaints }
      ]
    },
    {
      groupTitle: 'Enterprise Modules',
      items: [
        { id: 'permissions', label: 'Permissions & Licensing', icon: Building2 },
        { id: 'tax_admin', label: 'Revenue & Tax Admin', icon: DollarSign }
      ]
    },
    {
      groupTitle: 'Governance & Escalation',
      items: [
        { id: 'higher_authority', label: 'Higher Authority Portal', icon: ShieldAlert, badge: escalatedCount > 0 ? `${escalatedCount} Escalated` : null },
        { id: 'announcements', label: 'Public Announcements', icon: Megaphone },
        { id: 'archive', label: 'Incident Archive & Audits', icon: Archive }
      ]
    },
    {
      groupTitle: 'Intelligence',
      items: [
        { id: 'ai_assistant', label: 'Governance AI Assistant', icon: Bot },
        { id: 'simulator', label: 'What-If Infrastructure Sim', icon: Sliders }
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-[#0B0F17] text-slate-900 dark:text-slate-100 flex flex-col font-sans selection:bg-[#0A2540] selection:text-white">
      
      {/* Tricolor Government Ribbon */}
      <div className="h-[3px] w-full flex shrink-0">
        <div className="h-full w-1/3 bg-[#FF9933]"></div>
        <div className="h-full w-1/3 bg-white"></div>
        <div className="h-full w-1/3 bg-[#138808]"></div>
      </div>

      {/* Header */}
      <header className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 px-4 py-2.5 flex items-center justify-between sticky top-0 z-40 shadow-xs">
        
        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsMobileOpen(!isMobileOpen)}
            className="md:hidden p-1.5 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <Menu className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-md bg-[#0A2540] dark:bg-sky-950 flex items-center justify-center text-amber-400 font-bold text-xs border border-amber-400/30">
              KMC
            </div>
            <div>
              <span className="font-bold text-xs tracking-tight text-slate-900 dark:text-slate-100 block leading-tight">
                KOPARGAON MUNICIPAL CORPORATION
              </span>
              <span className="text-[10px] text-slate-500 dark:text-slate-400 block font-medium">
                Municipal Governance & Accountability Command Center
              </span>
            </div>
          </div>
        </div>

        {/* Global Search Bar */}
        <div className="hidden lg:flex items-center gap-4 flex-1 max-w-md mx-6">
          <div className="relative w-full">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search tickets, wards, completion reports, audit logs..."
              className="w-full pl-9 pr-3 py-1.5 bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-md text-xs text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-sky-500"
            />
          </div>
        </div>

        {/* Right Header Actions */}
        <div className="flex items-center gap-3">
          <LanguageSelector variant="topbar" />
          
          {/* Requirement #1: Replacement of Website Clock with Last Data Sync */}
          <button
            onClick={handleManualSync}
            className="hidden sm:flex items-center gap-1.5 text-[11px] text-slate-600 dark:text-slate-400 font-mono px-2.5 py-1 bg-slate-100 dark:bg-slate-800 rounded-md border border-slate-200 dark:border-slate-700 hover:bg-slate-200 transition-colors"
            title="Click to refresh telemetry sync"
          >
            <RefreshCw className={`w-3.5 h-3.5 text-sky-500 ${isSyncing ? 'animate-spin' : ''}`} />
            <span>Sync: {lastSyncTime}</span>
          </button>

          {/* Role Switcher Toggle (Municipal Officer vs Higher Authority) */}
          <div className="hidden md:flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-md border border-slate-200 dark:border-slate-700 text-xs font-semibold">
            <button
              onClick={() => {
                setActiveGovernanceRole('officer');
                if (activeTab === 'higher_authority') setActiveTab('dashboard');
              }}
              className={`px-2.5 py-1 rounded transition-colors ${activeGovernanceRole === 'officer' ? 'bg-[#0A2540] text-white shadow-xs' : 'text-slate-500 hover:text-slate-800'}`}
            >
              Officer View
            </button>
            <button
              onClick={() => {
                setActiveGovernanceRole('higher_authority');
                setActiveTab('higher_authority');
              }}
              className={`px-2.5 py-1 rounded transition-colors flex items-center gap-1 ${activeGovernanceRole === 'higher_authority' || activeTab === 'higher_authority' ? 'bg-rose-600 text-white shadow-xs' : 'text-slate-500 hover:text-slate-800'}`}
            >
              <ShieldAlert className="w-3 h-3 text-amber-300" />
              Higher Authority
            </button>
          </div>

          {/* Enterprise Notifications Button */}
          <button
            onClick={() => setIsNotifDrawerOpen(true)}
            className="relative p-1.5 rounded-md text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            title="Governance Notifications"
          >
            <Bell className="w-4 h-4 text-slate-700 dark:text-slate-300" />
            {unreadNotifCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-rose-500 text-white text-[9px] font-extrabold rounded-full flex items-center justify-center animate-pulse">
                {unreadNotifCount}
              </span>
            )}
          </button>

          <ThemeToggle />

          {/* User Profile */}
          <div className="flex items-center gap-2 pl-2 border-l border-slate-200 dark:border-slate-800">
            <div className="w-7 h-7 rounded-full bg-[#0A2540] text-amber-400 flex items-center justify-center font-bold text-xs border border-amber-400/30">
              {officerUser?.name?.charAt(0) || 'A'}
            </div>
            <div className="hidden xl:block text-left">
              <span className="text-xs font-semibold text-slate-900 dark:text-slate-100 block leading-tight">
                {officerUser?.name || 'Administrator'}
              </span>
              <span className="text-[10px] text-slate-500 dark:text-slate-400 block font-medium">
                {activeGovernanceRole === 'higher_authority' ? 'Municipal Commissioner' : (officerUser?.role || 'Municipal Officer')}
              </span>
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="p-1.5 text-slate-500 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30 rounded-md transition-colors"
            title="Sign Out"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* Main Workspace Body */}
      <div className="flex-1 flex overflow-hidden">
        
        {/* Mobile Slide-Over Sidebar */}
        <AnimatePresence>
          {isMobileOpen && (
            <div className="fixed inset-0 z-50 md:hidden flex">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setIsMobileOpen(false)}
                className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs"
              />
              <motion.aside
                initial={{ x: '-100%' }}
                animate={{ x: 0 }}
                exit={{ x: '-100%' }}
                transition={{ type: 'spring', damping: 25, stiffness: 250 }}
                className="relative w-72 max-w-[85vw] bg-white dark:bg-slate-900 h-full shadow-2xl flex flex-col justify-between p-4 z-10 border-r border-slate-200 dark:border-slate-800"
              >
                <div className="space-y-6 overflow-y-auto">
                  <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-md bg-[#0A2540] dark:bg-sky-950 flex items-center justify-center text-amber-400 font-bold text-xs">
                        KMC
                      </div>
                      <span className="font-bold text-xs text-slate-900 dark:text-slate-100">MUNICIPAL MENU</span>
                    </div>
                    <button onClick={() => setIsMobileOpen(false)} className="p-1 text-slate-400 hover:text-slate-700">
                      <X className="w-5 h-5" />
                    </button>
                  </div>

                  {navGroups.map((group, idx) => (
                    <div key={idx} className="space-y-1">
                      <h4 className="px-2 text-[10px] font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-1">
                        {group.groupTitle}
                      </h4>
                      {group.items.map((item) => {
                        const Icon = item.icon;
                        const isActive = activeTab === item.id;
                        return (
                          <button
                            key={item.id}
                            onClick={() => {
                              setActiveTab(item.id);
                              setIsMobileOpen(false);
                            }}
                            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-medium transition-colors ${
                              isActive
                                ? 'bg-[#0A2540] text-white font-bold shadow-xs'
                                : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                            }`}
                          >
                            <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-amber-400' : 'text-slate-500'}`} />
                            <span className="truncate flex-1 text-left">{item.label}</span>
                            {item.badge && (
                              <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-rose-500 text-white">
                                {item.badge}
                              </span>
                            )}
                          </button>
                        );
                      })}
                    </div>
                  ))}
                </div>

                <div className="pt-3 border-t border-slate-200 dark:border-slate-800 text-[11px] text-slate-500">
                  <span>Logged: {officerUser?.name || 'Municipal Officer'}</span>
                </div>
              </motion.aside>
            </div>
          )}
        </AnimatePresence>

        {/* Desktop Sidebar */}
        <aside className={`${isCollapsed ? 'w-16' : 'w-64'} bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 transition-all duration-200 hidden md:flex flex-col justify-between shrink-0 select-none`}>
          <div className="p-3 space-y-5 overflow-y-auto">
            {navGroups.map((group, idx) => (
              <div key={idx} className="space-y-1">
                {!isCollapsed && (
                  <h4 className="px-3 text-[10px] font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-1">
                    {group.groupTitle}
                  </h4>
                )}
                {group.items.map((item) => {
                  const Icon = item.icon;
                  const isActive = activeTab === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => setActiveTab(item.id)}
                      className={`w-full flex items-center gap-3 px-3 py-2 rounded-md text-xs font-medium transition-colors relative ${
                        isActive
                          ? 'bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-slate-100 font-semibold border-l-2 border-[#0A2540] dark:border-sky-400'
                          : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/50 hover:text-slate-900'
                      }`}
                    >
                      <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-[#0A2540] dark:text-sky-400' : 'text-slate-500'}`} />
                      {!isCollapsed && <span className="truncate flex-1 text-left">{item.label}</span>}
                      {!isCollapsed && item.badge && (
                        <span className={`px-1.5 py-0.2 rounded text-[10px] font-bold ${item.id === 'higher_authority' ? 'bg-rose-500 text-white animate-pulse' : 'bg-[#0A2540] text-white'}`}>
                          {item.badge}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            ))}
          </div>

          {!isCollapsed && (
            <div className="p-3 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/50 text-[11px] text-slate-500 dark:text-slate-400">
              <div className="flex items-center justify-between">
                <span className="font-medium">Governance Audit Engine:</span>
                <span className="font-semibold text-emerald-600 dark:text-emerald-400">ACTIVE</span>
              </div>
              <p className="text-[10px] text-slate-400 dark:text-slate-500 mt-0.5">3-Day SLA Monitoring Active</p>
            </div>
          )}
        </aside>

        {/* Workspace Main Area */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 bg-slate-50 dark:bg-[#0B0F17] space-y-6">

          {/* TAB 1: EXECUTIVE OVERVIEW */}
          {activeTab === 'dashboard' && (
            <div className="space-y-6">
              
              <div className="flex flex-wrap items-center justify-between gap-4 pb-2 border-b border-slate-200 dark:border-slate-800">
                <div>
                  <h1 className="text-base sm:text-lg font-bold text-slate-900 dark:text-slate-100 tracking-tight">
                    Municipal Governance & Operational Overview
                  </h1>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    Real-time municipal service telemetry & 3-day SLA compliance metrics
                  </p>
                </div>
              </div>

              {/* KPI Cards Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                
                <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-4 shadow-xs">
                  <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 mb-2">
                    <span className="text-xs font-semibold uppercase tracking-wider">Total Complaints</span>
                    <FileText className="w-4 h-4 text-slate-400" />
                  </div>
                  <div className="flex items-baseline justify-between">
                    <span className="text-2xl font-bold text-slate-900 dark:text-slate-100">{totalComplaints}</span>
                    <span className="text-[11px] font-medium text-slate-500">{pendingCount} Pending</span>
                  </div>
                  <div className="mt-3 pt-2 border-t border-slate-100 dark:border-slate-800 text-[11px] text-slate-400 flex justify-between">
                    <span>SLA Overdue/Escalated:</span>
                    <strong className="text-rose-600 dark:text-rose-400 font-semibold">{escalatedCount}</strong>
                  </div>
                </div>

                <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-4 shadow-xs">
                  <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 mb-2">
                    <span className="text-xs font-semibold uppercase tracking-wider">Resolution Rate</span>
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  </div>
                  <div className="flex items-baseline justify-between">
                    <span className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                      {totalComplaints > 0 ? `${Math.round((resolvedCount / totalComplaints) * 100)}%` : '100%'}
                    </span>
                    <span className="text-[11px] font-medium text-emerald-600 dark:text-emerald-400">{resolvedCount} Certified</span>
                  </div>
                  <div className="mt-3 pt-2 border-t border-slate-100 dark:border-slate-800 text-[11px] text-slate-400 flex justify-between">
                    <span>In Progress:</span>
                    <strong className="text-blue-600 dark:text-blue-400 font-semibold">{inProgressCount}</strong>
                  </div>
                </div>

                <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-4 shadow-xs">
                  <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 mb-2">
                    <span className="text-xs font-semibold uppercase tracking-wider">3-Day SLA Target</span>
                    <Clock className="w-4 h-4 text-sky-600" />
                  </div>
                  <div className="flex items-baseline justify-between">
                    <span className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                      {totalComplaints > 0 ? `${Math.round(((totalComplaints - escalatedCount) / totalComplaints) * 100)}%` : '100%'}
                    </span>
                    <span className="text-[11px] font-medium text-sky-600">Standard 72h</span>
                  </div>
                  <div className="mt-3 pt-2 border-t border-slate-100 dark:border-slate-800 text-[11px] text-slate-400 flex justify-between">
                    <span>Auto-Escalation Engine:</span>
                    <strong className="text-emerald-600 font-semibold">Active</strong>
                  </div>
                </div>

                <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-4 shadow-xs">
                  <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 mb-2">
                    <span className="text-xs font-semibold uppercase tracking-wider">Public Notices</span>
                    <Megaphone className="w-4 h-4 text-amber-500" />
                  </div>
                  <div className="flex items-baseline justify-between">
                    <span className="text-2xl font-bold text-slate-900 dark:text-slate-100">{announcements.length}</span>
                    <span className="text-[11px] font-medium text-amber-600">Active Bulletins</span>
                  </div>
                  <div className="mt-3 pt-2 border-t border-slate-100 dark:border-slate-800 text-[11px] text-slate-400 flex justify-between">
                    <span>Audit Logs Stored:</span>
                    <strong className="text-slate-700 dark:text-slate-300 font-semibold">{useApp().auditLogs.length}</strong>
                  </div>
                </div>

              </div>

              {/* Map & Quick Tickets */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                <div className="lg:col-span-2 space-y-3">
                  <KopargaonMap onSelectComplaint={(c) => {
                    setSelectedComplaint(c);
                    setActiveTab('complaints');
                  }} />
                </div>

                <div className="space-y-4">
                  {/* Category Breakdown */}
                  <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-4 shadow-xs">
                    <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-900 dark:text-slate-100 mb-3">
                      Department Service Breakdown
                    </h3>
                    <div className="space-y-2.5">
                      {['Sanitation', 'Public Works (PWD)', 'Water Supply', 'Electrical', 'Traffic'].map(cat => {
                        const count = complaints.filter(c => c.category.includes(cat) || c.category === cat).length;
                        const pct = totalComplaints > 0 ? Math.round((count / totalComplaints) * 100) : 0;
                        return (
                          <div key={cat} className="space-y-1 text-xs">
                            <div className="flex justify-between text-slate-700 dark:text-slate-300 font-medium">
                              <span>{cat}</span>
                              <span className="font-mono">{count} ({pct}%)</span>
                            </div>
                            <div className="w-full h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                              <div className="h-full bg-[#0A2540] dark:bg-sky-400 rounded-full" style={{ width: `${pct}%` }}></div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>

              </div>

            </div>
          )}

          {/* TAB 2: DIGITAL TWIN GIS MAP */}
          {activeTab === 'map' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-slate-200 dark:border-slate-800">
                <h1 className="text-base font-bold text-slate-900 dark:text-slate-100">
                  Full Spatial GIS Digital Twin Map
                </h1>
              </div>
              <KopargaonMap onSelectComplaint={(c) => {
                setSelectedComplaint(c);
                setActiveTab('complaints');
              }} />
            </div>
          )}

          {/* TAB 3: COMPLAINTS DIRECTORY */}
          {activeTab === 'complaints' && (
            <div className="space-y-6">
              
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200 dark:border-slate-800">
                <div>
                  <h1 className="text-base font-bold text-slate-900 dark:text-slate-100">
                    Municipal Complaint Lifecycles & SLA Directory
                  </h1>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Track complaints, monitor SLA deadlines, assign officers, and generate official completion reports
                  </p>
                </div>

                {/* Filter Controls */}
                <div className="flex items-center gap-2 flex-wrap text-xs">
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="px-3 py-1.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-md font-medium text-slate-700 dark:text-slate-300"
                  >
                    <option value="All">All Statuses</option>
                    <option value="Pending">Pending</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Escalated">Escalated</option>
                    <option value="Completed">Completed</option>
                  </select>
                </div>
              </div>

              {/* Complaints List Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredComplaints.length === 0 ? (
                  <div className="col-span-full p-12 text-center bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-400">
                    <ClipboardList className="w-10 h-10 mx-auto mb-2 opacity-30" />
                    <p className="text-xs font-medium">No complaints match filter criteria</p>
                  </div>
                ) : (
                  filteredComplaints.map((item) => {
                    const isCompleted = item.status === 'Completed' || item.status === 'Resolved';
                    return (
                      <div
                        key={item.id}
                        className={`bg-white dark:bg-slate-900 p-5 rounded-xl border transition-all space-y-3 flex flex-col justify-between ${item.isEscalated ? 'border-rose-300 dark:border-rose-900/80 shadow-rose-500/5 shadow-md' : 'border-slate-200 dark:border-slate-800'}`}
                      >
                        <div>
                          <div className="flex items-center justify-between gap-2 mb-2">
                            <span className="font-mono text-xs font-bold text-sky-600 dark:text-sky-400">
                              #{item.id}
                            </span>
                            <SLAIndicator submittedAt={item.createdAt || item.submittedAt} dueDate={item.dueDate} currentStatus={item.status} compact />
                          </div>

                          <h3 className="text-xs font-bold text-slate-900 dark:text-slate-100 mb-1 leading-snug">
                            {item.title}
                          </h3>

                          <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-2 mb-3">
                            {item.description}
                          </p>

                          <div className="text-[11px] text-slate-500 space-y-1 pt-2 border-t border-slate-100 dark:border-slate-800 font-mono">
                            <div>Ward: <strong className="text-slate-700 dark:text-slate-300">Ward {item.ward}</strong></div>
                            <div>Dept: <strong className="text-slate-700 dark:text-slate-300">{item.department}</strong></div>
                            <div>Officer: <strong className="text-slate-700 dark:text-slate-300">{item.assignedOfficer || 'Unassigned'}</strong></div>
                          </div>
                        </div>

                        {/* Action buttons */}
                        <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-2 text-xs">
                          <button
                            onClick={() => setSelectedComplaint(item)}
                            className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 rounded font-medium flex items-center gap-1"
                          >
                            <Eye className="w-3.5 h-3.5" />
                            <span>Details</span>
                          </button>

                          {isCompleted ? (
                            <button
                              onClick={() => setPublicReportTargetComplaint(item)}
                              className="px-2.5 py-1 bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 hover:bg-emerald-200 rounded font-bold flex items-center gap-1"
                            >
                              <Award className="w-3.5 h-3.5 text-emerald-600" />
                              <span>View Certificate</span>
                            </button>
                          ) : (
                            <button
                              onClick={() => setCompletionTargetComplaint(item)}
                              className="px-2.5 py-1 bg-[#0A2540] hover:bg-[#103459] text-white rounded font-bold flex items-center gap-1 shadow-xs"
                            >
                              <CheckSquare className="w-3.5 h-3.5 text-emerald-400" />
                              <span>Submit Work Report</span>
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })
                )}
              </div>

            </div>
          )}

          {/* TAB 4: HIGHER AUTHORITY PORTAL */}
          {activeTab === 'higher_authority' && (
            <HigherAuthorityDashboard onSelectComplaint={(id) => {
              const target = complaints.find(c => c.id === id);
              if (target) setSelectedComplaint(target);
            }} />
          )}

          {/* TAB 5: PUBLIC ANNOUNCEMENTS */}
          {activeTab === 'announcements' && (
            <AnnouncementManager />
          )}

          {/* TAB 6: INCIDENT ARCHIVE & AUDITS */}
          {activeTab === 'archive' && (
            <IncidentArchive onSelectComplaint={(id) => {
              const target = complaints.find(c => c.id === id);
              if (target) setSelectedComplaint(target);
            }} />
          )}

          {/* TAB 7: AI ASSISTANT */}
          {activeTab === 'ai_assistant' && (
            <div className="space-y-4 max-w-4xl mx-auto">
              <div className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
                <h2 className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2 mb-4">
                  <Bot className="w-5 h-5 text-sky-500" />
                  <span>Municipal Governance AI Telemetry Engine</span>
                </h2>

                <div className="h-80 overflow-y-auto space-y-3 p-3 bg-slate-50 dark:bg-slate-950 rounded-lg border border-slate-200 dark:border-slate-800 mb-4 font-sans text-xs">
                  {chatMessages.map((msg, idx) => (
                    <div key={idx} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                      <div className={`max-w-md p-3 rounded-xl ${msg.sender === 'user' ? 'bg-sky-600 text-white' : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200'}`}>
                        {msg.text}
                      </div>
                    </div>
                  ))}
                  {isAiThinking && (
                    <div className="text-slate-400 text-xs italic">AI Engine analyzing telemetry data...</div>
                  )}
                </div>

                <form onSubmit={handleSendChatMessage} className="flex gap-2">
                  <input
                    type="text"
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    placeholder="Ask AI about SLA bottlenecks, ward telemetry, or department workloads..."
                    className="flex-1 px-3 py-2 text-xs bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg text-slate-900 dark:text-slate-100"
                  />
                  <button type="submit" className="px-4 py-2 bg-sky-600 text-white rounded-lg text-xs font-bold">
                    Query AI
                  </button>
                </form>
              </div>
            </div>
          )}

          {/* TAB 8: INFRASTRUCTURE SIMULATOR */}
          {activeTab === 'simulator' && (
            <div className="space-y-4 max-w-4xl mx-auto">
              <div className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4 text-xs">
                <h2 className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                  <Sliders className="w-5 h-5 text-sky-500" />
                  <span>Municipal What-If Infrastructure Simulator</span>
                </h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-semibold mb-1">Additional Sanitation Fleet</label>
                    <input
                      type="range"
                      min="1"
                      max="15"
                      value={simGarbageTrucks}
                      onChange={(e) => setSimGarbageTrucks(e.target.value)}
                      className="w-full"
                    />
                    <span>+{simGarbageTrucks} Trucks</span>
                  </div>

                  <div>
                    <label className="block font-semibold mb-1">Road Repair Budget Allocation (Lakhs)</label>
                    <input
                      type="range"
                      min="10"
                      max="200"
                      value={simRoadBudget}
                      onChange={(e) => setSimRoadBudget(e.target.value)}
                      className="w-full"
                    />
                    <span>₹{simRoadBudget} Lakhs</span>
                  </div>
                </div>

                <button
                  onClick={() => {
                    setHasRunSim(true);
                    showToast('Simulation complete. Infrastructure resolution times projected to decrease by 42%.');
                  }}
                  className="px-4 py-2 bg-emerald-600 text-white font-bold rounded-lg"
                >
                  Run Simulation Model
                </button>

                {hasRunSim && (
                  <div className="p-4 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 rounded-lg text-emerald-800 dark:text-emerald-300">
                    <p className="font-bold">Simulation Results Summary:</p>
                    <p className="mt-1">Deploying +{simGarbageTrucks} garbage trucks and allocating ₹{simRoadBudget} Lakhs road budget will improve 3-day SLA compliance to 94.8% across all wards.</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* MUNICIPAL PERMISSIONS & LICENSING HUB */}
          {activeTab === 'permissions' && (
            <PermissionsDashboardView />
          )}

          {/* MUNICIPAL REVENUE & TAX ADMIN */}
          {activeTab === 'tax_admin' && (
            <OfficerTaxManagementView />
          )}
        </main>
      </div>

      {/* Ticket Details Drawer */}
      <AnimatePresence>
        {selectedComplaint && (
          <div className="fixed inset-0 z-50 overflow-hidden">
            <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-xs" onClick={() => setSelectedComplaint(null)} />
            <div className="fixed inset-y-0 right-0 max-w-full flex pl-0 sm:pl-10">
              <motion.div
                initial={{ x: '100%' }}
                animate={{ x: 0 }}
                exit={{ x: '100%' }}
                className="w-screen max-w-full sm:max-w-xl bg-white dark:bg-slate-900 shadow-2xl border-l border-slate-200 dark:border-slate-800 flex flex-col"
              >
                <div className="p-4 border-b border-slate-200 dark:border-slate-800 bg-[#0A2540] text-white flex items-center justify-between">
                  <div>
                    <span className="font-mono text-xs text-amber-400 font-bold">#{selectedComplaint.id}</span>
                    <h3 className="text-sm font-bold">{selectedComplaint.title}</h3>
                  </div>
                  <button onClick={() => setSelectedComplaint(null)} className="p-1 text-slate-300 hover:text-white">
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="flex-1 overflow-y-auto p-5 space-y-4 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-200">
                      {selectedComplaint.category}
                    </span>
                    <SLAIndicator submittedAt={selectedComplaint.createdAt || selectedComplaint.submittedAt} dueDate={selectedComplaint.dueDate} currentStatus={selectedComplaint.status} />
                  </div>

                  <div>
                    <h4 className="font-bold text-slate-700 dark:text-slate-300 mb-1">Description</h4>
                    <p className="text-slate-600 dark:text-slate-400 leading-relaxed">{selectedComplaint.description}</p>
                  </div>

                  <div className="grid grid-cols-2 gap-3 p-3 bg-slate-50 dark:bg-slate-950 rounded-lg text-slate-700 dark:text-slate-300">
                    <div>
                      <span className="font-bold block text-[10px] uppercase text-slate-400">Ward & Address</span>
                      <span>Ward {selectedComplaint.ward} • {selectedComplaint.address || selectedComplaint.locationName}</span>
                    </div>
                    <div>
                      <span className="font-bold block text-[10px] uppercase text-slate-400">Assigned Department</span>
                      <span>{selectedComplaint.department}</span>
                    </div>
                  </div>

                  {/* Complaint Timeline Events */}
                  <div>
                    <h4 className="font-bold text-slate-900 dark:text-slate-100 mb-2 uppercase text-[11px] tracking-wider border-b pb-1">
                      Immutable Complaint History & Audit Events
                    </h4>
                    <div className="space-y-3 relative before:absolute before:inset-0 before:left-2 before:w-0.5 before:bg-slate-200 dark:before:bg-slate-800">
                      {selectedComplaint.timeline?.map((evt, idx) => (
                        <div key={idx} className="relative pl-6 space-y-0.5">
                          <div className="absolute left-0 top-1 w-4 h-4 rounded-full bg-[#0A2540] dark:bg-sky-500 border-2 border-white dark:border-slate-900" />
                          <div className="flex items-center justify-between">
                            <span className="font-bold text-slate-900 dark:text-slate-100">{evt.action || evt.status}</span>
                            <span className="font-mono text-[10px] text-slate-400">{new Date(evt.timestamp).toLocaleString('en-IN')}</span>
                          </div>
                          <p className="text-slate-600 dark:text-slate-400">{evt.note}</p>
                          <span className="text-[10px] text-slate-400 block font-mono">By: {evt.actor?.name} ({evt.actor?.role})</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="p-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 flex justify-between items-center">
                  {selectedComplaint.status === 'Completed' || selectedComplaint.status === 'Resolved' ? (
                    <button
                      onClick={() => {
                        setPublicReportTargetComplaint(selectedComplaint);
                        setSelectedComplaint(null);
                      }}
                      className="w-full py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-lg flex items-center justify-center gap-2"
                    >
                      <Award className="w-4 h-4" />
                      <span>View Official Work Completion Certificate</span>
                    </button>
                  ) : (
                    <button
                      onClick={() => {
                        setCompletionTargetComplaint(selectedComplaint);
                        setSelectedComplaint(null);
                      }}
                      className="w-full py-2 bg-[#0A2540] hover:bg-[#103459] text-white font-bold text-xs rounded-lg flex items-center justify-center gap-2"
                    >
                      <CheckSquare className="w-4 h-4 text-emerald-400" />
                      <span>Submit Mandatory Work Completion Report</span>
                    </button>
                  )}
                </div>
              </motion.div>
            </div>
          </div>
        )}
      </AnimatePresence>

      {/* Enterprise Notification Drawer */}
      <NotificationDrawer
        isOpen={isNotifDrawerOpen}
        onClose={() => setIsNotifDrawerOpen(false)}
        userRole={activeGovernanceRole === 'higher_authority' ? 'higher_authority' : 'officer'}
        onSelectComplaint={(id) => {
          const target = complaints.find(c => c.id === id);
          if (target) {
            setSelectedComplaint(target);
            setActiveTab('complaints');
          }
        }}
      />

      {/* Mandatory Work Completion Report Modal */}
      <CompletionReportModal
        isOpen={!!completionTargetComplaint}
        onClose={() => setCompletionTargetComplaint(null)}
        complaint={completionTargetComplaint}
        onSubmitReport={submitCompletionReport}
      />

      {/* Downloadable / Printable Official Public Report Modal */}
      <PublicReportModal
        isOpen={!!publicReportTargetComplaint}
        onClose={() => setPublicReportTargetComplaint(null)}
        complaint={publicReportTargetComplaint}
      />
    </div>
  );
};
