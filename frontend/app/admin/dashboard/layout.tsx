"use client"

import type React from "react"

import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar"
import { DashboardSidebar } from "@/components/dashboard/dashboard-sidebar"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { superAdminUser } from "@/lib/mock-dashboard-data"
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
} from "lucide-react"

const navItems = [
  { title: "Dashboard", href: "/admin/dashboard", icon: <LayoutDashboard className="h-4 w-4" /> },
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
  return (
    <SidebarProvider>
      <DashboardSidebar
        navItems={navItems}
        user={{
          name: superAdminUser.name,
          email: superAdminUser.email,
          avatar: superAdminUser.avatar,
          role: superAdminUser.role,
        }}
        brandTitle="DineOnTime"
        brandSubtitle="Super Admin"
      />
      <SidebarInset className="bg-cream">
        <DashboardHeader
          title="Admin Dashboard"
          user={{
            name: superAdminUser.name,
            email: superAdminUser.email,
            avatar: superAdminUser.avatar,
          }}
          notifications={8}
        />
        <main className="flex-1 p-4 md:p-6">{children}</main>
      </SidebarInset>
    </SidebarProvider>
  )
}
