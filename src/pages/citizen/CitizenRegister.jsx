import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { UserCheck, Mail, Lock, Phone, MapPin, Hash, User, Home, CheckCircle2, ShieldAlert } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import { useApp } from '../../context/AppContext';

export const CitizenRegister = () => {
  const navigate = useNavigate();
  const { registerCitizen, showToast } = useApp();

  const [formData, setFormData] = useState({
    fullName: '',
    mobile: '',
    email: '',
    address: '',
    wardNumber: '4',
    password: '',
    confirmPassword: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      showToast('Passwords do not match / संकेतशब्द जुळत नाहीत!', 'error');
      return;
    }

    const success = registerCitizen(formData);
    if (success) {
      navigate('/citizen/dashboard');
    }
  };

  const wards = Array.from({ length: 28 }, (_, i) => i + 1);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col justify-between selection:bg-orange-500 selection:text-white">
      
      {/* Tricolor Ribbon */}
      <div className="h-[4px] w-full flex shrink-0">
        <div className="h-full w-1/3 bg-[#FF9933]"></div>
        <div className="h-full w-1/3 bg-white"></div>
        <div className="h-full w-1/3 bg-[#138808]"></div>
      </div>

      {/* Official Light Header */}
      <header className="bg-white border-b border-slate-200 py-3.5 px-6 shadow-sm shrink-0">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-orange-500 flex items-center justify-center text-white shadow-md shadow-orange-500/20">
              <UserCheck className="w-5 h-5" />
            </div>
            <div>
              <span className="font-extrabold text-base text-slate-900 block leading-tight">
                कोपरगाव <span className="text-orange-600">नागरिक नोंदणी</span>
              </span>
              <span className="text-[10px] sm:text-xs text-slate-500 block font-semibold">
                Kopargaon Citizen Portal • Govt. of Maharashtra
              </span>
            </div>
          </Link>

          <Link
            to="/"
            className="flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-slate-600 hover:text-orange-600 transition-colors"
          >
            <Home className="w-4 h-4" />
            मुख्यपृष्ठ / Back to Home
          </Link>
        </div>
      </header>

      {/* Main Form */}
      <main className="flex-1 flex items-center justify-center p-4 py-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-2xl w-full bg-white rounded-3xl p-8 border-t-4 border-t-orange-500 border-x border-b border-slate-200 shadow-xl shadow-slate-200/50"
        >
          <div className="text-center mb-8">
            <div className="w-14 h-14 mx-auto mb-3 bg-orange-50 rounded-2xl flex items-center justify-center text-orange-600 border border-orange-100">
              {/* State Emblem/Seal Stylized Silhouette */}
              <svg viewBox="0 0 100 100" className="w-8 h-8 text-orange-600">
                <circle cx="50" cy="50" r="42" fill="none" stroke="currentColor" strokeWidth="4" />
                <path d="M 35 70 Q 50 25, 65 70 Z" fill="none" stroke="currentColor" strokeWidth="5" />
                <circle cx="50" cy="45" r="8" fill="currentColor" />
              </svg>
            </div>
            <h1 className="text-xl font-black text-slate-900 mb-1">नवीन खाते नोंदणी / Citizen Registration</h1>
            <p className="text-xs text-slate-500 font-medium">Smart City Portal Registration desk</p>
          </div>

          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Full Name */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                पूर्ण नाव / Full Name
              </label>
              <div className="relative">
                <User className="w-5 h-5 text-slate-400 absolute left-3.5 top-3.5" />
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  placeholder="उदा. रमेश देशमुख / Ramesh Deshmukh"
                  className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:bg-white transition-all text-sm font-semibold"
                  required
                />
              </div>
            </div>

            {/* Mobile Number */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                मोबाईल क्रमांक / Mobile Number
              </label>
              <div className="relative">
                <Phone className="w-5 h-5 text-slate-400 absolute left-3.5 top-3.5" />
                <input
                  type="tel"
                  name="mobile"
                  value={formData.mobile}
                  onChange={handleChange}
                  placeholder="+91 98765 43210"
                  className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:bg-white transition-all text-sm font-semibold"
                  required
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                ईमेल पत्ता / Email Address
              </label>
              <div className="relative">
                <Mail className="w-5 h-5 text-slate-400 absolute left-3.5 top-3.5" />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="citizen@example.com"
                  className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:bg-white transition-all text-sm font-semibold"
                  required
                />
              </div>
            </div>

            {/* Ward Number */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                प्रभाग क्रमांक / Ward Number
              </label>
              <div className="relative">
                <Hash className="w-5 h-5 text-slate-400 absolute left-3.5 top-3.5" />
                <select
                  name="wardNumber"
                  value={formData.wardNumber}
                  onChange={handleChange}
                  className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:bg-white transition-all text-sm font-semibold appearance-none cursor-pointer"
                  required
                >
                  {wards.map(w => (
                    <option key={w} value={w}>प्रभाग {w} (Ward {w})</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Address */}
            <div className="md:col-span-2">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                रहिवासी पत्ता / Residential Address
              </label>
              <div className="relative">
                <MapPin className="w-5 h-5 text-slate-400 absolute left-3.5 top-3.5" />
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  placeholder="गल्ली, रस्ता, लँडमार्क, कोपरगाव - ४२३६०१"
                  className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:bg-white transition-all text-sm font-semibold"
                  required
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                संकेतशब्द / Password
              </label>
              <div className="relative">
                <Lock className="w-5 h-5 text-slate-400 absolute left-3.5 top-3.5" />
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:bg-white transition-all text-sm font-semibold"
                  required
                />
              </div>
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                संकेतशब्द पुष्टीकरण / Confirm Password
              </label>
              <div className="relative">
                <Lock className="w-5 h-5 text-slate-400 absolute left-3.5 top-3.5" />
                <input
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:bg-white transition-all text-sm font-semibold"
                  required
                />
              </div>
            </div>

            <div className="md:col-span-2 pt-3">
              <button
                type="submit"
                className="w-full py-4 px-6 bg-orange-600 hover:bg-orange-700 text-white font-bold rounded-xl shadow-lg shadow-orange-600/20 transition-all flex items-center justify-center gap-2 text-sm uppercase tracking-wide"
              >
                <CheckCircle2 className="w-4 h-4" />
                नोंदणी पूर्ण करा / Register Account
              </button>
            </div>
          </form>

          <div className="mt-6 text-center pt-6 border-t border-slate-100 font-semibold text-xs">
            <p className="text-slate-600">
              आधीच नोंदणी केली आहे?{' '}
              <Link to="/citizen/login" className="font-bold text-orange-600 hover:underline">
                येथे लॉगिन करा / Sign In Here
              </Link>
            </p>
          </div>
        </motion.div>
      </main>

      <footer className="py-4 text-center text-xs text-slate-500 border-t border-slate-200 bg-white shrink-0">
        कोपरगाव नगरपरिषद • नागरी सेवा हेल्पलाईन: 1800-233-1042 | support@kopargaon.gov.in
      </footer>
    </div>
  );
};
