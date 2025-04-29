
import React, { useEffect, useState } from 'react';
import { Garage, GarageReservation } from '@/models/garage';
import { getGarages, getUserLocation } from '@/services/garageService';
import { useToast } from '@/components/ui/use-toast';
import GarageList from '@/components/GarageList';
import MapView from '@/components/MapView';
import Header from '@/components/Header';
import ReservationModal from '@/components/ReservationModal';
import SuccessView from '@/components/SuccessView';

const Index = () => {
  const [garages, setGarages] = useState<Garage[]>([]);
  const [selectedGarage, setSelectedGarage] = useState<Garage | null>(null);
  const [reservation, setReservation] = useState<GarageReservation | null>(null);
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showReservationModal, setShowReservationModal] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const { toast } = useToast();
  
  // Load garages when component mounts
  useEffect(() => {
    refreshGarages();
  }, []);
  
  // Function to handle refresh/reload
  const refreshGarages = async () => {
    setIsLoading(true);
    try {
      // Try to get user location
      let position;
      try {
        position = await getUserLocation();
        const { latitude, longitude } = position.coords;
        setUserLocation({ lat: latitude, lng: longitude });
        toast({
          title: "Location Found",
          description: "Using your current location to find nearby parking",
        });
      } catch (error) {
        console.error("Error getting location:", error);
        toast({
          variant: "destructive",
          title: "Location Error",
          description: "Could not access your location. Using default location.",
        });
        // Use default location if geolocation fails
        setUserLocation({ lat: 40.7128, lng: -74.0060 });
      }
      
      // Get garages based on user location
      const userLat = userLocation?.lat || 40.7128;
      const userLng = userLocation?.lng || -74.0060;
      const garagesData = await getGarages(userLat, userLng);
      setGarages(garagesData);
      
      if (garagesData.length > 0) {
        setSelectedGarage(garagesData[0]);
      }
    } catch (error) {
      console.error("Error loading garages:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load nearby parking garages.",
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  // Handle selecting a garage
  const handleSelectGarage = (garage: Garage) => {
    setSelectedGarage(garage);
  };
  
  // Handle reserving a spot
  const handleReserve = (garage: Garage) => {
    setSelectedGarage(garage);
    setShowReservationModal(true);
  };
  
  // Handle navigation
  const handleNavigate = (garage: Garage) => {
    toast({
      title: "Navigation Started",
      description: `Navigating to ${garage.name}`,
    });
    // In a real app, this would integrate with a mapping service
    console.log("Navigating to:", garage);
  };
  
  // Handle successful reservation
  const handleReservationSuccess = (reservation: GarageReservation) => {
    setReservation(reservation);
    setShowReservationModal(false);
    setShowSuccess(true);
  };
  
  // Close all modals and reset
  const handleCloseAll = () => {
    setShowReservationModal(false);
    setShowSuccess(false);
    refreshGarages(); // Refresh to get updated availability
  };
  
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header onRefresh={refreshGarages} />
      
      <main className="flex-1 container mx-auto p-4 flex flex-col md:flex-row gap-4">
        <div className="w-full md:w-1/2 lg:w-2/5 flex flex-col">
          <div className="mb-3">
            <h2 className="text-lg font-semibold text-gray-800">Nearby Parking</h2>
            <p className="text-sm text-gray-600">
              {isLoading 
                ? "Finding available parking spots..." 
                : `${garages.length} locations found near you`}
            </p>
          </div>
          
          <div className="flex-1 overflow-y-auto">
            <GarageList 
              garages={garages}
              selectedGarage={selectedGarage}
              onSelect={handleSelectGarage}
              onReserve={handleReserve}
              onNavigate={handleNavigate}
              isLoading={isLoading}
            />
          </div>
        </div>
        
        <div className="w-full md:w-1/2 lg:w-3/5 h-[400px] md:h-auto">
          <MapView 
            garages={garages}
            selectedGarage={selectedGarage}
            userLocation={userLocation}
            onGarageSelect={handleSelectGarage}
          />
        </div>
      </main>
      
      {/* Reservation Modal */}
      {showReservationModal && selectedGarage && (
        <ReservationModal 
          garage={selectedGarage} 
          onClose={() => setShowReservationModal(false)}
          onSuccess={handleReservationSuccess}
        />
      )}
      
      {/* Success View */}
      {showSuccess && reservation && selectedGarage && (
        <SuccessView 
          reservation={reservation}
          garageName={selectedGarage.name}
          garageAddress={selectedGarage.address}
          onNavigate={() => handleNavigate(selectedGarage)}
          onClose={handleCloseAll}
        />
      )}
    </div>
  );
};

export default Index;
