import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
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
  Zap, 
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
  Menu
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell, 
  LineChart, 
  Line, 
  AreaChart, 
  Area 
} from 'recharts';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { KopargaonMap } from '../../components/KopargaonMap';
import { ThemeToggle } from '../../components/ThemeToggle';

export const MunicipalityDashboard = () => {
  const navigate = useNavigate();
  const { 
    officerUser, 
    complaints, 
    cityAlerts, 
    logoutOfficer, 
    updateComplaintStatus, 
    assignComplaint, 
    showToast 
  } = useApp();

  const [activeTab, setActiveTab] = useState('dashboard'); // 'dashboard' | 'map' | 'complaints' | 'ai' | 'analytics' | 'simulation' | 'notifications' | 'settings'
  const [isCollapsed, setIsCollapsed] = useState(true);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        setIsMobileOpen(false);
      }
    };
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, []);

  const [selectedComplaint, setSelectedComplaint] = useState(null);
  const [statusFilter, setStatusFilter] = useState('All');
  const [categoryFilter, setCategoryFilter] = useState('All');

  // AI Assistant state
  const [chatMessages, setChatMessages] = useState([
    { sender: 'ai', text: 'Greeting Officer. Kopargaon Digital Twin AI Engine active. How can I assist municipal operations today?' }
  ]);
  const [chatInput, setChatInput] = useState('');
  const [isAiThinking, setIsAiThinking] = useState(false);

  // What-If Simulation state
  const [simGarbageTrucks, setSimGarbageTrucks] = useState(5);
  const [simRoadBudget, setSimRoadBudget] = useState(50); // In Lakhs INR
  const [simWaterSensors, setSimWaterSensors] = useState(true);

  // Quick stats
  const totalComplaints = complaints.length;
  const pendingCount = complaints.filter(c => c.status === 'Pending').length;
  const inProgressCount = complaints.filter(c => c.status === 'In Progress').length;
  const resolvedCount = complaints.filter(c => c.status === 'Resolved').length;

  const handleLogout = () => {
    logoutOfficer();
    navigate('/');
  };

  // Pre-configured AI Quick Queries
  const aiQueries = [
    "Which ward has highest complaints?",
    "Predict tomorrow's traffic.",
    "Summarize city health.",
    "Show dangerous roads."
  ];

  const handleAiQuery = (queryText) => {
    setChatMessages(prev => [...prev, { sender: 'user', text: queryText }]);
    setIsAiThinking(true);

    setTimeout(() => {
      let aiResponse = "";
      if (queryText.includes("highest complaints")) {
        aiResponse = "📊 **Ward Analysis**: Ward 4 (Station Road) and Ward 7 (Subhash Market) currently have the highest grievance concentration, accounting for 42% of total water leakage and garbage reports. Recommending priority maintenance dispatch.";
      } else if (queryText.includes("tomorrow's traffic")) {
        aiResponse = "🚦 **Traffic Forecast**: Godavari Bridge approach and MSRTC Bus Stand Junction (Ward 2) will experience peak congestion (88% grid capacity) between 08:30 AM - 10:30 AM tomorrow due to road work. Recommended signal timing override: +15s green phase.";
      } else if (queryText.includes("city health")) {
        aiResponse = "💚 **Executive City Health Summary**: Overall Kopargaon Municipal Index is **94/100**. Water supply pressure is steady at 4.2 bar. Sanitation collection efficiency: 91.5%. Road smoothness index: 84%. 5 active critical tickets pending officer assignment.";
      } else if (queryText.includes("dangerous roads")) {
        aiResponse = "⚠️ **Hazardous Corridors**: 1. Shirdi Highway Bypass (Ward 18) - 5 non-functional street light poles (Resolution pending). 2. Godavari Bridge Approach (Ward 12) - 2.1ft pothole reported near south abutment.";
      } else {
        aiResponse = `🤖 **Digital Twin Analysis for '${queryText}'**: Processing municipal telemetry database... All systems operating within normal parameters across all 28 Kopargaon Wards. Zero emergency evacuations logged.`;
      }

      setChatMessages(prev => [...prev, { sender: 'ai', text: aiResponse }]);
      setIsAiThinking(false);
    }, 600);
  };

  const handleSendCustomChat = (e) => {
    e.preventDefault();
    if (!chatInput.trim()) return;
    const text = chatInput;
    setChatInput('');
    handleAiQuery(text);
  };

  // Recharts Mock Data
  const complaintsByWardData = [
    { ward: 'W4', complaints: 8 },
    { ward: 'W7', complaints: 6 },
    { ward: 'W12', complaints: 5 },
    { ward: 'W2', complaints: 4 },
    { ward: 'W18', complaints: 3 },
    { ward: 'W9', complaints: 2 }
  ];

  const categoryDistData = [
    { name: 'Garbage', value: 35, color: '#38bdf8' },
    { name: 'Pothole', value: 25, color: '#f59e0b' },
    { name: 'Water Leak', value: 20, color: '#00f0ff' },
    { name: 'Street Light', value: 12, color: '#a855f7' },
    { name: 'Traffic', value: 8, color: '#10b981' }
  ];

  const monthlyTrendData = [
    { month: 'Jan', reported: 45, resolved: 42 },
    { month: 'Feb', reported: 52, resolved: 50 },
    { month: 'Mar', reported: 68, resolved: 65 },
    { month: 'Apr', reported: 74, resolved: 71 },
    { month: 'May', reported: 89, resolved: 85 },
    { month: 'Jun', reported: 95, resolved: 92 },
    { month: 'Jul', reported: 62, resolved: 58 }
  ];

  const filteredComplaints = complaints.filter(c => {
    const matchesStatus = statusFilter === 'All' || c.status === statusFilter;
    const matchesCat = categoryFilter === 'All' || c.category === categoryFilter;
    return matchesStatus && matchesCat;
  });

  return (
    <div className="min-h-screen bg-[#F8FAFC] dark:bg-slate-900 text-[#1E293B] dark:text-slate-200 flex font-sans selection:bg-[#F97316] selection:text-white relative overflow-hidden">
      {/* Mobile Drawer Backdrop */}
      {isMobileOpen && (
        <div
          onClick={() => setIsMobileOpen(false)}
          className="fixed inset-0 bg-slate-900/50 dark:bg-slate-950/70 backdrop-blur-sm z-30 md:hidden transition-opacity duration-300"
        />
      )}

      {/* SIDEBAR NAVIGATION */}
      <aside
        className={`fixed md:sticky top-0 bottom-0 left-0 h-screen bg-[#0F172A] border-r border-[#1E293B]/20 flex flex-col justify-between z-40 transition-all duration-300 shrink-0 ${
          isCollapsed ? 'md:w-[70px]' : 'md:w-64'
        } ${
          isMobileOpen ? 'translate-x-0 w-64' : '-translate-x-full md:translate-x-0 w-64 md:w-auto'
        }`}
      >
        <div>
          {/* Logo & Header */}
          <div className="p-4 border-b border-slate-800 flex items-center gap-3 justify-center md:justify-start overflow-hidden">
            <div className="w-11 h-11 rounded-xl bg-[#0F172A]/50 border border-[#F97316]/30 p-1.5 flex items-center justify-center text-[#F97316] shadow-md shadow-[#F97316]/10 shrink-0">
              {/* Government Seal SVG */}
              <svg viewBox="0 0 100 100" className="w-full h-full text-orange-500">
                <circle cx="50" cy="50" r="42" fill="none" stroke="currentColor" strokeWidth="4" />
                <path d="M 35 70 Q 50 25, 65 70 Z" fill="none" stroke="currentColor" strokeWidth="5" />
                <circle cx="50" cy="45" r="8" fill="currentColor" />
              </svg>
            </div>
            <div className={`transition-all duration-300 flex flex-col whitespace-nowrap ${isCollapsed ? 'md:opacity-0 md:w-0 md:hidden' : 'opacity-100 w-auto'}`}>
              <span className="font-extrabold text-xs text-slate-100 block tracking-tight leading-tight">
                कोपरगाव नगरपरिषद
              </span>
              <span className="font-bold text-[10px] text-orange-400 block leading-tight">
                नियंत्रण व समन्वय कक्ष
              </span>
              <span className="text-[8px] font-sans text-slate-400 uppercase tracking-wider block">
                KMC SECURED CONTROL
              </span>
            </div>
          </div>

          {/* Menu Items */}
          <nav className="p-3 space-y-2 text-xs font-semibold">
            {[
              { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard className="w-4 h-4" /> },
              { id: 'map', label: 'Live Map', icon: <Map className="w-4 h-4" /> },
              { id: 'complaints', label: 'Complaint Management', icon: <ClipboardList className="w-4 h-4" />, badge: pendingCount },
              { id: 'ai', label: 'AI Assistant', icon: <Bot className="w-4 h-4 text-purple-400" /> },
              { id: 'analytics', label: 'Analytics', icon: <BarChart3 className="w-4 h-4" /> },
              { id: 'simulation', label: 'What-if Simulation', icon: <Sliders className="w-4 h-4 text-orange-400" /> },
              { id: 'notifications', label: 'Notifications', icon: <Bell className="w-4 h-4 text-amber-400" /> },
              { id: 'settings', label: 'Settings', icon: <Settings className="w-4 h-4" /> }
            ].map(item => {
              const isTabActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id);
                    setIsMobileOpen(false);
                  }}
                  className={`w-full flex items-center rounded-xl transition-all relative ${
                    isTabActive ? 'bg-[#F97316] text-white font-bold shadow-md shadow-[#F97316]/15 hover:bg-orange-600' : 'text-slate-300 hover:text-white hover:bg-white/5'
                  } ${isCollapsed ? 'md:justify-center md:px-0 md:py-3.5 py-3 px-3.5' : 'justify-between py-3 px-3.5'}`}
                  title={item.label}
                >
                  <div className="flex items-center gap-3">
                    <span className="shrink-0">{item.icon}</span>
                    <span className={`transition-all duration-300 whitespace-nowrap text-xs font-semibold ${isCollapsed ? 'md:opacity-0 md:w-0 md:hidden' : 'opacity-100 w-auto'}`}>
                      {item.label}
                    </span>
                  </div>
                  {!isCollapsed && item.badge > 0 && (
                    <span className="px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-300 font-sans text-[10px] font-bold">
                      {item.badge}
                    </span>
                  )}
                  {isCollapsed && item.badge > 0 && (
                    <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 rounded-full bg-rose-500 border-2 border-[#0F172A] md:block hidden"></span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Officer Info & Logout */}
        <div className="p-3 border-t border-[#1E293B]/20 bg-slate-950/40">
          <div className="flex items-center justify-between mb-3">
            <div className={`flex items-center gap-2.5 ${isCollapsed ? 'md:justify-center w-full' : ''}`}>
              <div className="w-8 h-8 rounded-xl bg-[#F97316]/20 border border-[#F97316]/30 flex items-center justify-center text-[#F97316] text-xs font-bold font-sans shrink-0">
                CO
              </div>
              <div className={`transition-all duration-300 flex flex-col whitespace-nowrap overflow-hidden ${isCollapsed ? 'md:opacity-0 md:w-0 md:hidden' : 'opacity-100 w-auto'}`}>
                <span className="text-xs font-bold text-slate-200 block leading-tight">{officerUser?.name || 'Chief Officer'}</span>
                <span className="text-[10px] font-sans text-orange-400 block font-bold mt-0.5">{officerUser?.badge || 'KMC-ADMIN'}</span>
              </div>
            </div>
          </div>

          <button
            onClick={handleLogout}
            className={`w-full py-2.5 px-4 rounded-xl border border-[#EF4444]/20 bg-[#EF4444]/10 hover:bg-[#EF4444]/20 text-[#EF4444] text-xs font-bold flex items-center justify-center gap-2 transition-all ${isCollapsed ? 'md:px-0 md:py-3.5' : ''}`}
            title="Logout"
          >
            <LogOut className="w-3.5 h-3.5 shrink-0" />
            <span className={`transition-all duration-300 whitespace-nowrap ${isCollapsed ? 'md:opacity-0 md:w-0 md:hidden' : 'opacity-100'}`}>
              Logout
            </span>
          </button>
        </div>
      </aside>

      {/* MAIN CONTENT AREA */}
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        {/* Top Control Bar */}
        <header className="bg-white dark:bg-slate-800 border-b border-[#E2E8F0] dark:border-slate-700 py-3.5 px-6 sticky top-0 z-30 flex items-center justify-between shrink-0 transition-colors shadow-sm">
          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                if (window.innerWidth < 768) {
                  setIsMobileOpen(!isMobileOpen);
                } else {
                  setIsCollapsed(!isCollapsed);
                }
              }}
              className="p-2 rounded-xl text-[#1E293B] dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors focus:outline-none focus:ring-2 focus:ring-[#F97316] mr-1"
              aria-label="Toggle Navigation"
            >
              <Menu className="w-5 h-5" />
            </button>
            <div className="w-2.5 h-2.5 rounded-full bg-[#22C55E] animate-ping shrink-0"></div>
            <div className="flex flex-col">
              <span className="text-xs sm:text-sm font-black text-[#0F172A] dark:text-slate-100 tracking-tight leading-tight">
                महाराष्ट्र शासन • कोपरगाव नगरपरिषद नियंत्रण आणि समन्वय केंद्र
              </span>
              <span className="text-[9px] font-bold text-[#F97316] uppercase tracking-wider">
                SECURE CONTROL PORTAL // NODE: {activeTab.toUpperCase()}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-4 text-xs font-sans">
            <ThemeToggle />
            <div className="hidden lg:flex items-center gap-2 bg-[#F8FAFC] dark:bg-slate-900/50 px-3 py-1.5 rounded-xl border border-[#E2E8F0] dark:border-slate-700">
              <span className="text-[#64748B] dark:text-slate-400 font-semibold text-[10px] uppercase tracking-wider">Audit Trail:</span>
              <span className="text-[#22C55E] font-bold text-xs">ENCRYPTED</span>
            </div>
            <div className="flex items-center gap-3 bg-[#F8FAFC] dark:bg-slate-900/50 px-3 py-1.5 rounded-xl border border-[#E2E8F0] dark:border-slate-700">
              <div className="w-6 h-6 rounded-lg bg-orange-100 dark:bg-orange-950/40 flex items-center justify-center text-[#F97316] font-bold text-xs uppercase">
                CO
              </div>
              <div className="text-left">
                <span className="text-xs font-bold text-[#1E293B] dark:text-slate-200 block leading-tight">{officerUser?.name || 'Chief Officer'}</span>
                <span className="text-[9px] font-semibold text-[#64748B] dark:text-slate-400 block uppercase tracking-wider">{officerUser?.badge || 'KMC-ADMIN'}</span>
              </div>
            </div>
          </div>
        </header>

        {/* Secure audit disclaimer ribbon */}
        <div className="bg-orange-50 dark:bg-orange-950/20 border-b border-orange-100 dark:border-orange-900/30/50 px-8 py-2.5 flex items-center justify-between text-[10px] font-sans text-[#64748B] dark:text-slate-400 shrink-0">
          <span>🔒 Restricted Internal Access. Citizen grievance logging and action history are recorded under secure audit protocol.</span>
          <span className="text-orange-500/80 font-bold">GRID STATUS: SYNCED</span>
        </div>



        {/* TAB 1: DASHBOARD OVERVIEW */}
        {activeTab === 'dashboard' && (
          <div className="p-8 space-y-8">
            {/* Top Stat Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white dark:bg-slate-800 p-6 rounded-3xl border border-[#E2E8F0] dark:border-slate-700 shadow-sm hover:shadow-md transition-all text-[#1E293B] dark:text-slate-200">
                <div className="w-12 h-12 rounded-xl bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-100 dark:border-emerald-900/30 flex items-center justify-center text-emerald-600 mb-4">
                  <Activity className="w-6 h-6" />
                </div>
                <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider block">आरोग्य निर्देशांक / Health Index</span>
                <div className="text-3xl font-black text-slate-900 dark:text-slate-100 font-sans mt-1">94/100</div>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">● Optimal operations</p>
              </div>

              <div className="bg-white dark:bg-slate-800 p-6 rounded-3xl border border-[#E2E8F0] dark:border-slate-700 shadow-sm hover:shadow-md transition-all text-[#1E293B] dark:text-slate-200">
                <div className="w-12 h-12 rounded-xl bg-orange-50 dark:bg-orange-950/20 border border-orange-100 dark:border-orange-900/30 flex items-center justify-center text-[#F97316] mb-4">
                  <ClipboardList className="w-6 h-6" />
                </div>
                <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider block">नागरी तक्रारी / Active Grievances</span>
                <div className="text-3xl font-black text-slate-900 dark:text-slate-100 font-sans mt-1">{totalComplaints}</div>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">{pendingCount} pending administrative action</p>
              </div>

              <div className="bg-white dark:bg-slate-800 p-6 rounded-3xl border border-[#E2E8F0] dark:border-slate-700 shadow-sm hover:shadow-md transition-all text-[#1E293B] dark:text-slate-200">
                <div className="w-12 h-12 rounded-xl bg-purple-50 dark:bg-purple-950/20 border border-purple-100 dark:border-purple-900/30 flex items-center justify-center text-purple-600 mb-4">
                  <Bot className="w-6 h-6" />
                </div>
                <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider block">वर्गीकरण अचूकता / AI Classifier</span>
                <div className="text-3xl font-black text-slate-900 dark:text-slate-100 font-sans mt-1">98.4%</div>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">Automated routing confidence</p>
              </div>

              <div className="bg-white dark:bg-slate-800 p-6 rounded-3xl border border-[#E2E8F0] dark:border-slate-700 shadow-sm hover:shadow-md transition-all text-[#1E293B] dark:text-slate-200">
                <div className="w-12 h-12 rounded-xl bg-amber-50 dark:bg-amber-950/20 border border-amber-100 dark:border-amber-900/30 flex items-center justify-center text-[#F59E0B] mb-4">
                  <Zap className="w-6 h-6" />
                </div>
                <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider block">आयओटी सेन्सर्स / Live IoT Sensors</span>
                <div className="text-3xl font-black text-slate-900 dark:text-slate-100 font-sans mt-1">148 / 150</div>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">Nodes synchronized in 28 wards</p>
              </div>
            </div>

            {/* GIS Interactive Map & Live AI Ticker */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2">
                <KopargaonMap onSelectComplaint={(c) => {
                  setSelectedComplaint(c);
                  setActiveTab('complaints');
                }} />
              </div>

              <div className="space-y-6">
                {/* AI Suggestions Box */}
                <div className="bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm border border-purple-200">
                  <div className="flex items-center gap-2 mb-3 text-purple-600 text-xs font-sans font-bold uppercase tracking-wider">
                    <Sparkles className="w-4 h-4" /> AI CONTROL ROOM SUGGESTIONS
                  </div>
                  <div className="space-y-3 text-xs">
                    <div className="p-3 bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700">
                      <p className="text-slate-800 dark:text-slate-200 font-semibold mb-1">Pothole Cluster Alert in Ward 4</p>
                      <p className="text-slate-500 dark:text-slate-400 text-[11px]">Deploy asphalt repair crew #02 to Station Road before predicted rain tomorrow morning.</p>
                    </div>
                    <div className="p-3 bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700">
                      <p className="text-slate-800 dark:text-slate-200 font-semibold mb-1">Waste Overflow Mitigation (Ward 7)</p>
                      <p className="text-slate-500 dark:text-slate-400 text-[11px]">Reroute Truck #04 to Subhash Market Yard to clear 3.2 tons commercial waste.</p>
                    </div>
                  </div>
                </div>

                {/* Urgent Alerts Feed */}
                <div className="bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm border border-amber-500/40">
                  <div className="flex items-center gap-2 mb-3 text-amber-600 text-xs font-sans font-bold uppercase tracking-wider">
                    <AlertTriangle className="w-4 h-4" /> LIVE SYSTEM ALERTS
                  </div>
                  <div className="space-y-3 text-xs">
                    {cityAlerts.map(a => (
                      <div key={a.id} className="p-3 bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 flex items-start gap-2.5">
                        <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                        <div>
                          <span className="font-bold text-slate-800 dark:text-slate-200 block">{a.title}</span>
                          <span className="text-[11px] text-slate-500 dark:text-slate-400">{a.message}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Recent Complaints Grid */}
            <div className="bg-white dark:bg-slate-800 p-6 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                  <ClipboardList className="w-5 h-5 text-orange-600" /> Pending Officer Action Queue
                </h3>
                <button
                  onClick={() => setActiveTab('complaints')}
                  className="text-xs font-sans font-bold text-orange-600 hover:underline flex items-center gap-1"
                >
                  Manage All ({totalComplaints}) <ChevronRight className="w-4 h-4" />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {complaints.slice(0, 3).map(c => (
                  <div key={c.id} className="p-5 rounded-2xl bg-[#F8FAFC] dark:bg-slate-900 border border-[#E2E8F0] dark:border-slate-700 hover:border-[#F97316]/30 shadow-sm hover:shadow transition-all space-y-2.5">
                    <div className="flex items-center justify-between text-xs font-sans">
                      <span className="text-orange-600 font-bold">{c.id}</span>
                      <span className="text-rose-600 font-bold">{c.priority}</span>
                    </div>
                    <h4 className="font-bold text-slate-900 dark:text-slate-100 text-xs line-clamp-1">{c.title}</h4>
                    <p className="text-slate-500 dark:text-slate-400 text-[11px] line-clamp-1">{c.locationName}</p>
                    <div className="pt-2 border-t border-slate-200 dark:border-slate-700 flex items-center justify-between text-[10px] font-sans font-semibold text-slate-500 dark:text-slate-400">
                      <span>{c.department}</span>
                      <span className="text-emerald-600">AI {c.aiConfidence}%</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: LIVE GIS MAP */}
        {activeTab === 'map' && (
          <div className="p-8 space-y-8">
            <h2 className="text-2xl font-black text-[#0F172A] dark:text-slate-100 flex items-center gap-2.5 tracking-tight">
              <Map className="w-6 h-6 text-orange-600" /> Kopargaon Smart City Spatial GIS Map Engine
            </h2>
            <KopargaonMap onSelectComplaint={(c) => {
              setSelectedComplaint(c);
              setActiveTab('complaints');
            }} />
          </div>
        )}

        {/* TAB 3: COMPLAINT MANAGEMENT */}
        {activeTab === 'complaints' && (
          <div className="p-8 space-y-8">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <h2 className="text-2xl font-black text-[#0F172A] dark:text-slate-100 tracking-tight">Grievance & Complaint Management</h2>
                <p className="text-xs text-slate-500 dark:text-slate-400">Triage, assign maintenance officers, and update resolution lifecycle</p>
              </div>

              {/* Filters */}
              <div className="flex items-center gap-3 text-xs font-mono">
                <div className="flex items-center gap-2 bg-slate-50 dark:bg-slate-900 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700">
                  <Filter className="w-4 h-4 text-orange-600" />
                  <span>Status:</span>
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="bg-[#F8FAFC] dark:bg-slate-900 border border-[#E2E8F0] dark:border-slate-700 rounded-xl px-3.5 py-2 text-[#1E293B] dark:text-slate-200 text-xs font-bold focus:outline-none focus:ring-2 focus:ring-[#F97316] focus:bg-white dark:focus:bg-slate-800 dark:bg-slate-800 transition-all"
                  >
                    <option value="All" className="bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-100">All</option>
                    <option value="Pending" className="bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-100">Pending</option>
                    <option value="Assigned" className="bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-100">Assigned</option>
                    <option value="In Progress" className="bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-100">In Progress</option>
                    <option value="Resolved" className="bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-100">Resolved</option>
                  </select>
                </div>

                <div className="flex items-center gap-2 bg-slate-50 dark:bg-slate-900 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700">
                  <span>Category:</span>
                  <select
                    value={categoryFilter}
                    onChange={(e) => setCategoryFilter(e.target.value)}
                    className="bg-[#F8FAFC] dark:bg-slate-900 border border-[#E2E8F0] dark:border-slate-700 rounded-xl px-3.5 py-2 text-[#1E293B] dark:text-slate-200 text-xs font-bold focus:outline-none focus:ring-2 focus:ring-[#F97316] focus:bg-white dark:focus:bg-slate-800 dark:bg-slate-800 transition-all"
                  >
                    <option value="All" className="bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-100">All Categories</option>
                    <option value="Garbage" className="bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-100">Garbage</option>
                    <option value="Pothole" className="bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-100">Pothole</option>
                    <option value="Water Leakage" className="bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-100">Water Leakage</option>
                    <option value="Street Light" className="bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-100">Street Light</option>
                    <option value="Traffic" className="bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-100">Traffic</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Complaints Data Table */}
            <div className="bg-white dark:bg-slate-800 rounded-3xl border border-[#E2E8F0] dark:border-slate-700 shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#F8FAFC] dark:bg-slate-900 text-[#0F172A] dark:text-slate-100 font-bold text-xs uppercase tracking-wider border-b border-[#E2E8F0] dark:border-slate-700 font-sans">
                    <tr>
                      <th className="p-4">ID</th>
                      <th className="p-4">Complaint Title</th>
                      <th className="p-4">Ward / Location</th>
                      <th className="p-4">Department</th>
                      <th className="p-4">Priority</th>
                      <th className="p-4">Status</th>
                      <th className="p-4">Officer Assigned</th>
                      <th className="p-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 dark:divide-slate-700 font-sans">
                    {filteredComplaints.map(c => (
                      <tr key={c.id} className="bg-white dark:bg-slate-800 odd:bg-white dark:bg-slate-800 even:bg-slate-50 dark:bg-slate-900/30 hover:bg-[#F8FAFC] dark:bg-slate-900/80 transition-colors border-b border-[#E2E8F0] dark:border-slate-700 last:border-b-0">
                        <td className="p-4 font-sans"><span className="font-mono text-xs font-bold text-orange-700 bg-orange-100 px-2.5 py-1 rounded-md">{c.id}</span></td>
                        <td className="p-4">
                          <span className="font-bold text-slate-900 dark:text-slate-100 block">{c.title}</span>
                          <span className="text-[11px] text-slate-500 dark:text-slate-400">{c.category} • Submitted by {c.submittedBy}</span>
                        </td>
                        <td className="p-4 font-sans text-slate-700 dark:text-slate-300">
                          Ward {c.ward}
                          <span className="block text-[11px] text-slate-500 dark:text-slate-400 font-sans">{c.locationName}</span>
                        </td>
                        <td className="p-4 font-sans text-slate-700 dark:text-slate-300">{c.department}</td>
                        <td className="p-4">
                          <span className={`px-2.5 py-1 rounded-xl text-[10px] font-sans font-bold border ${
                            c.priority === 'Critical' ? 'bg-rose-100 text-rose-700 border-rose-200' :
                            c.priority === 'High' ? 'bg-orange-100 text-orange-700 border-orange-200' :
                            'bg-blue-100 text-blue-700 dark:bg-blue-950/40 dark:text-blue-400 dark:bg-blue-950/40 dark:text-blue-400 border border-blue-200 dark:border-blue-800/30'
                          }`}>
                            {c.priority}
                          </span>
                        </td>
                        <td className="p-4">
                          <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                            c.status === 'Resolved' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400' :
                            c.status === 'In Progress' ? 'bg-blue-100 text-blue-700 dark:bg-blue-950/40 dark:text-blue-400' :
                            c.status === 'Assigned' ? 'bg-purple-100 text-purple-700 dark:bg-purple-950/40 dark:text-purple-400' : 'bg-amber-100 text-amber-700 dark:bg-amber-950/40 dark:text-amber-400'
                          }`}>
                            {c.status}
                          </span>
                        </td>
                        <td className="p-4 font-sans text-slate-700 dark:text-slate-300">
                          {c.assignedOfficer || <span className="text-amber-600 italic">Unassigned</span>}
                        </td>
                        <td className="p-4 text-right space-x-2">
                          <button
                            onClick={() => setSelectedComplaint(c)}
                            className="px-4 py-2 border border-[#E2E8F0] dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:bg-slate-900 text-[#1E293B] dark:text-slate-200 hover:text-[#F97316] font-bold rounded-xl text-xs font-sans transition-all shadow-sm"
                          >
                            Update / Inspect
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Officer Action Modal / Inspector */}
            {selectedComplaint && (
              <div className="bg-white dark:bg-slate-800 p-6 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-lg text-slate-800 dark:text-slate-200 space-y-6">
                <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-700 pb-4">
                  <div>
                    <span className="font-sans text-xs font-bold text-orange-700 bg-orange-100 px-3 py-1.5 rounded-xl border border-orange-200">
                      INSPECTING: {selectedComplaint.id}
                    </span>
                    <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 mt-2">{selectedComplaint.title}</h3>
                  </div>
                  <button
                    onClick={() => setSelectedComplaint(null)}
                    className="text-xs font-sans font-bold text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:text-slate-200"
                  >
                    Close Inspector ✕
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <h4 className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">Image Evidence</h4>
                    <img src={selectedComplaint.imageUrl} alt={selectedComplaint.title} className="w-full h-44 rounded-xl object-cover border border-slate-200 dark:border-slate-700" />
                  </div>

                  <div className="space-y-3 text-xs">
                    <div>
                      <span className="text-slate-500 dark:text-slate-400 block text-[10px] font-bold uppercase tracking-wider mb-0.5">Location & Ward:</span>
                      <span className="font-bold text-slate-800 dark:text-slate-200">Ward {selectedComplaint.ward} - {selectedComplaint.locationName}</span>
                    </div>
                    <div>
                      <span className="text-slate-500 dark:text-slate-400 block text-[10px] font-bold uppercase tracking-wider mb-0.5">AI Classification Triage:</span>
                      <span className="font-bold text-purple-700 font-sans text-sm">{selectedComplaint.department} ({selectedComplaint.aiConfidence}% confidence)</span>
                    </div>
                    <div>
                      <span className="text-slate-500 dark:text-slate-400 block text-[10px] font-bold uppercase tracking-wider mb-0.5">Current Status:</span>
                      <span className="font-bold text-emerald-600">{selectedComplaint.status}</span>
                    </div>
                  </div>

                  {/* Officer Action Form */}
                  <div className="space-y-4 bg-slate-50 dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-700 text-xs">
                    <h4 className="font-sans font-bold text-orange-700 text-sm tracking-wide uppercase">MUNICIPAL DISPATCH CONTROL</h4>

                    <div>
                      <label className="block text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">Assign Maintenance Officer</label>
                      <input
                        type="text"
                        defaultValue={selectedComplaint.assignedOfficer || 'Officer Rajesh Patil'}
                        id="officerInput"
                        className="w-full px-4 py-3 bg-[#F8FAFC] dark:bg-slate-900 border border-[#E2E8F0] dark:border-slate-700 rounded-xl text-[#1E293B] dark:text-slate-200 text-sm font-semibold placeholder:text-[#64748B] dark:placeholder:text-slate-500 dark:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#F97316] focus:bg-white dark:focus:bg-slate-800 dark:bg-slate-800 transition-all"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">Update Status Lifecycle</label>
                      <div className="grid grid-cols-2 gap-2">
                        {['Pending', 'Assigned', 'In Progress', 'Resolved'].map(st => (
                          <button
                            key={st}
                            onClick={() => {
                              const off = document.getElementById('officerInput').value;
                              updateComplaintStatus(selectedComplaint.id, st, `Updated by Municipal Control Room officer`, off);
                              setSelectedComplaint(prev => ({ ...prev, status: st, assignedOfficer: off }));
                            }}
                            className={`p-2 rounded-lg font-mono text-[11px] transition-all border ${
                              selectedComplaint.status === st 
                                ? 'bg-[#F97316] text-slate-950 font-bold border-orange-400' 
                                : 'bg-slate-50 dark:bg-slate-900 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-orange-500/40'
                            }`}
                          >
                            {st}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* TAB 4: AI ASSISTANT */}
        {activeTab === 'ai' && (
          <div className="p-8 max-w-4xl mx-auto space-y-8">
            <div>
              <h2 className="text-2xl font-black text-[#0F172A] dark:text-slate-100 flex items-center gap-2.5 tracking-tight">
                <Bot className="w-6 h-6 text-purple-600" /> Kopargaon Digital Twin AI Assistant
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">Ask natural language queries regarding city telemetry, ward health, and traffic predictions</p>
            </div>

            {/* Pre-configured AI Queries */}
            <div className="flex flex-wrap items-center gap-2 text-xs font-sans">
              <span className="text-slate-500 dark:text-slate-400">Suggested Queries:</span>
              {aiQueries.map((q, idx) => (
                <button
                  key={idx}
                  onClick={() => handleAiQuery(q)}
                  className="px-3 py-1.5 bg-purple-950/60 hover:bg-purple-900 border border-purple-200 rounded-xl text-purple-300 transition-all"
                >
                  {q}
                </button>
              ))}
            </div>

            {/* Chat Box */}
            <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-sm p-6 h-[480px] flex flex-col justify-between">
              <div className="overflow-y-auto space-y-4 pr-2">
                {chatMessages.map((msg, idx) => (
                  <div key={idx} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-xl p-4 rounded-2xl text-xs leading-relaxed ${
                      msg.sender === 'user'
                        ? 'bg-orange-600 text-white font-bold rounded-br-none'
                        : 'bg-slate-50 dark:bg-slate-900 border border-purple-500/30 text-slate-800 dark:text-slate-200 rounded-bl-none font-mono'
                    }`}>
                      {msg.text}
                    </div>
                  </div>
                ))}

                {isAiThinking && (
                  <div className="flex justify-start">
                    <div className="bg-slate-100 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 p-3 rounded-2xl text-purple-700 text-xs font-sans font-semibold flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-purple-400 border-t-transparent rounded-full animate-spin"></div>
                      AI Engine analyzing spatial GIS telemetry...
                    </div>
                  </div>
                )}
              </div>

              {/* Chat Input */}
              <form onSubmit={handleSendCustomChat} className="flex items-center gap-3 pt-4 border-t border-slate-200 dark:border-slate-700">
                <input
                  type="text"
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  placeholder="Ask AI Assistant about Kopargaon wards, traffic, or grievances..."
                  className="flex-1 px-4 py-3 bg-[#F8FAFC] dark:bg-slate-900 border border-[#E2E8F0] dark:border-slate-700 rounded-xl text-[#1E293B] dark:text-slate-200 text-sm font-sans placeholder:text-[#64748B] dark:placeholder:text-slate-500 dark:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#F97316] focus:bg-white dark:focus:bg-slate-800 dark:bg-slate-800 transition-all"
                />
                <button
                  type="submit"
                  className="p-3 rounded-xl bg-purple-600 hover:bg-purple-50 dark:hover:bg-purple-100 dark:hover:bg-purple-900/30 text-slate-950 font-bold transition-all"
                >
                  <Send className="w-4 h-4" />
                </button>
              </form>
            </div>
          </div>
        )}

        {/* TAB 5: ANALYTICS */}
        {activeTab === 'analytics' && (
          <div className="p-8 space-y-8">
            <h2 className="text-2xl font-black text-[#0F172A] dark:text-slate-100 flex items-center gap-2.5 tracking-tight">
              <BarChart3 className="w-6 h-6 text-orange-600" /> Municipal Operations & Grievance Analytics
            </h2>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Complaints by Ward Chart */}
              <div className="bg-white dark:bg-slate-800 p-6 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-sm">
                <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 font-sans mb-4">Complaints Density by Ward</h3>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={complaintsByWardData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                      <XAxis dataKey="ward" stroke="#94a3b8" />
                      <YAxis stroke="#94a3b8" />
                      <Tooltip contentStyle={{ background: '#ffffff', border: '1px solid #E2E8F0', borderRadius: '12px', color: '#1E293B', fontSize: '12px', fontWeight: 'bold' }} />
                      <Bar dataKey="complaints" fill="#F97316" radius={[6, 6, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Category Distribution Pie */}
              <div className="bg-white dark:bg-slate-800 p-6 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-sm">
                <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 font-sans mb-4">Grievance Category Breakdown</h3>
                <div className="h-64 flex items-center justify-center">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={categoryDistData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={90}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {categoryDistData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip contentStyle={{ background: '#ffffff', border: '1px solid #E2E8F0', borderRadius: '12px', color: '#1E293B', fontSize: '12px', fontWeight: 'bold' }} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Monthly Resolution Trend */}
              <div className="bg-white dark:bg-slate-800 p-6 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-sm lg:col-span-2">
                <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 font-sans mb-4">Monthly Grievance Resolution Trend</h3>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={monthlyTrendData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                      <XAxis dataKey="month" stroke="#94a3b8" />
                      <YAxis stroke="#94a3b8" />
                      <Tooltip contentStyle={{ background: '#ffffff', border: '1px solid #E2E8F0', borderRadius: '12px', color: '#1E293B', fontSize: '12px', fontWeight: 'bold' }} />
                      <Area type="monotone" dataKey="reported" stroke="#F97316" fill="#F97316" fillOpacity={0.1} />
                      <Area type="monotone" dataKey="resolved" stroke="#22C55E" fill="#22C55E" fillOpacity={0.2} />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 6: WHAT-IF SIMULATION ENGINE */}
        {activeTab === 'simulation' && (
          <div className="p-8 max-w-5xl mx-auto space-y-8">
            <div>
              <h2 className="text-2xl font-black text-[#0F172A] dark:text-slate-100 flex items-center gap-2.5 tracking-tight">
                <Sliders className="w-6 h-6 text-orange-600" /> What-if Urban Scenario Simulation Engine
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">Simulate municipal resource re-allocation and predict city impact in real-time</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* SCENARIO A: GARBAGE TRUCK FLEET */}
              <div className="bg-white dark:bg-slate-800 p-8 rounded-3xl border border-[#E2E8F0] dark:border-slate-700 shadow-sm hover:shadow-md transition-all text-[#1E293B] dark:text-slate-200 space-y-6">
                <div className="flex items-center gap-2 text-orange-600 font-mono text-xs font-bold">
                  <Layers className="w-4 h-4" /> SCENARIO A: GARBAGE FLEET
                </div>

                <div>
                  <div className="flex justify-between text-xs font-mono mb-2">
                    <span className="text-slate-500 dark:text-slate-400">Active Fleet Trucks:</span>
                    <span className="font-bold text-orange-600">{simGarbageTrucks} Trucks</span>
                  </div>
                  <input
                    type="range"
                    min="3"
                    max="10"
                    value={simGarbageTrucks}
                    onChange={(e) => setSimGarbageTrucks(parseInt(e.target.value))}
                    className="w-full accent-orange-400 cursor-pointer"
                  />
                </div>

                <div className="p-5 bg-[#F8FAFC] dark:bg-slate-900 rounded-2xl border border-[#E2E8F0] dark:border-slate-700 space-y-2.5 text-xs font-sans">
                  <div className="text-slate-500 dark:text-slate-400 text-[10px] font-bold uppercase tracking-wider border-b border-slate-200 dark:border-slate-700 pb-1.5">SIMULATION RESULTS</div>
                  <div className="flex justify-between text-emerald-600">
                    <span>Waste Overflow Reduced:</span>
                    <strong>-{((simGarbageTrucks - 4) * 18).toFixed(0)}%</strong>
                  </div>
                  <div className="flex justify-between text-orange-600">
                    <span>Collection Speed:</span>
                    <strong>+{(simGarbageTrucks * 12)}%</strong>
                  </div>
                  <div className="flex justify-between text-amber-600">
                    <span>Fuel Optimization:</span>
                    <strong>+{(15 + simGarbageTrucks * 3)}%</strong>
                  </div>
                  <div className="flex justify-between text-purple-600">
                    <span>Citizen Satisfaction:</span>
                    <strong>{Math.min(99, 70 + simGarbageTrucks * 3.5)}%</strong>
                  </div>
                </div>
              </div>

              {/* SCENARIO B: ROAD REPAIR BUDGET */}
              <div className="bg-white dark:bg-slate-800 p-8 rounded-3xl border border-[#E2E8F0] dark:border-slate-700 shadow-sm hover:shadow-md transition-all text-[#1E293B] dark:text-slate-200 space-y-6">
                <div className="flex items-center gap-2 text-purple-600 font-mono text-xs font-bold">
                  <TrendingUp className="w-4 h-4" /> SCENARIO B: ROAD REPAIR
                </div>

                <div>
                  <div className="flex justify-between text-xs font-mono mb-2">
                    <span className="text-slate-500 dark:text-slate-400">Budget Allocation:</span>
                    <span className="font-bold text-purple-600">₹{simRoadBudget} Lakhs</span>
                  </div>
                  <input
                    type="range"
                    min="10"
                    max="150"
                    step="10"
                    value={simRoadBudget}
                    onChange={(e) => setSimRoadBudget(parseInt(e.target.value))}
                    className="w-full accent-purple-400 cursor-pointer"
                  />
                </div>

                <div className="p-5 bg-[#F8FAFC] dark:bg-slate-900 rounded-2xl border border-[#E2E8F0] dark:border-slate-700 space-y-2.5 text-xs font-sans">
                  <div className="text-slate-500 dark:text-slate-400 text-[10px] font-bold uppercase tracking-wider border-b border-slate-200 dark:border-slate-700 pb-1.5">SIMULATION RESULTS</div>
                  <div className="flex justify-between text-emerald-600">
                    <span>Traffic Congestion Reduced:</span>
                    <strong>-{(simRoadBudget * 0.45).toFixed(1)}%</strong>
                  </div>
                  <div className="flex justify-between text-orange-600">
                    <span>Accident Risk Drop:</span>
                    <strong>-{(simRoadBudget * 0.38).toFixed(1)}%</strong>
                  </div>
                  <div className="flex justify-between text-amber-600">
                    <span>Commute Time Improved:</span>
                    <strong>-{(simRoadBudget * 0.22).toFixed(1)} mins</strong>
                  </div>
                </div>
              </div>

              {/* SCENARIO C: WATER LEAK SENSORS */}
              <div className="bg-white dark:bg-slate-800 p-8 rounded-3xl border border-[#E2E8F0] dark:border-slate-700 shadow-sm hover:shadow-md transition-all text-[#1E293B] dark:text-slate-200 space-y-6">
                <div className="flex items-center gap-2 text-emerald-600 font-mono text-xs font-bold">
                  <Zap className="w-4 h-4" /> SCENARIO C: LEAK SENSORS
                </div>

                <div className="flex items-center justify-between py-2 border-b border-slate-200 dark:border-slate-700">
                  <span className="text-xs font-mono text-slate-700 dark:text-slate-300">IoT Acoustic Leak Grid:</span>
                  <button
                    onClick={() => setSimWaterSensors(!simWaterSensors)}
                    className={`px-3 py-1 rounded-full text-xs font-mono font-bold transition-all ${
                      simWaterSensors ? 'bg-emerald-600 text-white' : 'bg-slate-200 text-slate-600 dark:text-slate-300'
                    }`}
                  >
                    {simWaterSensors ? 'ENABLED' : 'DISABLED'}
                  </button>
                </div>

                <div className="p-5 bg-[#F8FAFC] dark:bg-slate-900 rounded-2xl border border-[#E2E8F0] dark:border-slate-700 space-y-2.5 text-xs font-sans">
                  <div className="text-slate-500 dark:text-slate-400 text-[10px] font-bold uppercase tracking-wider border-b border-slate-200 dark:border-slate-700 pb-1.5">SIMULATION RESULTS</div>
                  <div className="flex justify-between text-emerald-600">
                    <span>Water Saved / Day:</span>
                    <strong>{simWaterSensors ? '28,500 L' : '4,200 L'}</strong>
                  </div>
                  <div className="flex justify-between text-orange-600">
                    <span>Response Time:</span>
                    <strong>{simWaterSensors ? '15 Mins' : '4.5 Hours'}</strong>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 7: NOTIFICATIONS */}
        {activeTab === 'notifications' && (
          <div className="p-8 max-w-4xl mx-auto space-y-8">
            <h2 className="text-2xl font-black text-[#0F172A] dark:text-slate-100 flex items-center gap-2.5 tracking-tight">
              <Bell className="w-6 h-6 text-amber-600" /> Control Room System Audit & Notifications Log
            </h2>

            <div className="space-y-3">
              {cityAlerts.map(alt => (
                <div key={alt.id} className="p-5 rounded-2xl bg-white dark:bg-slate-800 border border-[#E2E8F0] dark:border-slate-700 shadow-sm hover:shadow transition-all flex items-center justify-between">
                  <div className="flex items-center gap-3 text-xs">
                    <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                    <div>
                      <span className="font-bold text-slate-900 dark:text-slate-100 block">{alt.title}</span>
                      <span className="text-slate-500 dark:text-slate-400">{alt.message}</span>
                    </div>
                  </div>
                  <span className="text-[11px] font-mono text-slate-500 dark:text-slate-400">{alt.timestamp}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 8: SETTINGS */}
        {activeTab === 'settings' && (
          <div className="p-8 max-w-3xl mx-auto space-y-8">
            <h2 className="text-2xl font-black text-[#0F172A] dark:text-slate-100 flex items-center gap-2.5 tracking-tight">
              <Settings className="w-6 h-6 text-slate-500 dark:text-slate-400" /> Control Room System Settings
            </h2>

            <div className="bg-white dark:bg-slate-800 p-8 rounded-3xl border border-[#E2E8F0] dark:border-slate-700 shadow-sm hover:shadow-md transition-all space-y-6 text-xs text-[#1E293B] dark:text-slate-200">
              <div className="flex items-center justify-between p-5 bg-[#F8FAFC] dark:bg-slate-900 rounded-2xl border border-[#E2E8F0] dark:border-slate-700">
                <div>
                  <span className="font-bold text-slate-800 dark:text-slate-200 block">AI Auto-Triage Threshold</span>
                  <span className="text-slate-500 dark:text-slate-400">Minimum confidence required for automatic ticket routing</span>
                </div>
                <span className="font-mono text-orange-600 font-bold">90%</span>
              </div>

              <div className="flex items-center justify-between p-5 bg-[#F8FAFC] dark:bg-slate-900 rounded-2xl border border-[#E2E8F0] dark:border-slate-700">
                <div>
                  <span className="font-bold text-slate-800 dark:text-slate-200 block">GIS Telemetry Refresh Rate</span>
                  <span className="text-slate-500 dark:text-slate-400">Frequency of vector node position synchronization</span>
                </div>
                <span className="font-mono text-emerald-600 font-bold">5 SEC</span>
              </div>

              <div className="flex items-center justify-between p-5 bg-[#F8FAFC] dark:bg-slate-900 rounded-2xl border border-[#E2E8F0] dark:border-slate-700">
                <div>
                  <span className="font-bold text-slate-800 dark:text-slate-200 block">Security Protocol</span>
                  <span className="text-slate-500 dark:text-slate-400">Encrypted transmission between Municipal Headquarters & Ward Nodes</span>
                </div>
                <span className="font-mono text-purple-600 font-bold">AES-256</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
