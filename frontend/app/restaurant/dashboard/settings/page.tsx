"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { restaurantUser } from "@/lib/mock-dashboard-data"
import { Building, Clock, MapPin, Phone, Mail, Globe, Camera, Save, Bell } from "lucide-react"

export default function RestaurantSettingsPage() {
  const [settings, setSettings] = useState({
    name: restaurantUser.restaurant.name,
    description:
      "Authentic North Indian cuisine with a modern twist. Famous for our butter chicken and tandoori specialties.",
    address: "123, Koramangala 5th Block, Bangalore - 560034",
    phone: "+91 80 1234 5678",
    email: "contact@spiceroom.com",
    website: "www.spiceroom.com",
    openTime: "11:00",
    closeTime: "23:00",
    autoAcceptBookings: true,
    emailNotifications: true,
    smsNotifications: true,
    pushNotifications: true,
    etaAlerts: true,
    orderAlerts: true,
  })

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-navy">Settings</h2>
        <p className="text-muted-foreground">Manage your restaurant profile and preferences</p>
      </div>

      <Tabs defaultValue="profile">
        <TabsList>
          <TabsTrigger value="profile">
            <Building className="h-4 w-4 mr-2" />
            Profile
          </TabsTrigger>
          <TabsTrigger value="notifications">
            <Bell className="h-4 w-4 mr-2" />
            Notifications
          </TabsTrigger>
          <TabsTrigger value="operations">
            <Clock className="h-4 w-4 mr-2" />
            Operations
          </TabsTrigger>
        </TabsList>

        <TabsContent value="profile" className="mt-6 space-y-6">
          {/* Restaurant Logo */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Restaurant Logo</CardTitle>
              <CardDescription>This will be displayed on your profile and menu</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-6">
                <Avatar className="h-24 w-24">
                  <AvatarImage src="/restaurant-logo-spice.jpg" />
                  <AvatarFallback className="bg-primary/10 text-primary text-2xl">SR</AvatarFallback>
                </Avatar>
                <div className="space-y-2">
                  <Button variant="outline" className="bg-transparent">
                    <Camera className="h-4 w-4 mr-2" />
                    Change Logo
                  </Button>
                  <p className="text-xs text-muted-foreground">JPG, PNG or GIF. Max 2MB.</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Basic Info */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Basic Information</CardTitle>
              <CardDescription>Update your restaurant details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="name">Restaurant Name</Label>
                  <Input
                    id="name"
                    value={settings.name}
                    onChange={(e) => setSettings({ ...settings, name: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="cuisine">Cuisine Type</Label>
                  <Input id="cuisine" value="North Indian" disabled />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={settings.description}
                  onChange={(e) => setSettings({ ...settings, description: e.target.value })}
                  rows={3}
                />
              </div>
            </CardContent>
          </Card>

          {/* Contact Info */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Contact Information</CardTitle>
              <CardDescription>How customers can reach you</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="address">Address</Label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="address"
                    className="pl-9"
                    value={settings.address}
                    onChange={(e) => setSettings({ ...settings, address: e.target.value })}
                  />
                </div>
              </div>
              <div className="grid gap-4 md:grid-cols-3">
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone</Label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="phone"
                      className="pl-9"
                      value={settings.phone}
                      onChange={(e) => setSettings({ ...settings, phone: e.target.value })}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="email"
                      className="pl-9"
                      value={settings.email}
                      onChange={(e) => setSettings({ ...settings, email: e.target.value })}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="website">Website</Label>
                  <div className="relative">
                    <Globe className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="website"
                      className="pl-9"
                      value={settings.website}
                      onChange={(e) => setSettings({ ...settings, website: e.target.value })}
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Button className="w-full md:w-auto">
            <Save className="h-4 w-4 mr-2" />
            Save Changes
          </Button>
        </TabsContent>

        <TabsContent value="notifications" className="mt-6 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Notification Preferences</CardTitle>
              <CardDescription>Choose how you want to be notified</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Email Notifications</Label>
                  <p className="text-sm text-muted-foreground">Receive order and booking updates via email</p>
                </div>
                <Switch
                  checked={settings.emailNotifications}
                  onCheckedChange={(checked) => setSettings({ ...settings, emailNotifications: checked })}
                />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>SMS Notifications</Label>
                  <p className="text-sm text-muted-foreground">Get text messages for urgent updates</p>
                </div>
                <Switch
                  checked={settings.smsNotifications}
                  onCheckedChange={(checked) => setSettings({ ...settings, smsNotifications: checked })}
                />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Push Notifications</Label>
                  <p className="text-sm text-muted-foreground">Browser notifications for real-time alerts</p>
                </div>
                <Switch
                  checked={settings.pushNotifications}
                  onCheckedChange={(checked) => setSettings({ ...settings, pushNotifications: checked })}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Alert Types</CardTitle>
              <CardDescription>Select which alerts you want to receive</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Customer ETA Alerts</Label>
                  <p className="text-sm text-muted-foreground">Get notified when customers are approaching</p>
                </div>
                <Switch
                  checked={settings.etaAlerts}
                  onCheckedChange={(checked) => setSettings({ ...settings, etaAlerts: checked })}
                />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>New Order Alerts</Label>
                  <p className="text-sm text-muted-foreground">Instant alerts for new orders and bookings</p>
                </div>
                <Switch
                  checked={settings.orderAlerts}
                  onCheckedChange={(checked) => setSettings({ ...settings, orderAlerts: checked })}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="operations" className="mt-6 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Operating Hours</CardTitle>
              <CardDescription>Set your restaurant opening and closing times</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="openTime">Opening Time</Label>
                  <Input
                    id="openTime"
                    type="time"
                    value={settings.openTime}
                    onChange={(e) => setSettings({ ...settings, openTime: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="closeTime">Closing Time</Label>
                  <Input
                    id="closeTime"
                    type="time"
                    value={settings.closeTime}
                    onChange={(e) => setSettings({ ...settings, closeTime: e.target.value })}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Booking Settings</CardTitle>
              <CardDescription>Configure how bookings are handled</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Auto-Accept Bookings</Label>
                  <p className="text-sm text-muted-foreground">Automatically confirm new table reservations</p>
                </div>
                <Switch
                  checked={settings.autoAcceptBookings}
                  onCheckedChange={(checked) => setSettings({ ...settings, autoAcceptBookings: checked })}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Restaurant Status</CardTitle>
              <CardDescription>Current operational status</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between p-4 rounded-lg bg-green-50 border border-green-200">
                <div className="flex items-center gap-3">
                  <span className="w-3 h-3 rounded-full bg-green-500 animate-pulse"></span>
                  <div>
                    <p className="font-medium text-green-700">Restaurant is Open</p>
                    <p className="text-sm text-green-600">Accepting orders and bookings</p>
                  </div>
                </div>
                <Button variant="outline" className="bg-transparent border-green-300 text-green-700 hover:bg-green-100">
                  Mark as Closed
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
