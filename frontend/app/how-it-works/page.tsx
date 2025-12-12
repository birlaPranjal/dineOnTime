import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Search, ShoppingBag, Clock, MapPin, Bell, UtensilsCrossed, CheckCircle2 } from "lucide-react"

const detailedSteps = [
  {
    icon: Search,
    title: "Discover & Book",
    step: "01",
    description: "Start by searching for restaurants in your area or browse by cuisine type.",
    details: [
      "Browse through curated restaurant listings with photos, menus, and ratings",
      "Filter by cuisine, price range, location, and availability",
      "View real-time table availability and choose your preferred seating",
      "Select date, time, and number of guests",
      "Get instant confirmation of your reservation",
    ],
    image: "/elegant-restaurant-interior-with-warm-lighting-and.jpg",
  },
  {
    icon: ShoppingBag,
    title: "Pre-Order Your Meal",
    step: "02",
    description: "Browse the digital menu and customize your order before you arrive.",
    details: [
      "Explore the complete menu with high-quality food images",
      "Customize dishes (spice level, ingredients, special requests)",
      "Add items to your cart and review your order",
      "Choose your payment method (UPI, card, wallet, or cash)",
      "Complete secure payment and receive order confirmation",
    ],
    image: "/food-ordering-confirmation-screen-with-eta-trackin.jpg",
  },
  {
    icon: MapPin,
    title: "Share Your Location",
    step: "03",
    description: "Enable location sharing so we can track your ETA in real-time.",
    details: [
      "Grant location permissions for accurate ETA calculation",
      "Your route is tracked via Google Maps integration",
      "Real-time traffic updates are factored into ETA",
      "Restaurant receives live updates as you travel",
      "Automatic notifications if your ETA changes significantly",
    ],
    image: "/restaurant-booking-app-interface-with-food-menu-an.jpg",
  },
  {
    icon: Clock,
    title: "Arrive Just In Time",
    step: "04",
    description: "Your meal is prepared based on your ETA, so it's ready when you arrive.",
    details: [
      "Kitchen receives your order with calculated prep time",
      "Cooking starts based on your real-time ETA",
      "You receive notifications about order status",
      "Table is prepared and ready for your arrival",
      "Walk in, sit down, and enjoy your fresh meal immediately",
    ],
    image: "/happy-people-dining-at-restaurant.jpg",
  },
]

const features = [
  {
    icon: Bell,
    title: "Real-time Notifications",
    description: "Get instant updates about your booking, order status, and ETA changes.",
  },
  {
    icon: UtensilsCrossed,
    title: "Customizable Orders",
    description: "Personalize your meal with special instructions, dietary preferences, and modifications.",
  },
  {
    icon: CheckCircle2,
    title: "Guaranteed Reservations",
    description: "Your table is confirmed and held for you. No more waiting or disappointment.",
  },
]

export default function HowItWorksPage() {
  return (
    <div className="min-h-screen">
      <Header />
      <main>
        {/* Hero Section */}
        <section className="relative overflow-hidden bg-cream pt-24 pb-16">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-primary/5 via-transparent to-transparent" />
          <div className="container mx-auto px-4 relative z-10">
            <div className="max-w-3xl mx-auto text-center">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-navy mb-6">
                How <span className="text-primary">DineOnTime</span> Works
              </h1>
              <p className="text-lg md:text-xl text-muted-foreground mb-8 leading-relaxed">
                Experience seamless dining with our smart pre-order and table booking system. Follow these simple steps
                to enjoy faster, stress-free dining.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" className="text-base px-8" asChild>
                  <Link href="/restaurants">Get Started</Link>
                </Button>
                <Button size="lg" variant="outline" className="text-base px-8" asChild>
                  <Link href="/#features">Learn More</Link>
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Detailed Steps */}
        <section className="py-20 lg:py-28 bg-card">
          <div className="container mx-auto px-4">
            <div className="space-y-24">
              {detailedSteps.map((step, index) => (
                <div
                  key={index}
                  className={`grid lg:grid-cols-2 gap-12 items-center ${
                    index % 2 === 1 ? "lg:flex-row-reverse" : ""
                  }`}
                >
                  <div className={index % 2 === 1 ? "lg:order-2" : ""}>
                    <div className="flex items-center gap-4 mb-6">
                      <div className="w-16 h-16 rounded-xl bg-primary/10 flex items-center justify-center">
                        <step.icon className="w-8 h-8 text-primary" />
                      </div>
                      <div>
                        <span className="text-sm font-semibold text-primary uppercase tracking-wider">
                          Step {step.step}
                        </span>
                        <h2 className="text-3xl md:text-4xl font-bold text-navy">{step.title}</h2>
                      </div>
                    </div>
                    <p className="text-lg text-muted-foreground mb-6 leading-relaxed">{step.description}</p>
                    <ul className="space-y-4">
                      {step.details.map((detail, detailIndex) => (
                        <li key={detailIndex} className="flex items-start gap-3">
                          <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                            <CheckCircle2 className="w-4 h-4 text-primary" />
                          </div>
                          <span className="text-muted-foreground leading-relaxed">{detail}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className={index % 2 === 1 ? "lg:order-1" : ""}>
                    <div className="relative rounded-2xl overflow-hidden shadow-2xl">
                      <img
                        src={step.image}
                        alt={step.title}
                        className="w-full h-auto object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Additional Features */}
        <section className="py-20 lg:py-28 bg-cream">
          <div className="container mx-auto px-4">
            <div className="text-center max-w-2xl mx-auto mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-navy mb-4">Additional Features</h2>
              <p className="text-muted-foreground text-lg">
                Everything you need for a perfect dining experience
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              {features.map((feature, index) => (
                <div
                  key={index}
                  className="bg-card rounded-xl p-6 border border-border hover:border-primary/30 hover:shadow-lg transition-all duration-300"
                >
                  <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                    <feature.icon className="w-7 h-7 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold text-navy mb-2">{feature.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 lg:py-28 bg-primary text-primary-foreground">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Transform Your Dining Experience?</h2>
              <p className="text-lg mb-8 opacity-90">
                Join thousands of diners who are already enjoying faster, stress-free meals with DineOnTime.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" variant="secondary" className="text-base px-8" asChild>
                  <Link href="/restaurants">Start Booking Now</Link>
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="text-base px-8 border-primary-foreground/20 text-primary-foreground hover:bg-primary-foreground/10"
                  asChild
                >
                  <Link href="/signup">Create Account</Link>
                </Button>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}

