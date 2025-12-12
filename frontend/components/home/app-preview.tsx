"use client"

import { Smartphone, Download } from "lucide-react"
import Link from "next/link"
import { motion } from "framer-motion"
import { AnimateOnScroll } from "@/components/ui/animate-on-scroll"

export function AppPreview() {
  return (
    <section className="py-20 lg:py-28 bg-card">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <AnimateOnScroll direction="right" className="order-2 lg:order-1">
            <div className="relative flex justify-center">
              <motion.div
                className="relative"
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
              >
                <motion.div
                  className="w-64 h-[500px] bg-navy rounded-[3rem] p-3 shadow-2xl"
                  initial={{ opacity: 0, y: 50, rotateY: -30 }}
                  whileInView={{ opacity: 1, y: 0, rotateY: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8, delay: 0.2 }}
                  whileHover={{ y: -10, rotateY: 5 }}
                >
                  <motion.div
                    className="w-full h-full bg-cream rounded-[2.5rem] overflow-hidden"
                    animate={{ y: [0, -10, 0] }}
                    transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                  >
                    <img
                      src="/restaurant-booking-app-interface-with-food-menu-an.jpg"
                      alt="DineOnTime App Preview"
                      className="w-full h-full object-cover"
                    />
                  </motion.div>
                </motion.div>
                <motion.div
                  className="absolute -right-8 top-20 w-48 h-[400px] bg-navy rounded-[2.5rem] p-2 shadow-xl rotate-6"
                  initial={{ opacity: 0, x: 50, rotate: 6 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8, delay: 0.4 }}
                  whileHover={{ rotate: 12, scale: 1.05 }}
                >
                  <motion.div
                    className="w-full h-full bg-cream rounded-[2rem] overflow-hidden"
                    animate={{ y: [0, -15, 0] }}
                    transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                  >
                    <img
                      src="/food-ordering-confirmation-screen-with-eta-trackin.jpg"
                      alt="DineOnTime Order Tracking"
                      className="w-full h-full object-cover"
                    />
                  </motion.div>
                </motion.div>
              </motion.div>
            </div>
          </AnimateOnScroll>

          <AnimateOnScroll direction="left" className="order-1 lg:order-2 space-y-8">
            <motion.h2
              className="text-3xl md:text-4xl font-bold text-navy leading-tight"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              Experience dining made effortless — anywhere, anytime.
            </motion.h2>
            <motion.p
              className="text-muted-foreground text-lg leading-relaxed"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              Download our app and start enjoying hassle-free dining. Book tables, pre-order meals, and never wait in
              line again.
            </motion.p>

            <div className="space-y-4">
              <motion.div
                className="flex items-center gap-3"
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.4 }}
                whileHover={{ x: 10 }}
              >
                <motion.div
                  className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center"
                  whileHover={{ rotate: 360, scale: 1.1 }}
                  transition={{ duration: 0.5 }}
                >
                  <Smartphone className="w-5 h-5 text-primary" />
                </motion.div>
                <span className="text-foreground">Available on iOS and Android</span>
              </motion.div>
              <motion.div
                className="flex items-center gap-3"
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.5 }}
                whileHover={{ x: 10 }}
              >
                <motion.div
                  className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center"
                  whileHover={{ rotate: 360, scale: 1.1 }}
                  transition={{ duration: 0.5 }}
                >
                  <Download className="w-5 h-5 text-primary" />
                </motion.div>
                <span className="text-foreground">Free to download and use</span>
              </motion.div>
            </div>

            <motion.div
              className="flex flex-col sm:flex-row gap-4"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.6 }}
            >
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link href="#" className="inline-block">
                <img src="/download-on-app-store-black-badge.jpg" alt="Download on App Store" className="h-12" />
              </Link>
              </motion.div>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link href="#" className="inline-block">
                <img src="/get-it-on-google-play-black-badge.jpg" alt="Get it on Google Play" className="h-12" />
              </Link>
              </motion.div>
            </motion.div>
          </AnimateOnScroll>
        </div>
      </div>
    </section>
  )
}
