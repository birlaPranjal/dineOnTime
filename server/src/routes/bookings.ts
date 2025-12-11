import { Router, Request, Response } from "express"
import { getCollection } from "../config/mongodb"
import { requireAuth, AuthRequest } from "../middleware/auth"
import { ObjectId } from "mongodb"

const router = Router()

export interface Booking {
  _id?: ObjectId
  restaurantId: ObjectId
  customerId: ObjectId
  tableId?: string
  date: Date
  time: string // Time slot (e.g., "19:00")
  guests: number
  status: "pending" | "confirmed" | "arriving" | "seated" | "completed" | "cancelled" | "no-show"
  specialRequests?: string
  preOrder?: {
    items: Array<{
      itemId: string
      name: string
      quantity: number
      price: number
    }>
    total: number
  }
  customerInfo?: {
    name: string
    phone: string
    email?: string
  }
  createdAt: Date
  updatedAt: Date
  confirmedAt?: Date
  cancelledAt?: Date
  cancellationReason?: string
  eta?: string // Estimated time of arrival
}

// Get all bookings for a restaurant (with filters)
router.get("/", requireAuth(["restaurant"]), async (req: AuthRequest, res: Response) => {
  try {
    const users = await getCollection("users")
    const bookings = await getCollection<Booking>("bookings")
    const customers = await getCollection("users")

    const user = await users.findOne({ _id: new ObjectId(req.user!.userId) })
    if (!user || !user.restaurantId) {
      return res.status(404).json({ error: "Restaurant not found" })
    }

    const restaurantId = new ObjectId(user.restaurantId)
    const page = parseInt(req.query.page as string) || 1
    const limit = parseInt(req.query.limit as string) || 20
    const skip = (page - 1) * limit
    const status = req.query.status as string
    const date = req.query.date as string // Filter by date (YYYY-MM-DD)

    const query: any = { restaurantId }
    if (status) {
      query.status = status
    }
    if (date) {
      const startDate = new Date(date)
      startDate.setHours(0, 0, 0, 0)
      const endDate = new Date(date)
      endDate.setHours(23, 59, 59, 999)
      query.date = { $gte: startDate, $lte: endDate }
    }

    const bookingList = await bookings
      .find(query)
      .sort({ date: 1, time: 1 })
      .skip(skip)
      .limit(limit)
      .toArray()

    // Populate customer information
    const bookingsWithCustomers = await Promise.all(
      bookingList.map(async (booking) => {
        const customer = await customers.findOne(
          { _id: new ObjectId(booking.customerId) },
          { projection: { password: 0 } }
        )
        return {
          ...booking,
          customer: customer
            ? {
                id: customer._id!.toString(),
                name: customer.name,
                email: customer.email,
                phone: customer.phone,
                avatar: customer.avatar,
              }
            : null,
        }
      })
    )

    const total = await bookings.countDocuments(query)

    return res.json({
      bookings: bookingsWithCustomers,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    })
  } catch (error) {
    console.error("Get bookings error:", error)
    return res.status(500).json({ error: "Internal server error" })
  }
})

// Get a single booking by ID
router.get("/:id", requireAuth(["restaurant"]), async (req: AuthRequest, res: Response) => {
  try {
    const users = await getCollection("users")
    const bookings = await getCollection<Booking>("bookings")
    const customers = await getCollection("users")
    const tables = await getCollection("tables")

    const user = await users.findOne({ _id: new ObjectId(req.user!.userId) })
    if (!user || !user.restaurantId) {
      return res.status(404).json({ error: "Restaurant not found" })
    }

    const bookingId = req.params.id
    const restaurantId = new ObjectId(user.restaurantId)

    const booking = await bookings.findOne({
      _id: new ObjectId(bookingId),
      restaurantId,
    })

    if (!booking) {
      return res.status(404).json({ error: "Booking not found" })
    }

    // Populate customer information
    const customer = await customers.findOne(
      { _id: new ObjectId(booking.customerId) },
      { projection: { password: 0 } }
    )

    // Populate table information if exists
    let table = null
    if (booking.tableId) {
      table = await tables.findOne({ _id: new ObjectId(booking.tableId) })
    }

    return res.json({
      booking: {
        ...booking,
        customer: customer
          ? {
              id: customer._id!.toString(),
              name: customer.name,
              email: customer.email,
              phone: customer.phone,
              avatar: customer.avatar,
            }
          : null,
        table: table
          ? {
              id: table._id!.toString(),
              name: table.name,
              number: table.number,
              capacity: table.capacity,
              type: table.type,
            }
          : null,
      },
    })
  } catch (error) {
    console.error("Get booking error:", error)
    return res.status(500).json({ error: "Internal server error" })
  }
})

// Confirm a booking
router.post("/:id/confirm", requireAuth(["restaurant"]), async (req: AuthRequest, res: Response) => {
  try {
    const users = await getCollection("users")
    const bookings = await getCollection<Booking>("bookings")
    const tables = await getCollection("tables")

    const user = await users.findOne({ _id: new ObjectId(req.user!.userId) })
    if (!user || !user.restaurantId) {
      return res.status(404).json({ error: "Restaurant not found" })
    }

    const bookingId = req.params.id
    const restaurantId = new ObjectId(user.restaurantId)
    const { tableId } = req.body

    const booking = await bookings.findOne({
      _id: new ObjectId(bookingId),
      restaurantId,
    })

    if (!booking) {
      return res.status(404).json({ error: "Booking not found" })
    }

    if (booking.status !== "pending") {
      return res.status(400).json({ error: `Cannot confirm booking with status: ${booking.status}` })
    }

    // If tableId is provided, verify it exists and is available
    if (tableId) {
      const table = await tables.findOne({
        _id: new ObjectId(tableId),
        restaurantId,
      })

      if (!table) {
        return res.status(404).json({ error: "Table not found" })
      }

      if (table.status === "occupied" || table.status === "reserved") {
        return res.status(400).json({ error: "Table is not available" })
      }

      // Update table status
      await tables.updateOne(
        { _id: new ObjectId(tableId) },
        {
          $set: {
            status: "reserved",
            currentBookingId: bookingId,
            updatedAt: new Date(),
          },
        }
      )
    }

    // Update booking status
    await bookings.updateOne(
      { _id: new ObjectId(bookingId) },
      {
        $set: {
          status: "confirmed",
          tableId: tableId || booking.tableId,
          confirmedAt: new Date(),
          updatedAt: new Date(),
        },
      }
    )

    const updatedBooking = await bookings.findOne({ _id: new ObjectId(bookingId) })

    return res.json({
      success: true,
      message: "Booking confirmed successfully",
      booking: updatedBooking,
    })
  } catch (error) {
    console.error("Confirm booking error:", error)
    return res.status(500).json({ error: "Internal server error" })
  }
})

// Reject/Cancel a booking
router.post("/:id/cancel", requireAuth(["restaurant"]), async (req: AuthRequest, res: Response) => {
  try {
    const users = await getCollection("users")
    const bookings = await getCollection<Booking>("bookings")
    const tables = await getCollection("tables")

    const user = await users.findOne({ _id: new ObjectId(req.user!.userId) })
    if (!user || !user.restaurantId) {
      return res.status(404).json({ error: "Restaurant not found" })
    }

    const bookingId = req.params.id
    const restaurantId = new ObjectId(user.restaurantId)
    const { reason } = req.body

    const booking = await bookings.findOne({
      _id: new ObjectId(bookingId),
      restaurantId,
    })

    if (!booking) {
      return res.status(404).json({ error: "Booking not found" })
    }

    if (booking.status === "completed" || booking.status === "cancelled") {
      return res.status(400).json({ error: `Cannot cancel booking with status: ${booking.status}` })
    }

    // Free up table if assigned
    if (booking.tableId) {
      await tables.updateOne(
        { _id: new ObjectId(booking.tableId) },
        {
          $set: {
            status: "available",
            currentBookingId: undefined,
            updatedAt: new Date(),
          },
        }
      )
    }

    // Update booking status
    await bookings.updateOne(
      { _id: new ObjectId(bookingId) },
      {
        $set: {
          status: "cancelled",
          cancelledAt: new Date(),
          cancellationReason: reason || "Cancelled by restaurant",
          updatedAt: new Date(),
        },
      }
    )

    const updatedBooking = await bookings.findOne({ _id: new ObjectId(bookingId) })

    return res.json({
      success: true,
      message: "Booking cancelled successfully",
      booking: updatedBooking,
    })
  } catch (error) {
    console.error("Cancel booking error:", error)
    return res.status(500).json({ error: "Internal server error" })
  }
})

// Update booking status (arriving, seated, completed, no-show)
router.patch("/:id/status", requireAuth(["restaurant"]), async (req: AuthRequest, res: Response) => {
  try {
    const users = await getCollection("users")
    const bookings = await getCollection<Booking>("bookings")
    const tables = await getCollection("tables")

    const user = await users.findOne({ _id: new ObjectId(req.user!.userId) })
    if (!user || !user.restaurantId) {
      return res.status(404).json({ error: "Restaurant not found" })
    }

    const bookingId = req.params.id
    const restaurantId = new ObjectId(user.restaurantId)
    const { status, eta } = req.body

    if (!status || !["arriving", "seated", "completed", "no-show"].includes(status)) {
      return res.status(400).json({ error: "Valid status is required" })
    }

    const booking = await bookings.findOne({
      _id: new ObjectId(bookingId),
      restaurantId,
    })

    if (!booking) {
      return res.status(404).json({ error: "Booking not found" })
    }

    const updateData: any = {
      status,
      updatedAt: new Date(),
    }

    if (eta) {
      updateData.eta = eta
    }

    // Handle table status changes
    if (status === "seated" && booking.tableId) {
      await tables.updateOne(
        { _id: new ObjectId(booking.tableId) },
        {
          $set: {
            status: "occupied",
            updatedAt: new Date(),
          },
        }
      )
    } else if (status === "completed" && booking.tableId) {
      await tables.updateOne(
        { _id: new ObjectId(booking.tableId) },
        {
          $set: {
            status: "cleaning",
            currentBookingId: undefined,
            updatedAt: new Date(),
          },
        }
      )
    } else if (status === "no-show" && booking.tableId) {
      await tables.updateOne(
        { _id: new ObjectId(booking.tableId) },
        {
          $set: {
            status: "available",
            currentBookingId: undefined,
            updatedAt: new Date(),
          },
        }
      )
    }

    await bookings.updateOne({ _id: new ObjectId(bookingId) }, { $set: updateData })

    const updatedBooking = await bookings.findOne({ _id: new ObjectId(bookingId) })

    return res.json({
      success: true,
      message: "Booking status updated successfully",
      booking: updatedBooking,
    })
  } catch (error) {
    console.error("Update booking status error:", error)
    return res.status(500).json({ error: "Internal server error" })
  }
})

// Get customer booking history (for restaurant to view)
router.get("/customer/:customerId", requireAuth(["restaurant"]), async (req: AuthRequest, res: Response) => {
  try {
    const users = await getCollection("users")
    const bookings = await getCollection<Booking>("bookings")

    const user = await users.findOne({ _id: new ObjectId(req.user!.userId) })
    if (!user || !user.restaurantId) {
      return res.status(404).json({ error: "Restaurant not found" })
    }

    const restaurantId = new ObjectId(user.restaurantId)
    const customerId = req.params.customerId

    const customerBookings = await bookings
      .find({
        restaurantId,
        customerId: new ObjectId(customerId),
      })
      .sort({ date: -1 })
      .limit(20)
      .toArray()

    return res.json({ bookings: customerBookings })
  } catch (error) {
    console.error("Get customer bookings error:", error)
    return res.status(500).json({ error: "Internal server error" })
  }
})

export default router

