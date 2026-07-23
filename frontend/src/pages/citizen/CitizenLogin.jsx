import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { UserCheck, Mail, Lock, ArrowRight, Home, Sparkles, LogIn, ShieldAlert } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import { useApp } from '../../context/AppContext';

export const CitizenLogin = () => {
  const navigate = useNavigate();
  const { loginCitizen, showToast } = useApp();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email || !password) {
      showToast('Please enter both email and password / कृपया ईमेल आणि संकेतशब्द दोन्ही प्रविष्ट करा', 'warning');
      return;
    }
    const success = loginCitizen(email, password);
    if (success) {
      navigate('/citizen/dashboard');
    }
  };

  const handleDemoFill = () => {
    setEmail('citizen@kopargaon.gov.in');
    setPassword('citizen123');
    showToast('Demo Credentials Loaded / डेमो क्रेडेंशियल्स लोड केले', 'info');
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-200 flex flex-col justify-between selection:bg-[#F97316] selection:text-white">
      
      {/* Tricolor Ribbon */}
      <div className="h-[4px] w-full flex shrink-0">
        <div className="h-full w-1/3 bg-[#FF9933]"></div>
        <div className="h-full w-1/3 bg-white dark:bg-slate-800"></div>
        <div className="h-full w-1/3 bg-[#138808]"></div>
      </div>

      {/* Official Light Header */}
      <header className="bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 py-3.5 px-6 shadow-sm shrink-0">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#F97316] flex items-center justify-center text-white shadow-md shadow-orange-500/20">
              <UserCheck className="w-5 h-5" />
            </div>
            <div>
              <span className="font-extrabold text-base text-slate-900 dark:text-slate-100 block leading-tight">
                कोपरगाव <span className="text-orange-600">नागरिक पोर्टल</span>
              </span>
              <span className="text-[10px] sm:text-xs text-slate-500 dark:text-slate-400 block font-semibold">
                Kopargaon Citizen Portal • Govt. of Maharashtra
              </span>
            </div>
          </Link>

          <Link
            to="/"
            className="flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-slate-600 dark:text-slate-300 hover:text-orange-600 transition-colors"
          >
            <Home className="w-4 h-4" />
            मुख्यपृष्ठ / Back to Home
          </Link>
        </div>
      </header>

      {/* Main Login Form */}
      <main className="flex-1 flex items-center justify-center p-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-md w-full bg-white dark:bg-slate-800 rounded-3xl p-8 border-t-4 border-t-orange-500 border-x border-b border-slate-200 dark:border-slate-700 shadow-xl shadow-slate-200/50"
        >
          <div className="text-center mb-8">
            <div className="w-14 h-14 mx-auto mb-4 bg-orange-50 dark:bg-orange-950/20 rounded-2xl flex items-center justify-center text-orange-600 border border-orange-100 dark:border-orange-900/30">
              {/* State Emblem/Seal Stylized Silhouette */}
              <svg viewBox="0 0 100 100" className="w-8 h-8 text-orange-600">
                <circle cx="50" cy="50" r="42" fill="none" stroke="currentColor" strokeWidth="4" />
                <path d="M 35 70 Q 50 25, 65 70 Z" fill="none" stroke="currentColor" strokeWidth="5" />
                <circle cx="50" cy="45" r="8" fill="currentColor" />
              </svg>
            </div>
            <h1 className="text-xl font-black text-slate-900 dark:text-slate-100 mb-1">नागरिक लॉगिन / Citizen Login</h1>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Smart City Grievance Redressal & Services</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
                ईमेल पत्ता / Email Address
              </label>
              <div className="relative">
                <Mail className="w-5 h-5 text-slate-400 absolute left-3.5 top-3.5" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full pl-11 pr-4 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:bg-white dark:focus:bg-slate-800 dark:bg-slate-800 transition-all text-sm font-semibold"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
                संकेतशब्द / Password
              </label>
              <div className="relative">
                <Lock className="w-5 h-5 text-slate-400 absolute left-3.5 top-3.5" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-11 pr-4 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:bg-white dark:focus:bg-slate-800 dark:bg-slate-800 transition-all text-sm font-semibold"
                  required
                />
              </div>
            </div>

            <div className="flex items-center justify-between text-xs pt-1 font-semibold">
              <button
                type="button"
                onClick={handleDemoFill}
                className="text-orange-600 hover:text-orange-700 flex items-center gap-1"
              >
                <Sparkles className="w-3.5 h-3.5" /> डेमो लॉगिन / Auto-fill Demo
              </button>
              <a href="#forgot" onClick={(e) => { e.preventDefault(); showToast('Password reset link sent to demo email', 'info'); }} className="text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:text-slate-300">
                पासवर्ड विसरलात? / Forgot?
              </a>
            </div>

            <div className="space-y-3 pt-2">
              <button
                type="submit"
                className="w-full py-3.5 px-4 bg-orange-600 hover:bg-orange-700 text-white font-bold rounded-xl shadow-lg shadow-orange-600/20 transition-all flex items-center justify-center gap-2 text-sm uppercase tracking-wide"
              >
                <LogIn className="w-4 h-4" />
                लॉगिन करा / Sign In
              </button>

              <button
                type="button"
                onClick={() => navigate('/citizen/register')}
                className="w-full py-3.5 px-4 bg-slate-100 dark:bg-slate-900/50 hover:bg-slate-200 text-slate-800 dark:text-slate-200 border border-slate-300 dark:border-slate-600 font-bold rounded-xl transition-all text-sm uppercase tracking-wide"
              >
                नवीन नोंदणी / Register Account
              </button>
            </div>
          </form>

          <div className="mt-8 text-center pt-6 border-t border-slate-100 dark:border-slate-800 font-semibold text-xs">
            <p className="text-slate-500 dark:text-slate-400 flex items-center justify-center gap-1">
              <ShieldAlert className="w-3.5 h-3.5 text-orange-500" />
              महाराष्ट्र शासन डिजिटल सेवा सुरक्षितता मानके
            </p>
          </div>
        </motion.div>
      </main>

      <footer className="py-4 text-center text-xs text-slate-500 dark:text-slate-400 border-t border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 shrink-0">
        कोपरगाव नगरपरिषद • नागरी सेवा हेल्पलाईन: 1800-233-1042 | support@kopargaon.gov.in
      </footer>
    </div>
  );
};
