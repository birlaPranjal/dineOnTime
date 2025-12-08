"use client"

import type React from "react"
import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Clock, Eye, EyeOff, ArrowLeft, Smartphone, Loader2 } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { toast } from "sonner"

export default function CustomerLoginPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [phone, setPhone] = useState("")
  const [otp, setOtp] = useState("")
  const [otpSent, setOtpSent] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const { authApi } = await import("@/lib/api")
      const data = await authApi.login(email, password, "customer")

      toast.success("Login successful!")
      router.push(data.redirectUrl || "/customer/dashboard")
    } catch (error: any) {
      toast.error(error.message || "Something went wrong. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleSendOtp = async () => {
    setIsLoading(true)
    await new Promise((resolve) => setTimeout(resolve, 1000))
    setOtpSent(true)
    setIsLoading(false)
    toast.success("OTP sent to your phone!")
  }

  const handleOtpLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    await new Promise((resolve) => setTimeout(resolve, 1000))
    setIsLoading(false)
    toast.success("Login successful!")
    router.push("/customer/dashboard")
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
          <h1 className="text-4xl font-bold text-cream leading-tight">Your dining experience awaits</h1>
          <p className="text-cream/70 text-lg">
            Log in to manage your bookings, track orders, and discover new restaurants.
          </p>

          <div className="grid grid-cols-2 gap-4 pt-4">
            <div className="bg-cream/10 rounded-xl p-4 border border-cream/20">
              <p className="text-3xl font-bold text-primary">500+</p>
              <p className="text-sm text-cream/70">Partner Restaurants</p>
            </div>
            <div className="bg-cream/10 rounded-xl p-4 border border-cream/20">
              <p className="text-3xl font-bold text-primary">15K+</p>
              <p className="text-sm text-cream/70">Happy Diners</p>
            </div>
          </div>
        </div>

        <div className="bg-cream/10 rounded-xl p-6 border border-cream/20">
          <p className="text-cream/90 italic mb-4">
            {`"Pre-ordering saved us so much time! The food was served within minutes of arriving."`}
          </p>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-cream/20 flex items-center justify-center">
              <span className="text-sm font-semibold text-cream">A</span>
            </div>
            <div>
              <p className="font-medium text-cream">Aditi Rao</p>
              <p className="text-sm text-cream/60">Bangalore</p>
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
              <h2 className="text-3xl font-bold text-navy">Welcome back</h2>
              <p className="text-muted-foreground">
                {"Don't have an account?"}{" "}
                <Link href="/customer/signup" className="text-primary hover:underline font-medium">
                  Sign up
                </Link>
              </p>
            </div>

            <Tabs defaultValue="email" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="email">Email</TabsTrigger>
                <TabsTrigger value="phone">Phone OTP</TabsTrigger>
              </TabsList>

              <TabsContent value="email" className="mt-6">
                <form onSubmit={handleEmailLogin} className="space-y-6">
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
              </TabsContent>

              <TabsContent value="phone" className="mt-6">
                <form onSubmit={handleOtpLogin} className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <div className="flex gap-2">
                      <Input
                        id="phone"
                        type="tel"
                        placeholder="+91 98765 43210"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        required
                        className="h-12 flex-1"
                        disabled={otpSent}
                      />
                      {!otpSent && (
                        <Button
                          type="button"
                          variant="outline"
                          className="h-12 bg-transparent"
                          onClick={handleSendOtp}
                          disabled={isLoading || !phone}
                        >
                          {isLoading ? "Sending..." : "Send OTP"}
                        </Button>
                      )}
                    </div>
                  </div>

                  {otpSent && (
                    <div className="space-y-2">
                      <Label htmlFor="otp">Enter OTP</Label>
                      <Input
                        id="otp"
                        type="text"
                        placeholder="Enter 6-digit OTP"
                        value={otp}
                        onChange={(e) => setOtp(e.target.value)}
                        required
                        maxLength={6}
                        className="h-12 text-center text-lg tracking-widest"
                      />
                      <p className="text-sm text-muted-foreground">
                        {"Didn't receive OTP?"}{" "}
                        <button type="button" className="text-primary hover:underline" onClick={handleSendOtp}>
                          Resend
                        </button>
                      </p>
                    </div>
                  )}

                  {otpSent && (
                    <Button type="submit" className="w-full h-12 text-base" disabled={isLoading || otp.length !== 6}>
                      {isLoading ? "Verifying..." : "Verify & Login"}
                    </Button>
                  )}
                </form>
              </TabsContent>
            </Tabs>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-border" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-cream text-muted-foreground">Or continue with</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Button variant="outline" className="h-12 bg-transparent">
                <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                  <path
                    fill="currentColor"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="currentColor"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="currentColor"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  />
                  <path
                    fill="currentColor"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
                Google
              </Button>
              <Button variant="outline" className="h-12 bg-transparent">
                <Smartphone className="w-5 h-5 mr-2" />
                Apple
              </Button>
            </div>

            <p className="text-center text-xs text-muted-foreground">
              Are you a restaurant partner?{" "}
              <Link href="/restaurant/login" className="text-primary hover:underline">
                Login here
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
