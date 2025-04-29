
export type Amenity = 'EV Charging' | 'Valet' | 'Car Wash' | 'Security' | '24/7 Access' | 'Covered' | 'CCTV';

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
}

export interface GarageReservation {
  garageId: string;
  startTime: Date;
  endTime: Date;
  spotNumber?: string;
  price: number;
  userId?: string;
}
