"use client"

import type React from "react"
import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Eye, EyeOff, Shield, Lock, Loader2 } from "lucide-react"
import { toast } from "sonner"

export default function AdminLoginPage() {
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
      const data = await authApi.login(email, password, "admin")

      toast.success("Login successful!")
      router.push(data.redirectUrl || "/admin/dashboard")
    } catch (error: any) {
      toast.error(error.message || "Something went wrong. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#050E3C] flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-2xl p-8 space-y-8">
          <div className="text-center space-y-2">
            <div className="flex justify-center mb-4">
              <div className="flex items-center justify-center w-16 h-16 rounded-2xl bg-[#DC0000]/10 border-2 border-[#DC0000]/30">
                <Shield className="h-8 w-8 text-[#DC0000]" />
              </div>
            </div>
            <h1 className="text-2xl font-bold text-[#050E3C]">Admin Portal</h1>
            <p className="text-gray-600 text-sm">DineOnTime Platform Administration</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-[#050E3C]">Admin Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="admin@dineontime.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="h-12"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-[#050E3C]">Password</Label>
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
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <Button type="submit" className="w-full h-12 text-base bg-[#DC0000] hover:bg-[#DC0000]/90" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Authenticating...
                </>
              ) : (
                "Access Dashboard"
              )}
            </Button>
          </form>

          <div className="flex items-center justify-center gap-2 text-xs text-gray-500">
            <Lock className="h-3 w-3" />
            <span>Secured with 2FA authentication</span>
          </div>

          <div className="text-center space-y-2">
            <Link href="/login" className="text-sm text-[#DC0000] hover:underline block">
              Use main login page
            </Link>
            <Link href="/" className="text-sm text-gray-600 hover:text-gray-800 block">
              Return to main site
            </Link>
          </div>
        </div>

        <p className="text-center text-xs text-white/70 mt-6">
          Authorized personnel only. All access attempts are logged.
        </p>
      </div>
    </div>
  )
}
