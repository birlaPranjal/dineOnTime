"use client"

import { Shield, Lock, CheckCircle } from "lucide-react"
import { motion } from "framer-motion"
import { StaggerChildren, StaggerItem } from "@/components/ui/animate-on-scroll"

const securityItems = [
  {
    icon: Shield,
    title: "Secure & Reliable",
    description: "Industry-grade security",
  },
  {
    icon: Lock,
    title: "Encrypted Payments",
    description: "Your data is protected",
  },
  {
    icon: CheckCircle,
    title: "Verified Partners",
    description: "Trusted restaurants only",
  },
]

export function SecuritySection() {
  return (
    <section className="py-16 bg-cream border-y border-border">
      <div className="container mx-auto px-4">
        <StaggerChildren className="flex flex-col md:flex-row items-center justify-center gap-8 md:gap-16">
          {securityItems.map((item, index) => (
            <StaggerItem key={index}>
              <motion.div
                className="flex items-center gap-4"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ scale: 1.1, y: -5 }}
              >
                <motion.div
                  animate={{ rotate: [0, 10, -10, 0] }}
                  transition={{ duration: 3, repeat: Infinity, delay: index * 0.5 }}
                >
                  <item.icon className="w-10 h-10 text-primary" />
                </motion.div>
            <div>
                  <p className="font-semibold text-navy">{item.title}</p>
                  <p className="text-sm text-muted-foreground">{item.description}</p>
            </div>
              </motion.div>
            </StaggerItem>
          ))}
        </StaggerChildren>
      </div>
    </section>
  )
}
