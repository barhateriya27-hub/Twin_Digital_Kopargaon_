import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Building2, CheckCircle2, Clock, AlertTriangle, FileText, Search, Filter, Plus, 
  Calendar, Eye, Check, X, PauseCircle, Send, Award, FileCheck, ShieldCheck, MapPin, User
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { PermissionApplicationModal } from './PermissionApplicationModal';
import { InspectionManagementModal } from './InspectionManagementModal';
import { DigitalPermissionCertificateModal } from './DigitalPermissionCertificateModal';

export const PermissionsDashboardView = () => {
  const { 
    permissionApplications = [], 
    updatePermissionStatus, 
    showToast,
    officerUser,
    activeGovernanceRole
  } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');

  // Modals state
  const [isApplyModalOpen, setIsApplyModalOpen] = useState(false);
  const [selectedAppForInspection, setSelectedAppForInspection] = useState(null);
  const [selectedAppForCert, setSelectedAppForCert] = useState(null);
  const [selectedAppDetail, setSelectedAppDetail] = useState(null);

  // Filtered applications
  const filteredApps = permissionApplications.filter(app => {
    const matchesSearch = 
      app.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (app.applicantName || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (app.permissionType || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (app.propertyAddress || '').toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCat = categoryFilter === 'All' || app.category === categoryFilter;
    const matchesStatus = statusFilter === 'All' || app.status === statusFilter;

    return matchesSearch && matchesCat && matchesStatus;
  });

  // KPI Calculations
  const totalApps = permissionApplications.length;
  const pendingApps = permissionApplications.filter(a => a.status === 'Submitted' || a.status === 'Under Verification' || a.status === 'Documents Pending').length;
  const inspectionScheduled = permissionApplications.filter(a => a.status === 'Inspection Scheduled').length;
  const approvedApps = permissionApplications.filter(a => a.status === 'Approved').length;
  const rejectedApps = permissionApplications.filter(a => a.status === 'Rejected').length;

  const handleApprove = (appId) => {
    updatePermissionStatus(appId, 'Approved', 'Permission granted after document verification & site audit.');
  };

  const handleReject = (appId) => {
    updatePermissionStatus(appId, 'Rejected', 'Application non-compliant with municipal setback regulations.');
  };

  const handleHold = (appId) => {
    updatePermissionStatus(appId, 'Documents Pending', 'Additional structural safety certificate requested from applicant.');
  };

  return (
    <div className="space-y-6 text-slate-800 dark:text-slate-200">
      
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-[#0A2540] via-[#103459] to-[#0A2540] p-6 rounded-3xl text-white shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border border-sky-900/50">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-orange-500/20 text-orange-400 border border-orange-500/40 flex items-center justify-center font-bold shadow-inner shrink-0">
            <Building2 className="w-8 h-8" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-orange-500/20 text-orange-300 border border-orange-500/30">
                MUNICIPAL LICENSING & PERMISSIONS HUB
              </span>
              <span className="text-xs text-slate-300 font-mono">Town Planning & Land Governance</span>
            </div>
            <h1 className="text-xl font-black tracking-tight mt-1">
              Building, Trade & Infrastructure Permission Administration
            </h1>
            <p className="text-xs text-slate-300 max-w-2xl mt-0.5">
              Online permission submission, document verification, site inspection scheduling, digital approval certificates, and municipal audit logs.
            </p>
          </div>
        </div>

        <button
          onClick={() => setIsApplyModalOpen(true)}
          className="px-5 py-3 bg-orange-600 hover:bg-orange-700 text-white font-bold rounded-2xl shadow-lg shadow-orange-600/30 transition-all flex items-center gap-2 text-xs uppercase tracking-wide shrink-0"
        >
          <Plus className="w-4 h-4" /> New Permission Application
        </button>
      </div>

      {/* KPI Stats Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 sm:gap-4">
        <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">Total Applications</span>
          <span className="text-2xl font-black text-slate-900 dark:text-slate-100 font-mono mt-1 block">{totalApps}</span>
        </div>

        <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-amber-200 dark:border-amber-900/50 shadow-sm">
          <span className="text-[10px] font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400 block">Pending Verification</span>
          <span className="text-2xl font-black text-amber-600 dark:text-amber-400 font-mono mt-1 block">{pendingApps}</span>
        </div>

        <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-sky-200 dark:border-sky-900/50 shadow-sm">
          <span className="text-[10px] font-bold uppercase tracking-wider text-sky-600 dark:text-sky-400 block">Inspections Scheduled</span>
          <span className="text-2xl font-black text-sky-600 dark:text-sky-400 font-mono mt-1 block">{inspectionScheduled}</span>
        </div>

        <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-emerald-200 dark:border-emerald-900/50 shadow-sm">
          <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 block">Approved & Issued</span>
          <span className="text-2xl font-black text-emerald-600 dark:text-emerald-400 font-mono mt-1 block">{approvedApps}</span>
        </div>

        <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-rose-200 dark:border-rose-900/50 shadow-sm">
          <span className="text-[10px] font-bold uppercase tracking-wider text-rose-600 dark:text-rose-400 block">Rejected / On Hold</span>
          <span className="text-2xl font-black text-rose-600 dark:text-rose-400 font-mono mt-1 block">{rejectedApps}</span>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-3 text-xs font-semibold">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search App #, Applicant, Address, Type..."
            className="w-full pl-9 pr-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl font-medium"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl font-bold text-slate-700 dark:text-slate-300"
          >
            <option value="All">All Categories</option>
            <option value="Residential">Residential</option>
            <option value="Commercial">Commercial</option>
            <option value="Business">Business & Trade</option>
            <option value="PublicInfrastructure">Infrastructure</option>
            <option value="Temporary">Temporary</option>
          </select>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl font-bold text-slate-700 dark:text-slate-300"
          >
            <option value="All">All Statuses</option>
            <option value="Submitted">Submitted</option>
            <option value="Under Verification">Under Verification</option>
            <option value="Documents Pending">Documents Pending</option>
            <option value="Inspection Scheduled">Inspection Scheduled</option>
            <option value="Approved">Approved</option>
            <option value="Rejected">Rejected</option>
          </select>
        </div>
      </div>

      {/* Permission Applications Table */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[750px] text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-950 text-slate-500 font-semibold border-b border-slate-200 dark:border-slate-800 uppercase tracking-wider text-[10px]">
                <th className="p-3">App ID</th>
                <th className="p-3">Category & Type</th>
                <th className="p-3">Applicant Name</th>
                <th className="p-3">Site Location</th>
                <th className="p-3">Status</th>
                <th className="p-3 text-right">Actions & Certificates</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-medium">
              {filteredApps.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-slate-400">
                    No municipal permission applications match your filters.
                  </td>
                </tr>
              ) : (
                filteredApps.map((app) => (
                  <tr key={app.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40">
                    <td className="p-3 font-mono font-bold text-orange-600 dark:text-orange-400">
                      #{app.id}
                    </td>

                    <td className="p-3">
                      <span className="font-bold text-slate-900 dark:text-slate-100 block">{app.permissionType}</span>
                      <span className="text-[10px] text-slate-400 uppercase font-semibold">{app.category}</span>
                    </td>

                    <td className="p-3">
                      <span className="font-semibold text-slate-800 dark:text-slate-200 block">{app.applicantName || app.submittedBy}</span>
                      <span className="text-[10px] text-slate-400 font-mono">{app.applicantPhone}</span>
                    </td>

                    <td className="p-3">
                      <span className="block text-slate-700 dark:text-slate-300 font-semibold">{app.propertyAddress || app.address}</span>
                      <span className="text-[10px] text-slate-400 font-bold">Ward {app.wardNumber || app.ward || 4}</span>
                    </td>

                    <td className="p-3">
                      <span className={`px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider ${
                        app.status === 'Approved' ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-400 border border-emerald-300' :
                        app.status === 'Rejected' ? 'bg-rose-100 text-rose-800 dark:bg-rose-950/60 dark:text-rose-400 border border-rose-300' :
                        app.status === 'Inspection Scheduled' ? 'bg-sky-100 text-sky-800 dark:bg-sky-950/60 dark:text-sky-400 border border-sky-300' :
                        'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-400 border border-amber-300'
                      }`}>
                        {app.status}
                      </span>
                    </td>

                    <td className="p-3 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => setSelectedAppDetail(app)}
                          className="p-1.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-300 rounded-lg"
                          title="View Details"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>

                        <button
                          onClick={() => setSelectedAppForInspection(app)}
                          className="p-1.5 bg-sky-100 dark:bg-sky-950/60 hover:bg-sky-200 text-sky-700 dark:text-sky-300 rounded-lg"
                          title="Schedule/Submit Inspection"
                        >
                          <Calendar className="w-3.5 h-3.5" />
                        </button>

                        {app.status === 'Approved' ? (
                          <button
                            onClick={() => setSelectedAppForCert(app)}
                            className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg text-[10px] flex items-center gap-1 shadow-sm"
                          >
                            <Award className="w-3.5 h-3.5" /> Certificate
                          </button>
                        ) : (
                          <>
                            <button
                              onClick={() => handleApprove(app.id)}
                              className="p-1.5 bg-emerald-100 dark:bg-emerald-950/60 hover:bg-emerald-200 text-emerald-700 dark:text-emerald-300 rounded-lg"
                              title="Approve Permission"
                            >
                              <Check className="w-3.5 h-3.5" />
                            </button>

                            <button
                              onClick={() => handleHold(app.id)}
                              className="p-1.5 bg-amber-100 dark:bg-amber-950/60 hover:bg-amber-200 text-amber-700 dark:text-amber-300 rounded-lg"
                              title="Request Documents / Put On Hold"
                            >
                              <PauseCircle className="w-3.5 h-3.5" />
                            </button>

                            <button
                              onClick={() => handleReject(app.id)}
                              className="p-1.5 bg-rose-100 dark:bg-rose-950/60 hover:bg-rose-200 text-rose-700 dark:text-rose-300 rounded-lg"
                              title="Reject Application"
                            >
                              <X className="w-3.5 h-3.5" />
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Application Detail View Modal */}
      <AnimatePresence>
        {selectedAppDetail && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-slate-900/70 backdrop-blur-md overflow-y-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 rounded-3xl p-6 shadow-2xl border border-slate-200 dark:border-slate-800 w-full max-w-lg space-y-4 my-auto text-xs"
            >
              <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
                <div>
                  <span className="font-mono font-bold text-orange-600 text-xs">#{selectedAppDetail.id}</span>
                  <h3 className="text-base font-extrabold text-slate-900 dark:text-slate-100">{selectedAppDetail.permissionType}</h3>
                </div>
                <button onClick={() => setSelectedAppDetail(null)} className="text-slate-400 hover:text-slate-700 dark:hover:text-slate-200">✕</button>
              </div>

              <div className="space-y-3 font-sans">
                <div className="grid grid-cols-2 gap-2 bg-slate-50 dark:bg-slate-950 p-3 rounded-xl">
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase font-bold block">Category</span>
                    <span className="font-bold">{selectedAppDetail.category}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase font-bold block">Status</span>
                    <span className="font-bold text-emerald-600">{selectedAppDetail.status}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase font-bold block">Applicant</span>
                    <span className="font-semibold">{selectedAppDetail.applicantName || selectedAppDetail.submittedBy}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase font-bold block">Ward</span>
                    <span className="font-semibold">Ward {selectedAppDetail.wardNumber || selectedAppDetail.ward || 4}</span>
                  </div>
                </div>

                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-bold block mb-1">Site Location</span>
                  <p className="font-medium text-slate-800 dark:text-slate-200 bg-slate-50 dark:bg-slate-950 p-2.5 rounded-xl">
                    {selectedAppDetail.propertyAddress || selectedAppDetail.address}
                  </p>
                </div>

                {selectedAppDetail.inspectionLog && (
                  <div className="p-3 bg-sky-50 dark:bg-sky-950/40 border border-sky-200 dark:border-sky-800 rounded-xl space-y-1">
                    <span className="font-bold text-sky-900 dark:text-sky-300 block text-[11px]">Field Inspection Findings:</span>
                    <p className="text-[11px] text-sky-800 dark:text-sky-400">{selectedAppDetail.inspectionLog.fieldRemarks}</p>
                    <span className="text-[9px] font-mono text-sky-600 block">Inspected by {selectedAppDetail.inspectionLog.inspectorSignature}</span>
                  </div>
                )}
              </div>

              <div className="pt-2">
                <button
                  onClick={() => setSelectedAppDetail(null)}
                  className="w-full py-2.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-800 dark:text-slate-200 font-bold rounded-xl"
                >
                  Close Overview
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Modals */}
      <PermissionApplicationModal
        isOpen={isApplyModalOpen}
        onClose={() => setIsApplyModalOpen(false)}
      />

      <InspectionManagementModal
        isOpen={!!selectedAppForInspection}
        onClose={() => setSelectedAppForInspection(null)}
        application={selectedAppForInspection}
      />

      <DigitalPermissionCertificateModal
        isOpen={!!selectedAppForCert}
        onClose={() => setSelectedAppForCert(null)}
        application={selectedAppForCert}
      />
    </div>
  );
};
