import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { useTranslation } from 'react-i18next';
import { getGoogleMapsDirectionsUrl } from '../../services/mapService';

// Category Marker Colors & Icons
const CATEGORY_MARKER_CONFIG = {
  hospital: { color: '#E11D48', label: '🏥 Hospital', bg: '#FFE4E6' },
  police: { color: '#0284C7', label: '🚓 Police', bg: '#E0F2FE' },
  fire_station: { color: '#D97706', label: '🚒 Fire Station', bg: '#FEF3C7' },
  pharmacy: { color: '#059669', label: '💊 Pharmacy', bg: '#D1FAE5' },
  blood_bank: { color: '#DC2626', label: '🩸 Blood Bank', bg: '#FEE2E2' },
  municipal: { color: '#0A2540', label: '🏛 Municipal', bg: '#E0E7FF' }
};

export const EmergencyMap = ({ facilities = [], userLocation, onSelectFacility }) => {
  const { t } = useTranslation();
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markersLayerRef = useRef(null);

  useEffect(() => {
    if (!mapRef.current) return;

    if (mapRef.current._leaflet_id) {
      delete mapRef.current._leaflet_id;
    }

    // Initialize Map if not initialized
    if (!mapInstanceRef.current) {
      const initialLat = userLocation?.lat || 19.8923;
      const initialLng = userLocation?.lng || 74.4784;

      const map = L.map(mapRef.current, {
        center: [initialLat, initialLng],
        zoom: 14,
        zoomControl: true,
        attributionControl: false
      });

      // OpenStreetMap Tiles
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '&copy; OpenStreetMap contributors'
      }).addTo(map);

      // Attribution control at bottom right
      L.control.attribution({ position: 'bottomright' }).addTo(map);

      markersLayerRef.current = L.layerGroup().addTo(map);
      mapInstanceRef.current = map;
    }

    const map = mapInstanceRef.current;
    const markersGroup = markersLayerRef.current;
    markersGroup.clearLayers();

    const bounds = [];

    // 1. Add User Location Marker
    if (userLocation && userLocation.lat && userLocation.lng) {
      const userLat = userLocation.lat;
      const userLng = userLocation.lng;
      bounds.push([userLat, userLng]);

      const userIcon = L.divIcon({
        className: 'user-location-marker',
        html: `
          <div style="position: relative; width: 24px; height: 24px;">
            <div style="position: absolute; width: 24px; height: 24px; background: rgba(2, 132, 199, 0.3); border-radius: 50%; animation: ping 1.5s infinite;"></div>
            <div style="position: absolute; top: 4px; left: 4px; width: 16px; height: 16px; background: #0284C7; border: 3px solid white; border-radius: 50%; box-shadow: 0 2px 6px rgba(0,0,0,0.3);"></div>
          </div>
        `,
        iconSize: [24, 24],
        iconAnchor: [12, 12]
      });

      const yourLocStr = t('emergencyPortal.yourLoc', 'Your Current Location');
      const searchCenteredStr = t('emergencyPortal.searchCentered', 'Centered for Emergency Search');

      L.marker([userLat, userLng], { icon: userIcon })
        .addTo(markersGroup)
        .bindPopup(`
          <div style="font-family: sans-serif; font-size: 12px; padding: 2px;">
            <strong style="color: #0284C7;">📍 ${yourLocStr}</strong>
            <p style="margin: 4px 0 0 0; color: #64748B;">${searchCenteredStr}</p>
          </div>
        `);
    }

    // 2. Add Facility Markers
    facilities.forEach((facility) => {
      if (!facility.lat || !facility.lng) return;

      const config = CATEGORY_MARKER_CONFIG[facility.categoryKey] || CATEGORY_MARKER_CONFIG.hospital;
      bounds.push([facility.lat, facility.lng]);

      const customIcon = L.divIcon({
        className: 'facility-marker',
        html: `
          <div style="
            background: ${config.color};
            color: white;
            border: 2px solid white;
            border-radius: 20px;
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
            <span>${config.label.split(' ')[0]}</span>
            <span>${facility.name.length > 18 ? facility.name.slice(0, 16) + '...' : facility.name}</span>
          </div>
        `,
        iconSize: [120, 28],
        iconAnchor: [60, 14]
      });

      const directionsUrl = getGoogleMapsDirectionsUrl(facility.lat, facility.lng, facility.name);

      const marker = L.marker([facility.lat, facility.lng], { icon: customIcon }).addTo(markersGroup);

      const popupContent = `
        <div style="font-family: system-ui, -apple-system, sans-serif; padding: 6px; max-width: 240px;">
          <div style="display: flex; items-center; justify-content: space-between; gap: 4px; margin-bottom: 4px;">
            <span style="font-size: 10px; font-weight: 800; text-transform: uppercase; background: ${config.bg}; color: ${config.color}; padding: 2px 6px; border-radius: 4px;">
              ${facility.category}
            </span>
            <span style="font-size: 10px; font-weight: 700; color: ${facility.status === 'Open' ? '#059669' : '#D97706'};">
              ● ${facility.status}
            </span>
          </div>

          <h4 style="margin: 4px 0 2px 0; font-size: 13px; font-weight: 800; color: #0F172A; line-height: 1.3;">
            ${facility.name}
          </h4>

          <p style="margin: 0 0 6px 0; font-size: 11px; color: #64748B; line-height: 1.3;">
            ${facility.address}
          </p>

          <div style="font-size: 11px; font-weight: 700; color: #0369A1; margin-bottom: 8px; font-family: monospace;">
            📍 ${facility.distanceKm} ${t('emergencyPortal.kmAway', 'km away')} • ⏱ ${facility.estimatedTime}
          </div>

          <div style="display: flex; gap: 4px;">
            ${
              facility.phone
                ? `<a href="tel:${facility.phone}" style="flex: 1; text-align: center; background: #059669; color: white; text-decoration: none; padding: 6px; border-radius: 6px; font-size: 11px; font-weight: 700;">📞 ${t('emergencyPortal.btnCall', 'Call')}</a>`
                : ''
            }
            <a href="${directionsUrl}" target="_blank" rel="noopener noreferrer" style="flex: 1; text-align: center; background: #0A2540; color: white; text-decoration: none; padding: 6px; border-radius: 6px; font-size: 11px; font-weight: 700;">🧭 ${t('emergencyPortal.btnDirections', 'Directions')}</a>
          </div>
        </div>
      `;

      marker.bindPopup(popupContent);

      marker.on('click', () => {
        if (onSelectFacility) onSelectFacility(facility);
      });
    });

    // Auto-fit bounds if we have coordinates
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
  }, [facilities, userLocation]);

  return (
    <div className="relative w-full h-[450px] lg:h-[500px] rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 shadow-md">
      <div ref={mapRef} className="w-full h-full" />
    </div>
  );
};
