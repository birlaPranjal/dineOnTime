"use client"

import type React from "react"

import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar"
import { DashboardSidebar } from "@/components/dashboard/dashboard-sidebar"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { useAuth } from "@/lib/hooks/use-auth"
import { AdminGuard } from "@/components/auth/admin-guard"
import {
  LayoutDashboard,
  Store,
  Users,
  BarChart3,
  CreditCard,
  MessageSquare,
  FileText,
  Settings,
  Bell,
  User,
  Handshake,
} from "lucide-react"

const navItems = [
  { title: "Dashboard", href: "/admin/dashboard", icon: <LayoutDashboard className="h-4 w-4" /> },
  { title: "Partnerships", href: "/admin/dashboard/partnerships", icon: <Handshake className="h-4 w-4" /> },
  { title: "Restaurants", href: "/admin/dashboard/restaurants", icon: <Store className="h-4 w-4" />, badge: "12" },
  { title: "Users", href: "/admin/dashboard/users", icon: <Users className="h-4 w-4" /> },
  { title: "Analytics", href: "/admin/dashboard/analytics", icon: <BarChart3 className="h-4 w-4" /> },
  { title: "Settlements", href: "/admin/dashboard/settlements", icon: <CreditCard className="h-4 w-4" /> },
  { title: "Complaints", href: "/admin/dashboard/complaints", icon: <MessageSquare className="h-4 w-4" />, badge: "8" },
  { title: "CMS", href: "/admin/dashboard/cms", icon: <FileText className="h-4 w-4" /> },
  { title: "Notifications", href: "/admin/dashboard/notifications", icon: <Bell className="h-4 w-4" /> },
  { title: "Profile", href: "/admin/dashboard/profile", icon: <User className="h-4 w-4" /> },
  { title: "Settings", href: "/admin/dashboard/settings", icon: <Settings className="h-4 w-4" /> },
]

export default function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { user, isLoading } = useAuth()

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

  return (
    <AdminGuard>
      <SidebarProvider>
        <DashboardSidebar
          navItems={navItems}
          user={{
            name: user?.name || "Admin",
            email: user?.email || "",
            avatar: user?.avatar,
            role: user?.role || "admin",
          }}
          brandTitle="DineOnTime"
          brandSubtitle="Super Admin"
        />
        <SidebarInset className="bg-cream">
          <DashboardHeader
            title="Admin Dashboard"
            user={{
              name: user?.name || "Admin",
              email: user?.email || "",
              avatar: user?.avatar,
              role: user?.role || "admin",
            }}
            notifications={8}
          />
          <main className="flex-1 p-4 md:p-6">{children}</main>
        </SidebarInset>
      </SidebarProvider>
    </AdminGuard>
  )
}
