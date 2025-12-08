import { Router, Response } from "express"
import { getCollection } from "../config/mongodb"
import { requireAuth, AuthRequest } from "../middleware/auth"
import { ObjectId } from "mongodb"

const router = Router()

// Customer insights
router.get("/customer", requireAuth(["customer"]), async (req: AuthRequest, res: Response) => {
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
    const recentOrders = await orders.find({ customerId }).sort({ createdAt: -1 }).limit(5).toArray()

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
    console.error("Customer insights error:", error)
    return res.status(500).json({ error: "Internal server error" })
  }
})

// Admin insights
router.get("/admin", requireAuth(["admin"]), async (req: AuthRequest, res: Response) => {
  try {
    const users = await getCollection("users")
    const restaurants = await getCollection("restaurants")
    const orders = await getCollection("orders")
    const complaints = await getCollection("complaints")

    const today = new Date()
    today.setHours(0, 0, 0, 0)

    // User stats
    const totalUsers = await users.countDocuments({ role: "customer" })
    const totalRestaurantUsers = await users.countDocuments({ role: "restaurant" })

    // Restaurant stats
    const totalRestaurants = await restaurants.countDocuments()
    const activeRestaurants = await restaurants.countDocuments({ isActive: true })
    const pendingRestaurants = await restaurants.countDocuments({ isVerified: false })

    // Order stats
    const orderStats = await orders
      .aggregate([
        {
          $group: {
            _id: null,
            totalOrders: { $sum: 1 },
            totalRevenue: { $sum: "$total" },
          },
        },
      ])
      .toArray()

    // Today's orders
    const todayOrders = await orders
      .aggregate([
        { $match: { createdAt: { $gte: today } } },
        {
          $group: {
            _id: null,
            count: { $sum: 1 },
            revenue: { $sum: "$total" },
          },
        },
      ])
      .toArray()

    // Complaint stats
    const openComplaints = await complaints.countDocuments({
      status: { $in: ["open", "in-progress"] },
    })
    const urgentComplaints = await complaints.countDocuments({
      priority: "urgent",
      status: { $ne: "resolved" },
    })

    // Revenue by month (last 6 months)
    const sixMonthsAgo = new Date(today.getTime() - 180 * 24 * 60 * 60 * 1000)
    const revenueByMonth = await orders
      .aggregate([
        { $match: { createdAt: { $gte: sixMonthsAgo } } },
        {
          $group: {
            _id: { $dateToString: { format: "%Y-%m", date: "$createdAt" } },
            revenue: { $sum: "$total" },
            orders: { $sum: 1 },
          },
        },
        { $sort: { _id: 1 } },
      ])
      .toArray()

    // Top restaurants by revenue
    const topRestaurants = await orders
      .aggregate([
        {
          $group: {
            _id: "$restaurantId",
            restaurantName: { $first: "$restaurantName" },
            revenue: { $sum: "$total" },
            orders: { $sum: 1 },
          },
        },
        { $sort: { revenue: -1 } },
        { $limit: 10 },
      ])
      .toArray()

    // User growth (last 30 days)
    const thirtyDaysAgo = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000)
    const userGrowth = await users
      .aggregate([
        { $match: { createdAt: { $gte: thirtyDaysAgo } } },
        {
          $group: {
            _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
            count: { $sum: 1 },
          },
        },
        { $sort: { _id: 1 } },
      ])
      .toArray()

    return res.json({
      overview: {
        totalUsers,
        totalRestaurantUsers,
        totalRestaurants,
        activeRestaurants,
        pendingRestaurants,
        totalOrders: orderStats[0]?.totalOrders || 0,
        totalRevenue: orderStats[0]?.totalRevenue || 0,
        openComplaints,
        urgentComplaints,
      },
      today: {
        orders: todayOrders[0]?.count || 0,
        revenue: todayOrders[0]?.revenue || 0,
      },
      revenueByMonth,
      topRestaurants,
      userGrowth,
    })
  } catch (error) {
    console.error("Admin insights error:", error)
    return res.status(500).json({ error: "Internal server error" })
  }
})

// Restaurant insights
router.get("/restaurant", requireAuth(["restaurant"]), async (req: AuthRequest, res: Response) => {
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

    // Order status breakdown
    const ordersByStatus = await orders
      .aggregate([
        { $match: { restaurantId, createdAt: { $gte: today } } },
        { $group: { _id: "$status", count: { $sum: 1 } } },
      ])
      .toArray()

    // Revenue by day (last 7 days)
    const sevenDaysAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000)
    const revenueByDay = await orders
      .aggregate([
        {
          $match: {
            restaurantId,
            createdAt: { $gte: sevenDaysAgo },
          },
        },
        {
          $group: {
            _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
            revenue: { $sum: "$total" },
            orders: { $sum: 1 },
          },
        },
        { $sort: { _id: 1 } },
      ])
      .toArray()

    // Peak hours
    const peakHours = await orders
      .aggregate([
        { $match: { restaurantId } },
        {
          $group: {
            _id: { $hour: "$createdAt" },
            count: { $sum: 1 },
          },
        },
        { $sort: { count: -1 } },
        { $limit: 5 },
      ])
      .toArray()

    // Top items
    const topItems = await orders
      .aggregate([
        { $match: { restaurantId } },
        { $unwind: "$items" },
        {
          $group: {
            _id: "$items.name",
            quantity: { $sum: "$items.quantity" },
            revenue: { $sum: "$items.totalPrice" },
          },
        },
        { $sort: { quantity: -1 } },
        { $limit: 5 },
      ])
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
      ordersByStatus: ordersByStatus.reduce((acc: any, item: any) => {
        acc[item._id] = item.count
        return acc
      }, {}),
      revenueByDay,
      peakHours,
      topItems,
    })
  } catch (error) {
    console.error("Restaurant insights error:", error)
    return res.status(500).json({ error: "Internal server error" })
  }
})

export default router

