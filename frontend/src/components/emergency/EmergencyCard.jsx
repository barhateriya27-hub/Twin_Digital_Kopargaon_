import React from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { 
  Building2, 
  ShieldCheck, 
  Flame, 
  Pill, 
  Droplet, 
  Landmark, 
  Phone, 
  Navigation, 
  Clock, 
  MapPin, 
  Copy, 
  Check, 
  ExternalLink 
} from 'lucide-react';
import { getGoogleMapsDirectionsUrl } from '../../services/mapService';
import { useApp } from '../../context/AppContext';

export const EmergencyCard = ({ facility, isNearest = false }) => {
  const { t } = useTranslation();
  const { showToast } = useApp();
  const [copied, setCopied] = React.useState(false);

  const getCategoryBadge = (categoryKey) => {
    switch (categoryKey) {
      case 'hospital':
        return { label: t('emergencyPortal.catHospital', 'Hospital'), icon: Building2, bg: 'bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/40 dark:text-rose-300' };
      case 'police':
        return { label: t('emergencyPortal.catPolice', 'Police Station'), icon: ShieldCheck, bg: 'bg-sky-50 text-sky-700 border-sky-200 dark:bg-sky-950/40 dark:text-sky-300' };
      case 'fire_station':
        return { label: t('emergencyPortal.catFire', 'Fire Station'), icon: Flame, bg: 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/40 dark:text-amber-300' };
      case 'pharmacy':
        return { label: t('emergencyPortal.catPharmacy', 'Pharmacy'), icon: Pill, bg: 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300' };
      case 'blood_bank':
        return { label: t('emergencyPortal.catBloodBank', 'Blood Bank'), icon: Droplet, bg: 'bg-red-50 text-red-700 border-red-200 dark:bg-red-950/40 dark:text-red-300' };
      case 'municipal':
        return { label: t('emergencyPortal.catMunicipal', 'Municipal Office'), icon: Landmark, bg: 'bg-indigo-50 text-indigo-700 border-indigo-200 dark:bg-indigo-950/40 dark:text-indigo-300' };
      default:
        return { label: t('emergencyPortal.catFacility', 'Facility'), icon: Building2, bg: 'bg-slate-50 text-slate-700 border-slate-200 dark:bg-slate-800 dark:text-slate-300' };
    }
  };

  const getStatusIndicator = (status) => {
    switch (status) {
      case 'Open':
        return { label: t('emergencyPortal.statusOpen', 'Open'), color: 'bg-emerald-500', text: 'text-emerald-700 dark:text-emerald-400', border: 'border-emerald-200 dark:border-emerald-800', bg: 'bg-emerald-50 dark:bg-emerald-950/30' };
      case 'Busy':
        return { label: t('emergencyPortal.statusBusy', 'Busy / High Load'), color: 'bg-amber-500', text: 'text-amber-700 dark:text-amber-400', border: 'border-amber-200 dark:border-amber-800', bg: 'bg-amber-50 dark:bg-amber-950/30' };
      case 'Closed':
        return { label: t('emergencyPortal.statusClosed', 'Closed'), color: 'bg-rose-500', text: 'text-rose-700 dark:text-rose-400', border: 'border-rose-200 dark:border-rose-800', bg: 'bg-rose-50 dark:bg-rose-950/30' };
      default:
        return { label: t('emergencyPortal.statusOpen', 'Open'), color: 'bg-emerald-500', text: 'text-emerald-700 dark:text-emerald-400', border: 'border-emerald-200 dark:border-emerald-800', bg: 'bg-emerald-50 dark:bg-emerald-950/30' };
    }
  };

  const badge = getCategoryBadge(facility.categoryKey);
  const statusPill = getStatusIndicator(facility.status);
  const CategoryIcon = badge.icon;

  const handleCopyNumber = (e) => {
    e.stopPropagation();
    if (!facility.phone) return;
    navigator.clipboard.writeText(facility.phone);
    setCopied(true);
    showToast(`Copied phone number (${facility.phone}) to clipboard!`, 'success');
    setTimeout(() => setCopied(false), 2000);
  };

  const directionsUrl = getGoogleMapsDirectionsUrl(facility.lat, facility.lng, facility.name);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -2 }}
      className={`bg-white dark:bg-slate-900 rounded-2xl border p-5 shadow-sm hover:shadow-md transition-all flex flex-col justify-between relative overflow-hidden ${
        isNearest 
          ? 'border-2 border-emerald-500 ring-2 ring-emerald-500/10 dark:border-emerald-500' 
          : 'border-slate-200 dark:border-slate-800'
      }`}
    >
      {/* Top Banner Accent if Nearest */}
      {isNearest && (
        <div className="absolute top-0 right-0 bg-emerald-500 text-white text-[10px] font-extrabold uppercase tracking-wider px-3 py-1 rounded-bl-xl shadow-xs">
          ⚡ {t('emergencyPortal.nearestFacility', 'Nearest Facility')}
        </div>
      )}

      <div>
        {/* Header: Category & Status */}
        <div className="flex items-center justify-between gap-2 mb-3">
          <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold border ${badge.bg}`}>
            <CategoryIcon className="w-3.5 h-3.5" />
            {badge.label}
          </span>

          <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${statusPill.bg} ${statusPill.border} ${statusPill.text}`}>
            <span className={`w-2 h-2 rounded-full ${statusPill.color} animate-pulse`} />
            {statusPill.label}
          </span>
        </div>

        {/* Name & Address */}
        <h3 className="font-extrabold text-base text-slate-900 dark:text-slate-100 leading-snug mb-2 line-clamp-2">
          {facility.name}
        </h3>

        <p className="text-xs text-slate-500 dark:text-slate-400 flex items-start gap-1.5 mb-3 leading-relaxed">
          <MapPin className="w-4 h-4 text-sky-500 shrink-0 mt-0.5" />
          <span>{facility.address}</span>
        </p>

        {/* Distance & Travel Time Badge */}
        <div className="flex flex-wrap items-center gap-2 mb-4 text-xs font-semibold">
          <span className="px-2.5 py-1 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-md font-mono border border-slate-200 dark:border-slate-700">
            📍 {facility.distanceKm} {t('emergencyPortal.kmAway', 'km away')}
          </span>
          <span className="px-2.5 py-1 bg-sky-50 dark:bg-sky-950/40 text-sky-700 dark:text-sky-300 rounded-md font-mono border border-sky-200 dark:border-sky-800">
            ⏱ {facility.estimatedTime}
          </span>
          {facility.openingHours && (
            <span className="px-2.5 py-1 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 rounded-md text-[11px] flex items-center gap-1 border border-emerald-200 dark:border-emerald-800">
              <Clock className="w-3 h-3" />
              {facility.openingHours}
            </span>
          )}
        </div>
      </div>

      {/* Action Footer Buttons */}
      <div className="pt-3 border-t border-slate-100 dark:border-slate-800 grid grid-cols-2 gap-2">
        {facility.phone ? (
          <div className="flex items-center gap-1">
            <a
              href={`tel:${facility.phone}`}
              className="flex-1 py-2 px-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 shadow-sm transition-all"
            >
              <Phone className="w-3.5 h-3.5" />
              <span>{t('emergencyPortal.btnCall', 'Call')}</span>
            </a>

            <button
              onClick={handleCopyNumber}
              className="p-2.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-xl transition-all border border-slate-200 dark:border-slate-700"
              title={t('emergencyPortal.titleCopyPhone', 'Copy Phone Number')}
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
            </button>
          </div>
        ) : (
          <button
            disabled
            className="py-2 px-3 bg-slate-100 dark:bg-slate-800 text-slate-400 rounded-xl text-xs font-semibold flex items-center justify-center gap-1"
          >
            {t('emergencyPortal.noPhone', 'No Phone Info')}
          </button>
        )}

        <a
          href={directionsUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="py-2 px-3 bg-[#0A2540] hover:bg-slate-800 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 shadow-sm transition-all"
        >
          <Navigation className="w-3.5 h-3.5 text-sky-400" />
          <span>{t('emergencyPortal.btnDirections', 'Directions')}</span>
          <ExternalLink className="w-3 h-3 text-slate-400 ml-0.5" />
        </a>
      </div>
    </motion.div>
  );
};
