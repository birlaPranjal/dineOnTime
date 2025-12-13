"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { Loader2 } from "lucide-react"

/**
 * Setup page - redirects to profile page
 * Profile page handles both setup and editing
 */
export default function RestaurantSetupPage() {
  const router = useRouter()

  useEffect(() => {
    // Always redirect to profile page which handles both setup and editing
    router.replace("/restaurant/dashboard/profile")
  }, [router])

  return (
    <div className="flex items-center justify-center min-h-[400px]">
      <div className="text-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto mb-4" />
        <p className="text-muted-foreground">Redirecting to profile page...</p>
      </div>
    </div>
  )
}
