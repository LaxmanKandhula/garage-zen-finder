
import React from 'react';
import { Garage } from '@/models/garage';
import { Button } from '@/components/ui/button';
import { Clock, Calendar, Navigation, Wrench, Shield, Car } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

interface GarageListProps {
  garages: Garage[];
  selectedGarage: Garage | null;
  onSelect: (garage: Garage) => void;
  onReserve: (garage: Garage) => void;
  onNavigate: (garage: Garage) => void;
  onRequestService: (garage: Garage) => void;
  onShowReviews: (garage: Garage) => void;
  isLoading: boolean;
  isEmergency?: boolean;
}

const GarageList: React.FC<GarageListProps> = ({
  garages,
  selectedGarage,
  onSelect,
  onReserve,
  onNavigate,
  onRequestService,
  onShowReviews,
  isLoading,
  isEmergency = false,
}) => {
  const { toast } = useToast();

  // Function to determine availability status
  const getAvailabilityStatus = (garage: Garage) => {
    const percentage = (garage.availableSpots / garage.totalSpots) * 100;
    
    if (percentage > 25) return 'high';
    if (percentage > 10) return 'medium';
    return 'low';
  };

  // Function to determine busy status color
  const getBusyStatusColor = (level: 'Low' | 'Medium' | 'High') => {
    switch (level) {
      case 'Low': return 'bg-green-100 text-green-800';
      case 'Medium': return 'bg-yellow-100 text-yellow-800';
      case 'High': return 'bg-red-100 text-red-800';
    }
  };

  // Function to render the availability indicator
  const renderAvailabilityIndicator = (garage: Garage) => {
    const status = getAvailabilityStatus(garage);
    
    return (
      <div className="flex items-center gap-1.5">
        <span className={`pulse-dot ${status === 'high' ? 'bg-green-400' : status === 'medium' ? 'bg-orange-400' : 'bg-red-400'}`}></span>
        <span className={`text-sm font-medium availability-${status}`}>
          {garage.availableSpots} spots
        </span>
      </div>
    );
  };

  // Function to render the busy status badge
  const renderBusyStatus = (garage: Garage) => {
    const statusColor = getBusyStatusColor(garage.busyStatus.level);
    
    return (
      <div className={`text-xs px-2 py-1 rounded-full ${statusColor} inline-flex items-center gap-1`}>
        <Clock size={12} />
        <span>
          {garage.busyStatus.level} wait ({garage.busyStatus.waitTime} min)
        </span>
      </div>
    );
  };

  // Function to check if any mechanics are available
  const hasMechanicAvailable = (garage: Garage) => {
    return garage.mechanics.some(mechanic => mechanic.isAvailable);
  };

  // Function to render mechanic status
  const renderMechanicStatus = (garage: Garage) => {
    const available = hasMechanicAvailable(garage);
    
    return (
      <div className={`text-xs ${available ? 'text-green-700' : 'text-gray-500'} flex items-center gap-1`}>
        <Wrench size={12} />
        <span>{available ? 'Mechanics available' : 'No mechanics available'}</span>
      </div>
    );
  };

  // Function to render emergency services badge
  const renderEmergencyBadge = (garage: Garage) => {
    if (!garage.emergency.available) return null;
    
    return (
      <div className="text-xs bg-red-100 text-red-800 px-2 py-1 rounded-full inline-flex items-center gap-1">
        <Shield size={12} />
        <span>Emergency: {garage.emergency.responseTime} min</span>
      </div>
    );
  };

  const renderSkeleton = () => (
    <div className="space-y-4">
      {[1, 2, 3].map(i => (
        <div key={i} className="garage-card p-4 animate-pulse">
          <div className="h-4 bg-gray-200 rounded-full w-3/4 mb-2.5"></div>
          <div className="h-3 bg-gray-200 rounded-full mb-2.5"></div>
          <div className="flex justify-between items-center mt-3">
            <div className="h-6 bg-gray-200 rounded-full w-1/4"></div>
            <div className="h-8 bg-gray-200 rounded w-1/3"></div>
          </div>
        </div>
      ))}
    </div>
  );

  if (isLoading) {
    return renderSkeleton();
  }

  if (garages.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">No garages found nearby.</p>
        <Button 
          variant="outline" 
          className="mt-4"
          onClick={() => toast({
            title: "Location Update",
            description: "Searching for garages in a wider radius...",
          })}
        >
          Expand Search Radius
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {isEmergency && (
        <div className="bg-red-50 border border-red-200 rounded-md p-3 mb-3">
          <h3 className="font-medium text-red-800 flex items-center gap-1">
            <Car size={16} />
            Emergency Assistance
          </h3>
          <p className="text-xs text-red-700 mt-1">
            Showing garages with emergency services ordered by response time
          </p>
        </div>
      )}
      
      {garages.map((garage) => (
        <div 
          key={garage.id}
          className={`garage-card p-3 ${selectedGarage?.id === garage.id ? 'ring-2 ring-teal-500' : ''}`}
          onClick={() => onSelect(garage)}
        >
          <div className="flex justify-between items-start">
            <div>
              <h3 className="font-semibold text-teal-800">{garage.name}</h3>
              <p className="text-sm text-gray-600 mt-0.5">{garage.address}</p>
              <div className="flex items-center mt-1.5 text-sm text-gray-500 gap-2">
                <span>{garage.distance.toFixed(1)} km away</span>
                <span>•</span>
                <span>${garage.hourlyRate.toFixed(2)}/hr</span>
              </div>
            </div>
            <div>
              {renderAvailabilityIndicator(garage)}
            </div>
          </div>
          
          <div className="flex flex-wrap gap-2 my-2">
            {garage.emergency.available && renderEmergencyBadge(garage)}
            {renderBusyStatus(garage)}
            {renderMechanicStatus(garage)}
          </div>

          <div className="flex flex-wrap gap-2 my-2">
            {garage.services.slice(0, 2).map((service) => (
              <span 
                key={service.type} 
                className={`text-xs py-1 px-2 ${service.available ? 'bg-teal-50 text-teal-700' : 'bg-gray-100 text-gray-600'} rounded-full flex items-center gap-1`}
              >
                {service.type} ${service.price}
              </span>
            ))}
            {garage.services.length > 2 && (
              <span className="text-xs py-1 px-2 bg-gray-100 text-gray-600 rounded-full">
                +{garage.services.length - 2} more
              </span>
            )}
          </div>
          
          <div className="flex justify-between items-center mt-3">
            <div className="flex items-center">
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <svg 
                    key={i} 
                    className={`w-3 h-3 ${i < Math.floor(garage.rating) ? 'text-yellow-400' : 'text-gray-300'}`}
                    fill="currentColor" 
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <span className="ml-1 text-xs font-medium text-gray-600">{garage.rating.toFixed(1)}</span>
              <button 
                className="text-xs text-teal-600 ml-2 hover:underline"
                onClick={(e) => {
                  e.stopPropagation();
                  onShowReviews(garage);
                }}
              >
                {garage.reviews.length} reviews
              </button>
            </div>
            
            <div className="flex gap-2">
              <Button 
                size="sm" 
                variant="outline" 
                className="text-xs flex items-center gap-1 h-8 border-teal-200 hover:bg-teal-50"
                onClick={(e) => {
                  e.stopPropagation();
                  onNavigate(garage);
                }}
              >
                <Navigation size={14} />
                Navigate
              </Button>
              
              {hasMechanicAvailable(garage) && (
                <Button 
                  size="sm" 
                  variant="outline" 
                  className="text-xs flex items-center gap-1 h-8 border-orange-200 hover:bg-orange-50"
                  onClick={(e) => {
                    e.stopPropagation();
                    onRequestService(garage);
                  }}
                >
                  <Wrench size={14} />
                  Service
                </Button>
              )}
              
              <Button 
                size="sm" 
                variant="default" 
                className="text-xs flex items-center gap-1 h-8 bg-teal-500 hover:bg-teal-600"
                onClick={(e) => {
                  e.stopPropagation();
                  onReserve(garage);
                }}
              >
                Reserve
              </Button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default GarageList;
