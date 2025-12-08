"use client"

import type React from "react"

import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar"
import { DashboardSidebar } from "@/components/dashboard/dashboard-sidebar"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { customerUser } from "@/lib/mock-dashboard-data"
import { LayoutDashboard, UtensilsCrossed, CalendarDays, Heart, MapPin, Star, Settings, HelpCircle, User } from "lucide-react"

const navItems = [
  { title: "Dashboard", href: "/customer/dashboard", icon: <LayoutDashboard className="h-4 w-4" /> },
  { title: "My Orders", href: "/customer/dashboard/orders", icon: <UtensilsCrossed className="h-4 w-4" />, badge: "3" },
  { title: "My Bookings", href: "/customer/dashboard/bookings", icon: <CalendarDays className="h-4 w-4" /> },
  { title: "Favorites", href: "/customer/dashboard/favorites", icon: <Heart className="h-4 w-4" /> },
  { title: "Saved Addresses", href: "/customer/dashboard/addresses", icon: <MapPin className="h-4 w-4" /> },
  { title: "My Reviews", href: "/customer/dashboard/reviews", icon: <Star className="h-4 w-4" /> },
  { title: "Profile", href: "/customer/dashboard/profile", icon: <User className="h-4 w-4" /> },
  { title: "Settings", href: "/customer/dashboard/settings", icon: <Settings className="h-4 w-4" /> },
  { title: "Help & Support", href: "/customer/dashboard/support", icon: <HelpCircle className="h-4 w-4" /> },
]

export default function CustomerDashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <SidebarProvider>
      <DashboardSidebar
        navItems={navItems}
        user={{
          name: customerUser.name,
          email: customerUser.email,
          avatar: customerUser.avatar,
          role: "Customer",
        }}
        brandTitle="DineOnTime"
      />
      <SidebarInset className="bg-cream">
        <DashboardHeader
          title="Dashboard"
          user={{
            name: customerUser.name,
            email: customerUser.email,
            avatar: customerUser.avatar,
          }}
          notifications={3}
        />
        <main className="flex-1 p-4 md:p-6">{children}</main>
      </SidebarInset>
    </SidebarProvider>
  )
}
