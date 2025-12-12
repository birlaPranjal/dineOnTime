"use client"

import { useState } from "react"
import { ChevronDown } from "lucide-react"
import { cn } from "@/lib/utils"

const faqs = [
  {
    question: "How does pre-ordering work?",
    answer:
      "Simply browse the restaurant's menu, select your dishes, customize them to your preference, and complete the payment. Your order is sent to the kitchen, and they'll start preparing it based on your ETA. When you arrive, your food is ready!",
  },
  {
    question: "Can I cancel or modify my booking?",
    answer:
      "Yes! You can cancel or modify your booking up to 2 hours before your reservation time. For pre-orders, modifications are allowed until the kitchen starts preparing your meal. Check your booking details for specific cancellation policies.",
  },
  {
    question: "How accurate is the ETA tracking?",
    answer:
      "Our ETA tracking uses real-time location data from Google Maps to calculate your arrival time. Restaurants receive live updates, so they can time your meal preparation perfectly. The system accounts for traffic and route changes automatically.",
  },
  {
    question: "What payment methods are accepted?",
    answer:
      "We accept all major payment methods including UPI, credit/debit cards, digital wallets, and cash on arrival. You can choose your preferred payment method during checkout.",
  },
  {
    question: "Is there a booking fee?",
    answer:
      "No, table bookings are completely free! You only pay for your meal. Some restaurants may have a minimum order requirement for pre-orders, which will be clearly displayed.",
  },
  {
    question: "Can I book for large groups?",
    answer:
      "Absolutely! You can book tables for any group size. For parties of 8 or more, we recommend booking at least 24 hours in advance to ensure availability. Contact the restaurant directly for special arrangements.",
  },
]

export function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0)

  return (
    <section className="py-20 lg:py-28 bg-card">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="inline-block text-sm font-semibold text-primary mb-4 uppercase tracking-wider">
            FAQ
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-navy mb-4">Frequently Asked Questions</h2>
          <p className="text-muted-foreground text-lg">Everything you need to know about DineOnTime</p>
        </div>

        <div className="max-w-3xl mx-auto space-y-4">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="bg-cream rounded-xl border border-border overflow-hidden transition-all duration-300 hover:border-primary/30"
            >
              <button
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className="w-full px-6 py-5 flex items-center justify-between text-left group"
              >
                <h3 className="text-lg font-semibold text-navy pr-4 group-hover:text-primary transition-colors">
                  {faq.question}
                </h3>
                <ChevronDown
                  className={cn(
                    "w-5 h-5 text-muted-foreground flex-shrink-0 transition-transform duration-300",
                    openIndex === index && "transform rotate-180 text-primary"
                  )}
                />
              </button>
              <div
                className={cn(
                  "overflow-hidden transition-all duration-300",
                  openIndex === index ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
                )}
              >
                <div className="px-6 pb-5">
                  <p className="text-muted-foreground leading-relaxed">{faq.answer}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

