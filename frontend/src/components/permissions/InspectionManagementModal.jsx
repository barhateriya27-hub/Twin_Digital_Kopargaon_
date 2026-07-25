import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Calendar, User, MapPin, Camera, CheckCircle2, AlertTriangle, ShieldCheck, ClipboardList, Send, FileText } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const InspectionManagementModal = ({ isOpen, onClose, application }) => {
  const { scheduleInspection, submitInspectionReport, showToast } = useApp();

  const [mode, setMode] = useState('schedule'); // 'schedule' | 'report'
  
  // Schedule Form State
  const [scheduledDate, setScheduledDate] = useState(new Date(Date.now() + 24 * 3600 * 1000).toISOString().split('T')[0]);
  const [inspectorName, setInspectorName] = useState('Er. V. R. Thorat (Town Planner)');
  const [notes, setNotes] = useState('On-site inspection to verify structural boundaries and setbacks.');

  // Inspection Report Form State
  const [inspectionResult, setInspectionResult] = useState('Passed'); // 'Passed' | 'Failed' | 'Requires Corrections'
  const [fieldRemarks, setFieldRemarks] = useState('Site inspection verified. Property setbacks and boundary alignment comply with Kopargaon Municipal Bye-laws 2026.');
  const [gpsCoordinates, setGpsCoordinates] = useState('19.8855° N, 74.4821° E (Ward 4)');
  const [inspectorSignature, setInspectorSignature] = useState('Er. V. R. Thorat');

  if (!isOpen || !application) return null;

  const handleScheduleSubmit = (e) => {
    e.preventDefault();
    scheduleInspection(application.id, {
      scheduledDate,
      inspectorName,
      notes
    });
    onClose();
  };

  const handleReportSubmit = (e) => {
    e.preventDefault();
    submitInspectionReport(application.id, {
      inspectionResult,
      fieldRemarks,
      gpsCoordinates,
      inspectorSignature,
      inspectedAt: new Date().toISOString(),
      photos: [
        'https://images.unsplash.com/photo-1541888946425-d0fbb186a5b7?auto=format&fit=crop&w=600&q=80'
      ]
    });
    onClose();
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-900/70 backdrop-blur-md overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 w-full max-w-xl max-h-[90vh] flex flex-col overflow-hidden my-auto"
        >
          {/* Action Header */}
          <div className="p-4 bg-[#0A2540] text-white flex items-center justify-between shrink-0">
            <div className="flex items-center gap-2.5">
              <ClipboardList className="w-5 h-5 text-amber-400" />
              <div>
                <span className="text-[10px] font-mono font-bold text-amber-300 block">
                  APP #{application.id} • Ward {application.wardNumber || application.ward || 4}
                </span>
                <h3 className="text-sm font-extrabold">Field Inspection & Site Audit Desk</h3>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-1 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Mode Switcher Tabs */}
          <div className="flex border-b border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-800/80 text-xs font-bold shrink-0">
            <button
              onClick={() => setMode('schedule')}
              className={`flex-1 py-3 text-center transition-all ${
                mode === 'schedule' ? 'bg-white dark:bg-slate-900 text-orange-600 border-b-2 border-orange-600 font-extrabold' : 'text-slate-500'
              }`}
            >
              1. Schedule Inspection
            </button>
            <button
              onClick={() => setMode('report')}
              className={`flex-1 py-3 text-center transition-all ${
                mode === 'report' ? 'bg-white dark:bg-slate-900 text-orange-600 border-b-2 border-orange-600 font-extrabold' : 'text-slate-500'
              }`}
            >
              2. Submit Inspection Findings
            </button>
          </div>

          {/* Form Content */}
          <div className="flex-1 overflow-y-auto p-6 space-y-5 text-xs">

            {mode === 'schedule' && (
              <form onSubmit={handleScheduleSubmit} className="space-y-4">
                <div className="p-3 bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/40 rounded-2xl text-amber-900 dark:text-amber-300">
                  <p className="font-bold">Inspection Request Details</p>
                  <p className="text-[11px] opacity-90 mt-0.5">
                    Permission: <strong>{application.permissionType}</strong> ({application.category}) for site {application.propertyAddress || application.address}.
                  </p>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                    Scheduled Date *
                  </label>
                  <div className="relative">
                    <Calendar className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                    <input
                      type="date"
                      required
                      value={scheduledDate}
                      onChange={(e) => setScheduledDate(e.target.value)}
                      className="w-full pl-9 pr-3 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl font-bold text-slate-900 dark:text-slate-100"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                    Assigned Municipal Inspector *
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                    <input
                      type="text"
                      required
                      value={inspectorName}
                      onChange={(e) => setInspectorName(e.target.value)}
                      placeholder="e.g. Er. V. R. Thorat"
                      className="w-full pl-9 pr-3 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl font-bold text-slate-900 dark:text-slate-100"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                    Inspection Scope & Directives
                  </label>
                  <textarea
                    rows={3}
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    className="w-full p-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl font-medium text-slate-900 dark:text-slate-100"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3 bg-orange-600 hover:bg-orange-700 text-white font-bold rounded-xl shadow-lg transition-all uppercase tracking-wide flex items-center justify-center gap-2"
                >
                  <Calendar className="w-4 h-4" /> Schedule Site Inspection
                </button>
              </form>
            )}

            {mode === 'report' && (
              <form onSubmit={handleReportSubmit} className="space-y-4">
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                    Inspection Audit Result *
                  </label>
                  <select
                    value={inspectionResult}
                    onChange={(e) => setInspectionResult(e.target.value)}
                    className="w-full px-3 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl font-extrabold text-slate-900 dark:text-slate-100"
                  >
                    <option value="Passed">Passed (Fully Compliant)</option>
                    <option value="Requires Corrections">Requires Corrections / Re-submission</option>
                    <option value="Failed">Failed (Non-compliant)</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                    Field Remarks & Inspector Observations *
                  </label>
                  <textarea
                    rows={3}
                    required
                    value={fieldRemarks}
                    onChange={(e) => setFieldRemarks(e.target.value)}
                    className="w-full p-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl font-medium text-slate-900 dark:text-slate-100"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                      GPS Coordinates *
                    </label>
                    <div className="relative">
                      <MapPin className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                      <input
                        type="text"
                        required
                        value={gpsCoordinates}
                        onChange={(e) => setGpsCoordinates(e.target.value)}
                        className="w-full pl-9 pr-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl font-mono text-[11px]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                      Digital Signature Seal
                    </label>
                    <input
                      type="text"
                      required
                      value={inspectorSignature}
                      onChange={(e) => setInspectorSignature(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl font-serif font-bold text-[11px]"
                    />
                  </div>
                </div>

                <div className="p-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Camera className="w-4 h-4 text-orange-500" />
                    <span className="font-semibold text-slate-700 dark:text-slate-300">Site Telemetry Photograph attached</span>
                  </div>
                  <span className="text-[10px] font-mono text-emerald-600 font-bold">1 Photo Verified</span>
                </div>

                <button
                  type="submit"
                  className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-lg transition-all uppercase tracking-wide flex items-center justify-center gap-2"
                >
                  <Send className="w-4 h-4" /> Log Official Field Report
                </button>
              </form>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
