"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { customerOrders } from "@/lib/mock-dashboard-data"
import { Star, MapPin, RotateCcw, MessageSquare } from "lucide-react"

const statusColors: Record<string, string> = {
  delivered: "bg-green-100 text-green-700",
  preparing: "bg-yellow-100 text-yellow-700",
  "on-the-way": "bg-blue-100 text-blue-700",
}

export default function CustomerOrdersPage() {
  const [activeTab, setActiveTab] = useState("all")

  const filteredOrders = activeTab === "all" ? customerOrders : customerOrders.filter((o) => o.status === activeTab)

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-navy">My Orders</h2>
        <p className="text-muted-foreground">View and manage your order history</p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="all">All Orders</TabsTrigger>
          <TabsTrigger value="preparing">Preparing</TabsTrigger>
          <TabsTrigger value="on-the-way">On the Way</TabsTrigger>
          <TabsTrigger value="delivered">Delivered</TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="mt-6">
          <div className="space-y-4">
            {filteredOrders.map((order) => (
              <Card key={order.id}>
                <CardContent className="p-6">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="space-y-2">
                      <div className="flex items-center gap-3">
                        <h3 className="font-semibold text-navy text-lg">{order.restaurant}</h3>
                        <Badge className={statusColors[order.status]} variant="secondary">
                          {order.status.replace("-", " ")}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Order #{order.id} • {order.date}
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {order.items.map((item, idx) => (
                          <span key={idx} className="text-sm bg-muted px-2 py-1 rounded">
                            {item}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <p className="text-xl font-bold text-navy">₹{order.total}</p>
                      {order.rating ? (
                        <div className="flex items-center gap-1 text-sm text-yellow-600">
                          <Star className="h-4 w-4 fill-current" />
                          <span>{order.rating} rated</span>
                        </div>
                      ) : order.status === "delivered" ? (
                        <Button size="sm" variant="outline">
                          <Star className="h-4 w-4 mr-1" />
                          Rate Order
                        </Button>
                      ) : null}
                    </div>
                  </div>
                  <div className="flex gap-2 mt-4 pt-4 border-t border-border">
                    {order.status !== "delivered" && (
                      <Button size="sm" variant="outline">
                        <MapPin className="h-4 w-4 mr-1" />
                        Track Order
                      </Button>
                    )}
                    <Button size="sm" variant="outline">
                      <RotateCcw className="h-4 w-4 mr-1" />
                      Reorder
                    </Button>
                    <Button size="sm" variant="outline">
                      <MessageSquare className="h-4 w-4 mr-1" />
                      Help
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
