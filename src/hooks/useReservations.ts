
import { useState } from 'react';
import { Garage, GarageReservation, ServiceReservation } from '@/models/garage';
import { useToast } from '@/components/ui/use-toast';

interface UseReservationsReturn {
  parkingReservation: GarageReservation | null;
  serviceReservation: ServiceReservation | null;
  activeReservation: GarageReservation | ServiceReservation | null;
  showReservationModal: boolean;
  showServiceModal: boolean;
  showReviewsModal: boolean;
  showSuccess: boolean;
  handleReserve: (garage: Garage) => void;
  handleRequestService: (garage: Garage) => void;
  handleShowReviews: (garage: Garage) => void;
  handleReservationSuccess: (reservation: GarageReservation) => void;
  handleServiceSuccess: (reservation: ServiceReservation) => void;
  handleCloseAll: () => void;
  handleNavigate: (garage: Garage) => void;
}

export const useReservations = (selectedGarage: Garage | null, refreshGarages: () => void): UseReservationsReturn => {
  const [parkingReservation, setParkingReservation] = useState<GarageReservation | null>(null);
  const [serviceReservation, setServiceReservation] = useState<ServiceReservation | null>(null);
  const [activeReservation, setActiveReservation] = useState<GarageReservation | ServiceReservation | null>(null);
  const [showReservationModal, setShowReservationModal] = useState(false);
  const [showServiceModal, setShowServiceModal] = useState(false);
  const [showReviewsModal, setShowReviewsModal] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const { toast } = useToast();

  // Handle reserving a spot
  const handleReserve = (garage: Garage) => {
    setShowReservationModal(true);
  };

  // Handle requesting a service
  const handleRequestService = (garage: Garage) => {
    setShowServiceModal(true);
  };

  // Handle showing reviews
  const handleShowReviews = (garage: Garage) => {
    setShowReviewsModal(true);
  };

  // Handle navigation - Opens Google Maps
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

  return {
    parkingReservation,
    serviceReservation,
    activeReservation,
    showReservationModal,
    showServiceModal,
    showReviewsModal,
    showSuccess,
    handleReserve,
    handleRequestService,
    handleShowReviews,
    handleReservationSuccess,
    handleServiceSuccess,
    handleCloseAll,
    handleNavigate
  };
};
