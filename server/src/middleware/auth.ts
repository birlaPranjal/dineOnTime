import { Request, Response, NextFunction } from "express"
import { verifySession, requireAuth as requireAuthUtil } from "../lib/auth"

export interface AuthRequest extends Request {
  user?: {
    userId: string
    email: string
    role: string
    name: string
  }
}

export function getAuthToken(req: Request): string | null {
  // Check cookies first
  const cookieToken = req.cookies?.["auth-token"]
  if (cookieToken) return cookieToken

  // Check Authorization header
  const authHeader = req.headers.authorization
  if (authHeader && authHeader.startsWith("Bearer ")) {
    return authHeader.substring(7)
  }

  return null
}

export async function authenticate(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const token = getAuthToken(req)
    if (!token) {
      return res.status(401).json({ error: "Not authenticated" })
    }

    const session = await verifySession(token)
    if (!session) {
      return res.status(401).json({ error: "Invalid token" })
    }

    req.user = session
    next()
  } catch (error) {
    return res.status(401).json({ error: "Authentication failed" })
  }
}

export function requireAuth(allowedRoles?: string[]) {
  return async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const token = getAuthToken(req)
      if (!token) {
        return res.status(401).json({ error: "Unauthorized" })
      }

      const session = await requireAuthUtil(token, allowedRoles)
      req.user = session
      next()
    } catch (error: any) {
      if (error.message === "Unauthorized") {
        return res.status(401).json({ error: "Unauthorized" })
      }
      if (error.message === "Forbidden") {
        return res.status(403).json({ error: "Forbidden" })
      }
      return res.status(401).json({ error: "Authentication failed" })
    }
  }
}

