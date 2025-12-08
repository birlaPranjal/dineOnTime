"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { StatsCard } from "@/components/dashboard/stats-card"
import { Search, Download, IndianRupee, CheckCircle, Clock, AlertCircle } from "lucide-react"

const settlements = [
  {
    id: "SET-001",
    restaurant: "The Spice Garden",
    amount: 45600,
    commission: 4560,
    netAmount: 41040,
    period: "Dec 1-15, 2024",
    status: "completed",
    paidOn: "Dec 18, 2024",
  },
  {
    id: "SET-002",
    restaurant: "Sushi Master",
    amount: 32500,
    commission: 3250,
    netAmount: 29250,
    period: "Dec 1-15, 2024",
    status: "completed",
    paidOn: "Dec 18, 2024",
  },
  {
    id: "SET-003",
    restaurant: "Pizza Paradise",
    amount: 28900,
    commission: 2890,
    netAmount: 26010,
    period: "Dec 1-15, 2024",
    status: "pending",
    paidOn: null,
  },
  {
    id: "SET-004",
    restaurant: "Dragon Wok",
    amount: 21500,
    commission: 2150,
    netAmount: 19350,
    period: "Dec 1-15, 2024",
    status: "processing",
    paidOn: null,
  },
  {
    id: "SET-005",
    restaurant: "Cafe Milano",
    amount: 18700,
    commission: 1870,
    netAmount: 16830,
    period: "Dec 1-15, 2024",
    status: "failed",
    paidOn: null,
  },
]

const statusConfig: Record<string, { color: string; icon: any }> = {
  completed: { color: "bg-green-100 text-green-700", icon: CheckCircle },
  pending: { color: "bg-yellow-100 text-yellow-700", icon: Clock },
  processing: { color: "bg-blue-100 text-blue-700", icon: Clock },
  failed: { color: "bg-red-100 text-red-700", icon: AlertCircle },
}

export default function AdminSettlementsPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")

  const filteredSettlements = settlements.filter((s) => {
    const matchesSearch = s.restaurant.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = statusFilter === "all" || s.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const totalPending = settlements
    .filter((s) => s.status === "pending" || s.status === "processing")
    .reduce((sum, s) => sum + s.netAmount, 0)

  const totalCompleted = settlements.filter((s) => s.status === "completed").reduce((sum, s) => sum + s.netAmount, 0)

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-navy">Settlements</h2>
          <p className="text-muted-foreground">Manage restaurant payouts and commissions</p>
        </div>
        <Button variant="outline" className="bg-transparent">
          <Download className="h-4 w-4 mr-2" />
          Export Report
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <StatsCard
          title="Total Settlements"
          value={`₹${(settlements.reduce((s, t) => s + t.netAmount, 0) / 1000).toFixed(0)}K`}
          description="This period"
          icon={<IndianRupee className="h-5 w-5" />}
        />
        <StatsCard
          title="Commission Earned"
          value={`₹${(settlements.reduce((s, t) => s + t.commission, 0) / 1000).toFixed(0)}K`}
          change="10% platform fee"
          changeType="neutral"
          icon={<IndianRupee className="h-5 w-5" />}
        />
        <StatsCard
          title="Pending Payouts"
          value={`₹${(totalPending / 1000).toFixed(0)}K`}
          description="Awaiting processing"
          icon={<Clock className="h-5 w-5" />}
        />
        <StatsCard
          title="Completed"
          value={`₹${(totalCompleted / 1000).toFixed(0)}K`}
          description="Successfully paid"
          icon={<CheckCircle className="h-5 w-5" />}
        />
      </div>

      <Card>
        <CardHeader className="pb-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <CardTitle className="text-lg">Settlement History</CardTitle>
            <div className="flex gap-3">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="processing">Processing</SelectItem>
                  <SelectItem value="failed">Failed</SelectItem>
                </SelectContent>
              </Select>
              <div className="relative w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search restaurant..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Settlement ID</TableHead>
                <TableHead>Restaurant</TableHead>
                <TableHead>Period</TableHead>
                <TableHead className="text-right">Gross Amount</TableHead>
                <TableHead className="text-right">Commission</TableHead>
                <TableHead className="text-right">Net Amount</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredSettlements.map((settlement) => {
                const StatusIcon = statusConfig[settlement.status].icon
                return (
                  <TableRow key={settlement.id}>
                    <TableCell className="font-medium">{settlement.id}</TableCell>
                    <TableCell>{settlement.restaurant}</TableCell>
                    <TableCell className="text-muted-foreground">{settlement.period}</TableCell>
                    <TableCell className="text-right">₹{settlement.amount.toLocaleString()}</TableCell>
                    <TableCell className="text-right text-muted-foreground">
                      -₹{settlement.commission.toLocaleString()}
                    </TableCell>
                    <TableCell className="text-right font-semibold text-navy">
                      ₹{settlement.netAmount.toLocaleString()}
                    </TableCell>
                    <TableCell>
                      <Badge className={statusConfig[settlement.status].color} variant="secondary">
                        <StatusIcon className="h-3 w-3 mr-1" />
                        {settlement.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {settlement.status === "pending" && <Button size="sm">Process</Button>}
                      {settlement.status === "failed" && (
                        <Button size="sm" variant="outline" className="bg-transparent">
                          Retry
                        </Button>
                      )}
                      {settlement.status === "completed" && (
                        <span className="text-xs text-muted-foreground">{settlement.paidOn}</span>
                      )}
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
