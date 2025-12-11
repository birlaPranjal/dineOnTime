// Vercel serverless function entry point
// This wraps the Express app for Vercel deployment

import express, { Express } from "express"
import cors from "cors"
import cookieParser from "cookie-parser"
import authRoutes from "../src/routes/auth"
import insightsRoutes from "../src/routes/insights"
import dashboardRoutes from "../src/routes/dashboard"
import partnershipRoutes from "../src/routes/partnership"
import restaurantRoutes from "../src/routes/restaurant"
import tablesRoutes from "../src/routes/tables"
import bookingsRoutes from "../src/routes/bookings"

const app: Express = express()

// Middleware
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
    credentials: true,
  })
)
app.use(express.json())
app.use(cookieParser())

// Routes
app.use("/api/auth", authRoutes)
app.use("/api/insights", insightsRoutes)
app.use("/api/dashboard", dashboardRoutes)
app.use("/api/partnership", partnershipRoutes)
app.use("/api/restaurant", restaurantRoutes)
app.use("/api/tables", tablesRoutes)
app.use("/api/bookings", bookingsRoutes)

// Health check
app.get("/health", (req, res) => {
  res.json({ status: "ok", message: "Server is running" })
})

// Root endpoint
app.get("/", (req, res) => {
  res.json({ status: "ok", message: "DineOnTime API Server" })
})

// Export the Express app as a serverless function
export default app



