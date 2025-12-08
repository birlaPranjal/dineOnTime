import Link from "next/link"
import { Clock, Mail, Phone, MapPin } from "lucide-react"

export function Footer() {
  return (
    <footer className="bg-navy text-cream">
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-primary">
                <Clock className="h-5 w-5 text-primary-foreground" />
              </div>
              <span className="text-xl font-bold">DineOnTime</span>
            </div>
            <p className="text-cream/70 text-sm leading-relaxed">
              Smart Dining Starts Here. Pre-order your meal, book your table, and arrive exactly when your food is
              ready.
            </p>
          </div>

          <div className="space-y-4">
            <h4 className="font-semibold">Company</h4>
            <nav className="flex flex-col gap-3">
              <Link href="/about" className="text-sm text-cream/70 hover:text-cream transition-colors">
                About Us
              </Link>
              <Link href="/for-restaurants" className="text-sm text-cream/70 hover:text-cream transition-colors">
                Partner With Us
              </Link>
              <Link href="/careers" className="text-sm text-cream/70 hover:text-cream transition-colors">
                Careers
              </Link>
              <Link href="/blog" className="text-sm text-cream/70 hover:text-cream transition-colors">
                Blog
              </Link>
            </nav>
          </div>

          <div className="space-y-4">
            <h4 className="font-semibold">Support</h4>
            <nav className="flex flex-col gap-3">
              <Link href="/help" className="text-sm text-cream/70 hover:text-cream transition-colors">
                Help & Support
              </Link>
              <Link href="/terms" className="text-sm text-cream/70 hover:text-cream transition-colors">
                Terms & Conditions
              </Link>
              <Link href="/privacy" className="text-sm text-cream/70 hover:text-cream transition-colors">
                Privacy Policy
              </Link>
              <Link href="/faq" className="text-sm text-cream/70 hover:text-cream transition-colors">
                FAQ
              </Link>
            </nav>
          </div>

          <div className="space-y-4">
            <h4 className="font-semibold">Contact</h4>
            <div className="flex flex-col gap-3">
              <a
                href="mailto:support@dineontime.com"
                className="flex items-center gap-2 text-sm text-cream/70 hover:text-cream transition-colors"
              >
                <Mail className="h-4 w-4" />
                support@dineontime.com
              </a>
              <a
                href="tel:+911234567890"
                className="flex items-center gap-2 text-sm text-cream/70 hover:text-cream transition-colors"
              >
                <Phone className="h-4 w-4" />
                +91 123 456 7890
              </a>
              <div className="flex items-start gap-2 text-sm text-cream/70">
                <MapPin className="h-4 w-4 mt-0.5 shrink-0" />
                <span>Bangalore, India</span>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-cream/20 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-cream/60">© {new Date().getFullYear()} DineOnTime. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <Link href="#" className="text-cream/60 hover:text-cream transition-colors">
              <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z" />
              </svg>
            </Link>
            <Link href="#" className="text-cream/60 hover:text-cream transition-colors">
              <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.162-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.957 1.406-5.957s-.359-.72-.359-1.781c0-1.663.967-2.911 2.168-2.911 1.024 0 1.518.769 1.518 1.688 0 1.029-.653 2.567-.992 3.992-.285 1.193.6 2.165 1.775 2.165 2.128 0 3.768-2.245 3.768-5.487 0-2.861-2.063-4.869-5.008-4.869-3.41 0-5.409 2.562-5.409 5.199 0 1.033.394 2.143.889 2.741.099.12.112.225.085.345-.09.375-.293 1.199-.334 1.363-.053.225-.172.271-.401.165-1.495-.69-2.433-2.878-2.433-4.646 0-3.776 2.748-7.252 7.92-7.252 4.158 0 7.392 2.967 7.392 6.923 0 4.135-2.607 7.462-6.233 7.462-1.214 0-2.354-.629-2.758-1.379l-.749 2.848c-.269 1.045-1.004 2.352-1.498 3.146 1.123.345 2.306.535 3.55.535 6.607 0 11.985-5.365 11.985-11.987C23.97 5.39 18.592.026 11.985.026L12.017 0z" />
              </svg>
            </Link>
            <Link href="#" className="text-cream/60 hover:text-cream transition-colors">
              <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
              </svg>
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
