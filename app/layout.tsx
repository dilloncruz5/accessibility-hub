import type React from "react"
import type { Metadata } from "next"
import { GeistSans } from "geist/font/sans"
import { GeistMono } from "geist/font/mono"
import { Analytics } from "@vercel/analytics/next"
import { ThemeProvider } from "@/contexts/theme-context"
import { AccessibilityProvider } from "@/contexts/accessibility-context"
import { Suspense } from "react"
import "./globals.css"

export const metadata: Metadata = {
  title: "AccessibilityHub - Empowering Digital Inclusion",
  description:
    "A comprehensive accessibility platform for differently-abled individuals featuring text-to-speech, Braille support, sign language recognition, and more.",
  generator: "v0.app",
  keywords: ["accessibility", "disability", "assistive technology", "inclusion", "WCAG"],
  authors: [{ name: "AccessibilityHub Team" }],
  viewport: "width=device-width, initial-scale=1",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#1a1a1a" },
  ],
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`font-sans ${GeistSans.variable} ${GeistMono.variable} antialiased`}>
        <ThemeProvider>
          <AccessibilityProvider>
            {/* Skip to main content link */}
            <Suspense fallback={null}>
              <a
                href="#main-content"
                className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 bg-accent text-accent-foreground px-4 py-2 rounded-md z-50"
              >
                Skip to main content
              </a>
              {children}
            </Suspense>
            <Analytics />
          </AccessibilityProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
