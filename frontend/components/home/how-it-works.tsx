"use client"

import { Search, ShoppingBag, Clock } from "lucide-react"
import { motion } from "framer-motion"
import { AnimateOnScroll, StaggerChildren, StaggerItem } from "@/components/ui/animate-on-scroll"

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
        <AnimateOnScroll direction="fade" className="text-center max-w-2xl mx-auto mb-16">
          <motion.h2
            className="text-3xl md:text-4xl font-bold text-navy mb-4"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            How DineOnTime Works
          </motion.h2>
          <motion.p
            className="text-muted-foreground text-lg"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            Three simple steps to a perfect dining experience
          </motion.p>
        </AnimateOnScroll>

        <StaggerChildren className="grid md:grid-cols-3 gap-8">
          {steps.map((step, index) => (
            <StaggerItem key={index}>
              <motion.div
                className="relative group"
                whileHover={{ y: -10 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <motion.div
                  className="bg-cream rounded-2xl p-8 h-full transition-all duration-300 hover:shadow-lg border border-transparent hover:border-primary/20"
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.2 }}
                  whileHover={{ scale: 1.02 }}
                >
                  <div className="flex items-start justify-between mb-6">
                    <motion.div
                      className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary group-hover:text-primary-foreground transition-colors"
                      whileHover={{ rotate: [0, -10, 10, 0], scale: 1.1 }}
                      transition={{ duration: 0.5 }}
                    >
                      <step.icon className="w-7 h-7 text-primary group-hover:text-primary-foreground" />
                    </motion.div>
                    <motion.span
                      className="text-5xl font-bold text-navy/10"
                      initial={{ opacity: 0, scale: 0 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.5, delay: index * 0.2 + 0.3 }}
                    >
                      {step.step}
                    </motion.span>
                  </div>
                  <h3 className="text-xl font-semibold text-navy mb-3">{step.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">{step.description}</p>
                </motion.div>
                {index < steps.length - 1 && (
                  <motion.div
                    className="hidden md:block absolute top-1/2 -right-4 w-8 h-0.5 bg-border"
                    initial={{ scaleX: 0 }}
                    whileInView={{ scaleX: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, delay: index * 0.2 + 0.5 }}
                  />
                )}
              </motion.div>
            </StaggerItem>
          ))}
        </StaggerChildren>
      </div>
    </section>
  )
}
