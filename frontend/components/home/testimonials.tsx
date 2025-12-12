"use client"

import { Star, Quote } from "lucide-react"
import { motion } from "framer-motion"
import { AnimateOnScroll, StaggerChildren, StaggerItem } from "@/components/ui/animate-on-scroll"

const testimonials = [
  {
    quote: "Pre-ordering saved us so much time! The food was served within minutes of arriving.",
    author: "Aditi",
    location: "Bangalore",
    rating: 5,
    type: "diner",
  },
  {
    quote: "Our restaurant saw faster table rotation and happier customers. The ETA feature is a game-changer.",
    author: "The Spice Room Restaurant",
    location: "Mumbai",
    rating: 5,
    type: "restaurant",
  },
  {
    quote: "No more waiting in queues. I can now plan my meals perfectly around my schedule.",
    author: "Rahul Sharma",
    location: "Delhi",
    rating: 5,
    type: "diner",
  },
]

export function Testimonials() {
  return (
    <section className="py-20 lg:py-28 bg-cream">
      <div className="container mx-auto px-4">
        <AnimateOnScroll direction="fade" className="text-center max-w-2xl mx-auto mb-16">
          <motion.h2
            className="text-3xl md:text-4xl font-bold text-navy mb-4"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            What Our Users Say
          </motion.h2>
          <motion.p
            className="text-muted-foreground text-lg"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            Join thousands of happy diners and restaurant partners
          </motion.p>
        </AnimateOnScroll>

        <StaggerChildren className="grid md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <StaggerItem key={index}>
              <motion.div
                className="bg-card rounded-2xl p-8 border border-border hover:shadow-lg transition-shadow relative overflow-hidden group"
                initial={{ opacity: 0, y: 50, rotateY: -15 }}
                whileInView={{ opacity: 1, y: 0, rotateY: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.15 }}
                whileHover={{ y: -10, scale: 1.02, rotateY: 5 }}
              >
                <motion.div
                  className="absolute top-0 left-0 w-full h-1 bg-primary origin-left"
                  initial={{ scaleX: 0 }}
                  whileInView={{ scaleX: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8, delay: index * 0.15 + 0.3 }}
                />
                <motion.div
                  initial={{ opacity: 0, scale: 0.5, rotate: -180 }}
                  whileInView={{ opacity: 1, scale: 1, rotate: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.15 + 0.2 }}
                >
                  <Quote className="w-10 h-10 text-primary/20 mb-4" />
                </motion.div>
                <motion.div
                  className="flex gap-1 mb-4"
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.15 + 0.4 }}
                >
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, scale: 0 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.3, delay: index * 0.15 + 0.5 + i * 0.1 }}
                      whileHover={{ scale: 1.2, rotate: 360 }}
                    >
                      <Star className="w-4 h-4 text-primary fill-primary" />
                    </motion.div>
                  ))}
                </motion.div>
                <motion.p
                  className="text-foreground mb-6 leading-relaxed"
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.15 + 0.6 }}
                >
                  {`"${testimonial.quote}"`}
                </motion.p>
                <motion.div
                  className="flex items-center gap-3"
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.15 + 0.8 }}
                >
                  <motion.div
                    className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center"
                    whileHover={{ scale: 1.2, rotate: 360 }}
                    transition={{ duration: 0.5 }}
                  >
                    <span className="text-sm font-semibold text-primary">{testimonial.author[0]}</span>
                  </motion.div>
                  <div>
                    <p className="font-semibold text-navy">{testimonial.author}</p>
                    <p className="text-sm text-muted-foreground">{testimonial.location}</p>
                  </div>
                </motion.div>
              </motion.div>
            </StaggerItem>
          ))}
        </StaggerChildren>
      </div>
    </section>
  )
}
