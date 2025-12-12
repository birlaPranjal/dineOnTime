import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { HeroSection } from "@/components/home/hero-section"
import { HowItWorks } from "@/components/home/how-it-works"
import { FeaturesSection } from "@/components/home/features-section"
import { ForRestaurants } from "@/components/home/for-restaurants"
import { StatsSection } from "@/components/home/stats-section"
import { Testimonials } from "@/components/home/testimonials"
import { AppPreview } from "@/components/home/app-preview"
import { SecuritySection } from "@/components/home/security-section"
import { BenefitsSection } from "@/components/home/benefits-section"
import { PricingSection } from "@/components/home/pricing-section"
import { FAQSection } from "@/components/home/faq-section"

export default function HomePage() {
  return (
    <div className="min-h-screen">
      <Header />
      <main>
        <HeroSection />
        <StatsSection />
        <HowItWorks />
        <FeaturesSection />
        <BenefitsSection />
        <ForRestaurants />
        <Testimonials />
        <AppPreview />
        <PricingSection />
        <SecuritySection />
        <FAQSection />
      </main>
      <Footer />
    </div>
  )
}
