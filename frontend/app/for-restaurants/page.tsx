"use client"

import { useState } from "react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { LayoutDashboard, Clock, FileText, BarChart3, MessageSquare, Zap, Loader2 } from "lucide-react"
import { toast } from "sonner"

const features = [
  {
    icon: LayoutDashboard,
    title: "Real-time Dashboard",
    description: "Monitor all bookings, orders, and table status from a single intuitive dashboard.",
  },
  {
    icon: Clock,
    title: "ETA-based Preparation",
    description: "Get automatic alerts based on customer ETA so you can time meal preparation perfectly.",
  },
  {
    icon: FileText,
    title: "Digital Menu Editor",
    description: "Easily update your menu with images, descriptions, prices, and customization options.",
  },
  {
    icon: BarChart3,
    title: "Analytics & Reports",
    description: "Gain insights into your busiest hours, popular dishes, and revenue trends.",
  },
  {
    icon: MessageSquare,
    title: "Customer Feedback",
    description: "Collect and respond to reviews to improve your service and build loyalty.",
  },
  {
    icon: Zap,
    title: "Fast Settlements",
    description: "Receive payments quickly with transparent fee structures and detailed reports.",
  },
]

const benefits = [
  { stat: "70%", label: "Reduced no-shows" },
  { stat: "2x", label: "Table turnover increase" },
  { stat: "35%", label: "Higher order values" },
  { stat: "24/7", label: "Support available" },
]

const testimonials = [
  {
    quote:
      "DineOnTime has transformed how we manage our restaurant. The ETA feature alone has improved our kitchen efficiency by 40%.",
    author: "Chef Rakesh Kumar",
    restaurant: "Spice Garden, Mumbai",
  },
  {
    quote: "We saw a significant reduction in wait time complaints and our customers love the pre-ordering feature.",
    author: "Meera Patel",
    restaurant: "The Coastal Kitchen, Chennai",
  },
]

export default function ForRestaurantsPage() {
  const [formData, setFormData] = useState({
    restaurantName: "",
    ownerName: "",
    email: "",
    phone: "",
    city: "",
  })
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const { partnershipApi } = await import("@/lib/api")
      await partnershipApi.submitRequest(formData)

      toast.success("Partnership request submitted successfully! Our team will get in touch within 24 hours.")
      setFormData({
        restaurantName: "",
        ownerName: "",
        email: "",
        phone: "",
        city: "",
      })
    } catch (error: any) {
      toast.error(error.message || "Something went wrong. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-cream">
      <Header />

      <main>
        <section className="py-20 lg:py-28 bg-navy text-cream">
          <div className="container mx-auto px-4">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div className="space-y-8">
                <h1 className="text-4xl md:text-5xl font-bold leading-tight">Grow Your Restaurant with DineOnTime</h1>
                <p className="text-xl text-cream/70 leading-relaxed">
                  Join 500+ restaurants using our platform to increase efficiency, boost revenue, and delight customers.
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Button size="lg" className="bg-cream text-navy hover:bg-cream/90">
                    Get Started Free
                  </Button>
                  <Button
                    size="lg"
                    variant="outline"
                    className="border-cream text-cream hover:bg-cream hover:text-navy bg-transparent"
                  >
                    Schedule a Demo
                  </Button>
                </div>
              </div>
              <div className="relative">
                <img
                  src="/placeholder.svg?height=500&width=600"
                  alt="Restaurant dashboard preview"
                  className="rounded-xl shadow-2xl"
                />
              </div>
            </div>
          </div>
        </section>

        <section className="py-16 bg-card border-y border-border">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {benefits.map((benefit, index) => (
                <div key={index} className="text-center">
                  <p className="text-4xl md:text-5xl font-bold text-primary mb-2">{benefit.stat}</p>
                  <p className="text-muted-foreground">{benefit.label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-navy mb-4">Everything You Need to Succeed</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Powerful tools designed specifically for restaurant operations
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {features.map((feature, index) => (
                <div
                  key={index}
                  className="bg-card rounded-xl p-6 border border-border hover:shadow-lg transition-shadow"
                >
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                    <feature.icon className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="text-lg font-semibold text-navy mb-2">{feature.title}</h3>
                  <p className="text-muted-foreground text-sm">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-20 bg-card">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-navy mb-4">Trusted by Restaurant Owners</h2>
            </div>

            <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              {testimonials.map((testimonial, index) => (
                <div key={index} className="bg-cream rounded-xl p-8">
                  <p className="text-foreground mb-6 leading-relaxed">{`"${testimonial.quote}"`}</p>
                  <div>
                    <p className="font-semibold text-navy">{testimonial.author}</p>
                    <p className="text-sm text-muted-foreground">{testimonial.restaurant}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-20 bg-navy text-cream">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto">
              <div className="text-center mb-12">
                <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to Partner With Us?</h2>
                <p className="text-cream/70">Fill out the form below and our team will get in touch within 24 hours.</p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="restaurantName" className="text-sm font-medium text-cream">
                      Restaurant Name
                    </Label>
                    <Input
                      id="restaurantName"
                      placeholder="Your Restaurant"
                      value={formData.restaurantName}
                      onChange={(e) => setFormData({ ...formData, restaurantName: e.target.value })}
                      required
                      className="bg-cream/10 border-cream/20 text-cream placeholder:text-cream/50"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="ownerName" className="text-sm font-medium text-cream">
                      Owner Name
                    </Label>
                    <Input
                      id="ownerName"
                      placeholder="Your Name"
                      value={formData.ownerName}
                      onChange={(e) => setFormData({ ...formData, ownerName: e.target.value })}
                      required
                      className="bg-cream/10 border-cream/20 text-cream placeholder:text-cream/50"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-sm font-medium text-cream">
                      Email
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="you@restaurant.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      required
                      className="bg-cream/10 border-cream/20 text-cream placeholder:text-cream/50"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone" className="text-sm font-medium text-cream">
                      Phone
                    </Label>
                    <Input
                      id="phone"
                      type="tel"
                      placeholder="+91 98765 43210"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      required
                      className="bg-cream/10 border-cream/20 text-cream placeholder:text-cream/50"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="city" className="text-sm font-medium text-cream">
                    City
                  </Label>
                  <Input
                    id="city"
                    placeholder="Bangalore, Mumbai, Delhi..."
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    required
                    className="bg-cream/10 border-cream/20 text-cream placeholder:text-cream/50"
                  />
                </div>
                <Button
                  type="submit"
                  size="lg"
                  className="w-full bg-cream text-navy hover:bg-cream/90"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    "Submit Partnership Request"
                  )}
                </Button>
              </form>

              <div className="mt-8 text-center">
                <p className="text-cream/70 text-sm">
                  Or call us directly at{" "}
                  <a href="tel:+911234567890" className="text-cream hover:underline">
                    +91 123 456 7890
                  </a>
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
