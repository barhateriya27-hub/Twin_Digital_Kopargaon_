import React from 'react';
import { useTranslation } from 'react-i18next';
import { 
  Building2, 
  ShieldCheck, 
  Flame, 
  Pill, 
  Droplet, 
  Landmark, 
  Layers 
} from 'lucide-react';

export const FilterButtons = ({ activeFilter, setActiveFilter, counts = {} }) => {
  const { t } = useTranslation();

  const filters = [
    { id: 'All', label: t('emergencyPortal.allServices', 'All Services'), icon: Layers, color: 'text-slate-600' },
    { id: 'Hospitals', label: t('emergencyPortal.catHospitals', 'Hospitals'), icon: Building2, color: 'text-rose-500' },
    { id: 'Police', label: t('emergencyPortal.catPolice', 'Police'), icon: ShieldCheck, color: 'text-sky-600' },
    { id: 'Fire Brigade', label: t('emergencyPortal.catFire', 'Fire Brigade'), icon: Flame, color: 'text-amber-500' },
    { id: 'Pharmacies', label: t('emergencyPortal.catPharmacies', 'Pharmacies'), icon: Pill, color: 'text-emerald-500' },
    { id: 'Blood Banks', label: t('emergencyPortal.catBloodBanks', 'Blood Banks'), icon: Droplet, color: 'text-red-600' },
    { id: 'Municipal Offices', label: t('emergencyPortal.catMunicipal', 'Municipal Offices'), icon: Landmark, color: 'text-indigo-600' }
  ];

  return (
    <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
      {filters.map((filter) => {
        const Icon = filter.icon;
        const isActive = activeFilter === filter.id;
        const count = filter.id === 'All' ? counts.total || 0 : counts[filter.id] || 0;

        return (
          <button
            key={filter.id}
            onClick={() => setActiveFilter(filter.id)}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all border ${
              isActive
                ? 'bg-[#0A2540] text-white border-[#0A2540] shadow-md shadow-slate-900/10 scale-[1.02]'
                : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700/60'
            }`}
          >
            <Icon className={`w-4 h-4 ${isActive ? 'text-emerald-400' : filter.color}`} />
            <span>{filter.label}</span>
            <span
              className={`px-1.5 py-0.2 rounded-full text-[10px] font-extrabold ${
                isActive
                  ? 'bg-emerald-500 text-white'
                  : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300'
              }`}
            >
              {count}
            </span>
          </button>
        );
      })}
    </div>
  );
};
