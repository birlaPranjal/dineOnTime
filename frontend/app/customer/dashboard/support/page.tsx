"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { HelpCircle, MessageSquare, Phone, Mail, FileText, Send } from "lucide-react"
import { toast } from "sonner"

const faqs = [
  {
    question: "How do I cancel my booking?",
    answer:
      "You can cancel your booking from the My Bookings section in your dashboard. Select the booking you want to cancel and click on 'Cancel Booking'. Please note that cancellation policies may vary by restaurant.",
  },
  {
    question: "How does pre-ordering work?",
    answer:
      "When booking a table, you can choose to pre-order your meal. Browse the restaurant's menu, select your items, and complete the payment. Your food will be prepared to arrive just as you reach the restaurant.",
  },
  {
    question: "What if I'm running late for my booking?",
    answer:
      "DineOnTime tracks your ETA automatically. The restaurant will be notified of any delays. If you're significantly delayed, consider modifying your booking time through the app.",
  },
  {
    question: "How do refunds work?",
    answer:
      "Refunds are processed within 5-7 business days to your original payment method. For pre-ordered meals that weren't served, you'll receive a full refund.",
  },
  {
    question: "Can I modify my pre-order after placing it?",
    answer:
      "You can modify your pre-order up to 2 hours before your booking time. Go to My Bookings, select the booking, and click 'Modify Pre-order'.",
  },
]

const supportTickets = [
  {
    id: "TKT-001",
    subject: "Refund not received",
    status: "in-progress",
    date: "Dec 15, 2024",
    lastUpdate: "Dec 16, 2024",
  },
  {
    id: "TKT-002",
    subject: "Wrong order delivered",
    status: "resolved",
    date: "Dec 10, 2024",
    lastUpdate: "Dec 12, 2024",
  },
]

const statusColors: Record<string, string> = {
  open: "bg-yellow-100 text-yellow-700",
  "in-progress": "bg-blue-100 text-blue-700",
  resolved: "bg-green-100 text-green-700",
}

export default function CustomerSupportPage() {
  const [subject, setSubject] = useState("")
  const [category, setCategory] = useState("")
  const [message, setMessage] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    toast.success("Support ticket created successfully!")
    setSubject("")
    setCategory("")
    setMessage("")
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-navy">Help & Support</h2>
        <p className="text-muted-foreground">Get help with your orders, bookings, and more</p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card className="cursor-pointer hover:border-primary transition-colors">
          <CardContent className="p-6 text-center">
            <Phone className="h-8 w-8 mx-auto mb-3 text-primary" />
            <h3 className="font-semibold text-navy">Call Us</h3>
            <p className="text-sm text-muted-foreground mt-1">1800-123-4567</p>
            <p className="text-xs text-muted-foreground">Mon-Sat, 9AM-9PM</p>
          </CardContent>
        </Card>
        <Card className="cursor-pointer hover:border-primary transition-colors">
          <CardContent className="p-6 text-center">
            <Mail className="h-8 w-8 mx-auto mb-3 text-primary" />
            <h3 className="font-semibold text-navy">Email Us</h3>
            <p className="text-sm text-muted-foreground mt-1">support@dineontime.com</p>
            <p className="text-xs text-muted-foreground">Response within 24hrs</p>
          </CardContent>
        </Card>
        <Card className="cursor-pointer hover:border-primary transition-colors">
          <CardContent className="p-6 text-center">
            <MessageSquare className="h-8 w-8 mx-auto mb-3 text-primary" />
            <h3 className="font-semibold text-navy">Live Chat</h3>
            <p className="text-sm text-muted-foreground mt-1">Chat with our team</p>
            <p className="text-xs text-muted-foreground">Available 24/7</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <HelpCircle className="h-5 w-5" />
              Frequently Asked Questions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Accordion type="single" collapsible className="w-full">
              {faqs.map((faq, index) => (
                <AccordionItem key={index} value={`item-${index}`}>
                  <AccordionTrigger className="text-left">{faq.question}</AccordionTrigger>
                  <AccordionContent className="text-muted-foreground">{faq.answer}</AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Submit a Ticket
            </CardTitle>
            <CardDescription>Can not find what you are looking for? Create a support ticket.</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label>Category</Label>
                <Select value={category} onValueChange={setCategory}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="order">Order Issue</SelectItem>
                    <SelectItem value="booking">Booking Issue</SelectItem>
                    <SelectItem value="payment">Payment Issue</SelectItem>
                    <SelectItem value="refund">Refund Request</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Subject</Label>
                <Input
                  placeholder="Brief description of your issue"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label>Message</Label>
                <Textarea
                  placeholder="Describe your issue in detail..."
                  rows={4}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                />
              </div>
              <Button type="submit" className="w-full">
                <Send className="h-4 w-4 mr-2" />
                Submit Ticket
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Your Support Tickets</CardTitle>
        </CardHeader>
        <CardContent>
          {supportTickets.length > 0 ? (
            <div className="space-y-3">
              {supportTickets.map((ticket) => (
                <div key={ticket.id} className="flex items-center justify-between p-4 rounded-lg border">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-navy">{ticket.id}</span>
                      <Badge className={statusColors[ticket.status]} variant="secondary">
                        {ticket.status.replace("-", " ")}
                      </Badge>
                    </div>
                    <p className="text-sm">{ticket.subject}</p>
                    <p className="text-xs text-muted-foreground">
                      Created: {ticket.date} • Last update: {ticket.lastUpdate}
                    </p>
                  </div>
                  <Button variant="outline" size="sm" className="bg-transparent">
                    View Details
                  </Button>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center text-muted-foreground py-8">No support tickets yet</p>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
