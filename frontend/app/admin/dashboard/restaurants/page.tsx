"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { allRestaurants, pendingRestaurants } from "@/lib/mock-dashboard-data"
import { Search, Star, MapPin, MoreVertical, CheckCircle, XCircle, Ban, Eye } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

const statusColors: Record<string, string> = {
  active: "bg-green-100 text-green-700",
  suspended: "bg-red-100 text-red-700",
  pending: "bg-yellow-100 text-yellow-700",
}

export default function AdminRestaurantsPage() {
  const [activeTab, setActiveTab] = useState("all")
  const [searchQuery, setSearchQuery] = useState("")

  const filteredRestaurants = allRestaurants.filter(
    (r) =>
      r.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.location.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-navy">Restaurant Management</h2>
          <p className="text-muted-foreground">Manage restaurant partners and approvals</p>
        </div>
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search restaurants..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="all">All Restaurants ({allRestaurants.length})</TabsTrigger>
          <TabsTrigger value="pending">Pending Approval ({pendingRestaurants.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="mt-6">
          <Card>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b bg-muted/50">
                      <th className="text-left p-4 font-medium">Restaurant</th>
                      <th className="text-left p-4 font-medium">Owner</th>
                      <th className="text-left p-4 font-medium">Rating</th>
                      <th className="text-left p-4 font-medium">Orders</th>
                      <th className="text-left p-4 font-medium">Revenue</th>
                      <th className="text-left p-4 font-medium">Commission</th>
                      <th className="text-left p-4 font-medium">Status</th>
                      <th className="text-left p-4 font-medium">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredRestaurants.map((restaurant) => (
                      <tr key={restaurant.id} className="border-b hover:bg-muted/30">
                        <td className="p-4">
                          <div>
                            <p className="font-medium text-navy">{restaurant.name}</p>
                            <p className="text-sm text-muted-foreground flex items-center gap-1">
                              <MapPin className="h-3 w-3" />
                              {restaurant.location}
                            </p>
                          </div>
                        </td>
                        <td className="p-4 text-sm">{restaurant.owner}</td>
                        <td className="p-4">
                          <div className="flex items-center gap-1">
                            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                            <span>{restaurant.rating}</span>
                          </div>
                        </td>
                        <td className="p-4">{restaurant.orders.toLocaleString()}</td>
                        <td className="p-4">₹{(restaurant.revenue / 1000).toFixed(0)}K</td>
                        <td className="p-4">{restaurant.commission}%</td>
                        <td className="p-4">
                          <Badge className={statusColors[restaurant.status]} variant="secondary">
                            {restaurant.status}
                          </Badge>
                        </td>
                        <td className="p-4">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon">
                                <MoreVertical className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem>
                                <Eye className="h-4 w-4 mr-2" />
                                View Details
                              </DropdownMenuItem>
                              {restaurant.status === "active" ? (
                                <DropdownMenuItem className="text-red-600">
                                  <Ban className="h-4 w-4 mr-2" />
                                  Suspend
                                </DropdownMenuItem>
                              ) : (
                                <DropdownMenuItem className="text-green-600">
                                  <CheckCircle className="h-4 w-4 mr-2" />
                                  Activate
                                </DropdownMenuItem>
                              )}
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="pending" className="mt-6">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {pendingRestaurants.map((restaurant) => (
              <Card key={restaurant.id}>
                <CardHeader className="pb-2">
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-base">{restaurant.name}</CardTitle>
                      <p className="text-sm text-muted-foreground">{restaurant.cuisine} Cuisine</p>
                    </div>
                    <Badge
                      variant="outline"
                      className={
                        restaurant.documents === "verified"
                          ? "border-green-200 text-green-700"
                          : "border-yellow-200 text-yellow-700"
                      }
                    >
                      Docs: {restaurant.documents}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Owner:</span>
                      <span>{restaurant.owner}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Email:</span>
                      <span className="truncate ml-2">{restaurant.email}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Location:</span>
                      <span>{restaurant.location}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Applied:</span>
                      <span>{restaurant.appliedDate}</span>
                    </div>
                  </div>
                  <div className="flex gap-2 pt-2">
                    <Button className="flex-1" size="sm">
                      <CheckCircle className="h-4 w-4 mr-1" />
                      Approve
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1 text-destructive hover:text-destructive bg-transparent"
                    >
                      <XCircle className="h-4 w-4 mr-1" />
                      Reject
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
