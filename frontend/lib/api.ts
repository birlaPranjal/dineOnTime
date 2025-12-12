/**
 * API utility functions for making requests to the backend server
 */

/**
 * Get the base URL for API requests
 * Uses NEXT_PUBLIC_API_URL environment variable if set
 * Falls back to localhost for local development
 * 
 * IMPORTANT: Set NEXT_PUBLIC_API_URL in Vercel environment variables for production
 */
function getApiUrl(): string {
  // Always prioritize NEXT_PUBLIC_API_URL environment variable
  if (process.env.NEXT_PUBLIC_API_URL) {
    // Remove trailing slash if present
    return process.env.NEXT_PUBLIC_API_URL.replace(/\/$/, "")
  }

  // Fallback for local development only
  if (typeof window !== "undefined") {
    const hostname = window.location.hostname
    
    // If in production (not localhost) and NEXT_PUBLIC_API_URL is not set, show warning
    if (hostname !== "localhost" && hostname !== "127.0.0.1" && !hostname.includes("localhost")) {
      console.error(
        "❌ NEXT_PUBLIC_API_URL is not set in production! " +
        "Please set it in Vercel environment variables. " +
        "Falling back to localhost (this will not work in production)."
      )
    }
  }

  // Default to localhost for local development
  return "http://localhost:3001"
}

/**
 * Base URL for all API requests
 * This is the single source of truth for the server URL throughout the application
 */
export const API_URL = getApiUrl()

// Log API URL to help with debugging
if (typeof window !== "undefined") {
  if (process.env.NODE_ENV === "development") {
    console.log("🔗 API Base URL:", API_URL)
  } else if (!process.env.NEXT_PUBLIC_API_URL) {
    console.warn("⚠️ NEXT_PUBLIC_API_URL not set. Using:", API_URL)
    console.warn("💡 Set NEXT_PUBLIC_API_URL in Vercel environment variables for production")
  } else {
    console.log("✅ Using API URL:", API_URL)
  }
}

// Token storage key
const TOKEN_KEY = "auth_token"

/**
 * Get stored authentication token
 */
export function getAuthToken(): string | null {
  if (typeof window === "undefined") return null
  return localStorage.getItem(TOKEN_KEY)
}

/**
 * Store authentication token
 */
export function setAuthToken(token: string): void {
  if (typeof window === "undefined") return
  localStorage.setItem(TOKEN_KEY, token)
}

/**
 * Remove authentication token
 */
export function removeAuthToken(): void {
  if (typeof window === "undefined") return
  localStorage.removeItem(TOKEN_KEY)
}

/**
 * Makes a fetch request to the backend API with proper credentials
 */
export async function apiRequest<T = any>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const url = `${API_URL}${endpoint.startsWith("/") ? endpoint : `/${endpoint}`}`
  
  // Get token from storage
  const token = getAuthToken()
  
  // Build headers
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options.headers as Record<string, string> || {}),
  }
  
  // Add Authorization header if token exists
  if (token) {
    headers["Authorization"] = `Bearer ${token}`
  }
  
  const response = await fetch(url, {
    ...options,
    credentials: "include", // Keep for backward compatibility
    headers,
  })

  const data = await response.json()

  if (!response.ok) {
    // If unauthorized, clear token
    if (response.status === 401) {
      removeAuthToken()
    }
    throw new Error(data.error || "Request failed")
  }

  return data
}

/**
 * Auth API functions
 */
export const authApi = {
  login: async (email: string, password: string, role?: string) => {
    const data = await apiRequest<{
      success: boolean
      token: string
      user: {
        id: string
        email: string
        name: string
        role: string
        avatar?: string
      }
      redirectUrl?: string
    }>("/api/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password, role }),
    })
    
    // Store token
    if (data.token) {
      setAuthToken(data.token)
    }
    
    return data
  },

  register: async (userData: {
    email: string
    password: string
    name: string
    phone?: string
    role?: string
  }) => {
    const data = await apiRequest<{
      success: boolean
      token: string
      user: {
        id: string
        email: string
        name: string
        role: string
      }
    }>("/api/auth/register", {
      method: "POST",
      body: JSON.stringify(userData),
    })
    
    // Store token
    if (data.token) {
      setAuthToken(data.token)
    }
    
    return data
  },

  logout: async () => {
    try {
      await apiRequest<{ success: boolean }>("/api/auth/logout", {
        method: "POST",
      })
    } finally {
      // Always remove token from storage
      removeAuthToken()
    }
  },

  me: async () => {
    return apiRequest<{
      user: {
        id: string
        email: string
        name: string
        role: string
        avatar?: string
        phone?: string
        savedAddresses?: any[]
        favorites?: string[]
      }
    }>("/api/auth/me")
  },

  forgotPassword: async (email: string) => {
    return apiRequest<{
      success: boolean
      message: string
    }>("/api/auth/forgot-password", {
      method: "POST",
      body: JSON.stringify({ email }),
    })
  },

  verifyOTP: async (email: string, otp: string) => {
    return apiRequest<{
      success: boolean
      message: string
    }>("/api/auth/verify-otp", {
      method: "POST",
      body: JSON.stringify({ email, otp }),
    })
  },

  resetPassword: async (email: string, otp: string, newPassword: string) => {
    return apiRequest<{
      success: boolean
      message: string
    }>("/api/auth/reset-password", {
      method: "POST",
      body: JSON.stringify({ email, otp, newPassword }),
    })
  },
}

/**
 * Insights API functions
 */
export const insightsApi = {
  customer: async () => {
    return apiRequest<{
      stats: {
        totalOrders: number
        totalSpent: number
        avgOrderValue: number
        totalBookings: number
        completedBookings: number
        reviewsGiven: number
      }
      recentOrders: any[]
      upcomingBookings: any[]
    }>("/api/insights/customer")
  },

  admin: async () => {
    return apiRequest<{
      overview: {
        totalUsers: number
        totalRestaurantUsers: number
        totalRestaurants: number
        activeRestaurants: number
        pendingRestaurants: number
        totalOrders: number
        totalRevenue: number
        openComplaints: number
        urgentComplaints: number
      }
      today: {
        orders: number
        revenue: number
      }
      revenueByMonth: any[]
      topRestaurants: any[]
      userGrowth: any[]
    }>("/api/insights/admin")
  },

  restaurant: async () => {
    return apiRequest<{
      today: {
        orders: number
        revenue: number
        bookings: number
      }
      overall: {
        totalOrders: number
        totalRevenue: number
        avgOrderValue: number
        avgRating: number
        totalReviews: number
      }
      ordersByStatus: Record<string, number>
      revenueByDay: any[]
      peakHours: any[]
      topItems: any[]
    }>("/api/insights/restaurant")
  },
}

/**
 * Dashboard API functions
 */
export const dashboardApi = {
  // Customer
  getCustomerStats: async () => {
    return apiRequest<{
      stats: {
        totalOrders: number
        totalSpent: number
        avgOrderValue: number
        totalBookings: number
        completedBookings: number
        reviewsGiven: number
      }
      recentOrders: any[]
      upcomingBookings: any[]
    }>("/api/dashboard/customer/stats")
  },

  getCustomerOrders: async (page = 1, limit = 10) => {
    return apiRequest<{
      orders: any[]
      pagination: {
        page: number
        limit: number
        total: number
        pages: number
      }
    }>(`/api/dashboard/customer/orders?page=${page}&limit=${limit}`)
  },

  getCustomerBookings: async (page = 1, limit = 10) => {
    return apiRequest<{
      bookings: any[]
      pagination: {
        page: number
        limit: number
        total: number
        pages: number
      }
    }>(`/api/dashboard/customer/bookings?page=${page}&limit=${limit}`)
  },

  // Restaurant
  getRestaurantStats: async () => {
    return apiRequest<{
      today: {
        orders: number
        revenue: number
        bookings: number
      }
      overall: {
        totalOrders: number
        totalRevenue: number
        avgOrderValue: number
        avgRating: number
        totalReviews: number
      }
      pendingOrders: any[]
      upcomingBookings: any[]
    }>("/api/dashboard/restaurant/stats")
  },

  getRestaurantOrders: async (page = 1, limit = 10, status?: string) => {
    const statusParam = status ? `&status=${status}` : ""
    return apiRequest<{
      orders: any[]
      pagination: {
        page: number
        limit: number
        total: number
        pages: number
      }
    }>(`/api/dashboard/restaurant/orders?page=${page}&limit=${limit}${statusParam}`)
  },

  getRestaurantBookings: async (page = 1, limit = 10, status?: string) => {
    const statusParam = status ? `&status=${status}` : ""
    return apiRequest<{
      bookings: any[]
      pagination: {
        page: number
        limit: number
        total: number
        pages: number
      }
    }>(`/api/dashboard/restaurant/bookings?page=${page}&limit=${limit}${statusParam}`)
  },

  // Profile
  updateProfile: async (data: { name?: string; phone?: string; avatar?: string }) => {
    return apiRequest<{
      success: boolean
      user: {
        id: string
        email: string
        name: string
        role: string
        avatar?: string
        phone?: string
      }
    }>("/api/dashboard/profile", {
      method: "PUT",
      body: JSON.stringify(data),
    })
  },
}

/**
 * Partnership API functions
 */
/**
 * Restaurant API functions
 */
export const restaurantApi = {
  getProfile: async () => {
    return apiRequest<{
      restaurant: {
        _id: string
        name: string
        description: string
        cuisine: string[]
        address: string
        city: string
        state: string
        pincode: string
        phone: string
        email: string
        website: string
        logo: string
        images: string[]
        priceRange: "budget" | "moderate" | "expensive" | "luxury"
        avgCost: number
        openingHours: Array<{
          day: string
          openTime: string
          closeTime: string
          isClosed: boolean
        }>
        features: string[]
        gstNumber?: string
        fssaiLicense?: string
        bankAccountNumber?: string
        bankIfscCode?: string
        bankName?: string
        accountHolderName?: string
        approvalStatus: "pending_approval" | "approved" | "rejected"
        isActive: boolean
        isVerified: boolean
        profileCompleted: boolean
      }
    }>("/api/restaurant/profile")
  },

  updateProfile: async (profileData: {
    name?: string
    description?: string
    cuisine?: string[]
    address?: string
    city?: string
    state?: string
    pincode?: string
    phone?: string
    website?: string
    logo?: string
    images?: string[]
    priceRange?: "budget" | "moderate" | "expensive" | "luxury"
    avgCost?: number
    openingHours?: Array<{
      day: string
      openTime: string
      closeTime: string
      isClosed: boolean
    }>
    features?: string[]
    gstNumber?: string
    fssaiLicense?: string
    bankAccountNumber?: string
    bankIfscCode?: string
    bankName?: string
    accountHolderName?: string
  }) => {
    return apiRequest<{
      success: boolean
      message: string
      restaurant: any
      profileCompleted: boolean
    }>("/api/restaurant/profile", {
      method: "PUT",
      body: JSON.stringify(profileData),
    })
  },

  submitForApproval: async () => {
    return apiRequest<{
      success: boolean
      message: string
    }>("/api/restaurant/profile/submit", {
      method: "POST",
    })
  },
}

/**
 * Admin Restaurant Management API
 */
export const adminRestaurantApi = {
  getRestaurants: async (status?: string) => {
    const url = status ? `/api/restaurant/admin/restaurants?status=${status}` : "/api/restaurant/admin/restaurants"
    return apiRequest<{
      restaurants: any[]
    }>(url)
  },

  approveRestaurant: async (restaurantId: string) => {
    return apiRequest<{
      success: boolean
      message: string
    }>(`/api/restaurant/admin/approve/${restaurantId}`, {
      method: "POST",
    })
  },

  rejectRestaurant: async (restaurantId: string, reason?: string) => {
    return apiRequest<{
      success: boolean
      message: string
    }>(`/api/restaurant/admin/reject/${restaurantId}`, {
      method: "POST",
      body: JSON.stringify({ reason }),
    })
  },
}

export const partnershipApi = {
  submitRequest: async (data: {
    restaurantName: string
    ownerName: string
    email: string
    phone: string
    city: string
  }) => {
    return apiRequest<{
      success: boolean
      message: string
    }>("/api/partnership/request", {
      method: "POST",
      body: JSON.stringify(data),
    })
  },

  getRequests: async (status?: string) => {
    const statusParam = status ? `?status=${status}` : ""
    return apiRequest<{
      requests: Array<{
        _id: string
        restaurantName: string
        ownerName: string
        email: string
        phone: string
        city: string
        status: "pending" | "approved" | "rejected"
        createdAt: string
        updatedAt: string
      }>
    }>(`/api/partnership/requests${statusParam}`)
  },

  approveRequest: async (requestId: string, password: string) => {
    return apiRequest<{
      success: boolean
      message: string
      user: {
        id: string
        email: string
        name: string
        role: string
      }
      restaurantId: string
    }>(`/api/partnership/approve/${requestId}`, {
      method: "POST",
      body: JSON.stringify({ password }),
    })
  },

  rejectRequest: async (requestId: string, reason?: string) => {
    return apiRequest<{
      success: boolean
      message: string
    }>(`/api/partnership/reject/${requestId}`, {
      method: "POST",
      body: JSON.stringify({ reason }),
    })
  },
}

/**
 * Tables Management API
 */
export const tablesApi = {
  getTables: async () => {
    return apiRequest<{
      tables: Array<{
        _id: string
        restaurantId: string
        name: string
        number: string
        type: "round" | "square" | "rectangle" | "booth" | "bar"
        capacity: number
        status: "available" | "occupied" | "reserved" | "cleaning" | "maintenance"
        location?: {
          section?: string
          x?: number
          y?: number
        }
        currentBookingId?: string
        createdAt: string
        updatedAt: string
      }>
    }>("/api/tables")
  },

  getTable: async (tableId: string) => {
    return apiRequest<{
      table: any
      currentBooking: any | null
    }>(`/api/tables/${tableId}`)
  },

  createTable: async (data: {
    name: string
    number: string
    type: "round" | "square" | "rectangle" | "booth" | "bar"
    capacity: number
    location?: {
      section?: string
      x?: number
      y?: number
    }
  }) => {
    return apiRequest<{
      success: boolean
      message: string
      table: any
    }>("/api/tables", {
      method: "POST",
      body: JSON.stringify(data),
    })
  },

  updateTable: async (tableId: string, data: {
    name?: string
    number?: string
    type?: "round" | "square" | "rectangle" | "booth" | "bar"
    capacity?: number
    status?: "available" | "occupied" | "reserved" | "cleaning" | "maintenance"
    location?: {
      section?: string
      x?: number
      y?: number
    }
  }) => {
    return apiRequest<{
      success: boolean
      message: string
      table: any
    }>(`/api/tables/${tableId}`, {
      method: "PUT",
      body: JSON.stringify(data),
    })
  },

  deleteTable: async (tableId: string) => {
    return apiRequest<{
      success: boolean
      message: string
    }>(`/api/tables/${tableId}`, {
      method: "DELETE",
    })
  },

  updateTableStatus: async (tableId: string, status: "available" | "occupied" | "reserved" | "cleaning" | "maintenance") => {
    return apiRequest<{
      success: boolean
      message: string
      table: any
    }>(`/api/tables/${tableId}/status`, {
      method: "PATCH",
      body: JSON.stringify({ status }),
    })
  },
}

/**
 * Bookings Management API
 */
export const bookingsApi = {
  getBookings: async (params?: {
    page?: number
    limit?: number
    status?: string
    date?: string // YYYY-MM-DD
  }) => {
    const queryParams = new URLSearchParams()
    if (params?.page) queryParams.append("page", params.page.toString())
    if (params?.limit) queryParams.append("limit", params.limit.toString())
    if (params?.status) queryParams.append("status", params.status)
    if (params?.date) queryParams.append("date", params.date)

    const url = `/api/bookings${queryParams.toString() ? `?${queryParams.toString()}` : ""}`
    return apiRequest<{
      bookings: Array<{
        _id: string
        restaurantId: string
        customerId: string
        tableId?: string
        date: string
        time: string
        guests: number
        status: "pending" | "confirmed" | "arriving" | "seated" | "completed" | "cancelled" | "no-show"
        specialRequests?: string
        preOrder?: {
          items: Array<{
            itemId: string
            name: string
            quantity: number
            price: number
          }>
          total: number
        }
        customerInfo?: {
          name: string
          phone: string
          email?: string
        }
        customer?: {
          id: string
          name: string
          email: string
          phone: string
          avatar?: string
        }
        createdAt: string
        updatedAt: string
        confirmedAt?: string
        cancelledAt?: string
        cancellationReason?: string
        eta?: string
      }>
      pagination: {
        page: number
        limit: number
        total: number
        pages: number
      }
    }>(url)
  },

  getBooking: async (bookingId: string) => {
    return apiRequest<{
      booking: {
        _id: string
        restaurantId: string
        customerId: string
        tableId?: string
        date: string
        time: string
        guests: number
        status: "pending" | "confirmed" | "arriving" | "seated" | "completed" | "cancelled" | "no-show"
        specialRequests?: string
        preOrder?: any
        customer?: {
          id: string
          name: string
          email: string
          phone: string
          avatar?: string
        }
        table?: {
          id: string
          name: string
          number: string
          capacity: number
          type: string
        }
        createdAt: string
        updatedAt: string
        eta?: string
      }
    }>(`/api/bookings/${bookingId}`)
  },

  confirmBooking: async (bookingId: string, tableId?: string) => {
    return apiRequest<{
      success: boolean
      message: string
      booking: any
    }>(`/api/bookings/${bookingId}/confirm`, {
      method: "POST",
      body: JSON.stringify({ tableId }),
    })
  },

  cancelBooking: async (bookingId: string, reason?: string) => {
    return apiRequest<{
      success: boolean
      message: string
      booking: any
    }>(`/api/bookings/${bookingId}/cancel`, {
      method: "POST",
      body: JSON.stringify({ reason }),
    })
  },

  updateBookingStatus: async (
    bookingId: string,
    status: "arriving" | "seated" | "completed" | "no-show",
    eta?: string
  ) => {
    return apiRequest<{
      success: boolean
      message: string
      booking: any
    }>(`/api/bookings/${bookingId}/status`, {
      method: "PATCH",
      body: JSON.stringify({ status, eta }),
    })
  },

  getCustomerBookings: async (customerId: string) => {
    return apiRequest<{
      bookings: Array<{
        _id: string
        restaurantId: string
        customerId: string
        date: string
        time: string
        guests: number
        status: string
        createdAt: string
      }>
    }>(`/api/bookings/customer/${customerId}`)
  },
}

