"use client"

import { useAccessibility } from "@/contexts/accessibility-context"
import { Heart, Mail, Phone, MapPin, ExternalLink } from "lucide-react"

export function Footer() {
  const { announce } = useAccessibility()

  const handleLinkClick = (linkText: string) => {
    announce(`Navigating to ${linkText}`)
  }

  const footerLinks = {
    features: [
      { label: "Text-to-Speech", href: "#text-to-speech" },
      { label: "Speech-to-Text", href: "#speech-to-text" },
      { label: "Visual Assistance", href: "#visual-assistance" },
      { label: "Keyboard Navigation", href: "#keyboard-navigation" },
    ],
    resources: [
      { label: "Accessibility Guide", href: "#accessibility-guide" },
      { label: "User Manual", href: "#user-manual" },
      { label: "Video Tutorials", href: "#tutorials" },
      { label: "FAQ", href: "#faq" },
    ],
    community: [
      { label: "Discussion Forum", href: "#forum" },
      { label: "Feature Requests", href: "#feature-requests" },
      { label: "Bug Reports", href: "#bug-reports" },
      { label: "Success Stories", href: "#success-stories" },
    ],
    legal: [
      { label: "Privacy Policy", href: "#privacy" },
      { label: "Terms of Service", href: "#terms" },
      { label: "Accessibility Statement", href: "#accessibility-statement" },
      { label: "Cookie Policy", href: "#cookies" },
    ],
  }

  return (
    <footer className="bg-card border-t" role="contentinfo">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 mb-8">
          {/* Brand Section */}
          <div className="lg:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <div className="h-8 w-8 rounded-lg bg-accent flex items-center justify-center">
                <span className="text-accent-foreground font-bold text-lg" aria-hidden="true">
                  A
                </span>
              </div>
              <h2 className="text-xl font-bold text-card-foreground">AccessibilityHub</h2>
            </div>
            <p className="text-muted-foreground mb-4 text-pretty leading-relaxed max-w-md">
              Empowering digital inclusion through innovative accessibility technology. Building bridges to a more
              accessible digital world for everyone.
            </p>

            {/* Contact Information */}
            <div className="space-y-2 text-sm text-muted-foreground">
              <div className="flex items-center space-x-2">
                <Mail className="h-4 w-4" aria-hidden="true" />
                <a
                  href="mailto:support@accessibilityhub.com"
                  className="hover:text-foreground transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 rounded-sm"
                  onClick={() => handleLinkClick("support email")}
                >
                  support@accessibilityhub.com
                </a>
              </div>
              <div className="flex items-center space-x-2">
                <Phone className="h-4 w-4" aria-hidden="true" />
                <a
                  href="tel:+1-800-ACCESS"
                  className="hover:text-foreground transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 rounded-sm"
                  onClick={() => handleLinkClick("support phone number")}
                >
                  1-800-ACCESS (1-800-222-3771)
                </a>
              </div>
              <div className="flex items-start space-x-2">
                <MapPin className="h-4 w-4 mt-0.5" aria-hidden="true" />
                <address className="not-italic">
                  123 Accessibility Lane
                  <br />
                  Inclusive City, IC 12345
                  <br />
                  United States
                </address>
              </div>
            </div>
          </div>

          {/* Features Links */}
          <div>
            <h3 className="font-semibold text-card-foreground mb-4">Features</h3>
            <ul className="space-y-2">
              {footerLinks.features.map((link, index) => (
                <li key={index}>
                  <a
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 rounded-sm"
                    onClick={() => handleLinkClick(link.label)}
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources Links */}
          <div>
            <h3 className="font-semibold text-card-foreground mb-4">Resources</h3>
            <ul className="space-y-2">
              {footerLinks.resources.map((link, index) => (
                <li key={index}>
                  <a
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 rounded-sm"
                    onClick={() => handleLinkClick(link.label)}
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Community Links */}
          <div>
            <h3 className="font-semibold text-card-foreground mb-4">Community</h3>
            <ul className="space-y-2">
              {footerLinks.community.map((link, index) => (
                <li key={index}>
                  <a
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 rounded-sm"
                    onClick={() => handleLinkClick(link.label)}
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t pt-8">
          <div className="flex flex-col lg:flex-row justify-between items-center space-y-4 lg:space-y-0">
            {/* Copyright and Legal Links */}
            <div className="flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-6">
              <p className="text-sm text-muted-foreground">© 2024 AccessibilityHub. All rights reserved.</p>
              <div className="flex flex-wrap justify-center gap-4">
                {footerLinks.legal.map((link, index) => (
                  <a
                    key={index}
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 rounded-sm"
                    onClick={() => handleLinkClick(link.label)}
                  >
                    {link.label}
                  </a>
                ))}
              </div>
            </div>

            {/* Accessibility Statement */}
            <div className="flex items-center space-x-2 text-sm text-muted-foreground">
              <Heart className="h-4 w-4 text-accent" aria-hidden="true" />
              <span>Built with accessibility in mind</span>
              <a
                href="#accessibility-statement"
                className="inline-flex items-center hover:text-foreground transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 rounded-sm"
                onClick={() => handleLinkClick("accessibility statement")}
                aria-label="View detailed accessibility statement"
              >
                Learn more
                <ExternalLink className="h-3 w-3 ml-1" aria-hidden="true" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
