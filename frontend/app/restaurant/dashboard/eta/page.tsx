"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { incomingCustomers } from "@/lib/mock-dashboard-data"
import { MapPin, Users, Phone, ShoppingBag, Navigation, ChefHat, AlertCircle, CheckCircle2 } from "lucide-react"

export default function CustomerETAPage() {
  const [customers, setCustomers] = useState(incomingCustomers)

  // Simulate ETA updates
  useEffect(() => {
    const interval = setInterval(() => {
      setCustomers((prev) =>
        prev.map((c) => {
          if (c.etaMinutes > 0 && c.status === "on-way") {
            const newEta = Math.max(0, c.etaMinutes - 1)
            return {
              ...c,
              etaMinutes: newEta,
              eta: newEta === 0 ? "Arrived!" : `${newEta} mins`,
            }
          }
          return c
        }),
      )
    }, 60000) // Update every minute

    return () => clearInterval(interval)
  }, [])

  const getUrgencyLevel = (etaMinutes: number) => {
    if (etaMinutes <= 5) return "urgent"
    if (etaMinutes <= 15) return "soon"
    return "later"
  }

  const urgencyColors = {
    urgent: "bg-red-100 text-red-700 border-red-200",
    soon: "bg-yellow-100 text-yellow-700 border-yellow-200",
    later: "bg-green-100 text-green-700 border-green-200",
  }

  const urgencyLabels = {
    urgent: "Start Prep Now!",
    soon: "Prep Soon",
    later: "Arriving Later",
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-navy">Customer ETA Tracking</h2>
          <p className="text-muted-foreground">Real-time tracking of incoming customers for optimal meal preparation</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="flex items-center gap-1.5 text-sm">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
            Live Tracking Active
          </span>
        </div>
      </div>

      {/* Priority Alert */}
      {customers.some((c) => c.etaMinutes <= 5 && c.preOrder) && (
        <Card className="border-red-200 bg-red-50">
          <CardContent className="py-4">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-10 h-10 rounded-full bg-red-100">
                <AlertCircle className="h-5 w-5 text-red-600" />
              </div>
              <div>
                <p className="font-semibold text-red-700">Urgent: Start Preparation Now!</p>
                <p className="text-sm text-red-600">
                  {customers.filter((c) => c.etaMinutes <= 5 && c.preOrder).length} customer(s) with pre-orders arriving
                  in less than 5 minutes
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-4 lg:grid-cols-2">
        {customers
          .sort((a, b) => a.etaMinutes - b.etaMinutes)
          .map((customer) => {
            const urgency = getUrgencyLevel(customer.etaMinutes)
            return (
              <Card
                key={customer.id}
                className={`relative overflow-hidden ${urgency === "urgent" ? "border-red-200" : ""}`}
              >
                {urgency === "urgent" && (
                  <div className="absolute top-0 left-0 right-0 h-1 bg-red-500 animate-pulse"></div>
                )}
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 text-primary font-bold text-lg">
                        {customer.eta === "Arrived!" ? (
                          <CheckCircle2 className="h-6 w-6 text-green-600" />
                        ) : (
                          customer.etaMinutes
                        )}
                      </div>
                      <div>
                        <CardTitle className="text-base">{customer.customer}</CardTitle>
                        <p className="text-sm text-muted-foreground flex items-center gap-1">
                          <Phone className="h-3 w-3" />
                          {customer.phone}
                        </p>
                      </div>
                    </div>
                    <Badge className={urgencyColors[urgency]} variant="outline">
                      {urgency === "urgent" ? urgencyLabels.urgent : customer.eta}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-3 gap-3 text-sm">
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4 text-muted-foreground" />
                      <span>{customer.guests} guests</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                      <span>{customer.distance}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Navigation className="h-4 w-4 text-muted-foreground" />
                      <span>{customer.tableAssigned}</span>
                    </div>
                  </div>

                  {customer.preOrder && (
                    <div className="p-3 rounded-lg bg-cream border border-primary/20 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium flex items-center gap-2">
                          <ShoppingBag className="h-4 w-4 text-primary" />
                          Pre-Order Items
                        </span>
                        <span className="font-semibold text-primary">₹{customer.preOrderTotal}</span>
                      </div>
                      <div className="text-sm text-muted-foreground">{customer.preOrderItems.join(", ")}</div>
                      {urgency === "urgent" && (
                        <div className="flex items-center gap-2 pt-2">
                          <ChefHat className="h-4 w-4 text-red-600" />
                          <span className="text-sm font-medium text-red-600">Start preparing now!</span>
                        </div>
                      )}
                    </div>
                  )}

                  {/* ETA Progress Bar */}
                  <div className="space-y-1">
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>Distance Progress</span>
                      <span>{customer.distance} away</span>
                    </div>
                    <Progress
                      value={customer.etaMinutes <= 0 ? 100 : Math.max(0, 100 - (customer.etaMinutes / 60) * 100)}
                      className="h-2"
                    />
                  </div>

                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" className="flex-1 bg-transparent">
                      <Phone className="h-4 w-4 mr-1" />
                      Call Customer
                    </Button>
                    {customer.preOrder && urgency !== "later" && (
                      <Button size="sm" className="flex-1">
                        <ChefHat className="h-4 w-4 mr-1" />
                        Start Prep
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            )
          })}
      </div>

      {customers.length === 0 && (
        <Card>
          <CardContent className="py-12 text-center text-muted-foreground">
            <Navigation className="h-12 w-12 mx-auto mb-3 opacity-50" />
            <p>No incoming customers at the moment</p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
