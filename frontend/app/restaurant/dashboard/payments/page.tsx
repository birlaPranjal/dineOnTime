"use client"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { StatsCard } from "@/components/dashboard/stats-card"
import { DataTable } from "@/components/dashboard/data-table"
import { restaurantPayments } from "@/lib/mock-dashboard-data"
import { IndianRupee, TrendingUp, Download, CheckCircle2, Clock, FileText } from "lucide-react"

const statusColors: Record<string, string> = {
  settled: "bg-green-100 text-green-700 border-green-200",
  pending: "bg-yellow-100 text-yellow-700 border-yellow-200",
}

export default function RestaurantPaymentsPage() {
  const totalGross = restaurantPayments.reduce((acc, p) => acc + p.grossAmount, 0)
  const totalCommission = restaurantPayments.reduce((acc, p) => acc + p.commission, 0)
  const totalNet = restaurantPayments.reduce((acc, p) => acc + p.netAmount, 0)
  const pendingAmount = restaurantPayments
    .filter((p) => p.status === "pending")
    .reduce((acc, p) => acc + p.netAmount, 0)

  const columns = [
    {
      header: "Period",
      accessor: (row: (typeof restaurantPayments)[0]) => <div className="font-medium text-navy">{row.period}</div>,
    },
    {
      header: "Orders",
      accessor: "orders" as const,
    },
    {
      header: "Gross Amount",
      accessor: (row: (typeof restaurantPayments)[0]) => <span>₹{row.grossAmount.toLocaleString()}</span>,
    },
    {
      header: "Commission (15%)",
      accessor: (row: (typeof restaurantPayments)[0]) => (
        <span className="text-muted-foreground">-₹{row.commission.toLocaleString()}</span>
      ),
    },
    {
      header: "Net Amount",
      accessor: (row: (typeof restaurantPayments)[0]) => (
        <span className="font-semibold text-navy">₹{row.netAmount.toLocaleString()}</span>
      ),
    },
    {
      header: "Status",
      accessor: (row: (typeof restaurantPayments)[0]) => (
        <Badge className={statusColors[row.status]} variant="outline">
          {row.status === "settled" && <CheckCircle2 className="h-3 w-3 mr-1" />}
          {row.status === "pending" && <Clock className="h-3 w-3 mr-1" />}
          {row.status}
        </Badge>
      ),
    },
    {
      header: "Actions",
      accessor: (row: (typeof restaurantPayments)[0]) => (
        <Button variant="ghost" size="sm">
          <FileText className="h-4 w-4 mr-1" />
          Invoice
        </Button>
      ),
    },
  ]

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-navy">Payments & Settlements</h2>
          <p className="text-muted-foreground">Track your earnings and payment history</p>
        </div>
        <Button variant="outline" className="bg-transparent">
          <Download className="h-4 w-4 mr-2" />
          Export Statement
        </Button>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <StatsCard
          title="Total Earnings (Jan)"
          value={`₹${(totalGross / 1000).toFixed(1)}K`}
          description="Gross revenue"
          icon={<IndianRupee className="h-5 w-5" />}
        />
        <StatsCard
          title="Platform Commission"
          value={`₹${(totalCommission / 1000).toFixed(1)}K`}
          description="15% of gross"
          icon={<TrendingUp className="h-5 w-5" />}
        />
        <StatsCard
          title="Net Payout"
          value={`₹${(totalNet / 1000).toFixed(1)}K`}
          description="After commission"
          icon={<IndianRupee className="h-5 w-5" />}
        />
        <StatsCard
          title="Pending Payout"
          value={`₹${(pendingAmount / 1000).toFixed(1)}K`}
          description="Next settlement"
          icon={<Clock className="h-5 w-5" />}
        />
      </div>

      {/* Commission Info */}
      <Card className="border-primary/20 bg-primary/5">
        <CardContent className="py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary/10">
                <IndianRupee className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="font-medium text-navy">Your Commission Rate: 15%</p>
                <p className="text-sm text-muted-foreground">Settlements processed weekly on Wednesdays</p>
              </div>
            </div>
            <Button variant="outline" size="sm" className="bg-transparent">
              View Details
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Payments Table */}
      <DataTable
        title="Payment History"
        description="All your settlements and pending payouts"
        columns={columns}
        data={restaurantPayments}
      />

      {/* Bank Account Info */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Settlement Account</CardTitle>
          <CardDescription>Your linked bank account for payouts</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between p-4 rounded-lg bg-muted/50">
            <div className="flex items-center gap-4">
              <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-navy text-white font-bold">
                HDFC
              </div>
              <div>
                <p className="font-medium text-navy">HDFC Bank - Savings Account</p>
                <p className="text-sm text-muted-foreground">Account ending in ****4521</p>
              </div>
            </div>
            <Badge variant="outline" className="bg-green-100 text-green-700 border-green-200">
              <CheckCircle2 className="h-3 w-3 mr-1" />
              Verified
            </Badge>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
