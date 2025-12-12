"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Check } from "lucide-react"
import { motion } from "framer-motion"
import { AnimateOnScroll, StaggerChildren, StaggerItem } from "@/components/ui/animate-on-scroll"

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
        <AnimateOnScroll direction="fade" className="text-center max-w-2xl mx-auto mb-16">
          <motion.span
            className="inline-block text-sm font-semibold text-primary mb-4 uppercase tracking-wider"
            initial={{ opacity: 0, y: -20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            Pricing
          </motion.span>
          <motion.h2
            className="text-3xl md:text-4xl font-bold text-navy mb-4"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            Simple, Transparent Pricing
          </motion.h2>
          <motion.p
            className="text-muted-foreground text-lg"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            Choose the plan that works best for you. All plans include core features.
          </motion.p>
        </AnimateOnScroll>

        <StaggerChildren className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {plans.map((plan, index) => (
            <StaggerItem key={index}>
              <motion.div
                className={`
                  relative bg-cream rounded-2xl p-8 border-2 transition-all duration-300
                  ${plan.popular ? "border-primary shadow-xl" : "border-border hover:border-primary/30"}
                `}
                initial={{ opacity: 0, y: 50, scale: 0.9 }}
                whileInView={{ opacity: 1, y: 0, scale: plan.popular ? 1.05 : 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                whileHover={{ y: -10, scale: plan.popular ? 1.08 : 1.02 }}
              >
                {plan.popular && (
                  <motion.div
                    className="absolute -top-4 left-1/2 -translate-x-1/2"
                    initial={{ opacity: 0, y: -20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: index * 0.1 + 0.3 }}
                    animate={{ y: [0, -5, 0] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    <span className="bg-primary text-primary-foreground px-4 py-1 rounded-full text-sm font-semibold">
                      Most Popular
                    </span>
                  </motion.div>
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
                    <motion.li
                      key={featureIndex}
                      className="flex items-start gap-3"
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.4, delay: index * 0.1 + featureIndex * 0.05 }}
                    >
                      <motion.div
                        className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5"
                        whileHover={{ scale: 1.2, rotate: 360 }}
                        transition={{ duration: 0.3 }}
                      >
                        <Check className="w-3 h-3 text-primary" />
                      </motion.div>
                      <span className="text-sm text-muted-foreground">{feature}</span>
                    </motion.li>
                  ))}
                </ul>

                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
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
                </motion.div>
              </motion.div>
            </StaggerItem>
          ))}
        </StaggerChildren>
      </div>
    </section>
  )
}

