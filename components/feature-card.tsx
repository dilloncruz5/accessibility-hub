"use client"

import type React from "react"

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

interface FeatureCardProps {
  icon: React.ReactNode
  title: string
  description: string
  onClick: () => void
  comingSoon?: boolean
  ariaLabel?: string
}

export function FeatureCard({ icon, title, description, onClick, comingSoon = false, ariaLabel }: FeatureCardProps) {
  return (
    <Card
      className={`group cursor-pointer transition-all duration-200 hover:shadow-lg hover:scale-[1.02] ${
        comingSoon ? "opacity-75" : ""
      }`}
      role="button"
      tabIndex={0}
      onClick={onClick}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault()
          onClick()
        }
      }}
      aria-label={ariaLabel || `${title}. ${description}${comingSoon ? ". Coming soon." : ". Click to try now."}`}
    >
      <CardContent className="p-6 text-center space-y-4">
        {/* Icon */}
        <div className="flex justify-center">
          <div className="p-3 rounded-full bg-primary/10 text-primary group-hover:bg-primary/20 transition-colors">
            {icon}
          </div>
        </div>

        {/* Title */}
        <div className="space-y-2">
          <h3 className="text-lg font-semibold text-foreground text-balance">{title}</h3>
          {comingSoon && (
            <Badge variant="secondary" className="text-xs">
              Coming Soon
            </Badge>
          )}
        </div>

        {/* Description */}
        <p className="text-sm text-muted-foreground text-pretty leading-relaxed">{description}</p>

        {/* Action Button */}
        <div className="pt-2">
          <Button
            variant={comingSoon ? "outline" : "default"}
            size="sm"
            className="w-full"
            disabled={comingSoon}
            tabIndex={-1} // Prevent double focus since card is already focusable
          >
            {comingSoon ? "Coming Soon" : "Try Now"}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
