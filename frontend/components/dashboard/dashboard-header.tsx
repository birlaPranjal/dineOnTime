"use client"

import { Bell, Search, LogOut, User } from "lucide-react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { SidebarTrigger } from "@/components/ui/sidebar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { useAuth } from "@/lib/hooks/use-auth"

interface DashboardHeaderProps {
  title: string
  user: {
    name: string
    email: string
    avatar?: string
    role?: string
  }
  notifications?: number
  showSearch?: boolean
}

export function DashboardHeader({ title, user, notifications = 0, showSearch = true }: DashboardHeaderProps) {
  const router = useRouter()
  const { logout } = useAuth()

  const getProfilePath = () => {
    const role = user.role?.toLowerCase()
    if (role === "admin") return "/admin/dashboard/profile"
    if (role === "restaurant") return "/restaurant/dashboard/profile"
    return "/customer/dashboard/profile"
  }

  const handleProfileClick = () => {
    router.push(getProfilePath())
  }

  const handleLogout = async () => {
    await logout()
  }

  // Use dummy person image
  const dummyAvatar = "/placeholder-user.jpg"

  return (
    <header className="sticky top-0 z-40 flex h-16 items-center gap-4 border-b border-border bg-card px-4 md:px-6">
      <SidebarTrigger className="md:hidden" />

      <div className="flex-1">
        <h1 className="text-lg font-semibold text-navy md:text-xl">{title}</h1>
      </div>

      {showSearch && (
        <div className="hidden md:flex relative w-64 lg:w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search..." className="pl-9 h-9 bg-muted/50" />
        </div>
      )}

      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          {notifications > 0 && (
            <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs">
              {notifications}
            </Badge>
          )}
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative h-9 w-9 rounded-full">
              <Avatar className="h-9 w-9">
                <AvatarImage src={dummyAvatar} alt={user.name} />
                <AvatarFallback className="bg-primary/10 text-primary">
                  {user.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium">{user.name}</p>
                <p className="text-xs text-muted-foreground">{user.email}</p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleProfileClick}>
              <User className="mr-2 h-4 w-4" />
              Profile
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-destructive" onClick={handleLogout}>
              <LogOut className="mr-2 h-4 w-4" />
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}
