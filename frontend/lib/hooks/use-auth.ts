"use client"

import { useState, useEffect, useCallback } from "react"
import { useRouter } from "next/navigation"
import { authApi } from "@/lib/api"

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
      const data = await authApi.me()
      setUser(data.user)
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
    const data = await authApi.login(email, password, role)
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
    const data = await authApi.register(userData)
    setUser(data.user)
    return data
  }

  const logout = async () => {
    await authApi.logout()
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
