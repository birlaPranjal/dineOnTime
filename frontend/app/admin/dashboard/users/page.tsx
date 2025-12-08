"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Search, MoreVertical, UserPlus, Users, Store, Shield, Ban, Mail, Eye } from "lucide-react"
import { StatsCard } from "@/components/dashboard/stats-card"

const users = [
  {
    id: "1",
    name: "Rahul Sharma",
    email: "rahul@email.com",
    phone: "+91 98765 43210",
    role: "customer",
    status: "active",
    orders: 24,
    totalSpent: 12500,
    joinedDate: "Nov 15, 2024",
    avatar: "/thoughtful-man-portrait.png",
  },
  {
    id: "2",
    name: "Priya Patel",
    email: "priya@email.com",
    phone: "+91 87654 32109",
    role: "customer",
    status: "active",
    orders: 18,
    totalSpent: 8750,
    joinedDate: "Oct 20, 2024",
    avatar: "/woman-portrait.png",
  },
  {
    id: "3",
    name: "Amit Kumar",
    email: "amit@email.com",
    phone: "+91 76543 21098",
    role: "customer",
    status: "suspended",
    orders: 5,
    totalSpent: 2500,
    joinedDate: "Dec 01, 2024",
    avatar: "/professional-man.png",
  },
  {
    id: "4",
    name: "Sneha Gupta",
    email: "sneha@restaurant.com",
    phone: "+91 65432 10987",
    role: "restaurant",
    status: "active",
    restaurantName: "The Spice Garden",
    orders: 450,
    totalRevenue: 325000,
    joinedDate: "Sep 10, 2024",
    avatar: "/woman-chef-preparing-food.png",
  },
]

const statusColors: Record<string, string> = {
  active: "bg-green-100 text-green-700",
  suspended: "bg-red-100 text-red-700",
  pending: "bg-yellow-100 text-yellow-700",
}

const roleColors: Record<string, string> = {
  customer: "bg-blue-100 text-blue-700",
  restaurant: "bg-purple-100 text-purple-700",
  admin: "bg-orange-100 text-orange-700",
}

export default function AdminUsersPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [activeTab, setActiveTab] = useState("all")

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesTab = activeTab === "all" || user.role === activeTab
    return matchesSearch && matchesTab
  })

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-navy">User Management</h2>
          <p className="text-muted-foreground">Manage platform users and permissions</p>
        </div>
        <Button>
          <UserPlus className="h-4 w-4 mr-2" />
          Add Admin User
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <StatsCard
          title="Total Users"
          value="15,240"
          change="+520 this month"
          changeType="positive"
          icon={<Users className="h-5 w-5" />}
        />
        <StatsCard
          title="Customers"
          value="14,890"
          change="+480 this month"
          changeType="positive"
          icon={<Users className="h-5 w-5" />}
        />
        <StatsCard
          title="Restaurant Users"
          value="342"
          change="+38 this month"
          changeType="positive"
          icon={<Store className="h-5 w-5" />}
        />
        <StatsCard
          title="Admin Users"
          value="8"
          description="Full platform access"
          icon={<Shield className="h-5 w-5" />}
        />
      </div>

      <Card>
        <CardHeader className="pb-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList>
                <TabsTrigger value="all">All Users</TabsTrigger>
                <TabsTrigger value="customer">Customers</TabsTrigger>
                <TabsTrigger value="restaurant">Restaurants</TabsTrigger>
              </TabsList>
            </Tabs>
            <div className="relative w-full md:w-80">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search users..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>User</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Activity</TableHead>
                <TableHead>Joined</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredUsers.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar>
                        <AvatarImage src={user.avatar || "/placeholder.svg"} alt={user.name} />
                        <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium text-navy">{user.name}</p>
                        <p className="text-sm text-muted-foreground">{user.email}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge className={roleColors[user.role]} variant="secondary">
                      {user.role}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge className={statusColors[user.status]} variant="secondary">
                      {user.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm">
                      <p>{user.orders} orders</p>
                      <p className="text-muted-foreground">
                        ₹{(user.totalSpent || user.totalRevenue || 0).toLocaleString()}
                      </p>
                    </div>
                  </TableCell>
                  <TableCell className="text-muted-foreground">{user.joinedDate}</TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>
                          <Eye className="h-4 w-4 mr-2" />
                          View Profile
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Mail className="h-4 w-4 mr-2" />
                          Send Email
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-destructive">
                          <Ban className="h-4 w-4 mr-2" />
                          {user.status === "suspended" ? "Reactivate" : "Suspend"}
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
