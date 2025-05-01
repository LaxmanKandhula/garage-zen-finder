
import React from 'react';
import { Garage } from '@/models/garage';
import GarageList from '@/components/GarageList';
import MapView from '@/components/MapView';
import GarageListHeader from './GarageListHeader';

interface MainContentProps {
  garages: Garage[];
  selectedGarage: Garage | null;
  userLocation: { lat: number; lng: number } | null;
  isLoading: boolean;
  isEmergencyMode: boolean;
  onSelectGarage: (garage: Garage) => void;
  onReserve: (garage: Garage) => void;
  onRequestService: (garage: Garage) => void;
  onShowReviews: (garage: Garage) => void;
  onNavigate: (garage: Garage) => void;
  onToggleEmergencyMode: () => void;
}

const MainContent: React.FC<MainContentProps> = ({
  garages,
  selectedGarage,
  userLocation,
  isLoading,
  isEmergencyMode,
  onSelectGarage,
  onReserve,
  onRequestService,
  onShowReviews,
  onNavigate,
  onToggleEmergencyMode
}) => {
  return (
    <main className="flex-1 container mx-auto p-4 flex flex-col md:flex-row gap-4">
      <div className="w-full md:w-1/2 lg:w-2/5 flex flex-col">
        <GarageListHeader 
          isLoading={isLoading}
          isEmergencyMode={isEmergencyMode}
          garageCount={garages.length}
          onToggleEmergencyMode={onToggleEmergencyMode}
        />
        
        <div className="flex-1 overflow-y-auto">
          <GarageList 
            garages={garages}
            selectedGarage={selectedGarage}
            onSelect={onSelectGarage}
            onReserve={onReserve}
            onRequestService={onRequestService}
            onShowReviews={onShowReviews}
            onNavigate={onNavigate}
            isLoading={isLoading}
            isEmergency={isEmergencyMode}
          />
        </div>
      </div>
      
      <div className="w-full md:w-1/2 lg:w-3/5 h-[400px] md:h-auto">
        <MapView 
          garages={garages}
          selectedGarage={selectedGarage}
          userLocation={userLocation}
          onGarageSelect={onSelectGarage}
        />
      </div>
    </main>
  );
};

export default MainContent;
