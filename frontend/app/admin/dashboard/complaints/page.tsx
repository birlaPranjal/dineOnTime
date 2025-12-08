"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { StatsCard } from "@/components/dashboard/stats-card"
import { Search, AlertTriangle, Clock, CheckCircle, Eye } from "lucide-react"

const complaints = [
  {
    id: "CMP-001",
    customer: "Rahul Sharma",
    customerEmail: "rahul@email.com",
    restaurant: "The Spice Garden",
    orderId: "ORD-1234",
    type: "food",
    priority: "high",
    status: "open",
    description: "Food was cold when delivered. Ordered butter chicken but received paneer instead.",
    createdAt: "Dec 18, 2024, 2:30 PM",
    assignedTo: null,
  },
  {
    id: "CMP-002",
    customer: "Priya Patel",
    customerEmail: "priya@email.com",
    restaurant: "Sushi Master",
    orderId: "ORD-1235",
    type: "payment",
    priority: "urgent",
    status: "in-progress",
    description: "Double charged for the same order. Payment deducted twice from my account.",
    createdAt: "Dec 17, 2024, 6:45 PM",
    assignedTo: "Support Team",
  },
  {
    id: "CMP-003",
    customer: "Amit Kumar",
    customerEmail: "amit@email.com",
    restaurant: "Pizza Paradise",
    orderId: null,
    type: "booking",
    priority: "medium",
    status: "resolved",
    description: "Table was not available despite confirmed booking. Had to wait 30 mins.",
    createdAt: "Dec 15, 2024, 8:00 PM",
    assignedTo: "Support Team",
    resolution: "Full refund provided and 20% discount code for next booking.",
  },
]

const priorityColors: Record<string, string> = {
  urgent: "bg-red-100 text-red-700",
  high: "bg-orange-100 text-orange-700",
  medium: "bg-yellow-100 text-yellow-700",
  low: "bg-green-100 text-green-700",
}

const statusColors: Record<string, string> = {
  open: "bg-red-100 text-red-700",
  "in-progress": "bg-blue-100 text-blue-700",
  resolved: "bg-green-100 text-green-700",
  closed: "bg-gray-100 text-gray-700",
}

const typeIcons: Record<string, string> = {
  food: "Food Quality",
  payment: "Payment Issue",
  booking: "Booking Issue",
  service: "Service Issue",
  other: "Other",
}

export default function AdminComplaintsPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [selectedComplaint, setSelectedComplaint] = useState<any>(null)
  const [resolution, setResolution] = useState("")

  const filteredComplaints = complaints.filter((c) => {
    const matchesSearch =
      c.customer.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.id.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = statusFilter === "all" || c.status === statusFilter
    return matchesSearch && matchesStatus
  })

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-navy">Complaint Management</h2>
        <p className="text-muted-foreground">Handle customer complaints and support tickets</p>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <StatsCard
          title="Open Complaints"
          value={complaints.filter((c) => c.status === "open").length}
          description="Needs attention"
          icon={<AlertTriangle className="h-5 w-5" />}
        />
        <StatsCard
          title="In Progress"
          value={complaints.filter((c) => c.status === "in-progress").length}
          description="Being handled"
          icon={<Clock className="h-5 w-5" />}
        />
        <StatsCard
          title="Resolved Today"
          value="5"
          change="Avg. resolution: 4hrs"
          changeType="positive"
          icon={<CheckCircle className="h-5 w-5" />}
        />
        <StatsCard
          title="Urgent Priority"
          value={complaints.filter((c) => c.priority === "urgent").length}
          description="Immediate action"
          icon={<AlertTriangle className="h-5 w-5" />}
        />
      </div>

      <Card>
        <CardHeader className="pb-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <CardTitle className="text-lg">All Complaints</CardTitle>
            <div className="flex gap-3">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="open">Open</SelectItem>
                  <SelectItem value="in-progress">In Progress</SelectItem>
                  <SelectItem value="resolved">Resolved</SelectItem>
                </SelectContent>
              </Select>
              <div className="relative w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search complaints..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredComplaints.map((complaint) => (
              <div key={complaint.id} className="flex items-start justify-between p-4 rounded-lg border bg-card">
                <div className="flex items-start gap-4">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      complaint.priority === "urgent"
                        ? "bg-red-100"
                        : complaint.priority === "high"
                          ? "bg-orange-100"
                          : "bg-yellow-100"
                    }`}
                  >
                    <AlertTriangle
                      className={`h-5 w-5 ${
                        complaint.priority === "urgent"
                          ? "text-red-600"
                          : complaint.priority === "high"
                            ? "text-orange-600"
                            : "text-yellow-600"
                      }`}
                    />
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-medium text-navy">{complaint.id}</span>
                      <Badge className={priorityColors[complaint.priority]} variant="secondary">
                        {complaint.priority}
                      </Badge>
                      <Badge className={statusColors[complaint.status]} variant="secondary">
                        {complaint.status}
                      </Badge>
                      <Badge variant="outline">{typeIcons[complaint.type]}</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">{complaint.description}</p>
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      <span>Customer: {complaint.customer}</span>
                      <span>Restaurant: {complaint.restaurant}</span>
                      <span>{complaint.createdAt}</span>
                    </div>
                  </div>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  className="bg-transparent"
                  onClick={() => setSelectedComplaint(complaint)}
                >
                  <Eye className="h-4 w-4 mr-1" />
                  View
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Dialog open={!!selectedComplaint} onOpenChange={() => setSelectedComplaint(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Complaint Details - {selectedComplaint?.id}</DialogTitle>
          </DialogHeader>
          {selectedComplaint && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Customer</p>
                  <p className="font-medium">{selectedComplaint.customer}</p>
                  <p className="text-sm text-muted-foreground">{selectedComplaint.customerEmail}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Restaurant</p>
                  <p className="font-medium">{selectedComplaint.restaurant}</p>
                  {selectedComplaint.orderId && (
                    <p className="text-sm text-muted-foreground">Order: {selectedComplaint.orderId}</p>
                  )}
                </div>
              </div>

              <div>
                <p className="text-sm text-muted-foreground mb-1">Description</p>
                <p className="p-3 bg-muted rounded-lg">{selectedComplaint.description}</p>
              </div>

              {selectedComplaint.resolution && (
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Resolution</p>
                  <p className="p-3 bg-green-50 rounded-lg text-green-700">{selectedComplaint.resolution}</p>
                </div>
              )}

              {selectedComplaint.status !== "resolved" && (
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Add Resolution</p>
                  <Textarea
                    placeholder="Enter resolution details..."
                    value={resolution}
                    onChange={(e) => setResolution(e.target.value)}
                    rows={3}
                  />
                </div>
              )}

              <div className="flex gap-3 pt-4">
                {selectedComplaint.status === "open" && (
                  <Button variant="outline" className="bg-transparent">
                    <Clock className="h-4 w-4 mr-2" />
                    Mark In Progress
                  </Button>
                )}
                {selectedComplaint.status !== "resolved" && (
                  <Button>
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Resolve Complaint
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
