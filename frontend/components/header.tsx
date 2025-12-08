"use client"

import Link from "next/link"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Menu, X, Clock } from "lucide-react"

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 w-full bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/80 border-b border-border">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-primary">
              <Clock className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold text-navy">DineOnTime</span>
          </Link>

          <nav className="hidden md:flex items-center gap-8">
            <Link
              href="/restaurants"
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              Restaurants
            </Link>
            <Link
              href="/how-it-works"
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              How it Works
            </Link>
            <Link
              href="/for-restaurants"
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              For Restaurants
            </Link>
            <Link
              href="/about"
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              About
            </Link>
          </nav>

          <div className="hidden md:flex items-center gap-3">
            <Button variant="ghost" asChild>
              <Link href="/customer/login">Log in</Link>
            </Button>
            <Button asChild>
              <Link href="/customer/signup">Sign up</Link>
            </Button>
          </div>

          <button className="md:hidden p-2" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-border">
            <nav className="flex flex-col gap-4">
              <Link href="/restaurants" className="text-sm font-medium text-muted-foreground hover:text-foreground">
                Restaurants
              </Link>
              <Link href="/how-it-works" className="text-sm font-medium text-muted-foreground hover:text-foreground">
                How it Works
              </Link>
              <Link href="/for-restaurants" className="text-sm font-medium text-muted-foreground hover:text-foreground">
                For Restaurants
              </Link>
              <Link href="/about" className="text-sm font-medium text-muted-foreground hover:text-foreground">
                About
              </Link>
              <div className="flex flex-col gap-2 pt-4 border-t border-border">
                <Button variant="ghost" asChild className="justify-start">
                  <Link href="/customer/login">Log in</Link>
                </Button>
                <Button asChild>
                  <Link href="/customer/signup">Sign up</Link>
                </Button>
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  )
}
