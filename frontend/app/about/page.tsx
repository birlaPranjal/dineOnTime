import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Clock, Users, Target, Award, ArrowRight } from "lucide-react"

const team = [
  {
    name: "Ananya Sharma",
    role: "Co-Founder & CEO",
    image: "/professional-indian-woman-headshot.png",
  },
  {
    name: "Vikram Patel",
    role: "Co-Founder & CTO",
    image: "/professional-indian-man-headshot.jpg",
  },
  {
    name: "Priya Menon",
    role: "Head of Operations",
    image: "/avatar-1.png",
  },
  {
    name: "Arjun Kumar",
    role: "Head of Product",
    image: "/professional-man-headshot-casual.jpg",
  },
]

const values = [
  {
    icon: Clock,
    title: "Time is Precious",
    description: "We believe every minute saved from waiting is a minute gained for enjoying.",
  },
  {
    icon: Users,
    title: "Community First",
    description: "We build for diners and restaurants alike, creating value for the entire ecosystem.",
  },
  {
    icon: Target,
    title: "Innovation Driven",
    description: "We constantly push boundaries to make dining experiences better and smarter.",
  },
  {
    icon: Award,
    title: "Quality Obsessed",
    description: "We partner only with restaurants that meet our high standards of quality and service.",
  },
]

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-cream">
      <Header />

      <main>
        <section className="py-20 bg-navy text-cream">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center">
              <h1 className="text-4xl md:text-5xl font-bold mb-6">About DineOnTime</h1>
              <p className="text-xl text-cream/70 leading-relaxed">
                {
                  "We're on a mission to transform how people dine out. No more waiting, no more guessing — just perfect timing, every time."
                }
              </p>
            </div>
          </div>
        </section>

        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-3xl font-bold text-navy mb-6">Our Story</h2>
                <div className="space-y-4 text-muted-foreground leading-relaxed">
                  <p>
                    DineOnTime was born from a simple frustration: spending precious time waiting at restaurants when we
                    could be enjoying our meals with loved ones.
                  </p>
                  <p>
                    Founded in 2023 in Bangalore, we set out to solve the age-old problem of restaurant wait times. By
                    combining smart booking technology with real-time ETA tracking, we created a platform that benefits
                    both diners and restaurants.
                  </p>
                  <p>
                    {
                      "Today, we partner with over 500 restaurants across major cities in India, helping thousands of diners save time and enjoy better dining experiences every day."
                    }
                  </p>
                </div>
              </div>
              <div className="relative">
                <img
                  src="/happy-people-dining-at-restaurant.jpg"
                  alt="People enjoying a meal at a restaurant"
                  className="rounded-2xl shadow-xl"
                />
              </div>
            </div>
          </div>
        </section>

        <section className="py-20 bg-card">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold text-navy mb-4">Our Values</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                These principles guide everything we do at DineOnTime
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {values.map((value, index) => (
                <div key={index} className="text-center">
                  <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
                    <value.icon className="w-8 h-8 text-primary" />
                  </div>
                  <h3 className="text-lg font-semibold text-navy mb-2">{value.title}</h3>
                  <p className="text-sm text-muted-foreground">{value.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold text-navy mb-4">Meet Our Team</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">The passionate people behind DineOnTime</p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {team.map((member, index) => (
                <div key={index} className="text-center group">
                  <div className="relative mb-4 overflow-hidden rounded-xl">
                    <img
                      src={member.image || "/placeholder.svg"}
                      alt={member.name}
                      className="w-full aspect-square object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <h3 className="font-semibold text-navy">{member.name}</h3>
                  <p className="text-sm text-muted-foreground">{member.role}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-20 bg-primary">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold text-primary-foreground mb-4">
              Ready to Transform Your Dining Experience?
            </h2>
            <p className="text-primary-foreground/80 mb-8 max-w-2xl mx-auto">
              Join thousands of happy diners who never wait in line anymore.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" variant="secondary" asChild>
                <Link href="/restaurants" className="gap-2">
                  Browse Restaurants
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="bg-transparent border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary"
                asChild
              >
                <Link href="/for-restaurants">Partner With Us</Link>
              </Button>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
