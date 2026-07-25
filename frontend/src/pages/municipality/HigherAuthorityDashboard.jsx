import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Building2, 
  ShieldAlert, 
  AlertTriangle, 
  UserCheck, 
  BarChart3, 
  Clock, 
  FileText, 
  Send, 
  CheckCircle2, 
  AlertCircle, 
  Users, 
  Activity, 
  TrendingUp, 
  Filter, 
  Search,
  Eye,
  RefreshCw,
  ShieldCheck,
  Award,
  DollarSign
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { SLAIndicator } from '../../components/SLAIndicator';
import { RevenueAnalyticsDashboardView } from '../../components/tax/RevenueAnalyticsDashboardView';

export const HigherAuthorityDashboard = ({ onSelectComplaint }) => {
  const { 
    complaints = [], 
    issueOfficerWarning, 
    requestExplanation, 
    assignComplaint, 
    showToast 
  } = useApp();

  const [activeTab, setActiveTab] = useState('escalated'); // 'escalated' | 'department_perf' | 'officers' | 'all_tickets'
  const [selectedTicketForAction, setSelectedTicketForAction] = useState(null);
  const [actionType, setActionType] = useState(null); // 'warning' | 'explanation' | 'reassign'
  const [actionNote, setActionNote] = useState('');
  const [newOfficerName, setNewOfficerName] = useState('');
  const [newDepartment, setNewDepartment] = useState('');

  // Escalated cases (SLA breached or high priority delayed)
  const escalatedComplaints = complaints.filter(c => c.isEscalated || c.status === 'Escalated');

  // Stats calculation
  const totalComplaints = complaints.length;
  const totalEscalated = escalatedComplaints.length;
  const resolvedCount = complaints.filter(c => c.status === 'Completed' || c.status === 'Resolved').length;
  const overallSlaRate = totalComplaints > 0 ? Math.round(((totalComplaints - totalEscalated) / totalComplaints) * 100) : 100;

  // Department breakdown
  const deptStats = [
    'Sanitation & Solid Waste Management',
    'Public Works (PWD)',
    'Water Supply & Sewerage Department',
    'Electrical & Street Lighting',
    'Town Planning & Transit'
  ].map(dept => {
    const deptTickets = complaints.filter(c => c.department === dept);
    const deptTotal = deptTickets.length;
    const deptEscalated = deptTickets.filter(c => c.isEscalated || c.status === 'Escalated').length;
    const deptResolved = deptTickets.filter(c => c.status === 'Completed' || c.status === 'Resolved').length;
    const deptSlaRate = deptTotal > 0 ? Math.round(((deptTotal - deptEscalated) / deptTotal) * 100) : 100;

    return {
      department: dept,
      total: deptTotal,
      escalated: deptEscalated,
      resolved: deptResolved,
      slaRate: deptSlaRate
    };
  });

  const handleActionSubmit = (e) => {
    e.preventDefault();
    if (!selectedTicketForAction) return;

    if (actionType === 'warning') {
      if (!actionNote.trim()) {
        showToast('Please provide warning details.', 'warning');
        return;
      }
      issueOfficerWarning(
        selectedTicketForAction.id,
        selectedTicketForAction.assignedOfficer || 'Department Officer',
        actionNote
      );
      showToast(`Formal Warning issued to ${selectedTicketForAction.assignedOfficer || 'Officer'} for Ticket #${selectedTicketForAction.id}`);
    } else if (actionType === 'explanation') {
      if (!actionNote.trim()) {
        showToast('Please specify the explanation required.', 'warning');
        return;
      }
      requestExplanation(selectedTicketForAction.id, actionNote);
      showToast(`Formal Explanation requested for Ticket #${selectedTicketForAction.id}`);
    } else if (actionType === 'reassign') {
      if (!newOfficerName || !newDepartment) {
        showToast('Please specify officer name and department', 'warning');
        return;
      }
      assignComplaint(selectedTicketForAction.id, newOfficerName, newDepartment);
      showToast(`Reassigned Ticket #${selectedTicketForAction.id} to ${newOfficerName} (${newDepartment})`);
    }

    setSelectedTicketForAction(null);
    setActionType(null);
    setActionNote('');
  };

  return (
    <div className="space-y-6">
      {/* Commissioner Command Header Banner */}
      <div className="bg-gradient-to-r from-[#0A2540] via-[#103459] to-[#0A2540] p-6 rounded-2xl text-white shadow-xl border border-sky-900/50 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/40 flex items-center justify-center font-bold shadow-inner shrink-0">
            <ShieldAlert className="w-8 h-8" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-amber-400/20 text-amber-300 border border-amber-400/30">
                HIGHER AUTHORITY OVERVIEW
              </span>
              <span className="text-xs text-slate-300 font-mono">
                Municipal Commissioner Office
              </span>
            </div>
            <h1 className="text-xl font-bold tracking-tight mt-1">
              Apex Governance & Inter-Department Monitoring Platform
            </h1>
            <p className="text-xs text-slate-300 max-w-2xl mt-0.5">
              Direct intervention controls, SLA breach auto-escalations, officer performance oversight, and municipal transparency auditing.
            </p>
          </div>
        </div>

        {/* Quick Executive Stats Pill */}
        <div className="flex items-center gap-3 bg-white/10 backdrop-blur-md px-4 py-3 rounded-xl border border-white/10 shrink-0">
          <div>
            <span className="text-[10px] uppercase font-bold text-slate-300 block">SLA Compliance Rate</span>
            <span className="text-lg font-extrabold text-emerald-400 font-mono">{overallSlaRate}%</span>
          </div>
          <div className="w-px h-8 bg-white/20"></div>
          <div>
            <span className="text-[10px] uppercase font-bold text-slate-300 block">Overdue/Escalated</span>
            <span className="text-lg font-extrabold text-rose-400 font-mono">{totalEscalated}</span>
          </div>
        </div>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-2 overflow-x-auto scrollbar-none text-xs font-bold">
        <button
          onClick={() => setActiveTab('escalated')}
          className={`px-4 py-2 rounded-lg transition-colors flex items-center gap-2 shrink-0 ${activeTab === 'escalated' ? 'bg-rose-600 text-white shadow-md' : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-800 hover:bg-slate-50'}`}
        >
          <AlertTriangle className="w-4 h-4 text-amber-300" />
          <span>Escalated Cases Command Center ({totalEscalated})</span>
        </button>

        <button
          onClick={() => setActiveTab('department_perf')}
          className={`px-4 py-2 rounded-lg transition-colors flex items-center gap-2 shrink-0 ${activeTab === 'department_perf' ? 'bg-[#0A2540] text-white dark:bg-sky-600 shadow-md' : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-800 hover:bg-slate-50'}`}
        >
          <BarChart3 className="w-4 h-4 text-sky-400" />
          <span>Department Efficiency & SLA Benchmarking</span>
        </button>

        <button
          onClick={() => setActiveTab('all_tickets')}
          className={`px-4 py-2 rounded-lg transition-colors flex items-center gap-2 shrink-0 ${activeTab === 'all_tickets' ? 'bg-[#0A2540] text-white dark:bg-sky-600 shadow-md' : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-800 hover:bg-slate-50'}`}
        >
          <Building2 className="w-4 h-4 text-emerald-400" />
          <span>All Municipal Complaints ({totalComplaints})</span>
        </button>

        <button
          onClick={() => setActiveTab('revenue_analytics')}
          className={`px-4 py-2 rounded-lg transition-colors flex items-center gap-2 shrink-0 ${activeTab === 'revenue_analytics' ? 'bg-[#0A2540] text-white dark:bg-sky-600 shadow-md' : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-800 hover:bg-slate-50'}`}
        >
          <DollarSign className="w-4 h-4 text-emerald-400" />
          <span>Executive Revenue Analytics</span>
        </button>
      </div>

      {/* TAB 1: Escalated Cases Command Center */}
      {activeTab === 'escalated' && (
        <div className="space-y-4">
          <div className="bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/60 rounded-xl p-4 text-xs text-amber-900 dark:text-amber-300 flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <p className="font-bold">Higher Authority Intervention Mandate</p>
              <p className="mt-0.5 leading-relaxed">
                Complaints displayed below have passed the mandatory 3-day SLA resolution period or have been marked for high-priority escalation. You have administrative clearance to issue official warnings to department officers, demand formal explanations, or transfer tickets directly.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4">
            {escalatedComplaints.length === 0 ? (
              <div className="p-12 text-center bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-400">
                <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto mb-2 opacity-80" />
                <p className="text-sm font-bold text-slate-800 dark:text-slate-200">Zero Overdue Escalated Cases</p>
                <p className="text-xs text-slate-500 mt-1">All municipal departments are operating within standard 3-day SLA parameters.</p>
              </div>
            ) : (
              escalatedComplaints.map(item => (
                <div key={item.id} className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-rose-200 dark:border-rose-900/60 shadow-md space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-sm font-extrabold text-rose-600 dark:text-rose-400">
                        #{item.id}
                      </span>
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300">
                        Escalated (3-Day SLA Breached)
                      </span>
                      <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                        Ward {item.ward} • {item.department}
                      </span>
                    </div>

                    <SLAIndicator submittedAt={item.createdAt || item.submittedAt} dueDate={item.dueDate} currentStatus={item.status} />
                  </div>

                  <div>
                    <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 mb-1">
                      {item.title}
                    </h3>
                    <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                      {item.description}
                    </p>
                  </div>

                  {/* Officer Info & Timeline Notes */}
                  <div className="p-3 bg-slate-50 dark:bg-slate-950 rounded-lg text-xs grid grid-cols-1 sm:grid-cols-2 gap-2 text-slate-600 dark:text-slate-400">
                    <div>
                      <span className="font-bold text-slate-800 dark:text-slate-200 block">Assigned Officer:</span>
                      <span>{item.assignedOfficer || 'Unassigned (Department Queue)'}</span>
                    </div>
                    <div>
                      <span className="font-bold text-slate-800 dark:text-slate-200 block">Complainant:</span>
                      <span>{item.submittedBy}</span>
                    </div>
                  </div>

                  {/* Higher Authority Action Buttons */}
                  <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-end gap-2 flex-wrap text-xs">
                    <button
                      onClick={() => onSelectComplaint && onSelectComplaint(item.id)}
                      className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-200 rounded font-semibold flex items-center gap-1.5"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>Full Timeline</span>
                    </button>

                    <button
                      onClick={() => {
                        setSelectedTicketForAction(item);
                        setActionType('warning');
                      }}
                      className="px-3 py-1.5 bg-amber-600 hover:bg-amber-500 text-white rounded font-bold flex items-center gap-1.5"
                    >
                      <AlertTriangle className="w-3.5 h-3.5" />
                      <span>Issue Warning</span>
                    </button>

                    <button
                      onClick={() => {
                        setSelectedTicketForAction(item);
                        setActionType('explanation');
                      }}
                      className="px-3 py-1.5 bg-sky-700 hover:bg-sky-600 text-white rounded font-bold flex items-center gap-1.5"
                    >
                      <FileText className="w-3.5 h-3.5" />
                      <span>Request Explanation</span>
                    </button>

                    <button
                      onClick={() => {
                        setSelectedTicketForAction(item);
                        setActionType('reassign');
                      }}
                      className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded font-bold flex items-center gap-1.5"
                    >
                      <UserCheck className="w-3.5 h-3.5" />
                      <span>Reassign / Transfer</span>
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* TAB 2: Department Efficiency & SLA Benchmarking */}
      {activeTab === 'department_perf' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {deptStats.map(stat => (
            <div key={stat.department} className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                <h3 className="text-xs font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                  <Building2 className="w-4 h-4 text-sky-500" />
                  <span>{stat.department}</span>
                </h3>
                <span className={`px-2.5 py-0.5 rounded text-xs font-bold font-mono ${stat.slaRate >= 80 ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300' : 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300'}`}>
                  {stat.slaRate}% SLA Rate
                </span>
              </div>

              <div className="grid grid-cols-3 gap-2 text-center">
                <div className="p-2 bg-slate-50 dark:bg-slate-950 rounded-lg">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Total Tickets</span>
                  <span className="text-base font-bold font-mono text-slate-800 dark:text-slate-200">{stat.total}</span>
                </div>
                <div className="p-2 bg-slate-50 dark:bg-slate-950 rounded-lg">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Resolved</span>
                  <span className="text-base font-bold font-mono text-emerald-600">{stat.resolved}</span>
                </div>
                <div className="p-2 bg-slate-50 dark:bg-slate-950 rounded-lg">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Overdue/Escalated</span>
                  <span className="text-base font-bold font-mono text-rose-600">{stat.escalated}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* TAB 3: All Municipal Complaints */}
      {activeTab === 'all_tickets' && (
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
          <div className="p-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 flex items-center justify-between">
            <h3 className="text-xs font-bold text-slate-900 dark:text-slate-100 uppercase tracking-wider">
              Comprehensive Citywide Complaints Directory
            </h3>
            <span className="text-xs text-slate-500 font-mono">{complaints.length} Total Logs</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-100 dark:bg-slate-800 text-slate-500 font-semibold border-b border-slate-200 dark:border-slate-700 uppercase tracking-wider text-[10px]">
                  <th className="p-3">ID</th>
                  <th className="p-3">Title & Category</th>
                  <th className="p-3">Ward</th>
                  <th className="p-3">Department</th>
                  <th className="p-3">Status</th>
                  <th className="p-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {complaints.map(item => (
                  <tr key={item.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40">
                    <td className="p-3 font-mono font-bold text-slate-900 dark:text-slate-100">#{item.id}</td>
                    <td className="p-3 font-semibold text-slate-800 dark:text-slate-200">{item.title}</td>
                    <td className="p-3 text-slate-600">Ward {item.ward}</td>
                    <td className="p-3 text-slate-600">{item.department}</td>
                    <td className="p-3">
                      <SLAIndicator submittedAt={item.createdAt || item.submittedAt} dueDate={item.dueDate} currentStatus={item.status} compact />
                    </td>
                    <td className="p-3 text-right">
                      <button
                        onClick={() => onSelectComplaint && onSelectComplaint(item.id)}
                        className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 text-slate-800 dark:text-slate-200 rounded font-medium ml-auto"
                      >
                        Inspect
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 4: Executive Revenue Analytics */}
      {activeTab === 'revenue_analytics' && (
        <RevenueAnalyticsDashboardView />
      )}

      {/* Action Modal (Warning / Explanation / Reassign) */}
      <AnimatePresence>
        {selectedTicketForAction && actionType && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-900/60 backdrop-blur-sm overflow-y-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white dark:bg-slate-900 rounded-xl shadow-2xl border border-slate-200 dark:border-slate-800 w-full max-w-lg p-4 sm:p-6 space-y-4 max-h-[90vh] overflow-y-auto my-auto"
            >
              <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
                <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                  Higher Authority Action - Ticket #{selectedTicketForAction.id}
                </h3>
                <button onClick={() => setSelectedTicketForAction(null)} className="text-slate-400 hover:text-slate-700">✕</button>
              </div>

              <form onSubmit={handleActionSubmit} className="space-y-4">
                {actionType === 'warning' && (
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Formal Officer Warning Message *
                    </label>
                    <textarea
                      required
                      rows={3}
                      value={actionNote}
                      onChange={(e) => setActionNote(e.target.value)}
                      placeholder="Specify the reason for warning (e.g. Failure to address Ward 6 pothole within 3-day SLA without justification)..."
                      className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg text-slate-900 dark:text-slate-100"
                    />
                  </div>
                )}

                {actionType === 'explanation' && (
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Explanation Requirement *
                    </label>
                    <textarea
                      required
                      rows={3}
                      value={actionNote}
                      onChange={(e) => setActionNote(e.target.value)}
                      placeholder="State the technical query required from the officer regarding delay..."
                      className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg text-slate-900 dark:text-slate-100"
                    />
                  </div>
                )}

                {actionType === 'reassign' && (
                  <div className="space-y-3">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">New Officer Name *</label>
                      <input
                        type="text"
                        required
                        value={newOfficerName}
                        onChange={(e) => setNewOfficerName(e.target.value)}
                        placeholder="e.g. Er. Rajesh Shinde"
                        className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg text-slate-900 dark:text-slate-100"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Target Department *</label>
                      <input
                        type="text"
                        required
                        value={newDepartment}
                        onChange={(e) => setNewDepartment(e.target.value)}
                        placeholder="e.g. Public Works (PWD)"
                        className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg text-slate-900 dark:text-slate-100"
                      />
                    </div>
                  </div>
                )}

                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setSelectedTicketForAction(null)}
                    className="px-4 py-2 text-xs font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-100 rounded-lg"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 text-xs font-bold text-white bg-rose-600 hover:bg-rose-500 rounded-lg shadow"
                  >
                    Submit Higher Authority Command
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
