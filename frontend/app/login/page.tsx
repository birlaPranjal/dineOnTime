"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Clock, Eye, EyeOff, ArrowLeft, Loader2, User, Store, Shield } from "lucide-react"
import { toast } from "sonner"

type UserRole = "customer" | "restaurant" | "admin"

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [role, setRole] = useState<UserRole>("customer")
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const { authApi } = await import("@/lib/api")
      const data = await authApi.login(email, password, role)

      toast.success("Login successful!")
      router.push(data.redirectUrl || "/customer/dashboard")
    } catch (error: any) {
      toast.error(error.message || "Something went wrong. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-cream flex">
      <div className="hidden lg:flex lg:w-1/2 bg-navy p-12 flex-col justify-between">
        <Link href="/" className="flex items-center gap-2">
          <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-primary">
            <Clock className="h-5 w-5 text-primary-foreground" />
          </div>
          <span className="text-xl font-bold text-cream">DineOnTime</span>
        </Link>

        <div className="space-y-6">
          <h1 className="text-4xl font-bold text-cream leading-tight">Welcome back to smarter dining</h1>
          <p className="text-cream/70 text-lg">Log in to access your bookings, pre-orders, and favorite restaurants.</p>
        </div>

        <div className="bg-cream/10 rounded-xl p-6 border border-cream/20">
          <p className="text-cream/90 italic mb-4">
            {`"DineOnTime has completely changed how I plan my meals. No more waiting!"`}
          </p>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-cream/20 flex items-center justify-center">
              <span className="text-sm font-semibold text-cream">P</span>
            </div>
            <div>
              <p className="font-medium text-cream">Priya Menon</p>
              <p className="text-sm text-cream/60">Regular User</p>
            </div>
          </div>
        </div>
      </div>

      <div className="flex-1 flex flex-col">
        <div className="p-6 lg:hidden">
          <Link href="/" className="flex items-center gap-2">
            <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-primary">
              <Clock className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold text-navy">DineOnTime</span>
          </Link>
        </div>

        <div className="flex-1 flex items-center justify-center p-6">
          <div className="w-full max-w-md space-y-8">
            <div className="lg:hidden">
              <Link
                href="/"
                className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to home
              </Link>
            </div>

            <div className="space-y-2">
              <h2 className="text-3xl font-bold text-navy">Log in</h2>
              <p className="text-muted-foreground">
                {"Don't have an account?"}{" "}
                <Link href="/signup" className="text-primary hover:underline font-medium">
                  Sign up
                </Link>
              </p>
            </div>

            {/* Role Selection */}
            <div className="space-y-2">
              <Label>Login as</Label>
              <div className="grid grid-cols-3 gap-2">
                <Button
                  type="button"
                  variant={role === "customer" ? "default" : "outline"}
                  className="h-auto py-3 flex flex-col gap-1"
                  onClick={() => setRole("customer")}
                >
                  <User className="h-4 w-4" />
                  <span className="text-xs">Customer</span>
                </Button>
                <Button
                  type="button"
                  variant={role === "restaurant" ? "default" : "outline"}
                  className="h-auto py-3 flex flex-col gap-1"
                  onClick={() => setRole("restaurant")}
                >
                  <Store className="h-4 w-4" />
                  <span className="text-xs">Restaurant</span>
                </Button>
                <Button
                  type="button"
                  variant={role === "admin" ? "default" : "outline"}
                  className="h-auto py-3 flex flex-col gap-1"
                  onClick={() => setRole("admin")}
                >
                  <Shield className="h-4 w-4" />
                  <span className="text-xs">Admin</span>
                </Button>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="h-12"
                />
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password">Password</Label>
                  <Link href="/forgot-password" className="text-sm text-primary hover:underline">
                    Forgot password?
                  </Link>
                </div>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="h-12 pr-12"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              <Button type="submit" className="w-full h-12 text-base" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Logging in...
                  </>
                ) : (
                  "Log in"
                )}
              </Button>
            </form>

            {role === "admin" && (
              <div className="text-center">
                <p className="text-sm text-muted-foreground">
                  Admin login?{" "}
                  <Link href="/admin/login" className="text-primary hover:underline font-medium">
                    Use dedicated admin portal
                  </Link>
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
