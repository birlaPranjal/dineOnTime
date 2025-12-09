export type ObjectId = string

export interface Order {
  _id?: ObjectId
  orderId: string
  customerId: ObjectId
  customerName: string
  customerPhone: string
  restaurantId: ObjectId
  restaurantName: string
  items: OrderItem[]
  subtotal: number
  tax: number
  deliveryFee: number
  discount: number
  total: number
  status: "pending" | "confirmed" | "preparing" | "ready" | "served" | "completed" | "cancelled"
  orderType: "dine-in" | "takeaway" | "delivery"
  tableId?: ObjectId
  tableNumber?: string
  paymentMethod: "upi" | "card" | "cash" | "wallet"
  paymentStatus: "pending" | "completed" | "failed" | "refunded"
  specialInstructions?: string
  eta?: string
  createdAt: Date
  updatedAt: Date
}

export interface OrderItem {
  menuItemId: ObjectId
  name: string
  price: number
  quantity: number
  customizations?: { name: string; option: string; price: number }[]
  totalPrice: number
}

export interface Booking {
  _id?: ObjectId
  bookingId: string
  customerId: ObjectId
  customerName: string
  customerPhone: string
  customerEmail: string
  restaurantId: ObjectId
  restaurantName: string
  tableId?: ObjectId
  tableType: string
  date: Date
  time: string
  guests: number
  status: "pending" | "confirmed" | "arriving" | "seated" | "completed" | "cancelled" | "no-show"
  preOrderId?: ObjectId
  hasPreOrder: boolean
  specialRequests?: string
  eta?: string
  arrivedAt?: Date
  createdAt: Date
  updatedAt: Date
}
