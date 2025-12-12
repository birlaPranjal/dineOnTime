"use client"

import { useEffect, useRef, useState } from "react"
import { motion, useInView } from "framer-motion"
import { StaggerChildren, StaggerItem } from "@/components/ui/animate-on-scroll"

const stats = [
  { value: "70%", label: "Reduced wait time", numeric: 70 },
  { value: "2x", label: "Table turnover increase", numeric: 2 },
  { value: "95%", label: "Customer satisfaction", numeric: 95 },
  { value: "500+", label: "Restaurant partners", numeric: 500 },
]

function Counter({ value, suffix = "" }: { value: number; suffix?: string }) {
  const [count, setCount] = useState(0)
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true })

  useEffect(() => {
    if (isInView) {
      const duration = 2000
      const steps = 60
      const increment = value / steps
      const stepDuration = duration / steps

      let current = 0
      const timer = setInterval(() => {
        current += increment
        if (current >= value) {
          setCount(value)
          clearInterval(timer)
        } else {
          setCount(Math.floor(current))
        }
      }, stepDuration)

      return () => clearInterval(timer)
    }
  }, [isInView, value])

  return (
    <span ref={ref}>
      {Math.floor(count)}
      {suffix}
    </span>
  )
}

export function StatsSection() {
  return (
    <section className="py-16 bg-card border-y border-border">
      <div className="container mx-auto px-4">
        <StaggerChildren className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <StaggerItem key={index}>
              <motion.div
                className="text-center"
                whileHover={{ scale: 1.1, y: -5 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <motion.p
                  className="text-4xl md:text-5xl font-bold text-primary mb-2"
                  initial={{ opacity: 0, scale: 0.5 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  {stat.value.includes("%") ? (
                    <>
                      <Counter value={stat.numeric} />%
                    </>
                  ) : stat.value.includes("x") ? (
                    <>
                      <Counter value={stat.numeric} />x
                    </>
                  ) : stat.value.includes("+") ? (
                    <>
                      <Counter value={stat.numeric} />+
                    </>
                  ) : (
                    stat.value
                  )}
                </motion.p>
                <motion.p
                  className="text-muted-foreground"
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 + 0.2 }}
                >
                  {stat.label}
                </motion.p>
              </motion.div>
            </StaggerItem>
          ))}
        </StaggerChildren>
      </div>
    </section>
  )
}
