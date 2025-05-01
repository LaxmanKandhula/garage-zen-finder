
import React from 'react';
import EmergencyModeToggle from './EmergencyModeToggle';

interface GarageListHeaderProps {
  isLoading: boolean;
  isEmergencyMode: boolean;
  garageCount: number;
  onToggleEmergencyMode: () => void;
}

const GarageListHeader: React.FC<GarageListHeaderProps> = ({
  isLoading,
  isEmergencyMode,
  garageCount,
  onToggleEmergencyMode
}) => {
  return (
    <div className="mb-3 flex justify-between items-center">
      <div>
        <h2 className="text-lg font-semibold text-gray-800">
          {isEmergencyMode ? 'Emergency Services' : 'Nearby Parking'}
        </h2>
        <p className="text-sm text-gray-600">
          {isLoading 
            ? isEmergencyMode ? "Finding emergency services..." : "Finding available parking spots..." 
            : `${garageCount} locations found near you`}
        </p>
      </div>
      
      <EmergencyModeToggle 
        isEmergencyMode={isEmergencyMode}
        onToggle={onToggleEmergencyMode}
      />
    </div>
  );
};

export default GarageListHeader;
