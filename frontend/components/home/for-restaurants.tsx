"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { LayoutDashboard, Clock, FileText, BarChart3, MessageSquare, Check } from "lucide-react"
import { motion } from "framer-motion"
import { AnimateOnScroll, StaggerChildren, StaggerItem } from "@/components/ui/animate-on-scroll"

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
          <AnimateOnScroll direction="right" className="space-y-8">
            <motion.div
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-cream/10 border border-cream/20"
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              whileHover={{ scale: 1.05 }}
            >
              <span className="text-sm font-medium">For Restaurant Partners</span>
            </motion.div>

            <motion.h2
              className="text-3xl md:text-4xl font-bold leading-tight"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              Designed for Restaurants Too
            </motion.h2>

            <motion.p
              className="text-cream/70 text-lg leading-relaxed"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              {
                "DineOnTime isn't just a booking tool — it's a workflow optimizer that helps you serve more customers with less friction."
              }
            </motion.p>

            <StaggerChildren className="space-y-4">
              {benefits.map((benefit, index) => (
                <StaggerItem key={index}>
                  <motion.div
                    className="flex items-center gap-4"
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    whileHover={{ x: 10 }}
                  >
                    <motion.div
                      className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center shrink-0"
                      whileHover={{ rotate: 360, scale: 1.1 }}
                      transition={{ duration: 0.5 }}
                    >
                    <benefit.icon className="w-5 h-5 text-primary" />
                    </motion.div>
                  <span className="text-cream/90">{benefit.text}</span>
                  </motion.div>
                </StaggerItem>
              ))}
            </StaggerChildren>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.8 }}
            >
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button size="lg" className="bg-cream text-navy hover:bg-cream/90" asChild>
              <Link href="/for-restaurants">Join as a Restaurant Partner</Link>
            </Button>
              </motion.div>
            </motion.div>
          </AnimateOnScroll>

          <AnimateOnScroll direction="left" className="relative">
            <motion.div
              className="bg-cream/5 rounded-2xl p-8 border border-cream/10"
              initial={{ opacity: 0, scale: 0.8, rotateY: 20 }}
              whileInView={{ opacity: 1, scale: 1, rotateY: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              whileHover={{ scale: 1.02 }}
            >
              <div className="space-y-6">
                <motion.div
                  className="flex items-center justify-between pb-4 border-b border-cream/10"
                  initial={{ opacity: 0, y: -20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5 }}
                >
                  <span className="font-semibold">Restaurant Dashboard</span>
                  <motion.span
                    className="text-sm text-cream/60"
                    animate={{ opacity: [1, 0.5, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    Live
                  </motion.span>
                </motion.div>

                <div className="grid grid-cols-2 gap-4">
                  <motion.div
                    className="bg-cream/5 rounded-lg p-4"
                    initial={{ opacity: 0, scale: 0.5 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    whileHover={{ scale: 1.05 }}
                  >
                    <motion.p
                      className="text-3xl font-bold text-primary"
                      initial={{ opacity: 0 }}
                      whileInView={{ opacity: 1 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.5, delay: 0.4 }}
                    >
                      24
                    </motion.p>
                    <p className="text-sm text-cream/60">Active Orders</p>
                  </motion.div>
                  <motion.div
                    className="bg-cream/5 rounded-lg p-4"
                    initial={{ opacity: 0, scale: 0.5 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: 0.3 }}
                    whileHover={{ scale: 1.05 }}
                  >
                    <motion.p
                      className="text-3xl font-bold text-green-400"
                      initial={{ opacity: 0 }}
                      whileInView={{ opacity: 1 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.5, delay: 0.5 }}
                    >
                      18
                    </motion.p>
                    <p className="text-sm text-cream/60">Tables Booked</p>
                  </motion.div>
                </div>

                <div className="space-y-3">
                  <motion.div
                    className="flex items-center justify-between bg-cream/5 rounded-lg p-3"
                    initial={{ opacity: 0, x: -30 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: 0.6 }}
                    whileHover={{ x: 5, scale: 1.02 }}
                  >
                    <div className="flex items-center gap-3">
                      <motion.div
                        className="w-8 h-8 rounded-full bg-green-500/20 flex items-center justify-center"
                        animate={{ scale: [1, 1.1, 1] }}
                        transition={{ duration: 2, repeat: Infinity }}
                      >
                        <Check className="w-4 h-4 text-green-400" />
                      </motion.div>
                      <div>
                        <p className="text-sm font-medium">Table #5 - Ready</p>
                        <p className="text-xs text-cream/60">Customer arriving in 5 min</p>
                      </div>
                    </div>
                    <span className="text-xs bg-green-500/20 text-green-400 px-2 py-1 rounded">Prepared</span>
                  </motion.div>

                  <motion.div
                    className="flex items-center justify-between bg-cream/5 rounded-lg p-3"
                    initial={{ opacity: 0, x: -30 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: 0.7 }}
                    whileHover={{ x: 5, scale: 1.02 }}
                  >
                    <div className="flex items-center gap-3">
                      <motion.div
                        className="w-8 h-8 rounded-full bg-yellow-500/20 flex items-center justify-center"
                        animate={{ rotate: [0, 10, -10, 0] }}
                        transition={{ duration: 2, repeat: Infinity }}
                      >
                        <Clock className="w-4 h-4 text-yellow-400" />
                      </motion.div>
                      <div>
                        <p className="text-sm font-medium">Table #12 - Preparing</p>
                        <p className="text-xs text-cream/60">ETA: 18 minutes</p>
                      </div>
                    </div>
                    <span className="text-xs bg-yellow-500/20 text-yellow-400 px-2 py-1 rounded">In Progress</span>
                  </motion.div>
                </div>
              </div>
            </motion.div>
          </AnimateOnScroll>
        </div>
      </div>
    </section>
  )
}
