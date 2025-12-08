import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Star, Users, MapPin } from "lucide-react"

export function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-cream">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-primary/5 via-transparent to-transparent" />

      <div className="container mx-auto px-4 py-20 lg:py-32">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-card border border-border">
              <Star className="h-4 w-4 text-primary fill-primary" />
              <span className="text-sm font-medium text-foreground">Trusted by 50,000+ diners</span>
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-navy leading-tight text-balance">
              Smart Pre-Order & Table Booking for a <span className="text-primary">Faster Dining</span> Experience
            </h1>

            <p className="text-lg text-muted-foreground max-w-xl leading-relaxed">
              Skip the wait. Pre-order your meal, book your table, and arrive exactly when your food is ready — all in
              one seamless platform.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button size="lg" className="text-base px-8" asChild>
                <Link href="/restaurants">Book a Table</Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="text-base px-8 border-navy text-navy hover:bg-navy hover:text-cream bg-transparent"
                asChild
              >
                <Link href="/restaurants">Pre-Order Now</Link>
              </Button>
            </div>

            <div className="flex items-center gap-6 pt-4">
              <div className="flex items-center gap-2">
                <Users className="h-5 w-5 text-primary" />
                <span className="text-sm text-muted-foreground">Loved by diners</span>
              </div>
              <div className="flex items-center gap-2">
                <Star className="h-5 w-5 text-primary fill-primary" />
                <span className="text-sm text-muted-foreground">Trusted by restaurants</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="h-5 w-5 text-primary" />
                <span className="text-sm text-muted-foreground">Real-time ETA</span>
              </div>
            </div>
          </div>

          <div className="relative">
            <div className="relative z-10 rounded-2xl overflow-hidden shadow-2xl">
              <img
                src="/elegant-restaurant-interior-with-warm-lighting-and.jpg"
                alt="Elegant restaurant interior"
                className="w-full h-auto object-cover"
              />
            </div>
            <div className="absolute -bottom-4 -left-4 z-20 bg-card rounded-xl p-4 shadow-xl border border-border">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">
                  <svg className="w-6 h-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div>
                  <p className="font-semibold text-foreground">Table Reserved!</p>
                  <p className="text-sm text-muted-foreground">Your meal is being prepared</p>
                </div>
              </div>
            </div>
            <div className="absolute -top-4 -right-4 z-20 bg-card rounded-xl p-4 shadow-xl border border-border">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <MapPin className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <p className="font-semibold text-foreground">ETA: 12 min</p>
                  <p className="text-sm text-muted-foreground">Kitchen notified</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
