"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { StatsCard } from "@/components/dashboard/stats-card"
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts"
import { TrendingUp, Users, IndianRupee, ShoppingCart } from "lucide-react"

const revenueData = [
  { month: "Jul", revenue: 850000, orders: 2100 },
  { month: "Aug", revenue: 920000, orders: 2350 },
  { month: "Sep", revenue: 1050000, orders: 2680 },
  { month: "Oct", revenue: 1180000, orders: 3020 },
  { month: "Nov", revenue: 1350000, orders: 3450 },
  { month: "Dec", revenue: 1520000, orders: 3890 },
]

const userGrowthData = [
  { month: "Jul", customers: 8500, restaurants: 180 },
  { month: "Aug", customers: 9200, restaurants: 205 },
  { month: "Sep", customers: 10100, restaurants: 235 },
  { month: "Oct", customers: 11500, restaurants: 270 },
  { month: "Nov", customers: 13200, restaurants: 310 },
  { month: "Dec", customers: 15240, restaurants: 342 },
]

const orderDistribution = [
  { name: "Dine-in", value: 45, color: "#DC0000" },
  { name: "Pre-order", value: 35, color: "#050E3C" },
  { name: "Takeaway", value: 20, color: "#FF3838" },
]

const topCities = [
  { city: "Bangalore", orders: 12500, revenue: 5600000 },
  { city: "Mumbai", orders: 9800, revenue: 4200000 },
  { city: "Delhi", orders: 8200, revenue: 3500000 },
  { city: "Chennai", orders: 5400, revenue: 2100000 },
  { city: "Hyderabad", orders: 4800, revenue: 1900000 },
]

export default function AdminAnalyticsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-navy">Platform Analytics</h2>
        <p className="text-muted-foreground">Comprehensive insights into platform performance</p>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <StatsCard
          title="Total Revenue"
          value="₹15.2L"
          change="+23% vs last month"
          changeType="positive"
          icon={<IndianRupee className="h-5 w-5" />}
        />
        <StatsCard
          title="Total Orders"
          value="18,490"
          change="+18% vs last month"
          changeType="positive"
          icon={<ShoppingCart className="h-5 w-5" />}
        />
        <StatsCard
          title="Active Users"
          value="15,240"
          change="+12% growth"
          changeType="positive"
          icon={<Users className="h-5 w-5" />}
        />
        <StatsCard
          title="Conversion Rate"
          value="24.5%"
          change="+2.3% vs last month"
          changeType="positive"
          icon={<TrendingUp className="h-5 w-5" />}
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Revenue & Orders Trend</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={revenueData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="month" stroke="#6b7280" fontSize={12} />
                  <YAxis
                    yAxisId="left"
                    stroke="#6b7280"
                    fontSize={12}
                    tickFormatter={(value) => `₹${(value / 100000).toFixed(0)}L`}
                  />
                  <YAxis yAxisId="right" orientation="right" stroke="#6b7280" fontSize={12} />
                  <Tooltip
                    formatter={(value: number, name: string) => [
                      name === "revenue" ? `₹${value.toLocaleString()}` : value,
                      name === "revenue" ? "Revenue" : "Orders",
                    ]}
                  />
                  <Legend />
                  <Line
                    yAxisId="left"
                    type="monotone"
                    dataKey="revenue"
                    stroke="#DC0000"
                    strokeWidth={2}
                    name="Revenue"
                  />
                  <Line
                    yAxisId="right"
                    type="monotone"
                    dataKey="orders"
                    stroke="#050E3C"
                    strokeWidth={2}
                    name="Orders"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">User Growth</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={userGrowthData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="month" stroke="#6b7280" fontSize={12} />
                  <YAxis stroke="#6b7280" fontSize={12} />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="customers" fill="#DC0000" name="Customers" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="restaurants" fill="#050E3C" name="Restaurants" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Order Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[250px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={orderDistribution}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {orderDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => `${value}%`} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-lg">Top Cities by Revenue</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {topCities.map((city, index) => (
                <div key={city.city} className="flex items-center gap-4">
                  <span className="w-6 text-center font-medium text-muted-foreground">{index + 1}</span>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-medium text-navy">{city.city}</span>
                      <span className="text-sm text-muted-foreground">{city.orders.toLocaleString()} orders</span>
                    </div>
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                      <div
                        className="h-full bg-primary rounded-full"
                        style={{
                          width: `${(city.revenue / topCities[0].revenue) * 100}%`,
                        }}
                      />
                    </div>
                  </div>
                  <span className="font-semibold text-navy w-20 text-right">
                    ₹{(city.revenue / 100000).toFixed(1)}L
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
