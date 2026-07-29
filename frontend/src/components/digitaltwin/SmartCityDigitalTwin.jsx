import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet.markercluster';
import 'leaflet.markercluster/dist/MarkerCluster.css';
import 'leaflet.markercluster/dist/MarkerCluster.Default.css';

import {
  KOPARGAON_CENTER,
  KOPARGAON_WARDS_GEOJSON,
  KOPARGAON_BUILDINGS_GEOJSON,
  GODAVARI_RIVER_GEOJSON,
  WATER_GRID_GEOJSON,
  ELECTRIC_GRID_GEOJSON,
  IOT_SENSOR_NODES,
  AI_PREDICTION_MODELS,
  LIVE_VEHICLES_DATA,
  calculateVehiclePosition
} from '../../services/digitalTwinService';

import { CITY_ASSET_CATEGORIES, createCustomMarkerHTML } from '../../services/poiService';
import { createDigitalTwinPopupHTML } from './DigitalTwinPopup';
import { DigitalTwinControls } from './DigitalTwinControls';
import { Layers, Activity, CloudSun, Radio, BrainCircuit, Navigation } from 'lucide-react';

export const SmartCityDigitalTwin = ({
  pois = [],
  userLocation,
  selectedCategory = 'All',
  searchQuery = ''
}) => {
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);

  // Active digital twin layer states
  const [activeLayers, setActiveLayers] = useState({
    traffic: true,
    weather: false,
    satellite: false,
    heatmap: true,
    complaints: true,
    waterGrid: true,
    electricGrid: true,
    sensors: true,
    cctv: true,
    aiPredictions: true
  });

  const [activeHeatmap, setActiveHeatmap] = useState('complaint');

  // Layers references
  const wardsLayerRef = useRef(null);
  const riverLayerRef = useRef(null);
  const buildingsLayerRef = useRef(null);
  const waterGridLayerRef = useRef(null);
  const electricGridLayerRef = useRef(null);
  const vehicleMarkersRef = useRef({});
  const sensorsLayerRef = useRef(null);
  const aiPredictionsLayerRef = useRef(null);
  const clusterGroupRef = useRef(null);
  const tileLayerRef = useRef(null);

  // Vehicle progress tracker for live moving animation
  const [vehicleProgress, setVehicleProgress] = useState(0);

  // Initialize Leaflet map with Cyber Dark theme tiles
  useEffect(() => {
    if (!mapRef.current) return;

    if (mapRef.current._leaflet_id) {
      delete mapRef.current._leaflet_id;
    }

    if (!mapInstanceRef.current) {
      const initialLat = userLocation?.lat || KOPARGAON_CENTER.lat;
      const initialLng = userLocation?.lng || KOPARGAON_CENTER.lng;

      const map = L.map(mapRef.current, {
        center: [initialLat, initialLng],
        zoom: 14,
        zoomControl: false,
        attributionControl: false
      });

      // CartoDB Dark Matter Cyber Vector Tile Base Layer
      const baseTile = L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
        maxZoom: 19,
        subdomains: 'abcd',
        attribution: '&copy; OpenStreetMap • CartoDB Cyber GIS'
      }).addTo(map);

      tileLayerRef.current = baseTile;

      L.control.zoom({ position: 'bottomright' }).addTo(map);

      mapInstanceRef.current = map;
    }

    const map = mapInstanceRef.current;

    setTimeout(() => {
      if (map) map.invalidateSize();
    }, 250);

  }, [userLocation]);

  // Toggle Satellite vs Dark Mode Tile
  useEffect(() => {
    if (!mapInstanceRef.current || !tileLayerRef.current) return;

    mapInstanceRef.current.removeLayer(tileLayerRef.current);

    if (activeLayers.satellite) {
      tileLayerRef.current = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
        maxZoom: 19,
        attribution: '&copy; Esri ArcGIS Satellite'
      }).addTo(mapInstanceRef.current);
    } else {
      tileLayerRef.current = L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
        maxZoom: 19,
        subdomains: 'abcd'
      }).addTo(mapInstanceRef.current);
    }
  }, [activeLayers.satellite]);

  // Render Vector Wards & Glowing Godavari River
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    // 1. River Layer with cyan glowing polygon
    if (riverLayerRef.current) map.removeLayer(riverLayerRef.current);

    riverLayerRef.current = L.geoJSON(GODAVARI_RIVER_GEOJSON, {
      style: {
        color: '#38BDF8',
        weight: 3,
        fillColor: '#0284C7',
        fillOpacity: 0.55,
        className: 'glowing-river-vector'
      }
    }).addTo(map);

    // 2. City Wards Boundaries Layer
    if (wardsLayerRef.current) map.removeLayer(wardsLayerRef.current);

    wardsLayerRef.current = L.geoJSON(KOPARGAON_WARDS_GEOJSON, {
      style: {
        color: '#06B6D4',
        weight: 1.8,
        dashArray: '4, 4',
        fillColor: '#0891B2',
        fillOpacity: 0.08
      },
      onEachFeature: (feature, layer) => {
        layer.bindTooltip(`🏛 ${feature.properties.name} (Pop: ${feature.properties.population})`, {
          direction: 'center',
          className: 'gis-ward-tooltip'
        });
      }
    }).addTo(map);

    // 3. 3D Building Extrusions Footprints Layer
    if (buildingsLayerRef.current) map.removeLayer(buildingsLayerRef.current);

    buildingsLayerRef.current = L.geoJSON(KOPARGAON_BUILDINGS_GEOJSON, {
      style: {
        color: '#22D3EE',
        weight: 2,
        fillColor: '#0EA5E9',
        fillOpacity: 0.45
      },
      onEachFeature: (feature, layer) => {
        layer.bindPopup(`
          <div style="font-family: sans-serif; font-size: 11px; padding: 4px;">
            <strong style="color: #38BDF8;">🏙 ${feature.properties.name}</strong>
            <p style="margin: 2px 0 0 0; color: #94A3B8;">3D Height: ${feature.properties.height}m Extrusion</p>
          </div>
        `);
      }
    }).addTo(map);

  }, []);

  // Render Infrastructure Networks (Water Pipeline & Power Grid)
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    // Water Grid
    if (waterGridLayerRef.current) map.removeLayer(waterGridLayerRef.current);
    if (activeLayers.waterGrid) {
      waterGridLayerRef.current = L.geoJSON(WATER_GRID_GEOJSON, {
        style: { color: '#0284C7', weight: 4, opacity: 0.85, dashArray: '6, 6' }
      }).addTo(map);
    }

    // Electric Grid
    if (electricGridLayerRef.current) map.removeLayer(electricGridLayerRef.current);
    if (activeLayers.electricGrid) {
      electricGridLayerRef.current = L.geoJSON(ELECTRIC_GRID_GEOJSON, {
        style: { color: '#EAB308', weight: 3.5, opacity: 0.9 }
      }).addTo(map);
    }

  }, [activeLayers.waterGrid, activeLayers.electricGrid]);

  // IoT Sensor Nodes Layer Rendering
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    if (sensorsLayerRef.current) map.removeLayer(sensorsLayerRef.current);

    if (activeLayers.sensors) {
      const group = L.layerGroup();
      IOT_SENSOR_NODES.forEach(sensor => {
        const icon = L.divIcon({
          className: 'iot-sensor-icon',
          html: `
            <div style="position: relative; width: 30px; height: 30px; display: flex; align-items: center; justify-content: center;">
              <div style="position: absolute; width: 30px; height: 30px; border-radius: 50%; background: rgba(16, 185, 129, 0.4); animation: ping 1.8s infinite;"></div>
              <div style="position: relative; background: #10B981; border: 2px solid #FFFFFF; width: 24px; height: 24px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 12px; shadow: 0 0 10px #10b981;">
                ${sensor.icon}
              </div>
            </div>
          `,
          iconSize: [30, 30],
          iconAnchor: [15, 15]
        });

        const marker = L.marker([sensor.lat, sensor.lng], { icon });
        marker.bindTooltip(`📡 ${sensor.name}`, { direction: 'top', className: 'gis-hover-tooltip' });
        marker.bindPopup(`
          <div style="font-family: system-ui; padding: 6px; background: #020617; color: #F8FAFC; border-radius: 12px;">
            <strong style="color: #34D399; font-size: 12px;">📡 ${sensor.name}</strong>
            <div style="margin-top: 4px; font-size: 10px; color: #94A3B8;">
              Status: ${sensor.status}<br/>
              Metrics: ${JSON.stringify(sensor.metrics)}
            </div>
          </div>
        `);
        group.addLayer(marker);
      });
      sensorsLayerRef.current = group.addTo(map);
    }
  }, [activeLayers.sensors]);

  // AI Predictions Layer Rendering
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    if (aiPredictionsLayerRef.current) map.removeLayer(aiPredictionsLayerRef.current);

    if (activeLayers.aiPredictions) {
      const group = L.layerGroup();
      AI_PREDICTION_MODELS.forEach(ai => {
        const icon = L.divIcon({
          className: 'ai-prediction-icon',
          html: `
            <div style="
              background: ${ai.color};
              color: white;
              border: 2px solid white;
              border-radius: 50%;
              width: 32px;
              height: 32px;
              display: flex;
              align-items: center;
              justify-content: center;
              font-size: 14px;
              box-shadow: 0 0 16px ${ai.color};
              animation: pulse 1.5s infinite;
            ">
              ${ai.icon}
            </div>
          `,
          iconSize: [32, 32],
          iconAnchor: [16, 16]
        });

        const marker = L.marker([ai.lat, ai.lng], { icon });
        marker.bindTooltip(`🤖 ${ai.title}`, { direction: 'top', className: 'gis-hover-tooltip' });
        marker.bindPopup(`
          <div style="font-family: system-ui; padding: 8px; background: #020617; color: #F8FAFC; border-radius: 12px;">
            <strong style="color: ${ai.color}; font-size: 13px;">🤖 ${ai.title}</strong>
            <p style="margin: 4px 0; font-size: 11px; color: #E2E8F0;">${ai.details}</p>
            <span style="font-size: 10px; font-weight: 800; background: ${ai.color}33; color: ${ai.color}; padding: 2px 6px; border-radius: 4px;">
              ${ai.riskLevel}
            </span>
          </div>
        `);
        group.addLayer(marker);
      });
      aiPredictionsLayerRef.current = group.addTo(map);
    }
  }, [activeLayers.aiPredictions]);

  // Live Moving Vehicles Animation Engine Loop
  useEffect(() => {
    const interval = setInterval(() => {
      setVehicleProgress(prev => (prev >= 1 ? 0 : prev + 0.02));
    }, 1200);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    LIVE_VEHICLES_DATA.forEach(veh => {
      const pos = calculateVehiclePosition(veh.route, vehicleProgress);

      if (!vehicleMarkersRef.current[veh.id]) {
        const icon = L.divIcon({
          className: 'moving-vehicle-icon',
          html: `
            <div style="
              background: ${veh.color};
              color: white;
              border: 2px solid white;
              border-radius: 50%;
              width: 32px;
              height: 32px;
              display: flex;
              align-items: center;
              justify-content: center;
              font-size: 14px;
              box-shadow: 0 0 14px ${veh.color};
              transition: all 1s linear;
            ">
              ${veh.icon}
            </div>
          `,
          iconSize: [32, 32],
          iconAnchor: [16, 16]
        });

        const marker = L.marker([pos.lat, pos.lng], { icon });
        marker.bindTooltip(`🚗 ${veh.name} (${veh.speed})`, { direction: 'top', className: 'gis-hover-tooltip' });
        vehicleMarkersRef.current[veh.id] = marker.addTo(map);
      } else {
        vehicleMarkersRef.current[veh.id].setLatLng([pos.lat, pos.lng]);
      }
    });
  }, [vehicleProgress]);

  // Asset Markers & Clustering Layer Rendering
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    if (!clusterGroupRef.current) {
      clusterGroupRef.current = L.markerClusterGroup({
        chunkedLoading: true,
        maxClusterRadius: 40,
        spiderfyOnMaxZoom: true,
        showCoverageOnHover: false,
        iconCreateFunction: (cluster) => {
          const count = cluster.getChildCount();
          return new L.DivIcon({
            html: `
              <div style="
                background: linear-gradient(135deg, #0284C7 0%, #0369A1 100%);
                color: #FFFFFF;
                border: 2px solid #38BDF8;
                width: 38px;
                height: 38px;
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                font-weight: 800;
                font-size: 13px;
                box-shadow: 0 0 16px rgba(56, 189, 248, 0.4);
              ">
                <span>${count}</span>
              </div>
            `,
            className: 'custom-cluster-marker',
            iconSize: new L.Point(38, 38)
          });
        }
      });
      map.addLayer(clusterGroupRef.current);
    }

    const clusterGroup = clusterGroupRef.current;
    clusterGroup.clearLayers();

    pois.forEach(poi => {
      if (!poi.lat || !poi.lng) return;

      const catObj = CITY_ASSET_CATEGORIES.find(c => c.id === poi.category) || {
        color: poi.categoryColor || '#06B6D4',
        iconType: poi.iconType || 'hospital'
      };

      const customIcon = L.divIcon({
        className: 'digital-twin-marker',
        html: createCustomMarkerHTML(catObj),
        iconSize: [36, 36],
        iconAnchor: [18, 18],
        popupAnchor: [0, -18]
      });

      const marker = L.marker([poi.lat, poi.lng], { icon: customIcon });

      marker.bindTooltip(poi.name, {
        direction: 'top',
        offset: [0, -20],
        className: 'gis-place-tooltip'
      });

      const popupContent = createDigitalTwinPopupHTML(poi);
      marker.bindPopup(popupContent, {
        maxWidth: 300,
        className: 'digital-twin-leaflet-popup'
      });

      clusterGroup.addLayer(marker);
    });

  }, [pois]);

  const handleToggleLayer = (layerId) => {
    setActiveLayers(prev => ({
      ...prev,
      [layerId]: !prev[layerId]
    }));
  };

  const handleFlyToCenter = () => {
    if (mapInstanceRef.current) {
      mapInstanceRef.current.flyTo([KOPARGAON_CENTER.lat, KOPARGAON_CENTER.lng], 15, {
        duration: 1.5
      });
    }
  };

  return (
    <div className="relative w-full h-[480px] lg:h-[540px] rounded-3xl overflow-hidden border-2 border-cyan-500/30 shadow-[0_0_40px_rgba(6,182,212,0.15)] bg-slate-950">
      {/* Top Banner Cyber Badge */}
      <div className="absolute top-3 right-14 z-[999] bg-slate-950/80 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-cyan-500/30 text-cyan-400 text-xs font-mono font-bold flex items-center gap-2 shadow-lg">
        <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping"></div>
        KOPARGAON AI DIGITAL TWIN ONLINE
      </div>

      {/* Fly to Center Shortcut Button */}
      <button
        onClick={handleFlyToCenter}
        className="absolute bottom-4 left-4 z-[999] p-2.5 bg-slate-950/85 backdrop-blur-md text-cyan-400 border border-cyan-500/30 rounded-xl shadow-xl hover:bg-slate-900 transition-all text-xs font-mono font-bold flex items-center gap-1.5"
      >
        <Navigation className="w-4 h-4 text-cyan-400" />
        <span>Recenter AI Twin</span>
      </button>

      {/* Main Map Container */}
      <div ref={mapRef} className="w-full h-full" />

      {/* Glassmorphism Control Drawer Panel */}
      <DigitalTwinControls
        activeLayers={activeLayers}
        onToggleLayer={handleToggleLayer}
        activeHeatmap={activeHeatmap}
        onSelectHeatmap={setActiveHeatmap}
      />
    </div>
  );
};

export default SmartCityDigitalTwin;
