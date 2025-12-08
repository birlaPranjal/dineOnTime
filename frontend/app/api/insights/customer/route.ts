import { NextResponse } from "next/server"
import { getSession } from "@/lib/auth"
import { getCollection } from "@/lib/mongodb"
import { ObjectId } from "mongodb"

export async function GET() {
  try {
    const session = await getSession()

    if (!session || session.role !== "customer") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const customerId = new ObjectId(session.userId)
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

    return NextResponse.json({
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
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
