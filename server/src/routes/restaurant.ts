import { Router, Request, Response } from "express"
import { getCollection } from "../config/mongodb"
import { requireAuth, AuthRequest } from "../middleware/auth"
import { ObjectId } from "mongodb"

const router = Router()

interface RestaurantProfile {
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
  logo: string
  images: string[]
  priceRange: "budget" | "moderate" | "expensive" | "luxury"
  avgCost: number
  openingHours: Array<{
    day: string
    openTime: string
    closeTime: string
    isClosed: boolean
  }>
  features: string[]
  gstNumber?: string
  fssaiLicense?: string
  bankAccountNumber?: string
  bankIfscCode?: string
  bankName?: string
  accountHolderName?: string
}

// Get restaurant profile (Restaurant owner only)
router.get("/profile", requireAuth(["restaurant"]), async (req: AuthRequest, res: Response) => {
  try {
    const restaurants = await getCollection("restaurants")
    const users = await getCollection("users")

    const user = await users.findOne({ _id: new ObjectId(req.user!.userId) })
    if (!user || !user.restaurantId) {
      return res.status(404).json({ error: "Restaurant not found" })
    }

    const restaurant = await restaurants.findOne({ _id: new ObjectId(user.restaurantId) })
    if (!restaurant) {
      return res.status(404).json({ error: "Restaurant not found" })
    }

    return res.json({ restaurant })
  } catch (error) {
    console.error("Get restaurant profile error:", error)
    return res.status(500).json({ error: "Internal server error" })
  }
})

// Update restaurant profile (Restaurant owner only)
router.put("/profile", requireAuth(["restaurant"]), async (req: AuthRequest, res: Response) => {
  try {
    const restaurants = await getCollection("restaurants")
    const users = await getCollection("users")

    const user = await users.findOne({ _id: new ObjectId(req.user!.userId) })
    if (!user || !user.restaurantId) {
      return res.status(404).json({ error: "Restaurant not found" })
    }

    const profileData: Partial<RestaurantProfile> = req.body

    // Update restaurant profile
    const updateData: any = {
      ...profileData,
      updatedAt: new Date(),
    }

    // Check if profile is complete (all required fields filled)
    const requiredFields = [
      "name",
      "description",
      "address",
      "city",
      "pincode",
      "phone",
      "cuisine",
      "openingHours",
      "priceRange",
    ]
    const isComplete = requiredFields.every((field) => {
      if (field === "cuisine") return Array.isArray(profileData.cuisine) && profileData.cuisine.length > 0
      if (field === "openingHours") return Array.isArray(profileData.openingHours) && profileData.openingHours.length > 0
      return profileData[field as keyof RestaurantProfile] !== undefined && profileData[field as keyof RestaurantProfile] !== ""
    })

    updateData.profileCompleted = isComplete

    await restaurants.updateOne({ _id: new ObjectId(user.restaurantId) }, { $set: updateData })

    const updatedRestaurant = await restaurants.findOne({ _id: new ObjectId(user.restaurantId) })

    return res.json({
      success: true,
      message: "Profile updated successfully",
      restaurant: updatedRestaurant,
      profileCompleted: isComplete,
    })
  } catch (error) {
    console.error("Update restaurant profile error:", error)
    return res.status(500).json({ error: "Internal server error" })
  }
})

// Submit profile for approval (Restaurant owner only)
router.post("/profile/submit", requireAuth(["restaurant"]), async (req: AuthRequest, res: Response) => {
  try {
    const restaurants = await getCollection("restaurants")
    const users = await getCollection("users")

    const user = await users.findOne({ _id: new ObjectId(req.user!.userId) })
    if (!user || !user.restaurantId) {
      return res.status(404).json({ error: "Restaurant not found" })
    }

    const restaurant = await restaurants.findOne({ _id: new ObjectId(user.restaurantId) })
    if (!restaurant) {
      return res.status(404).json({ error: "Restaurant not found" })
    }

    if (!restaurant.profileCompleted) {
      return res.status(400).json({ error: "Please complete your profile before submitting for approval" })
    }

    if (restaurant.approvalStatus === "approved") {
      return res.status(400).json({ error: "Restaurant is already approved" })
    }

    // Change status to pending_approval if profile is complete
    await restaurants.updateOne(
      { _id: new ObjectId(user.restaurantId) },
      {
        $set: {
          approvalStatus: "pending_approval",
          submittedForApprovalAt: new Date(),
          updatedAt: new Date(),
        },
      }
    )

    return res.json({
      success: true,
      message: "Profile submitted for approval. Our team will review it shortly.",
    })
  } catch (error) {
    console.error("Submit profile for approval error:", error)
    return res.status(500).json({ error: "Internal server error" })
  }
})

// Get all restaurants for admin review
router.get("/admin/restaurants", requireAuth(["admin"]), async (req: AuthRequest, res: Response) => {
  try {
    const restaurants = await getCollection("restaurants")
    const status = req.query.status as string

    const query: any = {}
    if (status) {
      query.approvalStatus = status
    }

    const restaurantList = await restaurants
      .find(query)
      .sort({ createdAt: -1 })
      .toArray()

    return res.json({ restaurants: restaurantList })
  } catch (error) {
    console.error("Get restaurants for admin error:", error)
    return res.status(500).json({ error: "Internal server error" })
  }
})

// Approve restaurant profile (Admin only)
router.post("/admin/approve/:id", requireAuth(["admin"]), async (req: AuthRequest, res: Response) => {
  try {
    const restaurantId = req.params.id
    const restaurants = await getCollection("restaurants")

    const restaurant = await restaurants.findOne({ _id: new ObjectId(restaurantId) })
    if (!restaurant) {
      return res.status(404).json({ error: "Restaurant not found" })
    }

    if (restaurant.approvalStatus === "approved") {
      return res.status(400).json({ error: "Restaurant is already approved" })
    }

    // Approve restaurant - now it can go live
    await restaurants.updateOne(
      { _id: new ObjectId(restaurantId) },
      {
        $set: {
          approvalStatus: "approved",
          isActive: true,
          isVerified: true,
          approvedAt: new Date(),
          approvedBy: req.user!.userId,
          updatedAt: new Date(),
        },
      }
    )

    return res.json({
      success: true,
      message: "Restaurant approved successfully. It can now accept bookings.",
    })
  } catch (error) {
    console.error("Approve restaurant error:", error)
    return res.status(500).json({ error: "Internal server error" })
  }
})

// Reject restaurant profile (Admin only)
router.post("/admin/reject/:id", requireAuth(["admin"]), async (req: AuthRequest, res: Response) => {
  try {
    const restaurantId = req.params.id
    const { reason } = req.body
    const restaurants = await getCollection("restaurants")

    const restaurant = await restaurants.findOne({ _id: new ObjectId(restaurantId) })
    if (!restaurant) {
      return res.status(404).json({ error: "Restaurant not found" })
    }

    await restaurants.updateOne(
      { _id: new ObjectId(restaurantId) },
      {
        $set: {
          approvalStatus: "rejected",
          isActive: false,
          rejectedAt: new Date(),
          rejectedBy: req.user!.userId,
          rejectionReason: reason || "",
          updatedAt: new Date(),
        },
      }
    )

    return res.json({
      success: true,
      message: "Restaurant profile rejected",
    })
  } catch (error) {
    console.error("Reject restaurant error:", error)
    return res.status(500).json({ error: "Internal server error" })
  }
})

export default router




