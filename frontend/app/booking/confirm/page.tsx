"use client"

import { Suspense } from "react"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { restaurants } from "@/lib/mock-data"
import { CheckCircle, Calendar, Clock, Users, MapPin, ArrowRight } from "lucide-react"

function BookingConfirmContent() {
  const searchParams = useSearchParams()
  const restaurantId = searchParams.get("restaurant")
  const date = searchParams.get("date")
  const time = searchParams.get("time")
  const guests = searchParams.get("guests")
  const tableType = searchParams.get("table")

  const restaurant = restaurants.find((r) => r.id === restaurantId)

  if (!restaurant) {
    return (
      <div className="min-h-screen bg-cream flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-navy mb-4">Booking not found</h1>
          <Button asChild>
            <Link href="/restaurants">Browse Restaurants</Link>
          </Button>
        </div>
      </div>
    )
  }

  const bookingId = `DOT${Date.now().toString().slice(-8)}`
  const formattedDate = date
    ? new Date(date).toLocaleDateString("en-IN", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : ""

  return (
    <div className="min-h-screen bg-cream">
      <Header />

      <main className="container mx-auto px-4 py-12">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-8">
            <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-10 h-10 text-green-600" />
            </div>
            <h1 className="text-3xl font-bold text-navy mb-2">Booking Confirmed!</h1>
            <p className="text-muted-foreground">
              Your table has been reserved. We have sent the confirmation to your email.
            </p>
          </div>

          <div className="bg-card rounded-xl border border-border overflow-hidden">
            <div className="bg-navy text-cream p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-cream/70 text-sm">Booking ID</p>
                  <p className="text-xl font-bold">{bookingId}</p>
                </div>
                <div className="text-right">
                  <p className="text-cream/70 text-sm">Status</p>
                  <p className="text-green-400 font-semibold">Confirmed</p>
                </div>
              </div>
            </div>

            <div className="p-6 space-y-6">
              <div className="flex items-start gap-4">
                <img
                  src={restaurant.image || "/placeholder.svg"}
                  alt={restaurant.name}
                  className="w-20 h-20 rounded-lg object-cover"
                />
                <div>
                  <h2 className="text-xl font-bold text-navy">{restaurant.name}</h2>
                  <p className="text-muted-foreground">{restaurant.cuisine}</p>
                  <div className="flex items-center gap-1 text-sm text-muted-foreground mt-1">
                    <MapPin className="w-4 h-4" />
                    {restaurant.address}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-cream rounded-lg p-4">
                  <div className="flex items-center gap-2 text-muted-foreground mb-1">
                    <Calendar className="w-4 h-4" />
                    <span className="text-sm">Date</span>
                  </div>
                  <p className="font-semibold text-navy">{formattedDate}</p>
                </div>
                <div className="bg-cream rounded-lg p-4">
                  <div className="flex items-center gap-2 text-muted-foreground mb-1">
                    <Clock className="w-4 h-4" />
                    <span className="text-sm">Time</span>
                  </div>
                  <p className="font-semibold text-navy">{time}</p>
                </div>
                <div className="bg-cream rounded-lg p-4">
                  <div className="flex items-center gap-2 text-muted-foreground mb-1">
                    <Users className="w-4 h-4" />
                    <span className="text-sm">Guests</span>
                  </div>
                  <p className="font-semibold text-navy">{guests} people</p>
                </div>
                <div className="bg-cream rounded-lg p-4">
                  <div className="flex items-center gap-2 text-muted-foreground mb-1">
                    <span className="text-sm">Table</span>
                  </div>
                  <p className="font-semibold text-navy">{tableType}</p>
                </div>
              </div>

              <div className="bg-primary/5 rounded-lg p-4 border border-primary/20">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center shrink-0">
                    <MapPin className="w-4 h-4 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium text-navy">ETA Tracking Enabled</p>
                    <p className="text-sm text-muted-foreground">
                      Share your location on the way so the restaurant can prepare your meal just in time!
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="border-t border-border p-6">
              <div className="flex flex-col sm:flex-row gap-4">
                <Button className="flex-1 gap-2" asChild>
                  <Link href="/restaurants">
                    Browse More Restaurants
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </Button>
                <Button variant="outline" className="flex-1 bg-transparent" asChild>
                  <Link href="/">Back to Home</Link>
                </Button>
              </div>
            </div>
          </div>

          <div className="mt-8 text-center">
            <p className="text-sm text-muted-foreground">
              Need to modify your booking?{" "}
              <Link href="/help" className="text-primary hover:underline">
                Contact Support
              </Link>
            </p>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}

export default function BookingConfirmPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-cream flex items-center justify-center">
          <div className="text-center">
            <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-muted-foreground">Loading booking details...</p>
          </div>
        </div>
      }
    >
      <BookingConfirmContent />
    </Suspense>
  )
}
