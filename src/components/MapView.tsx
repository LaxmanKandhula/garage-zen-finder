
import React, { useEffect, useRef, useState } from 'react';
import { Garage } from '@/models/garage';
import { MapPin } from 'lucide-react';

interface MapViewProps {
  garages: Garage[];
  selectedGarage: Garage | null;
  userLocation: { lat: number; lng: number } | null;
  onGarageSelect: (garage: Garage) => void;
}

const MapView: React.FC<MapViewProps> = ({ 
  garages, 
  selectedGarage,
  userLocation,
  onGarageSelect 
}) => {
  // In a real implementation, this would use a mapping library like Google Maps, Mapbox, or Leaflet
  // This is a simplified mock implementation
  
  return (
    <div className="relative w-full h-full bg-sky-50 rounded-lg overflow-hidden border border-gray-200 shadow-inner">
      <div className="absolute inset-0 bg-opacity-20 flex items-center justify-center">
        <div className="text-center p-8 rounded-lg bg-white bg-opacity-70 backdrop-blur-sm">
          <div className="flex flex-col items-center space-y-2">
            <MapPin size={32} className="text-teal-500" />
            <p className="text-sm text-teal-700">Map visualization would appear here</p>
            <p className="text-xs text-gray-500">
              {userLocation 
                ? `User located at ${userLocation.lat.toFixed(4)}, ${userLocation.lng.toFixed(4)}` 
                : 'Locating user position...'}
            </p>
          </div>
          
          <div className="mt-4 text-left">
            <p className="text-xs font-medium text-gray-700 mb-2">Available Garages:</p>
            <div className="space-y-1 max-h-40 overflow-y-auto">
              {garages.map(garage => (
                <div 
                  key={garage.id}
                  className={`text-xs p-2 rounded cursor-pointer ${selectedGarage?.id === garage.id 
                    ? 'bg-teal-100 border border-teal-300' 
                    : 'hover:bg-gray-100'}`}
                  onClick={() => onGarageSelect(garage)}
                >
                  <div className="font-medium">{garage.name}</div>
                  <div className="text-gray-500 text-[10px]">{garage.distance.toFixed(1)} km • {garage.availableSpots} spots</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MapView;
