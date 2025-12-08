import { Router, Response } from "express"
import { getCollection } from "../config/mongodb"
import { requireAuth, authenticate, AuthRequest } from "../middleware/auth"
import { ObjectId } from "mongodb"

const router = Router()

// Customer Dashboard Stats
router.get("/customer/stats", requireAuth(["customer"]), async (req: AuthRequest, res: Response) => {
  try {
    const customerId = new ObjectId(req.user!.userId)
    const orders = await getCollection("orders")
    const bookings = await getCollection("bookings")
    const reviews = await getCollection("reviews")

    // Get order stats
    const orderStats = await orders
      .aggregate([
        { $match: { customerId } },
        {
          $group: {
            _id: null,
            totalOrders: { $sum: 1 },
            totalSpent: { $sum: "$total" },
            avgOrderValue: { $avg: "$total" },
          },
        },
      ])
      .toArray()

    // Get booking stats
    const bookingStats = await bookings
      .aggregate([
        { $match: { customerId } },
        {
          $group: {
            _id: null,
            totalBookings: { $sum: 1 },
            completedBookings: {
              $sum: { $cond: [{ $eq: ["$status", "completed"] }, 1, 0] },
            },
          },
        },
      ])
      .toArray()

    // Get review count
    const reviewCount = await reviews.countDocuments({ customerId })

    // Get recent orders
    const recentOrders = await orders
      .find({ customerId })
      .sort({ createdAt: -1 })
      .limit(5)
      .toArray()

    // Get upcoming bookings
    const upcomingBookings = await bookings
      .find({
        customerId,
        date: { $gte: new Date() },
        status: { $in: ["pending", "confirmed"] },
      })
      .sort({ date: 1 })
      .limit(3)
      .toArray()

    return res.json({
      stats: {
        totalOrders: orderStats[0]?.totalOrders || 0,
        totalSpent: orderStats[0]?.totalSpent || 0,
        avgOrderValue: orderStats[0]?.avgOrderValue || 0,
        totalBookings: bookingStats[0]?.totalBookings || 0,
        completedBookings: bookingStats[0]?.completedBookings || 0,
        reviewsGiven: reviewCount,
      },
      recentOrders,
      upcomingBookings,
    })
  } catch (error) {
    console.error("Customer dashboard stats error:", error)
    return res.status(500).json({ error: "Internal server error" })
  }
})

// Customer Orders
router.get("/customer/orders", requireAuth(["customer"]), async (req: AuthRequest, res: Response) => {
  try {
    const customerId = new ObjectId(req.user!.userId)
    const orders = await getCollection("orders")
    const page = parseInt(req.query.page as string) || 1
    const limit = parseInt(req.query.limit as string) || 10
    const skip = (page - 1) * limit

    const orderList = await orders
      .find({ customerId })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .toArray()

    const total = await orders.countDocuments({ customerId })

    return res.json({
      orders: orderList,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    })
  } catch (error) {
    console.error("Customer orders error:", error)
    return res.status(500).json({ error: "Internal server error" })
  }
})

// Customer Bookings
router.get("/customer/bookings", requireAuth(["customer"]), async (req: AuthRequest, res: Response) => {
  try {
    const customerId = new ObjectId(req.user!.userId)
    const bookings = await getCollection("bookings")
    const page = parseInt(req.query.page as string) || 1
    const limit = parseInt(req.query.limit as string) || 10
    const skip = (page - 1) * limit

    const bookingList = await bookings
      .find({ customerId })
      .sort({ date: -1 })
      .skip(skip)
      .limit(limit)
      .toArray()

    const total = await bookings.countDocuments({ customerId })

    return res.json({
      bookings: bookingList,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    })
  } catch (error) {
    console.error("Customer bookings error:", error)
    return res.status(500).json({ error: "Internal server error" })
  }
})

// Restaurant Dashboard Stats
router.get("/restaurant/stats", requireAuth(["restaurant"]), async (req: AuthRequest, res: Response) => {
  try {
    const users = await getCollection("users")
    const user = await users.findOne({ _id: new ObjectId(req.user!.userId) })

    if (!user?.restaurantId) {
      return res.status(400).json({ error: "No restaurant associated" })
    }

    const restaurantId = new ObjectId(user.restaurantId)
    const orders = await getCollection("orders")
    const bookings = await getCollection("bookings")
    const reviews = await getCollection("reviews")

    const today = new Date()
    today.setHours(0, 0, 0, 0)

    // Today's stats
    const todayOrders = await orders
      .aggregate([
        {
          $match: {
            restaurantId,
            createdAt: { $gte: today },
          },
        },
        {
          $group: {
            _id: null,
            count: { $sum: 1 },
            revenue: { $sum: "$total" },
          },
        },
      ])
      .toArray()

    // Today's bookings
    const todayBookings = await bookings.countDocuments({
      restaurantId,
      date: { $gte: today, $lt: new Date(today.getTime() + 24 * 60 * 60 * 1000) },
    })

    // Overall stats
    const overallStats = await orders
      .aggregate([
        { $match: { restaurantId } },
        {
          $group: {
            _id: null,
            totalOrders: { $sum: 1 },
            totalRevenue: { $sum: "$total" },
            avgOrderValue: { $avg: "$total" },
          },
        },
      ])
      .toArray()

    // Rating stats
    const ratingStats = await reviews
      .aggregate([
        { $match: { restaurantId } },
        {
          $group: {
            _id: null,
            avgRating: { $avg: "$rating" },
            totalReviews: { $sum: 1 },
          },
        },
      ])
      .toArray()

    // Pending orders
    const pendingOrders = await orders
      .find({
        restaurantId,
        status: { $in: ["pending", "preparing"] },
      })
      .sort({ createdAt: -1 })
      .limit(5)
      .toArray()

    // Upcoming bookings
    const upcomingBookings = await bookings
      .find({
        restaurantId,
        date: { $gte: today },
        status: { $in: ["pending", "confirmed", "arriving"] },
      })
      .sort({ date: 1 })
      .limit(5)
      .toArray()

    return res.json({
      today: {
        orders: todayOrders[0]?.count || 0,
        revenue: todayOrders[0]?.revenue || 0,
        bookings: todayBookings,
      },
      overall: {
        totalOrders: overallStats[0]?.totalOrders || 0,
        totalRevenue: overallStats[0]?.totalRevenue || 0,
        avgOrderValue: overallStats[0]?.avgOrderValue || 0,
        avgRating: ratingStats[0]?.avgRating || 0,
        totalReviews: ratingStats[0]?.totalReviews || 0,
      },
      pendingOrders,
      upcomingBookings,
    })
  } catch (error) {
    console.error("Restaurant dashboard stats error:", error)
    return res.status(500).json({ error: "Internal server error" })
  }
})

// Restaurant Orders
router.get("/restaurant/orders", requireAuth(["restaurant"]), async (req: AuthRequest, res: Response) => {
  try {
    const users = await getCollection("users")
    const user = await users.findOne({ _id: new ObjectId(req.user!.userId) })

    if (!user?.restaurantId) {
      return res.status(400).json({ error: "No restaurant associated" })
    }

    const restaurantId = new ObjectId(user.restaurantId)
    const orders = await getCollection("orders")
    const page = parseInt(req.query.page as string) || 1
    const limit = parseInt(req.query.limit as string) || 10
    const skip = (page - 1) * limit
    const status = req.query.status as string

    const query: any = { restaurantId }
    if (status) {
      query.status = status
    }

    const orderList = await orders
      .find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .toArray()

    const total = await orders.countDocuments(query)

    return res.json({
      orders: orderList,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    })
  } catch (error) {
    console.error("Restaurant orders error:", error)
    return res.status(500).json({ error: "Internal server error" })
  }
})

// Restaurant Bookings
router.get("/restaurant/bookings", requireAuth(["restaurant"]), async (req: AuthRequest, res: Response) => {
  try {
    const users = await getCollection("users")
    const user = await users.findOne({ _id: new ObjectId(req.user!.userId) })

    if (!user?.restaurantId) {
      return res.status(400).json({ error: "No restaurant associated" })
    }

    const restaurantId = new ObjectId(user.restaurantId)
    const bookings = await getCollection("bookings")
    const page = parseInt(req.query.page as string) || 1
    const limit = parseInt(req.query.limit as string) || 10
    const skip = (page - 1) * limit
    const status = req.query.status as string

    const query: any = { restaurantId }
    if (status) {
      query.status = status
    }

    const bookingList = await bookings
      .find(query)
      .sort({ date: -1 })
      .skip(skip)
      .limit(limit)
      .toArray()

    const total = await bookings.countDocuments(query)

    return res.json({
      bookings: bookingList,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    })
  } catch (error) {
    console.error("Restaurant bookings error:", error)
    return res.status(500).json({ error: "Internal server error" })
  }
})

// Update Profile
router.put("/profile", authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const userId = new ObjectId(req.user!.userId)
    const users = await getCollection("users")
    const { name, phone, avatar } = req.body

    const updateData: any = { updatedAt: new Date() }
    if (name) updateData.name = name
    if (phone) updateData.phone = phone
    if (avatar) updateData.avatar = avatar

    await users.updateOne({ _id: userId }, { $set: updateData })

    const updatedUser = await users.findOne({ _id: userId }, { projection: { password: 0 } })

    return res.json({
      success: true,
      user: {
        id: updatedUser!._id.toString(),
        email: updatedUser!.email,
        name: updatedUser!.name,
        role: updatedUser!.role,
        avatar: updatedUser!.avatar,
        phone: updatedUser!.phone,
      },
    })
  } catch (error) {
    console.error("Update profile error:", error)
    return res.status(500).json({ error: "Internal server error" })
  }
})

export default router

