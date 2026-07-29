import React from 'react';
import { SmartCityDigitalTwin } from '../digitaltwin/SmartCityDigitalTwin';
import { getKopargaonPOIs } from '../../services/poiService';

export const SmartCityMap = ({
  pois: externalPois = [],
  userLocation,
  selectedCategory = 'All',
  searchQuery = ''
}) => {
  const displayPois = getKopargaonPOIs(
    selectedCategory,
    searchQuery,
    userLocation?.lat,
    userLocation?.lng
  );

  const poisToRender = externalPois.length > 0 ? externalPois : displayPois;

  return (
    <SmartCityDigitalTwin
      pois={poisToRender}
      userLocation={userLocation}
      selectedCategory={selectedCategory}
      searchQuery={searchQuery}
    />
  );
};

export default SmartCityMap;
