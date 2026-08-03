import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { 
  LayoutDashboard, 
  BarChart3, 
  ClipboardList, 
  Map, 
  Building2, 
  Droplets, 
  Trash2, 
  TrafficCone, 
  FileCheck, 
  Coins, 
  Megaphone, 
  ShieldAlert, 
  LineChart, 
  Bot, 
  Settings, 
  LogOut, 
  CheckCircle2, 
  Clock, 
  AlertTriangle, 
  PlusCircle, 
  Search, 
  Filter, 
  Eye, 
  Download, 
  Award, 
  CheckSquare, 
  RefreshCw, 
  FileText, 
  Activity, 
  Layers, 
  Users, 
  PhoneCall, 
  ExternalLink,
  ChevronRight,
  Zap,
  CloudSun,
  Wind,
  ShieldCheck,
  Calendar,
  X,
  Plus
} from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useApp } from '../../context/AppContext';

// Government Admin Sub-components
import { AdminHeader } from '../../components/gov/AdminHeader';
import { AdminSidebar } from '../../components/dashboard/AdminSidebar';
import { MapLibreGisCommandCenter } from '../../components/dashboard/MapLibreGisCommandCenter';
import { SLAIndicator } from '../../components/SLAIndicator';
import { NotificationDrawer } from '../../components/NotificationDrawer';
import { CompletionReportModal } from '../../components/CompletionReportModal';
import { PublicReportModal } from '../../components/PublicReportModal';
import { AnnouncementManager } from '../../components/AnnouncementManager';
import { IncidentArchive } from '../../components/IncidentArchive';
import { HigherAuthorityDashboard } from './HigherAuthorityDashboard';
import { PermissionsDashboardView } from '../../components/permissions/PermissionsDashboardView';
import { OfficerTaxManagementView } from '../../components/tax/OfficerTaxManagementView';

export const MunicipalityDashboard = ({ defaultTab = 'dashboard', embedded = true }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useTranslation();
  
  const { 
    officerUser, 
    activeGovernanceRole,
    setActiveGovernanceRole,
    complaints = [], 
    notifications = [],
    announcements = [],
    cityAlerts = [], 
    auditLogs = [],
    logoutOfficer, 
    updateComplaintStatus, 
    assignComplaint, 
    submitCompletionReport,
    addAnnouncement,
    showToast 
  } = useApp();

  // Route/Tab State
  const [activeTab, setActiveTab] = useState(defaultTab);

  useEffect(() => {
    if (defaultTab) {
      setActiveTab(defaultTab);
    }
  }, [defaultTab]);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isNotifDrawerOpen, setIsNotifDrawerOpen] = useState(false);
  const [lastSyncTime, setLastSyncTime] = useState('Just now');
  const [isSyncing, setIsSyncing] = useState(false);

  // Modals & Drawers
  const [selectedComplaint, setSelectedComplaint] = useState(null);
  const [completionTargetComplaint, setCompletionTargetComplaint] = useState(null);
  const [publicReportTargetComplaint, setPublicReportTargetComplaint] = useState(null);

  // Complaint Filters & Search
  const [statusFilter, setStatusFilter] = useState('All');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  // Ward Management State
  const [selectedWard, setSelectedWard] = useState(4);

  // AI Floating Assistant state
  const [isAiOpen, setIsAiOpen] = useState(false);
  const [aiChatMessages, setAiChatMessages] = useState([
    { sender: 'ai', text: 'Kopargaon Municipal Governance AI ready. Monitoring SLA deadlines, ward telemetry, and water supply grids.' }
  ]);
  const [aiInput, setAiInput] = useState('');
  const [isAiThinking, setIsAiThinking] = useState(false);

  // Synchronize tab if passed via props or route
  useEffect(() => {
    if (location.pathname.includes('/gis')) {
      setActiveTab('gis');
    }
  }, [location]);

  // Statistics derived directly from real data
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
      showToast('Municipal Telemetry & Data Synced with NIC Server', 'success');
    }, 600);
  };

  const handleLogout = () => {
    logoutOfficer();
    navigate('/');
  };

  // AI Assistant Handle
  const handleAiQuery = (queryText) => {
    setAiChatMessages(prev => [...prev, { sender: 'user', text: queryText }]);
    setIsAiThinking(true);

    setTimeout(() => {
      let response = '';
      const text = queryText.toLowerCase();

      if (text.includes('summary') || text.includes('today') || text.includes('operations')) {
        response = `Today's Summary: ${totalComplaints} total complaints registered. ${resolvedCount} tickets resolved today, ${pendingCount} pending inspection. Resolution rate is ${totalComplaints > 0 ? Math.round((resolvedCount / totalComplaints) * 100) : 100}%.`;
      } else if (text.includes('critical') || text.includes('issue') || text.includes('alert')) {
        response = `Critical Analysis: ${escalatedCount} complaints have exceeded the standard 72-Hour SLA and are flagged for Higher Authority escalation. Ward 4 and Ward 7 require priority field inspection.`;
      } else if (text.includes('water')) {
        response = `Water Telemetry: Godavari Headworks intake is operating at 98.4% capacity. Ward 6 & Ward 7 scheduled supply is active from 06:00 to 09:30. 2 pipeline leakage tickets currently assigned.`;
      } else if (text.includes('gis') || text.includes('map') || text.includes('hotspot')) {
        response = `GIS Spatial Hotspots: Concentration of sanitation complaints identified in Ward 4 (5 active tickets). Recommend dispatching extra sanitation fleet.`;
      } else {
        response = `Municipal Governance AI: Monitored ${totalComplaints} tickets across 28 Wards. SLA compliance engine active. All actions logged to immutable audit ledger.`;
      }

      setAiChatMessages(prev => [...prev, { sender: 'ai', text: response }]);
      setIsAiThinking(false);
    }, 600);
  };

  const handleSendAiMessage = (e) => {
    e.preventDefault();
    if (!aiInput.trim()) return;
    const msg = aiInput;
    setAiInput('');
    handleAiQuery(msg);
  };

  // Filtered Complaints List
  const filteredComplaints = complaints.filter(c => {
    const matchesStatus = statusFilter === 'All' || c.status === statusFilter;
    const matchesCategory = categoryFilter === 'All' || c.category === categoryFilter;
    const matchesSearch = !searchQuery || 
      c.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
      c.id.toLowerCase().includes(searchQuery.toLowerCase()) || 
      (c.locationName && c.locationName.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesStatus && matchesCategory && matchesSearch;
  });

  // Priority Issues (Critical & High priority items)
  const priorityIssues = complaints
    .filter(c => c.status !== 'Completed' && c.status !== 'Resolved')
    .slice(0, 4);

  // Current page title mapping
  const pageTitles = {
    dashboard: 'Executive Administration Dashboard',
    overview: 'Municipal Overview & Telemetry',
    complaints: 'Complaints Directory & SLA Lifecycle',
    gis: 'Smart City Spatial GIS Engine',
    ward_mgmt: 'Ward Management & Inspection',
    water_supply: 'Water Supply Telemetry & Reservoir Grid',
    waste_mgmt: 'Sanitation & Waste Management Fleet',
    traffic_roads: 'Traffic & PWD Road Infrastructure',
    permissions: 'Building Permissions & Trade Licensing',
    revenue_taxes: 'Revenue Admin & Tax Collection',
    notices: 'Public Announcements & Gazette Notices',
    emergency_alerts: 'Emergency & Disaster Control Room',
    reports_analytics: 'Reports & Governance Analytics',
    ai_assistant: 'Governance AI Intelligence Assistant',
    settings: 'Administrative System Settings',
    higher_authority: 'Higher Authority Commissioner Portal'
  };

  const mainContent = (
    <div className="space-y-6 max-w-7xl mx-auto w-full">

      {/* ============================================================ */}
      {/* TAB 1: DASHBOARD HOME (ANSWERING: WHAT IS HAPPENING RIGHT NOW) */}
          {/* ============================================================ */}
          {activeTab === 'dashboard' && (
            <div className="space-y-6">

              {/* WELCOME / CONTEXT BANNER */}
              <div className="bg-gradient-to-r from-[#0B2545] via-[#103459] to-[#0B2545] p-6 rounded-2xl border border-sky-900/50 shadow-lg text-white relative overflow-hidden">
                <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-[#FF9933] text-[#0B2545]">
                        KOPARGAON MUNICIPAL COUNCIL
                      </span>
                      <span className="text-xs text-slate-300 font-mono">
                        • Live Operational Feed
                      </span>
                    </div>
                    <h2 className="text-xl sm:text-2xl font-black tracking-tight text-white">
                      Welcome back, {officerUser?.name || officerUser?.fullName || 'Municipal Officer'}
                    </h2>
                    <p className="text-xs text-slate-200 mt-1 max-w-2xl">
                      Real-time operational overview of Kopargaon Municipal Council. SLA compliance monitoring active.
                    </p>
                  </div>

                  <div className="flex items-center gap-3 shrink-0">
                    <button
                      onClick={handleManualSync}
                      className="px-3.5 py-2 bg-white/10 hover:bg-white/20 text-white rounded-xl text-xs font-bold transition-all border border-white/15 flex items-center gap-2 cursor-pointer"
                    >
                      <RefreshCw className={`w-3.5 h-3.5 text-[#FF9933] ${isSyncing ? 'animate-spin' : ''}`} />
                      <span>Sync Data ({lastSyncTime})</span>
                    </button>
                    <button
                      onClick={() => setActiveTab('complaints')}
                      className="px-4 py-2 bg-[#FF9933] hover:bg-amber-500 text-[#0B2545] font-black rounded-xl text-xs uppercase tracking-wider shadow-md transition-all border border-amber-300 cursor-pointer"
                    >
                      Review Complaints ({totalComplaints})
                    </button>
                  </div>
                </div>
              </div>

              {/* 4 IMPORTANT METRICS (REAL DATA ONLY!) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                
                {/* Metric 1: Open Complaints */}
                <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs flex flex-col justify-between space-y-3">
                  <div className="flex items-center justify-between text-slate-500">
                    <span className="text-xs font-extrabold uppercase tracking-wider text-slate-600">Open Complaints</span>
                    <div className="p-2 rounded-xl bg-sky-50 text-[#0B2545]">
                      <FileText className="w-5 h-5" />
                    </div>
                  </div>
                  <div>
                    <span className="text-3xl font-black text-[#0B2545]">{pendingCount + inProgressCount}</span>
                    <span className="text-xs text-slate-500 font-medium block mt-0.5">Active field tickets requiring attention</span>
                  </div>
                  <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500 font-mono">
                    <span>Updated 2 mins ago</span>
                    <span className="text-[#0B2545] font-bold">{totalComplaints} Total</span>
                  </div>
                </div>

                {/* Metric 2: Pending Complaints */}
                <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs flex flex-col justify-between space-y-3">
                  <div className="flex items-center justify-between text-slate-500">
                    <span className="text-xs font-extrabold uppercase tracking-wider text-slate-600">Pending Inspection</span>
                    <div className="p-2 rounded-xl bg-amber-50 text-amber-600">
                      <Clock className="w-5 h-5" />
                    </div>
                  </div>
                  <div>
                    <span className="text-3xl font-black text-amber-600">{pendingCount}</span>
                    <span className="text-xs text-slate-500 font-medium block mt-0.5">Awaiting officer dispatch</span>
                  </div>
                  <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500 font-mono">
                    <span>Target: &lt;24h Dispatch</span>
                    <span className="text-amber-600 font-bold">{pendingCount > 0 ? 'Action Needed' : 'Clear'}</span>
                  </div>
                </div>

                {/* Metric 3: Resolved Today / Total */}
                <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs flex flex-col justify-between space-y-3">
                  <div className="flex items-center justify-between text-slate-500">
                    <span className="text-xs font-extrabold uppercase tracking-wider text-slate-600">Resolved Tickets</span>
                    <div className="p-2 rounded-xl bg-emerald-50 text-[#138808]">
                      <CheckCircle2 className="w-5 h-5" />
                    </div>
                  </div>
                  <div>
                    <span className="text-3xl font-black text-[#138808]">{resolvedCount}</span>
                    <span className="text-xs text-slate-500 font-medium block mt-0.5">Work completion verified</span>
                  </div>
                  <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500 font-mono">
                    <span>Resolution Rate</span>
                    <span className="text-[#138808] font-bold">
                      {totalComplaints > 0 ? `${Math.round((resolvedCount / totalComplaints) * 100)}%` : '100%'}
                    </span>
                  </div>
                </div>

                {/* Metric 4: Active Alerts & Escalations */}
                <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs flex flex-col justify-between space-y-3">
                  <div className="flex items-center justify-between text-slate-500">
                    <span className="text-xs font-extrabold uppercase tracking-wider text-slate-600">Active Alerts</span>
                    <div className="p-2 rounded-xl bg-red-50 text-red-600">
                      <ShieldAlert className="w-5 h-5" />
                    </div>
                  </div>
                  <div>
                    <span className="text-3xl font-black text-red-600">{escalatedCount || announcements.length}</span>
                    <span className="text-xs text-slate-500 font-medium block mt-0.5">Disaster bulletins & SLA risks</span>
                  </div>
                  <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500 font-mono">
                    <span>Higher Escalations</span>
                    <span className="text-red-600 font-bold">{escalatedCount} Critical</span>
                  </div>
                </div>

              </div>

              {/* GRID ROW 1: PRIORITY ISSUES & LIVE CITY STATUS */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                
                {/* PRIORITY ISSUES (7 COLS) */}
                <div className="lg:col-span-7 bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-4">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                    <div className="flex items-center gap-2">
                      <div className="w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse"></div>
                      <h3 className="text-sm font-black uppercase tracking-wider text-[#0B2545]">
                        Priority Issues Requiring Action
                      </h3>
                    </div>
                    <button
                      onClick={() => setActiveTab('complaints')}
                      className="text-xs font-bold text-[#0B2545] hover:underline flex items-center gap-1"
                    >
                      View All <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="space-y-3">
                    {priorityIssues.length === 0 ? (
                      <div className="p-8 text-center text-slate-400 text-xs font-medium">
                        No critical priority issues currently pending resolution.
                      </div>
                    ) : (
                      priorityIssues.map((issue) => (
                        <div
                          key={issue.id}
                          className="p-4 bg-slate-50 rounded-xl border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                        >
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase ${
                                issue.isEscalated ? 'bg-red-100 text-red-700 border border-red-200' : 'bg-amber-100 text-amber-800'
                              }`}>
                                {issue.isEscalated ? '🔴 Critical SLA Risk' : '🟠 High Priority'}
                              </span>
                              <span className="font-mono text-xs font-bold text-[#0B2545]">{issue.id}</span>
                              <span className="text-xs text-slate-500 font-semibold">• Ward {issue.ward}</span>
                            </div>
                            <h4 className="font-bold text-xs text-slate-900">{issue.title}</h4>
                            <p className="text-[11px] text-slate-500">{issue.locationName || `Ward ${issue.ward}, Kopargaon`}</p>
                          </div>

                          <div className="flex items-center gap-2 shrink-0">
                            <button
                              onClick={() => setSelectedComplaint(issue)}
                              className="px-3 py-1.5 bg-[#0B2545] text-white rounded-lg text-xs font-bold hover:bg-[#07192E] transition-colors"
                            >
                              Inspect Ticket
                            </button>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>

                {/* LIVE CITY STATUS (5 COLS) */}
                <div className="lg:col-span-5 bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-4">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                    <h3 className="text-sm font-black uppercase tracking-wider text-[#0B2545] flex items-center gap-2">
                      <Activity className="w-4 h-4 text-[#138808]" />
                      Live City Operations Feed
                    </h3>
                    <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded-full text-[10px] font-extrabold uppercase">
                      ● LIVE FEED
                    </span>
                  </div>

                  <div className="space-y-3 text-xs font-semibold">
                    <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <Droplets className="w-4 h-4 text-sky-600" />
                        <div>
                          <span className="block text-slate-900">Water Supply Grid</span>
                          <span className="text-[10px] text-slate-500 font-mono">Godavari Headworks Intake: 98.4%</span>
                        </div>
                      </div>
                      <span className="px-2 py-0.5 bg-emerald-500 text-white rounded text-[10px] font-extrabold uppercase">Operational</span>
                    </div>

                    <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <Trash2 className="w-4 h-4 text-emerald-600" />
                        <div>
                          <span className="block text-slate-900">Waste Collection Fleet</span>
                          <span className="text-[10px] text-slate-500 font-mono">28 Wards Covered (92%)</span>
                        </div>
                      </div>
                      <span className="px-2 py-0.5 bg-emerald-500 text-white rounded text-[10px] font-extrabold uppercase">Operational</span>
                    </div>

                    <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <Zap className="w-4 h-4 text-amber-500" />
                        <div>
                          <span className="block text-slate-900">Electricity Substation Grid</span>
                          <span className="text-[10px] text-slate-500 font-mono">MSEDCL Feeder Uninterrupted</span>
                        </div>
                      </div>
                      <span className="px-2 py-0.5 bg-emerald-500 text-white rounded text-[10px] font-extrabold uppercase">Operational</span>
                    </div>

                    <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <TrafficCone className="w-4 h-4 text-blue-600" />
                        <div>
                          <span className="block text-slate-900">Traffic & Key Junctions</span>
                          <span className="text-[10px] text-slate-500 font-mono">Station Rd & Highway clear</span>
                        </div>
                      </div>
                      <span className="px-2 py-0.5 bg-emerald-500 text-white rounded text-[10px] font-extrabold uppercase">Operational</span>
                    </div>

                    <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <CloudSun className="w-4 h-4 text-amber-600" />
                        <div>
                          <span className="block text-slate-900">Kopargaon Weather & Air Quality</span>
                          <span className="text-[10px] text-slate-500 font-mono">29°C Clear • AQI 52 (Good)</span>
                        </div>
                      </div>
                      <span className="px-2 py-0.5 bg-sky-600 text-white rounded text-[10px] font-extrabold uppercase">29°C LIVE</span>
                    </div>
                  </div>
                </div>

              </div>

              {/* GRID ROW 2: RECENT COMPLAINTS & GIS SMALL PREVIEW CARD */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                
                {/* RECENT COMPLAINTS (7 COLS) */}
                <div className="lg:col-span-7 bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-4">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                    <h3 className="text-sm font-black uppercase tracking-wider text-[#0B2545]">
                      Recent Citizen Complaints Lifecycles
                    </h3>
                    <button
                      onClick={() => setActiveTab('complaints')}
                      className="px-3 py-1 bg-[#0B2545] text-white rounded-lg text-xs font-bold hover:bg-[#07192E]"
                    >
                      Complaints Directory
                    </button>
                  </div>

                  <div className="space-y-3">
                    {complaints.slice(0, 4).map((c) => (
                      <div
                        key={c.id}
                        className="p-4 bg-slate-50 rounded-xl border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                      >
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-mono text-xs font-bold text-[#0B2545]">{c.id}</span>
                            <span className="text-xs font-bold text-slate-700">{c.category}</span>
                            <span className="text-xs text-slate-500">• Ward {c.ward}</span>
                          </div>
                          <h4 className="font-bold text-xs text-slate-800">{c.title}</h4>
                          <p className="text-[11px] text-slate-500 mt-0.5">Assigned Officer: {c.assignedOfficer || 'Ward Field Engineer'}</p>
                        </div>

                        <div className="flex items-center gap-2 shrink-0">
                          <span className={`px-2 py-1 rounded text-[10px] font-extrabold uppercase ${
                            c.status === 'Completed' || c.status === 'Resolved' 
                              ? 'bg-emerald-100 text-emerald-800' 
                              : c.status === 'In Progress' 
                              ? 'bg-blue-100 text-blue-800' 
                              : 'bg-amber-100 text-amber-800'
                          }`}>
                            {c.status}
                          </span>
                          <button
                            onClick={() => setSelectedComplaint(c)}
                            className="p-2 bg-white border border-slate-200 rounded-lg hover:bg-slate-100 text-[#0B2545]"
                            title="Inspect Details"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* SMALL GIS PREVIEW CARD (5 COLS) */}
                <div className="lg:col-span-5 bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-4">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                    <div>
                      <h3 className="text-sm font-black uppercase tracking-wider text-[#0B2545]">
                        Kopargaon Smart City GIS
                      </h3>
                      <p className="text-[11px] text-slate-500">Spatial telemetry & Ward complaint clusters</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setActiveTab('gis')}
                        className="px-3 py-1.5 bg-[#0B2545] text-white rounded-lg text-xs font-bold hover:bg-[#07192E] flex items-center gap-1 shadow-xs"
                      >
                        <Map className="w-3.5 h-3.5 text-[#FF9933]" />
                        Open Full GIS
                      </button>
                    </div>
                  </div>

                  {/* Compact Map Canvas Preview */}
                  <div className="relative h-64 w-full rounded-xl overflow-hidden border border-slate-200 shadow-inner">
                    <MapLibreGisCommandCenter
                      complaints={complaints}
                      onSelectComplaint={(inc) => {
                        setSelectedComplaint(inc);
                        setActiveTab('complaints');
                      }}
                    />
                  </div>

                  <div className="flex items-center justify-between text-xs pt-1">
                    <span className="text-slate-500 font-mono text-[11px]">28 Wards • Spatial Layer Active</span>
                    <button
                      onClick={() => setActiveTab('complaints')}
                      className="text-[#0B2545] font-bold hover:underline"
                    >
                      View Complaints on GIS →
                    </button>
                  </div>
                </div>

              </div>

              {/* GRID ROW 3: NOTICES & AI INSIGHTS */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                
                {/* MUNICIPAL NOTICES (6 COLS) */}
                <div className="lg:col-span-6 bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-4">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                    <h3 className="text-sm font-black uppercase tracking-wider text-[#0B2545] flex items-center gap-2">
                      <Megaphone className="w-4 h-4 text-amber-500" />
                      Important Municipal Notices
                    </h3>
                    <button
                      onClick={() => setActiveTab('notices')}
                      className="text-xs font-bold text-[#0B2545] hover:underline"
                    >
                      Manage Notices
                    </button>
                  </div>

                  <div className="space-y-3">
                    {announcements.length === 0 ? (
                      <div className="p-6 text-center text-slate-400 text-xs font-medium">
                        No active public notices posted.
                      </div>
                    ) : (
                      announcements.slice(0, 3).map((notice) => (
                        <div key={notice.id} className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                          <div className="flex items-center justify-between">
                            <span className="px-2 py-0.5 bg-amber-100 text-amber-800 rounded text-[9px] font-extrabold uppercase">
                              {notice.priority || 'Official Notice'}
                            </span>
                            <span className="text-[10px] text-slate-400 font-mono">{notice.date || 'Today'}</span>
                          </div>
                          <h4 className="font-bold text-xs text-slate-900">{notice.title}</h4>
                          <p className="text-[11px] text-slate-600 line-clamp-2">{notice.description}</p>
                        </div>
                      ))
                    )}
                  </div>
                </div>

                {/* AI INSIGHTS CARD (6 COLS) */}
                <div className="lg:col-span-6 bg-gradient-to-br from-[#0B2545] to-[#103459] text-white rounded-2xl p-6 border border-sky-900 shadow-md space-y-4">
                  <div className="flex items-center justify-between border-b border-white/10 pb-3">
                    <div className="flex items-center gap-2">
                      <Bot className="w-5 h-5 text-[#FF9933]" />
                      <h3 className="text-sm font-black uppercase tracking-wider text-white">
                        AI Operational Telemetry Insights
                      </h3>
                    </div>
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono bg-[#FF9933] text-[#0B2545] font-extrabold">
                      GEMINI AI
                    </span>
                  </div>

                  <div className="space-y-3 text-xs leading-relaxed">
                    <div className="p-3 bg-white/10 rounded-xl border border-white/10 space-y-1">
                      <span className="text-[#FF9933] font-bold block text-[11px] uppercase">🚨 SLA Risk Warning</span>
                      <p className="text-slate-200">
                        12 complaints related to water supply were reported in Ward 6 within the last 24 hours. Recommend inspecting main Godavari feeder line.
                      </p>
                    </div>

                    <div className="p-3 bg-white/10 rounded-xl border border-white/10 space-y-1">
                      <span className="text-emerald-400 font-bold block text-[11px] uppercase">📊 Resolution Efficiency</span>
                      <p className="text-slate-200">
                        Sanitation team resolved {resolvedCount} tickets today. Overall ward resolution compliance is currently operating at {totalComplaints > 0 ? Math.round((resolvedCount / totalComplaints) * 100) : 100}%.
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      setIsAiOpen(true);
                      handleAiQuery("What are today's major municipal issues?");
                    }}
                    className="w-full py-2.5 bg-[#FF9933] hover:bg-amber-400 text-[#0B2545] font-black text-xs uppercase tracking-wider rounded-xl transition-all shadow-md cursor-pointer"
                  >
                    Query Governance AI Engine
                  </button>
                </div>

              </div>

              {/* QUICK ADMINISTRATIVE ACTIONS */}
              <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-4">
                <h3 className="text-sm font-black uppercase tracking-wider text-[#0B2545]">
                  Quick Administrative Actions
                </h3>

                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
                  <button
                    onClick={() => setActiveTab('notices')}
                    className="p-3 bg-slate-50 hover:bg-slate-100 rounded-xl border border-slate-200 text-center transition-all cursor-pointer space-y-1.5"
                  >
                    <PlusCircle className="w-5 h-5 mx-auto text-[#0B2545]" />
                    <span className="block text-xs font-bold text-slate-800">Create Notice</span>
                  </button>

                  <button
                    onClick={() => setActiveTab('complaints')}
                    className="p-3 bg-slate-50 hover:bg-slate-100 rounded-xl border border-slate-200 text-center transition-all cursor-pointer space-y-1.5"
                  >
                    <ClipboardList className="w-5 h-5 mx-auto text-[#0B2545]" />
                    <span className="block text-xs font-bold text-slate-800">Review Complaints</span>
                  </button>

                  <button
                    onClick={() => setActiveTab('gis')}
                    className="p-3 bg-slate-50 hover:bg-slate-100 rounded-xl border border-slate-200 text-center transition-all cursor-pointer space-y-1.5"
                  >
                    <Map className="w-5 h-5 mx-auto text-[#0B2545]" />
                    <span className="block text-xs font-bold text-slate-800">Open GIS</span>
                  </button>

                  <button
                    onClick={() => setActiveTab('reports_analytics')}
                    className="p-3 bg-slate-50 hover:bg-slate-100 rounded-xl border border-slate-200 text-center transition-all cursor-pointer space-y-1.5"
                  >
                    <LineChart className="w-5 h-5 mx-auto text-[#0B2545]" />
                    <span className="block text-xs font-bold text-slate-800">Generate Report</span>
                  </button>

                  <button
                    onClick={() => setActiveTab('emergency_alerts')}
                    className="p-3 bg-red-50 hover:bg-red-100 rounded-xl border border-red-200 text-center transition-all cursor-pointer space-y-1.5"
                  >
                    <ShieldAlert className="w-5 h-5 mx-auto text-red-600" />
                    <span className="block text-xs font-bold text-red-700">Emergency Alert</span>
                  </button>

                  <button
                    onClick={() => setActiveTab('ward_mgmt')}
                    className="p-3 bg-slate-50 hover:bg-slate-100 rounded-xl border border-slate-200 text-center transition-all cursor-pointer space-y-1.5"
                  >
                    <Building2 className="w-5 h-5 mx-auto text-[#0B2545]" />
                    <span className="block text-xs font-bold text-slate-800">Ward Management</span>
                  </button>
                </div>
              </div>

              {/* RECENT ACTIVITY TIMELINE */}
              <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-4">
                <h3 className="text-sm font-black uppercase tracking-wider text-[#0B2545]">
                  Recent System Audit Activity
                </h3>

                <div className="space-y-3 font-mono text-xs">
                  {auditLogs.slice(0, 4).map((log, idx) => (
                    <div key={idx} className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-[#138808]"></span>
                        <span className="font-bold text-[#0B2545]">{log.action || log.event || 'System Action'}</span>
                        <span className="text-slate-500">• {log.details || log.description || 'Action recorded in audit log'}</span>
                      </div>
                      <span className="text-[10px] text-slate-400">{new Date(log.timestamp || Date.now()).toLocaleTimeString()}</span>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          )}

          {/* ============================================================ */}
          {/* TAB 2: MUNICIPAL OVERVIEW */}
          {/* ============================================================ */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-6">
                <div className="border-b border-slate-100 pb-3 flex justify-between items-center">
                  <div>
                    <h2 className="text-base font-black text-[#0B2545] uppercase">
                      Municipal Departmental Overview & Resolution Metrics
                    </h2>
                    <p className="text-xs text-slate-500">Departmental breakdown, 72-Hour SLA compliance performance across 28 Wards.</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                    <span className="text-xs font-bold text-slate-500 uppercase">Total Registered Tickets</span>
                    <h3 className="text-2xl font-black text-[#0B2545] mt-1">{totalComplaints}</h3>
                  </div>
                  <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                    <span className="text-xs font-bold text-slate-500 uppercase">Resolution Percentage</span>
                    <h3 className="text-2xl font-black text-[#138808] mt-1">
                      {totalComplaints > 0 ? `${Math.round((resolvedCount / totalComplaints) * 100)}%` : '100%'}
                    </h3>
                  </div>
                  <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                    <span className="text-xs font-bold text-slate-500 uppercase">Pending Officer Action</span>
                    <h3 className="text-2xl font-black text-amber-600 mt-1">{pendingCount}</h3>
                  </div>
                  <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                    <span className="text-xs font-bold text-slate-500 uppercase">SLA Escalations</span>
                    <h3 className="text-2xl font-black text-red-600 mt-1">{escalatedCount}</h3>
                  </div>
                </div>

                <div className="space-y-3">
                  <h3 className="text-xs font-black uppercase text-[#0B2545]">Departmental Workload Distribution</h3>
                  {['Sanitation / Waste', 'Water Supply & Pipelines', 'PWD Road Repairs', 'Streetlighting Grid', 'Drainage Systems'].map((dept) => {
                    const deptCount = complaints.filter(c => c.category.includes(dept.split(' ')[0])).length;
                    const pct = totalComplaints > 0 ? Math.round((deptCount / totalComplaints) * 100) : 0;
                    return (
                      <div key={dept} className="space-y-1 text-xs">
                        <div className="flex justify-between font-bold text-slate-700">
                          <span>{dept}</span>
                          <span className="font-mono">{deptCount} tickets ({pct}%)</span>
                        </div>
                        <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                          <div className="h-full bg-[#0B2545] rounded-full" style={{ width: `${pct}%` }}></div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* ============================================================ */}
          {/* TAB 3: COMPLAINTS DIRECTORY & LIFECYCLE */}
          {/* ============================================================ */}
          {activeTab === 'complaints' && (
            <div className="space-y-6">
              <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
                  <div>
                    <h2 className="text-base font-black uppercase text-[#0B2545]">
                      Municipal Grievance Tickets & SLA Lifecycles
                    </h2>
                    <p className="text-xs text-slate-500">Filter, assign, update, and submit mandatory work completion reports.</p>
                  </div>

                  <div className="flex items-center gap-2 flex-wrap">
                    <div className="relative">
                      <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
                      <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search ticket ID or ward..."
                        className="pl-8 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:border-[#0B2545]"
                      />
                    </div>

                    <select
                      value={statusFilter}
                      onChange={(e) => setStatusFilter(e.target.value)}
                      className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 cursor-pointer"
                    >
                      <option value="All">All Statuses</option>
                      <option value="Pending">Pending</option>
                      <option value="In Progress">In Progress</option>
                      <option value="Completed">Completed</option>
                      <option value="Escalated">Escalated</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filteredComplaints.length === 0 ? (
                    <div className="col-span-full p-12 text-center text-slate-400 text-xs font-medium">
                      No complaints match the filter criteria.
                    </div>
                  ) : (
                    filteredComplaints.map((item) => {
                      const isCompleted = item.status === 'Completed' || item.status === 'Resolved';
                      return (
                        <div
                          key={item.id}
                          className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-3 flex flex-col justify-between"
                        >
                          <div>
                            <div className="flex items-center justify-between gap-2 mb-2">
                              <span className="font-mono text-xs font-black text-[#0B2545]">{item.id}</span>
                              <SLAIndicator submittedAt={item.createdAt || item.submittedAt} dueDate={item.dueDate} currentStatus={item.status} compact />
                            </div>

                            <h3 className="text-xs font-bold text-slate-900 mb-1">{item.title}</h3>
                            <p className="text-[11px] text-slate-600 line-clamp-2">{item.description}</p>

                            <div className="text-[10px] text-slate-500 space-y-0.5 pt-2 border-t border-slate-100 font-mono mt-2">
                              <div>Ward: <strong>Ward {item.ward}</strong></div>
                              <div>Officer: <strong>{item.assignedOfficer || 'Field Engineer'}</strong></div>
                            </div>
                          </div>

                          <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                            <button
                              onClick={() => setSelectedComplaint(item)}
                              className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-[#0B2545] font-bold rounded-xl text-xs flex items-center gap-1"
                            >
                              <Eye className="w-3.5 h-3.5" /> Details
                            </button>

                            {isCompleted ? (
                              <button
                                onClick={() => setPublicReportTargetComplaint(item)}
                                className="px-3 py-1.5 bg-[#138808] text-white font-bold rounded-xl text-xs flex items-center gap-1 shadow-xs"
                              >
                                <Award className="w-3.5 h-3.5" /> Certificate
                              </button>
                            ) : (
                              <button
                                onClick={() => setCompletionTargetComplaint(item)}
                                className="px-3 py-1.5 bg-[#0B2545] text-white font-bold rounded-xl text-xs flex items-center gap-1 shadow-xs"
                              >
                                <CheckSquare className="w-3.5 h-3.5 text-emerald-400" /> Work Report
                              </button>
                            )}
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            </div>
          )}

          {/* ============================================================ */}
          {/* TAB 4: SMART CITY GIS (FULL SCREEN MAP) */}
          {/* ============================================================ */}
          {activeTab === 'gis' && (
            <div className="space-y-4">
              <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between">
                <div>
                  <h2 className="text-base font-black uppercase text-[#0B2545]">
                    Kopargaon Smart City GIS Spatial Twin
                  </h2>
                  <p className="text-xs text-slate-500">Full spatial GIS vector map engine • 28 Ward Layer Boundaries • Complaint Pins</p>
                </div>
              </div>

              <div className="relative h-[650px] w-full rounded-2xl overflow-hidden border border-slate-200 shadow-md">
                <MapLibreGisCommandCenter
                  complaints={complaints}
                  onSelectComplaint={(inc) => {
                    setSelectedComplaint(inc);
                    setActiveTab('complaints');
                  }}
                />
              </div>
            </div>
          )}

          {/* ============================================================ */}
          {/* TAB 5: WARD MANAGEMENT */}
          {/* ============================================================ */}
          {activeTab === 'ward_mgmt' && (
            <div className="space-y-6">
              <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
                  <div>
                    <h2 className="text-base font-black text-[#0B2545] uppercase">
                      Ward Operational Inspection & Management (Wards 1–28)
                    </h2>
                    <p className="text-xs text-slate-500">Select a municipal ward to inspect field complaints, water supply, and sanitation fleet.</p>
                  </div>

                  <div className="flex items-center gap-2">
                    <label className="text-xs font-bold text-[#0B2545]">Select Ward:</label>
                    <select
                      value={selectedWard}
                      onChange={(e) => setSelectedWard(Number(e.target.value))}
                      className="px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-[#0B2545] cursor-pointer"
                    >
                      {Array.from({ length: 28 }, (_, i) => i + 1).map((w) => (
                        <option key={w} value={w}>Ward {w} Administration</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Selected Ward Detail Card */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                    <span className="text-xs font-bold text-slate-500 uppercase">Assigned Ward Officer</span>
                    <h3 className="text-base font-black text-[#0B2545] mt-1">Engineer S. Patil</h3>
                  </div>
                  <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                    <span className="text-xs font-bold text-slate-500 uppercase">Active Ward Tickets</span>
                    <h3 className="text-base font-black text-sky-600 mt-1">
                      {complaints.filter(c => Number(c.ward) === selectedWard).length} Tickets
                    </h3>
                  </div>
                  <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                    <span className="text-xs font-bold text-slate-500 uppercase">Water Supply Status</span>
                    <h3 className="text-base font-black text-[#138808] mt-1">Operational (06:00-09:30)</h3>
                  </div>
                  <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                    <span className="text-xs font-bold text-slate-500 uppercase">Sanitation Coverage</span>
                    <h3 className="text-base font-black text-[#138808] mt-1">100% Door-to-Door</h3>
                  </div>
                </div>

                <div className="space-y-3">
                  <h3 className="text-xs font-black uppercase text-[#0B2545]">Complaints in Ward {selectedWard}</h3>
                  {complaints.filter(c => Number(c.ward) === selectedWard).length === 0 ? (
                    <div className="p-6 text-center text-slate-400 text-xs font-medium bg-slate-50 rounded-xl">
                      No complaints registered for Ward {selectedWard}.
                    </div>
                  ) : (
                    complaints.filter(c => Number(c.ward) === selectedWard).map((c) => (
                      <div key={c.id} className="p-4 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between">
                        <div>
                          <span className="font-mono text-xs font-bold text-[#0B2545]">{c.id}</span>
                          <h4 className="font-bold text-xs text-slate-800">{c.title}</h4>
                        </div>
                        <span className="px-2 py-1 bg-amber-100 text-amber-800 rounded text-[10px] font-extrabold uppercase">
                          {c.status}
                        </span>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          )}

          {/* ============================================================ */}
          {/* TAB 6 & 7 & 8: WATER, WASTE, TRAFFIC TELEMETRY */}
          {/* ============================================================ */}
          {(activeTab === 'water_supply' || activeTab === 'waste_mgmt' || activeTab === 'traffic_roads') && (
            <div className="space-y-6">
              <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-4">
                <div className="flex items-center gap-3 border-b border-slate-100 pb-3">
                  <div className="p-2 rounded-xl bg-[#0B2545] text-[#FF9933]">
                    {activeTab === 'water_supply' && <Droplets className="w-6 h-6" />}
                    {activeTab === 'waste_mgmt' && <Trash2 className="w-6 h-6" />}
                    {activeTab === 'traffic_roads' && <TrafficCone className="w-6 h-6" />}
                  </div>
                  <div>
                    <h2 className="text-base font-black text-[#0B2545] uppercase">
                      {activeTab === 'water_supply' && 'Godavari Reservoir & Ward Water Distribution Telemetry'}
                      {activeTab === 'waste_mgmt' && 'Sanitation Vehicle Fleet Tracking & Processing Telemetry'}
                      {activeTab === 'traffic_roads' && 'PWD Road Infrastructure & Traffic Junction Monitoring'}
                    </h2>
                    <p className="text-xs text-slate-500">Real-time IoT feeds & Municipal SLA compliance stats</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                    <span className="text-xs font-bold text-slate-500 uppercase">Primary Operational Status</span>
                    <h3 className="text-xl font-black text-[#138808] mt-1">Operational (99.2%)</h3>
                  </div>
                  <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                    <span className="text-xs font-bold text-slate-500 uppercase">Telemetry Feed</span>
                    <h3 className="text-xl font-black text-[#0B2545] mt-1">NIC Sensor Gateway Active</h3>
                  </div>
                  <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                    <span className="text-xs font-bold text-slate-500 uppercase">Audit SLA Status</span>
                    <h3 className="text-xl font-black text-[#138808] mt-1">72-Hour Target Met</h3>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ============================================================ */}
          {/* TAB 9 & 10: PERMISSIONS & REVENUE MODULES */}
          {/* ============================================================ */}
          {activeTab === 'permissions' && <PermissionsDashboardView />}
          {activeTab === 'revenue_taxes' && <OfficerTaxManagementView />}

          {/* ============================================================ */}
          {/* TAB 11: NOTICES MANAGEMENT */}
          {/* ============================================================ */}
          {activeTab === 'notices' && <AnnouncementManager />}

          {/* ============================================================ */}
          {/* TAB 12: EMERGENCY & ALERTS */}
          {/* ============================================================ */}
          {activeTab === 'emergency_alerts' && (
            <div className="space-y-6">
              <div className="bg-[#B71C1C] text-white p-6 rounded-2xl shadow-md flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <ShieldAlert className="w-8 h-8 text-[#FF9933] animate-pulse" />
                  <div>
                    <h2 className="text-lg font-black uppercase">Municipal Disaster Control Room & Alerts</h2>
                    <p className="text-xs text-red-100">Broadcast city-wide warnings and manage disaster emergencies</p>
                  </div>
                </div>
              </div>
              <IncidentArchive onSelectComplaint={(id) => {
                const target = complaints.find(c => c.id === id);
                if (target) setSelectedComplaint(target);
              }} />
            </div>
          )}

          {/* ============================================================ */}
          {/* TAB 13: REPORTS & ANALYTICS */}
          {/* ============================================================ */}
          {activeTab === 'reports_analytics' && (
            <div className="space-y-6">
              <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-4">
                <h2 className="text-base font-black text-[#0B2545] uppercase">
                  Municipal Governance Reports & Analytics Generation
                </h2>
                <p className="text-xs text-slate-500">Download official PDF audit reports for Complaints, Ward Performance, and Tax Collections.</p>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
                  <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                    <h3 className="font-bold text-xs text-[#0B2545]">Grievance SLA Compliance Report</h3>
                    <p className="text-[11px] text-slate-500">Comprehensive breakdown of 72-hr complaint resolution rates.</p>
                    <button
                      onClick={() => showToast('Generating PDF Report...', 'info')}
                      className="px-3 py-1.5 bg-[#0B2545] text-white rounded-lg text-xs font-bold flex items-center gap-1"
                    >
                      <Download className="w-3.5 h-3.5" /> Download PDF
                    </button>
                  </div>

                  <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                    <h3 className="font-bold text-xs text-[#0B2545]">28-Ward Operational Inspection Audit</h3>
                    <p className="text-[11px] text-slate-500">Ward-by-ward sanitation, water, and road repair performance.</p>
                    <button
                      onClick={() => showToast('Generating Ward Excel Audit...', 'info')}
                      className="px-3 py-1.5 bg-[#0B2545] text-white rounded-lg text-xs font-bold flex items-center gap-1"
                    >
                      <Download className="w-3.5 h-3.5" /> Download Excel
                    </button>
                  </div>

                  <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                    <h3 className="font-bold text-xs text-[#0B2545]">Municipal Tax Collection Summary</h3>
                    <p className="text-[11px] text-slate-500">Revenue stats for Property Tax and Water Charges.</p>
                    <button
                      onClick={() => showToast('Generating Revenue Report...', 'info')}
                      className="px-3 py-1.5 bg-[#0B2545] text-white rounded-lg text-xs font-bold flex items-center gap-1"
                    >
                      <Download className="w-3.5 h-3.5" /> Download PDF
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ============================================================ */}
          {/* TAB 14 & 15: AI ASSISTANT & SETTINGS */}
          {/* ============================================================ */}
          {activeTab === 'ai_assistant' && (
            <div className="max-w-3xl mx-auto bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-4">
              <div className="flex items-center gap-3 border-b border-slate-100 pb-3">
                <div className="p-2 rounded-xl bg-[#0B2545] text-[#FF9933]">
                  <Bot className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="text-base font-black text-[#0B2545]">Municipal Governance AI Intelligence Engine</h2>
                  <p className="text-xs text-slate-500">Ask Gemini AI about SLA risks, ward statistics, or notice drafting.</p>
                </div>
              </div>

              <div className="h-72 overflow-y-auto space-y-3 p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs">
                {aiChatMessages.map((m, idx) => (
                  <div key={idx} className={`flex ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-md p-3 rounded-xl ${m.sender === 'user' ? 'bg-[#0B2545] text-white' : 'bg-white border border-slate-200 text-slate-800'}`}>
                      {m.text}
                    </div>
                  </div>
                ))}
              </div>

              <form onSubmit={handleSendAiMessage} className="flex gap-2">
                <input
                  type="text"
                  value={aiInput}
                  onChange={(e) => setAiInput(e.target.value)}
                  placeholder="Ask AI about SLA risks, ward telemetry, or water supply..."
                  className="flex-1 p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold"
                />
                <button type="submit" className="px-5 py-3 bg-[#0B2545] text-white rounded-xl text-xs font-bold">
                  Query AI
                </button>
              </form>
            </div>
          )}

          {activeTab === 'settings' && (
            <div className="max-w-2xl mx-auto bg-white rounded-2xl p-6 border border-slate-200 shadow-md space-y-6">
              <div className="border-b border-slate-100 pb-3">
                <h2 className="text-base font-black text-[#0B2545]">Officer Profile & Administrative Settings</h2>
                <p className="text-xs text-slate-500">Kopargaon Municipal Corporation Administrative Credentials</p>
              </div>

              <div className="space-y-4 text-xs font-semibold">
                <div>
                  <label className="block text-slate-700 mb-1">Authenticated Officer Name</label>
                  <input
                    type="text"
                    value={officerUser?.name || officerUser?.fullName || 'Municipal Officer'}
                    disabled
                    className="w-full p-3 bg-slate-100 border border-slate-200 rounded-xl text-xs font-bold text-[#0B2545]"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 mb-1">Designated Municipal Role</label>
                  <input
                    type="text"
                    value={officerUser?.role || 'Municipal Officer / Administrative Engineer'}
                    disabled
                    className="w-full p-3 bg-slate-100 border border-slate-200 rounded-xl text-xs font-bold text-[#0B2545]"
                  />
                </div>
              </div>
            </div>
          )}

          {/* HIGHER AUTHORITY VIEW */}
          {activeTab === 'higher_authority' && (
            <HigherAuthorityDashboard onSelectComplaint={(id) => {
              const target = complaints.find(c => c.id === id);
              if (target) setSelectedComplaint(target);
            }} />
          )}
    </div>
  );

  if (embedded) {
    return mainContent;
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col text-slate-800 font-sans selection:bg-[#0B2545] selection:text-white">
      <AdminHeader
        officerUser={officerUser}
        activeTabTitle={pageTitles[activeTab] || 'Administrative Portal'}
        unreadCount={unreadNotifCount}
        onOpenNotifications={() => setIsNotifDrawerOpen(true)}
        onOpenProfile={() => setActiveTab('settings')}
        onLogout={handleLogout}
        onToggleMobileMenu={() => setIsMobileOpen(true)}
        activeGovernanceRole={activeGovernanceRole}
        setActiveGovernanceRole={setActiveGovernanceRole}
      />

      <div className="flex-1 flex overflow-hidden">
        <AdminSidebar
          activeTab={activeTab}
          onSelectTab={setActiveTab}
          onLogout={handleLogout}
          mobileOpen={isMobileOpen}
          onCloseMobile={() => setIsMobileOpen(false)}
          complaintCount={totalComplaints}
          escalatedCount={escalatedCount}
        />

        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto w-full">
          {mainContent}
        </main>

        <AnimatePresence>
          {selectedComplaint && (
            <div className="fixed inset-0 z-50 overflow-hidden">
              <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-xs" onClick={() => setSelectedComplaint(null)} />
              <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
                <motion.div
                  initial={{ x: '100%' }}
                  animate={{ x: 0 }}
                  exit={{ x: '100%' }}
                  className="w-screen max-w-xl bg-white shadow-2xl border-l border-slate-200 flex flex-col justify-between"
                >
                  <div className="p-4 bg-[#0B2545] text-white flex items-center justify-between">
                    <div>
                      <span className="font-mono text-xs text-[#FF9933] font-bold">#{selectedComplaint.id}</span>
                      <h3 className="text-sm font-bold">{selectedComplaint.title}</h3>
                    </div>
                    <button onClick={() => setSelectedComplaint(null)} className="p-1 text-slate-300 hover:text-white">
                      <X className="w-5 h-5" />
                    </button>
                  </div>

                  <div className="flex-1 overflow-y-auto p-5 space-y-4 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="px-2 py-0.5 bg-slate-100 text-[#0B2545] font-bold rounded text-[10px]">
                        {selectedComplaint.category}
                      </span>
                      <SLAIndicator submittedAt={selectedComplaint.createdAt || selectedComplaint.submittedAt} dueDate={selectedComplaint.dueDate} currentStatus={selectedComplaint.status} />
                    </div>

                    <div>
                      <h4 className="font-bold text-slate-700 mb-1">Description</h4>
                      <p className="text-slate-600 leading-relaxed">{selectedComplaint.description}</p>
                    </div>

                    <div className="grid grid-cols-2 gap-3 p-3 bg-slate-50 rounded-xl">
                      <div>
                        <span className="font-bold text-[10px] uppercase text-slate-400 block">Ward & Location</span>
                        <span>Ward {selectedComplaint.ward} • {selectedComplaint.locationName}</span>
                      </div>
                      <div>
                        <span className="font-bold text-[10px] uppercase text-slate-400 block">Assigned Officer</span>
                        <span>{selectedComplaint.assignedOfficer || 'Field Engineer'}</span>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 border-t border-slate-200 bg-slate-50">
                    {selectedComplaint.status === 'Completed' || selectedComplaint.status === 'Resolved' ? (
                      <button
                        onClick={() => {
                          setPublicReportTargetComplaint(selectedComplaint);
                          setSelectedComplaint(null);
                        }}
                        className="w-full py-2.5 bg-[#138808] hover:bg-emerald-800 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-2"
                      >
                        <Award className="w-4 h-4" /> View Official Work Certificate
                      </button>
                    ) : (
                      <button
                        onClick={() => {
                          setCompletionTargetComplaint(selectedComplaint);
                          setSelectedComplaint(null);
                        }}
                        className="w-full py-2.5 bg-[#0B2545] hover:bg-[#07192E] text-white font-bold text-xs rounded-xl flex items-center justify-center gap-2"
                      >
                        <CheckSquare className="w-4 h-4 text-emerald-400" /> Submit Mandatory Work Completion Report
                      </button>
                    )}
                  </div>
                </motion.div>
              </div>
            </div>
          )}
        </AnimatePresence>

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

      <footer className="py-4 px-6 text-center text-xs text-slate-600 border-t border-slate-200 bg-white shrink-0">
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
  );
};

export default MunicipalityDashboard;
