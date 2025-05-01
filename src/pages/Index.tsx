import React, { useEffect, useState } from 'react';
import { Garage, GarageReservation, ServiceReservation } from '@/models/garage';
import { getGarages, getUserLocation, getEmergencyGarages } from '@/services/garageService';
import { useToast } from '@/components/ui/use-toast';
import GarageList from '@/components/GarageList';
import MapView from '@/components/MapView';
import Header from '@/components/Header';
import ReservationModal from '@/components/ReservationModal';
import ServiceModal from '@/components/ServiceModal';
import ReviewsModal from '@/components/ReviewsModal';
import SuccessView from '@/components/SuccessView';
import { Button } from '@/components/ui/button';
import { Shield, Car } from 'lucide-react';

const Index = () => {
  const [garages, setGarages] = useState<Garage[]>([]);
  const [selectedGarage, setSelectedGarage] = useState<Garage | null>(null);
  const [parkingReservation, setParkingReservation] = useState<GarageReservation | null>(null);
  const [serviceReservation, setServiceReservation] = useState<ServiceReservation | null>(null);
  const [activeReservation, setActiveReservation] = useState<GarageReservation | ServiceReservation | null>(null);
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isEmergencyMode, setIsEmergencyMode] = useState(false);
  const [showReservationModal, setShowReservationModal] = useState(false);
  const [showServiceModal, setShowServiceModal] = useState(false);
  const [showReviewsModal, setShowReviewsModal] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const { toast } = useToast();
  
  // Load garages when component mounts
  useEffect(() => {
    refreshGarages();
    
    // Setup periodic refresh for real-time updates
    const intervalId = setInterval(() => {
      console.log("Refreshing garage data for real-time updates...");
      refreshGarages(false); // Don't show loading indicator for background refreshes
    }, 30000); // Update every 30 seconds
    
    return () => clearInterval(intervalId);
  }, []);
  
  // Load emergency garages when emergency mode changes
  useEffect(() => {
    if (isEmergencyMode && userLocation) {
      loadEmergencyGarages();
    }
  }, [isEmergencyMode, userLocation]);
  
  // Function to load emergency garages
  const loadEmergencyGarages = async () => {
    if (!userLocation) return;
    
    setIsLoading(true);
    try {
      const emergencyGarages = await getEmergencyGarages(userLocation.lat, userLocation.lng);
      setGarages(emergencyGarages);
      
      if (emergencyGarages.length > 0) {
        setSelectedGarage(emergencyGarages[0]);
        toast({
          title: "Emergency Mode Activated",
          description: `Found ${emergencyGarages.length} garages with emergency services near you.`,
        });
      } else {
        toast({
          variant: "destructive",
          title: "No Emergency Services",
          description: "No garages with emergency services found nearby.",
        });
      }
    } catch (error) {
      console.error("Error loading emergency garages:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load emergency services.",
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  // Function to handle refresh/reload
  const refreshGarages = async (showLoading = true) => {
    if (showLoading) setIsLoading(true);
    try {
      // Try to get user location
      let position;
      try {
        position = await getUserLocation();
        const { latitude, longitude } = position.coords;
        setUserLocation({ lat: latitude, lng: longitude });
        
        if (showLoading) {
          toast({
            title: "Location Found",
            description: "Using your current location to find nearby parking",
          });
        }
      } catch (error) {
        console.error("Error getting location:", error);
        if (showLoading) {
          toast({
            variant: "destructive",
            title: "Location Error",
            description: "Could not access your location. Using default location.",
          });
        }
        // Use default location if geolocation fails
        setUserLocation({ lat: 40.7128, lng: -74.0060 });
      }
      
      // Get garages based on user location
      const userLat = userLocation?.lat || 40.7128;
      const userLng = userLocation?.lng || -74.0060;
      
      if (isEmergencyMode) {
        const emergencyGarages = await getEmergencyGarages(userLat, userLng);
        setGarages(emergencyGarages);
        if (emergencyGarages.length > 0) {
          setSelectedGarage(emergencyGarages[0]);
        }
      } else {
        const garagesData = await getGarages(userLat, userLng);
        setGarages(garagesData);
        
        if (garagesData.length > 0) {
          setSelectedGarage(garagesData[0]);
        }
      }
    } catch (error) {
      console.error("Error loading garages:", error);
      if (showLoading) {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to load nearby parking garages.",
        });
      }
    } finally {
      if (showLoading) setIsLoading(false);
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
  
  // Handle requesting a service
  const handleRequestService = (garage: Garage) => {
    setSelectedGarage(garage);
    setShowServiceModal(true);
  };
  
  // Handle showing reviews
  const handleShowReviews = (garage: Garage) => {
    setSelectedGarage(garage);
    setShowReviewsModal(true);
  };
  
  // Handle navigation - Updated to open Google Maps
  const handleNavigate = (garage: Garage) => {
    toast({
      title: "Navigation Started",
      description: `Navigating to ${garage.name}`,
    });
    
    // Create Google Maps URL with the garage location
    const googleMapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(garage.address)}`;
    
    // Open Google Maps in a new tab
    window.open(googleMapsUrl, '_blank');
  };
  
  // Handle toggling emergency mode
  const toggleEmergencyMode = () => {
    setIsEmergencyMode(!isEmergencyMode);
  };
  
  // Handle successful parking reservation
  const handleReservationSuccess = (reservation: GarageReservation) => {
    setParkingReservation(reservation);
    setActiveReservation(reservation);
    setShowReservationModal(false);
    setShowSuccess(true);
  };
  
  // Handle successful service reservation
  const handleServiceSuccess = (reservation: ServiceReservation) => {
    setServiceReservation(reservation);
    setActiveReservation(reservation);
    setShowServiceModal(false);
    setShowSuccess(true);
  };
  
  // Close all modals and reset
  const handleCloseAll = () => {
    setShowReservationModal(false);
    setShowServiceModal(false);
    setShowReviewsModal(false);
    setShowSuccess(false);
    refreshGarages(); // Refresh to get updated availability
  };
  
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header onRefresh={refreshGarages} />
      
      <main className="flex-1 container mx-auto p-4 flex flex-col md:flex-row gap-4">
        <div className="w-full md:w-1/2 lg:w-2/5 flex flex-col">
          <div className="mb-3 flex justify-between items-center">
            <div>
              <h2 className="text-lg font-semibold text-gray-800">
                {isEmergencyMode ? 'Emergency Services' : 'Nearby Parking'}
              </h2>
              <p className="text-sm text-gray-600">
                {isLoading 
                  ? isEmergencyMode ? "Finding emergency services..." : "Finding available parking spots..." 
                  : `${garages.length} locations found near you`}
              </p>
            </div>
            
            <Button 
              variant={isEmergencyMode ? "destructive" : "outline"} 
              size="sm"
              className={`flex items-center gap-1 ${isEmergencyMode ? '' : 'border-red-200 text-red-700 hover:bg-red-50'}`}
              onClick={toggleEmergencyMode}
            >
              {isEmergencyMode ? (
                <>
                  <Car size={16} />
                  <span>Exit Emergency</span>
                </>
              ) : (
                <>
                  <Shield size={16} />
                  <span>Emergency</span>
                </>
              )}
            </Button>
          </div>
          
          <div className="flex-1 overflow-y-auto">
            <GarageList 
              garages={garages}
              selectedGarage={selectedGarage}
              onSelect={handleSelectGarage}
              onReserve={handleReserve}
              onRequestService={handleRequestService}
              onShowReviews={handleShowReviews}
              onNavigate={handleNavigate}
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
      
      {/* Service Modal */}
      {showServiceModal && selectedGarage && (
        <ServiceModal 
          garage={selectedGarage}
          onClose={() => setShowServiceModal(false)}
          onSuccess={handleServiceSuccess}
          isEmergency={isEmergencyMode}
        />
      )}
      
      {/* Reviews Modal */}
      {showReviewsModal && selectedGarage && (
        <ReviewsModal 
          garage={selectedGarage}
          onClose={() => setShowReviewsModal(false)}
        />
      )}
      
      {/* Success View */}
      {showSuccess && activeReservation && selectedGarage && (
        <SuccessView 
          reservation={activeReservation}
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
