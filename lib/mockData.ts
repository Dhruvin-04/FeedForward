import { Id } from "@/convex/_generated/dataModel"

export type UserRole = 'donor' | 'ngo' | 'volunteer'

export interface User {
  id: string
  name: string
  email: string
  role: UserRole
  phone?: string
  location?: string
  rating?: number
}

export interface FoodListing {
  _id: string
  donorId: string
  donorName: string
  businessName: string
  foodName: string
  category: string
  quantity?: number | undefined // serves X people
  cookedTime: string
  expiryTime: string
  pickupWindow: {
    openingTime: string
    closingTime: string
  }
  location: string
  notes?: string
  status: string
  _creationTime: number
}

export interface Pickup {
  _id: string
  foodListingId: string
  donorId: string
  donorName: string
  donorLocation: string
  ngoId: string
  ngoName: string
  ngoLocation: string
  volunteerId: string
  volunteerName: string
  status: string
  pickupCode: string
  assignedAt: string
  pickedAt?: string
  deliveredAt?: string
  rating?: number
}

export interface Rating {
  id: string
  fromUserId: string
  toUserId: string
  rating: number
  comment?: string
  createdAt: string
}

// // Mock Users
export const mockUsers: User[] = [
  { id: '1', name: 'Green Leaf Restaurant', email: 'contact@greenleaf.com', role: 'donor', phone: '+1234567890', location: 'Downtown', rating: 4.8 },
  { id: '2', name: 'Hope Foundation', email: 'info@hopefoundation.org', role: 'ngo', phone: '+1234567891', location: 'Midtown', rating: 4.9 },
  { id: '3', name: 'John Doe', email: 'john@example.com', role: 'volunteer', phone: '+1234567892', location: 'Uptown', rating: 4.7 },
]

// Mock Food Listings
export const mockFoodListings: FoodListing[] = [
  { 
    _id: '1',
    donorId: '1',
    donorName: 'Green Leaf Restaurant',
    businessName: 'Green Leaf Restaurant',
    foodName: 'Vegetable Biryani',
    category: 'veg',
    quantity: 50,
    cookedTime: '2024-01-15T10:00:00Z',
    expiryTime: '2024-01-15T22:00:00Z',
    pickupWindow: {
      openingTime: '2:00 PM',
      closingTime: '4:00 PM',
    },
    location: '123 Main St, Downtown',
    notes: 'Freshly prepared, packed in containers',
    status: 'available',
    _creationTime: 1705294800000, // 2024-01-15T11:00:00Z in milliseconds,
  },
  {
    _id: '2',
    donorId: '1',
    donorName: 'Green Leaf Restaurant',
    businessName: 'Green Leaf Restaurant',
    foodName: 'Chicken Curry',
    category: 'non-veg',
    quantity: 30,
    cookedTime: '2024-01-15T12:00:00Z',
    expiryTime: '2024-01-15T22:00:00Z',
    pickupWindow: {
      openingTime: '3:00 PM',
      closingTime: '5:00 PM',
    },
    location: '123 Main St, Downtown',
    status: 'reserved',
    _creationTime: 1705298400000, // 2024-01-15T13:00:00Z in milliseconds
  },
  {
    _id: '3',
    donorId: '1',
    donorName: 'Green Leaf Restaurant',
    businessName: 'Green Leaf Restaurant',
    foodName: 'Mixed Salad',
    category: 'veg',
    quantity: 25,
    cookedTime: '2024-01-14T18:00:00Z',
    expiryTime: '2024-01-15T18:00:00Z',
    pickupWindow: {
      openingTime: '10:00 AM',
      closingTime: '12:00 PM',
    },
    location: '123 Main St, Downtown',
    status: 'delivered',
    _creationTime: 1705298400000, // 2024-01-14T19:00:00Z in milliseconds
  },
]

// Mock Pickups
export const mockPickups: Pickup[] = [
  {
    _id: '1',
    foodListingId: '2',
    donorId: '1',
    donorName: 'Green Leaf Restaurant',
    donorLocation: '123 Main St, Downtown',
    ngoId: '2',
    ngoName: 'Hope Foundation',
    ngoLocation: '456 Oak Ave, Midtown',
    volunteerId: '3',
    volunteerName: 'John Doe',
    status: 'assigned',
    pickupCode: 'ABC123',
    assignedAt: '2024-01-15T14:00:00Z',
  },
  {
    _id: '2',
    foodListingId: '3',
    donorId: '1',
    donorName: 'Green Leaf Restaurant',
    donorLocation: '123 Main St, Downtown',
    ngoId: '2',
    ngoName: 'Hope Foundation',
    ngoLocation: '456 Oak Ave, Midtown',
    volunteerId: '3',
    volunteerName: 'John Doe',
    status: 'delivered',
    pickupCode: 'XYZ789',
    assignedAt: '2024-01-14T20:00:00Z',
    pickedAt: '2024-01-15T10:30:00Z',
    deliveredAt: '2024-01-15T11:15:00Z',
    rating: 5,
  },
]

// Helper functions
export const getFoodListingsByDonor = (donorId: string): FoodListing[] => {
  return mockFoodListings.filter(listing => listing.donorId === donorId)
}

export const getAvailableFoodListings = (): FoodListing[] => {
  return mockFoodListings.filter(listing => listing.status === 'available')
}

export const getPickupsByVolunteer = (volunteerId: string): Pickup[] => {
  return mockPickups.filter(pickup => pickup.volunteerId === volunteerId)
}

export const getPickupsByNGO = (ngoId: string): Pickup[] => {
  return mockPickups.filter(pickup => pickup.ngoId === ngoId)
}
