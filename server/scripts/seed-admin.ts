// Run this script to seed the database with admin user
// Execute: npx tsx scripts/seed-admin.ts

require("dotenv").config()

import { MongoClient } from "mongodb"

const MONGODB_URI = process.env.MONGODB_URI || "mongodb+srv://birlapranjal460:OSoLJzGoDlhPh5OT@ninexfoldmain.hb8fltn.mongodb.net/dineontime"

async function hashPassword(password: string): Promise<string> {
  const encoder = new TextEncoder()
  const data = encoder.encode(password + "dineontime-salt")
  const hashBuffer = await crypto.subtle.digest("SHA-256", data)
  const hashArray = Array.from(new Uint8Array(hashBuffer))
  return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("")
}

async function seedAdmin() {
  const client = new MongoClient(MONGODB_URI)

  try {
    await client.connect()
    console.log("✅ Connected to MongoDB")

    const db = client.db("dineontime")

    // Ensure users collection exists
    const collections = await db.listCollections({ name: "users" }).toArray()
    if (collections.length === 0) {
      await db.createCollection("users")
      console.log("✅ Created users collection")
    }

    // Seed admin user
    const users = db.collection("users")
    const adminExists = await users.findOne({ email: "admin@dineontime.com" })

    if (adminExists) {
      console.log("⚠️  Admin user already exists")
      console.log("   Email: admin@dineontime.com")
      console.log("   To reset password, delete the user and run this script again")
      return
    }

    const hashedPassword = await hashPassword("admin123")
    const adminUser = {
      email: "admin@dineontime.com",
      password: hashedPassword,
      name: "Super Admin",
      phone: "+91 9876543210",
      role: "admin",
      avatar: "/placeholder-user.jpg",
      permissions: ["all"],
      savedAddresses: [],
      favorites: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    await users.insertOne(adminUser)
    console.log("✅ Created admin user successfully!")
    console.log("")
    console.log("📧 Email: admin@dineontime.com")
    console.log("🔑 Password: admin123")
    console.log("")
    console.log("⚠️  Please change the password after first login!")
  } catch (error) {
    console.error("❌ Error seeding admin:", error)
    process.exit(1)
  } finally {
    await client.close()
    console.log("✅ Database connection closed")
  }
}

// Run the seed function
seedAdmin()

