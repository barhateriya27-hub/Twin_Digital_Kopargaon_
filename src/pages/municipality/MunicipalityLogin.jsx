import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, Lock, UserCheck, Sparkles, Key, Building2, Home, ShieldAlert } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import { useApp } from '../../context/AppContext';

export const MunicipalityLogin = () => {
  const navigate = useNavigate();
  const { loginOfficer, showToast } = useApp();
  const [officerId, setOfficerId] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!officerId || !password) {
      showToast('Please provide Officer ID and Password', 'warning');
      return;
    }
    const success = loginOfficer(officerId, password);
    if (success) {
      navigate('/municipality/dashboard');
    }
  };

  const handleFillDemo = () => {
    setOfficerId('admin');
    setPassword('admin123');
    showToast('Demo Credentials Loaded (admin / admin123)', 'info');
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] dark:bg-slate-900 text-[#1E293B] dark:text-slate-200 flex flex-col justify-between selection:bg-[#F97316] selection:text-white">
      
      {/* Tricolor Ribbon */}
      <div className="h-[4px] w-full flex shrink-0">
        <div className="h-full w-1/3 bg-[#FF9933]"></div>
        <div className="h-full w-1/3 bg-white dark:bg-slate-800"></div>
        <div className="h-full w-1/3 bg-[#138808]"></div>
      </div>

      {/* Header */}
      <header className="bg-white dark:bg-slate-800 border-b border-[#E2E8F0] dark:border-slate-700 py-3.5 px-6 shadow-sm shrink-0">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#F97316] flex items-center justify-center text-white shadow-md shadow-[#F97316]/20">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <span className="font-extrabold text-base text-[#0F172A] dark:text-slate-100 block leading-tight">
                कोपरगाव <span className="text-[#F97316]">नियंत्रण कक्ष</span>
              </span>
              <span className="text-[10px] sm:text-xs text-[#64748B] dark:text-slate-400 block font-semibold">
                Kopargaon Municipal Control Room • Govt. of Maharashtra
              </span>
            </div>
          </Link>

          <Link
            to="/"
            className="flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-[#64748B] dark:text-slate-400 hover:text-[#F97316] transition-colors"
          >
            <Home className="w-4 h-4" />
            मुख्यपृष्ठ / Back to Home
          </Link>
        </div>
      </header>

      {/* Main Login Box */}
      <main className="flex-1 flex items-center justify-center p-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-md w-full bg-white dark:bg-slate-800 rounded-3xl p-8 border-t-4 border-t-[#F97316] border-x border-b border-[#E2E8F0] dark:border-slate-700 shadow-xl shadow-slate-200/50"
        >
          <div className="text-center mb-8">
            <div className="w-14 h-14 mx-auto mb-4 bg-orange-50 dark:bg-orange-950/20 rounded-2xl flex items-center justify-center text-[#F97316] border border-orange-100 dark:border-orange-900/30">
              {/* Government Seal SVG */}
              <svg viewBox="0 0 100 100" className="w-8 h-8 text-[#F97316]">
                <circle cx="50" cy="50" r="42" fill="none" stroke="currentColor" strokeWidth="4" />
                <path d="M 35 70 Q 50 25, 65 70 Z" fill="none" stroke="currentColor" strokeWidth="5" />
                <circle cx="50" cy="45" r="8" fill="currentColor" />
              </svg>
            </div>
            <h1 className="text-xl font-black text-[#0F172A] dark:text-slate-100 tracking-tight mb-1">
              अधिकारी प्रवेश / Officer Access
            </h1>
            <p className="text-xs text-[#64748B] dark:text-slate-400 font-medium">Smart City Digital Twin Administration Portal</p>
            
            <div className="p-3 bg-red-50 dark:bg-red-950/20 border border-red-200 rounded-xl text-left text-[11px] text-red-700 font-semibold mt-4 leading-normal">
              ⚠️ Warning: Restricted computer system access. Unauthorized attempts to enter this admin portal are subject to legal prosecution under Maharashtra IT Act, 2000.
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-xs font-bold text-[#1E293B] dark:text-slate-200 uppercase tracking-wider mb-2">
                अधिकारी आयडी / Officer ID
              </label>
              <div className="relative">
                <UserCheck className="w-5 h-5 text-[#64748B] dark:text-slate-400 absolute left-3.5 top-3.5" />
                <input
                  type="text"
                  value={officerId}
                  onChange={(e) => setOfficerId(e.target.value)}
                  placeholder="Enter Officer ID (e.g. admin)"
                  className="w-full pl-11 pr-4 py-3 bg-slate-50 dark:bg-slate-900 border border-[#E2E8F0] dark:border-slate-700 rounded-xl text-[#1E293B] dark:text-slate-200 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-[#F97316] focus:bg-white dark:focus:bg-slate-800 dark:bg-slate-800 transition-all text-sm font-semibold"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#1E293B] dark:text-slate-200 uppercase tracking-wider mb-2">
                पासवर्ड / Access Password
              </label>
              <div className="relative">
                <Lock className="w-5 h-5 text-[#64748B] dark:text-slate-400 absolute left-3.5 top-3.5" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-11 pr-4 py-3 bg-slate-50 dark:bg-slate-900 border border-[#E2E8F0] dark:border-slate-700 rounded-xl text-[#1E293B] dark:text-slate-200 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-[#F97316] focus:bg-white dark:focus:bg-slate-800 dark:bg-slate-800 transition-all text-sm font-semibold"
                  required
                />
              </div>
            </div>

            <div className="space-y-3 pt-2">
              <button
                type="button"
                onClick={handleFillDemo}
                className="w-full py-3 px-4 bg-slate-50 dark:bg-slate-900 hover:bg-slate-100 dark:bg-slate-900/50 border border-[#E2E8F0] dark:border-slate-700 rounded-xl text-xs font-bold text-[#F97316] flex items-center justify-center gap-2 transition-all"
              >
                <Sparkles className="w-4 h-4" />
                डेमो लॉगिन / Load Demo Credentials
              </button>

              <button
                type="submit"
                className="w-full py-3.5 px-6 rounded-xl bg-[#F97316] hover:bg-orange-600 text-white font-bold flex items-center justify-center gap-2 shadow-lg shadow-[#F97316]/20 transition-all text-sm tracking-wide uppercase"
              >
                <Key className="w-4 h-4" />
                अधिकारी प्रवेश / Enter Control Room
              </button>
            </div>
          </form>

          <div className="mt-8 pt-6 border-t border-slate-100 dark:border-slate-800 text-center">
            <p className="text-[11px] font-semibold text-[#64748B] dark:text-slate-400 flex items-center justify-center gap-1.5">
              <ShieldAlert className="w-3.5 h-3.5 text-[#F97316]" />
              Secure Digital Twin Admin Authentication Node
            </p>
          </div>
        </motion.div>
      </main>

      <footer className="py-4 text-center text-xs text-[#64748B] dark:text-slate-400 border-t border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 shrink-0">
        कोपरगाव नगरपरिषद • हेल्पलाईन: 1800-233-1042 | support@kopargaon.gov.in
      </footer>
    </div>
  );
};
