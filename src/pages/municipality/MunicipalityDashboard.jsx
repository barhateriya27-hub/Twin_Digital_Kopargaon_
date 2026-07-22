import React, { useState } from 'react';
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
  AlertCircle
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
    <div className="min-h-screen bg-slate-50 text-slate-800 flex font-sans selection:bg-orange-500 selection:text-white">
      {/* SIDEBAR NAVIGATION */}
      <aside className="w-64 bg-[#0A2540] border-r border-slate-200 flex flex-col justify-between hidden md:flex shrink-0">
        <div>
          {/* Logo & Header */}
          <div className="p-6 border-b border-slate-200/80 flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-slate-50 border border-orange-500/40 p-1.5 flex items-center justify-center text-orange-500 shadow-md shadow-orange-500/25 shrink-0">
              {/* Government Seal SVG */}
              <svg viewBox="0 0 100 100" className="w-full h-full text-orange-500">
                <circle cx="50" cy="50" r="42" fill="none" stroke="currentColor" strokeWidth="4" />
                <path d="M 35 70 Q 50 25, 65 70 Z" fill="none" stroke="currentColor" strokeWidth="5" />
                <circle cx="50" cy="45" r="8" fill="currentColor" />
              </svg>
            </div>
            <div>
              <span className="font-extrabold text-xs text-slate-900 block tracking-tight leading-tight">
                कोपरगाव नगरपरिषद
              </span>
              <span className="font-bold text-[10px] text-orange-500 block leading-tight">
                नियंत्रण व समन्वय कक्ष
              </span>
              <span className="text-[8px] font-mono text-slate-500 uppercase tracking-wider block">
                KMC SECURED CONTROL
              </span>
            </div>
          </div>

          {/* Menu Items */}
          <nav className="p-4 space-y-1 text-xs font-semibold">
            {[
              { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard className="w-4 h-4" /> },
              { id: 'map', label: 'Live Map', icon: <Map className="w-4 h-4" /> },
              { id: 'complaints', label: 'Complaint Management', icon: <ClipboardList className="w-4 h-4" />, badge: pendingCount },
              { id: 'ai', label: 'AI Assistant', icon: <Bot className="w-4 h-4 text-purple-600" /> },
              { id: 'analytics', label: 'Analytics', icon: <BarChart3 className="w-4 h-4" /> },
              { id: 'simulation', label: 'What-if Simulation', icon: <Sliders className="w-4 h-4 text-orange-600" /> },
              { id: 'notifications', label: 'Notifications', icon: <Bell className="w-4 h-4 text-amber-600" /> },
              { id: 'settings', label: 'Settings', icon: <Settings className="w-4 h-4" /> }
            ].map(item => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center justify-between px-3.5 py-3 rounded-xl transition-all ${
                  activeTab === item.id ? 'bg-orange-600 text-white font-bold' : 'text-slate-700 hover:text-white hover:bg-white/10'
                }`}
              >
                <div className="flex items-center gap-3">
                  {item.icon}
                  <span>{item.label}</span>
                </div>
                {item.badge > 0 && (
                  <span className="px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-300 font-mono text-[10px]">
                    {item.badge}
                  </span>
                )}
              </button>
            ))}
          </nav>
        </div>

        {/* Officer Info & Logout */}
        <div className="p-4 border-t border-slate-200 bg-slate-50/40">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-orange-950 border border-orange-400/40 flex items-center justify-center text-orange-600 text-xs font-bold font-mono">
                CO
              </div>
              <div>
                <span className="text-xs font-bold text-slate-800 block">{officerUser?.name || 'Chief Officer'}</span>
                <span className="text-[10px] font-mono text-orange-600 block">{officerUser?.badge || 'KMC-ADMIN'}</span>
              </div>
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="w-full py-2 px-3 rounded-xl border border-rose-500/20 bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 text-xs font-semibold flex items-center justify-center gap-2 transition-colors"
          >
            <LogOut className="w-3.5 h-3.5" /> Logout Control Room
          </button>
        </div>
      </aside>

      {/* MAIN CONTENT AREA */}
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        {/* Top Control Bar */}
        <header className="bg-white border-b border-slate-200 py-3.5 px-6 sticky top-0 z-30 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping shrink-0"></div>
            <div className="flex flex-col">
              <span className="text-xs font-bold text-slate-800">
                महाराष्ट्र शासन • कोपरगाव नगरपरिषद नियंत्रण आणि समन्वय केंद्र
              </span>
              <span className="text-[9px] font-mono text-orange-600 tracking-wider">
                SECURE OFFICER PORTAL // SESSION AUDIT: ON // NODE: {activeTab.toUpperCase()}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-4 text-[10px] font-mono">
            <div className="hidden lg:flex items-center gap-2 bg-slate-50 px-2.5 py-1.5 rounded-lg border border-slate-200">
              <span className="text-slate-500">AUDIT TRAIL:</span>
              <span className="text-emerald-600 font-bold">ENCRYPTED</span>
            </div>
            <div className="hidden sm:flex items-center gap-2 bg-slate-50 px-2.5 py-1.5 rounded-lg border border-slate-200">
              <span className="text-slate-500">OFFICER:</span>
              <span className="text-orange-600 font-bold">KMC-ADMIN (10.240.42.12)</span>
            </div>
          </div>
        </header>

        {/* Secure audit disclaimer ribbon */}
        <div className="bg-orange-500/5 border-b border-orange-500/10 px-6 py-2 flex items-center justify-between text-[9px] font-mono text-slate-500 shrink-0">
          <span>🔒 Restricted Internal Access. Citizen grievance logging and action history are recorded under secure audit protocol.</span>
          <span className="text-orange-500/80 font-bold">GRID STATUS: SYNCED</span>
        </div>

        {/* Mobile Navigation Header */}
        <div className="md:hidden flex items-center justify-around bg-white border-b border-slate-200 py-2.5 px-2 text-xs text-slate-800">
          {['dashboard', 'map', 'complaints', 'ai', 'simulation'].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`capitalize px-2.5 py-1 rounded-lg ${activeTab === tab ? 'bg-orange-500/20 text-orange-600 font-bold' : 'text-slate-500'}`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* TAB 1: DASHBOARD OVERVIEW */}
        {activeTab === 'dashboard' && (
          <div className="p-6 space-y-6">
            {/* Top Stat Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm border-t-2 border-t-emerald-500 border-x border-b border-slate-200 shadow-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-bold text-slate-500 uppercase">आरोग्य निर्देशांक / Health Index</span>
                  <Activity className="w-4 h-4 text-emerald-600" />
                </div>
                <div className="text-2xl font-black text-emerald-600 font-mono">94/100</div>
                <p className="text-[10px] text-slate-500 mt-1">● Optimal municipal operations</p>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm border-t-2 border-t-orange-500 border-x border-b border-slate-200 shadow-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-bold text-slate-500 uppercase">नागरी तक्रारी / Active Grievances</span>
                  <ClipboardList className="w-4 h-4 text-orange-600" />
                </div>
                <div className="text-2xl font-black text-orange-600 font-mono">{totalComplaints}</div>
                <p className="text-[10px] text-slate-500 mt-1">{pendingCount} pending administrative action</p>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm border-t-2 border-t-purple-500 border-x border-b border-slate-200 shadow-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-bold text-slate-500 uppercase">वर्गीकरण अचूकता / AI Classifier</span>
                  <Bot className="w-4 h-4 text-purple-600" />
                </div>
                <div className="text-2xl font-black text-purple-600 font-mono">98.4%</div>
                <p className="text-[10px] text-slate-500 mt-1">Automated dispatch confidence</p>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm border-t-2 border-t-amber-500 border-x border-b border-slate-200 shadow-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-bold text-slate-500 uppercase">आयओटी सेन्सर्स / Live IoT Sensors</span>
                  <Zap className="w-4 h-4 text-amber-600" />
                </div>
                <div className="text-2xl font-black text-amber-600 font-mono">148 / 150</div>
                <p className="text-[10px] text-slate-500 mt-1">Nodes synchronized in 28 wards</p>
              </div>
            </div>

            {/* GIS Interactive Map & Live AI Ticker */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <KopargaonMap onSelectComplaint={(c) => {
                  setSelectedComplaint(c);
                  setActiveTab('complaints');
                }} />
              </div>

              <div className="space-y-6">
                {/* AI Suggestions Box */}
                <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm border border-purple-200">
                  <div className="flex items-center gap-2 mb-3 text-purple-600 text-xs font-mono font-bold">
                    <Sparkles className="w-4 h-4" /> AI CONTROL ROOM SUGGESTIONS
                  </div>
                  <div className="space-y-3 text-xs">
                    <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                      <p className="text-slate-800 font-semibold mb-1">Pothole Cluster Alert in Ward 4</p>
                      <p className="text-slate-500 text-[11px]">Deploy asphalt repair crew #02 to Station Road before predicted rain tomorrow morning.</p>
                    </div>
                    <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                      <p className="text-slate-800 font-semibold mb-1">Waste Overflow Mitigation (Ward 7)</p>
                      <p className="text-slate-500 text-[11px]">Reroute Truck #04 to Subhash Market Yard to clear 3.2 tons commercial waste.</p>
                    </div>
                  </div>
                </div>

                {/* Urgent Alerts Feed */}
                <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm border border-amber-500/40">
                  <div className="flex items-center gap-2 mb-3 text-amber-600 text-xs font-mono font-bold">
                    <AlertTriangle className="w-4 h-4" /> LIVE SYSTEM ALERTS
                  </div>
                  <div className="space-y-3 text-xs">
                    {cityAlerts.map(a => (
                      <div key={a.id} className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-start gap-2.5">
                        <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                        <div>
                          <span className="font-bold text-slate-800 block">{a.title}</span>
                          <span className="text-[11px] text-slate-500">{a.message}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Recent Complaints Grid */}
            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <ClipboardList className="w-5 h-5 text-orange-600" /> Pending Officer Action Queue
                </h3>
                <button
                  onClick={() => setActiveTab('complaints')}
                  className="text-xs font-mono text-orange-600 hover:underline flex items-center gap-1"
                >
                  Manage All ({totalComplaints}) <ChevronRight className="w-4 h-4" />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {complaints.slice(0, 3).map(c => (
                  <div key={c.id} className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                    <div className="flex items-center justify-between text-xs font-mono">
                      <span className="text-orange-600 font-bold">{c.id}</span>
                      <span className="text-rose-600 font-bold">{c.priority}</span>
                    </div>
                    <h4 className="font-bold text-slate-900 text-xs line-clamp-1">{c.title}</h4>
                    <p className="text-slate-500 text-[11px] line-clamp-1">{c.locationName}</p>
                    <div className="pt-2 border-t border-slate-200 flex items-center justify-between text-[10px] font-mono text-slate-500">
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
          <div className="p-6 space-y-6">
            <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
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
          <div className="p-6 space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-bold text-slate-900">Grievance & Complaint Management</h2>
                <p className="text-xs text-slate-500">Triage, assign maintenance officers, and update resolution lifecycle</p>
              </div>

              {/* Filters */}
              <div className="flex items-center gap-3 text-xs font-mono">
                <div className="flex items-center gap-2 bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-200">
                  <Filter className="w-4 h-4 text-orange-600" />
                  <span>Status:</span>
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="bg-transparent text-orange-600 focus:outline-none cursor-pointer"
                  >
                    <option value="All" className="bg-slate-50 text-slate-900">All</option>
                    <option value="Pending" className="bg-slate-50 text-slate-900">Pending</option>
                    <option value="Assigned" className="bg-slate-50 text-slate-900">Assigned</option>
                    <option value="In Progress" className="bg-slate-50 text-slate-900">In Progress</option>
                    <option value="Resolved" className="bg-slate-50 text-slate-900">Resolved</option>
                  </select>
                </div>

                <div className="flex items-center gap-2 bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-200">
                  <span>Category:</span>
                  <select
                    value={categoryFilter}
                    onChange={(e) => setCategoryFilter(e.target.value)}
                    className="bg-transparent text-orange-600 focus:outline-none cursor-pointer"
                  >
                    <option value="All" className="bg-slate-50 text-slate-900">All Categories</option>
                    <option value="Garbage" className="bg-slate-50 text-slate-900">Garbage</option>
                    <option value="Pothole" className="bg-slate-50 text-slate-900">Pothole</option>
                    <option value="Water Leakage" className="bg-slate-50 text-slate-900">Water Leakage</option>
                    <option value="Street Light" className="bg-slate-50 text-slate-900">Street Light</option>
                    <option value="Traffic" className="bg-slate-50 text-slate-900">Traffic</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Complaints Data Table */}
            <div className="glass-panel rounded-3xl border border-slate-200 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 text-orange-600 font-mono uppercase border-b border-slate-200">
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
                  <tbody className="divide-y divide-slate-200 font-sans">
                    {filteredComplaints.map(c => (
                      <tr key={c.id} className="hover:bg-slate-50 transition-colors">
                        <td className="p-4 font-mono font-bold text-orange-600">{c.id}</td>
                        <td className="p-4">
                          <span className="font-bold text-slate-900 block">{c.title}</span>
                          <span className="text-[11px] text-slate-500">{c.category} • Submitted by {c.submittedBy}</span>
                        </td>
                        <td className="p-4 font-mono text-slate-700">
                          Ward {c.ward}
                          <span className="block text-[11px] text-slate-500 font-sans">{c.locationName}</span>
                        </td>
                        <td className="p-4 font-mono text-slate-700">{c.department}</td>
                        <td className="p-4">
                          <span className={`px-2.5 py-1 rounded-md text-[10px] font-mono font-bold ${
                            c.priority === 'Critical' ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40' :
                            c.priority === 'High' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40' :
                            'bg-blue-500/20 text-blue-300 border border-blue-500/40'
                          }`}>
                            {c.priority}
                          </span>
                        </td>
                        <td className="p-4">
                          <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                            c.status === 'Resolved' ? 'bg-emerald-500/20 text-emerald-600' :
                            c.status === 'In Progress' ? 'bg-blue-500/20 text-blue-400' :
                            c.status === 'Assigned' ? 'bg-purple-500/20 text-purple-600' : 'bg-amber-500/20 text-amber-600'
                          }`}>
                            {c.status}
                          </span>
                        </td>
                        <td className="p-4 font-mono text-slate-700">
                          {c.assignedOfficer || <span className="text-amber-600 italic">Unassigned</span>}
                        </td>
                        <td className="p-4 text-right space-x-2">
                          <button
                            onClick={() => setSelectedComplaint(c)}
                            className="px-3 py-1.5 bg-orange-950 hover:bg-orange-900 border border-orange-500/40 rounded-lg text-orange-600 text-xs font-mono transition-all"
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
              <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-lg text-slate-800 space-y-6">
                <div className="flex items-center justify-between border-b border-slate-200 pb-4">
                  <div>
                    <span className="font-mono text-xs font-bold text-orange-600 bg-orange-50 px-3 py-1 rounded-md border border-orange-200 text-orange-700">
                      INSPECTING: {selectedComplaint.id}
                    </span>
                    <h3 className="text-lg font-bold text-slate-900 mt-2">{selectedComplaint.title}</h3>
                  </div>
                  <button
                    onClick={() => setSelectedComplaint(null)}
                    className="text-xs font-mono text-slate-500 hover:text-slate-800"
                  >
                    Close Inspector ✕
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <h4 className="text-xs font-mono text-slate-500 uppercase mb-2">Image Evidence</h4>
                    <img src={selectedComplaint.imageUrl} alt={selectedComplaint.title} className="w-full h-44 rounded-xl object-cover border border-slate-200" />
                  </div>

                  <div className="space-y-3 text-xs">
                    <div>
                      <span className="text-slate-500 block font-mono">Location & Ward:</span>
                      <span className="font-bold text-slate-800">Ward {selectedComplaint.ward} - {selectedComplaint.locationName}</span>
                    </div>
                    <div>
                      <span className="text-slate-500 block font-mono">AI Classification Triage:</span>
                      <span className="font-bold text-purple-600 font-mono">{selectedComplaint.department} ({selectedComplaint.aiConfidence}% confidence)</span>
                    </div>
                    <div>
                      <span className="text-slate-500 block font-mono">Current Status:</span>
                      <span className="font-bold text-emerald-600">{selectedComplaint.status}</span>
                    </div>
                  </div>

                  {/* Officer Action Form */}
                  <div className="space-y-4 bg-slate-50 p-4 rounded-2xl border border-slate-200 text-xs">
                    <h4 className="font-mono font-bold text-orange-600">MUNICIPAL DISPATCH CONTROL</h4>

                    <div>
                      <label className="block text-slate-500 font-mono mb-1">Assign Maintenance Officer</label>
                      <input
                        type="text"
                        defaultValue={selectedComplaint.assignedOfficer || 'Officer Rajesh Patil'}
                        id="officerInput"
                        className="w-full p-2 bg-slate-50 border border-slate-700 rounded-lg text-slate-900 font-mono text-xs focus:outline-none focus:border-orange-400"
                      />
                    </div>

                    <div>
                      <label className="block text-slate-500 font-mono mb-1">Update Status Lifecycle</label>
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
                                ? 'bg-orange-500 text-slate-950 font-bold border-orange-400' 
                                : 'bg-slate-50 text-slate-700 border-slate-200 hover:border-orange-500/40'
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
          <div className="p-6 max-w-4xl mx-auto space-y-6">
            <div>
              <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                <Bot className="w-6 h-6 text-purple-600" /> Kopargaon Digital Twin AI Assistant
              </h2>
              <p className="text-xs text-slate-500">Ask natural language queries regarding city telemetry, ward health, and traffic predictions</p>
            </div>

            {/* Pre-configured AI Queries */}
            <div className="flex flex-wrap items-center gap-2 text-xs font-mono">
              <span className="text-slate-500">Suggested Queries:</span>
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
            <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 h-[480px] flex flex-col justify-between">
              <div className="overflow-y-auto space-y-4 pr-2">
                {chatMessages.map((msg, idx) => (
                  <div key={idx} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-xl p-4 rounded-2xl text-xs leading-relaxed ${
                      msg.sender === 'user'
                        ? 'bg-orange-600 text-white font-bold rounded-br-none'
                        : 'bg-slate-50 border border-purple-500/30 text-slate-800 rounded-bl-none font-mono'
                    }`}>
                      {msg.text}
                    </div>
                  </div>
                ))}

                {isAiThinking && (
                  <div className="flex justify-start">
                    <div className="bg-slate-50 border border-purple-500/30 p-3 rounded-2xl text-purple-600 text-xs font-mono flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-purple-400 border-t-transparent rounded-full animate-spin"></div>
                      AI Engine analyzing spatial GIS telemetry...
                    </div>
                  </div>
                )}
              </div>

              {/* Chat Input */}
              <form onSubmit={handleSendCustomChat} className="flex items-center gap-3 pt-4 border-t border-slate-200">
                <input
                  type="text"
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  placeholder="Ask AI Assistant about Kopargaon wards, traffic, or grievances..."
                  className="flex-1 px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-xs font-mono placeholder:text-slate-500 focus:outline-none focus:border-purple-400"
                />
                <button
                  type="submit"
                  className="p-3 rounded-xl bg-purple-600 hover:bg-purple-500 text-slate-950 font-bold transition-all"
                >
                  <Send className="w-4 h-4" />
                </button>
              </form>
            </div>
          </div>
        )}

        {/* TAB 5: ANALYTICS */}
        {activeTab === 'analytics' && (
          <div className="p-6 space-y-6">
            <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
              <BarChart3 className="w-6 h-6 text-orange-600" /> Municipal Operations & Grievance Analytics
            </h2>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Complaints by Ward Chart */}
              <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
                <h3 className="text-sm font-bold text-slate-900 font-mono mb-4">Complaints Density by Ward</h3>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={complaintsByWardData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                      <XAxis dataKey="ward" stroke="#94a3b8" />
                      <YAxis stroke="#94a3b8" />
                      <Tooltip contentStyle={{ background: '#090d16', border: '1px solid #38bdf8' }} />
                      <Bar dataKey="complaints" fill="#00f0ff" radius={[6, 6, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Category Distribution Pie */}
              <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
                <h3 className="text-sm font-bold text-slate-900 font-mono mb-4">Grievance Category Breakdown</h3>
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
                      <Tooltip contentStyle={{ background: '#090d16', border: '1px solid #a855f7' }} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Monthly Resolution Trend */}
              <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm lg:col-span-2">
                <h3 className="text-sm font-bold text-slate-900 font-mono mb-4">Monthly Grievance Resolution Trend</h3>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={monthlyTrendData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                      <XAxis dataKey="month" stroke="#94a3b8" />
                      <YAxis stroke="#94a3b8" />
                      <Tooltip contentStyle={{ background: '#090d16', border: '1px solid #10b981' }} />
                      <Area type="monotone" dataKey="reported" stroke="#38bdf8" fill="#38bdf8" fillOpacity={0.2} />
                      <Area type="monotone" dataKey="resolved" stroke="#10b981" fill="#10b981" fillOpacity={0.4} />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 6: WHAT-IF SIMULATION ENGINE */}
        {activeTab === 'simulation' && (
          <div className="p-6 max-w-5xl mx-auto space-y-6">
            <div>
              <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                <Sliders className="w-6 h-6 text-orange-600" /> What-if Urban Scenario Simulation Engine
              </h2>
              <p className="text-xs text-slate-500">Simulate municipal resource re-allocation and predict city impact in real-time</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* SCENARIO A: GARBAGE TRUCK FLEET */}
              <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm text-slate-800 space-y-4">
                <div className="flex items-center gap-2 text-orange-600 font-mono text-xs font-bold">
                  <Layers className="w-4 h-4" /> SCENARIO A: GARBAGE FLEET
                </div>

                <div>
                  <div className="flex justify-between text-xs font-mono mb-2">
                    <span className="text-slate-500">Active Fleet Trucks:</span>
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

                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2 text-xs font-mono">
                  <div className="text-slate-500 text-[11px] uppercase border-b border-slate-200 pb-1">SIMULATION RESULTS</div>
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
              <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm text-slate-800 space-y-4">
                <div className="flex items-center gap-2 text-purple-600 font-mono text-xs font-bold">
                  <TrendingUp className="w-4 h-4" /> SCENARIO B: ROAD REPAIR
                </div>

                <div>
                  <div className="flex justify-between text-xs font-mono mb-2">
                    <span className="text-slate-500">Budget Allocation:</span>
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

                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2 text-xs font-mono">
                  <div className="text-slate-500 text-[11px] uppercase border-b border-slate-200 pb-1">SIMULATION RESULTS</div>
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
              <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm text-slate-800 space-y-4">
                <div className="flex items-center gap-2 text-emerald-600 font-mono text-xs font-bold">
                  <Zap className="w-4 h-4" /> SCENARIO C: LEAK SENSORS
                </div>

                <div className="flex items-center justify-between py-2 border-b border-slate-200">
                  <span className="text-xs font-mono text-slate-700">IoT Acoustic Leak Grid:</span>
                  <button
                    onClick={() => setSimWaterSensors(!simWaterSensors)}
                    className={`px-3 py-1 rounded-full text-xs font-mono font-bold transition-all ${
                      simWaterSensors ? 'bg-emerald-600 text-white' : 'bg-slate-200 text-slate-600'
                    }`}
                  >
                    {simWaterSensors ? 'ENABLED' : 'DISABLED'}
                  </button>
                </div>

                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2 text-xs font-mono">
                  <div className="text-slate-500 text-[11px] uppercase border-b border-slate-200 pb-1">SIMULATION RESULTS</div>
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
          <div className="p-6 max-w-4xl mx-auto space-y-6">
            <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
              <Bell className="w-6 h-6 text-amber-600" /> Control Room System Audit & Notifications Log
            </h2>

            <div className="space-y-3">
              {cityAlerts.map(alt => (
                <div key={alt.id} className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                  <div className="flex items-center gap-3 text-xs">
                    <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                    <div>
                      <span className="font-bold text-slate-900 block">{alt.title}</span>
                      <span className="text-slate-500">{alt.message}</span>
                    </div>
                  </div>
                  <span className="text-[11px] font-mono text-slate-500">{alt.timestamp}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 8: SETTINGS */}
        {activeTab === 'settings' && (
          <div className="p-6 max-w-3xl mx-auto space-y-6">
            <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
              <Settings className="w-6 h-6 text-slate-500" /> Control Room System Settings
            </h2>

            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4 text-xs">
              <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl">
                <div>
                  <span className="font-bold text-slate-800 block">AI Auto-Triage Threshold</span>
                  <span className="text-slate-500">Minimum confidence required for automatic ticket routing</span>
                </div>
                <span className="font-mono text-orange-600 font-bold">90%</span>
              </div>

              <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl">
                <div>
                  <span className="font-bold text-slate-800 block">GIS Telemetry Refresh Rate</span>
                  <span className="text-slate-500">Frequency of vector node position synchronization</span>
                </div>
                <span className="font-mono text-emerald-600 font-bold">5 SEC</span>
              </div>

              <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl">
                <div>
                  <span className="font-bold text-slate-800 block">Security Protocol</span>
                  <span className="text-slate-500">Encrypted transmission between Municipal Headquarters & Ward Nodes</span>
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
