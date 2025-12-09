import { Router, Request, Response } from "express"
import { getCollection } from "../config/mongodb"
import { requireAuth, AuthRequest } from "../middleware/auth"
import { hashPassword, createSession, type User } from "../lib/auth"
import { sendRestaurantCredentialsEmail } from "../lib/email"
import { ObjectId } from "mongodb"

const router = Router()

// Submit partnership request
router.post("/request", async (req: Request, res: Response) => {
  try {
    const { restaurantName, ownerName, email, phone, city } = req.body

    if (!restaurantName || !ownerName || !email || !phone || !city) {
      return res.status(400).json({ error: "All fields are required" })
    }

    const requests = await getCollection("partnership_requests")

    // Check if request already exists
    const existingRequest = await requests.findOne({ email: email.toLowerCase() })
    if (existingRequest) {
      return res.status(400).json({ error: "A request with this email already exists" })
    }

    // Create partnership request
    const request = {
      restaurantName,
      ownerName,
      email: email.toLowerCase(),
      phone,
      city,
      status: "pending", // pending, approved, rejected
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    await requests.insertOne(request)

    return res.json({
      success: true,
      message: "Partnership request submitted successfully. Our team will get in touch within 24 hours.",
    })
  } catch (error) {
    console.error("Partnership request error:", error)
    return res.status(500).json({ error: "Internal server error" })
  }
})

// Get all partnership requests (Admin only)
router.get("/requests", requireAuth(["admin"]), async (req: AuthRequest, res: Response) => {
  try {
    const requests = await getCollection("partnership_requests")
    const status = req.query.status as string

    const query: any = {}
    if (status) {
      query.status = status
    }

    const requestList = await requests
      .find(query)
      .sort({ createdAt: -1 })
      .toArray()

    return res.json({ requests: requestList })
  } catch (error) {
    console.error("Get partnership requests error:", error)
    return res.status(500).json({ error: "Internal server error" })
  }
})

// Approve partnership request and create restaurant account (Admin only)
router.post("/approve/:id", requireAuth(["admin"]), async (req: AuthRequest, res: Response) => {
  try {
    const requestId = req.params.id
    const { password } = req.body

    if (!password) {
      return res.status(400).json({ error: "Password is required to create the account" })
    }

    const requests = await getCollection("partnership_requests")
    const users = await getCollection<User>("users")
    const restaurants = await getCollection("restaurants")

    // Get the partnership request
    const request = await requests.findOne({ _id: new ObjectId(requestId) })
    if (!request) {
      return res.status(404).json({ error: "Partnership request not found" })
    }

    if (request.status !== "pending") {
      return res.status(400).json({ error: "Request has already been processed" })
    }

    // Check if user already exists
    const existingUser = await users.findOne({ email: request.email })
    if (existingUser) {
      return res.status(400).json({ error: "User with this email already exists" })
    }

    // Create restaurant user account
    const hashedPassword = await hashPassword(password)
    const newUser: User = {
      email: request.email,
      password: hashedPassword,
      name: request.ownerName,
      phone: request.phone,
      role: "restaurant",
      avatar: `/placeholder.svg?height=40&width=40&query=${request.ownerName.charAt(0)}`,
      savedAddresses: [],
      favorites: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    const userResult = await users.insertOne(newUser as any)
    newUser._id = userResult.insertedId

    // Create restaurant record with pending_approval status
    const restaurant = {
      name: request.restaurantName,
      slug: request.restaurantName.toLowerCase().replace(/\s+/g, "-"),
      description: "",
      cuisine: [],
      address: "",
      city: request.city,
      state: "",
      pincode: "",
      phone: request.phone,
      email: request.email,
      website: "",
      images: [],
      logo: "",
      rating: 0,
      totalReviews: 0,
      priceRange: "moderate",
      avgCost: 0,
      openingHours: [],
      features: [],
      // Approval status: pending_approval -> approved -> live
      approvalStatus: "pending_approval", // pending_approval, approved, rejected
      isActive: false, // Will be true only after admin approval
      isVerified: false, // Will be true only after admin approval
      profileCompleted: false, // Restaurant needs to complete profile first
      ownerId: newUser._id,
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    const restaurantResult = await restaurants.insertOne(restaurant)
    const restaurantId = restaurantResult.insertedId.toString()

    // Update user with restaurant ID
    await users.updateOne({ _id: newUser._id }, { $set: { restaurantId } })

    // Update partnership request status
    await requests.updateOne(
      { _id: new ObjectId(requestId) },
      { $set: { status: "approved", approvedAt: new Date(), approvedBy: req.user!.userId } }
    )

    // Send credentials email
    try {
      await sendRestaurantCredentialsEmail(request.email, request.ownerName, request.restaurantName, request.email, password)
    } catch (emailError) {
      console.error("Error sending credentials email:", emailError)
      // Don't fail the request if email fails, but log it
    }

    return res.json({
      success: true,
      message: "Partnership request approved and credentials sent via email",
      user: {
        id: newUser._id.toString(),
        email: newUser.email,
        name: newUser.name,
        role: newUser.role,
      },
      restaurantId,
    })
  } catch (error) {
    console.error("Approve partnership request error:", error)
    return res.status(500).json({ error: "Internal server error" })
  }
})

// Reject partnership request (Admin only)
router.post("/reject/:id", requireAuth(["admin"]), async (req: AuthRequest, res: Response) => {
  try {
    const requestId = req.params.id
    const { reason } = req.body

    const requests = await getCollection("partnership_requests")

    const request = await requests.findOne({ _id: new ObjectId(requestId) })
    if (!request) {
      return res.status(404).json({ error: "Partnership request not found" })
    }

    if (request.status !== "pending") {
      return res.status(400).json({ error: "Request has already been processed" })
    }

    await requests.updateOne(
      { _id: new ObjectId(requestId) },
      {
        $set: {
          status: "rejected",
          rejectedAt: new Date(),
          rejectedBy: req.user!.userId,
          rejectionReason: reason || "",
        },
      }
    )

    return res.json({ success: true, message: "Partnership request rejected" })
  } catch (error) {
    console.error("Reject partnership request error:", error)
    return res.status(500).json({ error: "Internal server error" })
  }
})

export default router

