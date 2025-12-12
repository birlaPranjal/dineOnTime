"use client"

import { CheckCircle2, Clock, DollarSign, Heart, Shield, Zap } from "lucide-react"
import { motion } from "framer-motion"
import { AnimateOnScroll, StaggerChildren, StaggerItem } from "@/components/ui/animate-on-scroll"

const benefits = [
  {
    icon: Clock,
    title: "Save Time",
    description: "No more waiting in queues. Your meal is ready when you arrive.",
    stat: "Save 20+ min",
  },
  {
    icon: DollarSign,
    title: "Save Money",
    description: "Exclusive deals and discounts for pre-orders and bookings.",
    stat: "Up to 15% off",
  },
  {
    icon: Heart,
    title: "Better Experience",
    description: "Enjoy your meal without the stress of waiting or rushing.",
    stat: "5★ Rated",
  },
  {
    icon: Shield,
    title: "Secure & Safe",
    description: "Your data and payments are protected with bank-level security.",
    stat: "100% Secure",
  },
  {
    icon: Zap,
    title: "Instant Booking",
    description: "Book tables and order food in seconds, not minutes.",
    stat: "< 30 sec",
  },
  {
    icon: CheckCircle2,
    title: "Guaranteed Table",
    description: "Your reservation is confirmed. No last-minute disappointments.",
    stat: "99.9% Uptime",
  },
]

export function BenefitsSection() {
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
            Why Choose Us
          </motion.span>
          <motion.h2
            className="text-3xl md:text-4xl font-bold text-navy mb-4"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            Benefits That Matter
          </motion.h2>
          <motion.p
            className="text-muted-foreground text-lg"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            Experience dining reimagined with time-saving, money-saving, and stress-free solutions
          </motion.p>
        </AnimateOnScroll>

        <StaggerChildren className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {benefits.map((benefit, index) => (
            <StaggerItem key={index}>
              <motion.div
                className="bg-card rounded-xl p-6 border border-border hover:border-primary/30 hover:shadow-lg transition-all duration-300 group relative overflow-hidden"
                initial={{ opacity: 0, y: 30, rotateY: -15 }}
                whileInView={{ opacity: 1, y: 0, rotateY: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                whileHover={{ y: -8, scale: 1.02, rotateY: 5 }}
              >
                <motion.div
                  className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -mr-16 -mt-16 group-hover:bg-primary/10 transition-colors"
                  animate={{
                    scale: [1, 1.2, 1],
                    opacity: [0.3, 0.5, 0.3],
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    delay: index * 0.2,
                  }}
                />
                <div className="relative">
                  <motion.div
                    className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary transition-colors"
                    whileHover={{ rotate: [0, -15, 15, 0], scale: 1.15 }}
                    transition={{ duration: 0.5 }}
                  >
                    <benefit.icon className="w-7 h-7 text-primary group-hover:text-primary-foreground" />
                  </motion.div>
                  <h3 className="text-xl font-semibold text-navy mb-2">{benefit.title}</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed mb-4">{benefit.description}</p>
                  <motion.div
                    className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium"
                    whileHover={{ scale: 1.1 }}
                  >
                    <span>{benefit.stat}</span>
                  </motion.div>
                </div>
              </motion.div>
            </StaggerItem>
          ))}
        </StaggerChildren>
      </div>
    </section>
  )
}

