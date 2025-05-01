
import React from 'react';
import { Garage } from '@/models/garage';
import Header from '@/components/Header';
import MainContent from '@/components/MainContent';
import ReservationModals from '@/components/ReservationModals';
import { useGarageData } from '@/hooks/useGarageData';
import { useReservations } from '@/hooks/useReservations';

const Index = () => {
  const { 
    garages, 
    selectedGarage, 
    userLocation, 
    isLoading, 
    isEmergencyMode,
    setSelectedGarage,
    setIsEmergencyMode,
    refreshGarages
  } = useGarageData();

  const {
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
  } = useReservations(selectedGarage, refreshGarages);

  // Handle selecting a garage
  const handleSelectGarage = (garage: Garage) => {
    setSelectedGarage(garage);
  };
  
  // Handle toggling emergency mode
  const toggleEmergencyMode = () => {
    setIsEmergencyMode(!isEmergencyMode);
  };
  
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header onRefresh={refreshGarages} />
      
      <MainContent
        garages={garages}
        selectedGarage={selectedGarage}
        userLocation={userLocation}
        isLoading={isLoading}
        isEmergencyMode={isEmergencyMode}
        onSelectGarage={handleSelectGarage}
        onReserve={handleReserve}
        onRequestService={handleRequestService}
        onShowReviews={handleShowReviews}
        onNavigate={handleNavigate}
        onToggleEmergencyMode={toggleEmergencyMode}
      />
      
      <ReservationModals
        selectedGarage={selectedGarage}
        showReservationModal={showReservationModal}
        showServiceModal={showServiceModal}
        showReviewsModal={showReviewsModal}
        showSuccess={showSuccess}
        activeReservation={activeReservation}
        isEmergencyMode={isEmergencyMode}
        onReservationSuccess={handleReservationSuccess}
        onServiceSuccess={handleServiceSuccess}
        onCloseReservationModal={() => handleCloseAll()}
        onCloseServiceModal={() => handleCloseAll()}
        onCloseReviewsModal={() => handleCloseAll()}
        onClose={handleCloseAll}
        onNavigate={handleNavigate}
      />
    </div>
  );
};

export default Index;
