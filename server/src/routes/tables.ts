import { Router, Request, Response } from "express"
import { getCollection } from "../config/mongodb"
import { requireAuth, AuthRequest } from "../middleware/auth"
import { ObjectId } from "mongodb"

const router = Router()

export interface Table {
  _id?: ObjectId
  restaurantId: ObjectId
  name: string
  number: string // Table number/identifier
  type: "round" | "square" | "rectangle" | "booth" | "bar"
  capacity: number
  status: "available" | "occupied" | "reserved" | "cleaning" | "maintenance"
  location?: {
    section?: string // e.g., "Main Dining", "Outdoor", "Private Section"
    x?: number // Position for floor plan
    y?: number
  }
  currentBookingId?: string
  createdAt: Date
  updatedAt: Date
}

// Get all tables for a restaurant
router.get("/", requireAuth(["restaurant"]), async (req: AuthRequest, res: Response) => {
  try {
    const users = await getCollection("users")
    const tables = await getCollection<Table>("tables")

    const user = await users.findOne({ _id: new ObjectId(req.user!.userId) })
    if (!user || !user.restaurantId) {
      return res.status(404).json({ error: "Restaurant not found" })
    }

    const restaurantId = new ObjectId(user.restaurantId)
    const tableList = await tables.find({ restaurantId }).sort({ number: 1 }).toArray()

    return res.json({ tables: tableList })
  } catch (error) {
    console.error("Get tables error:", error)
    return res.status(500).json({ error: "Internal server error" })
  }
})

// Get a single table by ID
router.get("/:id", requireAuth(["restaurant"]), async (req: AuthRequest, res: Response) => {
  try {
    const users = await getCollection("users")
    const tables = await getCollection<Table>("tables")

    const user = await users.findOne({ _id: new ObjectId(req.user!.userId) })
    if (!user || !user.restaurantId) {
      return res.status(404).json({ error: "Restaurant not found" })
    }

    const tableId = req.params.id
    const table = await tables.findOne({
      _id: new ObjectId(tableId),
      restaurantId: new ObjectId(user.restaurantId),
    })

    if (!table) {
      return res.status(404).json({ error: "Table not found" })
    }

    // Get current booking if exists
    let currentBooking = null
    if (table.currentBookingId) {
      const bookings = await getCollection("bookings")
      currentBooking = await bookings.findOne({ _id: new ObjectId(table.currentBookingId) })
    }

    return res.json({ table, currentBooking })
  } catch (error) {
    console.error("Get table error:", error)
    return res.status(500).json({ error: "Internal server error" })
  }
})

// Create a new table
router.post("/", requireAuth(["restaurant"]), async (req: AuthRequest, res: Response) => {
  try {
    const users = await getCollection("users")
    const tables = await getCollection<Table>("tables")

    const user = await users.findOne({ _id: new ObjectId(req.user!.userId) })
    if (!user || !user.restaurantId) {
      return res.status(404).json({ error: "Restaurant not found" })
    }

    const restaurantId = new ObjectId(user.restaurantId)
    const { name, number, type, capacity, location } = req.body

    if (!name || !number || !type || !capacity) {
      return res.status(400).json({ error: "Name, number, type, and capacity are required" })
    }

    // Check if table number already exists
    const existingTable = await tables.findOne({ restaurantId, number })
    if (existingTable) {
      return res.status(400).json({ error: "Table number already exists" })
    }

    const newTable: Table = {
      restaurantId,
      name,
      number,
      type,
      capacity: parseInt(capacity),
      status: "available",
      location: location || {},
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    const result = await tables.insertOne(newTable)
    const createdTable = await tables.findOne({ _id: result.insertedId })

    return res.status(201).json({
      success: true,
      message: "Table created successfully",
      table: createdTable,
    })
  } catch (error) {
    console.error("Create table error:", error)
    return res.status(500).json({ error: "Internal server error" })
  }
})

// Update a table
router.put("/:id", requireAuth(["restaurant"]), async (req: AuthRequest, res: Response) => {
  try {
    const users = await getCollection("users")
    const tables = await getCollection<Table>("tables")

    const user = await users.findOne({ _id: new ObjectId(req.user!.userId) })
    if (!user || !user.restaurantId) {
      return res.status(404).json({ error: "Restaurant not found" })
    }

    const tableId = req.params.id
    const restaurantId = new ObjectId(user.restaurantId)

    // Check if table exists and belongs to restaurant
    const existingTable = await tables.findOne({
      _id: new ObjectId(tableId),
      restaurantId,
    })

    if (!existingTable) {
      return res.status(404).json({ error: "Table not found" })
    }

    // Check if table number is being changed and if it conflicts
    if (req.body.number && req.body.number !== existingTable.number) {
      const conflictingTable = await tables.findOne({
        restaurantId,
        number: req.body.number,
        _id: { $ne: new ObjectId(tableId) },
      })
      if (conflictingTable) {
        return res.status(400).json({ error: "Table number already exists" })
      }
    }

    const updateData: any = {
      updatedAt: new Date(),
    }

    if (req.body.name) updateData.name = req.body.name
    if (req.body.number) updateData.number = req.body.number
    if (req.body.type) updateData.type = req.body.type
    if (req.body.capacity) updateData.capacity = parseInt(req.body.capacity)
    if (req.body.status) updateData.status = req.body.status
    if (req.body.location !== undefined) updateData.location = req.body.location

    await tables.updateOne({ _id: new ObjectId(tableId) }, { $set: updateData })

    const updatedTable = await tables.findOne({ _id: new ObjectId(tableId) })

    return res.json({
      success: true,
      message: "Table updated successfully",
      table: updatedTable,
    })
  } catch (error) {
    console.error("Update table error:", error)
    return res.status(500).json({ error: "Internal server error" })
  }
})

// Delete a table
router.delete("/:id", requireAuth(["restaurant"]), async (req: AuthRequest, res: Response) => {
  try {
    const users = await getCollection("users")
    const tables = await getCollection<Table>("tables")
    const bookings = await getCollection("bookings")

    const user = await users.findOne({ _id: new ObjectId(req.user!.userId) })
    if (!user || !user.restaurantId) {
      return res.status(404).json({ error: "Restaurant not found" })
    }

    const tableId = req.params.id
    const restaurantId = new ObjectId(user.restaurantId)

    // Check if table exists and belongs to restaurant
    const existingTable = await tables.findOne({
      _id: new ObjectId(tableId),
      restaurantId,
    })

    if (!existingTable) {
      return res.status(404).json({ error: "Table not found" })
    }

    // Check if table has active bookings
    const activeBookings = await bookings.countDocuments({
      tableId: tableId,
      status: { $in: ["pending", "confirmed", "arriving"] },
    })

    if (activeBookings > 0) {
      return res.status(400).json({
        error: "Cannot delete table with active bookings. Please cancel or complete bookings first.",
      })
    }

    await tables.deleteOne({ _id: new ObjectId(tableId) })

    return res.json({
      success: true,
      message: "Table deleted successfully",
    })
  } catch (error) {
    console.error("Delete table error:", error)
    return res.status(500).json({ error: "Internal server error" })
  }
})

// Update table status
router.patch("/:id/status", requireAuth(["restaurant"]), async (req: AuthRequest, res: Response) => {
  try {
    const users = await getCollection("users")
    const tables = await getCollection<Table>("tables")

    const user = await users.findOne({ _id: new ObjectId(req.user!.userId) })
    if (!user || !user.restaurantId) {
      return res.status(404).json({ error: "Restaurant not found" })
    }

    const tableId = req.params.id
    const restaurantId = new ObjectId(user.restaurantId)
    const { status } = req.body

    if (!status || !["available", "occupied", "reserved", "cleaning", "maintenance"].includes(status)) {
      return res.status(400).json({ error: "Valid status is required" })
    }

    const existingTable = await tables.findOne({
      _id: new ObjectId(tableId),
      restaurantId,
    })

    if (!existingTable) {
      return res.status(404).json({ error: "Table not found" })
    }

    await tables.updateOne(
      { _id: new ObjectId(tableId) },
      {
        $set: {
          status,
          updatedAt: new Date(),
        },
      }
    )

    const updatedTable = await tables.findOne({ _id: new ObjectId(tableId) })

    return res.json({
      success: true,
      message: "Table status updated successfully",
      table: updatedTable,
    })
  } catch (error) {
    console.error("Update table status error:", error)
    return res.status(500).json({ error: "Internal server error" })
  }
})

export default router

