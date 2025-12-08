"use client"

import type React from "react"
import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Clock, Eye, EyeOff, ArrowLeft, BarChart3, ClipboardList, Users, Loader2 } from "lucide-react"
import { toast } from "sonner"

export default function RestaurantLoginPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const { authApi } = await import("@/lib/api")
      const data = await authApi.login(email, password, "restaurant")

      toast.success("Login successful!")
      router.push(data.redirectUrl || "/restaurant/dashboard")
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
          <span className="text-sm text-cream/60 ml-2">for Restaurants</span>
        </Link>

        <div className="space-y-6">
          <h1 className="text-4xl font-bold text-cream leading-tight">Manage your restaurant smarter</h1>
          <p className="text-cream/70 text-lg">
            Access your dashboard to manage orders, bookings, and optimize your operations.
          </p>

          <div className="space-y-4">
            <div className="flex items-center gap-4 bg-cream/10 rounded-xl p-4 border border-cream/20">
              <div className="w-12 h-12 rounded-lg bg-primary/20 flex items-center justify-center">
                <ClipboardList className="w-6 h-6 text-primary" />
              </div>
              <div>
                <p className="font-medium text-cream">Real-time Orders</p>
                <p className="text-sm text-cream/60">Track and manage incoming orders</p>
              </div>
            </div>
            <div className="flex items-center gap-4 bg-cream/10 rounded-xl p-4 border border-cream/20">
              <div className="w-12 h-12 rounded-lg bg-primary/20 flex items-center justify-center">
                <Users className="w-6 h-6 text-primary" />
              </div>
              <div>
                <p className="font-medium text-cream">Smart ETA Tracking</p>
                <p className="text-sm text-cream/60">Know when customers arrive</p>
              </div>
            </div>
            <div className="flex items-center gap-4 bg-cream/10 rounded-xl p-4 border border-cream/20">
              <div className="w-12 h-12 rounded-lg bg-primary/20 flex items-center justify-center">
                <BarChart3 className="w-6 h-6 text-primary" />
              </div>
              <div>
                <p className="font-medium text-cream">Analytics & Reports</p>
                <p className="text-sm text-cream/60">Data-driven insights for growth</p>
              </div>
            </div>
          </div>
        </div>

        <p className="text-cream/50 text-sm">Need help? Contact support@dineontime.com</p>
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
              <h2 className="text-3xl font-bold text-navy">Restaurant Login</h2>
              <p className="text-muted-foreground">Access your restaurant management dashboard</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="restaurant@example.com"
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
                  "Log in to Dashboard"
                )}
              </Button>
            </form>

            <div className="text-center space-y-4">
              <p className="text-sm text-muted-foreground">
                Want to partner with us?{" "}
                <Link href="/for-restaurants" className="text-primary hover:underline font-medium">
                  Register your restaurant
                </Link>
              </p>
              <p className="text-xs text-muted-foreground">
                Looking for customer login?{" "}
                <Link href="/customer/login" className="text-primary hover:underline">
                  Click here
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
