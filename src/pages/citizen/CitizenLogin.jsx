import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { UserCheck, Mail, Lock, ArrowRight, Home, Sparkles, LogIn } from 'lucide-react';
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
      showToast('Please enter both email and password', 'warning');
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
    showToast('Demo Credentials Loaded', 'info');
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col justify-between selection:bg-sky-500 selection:text-white">
      {/* Light Header */}
      <header className="bg-white border-b border-slate-200 py-4 px-6 shadow-sm">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-sky-600 flex items-center justify-center text-white shadow-md shadow-sky-600/30">
              <UserCheck className="w-5 h-5" />
            </div>
            <div>
              <span className="font-extrabold text-lg text-slate-900 block leading-tight">
                Kopargaon <span className="text-sky-600">Citizen Portal</span>
              </span>
              <span className="text-xs text-slate-500 block font-medium">Smart City Grievance Redressal</span>
            </div>
          </Link>

          <Link
            to="/"
            className="flex items-center gap-1.5 text-sm font-semibold text-slate-600 hover:text-sky-600 transition-colors"
          >
            <Home className="w-4 h-4" />
            Back to Home
          </Link>
        </div>
      </header>

      {/* Main Login Form */}
      <main className="flex-1 flex items-center justify-center p-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-md w-full bg-white rounded-3xl p-8 border border-slate-200/80 shadow-xl shadow-slate-200/50"
        >
          <div className="text-center mb-8">
            <div className="w-16 h-16 mx-auto mb-4 bg-sky-50 rounded-2xl flex items-center justify-center text-sky-600 border border-sky-100">
              <UserCheck className="w-8 h-8" />
            </div>
            <h1 className="text-2xl font-bold text-slate-900 mb-1">Citizen Portal Login</h1>
            <p className="text-sm text-slate-500">Access grievance reporting and live tracking</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
                Email Address
              </label>
              <div className="relative">
                <Mail className="w-5 h-5 text-slate-400 absolute left-3.5 top-3.5" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:bg-white transition-all text-sm"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="w-5 h-5 text-slate-400 absolute left-3.5 top-3.5" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:bg-white transition-all text-sm"
                  required
                />
              </div>
            </div>

            <div className="flex items-center justify-between text-xs pt-1">
              <button
                type="button"
                onClick={handleDemoFill}
                className="text-sky-600 font-semibold hover:underline flex items-center gap-1"
              >
                <Sparkles className="w-3.5 h-3.5" /> Auto-fill Demo Account
              </button>
              <a href="#forgot" onClick={(e) => { e.preventDefault(); showToast('Password reset link sent to demo email', 'info'); }} className="text-slate-500 hover:text-slate-700">
                Forgot password?
              </a>
            </div>

            <div className="space-y-3 pt-2">
              <button
                type="submit"
                className="w-full py-3.5 px-4 bg-sky-600 hover:bg-sky-700 text-white font-bold rounded-xl shadow-lg shadow-sky-600/25 transition-all flex items-center justify-center gap-2"
              >
                <LogIn className="w-5 h-5" />
                Login to Portal
              </button>

              <button
                type="button"
                onClick={() => navigate('/citizen/register')}
                className="w-full py-3.5 px-4 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 font-semibold rounded-xl transition-all"
              >
                Create New Account
              </button>
            </div>
          </form>

          <div className="mt-8 text-center pt-6 border-t border-slate-100">
            <p className="text-sm text-slate-600">
              Don't have an account?{' '}
              <Link to="/citizen/register" className="font-bold text-sky-600 hover:underline">
                Register Here
              </Link>
            </p>
          </div>
        </motion.div>
      </main>

      <footer className="py-4 text-center text-xs text-slate-500 border-t border-slate-200 bg-white">
        Kopargaon Municipal Corporation • Citizen Service Grievance Helpline: 1800-233-1042
      </footer>
    </div>
  );
};
