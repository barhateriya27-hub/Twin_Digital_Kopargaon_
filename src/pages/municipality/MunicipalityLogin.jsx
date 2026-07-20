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
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between relative overflow-hidden px-4 selection:bg-cyan-500 selection:text-slate-950">
      {/* Cyber Background Grid */}
      <div className="absolute inset-0 bg-grid-cyber opacity-30 pointer-events-none"></div>
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-cyan-500/10 rounded-full blur-3xl pointer-events-none"></div>

      {/* Header */}
      <header className="p-6 relative z-10">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-slate-900 border border-cyan-400/40 flex items-center justify-center text-cyan-400">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <span className="font-extrabold text-base text-slate-100 block leading-tight">
                KOPARGAON <span className="text-cyan-400">CONTROL ROOM</span>
              </span>
              <span className="text-[10px] font-mono uppercase text-cyan-500/80 block">Municipal Corporation</span>
            </div>
          </Link>

          <Link
            to="/"
            className="text-xs font-mono text-slate-400 hover:text-cyan-400 transition-colors flex items-center gap-1"
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
          className="max-w-md w-full glass-panel p-8 rounded-3xl border border-cyan-500/40 shadow-2xl shadow-cyan-950/40"
        >
          <div className="text-center mb-8">
            <div className="w-16 h-16 mx-auto mb-4 bg-cyan-950/80 rounded-2xl border border-cyan-400/50 flex items-center justify-center text-cyan-400 shadow-lg shadow-cyan-500/20">
              <ShieldCheck className="w-8 h-8 animate-pulse" />
            </div>
            <h1 className="text-2xl font-extrabold text-slate-100 tracking-tight mb-1">
              MUNICIPALITY CONTROL ACCESS
            </h1>
            <p className="text-xs font-mono text-cyan-400 tracking-widest uppercase">
              Authorized Personnel Only
            </p>
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
                className="w-full py-2.5 px-4 bg-cyan-950/60 hover:bg-cyan-900/80 border border-cyan-500/30 rounded-xl text-xs font-mono text-cyan-300 flex items-center justify-center gap-2 transition-all mb-3"
              >
                <Sparkles className="w-4 h-4 text-cyan-400" />
                Fill Demo Credentials (admin / admin123)
              </button>

              <button
                type="submit"
                className="w-full py-3.5 px-6 rounded-xl bg-gradient-to-r from-cyan-500 via-blue-600 to-purple-600 hover:opacity-95 text-slate-950 font-extrabold flex items-center justify-center gap-2 shadow-lg shadow-cyan-500/25 transition-all text-sm tracking-wide uppercase"
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
