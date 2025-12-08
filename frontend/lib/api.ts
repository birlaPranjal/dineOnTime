/**
 * API utility functions for making requests to the backend server
 */

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001"

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
  const headers: HeadersInit = {
    "Content-Type": "application/json",
    ...options.headers,
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

