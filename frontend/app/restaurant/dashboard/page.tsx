"use client"

import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { StatsCard } from "@/components/dashboard/stats-card"
import { restaurantOrders, restaurantBookings, restaurantUser } from "@/lib/mock-dashboard-data"
import { IndianRupee, ClipboardList, CalendarDays, Star, ChevronRight, Clock, MapPin, AlertCircle } from "lucide-react"

const orderStatusColors: Record<string, string> = {
  pending: "bg-yellow-100 text-yellow-700 border-yellow-200",
  preparing: "bg-blue-100 text-blue-700 border-blue-200",
  ready: "bg-green-100 text-green-700 border-green-200",
  served: "bg-gray-100 text-gray-700 border-gray-200",
}

const bookingStatusColors: Record<string, string> = {
  arriving: "bg-primary/10 text-primary border-primary/20",
  confirmed: "bg-green-100 text-green-700 border-green-200",
}

export default function RestaurantDashboardPage() {
  const pendingOrders = restaurantOrders.filter((o) => o.status === "pending" || o.status === "preparing")
  const arrivingBookings = restaurantBookings.filter((b) => b.status === "arriving" || b.status === "confirmed")

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-navy">Welcome back, {restaurantUser.name.split(" ")[0]}!</h2>
          <p className="text-muted-foreground">
            Here&apos;s today&apos;s overview for {restaurantUser.restaurant.name}
          </p>
        </div>
        <div className="flex items-center gap-2 text-sm">
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
            Restaurant Open
          </span>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="Today's Revenue"
          value={`₹${(12500).toLocaleString()}`}
          change="+18% vs yesterday"
          changeType="positive"
          icon={<IndianRupee className="h-5 w-5" />}
        />
        <StatsCard
          title="Active Orders"
          value={pendingOrders.length}
          description="2 pending, 1 preparing"
          icon={<ClipboardList className="h-5 w-5" />}
        />
        <StatsCard
          title="Today's Bookings"
          value={restaurantBookings.length}
          description="3 upcoming"
          icon={<CalendarDays className="h-5 w-5" />}
        />
        <StatsCard
          title="Rating"
          value={restaurantUser.restaurant.rating}
          change="Based on 1,250 reviews"
          changeType="neutral"
          icon={<Star className="h-5 w-5" />}
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-lg">Active Orders</CardTitle>
            <Button variant="ghost" size="sm" asChild>
              <Link href="/restaurant/dashboard/orders">
                View All <ChevronRight className="ml-1 h-4 w-4" />
              </Link>
            </Button>
          </CardHeader>
          <CardContent className="space-y-3">
            {restaurantOrders.slice(0, 4).map((order) => (
              <div key={order.id} className="flex items-center justify-between p-3 rounded-lg border bg-card">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-navy">{order.id}</span>
                    <Badge className={orderStatusColors[order.status]} variant="outline">
                      {order.status}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {order.customer} • Table {order.tableNo}
                  </p>
                  <p className="text-xs text-muted-foreground">{order.items.join(", ")}</p>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-navy">₹{order.total}</p>
                  <p className="text-xs text-muted-foreground flex items-center gap-1 justify-end">
                    <Clock className="h-3 w-3" />
                    ETA: {order.eta}
                  </p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-lg">Incoming Customers</CardTitle>
            <Button variant="ghost" size="sm" asChild>
              <Link href="/restaurant/dashboard/bookings">
                View All <ChevronRight className="ml-1 h-4 w-4" />
              </Link>
            </Button>
          </CardHeader>
          <CardContent className="space-y-3">
            {arrivingBookings.map((booking) => (
              <div key={booking.id} className="flex items-center justify-between p-3 rounded-lg border bg-card">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-navy">{booking.customer}</span>
                    <Badge className={bookingStatusColors[booking.status]} variant="outline">
                      {booking.status === "arriving" ? `ETA: ${booking.eta}` : booking.status}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {booking.guests} guests • {booking.tableType}
                  </p>
                  <p className="text-xs text-muted-foreground">{booking.time}</p>
                </div>
                <div className="text-right space-y-1">
                  {booking.preOrder && (
                    <Badge variant="secondary" className="bg-primary/10 text-primary">
                      Pre-ordered
                    </Badge>
                  )}
                  {booking.status === "arriving" && (
                    <p className="text-xs text-primary font-medium flex items-center gap-1 justify-end">
                      <AlertCircle className="h-3 w-3" />
                      Start prep!
                    </p>
                  )}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-4">
            <Button variant="outline" className="h-auto py-4 flex flex-col gap-2 bg-transparent" asChild>
              <Link href="/restaurant/dashboard/menu">
                <ClipboardList className="h-6 w-6 text-primary" />
                <span>Update Menu</span>
              </Link>
            </Button>
            <Button variant="outline" className="h-auto py-4 flex flex-col gap-2 bg-transparent" asChild>
              <Link href="/restaurant/dashboard/bookings">
                <CalendarDays className="h-6 w-6 text-primary" />
                <span>Manage Bookings</span>
              </Link>
            </Button>
            <Button variant="outline" className="h-auto py-4 flex flex-col gap-2 bg-transparent" asChild>
              <Link href="/restaurant/dashboard/analytics">
                <MapPin className="h-6 w-6 text-primary" />
                <span>View Analytics</span>
              </Link>
            </Button>
            <Button variant="outline" className="h-auto py-4 flex flex-col gap-2 bg-transparent" asChild>
              <Link href="/restaurant/dashboard/reviews">
                <Star className="h-6 w-6 text-primary" />
                <span>Check Reviews</span>
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
