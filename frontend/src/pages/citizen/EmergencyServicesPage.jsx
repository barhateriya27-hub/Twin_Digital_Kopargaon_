import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { 
  PhoneCall, 
  MapPin, 
  Search, 
  RefreshCw, 
  ShieldAlert, 
  AlertTriangle, 
  Check, 
  Copy, 
  Building2, 
  ShieldCheck, 
  Flame, 
  Pill, 
  Droplet, 
  Landmark, 
  Home, 
  Sparkles, 
  Clock, 
  Navigation, 
  ExternalLink,
  ChevronRight,
  HeartPulse,
  Baby,
  Users
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { LanguageSelector } from '../../components/LanguageSelector';
import { ThemeToggle } from '../../components/ThemeToggle';
import { EmergencyMap } from '../../components/emergency/EmergencyMap';
import { EmergencyCard } from '../../components/emergency/EmergencyCard';
import { SearchBar } from '../../components/emergency/SearchBar';
import { FilterButtons } from '../../components/emergency/FilterButtons';
import { getUserLocation, DEFAULT_KOPARGAON_LOCATION } from '../../services/mapService';
import { fetchNearbyEmergencyServices } from '../../services/emergencyService';

export const EmergencyServicesPage = ({ embedded = true }) => {
  const { t } = useTranslation();
  const { showToast } = useApp();

  // State
  const [userLocation, setUserLocation] = useState(null);
  const [isLocationDenied, setIsLocationDenied] = useState(false);
  const [facilities, setFacilities] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [apiError, setApiError] = useState(null);

  // Filters & Search
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('All');
  const [copiedNumber, setCopiedNumber] = useState(null);
  const [lastRefreshedAt, setLastRefreshedAt] = useState(null);

  // 1. Initial Location & Emergency Services Loading
  const loadData = async (forceLocation = false) => {
    setIsLoading(true);
    setApiError(null);

    let loc = userLocation;
    if (!loc || forceLocation) {
      loc = await getUserLocation();
      setUserLocation(loc);
      if (loc.isDefault) {
        setIsLocationDenied(true);
      } else {
        setIsLocationDenied(false);
      }
    }

    try {
      const result = await fetchNearbyEmergencyServices(loc.lat, loc.lng);
      setFacilities(result.facilities || []);
      setLastRefreshedAt(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
      if (!result.success) {
        setApiError('Emergency service information is temporarily unavailable from live API.');
      }
    } catch (err) {
      setApiError('Emergency service information is temporarily unavailable.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData(true);

    const timer = setInterval(() => {
      loadData(false);
    }, 600000);

    return () => clearInterval(timer);
  }, []);

  // One-Click Emergency Helpline Cards Data
  const emergencyHelplines = [
    {
      id: 'h-1',
      title: 'Ambulance Emergency',
      titleLocal: 'रुग्णवाहिका',
      number: '108',
      altNumber: '102',
      icon: HeartPulse,
      color: 'bg-rose-50 text-rose-600 border-rose-200 dark:bg-rose-950/40 dark:text-rose-400',
      btnColor: 'bg-rose-600 hover:bg-rose-700'
    },
    {
      id: 'h-2',
      title: 'Police Command Control',
      titleLocal: 'पोलीस हेल्पलाइन',
      number: '112',
      altNumber: '100',
      icon: ShieldCheck,
      color: 'bg-sky-50 text-sky-600 border-sky-200 dark:bg-sky-950/40 dark:text-sky-400',
      btnColor: 'bg-sky-600 hover:bg-sky-700'
    },
    {
      id: 'h-3',
      title: 'Fire Brigade Rescue',
      titleLocal: 'अग्निशामक दल',
      number: '101',
      altNumber: '02423-222201',
      icon: Flame,
      color: 'bg-amber-50 text-amber-600 border-amber-200 dark:bg-amber-950/40 dark:text-amber-400',
      btnColor: 'bg-amber-600 hover:bg-amber-700'
    },
    {
      id: 'h-4',
      title: "Women's Safety Helpline",
      titleLocal: 'महिला सुरक्षा हेल्पलाइन',
      number: '1091',
      altNumber: '112',
      icon: Users,
      color: 'bg-purple-50 text-purple-600 border-purple-200 dark:bg-purple-950/40 dark:text-purple-400',
      btnColor: 'bg-purple-600 hover:bg-purple-700'
    },
    {
      id: 'h-5',
      title: 'Child Care Protection',
      titleLocal: 'बाल संरक्षण हेल्पलाइन',
      number: '1098',
      altNumber: '112',
      icon: Baby,
      color: 'bg-emerald-50 text-emerald-600 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-400',
      btnColor: 'bg-emerald-600 hover:bg-emerald-700'
    },
    {
      id: 'h-6',
      title: 'Disaster Management Cell',
      titleLocal: 'आपत्ती व्यवस्थापन कक्ष',
      number: '1077',
      altNumber: '02423-222233',
      icon: AlertTriangle,
      color: 'bg-red-50 text-red-700 border-red-200 dark:bg-red-950/40 dark:text-red-400',
      btnColor: 'bg-red-600 hover:bg-red-700'
    },
    {
      id: 'h-7',
      title: 'KMC Municipal Toll-Free',
      titleLocal: 'नगरपरिषद हेल्पलाइन',
      number: '1800-233-1042',
      altNumber: '02423-222300',
      icon: Landmark,
      color: 'bg-indigo-50 text-indigo-700 border-indigo-200 dark:bg-indigo-950/40 dark:text-indigo-400',
      btnColor: 'bg-[#0A2540] hover:bg-slate-800'
    }
  ];

  const handleCopyHelpline = (num) => {
    navigator.clipboard.writeText(num);
    setCopiedNumber(num);
    showToast(`Copied ${num} to clipboard!`, 'success');
    setTimeout(() => setCopiedNumber(null), 2000);
  };

  const filteredFacilities = facilities.filter((fac) => {
    const matchesCategory = activeFilter === 'All' || fac.category === activeFilter;
    const q = searchQuery.toLowerCase().trim();
    const matchesSearch =
      !q ||
      fac.name.toLowerCase().includes(q) ||
      fac.address.toLowerCase().includes(q) ||
      fac.category.toLowerCase().includes(q) ||
      fac.categoryKey.toLowerCase().includes(q);

    return matchesCategory && matchesSearch;
  });

  const categoryCounts = facilities.reduce(
    (acc, fac) => {
      acc.total = (acc.total || 0) + 1;
      acc[fac.category] = (acc[fac.category] || 0) + 1;
      return acc;
    },
    { total: 0 }
  );

  const nearestHospital = facilities.find((f) => f.categoryKey === 'hospital');
  const nearestPolice = facilities.find((f) => f.categoryKey === 'police');
  const nearestPharmacy = facilities.find((f) => f.categoryKey === 'pharmacy');
  const nearestFire = facilities.find((f) => f.categoryKey === 'fire_station');

  const mainContent = (
    <div className="space-y-6">
      {/* Location Permission Denied Warning Banner */}
      {isLocationDenied && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-4 bg-amber-50 dark:bg-amber-950/50 border-2 border-amber-300 dark:border-amber-800 rounded-2xl text-xs text-amber-900 dark:text-amber-200 flex items-center justify-between gap-3 shadow-xs"
        >
          <div className="flex items-center gap-2.5">
            <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0" />
            <div>
              <span className="font-extrabold text-sm block">Location access denied</span>
              <span className="font-medium text-amber-800 dark:text-amber-300">
                Showing emergency services near Kopargaon Municipal Center (Station Road).
              </span>
            </div>
          </div>

          <button
            onClick={() => loadData(true)}
            className="px-3 py-1.5 bg-amber-600 hover:bg-amber-700 text-white rounded-xl font-bold flex items-center gap-1 shadow-xs shrink-0 cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Retry Location</span>
          </button>
        </motion.div>
      )}

      {/* API Failure Graceful Alert */}
      {apiError && (
        <div className="p-4 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 rounded-2xl text-xs text-rose-800 dark:text-rose-300 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShieldAlert className="w-5 h-5 text-rose-600" />
            <span className="font-bold">{apiError}</span>
          </div>
          <button
            onClick={() => loadData(false)}
            className="px-3 py-1 bg-rose-600 text-white rounded-lg font-bold text-[11px] cursor-pointer"
          >
            Reload Live Feeds
          </button>
        </div>
      )}

      {/* SECTION 1: ONE-CLICK EMERGENCY HELPLINE CARDS */}
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-black text-slate-900 dark:text-slate-100 flex items-center gap-2 tracking-tight">
              <PhoneCall className="w-5 h-5 text-rose-600" />
              One-Click National & Municipal Emergency Helplines
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
              Tap to dial immediately or copy numbers for dispatch
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {emergencyHelplines.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.id}
                className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div className="flex items-start justify-between gap-2 mb-3">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center border ${item.color}`}>
                    <Icon className="w-5 h-5" />
                  </div>

                  <div className="text-right">
                    <span className="text-lg font-black font-mono text-slate-900 dark:text-slate-100 block leading-tight">
                      {item.number}
                    </span>
                    <span className="text-[10px] text-slate-400 font-mono block">Alt: {item.altNumber}</span>
                  </div>
                </div>

                <div>
                  <h3 className="font-extrabold text-sm text-slate-800 dark:text-slate-100 leading-tight">
                    {item.title}
                  </h3>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium mb-3">
                    {item.titleLocal}
                  </p>

                  <div className="grid grid-cols-2 gap-1.5 pt-2 border-t border-slate-100 dark:border-slate-800">
                    <a
                      href={`tel:${item.number}`}
                      className={`py-2 px-3 ${item.btnColor} text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1 shadow-sm transition-all`}
                    >
                      <PhoneCall className="w-3.5 h-3.5" />
                      <span>Call {item.number}</span>
                    </a>

                    <button
                      onClick={() => handleCopyHelpline(item.number)}
                      className="py-2 px-3 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-xl text-xs font-bold flex items-center justify-center gap-1 transition-all border border-slate-200 dark:border-slate-700 cursor-pointer"
                    >
                      {copiedNumber === item.number ? (
                        <Check className="w-3.5 h-3.5 text-emerald-600" />
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                      <span>{copiedNumber === item.number ? 'Copied' : 'Copy'}</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* SECTION 2: NEAREST EMERGENCY FACILITY SUMMARY */}
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-black text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-emerald-500" />
            Nearest Emergency Facility Summary
          </h2>
          {lastRefreshedAt && (
            <span className="text-[11px] font-mono text-slate-400">
              Live OpenStreetMap Feed Refreshed: {lastRefreshedAt}
            </span>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {[
            { label: 'Nearest Hospital', item: nearestHospital, icon: Building2, color: 'text-rose-600' },
            { label: 'Nearest Police Station', item: nearestPolice, icon: ShieldCheck, color: 'text-sky-600' },
            { label: 'Nearest Pharmacy', item: nearestPharmacy, icon: Pill, color: 'text-emerald-600' },
            { label: 'Nearest Fire Station', item: nearestFire, icon: Flame, color: 'text-amber-600' }
          ].map((box, idx) => {
            const Icon = box.icon;
            return (
              <div
                key={idx}
                className="bg-white dark:bg-slate-900 border-2 border-emerald-100 dark:border-slate-800 rounded-2xl p-4 shadow-sm flex flex-col justify-between"
              >
                <div className="flex items-center gap-2 mb-2">
                  <Icon className={`w-4 h-4 ${box.color}`} />
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-500">{box.label}</span>
                </div>

                {box.item ? (
                  <div>
                    <h4 className="font-extrabold text-sm text-slate-900 dark:text-slate-100 line-clamp-1 mb-1">
                      {box.item.name}
                    </h4>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-1 mb-2">
                      {box.item.address}
                    </p>
                    <div className="flex items-center justify-between text-xs font-bold text-sky-700 dark:text-sky-400 pt-2 border-t border-slate-100 dark:border-slate-800">
                      <span>📍 {box.item.distanceKm} km</span>
                      <span>⏱ {box.item.estimatedTime}</span>
                    </div>
                  </div>
                ) : (
                  <div className="text-xs text-slate-400 py-2">Searching live map...</div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* SECTION 3: SEARCH & CATEGORY FILTERS */}
      <section className="space-y-4 pt-2">
        <SearchBar
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          onSelectTag={(tagQuery) => setSearchQuery(tagQuery)}
        />

        <FilterButtons
          activeFilter={activeFilter}
          setActiveFilter={setActiveFilter}
          counts={categoryCounts}
        />
      </section>

      {/* SECTION 4: INTERACTIVE MAP & EMERGENCY CARDS GRID */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        <div className="lg:col-span-6 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-extrabold text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <Navigation className="w-4 h-4 text-sky-600" />
              Spatial Emergency Map (Kopargaon Spatial Twin)
            </h3>
            <span className="text-[11px] font-semibold text-slate-500">
              Showing {filteredFacilities.length} Verified Markers
            </span>
          </div>

          <EmergencyMap
            facilities={filteredFacilities}
            userLocation={userLocation}
          />
        </div>

        <div className="lg:col-span-6 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-extrabold text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <Building2 className="w-4 h-4 text-emerald-600" />
              Live Facilities List ({filteredFacilities.length})
            </h3>
            <button
              onClick={() => loadData(false)}
              className="text-xs text-sky-600 hover:text-sky-700 font-bold flex items-center gap-1 cursor-pointer"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
              Refresh List
            </button>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {[1, 2, 3, 4].map((n) => (
                <div key={n} className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-3 animate-pulse">
                  <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-1/3"></div>
                  <div className="h-5 bg-slate-200 dark:bg-slate-800 rounded w-3/4"></div>
                  <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-1/2"></div>
                  <div className="h-8 bg-slate-200 dark:bg-slate-800 rounded mt-4"></div>
                </div>
              ))}
            </div>
          ) : filteredFacilities.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[500px] overflow-y-auto pr-1">
              {filteredFacilities.map((facility, index) => (
                <EmergencyCard
                  key={facility.id}
                  facility={facility}
                  isNearest={index === 0 && activeFilter !== 'All'}
                />
              ))}
            </div>
          ) : (
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-8 text-center space-y-3">
              <ShieldAlert className="w-10 h-10 text-slate-400 mx-auto" />
              <h4 className="font-bold text-sm text-slate-800 dark:text-slate-200">
                No matching emergency facilities found
              </h4>
              <p className="text-xs text-slate-500">
                Try clearing search query or selecting "All Services" filter.
              </p>
              <button
                onClick={() => {
                  setSearchQuery('');
                  setActiveFilter('All');
                }}
                className="px-4 py-2 bg-sky-600 text-white font-bold text-xs rounded-xl shadow-xs cursor-pointer"
              >
                Clear Filters
              </button>
            </div>
          )}
        </div>
      </section>
    </div>
  );

  if (embedded) {
    return mainContent;
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0B0F17] text-slate-800 dark:text-slate-100 flex flex-col selection:bg-sky-600 selection:text-white">
      <div className="h-1 w-full flex shrink-0">
        <div className="h-full w-1/3 bg-[#FF9933]"></div>
        <div className="h-full w-1/3 bg-white dark:bg-slate-800"></div>
        <div className="h-full w-1/3 bg-[#138808]"></div>
      </div>

      <header className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 py-3.5 px-4 sm:px-8 sticky top-0 z-30 shadow-xs">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#0A2540] flex items-center justify-center text-emerald-400 font-bold border border-sky-900 shadow-md">
              <ShieldAlert className="w-6 h-6 text-rose-500 animate-pulse" />
            </div>
            <div>
              <span className="font-extrabold text-base text-slate-900 dark:text-slate-100 block leading-tight">
                коपरगाव <span className="text-rose-600">आणीबाणी सेवा</span> • Emergency Services
              </span>
              <span className="text-[10px] sm:text-xs text-slate-500 dark:text-slate-400 block font-semibold">
                Kopargaon AI Digital Twin Spatial Emergency Response System
              </span>
            </div>
          </Link>

          <div className="flex items-center gap-3">
            <LanguageSelector variant="topbar" />
            <ThemeToggle />
            <Link
              to="/citizen/dashboard"
              className="flex items-center gap-1.5 text-xs font-bold px-3.5 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-200 rounded-xl transition-all border border-slate-200 dark:border-slate-700"
            >
              <Home className="w-4 h-4 text-sky-500" />
              <span>Portal Dashboard</span>
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8 space-y-6">
        {mainContent}
      </main>

      <footer className="py-4 px-6 text-center text-xs text-slate-500 dark:text-slate-400 border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shrink-0 mt-8">
        कोपरगाव नगरपरिषद • 24/7 Smart City Emergency Operations Room • Toll-Free: 1800-233-1042
      </footer>
    </div>
  );
};
