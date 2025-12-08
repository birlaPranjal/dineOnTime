import { NextResponse } from "next/server"
import { getSession } from "@/lib/auth"
import { getCollection } from "@/lib/mongodb"

export async function GET() {
  try {
    const session = await getSession()

    if (!session || session.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

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

    return NextResponse.json({
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
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
