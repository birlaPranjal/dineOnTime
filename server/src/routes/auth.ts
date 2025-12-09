import { Router, Request, Response } from "express"
import { getCollection } from "../config/mongodb"
import { hashPassword, createSession, verifyPassword, type User } from "../lib/auth"
import { authenticate } from "../middleware/auth"
import { sendOTPEmail } from "../lib/email"
import { ObjectId } from "mongodb"

const router = Router()

// Register
router.post("/register", async (req: Request, res: Response) => {
  try {
    const { email, password, name, phone, role = "customer" } = req.body

    if (!email || !password || !name) {
      return res.status(400).json({ error: "Email, password, and name are required" })
    }

    const users = await getCollection<User>("users")

    // Check if user exists
    const existingUser = await users.findOne({ email: email.toLowerCase() })
    if (existingUser) {
      return res.status(400).json({ error: "User with this email already exists" })
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
    
    // Set cookie for backward compatibility
    res.cookie("auth-token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7 * 1000, // 7 days
      path: "/",
    })

    return res.json({
      success: true,
      token,
      user: {
        id: newUser._id.toString(),
        email: newUser.email,
        name: newUser.name,
        role: newUser.role,
      },
    })
  } catch (error) {
    console.error("Registration error:", error)
    return res.status(500).json({ error: "Internal server error" })
  }
})

// Login
router.post("/login", async (req: Request, res: Response) => {
  try {
    const { email, password, role } = req.body

    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required" })
    }

    const users = await getCollection<User>("users")

    // Find user
    const query: any = { email: email.toLowerCase() }
    if (role) {
      query.role = role
    }

    const user = await users.findOne(query)
    if (!user) {
      return res.status(401).json({ error: "Invalid credentials" })
    }

    // Verify password
    const isValid = await verifyPassword(password, user.password)
    if (!isValid) {
      return res.status(401).json({ error: "Invalid credentials" })
    }

    // Create session
    const token = await createSession(user as User)
    
    // Set cookie for backward compatibility
    res.cookie("auth-token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7 * 1000, // 7 days
      path: "/",
    })

    // Determine redirect based on role
    let redirectUrl = "/customer/dashboard"
    if (user.role === "restaurant") {
      redirectUrl = "/restaurant/dashboard"
    } else if (user.role === "admin") {
      redirectUrl = "/admin/dashboard"
    }

    return res.json({
      success: true,
      token,
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
    return res.status(500).json({ error: "Internal server error" })
  }
})

// Logout
router.post("/logout", (req: Request, res: Response) => {
  try {
    res.clearCookie("auth-token", { path: "/" })
    return res.json({ success: true })
  } catch (error) {
    console.error("Logout error:", error)
    return res.status(500).json({ error: "Internal server error" })
  }
})

// Get current user
router.get("/me", authenticate, async (req: any, res: Response) => {
  try {
    const users = await getCollection("users")
    const user = await users.findOne({ _id: new ObjectId(req.user!.userId) }, { projection: { password: 0 } })

    if (!user) {
      return res.status(404).json({ error: "User not found" })
    }

    return res.json({
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
    return res.status(500).json({ error: "Internal server error" })
  }
})

// Forgot Password - Request OTP
router.post("/forgot-password", async (req: Request, res: Response) => {
  try {
    const { email } = req.body

    if (!email) {
      return res.status(400).json({ error: "Email is required" })
    }

    const users = await getCollection<User>("users")
    const user = await users.findOne({ email: email.toLowerCase() })

    // Don't reveal if user exists or not for security
    if (!user) {
      // Still return success to prevent email enumeration
      return res.json({ success: true, message: "If the email exists, an OTP has been sent" })
    }

    // Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString()
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000) // 10 minutes

    // Store OTP in database
    const otps = await getCollection("password_resets")
    await otps.deleteMany({ email: email.toLowerCase() }) // Remove old OTPs
    await otps.insertOne({
      email: email.toLowerCase(),
      otp,
      expiresAt,
      createdAt: new Date(),
      used: false,
    })

    // Send OTP email
    try {
      await sendOTPEmail(user.email, otp, user.name)
    } catch (emailError) {
      console.error("Email sending error:", emailError)
      return res.status(500).json({ error: "Failed to send OTP email. Please try again later." })
    }

    return res.json({ success: true, message: "OTP has been sent to your email" })
  } catch (error) {
    console.error("Forgot password error:", error)
    return res.status(500).json({ error: "Internal server error" })
  }
})

// Verify OTP
router.post("/verify-otp", async (req: Request, res: Response) => {
  try {
    const { email, otp } = req.body

    if (!email || !otp) {
      return res.status(400).json({ error: "Email and OTP are required" })
    }

    const otps = await getCollection("password_resets")
    const otpRecord = await otps.findOne({
      email: email.toLowerCase(),
      otp,
      used: false,
      expiresAt: { $gt: new Date() },
    })

    if (!otpRecord) {
      return res.status(400).json({ error: "Invalid or expired OTP" })
    }

    return res.json({ success: true, message: "OTP verified successfully" })
  } catch (error) {
    console.error("Verify OTP error:", error)
    return res.status(500).json({ error: "Internal server error" })
  }
})

// Reset Password
router.post("/reset-password", async (req: Request, res: Response) => {
  try {
    const { email, otp, newPassword } = req.body

    if (!email || !otp || !newPassword) {
      return res.status(400).json({ error: "Email, OTP, and new password are required" })
    }

    if (newPassword.length < 8) {
      return res.status(400).json({ error: "Password must be at least 8 characters long" })
    }

    // Verify OTP
    const otps = await getCollection("password_resets")
    const otpRecord = await otps.findOne({
      email: email.toLowerCase(),
      otp,
      used: false,
      expiresAt: { $gt: new Date() },
    })

    if (!otpRecord) {
      return res.status(400).json({ error: "Invalid or expired OTP" })
    }

    // Update password
    const users = await getCollection<User>("users")
    const hashedPassword = await hashPassword(newPassword)
    await users.updateOne(
      { email: email.toLowerCase() },
      { $set: { password: hashedPassword, updatedAt: new Date() } }
    )

    // Mark OTP as used
    await otps.updateOne({ _id: otpRecord._id }, { $set: { used: true } })

    return res.json({ success: true, message: "Password reset successfully" })
  } catch (error) {
    console.error("Reset password error:", error)
    return res.status(500).json({ error: "Internal server error" })
  }
})

export default router

