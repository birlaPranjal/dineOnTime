"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { MapPin, Home, Briefcase, Plus, Edit, Trash2, Check } from "lucide-react"

const initialAddresses = [
  {
    id: "1",
    label: "Home",
    address: "123, 4th Cross, 5th Main Road",
    area: "Koramangala",
    city: "Bangalore",
    pincode: "560034",
    isDefault: true,
    icon: Home,
  },
  {
    id: "2",
    label: "Office",
    address: "Tech Park, Tower B, 8th Floor",
    area: "Whitefield",
    city: "Bangalore",
    pincode: "560066",
    isDefault: false,
    icon: Briefcase,
  },
  {
    id: "3",
    label: "Parents Home",
    address: "42, Green Valley Apartments",
    area: "Indiranagar",
    city: "Bangalore",
    pincode: "560038",
    isDefault: false,
    icon: Home,
  },
]

export default function CustomerAddressesPage() {
  const [addresses, setAddresses] = useState(initialAddresses)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingAddress, setEditingAddress] = useState<any>(null)

  const [formData, setFormData] = useState({
    label: "",
    address: "",
    area: "",
    city: "",
    pincode: "",
  })

  const handleOpenDialog = (address?: any) => {
    if (address) {
      setEditingAddress(address)
      setFormData({
        label: address.label,
        address: address.address,
        area: address.area,
        city: address.city,
        pincode: address.pincode,
      })
    } else {
      setEditingAddress(null)
      setFormData({ label: "", address: "", area: "", city: "", pincode: "" })
    }
    setIsDialogOpen(true)
  }

  const handleSave = () => {
    if (editingAddress) {
      setAddresses(addresses.map((a) => (a.id === editingAddress.id ? { ...a, ...formData } : a)))
    } else {
      setAddresses([
        ...addresses,
        {
          id: Date.now().toString(),
          ...formData,
          isDefault: addresses.length === 0,
          icon: formData.label.toLowerCase().includes("office") ? Briefcase : Home,
        },
      ])
    }
    setIsDialogOpen(false)
  }

  const setDefault = (id: string) => {
    setAddresses(addresses.map((a) => ({ ...a, isDefault: a.id === id })))
  }

  const deleteAddress = (id: string) => {
    setAddresses(addresses.filter((a) => a.id !== id))
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-navy">Saved Addresses</h2>
          <p className="text-muted-foreground">Manage your delivery and pickup addresses</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => handleOpenDialog()}>
              <Plus className="h-4 w-4 mr-2" />
              Add New Address
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editingAddress ? "Edit Address" : "Add New Address"}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 pt-4">
              <div className="space-y-2">
                <Label>Label</Label>
                <Input
                  placeholder="e.g., Home, Office, Gym"
                  value={formData.label}
                  onChange={(e) => setFormData({ ...formData, label: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>Address</Label>
                <Input
                  placeholder="House/Flat number, Building name"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Area</Label>
                  <Input
                    placeholder="Locality/Area"
                    value={formData.area}
                    onChange={(e) => setFormData({ ...formData, area: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>City</Label>
                  <Input
                    placeholder="City"
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Pincode</Label>
                <Input
                  placeholder="6-digit pincode"
                  value={formData.pincode}
                  onChange={(e) => setFormData({ ...formData, pincode: e.target.value })}
                  maxLength={6}
                />
              </div>
              <div className="flex gap-3 pt-4">
                <Button variant="outline" className="flex-1 bg-transparent" onClick={() => setIsDialogOpen(false)}>
                  Cancel
                </Button>
                <Button className="flex-1" onClick={handleSave}>
                  {editingAddress ? "Update" : "Save"} Address
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {addresses.map((address) => {
          const IconComponent = address.icon
          return (
            <Card key={address.id} className={`relative ${address.isDefault ? "border-primary" : ""}`}>
              {address.isDefault && <Badge className="absolute top-3 right-3 bg-primary">Default</Badge>}
              <CardContent className="p-5">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                    <IconComponent className="h-5 w-5 text-primary" />
                  </div>
                  <div className="flex-1 space-y-1">
                    <h3 className="font-semibold text-navy">{address.label}</h3>
                    <p className="text-sm text-muted-foreground">{address.address}</p>
                    <p className="text-sm text-muted-foreground">
                      {address.area}, {address.city} - {address.pincode}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2 mt-4 pt-4 border-t border-border">
                  <Button variant="ghost" size="sm" onClick={() => handleOpenDialog(address)}>
                    <Edit className="h-4 w-4 mr-1" />
                    Edit
                  </Button>
                  {!address.isDefault && (
                    <>
                      <Button variant="ghost" size="sm" onClick={() => setDefault(address.id)}>
                        <Check className="h-4 w-4 mr-1" />
                        Set Default
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-destructive hover:text-destructive"
                        onClick={() => deleteAddress(address.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </>
                  )}
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {addresses.length === 0 && (
        <Card>
          <CardContent className="py-12 text-center">
            <MapPin className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-50" />
            <p className="text-muted-foreground mb-4">No saved addresses yet</p>
            <Button onClick={() => handleOpenDialog()}>
              <Plus className="h-4 w-4 mr-2" />
              Add Your First Address
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
