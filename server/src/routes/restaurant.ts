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

    // Generate slug from restaurant name if name is being updated
    let slug = undefined
    if (profileData.name) {
      slug = profileData.name
        .toLowerCase()
        .trim()
        .replace(/[^\w\s-]/g, "") // Remove special characters
        .replace(/\s+/g, "-") // Replace spaces with hyphens
        .replace(/-+/g, "-") // Replace multiple hyphens with single hyphen
        .replace(/^-+|-+$/g, "") // Remove leading/trailing hyphens
      
      // Ensure slug is unique (add restaurant ID as fallback)
      const existingWithSlug = await restaurants.findOne({ slug, _id: { $ne: new ObjectId(user.restaurantId) } })
      if (existingWithSlug) {
        slug = `${slug}-${user.restaurantId.toString().slice(-6)}`
      }
    }

    // Update restaurant profile
    const updateData: any = {
      ...profileData,
      updatedAt: new Date(),
    }
    
    if (slug) {
      updateData.slug = slug
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
      "logo",
      "images",
    ]
    const isComplete = requiredFields.every((field) => {
      if (field === "cuisine") return Array.isArray(profileData.cuisine) && profileData.cuisine.length > 0
      if (field === "openingHours") return Array.isArray(profileData.openingHours) && profileData.openingHours.length > 0
      if (field === "images") return Array.isArray(profileData.images) && profileData.images.length > 0
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

    // Check which required fields are missing
    const requiredFields = {
      name: "Restaurant name",
      description: "Restaurant description",
      address: "Street address",
      city: "City",
      state: "State",
      pincode: "Pincode",
      phone: "Phone number",
      email: "Email address",
      cuisine: "Cuisine types",
      openingHours: "Opening hours",
      priceRange: "Price range",
      logo: "Restaurant logo",
      images: "Restaurant images (at least 1)",
    }

    const missingFields: string[] = []
    const fieldChecks: Record<string, () => boolean> = {
      name: () => !restaurant.name || restaurant.name.trim() === "",
      description: () => !restaurant.description || restaurant.description.trim() === "",
      address: () => !restaurant.address || restaurant.address.trim() === "",
      city: () => !restaurant.city || restaurant.city.trim() === "",
      state: () => !restaurant.state || restaurant.state.trim() === "",
      pincode: () => !restaurant.pincode || restaurant.pincode.trim() === "",
      phone: () => !restaurant.phone || restaurant.phone.trim() === "",
      email: () => !restaurant.email || restaurant.email.trim() === "",
      cuisine: () => !Array.isArray(restaurant.cuisine) || restaurant.cuisine.length === 0,
      openingHours: () => !Array.isArray(restaurant.openingHours) || restaurant.openingHours.length === 0,
      priceRange: () => !restaurant.priceRange,
      logo: () => !restaurant.logo || restaurant.logo.trim() === "",
      images: () => !Array.isArray(restaurant.images) || restaurant.images.length === 0,
    }

    for (const [field, checkFn] of Object.entries(fieldChecks)) {
      if (checkFn()) {
        missingFields.push(requiredFields[field as keyof typeof requiredFields])
      }
    }

    if (missingFields.length > 0) {
      return res.status(400).json({
        error: "Please complete your profile before submitting for approval",
        missingFields,
        message: `Missing required fields: ${missingFields.join(", ")}`,
      })
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

// Public endpoint: Get all approved restaurants
router.get("/public/restaurants", async (req: Request, res: Response) => {
  try {
    const restaurants = await getCollection("restaurants")
    const query = req.query

    // Build filter query
    const filter: any = {
      approvalStatus: "approved",
      isActive: true,
    }

    // Optional filters
    if (query.city) {
      filter.city = { $regex: query.city as string, $options: "i" }
    }
    if (query.cuisine) {
      filter.cuisine = { $in: [query.cuisine as string] }
    }
    if (query.search) {
      const searchRegex = { $regex: query.search as string, $options: "i" }
      filter.$or = [
        { name: searchRegex },
        { description: searchRegex },
        { cuisine: { $in: [query.search as string] } },
      ]
    }

    const restaurantList = await restaurants
      .find(filter)
      .sort({ createdAt: -1 })
      .toArray()

    // Transform data for public consumption (remove sensitive fields)
    const publicRestaurants = restaurantList.map((r) => ({
      _id: r._id,
      id: r._id.toString(),
      slug: r.slug || r._id.toString(),
      name: r.name,
      description: r.description,
      cuisine: r.cuisine,
      address: r.address,
      city: r.city,
      state: r.state,
      pincode: r.pincode,
      phone: r.phone,
      email: r.email,
      website: r.website,
      logo: r.logo,
      images: r.images,
      priceRange: r.priceRange,
      avgCost: r.avgCost,
      openingHours: r.openingHours,
      features: r.features,
      rating: r.rating || 0,
      totalReviews: r.totalReviews || 0,
      isOpen: checkIfOpen(r.openingHours || []),
      distance: r.distance || "N/A",
      deliveryTime: r.deliveryTime || "30-40 min",
      tables: [], // Tables are managed separately, can be fetched from tables API if needed
    }))

    return res.json({ restaurants: publicRestaurants })
  } catch (error) {
    console.error("Get public restaurants error:", error)
    return res.status(500).json({ error: "Internal server error" })
  }
})

// Public endpoint: Get restaurant by slug or ID
router.get("/public/restaurants/:identifier", async (req: Request, res: Response) => {
  try {
    const identifier = req.params.identifier
    const restaurants = await getCollection("restaurants")

    // Check if identifier is a valid MongoDB ObjectId (24 hex characters)
    const isValidObjectId = /^[0-9a-fA-F]{24}$/.test(identifier)

    // Build query - try slug first, and ID only if it's a valid ObjectId format
    const query: any = {
      approvalStatus: "approved",
      isActive: true,
    }

    if (isValidObjectId) {
      query.$or = [
        { slug: identifier },
        { _id: new ObjectId(identifier) },
      ]
    } else {
      // If not a valid ObjectId, only search by slug
      query.slug = identifier
    }

    const restaurant = await restaurants.findOne(query)

    if (!restaurant) {
      return res.status(404).json({ error: "Restaurant not found" })
    }

    // Transform data for public consumption
    const publicRestaurant = {
      _id: restaurant._id,
      id: restaurant._id.toString(),
      slug: restaurant.slug || restaurant._id.toString(),
      name: restaurant.name,
      description: restaurant.description,
      cuisine: restaurant.cuisine,
      address: restaurant.address,
      city: restaurant.city,
      state: restaurant.state,
      pincode: restaurant.pincode,
      phone: restaurant.phone,
      email: restaurant.email,
      website: restaurant.website,
      logo: restaurant.logo,
      images: restaurant.images,
      priceRange: restaurant.priceRange,
      avgCost: restaurant.avgCost,
      openingHours: restaurant.openingHours,
      features: restaurant.features,
      rating: restaurant.rating || 0,
      totalReviews: restaurant.totalReviews || 0,
      isOpen: checkIfOpen(restaurant.openingHours || []),
      distance: restaurant.distance || "N/A",
      deliveryTime: restaurant.deliveryTime || "30-40 min",
      tables: [], // Tables are managed separately, can be fetched from tables API if needed
    }

    return res.json({ restaurant: publicRestaurant })
  } catch (error) {
    console.error("Get restaurant by identifier error:", error)
    return res.status(500).json({ error: "Internal server error" })
  }
})

// Helper function to check if restaurant is currently open
function checkIfOpen(openingHours: Array<{ day: string; openTime: string; closeTime: string; isClosed: boolean }>): boolean {
  const now = new Date()
  const currentDay = now.toLocaleDateString("en-US", { weekday: "long" })
  const currentTime = now.toTimeString().slice(0, 5) // HH:MM format

  const todayHours = openingHours.find((oh) => oh.day === currentDay)
  if (!todayHours || todayHours.isClosed) {
    return false
  }

  return currentTime >= todayHours.openTime && currentTime <= todayHours.closeTime
}

export default router




