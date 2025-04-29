
import { Garage, GarageReservation, ServiceReservation, ServiceType, Review } from '@/models/garage';

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
    busyStatus: {
      level: 'Medium',
      waitTime: 15,
      timestamp: new Date()
    },
    services: [
      { type: 'Tire Repair', price: 45, duration: 30, available: true },
      { type: 'Oil Change', price: 35, duration: 45, available: true },
      { type: 'Engine Repair', price: 120, duration: 180, available: false },
    ],
    mechanics: [
      { id: 'm1', name: 'John Smith', specialization: ['Tire Repair', 'Oil Change'], isAvailable: true, rating: 4.8 },
      { id: 'm2', name: 'Maria Rodriguez', specialization: ['Engine Repair', 'Brake Service'], isAvailable: false, rating: 4.9 }
    ],
    reviews: [
      { id: 'r1', userId: 'u1', userName: 'Alex K.', rating: 5, comment: 'Great service, fixed my flat tire in no time!', date: new Date('2023-11-15'), serviceUsed: 'Tire Repair' },
      { id: 'r2', userId: 'u2', userName: 'Jamie T.', rating: 4, comment: 'Parking was easy to find and secure.', date: new Date('2023-12-01') }
    ],
    emergency: {
      available: true,
      responseTime: 20
    }
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
    busyStatus: {
      level: 'Low',
      waitTime: 5,
      timestamp: new Date()
    },
    services: [
      { type: 'Tire Repair', price: 40, duration: 35, available: true },
      { type: 'Battery Service', price: 65, duration: 25, available: true },
    ],
    mechanics: [
      { id: 'm3', name: 'David Chen', specialization: ['Battery Service', 'Tire Repair'], isAvailable: true, rating: 4.5 }
    ],
    reviews: [
      { id: 'r3', userId: 'u3', userName: 'Sarah M.', rating: 4, comment: 'Battery replacement was quick and affordable.', date: new Date('2024-01-05'), serviceUsed: 'Battery Service' }
    ],
    emergency: {
      available: true,
      responseTime: 30
    }
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
    busyStatus: {
      level: 'High',
      waitTime: 40,
      timestamp: new Date()
    },
    services: [
      { type: 'Engine Repair', price: 150, duration: 200, available: true },
      { type: 'Transmission', price: 200, duration: 240, available: true },
      { type: 'General Maintenance', price: 80, duration: 90, available: true },
    ],
    mechanics: [
      { id: 'm4', name: 'Robert Johnson', specialization: ['Engine Repair', 'Transmission'], isAvailable: true, rating: 4.9 },
      { id: 'm5', name: 'Emily Wilson', specialization: ['General Maintenance'], isAvailable: true, rating: 4.7 }
    ],
    reviews: [
      { id: 'r4', userId: 'u4', userName: 'Michael P.', rating: 5, comment: 'Outstanding engine repair service, car runs like new.', date: new Date('2024-02-15'), serviceUsed: 'Engine Repair' },
      { id: 'r5', userId: 'u5', userName: 'Lisa W.', rating: 4, comment: 'Professional mechanics and fair pricing.', date: new Date('2024-03-02'), serviceUsed: 'General Maintenance' }
    ],
    emergency: {
      available: false,
      responseTime: 0
    }
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
    busyStatus: {
      level: 'Medium',
      waitTime: 20,
      timestamp: new Date()
    },
    services: [
      { type: 'Oil Change', price: 30, duration: 40, available: true },
      { type: 'Brake Service', price: 85, duration: 60, available: true },
    ],
    mechanics: [
      { id: 'm6', name: 'Thomas Brown', specialization: ['Oil Change', 'Brake Service'], isAvailable: false, rating: 4.2 }
    ],
    reviews: [
      { id: 'r6', userId: 'u6', userName: 'Kevin R.', rating: 3, comment: 'Decent brake service but had to wait longer than expected.', date: new Date('2024-01-20'), serviceUsed: 'Brake Service' }
    ],
    emergency: {
      available: true,
      responseTime: 45
    }
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
    busyStatus: {
      level: 'Low',
      waitTime: 10,
      timestamp: new Date()
    },
    services: [
      { type: 'Tire Repair', price: 50, duration: 30, available: true },
      { type: 'Battery Service', price: 70, duration: 20, available: true },
      { type: 'General Maintenance', price: 75, duration: 85, available: true },
    ],
    mechanics: [
      { id: 'm7', name: 'Jennifer Lee', specialization: ['Battery Service', 'General Maintenance'], isAvailable: true, rating: 4.6 },
      { id: 'm8', name: 'Carlos Vega', specialization: ['Tire Repair'], isAvailable: true, rating: 4.5 }
    ],
    reviews: [
      { id: 'r7', userId: 'u7', userName: 'Daniel T.', rating: 5, comment: 'Jennifer was amazing! Fixed my battery issue in no time.', date: new Date('2024-02-28'), serviceUsed: 'Battery Service' },
      { id: 'r8', userId: 'u8', userName: 'Patricia N.', rating: 4, comment: 'Good service, clean facility.', date: new Date('2024-03-10') }
    ],
    emergency: {
      available: true,
      responseTime: 15
    }
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
        
        // Also update busy status to simulate real-time changes
        const busyLevels: Array<'Low' | 'Medium' | 'High'> = ['Low', 'Medium', 'High'];
        const randomBusyLevel = busyLevels[Math.floor(Math.random() * 3)];
        const waitTimeFluctuation = Math.floor(Math.random() * 15) - 5; // -5 to +10 minutes
        
        // Update mechanic availability randomly
        const updatedMechanics = garage.mechanics.map(mechanic => ({
          ...mechanic,
          isAvailable: Math.random() > 0.3 // 70% chance of being available
        }));
        
        // Update service availability based on mechanics
        const updatedServices = garage.services.map(service => {
          const hasAvailableMechanic = updatedMechanics.some(
            mechanic => mechanic.isAvailable && mechanic.specialization.includes(service.type)
          );
          return {
            ...service,
            available: hasAvailableMechanic
          };
        });
        
        return {
          ...garage,
          availableSpots: newAvailable,
          busyStatus: {
            level: randomBusyLevel,
            waitTime: Math.max(5, garage.busyStatus.waitTime + waitTimeFluctuation),
            timestamp: new Date()
          },
          mechanics: updatedMechanics,
          services: updatedServices
        };
      });
      
      // Sort by distance and emergency availability for urgent cases
      const sortedGarages = [...garagesWithUpdatedAvailability].sort((a, b) => {
        // First sort by emergency availability
        if (a.emergency.available && !b.emergency.available) return -1;
        if (!a.emergency.available && b.emergency.available) return 1;
        
        // Then sort by response time for emergencies
        if (a.emergency.available && b.emergency.available) {
          return a.emergency.responseTime - b.emergency.responseTime;
        }
        
        // Finally sort by distance
        return a.distance - b.distance;
      });
      
      resolve(sortedGarages);
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
        
        // Update mechanic availability randomly
        const updatedMechanics = garage.mechanics.map(mechanic => ({
          ...mechanic,
          isAvailable: Math.random() > 0.3 // 70% chance of being available
        }));
        
        // Update service availability based on mechanics
        const updatedServices = garage.services.map(service => {
          const hasAvailableMechanic = updatedMechanics.some(
            mechanic => mechanic.isAvailable && mechanic.specialization.includes(service.type)
          );
          return {
            ...service,
            available: hasAvailableMechanic
          };
        });
        
        resolve({
          ...garage,
          availableSpots: newAvailable,
          mechanics: updatedMechanics,
          services: updatedServices,
          busyStatus: {
            ...garage.busyStatus,
            timestamp: new Date()
          }
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

export const scheduleService = async (serviceReservation: Omit<ServiceReservation, 'mechanicId'>): Promise<ServiceReservation> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      // Find a suitable mechanic
      const garage = mockGarages.find(g => g.id === serviceReservation.garageId);
      let mechanicId = '';
      
      if (garage) {
        const suitableMechanics = garage.mechanics.filter(
          m => m.isAvailable && m.specialization.includes(serviceReservation.serviceType)
        );
        
        if (suitableMechanics.length > 0) {
          // Sort by rating to get the best available mechanic
          const bestMechanic = suitableMechanics.sort((a, b) => b.rating - a.rating)[0];
          mechanicId = bestMechanic.id;
        }
      }
      
      resolve({
        ...serviceReservation,
        mechanicId
      });
    }, 1000);
  });
};

export const getEmergencyGarages = async (userLat: number, userLng: number): Promise<Garage[]> => {
  // In a real app, this would filter based on actual emergency service capability and real-time availability
  return new Promise((resolve) => {
    setTimeout(() => {
      const emergencyGarages = mockGarages
        .filter(garage => garage.emergency.available)
        .sort((a, b) => {
          // Sort by response time first
          if (a.emergency.responseTime !== b.emergency.responseTime) {
            return a.emergency.responseTime - b.emergency.responseTime;
          }
          // Then by distance
          return a.distance - b.distance;
        });
      
      resolve(emergencyGarages);
    }, 600);
  });
};

export const submitReview = async (garageId: string, review: Omit<Review, 'id' | 'date'>): Promise<Review> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const newReview = {
        ...review,
        id: `r${Math.floor(Math.random() * 1000)}`,
        date: new Date()
      };
      
      resolve(newReview);
    }, 800);
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
