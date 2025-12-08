"use client"

import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { StatsCard } from "@/components/dashboard/stats-card"
import { customerOrders, customerBookings } from "@/lib/mock-dashboard-data"
import { UtensilsCrossed, CalendarDays, Star, Clock, ChevronRight, MapPin } from "lucide-react"

const statusColors: Record<string, string> = {
  delivered: "bg-green-100 text-green-700",
  preparing: "bg-yellow-100 text-yellow-700",
  "on-the-way": "bg-blue-100 text-blue-700",
  confirmed: "bg-green-100 text-green-700",
  pending: "bg-yellow-100 text-yellow-700",
  completed: "bg-gray-100 text-gray-700",
}

export default function CustomerDashboardPage() {
  const recentOrders = customerOrders.slice(0, 3)
  const upcomingBookings = customerBookings.filter((b) => b.status !== "completed").slice(0, 2)

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-navy">Welcome back, Rahul!</h2>
        <p className="text-muted-foreground">Here&apos;s what&apos;s happening with your dining activity.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="Total Orders"
          value="24"
          change="+3 this month"
          changeType="positive"
          icon={<UtensilsCrossed className="h-5 w-5" />}
        />
        <StatsCard
          title="Upcoming Bookings"
          value="2"
          description="Next: Jan 20, 7:30 PM"
          icon={<CalendarDays className="h-5 w-5" />}
        />
        <StatsCard
          title="Reviews Given"
          value="18"
          change="+2 this month"
          changeType="positive"
          icon={<Star className="h-5 w-5" />}
        />
        <StatsCard
          title="Time Saved"
          value="4.5 hrs"
          description="By pre-ordering"
          icon={<Clock className="h-5 w-5" />}
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg">Recent Orders</CardTitle>
            <Button variant="ghost" size="sm" asChild>
              <Link href="/customer/dashboard/orders">
                View All <ChevronRight className="ml-1 h-4 w-4" />
              </Link>
            </Button>
          </CardHeader>
          <CardContent className="space-y-4">
            {recentOrders.map((order) => (
              <div key={order.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                <div className="space-y-1">
                  <p className="font-medium text-navy">{order.restaurant}</p>
                  <p className="text-sm text-muted-foreground">
                    {order.items.slice(0, 2).join(", ")}
                    {order.items.length > 2 && "..."}
                  </p>
                  <p className="text-xs text-muted-foreground">{order.date}</p>
                </div>
                <div className="text-right space-y-1">
                  <p className="font-semibold text-navy">₹{order.total}</p>
                  <Badge className={statusColors[order.status]} variant="secondary">
                    {order.status.replace("-", " ")}
                  </Badge>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg">Upcoming Bookings</CardTitle>
            <Button variant="ghost" size="sm" asChild>
              <Link href="/customer/dashboard/bookings">
                View All <ChevronRight className="ml-1 h-4 w-4" />
              </Link>
            </Button>
          </CardHeader>
          <CardContent className="space-y-4">
            {upcomingBookings.length > 0 ? (
              upcomingBookings.map((booking) => (
                <div key={booking.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                  <div className="space-y-1">
                    <p className="font-medium text-navy">{booking.restaurant}</p>
                    <div className="flex items-center gap-3 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <CalendarDays className="h-3 w-3" />
                        {booking.date}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {booking.time}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {booking.guests} guests • {booking.tableType}
                    </p>
                  </div>
                  <div className="text-right space-y-1">
                    <Badge className={statusColors[booking.status]} variant="secondary">
                      {booking.status}
                    </Badge>
                    {booking.preOrder && <p className="text-xs text-primary">Pre-ordered</p>}
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <CalendarDays className="h-12 w-12 mx-auto mb-2 opacity-50" />
                <p>No upcoming bookings</p>
                <Button className="mt-4" asChild>
                  <Link href="/restaurants">Book a Table</Link>
                </Button>
              </div>
            )}
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
              <Link href="/restaurants">
                <UtensilsCrossed className="h-6 w-6 text-primary" />
                <span>Browse Restaurants</span>
              </Link>
            </Button>
            <Button variant="outline" className="h-auto py-4 flex flex-col gap-2 bg-transparent" asChild>
              <Link href="/restaurants">
                <CalendarDays className="h-6 w-6 text-primary" />
                <span>Book a Table</span>
              </Link>
            </Button>
            <Button variant="outline" className="h-auto py-4 flex flex-col gap-2 bg-transparent" asChild>
              <Link href="/customer/dashboard/orders">
                <Clock className="h-6 w-6 text-primary" />
                <span>Track Order</span>
              </Link>
            </Button>
            <Button variant="outline" className="h-auto py-4 flex flex-col gap-2 bg-transparent" asChild>
              <Link href="/customer/dashboard/addresses">
                <MapPin className="h-6 w-6 text-primary" />
                <span>Manage Addresses</span>
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
