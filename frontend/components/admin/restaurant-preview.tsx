"use client"

import { useState, useEffect } from "react"
import { Star, MapPin, Clock, Loader2 } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { publicRestaurantApi } from "@/lib/api"
import { menuItems } from "@/lib/mock-data"
import { toast } from "sonner"

interface RestaurantPreviewProps {
  restaurantId?: string
  slug?: string
  restaurantData?: any // Optional: If provided, use this data directly instead of fetching
  onClose?: () => void
}

export function RestaurantPreview({ restaurantId, slug, restaurantData, onClose }: RestaurantPreviewProps) {
  const [restaurant, setRestaurant] = useState<any>(restaurantData || null)
  const [loading, setLoading] = useState(!restaurantData)

  useEffect(() => {
    if (restaurantData) {
      setRestaurant(restaurantData)
      setLoading(false)
    } else if (restaurantId || slug) {
      loadRestaurant()
    }
  }, [restaurantId, slug, restaurantData])

  const loadRestaurant = async () => {
    try {
      setLoading(true)
      // Use slug if available, otherwise use ID
      const identifier = slug || restaurantId
      if (!identifier) return
      
      const response = await publicRestaurantApi.getRestaurantBySlug(identifier)
      setRestaurant(response.restaurant)
    } catch (error: any) {
      console.error("Failed to load restaurant from public API:", error)
      // If public API fails (e.g., restaurant not approved), try to use fallback data
      if (restaurantData) {
        setRestaurant(restaurantData)
      } else {
        toast.error("Restaurant preview not available. Restaurant may not be approved yet.")
      }
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  if (!restaurant) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <p className="text-muted-foreground">Restaurant not found</p>
        </div>
      </div>
    )
  }

  // Normalize restaurant data to match public API format
  const normalizedRestaurant = {
    ...restaurant,
    rating: restaurant.rating || 0,
    totalReviews: restaurant.totalReviews || 0,
    isOpen: restaurant.isOpen !== undefined ? restaurant.isOpen : true, // Default to open if not specified
    cuisine: restaurant.cuisine || [],
    images: restaurant.images || [],
    features: restaurant.features || [],
    openingHours: restaurant.openingHours || [],
    tables: restaurant.tables || [],
  }

  const menu = menuItems.filter((item) => item.restaurantId === normalizedRestaurant._id || item.restaurantId === normalizedRestaurant.id)
  const categories = [...new Set(menu.map((item) => item.category))]
  const mainImage = normalizedRestaurant.images && normalizedRestaurant.images.length > 0 
    ? normalizedRestaurant.images[0] 
    : normalizedRestaurant.logo || "/placeholder.svg"

  return (
    <div className="space-y-6">
      {/* Hero Section */}
      <div className="relative h-48 md:h-64 rounded-lg overflow-hidden">
        <img
          src={mainImage}
          alt={restaurant.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-foreground/80 via-foreground/40 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-6 text-card">
          <h1 className="text-2xl md:text-3xl font-bold mb-2">{normalizedRestaurant.name}</h1>
          <div className="flex flex-wrap items-center gap-3 text-sm">
            {normalizedRestaurant.rating > 0 && (
              <span className="flex items-center gap-1 bg-card/20 backdrop-blur-sm px-2 py-1 rounded">
                <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                {normalizedRestaurant.rating.toFixed(1)} ({normalizedRestaurant.totalReviews || 0} reviews)
              </span>
            )}
            <span className="bg-card/20 backdrop-blur-sm px-2 py-1 rounded">{normalizedRestaurant.cuisine?.join(", ") || "N/A"}</span>
            <span className="bg-card/20 backdrop-blur-sm px-2 py-1 rounded uppercase">{normalizedRestaurant.priceRange || "N/A"}</span>
            <span className="flex items-center gap-1 bg-card/20 backdrop-blur-sm px-2 py-1 rounded">
              <MapPin className="w-4 h-4" />
              {normalizedRestaurant.address}, {normalizedRestaurant.city}
            </span>
          </div>
        </div>
      </div>

      {/* Restaurant Details Grid */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Description */}
          {normalizedRestaurant.description && (
            <div>
              <h2 className="text-xl font-bold text-navy mb-3">About</h2>
              <p className="text-muted-foreground">{normalizedRestaurant.description}</p>
            </div>
          )}

          {/* Menu Section */}
          {menu.length > 0 && (
            <div>
              <h2 className="text-xl font-bold text-navy mb-4">Menu</h2>
              {categories.map((category) => (
                <div key={category} className="mb-6">
                  <h3 className="text-lg font-semibold text-navy mb-3 pb-2 border-b border-border">{category}</h3>
                  <div className="space-y-3">
                    {menu
                      .filter((item) => item.category === category)
                      .slice(0, 5) // Limit to 5 items per category in preview
                      .map((item) => (
                        <div
                          key={item.id}
                          className="flex gap-4 p-3 bg-card rounded-lg border border-border"
                        >
                          <div className="relative w-20 h-20 rounded-lg overflow-hidden shrink-0">
                            <img
                              src={item.image || "/placeholder.svg"}
                              alt={item.name}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between gap-2">
                              <div>
                                <h4 className="font-semibold text-navy">{item.name}</h4>
                                <p className="text-sm text-muted-foreground line-clamp-2 mt-1">{item.description}</p>
                              </div>
                              <span className="font-semibold text-navy shrink-0">₹{item.price}</span>
                            </div>
                          </div>
                        </div>
                      ))}
                  </div>
                  {menu.filter((item) => item.category === category).length > 5 && (
                    <p className="text-sm text-muted-foreground mt-2">
                      +{menu.filter((item) => item.category === category).length - 5} more items
                    </p>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Additional Images */}
          {normalizedRestaurant.images && normalizedRestaurant.images.length > 1 && (
            <div>
              <h2 className="text-xl font-bold text-navy mb-4">Gallery</h2>
              <div className="grid grid-cols-3 gap-2">
                {normalizedRestaurant.images.slice(1, 7).map((image: string, index: number) => (
                  <div key={index} className="aspect-square rounded-lg overflow-hidden">
                    <img
                      src={image}
                      alt={`${normalizedRestaurant.name} image ${index + 2}`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-1">
          <div className="sticky top-6 space-y-4">
            {/* Restaurant Info */}
            <div className="bg-card rounded-xl border border-border p-5">
              <h3 className="font-semibold text-navy mb-4 flex items-center gap-2">
                <Clock className="w-5 h-5" />
                Restaurant Info
              </h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Status</span>
                  <span className={`font-medium ${normalizedRestaurant.isOpen ? "text-green-600" : "text-red-600"}`}>
                    {normalizedRestaurant.isOpen ? "Open Now" : "Closed"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Avg. Cost</span>
                  <span className="font-medium">₹{normalizedRestaurant.avgCost || "N/A"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Location</span>
                  <span className="font-medium">{normalizedRestaurant.city}</span>
                </div>
                {normalizedRestaurant.phone && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Phone</span>
                    <span className="font-medium">{normalizedRestaurant.phone}</span>
                  </div>
                )}
              </div>

              {/* Opening Hours */}
              {normalizedRestaurant.openingHours && normalizedRestaurant.openingHours.length > 0 && (
                <div className="mt-5 pt-4 border-t border-border">
                  <h4 className="font-medium text-navy mb-3">Opening Hours</h4>
                  <div className="space-y-2 text-sm">
                    {normalizedRestaurant.openingHours.map((oh: any) => (
                      <div key={oh.day} className="flex justify-between">
                        <span className="text-muted-foreground">{oh.day}</span>
                        <span className={`font-medium ${oh.isClosed ? "text-red-600" : ""}`}>
                          {oh.isClosed ? "Closed" : `${oh.openTime} - ${oh.closeTime}`}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Tables */}
              {normalizedRestaurant.tables && normalizedRestaurant.tables.length > 0 && (
                <div className="mt-5 pt-4 border-t border-border">
                  <h4 className="font-medium text-navy mb-3">Available Tables</h4>
                  <div className="space-y-2">
                    {normalizedRestaurant.tables.map((table: any, index: number) => (
                      <div key={table.type || index} className="flex justify-between text-sm">
                        <span className="text-muted-foreground">{table.type}</span>
                        <span className={`font-medium ${table.available > 0 ? "text-green-600" : "text-red-600"}`}>
                          {table.available} available
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Features */}
              {normalizedRestaurant.features && normalizedRestaurant.features.length > 0 && (
                <div className="mt-5 pt-4 border-t border-border">
                  <h4 className="font-medium text-navy mb-3">Features</h4>
                  <div className="flex flex-wrap gap-2">
                    {normalizedRestaurant.features.slice(0, 6).map((feature: string) => (
                      <Badge key={feature} variant="outline" className="text-xs">
                        {feature}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

