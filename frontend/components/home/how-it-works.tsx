import { Search, ShoppingBag, Clock } from "lucide-react"

const steps = [
  {
    icon: Search,
    title: "Discover & Book",
    description: "Search restaurants, explore digital menus, and reserve your perfect table in seconds.",
    step: "01",
  },
  {
    icon: ShoppingBag,
    title: "Pre-Order Your Meal",
    description: "Choose dishes, customize your order, and pay online — before you even arrive.",
    step: "02",
  },
  {
    icon: Clock,
    title: "Arrive Just In Time",
    description:
      "DineOnTime tracks your ETA in real-time, so restaurants prepare your meal exactly when they should. No delays. No queues.",
    step: "03",
  },
]

export function HowItWorks() {
  return (
    <section className="py-20 lg:py-28 bg-card">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-navy mb-4">How DineOnTime Works</h2>
          <p className="text-muted-foreground text-lg">Three simple steps to a perfect dining experience</p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {steps.map((step, index) => (
            <div key={index} className="relative group">
              <div className="bg-cream rounded-2xl p-8 h-full transition-all duration-300 hover:shadow-lg border border-transparent hover:border-primary/20">
                <div className="flex items-start justify-between mb-6">
                  <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                    <step.icon className="w-7 h-7 text-primary group-hover:text-primary-foreground" />
                  </div>
                  <span className="text-5xl font-bold text-navy/10">{step.step}</span>
                </div>
                <h3 className="text-xl font-semibold text-navy mb-3">{step.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{step.description}</p>
              </div>
              {index < steps.length - 1 && (
                <div className="hidden md:block absolute top-1/2 -right-4 w-8 h-0.5 bg-border" />
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
