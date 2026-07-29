import React, { useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { X, Printer, Download, Share2, ShieldCheck, QrCode, Building2, CheckCircle2, Award } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const DigitalPermissionCertificateModal = ({ isOpen, onClose, application }) => {
  const { t } = useTranslation();
  const { showToast } = useApp();
  const certRef = useRef(null);

  if (!isOpen || !application) return null;

  const certNumber = application.certificateNumber || `KMC-PERM-2026-${application.id.replace(/\D/g, '') || '9482'}`;
  const approvalDateStr = new Date(application.approvedAt || application.createdAt || Date.now()).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
  const validityDateStr = new Date(Date.now() + 365 * 24 * 3600 * 1000).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });

  const handlePrint = () => {
    window.print();
  };

  const handleDownload = () => {
    showToast('Downloading Official Municipal Digital Certificate...');
    const element = document.createElement("a");
    const file = new Blob([
      `KOPARGAON MUNICIPAL CORPORATION - OFFICIAL PERMISSION CERTIFICATE\n` +
      `Certificate Number: ${certNumber}\n` +
      `Application ID: ${application.id}\n` +
      `Permission Type: ${application.permissionType}\n` +
      `Category: ${application.category}\n` +
      `Applicant: ${application.applicantName || application.submittedBy}\n` +
      `Property Address: ${application.propertyAddress || application.address}\n` +
      `Approval Date: ${approvalDateStr}\n` +
      `Valid Until: ${validityDateStr}\n` +
      `Status: VERIFIED & APPROVED\n`
    ], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = `KMC_Certificate_${certNumber}.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      showToast('Certificate verification link copied to clipboard!');
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-900/70 backdrop-blur-md overflow-y-auto print:p-0 print:bg-white">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="bg-white text-slate-900 rounded-xl shadow-2xl w-full max-w-3xl max-h-[92vh] flex flex-col overflow-hidden my-auto border border-slate-300 print:max-h-none print:shadow-none print:border-none print:w-full print:max-w-none"
        >
          {/* Action Header Bar */}
          <div className="p-3 sm:p-4 bg-[#0A2540] text-white flex flex-wrap items-center justify-between gap-2 shrink-0 z-10 border-b border-slate-800 print:hidden">
            <div className="flex items-center gap-2">
              <Award className="w-5 h-5 text-amber-400 shrink-0" />
              <span className="text-xs sm:text-sm font-bold tracking-tight">{t('permissionPortal.certModalTitle', 'Official Municipal Permission Certificate')}</span>
            </div>

            <div className="flex items-center gap-1.5 sm:gap-2">
              <button
                onClick={handlePrint}
                className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-xs font-semibold rounded-md flex items-center gap-1 transition-colors"
              >
                <Printer className="w-3.5 h-3.5" /> <span className="hidden sm:inline">{t('taxPortal.btnPrint', 'Print')}</span>
              </button>
              <button
                onClick={handleDownload}
                className="px-2.5 py-1 bg-sky-600 hover:bg-sky-500 text-xs font-semibold rounded-md flex items-center gap-1 transition-colors"
              >
                <Download className="w-3.5 h-3.5" /> <span className="hidden sm:inline">{t('taxPortal.btnDownload', 'Download')}</span>
              </button>
              <button
                onClick={handleShare}
                className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-xs font-semibold rounded-md flex items-center gap-1 transition-colors"
              >
                <Share2 className="w-3.5 h-3.5" /> <span className="hidden sm:inline">{t('permissionPortal.btnShare', 'Share')}</span>
              </button>
              <button
                onClick={onClose}
                className="p-1 rounded-md text-slate-300 hover:text-white hover:bg-slate-800 transition-colors ml-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Certificate Body Container */}
          <div className="flex-1 overflow-y-auto p-3 sm:p-6 bg-slate-100/80 dark:bg-slate-900/50 print:bg-white print:overflow-visible">
            
            {/* Double Border Frame */}
            <div 
              ref={certRef} 
              className="p-4 sm:p-8 space-y-6 font-serif bg-white text-slate-900 border-4 sm:border-8 border-double border-slate-300 rounded-lg shadow-sm print:border-4 print:shadow-none"
            >
              {/* Header Emblem */}
              <div className="text-center border-b-2 border-slate-900 pb-4 relative">
                <div className="flex flex-col sm:flex-row justify-between items-center gap-3 sm:gap-0 mb-3">
                  <div className="text-center sm:text-left font-sans">
                    <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider block">STATE OF MAHARASHTRA</span>
                    <span className="text-xs font-bold text-[#0A2540] block">AHMEDNAGAR DISTRICT</span>
                  </div>
                  
                  <div className="w-16 h-16 rounded-full bg-[#0A2540] text-amber-400 flex flex-col items-center justify-center font-sans font-bold border-2 border-amber-400 shadow-md shrink-0 my-1 sm:my-0">
                    <Building2 className="w-6 h-6 mb-0.5" />
                    <span className="text-[7px] tracking-tighter uppercase font-mono">KMC SEAL</span>
                  </div>

                  <div className="text-center sm:text-right font-sans">
                    <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider block">GOVERNANCE PORTAL</span>
                    <span className="text-xs font-mono font-bold text-emerald-700 block">VERIFIED #APPROVED</span>
                  </div>
                </div>

                <h1 className="text-lg sm:text-2xl font-bold uppercase tracking-wider text-[#0A2540] font-sans leading-tight">
                  Kopargaon Municipal Corporation
                </h1>
                <h2 className="text-xs sm:text-sm font-semibold text-slate-700 tracking-wide font-sans mt-1 uppercase">
                  OFFICIAL PERMISSION & LICENSING CERTIFICATE
                </h2>
                <p className="text-[10px] sm:text-[11px] text-slate-500 font-sans mt-1">
                  Issued under the Maharashtra Municipal Corporations Act & Building Bye-laws, 2026
                </p>
              </div>

              {/* Certificate Metadata */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-50 p-3 border border-slate-200 rounded font-sans text-xs">
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Certificate No</span>
                  <span className="font-mono font-bold text-slate-800 break-all">{certNumber}</span>
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Application ID</span>
                  <span className="font-mono font-bold text-sky-700">{application.id}</span>
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Approval Date</span>
                  <span className="font-semibold text-slate-800">{approvalDateStr}</span>
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Valid Until</span>
                  <span className="font-bold text-emerald-700">{validityDateStr}</span>
                </div>
              </div>

              {/* Certificate Body Text */}
              <div className="font-sans text-xs space-y-4 leading-relaxed">
                <p className="text-slate-800">
                  This is to formally certify that municipal clearance and approval for 
                  <strong className="text-[#0A2540]"> {application.permissionType}</strong> ({application.category}) 
                  is hereby granted by the Kopargaon Municipal Corporation unto:
                </p>

                <div className="bg-slate-50 p-4 border border-slate-200 rounded space-y-2">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <div>
                      <span className="text-[10px] text-slate-500 font-bold uppercase block">Applicant Name:</span>
                      <span className="font-bold text-slate-900 text-sm">{application.applicantName || application.submittedBy}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-500 font-bold uppercase block">Aadhaar / ID Ref:</span>
                      <span className="font-mono text-slate-800">{application.aadhaarNumber || '1234-5678-9012'}</span>
                    </div>
                    <div className="sm:col-span-2">
                      <span className="text-[10px] text-slate-500 font-bold uppercase block">Site Location / Property Address:</span>
                      <span className="font-medium text-slate-800">{application.propertyAddress || application.address} (Ward {application.wardNumber || application.ward || 4})</span>
                    </div>
                  </div>
                </div>

                <p className="text-slate-700 text-[11px]">
                  <strong>Terms & Governance Directives:</strong> The permission holder shall strictly adhere to the approved site plan, safety provisions, and municipal environmental regulations. Any unapproved deviation shall render this clearance void and subject to immediate municipal penalty.
                </p>
              </div>

              {/* Signatures & QR Code */}
              <div className="font-sans border-t-2 border-slate-900 pt-4 grid grid-cols-1 sm:grid-cols-3 gap-4 items-center">
                <div className="text-center">
                  <div className="w-20 h-20 mx-auto border-2 border-slate-900 p-1 bg-white flex items-center justify-center">
                    <QrCode className="w-16 h-16 text-slate-900" />
                  </div>
                  <span className="text-[9px] font-mono text-slate-500 block mt-1">Scan for Portal Digital Seal</span>
                </div>

                <div className="text-center border-y sm:border-y-0 sm:border-x border-slate-300 py-2 sm:py-0 px-2">
                  <div className="inline-flex items-center gap-1 px-3 py-1 bg-emerald-100 text-emerald-800 font-bold text-xs rounded border border-emerald-300 uppercase tracking-wider mb-1">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>APPROVED & VERIFIED</span>
                  </div>
                  <p className="text-[10px] text-slate-500 leading-tight">
                    Kopargaon Town Planning & Building Authorities
                  </p>
                </div>

                <div className="text-center sm:text-right">
                  <div className="h-10 flex items-end justify-center sm:justify-end mb-1">
                    <span className="italic font-serif font-bold text-base text-slate-800 underline decoration-slate-400">
                      Er. S. Deshmukh
                    </span>
                  </div>
                  <span className="text-xs font-bold text-slate-900 block leading-tight">Chief Town Planner</span>
                  <span className="text-[10px] text-slate-500 block">Kopargaon Municipal Corporation</span>
                  <span className="text-[9px] text-slate-400 font-mono block">Digitally Signed: {approvalDateStr}</span>
                </div>
              </div>

            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
