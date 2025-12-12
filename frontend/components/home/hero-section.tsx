"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Star, Users, MapPin } from "lucide-react"
import { motion } from "framer-motion"
import { AnimateOnScroll } from "@/components/ui/animate-on-scroll"

export function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-cream">
      <motion.div
        className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-primary/5 via-transparent to-transparent"
        animate={{
          scale: [1, 1.1, 1],
          opacity: [0.3, 0.5, 0.3],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      <div className="container mx-auto px-4 py-20 lg:py-32">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            <AnimateOnScroll delay={0.1} direction="down">
              <motion.div
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-card border border-border"
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <motion.div
                  animate={{ rotate: [0, 10, -10, 0] }}
                  transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
                >
              <Star className="h-4 w-4 text-primary fill-primary" />
                </motion.div>
              <span className="text-sm font-medium text-foreground">Trusted by 50,000+ diners</span>
              </motion.div>
            </AnimateOnScroll>

            <AnimateOnScroll delay={0.2} direction="up">
              <motion.h1
                className="text-4xl md:text-5xl lg:text-6xl font-bold text-navy leading-tight text-balance"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.3 }}
              >
                Smart Pre-Order & Table Booking for a{" "}
                <motion.span
                  className="text-primary inline-block"
                  animate={{
                    scale: [1, 1.05, 1],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                >
                  Faster Dining
                </motion.span>{" "}
                Experience
              </motion.h1>
            </AnimateOnScroll>

            <AnimateOnScroll delay={0.4} direction="up">
            <p className="text-lg text-muted-foreground max-w-xl leading-relaxed">
                Skip the wait. Pre-order your meal, book your table, and arrive exactly when your food is ready — all
                in one seamless platform.
            </p>
            </AnimateOnScroll>

            <AnimateOnScroll delay={0.5} direction="up">
            <div className="flex flex-col sm:flex-row gap-4">
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button size="lg" className="text-base px-8" asChild>
                <Link href="/restaurants">Book a Table</Link>
              </Button>
                </motion.div>
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                size="lg"
                variant="outline"
                className="text-base px-8 border-navy text-navy hover:bg-navy hover:text-cream bg-transparent"
                asChild
              >
                <Link href="/restaurants">Pre-Order Now</Link>
              </Button>
                </motion.div>
              </div>
            </AnimateOnScroll>

            <AnimateOnScroll delay={0.6} direction="up">
              <motion.div
                className="flex items-center gap-6 pt-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8 }}
              >
                {[
                  { icon: Users, text: "Loved by diners" },
                  { icon: Star, text: "Trusted by restaurants", filled: true },
                  { icon: MapPin, text: "Real-time ETA" },
                ].map((item, index) => (
                  <motion.div
                    key={index}
                    className="flex items-center gap-2"
                    whileHover={{ scale: 1.1, x: 5 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    {item.filled ? (
                <Star className="h-5 w-5 text-primary fill-primary" />
                    ) : (
                      <item.icon className="h-5 w-5 text-primary" />
                    )}
                    <span className="text-sm text-muted-foreground">{item.text}</span>
                  </motion.div>
                ))}
              </motion.div>
            </AnimateOnScroll>
          </div>

          <AnimateOnScroll delay={0.3} direction="left" className="relative">
            <motion.div
              className="relative z-10 rounded-2xl overflow-hidden shadow-2xl"
              whileHover={{ scale: 1.02 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <motion.img
                src="/elegant-restaurant-interior-with-warm-lighting-and.jpg"
                alt="Elegant restaurant interior"
                className="w-full h-auto object-cover"
                initial={{ scale: 1.1 }}
                animate={{ scale: 1 }}
                transition={{ duration: 1.5, ease: "easeOut" }}
              />
            </motion.div>
            <motion.div
              className="absolute -bottom-4 -left-4 z-20 bg-card rounded-xl p-4 shadow-xl border border-border"
              initial={{ opacity: 0, x: -20, y: 20 }}
              animate={{ opacity: 1, x: 0, y: 0 }}
              transition={{ delay: 1, type: "spring", stiffness: 200 }}
              whileHover={{ scale: 1.05, rotate: 2 }}
            >
              <div className="flex items-center gap-3">
                <motion.div
                  className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center"
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <svg className="w-6 h-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </motion.div>
                <div>
                  <p className="font-semibold text-foreground">Table Reserved!</p>
                  <p className="text-sm text-muted-foreground">Your meal is being prepared</p>
                </div>
              </div>
            </motion.div>
            <motion.div
              className="absolute -top-4 -right-4 z-20 bg-card rounded-xl p-4 shadow-xl border border-border"
              initial={{ opacity: 0, x: 20, y: -20 }}
              animate={{ opacity: 1, x: 0, y: 0 }}
              transition={{ delay: 1.2, type: "spring", stiffness: 200 }}
              whileHover={{ scale: 1.05, rotate: -2 }}
            >
              <div className="flex items-center gap-3">
                <motion.div
                  className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center"
                  animate={{ rotate: [0, 360] }}
                  transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                >
                  <MapPin className="w-6 h-6 text-primary" />
                </motion.div>
                <div>
                  <motion.p
                    className="font-semibold text-foreground"
                    animate={{ opacity: [1, 0.5, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    ETA: 12 min
                  </motion.p>
                  <p className="text-sm text-muted-foreground">Kitchen notified</p>
                </div>
              </div>
            </motion.div>
          </AnimateOnScroll>
        </div>
      </div>
    </section>
  )
}
