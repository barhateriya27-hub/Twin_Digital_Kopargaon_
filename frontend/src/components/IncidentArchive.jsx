import React, { useState } from 'react';
import { Archive, Search, Filter, Calendar, Building2, User, FileText, CheckCircle2, ShieldCheck, Download, Eye } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { SLAIndicator } from './SLAIndicator';

export const IncidentArchive = ({ onSelectComplaint }) => {
  const { complaints = [], auditLogs = [], announcements = [] } = useApp();

  const [activeSubTab, setActiveSubTab] = useState('complaints'); // 'complaints' | 'reports' | 'audit_logs' | 'announcements'
  const [searchQuery, setSearchQuery] = useState('');
  const [wardFilter, setWardFilter] = useState('All');
  const [deptFilter, setDeptFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');

  const wards = [1, 2, 3, 4, 5, 6, 7, 8];
  const departments = [
    'Sanitation & Solid Waste Management',
    'Public Works (PWD)',
    'Water Supply & Sewerage Department',
    'Electrical & Street Lighting',
    'Town Planning & Transit'
  ];

  // Filtered Complaints
  const filteredComplaints = complaints.filter(c => {
    const matchesWard = wardFilter === 'All' || c.ward === parseInt(wardFilter);
    const matchesDept = deptFilter === 'All' || c.department === deptFilter;
    const matchesStatus = statusFilter === 'All' || c.status === statusFilter;
    const matchesSearch = !searchQuery || 
      c.id.toLowerCase().includes(searchQuery.toLowerCase()) || 
      c.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
      c.submittedBy.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.category.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesWard && matchesDept && matchesStatus && matchesSearch;
  });

  // Completed complaints with reports
  const completedReports = complaints.filter(c => c.completionReport || c.status === 'Completed' || c.status === 'Resolved');

  // Filtered Audit Logs
  const filteredAudit = auditLogs.filter(a => {
    const matchesSearch = !searchQuery ||
      a.action.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.entityId?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.user.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-[#0A2540] dark:bg-sky-950 text-emerald-400 flex items-center justify-center font-bold">
            <Archive className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
              Municipal Permanent Incident & Audit Archive
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Immutable historical repository storing complaints, completion certificates, and audit logs
            </p>
          </div>
        </div>

        {/* Subtab Switcher */}
        <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-lg text-xs font-semibold shrink-0">
          <button
            onClick={() => setActiveSubTab('complaints')}
            className={`px-3 py-1.5 rounded-md transition-colors ${activeSubTab === 'complaints' ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 shadow-sm' : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'}`}
          >
            Complaints Archive ({complaints.length})
          </button>
          <button
            onClick={() => setActiveSubTab('reports')}
            className={`px-3 py-1.5 rounded-md transition-colors ${activeSubTab === 'reports' ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 shadow-sm' : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'}`}
          >
            Completion Reports ({completedReports.length})
          </button>
          <button
            onClick={() => setActiveSubTab('audit_logs')}
            className={`px-3 py-1.5 rounded-md transition-colors ${activeSubTab === 'audit_logs' ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 shadow-sm' : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'}`}
          >
            System Audit Logs ({auditLogs.length})
          </button>
        </div>
      </div>

      {/* Filter Controls Bar */}
      <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 text-xs">
        {/* Search */}
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by ID, keyword, citizen, officer..."
            className="w-full pl-9 pr-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-sky-500"
          />
        </div>

        {/* Ward Filter */}
        <div>
          <select
            value={wardFilter}
            onChange={(e) => setWardFilter(e.target.value)}
            className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg text-slate-900 dark:text-slate-100 focus:outline-none"
          >
            <option value="All">All Wards</option>
            {wards.map(w => (
              <option key={w} value={w}>Ward {w}</option>
            ))}
          </select>
        </div>

        {/* Department Filter */}
        <div>
          <select
            value={deptFilter}
            onChange={(e) => setDeptFilter(e.target.value)}
            className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg text-slate-900 dark:text-slate-100 focus:outline-none"
          >
            <option value="All">All Departments</option>
            {departments.map(d => (
              <option key={d} value={d}>{d}</option>
            ))}
          </select>
        </div>

        {/* Status Filter */}
        <div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg text-slate-900 dark:text-slate-100 focus:outline-none"
          >
            <option value="All">All Statuses</option>
            <option value="Pending">Pending</option>
            <option value="In Progress">In Progress</option>
            <option value="Escalated">Escalated</option>
            <option value="Completed">Completed</option>
          </select>
        </div>
      </div>

      {/* Subtab Content: Complaints Archive */}
      {activeSubTab === 'complaints' && (
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[650px] text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50 dark:bg-slate-950 text-slate-500 font-semibold border-b border-slate-200 dark:border-slate-800 uppercase tracking-wider text-[10px]">
                  <th className="p-3">Complaint ID</th>
                  <th className="p-3">Category & Title</th>
                  <th className="p-3">Ward</th>
                  <th className="p-3">Department</th>
                  <th className="p-3">SLA Status</th>
                  <th className="p-3">Submitted Date</th>
                  <th className="p-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {filteredComplaints.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="p-8 text-center text-slate-400">
                      No archived complaints match the specified filter criteria.
                    </td>
                  </tr>
                ) : (
                  filteredComplaints.map(item => (
                    <tr key={item.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors">
                      <td className="p-3 font-mono font-bold text-slate-900 dark:text-slate-100">
                        #{item.id}
                      </td>
                      <td className="p-3">
                        <span className="font-bold text-slate-900 dark:text-slate-100 block">{item.title}</span>
                        <span className="text-[10px] text-slate-500">{item.category} • By {item.submittedBy}</span>
                      </td>
                      <td className="p-3 font-medium text-slate-700 dark:text-slate-300">
                        Ward {item.ward}
                      </td>
                      <td className="p-3 text-slate-600 dark:text-slate-400">
                        {item.department}
                      </td>
                      <td className="p-3">
                        <SLAIndicator submittedAt={item.createdAt || item.submittedAt} dueDate={item.dueDate} currentStatus={item.status} compact />
                      </td>
                      <td className="p-3 font-mono text-slate-500">
                        {new Date(item.createdAt || item.submittedAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                      </td>
                      <td className="p-3 text-right">
                        <button
                          onClick={() => onSelectComplaint && onSelectComplaint(item.id)}
                          className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 rounded font-medium flex items-center gap-1 ml-auto"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>View Ticket</span>
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Subtab Content: Completion Reports Archive */}
      {activeSubTab === 'reports' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {completedReports.length === 0 ? (
            <div className="md:col-span-2 p-12 text-center bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-400">
              <FileText className="w-10 h-10 mx-auto mb-2 opacity-30" />
              <p className="text-xs font-medium">No completed work reports logged in archive yet</p>
            </div>
          ) : (
            completedReports.map(c => (
              <div key={c.id} className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
                <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-2">
                  <span className="font-mono text-xs font-bold text-sky-600 dark:text-sky-400">#{c.id}</span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                    Official Certificate Generated
                  </span>
                </div>
                <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100">{c.title}</h4>
                <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-2">
                  {c.completionReport?.actionsTaken || 'Municipal field repair and sanitation completed in compliance with engineering standards.'}
                </p>
                <div className="flex items-center justify-between text-[11px] text-slate-500 pt-2 border-t border-slate-100 dark:border-slate-800">
                  <span>Signed by: {c.completionReport?.officerName || c.assignedOfficer || 'Municipal Engineer'}</span>
                  <button
                    onClick={() => onSelectComplaint && onSelectComplaint(c.id)}
                    className="text-sky-600 font-semibold hover:underline flex items-center gap-1"
                  >
                    <Download className="w-3 h-3" />
                    <span>Download Report</span>
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Subtab Content: Audit Logs */}
      {activeSubTab === 'audit_logs' && (
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[650px] text-left border-collapse text-xs font-mono">
              <thead>
                <tr className="bg-slate-50 dark:bg-slate-950 text-slate-500 font-semibold border-b border-slate-200 dark:border-slate-800 uppercase tracking-wider text-[10px]">
                  <th className="p-3">Log ID</th>
                  <th className="p-3">Timestamp</th>
                  <th className="p-3">Actor / Role</th>
                  <th className="p-3">IP Address</th>
                  <th className="p-3">System Action</th>
                  <th className="p-3">Target Entity</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {filteredAudit.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="p-8 text-center text-slate-400">
                      No audit entries matching filter criteria.
                    </td>
                  </tr>
                ) : (
                  filteredAudit.map(log => (
                    <tr key={log.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors">
                      <td className="p-3 font-bold text-slate-500">{log.id}</td>
                      <td className="p-3 text-slate-600 dark:text-slate-400">
                        {new Date(log.timestamp).toLocaleString('en-IN')}
                      </td>
                      <td className="p-3 text-slate-900 dark:text-slate-100 font-semibold">
                        {log.user.name} ({log.user.role})
                      </td>
                      <td className="p-3 text-slate-500">{log.ipAddress}</td>
                      <td className="p-3">
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700">
                          {log.action}
                        </span>
                      </td>
                      <td className="p-3 font-bold text-sky-600 dark:text-sky-400">
                        {log.entityId} ({log.entityType})
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
