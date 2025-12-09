export type ObjectId = string

export interface Review {
  _id?: ObjectId
  customerId: ObjectId
  customerName: string
  customerAvatar?: string
  restaurantId: ObjectId
  orderId?: ObjectId
  bookingId?: ObjectId
  rating: number
  foodRating: number
  serviceRating: number
  ambienceRating: number
  comment: string
  images?: string[]
  reply?: {
    text: string
    repliedAt: Date
    repliedBy: ObjectId
  }
  isVerified: boolean
  createdAt: Date
  updatedAt: Date
}

export interface Complaint {
  _id?: ObjectId
  complaintId: string
  customerId: ObjectId
  customerName: string
  customerEmail: string
  restaurantId?: ObjectId
  restaurantName?: string
  orderId?: ObjectId
  bookingId?: ObjectId
  type: "order" | "booking" | "payment" | "service" | "food" | "other"
  priority: "low" | "medium" | "high" | "urgent"
  status: "open" | "in-progress" | "resolved" | "closed"
  description: string
  resolution?: string
  assignedTo?: ObjectId
  createdAt: Date
  updatedAt: Date
  resolvedAt?: Date
}
