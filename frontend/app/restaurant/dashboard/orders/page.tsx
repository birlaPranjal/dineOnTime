"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { restaurantOrders } from "@/lib/mock-dashboard-data"
import { Clock, ChefHat, Check, Bell } from "lucide-react"

const orderStatusColors: Record<string, string> = {
  pending: "bg-yellow-100 text-yellow-700",
  preparing: "bg-blue-100 text-blue-700",
  ready: "bg-green-100 text-green-700",
  served: "bg-gray-100 text-gray-700",
}

const statusActions: Record<string, { label: string; icon: React.ReactNode; nextStatus: string }> = {
  pending: { label: "Start Preparing", icon: <ChefHat className="h-4 w-4" />, nextStatus: "preparing" },
  preparing: { label: "Mark Ready", icon: <Check className="h-4 w-4" />, nextStatus: "ready" },
  ready: { label: "Mark Served", icon: <Bell className="h-4 w-4" />, nextStatus: "served" },
}

export default function RestaurantOrdersPage() {
  const [activeTab, setActiveTab] = useState("all")
  const [orders, setOrders] = useState(restaurantOrders)

  const filteredOrders = activeTab === "all" ? orders : orders.filter((o) => o.status === activeTab)

  const handleStatusChange = (orderId: string, newStatus: string) => {
    setOrders(orders.map((order) => (order.id === orderId ? { ...order, status: newStatus } : order)))
  }

  const orderCounts = {
    pending: orders.filter((o) => o.status === "pending").length,
    preparing: orders.filter((o) => o.status === "preparing").length,
    ready: orders.filter((o) => o.status === "ready").length,
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-navy">Order Management</h2>
          <p className="text-muted-foreground">Track and manage incoming orders in real-time</p>
        </div>
        <div className="flex gap-2">
          <Badge variant="outline" className="bg-yellow-50 border-yellow-200 text-yellow-700">
            {orderCounts.pending} Pending
          </Badge>
          <Badge variant="outline" className="bg-blue-50 border-blue-200 text-blue-700">
            {orderCounts.preparing} Preparing
          </Badge>
          <Badge variant="outline" className="bg-green-50 border-green-200 text-green-700">
            {orderCounts.ready} Ready
          </Badge>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="all">All Orders</TabsTrigger>
          <TabsTrigger value="pending">Pending</TabsTrigger>
          <TabsTrigger value="preparing">Preparing</TabsTrigger>
          <TabsTrigger value="ready">Ready</TabsTrigger>
          <TabsTrigger value="served">Served</TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="mt-6">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filteredOrders.map((order) => (
              <Card key={order.id} className="relative overflow-hidden">
                {order.status === "pending" && <div className="absolute top-0 left-0 right-0 h-1 bg-yellow-500"></div>}
                {order.status === "preparing" && <div className="absolute top-0 left-0 right-0 h-1 bg-blue-500"></div>}
                {order.status === "ready" && (
                  <div className="absolute top-0 left-0 right-0 h-1 bg-green-500 animate-pulse"></div>
                )}
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-base">{order.id}</CardTitle>
                    <Badge className={orderStatusColors[order.status]} variant="secondary">
                      {order.status}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between text-sm text-muted-foreground">
                    <span>{order.customer}</span>
                    <span>Table {order.tableNo}</span>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="space-y-1">
                    {order.items.map((item, idx) => (
                      <p key={idx} className="text-sm">
                        {item}
                      </p>
                    ))}
                  </div>
                  <div className="flex items-center justify-between pt-2 border-t border-border">
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                      <Clock className="h-4 w-4" />
                      {order.orderTime}
                    </div>
                    <p className="font-semibold text-navy">₹{order.total}</p>
                  </div>
                  {statusActions[order.status] && (
                    <Button
                      className="w-full"
                      size="sm"
                      onClick={() => handleStatusChange(order.id, statusActions[order.status].nextStatus)}
                    >
                      {statusActions[order.status].icon}
                      <span className="ml-2">{statusActions[order.status].label}</span>
                    </Button>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
