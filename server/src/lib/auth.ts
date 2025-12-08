import { SignJWT, jwtVerify } from "jose"
import { getCollection } from "../config/mongodb"
import { ObjectId } from "mongodb"

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET || "your-secret-key-change-in-production")

export interface User {
  _id?: ObjectId
  email: string
  password: string
  name: string
  phone?: string
  role: "customer" | "restaurant" | "admin"
  avatar?: string
  createdAt: Date
  updatedAt: Date
  // Customer specific
  savedAddresses?: Address[]
  favorites?: string[]
  // Restaurant specific
  restaurantId?: string
  restaurantName?: string
  // Admin specific
  permissions?: string[]
}

export interface Address {
  id: string
  label: string
  address: string
  city: string
  pincode: string
  isDefault: boolean
}

export interface SessionPayload {
  userId: string
  email: string
  role: string
  name: string
  exp?: number
}

// Simple hash function for demo (in production use bcrypt)
export async function hashPassword(password: string): Promise<string> {
  const encoder = new TextEncoder()
  const data = encoder.encode(password + "dineontime-salt")
  const hashBuffer = await crypto.subtle.digest("SHA-256", data)
  const hashArray = Array.from(new Uint8Array(hashBuffer))
  return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("")
}

export async function verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
  const hash = await hashPassword(password)
  return hash === hashedPassword
}

export async function createSession(user: User): Promise<string> {
  const payload: SessionPayload = {
    userId: user._id!.toString(),
    email: user.email,
    role: user.role,
    name: user.name,
  }

  const token = await new SignJWT(payload).setProtectedHeader({ alg: "HS256" }).setExpirationTime("7d").sign(JWT_SECRET)

  return token
}

export async function verifySession(token: string): Promise<SessionPayload | null> {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET)
    return payload as SessionPayload
  } catch {
    return null
  }
}

export async function getCurrentUser(token: string): Promise<User | null> {
  const session = await verifySession(token)
  if (!session) return null

  const users = await getCollection<User>("users")
  const user = await users.findOne({ _id: new ObjectId(session.userId) })
  return user
}

export async function requireAuth(token: string, allowedRoles?: string[]): Promise<SessionPayload> {
  const session = await verifySession(token)
  if (!session) {
    throw new Error("Unauthorized")
  }
  if (allowedRoles && !allowedRoles.includes(session.role)) {
    throw new Error("Forbidden")
  }
  return session
}

