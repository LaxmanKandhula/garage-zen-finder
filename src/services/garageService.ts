
import { Garage, GarageReservation } from '@/models/garage';

// Mock data for garages
const mockGarages: Garage[] = [
  {
    id: 'g1',
    name: 'Central Plaza Parking',
    address: '123 Main Street, Downtown',
    lat: 40.7128,
    lng: -74.0060,
    distance: 0.3,
    hourlyRate: 4.50,
    dailyRate: 25.00,
    totalSpots: 200,
    availableSpots: 35,
    amenities: ['EV Charging', 'Security', '24/7 Access', 'CCTV'],
    rating: 4.5,
  },
  {
    id: 'g2',
    name: 'Harbor View Garage',
    address: '456 Water Street, Waterfront',
    lat: 40.7135,
    lng: -74.0150,
    distance: 0.7,
    hourlyRate: 3.75,
    dailyRate: 20.00,
    totalSpots: 150,
    availableSpots: 82,
    amenities: ['Valet', 'Car Wash', 'Security'],
    rating: 4.2,
  },
  {
    id: 'g3',
    name: 'Metro Park',
    address: '789 Broadway Avenue, Midtown',
    lat: 40.7215,
    lng: -73.9985,
    distance: 1.2,
    hourlyRate: 5.25,
    dailyRate: 30.00,
    totalSpots: 300,
    availableSpots: 5,
    amenities: ['EV Charging', 'Valet', '24/7 Access', 'Covered'],
    rating: 4.7,
  },
  {
    id: 'g4',
    name: 'Westside Parking',
    address: '321 Park Avenue, West Side',
    lat: 40.7180,
    lng: -74.0120,
    distance: 1.5,
    hourlyRate: 3.00,
    dailyRate: 18.00,
    totalSpots: 120,
    availableSpots: 48,
    amenities: ['Security', 'CCTV', 'Covered'],
    rating: 3.8,
  },
  {
    id: 'g5',
    name: 'Tech Hub Garage',
    address: '555 Innovation Drive, Tech District',
    lat: 40.7240,
    lng: -74.0050,
    distance: 2.1,
    hourlyRate: 4.00,
    dailyRate: 22.00,
    totalSpots: 180,
    availableSpots: 25,
    amenities: ['EV Charging', '24/7 Access', 'Security', 'Car Wash'],
    rating: 4.4,
  }
];

// Simulate fetching garages with a delay to mimic an API call
export const getGarages = async (userLat: number, userLng: number): Promise<Garage[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      // In a real app, this would calculate actual distance based on user coordinates
      const garagesWithUpdatedAvailability = mockGarages.map(garage => {
        // Randomly update availability each time to simulate IoT sensors
        const fluctuation = Math.floor(Math.random() * 10) - 5; // -5 to +5
        const newAvailable = Math.max(0, Math.min(garage.totalSpots, garage.availableSpots + fluctuation));
        
        return {
          ...garage,
          availableSpots: newAvailable,
        };
      });
      
      resolve(garagesWithUpdatedAvailability);
    }, 800);
  });
};

export const getGarageById = async (id: string): Promise<Garage | null> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const garage = mockGarages.find(g => g.id === id);
      if (garage) {
        // Simulate real-time updates with slight fluctuations in available spots
        const fluctuation = Math.floor(Math.random() * 6) - 2; // -2 to +3
        const newAvailable = Math.max(0, Math.min(garage.totalSpots, garage.availableSpots + fluctuation));
        
        resolve({
          ...garage,
          availableSpots: newAvailable,
        });
      } else {
        resolve(null);
      }
    }, 500);
  });
};

export const reserveSpot = async (reservation: Omit<GarageReservation, 'spotNumber'>): Promise<GarageReservation> => {
  // In a real app, this would make an API call to create a reservation
  return new Promise((resolve) => {
    setTimeout(() => {
      // Generate a random spot number
      const spotNumber = `A-${Math.floor(Math.random() * 100) + 1}`;
      
      resolve({
        ...reservation,
        spotNumber,
      });
    }, 1000);
  });
};

// Function to simulate getting user's geolocation
export const getUserLocation = (): Promise<GeolocationPosition> => {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('Geolocation is not supported by your browser'));
      return;
    }
    
    navigator.geolocation.getCurrentPosition(resolve, reject);
  });
};
