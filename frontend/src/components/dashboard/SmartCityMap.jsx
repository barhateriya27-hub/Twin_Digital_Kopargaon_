import React from 'react';
import { MapLibreGisCommandCenter } from './MapLibreGisCommandCenter';

export const SmartCityMap = ({
  userLocation,
  complaints = []
}) => {
  return (
    <MapLibreGisCommandCenter
      userLocation={userLocation}
      complaints={complaints}
    />
  );
};

export default SmartCityMap;
