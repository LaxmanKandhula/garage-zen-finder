
import React, { useState } from 'react';
import { Garage, ServiceType, ServiceReservation } from '@/models/garage';
import { Button } from '@/components/ui/button';
import { Calendar, Clock, Wrench, Car, X, Shield, IndianRupee } from 'lucide-react';
import { scheduleService } from '@/services/garageService';
import { useToast } from '@/components/ui/use-toast';

interface ServiceModalProps {
  garage: Garage | null;
  onClose: () => void;
  onSuccess: (reservation: ServiceReservation) => void;
  isEmergency?: boolean;
}

const ServiceModal: React.FC<ServiceModalProps> = ({
  garage,
  onClose,
  onSuccess,
  isEmergency = false,
}) => {
  const { toast } = useToast();
  const [selectedService, setSelectedService] = useState<ServiceType | null>(null);
  const [scheduledDate, setScheduledDate] = useState<Date>(new Date());
  const [isReserving, setIsReserving] = useState(false);
  const [vehicleDetails, setVehicleDetails] = useState({
    make: '',
    model: '',
    year: '',
    issue: ''
  });
  
  if (!garage) return null;
  
  // Get only available services
  const availableServices = garage.services.filter(service => service.available);
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setVehicleDetails(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleSchedule = async () => {
    if (!garage || !selectedService) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please select a service to continue.",
      });
      return;
    }
    
    if (!vehicleDetails.make || !vehicleDetails.model || !vehicleDetails.issue) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please fill in all required vehicle information.",
      });
      return;
    }
    
    setIsReserving(true);
    try {
      const serviceInfo = garage.services.find(s => s.type === selectedService);
      if (!serviceInfo) throw new Error("Service not found");
      
      const now = new Date();
      const reservationData = {
        garageId: garage.id,
        serviceType: selectedService,
        scheduledTime: isEmergency ? now : scheduledDate,
        isEmergency,
        vehicleDetails,
        price: serviceInfo.price,
      };
      
      const result = await scheduleService(reservationData);
      onSuccess(result);
      
      toast({
        title: isEmergency ? "Emergency Service Requested!" : "Service Scheduled!",
        description: `Your ${selectedService} service has been ${isEmergency ? 'requested' : 'scheduled'} at ${garage.name}`,
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Scheduling Failed",
        description: "There was a problem scheduling your service. Please try again.",
      });
    } finally {
      setIsReserving(false);
    }
  };
  
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="w-full max-w-md bg-white rounded-lg shadow-lg overflow-hidden">
        <div className={`p-5 ${isEmergency ? 'bg-red-500' : 'bg-teal-500'} text-white relative`}>
          <button 
            className={`absolute right-4 top-4 text-white hover:${isEmergency ? 'bg-red-600' : 'bg-teal-600'} rounded-full p-1`}
            onClick={onClose}
          >
            <X size={20} />
          </button>
          {isEmergency ? <Shield size={28} /> : <Wrench size={28} />}
          <h2 className="text-xl font-bold mt-2">
            {isEmergency ? 'Request Emergency Service' : 'Schedule Service'}
          </h2>
          <p className="text-teal-50">{garage.name}</p>
        </div>
        
        <div className="p-5">
          {isEmergency && (
            <div className="mb-4 p-3 bg-red-50 border border-red-100 rounded-md">
              <p className="text-sm text-red-800">
                Emergency services will be prioritized. Expected response time: <strong>{garage.emergency.responseTime} minutes</strong>
              </p>
            </div>
          )}
          
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Service Type:
            </label>
            <div className="grid grid-cols-2 gap-2">
              {availableServices.map((service) => (
                <button
                  key={service.type}
                  type="button"
                  onClick={() => setSelectedService(service.type)}
                  className={`py-2 px-3 rounded text-sm ${
                    selectedService === service.type
                      ? "bg-teal-100 text-teal-800 border border-teal-300"
                      : "border border-gray-200 hover:bg-gray-50"
                  }`}
                >
                  <div className="font-medium">{service.type}</div>
                  <div className="text-xs text-gray-600 flex items-center justify-center">
                    <IndianRupee size={12} className="mr-1" /> {service.price} • ~{service.duration} min
                  </div>
                </button>
              ))}
            </div>
          </div>
          
          {!isEmergency && (
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Preferred Date & Time:
              </label>
              <div className="flex gap-2">
                <input 
                  type="date" 
                  className="flex-1 p-2 border border-gray-300 rounded text-sm"
                  min={new Date().toISOString().split('T')[0]}
                  onChange={(e) => {
                    const newDate = new Date(scheduledDate);
                    newDate.setFullYear(
                      parseInt(e.target.value.split('-')[0]),
                      parseInt(e.target.value.split('-')[1]) - 1,
                      parseInt(e.target.value.split('-')[2])
                    );
                    setScheduledDate(newDate);
                  }}
                />
                <input 
                  type="time" 
                  className="w-1/3 p-2 border border-gray-300 rounded text-sm"
                  onChange={(e) => {
                    const [hours, minutes] = e.target.value.split(':');
                    const newDate = new Date(scheduledDate);
                    newDate.setHours(parseInt(hours), parseInt(minutes));
                    setScheduledDate(newDate);
                  }}
                />
              </div>
            </div>
          )}
          
          <div className="mb-3">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Vehicle Information:
            </label>
            <div className="space-y-2">
              <div className="flex gap-2">
                <input
                  type="text"
                  name="make"
                  placeholder="Make"
                  className="flex-1 p-2 border border-gray-300 rounded text-sm"
                  value={vehicleDetails.make}
                  onChange={handleInputChange}
                />
                <input
                  type="text"
                  name="model"
                  placeholder="Model"
                  className="flex-1 p-2 border border-gray-300 rounded text-sm"
                  value={vehicleDetails.model}
                  onChange={handleInputChange}
                />
                <input
                  type="text"
                  name="year"
                  placeholder="Year"
                  className="w-1/4 p-2 border border-gray-300 rounded text-sm"
                  value={vehicleDetails.year}
                  onChange={handleInputChange}
                />
              </div>
              <textarea
                name="issue"
                placeholder="Describe the issue..."
                rows={3}
                className="w-full p-2 border border-gray-300 rounded text-sm"
                value={vehicleDetails.issue}
                onChange={handleInputChange}
              />
            </div>
          </div>
          
          {selectedService && (
            <div className="mb-6 bg-gray-50 p-4 rounded-lg">
              <div className="flex justify-between mb-2">
                <span className="text-gray-600">Service:</span>
                <span className="font-medium">{selectedService}</span>
              </div>
              <div className="flex justify-between mb-2">
                <span className="text-gray-600">Estimated Duration:</span>
                <span className="font-medium">
                  {garage.services.find(s => s.type === selectedService)?.duration || 0} minutes
                </span>
              </div>
              <div className="flex justify-between border-t border-gray-200 pt-2 mt-2">
                <span className="font-medium">Total:</span>
                <span className="font-bold flex items-center">
                  <IndianRupee size={16} className="mr-1" />
                  {garage.services.find(s => s.type === selectedService)?.price.toFixed(2) || 0}
                </span>
              </div>
            </div>
          )}
          
          <div className="space-y-3">
            <Button 
              className={`w-full flex items-center justify-center gap-2 ${
                isEmergency ? 'bg-red-500 hover:bg-red-600' : 'bg-orange-500 hover:bg-orange-600'
              }`}
              onClick={handleSchedule}
              disabled={isReserving || !selectedService}
            >
              {isEmergency ? <Shield size={18} /> : <Wrench size={18} />}
              {isReserving ? "Processing..." : isEmergency ? "Request Emergency Service" : "Schedule Service"}
            </Button>
            <Button 
              variant="outline" 
              className="w-full"
              onClick={onClose}
            >
              Cancel
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ServiceModal;
