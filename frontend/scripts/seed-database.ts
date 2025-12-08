// Run this script to seed the database with initial data
// Execute: npx tsx scripts/seed-database.ts

import { MongoClient } from "mongodb"

const MONGODB_URI =
  process.env.MONGODB_URI ||
  "mongodb+srv://birlapranjal460:OSoLJzGoDlhPh5OT@ninexfoldmain.hb8fltn.mongodb.net/dineontime"

async function hashPassword(password: string): Promise<string> {
  const encoder = new TextEncoder()
  const data = encoder.encode(password + "dineontime-salt")
  const hashBuffer = await crypto.subtle.digest("SHA-256", data)
  const hashArray = Array.from(new Uint8Array(hashBuffer))
  return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("")
}

async function seed() {
  const client = new MongoClient(MONGODB_URI)
  
  try {
    await client.connect()
    console.log("Connected to MongoDB")
    
    const db = client.db("dineontime")
    
    // Create collections
    const collections = ["users", "restaurants", "orders", "bookings", "reviews", "complaints"]
    for (const col of collections) {
      const exists = await db.listCollections({ name: col }).hasNext()
      if (!exists) {
        await db.createCollection(col)
        console.log(`Created collection: ${col}`)
      }
    }
    
    // Seed admin user
    const users = db.collection("users")
    const adminExists = await users.findOne({ email: "admin@dineontime.com" })
    
    if (!adminExists) {
      const hashedPassword = await hashPassword("admin123")
      await users.insertOne({
        email: "admin@dineontime.com",
        password: hashedPassword,
        name: "Super Admin",
        phone: "+91 9876543210",
        role: "admin",
        avatar: "/admin-interface.png",
        permissions: ["all"],
        createdAt: new Date(),
        updatedAt: new Date(),
      })\
      console.log("Created admin user: admin@
