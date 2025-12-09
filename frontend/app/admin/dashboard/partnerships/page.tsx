"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Building, Mail, Phone, MapPin, User, CheckCircle, XCircle, Clock, Eye } from "lucide-react"
import { toast } from "sonner"
import { partnershipApi } from "@/lib/api"

interface PartnershipRequest {
  _id: string
  restaurantName: string
  ownerName: string
  email: string
  phone: string
  city: string
  status: "pending" | "approved" | "rejected"
  createdAt: string
  updatedAt: string
  approvedAt?: string
  rejectedAt?: string
  rejectionReason?: string
}

export default function PartnershipsPage() {
  const [requests, setRequests] = useState<PartnershipRequest[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [selectedRequest, setSelectedRequest] = useState<PartnershipRequest | null>(null)
  const [isApproveDialogOpen, setIsApproveDialogOpen] = useState(false)
  const [isRejectDialogOpen, setIsRejectDialogOpen] = useState(false)
  const [password, setPassword] = useState("")
  const [rejectionReason, setRejectionReason] = useState("")
  const [filter, setFilter] = useState<"all" | "pending" | "approved" | "rejected">("all")

  const fetchRequests = async () => {
    setIsLoading(true)
    try {
      const data = await partnershipApi.getRequests()
      setRequests(data.requests)
    } catch (error: any) {
      toast.error(error.message || "Failed to fetch partnership requests")
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchRequests()
  }, [])

  const handleApprove = async () => {
    if (!password || password.length < 8) {
      toast.error("Password must be at least 8 characters long")
      return
    }

    if (!selectedRequest) return

    try {
      await partnershipApi.approveRequest(selectedRequest._id, password)
      toast.success("Partnership request approved and credentials sent via email!")
      setIsApproveDialogOpen(false)
      setPassword("")
      setSelectedRequest(null)
      fetchRequests()
    } catch (error: any) {
      toast.error(error.message || "Failed to approve request")
    }
  }

  const handleReject = async () => {
    if (!selectedRequest) return

    try {
      await partnershipApi.rejectRequest(selectedRequest._id, rejectionReason)
      toast.success("Partnership request rejected")
      setIsRejectDialogOpen(false)
      setRejectionReason("")
      setSelectedRequest(null)
      fetchRequests()
    } catch (error: any) {
      toast.error(error.message || "Failed to reject request")
    }
  }

  const generatePassword = () => {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*"
    let password = ""
    for (let i = 0; i < 12; i++) {
      password += chars.charAt(Math.floor(Math.random() * chars.length))
    }
    setPassword(password)
  }

  const filteredRequests = requests.filter((req) => {
    if (filter === "all") return true
    return req.status === filter
  })

  const statusColors: Record<string, string> = {
    pending: "bg-yellow-100 text-yellow-700 border-yellow-200",
    approved: "bg-green-100 text-green-700 border-green-200",
    rejected: "bg-red-100 text-red-700 border-red-200",
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading partnership requests...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-navy">Partnership Requests</h2>
        <p className="text-muted-foreground">Manage restaurant partnership requests and approvals</p>
      </div>

      <Tabs value={filter} onValueChange={(value) => setFilter(value as any)}>
        <TabsList>
          <TabsTrigger value="all">All ({requests.length})</TabsTrigger>
          <TabsTrigger value="pending">
            Pending ({requests.filter((r) => r.status === "pending").length})
          </TabsTrigger>
          <TabsTrigger value="approved">
            Approved ({requests.filter((r) => r.status === "approved").length})
          </TabsTrigger>
          <TabsTrigger value="rejected">
            Rejected ({requests.filter((r) => r.status === "rejected").length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value={filter} className="mt-6">
          {filteredRequests.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center">
                <Building className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-50" />
                <p className="text-muted-foreground">No partnership requests found</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4">
              {filteredRequests.map((request) => (
                <Card key={request._id}>
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1 space-y-4">
                        <div className="flex items-center gap-3">
                          <h3 className="text-lg font-semibold text-navy">{request.restaurantName}</h3>
                          <Badge className={statusColors[request.status]} variant="outline">
                            {request.status}
                          </Badge>
                        </div>

                        <div className="grid md:grid-cols-2 gap-4">
                          <div className="flex items-center gap-2 text-sm">
                            <User className="h-4 w-4 text-muted-foreground" />
                            <span className="text-muted-foreground">Owner:</span>
                            <span className="font-medium">{request.ownerName}</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm">
                            <Mail className="h-4 w-4 text-muted-foreground" />
                            <span className="text-muted-foreground">Email:</span>
                            <span className="font-medium">{request.email}</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm">
                            <Phone className="h-4 w-4 text-muted-foreground" />
                            <span className="text-muted-foreground">Phone:</span>
                            <span className="font-medium">{request.phone}</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm">
                            <MapPin className="h-4 w-4 text-muted-foreground" />
                            <span className="text-muted-foreground">City:</span>
                            <span className="font-medium">{request.city}</span>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <Clock className="h-3 w-3" />
                          <span>Submitted: {new Date(request.createdAt).toLocaleString()}</span>
                        </div>
                      </div>

                      {request.status === "pending" && (
                        <div className="flex gap-2 ml-4">
                          <Button
                            size="sm"
                            onClick={() => {
                              setSelectedRequest(request)
                              setIsApproveDialogOpen(true)
                            }}
                            className="bg-green-600 hover:bg-green-700"
                          >
                            <CheckCircle className="h-4 w-4 mr-2" />
                            Approve
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => {
                              setSelectedRequest(request)
                              setIsRejectDialogOpen(true)
                            }}
                          >
                            <XCircle className="h-4 w-4 mr-2" />
                            Reject
                          </Button>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* Approve Dialog */}
      <Dialog open={isApproveDialogOpen} onOpenChange={setIsApproveDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Approve Partnership Request</DialogTitle>
            <DialogDescription>
              Create account for <strong>{selectedRequest?.restaurantName}</strong> and send credentials via email.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="password">Set Password</Label>
              <div className="flex gap-2">
                <Input
                  id="password"
                  type="text"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter password for restaurant account"
                  required
                  minLength={8}
                />
                <Button type="button" variant="outline" onClick={generatePassword}>
                  <Eye className="h-4 w-4 mr-2" />
                  Generate
                </Button>
              </div>
              <p className="text-xs text-muted-foreground">
                Password will be sent to {selectedRequest?.email} along with login credentials.
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsApproveDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleApprove} disabled={!password || password.length < 8}>
              <CheckCircle className="h-4 w-4 mr-2" />
              Approve & Send Credentials
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Reject Dialog */}
      <Dialog open={isRejectDialogOpen} onOpenChange={setIsRejectDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reject Partnership Request</DialogTitle>
            <DialogDescription>
              Are you sure you want to reject the request from <strong>{selectedRequest?.restaurantName}</strong>?
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="reason">Rejection Reason (Optional)</Label>
              <Input
                id="reason"
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                placeholder="Enter reason for rejection..."
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsRejectDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleReject}>
              <XCircle className="h-4 w-4 mr-2" />
              Reject Request
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

