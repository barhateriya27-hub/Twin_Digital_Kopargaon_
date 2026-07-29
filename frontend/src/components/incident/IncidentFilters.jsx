import React from 'react';
import { useTranslation } from 'react-i18next';
import { Filter, Search } from 'lucide-react';

export const IncidentFilters = ({
  statusFilter,
  setStatusFilter,
  priorityFilter,
  setPriorityFilter,
  categoryFilter,
  setCategoryFilter,
  wardFilter,
  setWardFilter,
  searchQuery,
  setSearchQuery,
  totalCount,
  filteredCount
}) => {
  const { t } = useTranslation();

  return (
    <div className="flex flex-wrap items-center justify-between gap-3 p-3 bg-slate-50 dark:bg-slate-950 rounded-lg border border-slate-200 dark:border-slate-800 text-xs">
      
      <div className="flex flex-wrap items-center gap-3">
        
        {/* Search */}
        <div className="relative w-44 sm:w-56">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={t('incidentFilters.searchPlaceholder', 'Search ticket ID or address...')}
            className="w-full pl-8 pr-2.5 py-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-md text-[11px] font-medium focus:outline-none"
          />
        </div>

        {/* Status Filter */}
        <div className="flex items-center gap-1.5">
          <span className="font-semibold text-slate-700 dark:text-slate-300">{t('incidentFilters.statusLabel', 'Status:')}</span>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-2 py-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-md text-xs font-medium focus:outline-none"
          >
            <option value="All">{t('incidentFilters.allStatuses', 'All Statuses')}</option>
            <option value="Pending">{t('incidentFilters.statusPending', 'Pending')}</option>
            <option value="In Progress">{t('incidentFilters.statusInProgress', 'In Progress')}</option>
            <option value="Resolved">{t('incidentFilters.statusResolved', 'Resolved')}</option>
          </select>
        </div>

        {/* Priority Filter */}
        <div className="flex items-center gap-1.5">
          <span className="font-semibold text-slate-700 dark:text-slate-300">{t('incidentFilters.priorityLabel', 'Priority:')}</span>
          <select
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
            className="px-2 py-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-md text-xs font-medium focus:outline-none"
          >
            <option value="All">{t('incidentFilters.allPriorities', 'All Priorities')}</option>
            <option value="Critical">{t('incidentFilters.priorityCritical', 'Critical')}</option>
            <option value="High">{t('incidentFilters.priorityHigh', 'High')}</option>
            <option value="Medium">{t('incidentFilters.priorityMedium', 'Medium')}</option>
          </select>
        </div>

        {/* Category Filter */}
        <div className="flex items-center gap-1.5">
          <span className="font-semibold text-slate-700 dark:text-slate-300">{t('incidentFilters.categoryLabel', 'Category:')}</span>
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="px-2 py-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-md text-xs font-medium focus:outline-none"
          >
            <option value="All">{t('incidentFilters.allCategories', 'All Categories')}</option>
            <option value="Garbage">{t('incidentFilters.catSanitation', 'Sanitation')}</option>
            <option value="Pothole">{t('incidentFilters.catPublicWorks', 'Public Works')}</option>
            <option value="Water Leakage">{t('incidentFilters.catWaterSupply', 'Water Supply')}</option>
            <option value="Street Light">{t('incidentFilters.catElectrical', 'Electrical')}</option>
            <option value="Traffic">{t('incidentFilters.catTraffic', 'Traffic & Transit')}</option>
          </select>
        </div>

      </div>

      <div className="text-[11px] text-slate-500 font-mono">
        {t('incidentFilters.showingCountPrefix', 'Showing')} <strong>{filteredCount}</strong> {t('incidentFilters.of', 'of')} <strong>{totalCount}</strong> {t('incidentFilters.activeIncidents', 'active incidents')}
      </div>

    </div>
  );
};
