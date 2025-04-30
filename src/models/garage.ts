
export type Amenity = 'EV Charging' | 'Valet' | 'Car Wash' | 'Security' | '24/7 Access' | 'Covered' | 'CCTV';

export type ServiceType = 'Tire Repair' | 'Engine Repair' | 'Oil Change' | 'Battery Service' | 'Brake Service' | 'Transmission' | 'General Maintenance';

export interface Service {
  type: ServiceType;
  price: number;
  duration: number; // in minutes
  available: boolean;
}

export interface Mechanic {
  id: string;
  name: string;
  specialization: ServiceType[];
  isAvailable: boolean;
  rating: number;
}

export interface GarageBusyStatus {
  level: 'Low' | 'Medium' | 'High';
  waitTime: number; // estimated wait time in minutes
  timestamp: Date;
}

export interface Review {
  id: string;
  userId: string;
  userName: string;
  rating: number;
  comment: string;
  date: Date;
  serviceUsed?: ServiceType;
}

export interface Garage {
  id: string;
  name: string;
  address: string;
  lat: number;
  lng: number;
  distance: number; // Distance in kilometers
  hourlyRate: number;
  dailyRate: number;
  totalSpots: number;
  availableSpots: number;
  amenities: Amenity[];
  imageUrl?: string;
  rating: number; // Out of 5
  busyStatus: GarageBusyStatus;
  services: Service[];
  mechanics: Mechanic[];
  reviews: Review[];
  emergency: {
    available: boolean;
    responseTime: number; // in minutes
  };
}

// Base reservation interface with common properties
export interface BaseReservation {
  garageId: string;
  price: number;
  userId?: string;
  spotNumber?: string;
}

export interface GarageReservation extends BaseReservation {
  startTime: Date;
  endTime: Date;
}

export interface ServiceReservation extends BaseReservation {
  serviceType: ServiceType;
  scheduledTime: Date;
  isEmergency: boolean;
  vehicleDetails: {
    make: string;
    model: string;
    year: string;
    issue: string;
  };
  mechanicId?: string;
}
