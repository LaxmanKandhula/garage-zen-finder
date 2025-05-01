
import React from 'react';
import { Garage, GarageReservation, ServiceReservation } from '@/models/garage';
import ReservationModal from '@/components/ReservationModal';
import ServiceModal from '@/components/ServiceModal';
import ReviewsModal from '@/components/ReviewsModal';
import SuccessView from '@/components/SuccessView';

interface ReservationModalsProps {
  selectedGarage: Garage | null;
  showReservationModal: boolean;
  showServiceModal: boolean;
  showReviewsModal: boolean;
  showSuccess: boolean;
  activeReservation: GarageReservation | ServiceReservation | null;
  isEmergencyMode: boolean;
  onReservationSuccess: (reservation: GarageReservation) => void;
  onServiceSuccess: (reservation: ServiceReservation) => void;
  onCloseReservationModal: () => void;
  onCloseServiceModal: () => void;
  onCloseReviewsModal: () => void;
  onClose: () => void;
  onNavigate: (garage: Garage) => void;
}

const ReservationModals: React.FC<ReservationModalsProps> = ({
  selectedGarage,
  showReservationModal,
  showServiceModal,
  showReviewsModal,
  showSuccess,
  activeReservation,
  isEmergencyMode,
  onReservationSuccess,
  onServiceSuccess,
  onCloseReservationModal,
  onCloseServiceModal,
  onCloseReviewsModal,
  onClose,
  onNavigate
}) => {
  if (!selectedGarage) return null;
  
  return (
    <>
      {/* Reservation Modal */}
      {showReservationModal && (
        <ReservationModal 
          garage={selectedGarage} 
          onClose={onCloseReservationModal}
          onSuccess={onReservationSuccess}
        />
      )}
      
      {/* Service Modal */}
      {showServiceModal && (
        <ServiceModal 
          garage={selectedGarage}
          onClose={onCloseServiceModal}
          onSuccess={onServiceSuccess}
          isEmergency={isEmergencyMode}
        />
      )}
      
      {/* Reviews Modal */}
      {showReviewsModal && (
        <ReviewsModal 
          garage={selectedGarage}
          onClose={onCloseReviewsModal}
        />
      )}
      
      {/* Success View */}
      {showSuccess && activeReservation && (
        <SuccessView 
          reservation={activeReservation}
          garageName={selectedGarage.name}
          garageAddress={selectedGarage.address}
          onNavigate={() => onNavigate(selectedGarage)}
          onClose={onClose}
        />
      )}
    </>
  );
};

export default ReservationModals;
