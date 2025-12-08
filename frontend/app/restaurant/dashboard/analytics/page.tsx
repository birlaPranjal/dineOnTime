"use client"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { StatsCard } from "@/components/dashboard/stats-card"
import { restaurantAnalytics, restaurantUser } from "@/lib/mock-dashboard-data"
import { TrendingUp, ShoppingBag, IndianRupee, Star } from "lucide-react"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
} from "recharts"

const COLORS = ["#DC0000", "#050E3C", "#FF3838", "#FEEAC9", "#22c55e"]

export default function RestaurantAnalyticsPage() {
  const { dailyOrders, topItems, peakHours, customerMetrics } = restaurantAnalytics

  const totalWeeklyOrders = dailyOrders.reduce((acc, d) => acc + d.orders, 0)
  const totalWeeklyRevenue = dailyOrders.reduce((acc, d) => acc + d.revenue, 0)

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-navy">Analytics & Insights</h2>
          <p className="text-muted-foreground">Performance overview for {restaurantUser.restaurant.name}</p>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="Weekly Orders"
          value={totalWeeklyOrders}
          change="+12% vs last week"
          changeType="positive"
          icon={<ShoppingBag className="h-5 w-5" />}
        />
        <StatsCard
          title="Weekly Revenue"
          value={`₹${(totalWeeklyRevenue / 1000).toFixed(1)}K`}
          change="+8% vs last week"
          changeType="positive"
          icon={<IndianRupee className="h-5 w-5" />}
        />
        <StatsCard
          title="Avg Order Value"
          value={`₹${customerMetrics.avgOrderValue}`}
          change="-2% vs last week"
          changeType="negative"
          icon={<TrendingUp className="h-5 w-5" />}
        />
        <StatsCard
          title="Customer Rating"
          value={customerMetrics.avgRating}
          change="Based on 1,250 reviews"
          changeType="neutral"
          icon={<Star className="h-5 w-5" />}
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Daily Orders Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Daily Orders & Revenue</CardTitle>
            <CardDescription>This week&apos;s performance</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={dailyOrders}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="day" tick={{ fill: "#6b7280", fontSize: 12 }} />
                  <YAxis yAxisId="left" tick={{ fill: "#6b7280", fontSize: 12 }} />
                  <YAxis yAxisId="right" orientation="right" tick={{ fill: "#6b7280", fontSize: 12 }} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#fff",
                      border: "1px solid #e5e7eb",
                      borderRadius: "8px",
                    }}
                  />
                  <Bar yAxisId="left" dataKey="orders" fill="#DC0000" radius={[4, 4, 0, 0]} name="Orders" />
                  <Bar yAxisId="right" dataKey="revenue" fill="#050E3C" radius={[4, 4, 0, 0]} name="Revenue (₹)" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Peak Hours Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Peak Hours</CardTitle>
            <CardDescription>Order distribution by hour</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={peakHours}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="hour" tick={{ fill: "#6b7280", fontSize: 12 }} />
                  <YAxis tick={{ fill: "#6b7280", fontSize: 12 }} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#fff",
                      border: "1px solid #e5e7eb",
                      borderRadius: "8px",
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="orders"
                    stroke="#DC0000"
                    strokeWidth={3}
                    dot={{ fill: "#DC0000", strokeWidth: 2 }}
                    name="Orders"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Top Selling Items */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Top Selling Items</CardTitle>
            <CardDescription>Best performers this month</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {topItems.map((item, index) => (
                <div key={item.name} className="flex items-center gap-4">
                  <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary font-bold text-sm">
                    {index + 1}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-medium text-navy">{item.name}</span>
                      <span className="text-sm text-muted-foreground">{item.orders} orders</span>
                    </div>
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                      <div
                        className="h-full bg-primary rounded-full"
                        style={{ width: `${(item.orders / topItems[0].orders) * 100}%` }}
                      />
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="font-semibold text-navy">₹{(item.revenue / 1000).toFixed(1)}K</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Customer Metrics */}
        <Card>
          <CardHeader>
            <CardTitle>Customer Insights</CardTitle>
            <CardDescription>This month&apos;s breakdown</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="h-[180px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={[
                      { name: "New", value: customerMetrics.newCustomers },
                      { name: "Returning", value: customerMetrics.returningCustomers },
                    ]}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={70}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    <Cell fill="#DC0000" />
                    <Cell fill="#050E3C" />
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="grid grid-cols-2 gap-4 text-center">
              <div>
                <div className="flex items-center justify-center gap-2 mb-1">
                  <span className="w-3 h-3 rounded-full bg-primary"></span>
                  <span className="text-sm text-muted-foreground">New</span>
                </div>
                <p className="text-xl font-bold text-navy">{customerMetrics.newCustomers}</p>
              </div>
              <div>
                <div className="flex items-center justify-center gap-2 mb-1">
                  <span className="w-3 h-3 rounded-full bg-navy"></span>
                  <span className="text-sm text-muted-foreground">Returning</span>
                </div>
                <p className="text-xl font-bold text-navy">{customerMetrics.returningCustomers}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
