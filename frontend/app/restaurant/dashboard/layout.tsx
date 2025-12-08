"use client"

import type React from "react"

import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar"
import { DashboardSidebar } from "@/components/dashboard/dashboard-sidebar"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { restaurantUser } from "@/lib/mock-dashboard-data"
import {
  LayoutDashboard,
  ClipboardList,
  CalendarDays,
  UtensilsCrossed,
  Users,
  BarChart3,
  Star,
  Settings,
  CreditCard,
  Grid3X3,
  User,
} from "lucide-react"

const navItems = [
  { title: "Dashboard", href: "/restaurant/dashboard", icon: <LayoutDashboard className="h-4 w-4" /> },
  { title: "Orders", href: "/restaurant/dashboard/orders", icon: <ClipboardList className="h-4 w-4" />, badge: "5" },
  { title: "Bookings", href: "/restaurant/dashboard/bookings", icon: <CalendarDays className="h-4 w-4" />, badge: "3" },
  { title: "Tables", href: "/restaurant/dashboard/tables", icon: <Grid3X3 className="h-4 w-4" /> },
  { title: "Menu Management", href: "/restaurant/dashboard/menu", icon: <UtensilsCrossed className="h-4 w-4" /> },
  { title: "Customer ETAs", href: "/restaurant/dashboard/eta", icon: <Users className="h-4 w-4" /> },
  { title: "Analytics", href: "/restaurant/dashboard/analytics", icon: <BarChart3 className="h-4 w-4" /> },
  { title: "Reviews", href: "/restaurant/dashboard/reviews", icon: <Star className="h-4 w-4" /> },
  { title: "Payments", href: "/restaurant/dashboard/payments", icon: <CreditCard className="h-4 w-4" /> },
  { title: "Profile", href: "/restaurant/dashboard/profile", icon: <User className="h-4 w-4" /> },
  { title: "Settings", href: "/restaurant/dashboard/settings", icon: <Settings className="h-4 w-4" /> },
]

export default function RestaurantDashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <SidebarProvider>
      <DashboardSidebar
        navItems={navItems}
        user={{
          name: restaurantUser.name,
          email: restaurantUser.email,
          avatar: restaurantUser.avatar,
          role: restaurantUser.role,
        }}
        brandTitle="DineOnTime"
        brandSubtitle="Restaurant Panel"
      />
      <SidebarInset className="bg-cream">
        <DashboardHeader
          title={restaurantUser.restaurant.name}
          user={{
            name: restaurantUser.name,
            email: restaurantUser.email,
            avatar: restaurantUser.avatar,
          }}
          notifications={5}
        />
        <main className="flex-1 p-4 md:p-6">{children}</main>
      </SidebarInset>
    </SidebarProvider>
  )
}
