import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet.markercluster';
import 'leaflet.markercluster/dist/MarkerCluster.css';
import 'leaflet.markercluster/dist/MarkerCluster.Default.css';

import { CITY_ASSET_CATEGORIES, createCustomMarkerHTML } from '../../services/poiService';
import { createMarkerPopupHTML } from './MarkerPopup';

/**
 * MapMarkers Component
 * Renders icon-only custom SVG Leaflet markers with hover tooltips, detailed popups, and marker clustering.
 */
export const MapMarkers = ({ mapInstance, pois = [], userLocation, activeCategories = [] }) => {
  const clusterGroupRef = useRef(null);

  useEffect(() => {
    if (!mapInstance) return;

    // Initialize or clear Marker Cluster Group
    if (!clusterGroupRef.current) {
      clusterGroupRef.current = L.markerClusterGroup({
        chunkedLoading: true,
        maxClusterRadius: 45,
        spiderfyOnMaxZoom: true,
        showCoverageOnHover: false,
        zoomToBoundsOnClick: true,
        iconCreateFunction: (cluster) => {
          const childCount = cluster.getChildCount();
          let size = 36;
          if (childCount >= 10) size = 42;
          if (childCount >= 25) size = 48;

          return new L.DivIcon({
            html: `
              <div style="
                background: linear-gradient(135deg, #0A2540 0%, #1E3A8A 100%);
                color: #FFFFFF;
                border: 2.5px solid #10B981;
                width: ${size}px;
                height: ${size}px;
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                font-weight: 800;
                font-size: 13px;
                font-family: system-ui, sans-serif;
                box-shadow: 0 6px 18px rgba(0,0,0,0.35);
              ">
                <span>${childCount}</span>
              </div>
            `,
            className: 'custom-cluster-marker',
            iconSize: new L.Point(size, size)
          });
        }
      });
      mapInstance.addLayer(clusterGroupRef.current);
    }

    const clusterGroup = clusterGroupRef.current;
    clusterGroup.clearLayers();

    const bounds = [];

    // 1. User Position Indicator
    if (userLocation && userLocation.lat && userLocation.lng) {
      const userLat = userLocation.lat;
      const userLng = userLocation.lng;
      bounds.push([userLat, userLng]);

      const userIcon = L.divIcon({
        className: 'user-location-marker',
        html: `
          <div style="position: relative; width: 28px; height: 28px;">
            <div style="position: absolute; width: 28px; height: 28px; background: rgba(16, 185, 129, 0.4); border-radius: 50%; animation: pulse 1.6s infinite;"></div>
            <div style="position: absolute; top: 5px; left: 5px; width: 18px; height: 18px; background: #10B981; border: 3px solid white; border-radius: 50%; box-shadow: 0 3px 8px rgba(0,0,0,0.35);"></div>
          </div>
        `,
        iconSize: [28, 28],
        iconAnchor: [14, 14]
      });

      const userMarker = L.marker([userLat, userLng], { icon: userIcon });
      userMarker.bindTooltip('📍 Your Current Location', {
        direction: 'top',
        offset: [0, -10],
        className: 'gis-hover-tooltip'
      });
      userMarker.bindPopup(`
        <div style="font-family: system-ui, sans-serif; font-size: 12px; padding: 4px; text-align: center;">
          <strong style="color: #059669; font-size: 13px;">📍 Your Current Location</strong>
          <p style="margin: 4px 0 0 0; color: #64748B;">Kopargaon Spatial Anchor</p>
        </div>
      `);
      clusterGroup.addLayer(userMarker);
    }

    // 2. Icon-Only POI Markers with Hover Tooltips & Click Popups
    const activePois = pois.filter(poi => {
      if (!activeCategories || activeCategories.length === 0) return true;
      return activeCategories.includes(poi.category);
    });

    activePois.forEach(poi => {
      if (!poi.lat || !poi.lng) return;

      bounds.push([poi.lat, poi.lng]);

      const catObj = CITY_ASSET_CATEGORIES.find(c => c.id === poi.category) || {
        color: poi.categoryColor || '#2563EB',
        iconType: poi.iconType || 'hospital'
      };

      const customIconHTML = createCustomMarkerHTML(catObj);

      const customIcon = L.divIcon({
        className: 'gis-icon-only-marker',
        html: customIconHTML,
        iconSize: [36, 36],
        iconAnchor: [18, 18],
        popupAnchor: [0, -18]
      });

      const marker = L.marker([poi.lat, poi.lng], { icon: customIcon });

      // Hover Tooltip: Show ONLY place name on hover
      marker.bindTooltip(poi.name, {
        direction: 'top',
        offset: [0, -20],
        className: 'gis-place-tooltip'
      });

      // Click Popup: Show full GIS Command Center details
      const popupContent = createMarkerPopupHTML(poi);
      marker.bindPopup(popupContent, {
        maxWidth: 290,
        className: 'gis-custom-leaflet-popup'
      });

      clusterGroup.addLayer(marker);
    });

    // 3. Auto fit bounds smoothly
    if (bounds.length > 0) {
      const leafletBounds = L.latLngBounds(bounds);
      mapInstance.fitBounds(leafletBounds, { padding: [40, 40], maxZoom: 16 });
    }

  }, [mapInstance, pois, userLocation, activeCategories]);

  return null;
};

export default MapMarkers;
