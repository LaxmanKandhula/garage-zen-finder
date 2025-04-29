
import React, { useState } from 'react';
import { Garage, GarageReservation } from '@/models/garage';
import { Button } from '@/components/ui/button';
import { Calendar, Clock, CreditCard, CircleParking, X } from 'lucide-react';
import { reserveSpot } from '@/services/garageService';
import { useToast } from '@/components/ui/use-toast';

interface ReservationModalProps {
  garage: Garage | null;
  onClose: () => void;
  onSuccess: (reservation: GarageReservation) => void;
}

const ReservationModal: React.FC<ReservationModalProps> = ({
  garage,
  onClose,
  onSuccess,
}) => {
  const { toast } = useToast();
  const [duration, setDuration] = useState(2); // Default 2 hours
  const [isReserving, setIsReserving] = useState(false);
  
  if (!garage) return null;
  
  const handleReserve = async () => {
    if (!garage) return;
    
    setIsReserving(true);
    try {
      const now = new Date();
      const endTime = new Date(now.getTime() + duration * 60 * 60 * 1000);
      
      const reservationData = {
        garageId: garage.id,
        startTime: now,
        endTime: endTime,
        price: duration * garage.hourlyRate,
      };
      
      const result = await reserveSpot(reservationData);
      onSuccess(result);
      
      toast({
        title: "Spot Reserved!",
        description: `Your spot ${result.spotNumber} has been reserved at ${garage.name}`,
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Reservation Failed",
        description: "There was a problem reserving your spot. Please try again.",
      });
    } finally {
      setIsReserving(false);
    }
  };
  
  // Calculate total price
  const totalPrice = garage.hourlyRate * duration;
  
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="w-full max-w-md bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="p-5 bg-teal-500 text-white relative">
          <button 
            className="absolute right-4 top-4 text-white hover:bg-teal-600 rounded-full p-1"
            onClick={onClose}
          >
            <X size={20} />
          </button>
          <CircleParking size={28} />
          <h2 className="text-xl font-bold mt-2">Reserve a Spot</h2>
          <p className="text-teal-50">{garage.name}</p>
        </div>
        
        <div className="p-5">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2 text-sm">
              <Calendar size={16} className="text-teal-500" />
              <span>Today</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Clock size={16} className="text-teal-500" />
              <span>Starting now</span>
            </div>
          </div>
          
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Duration (hours):
            </label>
            <div className="flex justify-between gap-2">
              {[1, 2, 3, 4, 8].map((hrs) => (
                <button
                  key={hrs}
                  type="button"
                  onClick={() => setDuration(hrs)}
                  className={`flex-1 py-2 rounded text-sm ${
                    duration === hrs
                      ? "bg-teal-100 text-teal-800 border border-teal-300"
                      : "border border-gray-200 hover:bg-gray-50"
                  }`}
                >
                  {hrs} hr{hrs > 1 ? "s" : ""}
                </button>
              ))}
            </div>
          </div>
          
          <div className="mb-6 bg-gray-50 p-4 rounded-lg">
            <div className="flex justify-between mb-2">
              <span className="text-gray-600">Hourly Rate:</span>
              <span className="font-medium">${garage.hourlyRate.toFixed(2)}</span>
            </div>
            <div className="flex justify-between mb-2">
              <span className="text-gray-600">Duration:</span>
              <span className="font-medium">{duration} hour{duration > 1 ? 's' : ''}</span>
            </div>
            <div className="flex justify-between border-t border-gray-200 pt-2 mt-2">
              <span className="font-medium">Total:</span>
              <span className="font-bold">${totalPrice.toFixed(2)}</span>
            </div>
          </div>
          
          <div className="space-y-3">
            <Button 
              className="w-full bg-orange-500 hover:bg-orange-600 flex items-center justify-center gap-2"
              onClick={handleReserve}
              disabled={isReserving}
            >
              <CreditCard size={18} />
              {isReserving ? "Processing..." : "Pay & Reserve"}
            </Button>
            <Button 
              variant="outline" 
              className="w-full"
              onClick={onClose}
            >
              Cancel
            </Button>
          </div>
          
          <p className="text-xs text-gray-500 text-center mt-4">
            Your payment will be processed securely.
            Cancellations are free up to 30 minutes before reservation time.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ReservationModal;
