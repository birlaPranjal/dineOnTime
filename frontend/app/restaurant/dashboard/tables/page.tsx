"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { FloorPlanTable } from "@/components/restaurant/floor-plan-table"
import { StatsCard } from "@/components/dashboard/stats-card"
import { restaurantTables, restaurantBookings } from "@/lib/mock-dashboard-data"
import { Plus, Users, CheckCircle2, Clock, Sparkles, Grid3X3, List, Edit, Trash2, MoreVertical } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

const statusColors: Record<string, string> = {
  available: "bg-green-100 text-green-700 border-green-200",
  occupied: "bg-red-100 text-red-700 border-red-200",
  reserved: "bg-yellow-100 text-yellow-700 border-yellow-200",
  cleaning: "bg-purple-100 text-purple-700 border-purple-200",
}

const statusLabels: Record<string, string> = {
  available: "Available",
  occupied: "Occupied",
  reserved: "Reserved",
  cleaning: "Cleaning",
}

export default function RestaurantTablesPage() {
  const [tables, setTables] = useState(restaurantTables)
  const [selectedTable, setSelectedTable] = useState<string | null>(null)
  const [viewMode, setViewMode] = useState<"floor" | "list">("floor")

  const selectedTableData = tables.find((t) => t.id === selectedTable)
  const relatedBooking = selectedTableData?.currentBooking
    ? restaurantBookings.find((b) => b.id === selectedTableData.currentBooking)
    : null

  const stats = {
    total: tables.length,
    available: tables.filter((t) => t.status === "available").length,
    occupied: tables.filter((t) => t.status === "occupied").length,
    reserved: tables.filter((t) => t.status === "reserved").length,
    totalCapacity: tables.reduce((acc, t) => acc + t.capacity, 0),
    availableCapacity: tables.filter((t) => t.status === "available").reduce((acc, t) => acc + t.capacity, 0),
  }

  const handleStatusChange = (tableId: string, newStatus: string) => {
    setTables(tables.map((t) => (t.id === tableId ? { ...t, status: newStatus as any } : t)))
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-navy">Table Management</h2>
          <p className="text-muted-foreground">Manage your restaurant floor plan and table availability</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center border rounded-lg p-1">
            <Button variant={viewMode === "floor" ? "default" : "ghost"} size="sm" onClick={() => setViewMode("floor")}>
              <Grid3X3 className="h-4 w-4 mr-1" />
              Floor Plan
            </Button>
            <Button variant={viewMode === "list" ? "default" : "ghost"} size="sm" onClick={() => setViewMode("list")}>
              <List className="h-4 w-4 mr-1" />
              List
            </Button>
          </div>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Add Table
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <StatsCard
          title="Total Tables"
          value={stats.total}
          description={`${stats.totalCapacity} total seats`}
          icon={<Grid3X3 className="h-5 w-5" />}
        />
        <StatsCard
          title="Available"
          value={stats.available}
          description={`${stats.availableCapacity} seats open`}
          icon={<CheckCircle2 className="h-5 w-5" />}
        />
        <StatsCard
          title="Occupied"
          value={stats.occupied}
          description="Currently dining"
          icon={<Users className="h-5 w-5" />}
        />
        <StatsCard
          title="Reserved"
          value={stats.reserved}
          description="Upcoming bookings"
          icon={<Clock className="h-5 w-5" />}
        />
      </div>

      {/* Legend */}
      <div className="flex items-center gap-4 flex-wrap">
        <span className="text-sm font-medium text-muted-foreground">Status:</span>
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-green-500"></span>
          <span className="text-sm">Available</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-red-500"></span>
          <span className="text-sm">Occupied</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-yellow-500"></span>
          <span className="text-sm">Reserved</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-purple-500"></span>
          <span className="text-sm">Cleaning</span>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Floor Plan / List View */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle>Floor Plan</CardTitle>
              <CardDescription>Click on a table to view details and manage status</CardDescription>
            </CardHeader>
            <CardContent>
              {viewMode === "floor" ? (
                <div className="relative w-full overflow-auto bg-muted/30 rounded-lg border-2 border-dashed border-border p-4">
                  <svg width="600" height="550" className="mx-auto">
                    {/* Floor layout background elements */}
                    <rect x="0" y="0" width="600" height="550" fill="transparent" />

                    {/* Kitchen area indicator */}
                    <rect
                      x="450"
                      y="0"
                      width="150"
                      height="60"
                      fill="#f1f5f9"
                      stroke="#cbd5e1"
                      strokeWidth={1}
                      rx={4}
                    />
                    <text x="525" y="35" textAnchor="middle" className="text-xs fill-muted-foreground">
                      Kitchen
                    </text>

                    {/* Entrance indicator */}
                    <rect x="0" y="245" width="40" height="60" fill="#f1f5f9" stroke="#cbd5e1" strokeWidth={1} rx={4} />
                    <text
                      x="20"
                      y="280"
                      textAnchor="middle"
                      className="text-xs fill-muted-foreground"
                      transform="rotate(-90 20 280)"
                    >
                      Entry
                    </text>

                    {/* Section labels */}
                    <text x="150" y="30" className="text-xs font-medium fill-muted-foreground">
                      Main Dining
                    </text>
                    <text x="100" y="430" className="text-xs font-medium fill-muted-foreground">
                      Private Section
                    </text>
                    <text x="400" y="430" className="text-xs font-medium fill-muted-foreground">
                      Outdoor
                    </text>

                    {/* Tables */}
                    {tables.map((table) => (
                      <FloorPlanTable
                        key={table.id}
                        id={table.id}
                        name={table.name}
                        type={table.type}
                        capacity={table.capacity}
                        x={table.x}
                        y={table.y}
                        status={table.status as any}
                        isSelected={selectedTable === table.id}
                        onClick={() => setSelectedTable(table.id)}
                      />
                    ))}
                  </svg>
                </div>
              ) : (
                <div className="space-y-2">
                  {tables.map((table) => (
                    <div
                      key={table.id}
                      className={`flex items-center justify-between p-3 rounded-lg border cursor-pointer transition-colors ${
                        selectedTable === table.id ? "border-primary bg-primary/5" : "hover:bg-muted/50"
                      }`}
                      onClick={() => setSelectedTable(table.id)}
                    >
                      <div className="flex items-center gap-3">
                        <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-muted font-semibold text-navy">
                          {table.id}
                        </div>
                        <div>
                          <p className="font-medium text-navy">{table.name}</p>
                          <p className="text-sm text-muted-foreground">
                            {table.capacity} seats • {table.type.replace("-", " ")}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge className={statusColors[table.status]} variant="outline">
                          {statusLabels[table.status]}
                        </Badge>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => handleStatusChange(table.id, "available")}>
                              <CheckCircle2 className="h-4 w-4 mr-2 text-green-600" />
                              Mark Available
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleStatusChange(table.id, "occupied")}>
                              <Users className="h-4 w-4 mr-2 text-red-600" />
                              Mark Occupied
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleStatusChange(table.id, "cleaning")}>
                              <Sparkles className="h-4 w-4 mr-2 text-purple-600" />
                              Mark Cleaning
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Table Details Panel */}
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Table Details</CardTitle>
            </CardHeader>
            <CardContent>
              {selectedTableData ? (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-semibold text-navy">{selectedTableData.name}</h3>
                      <p className="text-sm text-muted-foreground">{selectedTableData.id}</p>
                    </div>
                    <Badge className={statusColors[selectedTableData.status]} variant="outline">
                      {statusLabels[selectedTableData.status]}
                    </Badge>
                  </div>

                  <div className="grid grid-cols-2 gap-4 pt-2 border-t">
                    <div>
                      <p className="text-xs text-muted-foreground">Type</p>
                      <p className="font-medium capitalize">{selectedTableData.type.replace("-", " ")}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Capacity</p>
                      <p className="font-medium">{selectedTableData.capacity} guests</p>
                    </div>
                  </div>

                  {relatedBooking && (
                    <div className="p-3 rounded-lg bg-yellow-50 border border-yellow-200 space-y-2">
                      <p className="text-xs font-medium text-yellow-700">Reserved For</p>
                      <p className="font-semibold text-navy">{relatedBooking.customer}</p>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Clock className="h-3 w-3" />
                        {relatedBooking.time} • {relatedBooking.guests} guests
                      </div>
                      {relatedBooking.status === "arriving" && (
                        <Badge className="bg-primary/10 text-primary border-primary/20">
                          ETA: {relatedBooking.eta}
                        </Badge>
                      )}
                    </div>
                  )}

                  <div className="flex flex-col gap-2 pt-2">
                    <Button
                      variant="outline"
                      className="w-full bg-transparent"
                      onClick={() => handleStatusChange(selectedTableData.id, "available")}
                      disabled={selectedTableData.status === "available"}
                    >
                      <CheckCircle2 className="h-4 w-4 mr-2" />
                      Mark Available
                    </Button>
                    <Button
                      variant="outline"
                      className="w-full bg-transparent"
                      onClick={() => handleStatusChange(selectedTableData.id, "occupied")}
                      disabled={selectedTableData.status === "occupied"}
                    >
                      <Users className="h-4 w-4 mr-2" />
                      Mark Occupied
                    </Button>
                    <Button
                      variant="outline"
                      className="w-full bg-transparent"
                      onClick={() => handleStatusChange(selectedTableData.id, "cleaning")}
                      disabled={selectedTableData.status === "cleaning"}
                    >
                      <Sparkles className="h-4 w-4 mr-2" />
                      Mark Cleaning
                    </Button>
                  </div>

                  <div className="flex gap-2 pt-2 border-t">
                    <Button variant="outline" size="sm" className="flex-1 bg-transparent">
                      <Edit className="h-4 w-4 mr-1" />
                      Edit
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-destructive hover:text-destructive bg-transparent"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <Grid3X3 className="h-12 w-12 mx-auto mb-3 opacity-50" />
                  <p>Select a table to view details</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Quick Stats */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Capacity Overview</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">2-seater tables</span>
                <span className="font-medium">{tables.filter((t) => t.capacity === 2).length}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">4-seater tables</span>
                <span className="font-medium">{tables.filter((t) => t.capacity === 4).length}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">6-seater tables</span>
                <span className="font-medium">{tables.filter((t) => t.capacity === 6).length}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">8+ seater tables</span>
                <span className="font-medium">{tables.filter((t) => t.capacity >= 8).length}</span>
              </div>
              <div className="pt-2 border-t flex items-center justify-between font-medium">
                <span>Total Capacity</span>
                <span className="text-primary">{stats.totalCapacity} seats</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
