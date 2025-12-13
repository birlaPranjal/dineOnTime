"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import Link from "next/link"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { menuItems } from "@/lib/mock-data"
import { Star, MapPin, Clock, ArrowLeft, Plus, Minus, ShoppingBag, Calendar, ChevronRight, Leaf, Loader2 } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { publicRestaurantApi } from "@/lib/api"
import { toast } from "sonner"

type CartItem = {
  id: string
  name: string
  price: number
  quantity: number
  customizations: string[]
}

export default function RestaurantDetailPage() {
  const params = useParams()
  const router = useRouter()
  const [restaurant, setRestaurant] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [cart, setCart] = useState<CartItem[]>([])
  const [showBookingModal, setShowBookingModal] = useState(false)
  const [selectedDate, setSelectedDate] = useState("")
  const [selectedTime, setSelectedTime] = useState("")
  const [guestCount, setGuestCount] = useState(2)
  const [selectedTableType, setSelectedTableType] = useState("")

  useEffect(() => {
    loadRestaurant()
  }, [params.id])

  const loadRestaurant = async () => {
    try {
      setLoading(true)
      const identifier = params.id as string
      const response = await publicRestaurantApi.getRestaurantBySlug(identifier)
      setRestaurant(response.restaurant)
    } catch (error: any) {
      console.error("Failed to load restaurant:", error)
      toast.error(error.message || "Failed to load restaurant")
    } finally {
      setLoading(false)
    }
  }

  const menu = menuItems.filter((item) => item.restaurantId === params.id)

  if (loading) {
    return (
      <div className="min-h-screen bg-cream flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  if (!restaurant) {
    return (
      <div className="min-h-screen bg-cream flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-navy mb-4">Restaurant not found</h1>
          <Button asChild>
            <Link href="/restaurants">Back to Restaurants</Link>
          </Button>
        </div>
      </div>
    )
  }

  const addToCart = (item: (typeof menuItems)[0]) => {
    setCart((prev) => {
      const existing = prev.find((i) => i.id === item.id)
      if (existing) {
        return prev.map((i) => (i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i))
      }
      return [...prev, { id: item.id, name: item.name, price: item.price, quantity: 1, customizations: [] }]
    })
  }

  const removeFromCart = (itemId: string) => {
    setCart((prev) => {
      const existing = prev.find((i) => i.id === itemId)
      if (existing && existing.quantity > 1) {
        return prev.map((i) => (i.id === itemId ? { ...i, quantity: i.quantity - 1 } : i))
      }
      return prev.filter((i) => i.id !== itemId)
    })
  }

  const getCartItemQuantity = (itemId: string) => {
    return cart.find((i) => i.id === itemId)?.quantity || 0
  }

  const cartTotal = cart.reduce((acc, item) => acc + item.price * item.quantity, 0)
  const cartItemsCount = cart.reduce((acc, item) => acc + item.quantity, 0)

  const categories = [...new Set(menu.map((item) => item.category))]

  const handleBooking = () => {
    // In a real app, this would submit to an API
    router.push(
      `/booking/confirm?restaurant=${restaurant.id}&date=${selectedDate}&time=${selectedTime}&guests=${guestCount}&table=${selectedTableType}`,
    )
    setShowBookingModal(false)
  }

  return (
    <div className="min-h-screen bg-cream">
      <Header />

      <main>
        <div className="relative h-64 md:h-80">
          <img
            src={restaurant.image || "/placeholder.svg"}
            alt={restaurant.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-foreground/60 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-6 text-card">
            <div className="container mx-auto">
              <Link
                href="/restaurants"
                className="inline-flex items-center gap-2 text-card/80 hover:text-card mb-4 transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to restaurants
              </Link>
              <h1 className="text-3xl md:text-4xl font-bold mb-2">{restaurant.name}</h1>
              <div className="flex flex-wrap items-center gap-4 text-sm">
                {restaurant.rating > 0 && (
                  <span className="flex items-center gap-1">
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    {restaurant.rating.toFixed(1)} ({restaurant.totalReviews || 0} reviews)
                  </span>
                )}
                <span>{restaurant.cuisine.join(", ")}</span>
                <span>{restaurant.priceRange.toUpperCase()}</span>
                <span className="flex items-center gap-1">
                  <MapPin className="w-4 h-4" />
                  {restaurant.address}, {restaurant.city}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 py-8">
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-navy">Menu</h2>
                <Button onClick={() => setShowBookingModal(true)} className="gap-2">
                  <Calendar className="w-4 h-4" />
                  Book a Table
                </Button>
              </div>

              {categories.map((category) => (
                <div key={category} className="mb-8">
                  <h3 className="text-lg font-semibold text-navy mb-4 pb-2 border-b border-border">{category}</h3>
                  <div className="space-y-4">
                    {menu
                      .filter((item) => item.category === category)
                      .map((item) => (
                        <div
                          key={item.id}
                          className="flex gap-4 p-4 bg-card rounded-xl border border-border hover:shadow-md transition-shadow"
                        >
                          <div className="relative w-24 h-24 rounded-lg overflow-hidden shrink-0">
                            <img
                              src={item.image || "/placeholder.svg"}
                              alt={item.name}
                              className="w-full h-full object-cover"
                            />
                            {item.isVeg && (
                              <div className="absolute top-1 left-1 w-5 h-5 bg-card rounded flex items-center justify-center">
                                <Leaf className="w-3 h-3 text-green-600" />
                              </div>
                            )}
                          </div>

                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between gap-2">
                              <div>
                                <h4 className="font-semibold text-navy">
                                  {item.name}
                                  {item.isPopular && (
                                    <span className="ml-2 text-xs bg-primary/10 text-primary px-2 py-0.5 rounded">
                                      Popular
                                    </span>
                                  )}
                                </h4>
                                <p className="text-sm text-muted-foreground line-clamp-2 mt-1">{item.description}</p>
                              </div>
                            </div>

                            <div className="flex items-center justify-between mt-3">
                              <span className="font-semibold text-navy">₹{item.price}</span>

                              {getCartItemQuantity(item.id) > 0 ? (
                                <div className="flex items-center gap-3">
                                  <button
                                    onClick={() => removeFromCart(item.id)}
                                    className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary hover:bg-primary/20 transition-colors"
                                  >
                                    <Minus className="w-4 h-4" />
                                  </button>
                                  <span className="font-semibold w-6 text-center">{getCartItemQuantity(item.id)}</span>
                                  <button
                                    onClick={() => addToCart(item)}
                                    className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground hover:bg-primary/90 transition-colors"
                                  >
                                    <Plus className="w-4 h-4" />
                                  </button>
                                </div>
                              ) : (
                                <Button size="sm" variant="outline" onClick={() => addToCart(item)} className="gap-1">
                                  <Plus className="w-4 h-4" />
                                  Add
                                </Button>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                  </div>
                </div>
              ))}
            </div>

            <div className="lg:col-span-1">
              <div className="sticky top-24 space-y-6">
                <div className="bg-card rounded-xl border border-border p-6">
                  <h3 className="font-semibold text-navy mb-4 flex items-center gap-2">
                    <Clock className="w-5 h-5" />
                    Restaurant Info
                  </h3>
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Status</span>
                      <span className={`font-medium ${restaurant.isOpen ? "text-green-600" : "text-red-600"}`}>
                        {restaurant.isOpen ? "Open Now" : "Closed"}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Avg. Cost</span>
                      <span className="font-medium">₹{restaurant.avgCost || "N/A"}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Location</span>
                      <span className="font-medium">{restaurant.city}</span>
                    </div>
                  </div>

                  {restaurant.tables && restaurant.tables.length > 0 && (
                    <div className="mt-6 pt-4 border-t border-border">
                      <h4 className="font-medium text-navy mb-3">Available Tables</h4>
                      <div className="space-y-2">
                        {restaurant.tables.map((table: any, index: number) => (
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
                </div>

                {cart.length > 0 && (
                  <div className="bg-card rounded-xl border border-border p-6">
                    <h3 className="font-semibold text-navy mb-4 flex items-center gap-2">
                      <ShoppingBag className="w-5 h-5" />
                      Your Order ({cartItemsCount} items)
                    </h3>

                    <div className="space-y-3 mb-4">
                      {cart.map((item) => (
                        <div key={item.id} className="flex justify-between text-sm">
                          <span>
                            {item.name} x{item.quantity}
                          </span>
                          <span className="font-medium">₹{item.price * item.quantity}</span>
                        </div>
                      ))}
                    </div>

                    <div className="pt-4 border-t border-border">
                      <div className="flex justify-between font-semibold text-navy mb-4">
                        <span>Total</span>
                        <span>₹{cartTotal}</span>
                      </div>

                      <Button className="w-full gap-2" onClick={() => setShowBookingModal(true)}>
                        Proceed to Book
                        <ChevronRight className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>

      <Dialog open={showBookingModal} onOpenChange={setShowBookingModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Book a Table at {restaurant.name}</DialogTitle>
          </DialogHeader>

          <div className="space-y-4 mt-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Date</label>
              <Input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                min={new Date().toISOString().split("T")[0]}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Time</label>
              <Input type="time" value={selectedTime} onChange={(e) => setSelectedTime(e.target.value)} />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Number of Guests</label>
              <div className="flex items-center gap-4">
                <button
                  onClick={() => setGuestCount(Math.max(1, guestCount - 1))}
                  className="w-10 h-10 rounded-full border border-border flex items-center justify-center hover:bg-accent transition-colors"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="text-xl font-semibold w-8 text-center">{guestCount}</span>
                <button
                  onClick={() => setGuestCount(Math.min(20, guestCount + 1))}
                  className="w-10 h-10 rounded-full border border-border flex items-center justify-center hover:bg-accent transition-colors"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>

            {restaurant.tables && restaurant.tables.length > 0 && (
              <div className="space-y-2">
                <label className="text-sm font-medium">Table Type</label>
                <div className="grid grid-cols-2 gap-2">
                  {restaurant.tables.map((table: any, index: number) => (
                    <button
                      key={table.type || index}
                      onClick={() => setSelectedTableType(table.type)}
                      disabled={table.available === 0}
                      className={`p-3 rounded-lg border text-sm transition-colors ${
                        selectedTableType === table.type
                          ? "border-primary bg-primary/10 text-primary"
                          : table.available > 0
                            ? "border-border hover:border-primary/50"
                            : "border-border bg-muted text-muted-foreground cursor-not-allowed"
                      }`}
                    >
                      <div className="font-medium">{table.type}</div>
                      <div className="text-xs text-muted-foreground">{table.available} available</div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {cart.length > 0 && (
              <div className="bg-accent/50 rounded-lg p-4">
                <div className="flex items-center gap-2 text-sm">
                  <ShoppingBag className="w-4 h-4" />
                  <span>
                    Pre-order included: {cartItemsCount} items (₹{cartTotal})
                  </span>
                </div>
              </div>
            )}

            <Button
              className="w-full"
              onClick={handleBooking}
              disabled={!selectedDate || !selectedTime || (restaurant.tables?.length > 0 && !selectedTableType)}
            >
              Confirm Booking
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <Footer />
    </div>
  )
}
