import React, { useState, useEffect, useRef } from 'react';
import { Map, Popup, Marker } from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import { 
  Search, 
  Layers, 
  Activity, 
  CloudSun, 
  Globe, 
  MapPin, 
  Ruler, 
  Maximize2, 
  Navigation, 
  Info, 
  Printer, 
  Download, 
  X,
  Compass,
  RefreshCw,
  Plus,
  Minus,
  Navigation2,
  ExternalLink,
  ChevronRight,
  ShieldAlert
} from 'lucide-react';
import { fetchLiveKopargaonPOIs } from '../../services/poiService';
import { fetchKopargaonWeather } from '../../services/weatherService';
import { searchKopargaonPlaces } from '../../services/geocodingService';

/**
 * Calculates distance between two lat/lng coordinates in kilometers (Haversine Formula)
 */
const calculateHaversineDistanceKm = (lat1, lon1, lat2, lon2) => {
  if (!lat1 || !lon1 || !lat2 || !lon2) return null;
  const R = 6371; // Earth radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return (R * c).toFixed(2);
};

/**
 * MapLibre Base Map Styles mapping
 */
const MAP_STYLES = {
  light: {
    name: 'Government Light',
    style: 'https://basemaps.cartocdn.com/gl/voyager-gl-style/style.json'
  },
  dark: {
    name: 'Government Dark',
    style: 'https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json'
  },
  satellite: {
    name: 'Satellite',
    style: {
      version: 8,
      sources: {
        'esri-satellite': {
          type: 'raster',
          tiles: ['https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}'],
          tileSize: 256
        }
      },
      layers: [{ id: 'esri-satellite-layer', type: 'raster', source: 'esri-satellite' }]
    }
  },
  hybrid: {
    name: 'Hybrid',
    style: {
      version: 8,
      sources: {
        'esri-satellite': {
          type: 'raster',
          tiles: ['https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}'],
          tileSize: 256
        },
        'esri-labels': {
          type: 'raster',
          tiles: ['https://server.arcgisonline.com/ArcGIS/rest/services/Reference/World_Transportation/MapServer/tile/{z}/{y}/{x}'],
          tileSize: 256
        }
      },
      layers: [
        { id: 'esri-satellite-layer', type: 'raster', source: 'esri-satellite' },
        { id: 'esri-labels-layer', type: 'raster', source: 'esri-labels' }
      ]
    }
  },
  terrain: {
    name: 'Terrain',
    style: {
      version: 8,
      sources: {
        'opentopo': {
          type: 'raster',
          tiles: ['https://tile.opentopomap.org/{z}/{x}/{y}.png'],
          tileSize: 256
        }
      },
      layers: [{ id: 'opentopo-layer', type: 'raster', source: 'opentopo' }]
    }
  }
};

/**
 * Custom SVG Icons for 23 Asset Categories
 */
const getGisCategorySvg = (type, color = "#0B2545") => {
  const iconPaths = {
    hospital: `<path d="M12 2v20M2 12h20" stroke="white" stroke-width="3" stroke-linecap="round"/>`,
    police: `<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" fill="white"/>`,
    fire: `<path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 3.5z" fill="white"/>`,
    school: `<path d="M22 10v6M2 10l10-5 10 5-10 5zM6 12v5c3 3 9 3 12 0v-5" stroke="white" stroke-width="2"/>`,
    college: `<path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" stroke="white" stroke-width="2"/>`,
    municipal_office: `<path d="M3 21h18M3 7v14M21 7v14M6 21V11M10 21V11M14 21V11M18 21V11M12 3l9 4H3l9-4z" stroke="white" stroke-width="2"/>`,
    bank: `<rect x="3" y="5" width="18" height="14" rx="2" stroke="white" stroke-width="2"/><line x1="3" y1="10" x2="21" y2="10" stroke="white" stroke-width="2"/>`,
    atm: `<rect x="3" y="5" width="18" height="14" rx="2" stroke="white" stroke-width="2"/><circle cx="12" cy="12" r="3" fill="white"/>`,
    fuel: `<path d="M3 22V5a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v17M15 9h4a2 2 0 0 1 2 2v6a2 2 0 0 1-2 2h-4" stroke="white" stroke-width="2"/>`,
    bus_stop: `<path d="M8 6v6m8-6v6M4 11h16M6 17v2m12-2v2M4 4h16a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2z" stroke="white" stroke-width="2"/>`,
    railway: `<path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1zM4 22v-7" stroke="white" stroke-width="2"/>`,
    temple: `<path d="M12 2L4 9h16L12 2zm0 7v13M7 22v-8h10v8" stroke="white" stroke-width="2"/>`,
    mosque: `<path d="M12 3c-4 0-7 3-7 7v11h14V10c0-4-3-7-7-7zM12 3v4" stroke="white" stroke-width="2"/>`,
    church: `<path d="M12 2v8M8 6h8M4 22h16V10l-8-5-8 5v12z" stroke="white" stroke-width="2"/>`,
    park: `<path d="M12 2L5 12h4v8h6v-8h4L12 2z" fill="white"/>`,
    toilet: `<path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6" stroke="white" stroke-width="2"/>`,
    water_tank: `<path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z" fill="white"/>`,
    electric: `<polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" fill="white"/>`,
    traffic_signal: `<rect x="7" y="2" width="10" height="20" rx="3" stroke="white" stroke-width="2"/><circle cx="12" cy="6" r="2" fill="white"/><circle cx="12" cy="12" r="2" fill="white"/><circle cx="12" cy="18" r="2" fill="white"/>`,
    cctv: `<path d="M23 7l-7 5 7 5V7zM2 5h12a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2z" stroke="white" stroke-width="2"/>`,
    road_work: `<path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0zM12 9v4M12 17h.01" stroke="white" stroke-width="2"/>`,
    complaint: `<path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0zM12 9v4M12 17h.01" stroke="white" stroke-width="2"/>`,
    parking: `<path d="M9 17V7h4a3 3 0 0 1 0 6H9" stroke="white" stroke-width="2.5" stroke-linecap="round"/>`,
    weather: `<path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41M12 7a5 5 0 1 0 0 10 5 5 0 0 0 0-10z" stroke="white" stroke-width="2"/>`
  };

  const svgInner = iconPaths[type] || iconPaths.municipal_office;

  return `
    <div class="gis-marker-pin" style="
      background: ${color};
      width: 36px;
      height: 36px;
      border-radius: 50%;
      border: 2.5px solid #FFFFFF;
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 4px 14px rgba(11, 37, 69, 0.45);
      cursor: pointer;
      transition: transform 0.2s cubic-bezier(0.4, 0, 0.2, 1);
    ">
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        ${svgInner}
      </svg>
    </div>
  `;
};

export const MapLibreGisCommandCenter = ({ 
  userLocation, 
  complaints = [], 
  onSelectComplaint 
}) => {
  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markersRef = useRef([]);

  // Base Map Style State
  const [activeStyleKey, setActiveStyleKey] = useState('light');
  const [isLayersDrawerOpen, setIsLayersDrawerOpen] = useState(false);
  const [isLegendOpen, setIsLegendOpen] = useState(false);

  // Search & POI State
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [livePois, setLivePois] = useState([]);
  const [isLoadingPois, setIsLoadingPois] = useState(true);

  // Layer Visibility
  const [weatherData, setWeatherData] = useState(null);
  const [activeLayers, setActiveLayers] = useState({
    hospitals: true,
    police: true,
    fire: true,
    civic: true,
    utilities: true,
    complaints: true,
    schools: true,
    weather: false
  });

  useEffect(() => {
    fetchKopargaonWeather().then(res => {
      if (res && res.success) {
        setWeatherData(res);
      }
    });
  }, []);

  // Load OpenStreetMap Overpass POIs
  useEffect(() => {
    let isMounted = true;
    setIsLoadingPois(true);

    fetchLiveKopargaonPOIs().then(res => {
      if (isMounted) {
        if (res.success && res.pois) {
          setLivePois(res.pois);
        }
        setIsLoadingPois(false);
      }
    });

    return () => { isMounted = false; };
  }, []);

  // Initialize MapLibre Map
  useEffect(() => {
    if (!mapContainerRef.current) return;

    const initialLat = userLocation?.lat || 19.8923;
    const initialLng = userLocation?.lng || 74.4784;

    try {
      const selectedStyle = MAP_STYLES[activeStyleKey]?.style || MAP_STYLES.light.style;
      const map = new Map({
        container: mapContainerRef.current,
        style: selectedStyle,
        center: [initialLng, initialLat],
        zoom: 14,
        pitch: 35,
        bearing: 0,
        attributionControl: false
      });

      map.on('error', (e) => {
        // Silently handle map asset or network errors without crashing React UI
      });

      mapInstanceRef.current = map;

      return () => {
        try {
          map.remove();
        } catch (e) {}
      };
    } catch (err) {
      console.warn('MapLibre GL init fallback:', err);
    }
  }, []);

  // Change Map Style dynamically
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;
    try {
      const selectedStyle = MAP_STYLES[activeStyleKey]?.style || MAP_STYLES.light.style;
      map.setStyle(selectedStyle);
    } catch (err) {}
  }, [activeStyleKey]);

  // Search Autocomplete via Nominatim API
  useEffect(() => {
    if (!searchQuery || searchQuery.trim().length < 3) {
      setSearchResults([]);
      return;
    }

    const timer = setTimeout(() => {
      searchKopargaonPlaces(searchQuery).then(res => {
        setSearchResults(res);
      });
    }, 350);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Render MapLibre Markers & Popups
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    // Clear existing markers
    markersRef.current.forEach(m => m.remove());
    markersRef.current = [];

    // Render Live POIs
    livePois.forEach(poi => {
      if (searchQuery && !poi.name.toLowerCase().includes(searchQuery.toLowerCase()) && !poi.category.toLowerCase().includes(searchQuery.toLowerCase())) {
        return;
      }

      const el = document.createElement('div');
      el.className = 'gis-marker-container';
      el.innerHTML = getGisCategorySvg(poi.iconType || poi.category, poi.categoryColor || '#0B2545');

      const userLat = userLocation?.lat || 19.8923;
      const userLng = userLocation?.lng || 74.4784;
      const distFromUser = calculateHaversineDistanceKm(userLat, userLng, poi.lat, poi.lng);

      const popupHtml = `
        <div style="font-family: Inter, sans-serif; padding: 10px; max-width: 260px; color: #0B2545;">
          <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 6px;">
            <span style="background: #0B2545; color: #FF9933; font-size: 9px; font-weight: 800; padding: 2px 6px; border-radius: 4px; text-transform: uppercase;">
              ${poi.category}
            </span>
            ${distFromUser ? `<span style="font-size: 10px; font-weight: 700; color: #138808;">📍 ${distFromUser} km away</span>` : ''}
          </div>
          <h4 style="margin: 0 0 4px 0; font-size: 13px; font-weight: 900; color: #0B2545;">${poi.name}</h4>
          <p style="margin: 0 0 8px 0; font-size: 11px; color: #64748B;">Ward ${poi.ward} Sector • Kopargaon</p>
          
          <div style="background: #F8FAFC; border: 1px solid #E2E8F0; padding: 6px 8px; border-radius: 8px; font-size: 10px; color: #334155; margin-bottom: 8px;">
            ${poi.details || 'Verified Municipal Spatial Asset'}
          </div>

          <div style="display: flex; gap: 6px;">
            <a href="https://www.google.com/maps/dir/?api=1&destination=${poi.lat},${poi.lng}" target="_blank" rel="noopener noreferrer" style="flex: 1; background: #0B2545; color: white; border-radius: 6px; padding: 6px; font-size: 10px; font-weight: 800; text-align: center; text-decoration: none;">
              🗺 Directions
            </a>
          </div>
        </div>
      `;

      const popup = new Popup({ offset: 25, closeButton: true, className: 'maplibre-gis-popup' }).setHTML(popupHtml);

      const marker = new Marker({ element: el })
        .setLngLat([poi.lng, poi.lat])
        .setPopup(popup)
        .addTo(map);

      markersRef.current.push(marker);
    });

    // Render Complaints Markers
    if (activeLayers.complaints && complaints.length > 0) {
      complaints.forEach(c => {
        const cLat = c.latitude || (19.8923 + (c.ward % 4) * 0.005 - 0.008);
        const cLng = c.longitude || (74.4784 + Math.floor(c.ward / 4) * 0.005 - 0.008);

        const el = document.createElement('div');
        el.className = 'gis-marker-container';
        el.innerHTML = getGisCategorySvg('complaint', '#FF9933');

        const popupHtml = `
          <div style="font-family: Inter, sans-serif; padding: 8px; color: #0B2545;">
            <span style="background: #FF9933; color: #0B2545; font-size: 9px; font-weight: 900; padding: 2px 6px; border-radius: 4px;">
              GRIEVANCE TICKET #${c.id}
            </span>
            <h4 style="margin: 6px 0 4px 0; font-size: 12px; font-weight: 800;">${c.title}</h4>
            <p style="margin: 0; font-size: 10px; color: #64748B;">Status: ${c.status} • Ward ${c.ward}</p>
          </div>
        `;

        const popup = new Popup({ offset: 25 }).setHTML(popupHtml);

        const marker = new Marker({ element: el })
          .setLngLat([cLng, cLat])
          .setPopup(popup)
          .addTo(map);

        markersRef.current.push(marker);
      });
    }

    // Render Weather Layer Markers
    if (activeLayers.weather && weatherData) {
      const wLat = 19.8923;
      const wLng = 74.4784;

      const el = document.createElement('div');
      el.className = 'gis-marker-container';
      el.innerHTML = getGisCategorySvg('weather', '#0284C7'); // Sky blue for weather

      const popupHtml = `
        <div style="font-family: Inter, sans-serif; padding: 10px; max-width: 250px; color: #0F172A; line-height: 1.4;">
          <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 8px;">
            <span style="background: #0284C7; color: white; font-size: 8px; font-weight: 900; padding: 3px 6px; border-radius: 4px; text-transform: uppercase;">
              🌦️ WEATHER TELEMETRY
            </span>
            <span style="font-size: 9px; font-weight: 800; color: #138808;">● Connected</span>
          </div>
          <h4 style="margin: 0 0 4px 0; font-size: 13px; font-weight: 900; color: #0B2545;">Kopargaon GIS Node</h4>
          <p style="margin: 0 0 10px 0; font-size: 10px; color: #64748B;">Central Command Weather Station</p>
          
          <div style="background: #F8FAFC; border: 1px solid #E2E8F0; padding: 8px 10px; border-radius: 8px; font-size: 11px; color: #334155; margin-bottom: 6px;">
            <div style="margin-bottom: 4px;">🌡️ <strong>Temp</strong>: ${weatherData.temperature}°C (Feels ${weatherData.feelsLike}°C)</div>
            <div style="margin-bottom: 4px;">🌤️ <strong>Condition</strong>: ${weatherData.conditionText}</div>
            <div style="margin-bottom: 4px;">💧 <strong>Humidity</strong>: ${weatherData.humidity}%</div>
            <div>💨 <strong>Wind</strong>: ${weatherData.windSpeed} km/h ${weatherData.windDirection || 'N'}</div>
          </div>
          <div style="font-size: 9px; color: #94A3B8; text-align: right; font-style: italic;">
            Source: ${weatherData.source}
          </div>
        </div>
      `;

      const popup = new Popup({ offset: 25 }).setHTML(popupHtml);

      const marker = new Marker({ element: el })
        .setLngLat([wLng, wLat])
        .setPopup(popup)
        .addTo(map);

      markersRef.current.push(marker);
    }

  }, [livePois, complaints, activeLayers, searchQuery, userLocation, weatherData]);

  // Handle Search Selection
  const handleSelectSearchResult = (res) => {
    if (mapInstanceRef.current && res.lat && res.lng) {
      mapInstanceRef.current.flyTo({
        center: [res.lng, res.lat],
        zoom: 16,
        pitch: 45,
        duration: 1500
      });
      setSearchQuery(res.name);
      setSearchResults([]);
    }
  };

  // Map Controls Handlers
  const handleZoomIn = () => mapInstanceRef.current?.zoomIn();
  const handleZoomOut = () => mapInstanceRef.current?.zoomOut();
  const handleResetCompass = () => mapInstanceRef.current?.resetNorthPitch();
  const handleRecenterUser = () => {
    if (mapInstanceRef.current) {
      mapInstanceRef.current.flyTo({
        center: [userLocation?.lng || 74.4784, userLocation?.lat || 19.8923],
        zoom: 15,
        pitch: 35,
        duration: 1200
      });
    }
  };

  const handleFullscreen = () => {
    if (!document.fullscreenElement) {
      mapContainerRef.current?.requestFullscreen();
    } else {
      document.exitFullscreen();
    }
  };

  const handlePrintMap = () => window.print();

  return (
    <div className="relative w-full h-[520px] lg:h-[620px] rounded-2xl overflow-hidden border border-slate-200 shadow-xl bg-slate-900 flex flex-col justify-between">
      
      {/* 1. FLOATING TOP TOOLBAR WITH GLASSMORPHISM */}
      <div className="absolute top-4 left-4 right-4 z-20 flex flex-wrap items-center justify-between gap-3 pointer-events-none">
        
        {/* Left: Search Box */}
        <div className="relative flex items-center min-w-[220px] sm:min-w-[320px] pointer-events-auto">
          <div className="w-full bg-white/90 backdrop-blur-md border border-slate-200/80 rounded-xl shadow-lg flex items-center px-3 py-2 text-slate-800">
            <Search className="w-4 h-4 text-[#0B2545] shrink-0" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search Kopargaon GIS (Civil Hospital, Bus Stand, Ward 4)..."
              className="w-full pl-2 pr-2 bg-transparent text-xs font-semibold text-[#0B2545] placeholder:text-slate-400 focus:outline-none"
            />
            {searchQuery && (
              <button onClick={() => { setSearchQuery(''); setSearchResults([]); }} className="text-slate-400 hover:text-slate-600">
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Autocomplete Search Dropdown */}
          {searchResults.length > 0 && (
            <div className="absolute top-full left-0 right-0 mt-1.5 bg-white/95 backdrop-blur-md rounded-xl shadow-2xl border border-slate-200 text-slate-800 max-h-48 overflow-y-auto z-50">
              {searchResults.map(item => (
                <div
                  key={item.id}
                  onClick={() => handleSelectSearchResult(item)}
                  className="p-2.5 hover:bg-slate-100/80 cursor-pointer text-xs font-semibold border-b border-slate-100 space-y-0.5"
                >
                  <p className="font-extrabold text-[#0B2545]">{item.name}</p>
                  <p className="text-[10px] text-slate-500 truncate">{item.fullName}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right: Floating Style Switcher & Glassmorphism Buttons */}
        <div className="flex items-center gap-2 pointer-events-auto flex-wrap">
          
          {/* Base Map Style Selector */}
          <div className="bg-white/90 backdrop-blur-md border border-slate-200/80 rounded-xl p-1 shadow-lg flex items-center gap-0.5 text-xs font-bold">
            {Object.keys(MAP_STYLES).map(key => (
              <button
                key={key}
                onClick={() => setActiveStyleKey(key)}
                className={`px-2.5 py-1 rounded-lg text-[10px] uppercase transition-all ${
                  activeStyleKey === key ? 'bg-[#0B2545] text-white shadow-sm' : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                {MAP_STYLES[key].name}
              </button>
            ))}
          </div>

          {/* Layers Drawer Trigger */}
          <button
            onClick={() => setIsLayersDrawerOpen(!isLayersDrawerOpen)}
            className={`p-2 rounded-xl bg-white/90 backdrop-blur-md border border-slate-200/80 shadow-lg text-[#0B2545] hover:bg-white transition-all ${
              isLayersDrawerOpen ? 'bg-[#0B2545] text-white' : ''
            }`}
            title="GIS Layers"
          >
            <Layers className="w-4 h-4" />
          </button>

          {/* Legend Trigger */}
          <button
            onClick={() => setIsLegendOpen(!isLegendOpen)}
            className={`p-2 rounded-xl bg-white/90 backdrop-blur-md border border-slate-200/80 shadow-lg text-[#0B2545] hover:bg-white transition-all ${
              isLegendOpen ? 'bg-[#FF9933] text-[#0B2545]' : ''
            }`}
            title="Map Legend"
          >
            <Info className="w-4 h-4" />
          </button>

          {/* Print */}
          <button
            onClick={handlePrintMap}
            className="p-2 rounded-xl bg-white/90 backdrop-blur-md border border-slate-200/80 shadow-lg text-[#0B2545] hover:bg-white transition-all hidden sm:block"
            title="Print Map"
          >
            <Printer className="w-4 h-4" />
          </button>

          {/* Fullscreen */}
          <button
            onClick={handleFullscreen}
            className="p-2 rounded-xl bg-white/90 backdrop-blur-md border border-slate-200/80 shadow-lg text-[#0B2545] hover:bg-white transition-all hidden sm:block"
            title="Fullscreen"
          >
            <Maximize2 className="w-4 h-4" />
          </button>

        </div>

      </div>

      {/* 2. FLOATING RIGHT MAP CONTROLS (ZOOM, COMPASS, LOCATION) */}
      <div className="absolute right-4 top-20 z-20 flex flex-col gap-2">
        <div className="bg-white/90 backdrop-blur-md border border-slate-200/80 rounded-xl shadow-lg flex flex-col overflow-hidden text-[#0B2545]">
          <button onClick={handleZoomIn} className="p-2 hover:bg-slate-100 border-b border-slate-200/60" title="Zoom In">
            <Plus className="w-4 h-4" />
          </button>
          <button onClick={handleZoomOut} className="p-2 hover:bg-slate-100" title="Zoom Out">
            <Minus className="w-4 h-4" />
          </button>
        </div>

        <button
          onClick={handleResetCompass}
          className="p-2 bg-white/90 backdrop-blur-md border border-slate-200/80 rounded-xl shadow-lg text-[#0B2545] hover:bg-white"
          title="Reset Compass North"
        >
          <Compass className="w-4 h-4" />
        </button>

        <button
          onClick={handleRecenterUser}
          className="p-2 bg-white/90 backdrop-blur-md border border-slate-200/80 rounded-xl shadow-lg text-[#0B2545] hover:bg-white"
          title="My Location"
        >
          <Navigation2 className="w-4 h-4" />
        </button>
      </div>

      {/* 3. MAP CANVAS TARGET */}
      <div ref={mapContainerRef} className="w-full h-full" />

      {/* FLOATING WATERMARK BADGE */}
      <div className="absolute bottom-4 left-4 z-20 bg-[#0B2545]/90 backdrop-blur-md px-3 py-1.5 rounded-xl border border-[#FF9933]/50 text-white text-[10px] font-mono font-bold flex items-center gap-2 shadow-xl pointer-events-none">
        <span className="w-2 h-2 rounded-full bg-[#138808] animate-ping"></span>
        <span>MAPLIBRE GL JS GIS COMMAND ENGINE • KOPARGAON</span>
      </div>

      {/* LAYERS DRAWER OVERLAY */}
      {isLayersDrawerOpen && (
        <div className="absolute top-16 right-4 z-30 bg-white/98 text-slate-800 p-4 rounded-2xl border border-slate-300 shadow-2xl w-64 text-xs space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-slate-200">
            <span className="font-extrabold text-[#0B2545] uppercase tracking-wider text-[11px]">
              GIS LAYER FILTER CONTROLS
            </span>
            <button onClick={() => setIsLayersDrawerOpen(false)} className="text-slate-400 hover:text-slate-600">
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="space-y-1.5">
            {[
              { key: 'hospitals', label: 'Hospitals & Emergency', color: '#B71C1C' },
              { key: 'police', label: 'Police Stations & Posts', color: '#0B2545' },
              { key: 'fire', label: 'Fire Hydrants & Stations', color: '#C62828' },
              { key: 'civic', label: 'Municipal Offices', color: '#0B2545' },
              { key: 'schools', label: 'Schools & Colleges', color: '#138808' },
              { key: 'utilities', label: 'Water & Power Grids', color: '#0077B6' },
              { key: 'complaints', label: 'Live Grievance Tickets', color: '#FF9933' },
              { key: 'weather', label: '🌦️ Weather Station & Risk', color: '#0284C7' }
            ].map(layer => (
              <label key={layer.key} className="flex items-center justify-between p-1.5 hover:bg-slate-50 rounded-lg cursor-pointer">
                <span className="flex items-center gap-2 font-semibold text-slate-700">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: layer.color }}></span>
                  {layer.label}
                </span>
                <input
                  type="checkbox"
                  checked={activeLayers[layer.key]}
                  onChange={() => setActiveLayers(prev => ({ ...prev, [layer.key]: !prev[layer.key] }))}
                  className="rounded text-[#0B2545] focus:ring-0"
                />
              </label>
            ))}
          </div>
        </div>
      )}

      {/* LEGEND DRAWER OVERLAY */}
      {isLegendOpen && (
        <div className="absolute bottom-16 left-4 z-30 bg-white/98 text-slate-800 p-4 rounded-2xl border border-slate-300 shadow-2xl w-64 text-xs space-y-2">
          <div className="flex items-center justify-between pb-2 border-b border-slate-200">
            <span className="font-extrabold text-[#0B2545] uppercase tracking-wider text-[11px]">
              MAP LEGEND (23 CATEGORIES)
            </span>
            <button onClick={() => setIsLegendOpen(false)} className="text-slate-400 hover:text-slate-600">
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-2 gap-1.5 text-[11px] font-semibold text-slate-700">
            <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-[#B71C1C]"></span> Hospital</span>
            <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-[#0B2545]"></span> Police</span>
            <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-[#C62828]"></span> Fire Station</span>
            <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-[#138808]"></span> School</span>
            <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-[#FF9933]"></span> Bus Stand</span>
            <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-[#0077B6]"></span> Water Tank</span>
          </div>
        </div>
      )}

    </div>
  );
};
