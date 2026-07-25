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
  ArrowUpRight,
  Award,
  Megaphone,
  Download,
  Share2,
  ShieldAlert,
  DollarSign,
  Receipt
} from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { ThemeToggle } from '../../components/ThemeToggle';
import { SLAIndicator } from '../../components/SLAIndicator';
import { NotificationDrawer } from '../../components/NotificationDrawer';
import { PublicReportModal } from '../../components/PublicReportModal';
import { PermissionsDashboardView } from '../../components/permissions/PermissionsDashboardView';
import { CitizenTaxPortalView } from '../../components/tax/CitizenTaxPortalView';

export const CitizenDashboard = () => {
  const navigate = useNavigate();
  const { 
    citizenUser, 
    complaints = [], 
    notifications = [], 
    announcements = [], 
    addComplaint, 
    logoutCitizen, 
    showToast 
  } = useApp();

  const [activeTab, setActiveTab] = useState('overview'); // 'overview' | 'report' | 'track' | 'alerts' | 'profile'
  const [selectedComplaint, setSelectedComplaint] = useState(null);
  const [publicReportTarget, setPublicReportTarget] = useState(null);
  const [isNotifDrawerOpen, setIsNotifDrawerOpen] = useState(false);

  // Form state
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

  const statusSteps = ['Pending', 'In Progress', 'Completed'];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-200 flex flex-col font-sans selection:bg-[#F97316] selection:text-white">
      
      {/* Tricolor Ribbon */}
      <div className="h-[4px] w-full flex shrink-0">
        <div className="h-full w-1/3 bg-[#FF9933]"></div>
        <div className="h-full w-1/3 bg-white dark:bg-slate-800"></div>
        <div className="h-full w-1/3 bg-[#138808]"></div>
      </div>

      {/* Requirement #11: Emergency Broadcast Banner */}
      {emergencyNotice && (
        <div className="bg-rose-600 text-white px-4 py-2 text-xs font-semibold flex items-center justify-between shadow-md">
          <div className="flex items-center gap-2 max-w-5xl mx-auto">
            <ShieldAlert className="w-4 h-4 text-amber-300 shrink-0 animate-pulse" />
            <span className="font-bold">EMERGENCY ADVISORY:</span>
            <span>{emergencyNotice.title} - {emergencyNotice.description}</span>
          </div>
        </div>
      )}

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
          <nav className="hidden md:flex items-center gap-1 bg-slate-100 dark:bg-slate-900/80 p-1.5 rounded-xl border border-slate-200 dark:border-slate-700">
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
              <ClipboardList className="w-4 h-4" /> Track Complaints ({userComplaints.length})
            </button>
            <button
              onClick={() => setActiveTab('permissions')}
              className={`px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-2 ${
                activeTab === 'permissions' ? 'bg-white dark:bg-slate-800 text-orange-600 shadow-sm' : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:text-slate-100'
              }`}
            >
              <Building2 className="w-4 h-4 text-sky-500" /> Permissions & Licenses
            </button>
            <button
              onClick={() => setActiveTab('taxes')}
              className={`px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-2 ${
                activeTab === 'taxes' ? 'bg-white dark:bg-slate-800 text-orange-600 shadow-sm' : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:text-slate-100'
              }`}
            >
              <DollarSign className="w-4 h-4 text-emerald-500" /> Tax & Revenue Dues
            </button>
            <button
              onClick={() => setActiveTab('alerts')}
              className={`px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-2 ${
                activeTab === 'alerts' ? 'bg-white dark:bg-slate-800 text-orange-600 shadow-sm' : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:text-slate-100'
              }`}
            >
              <Megaphone className="w-4 h-4 text-amber-500" /> Advisories
            </button>
          </nav>

          <div className="flex items-center gap-3">
            <ThemeToggle />

            {/* Notification Drawer Trigger */}
            <button
              onClick={() => setIsNotifDrawerOpen(true)}
              className="relative p-2.5 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
              title="Citizen Notifications"
            >
              <Bell className="w-5 h-5" />
              {unreadCount > 0 && (
                <span className="absolute top-1.5 right-1.5 w-4 h-4 bg-orange-600 text-white font-extrabold text-[9px] rounded-full flex items-center justify-center animate-pulse">
                  {unreadCount}
                </span>
              )}
            </button>

            <button
              onClick={handleLogout}
              className="p-2.5 text-slate-500 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30 rounded-xl transition-colors"
              title="Sign Out"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Mobile Navigation Sub-Bar */}
        <div className="md:hidden flex items-center gap-1.5 px-4 pb-3 overflow-x-auto scrollbar-none border-t border-slate-100 dark:border-slate-700/60 pt-2 text-xs font-bold">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-3 py-1.5 rounded-lg shrink-0 flex items-center gap-1.5 transition-all ${
              activeTab === 'overview' ? 'bg-[#F97316] text-white shadow-xs' : 'bg-slate-100 dark:bg-slate-900 text-slate-700 dark:text-slate-300'
            }`}
          >
            <Home className="w-3.5 h-3.5" /> Home
          </button>
          <button
            onClick={() => setActiveTab('report')}
            className={`px-3 py-1.5 rounded-lg shrink-0 flex items-center gap-1.5 transition-all ${
              activeTab === 'report' ? 'bg-[#F97316] text-white shadow-xs' : 'bg-slate-100 dark:bg-slate-900 text-slate-700 dark:text-slate-300'
            }`}
          >
            <PlusCircle className="w-3.5 h-3.5 text-emerald-400" /> Report Issue
          </button>
          <button
            onClick={() => setActiveTab('track')}
            className={`px-3 py-1.5 rounded-lg shrink-0 flex items-center gap-1.5 transition-all ${
              activeTab === 'track' ? 'bg-[#F97316] text-white shadow-xs' : 'bg-slate-100 dark:bg-slate-900 text-slate-700 dark:text-slate-300'
            }`}
          >
            <ClipboardList className="w-3.5 h-3.5" /> Track Tickets
          </button>
          <button
            onClick={() => setActiveTab('permissions')}
            className={`px-3 py-1.5 rounded-lg shrink-0 flex items-center gap-1.5 transition-all ${
              activeTab === 'permissions' ? 'bg-[#F97316] text-white shadow-xs' : 'bg-slate-100 dark:bg-slate-900 text-slate-700 dark:text-slate-300'
            }`}
          >
            <Building2 className="w-3.5 h-3.5 text-sky-400" /> Permissions
          </button>
          <button
            onClick={() => setActiveTab('taxes')}
            className={`px-3 py-1.5 rounded-lg shrink-0 flex items-center gap-1.5 transition-all ${
              activeTab === 'taxes' ? 'bg-[#F97316] text-white shadow-xs' : 'bg-slate-100 dark:bg-slate-900 text-slate-700 dark:text-slate-300'
            }`}
          >
            <DollarSign className="w-3.5 h-3.5 text-emerald-400" /> Taxes
          </button>
          <button
            onClick={() => setActiveTab('alerts')}
            className={`px-3 py-1.5 rounded-lg shrink-0 flex items-center gap-1.5 transition-all ${
              activeTab === 'alerts' ? 'bg-[#F97316] text-white shadow-xs' : 'bg-slate-100 dark:bg-slate-900 text-slate-700 dark:text-slate-300'
            }`}
          >
            <Megaphone className="w-3.5 h-3.5 text-amber-400" /> Advisories
          </button>
        </div>
      </header>

      {/* MAIN CONTENT AREA */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8 space-y-6">

        {/* OVERVIEW TAB */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            <div className="bg-gradient-to-r from-[#0A2540] to-slate-900 rounded-2xl p-6 sm:p-8 text-white shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="space-y-2">
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-500/20 text-amber-300 rounded-full text-xs font-semibold border border-amber-500/30">
                  <Shield className="w-3.5 h-3.5" /> 3-Day SLA Municipal Governance Active
                </div>
                <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
                  Welcome, {citizenUser?.name || 'Kopargaon Resident'}
                </h1>
                <p className="text-xs sm:text-sm text-slate-300 max-w-xl">
                  Every complaint registered is assigned an automatic 3-day SLA due date, complete timeline tracking, and official downloadable work completion report.
                </p>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setActiveTab('report')}
                  className="px-5 py-3 bg-[#F97316] hover:bg-orange-600 text-white font-bold text-xs rounded-xl shadow-lg transition-transform active:scale-95 flex items-center gap-2"
                >
                  <PlusCircle className="w-4 h-4" /> Log New Issue
                </button>
                <button
                  onClick={() => setActiveTab('track')}
                  className="px-5 py-3 bg-white/10 hover:bg-white/20 text-white font-bold text-xs rounded-xl border border-white/20 transition-all flex items-center gap-2"
                >
                  <ClipboardList className="w-4 h-4" /> Track Status
                </button>
              </div>
            </div>

            {/* Recent Complaints Summary */}
            <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-6 shadow-sm space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-700 pb-3">
                <h2 className="text-base font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                  <ClipboardList className="w-5 h-5 text-orange-600" />
                  Your Active & Past Complaints
                </h2>
                <button
                  onClick={() => setActiveTab('track')}
                  className="text-xs font-bold text-orange-600 hover:underline flex items-center gap-1"
                >
                  View All ({userComplaints.length}) <ChevronRight className="w-4 h-4" />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {userComplaints.slice(0, 2).map((item) => (
                  <div
                    key={item.id}
                    className="p-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/60 space-y-3"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-xs font-bold text-slate-900 dark:text-slate-100">#{item.id}</span>
                      <SLAIndicator submittedAt={item.createdAt || item.submittedAt} dueDate={item.dueDate} currentStatus={item.status} compact />
                    </div>

                    <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">{item.title}</h3>
                    <p className="text-xs text-slate-500 line-clamp-2">{item.description}</p>

                    {(item.status === 'Completed' || item.status === 'Resolved') && (
                      <button
                        onClick={() => setPublicReportTarget(item)}
                        className="px-3 py-1.5 bg-emerald-600 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 hover:bg-emerald-700"
                      >
                        <Award className="w-3.5 h-3.5" /> View Official Completion Certificate
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* REPORT COMPLAINT TAB */}
        {activeTab === 'report' && (
          <div className="max-w-2xl mx-auto bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-6 sm:p-8 shadow-md space-y-6">
            <div>
              <h2 className="text-lg font-extrabold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                <PlusCircle className="w-5 h-5 text-orange-600" />
                Register New Civic Complaint
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                Your complaint will be logged into the Municipal SLA system and assigned to a department officer within 24 hours.
              </p>
            </div>

            <form onSubmit={handleReportSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Issue Title *</label>
                <input
                  type="text"
                  required
                  value={reportTitle}
                  onChange={(e) => setReportTitle(e.target.value)}
                  placeholder="e.g. Broken water pipe leaking near Ward 4 school"
                  className="w-full px-3 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-slate-100 font-medium"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Category</label>
                  <select
                    value={reportCategory}
                    onChange={(e) => setReportCategory(e.target.value)}
                    className="w-full px-3 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-slate-100 font-medium"
                  >
                    <option value="Garbage">Garbage & Sanitation</option>
                    <option value="Pothole">Pothole & Roads (PWD)</option>
                    <option value="Water Leakage">Water Supply & Leakage</option>
                    <option value="Street Light">Street Light & Electricity</option>
                    <option value="Traffic">Traffic & Transit</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Ward Number</label>
                  <input
                    type="number"
                    min="1"
                    max="28"
                    value={reportWard}
                    onChange={(e) => setReportWard(e.target.value)}
                    className="w-full px-3 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-slate-100 font-medium font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Detailed Description *</label>
                <textarea
                  required
                  rows={4}
                  value={reportDescription}
                  onChange={(e) => setReportDescription(e.target.value)}
                  placeholder="Provide complete details including landmark, severity, and time noticed..."
                  className="w-full px-3 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-slate-100"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3 bg-[#F97316] hover:bg-orange-600 text-white font-bold text-xs rounded-xl shadow-md transition-colors"
              >
                {isSubmitting ? 'Submitting to Municipal SLA Engine...' : 'Submit Complaint Now'}
              </button>
            </form>
          </div>
        )}

        {/* TRACK COMPLAINTS TAB */}
        {activeTab === 'track' && (
          <div className="space-y-6">
            <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <ClipboardList className="w-5 h-5 text-orange-600" />
              Citizen Complaint Tracking Directory
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {userComplaints.map(item => {
                const isCompleted = item.status === 'Completed' || item.status === 'Resolved';
                return (
                  <div key={item.id} className="bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="font-mono font-bold text-xs text-orange-600">#{item.id}</span>
                      <SLAIndicator submittedAt={item.createdAt || item.submittedAt} dueDate={item.dueDate} currentStatus={item.status} />
                    </div>

                    <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">{item.title}</h3>
                    <p className="text-xs text-slate-600 dark:text-slate-300">{item.description}</p>

                    <div className="text-[11px] text-slate-500 font-mono pt-2 border-t border-slate-100 dark:border-slate-700 space-y-0.5">
                      <div>Assigned Dept: <strong className="text-slate-700 dark:text-slate-300">{item.department}</strong></div>
                      <div>Officer: <strong className="text-slate-700 dark:text-slate-300">{item.assignedOfficer || 'Pending Assignment'}</strong></div>
                    </div>

                    {isCompleted && (
                      <button
                        onClick={() => setPublicReportTarget(item)}
                        className="w-full py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 shadow-sm"
                      >
                        <Award className="w-4 h-4" /> Download Official Completion Certificate
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* PUBLIC ANNOUNCEMENTS TAB */}
        {activeTab === 'alerts' && (
          <div className="space-y-6">
            <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <Megaphone className="w-5 h-5 text-amber-500" />
              Kopargaon Municipal Public Announcements & Advisories
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {announcements.map(ann => (
                <div key={ann.id} className="bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300">
                      {ann.category}
                    </span>
                    <span className="text-[10px] font-mono text-slate-400">
                      {new Date(ann.publishDate).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' })}
                    </span>
                  </div>

                  <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">{ann.title}</h3>
                  <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">{ann.description}</p>

                  <div className="text-[10px] text-slate-400 font-mono pt-2 border-t border-slate-100 dark:border-slate-700">
                    Target Wards: {ann.targetWards?.length === 8 ? 'All Wards' : ann.targetWards?.join(', ')}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* MUNICIPAL PERMISSIONS TAB */}
        {activeTab === 'permissions' && (
          <PermissionsDashboardView />
        )}

        {/* MUNICIPAL TAX & REVENUE TAB */}
        {activeTab === 'taxes' && (
          <CitizenTaxPortalView />
        )}
      </main>

      {/* Citizen Notification Drawer */}
      <NotificationDrawer
        isOpen={isNotifDrawerOpen}
        onClose={() => setIsNotifDrawerOpen(false)}
        userRole="citizen"
        onSelectComplaint={(id) => {
          const target = complaints.find(c => c.id === id);
          if (target) {
            setSelectedComplaint(target);
            setActiveTab('track');
          }
        }}
      />

      {/* Official Public Completion Report Modal */}
      <PublicReportModal
        isOpen={!!publicReportTarget}
        onClose={() => setPublicReportTarget(null)}
        complaint={publicReportTarget}
      />
    </div>
  );
};
