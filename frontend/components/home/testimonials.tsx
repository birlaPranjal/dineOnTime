import { Star, Quote } from "lucide-react"

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
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-navy mb-4">What Our Users Say</h2>
          <p className="text-muted-foreground text-lg">Join thousands of happy diners and restaurant partners</p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div key={index} className="bg-card rounded-2xl p-8 border border-border hover:shadow-lg transition-shadow">
              <Quote className="w-10 h-10 text-primary/20 mb-4" />
              <div className="flex gap-1 mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 text-primary fill-primary" />
                ))}
              </div>
              <p className="text-foreground mb-6 leading-relaxed">{`"${testimonial.quote}"`}</p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <span className="text-sm font-semibold text-primary">{testimonial.author[0]}</span>
                </div>
                <div>
                  <p className="font-semibold text-navy">{testimonial.author}</p>
                  <p className="text-sm text-muted-foreground">{testimonial.location}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
