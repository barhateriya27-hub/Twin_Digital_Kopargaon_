import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { X, Lock, Mail, ShieldCheck, CheckCircle2, KeyRound, ArrowRight } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const ForgotPasswordModal = ({ isOpen, onClose }) => {
  const { t } = useTranslation();
  const { registeredCitizens = [], resetCitizenPassword, showToast } = useApp();

  const [step, setStep] = useState(1);
  const [identifier, setIdentifier] = useState('');
  const [foundUser, setFoundUser] = useState(null);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleVerifyUser = (e) => {
    e.preventDefault();
    if (!identifier.trim()) {
      showToast('Please enter your registered Email Address or Aadhaar Number', 'warning');
      return;
    }

    const cleanInput = identifier.trim().toLowerCase();
    const cleanDigits = identifier.replace(/\D/g, '');

    const match = registeredCitizens.find(c => {
      const matchEmail = c.email && c.email.toLowerCase() === cleanInput;
      const matchAadhaar = c.aadhaar && c.aadhaar.replace(/\D/g, '') === cleanDigits && cleanDigits.length === 12;
      return matchEmail || matchAadhaar;
    });

    if (!match) {
      showToast('No registered citizen account found matching provided Email/Aadhaar in Kopargaon database.', 'error');
      return;
    }

    setFoundUser(match);
    setStep(2);
    showToast(`Identity verified for ${match.name}! Set your new password.`, 'success');
  };

  const handleResetPasswordSubmit = (e) => {
    e.preventDefault();
    if (!newPassword || newPassword.length < 6) {
      showToast('New password must be at least 6 characters long.', 'warning');
      return;
    }
    if (newPassword !== confirmPassword) {
      showToast('Passwords do not match!', 'error');
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      const success = resetCitizenPassword(foundUser.email || foundUser.aadhaar, newPassword);
      setIsSubmitting(false);
      if (success) {
        setStep(3);
      }
    }, 600);
  };

  const handleCloseModal = () => {
    setStep(1);
    setIdentifier('');
    setFoundUser(null);
    setNewPassword('');
    setConfirmPassword('');
    onClose();
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/70 backdrop-blur-md overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="bg-white dark:bg-slate-800 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-700 w-full max-w-md overflow-hidden my-auto p-6 sm:p-8 space-y-5"
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-700 pb-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-orange-100 dark:bg-orange-950/40 text-orange-600 flex items-center justify-center font-bold">
                <KeyRound className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-base font-extrabold text-slate-900 dark:text-slate-100">
                  {t('citizenAuth.forgotPassword', 'Password Reset')}
                </h3>
                <p className="text-[11px] text-slate-500 font-semibold">
                  {t('sidebar.title', 'Kopargaon Citizen Portal Identity Verification')}
                </p>
              </div>
            </div>

            <button
              onClick={handleCloseModal}
              className="p-1 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Step 1: Identify Account */}
          {step === 1 && (
            <form onSubmit={handleVerifyUser} className="space-y-4 text-xs font-semibold">
              <div className="p-3 bg-slate-50 dark:bg-slate-900/60 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300">
                <p className="font-bold text-slate-800 dark:text-slate-100 mb-0.5">Account Verification Required</p>
                <p className="text-[11px] font-normal leading-relaxed">
                  Enter your registered Email Address or 12-digit Aadhaar Number to verify identity.
                </p>
              </div>

              <div>
                <label className="block text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5 text-[11px]">
                  {t('citizenAuth.identifierLabel', 'Email or Aadhaar Number *')}
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
                  <input
                    type="text"
                    required
                    value={identifier}
                    onChange={(e) => setIdentifier(e.target.value)}
                    placeholder={t('citizenAuth.identifierPlaceholder', 'citizen@example.com OR 1234 5678 9012')}
                    className="w-full pl-9 pr-3 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-orange-500 font-mono text-xs"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-orange-600 hover:bg-orange-700 text-white font-bold rounded-xl shadow-md transition-all flex items-center justify-center gap-2 text-xs uppercase tracking-wide"
              >
                <span>Verify Account Identity</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          )}

          {/* Step 2: Enter New Password */}
          {step === 2 && foundUser && (
            <form onSubmit={handleResetPasswordSubmit} className="space-y-4 text-xs font-semibold">
              <div className="p-3 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 rounded-xl text-emerald-800 dark:text-emerald-300 flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0" />
                <div>
                  <p className="font-bold">Identity Confirmed: {foundUser.name}</p>
                  <p className="text-[11px] opacity-90 font-mono">Ward {foundUser.ward} • {foundUser.district}</p>
                </div>
              </div>

              <div>
                <label className="block text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5 text-[11px]">
                  {t('citizenAuth.passwordLabel', 'New Password *')}
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
                  <input
                    type="password"
                    required
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-9 pr-3 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-orange-500 text-xs font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5 text-[11px]">
                  Confirm New Password *
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
                  <input
                    type="password"
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-9 pr-3 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-orange-500 text-xs font-mono"
                  />
                </div>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="px-4 py-2.5 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 font-bold rounded-xl text-xs"
                >
                  Back
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 py-2.5 bg-orange-600 hover:bg-orange-700 text-white font-bold rounded-xl shadow-md transition-all flex items-center justify-center gap-2 text-xs uppercase tracking-wide disabled:opacity-50"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>{isSubmitting ? 'Updating Password...' : 'Save New Password'}</span>
                </button>
              </div>
            </form>
          )}

          {/* Step 3: Success Confirmation */}
          {step === 3 && (
            <div className="text-center py-4 space-y-4">
              <div className="w-14 h-14 mx-auto bg-emerald-100 dark:bg-emerald-950/60 rounded-2xl flex items-center justify-center text-emerald-600 border border-emerald-300">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h4 className="text-base font-extrabold text-slate-900 dark:text-slate-100">
                Password Updated Successfully!
              </h4>
              <p className="text-xs text-slate-600 dark:text-slate-300">
                You can now log in using your new credentials.
              </p>

              <button
                onClick={handleCloseModal}
                className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-md text-xs uppercase tracking-wide"
              >
                Proceed to Login
              </button>
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
