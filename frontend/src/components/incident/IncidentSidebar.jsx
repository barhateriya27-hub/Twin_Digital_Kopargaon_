import React from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { X, User, MapPin, Calendar, Clock, AlertTriangle, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { GoogleMapsLauncher } from './GoogleMapsLauncher';

export const IncidentSidebar = ({ incident, onClose, onUpdateStatus, onAssignOfficer }) => {
  const { t } = useTranslation();
  if (!incident) return null;

  return (
    <motion.aside
      initial={{ x: 320, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: 320, opacity: 0 }}
      className="absolute right-0 top-0 bottom-0 w-80 bg-white/95 dark:bg-slate-900/95 backdrop-blur-xs border-l border-slate-200 dark:border-slate-800 p-4 z-30 shadow-xl flex flex-col justify-between text-xs overflow-y-auto"
    >
      <div className="space-y-4">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
          <div>
            <span className="font-mono text-[10px] font-bold text-slate-400 block">{incident.id}</span>
            <h3 className="font-bold text-slate-900 dark:text-slate-100 text-sm">{incident.title}</h3>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-700">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Priority & Status Badges */}
        <div className="flex items-center gap-2 flex-wrap">
          <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
            incident.priority === 'Critical' || incident.priority === 'Emergency' ? 'bg-rose-100 text-rose-800 dark:bg-rose-950/60 dark:text-rose-300' :
            incident.priority === 'High' ? 'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300' :
            'bg-blue-100 text-blue-800 dark:bg-blue-950/60 dark:text-blue-300'
          }`}>
            {t('incidentSidebar.priorityLabel', 'Priority:')} {incident.priority}
          </span>
          <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
            incident.status === 'Resolved' || incident.status === 'Completed' || incident.status === 'Closed' ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300' :
            incident.status === 'In Progress' ? 'bg-blue-100 text-blue-800 dark:bg-blue-950/60 dark:text-blue-300' :
            incident.status === 'Assigned' ? 'bg-purple-100 text-purple-800 dark:bg-purple-950/60 dark:text-purple-300' :
            'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300'
          }`}>
            {t('incidentSidebar.statusLabel', 'Status:')} {incident.status}
          </span>
        </div>

        {/* Google Maps Navigation Launcher Button */}
        <div className="pt-1">
          <GoogleMapsLauncher
            latitude={incident.latitude}
            longitude={incident.longitude}
            locationName={incident.locationName || incident.address}
            title={incident.title}
            className="w-full py-2"
          />
        </div>

        {/* Details Grid */}
        <div className="space-y-3 pt-2 border-t border-slate-100 dark:border-slate-800">
          <div>
            <span className="text-slate-400 block text-[10px] uppercase font-semibold">{t('incidentSidebar.locationWard', 'Location & Ward:')}</span>
            <span className="font-semibold text-slate-900 dark:text-slate-100">{incident.address || incident.locationName || `Ward ${incident.ward}, Kopargaon`}</span>
            {incident.latitude && incident.longitude && (
              <span className="font-mono text-[10px] text-slate-400 block mt-0.5">
                Coords: {incident.latitude}, {incident.longitude}
              </span>
            )}
          </div>

          <div>
            <span className="text-slate-400 block text-[10px] uppercase font-semibold">{t('incidentSidebar.catDept', 'Category & Department:')}</span>
            <span className="font-medium text-slate-800 dark:text-slate-200">{incident.category} • {incident.department || 'Public Works'}</span>
          </div>

          <div>
            <span className="text-slate-400 block text-[10px] uppercase font-semibold">{t('incidentSidebar.submittedBy', 'Submitted By:')}</span>
            <span className="font-medium text-slate-800 dark:text-slate-200">{incident.submittedBy || 'Citizen Resident'}</span>
          </div>

          <div>
            <span className="text-slate-400 block text-[10px] uppercase font-semibold">{t('incidentSidebar.description', 'Complaint Description:')}</span>
            <p className="p-2.5 bg-slate-50 dark:bg-slate-950 rounded-md border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 mt-1">
              {incident.description || 'No additional notes attached.'}
            </p>
          </div>

          {/* Department Assignment */}
          <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
            <span className="text-slate-500 block text-[10px] uppercase font-semibold mb-1">{t('incidentSidebar.assignTeam', 'Assign Maintenance Squad:')}</span>
            <select
              value={incident.assignedOfficer || ''}
              onChange={(e) => onAssignOfficer && onAssignOfficer(incident.id, e.target.value)}
              className="w-full p-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-md text-xs font-medium focus:outline-none"
            >
              <option value="">Select Maintenance Squad</option>
              <option value="Public Works - Team A">Public Works Maintenance - Team A</option>
              <option value="Sanitation - Fleet B">Sanitation Services - Fleet B</option>
              <option value="Water Dept - Cell 1">Water Supply & Valves - Cell 1</option>
              <option value="Electrical Grid Unit">Electrical Grid Maintenance</option>
              <option value="Traffic Cell">Traffic & Transit Signal Unit</option>
            </select>
          </div>

          {/* Lifecycle Status Management */}
          <div className="pt-2 border-t border-slate-100 dark:border-slate-800 space-y-1.5">
            <span className="text-slate-500 block text-[10px] uppercase font-semibold">{t('incidentSidebar.updateLifecycle', 'Update Lifecycle Status:')}</span>
            <div className="grid grid-cols-2 gap-1.5">
              {[
                { id: 'Reported', label: 'Reported' },
                { id: 'Assigned', label: 'Assigned' },
                { id: 'In Progress', label: 'In Progress' },
                { id: 'Resolved', label: 'Resolved' },
                { id: 'Closed', label: 'Closed' }
              ].map((st) => (
                <button
                  key={st.id}
                  onClick={() => onUpdateStatus && onUpdateStatus(incident.id, st.id)}
                  className={`py-1.5 text-center text-[10px] font-semibold rounded border transition-all ${
                    incident.status === st.id
                      ? 'bg-[#0A2540] text-white border-[#0A2540]'
                      : 'bg-slate-50 dark:bg-slate-950 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                >
                  {st.label}
                </button>
              ))}
            </div>
          </div>

        </div>
      </div>

      <div className="pt-3 border-t border-slate-100 dark:border-slate-800 text-[10px] text-slate-400 flex items-center justify-between">
        <span>Incident ID: {incident.id}</span>
        <button onClick={onClose} className="px-2 py-1 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded font-semibold">
          {t('incidentSidebar.btnClose', 'Close Panel')}
        </button>
      </div>
    </motion.aside>
  );
};
