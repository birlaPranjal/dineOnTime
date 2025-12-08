import { type NextRequest, NextResponse } from "next/server"
import { getCollection } from "@/lib/mongodb"
import { hashPassword, createSession, type User } from "@/lib/auth"
import { cookies } from "next/headers"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, password, name, phone, role = "customer" } = body

    if (!email || !password || !name) {
      return NextResponse.json({ error: "Email, password, and name are required" }, { status: 400 })
    }

    const users = await getCollection<User>("users")

    // Check if user exists
    const existingUser = await users.findOne({ email: email.toLowerCase() })
    if (existingUser) {
      return NextResponse.json({ error: "User with this email already exists" }, { status: 400 })
    }

    // Hash password and create user
    const hashedPassword = await hashPassword(password)
    const newUser: User = {
      email: email.toLowerCase(),
      password: hashedPassword,
      name,
      phone,
      role: role as "customer" | "restaurant" | "admin",
      avatar: `/placeholder.svg?height=40&width=40&query=${name.charAt(0)}`,
      savedAddresses: [],
      favorites: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    const result = await users.insertOne(newUser as any)
    newUser._id = result.insertedId

    // Create session
    const token = await createSession(newUser)
    const cookieStore = await cookies()
    cookieStore.set("auth-token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: "/",
    })

    return NextResponse.json({
      success: true,
      user: {
        id: newUser._id.toString(),
        email: newUser.email,
        name: newUser.name,
        role: newUser.role,
      },
    })
  } catch (error) {
    console.error("Registration error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
