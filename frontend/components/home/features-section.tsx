import { Calendar, UtensilsCrossed, MapPin, CreditCard, Star, Clock } from "lucide-react"

const features = [
  {
    icon: Calendar,
    title: "Smart Table Booking",
    description: "Reserve your preferred seating (2-seater, family table, outdoor, etc.) with live availability.",
  },
  {
    icon: UtensilsCrossed,
    title: "Pre-Order Food",
    description: "Customize dishes, add notes, and order ahead to eliminate wait time.",
  },
  {
    icon: MapPin,
    title: "Live ETA Tracking",
    description: "Your route is tracked via Google Maps. Restaurants get updated ETAs for perfect meal timing.",
  },
  {
    icon: CreditCard,
    title: "Quick & Secure Payments",
    description: "Pay using UPI, cards, wallets, or cash on arrival — your choice.",
  },
  {
    icon: Star,
    title: "Ratings & Reviews",
    description: "Rate food, service, ambiance, and share your experience with others.",
  },
  {
    icon: Clock,
    title: "Real-time Updates",
    description: "Get instant notifications about your order status and table readiness.",
  },
]

export function FeaturesSection() {
  return (
    <section className="py-20 lg:py-28 bg-cream">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="inline-block text-sm font-semibold text-primary mb-4 uppercase tracking-wider">
            Key Features
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-navy mb-4">Everything You Need For Perfect Dining</h2>
          <p className="text-muted-foreground text-lg">
            Designed to make your dining experience seamless from start to finish
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <div
              key={index}
              className="bg-card rounded-xl p-6 border border-border hover:border-primary/30 hover:shadow-md transition-all duration-300 group"
            >
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary transition-colors">
                <feature.icon className="w-6 h-6 text-primary group-hover:text-primary-foreground" />
              </div>
              <h3 className="text-lg font-semibold text-navy mb-2">{feature.title}</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
