import { type NextRequest, NextResponse } from "next/server"
import { getCollection } from "@/lib/mongodb"
import { verifyPassword, createSession, type User } from "@/lib/auth"
import { cookies } from "next/headers"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, password, role } = body

    if (!email || !password) {
      return NextResponse.json({ error: "Email and password are required" }, { status: 400 })
    }

    const users = await getCollection<User>("users")

    // Find user
    const query: any = { email: email.toLowerCase() }
    if (role) {
      query.role = role
    }

    const user = await users.findOne(query)
    if (!user) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 })
    }

    // Verify password
    const isValid = await verifyPassword(password, user.password)
    if (!isValid) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 })
    }

    // Create session
    const token = await createSession(user as User)
    const cookieStore = await cookies()
    cookieStore.set("auth-token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: "/",
    })

    // Determine redirect based on role
    let redirectUrl = "/customer/dashboard"
    if (user.role === "restaurant") {
      redirectUrl = "/restaurant/dashboard"
    } else if (user.role === "admin") {
      redirectUrl = "/admin/dashboard"
    }

    return NextResponse.json({
      success: true,
      user: {
        id: user._id!.toString(),
        email: user.email,
        name: user.name,
        role: user.role,
        avatar: user.avatar,
      },
      redirectUrl,
    })
  } catch (error) {
    console.error("Login error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
