import { NextResponse } from "next/server"
import { getSession } from "@/lib/auth"
import { getCollection } from "@/lib/mongodb"
import { ObjectId } from "mongodb"

export async function GET() {
  try {
    const session = await getSession()

    if (!session) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 })
    }

    const users = await getCollection("users")
    const user = await users.findOne({ _id: new ObjectId(session.userId) }, { projection: { password: 0 } })

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    return NextResponse.json({
      user: {
        id: user._id.toString(),
        email: user.email,
        name: user.name,
        role: user.role,
        avatar: user.avatar,
        phone: user.phone,
        savedAddresses: user.savedAddresses,
        favorites: user.favorites,
      },
    })
  } catch (error) {
    console.error("Get user error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
