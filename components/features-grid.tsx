"use client"

import type React from "react"

import { useState } from "react"
import { FeatureCard } from "@/components/feature-card"
import { FeatureModal } from "@/components/features/feature-modal"
import { useAccessibility } from "@/contexts/accessibility-context"
import {
  Volume2,
  Mic,
  Eye,
  Brain as Braille,
  Camera,
  Monitor,
  Keyboard,
  Palette,
  MessageSquare,
  Globe,
  MapPin,
  AlertTriangle,
  Users,
  Settings,
} from "lucide-react"

interface Feature {
  id: string
  icon: React.ComponentType<{ className?: string }>
  title: string
  description: string
  category: "communication" | "visual" | "navigation" | "emergency" | "community"
  comingSoon?: boolean
}

const features: Feature[] = [
  {
    id: "text-to-speech",
    icon: Volume2,
    title: "Text-to-Speech",
    description: "Convert any text to natural-sounding speech with customizable voices, speed, and pitch controls.",
    category: "communication",
  },
  {
    id: "speech-to-text",
    icon: Mic,
    title: "Speech-to-Text",
    description: "Real-time voice transcription with multi-language support and high accuracy recognition.",
    category: "communication",
  },
  {
    id: "braille-support",
    icon: Braille,
    title: "Braille Support",
    description: "Text-to-Braille conversion with visual dots display and printable output functionality.",
    category: "visual",
  },
  {
    id: "sign-language",
    icon: Camera,
    title: "Sign Language Recognition",
    description: "Live camera-based sign language detection and conversion to text or speech.",
    category: "communication",
    comingSoon: true,
  },
  {
    id: "visual-assistance",
    icon: Eye,
    title: "Visual Assistance",
    description: "Image description, OCR text reading, and object detection for visual content.",
    category: "visual",
  },
  {
    id: "screen-reader-mode",
    icon: Monitor,
    title: "Screen Reader Mode",
    description: "Enhanced interface with improved ARIA labels and simplified navigation structure.",
    category: "navigation",
  },
  {
    id: "keyboard-navigation",
    icon: Keyboard,
    title: "Keyboard Navigation",
    description: "Full keyboard accessibility with customizable shortcuts and visible focus indicators.",
    category: "navigation",
  },
  {
    id: "vision-options",
    icon: Palette,
    title: "Vision Accessibility",
    description: "High contrast themes, font scaling, color customization, and cursor enhancements.",
    category: "visual",
  },
  {
    id: "aac-board",
    icon: MessageSquare,
    title: "AAC Communication",
    description: "Symbol-based communication board with customizable layouts and TTS integration.",
    category: "communication",
  },
  {
    id: "multi-language",
    icon: Globe,
    title: "Multi-language Support",
    description: "Interface and features available in 10+ languages with RTL text support.",
    category: "navigation",
  },
  {
    id: "accessible-maps",
    icon: MapPin,
    title: "Accessible Navigation",
    description: "Audio-guided directions with landmark-based navigation and location descriptions.",
    category: "navigation",
    comingSoon: true,
  },
  {
    id: "emergency-sos",
    icon: AlertTriangle,
    title: "Emergency SOS",
    description: "Quick emergency contacts, location sharing, and automated emergency messaging.",
    category: "emergency",
  },
  {
    id: "accessibility-settings",
    icon: Settings,
    title: "Accessibility Settings",
    description: "Comprehensive customization panel for all accessibility preferences and display options.",
    category: "navigation",
  },
  {
    id: "community-hub",
    icon: Users,
    title: "Community Hub",
    description: "Accessible forum and chat platform for connecting with the accessibility community.",
    category: "community",
    comingSoon: true,
  },
]

const categories = [
  { id: "all", label: "All Features", count: features.length },
  { id: "communication", label: "Communication", count: features.filter((f) => f.category === "communication").length },
  { id: "visual", label: "Visual Assistance", count: features.filter((f) => f.category === "visual").length },
  { id: "navigation", label: "Navigation", count: features.filter((f) => f.category === "navigation").length },
  { id: "emergency", label: "Emergency", count: features.filter((f) => f.category === "emergency").length },
  { id: "community", label: "Community", count: features.filter((f) => f.category === "community").length },
]

export function FeaturesGrid() {
  const [selectedCategory, setSelectedCategory] = useState<string>("all")
  const [activeFeature, setActiveFeature] = useState<string | null>(null)
  const { announce } = useAccessibility()

  const filteredFeatures =
    selectedCategory === "all" ? features : features.filter((feature) => feature.category === selectedCategory)

  const handleCategoryChange = (categoryId: string) => {
    setSelectedCategory(categoryId)
    const category = categories.find((c) => c.id === categoryId)
    announce(`Showing ${category?.label} features. ${filteredFeatures.length} features available.`)
  }

  const handleFeatureClick = (feature: Feature) => {
    if (feature.comingSoon) {
      announce(`${feature.title} is coming soon. Feature not yet available.`)
    } else {
      setActiveFeature(feature.id)
      announce(`Opening ${feature.title} feature`)
    }
  }

  const handleCloseFeature = () => {
    setActiveFeature(null)
  }

  return (
    <>
      <section id="features" className="py-20 bg-muted/30" aria-labelledby="features-heading">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section Header */}
          <div className="text-center mb-12">
            <h2 id="features-heading" className="text-3xl sm:text-4xl font-bold text-foreground mb-4 text-balance">
              Comprehensive Accessibility Tools
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto text-pretty leading-relaxed">
              Discover our suite of accessibility features designed to empower independence and enhance digital
              experiences for everyone.
            </p>
          </div>

          {/* Category Filter */}
          <div className="mb-8">
            <div className="flex flex-wrap justify-center gap-2 mb-4">
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => handleCategoryChange(category.id)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 ${
                    selectedCategory === category.id
                      ? "bg-accent text-accent-foreground"
                      : "bg-background text-muted-foreground hover:text-foreground hover:bg-muted"
                  }`}
                  aria-pressed={selectedCategory === category.id}
                  aria-describedby={`category-${category.id}-desc`}
                >
                  {category.label} ({category.count})
                </button>
              ))}
            </div>

            {/* Screen reader descriptions for categories */}
            {categories.map((category) => (
              <span key={category.id} id={`category-${category.id}-desc`} className="sr-only">
                Filter features by {category.label}. {category.count} features available.
              </span>
            ))}
          </div>

          {/* Features Grid */}
          <div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
            role="region"
            aria-label="Accessibility features"
            aria-live="polite"
          >
            {filteredFeatures.map((feature) => (
              <FeatureCard
                key={feature.id}
                icon={<feature.icon className="h-8 w-8" aria-hidden="true" />}
                title={feature.title}
                description={feature.description}
                onClick={() => handleFeatureClick(feature)}
                comingSoon={feature.comingSoon}
                ariaLabel={`${feature.title}. ${feature.description}${feature.comingSoon ? ". Coming soon." : ". Click to try now."}`}
              />
            ))}
          </div>

          {/* No features message */}
          {filteredFeatures.length === 0 && (
            <div className="text-center py-12">
              <p className="text-muted-foreground text-lg">No features found in this category.</p>
            </div>
          )}

          {/* Call to Action */}
          <div className="text-center mt-12 pt-8 border-t">
            <p className="text-muted-foreground mb-4">Have a feature request or need help getting started?</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="#support"
                className="inline-flex items-center justify-center px-6 py-3 border border-accent text-accent hover:bg-accent hover:text-accent-foreground rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
              >
                Get Support
              </a>
              <a
                href="#community"
                className="inline-flex items-center justify-center px-6 py-3 bg-accent text-accent-foreground hover:bg-accent/90 rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
              >
                Join Community
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Modal */}
      <FeatureModal featureId={activeFeature} onClose={handleCloseFeature} />
    </>
  )
}
