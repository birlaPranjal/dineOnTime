"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Bell, Send, Users, Clock, CheckCircle } from "lucide-react"
import { toast } from "sonner"

const sentNotifications = [
  {
    id: "1",
    title: "New Year Sale is Here!",
    message: "Get 20% off on all orders this New Year. Use code NEWYEAR20",
    audience: "all_customers",
    sentAt: "Dec 18, 2024, 10:00 AM",
    delivered: 12500,
    opened: 8750,
  },
  {
    id: "2",
    title: "Complete Your Profile",
    message: "Add your phone number to receive order updates via SMS",
    audience: "incomplete_profiles",
    sentAt: "Dec 15, 2024, 2:00 PM",
    delivered: 3200,
    opened: 1850,
  },
  {
    id: "3",
    title: "New Feature: Table Booking",
    message: "Now book tables in advance and skip the wait!",
    audience: "all_customers",
    sentAt: "Dec 10, 2024, 11:00 AM",
    delivered: 11800,
    opened: 7200,
  },
]

export default function AdminNotificationsPage() {
  const [title, setTitle] = useState("")
  const [message, setMessage] = useState("")
  const [audience, setAudience] = useState("")
  const [activeTab, setActiveTab] = useState("compose")

  const handleSend = () => {
    if (!title || !message || !audience) {
      toast.error("Please fill all fields")
      return
    }
    toast.success("Notification sent successfully!")
    setTitle("")
    setMessage("")
    setAudience("")
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-navy">Push Notifications</h2>
        <p className="text-muted-foreground">Send notifications to users and restaurants</p>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                <Send className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold text-navy">156</p>
                <p className="text-sm text-muted-foreground">Sent This Month</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                <CheckCircle className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-navy">89%</p>
                <p className="text-sm text-muted-foreground">Delivery Rate</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                <Bell className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-navy">62%</p>
                <p className="text-sm text-muted-foreground">Open Rate</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center">
                <Users className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-navy">15.2K</p>
                <p className="text-sm text-muted-foreground">Active Subscribers</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="compose">Compose</TabsTrigger>
          <TabsTrigger value="history">History</TabsTrigger>
          <TabsTrigger value="scheduled">Scheduled</TabsTrigger>
        </TabsList>

        <TabsContent value="compose" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Send New Notification</CardTitle>
              <CardDescription>Compose and send push notifications to users</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Target Audience</Label>
                <Select value={audience} onValueChange={setAudience}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select audience" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all_customers">All Customers</SelectItem>
                    <SelectItem value="all_restaurants">All Restaurants</SelectItem>
                    <SelectItem value="active_customers">Active Customers (Last 30 days)</SelectItem>
                    <SelectItem value="inactive_customers">Inactive Customers</SelectItem>
                    <SelectItem value="new_customers">New Customers (Last 7 days)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Notification Title</Label>
                <Input
                  placeholder="Enter notification title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  maxLength={50}
                />
                <p className="text-xs text-muted-foreground">{title.length}/50 characters</p>
              </div>

              <div className="space-y-2">
                <Label>Message</Label>
                <Textarea
                  placeholder="Enter notification message"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  rows={4}
                  maxLength={200}
                />
                <p className="text-xs text-muted-foreground">{message.length}/200 characters</p>
              </div>

              <div className="flex gap-3 pt-4">
                <Button variant="outline" className="bg-transparent">
                  <Clock className="h-4 w-4 mr-2" />
                  Schedule for Later
                </Button>
                <Button onClick={handleSend}>
                  <Send className="h-4 w-4 mr-2" />
                  Send Now
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="history" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Sent Notifications</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {sentNotifications.map((notification) => (
                  <div key={notification.id} className="p-4 rounded-lg border bg-card">
                    <div className="flex items-start justify-between">
                      <div className="space-y-1">
                        <h4 className="font-medium text-navy">{notification.title}</h4>
                        <p className="text-sm text-muted-foreground">{notification.message}</p>
                        <div className="flex items-center gap-4 text-xs text-muted-foreground pt-2">
                          <span>Sent: {notification.sentAt}</span>
                          <Badge variant="secondary">{notification.audience.replace("_", " ")}</Badge>
                        </div>
                      </div>
                      <div className="text-right text-sm">
                        <p className="text-muted-foreground">
                          Delivered:{" "}
                          <span className="text-foreground font-medium">{notification.delivered.toLocaleString()}</span>
                        </p>
                        <p className="text-muted-foreground">
                          Opened:{" "}
                          <span className="text-foreground font-medium">{notification.opened.toLocaleString()}</span>
                        </p>
                        <p className="text-xs text-muted-foreground pt-1">
                          {((notification.opened / notification.delivered) * 100).toFixed(0)}% open rate
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="scheduled" className="mt-6">
          <Card>
            <CardContent className="py-12 text-center">
              <Clock className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-50" />
              <p className="text-muted-foreground mb-4">No scheduled notifications</p>
              <Button onClick={() => setActiveTab("compose")}>Schedule a Notification</Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
