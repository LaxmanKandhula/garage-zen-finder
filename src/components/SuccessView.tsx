
import React from 'react';
import { Button } from '@/components/ui/button';
import { GarageReservation } from '@/models/garage';
import { CheckCircle, Navigation, Clock, MapPin } from 'lucide-react';

interface SuccessViewProps {
  reservation: GarageReservation;
  garageName: string;
  garageAddress: string;
  onNavigate: () => void;
  onClose: () => void;
}

const SuccessView: React.FC<SuccessViewProps> = ({
  reservation,
  garageName,
  garageAddress,
  onNavigate,
  onClose
}) => {
  // Format the start and end times
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };
  
  const startTime = formatTime(reservation.startTime);
  const endTime = formatTime(reservation.endTime);
  
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="w-full max-w-md bg-white rounded-lg shadow-lg">
        <div className="p-6 bg-emerald-50 flex flex-col items-center">
          <div className="h-16 w-16 bg-emerald-100 rounded-full flex items-center justify-center mb-4">
            <CheckCircle size={32} className="text-emerald-600" />
          </div>
          <h2 className="text-xl font-bold text-emerald-700">Reservation Confirmed!</h2>
          <p className="text-emerald-600 text-center mt-1">
            Your parking spot is waiting for you.
          </p>
        </div>
        
        <div className="p-6">
          <div className="space-y-6">
            <div>
              <h3 className="font-semibold text-lg">{garageName}</h3>
              <div className="flex items-start gap-2 mt-1">
                <MapPin size={18} className="text-gray-400 mt-0.5 flex-shrink-0" />
                <p className="text-gray-600 text-sm">{garageAddress}</p>
              </div>
            </div>
            
            <div className="bg-gray-50 p-4 rounded-lg space-y-3">
              <div className="flex justify-between">
                <div className="flex items-center gap-2">
                  <Clock size={16} className="text-teal-500" />
                  <span className="text-sm text-gray-700">Duration</span>
                </div>
                <span className="font-medium">
                  {startTime} - {endTime}
                </span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-sm text-gray-700">Spot Number</span>
                <span className="font-medium">{reservation.spotNumber}</span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-sm text-gray-700">Total Paid</span>
                <span className="font-bold">${reservation.price.toFixed(2)}</span>
              </div>
            </div>
            
            <div className="space-y-3">
              <Button 
                className="w-full flex items-center justify-center gap-2 bg-teal-500 hover:bg-teal-600"
                onClick={onNavigate}
              >
                <Navigation size={16} />
                Navigate to Garage
              </Button>
              
              <Button 
                variant="outline" 
                className="w-full"
                onClick={onClose}
              >
                Back to Search
              </Button>
            </div>
          </div>
        </div>
        
        <div className="p-4 bg-gray-50 rounded-b-lg border-t border-gray-200">
          <p className="text-xs text-center text-gray-500">
            Your reservation details have been sent to your email.
            You can also find this in your Reservations tab.
          </p>
        </div>
      </div>
    </div>
  );
};

export default SuccessView;
