"use client"

import type React from "react"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Clock } from "lucide-react"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
} from "@/components/ui/sidebar"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

interface NavItem {
  title: string
  href: string
  icon: React.ReactNode
  badge?: string
}

interface DashboardSidebarProps {
  navItems: NavItem[]
  user: {
    name: string
    email: string
    avatar?: string
    role: string
  }
  brandTitle: string
  brandSubtitle?: string
}

export function DashboardSidebar({ navItems, user, brandTitle, brandSubtitle }: DashboardSidebarProps) {
  const pathname = usePathname()

  return (
    <Sidebar className="border-r border-border">
      <SidebarHeader className="border-b border-border px-4 py-4">
        <Link href="/" className="flex items-center gap-2">
          <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-primary">
            <Clock className="h-5 w-5 text-primary-foreground" />
          </div>
          <div className="flex flex-col">
            <span className="text-lg font-bold text-navy">{brandTitle}</span>
            {brandSubtitle && <span className="text-xs text-muted-foreground">{brandSubtitle}</span>}
          </div>
        </Link>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Menu</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navItems.map((item) => (
                <SidebarMenuItem key={item.href}>
                  <SidebarMenuButton asChild isActive={pathname === item.href} tooltip={item.title}>
                    <Link href={item.href} className="flex items-center gap-3">
                      {item.icon}
                      <span>{item.title}</span>
                      {item.badge && (
                        <span className="ml-auto bg-primary text-primary-foreground text-xs px-2 py-0.5 rounded-full">
                          {item.badge}
                        </span>
                      )}
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t border-border p-4">
        <Link
          href={
            user.role.toLowerCase() === "admin"
              ? "/admin/dashboard/profile"
              : user.role.toLowerCase() === "restaurant"
                ? "/restaurant/dashboard/profile"
                : "/customer/dashboard/profile"
          }
          className="flex items-center gap-3 hover:bg-muted/50 rounded-lg p-2 -m-2 transition-colors"
        >
          <Avatar className="h-9 w-9">
            <AvatarImage src={user.avatar || "/placeholder.svg"} />
            <AvatarFallback className="bg-primary/10 text-primary">
              {user.name
                .split(" ")
                .map((n) => n[0])
                .join("")}
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col overflow-hidden flex-1">
            <span className="text-sm font-medium truncate">{user.name}</span>
            <span className="text-xs text-muted-foreground truncate">{user.role}</span>
          </div>
        </Link>
      </SidebarFooter>
    </Sidebar>
  )
}
