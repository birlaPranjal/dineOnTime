import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Check } from "lucide-react"

const plans = [
  {
    name: "Free",
    price: "₹0",
    period: "forever",
    description: "Perfect for occasional diners",
    features: [
      "Unlimited table bookings",
      "Pre-order meals",
      "Basic ETA tracking",
      "Standard support",
      "Access to all restaurants",
    ],
    cta: "Get Started",
    popular: false,
  },
  {
    name: "Premium",
    price: "₹199",
    period: "per month",
    description: "For food lovers who dine out regularly",
    features: [
      "Everything in Free",
      "Priority table reservations",
      "Advanced ETA tracking",
      "Exclusive restaurant deals (up to 20% off)",
      "Priority customer support",
      "Early access to new restaurants",
      "No booking fees",
    ],
    cta: "Go Premium",
    popular: true,
  },
  {
    name: "Restaurant",
    price: "Custom",
    period: "pricing",
    description: "For restaurant owners",
    features: [
      "Full restaurant dashboard",
      "Table management system",
      "Order management",
      "Analytics & insights",
      "Customer management",
      "Marketing tools",
      "24/7 dedicated support",
    ],
    cta: "Contact Sales",
    popular: false,
  },
]

export function PricingSection() {
  return (
    <section className="py-20 lg:py-28 bg-card">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="inline-block text-sm font-semibold text-primary mb-4 uppercase tracking-wider">
            Pricing
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-navy mb-4">Simple, Transparent Pricing</h2>
          <p className="text-muted-foreground text-lg">
            Choose the plan that works best for you. All plans include core features.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {plans.map((plan, index) => (
            <div
              key={index}
              className={`
                relative bg-cream rounded-2xl p-8 border-2 transition-all duration-300
                ${plan.popular ? "border-primary shadow-xl scale-105" : "border-border hover:border-primary/30"}
              `}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                  <span className="bg-primary text-primary-foreground px-4 py-1 rounded-full text-sm font-semibold">
                    Most Popular
                  </span>
                </div>
              )}

              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold text-navy mb-2">{plan.name}</h3>
                <div className="flex items-baseline justify-center gap-2 mb-2">
                  <span className="text-4xl font-bold text-navy">{plan.price}</span>
                  {plan.period !== "forever" && plan.period !== "pricing" && (
                    <span className="text-muted-foreground">/{plan.period}</span>
                  )}
                </div>
                <p className="text-muted-foreground text-sm">{plan.description}</p>
              </div>

              <ul className="space-y-4 mb-8">
                {plan.features.map((feature, featureIndex) => (
                  <li key={featureIndex} className="flex items-start gap-3">
                    <div className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Check className="w-3 h-3 text-primary" />
                    </div>
                    <span className="text-sm text-muted-foreground">{feature}</span>
                  </li>
                ))}
              </ul>

              <Button
                className={`
                  w-full
                  ${plan.popular ? "bg-primary text-primary-foreground" : "bg-navy text-cream hover:bg-navy/90"}
                `}
                variant={plan.popular ? "default" : "outline"}
                size="lg"
                asChild
              >
                <Link href={plan.name === "Restaurant" ? "/for-restaurants" : "/signup"}>
                  {plan.cta}
                </Link>
              </Button>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

