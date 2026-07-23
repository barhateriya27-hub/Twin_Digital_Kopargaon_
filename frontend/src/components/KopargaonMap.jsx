import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  MapPin, 
  AlertTriangle, 
  CheckCircle2, 
  Shield, 
  Info, 
  Radio, 
  Layers, 
  Navigation, 
  Maximize2, 
  RefreshCw,
  Search,
  Building2,
  Zap,
  Truck,
  Flame,
  Hospital,
  Compass,
  Plus,
  Minus,
  X,
  FileText,
  Activity,
  Sliders,
  AlertCircle,
  Inbox
} from 'lucide-react';
import { useApp } from '../context/AppContext';

import { IncidentMarker } from './incident/IncidentMarker';
import { IncidentPopup } from './incident/IncidentPopup';
import { IncidentSidebar } from './incident/IncidentSidebar';
import { IncidentFilters } from './incident/IncidentFilters';

export const KopargaonMap = ({ onSelectComplaint }) => {
  const { complaints = [], theme, updateComplaintStatus, assignComplaint } = useApp();

  // Layer Visibility State
  const [layers, setLayers] = useState({
    incidents: true,
    boundaries: true,
    govt_buildings: true,
    roads: true,
    utilities: true,
    emergency: true,
    assets: true
  });

  const [isLayersOpen, setIsLayersOpen] = useState(false);
  const [selectedIncident, setSelectedIncident] = useState(null);
  const [hoveredIncident, setHoveredIncident] = useState(null);
  const [selectedEntity, setSelectedEntity] = useState(null);
  const [zoomScale, setZoomScale] = useState(1);

  // Incident Filtering State
  const [statusFilter, setStatusFilter] = useState('All');
  const [priorityFilter, setPriorityFilter] = useState('All');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [wardFilter, setWardFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  // Google Maps SDK Loader Setup
  const mapRef = useRef(null);
  const rawApiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY || import.meta.env.GOOGLE_MAPS_API_KEY || '';
  const hasValidKey = Boolean(rawApiKey && rawApiKey !== 'YOUR_GOOGLE_MAPS_API_KEY' && !rawApiKey.includes('YOUR_'));

  useEffect(() => {
    if (!hasValidKey || !mapRef.current) return;
    const kopargaonCoords = { lat: 19.8833, lng: 74.4833 };

    const initMap = () => {
      if (!mapRef.current || !window.google || !window.google.maps) return;
      const map = new window.google.maps.Map(mapRef.current, {
        center: kopargaonCoords,
        zoom: 13,
      });

      new window.google.maps.Marker({
        position: kopargaonCoords,
        map: map,
        title: 'Kopargaon Incident Command Center',
      });
    };

    if (window.google && window.google.maps) {
      initMap();
    } else {
      const scriptId = 'google-maps-js-sdk';
      if (!document.getElementById(scriptId)) {
        const script = document.createElement('script');
        script.id = scriptId;
        script.src = `https://maps.googleapis.com/maps/api/js?key=${rawApiKey}`;
        script.async = true;
        script.defer = true;
        script.onload = () => initMap();
        document.head.appendChild(script);
      }
    }
  }, [hasValidKey, rawApiKey]);

  // MongoDB-Ready GIS Spatial Data Models
  const wardNodes = [
    { id: 'W1', name: 'Ward 1 - Sai Baba Temple Corridor', ward: 1, x: 220, y: 110, population: '14,200', department: 'Town Planning', status: 'Optimal' },
    { id: 'W2', name: 'Ward 2 - MSRTC Central Bus Stand', ward: 2, x: 340, y: 130, population: '18,500', department: 'Public Works', status: 'Optimal' },
    { id: 'W3', name: 'Ward 3 - Market Yard & Ganj Bazaar', ward: 3, x: 440, y: 150, population: '21,100', department: 'Sanitation Cell', status: 'Monitored' },
    { id: 'W4', name: 'Ward 4 - Station Road Sector', ward: 4, x: 180, y: 220, population: '16,800', department: 'Public Works', status: 'High Traffic' },
    { id: 'W5', name: 'Ward 5 - Sai Nagar Residential', ward: 5, x: 280, y: 240, population: '12,900', department: 'Water Supply', status: 'Optimal' },
    { id: 'W6', name: 'Ward 6 - Subhash Road Commercial', ward: 6, x: 380, y: 260, population: '19,400', department: 'Electrical Cell', status: 'Optimal' },
    { id: 'W7', name: 'Ward 7 - Subhash Market South', ward: 7, x: 480, y: 280, population: '15,600', department: 'Sanitation Cell', status: 'Optimal' },
    { id: 'W8', name: 'Ward 8 - Tilak Nagar', ward: 8, x: 140, y: 320, population: '11,300', department: 'Health Services', status: 'Optimal' },
    { id: 'W9', name: 'Ward 9 - Godavari North Bank', ward: 9, x: 260, y: 340, population: '13,700', department: 'River Control', status: 'Optimal' },
    { id: 'W10', name: 'Ward 10 - Civil Hospital Zone', ward: 10, x: 360, y: 360, population: '17,200', department: 'Health Services', status: 'Optimal' },
    { id: 'W11', name: 'Ward 11 - Godavari South Bank', ward: 11, x: 460, y: 380, population: '14,800', department: 'River Control', status: 'Optimal' },
    { id: 'W12', name: 'Ward 12 - Godavari Bridge Sector', ward: 12, x: 560, y: 400, population: '15,100', department: 'Public Works', status: 'Optimal' },
  ];

  const govtBuildings = [
    { id: 'GB-01', name: 'Kopargaon Municipal Corporation HQ', category: 'Government Building', x: 230, y: 120, ward: 1, department: 'General Administration', status: 'Operational', metadata: { address: 'Station Road, Kopargaon', type: 'Administrative HQ' } },
    { id: 'GB-02', name: 'Ward 4 Sub-Administrative Office', category: 'Government Building', x: 190, y: 230, ward: 4, department: 'Citizen Services', status: 'Operational', metadata: { address: 'Station Road Corridor', type: 'Sub-Office' } },
  ];

  const roads = [
    { id: 'RD-01', name: 'Station Road Major Arterial', category: 'Road Infrastructure', length: '4.2 km', ward: 4, department: 'Public Works (PWD)', status: 'Operational', path: 'M 100 220 L 400 220' },
    { id: 'RD-02', name: 'Shirdi Highway Bypass', category: 'Road Infrastructure', length: '8.5 km', ward: 16, department: 'State PWD / Highway Cell', status: 'Operational', path: 'M 350 480 L 680 520' },
  ];

  const utilities = [
    { id: 'UT-01', name: 'Kopargaon 132kV Electrical Substation', category: 'Public Utility', x: 390, y: 270, ward: 6, department: 'Electrical Grid Cell', status: 'Operational', metadata: { capacity: '132 kV', grid: 'MSEDCL Feed' } },
    { id: 'UT-02', name: 'Central Water Reservoir Tank', category: 'Public Utility', x: 270, y: 350, ward: 9, department: 'Water Supply Department', status: 'Operational', metadata: { capacity: '2.5 Million Liters' } },
  ];

  const emergencyServices = [
    { id: 'EM-01', name: 'Central Municipal Fire Station', category: 'Emergency Services', x: 350, y: 140, ward: 2, department: 'Disaster Management', status: 'On Standby 24/7', metadata: { hotline: '101' } },
    { id: 'EM-02', name: 'Kopargaon Civil Hospital & Trauma Unit', category: 'Emergency Services', x: 370, y: 370, ward: 10, department: 'Health & Medical Services', status: 'Operational 24/7', metadata: { beds: '120 Beds' } },
  ];

  const municipalAssets = [
    { id: 'MA-01', name: 'MSRTC Central Bus Transit Depot', category: 'Municipal Asset', x: 340, y: 120, ward: 2, department: 'Transit Cell', status: 'Active Transit Hub' },
    { id: 'MA-02', name: 'IoT CCTV Surveillance Center', category: 'Municipal Asset', x: 210, y: 130, ward: 1, department: 'Smart City Cell', status: 'Active Feed' },
  ];

  // Map complaint array to spatial coordinates
  const liveIncidents = complaints.map((c, idx) => {
    const wardNode = wardNodes.find(w => w.ward === c.ward) || wardNodes[idx % wardNodes.length];
    const offsetX = (idx % 3 === 0 ? 14 : idx % 2 === 0 ? -14 : 10);
    const offsetY = (idx % 2 === 0 ? 12 : -12);
    return {
      ...c,
      x: wardNode.x + offsetX,
      y: wardNode.y + offsetY,
      latitude: c.latitude || Number((19.8833 + (c.ward % 4) * 0.006 - 0.009).toFixed(4)),
      longitude: c.longitude || Number((74.4833 + Math.floor(c.ward / 4) * 0.006 - 0.009).toFixed(4))
    };
  });

  // Filter complaints
  const filteredIncidents = liveIncidents.filter(c => {
    const matchesStatus = statusFilter === 'All' || c.status === statusFilter;
    const matchesPriority = priorityFilter === 'All' || c.priority === priorityFilter;
    const matchesCategory = categoryFilter === 'All' || c.category === categoryFilter;
    const matchesWard = wardFilter === 'All' || String(c.ward) === String(wardFilter);
    const matchesSearch = !searchQuery || 
      c.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
      c.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (c.locationName && c.locationName.toLowerCase().includes(searchQuery.toLowerCase()));

    return matchesStatus && matchesPriority && matchesCategory && matchesWard && matchesSearch;
  });

  const toggleLayer = (layerKey) => {
    setLayers(prev => ({ ...prev, [layerKey]: !prev[layerKey] }));
  };

  const handleUpdateStatus = (id, newStatus) => {
    updateComplaintStatus(id, newStatus);
    setSelectedIncident(prev => prev && prev.id === id ? { ...prev, status: newStatus } : prev);
  };

  const handleAssignOfficer = (id, officerName) => {
    assignComplaint(id, officerName);
    setSelectedIncident(prev => prev && prev.id === id ? { ...prev, assignedOfficer: officerName, status: 'In Progress' } : prev);
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-4 sm:p-5 shadow-xs text-slate-800 dark:text-slate-100 flex flex-col justify-between space-y-4">
      
      {/* Top GIS Header Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-100 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-600 animate-pulse"></span>
            <h3 className="text-xs font-bold text-slate-900 dark:text-slate-100 uppercase tracking-wider">
              KOPARGAON LIVE MUNICIPAL INCIDENT COMMAND CENTER
            </h3>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Geospatial citizen complaint telemetry & real-world navigation dispatcher
          </p>
        </div>

        {/* GIS Toolbar */}
        <div className="flex items-center gap-2 text-xs">
          
          <button
            onClick={() => setIsLayersOpen(!isLayersOpen)}
            className={`px-2.5 py-1 rounded-md text-xs font-semibold flex items-center gap-1.5 border transition-all ${
              isLayersOpen
                ? 'bg-[#0A2540] text-white border-[#0A2540]'
                : 'bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700'
            }`}
          >
            <Layers className="w-3.5 h-3.5" /> Layer Controls
          </button>

          <div className="flex bg-slate-100 dark:bg-slate-800 rounded-md border border-slate-200 dark:border-slate-700 overflow-hidden">
            <button
              onClick={() => setZoomScale(prev => Math.min(prev + 0.15, 1.6))}
              className="p-1 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700"
              title="Zoom In"
            >
              <Plus className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setZoomScale(prev => Math.max(prev - 0.15, 0.8))}
              className="p-1 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700"
              title="Zoom Out"
            >
              <Minus className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => { setZoomScale(1); setSelectedIncident(null); setSelectedEntity(null); }}
              className="p-1 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700"
              title="Reset View"
            >
              <RefreshCw className="w-3.5 h-3.5" />
            </button>
          </div>

        </div>
      </div>

      {/* Incident Filtering Control Bar */}
      <IncidentFilters
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
        priorityFilter={priorityFilter}
        setPriorityFilter={setPriorityFilter}
        categoryFilter={categoryFilter}
        setCategoryFilter={setCategoryFilter}
        wardFilter={wardFilter}
        setWardFilter={setWardFilter}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        totalCount={complaints.length}
        filteredCount={filteredIncidents.length}
      />

      {/* Main Canvas Area */}
      <div className="relative w-full h-[460px] bg-slate-50 dark:bg-slate-950 rounded-lg border border-slate-200 dark:border-slate-800 overflow-hidden flex">
        
        {/* Layer Controls Panel Drawer */}
        <AnimatePresence>
          {isLayersOpen && (
            <motion.aside
              initial={{ x: -240, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -240, opacity: 0 }}
              className="absolute left-0 top-0 bottom-0 w-60 bg-white/95 dark:bg-slate-900/95 backdrop-blur-xs border-r border-slate-200 dark:border-slate-800 p-3.5 z-30 shadow-md flex flex-col justify-between text-xs"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
                  <span className="font-bold uppercase tracking-wider text-[11px] text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
                    <Layers className="w-4 h-4 text-[#0A2540] dark:text-sky-400" /> GIS Layer Toggles
                  </span>
                  <button onClick={() => setIsLayersOpen(false)} className="text-slate-400 hover:text-slate-700">
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <div className="space-y-2">
                  {[
                    { key: 'incidents', label: 'Live Citizen Incidents', icon: AlertCircle, count: filteredIncidents.length },
                    { key: 'boundaries', label: 'Administrative Wards', icon: Shield, count: wardNodes.length },
                    { key: 'govt_buildings', label: 'Government Buildings', icon: Building2, count: govtBuildings.length },
                    { key: 'roads', label: 'Traffic & Road Network', icon: Compass, count: roads.length },
                    { key: 'utilities', label: 'Public Utilities', icon: Zap, count: utilities.length },
                    { key: 'emergency', label: 'Emergency Services', icon: Hospital, count: emergencyServices.length },
                    { key: 'assets', label: 'Municipal Assets', icon: MapPin, count: municipalAssets.length },
                  ].map((l) => {
                    const Icon = l.icon;
                    return (
                      <label
                        key={l.key}
                        className="flex items-center justify-between p-2 rounded-md hover:bg-slate-50 dark:hover:bg-slate-800/60 cursor-pointer border border-transparent hover:border-slate-200 dark:hover:border-slate-700 transition-colors"
                      >
                        <div className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            checked={layers[l.key]}
                            onChange={() => toggleLayer(l.key)}
                            className="rounded text-[#0A2540] focus:ring-0"
                          />
                          <Icon className="w-3.5 h-3.5 text-slate-500" />
                          <span className="font-medium text-slate-800 dark:text-slate-200">{l.label}</span>
                        </div>
                        <span className="text-[10px] font-mono text-slate-400 font-semibold">{l.count}</span>
                      </label>
                    );
                  })}
                </div>
              </div>

              <div className="pt-2 border-t border-slate-100 dark:border-slate-800 text-[10px] text-slate-400">
                <span>Select layer checkboxes to isolate live incident pins.</span>
              </div>
            </motion.aside>
          )}
        </AnimatePresence>

        {/* Vector SVG Canvas */}
        <div className="flex-1 relative w-full h-full flex items-center justify-center overflow-hidden">
          
          <div 
            className="absolute inset-0 opacity-25 pointer-events-none"
            style={{
              backgroundImage: `radial-gradient(${theme === 'dark' ? '#334155' : '#cbd5e1'} 1px, transparent 1px)`,
              backgroundSize: '24px 24px'
            }}
          ></div>

          <svg 
            viewBox="0 0 750 600" 
            className="w-full h-full transition-transform duration-300"
            style={{ transform: `scale(${zoomScale})` }}
          >
            {/* Godavari River Base Vector */}
            <path
              d="M 40 330 Q 200 380, 380 340 T 710 430"
              fill="none"
              stroke="#0284c7"
              strokeWidth="22"
              opacity="0.15"
            />
            <path
              d="M 40 330 Q 200 380, 380 340 T 710 430"
              fill="none"
              stroke="#0369a1"
              strokeWidth="2"
              strokeDasharray="6,4"
              opacity="0.5"
            />
            <text x="520" y="445" fill="#0369a1" fontSize="10" fontWeight="600" opacity="0.5" letterSpacing="1">
              GODAVARI RIVER BASIN
            </text>

            {/* LAYER: Traffic & Road Network */}
            {layers.roads && roads.map((r) => (
              <path
                key={r.id}
                d={r.path}
                fill="none"
                stroke="#64748b"
                strokeWidth="3"
                strokeDasharray="4,2"
                opacity="0.6"
              />
            ))}

            {/* LAYER: Administrative Ward Nodes */}
            {layers.boundaries && wardNodes.map((w) => (
              <g key={w.id} className="cursor-pointer group">
                <circle
                  cx={w.x}
                  cy={w.y}
                  r="32"
                  fill={theme === 'dark' ? 'rgba(15, 23, 42, 0.9)' : 'rgba(255, 255, 255, 0.95)'}
                  stroke={theme === 'dark' ? '#334155' : '#cbd5e1'}
                  strokeWidth="1"
                />
                <text
                  x={w.x}
                  y={w.y + 4}
                  textAnchor="middle"
                  fill={theme === 'dark' ? '#94a3b8' : '#475569'}
                  fontSize="11"
                  fontWeight="600"
                >
                  W{w.ward}
                </text>
              </g>
            ))}

            {/* LAYER: Government Buildings */}
            {layers.govt_buildings && govtBuildings.map((gb) => (
              <rect key={gb.id} x={gb.x - 7} y={gb.y - 7} width="14" height="14" rx="2" fill="#0A2540" opacity="0.7" />
            ))}

            {/* LAYER: Public Utilities */}
            {layers.utilities && utilities.map((ut) => (
              <circle key={ut.id} cx={ut.x} cy={ut.y} r="6" fill="#0284c7" opacity="0.7" />
            ))}

            {/* LAYER: Emergency Services */}
            {layers.emergency && emergencyServices.map((em) => (
              <polygon key={em.id} points={`${em.x},${em.y - 7} ${em.x - 6},${em.y + 5} ${em.x + 6},${em.y + 5}`} fill="#ef4444" opacity="0.7" />
            ))}

            {/* LAYER: LIVE CITIZEN INCIDENT MARKERS */}
            {layers.incidents && filteredIncidents.map((incident) => (
              <IncidentMarker
                key={incident.id}
                incident={incident}
                x={incident.x}
                y={incident.y}
                isSelected={selectedIncident?.id === incident.id}
                onClick={(inc) => {
                  setSelectedIncident(inc);
                  if (onSelectComplaint) onSelectComplaint(inc);
                }}
                onMouseEnter={(inc) => setHoveredIncident(inc)}
                onMouseLeave={() => setHoveredIncident(null)}
              />
            ))}
          </svg>

          {/* Empty State Overlay */}
          {filteredIncidents.length === 0 && complaints.length === 0 && (
            <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center text-slate-400 text-xs">
              <Inbox className="w-8 h-8 mx-auto mb-2 text-slate-300 dark:text-slate-700" />
              <p className="font-semibold text-slate-700 dark:text-slate-300">No active incidents reported.</p>
              <p className="text-[11px] text-slate-400 max-w-xs mt-0.5">
                Citizen complaints logged from the portal will populate live incident markers in real-time.
              </p>
            </div>
          )}

          {/* Hover Telemetry Popup Card */}
          {hoveredIncident && (
            <IncidentPopup incident={hoveredIncident} />
          )}

        </div>

        {/* Incident Officer Sidebar Drawer */}
        <AnimatePresence>
          {selectedIncident && (
            <IncidentSidebar
              incident={selectedIncident}
              onClose={() => setSelectedIncident(null)}
              onUpdateStatus={handleUpdateStatus}
              onAssignOfficer={handleAssignOfficer}
            />
          )}
        </AnimatePresence>

      </div>

      {/* mapop Section - Google Maps / Interactive Geographic View */}
      <section id="mapop" className="mapop mt-4 w-full rounded-lg overflow-hidden border border-slate-200 dark:border-slate-800 relative bg-slate-100 dark:bg-slate-950">
        {hasValidKey ? (
          <div ref={mapRef} className="w-full h-[400px]" />
        ) : (
          <div className="relative w-full h-[400px]">
            <iframe
              title="Kopargaon Interactive Map (OpenStreetMap)"
              width="100%"
              height="400"
              style={{ border: 0 }}
              loading="lazy"
              src="https://www.openstreetmap.org/export/embed.html?bbox=74.4533%2C19.8633%2C74.5133%2C19.9033&layer=mapnik&marker=19.8833%2C74.4833"
              className="w-full h-[400px]"
            ></iframe>
            <div className="absolute top-2 left-2 right-2 bg-slate-900/80 backdrop-blur-xs text-white p-2 rounded text-[11px] flex items-center justify-between z-10 border border-slate-700">
              <span className="font-mono font-semibold text-amber-300">
                📍 Kopargaon, Maharashtra (19.8833, 74.4833) — Map Mode
              </span>
              <span className="text-[10px] text-slate-300">
                To use Google Maps JS SDK, add your valid <code className="bg-slate-800 px-1 py-0.5 rounded text-amber-300">GOOGLE_MAPS_API_KEY</code> in <code className="bg-slate-800 px-1 py-0.5 rounded text-amber-300">frontend/.env</code>
              </span>
            </div>
          </div>
        )}
      </section>

      {/* Telemetry Footer */}
      <div className="mt-4 p-3 bg-slate-50 dark:bg-slate-950 rounded-lg border border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2">
          <span className="text-slate-500 font-medium">Selected Incident:</span>
          <span className="font-semibold text-slate-900 dark:text-slate-100">
            {selectedIncident ? `${selectedIncident.id} (${selectedIncident.title})` : 'Kopargaon Live Incident Telemetry Stream Active'}
          </span>
        </div>
        <div className="text-slate-500 text-[11px]">
          Command Status: <span className="text-emerald-600 dark:text-emerald-400 font-semibold">Real-Time MongoDB Dispatch Stream Ready</span>
        </div>
      </div>

    </div>
  );
};
