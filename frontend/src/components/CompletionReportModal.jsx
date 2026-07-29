import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { X, FileCheck, Upload, ShieldCheck, CheckCircle2, AlertCircle } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const CompletionReportModal = ({ isOpen, onClose, complaint, onSubmitReport }) => {
  const { t } = useTranslation();
  const { officerUser, showToast } = useApp();

  const [actionsTaken, setActionsTaken] = useState('');
  const [materialsUsed, setMaterialsUsed] = useState('');
  const [resourcesDeployed, setResourcesDeployed] = useState('');
  const [remarks, setRemarks] = useState('');
  const [afterImage, setAfterImage] = useState(null);
  const [afterPreview, setAfterPreview] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen || !complaint) return null;

  const handleAfterImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setAfterImage(file);
      setAfterPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!actionsTaken.trim() || !materialsUsed.trim()) {
      showToast('Please specify actions taken and materials/resources used.', 'warning');
      return;
    }

    setIsSubmitting(true);

    setTimeout(() => {
      const reportData = {
        reportId: `REP-${complaint.id}-${Date.now().toString().slice(-4)}`,
        complaintId: complaint.id,
        actionsTaken,
        materialsUsed,
        resourcesDeployed: resourcesDeployed || 'Municipal Field Operations Unit',
        beforeImageUrl: complaint.imageUrl || 'https://images.unsplash.com/photo-1584467735871-8e85353a8413?auto=format&fit=crop&w=600&q=80',
        afterImageUrl: afterPreview || 'https://images.unsplash.com/photo-1541888946425-d0fbb186a5b7?auto=format&fit=crop&w=600&q=80',
        remarks: remarks || 'Work completed in compliance with municipal engineering standards.',
        officerName: officerUser?.name || 'Er. S. Deshmukh',
        officerBadge: officerUser?.badge || 'KMC-OFFICER-001',
        department: complaint.department || 'Public Works (PWD)',
        verificationStatus: 'Verified & Approved',
        generatedAt: new Date().toISOString()
      };

      onSubmitReport(complaint.id, reportData);
      setIsSubmitting(false);
      onClose();
    }, 600);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-900/60 backdrop-blur-sm overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-2xl w-full max-w-2xl max-h-[92vh] flex flex-col overflow-hidden my-auto"
        >
          {/* Header */}
          <div className="p-4 sm:p-5 border-b border-slate-200 dark:border-slate-800 bg-[#0A2540] text-white flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center border border-emerald-500/30">
                <FileCheck className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-base font-bold tracking-tight">
                  {t('completionReport.headerTitle', 'Mandatory Work Completion Report')}
                </h2>
                <p className="text-xs text-slate-300 font-mono">
                  Ticket #{complaint.id} • {complaint.category} ({t('taxPortal.wardPrefix', 'Ward')} {complaint.ward})
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-1 rounded-md text-slate-300 hover:text-white hover:bg-white/10 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-5 sm:p-6 space-y-4 max-h-[80vh] overflow-y-auto">
            <div className="bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/60 rounded-lg p-3 text-xs text-amber-800 dark:text-amber-300 flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 shrink-0 text-amber-600 mt-0.5" />
              <div>
                <p className="font-semibold">{t('completionReport.mandateTitle', 'Official Governance Compliance Mandate')}</p>
                <p className="text-[11px] opacity-90">
                  {t('completionReport.mandateDesc', 'Complaints cannot be marked as Completed without generating a signed completion report. This report will be publicly downloadable.')}
                </p>
              </div>
            </div>

            {/* Actions Taken */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                {t('completionReport.labelActions', 'Actions Taken & Field Operations Executed *')}
              </label>
              <textarea
                required
                rows={3}
                value={actionsTaken}
                onChange={(e) => setActionsTaken(e.target.value)}
                placeholder={t('completionReport.placeholderActions', 'Detail the technical repair work, debris removal, pipe sealing, or maintenance completed by the department team...')}
                className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-sky-500"
              />
            </div>

            {/* Materials Used & Resources Deployed */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  {t('completionReport.labelMaterials', 'Materials & Consumables Used *')}
                </label>
                <input
                  type="text"
                  required
                  value={materialsUsed}
                  onChange={(e) => setMaterialsUsed(e.target.value)}
                  placeholder={t('completionReport.placeholderMaterials', 'e.g. Cold mix asphalt, PVC 4 inch pipe, 50kg lime')}
                  className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-sky-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  {t('completionReport.labelResources', 'Resources & Machinery Deployed')}
                </label>
                <input
                  type="text"
                  value={resourcesDeployed}
                  onChange={(e) => setResourcesDeployed(e.target.value)}
                  placeholder={t('completionReport.placeholderResources', 'e.g. 1 Tipper Truck, 4 Sanitation Workers, JCB Excavator')}
                  className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-sky-500"
                />
              </div>
            </div>

            {/* Image Upload for Work Completed Photo */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                {t('completionReport.labelPhoto', 'Post-Work Site Verification Photo (After Image)')}
              </label>
              <div className="flex items-center gap-4">
                <label className="cursor-pointer inline-flex items-center gap-2 px-3 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 border border-slate-300 dark:border-slate-700 rounded-lg text-xs font-medium text-slate-700 dark:text-slate-300 transition-colors">
                  <Upload className="w-4 h-4 text-sky-500" />
                  <span>{t('completionReport.btnUploadPhoto', 'Upload Site Photo')}</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleAfterImageChange}
                    className="hidden"
                  />
                </label>
                {afterPreview && (
                  <div className="flex items-center gap-2">
                    <img src={afterPreview} alt="Work Done" className="w-12 h-12 object-cover rounded-md border border-slate-300" />
                    <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium">{t('completionReport.photoAttached', 'Photo attached')}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Remarks */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                {t('completionReport.labelRemarks', 'Officer Final Remarks & Recommendations')}
              </label>
              <input
                type="text"
                value={remarks}
                onChange={(e) => setRemarks(e.target.value)}
                placeholder={t('completionReport.placeholderRemarks', 'e.g. Site cleared and inspected. Normal operational status restored.')}
                className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-sky-500"
              />
            </div>

            {/* Officer Sign-off Details */}
            <div className="p-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg flex items-center justify-between text-xs text-slate-600 dark:text-slate-400">
              <div>
                <span className="font-semibold text-slate-900 dark:text-slate-100 block">
                  {t('completionReport.reportingOfficer', 'Reporting Officer:')} {officerUser?.name || 'Municipal Administrator'}
                </span>
                <span className="text-[11px] text-slate-500">
                  {officerUser?.department || 'Municipal Headquarters'} • Badge #{officerUser?.badge || 'KMC-OFFICER-001'}
                </span>
              </div>
              <div className="flex items-center gap-1 text-emerald-600 font-semibold text-[11px]">
                <ShieldCheck className="w-4 h-4" />
                <span>{t('completionReport.authSignoff', 'Authorized Sign-off')}</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="pt-3 border-t border-slate-200 dark:border-slate-800 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-xs font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
              >
                {t('announcements.btnCancel', 'Cancel')}
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-5 py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg shadow-md transition-colors flex items-center gap-2 disabled:opacity-50"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>{isSubmitting ? t('completionReport.btnGenerating', 'Generating Official Report...') : t('completionReport.btnSubmitReport', 'Submit Report & Complete Complaint')}</span>
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
