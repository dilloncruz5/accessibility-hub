"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { useTheme } from "@/contexts/theme-context"
import { useAccessibility } from "@/contexts/accessibility-context"
import { Sun, Moon, Monitor, Settings, Menu, X, Volume2, Eye, Keyboard } from "lucide-react"

export function Header() {
  const { theme, setTheme } = useTheme()
  const { state, dispatch, announce } = useAccessibility()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const handleThemeChange = () => {
    const themes: Array<"light" | "dark" | "system"> = ["light", "dark", "system"]
    const currentIndex = themes.indexOf(theme)
    const nextTheme = themes[(currentIndex + 1) % themes.length]
    setTheme(nextTheme)
    announce(`Switched to ${nextTheme} theme`)
  }

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen)
    announce(mobileMenuOpen ? "Menu closed" : "Menu opened")
  }

  const quickActions = [
    {
      icon: Volume2,
      label: "Text-to-Speech",
      action: () => announce("Text-to-speech feature activated"),
      shortcut: "Alt+T",
    },
    {
      icon: Eye,
      label: "High Contrast",
      action: () => {
        dispatch({ type: "TOGGLE_HIGH_CONTRAST" })
        announce(`High contrast ${!state.highContrast ? "enabled" : "disabled"}`)
      },
      active: state.highContrast,
      shortcut: "Alt+C",
    },
    {
      icon: Keyboard,
      label: "Keyboard Navigation",
      action: () => {
        dispatch({ type: "TOGGLE_KEYBOARD_NAVIGATION" })
        announce(`Keyboard navigation ${!state.keyboardNavigation ? "enabled" : "disabled"}`)
      },
      active: state.keyboardNavigation,
      shortcut: "Alt+K",
    },
  ]

  return (
    <>
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-[100] focus:px-4 focus:py-2 focus:bg-primary focus:text-primary-foreground focus:rounded-md focus:shadow-lg focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 transition-all"
      >
        Skip to main content
      </a>

      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            {/* Logo and Brand */}
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className="h-8 w-8 rounded-lg bg-accent flex items-center justify-center">
                  <span className="text-accent-foreground font-bold text-lg" aria-hidden="true">
                    A
                  </span>
                </div>
                <h1 className="text-xl font-bold text-foreground">AccessibilityHub</h1>
              </div>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-6" role="navigation" aria-label="Main navigation">
              <a
                href="#features"
                className="text-muted-foreground hover:text-foreground transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 rounded-sm px-2 py-1"
              >
                Features
              </a>
              <a
                href="#about"
                className="text-muted-foreground hover:text-foreground transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 rounded-sm px-2 py-1"
              >
                About
              </a>
              <a
                href="#community"
                className="text-muted-foreground hover:text-foreground transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 rounded-sm px-2 py-1"
              >
                Community
              </a>
              <a
                href="#support"
                className="text-muted-foreground hover:text-foreground transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 rounded-sm px-2 py-1"
              >
                Support
              </a>
            </nav>

            {/* Quick Actions and Theme Toggle */}
            <div className="flex items-center space-x-2">
              {/* Quick Actions - Desktop */}
              <div className="hidden lg:flex items-center space-x-1">
                {quickActions.map((action, index) => (
                  <Button
                    key={index}
                    variant={action.active ? "default" : "ghost"}
                    size="sm"
                    onClick={action.action}
                    className="h-9 w-9 p-0"
                    title={`${action.label} (${action.shortcut})`}
                    aria-label={`${action.label}. Keyboard shortcut: ${action.shortcut}`}
                  >
                    <action.icon className="h-4 w-4" />
                  </Button>
                ))}
              </div>

              {/* Theme Toggle */}
              <Button
                variant="ghost"
                size="sm"
                onClick={handleThemeChange}
                className="h-9 w-9 p-0"
                aria-label={`Current theme: ${theme}. Click to cycle themes`}
              >
                {theme === "light" && <Sun className="h-4 w-4" />}
                {theme === "dark" && <Moon className="h-4 w-4" />}
                {theme === "system" && <Monitor className="h-4 w-4" />}
              </Button>

              {/* Settings Button */}
              <Button variant="ghost" size="sm" className="h-9 w-9 p-0" aria-label="Open accessibility settings">
                <Settings className="h-4 w-4" />
              </Button>

              {/* Mobile Menu Toggle */}
              <Button
                variant="ghost"
                size="sm"
                className="h-9 w-9 p-0 md:hidden"
                onClick={toggleMobileMenu}
                aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
                aria-expanded={mobileMenuOpen}
                aria-controls="mobile-menu"
              >
                {mobileMenuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
              </Button>
            </div>
          </div>

          {/* Mobile Menu */}
          {mobileMenuOpen && (
            <div
              id="mobile-menu"
              className="md:hidden border-t bg-background py-4"
              role="navigation"
              aria-label="Mobile navigation"
            >
              <div className="flex flex-col space-y-4">
                {/* Navigation Links */}
                <div className="flex flex-col space-y-2">
                  <a
                    href="#features"
                    className="text-muted-foreground hover:text-foreground transition-colors px-2 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Features
                  </a>
                  <a
                    href="#about"
                    className="text-muted-foreground hover:text-foreground transition-colors px-2 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    About
                  </a>
                  <a
                    href="#community"
                    className="text-muted-foreground hover:text-foreground transition-colors px-2 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Community
                  </a>
                  <a
                    href="#support"
                    className="text-muted-foreground hover:text-foreground transition-colors px-2 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Support
                  </a>
                </div>

                {/* Quick Actions - Mobile */}
                <div className="border-t pt-4">
                  <h3 className="text-sm font-medium text-muted-foreground mb-2">Quick Actions</h3>
                  <div className="grid grid-cols-2 gap-2">
                    {quickActions.map((action, index) => (
                      <Button
                        key={index}
                        variant={action.active ? "default" : "outline"}
                        size="sm"
                        onClick={action.action}
                        className="justify-start"
                      >
                        <action.icon className="h-4 w-4 mr-2" />
                        {action.label}
                      </Button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </header>
    </>
  )
}
