"use client"

import { useState, useEffect, useCallback } from "react"
import { useRouter } from "next/navigation"

interface User {
  id: string
  email: string
  name: string
  role: string
  avatar?: string
  phone?: string
}

export function useAuth() {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  const fetchUser = useCallback(async () => {
    try {
      const res = await fetch("/api/auth/me")
      if (res.ok) {
        const data = await res.json()
        setUser(data.user)
      } else {
        setUser(null)
      }
    } catch {
      setUser(null)
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchUser()
  }, [fetchUser])

  const login = async (email: string, password: string, role?: string) => {
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password, role }),
    })

    const data = await res.json()

    if (!res.ok) {
      throw new Error(data.error || "Login failed")
    }

    setUser(data.user)
    return data
  }

  const register = async (userData: {
    email: string
    password: string
    name: string
    phone?: string
    role?: string
  }) => {
    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(userData),
    })

    const data = await res.json()

    if (!res.ok) {
      throw new Error(data.error || "Registration failed")
    }

    setUser(data.user)
    return data
  }

  const logout = async () => {
    await fetch("/api/auth/logout", { method: "POST" })
    setUser(null)
    router.push("/")
  }

  return {
    user,
    isLoading,
    isAuthenticated: !!user,
    login,
    register,
    logout,
    refetch: fetchUser,
  }
}
