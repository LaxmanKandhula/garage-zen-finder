
import { useState, useEffect } from 'react';
import { Garage } from '@/models/garage';
import { getGarages, getUserLocation, getEmergencyGarages } from '@/services/garageService';
import { useToast } from '@/components/ui/use-toast';

interface UseGarageDataReturn {
  garages: Garage[];
  selectedGarage: Garage | null;
  userLocation: { lat: number; lng: number } | null;
  isLoading: boolean;
  isEmergencyMode: boolean;
  setSelectedGarage: (garage: Garage) => void;
  setIsEmergencyMode: (value: boolean) => void;
  refreshGarages: (showLoading?: boolean) => Promise<void>;
  loadEmergencyGarages: () => Promise<void>;
}

export const useGarageData = (): UseGarageDataReturn => {
  const [garages, setGarages] = useState<Garage[]>([]);
  const [selectedGarage, setSelectedGarage] = useState<Garage | null>(null);
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isEmergencyMode, setIsEmergencyMode] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    refreshGarages();
    
    // Setup periodic refresh for real-time updates
    const intervalId = setInterval(() => {
      console.log("Refreshing garage data for real-time updates...");
      refreshGarages(false); // Don't show loading indicator for background refreshes
    }, 30000); // Update every 30 seconds
    
    return () => clearInterval(intervalId);
  }, []);

  useEffect(() => {
    if (isEmergencyMode && userLocation) {
      loadEmergencyGarages();
    }
  }, [isEmergencyMode, userLocation]);

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

  return {
    garages,
    selectedGarage,
    userLocation,
    isLoading,
    isEmergencyMode,
    setSelectedGarage,
    setIsEmergencyMode,
    refreshGarages,
    loadEmergencyGarages
  };
};
