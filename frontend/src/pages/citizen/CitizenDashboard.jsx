import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
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
  ArrowUpRight
} from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { ThemeToggle } from '../../components/ThemeToggle';

export const CitizenDashboard = () => {
  const navigate = useNavigate();
  const { citizenUser, complaints, cityAlerts, addComplaint, logoutCitizen, showToast } = useApp();

  const [activeTab, setActiveTab] = useState('overview'); // 'overview' | 'report' | 'track' | 'alerts' | 'profile'
  const [selectedComplaint, setSelectedComplaint] = useState(null);

  // Form state
  const [reportTitle, setReportTitle] = useState('');
  const [reportCategory, setReportCategory] = useState('Garbage');
  const [reportWard, setReportWard] = useState(citizenUser?.ward || 4);
  const [reportLocation, setReportLocation] = useState('');
  const [reportDescription, setReportDescription] = useState('');
  const [reportImage, setReportImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Filter complaints for citizen
  const userComplaints = complaints;

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

  const statusSteps = ['Pending', 'Assigned', 'In Progress', 'Resolved'];

  const getStepIndex = (status) => {
    return statusSteps.indexOf(status);
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-200 flex flex-col font-sans selection:bg-[#F97316] selection:text-white">
      {/* Tricolor Ribbon */}
      <div className="h-[4px] w-full flex shrink-0">
        <div className="h-full w-1/3 bg-[#FF9933]"></div>
        <div className="h-full w-1/3 bg-white dark:bg-slate-800"></div>
        <div className="h-full w-1/3 bg-[#138808]"></div>
      </div>

      {/* TOP NAVBAR */}
      <header className="bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 sticky top-0 z-30 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-[#F97316] flex items-center justify-center text-white shadow-md shadow-orange-500/20">
              <Building2 className="w-6 h-6" />
            </div>
            <div>
              <span className="font-extrabold text-lg text-slate-900 dark:text-slate-100 block leading-tight">
                कोपरगाव <span className="text-orange-600">नागरी तक्रार निवारण</span>
              </span>
              <span className="text-[10px] sm:text-xs text-slate-500 dark:text-slate-400 font-semibold block">
                Kopargaon Citizen Hub • Ward {citizenUser?.ward || 4}
              </span>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center gap-1 bg-slate-100 dark:bg-slate-900/50/80 p-1.5 rounded-xl border border-slate-200 dark:border-slate-700">
            <button
              onClick={() => setActiveTab('overview')}
              className={`px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-2 ${
                activeTab === 'overview' ? 'bg-white dark:bg-slate-800 text-orange-600 shadow-sm' : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:text-slate-100'
              }`}
            >
              <Home className="w-4 h-4" /> Home
            </button>
            <button
              onClick={() => setActiveTab('report')}
              className={`px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-2 ${
                activeTab === 'report' ? 'bg-white dark:bg-slate-800 text-orange-600 shadow-sm' : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:text-slate-100'
              }`}
            >
              <PlusCircle className="w-4 h-4 text-emerald-600" /> Report Complaint
            </button>
            <button
              onClick={() => setActiveTab('track')}
              className={`px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-2 ${
                activeTab === 'track' ? 'bg-white dark:bg-slate-800 text-orange-600 shadow-sm' : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:text-slate-100'
              }`}
            >
              <ClipboardList className="w-4 h-4" /> Track Complaints
            </button>
            <button
              onClick={() => setActiveTab('alerts')}
              className={`px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-2 ${
                activeTab === 'alerts' ? 'bg-white dark:bg-slate-800 text-orange-600 shadow-sm' : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:text-slate-100'
              }`}
            >
              <Bell className="w-4 h-4 text-amber-500" /> City Alerts
            </button>
            <button
              onClick={() => setActiveTab('profile')}
              className={`px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-2 ${
                activeTab === 'profile' ? 'bg-white dark:bg-slate-800 text-orange-600 shadow-sm' : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:text-slate-100'
              }`}
            >
              <User className="w-4 h-4" /> Profile
            </button>
          </nav>

          {/* User Profile & Logout */}
          <div className="flex items-center gap-3">
            <ThemeToggle />
            <div className="hidden sm:block text-right">
              <span className="text-sm font-bold text-slate-900 dark:text-slate-100 block">{citizenUser?.name || 'Resident Citizen'}</span>
              <span className="text-[11px] text-emerald-600 font-semibold block">● Account Active</span>
            </div>
            <button
              onClick={handleLogout}
              className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:text-rose-600 hover:border-rose-200 bg-white dark:bg-slate-800 hover:bg-rose-50 dark:hover:bg-rose-950/20 transition-all flex items-center gap-1.5 text-xs font-semibold"
              title="Logout"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </div>

        {/* Mobile Tab Bar */}
        <div className="md:hidden flex items-center justify-around border-t border-slate-200 dark:border-slate-700 py-2 bg-slate-50 dark:bg-slate-900 text-xs font-semibold">
          <button onClick={() => setActiveTab('overview')} className={`flex flex-col items-center gap-1 ${activeTab === 'overview' ? 'text-orange-600' : 'text-slate-500 dark:text-slate-400'}`}>
            <Home className="w-4 h-4" /> Home
          </button>
          <button onClick={() => setActiveTab('report')} className={`flex flex-col items-center gap-1 ${activeTab === 'report' ? 'text-orange-600' : 'text-slate-500 dark:text-slate-400'}`}>
            <PlusCircle className="w-4 h-4" /> Report
          </button>
          <button onClick={() => setActiveTab('track')} className={`flex flex-col items-center gap-1 ${activeTab === 'track' ? 'text-orange-600' : 'text-slate-500 dark:text-slate-400'}`}>
            <ClipboardList className="w-4 h-4" /> Track
          </button>
          <button onClick={() => setActiveTab('alerts')} className={`flex flex-col items-center gap-1 ${activeTab === 'alerts' ? 'text-orange-600' : 'text-slate-500 dark:text-slate-400'}`}>
            <Bell className="w-4 h-4" /> Alerts
          </button>
        </div>
      </header>

      {/* BODY CONTENT */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* TAB 1: OVERVIEW */}
        {activeTab === 'overview' && (
          <div className="space-y-8">
            {/* Welcome Banner */}
            <div className="bg-gradient-to-r from-[#002B49] via-slate-900 to-orange-950 rounded-3xl p-8 text-white shadow-xl shadow-orange-500/15 relative overflow-hidden">
              <div className="relative z-10 max-w-2xl">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white dark:bg-slate-800/20 text-white text-xs font-mono mb-4 backdrop-blur-md">
                  <Sparkles className="w-3.5 h-3.5" /> SMART CITY CITIZEN DASHBOARD
                </span>
                <h1 className="text-3xl font-extrabold mb-2">
                  Welcome back, {citizenUser?.name || 'Resident'}!
                </h1>
                <p className="text-orange-100 text-sm leading-relaxed mb-6">
                  You are connected to Kopargaon Ward {citizenUser?.ward || 4} Digital Support Node. Submit civic issues and monitor live municipal resolutions.
                </p>

                <div className="flex flex-wrap items-center gap-4">
                  <button
                    onClick={() => setActiveTab('report')}
                    className="px-6 py-3 bg-white dark:bg-slate-800 text-orange-700 font-bold rounded-xl shadow-lg hover:bg-orange-50 dark:bg-orange-950/20 transition-all flex items-center gap-2 text-sm"
                  >
                    <PlusCircle className="w-5 h-5 text-orange-600" />
                    Report New Complaint
                  </button>
                  <button
                    onClick={() => setActiveTab('track')}
                    className="px-6 py-3 bg-orange-700/60 hover:bg-orange-700/80 text-white font-bold rounded-xl border border-white/20 backdrop-blur-md transition-all flex items-center gap-2 text-sm"
                  >
                    <ClipboardList className="w-5 h-5" />
                    View History ({userComplaints.length})
                  </button>
                </div>
              </div>
            </div>

            {/* QUICK DASHBOARD CARDS */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <div 
                onClick={() => setActiveTab('report')}
                className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700/90 shadow-sm hover:shadow-md transition-all cursor-pointer group"
              >
                <div className="w-12 h-12 rounded-xl bg-orange-50 dark:bg-orange-950/20 border border-orange-100 dark:border-orange-900/30 flex items-center justify-center text-orange-600 mb-4 group-hover:scale-110 transition-transform">
                  <PlusCircle className="w-6 h-6" />
                </div>
                <h3 className="font-bold text-slate-900 dark:text-slate-100 text-lg mb-1 flex items-center justify-between">
                  Report Complaint <ArrowUpRight className="w-4 h-4 text-slate-400 group-hover:text-orange-600 group-hover:translate-x-0.5 transition-all" />
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">File potholes, garbage, water leaks, lighting or traffic</p>
              </div>

              <div 
                onClick={() => setActiveTab('track')}
                className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700/90 shadow-sm hover:shadow-md transition-all cursor-pointer group"
              >
                <div className="w-12 h-12 rounded-xl bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-100 dark:border-emerald-900/30 flex items-center justify-center text-emerald-600 mb-4 group-hover:scale-110 transition-transform">
                  <ClipboardList className="w-6 h-6" />
                </div>
                <h3 className="font-bold text-slate-900 dark:text-slate-100 text-lg mb-1 flex items-center justify-between">
                  Complaint History <ArrowUpRight className="w-4 h-4 text-slate-400 group-hover:text-emerald-600 group-hover:translate-x-0.5 transition-all" />
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">{userComplaints.length} Total grievances submitted</p>
              </div>

              <div 
                onClick={() => setActiveTab('alerts')}
                className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700/90 shadow-sm hover:shadow-md transition-all cursor-pointer group"
              >
                <div className="w-12 h-12 rounded-xl bg-amber-50 dark:bg-amber-950/20 border border-amber-100 dark:border-amber-900/30 flex items-center justify-center text-amber-600 mb-4 group-hover:scale-110 transition-transform">
                  <Bell className="w-6 h-6" />
                </div>
                <h3 className="font-bold text-slate-900 dark:text-slate-100 text-lg mb-1 flex items-center justify-between">
                  City Alerts <ArrowUpRight className="w-4 h-4 text-slate-400 group-hover:text-amber-600 group-hover:translate-x-0.5 transition-all" />
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">{cityAlerts.length} Active municipal announcements</p>
              </div>

              <div 
                onClick={() => setActiveTab('profile')}
                className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700/90 shadow-sm hover:shadow-md transition-all cursor-pointer group"
              >
                <div className="w-12 h-12 rounded-xl bg-purple-50 dark:bg-purple-950/20 border border-purple-100 dark:border-purple-900/30 flex items-center justify-center text-purple-600 mb-4 group-hover:scale-110 transition-transform">
                  <User className="w-6 h-6" />
                </div>
                <h3 className="font-bold text-slate-900 dark:text-slate-100 text-lg mb-1 flex items-center justify-between">
                  Citizen Profile <ArrowUpRight className="w-4 h-4 text-slate-400 group-hover:text-purple-600 group-hover:translate-x-0.5 transition-all" />
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">Manage ward info & notification preferences</p>
              </div>
            </div>

            {/* RECENT COMPLAINTS OVERVIEW */}
            <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-700/90 shadow-sm">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">Recent Grievance Submissions</h2>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Live tracking updates from Kopargaon Municipal Control Room</p>
                </div>
                <button
                  onClick={() => setActiveTab('track')}
                  className="text-xs font-bold text-orange-600 hover:underline flex items-center gap-1"
                >
                  View All ({userComplaints.length}) <ChevronRight className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-4">
                {userComplaints.slice(0, 3).map((item) => (
                  <div
                    key={item.id}
                    onClick={() => {
                      setSelectedComplaint(item);
                      setActiveTab('track');
                    }}
                    className="p-4 rounded-2xl border border-slate-100 dark:border-slate-800 hover:border-orange-200 bg-slate-50 dark:bg-slate-900/50 hover:bg-orange-50 dark:bg-orange-950/20/30 transition-all cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                  >
                    <div className="flex items-start gap-4">
                      <img
                        src={item.imageUrl}
                        alt={item.title}
                        className="w-16 h-16 rounded-xl object-cover border border-slate-200 dark:border-slate-700 shrink-0"
                      />
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-mono text-xs font-bold text-orange-700 bg-orange-100 px-2 py-0.5 rounded">
                            {item.id}
                          </span>
                          <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                            • Ward {item.ward}
                          </span>
                        </div>
                        <h4 className="font-bold text-slate-900 dark:text-slate-100 text-sm line-clamp-1">{item.title}</h4>
                        <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-1 mt-0.5">{item.description}</p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between sm:justify-end gap-3 border-t sm:border-t-0 pt-2 sm:pt-0 border-slate-200 dark:border-slate-700">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                        item.status === 'Resolved' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400' :
                        item.status === 'In Progress' ? 'bg-blue-100 text-blue-700 dark:bg-blue-950/40 dark:text-blue-400' :
                        item.status === 'Assigned' ? 'bg-purple-100 text-purple-700 dark:bg-purple-950/40 dark:text-purple-400' : 'bg-amber-100 text-amber-700 dark:bg-amber-950/40 dark:text-amber-400'
                      }`}>
                        {item.status}
                      </span>
                      <ChevronRight className="w-5 h-5 text-slate-400" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: REPORT COMPLAINT */}
        {activeTab === 'report' && (
          <div className="max-w-3xl mx-auto">
            <div className="bg-white dark:bg-slate-800 rounded-3xl p-8 border border-slate-200 dark:border-slate-700/90 shadow-lg shadow-slate-200/40">
              <div className="flex items-center gap-3 mb-6 pb-6 border-b border-slate-100 dark:border-slate-800">
                <div className="w-12 h-12 rounded-2xl bg-orange-50 dark:bg-orange-950/20 border border-orange-100 dark:border-orange-900/30 flex items-center justify-center text-orange-600">
                  <PlusCircle className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Report City Complaint</h2>
                  <p className="text-xs text-slate-500 dark:text-slate-400">AI auto-classifies your report and routes it to the designated officer</p>
                </div>
              </div>

              <form onSubmit={handleReportSubmit} className="space-y-6">
                {/* Category Selection */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
                    Issue Category
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                    {[
                      { value: 'Garbage', label: 'Solid Waste / घनकचरा' },
                      { value: 'Pothole', label: 'Road Pothole / खड्डे' },
                      { value: 'Water Leakage', label: 'Water Leakage / पाणी गळती' },
                      { value: 'Street Light', label: 'Street Lights / पथदिवे' },
                      { value: 'Traffic', label: 'Traffic / रहदारी' }
                    ].map(cat => (
                      <button
                        type="button"
                        key={cat.value}
                        onClick={() => setReportCategory(cat.value)}
                        className={`p-3 rounded-xl border text-xs font-bold transition-all text-center flex flex-col justify-center items-center h-16 ${
                          reportCategory === cat.value 
                            ? 'bg-orange-600 text-white border-orange-600 shadow-md shadow-orange-600/20' 
                            : 'bg-slate-50 dark:bg-slate-900 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:bg-slate-900/50'
                        }`}
                      >
                        {cat.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Complaint Title */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
                    Complaint Title *
                  </label>
                  <input
                    type="text"
                    value={reportTitle}
                    onChange={(e) => setReportTitle(e.target.value)}
                    placeholder="e.g. Deep pothole on Station Road near Market"
                    className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:bg-white dark:focus:bg-slate-800 dark:bg-slate-800 text-sm"
                    required
                  />
                </div>

                {/* Ward & Location */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
                      Select Ward Number
                    </label>
                    <select
                      value={reportWard}
                      onChange={(e) => setReportWard(e.target.value)}
                      className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:bg-white dark:focus:bg-slate-800 dark:bg-slate-800"
                    >
                      {Array.from({ length: 28 }, (_, i) => i + 1).map(w => (
                        <option key={w} value={w}>Ward {w} (Kopargaon)</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
                      Specific Landmark / Address
                    </label>
                    <input
                      type="text"
                      value={reportLocation}
                      onChange={(e) => setReportLocation(e.target.value)}
                      placeholder="e.g. Near Municipal High School"
                      className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:bg-white dark:focus:bg-slate-800 dark:bg-slate-800 text-sm"
                    />
                  </div>
                </div>

                {/* Description */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
                    Detailed Description *
                  </label>
                  <textarea
                    rows={4}
                    value={reportDescription}
                    onChange={(e) => setReportDescription(e.target.value)}
                    placeholder="Describe the issue in detail to assist municipal maintenance crews..."
                    className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:bg-white dark:focus:bg-slate-800 dark:bg-slate-800 text-sm"
                    required
                  />
                </div>

                {/* Image Upload */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
                    Upload Photo Evidence (Optional)
                  </label>
                  <div className="border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-2xl p-6 text-center hover:border-sky-400 transition-colors bg-slate-50 dark:bg-slate-900/50">
                    {imagePreview ? (
                      <div className="relative inline-block">
                        <img src={imagePreview} alt="Upload preview" className="h-40 rounded-xl object-cover border border-slate-200 dark:border-slate-700" />
                        <button
                          type="button"
                          onClick={() => { setReportImage(null); setImagePreview(null); }}
                          className="absolute -top-2 -right-2 bg-rose-600 text-white rounded-full p-1 text-xs shadow-md"
                        >
                          ✕
                        </button>
                      </div>
                    ) : (
                      <label className="cursor-pointer flex flex-col items-center">
                        <Upload className="w-8 h-8 text-orange-500 mb-2" />
                        <span className="text-sm font-bold text-slate-700 dark:text-slate-300">Click to upload photo</span>
                        <span className="text-xs text-slate-400 mt-1">Supports JPG, PNG (Max 5MB)</span>
                        <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
                      </label>
                    )}
                  </div>
                </div>

                <div className="pt-4">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-4 px-6 bg-gradient-to-r from-orange-600 to-emerald-600 hover:from-orange-500 hover:to-emerald-500 text-white font-bold rounded-xl shadow-lg shadow-orange-600/25 transition-all flex items-center justify-center gap-2 text-base"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        AI Triage Classifier Running...
                      </>
                    ) : (
                      <>
                        <CheckCircle2 className="w-5 h-5" />
                        Submit Grievance to Municipal Digital Twin
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* TAB 3: TRACK COMPLAINTS & HISTORY */}
        {activeTab === 'track' && (
          <div className="space-y-8">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Grievance Tracking & History</h2>
                <p className="text-xs text-slate-500 dark:text-slate-400">Live status synchronization with Kopargaon Control Room</p>
              </div>
              <button
                onClick={() => setActiveTab('report')}
                className="px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white text-xs font-bold rounded-xl shadow-sm transition-all flex items-center gap-1.5"
              >
                <PlusCircle className="w-4 h-4" /> New Complaint
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Complaint List Column */}
              <div className="space-y-4">
                {userComplaints.map((c) => (
                  <div
                    key={c.id}
                    onClick={() => setSelectedComplaint(c)}
                    className={`p-5 rounded-2xl border transition-all cursor-pointer ${
                      selectedComplaint?.id === c.id
                        ? 'bg-orange-50 dark:bg-orange-950/20 border-sky-400 shadow-md'
                        : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700/90 hover:border-sky-300 shadow-sm'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-mono text-xs font-bold text-orange-700 bg-orange-100 px-2.5 py-1 rounded-md">
                        {c.id}
                      </span>
                      <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
                        c.status === 'Resolved' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400' :
                        c.status === 'In Progress' ? 'bg-blue-100 text-blue-700 dark:bg-blue-950/40 dark:text-blue-400' :
                        c.status === 'Assigned' ? 'bg-purple-100 text-purple-700 dark:bg-purple-950/40 dark:text-purple-400' : 'bg-amber-100 text-amber-700 dark:bg-amber-950/40 dark:text-amber-400'
                      }`}>
                        {c.status}
                      </span>
                    </div>

                    <h4 className="font-bold text-slate-900 dark:text-slate-100 text-sm mb-1">{c.title}</h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1 mb-3">
                      <MapPin className="w-3.5 h-3.5 text-slate-400" /> {c.locationName}
                    </p>

                    <div className="flex items-center justify-between text-[11px] text-slate-400 pt-3 border-t border-slate-100 dark:border-slate-800 font-mono">
                      <span>{c.category}</span>
                      <span>Ward {c.ward}</span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Detail & Status Stepper View */}
              <div className="lg:col-span-2">
                {selectedComplaint ? (
                  <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-700/90 shadow-sm">
                    <div className="flex flex-wrap items-center justify-between gap-4 mb-6 pb-6 border-b border-slate-100 dark:border-slate-800">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-mono text-sm font-bold text-orange-700 bg-orange-100 px-3 py-1 rounded-lg">
                            {selectedComplaint.id}
                          </span>
                          <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                            Submitted on {new Date(selectedComplaint.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                        <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">{selectedComplaint.title}</h2>
                      </div>
                      <span className={`px-4 py-1.5 rounded-full text-xs font-bold ${
                        selectedComplaint.status === 'Resolved' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400' :
                        selectedComplaint.status === 'In Progress' ? 'bg-blue-100 text-blue-700 dark:bg-blue-950/40 dark:text-blue-400' :
                        selectedComplaint.status === 'Assigned' ? 'bg-purple-100 text-purple-700 dark:bg-purple-950/40 dark:text-purple-400' : 'bg-amber-100 text-amber-700 dark:bg-amber-950/40 dark:text-amber-400'
                      }`}>
                        {selectedComplaint.status}
                      </span>
                    </div>

                    {/* VISUAL STEPPER LINE */}
                    <div className="mb-8 bg-slate-50 dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-700/80">
                      <h4 className="text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-6">
                        Resolution Progress Lifecycle
                      </h4>
                      <div className="relative flex items-center justify-between">
                        {/* Connecting Line */}
                        <div className="absolute top-1/2 left-0 right-0 h-1 bg-slate-200 -translate-y-1/2 z-0"></div>
                        <div 
                          className="absolute top-1/2 left-0 h-1 bg-gradient-to-r from-orange-500 to-emerald-500 -translate-y-1/2 z-0 transition-all duration-500"
                          style={{
                            width: `${(getStepIndex(selectedComplaint.status) / (statusSteps.length - 1)) * 100}%`
                          }}
                        ></div>

                        {statusSteps.map((step, idx) => {
                          const isCompleted = getStepIndex(selectedComplaint.status) >= idx;
                          const isCurrent = selectedComplaint.status === step;
                          return (
                            <div key={step} className="relative z-10 flex flex-col items-center">
                              <div className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs transition-all ${
                                isCompleted 
                                  ? 'bg-emerald-600 text-white ring-4 ring-emerald-100 shadow-md' 
                                  : 'bg-white dark:bg-slate-800 border-2 border-slate-300 dark:border-slate-600 text-slate-400'
                              }`}>
                                {isCompleted ? <CheckCircle2 className="w-5 h-5" /> : idx + 1}
                              </div>
                              <span className={`text-xs font-bold mt-2 ${isCurrent ? 'text-orange-600 font-extrabold' : isCompleted ? 'text-slate-800 dark:text-slate-200' : 'text-slate-400'}`}>
                                {step}
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* Issue Image & Details */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                      <div>
                        <h4 className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">Photo Evidence</h4>
                        <img
                          src={selectedComplaint.imageUrl}
                          alt={selectedComplaint.title}
                          className="w-full h-48 rounded-2xl object-cover border border-slate-200 dark:border-slate-700 shadow-sm"
                        />
                      </div>

                      <div className="space-y-4">
                        <div>
                          <h4 className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">Location</h4>
                          <p className="text-sm font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1">
                            <MapPin className="w-4 h-4 text-orange-600" /> {selectedComplaint.locationName}
                          </p>
                        </div>

                        <div>
                          <h4 className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">Department Assigned</h4>
                          <p className="text-sm font-bold text-slate-800 dark:text-slate-200">{selectedComplaint.department}</p>
                        </div>

                        <div>
                          <h4 className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">Assigned Maintenance Officer</h4>
                          <p className="text-sm font-bold text-slate-800 dark:text-slate-200">
                            {selectedComplaint.assignedOfficer || 'Pending Officer Assignment'}
                          </p>
                        </div>

                        <div>
                          <h4 className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">AI Classification Confidence</h4>
                          <p className="text-sm font-bold text-emerald-600 font-mono">
                            {selectedComplaint.aiConfidence}% Verified Triage
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Timeline Audit Log */}
                    <div>
                      <h4 className="text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-4">
                        Municipal Action Timeline
                      </h4>
                      <div className="space-y-3">
                        {selectedComplaint.timeline?.map((t, i) => (
                          <div key={i} className="p-3.5 bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-100 dark:border-slate-800 flex items-start gap-3 text-xs">
                            <Clock className="w-4 h-4 text-orange-600 shrink-0 mt-0.5" />
                            <div className="flex-1">
                              <div className="flex items-center justify-between font-bold text-slate-800 dark:text-slate-200 mb-0.5">
                                <span>Status: {t.status}</span>
                                <span className="text-slate-400 font-mono text-[11px]">{new Date(t.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                              </div>
                              <p className="text-slate-600 dark:text-slate-300">{t.note}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="bg-white dark:bg-slate-800 rounded-3xl p-12 text-center border border-slate-200 dark:border-slate-700 text-slate-400">
                    <ClipboardList className="w-12 h-12 mx-auto mb-3 text-slate-300" />
                    <p className="font-bold text-slate-600 dark:text-slate-300">Select a complaint from the list to view live tracking details.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: CITY ALERTS */}
        {activeTab === 'alerts' && (
          <div className="max-w-4xl mx-auto space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Municipal City Alerts</h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">Official notifications from Kopargaon Municipal Corporation Control Room</p>
            </div>

            <div className="space-y-4">
              {cityAlerts.map(alert => (
                <div key={alert.id} className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700/90 shadow-sm flex items-start gap-4">
                  <div className={`p-3 rounded-xl shrink-0 ${
                    alert.type === 'critical' ? 'bg-rose-100 text-rose-600' :
                    alert.type === 'warning' ? 'bg-amber-100 text-amber-600 dark:bg-amber-950/40 dark:text-amber-400' : 'bg-orange-100 text-orange-600 dark:bg-orange-950/40 dark:text-orange-400'
                  }`}>
                    <AlertTriangle className="w-6 h-6" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <h3 className="font-bold text-slate-900 dark:text-slate-100 text-base">{alert.title}</h3>
                      <span className="text-xs font-mono text-slate-400">{alert.timestamp}</span>
                    </div>
                    <p className="text-sm text-slate-600 dark:text-slate-300 mb-3">{alert.message}</p>
                    <span className="text-xs font-bold text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-900/50 px-3 py-1 rounded-full">
                      Affected Area: {alert.ward}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 5: PROFILE */}
        {activeTab === 'profile' && (
          <div className="max-w-2xl mx-auto">
            <div className="bg-white dark:bg-slate-800 rounded-3xl p-8 border border-slate-200 dark:border-slate-700/90 shadow-sm">
              <div className="flex items-center gap-4 mb-8 pb-6 border-b border-slate-100 dark:border-slate-800">
                <div className="w-16 h-16 rounded-full bg-orange-600 text-white font-bold text-2xl flex items-center justify-center shadow-lg shadow-orange-600/25">
                  {citizenUser?.name?.charAt(0) || 'C'}
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">{citizenUser?.name || 'Resident Citizen'}</h2>
                  <p className="text-xs font-mono text-emerald-600 font-semibold">Registered Citizen • Kopargaon Smart Portal</p>
                </div>
              </div>

              <div className="space-y-4 text-sm">
                <div className="p-4 bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-100 dark:border-slate-800">
                  <span className="text-xs text-slate-400 block uppercase font-mono mb-0.5">Email Address</span>
                  <span className="font-bold text-slate-800 dark:text-slate-200">{citizenUser?.email || 'citizen@kopargaon.gov.in'}</span>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-100 dark:border-slate-800">
                  <span className="text-xs text-slate-400 block uppercase font-mono mb-0.5">Mobile Number</span>
                  <span className="font-bold text-slate-800 dark:text-slate-200">{citizenUser?.phone || '+91 98220 12345'}</span>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-100 dark:border-slate-800">
                  <span className="text-xs text-slate-400 block uppercase font-mono mb-0.5">Assigned Ward</span>
                  <span className="font-bold text-slate-800 dark:text-slate-200">Ward {citizenUser?.ward || 4} (Kopargaon North)</span>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-100 dark:border-slate-800">
                  <span className="text-xs text-slate-400 block uppercase font-mono mb-0.5">Registered Address</span>
                  <span className="font-bold text-slate-800 dark:text-slate-200">{citizenUser?.address || 'Sai Nagar, Kopargaon'}</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};
