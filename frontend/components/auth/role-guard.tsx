"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/hooks/use-auth"

interface RoleGuardProps {
  children: React.ReactNode
  allowedRoles: string[]
  redirectTo?: string
}

export function RoleGuard({ children, allowedRoles, redirectTo }: RoleGuardProps) {
  const { user, isLoading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isLoading) {
      if (!user) {
        // Not authenticated, redirect to login
        const role = allowedRoles[0] || "customer"
        router.push(`/${role}/login`)
      } else if (!allowedRoles.includes(user.role)) {
        // Not authorized, redirect to appropriate dashboard
        if (redirectTo) {
          router.push(redirectTo)
        } else if (user.role === "admin") {
          router.push("/admin/dashboard")
        } else if (user.role === "restaurant") {
          router.push("/restaurant/dashboard")
        } else if (user.role === "customer") {
          router.push("/customer/dashboard")
        } else {
          router.push("/")
        }
      }
    }
  }, [user, isLoading, allowedRoles, redirectTo, router])

  // Show loading state
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    )
  }

  // Show nothing while redirecting
  if (!user || !allowedRoles.includes(user.role)) {
    return null
  }

  return <>{children}</>
}

