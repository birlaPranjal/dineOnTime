"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Settings, Shield, CreditCard, Database, Save } from "lucide-react"
import { toast } from "sonner"

export default function AdminSettingsPage() {
  const [platformSettings, setPlatformSettings] = useState({
    maintenanceMode: false,
    newRegistrations: true,
    emailVerification: true,
    smsNotifications: true,
  })

  const [commissionSettings, setCommissionSettings] = useState({
    defaultCommission: "10",
    minOrderValue: "100",
    maxDiscount: "50",
  })

  const handleSave = () => {
    toast.success("Settings saved successfully!")
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-navy">Platform Settings</h2>
        <p className="text-muted-foreground">Configure platform-wide settings and preferences</p>
      </div>

      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Settings className="h-5 w-5" />
              General Settings
            </CardTitle>
            <CardDescription>Basic platform configuration</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Maintenance Mode</p>
                <p className="text-sm text-muted-foreground">Temporarily disable the platform for maintenance</p>
              </div>
              <Switch
                checked={platformSettings.maintenanceMode}
                onCheckedChange={(checked) => setPlatformSettings({ ...platformSettings, maintenanceMode: checked })}
              />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">New User Registrations</p>
                <p className="text-sm text-muted-foreground">Allow new users to sign up</p>
              </div>
              <Switch
                checked={platformSettings.newRegistrations}
                onCheckedChange={(checked) => setPlatformSettings({ ...platformSettings, newRegistrations: checked })}
              />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Email Verification Required</p>
                <p className="text-sm text-muted-foreground">Require email verification for new accounts</p>
              </div>
              <Switch
                checked={platformSettings.emailVerification}
                onCheckedChange={(checked) => setPlatformSettings({ ...platformSettings, emailVerification: checked })}
              />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">SMS Notifications</p>
                <p className="text-sm text-muted-foreground">Send SMS notifications for orders and bookings</p>
              </div>
              <Switch
                checked={platformSettings.smsNotifications}
                onCheckedChange={(checked) => setPlatformSettings({ ...platformSettings, smsNotifications: checked })}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <CreditCard className="h-5 w-5" />
              Commission & Pricing
            </CardTitle>
            <CardDescription>Configure platform fees and pricing rules</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-3">
              <div className="space-y-2">
                <Label>Default Commission (%)</Label>
                <Input
                  type="number"
                  value={commissionSettings.defaultCommission}
                  onChange={(e) =>
                    setCommissionSettings({
                      ...commissionSettings,
                      defaultCommission: e.target.value,
                    })
                  }
                />
                <p className="text-xs text-muted-foreground">Platform fee per order</p>
              </div>
              <div className="space-y-2">
                <Label>Minimum Order Value (₹)</Label>
                <Input
                  type="number"
                  value={commissionSettings.minOrderValue}
                  onChange={(e) =>
                    setCommissionSettings({
                      ...commissionSettings,
                      minOrderValue: e.target.value,
                    })
                  }
                />
                <p className="text-xs text-muted-foreground">Minimum order amount</p>
              </div>
              <div className="space-y-2">
                <Label>Max Discount (%)</Label>
                <Input
                  type="number"
                  value={commissionSettings.maxDiscount}
                  onChange={(e) =>
                    setCommissionSettings({
                      ...commissionSettings,
                      maxDiscount: e.target.value,
                    })
                  }
                />
                <p className="text-xs text-muted-foreground">Maximum allowed discount</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Security Settings
            </CardTitle>
            <CardDescription>Configure security and authentication</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label>Session Timeout (minutes)</Label>
                <Select defaultValue="60">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="30">30 minutes</SelectItem>
                    <SelectItem value="60">1 hour</SelectItem>
                    <SelectItem value="120">2 hours</SelectItem>
                    <SelectItem value="480">8 hours</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Max Login Attempts</Label>
                <Select defaultValue="5">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="3">3 attempts</SelectItem>
                    <SelectItem value="5">5 attempts</SelectItem>
                    <SelectItem value="10">10 attempts</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="flex items-center justify-between pt-4">
              <div>
                <p className="font-medium">Two-Factor Authentication</p>
                <p className="text-sm text-muted-foreground">Require 2FA for admin accounts</p>
              </div>
              <Switch defaultChecked />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Database className="h-5 w-5" />
              Database & Backup
            </CardTitle>
            <CardDescription>Database management and backup settings</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Auto Backup</p>
                <p className="text-sm text-muted-foreground">Automatically backup database daily</p>
              </div>
              <Switch defaultChecked />
            </div>
            <Separator />
            <div className="flex items-center gap-4">
              <Button variant="outline" className="bg-transparent">
                Create Backup Now
              </Button>
              <Button variant="outline" className="bg-transparent">
                View Backup History
              </Button>
            </div>
          </CardContent>
        </Card>

        <Button onClick={handleSave} className="w-fit">
          <Save className="h-4 w-4 mr-2" />
          Save All Settings
        </Button>
      </div>
    </div>
  )
}
