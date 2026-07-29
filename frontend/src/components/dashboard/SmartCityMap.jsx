import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { getGoogleMapsDirectionsUrl } from '../../services/mapService';

export const SmartCityMap = ({ pois = [], userLocation, selectedCategory = 'All', searchQuery = '' }) => {
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markersLayerRef = useRef(null);

  useEffect(() => {
    if (!mapRef.current) return;

    if (mapRef.current._leaflet_id) {
      delete mapRef.current._leaflet_id;
    }

    if (!mapInstanceRef.current) {
      const initialLat = userLocation?.lat || 19.8923;
      const initialLng = userLocation?.lng || 74.4784;

      const map = L.map(mapRef.current, {
        center: [initialLat, initialLng],
        zoom: 14,
        zoomControl: true,
        attributionControl: false
      });

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '&copy; OpenStreetMap contributors • Kopargaon Smart City'
      }).addTo(map);

      L.control.attribution({ position: 'bottomright' }).addTo(map);

      markersLayerRef.current = L.layerGroup().addTo(map);
      mapInstanceRef.current = map;
    }

    const map = mapInstanceRef.current;
    
    // Invalidate size to ensure proper rendering in responsive layouts
    setTimeout(() => {
      if (map) map.invalidateSize();
    }, 200);

    const markersGroup = markersLayerRef.current;
    markersGroup.clearLayers();

    const bounds = [];

    // 1. User Position Marker
    if (userLocation && userLocation.lat && userLocation.lng) {
      const userLat = userLocation.lat;
      const userLng = userLocation.lng;
      bounds.push([userLat, userLng]);

      const userIcon = L.divIcon({
        className: 'user-marker',
        html: `
          <div style="position: relative; width: 24px; height: 24px;">
            <div style="position: absolute; width: 24px; height: 24px; background: rgba(16, 185, 129, 0.35); border-radius: 50%; animation: ping 1.5s infinite;"></div>
            <div style="position: absolute; top: 4px; left: 4px; width: 16px; height: 16px; background: #10B981; border: 3px solid white; border-radius: 50%; box-shadow: 0 2px 6px rgba(0,0,0,0.3);"></div>
          </div>
        `,
        iconSize: [24, 24],
        iconAnchor: [12, 12]
      });

      L.marker([userLat, userLng], { icon: userIcon })
        .addTo(markersGroup)
        .bindPopup(`
          <div style="font-family: sans-serif; font-size: 12px; padding: 2px;">
            <strong style="color: #059669;">📍 Your Location</strong>
            <p style="margin: 4px 0 0 0; color: #64748B;">Kopargaon Spatial Anchor</p>
          </div>
        `);
    }

    // 2. POI Markers
    pois.forEach((poi) => {
      if (!poi.lat || !poi.lng) return;

      bounds.push([poi.lat, poi.lng]);

      const customIcon = L.divIcon({
        className: 'poi-marker',
        html: `
          <div style="
            background: #0A2540;
            color: white;
            border: 2px solid #10B981;
            border-radius: 18px;
            padding: 3px 8px;
            font-size: 11px;
            font-weight: 800;
            font-family: sans-serif;
            box-shadow: 0 4px 10px rgba(0,0,0,0.25);
            display: flex;
            align-items: center;
            gap: 4px;
            white-space: nowrap;
          ">
            <span>${poi.name.length > 20 ? poi.name.slice(0, 18) + '...' : poi.name}</span>
          </div>
        `,
        iconSize: [130, 28],
        iconAnchor: [65, 14]
      });

      const directionsUrl = getGoogleMapsDirectionsUrl(poi.lat, poi.lng, poi.name);

      const marker = L.marker([poi.lat, poi.lng], { icon: customIcon }).addTo(markersGroup);

      const popupContent = `
        <div style="font-family: system-ui, -apple-system, sans-serif; padding: 6px; max-width: 240px;">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 4px;">
            <span style="font-size: 10px; font-weight: 800; text-transform: uppercase; background: #ECFDF5; color: #047857; padding: 2px 6px; border-radius: 4px;">
              ${poi.category}
            </span>
            <span style="font-size: 10px; font-weight: 700; color: #0284C7; font-family: monospace;">
              ${poi.distanceKm} km away
            </span>
          </div>

          <h4 style="margin: 4px 0 2px 0; font-size: 13px; font-weight: 800; color: #0F172A; line-height: 1.3;">
            ${poi.name}
          </h4>

          <p style="margin: 0 0 6px 0; font-size: 11px; color: #64748B; line-height: 1.3;">
            ${poi.address}
          </p>

          <div style="font-size: 11px; font-weight: 700; color: #0369A1; margin-bottom: 8px;">
            ⏱ Estimated Travel: ${poi.estimatedTime}
          </div>

          <div style="display: flex; gap: 4px;">
            ${
              poi.phone && poi.phone !== 'N/A'
                ? `<a href="tel:${poi.phone}" style="flex: 1; text-align: center; background: #059669; color: white; text-decoration: none; padding: 6px; border-radius: 6px; font-size: 11px; font-weight: 700;">📞 Call</a>`
                : ''
            }
            <a href="${directionsUrl}" target="_blank" rel="noopener noreferrer" style="flex: 1; text-align: center; background: #0A2540; color: white; text-decoration: none; padding: 6px; border-radius: 6px; font-size: 11px; font-weight: 700;">🧭 Directions</a>
          </div>
        </div>
      `;

      marker.bindPopup(popupContent);
    });

    if (bounds.length > 0) {
      const leafletBounds = L.latLngBounds(bounds);
      map.fitBounds(leafletBounds, { padding: [40, 40], maxZoom: 16 });
    }

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [pois, userLocation, selectedCategory, searchQuery]);

  return (
    <div className="relative w-full h-[420px] lg:h-[480px] rounded-3xl overflow-hidden border-2 border-slate-200 dark:border-slate-800 shadow-md">
      <div ref={mapRef} className="w-full h-full" />
    </div>
  );
};
