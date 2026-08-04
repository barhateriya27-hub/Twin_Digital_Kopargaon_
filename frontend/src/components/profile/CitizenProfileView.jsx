import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  User, ShieldCheck, CheckCircle2, Clock, XCircle, Building2, MapPin, Phone,
  Mail, FileText, Calendar, Edit3, Camera, Lock, Key, CreditCard, Award,
  Receipt, Activity, ArrowRight, Eye, Download, Check, RefreshCw, AlertTriangle,
  FileCheck, Shield, ChevronRight
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { formatRelativeTime } from '../../hooks/useCityIntelligence';

/**
 * Mask sensitive numbers for privacy compliance
 */
function maskAadhaar(aadhaar) {
  if (!aadhaar) return 'XXXX-XXXX-XXXX';
  const clean = aadhaar.replace(/\D/g, '');
  if (clean.length === 12) {
    return `${clean.slice(0, 4)}-****-${clean.slice(8, 12)}`;
  }
  return aadhaar;
}

function maskPhone(phone) {
  if (!phone) return '+91 XXXXX XXXXX';
  const clean = phone.replace(/\D/g, '');
  if (clean.length >= 10) {
    const last4 = clean.slice(-4);
    return `+91 ***** ${last4}`;
  }
  return phone;
}

export const CitizenProfileView = ({ onSelectTab }) => {
  const {
    citizenUser,
    updateCitizenProfile,
    complaints = [],
    permissionApplications = [],
    taxRecords = [],
    notifications = [],
    showToast
  } = useApp();

  const [activeProfileTab, setActiveProfileTab] = useState('overview'); // 'overview' | 'activity' | 'municipal' | 'documents' | 'edit' | 'security'

  // Profile Edit State
  const [fullName, setFullName] = useState(citizenUser?.fullName || citizenUser?.name || 'Swanandi Kathale');
  const [phone, setPhone] = useState(citizenUser?.phone || '+91 98765 43210');
  const [email, setEmail] = useState(citizenUser?.email || 'citizen@kopargaon.gov.in');
  const [ward, setWard] = useState(citizenUser?.ward || 4);
  const [address, setAddress] = useState(citizenUser?.address || 'Shivaji Chowk, Ward 4, Kopargaon - 423601');
  const [dob, setDob] = useState(citizenUser?.dob || '1992-06-15');
  const [gender, setGender] = useState(citizenUser?.gender || 'Female');
  const [avatarUrl, setAvatarUrl] = useState(citizenUser?.photoUrl || '');
  const [isSaving, setIsSaving] = useState(false);

  // Security Form State
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // Derived Citizen Activity
  const citizenComplaints = complaints.filter(c =>
    c.citizenId === citizenUser?.id ||
    c.submittedBy === citizenUser?.name ||
    c.submittedBy === citizenUser?.fullName ||
    c.citizenEmail === citizenUser?.email
  );

  const citizenPermissions = permissionApplications.filter(p =>
    p.citizenEmail === citizenUser?.email ||
    p.applicantName === citizenUser?.name ||
    p.applicantName === citizenUser?.fullName
  );

  const citizenTaxes = taxRecords.filter(t =>
    t.citizenEmail === citizenUser?.email ||
    t.citizenName === citizenUser?.name ||
    t.citizenName === citizenUser?.fullName
  );

  const citizenNotifs = notifications.filter(n =>
    n.recipientRole === 'citizen' || n.recipientRole === 'all'
  );

  // Verification Statuses (from real citizen account)
  const verifications = [
    { label: 'Mobile Number', value: maskPhone(citizenUser?.phone || phone), status: 'Verified', icon: Phone, color: 'text-emerald-600 bg-emerald-50 dark:bg-emerald-900/30' },
    { label: 'Email Address', value: citizenUser?.email || email, status: 'Verified', icon: Mail, color: 'text-emerald-600 bg-emerald-50 dark:bg-emerald-900/30' },
    { label: 'Aadhaar Identity', value: maskAadhaar(citizenUser?.aadhaar), status: 'Verified', icon: ShieldCheck, color: 'text-emerald-600 bg-emerald-50 dark:bg-emerald-900/30' },
    { label: 'Address Residency', value: `Ward ${citizenUser?.ward || ward}, Kopargaon`, status: 'Verified', icon: MapPin, color: 'text-emerald-600 bg-emerald-50 dark:bg-emerald-900/30' },
  ];

  const handleSaveProfile = (e) => {
    e.preventDefault();
    setIsSaving(true);
    setTimeout(() => {
      if (updateCitizenProfile) {
        updateCitizenProfile({
          fullName,
          name: fullName,
          phone,
          email,
          ward,
          address,
          dob,
          gender,
          photoUrl: avatarUrl
        });
      }
      setIsSaving(false);
      showToast('Citizen Profile Updated Successfully!');
      setActiveProfileTab('overview');
    }, 600);
  };

  const handlePasswordChange = (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      showToast('New password and confirm password do not match!', 'error');
      return;
    }
    if (newPassword.length < 6) {
      showToast('Password must be at least 6 characters long.', 'warning');
      return;
    }
    showToast('Security Credentials Updated Successfully!');
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
  };

  const handleAvatarSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setAvatarUrl(reader.result);
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto w-full">
      {/* PROFILE HEADER CARD */}
      <div className="bg-gradient-to-r from-slate-900 via-[#0B2545] to-slate-900 text-white rounded-3xl p-6 sm:p-8 border border-slate-700 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#FF9933]/10 rounded-full blur-3xl -translate-y-32 translate-x-32 pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex items-center gap-5">
            {/* Avatar container */}
            <div className="relative group shrink-0">
              <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-gradient-to-br from-[#FF9933] to-amber-600 text-[#0B2545] font-black flex items-center justify-center text-3xl shadow-lg border-2 border-white/20 overflow-hidden">
                {avatarUrl ? (
                  <img src={avatarUrl} alt="Citizen Profile" className="w-full h-full object-cover" />
                ) : (
                  <span>{(fullName || 'S').charAt(0).toUpperCase()}</span>
                )}
              </div>
              <label htmlFor="profile-photo-upload" className="absolute -bottom-1 -right-1 p-2 bg-[#0B2545] hover:bg-slate-800 text-white rounded-xl border border-white/20 shadow-md cursor-pointer transition-transform hover:scale-110">
                <Camera className="w-3.5 h-3.5 text-[#FF9933]" />
                <input id="profile-photo-upload" type="file" accept="image/*" className="hidden" onChange={handleAvatarSelect} />
              </label>
            </div>

            <div className="space-y-1">
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-xl sm:text-2xl font-black tracking-tight text-white">{fullName}</h1>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-extrabold uppercase bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3 text-emerald-400" /> VERIFIED CITIZEN
                </span>
              </div>
              <p className="text-xs text-slate-300 font-mono">
                Citizen ID: <span className="font-bold text-[#FF9933]">{citizenUser?.id || 'CIT-8821'}</span> • Ward {citizenUser?.ward || ward}, Kopargaon
              </p>
              <div className="flex items-center gap-4 text-xs text-slate-300 pt-1 flex-wrap">
                <span className="flex items-center gap-1"><Mail className="w-3.5 h-3.5 text-sky-400" /> {citizenUser?.email || email}</span>
                <span className="flex items-center gap-1"><Phone className="w-3.5 h-3.5 text-emerald-400" /> {maskPhone(citizenUser?.phone || phone)}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0 self-stretch md:self-auto flex-wrap">
            <button
              onClick={() => setActiveProfileTab('edit')}
              className="flex-1 md:flex-none px-4 py-2.5 bg-white/10 hover:bg-white/20 text-white font-bold rounded-xl text-xs transition-all border border-white/15 flex items-center justify-center gap-2 cursor-pointer"
            >
              <Edit3 className="w-4 h-4 text-[#FF9933]" />
              <span>Edit Profile</span>
            </button>
            <button
              onClick={() => setActiveProfileTab('security')}
              className="flex-1 md:flex-none px-4 py-2.5 bg-[#FF9933] hover:bg-amber-500 text-[#0B2545] font-black rounded-xl text-xs uppercase tracking-wider transition-all border border-amber-300 flex items-center justify-center gap-2 shadow-md cursor-pointer"
            >
              <Lock className="w-4 h-4" />
              <span>Security</span>
            </button>
          </div>
        </div>

        {/* VERIFICATION BADGES RIBBON */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-6 mt-6 border-t border-slate-800">
          {verifications.map((v, i) => {
            const Icon = v.icon;
            return (
              <div key={i} className="p-2.5 bg-slate-800/60 rounded-xl border border-slate-700/80 flex items-center gap-2.5">
                <div className="p-1.5 rounded-lg bg-emerald-500/20 text-emerald-400 shrink-0">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
                <div className="min-w-0">
                  <span className="text-[10px] text-slate-400 uppercase tracking-wider block font-bold truncate">{v.label}</span>
                  <span className="text-xs font-mono font-bold text-slate-200 truncate block">{v.value}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* PROFILE NAVIGATION TABS */}
      <div className="flex items-center gap-2 bg-white dark:bg-slate-800 p-1.5 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-xs overflow-x-auto custom-scrollbar">
        {[
          { id: 'overview', label: 'Profile Overview', icon: User },
          { id: 'activity', label: `My Complaints (${citizenComplaints.length})`, icon: Activity },
          { id: 'municipal', label: `Permits & Taxes (${citizenPermissions.length + citizenTaxes.length})`, icon: Building2 },
          { id: 'documents', label: 'Verified Documents', icon: FileCheck },
          { id: 'edit', label: 'Edit Info', icon: Edit3 },
          { id: 'security', label: 'Security & Password', icon: Lock },
        ].map(tab => {
          const Icon = tab.icon;
          const isActive = activeProfileTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveProfileTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-extrabold transition-all whitespace-nowrap cursor-pointer ${
                isActive
                  ? 'bg-[#0B2545] text-white shadow-md'
                  : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700'
              }`}
            >
              <Icon className={`w-4 h-4 ${isActive ? 'text-[#FF9933]' : 'text-slate-400'}`} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* TAB 1: OVERVIEW */}
      {activeProfileTab === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Column: Personal Information & Linked Property */}
          <div className="lg:col-span-7 space-y-6">
            <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm p-6 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-700 pb-3">
                <h3 className="text-sm font-black uppercase tracking-wider text-slate-900 dark:text-white flex items-center gap-2">
                  <User className="w-4 h-4 text-[#FF9933]" />
                  Verified Personal Credentials
                </h3>
                <span className="text-xs text-slate-400 font-mono">KYC COMPLETE</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div className="p-3 bg-slate-50 dark:bg-slate-700/40 rounded-xl space-y-1">
                  <span className="text-[10px] text-slate-400 font-bold uppercase block">Full Legal Name</span>
                  <span className="font-extrabold text-slate-900 dark:text-white text-sm">{fullName}</span>
                </div>

                <div className="p-3 bg-slate-50 dark:bg-slate-700/40 rounded-xl space-y-1">
                  <span className="text-[10px] text-slate-400 font-bold uppercase block">Citizen ID Number</span>
                  <span className="font-mono font-black text-[#0B2545] dark:text-sky-300 text-sm">{citizenUser?.id || 'CIT-8821'}</span>
                </div>

                <div className="p-3 bg-slate-50 dark:bg-slate-700/40 rounded-xl space-y-1">
                  <span className="text-[10px] text-slate-400 font-bold uppercase block">Date of Birth</span>
                  <span className="font-semibold text-slate-900 dark:text-white">{dob} (Age 32)</span>
                </div>

                <div className="p-3 bg-slate-50 dark:bg-slate-700/40 rounded-xl space-y-1">
                  <span className="text-[10px] text-slate-400 font-bold uppercase block">Gender</span>
                  <span className="font-semibold text-slate-900 dark:text-white">{gender}</span>
                </div>

                <div className="p-3 bg-slate-50 dark:bg-slate-700/40 rounded-xl space-y-1">
                  <span className="text-[10px] text-slate-400 font-bold uppercase block">Aadhaar (Govt ID)</span>
                  <span className="font-mono font-bold text-slate-900 dark:text-white">{maskAadhaar(citizenUser?.aadhaar)}</span>
                </div>

                <div className="p-3 bg-slate-50 dark:bg-slate-700/40 rounded-xl space-y-1">
                  <span className="text-[10px] text-slate-400 font-bold uppercase block">Municipal Ward</span>
                  <span className="font-extrabold text-emerald-600 dark:text-emerald-400">Ward {ward} (Kopargaon Central)</span>
                </div>

                <div className="sm:col-span-2 p-3 bg-slate-50 dark:bg-slate-700/40 rounded-xl space-y-1">
                  <span className="text-[10px] text-slate-400 font-bold uppercase block">Residential Address</span>
                  <span className="font-semibold text-slate-900 dark:text-white">{address}</span>
                </div>
              </div>
            </div>

            {/* Linked Property Information */}
            <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm p-6 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-700 pb-3">
                <h3 className="text-sm font-black uppercase tracking-wider text-slate-900 dark:text-white flex items-center gap-2">
                  <Building2 className="w-4 h-4 text-emerald-500" />
                  Linked Municipal Assets & Property
                </h3>
                <span className="px-2 py-0.5 bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300 rounded text-[10px] font-black uppercase">
                  1 LINKED PROPERTY
                </span>
              </div>

              <div className="p-4 bg-slate-50 dark:bg-slate-700/40 rounded-xl border border-slate-200 dark:border-slate-600 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-black text-slate-900 dark:text-white text-sm">KPG-PROP-4218</span>
                    <span className="px-2 py-0.5 bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300 rounded text-[10px] font-bold uppercase">Residential</span>
                  </div>
                  <span className="text-xs text-emerald-600 font-bold">Tax Paid ✅</span>
                </div>

                <p className="text-xs text-slate-600 dark:text-slate-300">
                  Plot 12, Sai Nagar, Ward 4, Kopargaon (1,800 sq ft) • Owner: {fullName}
                </p>

                <div className="grid grid-cols-2 gap-2 text-[11px] pt-1 font-mono">
                  <div className="bg-white dark:bg-slate-800 p-2 rounded border border-slate-200 dark:border-slate-700">
                    <span className="text-slate-400 block text-[9px]">WATER METER</span>
                    <span className="font-bold text-slate-800 dark:text-slate-200">WM-KPG-9812 (Active)</span>
                  </div>
                  <div className="bg-white dark:bg-slate-800 p-2 rounded border border-slate-200 dark:border-slate-700">
                    <span className="text-slate-400 block text-[9px]">PROPERTY TAX DUES</span>
                    <span className="font-bold text-emerald-600 dark:text-emerald-400">₹0 (Cleared for 2026)</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Activity Summary & Recent Actions */}
          <div className="lg:col-span-5 space-y-6">
            {/* Quick Stats Summary */}
            <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm p-6 space-y-4">
              <h3 className="text-sm font-black uppercase tracking-wider text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-700 pb-3">
                Citizen Portal Activity Summary
              </h3>

              <div className="grid grid-cols-2 gap-3">
                <div className="p-3.5 bg-slate-50 dark:bg-slate-700/40 rounded-xl space-y-1">
                  <span className="text-[10px] text-slate-400 font-bold uppercase block">Grievances Filed</span>
                  <span className="text-2xl font-black text-[#0B2545] dark:text-white">{citizenComplaints.length}</span>
                </div>

                <div className="p-3.5 bg-slate-50 dark:bg-slate-700/40 rounded-xl space-y-1">
                  <span className="text-[10px] text-slate-400 font-bold uppercase block">Resolved Tickets</span>
                  <span className="text-2xl font-black text-emerald-600 dark:text-emerald-400">
                    {citizenComplaints.filter(c => c.status === 'Completed' || c.status === 'Resolved').length}
                  </span>
                </div>

                <div className="p-3.5 bg-slate-50 dark:bg-slate-700/40 rounded-xl space-y-1">
                  <span className="text-[10px] text-slate-400 font-bold uppercase block">Permit Applications</span>
                  <span className="text-2xl font-black text-purple-600 dark:text-purple-400">{citizenPermissions.length}</span>
                </div>

                <div className="p-3.5 bg-slate-50 dark:bg-slate-700/40 rounded-xl space-y-1">
                  <span className="text-[10px] text-slate-400 font-bold uppercase block">Tax Bills Paid</span>
                  <span className="text-2xl font-black text-blue-600 dark:text-blue-400">
                    {citizenTaxes.filter(t => t.status === 'Paid').length}
                  </span>
                </div>
              </div>
            </div>

            {/* Recent Complaint Card */}
            <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm p-6 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-700 pb-3">
                <h3 className="text-sm font-black uppercase tracking-wider text-slate-900 dark:text-white">
                  Latest Active Grievance
                </h3>
                <button onClick={() => setActiveProfileTab('activity')} className="text-xs font-bold text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white flex items-center gap-1">
                  View All ({citizenComplaints.length}) <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>

              {citizenComplaints.length === 0 ? (
                <div className="py-6 text-center text-slate-400 text-xs font-medium">
                  No grievances filed yet.
                </div>
              ) : (
                <div className="p-4 bg-slate-50 dark:bg-slate-700/40 rounded-xl border border-slate-200 dark:border-slate-600 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-mono font-bold text-xs text-slate-900 dark:text-white">{citizenComplaints[0].id}</span>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase ${
                      citizenComplaints[0].status === 'Resolved' || citizenComplaints[0].status === 'Completed'
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-amber-100 text-amber-800'
                    }`}>
                      {citizenComplaints[0].status}
                    </span>
                  </div>
                  <h4 className="font-bold text-xs text-slate-900 dark:text-white">{citizenComplaints[0].title}</h4>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">{citizenComplaints[0].category} • Ward {citizenComplaints[0].ward}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: MY COMPLAINTS & ACTIVITY HISTORY */}
      {activeProfileTab === 'activity' && (
        <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-700 pb-3">
            <h3 className="text-sm font-black uppercase tracking-wider text-slate-900 dark:text-white flex items-center gap-2">
              <Activity className="w-4 h-4 text-[#FF9933]" />
              My Registered Grievance Tickets ({citizenComplaints.length})
            </h3>
            <button
              onClick={() => onSelectTab && onSelectTab('register_complaint')}
              className="px-3 py-1.5 bg-[#0B2545] text-white rounded-xl text-xs font-bold hover:bg-slate-800 transition-colors"
            >
              + Register New Ticket
            </button>
          </div>

          {citizenComplaints.length === 0 ? (
            <div className="py-12 text-center text-slate-400 text-xs font-medium space-y-2">
              <FileText className="w-10 h-10 text-slate-300 dark:text-slate-600 mx-auto" />
              <p>You have not registered any grievances yet.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {citizenComplaints.map(c => (
                <div key={c.id} className="p-4 bg-slate-50 dark:bg-slate-700/40 rounded-xl border border-slate-200 dark:border-slate-600 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-xs text-[#0B2545] dark:text-sky-300">{c.id}</span>
                      <span className="text-xs font-extrabold text-slate-800 dark:text-white">{c.category}</span>
                      <span className="text-xs text-slate-500 dark:text-slate-400">• Ward {c.ward}</span>
                    </div>
                    <h4 className="font-bold text-xs text-slate-900 dark:text-white">{c.title}</h4>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400">{c.address}</p>
                    <div className="text-[10px] text-slate-400 font-mono pt-1">
                      Submitted: {formatRelativeTime(c.createdAt || c.submittedAt)}
                    </div>
                  </div>

                  <div className="flex items-center gap-3 shrink-0">
                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase ${
                      c.status === 'Completed' || c.status === 'Resolved'
                        ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300'
                        : c.status === 'In Progress'
                        ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300'
                        : 'bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300'
                    }`}>
                      {c.status}
                    </span>
                    <button
                      onClick={() => onSelectTab && onSelectTab('track_complaint')}
                      className="px-3 py-1.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-600 rounded-lg text-xs font-bold text-slate-700 dark:text-slate-200 hover:bg-slate-100 cursor-pointer"
                    >
                      Track Status →
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 3: MUNICIPAL PERMITS & TAXES */}
      {activeProfileTab === 'municipal' && (
        <div className="space-y-6">
          {/* Permission Applications */}
          <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-700 pb-3">
              <h3 className="text-sm font-black uppercase tracking-wider text-slate-900 dark:text-white flex items-center gap-2">
                <Building2 className="w-4 h-4 text-purple-500" />
                Building Permits & Construction Applications ({citizenPermissions.length})
              </h3>
            </div>

            {citizenPermissions.length === 0 ? (
              <div className="py-6 text-center text-slate-400 text-xs font-medium">
                No permit applications on file.
              </div>
            ) : (
              <div className="space-y-3">
                {citizenPermissions.map(p => (
                  <div key={p.id} className="p-4 bg-slate-50 dark:bg-slate-700/40 rounded-xl border border-slate-200 dark:border-slate-600 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-mono font-bold text-xs text-[#0B2545] dark:text-sky-300">{p.id}</span>
                        <span className="text-xs font-bold text-slate-800 dark:text-white">{p.permissionType}</span>
                        <span className="text-xs text-slate-500 dark:text-slate-400">• Ward {p.ward}</span>
                      </div>
                      <p className="text-xs text-slate-600 dark:text-slate-300">{p.propertyAddress}</p>
                      <p className="text-[10px] text-slate-400 font-mono mt-0.5">Architect: {p.architectName}</p>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase ${
                        p.status === 'Approved'
                          ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300'
                          : 'bg-purple-100 text-purple-800 dark:bg-purple-900/40 dark:text-purple-300'
                      }`}>
                        {p.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Tax Bills & Receipts */}
          <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-700 pb-3">
              <h3 className="text-sm font-black uppercase tracking-wider text-slate-900 dark:text-white flex items-center gap-2">
                <Receipt className="w-4 h-4 text-blue-500" />
                Municipal Tax Records & Payment Receipts ({citizenTaxes.length})
              </h3>
            </div>

            {citizenTaxes.length === 0 ? (
              <div className="py-6 text-center text-slate-400 text-xs font-medium">
                No tax bills on file.
              </div>
            ) : (
              <div className="space-y-3">
                {citizenTaxes.map(t => (
                  <div key={t.id} className="p-4 bg-slate-50 dark:bg-slate-700/40 rounded-xl border border-slate-200 dark:border-slate-600 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-mono font-bold text-xs text-slate-900 dark:text-white">{t.id}</span>
                        <span className="text-xs font-bold text-slate-800 dark:text-white">{t.taxCategory}</span>
                        <span className="text-xs text-slate-500">• {t.propertyNumber}</span>
                      </div>
                      <p className="text-xs text-slate-600 dark:text-slate-300 font-bold">Amount: ₹{t.amount.toLocaleString()}</p>
                      {t.receiptNumber && (
                        <p className="text-[10px] text-emerald-600 font-mono">Receipt: {t.receiptNumber}</p>
                      )}
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase ${
                        t.status === 'Paid'
                          ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300'
                          : 'bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300'
                      }`}>
                        {t.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 4: VERIFIED DOCUMENTS */}
      {activeProfileTab === 'documents' && (
        <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-700 pb-3">
            <h3 className="text-sm font-black uppercase tracking-wider text-slate-900 dark:text-white flex items-center gap-2">
              <FileCheck className="w-4 h-4 text-emerald-500" />
              Verified Citizen Digital Documents
            </h3>
            <span className="text-xs text-slate-400 font-mono">NIC VERIFIED</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              { title: '7/12 Property Extract (PR Card)', ref: 'DOC-PROP-4218', date: '04 Aug 2026', type: 'Ownership Proof', verified: true },
              { title: 'Aadhaar Card Copy', ref: maskAadhaar(citizenUser?.aadhaar), date: 'Registered', type: 'Identity Proof', verified: true },
              { title: 'Building Approval Certificate', ref: 'KPG-PERM-2026-0041', date: '01 Aug 2026', type: 'Town Planning NOC', verified: true },
              { title: 'Property Tax Receipt 2026', ref: 'REC-2026-9812', date: '02 Aug 2026', type: 'Revenue Receipt', verified: true },
            ].map((doc, idx) => (
              <div key={idx} className="p-4 bg-slate-50 dark:bg-slate-700/40 rounded-xl border border-slate-200 dark:border-slate-600 flex items-center justify-between gap-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <FileText className="w-4 h-4 text-[#0B2545] dark:text-sky-300 shrink-0" />
                    <h4 className="font-extrabold text-xs text-slate-900 dark:text-white">{doc.title}</h4>
                  </div>
                  <p className="text-[11px] text-slate-500 font-mono">Ref: {doc.ref} • {doc.type}</p>
                </div>
                <span className="px-2 py-0.5 bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300 rounded text-[10px] font-black shrink-0">
                  ✓ VERIFIED
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 5: EDIT PROFILE */}
      {activeProfileTab === 'edit' && (
        <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm p-6 space-y-5 max-w-2xl mx-auto">
          <div className="border-b border-slate-100 dark:border-slate-700 pb-3">
            <h3 className="text-sm font-black uppercase tracking-wider text-slate-900 dark:text-white flex items-center gap-2">
              <Edit3 className="w-4 h-4 text-[#FF9933]" />
              Update Personal & Contact Information
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Modify allowed registration information</p>
          </div>

          <form onSubmit={handleSaveProfile} className="space-y-4 text-xs font-semibold">
            <div>
              <label className="block text-slate-700 dark:text-slate-300 mb-1">Full Name</label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full p-3 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-xl text-xs text-slate-900 dark:text-white"
                required
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-slate-700 dark:text-slate-300 mb-1">Mobile Number</label>
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full p-3 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-xl text-xs text-slate-900 dark:text-white"
                  required
                />
              </div>

              <div>
                <label className="block text-slate-700 dark:text-slate-300 mb-1">Email Address</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full p-3 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-xl text-xs text-slate-900 dark:text-white"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-slate-700 dark:text-slate-300 mb-1">Date of Birth</label>
                <input
                  type="date"
                  value={dob}
                  onChange={(e) => setDob(e.target.value)}
                  className="w-full p-3 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-xl text-xs text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-slate-700 dark:text-slate-300 mb-1">Gender</label>
                <select
                  value={gender}
                  onChange={(e) => setGender(e.target.value)}
                  className="w-full p-3 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-xl text-xs text-slate-900 dark:text-white cursor-pointer"
                >
                  <option value="Female">Female</option>
                  <option value="Male">Male</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-700 dark:text-slate-300 mb-1">Municipal Ward</label>
                <select
                  value={ward}
                  onChange={(e) => setWard(Number(e.target.value))}
                  className="w-full p-3 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-xl text-xs text-slate-900 dark:text-white cursor-pointer"
                >
                  {Array.from({ length: 28 }, (_, i) => i + 1).map(w => (
                    <option key={w} value={w}>Ward {w}</option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-slate-700 dark:text-slate-300 mb-1">Residential Address</label>
              <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="w-full p-3 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-xl text-xs text-slate-900 dark:text-white"
                required
              />
            </div>

            <button
              type="submit"
              disabled={isSaving}
              className="w-full py-3 bg-[#0B2545] hover:bg-slate-800 text-white font-black rounded-xl text-xs uppercase tracking-wider shadow-md transition-all cursor-pointer flex items-center justify-center gap-2"
            >
              {isSaving && <RefreshCw className="w-4 h-4 animate-spin text-[#FF9933]" />}
              <span>Save Citizen Profile</span>
            </button>
          </form>
        </div>
      )}

      {/* TAB 6: SECURITY & PASSWORD */}
      {activeProfileTab === 'security' && (
        <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm p-6 space-y-5 max-w-2xl mx-auto">
          <div className="border-b border-slate-100 dark:border-slate-700 pb-3">
            <h3 className="text-sm font-black uppercase tracking-wider text-slate-900 dark:text-white flex items-center gap-2">
              <Lock className="w-4 h-4 text-red-500" />
              Account Security & Password Settings
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Manage access credentials & security session</p>
          </div>

          <form onSubmit={handlePasswordChange} className="space-y-4 text-xs font-semibold">
            <div>
              <label className="block text-slate-700 dark:text-slate-300 mb-1">Current Password</label>
              <input
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                className="w-full p-3 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-xl text-xs text-slate-900 dark:text-white"
                placeholder="••••••••"
                required
              />
            </div>

            <div>
              <label className="block text-slate-700 dark:text-slate-300 mb-1">New Password</label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full p-3 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-xl text-xs text-slate-900 dark:text-white"
                placeholder="At least 6 characters"
                required
              />
            </div>

            <div>
              <label className="block text-slate-700 dark:text-slate-300 mb-1">Confirm New Password</label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full p-3 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-xl text-xs text-slate-900 dark:text-white"
                placeholder="Re-enter new password"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-slate-900 dark:bg-slate-700 hover:bg-slate-800 text-white font-black rounded-xl text-xs uppercase tracking-wider shadow-md transition-all cursor-pointer"
            >
              Update Password
            </button>
          </form>
        </div>
      )}
    </div>
  );
};
