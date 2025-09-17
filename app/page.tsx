"use client"

import { Header } from "@/components/header"
import { HeroSection } from "@/components/hero-section"
import { FeaturesGrid } from "@/components/features-grid"
import { Footer } from "@/components/footer"

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main id="main-content" className="flex-1" role="main">
        <HeroSection />
        <FeaturesGrid />

        {/* About Section Placeholder */}
        <section id="about" className="py-20 bg-background">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl font-bold text-foreground mb-4">About AccessibilityHub</h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto text-pretty leading-relaxed">
              We believe that technology should be accessible to everyone, regardless of their abilities. Our platform
              is built by accessibility experts and the community to ensure real-world usability and impact.
            </p>
          </div>
        </section>

        {/* Support Section Placeholder */}
        <section id="support" className="py-20 bg-muted/30">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl font-bold text-foreground mb-4">Get Support</h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto text-pretty leading-relaxed mb-8">
              Our dedicated support team is here to help you make the most of AccessibilityHub. Get assistance, report
              issues, or request new features.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="mailto:support@accessibilityhub.com"
                className="inline-flex items-center justify-center px-6 py-3 bg-accent text-accent-foreground hover:bg-accent/90 rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
              >
                Email Support
              </a>
              <a
                href="tel:+1-800-ACCESS"
                className="inline-flex items-center justify-center px-6 py-3 border border-accent text-accent hover:bg-accent hover:text-accent-foreground rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
              >
                Call Support
              </a>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
