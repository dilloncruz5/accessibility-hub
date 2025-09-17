"use client"

import { Button } from "@/components/ui/button"
import { useAccessibility } from "@/contexts/accessibility-context"
import { useSpeechSynthesis } from "@/hooks/use-speech-synthesis"
import { ArrowRight, Heart, Users, Zap } from "lucide-react"

export function HeroSection() {
  const { announce } = useAccessibility()
  const { speak, supported: ttsSupported } = useSpeechSynthesis()

  const handleGetStarted = () => {
    announce("Navigating to features section")
    document.getElementById("features")?.scrollIntoView({ behavior: "smooth" })
  }

  const handleLearnMore = () => {
    announce("Navigating to about section")
    document.getElementById("about")?.scrollIntoView({ behavior: "smooth" })
  }

  const speakWelcome = () => {
    const welcomeText =
      "Welcome to AccessibilityHub. Empowering digital inclusion for everyone. Breaking barriers, building bridges to a more accessible digital world."
    speak(welcomeText)
    announce("Reading welcome message aloud")
  }

  return (
    <section className="relative py-20 lg:py-32 overflow-hidden" aria-labelledby="hero-heading">
      {/* Background Pattern */}
      <div
        className="absolute inset-0 bg-gradient-to-br from-accent/5 via-transparent to-accent/10"
        aria-hidden="true"
      />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="max-w-4xl mx-auto text-center">
          {/* Main Heading */}
          <h1
            id="hero-heading"
            className="text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground mb-6 text-balance"
          >
            Empowering <span className="text-accent">Digital Inclusion</span> for Everyone
          </h1>

          {/* Subtitle */}
          <p className="text-xl sm:text-2xl text-muted-foreground mb-8 text-pretty max-w-3xl mx-auto leading-relaxed">
            Breaking barriers, building bridges to a more accessible digital world. Comprehensive tools for
            differently-abled individuals to navigate, communicate, and thrive online.
          </p>

          {/* Mission Statement */}
          <div className="bg-card border rounded-lg p-6 mb-8 max-w-2xl mx-auto">
            <p className="text-lg text-card-foreground text-pretty leading-relaxed">
              <strong>Our Mission:</strong> To create technology that adapts to you, not the other way around. Every
              person deserves equal access to digital experiences.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
            <Button
              size="lg"
              onClick={handleGetStarted}
              className="text-lg px-8 py-3 min-w-[200px]"
              aria-describedby="get-started-desc"
            >
              Get Started
              <ArrowRight className="ml-2 h-5 w-5" aria-hidden="true" />
            </Button>
            <span id="get-started-desc" className="sr-only">
              Navigate to features section to explore accessibility tools
            </span>

            <Button
              variant="outline"
              size="lg"
              onClick={handleLearnMore}
              className="text-lg px-8 py-3 min-w-[200px] bg-transparent"
              aria-describedby="learn-more-desc"
            >
              Learn More
            </Button>
            <span id="learn-more-desc" className="sr-only">
              Navigate to about section to learn more about our mission
            </span>

            {ttsSupported && (
              <Button
                variant="ghost"
                size="lg"
                onClick={speakWelcome}
                className="text-lg px-8 py-3"
                aria-label="Listen to welcome message using text-to-speech"
              >
                🔊 Listen
              </Button>
            )}
          </div>

          {/* Key Features Preview */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            <div className="flex flex-col items-center text-center p-4">
              <div className="h-12 w-12 rounded-full bg-accent/10 flex items-center justify-center mb-3">
                <Heart className="h-6 w-6 text-accent" aria-hidden="true" />
              </div>
              <h3 className="font-semibold text-foreground mb-2">Inclusive Design</h3>
              <p className="text-sm text-muted-foreground text-pretty">
                Built with WCAG 2.1 AA compliance and universal design principles
              </p>
            </div>

            <div className="flex flex-col items-center text-center p-4">
              <div className="h-12 w-12 rounded-full bg-accent/10 flex items-center justify-center mb-3">
                <Zap className="h-6 w-6 text-accent" aria-hidden="true" />
              </div>
              <h3 className="font-semibold text-foreground mb-2">Powerful Tools</h3>
              <p className="text-sm text-muted-foreground text-pretty">
                13+ accessibility features including TTS, STT, Braille, and visual assistance
              </p>
            </div>

            <div className="flex flex-col items-center text-center p-4">
              <div className="h-12 w-12 rounded-full bg-accent/10 flex items-center justify-center mb-3">
                <Users className="h-6 w-6 text-accent" aria-hidden="true" />
              </div>
              <h3 className="font-semibold text-foreground mb-2">Community Driven</h3>
              <p className="text-sm text-muted-foreground text-pretty">
                Built by and for the accessibility community with continuous feedback
              </p>
            </div>
          </div>

          {/* Accessibility Statement Link */}
          <div className="mt-8 pt-8 border-t">
            <a
              href="#accessibility-statement"
              className="text-sm text-muted-foreground hover:text-foreground underline focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 rounded-sm"
            >
              View our Accessibility Statement
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}
