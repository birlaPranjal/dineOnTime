import { Smartphone, Download } from "lucide-react"
import Link from "next/link"

export function AppPreview() {
  return (
    <section className="py-20 lg:py-28 bg-card">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="order-2 lg:order-1">
            <div className="relative flex justify-center">
              <div className="relative">
                <div className="w-64 h-[500px] bg-navy rounded-[3rem] p-3 shadow-2xl">
                  <div className="w-full h-full bg-cream rounded-[2.5rem] overflow-hidden">
                    <img
                      src="/restaurant-booking-app-interface-with-food-menu-an.jpg"
                      alt="DineOnTime App Preview"
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
                <div className="absolute -right-8 top-20 w-48 h-[400px] bg-navy rounded-[2.5rem] p-2 shadow-xl rotate-6">
                  <div className="w-full h-full bg-cream rounded-[2rem] overflow-hidden">
                    <img
                      src="/food-ordering-confirmation-screen-with-eta-trackin.jpg"
                      alt="DineOnTime Order Tracking"
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="order-1 lg:order-2 space-y-8">
            <h2 className="text-3xl md:text-4xl font-bold text-navy leading-tight">
              Experience dining made effortless — anywhere, anytime.
            </h2>
            <p className="text-muted-foreground text-lg leading-relaxed">
              Download our app and start enjoying hassle-free dining. Book tables, pre-order meals, and never wait in
              line again.
            </p>

            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <Smartphone className="w-5 h-5 text-primary" />
                </div>
                <span className="text-foreground">Available on iOS and Android</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <Download className="w-5 h-5 text-primary" />
                </div>
                <span className="text-foreground">Free to download and use</span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="#" className="inline-block">
                <img src="/download-on-app-store-black-badge.jpg" alt="Download on App Store" className="h-12" />
              </Link>
              <Link href="#" className="inline-block">
                <img src="/get-it-on-google-play-black-badge.jpg" alt="Get it on Google Play" className="h-12" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
