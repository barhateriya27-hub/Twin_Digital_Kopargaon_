/**
 * Reverse Geocoding & Location Search Service using OpenStreetMap Nominatim API
 * Bounded to Kopargaon, Maharashtra Bounding Box
 */

import axios from 'axios';

const KOPARGAON_VIEWBOX = '74.40,19.95,74.55,19.82';

/**
 * Search places in Kopargaon using OpenStreetMap Nominatim
 */
export const searchKopargaonPlaces = async (query) => {
  if (!query || query.trim().length < 2) return [];

  try {
    const searchUrl = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(query + ' Kopargaon Maharashtra')}&format=json&viewbox=${KOPARGAON_VIEWBOX}&bounded=1&limit=8`;

    const response = await axios.get(searchUrl, {
      timeout: 6000,
      headers: {
        'Accept-Language': 'en'
      }
    });

    if (Array.isArray(response.data)) {
      return response.data.map(item => ({
        id: item.place_id,
        name: item.display_name.split(',')[0],
        fullName: item.display_name,
        lat: parseFloat(item.lat),
        lng: parseFloat(item.lon),
        type: item.type,
        category: item.class
      }));
    }

    return [];
  } catch (error) {
    console.error('Nominatim Geocoding Error:', error.message);
    return [];
  }
};

/**
 * Reverse geocode latitude and longitude to address in Kopargaon
 */
export const reverseGeocodeCoords = async (lat, lng) => {
  try {
    const url = `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`;
    const response = await axios.get(url, { timeout: 6000 });
    return response.data?.display_name || `Ward Sector, Kopargaon (${lat.toFixed(4)}, ${lng.toFixed(4)})`;
  } catch (error) {
    console.error('Reverse Geocoding Error:', error.message);
    return `Kopargaon (${lat.toFixed(4)}, ${lng.toFixed(4)})`;
  }
};
