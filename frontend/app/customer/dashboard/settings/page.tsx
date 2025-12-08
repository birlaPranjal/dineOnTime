"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Camera, Bell, Lock, CreditCard, Smartphone, Mail, Trash2 } from "lucide-react"
import { toast } from "sonner"

export default function CustomerSettingsPage() {
  const [profile, setProfile] = useState({
    name: "Rahul Sharma",
    email: "rahul.sharma@email.com",
    phone: "+91 98765 43210",
    avatar: "/thoughtful-man-portrait.png",
  })

  const [notifications, setNotifications] = useState({
    orderUpdates: true,
    bookingReminders: true,
    promotions: false,
    newsletter: true,
    sms: true,
    push: true,
  })

  const handleSaveProfile = () => {
    toast.success("Profile updated successfully!")
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-navy">Settings</h2>
        <p className="text-muted-foreground">Manage your account preferences</p>
      </div>

      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Profile Information</CardTitle>
            <CardDescription>Update your personal details</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center gap-6">
              <div className="relative">
                <Avatar className="h-24 w-24">
                  <AvatarImage src={profile.avatar || "/placeholder.svg"} alt={profile.name} />
                  <AvatarFallback>{profile.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <button className="absolute bottom-0 right-0 p-2 bg-primary text-primary-foreground rounded-full hover:bg-primary/90">
                  <Camera className="h-4 w-4" />
                </button>
              </div>
              <div>
                <p className="font-medium text-navy">{profile.name}</p>
                <p className="text-sm text-muted-foreground">{profile.email}</p>
              </div>
            </div>

            <Separator />

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  value={profile.name}
                  onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={profile.email}
                  onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  value={profile.phone}
                  onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                />
              </div>
            </div>

            <Button onClick={handleSaveProfile}>Save Changes</Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Bell className="h-5 w-5" />
              Notification Preferences
            </CardTitle>
            <CardDescription>Choose what notifications you receive</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Order Updates</p>
                  <p className="text-sm text-muted-foreground">Get notified about order status changes</p>
                </div>
                <Switch
                  checked={notifications.orderUpdates}
                  onCheckedChange={(checked) => setNotifications({ ...notifications, orderUpdates: checked })}
                />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Booking Reminders</p>
                  <p className="text-sm text-muted-foreground">Reminders before your restaurant bookings</p>
                </div>
                <Switch
                  checked={notifications.bookingReminders}
                  onCheckedChange={(checked) => setNotifications({ ...notifications, bookingReminders: checked })}
                />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Promotional Offers</p>
                  <p className="text-sm text-muted-foreground">Receive exclusive deals and discounts</p>
                </div>
                <Switch
                  checked={notifications.promotions}
                  onCheckedChange={(checked) => setNotifications({ ...notifications, promotions: checked })}
                />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">SMS Notifications</p>
                  <p className="text-sm text-muted-foreground">Receive updates via SMS</p>
                </div>
                <Switch
                  checked={notifications.sms}
                  onCheckedChange={(checked) => setNotifications({ ...notifications, sms: checked })}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Lock className="h-5 w-5" />
              Security
            </CardTitle>
            <CardDescription>Manage your account security</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button variant="outline" className="w-full justify-start bg-transparent">
              <Lock className="h-4 w-4 mr-2" />
              Change Password
            </Button>
            <Button variant="outline" className="w-full justify-start bg-transparent">
              <Smartphone className="h-4 w-4 mr-2" />
              Enable Two-Factor Authentication
            </Button>
            <Button variant="outline" className="w-full justify-start bg-transparent">
              <Mail className="h-4 w-4 mr-2" />
              Change Email
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <CreditCard className="h-5 w-5" />
              Payment Methods
            </CardTitle>
            <CardDescription>Manage your saved payment methods</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-6 bg-gradient-to-r from-blue-600 to-blue-400 rounded flex items-center justify-center text-white text-xs font-bold">
                    VISA
                  </div>
                  <div>
                    <p className="font-medium">**** **** **** 4242</p>
                    <p className="text-xs text-muted-foreground">Expires 12/25</p>
                  </div>
                </div>
                <Button variant="ghost" size="sm">
                  Remove
                </Button>
              </div>
              <Button variant="outline" className="w-full bg-transparent">
                <CreditCard className="h-4 w-4 mr-2" />
                Add New Payment Method
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="border-destructive/50">
          <CardHeader>
            <CardTitle className="text-lg text-destructive flex items-center gap-2">
              <Trash2 className="h-5 w-5" />
              Danger Zone
            </CardTitle>
            <CardDescription>Irreversible account actions</CardDescription>
          </CardHeader>
          <CardContent>
            <Button variant="destructive">Delete My Account</Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
