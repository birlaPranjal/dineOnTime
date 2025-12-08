"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { customerBookings } from "@/lib/mock-dashboard-data"
import { CalendarDays, Clock, Users, MapPin, Edit, X, UtensilsCrossed } from "lucide-react"

const statusColors: Record<string, string> = {
  confirmed: "bg-green-100 text-green-700",
  pending: "bg-yellow-100 text-yellow-700",
  completed: "bg-gray-100 text-gray-700",
  cancelled: "bg-red-100 text-red-700",
}

export default function CustomerBookingsPage() {
  const [activeTab, setActiveTab] = useState("upcoming")

  const upcomingBookings = customerBookings.filter((b) => b.status !== "completed")
  const pastBookings = customerBookings.filter((b) => b.status === "completed")

  const displayedBookings = activeTab === "upcoming" ? upcomingBookings : pastBookings

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-navy">My Bookings</h2>
          <p className="text-muted-foreground">Manage your table reservations</p>
        </div>
        <Button>
          <CalendarDays className="h-4 w-4 mr-2" />
          Book New Table
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="upcoming">Upcoming ({upcomingBookings.length})</TabsTrigger>
          <TabsTrigger value="past">Past ({pastBookings.length})</TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="mt-6">
          <div className="space-y-4">
            {displayedBookings.length > 0 ? (
              displayedBookings.map((booking) => (
                <Card key={booking.id}>
                  <CardContent className="p-6">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div className="space-y-3">
                        <div className="flex items-center gap-3">
                          <h3 className="font-semibold text-navy text-lg">{booking.restaurant}</h3>
                          <Badge className={statusColors[booking.status]} variant="secondary">
                            {booking.status}
                          </Badge>
                          {booking.preOrder && (
                            <Badge variant="outline" className="border-primary text-primary">
                              <UtensilsCrossed className="h-3 w-3 mr-1" />
                              Pre-ordered
                            </Badge>
                          )}
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                          <div className="flex items-center gap-2 text-muted-foreground">
                            <CalendarDays className="h-4 w-4" />
                            <span>{booking.date}</span>
                          </div>
                          <div className="flex items-center gap-2 text-muted-foreground">
                            <Clock className="h-4 w-4" />
                            <span>{booking.time}</span>
                          </div>
                          <div className="flex items-center gap-2 text-muted-foreground">
                            <Users className="h-4 w-4" />
                            <span>{booking.guests} guests</span>
                          </div>
                          <div className="flex items-center gap-2 text-muted-foreground">
                            <MapPin className="h-4 w-4" />
                            <span>{booking.tableType}</span>
                          </div>
                        </div>
                      </div>
                      {activeTab === "upcoming" && (
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline">
                            <Edit className="h-4 w-4 mr-1" />
                            Modify
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="text-destructive hover:text-destructive bg-transparent"
                          >
                            <X className="h-4 w-4 mr-1" />
                            Cancel
                          </Button>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <Card>
                <CardContent className="py-12 text-center">
                  <CalendarDays className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-50" />
                  <p className="text-muted-foreground mb-4">No {activeTab} bookings found</p>
                  <Button>Book a Table</Button>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
