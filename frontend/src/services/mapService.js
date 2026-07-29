/**
 * Map Service Utility
 * Geolocation detection, Haversine distance calculation, travel time estimation,
 * and Google Maps navigation URL generation.
 */

export const DEFAULT_KOPARGAON_LOCATION = {
  lat: 19.8923,
  lng: 74.4784,
  name: 'Kopargaon Municipal Office',
  address: 'Station Road, Kopargaon, Ahmednagar District, Maharashtra 423601'
};

/**
 * Calculates straight-line distance in kilometers between two lat/lng points using Haversine Formula
 */
export const calculateDistance = (lat1, lon1, lat2, lon2) => {
  if (!lat1 || !lon1 || !lat2 || !lon2) return 0;
  const R = 6371; // Earth's radius in km
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) *
      Math.cos(lat2 * (Math.PI / 180)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c;
  return Math.round(distance * 10) / 10; // Round to 1 decimal place
};

/**
 * Estimates travel time based on distance (assuming ~35 km/h urban traffic in Kopargaon)
 */
export const estimateTravelTime = (distanceKm) => {
  if (distanceKm <= 0) return 'Immediate';
  const driveMinutes = Math.max(1, Math.round((distanceKm / 35) * 60));
  if (driveMinutes < 60) {
    return `${driveMinutes} mins drive`;
  }
  const hours = Math.floor(driveMinutes / 60);
  const mins = driveMinutes % 60;
  return `${hours} hr ${mins} mins drive`;
};

/**
 * Prompts user for Browser Geolocation.
 * Resolves with user coordinates or default Kopargaon location if permission is denied.
 */
export const getUserLocation = () => {
  return new Promise((resolve) => {
    if (!navigator.geolocation) {
      resolve({
        ...DEFAULT_KOPARGAON_LOCATION,
        isDefault: true,
        error: 'Geolocation is not supported by your browser.'
      });
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
          isDefault: false
        });
      },
      (error) => {
        let errorMsg = 'Location permission denied.';
        if (error.code === error.TIMEOUT) errorMsg = 'Location request timed out.';
        if (error.code === error.POSITION_UNAVAILABLE) errorMsg = 'Location information unavailable.';
        
        resolve({
          ...DEFAULT_KOPARGAON_LOCATION,
          isDefault: true,
          error: errorMsg
        });
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 60000
      }
    );
  });
};

/**
 * Generates a Google Maps directions URL for navigation
 */
export const getGoogleMapsDirectionsUrl = (lat, lng, destinationName = '') => {
  const query = encodeURIComponent(destinationName ? `${destinationName}, Kopargaon` : `${lat},${lng}`);
  return `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}&destination_place_id=${query}`;
};
