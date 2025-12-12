"use client"

import { Calendar, UtensilsCrossed, MapPin, CreditCard, Star, Clock } from "lucide-react"
import { motion } from "framer-motion"
import { AnimateOnScroll, StaggerChildren, StaggerItem } from "@/components/ui/animate-on-scroll"

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
        <AnimateOnScroll direction="fade" className="text-center max-w-2xl mx-auto mb-16">
          <motion.span
            className="inline-block text-sm font-semibold text-primary mb-4 uppercase tracking-wider"
            initial={{ opacity: 0, y: -20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            Key Features
          </motion.span>
          <motion.h2
            className="text-3xl md:text-4xl font-bold text-navy mb-4"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            Everything You Need For Perfect Dining
          </motion.h2>
          <motion.p
            className="text-muted-foreground text-lg"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            Designed to make your dining experience seamless from start to finish
          </motion.p>
        </AnimateOnScroll>

        <StaggerChildren className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <StaggerItem key={index}>
              <motion.div
                className="bg-card rounded-xl p-6 border border-border hover:border-primary/30 hover:shadow-md transition-all duration-300 group"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ y: -5, scale: 1.02 }}
              >
                <motion.div
                  className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary transition-colors"
                  whileHover={{ rotate: [0, -10, 10, 0], scale: 1.1 }}
                  transition={{ duration: 0.5 }}
                >
                  <feature.icon className="w-6 h-6 text-primary group-hover:text-primary-foreground" />
                </motion.div>
                <h3 className="text-lg font-semibold text-navy mb-2">{feature.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{feature.description}</p>
              </motion.div>
            </StaggerItem>
          ))}
        </StaggerChildren>
      </div>
    </section>
  )
}
