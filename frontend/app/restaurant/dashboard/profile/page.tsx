"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  Save,
  CheckCircle2,
  Clock,
  XCircle,
  Building,
  MapPin,
  Phone,
  Mail,
  Globe,
  DollarSign,
  Clock as ClockIcon,
  Utensils,
  Image as ImageIcon,
  FileText,
  CreditCard,
  AlertCircle,
} from "lucide-react"
import { toast } from "sonner"
import { restaurantApi } from "@/lib/api"

const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]
const CUISINE_OPTIONS = [
  "Indian",
  "Chinese",
  "Italian",
  "Mexican",
  "Thai",
  "Japanese",
  "American",
  "Continental",
  "Fast Food",
  "Desserts",
  "Beverages",
  "Fusion",
  "Other",
]

const FEATURES_OPTIONS = [
  "WiFi",
  "Parking",
  "Outdoor Seating",
  "Live Music",
  "Bar",
  "Family Friendly",
  "Pet Friendly",
  "Wheelchair Accessible",
  "Takeout",
  "Delivery",
  "Reservations",
  "Private Dining",
]

export default function RestaurantProfilePage() {
  const [isLoading, setIsLoading] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [profile, setProfile] = useState({
    name: "",
    description: "",
    cuisine: [] as string[],
    address: "",
    city: "",
    state: "",
    pincode: "",
    phone: "",
    email: "",
    website: "",
    logo: "",
    images: [] as string[],
    priceRange: "moderate" as "budget" | "moderate" | "expensive" | "luxury",
    avgCost: 0,
    openingHours: DAYS.map((day) => ({
      day,
      openTime: "09:00",
      closeTime: "22:00",
      isClosed: false,
    })),
    features: [] as string[],
    gstNumber: "",
    fssaiLicense: "",
    bankAccountNumber: "",
    bankIfscCode: "",
    bankName: "",
    accountHolderName: "",
  })

  const [restaurantStatus, setRestaurantStatus] = useState<{
    approvalStatus: "pending_approval" | "approved" | "rejected"
    isActive: boolean
    isVerified: boolean
    profileCompleted: boolean
  } | null>(null)

  useEffect(() => {
    fetchProfile()
  }, [])

  const fetchProfile = async () => {
    setIsLoading(true)
    try {
      const data = await restaurantApi.getProfile()
      if (data.restaurant) {
        const r = data.restaurant
        setProfile({
          name: r.name || "",
          description: r.description || "",
          cuisine: r.cuisine || [],
          address: r.address || "",
          city: r.city || "",
          state: r.state || "",
          pincode: r.pincode || "",
          phone: r.phone || "",
          email: r.email || "",
          website: r.website || "",
          logo: r.logo || "",
          images: r.images || [],
          priceRange: r.priceRange || "moderate",
          avgCost: r.avgCost || 0,
          openingHours:
            r.openingHours && r.openingHours.length > 0
              ? r.openingHours
              : DAYS.map((day) => ({
                  day,
                  openTime: "09:00",
                  closeTime: "22:00",
                  isClosed: false,
                })),
          features: r.features || [],
          gstNumber: r.gstNumber || "",
          fssaiLicense: r.fssaiLicense || "",
          bankAccountNumber: r.bankAccountNumber || "",
          bankIfscCode: r.bankIfscCode || "",
          bankName: r.bankName || "",
          accountHolderName: r.accountHolderName || "",
        })
        setRestaurantStatus({
          approvalStatus: r.approvalStatus || "pending_approval",
          isActive: r.isActive || false,
          isVerified: r.isVerified || false,
          profileCompleted: r.profileCompleted || false,
        })
      }
    } catch (error: any) {
      toast.error(error.message || "Failed to load profile")
    } finally {
      setIsLoading(false)
    }
  }

  const handleSave = async () => {
    setIsLoading(true)
    try {
      const data = await restaurantApi.updateProfile(profile)
      toast.success(data.message || "Profile updated successfully!")
      if (data.profileCompleted) {
        toast.info("Profile is complete! You can now submit for approval.")
      }
      fetchProfile()
    } catch (error: any) {
      toast.error(error.message || "Failed to update profile")
    } finally {
      setIsLoading(false)
    }
  }

  const handleSubmitForApproval = async () => {
    setIsSubmitting(true)
    try {
      const data = await restaurantApi.submitForApproval()
      toast.success(data.message || "Profile submitted for approval!")
      fetchProfile()
    } catch (error: any) {
      // Display detailed error message if server provides missing fields
      if (error.response?.data?.missingFields) {
        const missingFields = error.response.data.missingFields
        toast.error(
          `Missing required fields: ${missingFields.join(", ")}`,
          { duration: 5000 }
        )
      } else if (error.response?.data?.message) {
        toast.error(error.response.data.message, { duration: 5000 })
      } else {
        toast.error(error.message || "Failed to submit for approval")
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  const toggleCuisine = (cuisine: string) => {
    setProfile({
      ...profile,
      cuisine: profile.cuisine.includes(cuisine)
        ? profile.cuisine.filter((c) => c !== cuisine)
        : [...profile.cuisine, cuisine],
    })
  }

  const toggleFeature = (feature: string) => {
    setProfile({
      ...profile,
      features: profile.features.includes(feature)
        ? profile.features.filter((f) => f !== feature)
        : [...profile.features, feature],
    })
  }

  const updateOpeningHours = (day: string, field: string, value: any) => {
    setProfile({
      ...profile,
      openingHours: profile.openingHours.map((oh) =>
        oh.day === day ? { ...oh, [field]: value } : oh
      ),
    })
  }

  const getStatusBadge = () => {
    if (!restaurantStatus) return null

    if (restaurantStatus.approvalStatus === "approved" && restaurantStatus.isActive) {
      return (
        <Badge className="bg-green-100 text-green-700 border-green-200">
          <CheckCircle2 className="h-3 w-3 mr-1" />
          Live & Active
        </Badge>
      )
    }

    if (restaurantStatus.approvalStatus === "pending_approval") {
      return (
        <Badge className="bg-yellow-100 text-yellow-700 border-yellow-200">
          <Clock className="h-3 w-3 mr-1" />
          Pending Approval
        </Badge>
      )
    }

    if (restaurantStatus.approvalStatus === "rejected") {
      return (
        <Badge className="bg-red-100 text-red-700 border-red-200">
          <XCircle className="h-3 w-3 mr-1" />
          Rejected
        </Badge>
      )
    }

    return (
      <Badge className="bg-gray-100 text-gray-700 border-gray-200">
        <AlertCircle className="h-3 w-3 mr-1" />
        Incomplete Profile
      </Badge>
    )
  }

  if (isLoading && !restaurantStatus) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <p className="text-muted-foreground">Loading profile...</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-navy">
            {restaurantStatus?.profileCompleted ? "Restaurant Profile" : "Restaurant Setup"}
          </h2>
          <p className="text-muted-foreground">
            {restaurantStatus?.profileCompleted 
              ? "Manage your restaurant details" 
              : "Complete your restaurant details to go live"}
          </p>
        </div>
        {getStatusBadge()}
      </div>

      {restaurantStatus && !restaurantStatus.profileCompleted && (
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Please complete all required fields (marked with *) to submit your profile for approval.
          </AlertDescription>
        </Alert>
      )}

      {restaurantStatus && restaurantStatus.profileCompleted && restaurantStatus.approvalStatus === "pending_approval" && (
        <Alert>
          <Clock className="h-4 w-4" />
          <AlertDescription>
            Your profile is pending admin approval. You will be notified once it's reviewed.
          </AlertDescription>
        </Alert>
      )}

      {restaurantStatus && restaurantStatus.approvalStatus === "rejected" && (
        <Alert variant="destructive">
          <XCircle className="h-4 w-4" />
          <AlertDescription>
            Your profile was rejected. Please review and update your information, then resubmit for approval.
          </AlertDescription>
        </Alert>
      )}

      <div className="grid gap-6">
        {/* Basic Information */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Building className="h-5 w-5" />
              Basic Information
            </CardTitle>
            <CardDescription>Essential details about your restaurant</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="name">Restaurant Name *</Label>
                <Input
                  id="name"
                  value={profile.name}
                  onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                  placeholder="Your Restaurant Name"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number *</Label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="phone"
                    className="pl-9"
                    value={profile.phone}
                    onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                    placeholder="+91 98765 43210"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description *</Label>
              <Textarea
                id="description"
                value={profile.description}
                onChange={(e) => setProfile({ ...profile, description: e.target.value })}
                placeholder="Tell us about your restaurant..."
                rows={4}
              />
            </div>

            <div className="space-y-2">
              <Label>Cuisine Types *</Label>
              <div className="flex flex-wrap gap-2">
                {CUISINE_OPTIONS.map((cuisine) => (
                  <Badge
                    key={cuisine}
                    variant={profile.cuisine.includes(cuisine) ? "default" : "outline"}
                    className="cursor-pointer"
                    onClick={() => toggleCuisine(cuisine)}
                  >
                    {cuisine}
                  </Badge>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Location Information */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <MapPin className="h-5 w-5" />
              Location Information
            </CardTitle>
            <CardDescription>Where is your restaurant located?</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="address">Full Address *</Label>
              <Textarea
                id="address"
                value={profile.address}
                onChange={(e) => setProfile({ ...profile, address: e.target.value })}
                placeholder="Street address, building name, etc."
                rows={2}
              />
            </div>

            <div className="grid gap-4 md:grid-cols-3">
              <div className="space-y-2">
                <Label htmlFor="city">City *</Label>
                <Input
                  id="city"
                  value={profile.city}
                  onChange={(e) => setProfile({ ...profile, city: e.target.value })}
                  placeholder="City"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="state">State *</Label>
                <Input
                  id="state"
                  value={profile.state}
                  onChange={(e) => setProfile({ ...profile, state: e.target.value })}
                  placeholder="State"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="pincode">Pincode *</Label>
                <Input
                  id="pincode"
                  value={profile.pincode}
                  onChange={(e) => setProfile({ ...profile, pincode: e.target.value })}
                  placeholder="123456"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Contact & Website */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Mail className="h-5 w-5" />
              Contact & Website
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    className="pl-9"
                    value={profile.email}
                    onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                    placeholder="restaurant@example.com"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="website">Website</Label>
                <div className="relative">
                  <Globe className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="website"
                    type="url"
                    className="pl-9"
                    value={profile.website}
                    onChange={(e) => setProfile({ ...profile, website: e.target.value })}
                    placeholder="https://yourrestaurant.com"
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Pricing & Hours */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <DollarSign className="h-5 w-5" />
              Pricing & Operating Hours
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="priceRange">Price Range *</Label>
                <Select
                  value={profile.priceRange}
                  onValueChange={(value: any) => setProfile({ ...profile, priceRange: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="budget">Budget</SelectItem>
                    <SelectItem value="moderate">Moderate</SelectItem>
                    <SelectItem value="expensive">Expensive</SelectItem>
                    <SelectItem value="luxury">Luxury</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="avgCost">Average Cost per Person (₹) *</Label>
                <Input
                  id="avgCost"
                  type="number"
                  value={profile.avgCost}
                  onChange={(e) => setProfile({ ...profile, avgCost: parseInt(e.target.value) || 0 })}
                  placeholder="500"
                />
              </div>
            </div>

            <Separator />

            <div className="space-y-2">
              <Label>Opening Hours *</Label>
              <div className="space-y-3">
                {profile.openingHours.map((oh) => (
                  <div key={oh.day} className="flex items-center gap-4">
                    <div className="w-24 text-sm font-medium">{oh.day}</div>
                    <div className="flex items-center gap-2 flex-1">
                      <Input
                        type="time"
                        value={oh.openTime}
                        onChange={(e) => updateOpeningHours(oh.day, "openTime", e.target.value)}
                        disabled={oh.isClosed}
                        className="w-32"
                      />
                      <span className="text-muted-foreground">to</span>
                      <Input
                        type="time"
                        value={oh.closeTime}
                        onChange={(e) => updateOpeningHours(oh.day, "closeTime", e.target.value)}
                        disabled={oh.isClosed}
                        className="w-32"
                      />
                      <Button
                        type="button"
                        variant={oh.isClosed ? "default" : "outline"}
                        size="sm"
                        onClick={() => updateOpeningHours(oh.day, "isClosed", !oh.isClosed)}
                      >
                        {oh.isClosed ? "Closed" : "Open"}
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Features */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Utensils className="h-5 w-5" />
              Features & Amenities
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {FEATURES_OPTIONS.map((feature) => (
                <Badge
                  key={feature}
                  variant={profile.features.includes(feature) ? "default" : "outline"}
                  className="cursor-pointer"
                  onClick={() => toggleFeature(feature)}
                >
                  {feature}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Business Information */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Business Information
            </CardTitle>
            <CardDescription>Legal and financial details</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="gstNumber">GST Number</Label>
                <Input
                  id="gstNumber"
                  value={profile.gstNumber}
                  onChange={(e) => setProfile({ ...profile, gstNumber: e.target.value })}
                  placeholder="29ABCDE1234F1Z5"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="fssaiLicense">FSSAI License Number</Label>
                <Input
                  id="fssaiLicense"
                  value={profile.fssaiLicense}
                  onChange={(e) => setProfile({ ...profile, fssaiLicense: e.target.value })}
                  placeholder="FSSAI License Number"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Bank Details */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <CreditCard className="h-5 w-5" />
              Bank Account Details
            </CardTitle>
            <CardDescription>For payment settlements</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="accountHolderName">Account Holder Name</Label>
                <Input
                  id="accountHolderName"
                  value={profile.accountHolderName}
                  onChange={(e) => setProfile({ ...profile, accountHolderName: e.target.value })}
                  placeholder="Account Holder Name"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="bankName">Bank Name</Label>
                <Input
                  id="bankName"
                  value={profile.bankName}
                  onChange={(e) => setProfile({ ...profile, bankName: e.target.value })}
                  placeholder="Bank Name"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="bankAccountNumber">Account Number</Label>
                <Input
                  id="bankAccountNumber"
                  value={profile.bankAccountNumber}
                  onChange={(e) => setProfile({ ...profile, bankAccountNumber: e.target.value })}
                  placeholder="Account Number"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="bankIfscCode">IFSC Code</Label>
                <Input
                  id="bankIfscCode"
                  value={profile.bankIfscCode}
                  onChange={(e) => setProfile({ ...profile, bankIfscCode: e.target.value })}
                  placeholder="ABCD0123456"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Actions */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-sm text-muted-foreground">
                  {restaurantStatus?.profileCompleted
                    ? "Profile is complete. You can submit for approval."
                    : "Please complete all required fields (marked with *) before submitting."}
                </p>
              </div>
              <div className="flex gap-2">
                <Button onClick={handleSave} disabled={isLoading} variant="outline">
                  <Save className="h-4 w-4 mr-2" />
                  {isLoading ? "Saving..." : "Save Draft"}
                </Button>
                {restaurantStatus?.profileCompleted &&
                  restaurantStatus.approvalStatus !== "approved" && (
                    <Button
                      onClick={handleSubmitForApproval}
                      disabled={isSubmitting || restaurantStatus.approvalStatus === "pending_approval"}
                    >
                      <CheckCircle2 className="h-4 w-4 mr-2" />
                      {restaurantStatus.approvalStatus === "pending_approval"
                        ? "Pending Approval"
                        : isSubmitting
                          ? "Submitting..."
                          : "Submit for Approval"}
                    </Button>
                  )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
