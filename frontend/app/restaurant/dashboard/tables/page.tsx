"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { FloorPlanTable } from "@/components/restaurant/floor-plan-table"
import { StatsCard } from "@/components/dashboard/stats-card"
import { Plus, Users, CheckCircle2, Clock, Sparkles, Grid3X3, List, Edit, Trash2, MoreVertical, Loader2 } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "sonner"
import { tablesApi, bookingsApi } from "@/lib/api"

const statusColors: Record<string, string> = {
  available: "bg-green-100 text-green-700 border-green-200",
  occupied: "bg-red-100 text-red-700 border-red-200",
  reserved: "bg-yellow-100 text-yellow-700 border-yellow-200",
  cleaning: "bg-purple-100 text-purple-700 border-purple-200",
  maintenance: "bg-gray-100 text-gray-700 border-gray-200",
}

const statusLabels: Record<string, string> = {
  available: "Available",
  occupied: "Occupied",
  reserved: "Reserved",
  cleaning: "Cleaning",
  maintenance: "Maintenance",
}

interface Table {
  _id: string
  name: string
  number: string
  type: "round" | "square" | "rectangle" | "booth" | "bar"
  capacity: number
  status: "available" | "occupied" | "reserved" | "cleaning" | "maintenance"
  location?: {
    section?: string
    x?: number
    y?: number
  }
  currentBookingId?: string
  x?: number // For floor plan display
  y?: number
  id?: string // For compatibility
}

export default function RestaurantTablesPage() {
  const [tables, setTables] = useState<Table[]>([])
  const [selectedTable, setSelectedTable] = useState<string | null>(null)
  const [viewMode, setViewMode] = useState<"floor" | "list">("floor")
  const [loading, setLoading] = useState(true)
  const [currentBooking, setCurrentBooking] = useState<any>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState<{
    name: string
    number: string
    type: "round" | "square" | "rectangle" | "booth" | "bar"
    capacity: number
    section: string
    x: number
    y: number
  }>({
    name: "",
    number: "",
    type: "round",
    capacity: 2,
    section: "",
    x: 0,
    y: 0,
  })

  useEffect(() => {
    loadTables()
  }, [])

  useEffect(() => {
    if (selectedTable) {
      loadTableDetails(selectedTable)
    }
  }, [selectedTable])

  const loadTables = async () => {
    try {
      setLoading(true)
      const response = await tablesApi.getTables()
      const tablesData = response.tables.map((table) => ({
        ...table,
        id: table._id,
        x: table.location?.x || Math.random() * 500,
        y: table.location?.y || Math.random() * 400,
      }))
      setTables(tablesData)
    } catch (error: any) {
      toast.error(error.message || "Failed to load tables")
    } finally {
      setLoading(false)
    }
  }

  const loadTableDetails = async (tableId: string) => {
    try {
      const response = await tablesApi.getTable(tableId)
      if (response.currentBooking) {
        setCurrentBooking(response.currentBooking)
      } else {
        setCurrentBooking(null)
      }
    } catch (error) {
      setCurrentBooking(null)
    }
  }

  const handleStatusChange = async (tableId: string, newStatus: string) => {
    try {
      await tablesApi.updateTableStatus(tableId, newStatus as any)
      await loadTables()
      toast.success("Table status updated successfully")
    } catch (error: any) {
      toast.error(error.message || "Failed to update table status")
    }
  }

  const handleCreateTable = async () => {
    try {
      if (!formData.name || !formData.number) {
        toast.error("Please fill in all required fields")
        return
      }

      await tablesApi.createTable({
        name: formData.name,
        number: formData.number,
        type: formData.type,
        capacity: formData.capacity,
        location: {
          section: formData.section || undefined,
          x: formData.x || undefined,
          y: formData.y || undefined,
        },
      })

      toast.success("Table created successfully")
      setIsDialogOpen(false)
      resetForm()
      await loadTables()
    } catch (error: any) {
      toast.error(error.message || "Failed to create table")
    }
  }

  const handleUpdateTable = async () => {
    if (!selectedTable) return

    try {
      await tablesApi.updateTable(selectedTable, {
        name: formData.name,
        number: formData.number,
        type: formData.type,
        capacity: formData.capacity,
        location: {
          section: formData.section || undefined,
          x: formData.x || undefined,
          y: formData.y || undefined,
        },
      })

      toast.success("Table updated successfully")
      setIsDialogOpen(false)
      setIsEditing(false)
      resetForm()
      await loadTables()
    } catch (error: any) {
      toast.error(error.message || "Failed to update table")
    }
  }

  const handleDeleteTable = async (tableId: string) => {
    if (!confirm("Are you sure you want to delete this table?")) return

    try {
      await tablesApi.deleteTable(tableId)
      toast.success("Table deleted successfully")
      if (selectedTable === tableId) {
        setSelectedTable(null)
      }
      await loadTables()
    } catch (error: any) {
      toast.error(error.message || "Failed to delete table")
    }
  }

  const resetForm = () => {
    setFormData({
      name: "",
      number: "",
      type: "round",
      capacity: 2,
      section: "",
      x: 0,
      y: 0,
    })
  }

  const openEditDialog = (table: Table) => {
    setFormData({
      name: table.name,
      number: table.number,
      type: table.type,
      capacity: table.capacity,
      section: table.location?.section || "",
      x: table.location?.x || 0,
      y: table.location?.y || 0,
    })
    setIsEditing(true)
    setIsDialogOpen(true)
  }

  const selectedTableData = tables.find((t) => t._id === selectedTable || t.id === selectedTable)

  const stats = {
    total: tables.length,
    available: tables.filter((t) => t.status === "available").length,
    occupied: tables.filter((t) => t.status === "occupied").length,
    reserved: tables.filter((t) => t.status === "reserved").length,
    totalCapacity: tables.reduce((acc, t) => acc + t.capacity, 0),
    availableCapacity: tables.filter((t) => t.status === "available").reduce((acc, t) => acc + t.capacity, 0),
  }

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
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={() => {
                resetForm()
                setIsEditing(false)
              }}>
                <Plus className="h-4 w-4 mr-2" />
                Add Table
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>{isEditing ? "Edit Table" : "Add New Table"}</DialogTitle>
                <DialogDescription>
                  {isEditing ? "Update table details below." : "Add a new table to your restaurant floor plan."}
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Table Name *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g., Table 1, Window Seat"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="number">Table Number *</Label>
                  <Input
                    id="number"
                    value={formData.number}
                    onChange={(e) => setFormData({ ...formData, number: e.target.value })}
                    placeholder="e.g., T-01, 1"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="type">Table Type</Label>
                    <Select value={formData.type} onValueChange={(value: any) => setFormData({ ...formData, type: value })}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="round">Round</SelectItem>
                        <SelectItem value="square">Square</SelectItem>
                        <SelectItem value="rectangle">Rectangle</SelectItem>
                        <SelectItem value="booth">Booth</SelectItem>
                        <SelectItem value="bar">Bar</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="capacity">Capacity</Label>
                    <Input
                      id="capacity"
                      type="number"
                      min="1"
                      max="20"
                      value={formData.capacity}
                      onChange={(e) => setFormData({ ...formData, capacity: parseInt(e.target.value) || 2 })}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="section">Section (Optional)</Label>
                  <Input
                    id="section"
                    value={formData.section}
                    onChange={(e) => setFormData({ ...formData, section: e.target.value })}
                    placeholder="e.g., Main Dining, Outdoor"
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => {
                  setIsDialogOpen(false)
                  resetForm()
                  setIsEditing(false)
                }}>
                  Cancel
                </Button>
                <Button onClick={isEditing ? handleUpdateTable : handleCreateTable}>
                  {isEditing ? "Update" : "Create"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
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
        {Object.entries(statusLabels).map(([key, label]) => (
          <div key={key} className="flex items-center gap-2">
            <span className={`w-3 h-3 rounded-full ${
              key === "available" ? "bg-green-500" :
              key === "occupied" ? "bg-red-500" :
              key === "reserved" ? "bg-yellow-500" :
              key === "cleaning" ? "bg-purple-500" :
              "bg-gray-500"
            }`}></span>
            <span className="text-sm">{label}</span>
          </div>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Floor Plan / List View */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle>{viewMode === "floor" ? "Floor Plan" : "Table List"}</CardTitle>
              <CardDescription>
                {viewMode === "floor" ? "Click on a table to view details and manage status" : "View and manage all tables"}
              </CardDescription>
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
                        key={table._id}
                        id={table._id}
                        name={table.name}
                        number={table.number}
                        type={table.type}
                        capacity={table.capacity}
                        x={table.x || 0}
                        y={table.y || 0}
                        status={table.status}
                        isSelected={selectedTable === table._id || selectedTable === table.id}
                        onClick={() => setSelectedTable(table._id || table.id || null)}
                      />
                    ))}
                  </svg>
                </div>
              ) : (
                <div className="space-y-2">
                  {tables.map((table) => (
                    <div
                      key={table._id}
                      className={`flex items-center justify-between p-3 rounded-lg border cursor-pointer transition-colors ${
                        (selectedTable === table._id || selectedTable === table.id) ? "border-primary bg-primary/5" : "hover:bg-muted/50"
                      }`}
                      onClick={() => setSelectedTable(table._id || table.id || null)}
                    >
                      <div className="flex items-center gap-3">
                        <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-muted font-semibold text-navy">
                          {table.number}
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
                            <DropdownMenuItem onClick={() => openEditDialog(table)}>
                              <Edit className="h-4 w-4 mr-2" />
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleStatusChange(table._id, "available")}>
                              <CheckCircle2 className="h-4 w-4 mr-2 text-green-600" />
                              Mark Available
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleStatusChange(table._id, "occupied")}>
                              <Users className="h-4 w-4 mr-2 text-red-600" />
                              Mark Occupied
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleStatusChange(table._id, "cleaning")}>
                              <Sparkles className="h-4 w-4 mr-2 text-purple-600" />
                              Mark Cleaning
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => handleDeleteTable(table._id)}
                              className="text-destructive"
                            >
                              <Trash2 className="h-4 w-4 mr-2" />
                              Delete
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
                      <p className="text-sm text-muted-foreground">{selectedTableData.number}</p>
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

                  {currentBooking && (
                    <div className="p-3 rounded-lg bg-yellow-50 border border-yellow-200 space-y-2">
                      <p className="text-xs font-medium text-yellow-700">Reserved For</p>
                      <p className="font-semibold text-navy">
                        {currentBooking.customer?.name || currentBooking.customerInfo?.name || "Customer"}
                      </p>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Clock className="h-3 w-3" />
                        {new Date(currentBooking.date).toLocaleDateString()} • {currentBooking.time} • {currentBooking.guests} guests
                      </div>
                      {currentBooking.status === "arriving" && currentBooking.eta && (
                        <Badge className="bg-primary/10 text-primary border-primary/20">
                          ETA: {currentBooking.eta}
                        </Badge>
                      )}
                    </div>
                  )}

                  <div className="flex flex-col gap-2 pt-2">
                    <Button
                      variant="outline"
                      className="w-full bg-transparent"
                      onClick={() => handleStatusChange(selectedTableData._id, "available")}
                      disabled={selectedTableData.status === "available"}
                    >
                      <CheckCircle2 className="h-4 w-4 mr-2" />
                      Mark Available
                    </Button>
                    <Button
                      variant="outline"
                      className="w-full bg-transparent"
                      onClick={() => handleStatusChange(selectedTableData._id, "occupied")}
                      disabled={selectedTableData.status === "occupied"}
                    >
                      <Users className="h-4 w-4 mr-2" />
                      Mark Occupied
                    </Button>
                    <Button
                      variant="outline"
                      className="w-full bg-transparent"
                      onClick={() => handleStatusChange(selectedTableData._id, "cleaning")}
                      disabled={selectedTableData.status === "cleaning"}
                    >
                      <Sparkles className="h-4 w-4 mr-2" />
                      Mark Cleaning
                    </Button>
                  </div>

                  <div className="flex gap-2 pt-2 border-t">
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1 bg-transparent"
                      onClick={() => openEditDialog(selectedTableData)}
                    >
                      <Edit className="h-4 w-4 mr-1" />
                      Edit
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-destructive hover:text-destructive bg-transparent"
                      onClick={() => handleDeleteTable(selectedTableData._id)}
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
