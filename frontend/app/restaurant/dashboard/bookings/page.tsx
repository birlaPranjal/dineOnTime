"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Search, Phone, Users, Clock, MapPin, CheckCircle2, XCircle, ShoppingBag, Calendar, Loader2, User } from "lucide-react"
import { toast } from "sonner"
import { bookingsApi } from "@/lib/api"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"

const statusColors: Record<string, string> = {
  arriving: "bg-primary/10 text-primary border-primary/20",
  confirmed: "bg-green-100 text-green-700 border-green-200",
  completed: "bg-gray-100 text-gray-700 border-gray-200",
  cancelled: "bg-red-100 text-red-700 border-red-200",
  pending: "bg-yellow-100 text-yellow-700 border-yellow-200",
  seated: "bg-blue-100 text-blue-700 border-blue-200",
  "no-show": "bg-orange-100 text-orange-700 border-orange-200",
}

const statusLabels: Record<string, string> = {
  arriving: "Arriving",
  confirmed: "Confirmed",
  completed: "Completed",
  cancelled: "Cancelled",
  pending: "Pending",
  seated: "Seated",
  "no-show": "No Show",
}

interface Booking {
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

export default function RestaurantBookingsPage() {
  const [activeTab, setActiveTab] = useState("today")
  const [searchQuery, setSearchQuery] = useState("")
  const [bookings, setBookings] = useState<Booking[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null)
  const [isDetailsOpen, setIsDetailsOpen] = useState(false)
  const [customerBookings, setCustomerBookings] = useState<Booking[]>([])

  useEffect(() => {
    loadBookings()
  }, [activeTab])

  useEffect(() => {
    if (selectedBooking?.customer?.id) {
      loadCustomerBookings(selectedBooking.customer.id)
    }
  }, [selectedBooking])

  const loadBookings = async () => {
    try {
      setLoading(true)
      const today = new Date().toISOString().split("T")[0]
      const params: any = {
        page: 1,
        limit: 50,
      }

      if (activeTab === "today") {
        params.date = today
      }

      const response = await bookingsApi.getBookings(params)
      setBookings(response.bookings)
    } catch (error: any) {
      toast.error(error.message || "Failed to load bookings")
    } finally {
      setLoading(false)
    }
  }

  const loadCustomerBookings = async (customerId: string) => {
    try {
      const response = await bookingsApi.getCustomerBookings(customerId)
      // Map the response to match Booking interface
      setCustomerBookings(response.bookings.map((b: any) => ({
        ...b,
        status: b.status as Booking["status"],
        customer: undefined, // Will be populated if needed
      })))
    } catch (error) {
      setCustomerBookings([])
    }
  }

  const handleConfirm = async (bookingId: string) => {
    try {
      await bookingsApi.confirmBooking(bookingId)
      toast.success("Booking confirmed successfully")
      await loadBookings()
    } catch (error: any) {
      toast.error(error.message || "Failed to confirm booking")
    }
  }

  const handleCancel = async (bookingId: string) => {
    if (!confirm("Are you sure you want to cancel this booking?")) return

    try {
      await bookingsApi.cancelBooking(bookingId, "Cancelled by restaurant")
      toast.success("Booking cancelled successfully")
      await loadBookings()
    } catch (error: any) {
      toast.error(error.message || "Failed to cancel booking")
    }
  }

  const handleStatusUpdate = async (bookingId: string, status: "arriving" | "seated" | "completed" | "no-show", eta?: string) => {
    try {
      await bookingsApi.updateBookingStatus(bookingId, status, eta)
      toast.success("Booking status updated successfully")
      await loadBookings()
      if (selectedBooking?._id === bookingId) {
        setIsDetailsOpen(false)
        setSelectedBooking(null)
      }
    } catch (error: any) {
      toast.error(error.message || "Failed to update booking status")
    }
  }

  const openBookingDetails = (booking: Booking) => {
    setSelectedBooking(booking)
    setIsDetailsOpen(true)
  }

  const today = new Date().toISOString().split("T")[0]
  const todayBookings = bookings.filter((b) => {
    const bookingDate = new Date(b.date).toISOString().split("T")[0]
    return bookingDate === today
  })
  const upcomingBookings = bookings.filter((b) => {
    const bookingDate = new Date(b.date).toISOString().split("T")[0]
    return bookingDate !== today
  })

  const filteredBookings =
    activeTab === "today"
      ? todayBookings.filter(
          (b) =>
            b.customer?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            b._id.toLowerCase().includes(searchQuery.toLowerCase()) ||
            b.customer?.phone?.includes(searchQuery)
        )
      : upcomingBookings.filter(
          (b) =>
            b.customer?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            b._id.toLowerCase().includes(searchQuery.toLowerCase()) ||
            b.customer?.phone?.includes(searchQuery)
        )

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
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
          placeholder="Search by customer name, booking ID, or phone..."
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
              <Card
                key={booking._id}
                className="relative overflow-hidden cursor-pointer hover:shadow-md transition-shadow"
                onClick={() => openBookingDetails(booking)}
              >
                {booking.status === "arriving" && (
                  <div className="absolute top-0 left-0 right-0 h-1 bg-primary animate-pulse"></div>
                )}
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-base">
                      {booking.customer?.name || booking.customerInfo?.name || "Customer"}
                    </CardTitle>
                    <Badge className={statusColors[booking.status]} variant="outline">
                      {booking.status === "arriving" && booking.eta ? `ETA: ${booking.eta}` : statusLabels[booking.status]}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <span>{booking._id.slice(-8)}</span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <Phone className="h-3 w-3" />
                      {booking.customer?.phone || booking.customerInfo?.phone || "N/A"}
                    </span>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span>{new Date(booking.date).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <span>{booking.time}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4 text-muted-foreground" />
                      <span>{booking.guests} guests</span>
                    </div>
                    {booking.table && (
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-muted-foreground" />
                        <span>{booking.table.name}</span>
                      </div>
                    )}
                  </div>

                  {booking.preOrder && (
                    <div className="flex items-center gap-2 p-2 rounded-lg bg-primary/5 border border-primary/20">
                      <ShoppingBag className="h-4 w-4 text-primary" />
                      <span className="text-sm font-medium text-primary">Pre-order placed</span>
                    </div>
                  )}

                  {booking.specialRequests && (
                    <div className="p-2 rounded-lg bg-muted text-sm">
                      <p className="text-xs text-muted-foreground mb-1">Special Requests:</p>
                      <p className="text-sm">{booking.specialRequests}</p>
                    </div>
                  )}

                  <div className="flex gap-2 pt-2 border-t" onClick={(e) => e.stopPropagation()}>
                    {booking.status === "pending" && (
                      <>
                        <Button
                          size="sm"
                          className="flex-1"
                          onClick={() => handleConfirm(booking._id)}
                        >
                          <CheckCircle2 className="h-4 w-4 mr-1" />
                          Confirm
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="text-destructive hover:text-destructive bg-transparent"
                          onClick={() => handleCancel(booking._id)}
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
                        onClick={() => handleStatusUpdate(booking._id, "arriving")}
                      >
                        Customer On Way
                      </Button>
                    )}
                    {booking.status === "arriving" && (
                      <Button
                        size="sm"
                        className="flex-1"
                        onClick={() => handleStatusUpdate(booking._id, "seated")}
                      >
                        <CheckCircle2 className="h-4 w-4 mr-1" />
                        Customer Arrived
                      </Button>
                    )}
                    {booking.status === "seated" && (
                      <Button
                        size="sm"
                        className="flex-1"
                        onClick={() => handleStatusUpdate(booking._id, "completed")}
                      >
                        <CheckCircle2 className="h-4 w-4 mr-1" />
                        Mark Complete
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

      {/* Booking Details Dialog */}
      <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Booking Details</DialogTitle>
            <DialogDescription>View complete booking information and customer history</DialogDescription>
          </DialogHeader>
          {selectedBooking && (
            <div className="space-y-6">
              {/* Customer Info */}
              <div className="space-y-4">
                <h3 className="font-semibold text-lg flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Customer Information
                </h3>
                <div className="grid grid-cols-2 gap-4 p-4 bg-muted/50 rounded-lg">
                  <div>
                    <p className="text-sm text-muted-foreground">Name</p>
                    <p className="font-medium">{selectedBooking.customer?.name || "N/A"}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Phone</p>
                    <p className="font-medium">{selectedBooking.customer?.phone || "N/A"}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Email</p>
                    <p className="font-medium">{selectedBooking.customer?.email || "N/A"}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Booking ID</p>
                    <p className="font-medium font-mono text-sm">{selectedBooking._id}</p>
                  </div>
                </div>
              </div>

              {/* Booking Details */}
              <div className="space-y-4">
                <h3 className="font-semibold text-lg flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  Booking Details
                </h3>
                <div className="grid grid-cols-2 gap-4 p-4 bg-muted/50 rounded-lg">
                  <div>
                    <p className="text-sm text-muted-foreground">Date</p>
                    <p className="font-medium">{new Date(selectedBooking.date).toLocaleDateString()}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Time</p>
                    <p className="font-medium">{selectedBooking.time}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Guests</p>
                    <p className="font-medium">{selectedBooking.guests} people</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Status</p>
                    <Badge className={statusColors[selectedBooking.status]} variant="outline">
                      {statusLabels[selectedBooking.status]}
                    </Badge>
                  </div>
                  {selectedBooking.table && (
                    <>
                      <div>
                        <p className="text-sm text-muted-foreground">Table</p>
                        <p className="font-medium">{selectedBooking.table.name} ({selectedBooking.table.number})</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Table Capacity</p>
                        <p className="font-medium">{selectedBooking.table.capacity} seats</p>
                      </div>
                    </>
                  )}
                </div>
              </div>

              {/* Special Requests */}
              {selectedBooking.specialRequests && (
                <div className="space-y-2">
                  <h3 className="font-semibold text-lg">Special Requests</h3>
                  <div className="p-4 bg-muted/50 rounded-lg">
                    <p className="text-sm">{selectedBooking.specialRequests}</p>
                  </div>
                </div>
              )}

              {/* Pre-Order */}
              {selectedBooking.preOrder && (
                <div className="space-y-2">
                  <h3 className="font-semibold text-lg">Pre-Order Items</h3>
                  <div className="p-4 bg-muted/50 rounded-lg space-y-2">
                    {selectedBooking.preOrder.items.map((item, idx) => (
                      <div key={idx} className="flex justify-between text-sm">
                        <span>{item.name} x {item.quantity}</span>
                        <span className="font-medium">₹{item.price * item.quantity}</span>
                      </div>
                    ))}
                    <div className="pt-2 border-t flex justify-between font-semibold">
                      <span>Total</span>
                      <span>₹{selectedBooking.preOrder.total}</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Customer Booking History */}
              {customerBookings.length > 0 && (
                <div className="space-y-2">
                  <h3 className="font-semibold text-lg">Customer Booking History</h3>
                  <div className="space-y-2 max-h-48 overflow-y-auto">
                    {customerBookings.slice(0, 5).map((booking) => (
                      <div key={booking._id} className="p-3 bg-muted/50 rounded-lg text-sm">
                        <div className="flex justify-between items-center">
                          <div>
                            <p className="font-medium">{new Date(booking.date).toLocaleDateString()} at {booking.time}</p>
                            <p className="text-xs text-muted-foreground">{booking.guests} guests</p>
                          </div>
                          <Badge className={`${statusColors[booking.status]} text-xs`} variant="outline">
                            {statusLabels[booking.status]}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Actions */}
              <div className="flex gap-2 pt-4 border-t">
                {selectedBooking.status === "pending" && (
                  <>
                    <Button className="flex-1" onClick={() => handleConfirm(selectedBooking._id)}>
                      <CheckCircle2 className="h-4 w-4 mr-2" />
                      Confirm Booking
                    </Button>
                    <Button variant="outline" className="text-destructive" onClick={() => handleCancel(selectedBooking._id)}>
                      <XCircle className="h-4 w-4 mr-2" />
                      Cancel
                    </Button>
                  </>
                )}
                {selectedBooking.status === "confirmed" && (
                  <Button className="flex-1" onClick={() => handleStatusUpdate(selectedBooking._id, "arriving")}>
                    Mark Customer On Way
                  </Button>
                )}
                {selectedBooking.status === "arriving" && (
                  <Button className="flex-1" onClick={() => handleStatusUpdate(selectedBooking._id, "seated")}>
                    <CheckCircle2 className="h-4 w-4 mr-2" />
                    Customer Arrived
                  </Button>
                )}
                {selectedBooking.status === "seated" && (
                  <Button className="flex-1" onClick={() => handleStatusUpdate(selectedBooking._id, "completed")}>
                    <CheckCircle2 className="h-4 w-4 mr-2" />
                    Mark Complete
                  </Button>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
