"use client"

import { useState } from "react"
import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Input } from "@/components/ui/input"
import { restaurantMenuItems } from "@/lib/mock-dashboard-data"
import { Plus, Search, Edit, Trash2, TrendingUp } from "lucide-react"

export default function RestaurantMenuPage() {
  const [menuItems, setMenuItems] = useState(restaurantMenuItems)
  const [searchQuery, setSearchQuery] = useState("")

  const filteredItems = menuItems.filter(
    (item) =>
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.category.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const toggleAvailability = (id: string) => {
    setMenuItems(menuItems.map((item) => (item.id === id ? { ...item, available: !item.available } : item)))
  }

  const categories = [...new Set(menuItems.map((item) => item.category))]

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-navy">Menu Management</h2>
          <p className="text-muted-foreground">Add, edit, and manage your restaurant menu</p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Add New Item
        </Button>
      </div>

      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search menu items..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>
        <div className="flex gap-2 flex-wrap">
          {categories.map((category) => (
            <Badge key={category} variant="outline" className="cursor-pointer hover:bg-muted">
              {category}
            </Badge>
          ))}
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filteredItems.map((item) => (
          <Card key={item.id} className={!item.available ? "opacity-60" : ""}>
            <CardContent className="p-4">
              <div className="flex gap-4">
                <div className="relative w-20 h-20 rounded-lg overflow-hidden bg-muted flex-shrink-0">
                  <Image src={item.image || "/placeholder.svg"} alt={item.name} fill className="object-cover" />
                </div>
                <div className="flex-1 space-y-1">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-semibold text-navy">{item.name}</h3>
                      <p className="text-sm text-muted-foreground">{item.category}</p>
                    </div>
                    <Switch checked={item.available} onCheckedChange={() => toggleAvailability(item.id)} />
                  </div>
                  <div className="flex items-center justify-between">
                    <p className="font-semibold text-primary">₹{item.price}</p>
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <TrendingUp className="h-3 w-3" />
                      {item.orders} orders
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex gap-2 mt-3 pt-3 border-t border-border">
                <Button variant="outline" size="sm" className="flex-1 bg-transparent">
                  <Edit className="h-4 w-4 mr-1" />
                  Edit
                </Button>
                <Button variant="outline" size="sm" className="text-destructive hover:text-destructive bg-transparent">
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
