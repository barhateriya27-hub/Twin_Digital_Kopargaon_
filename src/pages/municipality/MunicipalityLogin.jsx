import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, Lock, UserCheck, Sparkles, Key, Building2, ArrowRight, ShieldAlert } from 'lucide-react';
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
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between relative overflow-hidden px-4 selection:bg-orange-500 selection:text-white">
      {/* Tricolor Ribbon */}
      <div className="h-[4px] w-full flex shrink-0 absolute top-0 left-0 right-0 z-50">
        <div className="h-full w-1/3 bg-[#FF9933]"></div>
        <div className="h-full w-1/3 bg-white"></div>
        <div className="h-full w-1/3 bg-[#138808]"></div>
      </div>

      {/* Cyber Background Grid */}
      <div className="absolute inset-0 bg-grid-cyber opacity-30 pointer-events-none"></div>
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-orange-500/10 rounded-full blur-3xl pointer-events-none"></div>

      {/* Header */}
      <header className="p-6 pt-10 relative z-10">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-slate-900 border border-orange-500/40 flex items-center justify-center text-orange-400">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <span className="font-extrabold text-base text-slate-100 block leading-tight">
                कोपरगाव <span className="text-orange-500">नियंत्रण कक्ष</span>
              </span>
              <span className="text-[10px] font-mono uppercase text-slate-400 block">Municipal Control Room</span>
            </div>
          </Link>

          <Link
            to="/"
            className="text-xs font-mono text-slate-400 hover:text-orange-400 transition-colors flex items-center gap-1"
          >
            ← Return to Public Portal
          </Link>
        </div>
      </header>

      {/* Main Login Box */}
      <main className="flex-1 flex items-center justify-center py-10 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-md w-full glass-panel p-8 rounded-3xl border border-orange-500/40 shadow-2xl shadow-orange-950/40"
        >
          <div className="text-center mb-8">
            <div className="w-16 h-16 mx-auto mb-4 bg-orange-950/80 rounded-2xl border border-orange-400/50 flex items-center justify-center text-orange-400 shadow-lg shadow-orange-500/20">
              <ShieldCheck className="w-8 h-8 animate-pulse" />
            </div>
            <h1 className="text-xl font-extrabold text-slate-100 tracking-tight mb-1">
              अधिकारी प्रवेश / OFFICER ACCESS
            </h1>
            <p className="text-xs font-mono text-orange-400 tracking-widest uppercase mb-3">
              SECURED COMMAND CENTER
            </p>
            <div className="p-3 bg-red-950/40 border border-red-500/20 rounded-xl text-[10px] text-red-300 font-mono mb-4 leading-normal text-left">
              ⚠️ Restricted System: Unauthorized entry or attempts are strictly prohibited and liable to prosecution under standard IT Security regulations.
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-xs font-mono text-cyan-300 uppercase tracking-wider mb-2">
                Officer ID
              </label>
              <div className="relative">
                <UserCheck className="w-5 h-5 text-slate-500 absolute left-3.5 top-3.5" />
                <input
                  type="text"
                  value={officerId}
                  onChange={(e) => setOfficerId(e.target.value)}
                  placeholder="Enter Officer ID (e.g. admin)"
                  className="w-full pl-11 pr-4 py-3 bg-slate-900/90 border border-slate-700/80 rounded-xl text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-cyan-400 font-mono text-sm transition-all"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-mono text-cyan-300 uppercase tracking-wider mb-2">
                Access Password
              </label>
              <div className="relative">
                <Lock className="w-5 h-5 text-slate-500 absolute left-3.5 top-3.5" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-11 pr-4 py-3 bg-slate-900/90 border border-slate-700/80 rounded-xl text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-cyan-400 font-mono text-sm transition-all"
                  required
                />
              </div>
            </div>

            <div className="pt-2">
              <button
                type="button"
                onClick={handleFillDemo}
                className="w-full py-2.5 px-4 bg-slate-900 hover:bg-slate-800 border border-orange-500/30 rounded-xl text-xs font-mono text-orange-300 flex items-center justify-center gap-2 transition-all mb-3"
              >
                <Sparkles className="w-4 h-4 text-orange-400" />
                Fill Demo Credentials (admin / admin123)
              </button>

              <button
                type="submit"
                className="w-full py-3.5 px-6 rounded-xl bg-gradient-to-r from-orange-500 to-amber-600 hover:opacity-95 text-white font-extrabold flex items-center justify-center gap-2 shadow-lg shadow-orange-500/20 transition-all text-sm tracking-wide uppercase"
              >
                <Key className="w-4 h-4" />
                Verify & Enter Control Center
              </button>
            </div>
          </form>

          <div className="mt-8 pt-6 border-t border-slate-800 text-center">
            <p className="text-[11px] font-mono text-slate-500 flex items-center justify-center gap-1.5">
              <ShieldAlert className="w-3.5 h-3.5 text-cyan-400" />
              Protected by AI Digital Twin Security Layer
            </p>
          </div>
        </motion.div>
      </main>

      <footer className="p-4 text-center text-[11px] font-mono text-slate-600 relative z-10">
        Kopargaon Municipal Corporation • Smart City Digital Twin Protocol v4.2
      </footer>
    </div>
  );
};
