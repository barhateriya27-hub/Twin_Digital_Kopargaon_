import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { UserCheck, Mail, Lock, Phone, MapPin, Hash, User, Home, CheckCircle2, ShieldAlert, CreditCard, Building, Map } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { LanguageSelector } from '../../components/LanguageSelector';

export const CitizenRegister = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { registerCitizen, showToast } = useApp();

  const [formData, setFormData] = useState({
    fullName: '',
    mobile: '',
    email: '',
    aadhaar: '',
    district: 'Ahilyanagar (Ahmednagar)',
    city: 'Kopargaon',
    address: '',
    wardNumber: '4',
    password: '',
    confirmPassword: ''
  });

  const handleChange = (e) => {
    let value = e.target.value;

    // Formatting mask for Aadhaar: insert space every 4 digits
    if (e.target.name === 'aadhaar') {
      const clean = value.replace(/\D/g, '').slice(0, 12);
      if (clean.length > 8) {
        value = `${clean.slice(0, 4)} ${clean.slice(4, 8)} ${clean.slice(8, 12)}`;
      } else if (clean.length > 4) {
        value = `${clean.slice(0, 4)} ${clean.slice(4, 8)}`;
      } else {
        value = clean;
      }
    }

    setFormData({ ...formData, [e.target.name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Mandatory Validation: District
    const distClean = (formData.district || '').trim().toLowerCase();
    if (!distClean.includes('ahilyanagar') && !distClean.includes('ahmednagar')) {
      showToast(t('citizenAuth.districtConstraint', 'Only Ahilyanagar (Ahmednagar) district residents can create an account!'), 'error');
      return;
    }

    // Mandatory Validation: City
    const cityClean = (formData.city || '').trim().toLowerCase();
    if (!cityClean.includes('kopargaon')) {
      showToast(t('citizenAuth.cityConstraint', 'Only Kopargaon city residents can create an account!'), 'error');
      return;
    }

    // Mandatory Validation: 12-Digit Aadhaar
    const cleanAadhaar = (formData.aadhaar || '').replace(/\D/g, '');
    if (cleanAadhaar.length !== 12) {
      showToast(t('citizenAuth.aadhaarPlaceholder', 'Please enter a valid 12-digit Aadhaar Number!'), 'warning');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      showToast(t('citizenAuth.passwordLabel', 'Passwords do not match!'), 'error');
      return;
    }

    const success = await registerCitizen(formData);
    if (success) {
      navigate('/citizen/dashboard');
    }
  };

  const wards = Array.from({ length: 28 }, (_, i) => i + 1);

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
                {t('citizenAuth.registerTitle', 'Citizen Account Registration')}
              </span>
              <span className="text-[10px] sm:text-xs text-slate-500 dark:text-slate-400 block font-semibold">
                {t('citizenAuth.headerSubtitle', 'Kopargaon Citizen Portal • Govt. of Maharashtra')}
              </span>
            </div>
          </Link>

          <div className="flex items-center gap-3">
            <LanguageSelector variant="topbar" />
            <Link
              to="/"
              className="flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-slate-600 dark:text-slate-300 hover:text-orange-600 transition-colors"
            >
              <Home className="w-4 h-4" />
              {t('citizenAuth.backToHome', 'Back to Home')}
            </Link>
          </div>
        </div>
      </header>

      {/* Main Registration Form */}
      <main className="flex-1 flex items-center justify-center p-4 py-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-2xl w-full bg-white dark:bg-slate-800 rounded-3xl p-6 sm:p-8 border-t-4 border-t-orange-500 border-x border-b border-slate-200 dark:border-slate-700 shadow-xl shadow-slate-200/50"
        >
          <div className="text-center mb-6">
            <div className="w-14 h-14 mx-auto mb-3 bg-orange-50 dark:bg-orange-950/20 rounded-2xl flex items-center justify-center text-orange-600 border border-orange-100 dark:border-orange-900/30">
              <svg viewBox="0 0 100 100" className="w-8 h-8 text-orange-600">
                <circle cx="50" cy="50" r="42" fill="none" stroke="currentColor" strokeWidth="4" />
                <path d="M 35 70 Q 50 25, 65 70 Z" fill="none" stroke="currentColor" strokeWidth="5" />
                <circle cx="50" cy="45" r="8" fill="currentColor" />
              </svg>
            </div>
            <h1 className="text-xl font-black text-slate-900 dark:text-slate-100 mb-1">
              {t('citizenAuth.registerTitle', 'Citizen Account Registration')}
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
              {t('citizenAuth.loginSubtitle', 'Smart City Portal Identity Verification Desk')}
            </p>
          </div>

          {/* Mandatory Governance Advisory */}
          <div className="mb-6 p-3.5 bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 rounded-xl text-xs text-amber-900 dark:text-amber-300 flex items-start gap-2.5 font-sans">
            <ShieldAlert className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <p className="font-bold">Mandatory Qualification Criteria</p>
              <p className="text-[11px] opacity-95">
                Registration is strictly permitted for residents of <strong>{t('citizenAuth.districtConstraint', 'District: Ahilyanagar (Ahmednagar)')}</strong> and <strong>{t('citizenAuth.cityConstraint', 'City: Kopargaon')}</strong> with a valid 12-digit Aadhaar number.
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Full Name */}
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
                {t('citizenAuth.fullNameLabel', 'Full Name *')}
              </label>
              <div className="relative">
                <User className="w-5 h-5 text-slate-400 absolute left-3.5 top-3.5" />
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  placeholder={t('citizenAuth.fullNamePlaceholder', 'e.g. Ramesh Deshmukh')}
                  className="w-full pl-11 pr-4 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-500 text-sm font-semibold"
                  required
                />
              </div>
            </div>

            {/* Aadhaar Number */}
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
                {t('citizenAuth.aadhaarLabel', '12-Digit Aadhaar *')}
              </label>
              <div className="relative">
                <CreditCard className="w-5 h-5 text-slate-400 absolute left-3.5 top-3.5" />
                <input
                  type="text"
                  name="aadhaar"
                  value={formData.aadhaar}
                  onChange={handleChange}
                  placeholder={t('citizenAuth.aadhaarPlaceholder', '1234 5678 9012')}
                  maxLength={14}
                  className="w-full pl-11 pr-4 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-500 text-sm font-mono font-semibold"
                  required
                />
              </div>
            </div>

            {/* Email Address */}
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
                {t('citizenAuth.identifierLabel', 'Email Address *')}
              </label>
              <div className="relative">
                <Mail className="w-5 h-5 text-slate-400 absolute left-3.5 top-3.5" />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="citizen@example.com"
                  className="w-full pl-11 pr-4 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-500 text-sm font-semibold"
                  required
                />
              </div>
            </div>

            {/* Mobile Number */}
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
                {t('citizenAuth.mobileLabel', 'Mobile Number *')}
              </label>
              <div className="relative">
                <Phone className="w-5 h-5 text-slate-400 absolute left-3.5 top-3.5" />
                <input
                  type="tel"
                  name="mobile"
                  value={formData.mobile}
                  onChange={handleChange}
                  placeholder={t('citizenAuth.mobilePlaceholder', '+91 98765 43210')}
                  className="w-full pl-11 pr-4 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-500 text-sm font-semibold"
                  required
                />
              </div>
            </div>

            {/* District (Mandatory Locked Field) */}
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
                {t('citizenAuth.districtLabel', 'District (Mandatory) *')}
              </label>
              <div className="relative">
                <Map className="w-5 h-5 text-slate-400 absolute left-3.5 top-3.5" />
                <select
                  name="district"
                  value={formData.district}
                  onChange={handleChange}
                  className="w-full pl-11 pr-4 py-3 bg-slate-100 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-slate-100 focus:outline-none text-sm font-bold cursor-pointer"
                  required
                >
                  <option value="Ahilyanagar (Ahmednagar)">Ahilyanagar (Ahmednagar) [Required]</option>
                </select>
              </div>
            </div>

            {/* City (Mandatory Locked Field) */}
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
                {t('citizenAuth.cityLabel', 'City (Mandatory) *')}
              </label>
              <div className="relative">
                <Building className="w-5 h-5 text-slate-400 absolute left-3.5 top-3.5" />
                <select
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  className="w-full pl-11 pr-4 py-3 bg-slate-100 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-slate-100 focus:outline-none text-sm font-bold cursor-pointer"
                  required
                >
                  <option value="Kopargaon">Kopargaon Municipal Corporation [Required]</option>
                </select>
              </div>
            </div>

            {/* Ward Number */}
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
                {t('citizenAuth.wardLabel', 'Ward Number *')}
              </label>
              <div className="relative">
                <Hash className="w-5 h-5 text-slate-400 absolute left-3.5 top-3.5" />
                <select
                  name="wardNumber"
                  value={formData.wardNumber}
                  onChange={handleChange}
                  className="w-full pl-11 pr-4 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-orange-500 text-sm font-semibold cursor-pointer"
                  required
                >
                  {wards.map(w => (
                    <option key={w} value={w}>Ward {w}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Residential Address */}
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
                {t('citizenAuth.addressLabel', 'Address *')}
              </label>
              <div className="relative">
                <MapPin className="w-5 h-5 text-slate-400 absolute left-3.5 top-3.5" />
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  placeholder={t('citizenAuth.addressPlaceholder', 'House No, Street Name, Kopargaon - 423601')}
                  className="w-full pl-11 pr-4 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-500 text-sm font-semibold"
                  required
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
                {t('citizenAuth.passwordLabel', 'Password *')}
              </label>
              <div className="relative">
                <Lock className="w-5 h-5 text-slate-400 absolute left-3.5 top-3.5" />
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className="w-full pl-11 pr-4 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-500 text-sm font-semibold"
                  required
                />
              </div>
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
                {t('citizenAuth.passwordLabel', 'Confirm Password *')}
              </label>
              <div className="relative">
                <Lock className="w-5 h-5 text-slate-400 absolute left-3.5 top-3.5" />
                <input
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className="w-full pl-11 pr-4 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-500 text-sm font-semibold"
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
                {t('citizenAuth.createAccBtn', 'Complete Citizen Registration')}
              </button>
            </div>
          </form>

          <div className="mt-6 text-center pt-6 border-t border-slate-100 dark:border-slate-800 font-semibold text-xs">
            <p className="text-slate-600 dark:text-slate-300">
              <Link to="/citizen/login" className="font-bold text-orange-600 hover:underline">
                {t('citizenAuth.alreadyAcc', 'Already have an account? Sign In')}
              </Link>
            </p>
          </div>
        </motion.div>
      </main>

      <footer className="py-4 text-center text-xs text-slate-500 dark:text-slate-400 border-t border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 shrink-0">
        {t('footer.disclaimer', 'Kopargaon Municipal Council • Citizen Helpline: 1800-233-1042 | support@kopargaon.gov.in')}
      </footer>
    </div>
  );
};
