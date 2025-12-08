// Load environment variables FIRST before any other imports
// Using require() ensures this executes before ES module imports are resolved
require("dotenv").config()

import express, { Express } from "express"
import cors from "cors"
import cookieParser from "cookie-parser"
import authRoutes from "./routes/auth"
import insightsRoutes from "./routes/insights"


const app: Express = express()
const PORT = process.env.PORT || 3001

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

// Health check
app.get("/health", (req, res) => {
  res.json({ status: "ok", message: "Server is running" })
})

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`)
})

