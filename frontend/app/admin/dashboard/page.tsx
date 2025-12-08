"use client"

import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { StatsCard } from "@/components/dashboard/stats-card"
import { platformStats, pendingRestaurants, platformComplaints, revenueData } from "@/lib/mock-dashboard-data"
import {
  Store,
  Users,
  IndianRupee,
  TrendingUp,
  ChevronRight,
  AlertTriangle,
  CheckCircle,
  XCircle,
  FileText,
} from "lucide-react"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"

const priorityColors: Record<string, string> = {
  urgent: "bg-red-100 text-red-700",
  high: "bg-orange-100 text-orange-700",
  medium: "bg-yellow-100 text-yellow-700",
  low: "bg-green-100 text-green-700",
}

const statusColors: Record<string, string> = {
  open: "bg-red-100 text-red-700",
  "in-progress": "bg-yellow-100 text-yellow-700",
  resolved: "bg-green-100 text-green-700",
}

export default function AdminDashboardPage() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-navy">Platform Overview</h2>
        <p className="text-muted-foreground">Monitor and manage DineOnTime platform operations</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="Total Restaurants"
          value={platformStats.totalRestaurants}
          change="+24 this month"
          changeType="positive"
          icon={<Store className="h-5 w-5" />}
        />
        <StatsCard
          title="Active Users"
          value={platformStats.activeUsers.toLocaleString()}
          change="+12% growth"
          changeType="positive"
          icon={<Users className="h-5 w-5" />}
        />
        <StatsCard
          title="Total Revenue"
          value={`₹${(platformStats.totalRevenue / 100000).toFixed(1)}L`}
          change="+18% vs last month"
          changeType="positive"
          icon={<IndianRupee className="h-5 w-5" />}
        />
        <StatsCard
          title="Total Orders"
          value={platformStats.totalOrders.toLocaleString()}
          change="+2,450 this week"
          changeType="positive"
          icon={<TrendingUp className="h-5 w-5" />}
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-lg">Revenue Trend</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={revenueData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="month" stroke="#6b7280" fontSize={12} />
                  <YAxis stroke="#6b7280" fontSize={12} tickFormatter={(value) => `₹${(value / 100000).toFixed(0)}L`} />
                  <Tooltip
                    formatter={(value: number) => [`₹${value.toLocaleString()}`, "Revenue"]}
                    contentStyle={{ borderRadius: "8px" }}
                  />
                  <Line
                    type="monotone"
                    dataKey="revenue"
                    stroke="#DC0000"
                    strokeWidth={2}
                    dot={{ fill: "#DC0000", strokeWidth: 2 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-lg">Pending Approvals</CardTitle>
            <Badge variant="secondary">{pendingRestaurants.length}</Badge>
          </CardHeader>
          <CardContent className="space-y-3">
            {pendingRestaurants.slice(0, 3).map((restaurant) => (
              <div key={restaurant.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                <div className="space-y-1">
                  <p className="font-medium text-navy text-sm">{restaurant.name}</p>
                  <p className="text-xs text-muted-foreground">{restaurant.location}</p>
                  <div className="flex items-center gap-1 text-xs">
                    <FileText className="h-3 w-3" />
                    <span className={restaurant.documents === "verified" ? "text-green-600" : "text-yellow-600"}>
                      Docs: {restaurant.documents}
                    </span>
                  </div>
                </div>
                <div className="flex gap-1">
                  <Button
                    size="icon"
                    variant="ghost"
                    className="h-8 w-8 text-green-600 hover:text-green-700 hover:bg-green-50"
                  >
                    <CheckCircle className="h-4 w-4" />
                  </Button>
                  <Button
                    size="icon"
                    variant="ghost"
                    className="h-8 w-8 text-red-600 hover:text-red-700 hover:bg-red-50"
                  >
                    <XCircle className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
            <Button variant="ghost" size="sm" className="w-full" asChild>
              <Link href="/admin/dashboard/restaurants">
                View All <ChevronRight className="ml-1 h-4 w-4" />
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-lg">Active Complaints</CardTitle>
          <Button variant="ghost" size="sm" asChild>
            <Link href="/admin/dashboard/complaints">
              View All <ChevronRight className="ml-1 h-4 w-4" />
            </Link>
          </Button>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {platformComplaints.map((complaint) => (
              <div key={complaint.id} className="flex items-center justify-between p-4 rounded-lg border bg-card">
                <div className="flex items-center gap-4">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      complaint.priority === "urgent" ? "bg-red-100" : "bg-yellow-100"
                    }`}
                  >
                    <AlertTriangle
                      className={`h-5 w-5 ${complaint.priority === "urgent" ? "text-red-600" : "text-yellow-600"}`}
                    />
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-navy">{complaint.id}</span>
                      <Badge className={priorityColors[complaint.priority]} variant="secondary">
                        {complaint.priority}
                      </Badge>
                      <Badge className={statusColors[complaint.status]} variant="secondary">
                        {complaint.status}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">{complaint.description}</p>
                    <p className="text-xs text-muted-foreground">
                      {complaint.customer} • {complaint.restaurant} • {complaint.date}
                    </p>
                  </div>
                </div>
                <Button size="sm" variant="outline">
                  Review
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
