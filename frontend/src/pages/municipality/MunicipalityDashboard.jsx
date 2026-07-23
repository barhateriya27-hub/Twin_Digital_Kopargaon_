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
  ChevronDown
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
  Line 
} from 'recharts';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { KopargaonMap } from '../../components/KopargaonMap';
import { ThemeToggle } from '../../components/ThemeToggle';

export const MunicipalityDashboard = () => {
  const navigate = useNavigate();
  const { 
    officerUser, 
    complaints = [], 
    cityAlerts = [], 
    logoutOfficer, 
    updateComplaintStatus, 
    assignComplaint, 
    showToast 
  } = useApp();

  const [activeTab, setActiveTab] = useState('dashboard');
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }));

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const [selectedComplaint, setSelectedComplaint] = useState(null);
  const [statusFilter, setStatusFilter] = useState('All');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  // AI Assistant state
  const [chatMessages, setChatMessages] = useState([
    { sender: 'ai', text: 'Municipality AI Assistant is ready. Operational insights will become available once citizen complaint telemetry or IoT data streams arrive.' }
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
  const resolvedCount = complaints.filter(c => c.status === 'Resolved').length;

  const handleLogout = () => {
    logoutOfficer();
    navigate('/');
  };

  const aiQueries = [
    "Check system connection status",
    "How do I ingest real telemetry?",
    "Summarize ward readiness",
    "View database connection logs"
  ];

  const handleAiQuery = (queryText) => {
    setChatMessages(prev => [...prev, { sender: 'user', text: queryText }]);
    setIsAiThinking(true);

    setTimeout(() => {
      let aiResponse = `System Status (${complaints.length} Total Complaints Registered): AI telemetry engine actively monitoring. All tickets auto-classified into department queues.`;
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
      c.locationName.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesCategory && matchesSearch;
  });

  const navGroups = [
    {
      groupTitle: 'Overview',
      items: [
        { id: 'dashboard', label: 'Executive Overview', icon: LayoutDashboard },
      ]
    },
    {
      groupTitle: 'Operations',
      items: [
        { id: 'map', label: 'Digital Twin GIS Map', icon: Map },
        { id: 'complaints', label: 'Complaint Workflow', icon: ClipboardList, badge: complaints.length > 0 ? complaints.length : null },
      ]
    },
    {
      groupTitle: 'Analytics & Intelligence',
      items: [
        { id: 'ai', label: 'AI Operations Assistant', icon: Bot },
        { id: 'analytics', label: 'Municipal Analytics', icon: BarChart3 },
        { id: 'simulation', label: 'What-If Simulation Workspace', icon: Sliders },
      ]
    },
    {
      groupTitle: 'Management',
      items: [
        { id: 'notifications', label: 'System Alerts & Logs', icon: Bell, badge: cityAlerts.length > 0 ? cityAlerts.length : null },
        { id: 'settings', label: 'Control Center Settings', icon: Settings },
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0B0F17] text-slate-900 dark:text-slate-100 flex flex-col font-sans selection:bg-slate-900 selection:text-white">
      
      {/* Top Bar Header */}
      <header className="h-14 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 px-4 flex items-center justify-between sticky top-0 z-30 shadow-xs">
        
        <div className="flex items-center gap-3">
          <button 
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="hidden md:flex p-1.5 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <Menu className="w-5 h-5" />
          </button>

          <button 
            onClick={() => setIsMobileOpen(true)}
            className="md:hidden p-1.5 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <Menu className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-md bg-[#0A2540] dark:bg-slate-800 flex items-center justify-center text-white font-bold text-xs">
              KM
            </div>
            <div>
              <span className="font-bold text-xs tracking-tight text-slate-900 dark:text-slate-100 block leading-tight">
                KOPARGAON MUNICIPAL CORPORATION
              </span>
              <span className="text-[10px] text-slate-500 dark:text-slate-400 block font-medium">
                Smart City Operations Platform
              </span>
            </div>
          </div>
        </div>

        <div className="hidden lg:flex items-center gap-4 flex-1 max-w-md mx-6">
          <div className="relative w-full">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search tickets, wards, department logs..."
              className="w-full pl-9 pr-3 py-1.5 bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-md text-xs text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none"
            />
          </div>
        </div>

        <div className="flex items-center gap-3">
          
          <div className="hidden sm:flex items-center gap-1.5 text-xs text-slate-600 dark:text-slate-400 font-mono px-2.5 py-1 bg-slate-100 dark:bg-slate-800 rounded-md border border-slate-200 dark:border-slate-700">
            <Clock className="w-3.5 h-3.5 text-slate-500" />
            <span>{currentTime}</span>
          </div>

          <button
            onClick={() => setActiveTab('notifications')}
            className="relative p-1.5 rounded-md text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <Bell className="w-4 h-4" />
          </button>

          <ThemeToggle />

          <div className="flex items-center gap-2 pl-2 border-l border-slate-200 dark:border-slate-800">
            <div className="w-7 h-7 rounded-full bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 flex items-center justify-center font-bold text-xs border border-slate-300 dark:border-slate-700">
              {officerUser?.name?.charAt(0) || 'A'}
            </div>
            <div className="hidden xl:block text-left">
              <span className="text-xs font-semibold text-slate-900 dark:text-slate-100 block leading-tight">
                {officerUser?.name || 'Administrator'}
              </span>
              <span className="text-[10px] text-slate-500 dark:text-slate-400 block font-medium">
                {officerUser?.role || 'Municipal Commissioner'}
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

      {/* Main Body */}
      <div className="flex-1 flex overflow-hidden">
        
        {/* Desktop Sidebar */}
        <aside className={`${isCollapsed ? 'w-16' : 'w-60'} bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 transition-all duration-200 hidden md:flex flex-col justify-between shrink-0 select-none`}>
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
                          ? 'bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-slate-100 font-semibold nav-active-indicator'
                          : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/50 hover:text-slate-900'
                      }`}
                    >
                      <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-[#0A2540] dark:text-sky-400' : 'text-slate-500'}`} />
                      {!isCollapsed && <span className="truncate flex-1 text-left">{item.label}</span>}
                      {!isCollapsed && item.badge && (
                        <span className="px-1.5 py-0.2 rounded text-[10px] font-bold bg-[#0A2540] text-white">
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
                <span className="font-medium">System Telemetry:</span>
                <span className="font-semibold text-emerald-600 dark:text-emerald-400">ACTIVE</span>
              </div>
              <p className="text-[10px] text-slate-400 dark:text-slate-500 mt-0.5">Management Mode</p>
            </div>
          )}
        </aside>

        {/* Workspace Area */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 bg-slate-50 dark:bg-[#0B0F17] space-y-6">

          {/* TAB 1: EXECUTIVE OVERVIEW */}
          {activeTab === 'dashboard' && (
            <div className="space-y-6">
              
              <div className="flex flex-wrap items-center justify-between gap-4 pb-2 border-b border-slate-200 dark:border-slate-800">
                <div>
                  <h1 className="text-base sm:text-lg font-bold text-slate-900 dark:text-slate-100 tracking-tight">
                    Executive Operational Overview
                  </h1>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    Municipal service indicators & complaint management dashboard
                  </p>
                </div>
              </div>

              {/* KPI Cards Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                
                <div className="bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800 p-4 shadow-xs">
                  <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 mb-2">
                    <span className="text-xs font-semibold uppercase tracking-wider">Total Complaints</span>
                    <FileText className="w-4 h-4 text-slate-400" />
                  </div>
                  <div className="flex items-baseline justify-between">
                    <span className="text-2xl font-bold text-slate-900 dark:text-slate-100">{totalComplaints}</span>
                    <span className="text-[11px] font-medium text-slate-500">{pendingCount} Pending</span>
                  </div>
                  <div className="mt-3 pt-2 border-t border-slate-100 dark:border-slate-800 text-[11px] text-slate-400 flex justify-between">
                    <span>Critical Tickets:</span>
                    <strong className="text-rose-600 dark:text-rose-400 font-semibold">
                      {complaints.filter(c => c.priority === 'Critical').length}
                    </strong>
                  </div>
                </div>

                <div className="bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800 p-4 shadow-xs">
                  <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 mb-2">
                    <span className="text-xs font-semibold uppercase tracking-wider">Resolved Rate</span>
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  </div>
                  <div className="flex items-baseline justify-between">
                    <span className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                      {totalComplaints > 0 ? `${Math.round((resolvedCount / totalComplaints) * 100)}%` : '—'}
                    </span>
                    <span className="text-[11px] font-medium text-emerald-600 dark:text-emerald-400">{resolvedCount} Closed</span>
                  </div>
                  <div className="mt-3 pt-2 border-t border-slate-100 dark:border-slate-800 text-[11px] text-slate-400 flex justify-between">
                    <span>In Progress:</span>
                    <strong className="text-blue-600 dark:text-blue-400 font-semibold">{inProgressCount}</strong>
                  </div>
                </div>

                <div className="bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800 p-4 shadow-xs">
                  <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 mb-2">
                    <span className="text-xs font-semibold uppercase tracking-wider">Garbage Fleet Status</span>
                    <Activity className="w-4 h-4 text-sky-600" />
                  </div>
                  <div className="flex items-baseline justify-between">
                    <span className="text-2xl font-bold text-slate-900 dark:text-slate-100">Operational</span>
                    <span className="text-[11px] font-medium text-slate-500">28 Wards Ready</span>
                  </div>
                  <div className="mt-3 pt-2 border-t border-slate-100 dark:border-slate-800 text-[11px] text-slate-400 flex justify-between">
                    <span>Sanitation Tickets:</span>
                    <strong className="text-slate-700 dark:text-slate-300 font-semibold">
                      {complaints.filter(c => c.category === 'Garbage').length}
                    </strong>
                  </div>
                </div>

                <div className="bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800 p-4 shadow-xs">
                  <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 mb-2">
                    <span className="text-xs font-semibold uppercase tracking-wider">Infrastructure Index</span>
                    <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  </div>
                  <div className="flex items-baseline justify-between">
                    <span className="text-2xl font-bold text-slate-900 dark:text-slate-100">Ready</span>
                    <span className="text-[11px] font-medium text-emerald-600 dark:text-emerald-400">GIS Telemetry</span>
                  </div>
                  <div className="mt-3 pt-2 border-t border-slate-100 dark:border-slate-800 text-[11px] text-slate-400 flex justify-between">
                    <span>Active Alerts:</span>
                    <strong className="text-slate-700 dark:text-slate-300 font-semibold">{cityAlerts.length}</strong>
                  </div>
                </div>

              </div>

              {/* Central Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                <div className="lg:col-span-2 space-y-3">
                  <KopargaonMap onSelectComplaint={(c) => {
                    setSelectedComplaint(c);
                    setActiveTab('complaints');
                  }} />
                </div>

                <div className="space-y-4">
                  
                  {/* Category Breakdown Chart / Empty State */}
                  <div className="bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800 p-4 shadow-xs">
                    <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-900 dark:text-slate-100 mb-3">
                      Complaints by Category
                    </h3>
                    {complaints.length === 0 ? (
                      <div className="h-52 w-full flex flex-col items-center justify-center p-4 border border-dashed border-slate-200 dark:border-slate-800 rounded-md text-center">
                        <BarChart2 className="w-8 h-8 text-slate-300 dark:text-slate-700 mb-2" />
                        <p className="text-xs font-semibold text-slate-700 dark:text-slate-300">No data available</p>
                        <p className="text-[11px] text-slate-400 mt-0.5">Citizen submissions will appear here once logged.</p>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        {['Garbage', 'Pothole', 'Water Leakage', 'Street Light', 'Traffic'].map(cat => {
                          const count = complaints.filter(c => c.category === cat).length;
                          const pct = totalComplaints > 0 ? Math.round((count / totalComplaints) * 100) : 0;
                          return (
                            <div key={cat} className="space-y-1 text-xs">
                              <div className="flex justify-between text-slate-700 dark:text-slate-300 font-medium">
                                <span>{cat}</span>
                                <span>{count} ({pct}%)</span>
                              </div>
                              <div className="w-full h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                                <div className="h-full bg-[#0A2540] dark:bg-sky-400 rounded-full" style={{ width: `${pct}%` }}></div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>

                  {/* AI Executive Brief */}
                  <div className="bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800 p-4 shadow-xs space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold uppercase tracking-wider text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
                        <Bot className="w-4 h-4 text-slate-400" /> AI Executive Brief
                      </span>
                    </div>

                    <div className="p-3 bg-slate-50 dark:bg-slate-950 rounded-md border border-slate-200 dark:border-slate-800 text-xs text-slate-700 dark:text-slate-300 py-3">
                      {complaints.length === 0 ? (
                        <div className="text-center text-slate-400">
                          <Info className="w-4 h-4 mx-auto mb-1" />
                          <p className="font-medium">No active complaint telemetry</p>
                          <p className="text-[11px] text-slate-400 mt-0.5">Waiting for citizen submissions from the portal.</p>
                        </div>
                      ) : (
                        <p className="leading-relaxed">
                          AI Dispatch Engine: <strong>{totalComplaints} active tickets</strong> registered. {pendingCount} pending assignment. Highest complaint concentration detected in Ward {complaints[0]?.ward || 1}.
                        </p>
                      )}
                    </div>
                  </div>

                </div>

              </div>

              {/* Lower Section: Complaints Table */}
              <div className="bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800 p-4 shadow-xs space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-900 dark:text-slate-100">
                    Citizen Complaints Registered
                  </h3>
                  <button
                    onClick={() => setActiveTab('complaints')}
                    className="text-xs text-blue-600 hover:underline font-semibold"
                  >
                    View All Workflow ({totalComplaints})
                  </button>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-50 dark:bg-slate-950 text-slate-500 dark:text-slate-400 font-semibold border-y border-slate-200 dark:border-slate-800 uppercase tracking-wider text-[10px]">
                      <tr>
                        <th className="py-2.5 px-3">Ticket ID</th>
                        <th className="py-2.5 px-3">Title</th>
                        <th className="py-2.5 px-3">Location / Ward</th>
                        <th className="py-2.5 px-3">Category</th>
                        <th className="py-2.5 px-3">Priority</th>
                        <th className="py-2.5 px-3">Status</th>
                        <th className="py-2.5 px-3 text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {complaints.length === 0 ? (
                        <tr>
                          <td colSpan={7} className="py-8 text-center text-slate-400 text-xs">
                            <Inbox className="w-6 h-6 mx-auto mb-1 text-slate-300 dark:text-slate-700" />
                            <span className="font-medium text-slate-600 dark:text-slate-400 block mb-1">No citizen complaints logged</span>
                            Complaints submitted by citizens will appear here for officer review and management.
                          </td>
                        </tr>
                      ) : (
                        complaints.map((c) => (
                          <tr key={c.id} className="border-b border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/40">
                            <td className="py-2.5 px-3 font-mono font-semibold">{c.id}</td>
                            <td className="py-2.5 px-3 font-semibold">{c.title}</td>
                            <td className="py-2.5 px-3 text-slate-500">{c.locationName} (Ward {c.ward})</td>
                            <td className="py-2.5 px-3">{c.category}</td>
                            <td className="py-2.5 px-3">
                              <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                                c.priority === 'Critical' ? 'bg-rose-100 text-rose-800' :
                                c.priority === 'High' ? 'bg-amber-100 text-amber-800' : 'bg-slate-100 text-slate-800'
                              }`}>
                                {c.priority}
                              </span>
                            </td>
                            <td className="py-2.5 px-3">
                              <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                                c.status === 'Resolved' ? 'bg-emerald-100 text-emerald-800' :
                                c.status === 'In Progress' ? 'bg-blue-100 text-blue-800' : 'bg-slate-100 text-slate-800'
                              }`}>
                                {c.status}
                              </span>
                            </td>
                            <td className="py-2.5 px-3 text-right">
                              <button
                                onClick={() => {
                                  setSelectedComplaint(c);
                                  setActiveTab('complaints');
                                }}
                                className="px-2 py-1 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-300 rounded text-[11px] font-semibold"
                              >
                                Inspect & Manage
                              </button>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

            </div>
          )}

          {/* TAB 2: DIGITAL TWIN GIS MAP */}
          {activeTab === 'map' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
                <div>
                  <h1 className="text-base sm:text-lg font-bold text-slate-900 dark:text-slate-100">
                    Kopargaon Spatial Digital Twin Command Center
                  </h1>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Geospatial ward vectors & incident telemetry feed
                  </p>
                </div>
              </div>

              <KopargaonMap onSelectComplaint={(c) => {
                setSelectedComplaint(c);
                setActiveTab('complaints');
              }} />
            </div>
          )}

          {/* TAB 3: COMPLAINT WORKFLOW & MANAGEMENT */}
          {activeTab === 'complaints' && (
            <div className="space-y-6">
              
              <div className="flex flex-wrap items-center justify-between gap-4 pb-2 border-b border-slate-200 dark:border-slate-800">
                <div>
                  <h1 className="text-base sm:text-lg font-bold text-slate-900 dark:text-slate-100">
                    Municipal Complaint Management Workflow
                  </h1>
                  <p className="text-xs text-slate-500 dark:text-slate-400">Inspect citizen complaint records, assign department maintenance units, and update ticket lifecycle</p>
                </div>
              </div>

              {/* Filters Bar */}
              <div className="bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800 p-4 shadow-xs flex flex-wrap items-center justify-between gap-4">
                <div className="flex flex-wrap items-center gap-4 text-xs">
                  <div className="flex items-center gap-1.5">
                    <Filter className="w-3.5 h-3.5 text-slate-400" />
                    <span className="font-semibold text-slate-700 dark:text-slate-300">Status:</span>
                    <select
                      value={statusFilter}
                      onChange={(e) => setStatusFilter(e.target.value)}
                      className="px-2.5 py-1 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-md text-xs font-medium"
                    >
                      <option value="All">All Statuses</option>
                      <option value="Pending">Pending</option>
                      <option value="In Progress">In Progress</option>
                      <option value="Resolved">Resolved</option>
                    </select>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <span className="font-semibold text-slate-700 dark:text-slate-300">Category:</span>
                    <select
                      value={categoryFilter}
                      onChange={(e) => setCategoryFilter(e.target.value)}
                      className="px-2.5 py-1 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-md text-xs font-medium"
                    >
                      <option value="All">All Categories</option>
                      <option value="Garbage">Sanitation</option>
                      <option value="Pothole">Public Works</option>
                      <option value="Water Leakage">Water Supply</option>
                      <option value="Street Light">Electrical</option>
                      <option value="Traffic">Traffic Cell</option>
                    </select>
                  </div>
                </div>

                <div className="text-xs text-slate-500">
                  Showing <strong>{filteredComplaints.length}</strong> of <strong>{complaints.length}</strong> total tickets
                </div>
              </div>

              {/* Complaints Main Grid: Table & Inspection Drawer */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                {/* Table Column */}
                <div className={`${selectedComplaint ? 'lg:col-span-2' : 'lg:col-span-3'} bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800 p-4 shadow-xs`}>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-slate-50 dark:bg-slate-950 text-slate-500 dark:text-slate-400 font-semibold border-y border-slate-200 dark:border-slate-800 uppercase tracking-wider text-[10px]">
                        <tr>
                          <th className="py-2.5 px-3">Ticket ID</th>
                          <th className="py-2.5 px-3">Title & Location</th>
                          <th className="py-2.5 px-3">Category</th>
                          <th className="py-2.5 px-3">Priority</th>
                          <th className="py-2.5 px-3">Status</th>
                          <th className="py-2.5 px-3 text-right">Inspect</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredComplaints.length === 0 ? (
                          <tr>
                            <td colSpan={6} className="py-12 text-center text-slate-400 text-xs">
                              <Inbox className="w-8 h-8 mx-auto mb-2 text-slate-300 dark:text-slate-700" />
                              <span className="font-semibold text-slate-700 dark:text-slate-300 block text-sm mb-0.5">No complaint records found</span>
                              Citizen submissions from the Citizen Portal will appear here for inspection and management.
                            </td>
                          </tr>
                        ) : (
                          filteredComplaints.map((c) => (
                            <tr
                              key={c.id}
                              onClick={() => setSelectedComplaint(c)}
                              className={`cursor-pointer border-b border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors ${
                                selectedComplaint?.id === c.id ? 'bg-slate-100 dark:bg-slate-800 font-semibold' : ''
                              }`}
                            >
                              <td className="py-3 px-3 font-mono font-semibold text-slate-900 dark:text-slate-100">{c.id}</td>
                              <td className="py-3 px-3">
                                <div className="font-semibold text-slate-900 dark:text-slate-100">{c.title}</div>
                                <div className="text-slate-400 text-[11px]">{c.locationName} (Ward {c.ward})</div>
                              </td>
                              <td className="py-3 px-3">{c.category}</td>
                              <td className="py-3 px-3">
                                <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                                  c.priority === 'Critical' ? 'bg-rose-100 text-rose-800 dark:bg-rose-950/60 dark:text-rose-300' :
                                  c.priority === 'High' ? 'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300' :
                                  'bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-300'
                                }`}>
                                  {c.priority}
                                </span>
                              </td>
                              <td className="py-3 px-3">
                                <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                                  c.status === 'Resolved' ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300' :
                                  c.status === 'In Progress' ? 'bg-blue-100 text-blue-800 dark:bg-blue-950/60 dark:text-blue-300' :
                                  'bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-300'
                                }`}>
                                  {c.status}
                                </span>
                              </td>
                              <td className="py-3 px-3 text-right">
                                <button className="text-blue-600 hover:text-blue-800 dark:hover:text-blue-400 font-semibold text-xs">
                                  Manage
                                </button>
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Complaint Detail Inspection Drawer */}
                {selectedComplaint && (
                  <div className="bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800 p-4 shadow-xs space-y-4">
                    
                    <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                      <div>
                        <span className="font-mono text-xs font-bold text-slate-500">{selectedComplaint.id}</span>
                        <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">{selectedComplaint.title}</h3>
                      </div>
                      <button onClick={() => setSelectedComplaint(null)} className="text-slate-400 hover:text-slate-700">
                        <X className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="space-y-3 text-xs">
                      <div>
                        <span className="text-slate-400 block text-[10px] uppercase font-semibold">Location & Ward:</span>
                        <span className="font-semibold text-slate-900 dark:text-slate-100">{selectedComplaint.locationName} (Ward {selectedComplaint.ward})</span>
                      </div>

                      <div>
                        <span className="text-slate-400 block text-[10px] uppercase font-semibold">Submitted By:</span>
                        <span className="font-medium text-slate-800 dark:text-slate-200">{selectedComplaint.submittedBy || 'Resident Citizen'}</span>
                      </div>

                      <div>
                        <span className="text-slate-400 block text-[10px] uppercase font-semibold">Ticket Description:</span>
                        <p className="p-2.5 bg-slate-50 dark:bg-slate-950 rounded-md border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 mt-1">
                          {selectedComplaint.description || 'No detailed description attached.'}
                        </p>
                      </div>

                      {/* Status Management Buttons */}
                      <div className="pt-2 border-t border-slate-100 dark:border-slate-800 space-y-2">
                        <span className="text-slate-500 block text-[10px] uppercase font-semibold">Update Lifecycle Status:</span>
                        <div className="grid grid-cols-3 gap-2">
                          {['Pending', 'In Progress', 'Resolved'].map((st) => (
                            <button
                              key={st}
                              onClick={() => {
                                updateComplaintStatus(selectedComplaint.id, st);
                                setSelectedComplaint(prev => ({ ...prev, status: st }));
                              }}
                              className={`py-1.5 text-center text-[11px] font-semibold rounded-md border transition-all ${
                                selectedComplaint.status === st
                                  ? 'bg-[#0A2540] text-white border-[#0A2540]'
                                  : 'bg-slate-50 dark:bg-slate-950 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-800'
                              }`}
                            >
                              {st}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Department Assignment */}
                      <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
                        <span className="text-slate-500 block text-[10px] uppercase font-semibold mb-1">Assign Maintenance Team:</span>
                        <select
                          value={selectedComplaint.assignedOfficer || ''}
                          onChange={(e) => {
                            assignComplaint(selectedComplaint.id, e.target.value);
                            setSelectedComplaint(prev => ({ ...prev, assignedOfficer: e.target.value, status: 'Assigned' }));
                          }}
                          className="w-full p-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-md text-xs font-medium focus:outline-none"
                        >
                          <option value="">Select Maintenance Team</option>
                          <option value="Public Works - Team A">Public Works Maintenance - Team A</option>
                          <option value="Sanitation - Fleet B">Sanitation Services - Fleet B</option>
                          <option value="Water Dept - Cell 1">Water Supply & Valves - Cell 1</option>
                          <option value="Electrical Grid Unit">Electrical Grid Maintenance</option>
                          <option value="Traffic Cell">Traffic & Transit Signal Unit</option>
                        </select>
                      </div>

                    </div>

                  </div>
                )}

              </div>

            </div>
          )}

          {/* TAB 4: AI OPERATIONS ASSISTANT */}
          {activeTab === 'ai' && (
            <div className="space-y-6 max-w-4xl mx-auto">
              
              <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
                <div>
                  <h1 className="text-base sm:text-lg font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                    <Bot className="w-5 h-5 text-slate-700 dark:text-slate-300" />
                    AI Operations Assistant & Telemetry Engine
                  </h1>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Predictive city intelligence, emergency recommendations & automated municipal analysis
                  </p>
                </div>
              </div>

              <div className="space-y-2">
                <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">Recommended Queries:</span>
                <div className="flex flex-wrap gap-2">
                  {aiQueries.map((q, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleAiQuery(q)}
                      className="px-3 py-1.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-md text-xs font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100 transition-colors shadow-xs"
                    >
                      {q}
                    </button>
                  ))}
                </div>
              </div>

              <div className="bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800 p-4 min-h-[400px] flex flex-col justify-between shadow-xs">
                <div className="space-y-4 overflow-y-auto max-h-[360px] p-2">
                  {chatMessages.map((msg, idx) => (
                    <div
                      key={idx}
                      className={`flex items-start gap-3 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      {msg.sender === 'ai' && (
                        <div className="w-7 h-7 rounded-md bg-[#0A2540] dark:bg-slate-800 flex items-center justify-center text-white shrink-0 text-xs font-bold">
                          AI
                        </div>
                      )}
                      <div
                        className={`max-w-xl p-3 rounded-lg text-xs leading-relaxed ${
                          msg.sender === 'user'
                            ? 'bg-[#0A2540] text-white'
                            : 'bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200'
                        }`}
                      >
                        {msg.text}
                      </div>
                    </div>
                  ))}
                </div>

                <form onSubmit={handleSendChatMessage} className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex gap-2">
                  <input
                    type="text"
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    placeholder="Ask AI Assistant about telemetry status..."
                    className="flex-1 px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-md text-xs"
                  />
                  <button
                    type="submit"
                    className="px-4 py-2 bg-[#0A2540] hover:bg-slate-800 text-white rounded-md text-xs font-semibold flex items-center gap-1.5"
                  >
                    <Send className="w-3.5 h-3.5" /> Send Query
                  </button>
                </form>
              </div>

            </div>
          )}

          {/* TAB 5: MUNICIPAL ANALYTICS */}
          {activeTab === 'analytics' && (
            <div className="space-y-6">
              
              <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
                <div>
                  <h1 className="text-base sm:text-lg font-bold text-slate-900 dark:text-slate-100">
                    Municipal Operational Analytics
                  </h1>
                  <p className="text-xs text-slate-500 dark:text-slate-400">Ward efficiency & resolution analytics</p>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                
                <div className="bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800 p-4 shadow-xs space-y-3">
                  <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-900 dark:text-slate-100">
                    Complaint Category Analytics
                  </h3>
                  {complaints.length === 0 ? (
                    <div className="h-60 w-full flex flex-col items-center justify-center p-4 border border-dashed border-slate-200 dark:border-slate-800 rounded-md text-center">
                      <BarChart2 className="w-8 h-8 text-slate-300 dark:text-slate-700 mb-2" />
                      <p className="text-xs font-semibold text-slate-700 dark:text-slate-300">No analytics data available</p>
                      <p className="text-[11px] text-slate-400 mt-0.5">Trends will render once citizen complaints are received.</p>
                    </div>
                  ) : (
                    <div className="space-y-3 pt-2">
                      {['Garbage', 'Pothole', 'Water Leakage', 'Street Light', 'Traffic'].map(cat => {
                        const count = complaints.filter(c => c.category === cat).length;
                        return (
                          <div key={cat} className="flex justify-between items-center text-xs p-2 bg-slate-50 dark:bg-slate-950 rounded border border-slate-200 dark:border-slate-800">
                            <span className="font-semibold text-slate-700 dark:text-slate-300">{cat}</span>
                            <span className="font-bold text-slate-900 dark:text-slate-100">{count} Tickets</span>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>

                <div className="bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800 p-4 shadow-xs space-y-3">
                  <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-900 dark:text-slate-100">
                    Ward Efficiency Breakdown
                  </h3>
                  {complaints.length === 0 ? (
                    <div className="h-60 w-full flex flex-col items-center justify-center p-4 border border-dashed border-slate-200 dark:border-slate-800 rounded-md text-center">
                      <BarChart2 className="w-8 h-8 text-slate-300 dark:text-slate-700 mb-2" />
                      <p className="text-xs font-semibold text-slate-700 dark:text-slate-300">No analytics data available</p>
                      <p className="text-[11px] text-slate-400 mt-0.5">Efficiency ratings will compute as tickets are closed.</p>
                    </div>
                  ) : (
                    <div className="space-y-2 pt-2">
                      {Array.from({ length: 5 }, (_, i) => i + 1).map(w => {
                        const count = complaints.filter(c => c.ward === w).length;
                        return (
                          <div key={w} className="flex justify-between items-center text-xs p-2 bg-slate-50 dark:bg-slate-950 rounded border border-slate-200 dark:border-slate-800">
                            <span className="font-semibold">Ward {w}</span>
                            <span className="font-medium text-slate-600">{count} Active Incidents</span>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>

              </div>

            </div>
          )}

          {/* TAB 6: WHAT-IF SIMULATION WORKSPACE */}
          {activeTab === 'simulation' && (
            <div className="space-y-6">
              
              <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
                <div>
                  <h1 className="text-base sm:text-lg font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                    <Sliders className="w-5 h-5 text-slate-700 dark:text-slate-300" />
                    What-If Municipal Resource Simulation Workspace
                  </h1>
                  <p className="text-xs text-slate-500 dark:text-slate-400">Simulate resource allocations and forecast operational outcomes</p>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                <div className="bg-[#FFFFFF] dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800 p-4 shadow-xs space-y-4">
                  <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-900 dark:text-slate-100">
                    Simulation Control Parameters
                  </h3>

                  <div className="space-y-2">
                    <label className="text-xs font-medium text-slate-700 dark:text-slate-300 flex justify-between">
                      <span>Garbage Collection Fleet:</span>
                      <strong className="text-slate-900 dark:text-slate-100">{simGarbageTrucks} Vehicles</strong>
                    </label>
                    <input
                      type="range"
                      min="2"
                      max="15"
                      value={simGarbageTrucks}
                      onChange={(e) => {
                        setSimGarbageTrucks(Number(e.target.value));
                        setHasRunSim(true);
                      }}
                      className="w-full accent-[#0A2540]"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-medium text-slate-700 dark:text-slate-300 flex justify-between">
                      <span>Road Repair Allocation:</span>
                      <strong className="text-slate-900 dark:text-slate-100">₹ {simRoadBudget} Lakhs</strong>
                    </label>
                    <input
                      type="range"
                      min="10"
                      max="200"
                      step="10"
                      value={simRoadBudget}
                      onChange={(e) => {
                        setSimRoadBudget(Number(e.target.value));
                        setHasRunSim(true);
                      }}
                      className="w-full accent-[#0A2540]"
                    />
                  </div>
                </div>

                <div className="lg:col-span-2 bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800 p-4 shadow-xs space-y-4">
                  <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-900 dark:text-slate-100">
                    Predicted Outcome Model
                  </h3>

                  {!hasRunSim ? (
                    <div className="p-8 text-center border border-dashed border-slate-200 dark:border-slate-800 rounded-md text-slate-400 text-xs">
                      <SlidersHorizontal className="w-8 h-8 mx-auto mb-2 text-slate-300 dark:text-slate-700" />
                      <p className="font-semibold text-slate-700 dark:text-slate-300">No simulation results</p>
                      <p className="text-[11px] text-slate-400 mt-0.5">Adjust control parameters to simulate resource impact.</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="p-3 bg-slate-50 dark:bg-slate-950 rounded-md border border-slate-200 dark:border-slate-800">
                          <span className="text-[11px] text-slate-500 block">Sanitation Estimate:</span>
                          <strong className="text-lg text-slate-900 dark:text-slate-100 font-bold">{simGarbageTrucks * 8}% Coverage</strong>
                        </div>
                        <div className="p-3 bg-slate-50 dark:bg-slate-950 rounded-md border border-slate-200 dark:border-slate-800">
                          <span className="text-[11px] text-slate-500 block">Road Repair Target:</span>
                          <strong className="text-lg text-slate-900 dark:text-slate-100 font-bold">₹ {simRoadBudget} L Allocated</strong>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

              </div>

            </div>
          )}

          {/* TAB 7: NOTIFICATIONS & LOGS */}
          {activeTab === 'notifications' && (
            <div className="space-y-4 max-w-4xl mx-auto">
              <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
                <div>
                  <h1 className="text-base sm:text-lg font-bold text-slate-900 dark:text-slate-100">
                    System Alerts & Audit Log Center
                  </h1>
                  <p className="text-xs text-slate-500 dark:text-slate-400">System warnings & log stream</p>
                </div>
              </div>

              {cityAlerts.length === 0 ? (
                <div className="p-12 text-center bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800 text-slate-400 text-xs">
                  <Bell className="w-8 h-8 mx-auto mb-2 text-slate-300 dark:text-slate-700" />
                  <p className="font-semibold text-slate-700 dark:text-slate-300">No notifications available</p>
                  <p className="text-[11px] text-slate-400 mt-0.5">Active system alerts will be displayed here.</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {cityAlerts.map((alert) => (
                    <div key={alert.id} className="p-3 bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800 text-xs flex items-center justify-between">
                      <span>{alert.title}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 8: SETTINGS */}
          {activeTab === 'settings' && (
            <div className="space-y-4 max-w-3xl mx-auto">
              <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
                <div>
                  <h1 className="text-base sm:text-lg font-bold text-slate-900 dark:text-slate-100">
                    Control Center Configuration
                  </h1>
                  <p className="text-xs text-slate-500 dark:text-slate-400">Manage portal administrative preferences</p>
                </div>
              </div>

              <div className="bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800 p-4 shadow-xs space-y-4 text-xs">
                <div>
                  <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">Municipal Corporation Title</label>
                  <input
                    type="text"
                    defaultValue="Kopargaon Municipal Corporation"
                    className="w-full p-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-md font-medium"
                  />
                </div>

                <div className="pt-2">
                  <button
                    onClick={() => showToast('Configuration saved', 'success')}
                    className="px-4 py-2 bg-[#0A2540] text-white font-semibold rounded-md hover:bg-slate-800"
                  >
                    Save Configuration
                  </button>
                </div>
              </div>
            </div>
          )}

        </main>

      </div>

    </div>
  );
};
