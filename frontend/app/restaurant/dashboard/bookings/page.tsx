"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { restaurantBookings } from "@/lib/mock-dashboard-data"
import { Search, Phone, Users, Clock, MapPin, CheckCircle2, XCircle, ShoppingBag, Calendar } from "lucide-react"

const statusColors: Record<string, string> = {
  arriving: "bg-primary/10 text-primary border-primary/20",
  confirmed: "bg-green-100 text-green-700 border-green-200",
  completed: "bg-gray-100 text-gray-700 border-gray-200",
  cancelled: "bg-red-100 text-red-700 border-red-200",
  pending: "bg-yellow-100 text-yellow-700 border-yellow-200",
}

export default function RestaurantBookingsPage() {
  const [activeTab, setActiveTab] = useState("today")
  const [searchQuery, setSearchQuery] = useState("")
  const [bookings, setBookings] = useState([
    ...restaurantBookings,
    {
      id: "BKG-104",
      customer: "Deepika Menon",
      phone: "+91 65432 10987",
      date: "Tomorrow",
      time: "12:30 PM",
      guests: 3,
      tableType: "Square Table",
      status: "confirmed",
      eta: "-",
      preOrder: false,
    },
    {
      id: "BKG-105",
      customer: "Karan Malhotra",
      phone: "+91 54321 09876",
      date: "Tomorrow",
      time: "7:00 PM",
      guests: 5,
      tableType: "Rectangle Table",
      status: "pending",
      eta: "-",
      preOrder: true,
    },
  ])

  const todayBookings = bookings.filter((b) => b.date === "Today")
  const upcomingBookings = bookings.filter((b) => b.date !== "Today")

  const filteredBookings =
    activeTab === "today"
      ? todayBookings.filter(
          (b) =>
            b.customer.toLowerCase().includes(searchQuery.toLowerCase()) ||
            b.id.toLowerCase().includes(searchQuery.toLowerCase()),
        )
      : upcomingBookings.filter(
          (b) =>
            b.customer.toLowerCase().includes(searchQuery.toLowerCase()) ||
            b.id.toLowerCase().includes(searchQuery.toLowerCase()),
        )

  const handleStatusChange = (bookingId: string, newStatus: string) => {
    setBookings(bookings.map((b) => (b.id === bookingId ? { ...b, status: newStatus } : b)))
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-navy">Booking Management</h2>
          <p className="text-muted-foreground">Manage table reservations and track customer arrivals</p>
        </div>
        <div className="flex gap-2">
          <Badge variant="outline" className="bg-primary/10 border-primary/20 text-primary">
            {todayBookings.filter((b) => b.status === "arriving").length} Arriving
          </Badge>
          <Badge variant="outline" className="bg-green-50 border-green-200 text-green-700">
            {todayBookings.filter((b) => b.status === "confirmed").length} Confirmed
          </Badge>
        </div>
      </div>

      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search by customer name or booking ID..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-9"
        />
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="today">Today ({todayBookings.length})</TabsTrigger>
          <TabsTrigger value="upcoming">Upcoming ({upcomingBookings.length})</TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="mt-6">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filteredBookings.map((booking) => (
              <Card key={booking.id} className="relative overflow-hidden">
                {booking.status === "arriving" && (
                  <div className="absolute top-0 left-0 right-0 h-1 bg-primary animate-pulse"></div>
                )}
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-base">{booking.customer}</CardTitle>
                    <Badge className={statusColors[booking.status]} variant="outline">
                      {booking.status === "arriving" ? `ETA: ${booking.eta}` : booking.status}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <span>{booking.id}</span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <Phone className="h-3 w-3" />
                      {booking.phone}
                    </span>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span>{booking.date}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <span>{booking.time}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4 text-muted-foreground" />
                      <span>{booking.guests} guests</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                      <span>{booking.tableType}</span>
                    </div>
                  </div>

                  {booking.preOrder && (
                    <div className="flex items-center gap-2 p-2 rounded-lg bg-primary/5 border border-primary/20">
                      <ShoppingBag className="h-4 w-4 text-primary" />
                      <span className="text-sm font-medium text-primary">Pre-order placed</span>
                    </div>
                  )}

                  <div className="flex gap-2 pt-2 border-t">
                    {booking.status === "pending" && (
                      <>
                        <Button
                          size="sm"
                          className="flex-1"
                          onClick={() => handleStatusChange(booking.id, "confirmed")}
                        >
                          <CheckCircle2 className="h-4 w-4 mr-1" />
                          Confirm
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="text-destructive hover:text-destructive bg-transparent"
                          onClick={() => handleStatusChange(booking.id, "cancelled")}
                        >
                          <XCircle className="h-4 w-4" />
                        </Button>
                      </>
                    )}
                    {booking.status === "confirmed" && (
                      <Button
                        size="sm"
                        variant="outline"
                        className="flex-1 bg-transparent"
                        onClick={() => handleStatusChange(booking.id, "arriving")}
                      >
                        Customer On Way
                      </Button>
                    )}
                    {booking.status === "arriving" && (
                      <Button size="sm" className="flex-1" onClick={() => handleStatusChange(booking.id, "completed")}>
                        <CheckCircle2 className="h-4 w-4 mr-1" />
                        Customer Arrived
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {filteredBookings.length === 0 && (
            <div className="text-center py-12 text-muted-foreground">
              <Calendar className="h-12 w-12 mx-auto mb-3 opacity-50" />
              <p>No bookings found</p>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
