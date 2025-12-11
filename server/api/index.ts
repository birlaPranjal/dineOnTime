// Vercel serverless function entry point
// This wraps the Express app for Vercel deployment

import express, { Express } from "express"
import cors from "cors"
import cookieParser from "cookie-parser"
import path from "path"
import authRoutes from "../src/routes/auth"
import insightsRoutes from "../src/routes/insights"
import dashboardRoutes from "../src/routes/dashboard"
import partnershipRoutes from "../src/routes/partnership"
import restaurantRoutes from "../src/routes/restaurant"
import tablesRoutes from "../src/routes/tables"
import bookingsRoutes from "../src/routes/bookings"

const app: Express = express()

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

// Export the Express app as a serverless function
export default app



