import React from 'react';
import { useTranslation } from 'react-i18next';
import { Search, X, Crosshair, Sparkles } from 'lucide-react';

export const SearchBar = ({ searchQuery, setSearchQuery, onSelectTag }) => {
  const { t } = useTranslation();

  const quickTags = [
    { label: t('emergencyPortal.catHospitals', 'Hospitals'), query: 'Hospital' },
    { label: t('emergencyPortal.catPolice', 'Police'), query: 'Police Station' },
    { label: t('emergencyPortal.catPharmacies', 'Pharmacies'), query: 'Pharmacy' },
    { label: t('emergencyPortal.catFire', 'Fire Brigade'), query: 'Fire Station' },
    { label: t('emergencyPortal.catBloodBanks', 'Blood Bank'), query: 'Blood Bank' }
  ];

  return (
    <div className="space-y-2.5">
      <div className="relative flex items-center w-full">
        <Search className="w-5 h-5 text-sky-600 absolute left-4 pointer-events-none" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder={t('emergencyPortal.searchPlaceholder', 'Search nearby emergency services (e.g. Civil Hospital, City Police Station, Pharmacy)...')}
          className="w-full pl-12 pr-10 py-3 bg-white dark:bg-slate-900 border-2 border-sky-100 dark:border-slate-800 rounded-2xl text-sm font-semibold text-slate-800 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:border-sky-500 shadow-sm transition-all"
        />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery('')}
            className="absolute right-3.5 p-1 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Quick Search Tag Chips */}
      <div className="flex flex-wrap items-center gap-1.5 text-xs">
        <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mr-1 flex items-center gap-1">
          <Sparkles className="w-3 h-3 text-emerald-500" /> {t('emergencyPortal.quickSearch', 'Quick Search:')}
        </span>
        {quickTags.map((tag) => (
          <button
            key={tag.label}
            onClick={() => onSelectTag(tag.query)}
            className={`px-3 py-1 rounded-full border text-xs font-semibold transition-all ${
              searchQuery.toLowerCase() === tag.query.toLowerCase()
                ? 'bg-sky-600 text-white border-sky-600 shadow-sm'
                : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-sky-400 hover:text-sky-600'
            }`}
          >
            {tag.label}
          </button>
        ))}
      </div>
    </div>
  );
};
