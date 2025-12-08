import Link from "next/link"
import { Button } from "@/components/ui/button"
import { LayoutDashboard, Clock, FileText, BarChart3, MessageSquare, Check } from "lucide-react"

const benefits = [
  { icon: LayoutDashboard, text: "Real-time order and booking dashboard" },
  { icon: Clock, text: "Automatic preparation suggestions based on customer ETA" },
  { icon: FileText, text: "Digital menu editor with images, ingredients & add-ons" },
  { icon: BarChart3, text: "Fast settlements and transparent financial reports" },
  { icon: MessageSquare, text: "Customer reviews & performance analytics" },
]

export function ForRestaurants() {
  return (
    <section className="py-20 lg:py-28 bg-navy text-cream">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-cream/10 border border-cream/20">
              <span className="text-sm font-medium">For Restaurant Partners</span>
            </div>

            <h2 className="text-3xl md:text-4xl font-bold leading-tight">Designed for Restaurants Too</h2>

            <p className="text-cream/70 text-lg leading-relaxed">
              {
                "DineOnTime isn't just a booking tool — it's a workflow optimizer that helps you serve more customers with less friction."
              }
            </p>

            <div className="space-y-4">
              {benefits.map((benefit, index) => (
                <div key={index} className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center shrink-0">
                    <benefit.icon className="w-5 h-5 text-primary" />
                  </div>
                  <span className="text-cream/90">{benefit.text}</span>
                </div>
              ))}
            </div>

            <Button size="lg" className="bg-cream text-navy hover:bg-cream/90" asChild>
              <Link href="/for-restaurants">Join as a Restaurant Partner</Link>
            </Button>
          </div>

          <div className="relative">
            <div className="bg-cream/5 rounded-2xl p-8 border border-cream/10">
              <div className="space-y-6">
                <div className="flex items-center justify-between pb-4 border-b border-cream/10">
                  <span className="font-semibold">Restaurant Dashboard</span>
                  <span className="text-sm text-cream/60">Live</span>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-cream/5 rounded-lg p-4">
                    <p className="text-3xl font-bold text-primary">24</p>
                    <p className="text-sm text-cream/60">Active Orders</p>
                  </div>
                  <div className="bg-cream/5 rounded-lg p-4">
                    <p className="text-3xl font-bold text-green-400">18</p>
                    <p className="text-sm text-cream/60">Tables Booked</p>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between bg-cream/5 rounded-lg p-3">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-green-500/20 flex items-center justify-center">
                        <Check className="w-4 h-4 text-green-400" />
                      </div>
                      <div>
                        <p className="text-sm font-medium">Table #5 - Ready</p>
                        <p className="text-xs text-cream/60">Customer arriving in 5 min</p>
                      </div>
                    </div>
                    <span className="text-xs bg-green-500/20 text-green-400 px-2 py-1 rounded">Prepared</span>
                  </div>

                  <div className="flex items-center justify-between bg-cream/5 rounded-lg p-3">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-yellow-500/20 flex items-center justify-center">
                        <Clock className="w-4 h-4 text-yellow-400" />
                      </div>
                      <div>
                        <p className="text-sm font-medium">Table #12 - Preparing</p>
                        <p className="text-xs text-cream/60">ETA: 18 minutes</p>
                      </div>
                    </div>
                    <span className="text-xs bg-yellow-500/20 text-yellow-400 px-2 py-1 rounded">In Progress</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
