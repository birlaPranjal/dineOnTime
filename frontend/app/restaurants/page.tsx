"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { cuisineTypes, sortOptions } from "@/lib/mock-data"
import { Search, MapPin, Star, Clock, Filter, ChevronDown, Loader2 } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { publicRestaurantApi } from "@/lib/api"
import { toast } from "sonner"

export default function RestaurantsPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCuisine, setSelectedCuisine] = useState("All")
  const [sortBy, setSortBy] = useState("relevance")
  const [restaurants, setRestaurants] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadRestaurants()
  }, [])

  useEffect(() => {
    // Debounce search
    const timer = setTimeout(() => {
      loadRestaurants()
    }, 300)
    return () => clearTimeout(timer)
  }, [searchQuery, selectedCuisine])

  const loadRestaurants = async () => {
    try {
      setLoading(true)
      const params: any = {}
      if (searchQuery) params.search = searchQuery
      if (selectedCuisine !== "All") params.cuisine = selectedCuisine
      
      const response = await publicRestaurantApi.getRestaurants(params)
      setRestaurants(response.restaurants || [])
    } catch (error: any) {
      console.error("Failed to load restaurants:", error)
      toast.error(error.message || "Failed to load restaurants")
    } finally {
      setLoading(false)
    }
  }

  const filteredRestaurants = restaurants

  return (
    <div className="min-h-screen bg-cream">
      <Header />

      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-navy mb-2">Discover Restaurants</h1>
          <p className="text-muted-foreground">Find your perfect dining spot and book a table instantly</p>
        </div>

        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input
              placeholder="Search restaurants or cuisines..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-12 h-12 bg-card"
            />
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="h-12 gap-2 bg-transparent">
                <Filter className="w-4 h-4" />
                {selectedCuisine}
                <ChevronDown className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              {cuisineTypes.map((cuisine) => (
                <DropdownMenuItem
                  key={cuisine}
                  onClick={() => setSelectedCuisine(cuisine)}
                  className={selectedCuisine === cuisine ? "bg-accent" : ""}
                >
                  {cuisine}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="h-12 gap-2 bg-transparent">
                Sort by
                <ChevronDown className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              {sortOptions.map((option) => (
                <DropdownMenuItem
                  key={option.value}
                  onClick={() => setSortBy(option.value)}
                  className={sortBy === option.value ? "bg-accent" : ""}
                >
                  {option.label}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <div className="flex gap-3 overflow-x-auto pb-4 mb-8 scrollbar-hide">
          {cuisineTypes.map((cuisine) => (
            <button
              key={cuisine}
              onClick={() => setSelectedCuisine(cuisine)}
              className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                selectedCuisine === cuisine
                  ? "bg-primary text-primary-foreground"
                  : "bg-card text-foreground hover:bg-accent"
              }`}
            >
              {cuisine}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-16">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredRestaurants.map((restaurant) => (
              <Link
                key={restaurant.id}
                href={`/restaurants/${restaurant.slug || restaurant.id}`}
              className="group bg-card rounded-xl overflow-hidden border border-border hover:shadow-lg transition-all duration-300"
            >
              <div className="relative h-48 overflow-hidden">
                <img
                  src={restaurant.image || "/placeholder.svg"}
                  alt={restaurant.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                {!restaurant.isOpen && (
                  <div className="absolute inset-0 bg-foreground/60 flex items-center justify-center">
                    <span className="text-card font-semibold">Currently Closed</span>
                  </div>
                )}
                {restaurant.tags && restaurant.tags.length > 0 && (
                  <div className="absolute top-3 left-3 flex gap-2">
                    {restaurant.tags.slice(0, 2).map((tag) => (
                      <span
                        key={tag}
                        className="px-2 py-1 text-xs font-medium bg-primary text-primary-foreground rounded"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              <div className="p-5">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h3 className="font-semibold text-lg text-navy group-hover:text-primary transition-colors">
                      {restaurant.name}
                    </h3>
                    <p className="text-sm text-muted-foreground">{restaurant.cuisine?.join(", ") || "N/A"}</p>
                  </div>
                  {restaurant.rating && restaurant.rating > 0 && (
                    <div className="flex items-center gap-1 bg-green-50 px-2 py-1 rounded">
                      <Star className="w-4 h-4 text-green-600 fill-green-600" />
                      <span className="text-sm font-medium text-green-600">{restaurant.rating.toFixed(1)}</span>
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
                  <span className="flex items-center gap-1">
                    <MapPin className="w-4 h-4" />
                    {restaurant.city}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    {restaurant.isOpen ? "Open Now" : "Closed"}
                  </span>
                  <span>{restaurant.priceRange?.toUpperCase() || "N/A"}</span>
                </div>

                <div className="flex items-center justify-between">
                  <div className="text-sm">
                    <span className="text-muted-foreground">Avg. Cost: </span>
                    <span className="font-medium">₹{restaurant.avgCost || "N/A"}</span>
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    className="group-hover:bg-primary group-hover:text-primary-foreground group-hover:border-primary bg-transparent"
                  >
                    Book Now
                  </Button>
                </div>
              </div>
            </Link>
          ))}
          </div>
        )}

        {filteredRestaurants.length === 0 && (
          <div className="text-center py-16">
            <p className="text-xl text-muted-foreground mb-4">No restaurants found</p>
            <Button
              onClick={() => {
                setSearchQuery("")
                setSelectedCuisine("All")
              }}
            >
              Clear Filters
            </Button>
          </div>
        )}
      </main>

      <Footer />
    </div>
  )
}
