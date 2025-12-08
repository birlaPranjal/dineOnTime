"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { ImageIcon, FileText, Settings, Plus, Edit, Trash2, Eye, Save } from "lucide-react"
import { toast } from "sonner"

const banners = [
  {
    id: "1",
    title: "New Year Special",
    image: "/food-promotion-banner.jpg",
    link: "/restaurants",
    isActive: true,
    position: "hero",
  },
  {
    id: "2",
    title: "Free Delivery Week",
    image: "/delivery-promotion-banner.jpg",
    link: "/restaurants",
    isActive: true,
    position: "middle",
  },
  {
    id: "3",
    title: "Restaurant Partner Offer",
    image: "/restaurant-partnership-banner.jpg",
    link: "/for-restaurants",
    isActive: false,
    position: "footer",
  },
]

const pages = [
  { id: "1", title: "About Us", slug: "/about", lastUpdated: "Dec 15, 2024" },
  { id: "2", title: "Privacy Policy", slug: "/privacy", lastUpdated: "Dec 10, 2024" },
  { id: "3", title: "Terms of Service", slug: "/terms", lastUpdated: "Dec 10, 2024" },
  { id: "4", title: "FAQ", slug: "/faq", lastUpdated: "Dec 18, 2024" },
]

export default function AdminCMSPage() {
  const [activeTab, setActiveTab] = useState("banners")

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-navy">Content Management</h2>
          <p className="text-muted-foreground">Manage website content, banners, and pages</p>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="banners">
            <ImageIcon className="h-4 w-4 mr-2" />
            Banners
          </TabsTrigger>
          <TabsTrigger value="pages">
            <FileText className="h-4 w-4 mr-2" />
            Pages
          </TabsTrigger>
          <TabsTrigger value="settings">
            <Settings className="h-4 w-4 mr-2" />
            Site Settings
          </TabsTrigger>
        </TabsList>

        <TabsContent value="banners" className="mt-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">Promotional Banners</h3>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Banner
            </Button>
          </div>
          <div className="grid gap-4">
            {banners.map((banner) => (
              <Card key={banner.id}>
                <CardContent className="p-4">
                  <div className="flex items-center gap-4">
                    <img
                      src={banner.image || "/placeholder.svg"}
                      alt={banner.title}
                      className="w-48 h-24 object-cover rounded-lg"
                    />
                    <div className="flex-1 space-y-1">
                      <div className="flex items-center gap-2">
                        <h4 className="font-medium text-navy">{banner.title}</h4>
                        <Badge variant={banner.isActive ? "default" : "secondary"}>
                          {banner.isActive ? "Active" : "Inactive"}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">Position: {banner.position}</p>
                      <p className="text-sm text-muted-foreground">Link: {banner.link}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Switch checked={banner.isActive} />
                      <Button variant="ghost" size="icon">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="text-destructive">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="pages" className="mt-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">Static Pages</h3>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Page
            </Button>
          </div>
          <Card>
            <CardContent className="p-0">
              <div className="divide-y">
                {pages.map((page) => (
                  <div key={page.id} className="flex items-center justify-between p-4">
                    <div>
                      <h4 className="font-medium text-navy">{page.title}</h4>
                      <p className="text-sm text-muted-foreground">{page.slug}</p>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="text-sm text-muted-foreground">Updated: {page.lastUpdated}</span>
                      <Button variant="ghost" size="sm">
                        <Eye className="h-4 w-4 mr-1" />
                        Preview
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Edit className="h-4 w-4 mr-1" />
                        Edit
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings" className="mt-6">
          <div className="grid gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Site Information</CardTitle>
                <CardDescription>Basic website information and branding</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label>Site Name</Label>
                    <Input defaultValue="DineOnTime" />
                  </div>
                  <div className="space-y-2">
                    <Label>Tagline</Label>
                    <Input defaultValue="Smart Dining Starts Here" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Site Description</Label>
                  <Textarea
                    defaultValue="DineOnTime is India's leading restaurant booking and pre-ordering platform."
                    rows={3}
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Contact Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label>Support Email</Label>
                    <Input defaultValue="support@dineontime.com" />
                  </div>
                  <div className="space-y-2">
                    <Label>Support Phone</Label>
                    <Input defaultValue="1800-123-4567" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Office Address</Label>
                  <Textarea defaultValue="123, Tech Park, Koramangala, Bangalore - 560034" rows={2} />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Social Media Links</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label>Facebook</Label>
                    <Input defaultValue="https://facebook.com/dineontime" />
                  </div>
                  <div className="space-y-2">
                    <Label>Instagram</Label>
                    <Input defaultValue="https://instagram.com/dineontime" />
                  </div>
                  <div className="space-y-2">
                    <Label>Twitter</Label>
                    <Input defaultValue="https://twitter.com/dineontime" />
                  </div>
                  <div className="space-y-2">
                    <Label>LinkedIn</Label>
                    <Input defaultValue="https://linkedin.com/company/dineontime" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Button onClick={() => toast.success("Settings saved successfully!")}>
              <Save className="h-4 w-4 mr-2" />
              Save All Settings
            </Button>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
