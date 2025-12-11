// Load environment variables FIRST before any other imports
// Using require() ensures this executes before ES module imports are resolved
require("dotenv").config()

import express, { Express } from "express"
import cors from "cors"
import cookieParser from "cookie-parser"
import path from "path"
import authRoutes from "./routes/auth"
import insightsRoutes from "./routes/insights"
import dashboardRoutes from "./routes/dashboard"
import partnershipRoutes from "./routes/partnership"
import restaurantRoutes from "./routes/restaurant"
import tablesRoutes from "./routes/tables"
import bookingsRoutes from "./routes/bookings"


const app: Express = express()
const PORT = process.env.PORT || 3001

// Set EJS as view engine
app.set("view engine", "ejs")
app.set("views", path.join(__dirname, "../views"))

// Middleware
const allowedOrigins = [
  "http://localhost:3000",
  "https://dine-onn-time.vercel.app",
  process.env.FRONTEND_URL,
].filter(Boolean) as string[]

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps or curl requests)
      if (!origin) return callback(null, true)
      if (allowedOrigins.includes(origin)) {
        callback(null, true)
      } else {
        callback(new Error("Not allowed by CORS"))
      }
    },
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

// Root endpoint with EJS page
app.get("/", (req, res) => {
  res.render("index", {
    title: "DineOnTime API Server",
    version: "1.0.0",
    status: "online",
    timestamp: new Date().toISOString(),
  })
})

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`)
})

