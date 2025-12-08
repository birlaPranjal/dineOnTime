import { Shield, Lock, CheckCircle } from "lucide-react"

export function SecuritySection() {
  return (
    <section className="py-16 bg-cream border-y border-border">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center justify-center gap-8 md:gap-16">
          <div className="flex items-center gap-4">
            <Shield className="w-10 h-10 text-primary" />
            <div>
              <p className="font-semibold text-navy">Secure & Reliable</p>
              <p className="text-sm text-muted-foreground">Industry-grade security</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <Lock className="w-10 h-10 text-primary" />
            <div>
              <p className="font-semibold text-navy">Encrypted Payments</p>
              <p className="text-sm text-muted-foreground">Your data is protected</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <CheckCircle className="w-10 h-10 text-primary" />
            <div>
              <p className="font-semibold text-navy">Verified Partners</p>
              <p className="text-sm text-muted-foreground">Trusted restaurants only</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
