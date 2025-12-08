"use client"

import { useState } from "react"
import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Heart, Star, MapPin, Search } from "lucide-react"

const favoriteRestaurants = [
  {
    id: "1",
    name: "The Spice Garden",
    cuisine: "North Indian, Mughlai",
    rating: 4.5,
    reviews: 1250,
    location: "Koramangala, Bangalore",
    distance: "2.5 km",
    priceRange: "₹500 for two",
    image: "/indian-restaurant-interior.png",
    isOpen: true,
    addedOn: "Dec 15, 2024",
  },
  {
    id: "2",
    name: "Sushi Master",
    cuisine: "Japanese, Sushi",
    rating: 4.8,
    reviews: 890,
    location: "Indiranagar, Bangalore",
    distance: "4.2 km",
    priceRange: "₹1200 for two",
    image: "/japanese-sushi-restaurant.png",
    isOpen: true,
    addedOn: "Dec 10, 2024",
  },
  {
    id: "3",
    name: "Pizza Paradise",
    cuisine: "Italian, Pizza",
    rating: 4.3,
    reviews: 2100,
    location: "HSR Layout, Bangalore",
    distance: "3.8 km",
    priceRange: "₹600 for two",
    image: "/italian-pizza-restaurant.jpg",
    isOpen: false,
    addedOn: "Nov 28, 2024",
  },
  {
    id: "4",
    name: "Dragon Wok",
    cuisine: "Chinese, Thai",
    rating: 4.4,
    reviews: 756,
    location: "Whitefield, Bangalore",
    distance: "8.5 km",
    priceRange: "₹700 for two",
    image: "/bustling-chinese-restaurant.png",
    isOpen: true,
    addedOn: "Nov 20, 2024",
  },
]

export default function CustomerFavoritesPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [favorites, setFavorites] = useState(favoriteRestaurants)

  const filteredFavorites = favorites.filter(
    (restaurant) =>
      restaurant.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      restaurant.cuisine.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const removeFavorite = (id: string) => {
    setFavorites(favorites.filter((r) => r.id !== id))
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-navy">My Favorites</h2>
          <p className="text-muted-foreground">Your saved restaurants for quick access</p>
        </div>
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search favorites..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {filteredFavorites.length > 0 ? (
        <div className="grid gap-4 md:grid-cols-2">
          {filteredFavorites.map((restaurant) => (
            <Card key={restaurant.id} className="overflow-hidden">
              <div className="relative">
                <img
                  src={restaurant.image || "/placeholder.svg"}
                  alt={restaurant.name}
                  className="w-full h-40 object-cover"
                />
                <button
                  onClick={() => removeFavorite(restaurant.id)}
                  className="absolute top-3 right-3 p-2 bg-white/90 rounded-full hover:bg-white transition-colors"
                >
                  <Heart className="h-5 w-5 fill-primary text-primary" />
                </button>
                <Badge className={`absolute bottom-3 left-3 ${restaurant.isOpen ? "bg-green-500" : "bg-gray-500"}`}>
                  {restaurant.isOpen ? "Open Now" : "Closed"}
                </Badge>
              </div>
              <CardContent className="p-4 space-y-3">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-semibold text-navy text-lg">{restaurant.name}</h3>
                    <p className="text-sm text-muted-foreground">{restaurant.cuisine}</p>
                  </div>
                  <div className="flex items-center gap-1 bg-green-100 text-green-700 px-2 py-1 rounded">
                    <Star className="h-4 w-4 fill-current" />
                    <span className="font-medium text-sm">{restaurant.rating}</span>
                  </div>
                </div>
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <MapPin className="h-4 w-4" />
                    {restaurant.distance}
                  </span>
                  <span>{restaurant.priceRange}</span>
                </div>
                <div className="flex items-center gap-2 pt-2">
                  <Button asChild className="flex-1">
                    <Link href={`/restaurants/${restaurant.id}`}>View Menu</Link>
                  </Button>
                  <Button variant="outline" className="flex-1 bg-transparent">
                    Book Table
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="py-12 text-center">
            <Heart className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-50" />
            <p className="text-muted-foreground mb-4">
              {searchQuery ? "No favorites match your search" : "No favorite restaurants yet"}
            </p>
            <Button asChild>
              <Link href="/restaurants">Explore Restaurants</Link>
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
