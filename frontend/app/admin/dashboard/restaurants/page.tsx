"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Search,
  Star,
  MapPin,
  MoreVertical,
  CheckCircle2,
  XCircle,
  Eye,
  Clock,
  Loader2,
  Building,
  Phone,
  Mail,
  Globe,
  DollarSign,
  Utensils,
} from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { toast } from "sonner"
import { adminRestaurantApi } from "@/lib/api"

interface Restaurant {
  _id: string
  name: string
  description: string
  cuisine: string[]
  address: string
  city: string
  state: string
  pincode: string
  phone: string
  email: string
  website: string
  priceRange: string
  avgCost: number
  openingHours: Array<{
    day: string
    openTime: string
    closeTime: string
    isClosed: boolean
  }>
  features: string[]
  approvalStatus: "pending_approval" | "approved" | "rejected"
  isActive: boolean
  isVerified: boolean
  profileCompleted: boolean
  createdAt: string
  submittedForApprovalAt?: string
  approvedAt?: string
  rejectedAt?: string
  rejectionReason?: string
}

const statusColors: Record<string, string> = {
  approved: "bg-green-100 text-green-700 border-green-200",
  pending_approval: "bg-yellow-100 text-yellow-700 border-yellow-200",
  rejected: "bg-red-100 text-red-700 border-red-200",
}

export default function AdminRestaurantsPage() {
  const [restaurants, setRestaurants] = useState<Restaurant[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("all")
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedRestaurant, setSelectedRestaurant] = useState<Restaurant | null>(null)
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false)
  const [isRejectDialogOpen, setIsRejectDialogOpen] = useState(false)
  const [rejectionReason, setRejectionReason] = useState("")
  const [isProcessing, setIsProcessing] = useState<string | null>(null)

  const fetchRestaurants = async (status?: string) => {
    setIsLoading(true)
    try {
      const data = await adminRestaurantApi.getRestaurants(status)
      setRestaurants(data.restaurants)
    } catch (error: any) {
      toast.error(error.message || "Failed to fetch restaurants")
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchRestaurants()
  }, [])

  useEffect(() => {
    if (activeTab === "all") {
      fetchRestaurants()
    } else if (activeTab === "pending") {
      fetchRestaurants("pending_approval")
    } else if (activeTab === "approved") {
      fetchRestaurants("approved")
    } else if (activeTab === "rejected") {
      fetchRestaurants("rejected")
    }
  }, [activeTab])

  const handleApprove = async (restaurantId: string) => {
    setIsProcessing(restaurantId)
    try {
      await adminRestaurantApi.approveRestaurant(restaurantId)
      toast.success("Restaurant approved successfully! It can now accept bookings.")
      fetchRestaurants(activeTab === "all" ? undefined : activeTab === "pending" ? "pending_approval" : activeTab)
      setIsViewDialogOpen(false)
      setSelectedRestaurant(null)
    } catch (error: any) {
      toast.error(error.message || "Failed to approve restaurant")
    } finally {
      setIsProcessing(null)
    }
  }

  const handleReject = async () => {
    if (!selectedRestaurant) return

    setIsProcessing(selectedRestaurant._id)
    try {
      await adminRestaurantApi.rejectRestaurant(selectedRestaurant._id, rejectionReason)
      toast.success("Restaurant profile rejected")
      setIsRejectDialogOpen(false)
      setRejectionReason("")
      setSelectedRestaurant(null)
      fetchRestaurants(activeTab === "all" ? undefined : activeTab === "pending" ? "pending_approval" : activeTab)
    } catch (error: any) {
      toast.error(error.message || "Failed to reject restaurant")
    } finally {
      setIsProcessing(null)
    }
  }

  const filteredRestaurants = restaurants.filter(
    (r) =>
      r.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.email.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const pendingRestaurants = restaurants.filter((r) => r.approvalStatus === "pending_approval")
  const approvedRestaurants = restaurants.filter((r) => r.approvalStatus === "approved")
  const rejectedRestaurants = restaurants.filter((r) => r.approvalStatus === "rejected")

  if (isLoading) {
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
          <h2 className="text-2xl font-bold text-navy">Restaurant Management</h2>
          <p className="text-muted-foreground">Review and approve restaurant profiles</p>
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
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="all">All ({restaurants.length})</TabsTrigger>
          <TabsTrigger value="pending">Pending ({pendingRestaurants.length})</TabsTrigger>
          <TabsTrigger value="approved">Approved ({approvedRestaurants.length})</TabsTrigger>
          <TabsTrigger value="rejected">Rejected ({rejectedRestaurants.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="mt-6">
          <Card>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Restaurant</TableHead>
                      <TableHead>Location</TableHead>
                      <TableHead>Cuisine</TableHead>
                      <TableHead>Contact</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredRestaurants.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                          No restaurants found
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredRestaurants.map((restaurant) => (
                        <TableRow key={restaurant._id}>
                          <TableCell>
                            <div>
                              <p className="font-medium text-navy">{restaurant.name}</p>
                              <p className="text-sm text-muted-foreground">{restaurant.description?.substring(0, 50)}...</p>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-1 text-sm text-muted-foreground">
                              <MapPin className="h-3 w-3" />
                              {restaurant.city}, {restaurant.state}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex flex-wrap gap-1">
                              {restaurant.cuisine?.slice(0, 2).map((c) => (
                                <Badge key={c} variant="outline" className="text-xs">
                                  {c}
                                </Badge>
                              ))}
                              {restaurant.cuisine?.length > 2 && (
                                <Badge variant="outline" className="text-xs">
                                  +{restaurant.cuisine.length - 2}
                                </Badge>
                              )}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="text-sm">
                              <div className="flex items-center gap-1 text-muted-foreground">
                                <Phone className="h-3 w-3" />
                                {restaurant.phone}
                              </div>
                              <div className="flex items-center gap-1 text-muted-foreground">
                                <Mail className="h-3 w-3" />
                                {restaurant.email}
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge className={statusColors[restaurant.approvalStatus]} variant="outline">
                              {restaurant.approvalStatus === "pending_approval" ? (
                                <>
                                  <Clock className="h-3 w-3 mr-1" />
                                  Pending
                                </>
                              ) : restaurant.approvalStatus === "approved" ? (
                                <>
                                  <CheckCircle2 className="h-3 w-3 mr-1" />
                                  Approved
                                </>
                              ) : (
                                <>
                                  <XCircle className="h-3 w-3 mr-1" />
                                  Rejected
                                </>
                              )}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex items-center justify-end gap-2">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => {
                                  setSelectedRestaurant(restaurant)
                                  setIsViewDialogOpen(true)
                                }}
                              >
                                <Eye className="h-4 w-4 mr-1" />
                                View
                              </Button>
                              {restaurant.approvalStatus === "pending_approval" && (
                                <>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    className="text-green-600 hover:text-green-700"
                                    onClick={() => handleApprove(restaurant._id)}
                                    disabled={isProcessing === restaurant._id}
                                  >
                                    {isProcessing === restaurant._id ? (
                                      <Loader2 className="h-4 w-4 animate-spin" />
                                    ) : (
                                      <>
                                        <CheckCircle2 className="h-4 w-4 mr-1" />
                                        Approve
                                      </>
                                    )}
                                  </Button>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    className="text-red-600 hover:text-red-700"
                                    onClick={() => {
                                      setSelectedRestaurant(restaurant)
                                      setIsRejectDialogOpen(true)
                                    }}
                                    disabled={isProcessing === restaurant._id}
                                  >
                                    <XCircle className="h-4 w-4 mr-1" />
                                    Reject
                                  </Button>
                                </>
                              )}
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="pending" className="mt-6">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {pendingRestaurants.length === 0 ? (
              <div className="col-span-full text-center py-8 text-muted-foreground">
                No pending restaurants
              </div>
            ) : (
              pendingRestaurants.map((restaurant) => (
                <Card key={restaurant._id}>
                  <CardHeader className="pb-2">
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-base">{restaurant.name}</CardTitle>
                        <p className="text-sm text-muted-foreground">
                          {restaurant.cuisine?.join(", ") || "No cuisine specified"}
                        </p>
                      </div>
                      <Badge className={statusColors[restaurant.approvalStatus]} variant="outline">
                        <Clock className="h-3 w-3 mr-1" />
                        Pending
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center gap-2">
                        <MapPin className="h-3 w-3 text-muted-foreground" />
                        <span className="text-muted-foreground">{restaurant.city}, {restaurant.state}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Phone className="h-3 w-3 text-muted-foreground" />
                        <span className="text-muted-foreground">{restaurant.phone}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Mail className="h-3 w-3 text-muted-foreground" />
                        <span className="text-muted-foreground truncate">{restaurant.email}</span>
                      </div>
                    </div>
                    <div className="flex gap-2 pt-2">
                      <Button
                        className="flex-1"
                        size="sm"
                        onClick={() => handleApprove(restaurant._id)}
                        disabled={isProcessing === restaurant._id}
                      >
                        {isProcessing === restaurant._id ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <>
                            <CheckCircle2 className="h-4 w-4 mr-1" />
                            Approve
                          </>
                        )}
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-1 text-destructive hover:text-destructive"
                        onClick={() => {
                          setSelectedRestaurant(restaurant)
                          setIsRejectDialogOpen(true)
                        }}
                        disabled={isProcessing === restaurant._id}
                      >
                        <XCircle className="h-4 w-4 mr-1" />
                        Reject
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </TabsContent>

        <TabsContent value="approved" className="mt-6">
          <Card>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Restaurant</TableHead>
                      <TableHead>Location</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {approvedRestaurants.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={4} className="text-center py-8 text-muted-foreground">
                          No approved restaurants
                        </TableCell>
                      </TableRow>
                    ) : (
                      approvedRestaurants.map((restaurant) => (
                        <TableRow key={restaurant._id}>
                          <TableCell>
                            <div>
                              <p className="font-medium text-navy">{restaurant.name}</p>
                              <p className="text-sm text-muted-foreground">{restaurant.city}</p>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-1 text-sm text-muted-foreground">
                              <MapPin className="h-3 w-3" />
                              {restaurant.city}, {restaurant.state}
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge className={statusColors[restaurant.approvalStatus]} variant="outline">
                              <CheckCircle2 className="h-3 w-3 mr-1" />
                              Live
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => {
                                setSelectedRestaurant(restaurant)
                                setIsViewDialogOpen(true)
                              }}
                            >
                              <Eye className="h-4 w-4 mr-1" />
                              View
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="rejected" className="mt-6">
          <Card>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Restaurant</TableHead>
                      <TableHead>Location</TableHead>
                      <TableHead>Rejection Reason</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {rejectedRestaurants.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={4} className="text-center py-8 text-muted-foreground">
                          No rejected restaurants
                        </TableCell>
                      </TableRow>
                    ) : (
                      rejectedRestaurants.map((restaurant) => (
                        <TableRow key={restaurant._id}>
                          <TableCell>
                            <div>
                              <p className="font-medium text-navy">{restaurant.name}</p>
                              <p className="text-sm text-muted-foreground">{restaurant.city}</p>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-1 text-sm text-muted-foreground">
                              <MapPin className="h-3 w-3" />
                              {restaurant.city}, {restaurant.state}
                            </div>
                          </TableCell>
                          <TableCell>
                            <p className="text-sm text-muted-foreground">
                              {restaurant.rejectionReason || "No reason provided"}
                            </p>
                          </TableCell>
                          <TableCell className="text-right">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => {
                                setSelectedRestaurant(restaurant)
                                setIsViewDialogOpen(true)
                              }}
                            >
                              <Eye className="h-4 w-4 mr-1" />
                              View
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* View Restaurant Details Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Building className="h-5 w-5" />
              {selectedRestaurant?.name}
            </DialogTitle>
            <DialogDescription>Complete restaurant profile details</DialogDescription>
          </DialogHeader>

          {selectedRestaurant && (
            <div className="space-y-6">
              {/* Basic Info */}
              <div>
                <h3 className="font-semibold mb-3">Basic Information</h3>
                <div className="grid gap-3 text-sm">
                  <div>
                    <span className="text-muted-foreground">Description:</span>
                    <p className="mt-1">{selectedRestaurant.description || "Not provided"}</p>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <span className="text-muted-foreground">Cuisine:</span>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {selectedRestaurant.cuisine?.map((c) => (
                          <Badge key={c} variant="outline" className="text-xs">
                            {c}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Price Range:</span>
                      <p className="mt-1 capitalize">{selectedRestaurant.priceRange}</p>
                    </div>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Average Cost:</span>
                    <p className="mt-1">₹{selectedRestaurant.avgCost || 0} per person</p>
                  </div>
                </div>
              </div>

              {/* Location */}
              <div>
                <h3 className="font-semibold mb-3">Location</h3>
                <div className="grid gap-2 text-sm">
                  <div>
                    <span className="text-muted-foreground">Address:</span>
                    <p className="mt-1">{selectedRestaurant.address || "Not provided"}</p>
                  </div>
                  <div className="grid grid-cols-3 gap-3">
                    <div>
                      <span className="text-muted-foreground">City:</span>
                      <p className="mt-1">{selectedRestaurant.city}</p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">State:</span>
                      <p className="mt-1">{selectedRestaurant.state}</p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Pincode:</span>
                      <p className="mt-1">{selectedRestaurant.pincode}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Contact */}
              <div>
                <h3 className="font-semibold mb-3">Contact Information</h3>
                <div className="grid gap-2 text-sm">
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <span>{selectedRestaurant.phone}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <span>{selectedRestaurant.email}</span>
                  </div>
                  {selectedRestaurant.website && (
                    <div className="flex items-center gap-2">
                      <Globe className="h-4 w-4 text-muted-foreground" />
                      <a href={selectedRestaurant.website} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                        {selectedRestaurant.website}
                      </a>
                    </div>
                  )}
                </div>
              </div>

              {/* Opening Hours */}
              <div>
                <h3 className="font-semibold mb-3">Opening Hours</h3>
                <div className="space-y-2 text-sm">
                  {selectedRestaurant.openingHours?.map((oh) => (
                    <div key={oh.day} className="flex items-center justify-between">
                      <span className="font-medium">{oh.day}</span>
                      <span className="text-muted-foreground">
                        {oh.isClosed ? "Closed" : `${oh.openTime} - ${oh.closeTime}`}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Features */}
              {selectedRestaurant.features && selectedRestaurant.features.length > 0 && (
                <div>
                  <h3 className="font-semibold mb-3">Features & Amenities</h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedRestaurant.features.map((f) => (
                      <Badge key={f} variant="outline">
                        {f}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {/* Status */}
              <div>
                <h3 className="font-semibold mb-3">Status</h3>
                <div className="grid gap-2 text-sm">
                  <div className="flex items-center gap-2">
                    <span className="text-muted-foreground">Approval Status:</span>
                    <Badge className={statusColors[selectedRestaurant.approvalStatus]} variant="outline">
                      {selectedRestaurant.approvalStatus}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-muted-foreground">Profile Completed:</span>
                    <Badge variant={selectedRestaurant.profileCompleted ? "default" : "outline"}>
                      {selectedRestaurant.profileCompleted ? "Yes" : "No"}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-muted-foreground">Is Active:</span>
                    <Badge variant={selectedRestaurant.isActive ? "default" : "outline"}>
                      {selectedRestaurant.isActive ? "Yes" : "No"}
                    </Badge>
                  </div>
                </div>
              </div>
            </div>
          )}

          <DialogFooter>
            {selectedRestaurant?.approvalStatus === "pending_approval" && (
              <>
                <Button
                  variant="outline"
                  onClick={() => {
                    setSelectedRestaurant(selectedRestaurant)
                    setIsRejectDialogOpen(true)
                    setIsViewDialogOpen(false)
                  }}
                >
                  <XCircle className="h-4 w-4 mr-2" />
                  Reject
                </Button>
                <Button
                  onClick={() => handleApprove(selectedRestaurant._id)}
                  disabled={isProcessing === selectedRestaurant._id}
                >
                  {isProcessing === selectedRestaurant._id ? (
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  ) : (
                    <CheckCircle2 className="h-4 w-4 mr-2" />
                  )}
                  Approve
                </Button>
              </>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Reject Dialog */}
      <Dialog open={isRejectDialogOpen} onOpenChange={setIsRejectDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reject Restaurant Profile</DialogTitle>
            <DialogDescription>
              Please provide a reason for rejection. This will help the restaurant owner improve their profile.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="rejectionReason">Rejection Reason (Optional)</Label>
              <Textarea
                id="rejectionReason"
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                placeholder="e.g., Incomplete information, missing documents, etc."
                rows={4}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsRejectDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleReject} disabled={isProcessing === selectedRestaurant?._id}>
              {isProcessing === selectedRestaurant?._id ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <XCircle className="h-4 w-4 mr-2" />
              )}
              Reject
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
