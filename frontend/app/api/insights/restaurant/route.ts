import { NextResponse } from "next/server"
import { getSession } from "@/lib/auth"
import { getCollection } from "@/lib/mongodb"
import { ObjectId } from "mongodb"

export async function GET() {
  try {
    const session = await getSession()

    if (!session || session.role !== "restaurant") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const users = await getCollection("users")
    const user = await users.findOne({ _id: new ObjectId(session.userId) })

    if (!user?.restaurantId) {
      return NextResponse.json({ error: "No restaurant associated" }, { status: 400 })
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

    return NextResponse.json({
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
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
