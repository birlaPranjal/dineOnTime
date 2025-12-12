"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Home, ArrowLeft } from "lucide-react"

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/5 via-background to-primary/10 p-6">
      <div className="max-w-md w-full text-center space-y-8">
        <div className="space-y-4">
          <h1 className="text-9xl font-bold text-primary/20">404</h1>
          <h2 className="text-3xl font-bold text-navy">Page Not Found</h2>
          <p className="text-muted-foreground text-lg">
            Oops! The page you're looking for doesn't exist or has been moved.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button asChild size="lg" className="bg-primary hover:bg-primary/90">
            <Link href="/">
              <Home className="h-4 w-4 mr-2" />
              Go Home
            </Link>
          </Button>
          <Button
            asChild
            variant="outline"
            size="lg"
            onClick={() => window.history.back()}
            className="bg-transparent"
          >
            <Link href="#" onClick={(e) => {
              e.preventDefault()
              window.history.back()
            }}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Go Back
            </Link>
          </Button>
        </div>

        <div className="pt-8 space-y-2 text-sm text-muted-foreground">
          <p>You might want to:</p>
          <ul className="list-disc list-inside space-y-1">
            <li>Check the URL for typos</li>
            <li>Return to the homepage</li>
            <li>Browse our restaurants</li>
          </ul>
        </div>
      </div>
    </div>
  )
}



