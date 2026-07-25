import React, { useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Printer, Download, Share2, ShieldCheck, QrCode, Building2, CheckCircle2 } from 'lucide-react';
import { maskCitizenName } from '../utils/governanceUtils';
import { useApp } from '../context/AppContext';

export const PublicReportModal = ({ isOpen, onClose, complaint }) => {
  const { showToast } = useApp();
  const reportRef = useRef(null);

  if (!isOpen || !complaint) return null;

  const report = complaint.completionReport || {
    reportId: `REP-${complaint.id}-001`,
    actionsTaken: 'Municipal engineering field team dispatched. Drainage line cleared of heavy silt and obstructions. Sanitation team disinfected area.',
    materialsUsed: '30kg Debris Binder, Lime Sanitizer, Heavy Pumping Unit',
    resourcesDeployed: '1 Vacuum Jetting Truck, 4 Sanitary Workers, Field Supervisor',
    beforeImageUrl: complaint.imageUrl || 'https://images.unsplash.com/photo-1584467735871-8e85353a8413?auto=format&fit=crop&w=600&q=80',
    afterImageUrl: 'https://images.unsplash.com/photo-1541888946425-d0fbb186a5b7?auto=format&fit=crop&w=600&q=80',
    remarks: 'Field inspection verified complete. Area fully sanitized and compliant.',
    officerName: complaint.assignedOfficer || 'Er. S. Deshmukh',
    officerBadge: 'KMC-OFFICER-001',
    department: complaint.department || 'Public Works (PWD)',
    verificationStatus: 'Verified & Approved',
    generatedAt: complaint.completedAt || new Date().toISOString()
  };

  const submitDateStr = new Date(complaint.createdAt || complaint.submittedAt || Date.now()).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
  const submitTimeStr = new Date(complaint.createdAt || complaint.submittedAt || Date.now()).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });
  const completeDateStr = new Date(report.generatedAt || Date.now()).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
  const completeTimeStr = new Date(report.generatedAt || Date.now()).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });

  // Calculate resolution duration
  const startMs = new Date(complaint.createdAt || complaint.submittedAt || Date.now()).getTime();
  const endMs = new Date(report.generatedAt || Date.now()).getTime();
  const durHours = Math.max(1, Math.round((endMs - startMs) / (1000 * 3600)));
  const durDays = Math.floor(durHours / 24);
  const remHours = durHours % 24;
  const resolutionTimeFormatted = durDays > 0 ? `${durDays} Day(s) ${remHours} Hour(s)` : `${durHours} Hour(s)`;

  const handlePrint = () => {
    window.print();
  };

  const handleDownload = () => {
    showToast(`Downloading Official Completion Certificate for ${complaint.id}...`);
    const element = document.createElement("a");
    const file = new Blob([
      `KOPARGAON MUNICIPAL CORPORATION - OFFICIAL WORK COMPLETION REPORT\n` +
      `Report ID: ${report.reportId}\n` +
      `Complaint ID: ${complaint.id}\n` +
      `Category: ${complaint.category}\n` +
      `Ward: Ward ${complaint.ward}\n` +
      `Resolution Time: ${resolutionTimeFormatted}\n` +
      `Actions Taken: ${report.actionsTaken}\n` +
      `Reporting Officer: ${report.officerName}\n` +
      `Verification Status: ${report.verificationStatus}\n` +
      `Timestamp: ${report.generatedAt}\n`
    ], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = `KMC_Official_Completion_Report_${complaint.id}.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: `Kopargaon Municipal Work Report #${complaint.id}`,
        text: `Official Work Completion Certificate for ticket ${complaint.id} (${complaint.category}, Ward ${complaint.ward}).`,
        url: window.location.href
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
      showToast('Public report link copied to clipboard!');
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
          {/* Action Header Bar (Hidden in Print, Sticky Top) */}
          <div className="p-3 sm:p-4 bg-[#0A2540] text-white flex flex-wrap items-center justify-between gap-2 shrink-0 z-10 border-b border-slate-800 print:hidden">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0" />
              <span className="text-xs sm:text-sm font-bold tracking-tight">Official Municipal Completion Certificate</span>
            </div>

            <div className="flex items-center gap-1.5 sm:gap-2">
              <button
                onClick={handlePrint}
                className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-xs font-semibold rounded-md flex items-center gap-1 transition-colors"
                title="Print Report"
              >
                <Printer className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Print</span>
              </button>
              <button
                onClick={handleDownload}
                className="px-2.5 py-1 bg-sky-600 hover:bg-sky-500 text-xs font-semibold rounded-md flex items-center gap-1 transition-colors"
                title="Download Official PDF"
              >
                <Download className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Download</span>
              </button>
              <button
                onClick={handleShare}
                className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-xs font-semibold rounded-md flex items-center gap-1 transition-colors"
                title="Share Document"
              >
                <Share2 className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Share</span>
              </button>
              <button
                onClick={onClose}
                className="p-1 rounded-md text-slate-300 hover:text-white hover:bg-slate-800 transition-colors ml-1"
                title="Close"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Document Content Scroll Area */}
          <div className="flex-1 overflow-y-auto p-3 sm:p-6 bg-slate-100/80 dark:bg-slate-900/50 print:bg-white print:overflow-visible">
            
            {/* Double Border Official Certificate Frame */}
            <div 
              ref={reportRef} 
              className="p-4 sm:p-8 space-y-6 font-serif bg-white text-slate-900 border-4 sm:border-8 border-double border-slate-300 rounded-lg shadow-sm print:border-4 print:shadow-none"
            >
              
              {/* Government Emblem & Upper Certificate Header */}
              <div className="text-center border-b-2 border-slate-900 pb-4 relative">
                <div className="flex flex-col sm:flex-row justify-between items-center gap-3 sm:gap-0 mb-3">
                  <div className="text-center sm:text-left font-sans">
                    <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider block">STATE OF MAHARASHTRA</span>
                    <span className="text-xs font-bold text-[#0A2540] block">AHMEDNAGAR DISTRICT</span>
                  </div>
                  
                  {/* Emblem Seal Placeholder */}
                  <div className="w-16 h-16 rounded-full bg-[#0A2540] text-amber-400 flex flex-col items-center justify-center font-sans font-bold border-2 border-amber-400 shadow-md shrink-0 my-1 sm:my-0">
                    <Building2 className="w-6 h-6 mb-0.5" />
                    <span className="text-[7px] tracking-tighter uppercase font-mono">KMC SEAL</span>
                  </div>

                  <div className="text-center sm:text-right font-sans">
                    <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider block">GOVERNANCE PORTAL</span>
                    <span className="text-xs font-mono font-bold text-emerald-700 block">VERIFIED #OFFICIAL</span>
                  </div>
                </div>

                <h1 className="text-lg sm:text-2xl font-bold uppercase tracking-wider text-[#0A2540] font-sans leading-tight">
                  Kopargaon Municipal Corporation
                </h1>
                <h2 className="text-xs sm:text-sm font-semibold text-slate-700 tracking-wide font-sans mt-1">
                  CERTIFICATE OF MUNICIPAL WORK COMPLETION & AUDIT
                </h2>
                <p className="text-[10px] sm:text-[11px] text-slate-500 font-sans mt-1">
                  Issued under the Municipal Governance, Transparency & Public Accountability Act, 2026
                </p>
              </div>

              {/* Certificate Serial & Metadata */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-50 p-3 border border-slate-200 rounded font-sans text-xs">
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Report Ref ID</span>
                  <span className="font-mono font-bold text-slate-800 break-all">{report.reportId}</span>
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Complaint Number</span>
                  <span className="font-mono font-bold text-sky-700">{complaint.id}</span>
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Ward Jurisdiction</span>
                  <span className="font-semibold text-slate-800">Ward {complaint.ward}</span>
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Total Resolution Duration</span>
                  <span className="font-bold text-emerald-700">{resolutionTimeFormatted}</span>
                </div>
              </div>

              {/* Primary Details Table */}
              <div className="font-sans text-xs">
                <h3 className="font-bold text-slate-800 uppercase tracking-wider text-[11px] mb-2 border-b border-slate-300 pb-1">
                  1. Incident & Execution Lifecycles
                </h3>
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse border border-slate-300 min-w-[500px]">
                    <tbody>
                      <tr className="border-b border-slate-200">
                        <td className="p-2 bg-slate-100 font-semibold w-1/3 border-r border-slate-200">Complainant Registered Name</td>
                        <td className="p-2">{maskCitizenName(complaint.submittedBy)}</td>
                      </tr>
                      <tr className="border-b border-slate-200">
                        <td className="p-2 bg-slate-100 font-semibold border-r border-slate-200">Category & Department</td>
                        <td className="p-2">{complaint.category} • <span className="font-medium text-slate-700">{report.department}</span></td>
                      </tr>
                      <tr className="border-b border-slate-200">
                        <td className="p-2 bg-slate-100 font-semibold border-r border-slate-200">Site Address & Coordinates</td>
                        <td className="p-2">{complaint.address || complaint.locationName} (Lat: {complaint.latitude}, Lng: {complaint.longitude})</td>
                      </tr>
                      <tr className="border-b border-slate-200">
                        <td className="p-2 bg-slate-100 font-semibold border-r border-slate-200">Submission Date & Time</td>
                        <td className="p-2 font-mono">{submitDateStr} at {submitTimeStr}</td>
                      </tr>
                      <tr className="border-b border-slate-200">
                        <td className="p-2 bg-slate-100 font-semibold border-r border-slate-200">Work Completion Date & Time</td>
                        <td className="p-2 font-mono">{completeDateStr} at {completeTimeStr}</td>
                      </tr>
                      <tr>
                        <td className="p-2 bg-slate-100 font-semibold border-r border-slate-200">Assigned Field Engineer</td>
                        <td className="p-2 font-semibold text-slate-800">{report.officerName} ({report.officerBadge})</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Technical Actions & Resources */}
              <div className="font-sans text-xs space-y-3">
                <h3 className="font-bold text-slate-800 uppercase tracking-wider text-[11px] border-b border-slate-300 pb-1">
                  2. Technical Operations & Resource Consumption
                </h3>
                
                <div className="bg-slate-50 p-3.5 border border-slate-200 rounded space-y-2">
                  <div>
                    <span className="font-bold text-slate-700 block text-[11px]">Actions Taken by Engineering Unit:</span>
                    <p className="text-slate-700 leading-relaxed font-serif text-sm mt-0.5">{report.actionsTaken}</p>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-slate-200">
                    <div>
                      <span className="font-bold text-slate-700 block text-[11px]">Materials Consumed:</span>
                      <p className="text-slate-600 font-mono text-[11px]">{report.materialsUsed}</p>
                    </div>
                    <div>
                      <span className="font-bold text-slate-700 block text-[11px]">Resources & Personnel Deployed:</span>
                      <p className="text-slate-600 font-mono text-[11px]">{report.resourcesDeployed}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Photographic Verification Grid (Before & After) */}
              <div className="font-sans text-xs">
                <h3 className="font-bold text-slate-800 uppercase tracking-wider text-[11px] border-b border-slate-300 pb-1 mb-2">
                  3. Photographic Evidence & Site Audit
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="border border-slate-300 rounded p-2 bg-[#FAFBFD] text-center">
                    <span className="text-[10px] font-bold uppercase text-rose-600 block mb-1">Before Work Execution</span>
                    <img
                      src={report.beforeImageUrl}
                      alt="Before"
                      className="w-full h-36 object-cover rounded border border-slate-200"
                    />
                    <span className="text-[9px] text-slate-400 font-mono block mt-1">Initial Citizen Telemetry Photo</span>
                  </div>
                  <div className="border border-slate-300 rounded p-2 bg-[#FAFBFD] text-center">
                    <span className="text-[10px] font-bold uppercase text-emerald-600 block mb-1">After Work Completion</span>
                    <img
                      src={report.afterImageUrl}
                      alt="After"
                      className="w-full h-36 object-cover rounded border border-slate-200"
                    />
                    <span className="text-[9px] text-slate-400 font-mono block mt-1">Post-Execution Municipal Audit Photo</span>
                  </div>
                </div>
              </div>

              {/* Official Signatures & QR Code Footer */}
              <div className="font-sans border-t-2 border-slate-900 pt-4 grid grid-cols-1 sm:grid-cols-3 gap-4 items-center">
                {/* QR Code Placeholder */}
                <div className="text-center">
                  <div className="w-20 h-20 mx-auto border-2 border-slate-900 p-1 bg-white flex items-center justify-center">
                    <QrCode className="w-16 h-16 text-slate-900" />
                  </div>
                  <span className="text-[9px] font-mono text-slate-500 block mt-1">Scan to Verify Digital Seal</span>
                </div>

                {/* Status Seal */}
                <div className="text-center border-y sm:border-y-0 sm:border-x border-slate-300 py-2 sm:py-0 px-2">
                  <div className="inline-flex items-center gap-1 px-3 py-1 bg-emerald-100 text-emerald-800 font-bold text-xs rounded border border-emerald-300 uppercase tracking-wider mb-1">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>{report.verificationStatus}</span>
                  </div>
                  <p className="text-[10px] text-slate-500 leading-tight">
                    Audited by Municipal Governance Automated Tracking System
                  </p>
                </div>

                {/* Officer Signature */}
                <div className="text-center sm:text-right">
                  <div className="h-10 flex items-end justify-center sm:justify-end mb-1">
                    <span className="italic font-serif font-bold text-base text-slate-800 underline decoration-slate-400">
                      {report.officerName}
                    </span>
                  </div>
                  <span className="text-xs font-bold text-slate-900 block leading-tight">Reporting Municipal Officer</span>
                  <span className="text-[10px] text-slate-500 block">{report.department}</span>
                  <span className="text-[9px] text-slate-400 font-mono block">Signed: {completeDateStr}</span>
                </div>
              </div>

            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
