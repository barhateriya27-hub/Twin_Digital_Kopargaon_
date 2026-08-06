import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { ShieldCheck, Lock, UserCheck, Sparkles, Key, Building2, Home, ShieldAlert, KeyRound, CheckCircle } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { LanguageSelector } from '../../components/LanguageSelector';

export const MunicipalityLogin = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { loginOfficer, verifyMfa, showToast } = useApp();

  const [officerId, setOfficerId] = useState('');
  const [password, setPassword] = useState('');

  // MFA 2FA State
  const [mfaPending, setMfaPending] = useState(null); // { mfaToken, demoMfaCode }
  const [mfaCode, setMfaCode] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!officerId || !password) {
      showToast(t('officerAuth.idLabel', 'Please provide Officer ID and Password'), 'warning');
      return;
    }

    const result = await loginOfficer(officerId, password);
    if (result && typeof result === 'object' && result.mfaRequired) {
      setMfaPending(result);
      setMfaCode(result.demoMfaCode || '');
      showToast('Mandatory 2FA OTP code issued.', 'info');
    } else if (result === true) {
      navigate('/municipality/dashboard');
    }
  };

  const handleMfaSubmit = async (e) => {
    e.preventDefault();
    if (!mfaCode || mfaCode.length !== 6) {
      showToast('Please enter a valid 6-digit MFA OTP code.', 'warning');
      return;
    }

    const success = await verifyMfa(mfaPending.mfaToken, mfaCode);
    if (success) {
      navigate('/municipality/dashboard');
    }
  };

  const handleFillStaffDemo = () => {
    setOfficerId('kpg');
    setPassword('kpg@123');
    showToast('Staff Credentials Loaded (Sanitation Dept)', 'info');
  };

  const handleFillAdminDemo = () => {
    setOfficerId('admin');
    setPassword('admin123');
    showToast('Admin Credentials Loaded (Commissioner)', 'info');
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0B0F17] text-slate-800 dark:text-slate-100 flex flex-col justify-between selection:bg-slate-900 selection:text-white">
      
      {/* Official Government Tricolor Header Stripe */}
      <div className="h-1 w-full flex shrink-0">
        <div className="h-full w-1/3 bg-[#FF9933]"></div>
        <div className="h-full w-1/3 bg-white dark:bg-slate-700"></div>
        <div className="h-full w-1/3 bg-[#138808]"></div>
      </div>

      {/* Top Header */}
      <header className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 py-3.5 px-6 shrink-0 shadow-xs">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-[#0A2540] dark:bg-slate-800 flex items-center justify-center text-white border border-slate-800">
              <Building2 className="w-5 h-5 text-slate-100" />
            </div>
            <div>
              <span className="font-bold text-sm text-slate-900 dark:text-slate-100 block leading-tight tracking-tight">
                {t('header.title', 'KOPARGAON MUNICIPAL COUNCIL')}
              </span>
              <span className="text-[11px] text-slate-500 dark:text-slate-400 block font-medium">
                {t('header.subtitle', 'Government of Maharashtra • Smart City Command Center')}
              </span>
            </div>
          </Link>

          <div className="flex items-center gap-3">
            <LanguageSelector variant="topbar" />
            <Link
              to="/"
              className="flex items-center gap-1.5 text-xs font-semibold text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 transition-colors"
            >
              <Home className="w-4 h-4" />
              {t('citizenAuth.backToHome', 'Return to Portal Home')}
            </Link>
          </div>
        </div>
      </header>

      {/* Login Main Content */}
      <main className="flex-1 flex items-center justify-center p-4 py-10">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-md w-full bg-white dark:bg-slate-900 rounded-xl p-8 border border-slate-200 dark:border-slate-800 shadow-sm"
        >
          
          <div className="text-center mb-6">
            <div className="w-12 h-12 mx-auto mb-3 bg-slate-100 dark:bg-slate-800 rounded-lg flex items-center justify-center text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
              <ShieldCheck className="w-6 h-6 text-[#0A2540] dark:text-sky-400" />
            </div>
            <h1 className="text-lg font-bold text-slate-900 dark:text-slate-100 tracking-tight mb-0.5">
              {mfaPending ? 'Mandatory 2FA Security Challenge' : t('officerAuth.title', 'Officer Administration Sign-In')}
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {mfaPending ? 'Multi-Factor Authentication Required for Staff/Admin Access' : t('officerAuth.subtitle', 'Municipal Operations & Digital Twin Command Center')}
            </p>

            {!mfaPending && (
              <div className="p-3 bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/40 rounded-lg text-left text-[11px] text-amber-800 dark:text-amber-300 mt-4 leading-normal font-medium">
                <span className="font-semibold block mb-0.5">⚠️ {t('officerAuth.restrictedNotice', 'Restricted Government Portal Access')}</span>
                {t('officerAuth.restrictedNotice', 'Authorized access only. Use official Municipal Officer ID and Access Password.')}
              </div>
            )}
          </div>

          {/* PHASE 1: ID & Password */}
          {!mfaPending ? (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                  {t('officerAuth.idLabel', 'Officer Identifier (ID)')}
                </label>
                <div className="relative">
                  <UserCheck className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                  <input
                    type="text"
                    value={officerId}
                    onChange={(e) => setOfficerId(e.target.value)}
                    placeholder={t('officerAuth.idPlaceholder', 'Enter Officer ID (e.g. kpg or admin)')}
                    className="w-full pl-10 pr-3 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg text-slate-900 dark:text-slate-100 placeholder:text-slate-400 text-xs font-medium focus:outline-none focus:ring-1 focus:ring-slate-400 dark:focus:ring-slate-600 transition-all"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                  {t('officerAuth.passLabel', 'Authentication Password')}
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder={t('officerAuth.passPlaceholder', '••••••••')}
                    className="w-full pl-10 pr-3 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg text-slate-900 dark:text-slate-100 placeholder:text-slate-400 text-xs font-medium focus:outline-none focus:ring-1 focus:ring-slate-400 dark:focus:ring-slate-600 transition-all"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2 pt-2">
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={handleFillStaffDemo}
                    className="py-2 px-3 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 rounded-lg text-[11px] font-semibold text-slate-700 dark:text-slate-300 flex items-center justify-center gap-1.5 transition-all"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                    Staff Demo (kpg)
                  </button>

                  <button
                    type="button"
                    onClick={handleFillAdminDemo}
                    className="py-2 px-3 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 rounded-lg text-[11px] font-semibold text-slate-700 dark:text-slate-300 flex items-center justify-center gap-1.5 transition-all"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-orange-600" />
                    Admin Demo (admin)
                  </button>
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 px-4 rounded-lg bg-[#0A2540] hover:bg-slate-800 text-white font-semibold flex items-center justify-center gap-2 shadow-xs transition-all text-xs tracking-wide uppercase"
                >
                  <Key className="w-3.5 h-3.5" />
                  {t('officerAuth.accessBtn', 'Authenticate & Access Control Room')}
                </button>
              </div>
            </form>
          ) : (
            /* PHASE 2: MFA 2FA OTP Code Verification */
            <form onSubmit={handleMfaSubmit} className="space-y-4">
              <div className="p-3 bg-sky-50 dark:bg-sky-950/30 border border-sky-200 dark:border-sky-900/40 rounded-lg text-[11px] text-sky-800 dark:text-sky-300 font-medium">
                <span className="font-semibold block mb-0.5">🔒 Step 2: Enter 6-digit MFA OTP</span>
                A secure verification code has been dispatched to your registered officer device.
                {mfaPending.demoMfaCode && (
                  <span className="block mt-1 font-bold text-sky-600 dark:text-sky-400">
                    [Demo Code: {mfaPending.demoMfaCode}]
                  </span>
                )}
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                  6-Digit MFA Verification Code *
                </label>
                <div className="relative">
                  <KeyRound className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                  <input
                    type="text"
                    maxLength={6}
                    value={mfaCode}
                    onChange={(e) => setMfaCode(e.target.value.replace(/\D/g, ''))}
                    placeholder="Enter 6 digits (e.g. 123456)"
                    className="w-full pl-10 pr-3 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg text-slate-900 dark:text-slate-100 placeholder:text-slate-400 text-sm font-bold tracking-widest text-center focus:outline-none focus:ring-1 focus:ring-sky-500 transition-all"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2 pt-2">
                <button
                  type="submit"
                  className="w-full py-2.5 px-4 rounded-lg bg-sky-600 hover:bg-sky-700 text-white font-semibold flex items-center justify-center gap-2 shadow-md shadow-sky-600/20 transition-all text-xs tracking-wide uppercase"
                >
                  <CheckCircle className="w-4 h-4" />
                  Verify 2FA Security Code
                </button>

                <button
                  type="button"
                  onClick={() => setMfaPending(null)}
                  className="w-full py-2 px-3 text-xs font-semibold text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 transition-colors"
                >
                  ← Back to Officer Sign-in
                </button>
              </div>
            </form>
          )}

          <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 text-center">
            <p className="text-[11px] font-medium text-slate-500 dark:text-slate-400 flex items-center justify-center gap-1.5">
              <ShieldAlert className="w-3.5 h-3.5 text-slate-400" />
              {t('officerAuth.gatewayFooter', 'Kopargaon Municipal Corporation Administrative Gateway')}
            </p>
          </div>
        </motion.div>
      </main>

      <footer className="py-3 text-center text-xs text-slate-500 dark:text-slate-400 border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shrink-0">
        {t('footer.disclaimer', 'Kopargaon Municipal Council • Municipal Helpline: 1800-233-1042 | support@kopargaon.gov.in')}
      </footer>
    </div>
  );
};
