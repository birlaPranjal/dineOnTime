export type ObjectId = string

export interface Restaurant {
  _id?: ObjectId
  name: string
  slug: string
  description: string
  cuisine: string[]
  address: string
  city: string
  pincode: string
  phone: string
  email: string
  images: string[]
  logo?: string
  rating: number
  totalReviews: number
  priceRange: "budget" | "moderate" | "premium"
  avgCost: number
  openingHours: {
    day: string
    open: string
    close: string
    isOpen: boolean
  }[]
  features: string[]
  isActive: boolean
  isVerified: boolean
  ownerId: ObjectId
  createdAt: Date
  updatedAt: Date
}

export interface MenuItem {
  _id?: ObjectId
  restaurantId: ObjectId
  name: string
  description: string
  price: number
  category: string
  image?: string
  isVeg: boolean
  isAvailable: boolean
  customizations?: {
    name: string
    options: { name: string; price: number }[]
  }[]
  createdAt: Date
  updatedAt: Date
}

export interface Table {
  _id?: ObjectId
  restaurantId: ObjectId
  tableNumber: string
  capacity: number
  type: "round" | "square" | "rectangular" | "diamond"
  location: "indoor" | "outdoor" | "rooftop" | "private"
  status: "available" | "occupied" | "reserved" | "cleaning"
  position: { x: number; y: number }
  isActive: boolean
}
