"use client"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { TextToSpeech } from "./text-to-speech"
import { SpeechToText } from "./speech-to-text"
import { VisualAssistance } from "./visual-assistance"
import { BrailleSupport } from "./braille-support"
import { AACCommunication } from "./aac-communication"
import { EmergencySOS } from "./emergency-sos"
import { AccessibilitySettings } from "./accessibility-settings"
import { CommunityHub } from "./community-hub"
import { MultiLanguage } from "./multi-language"
import { useAccessibility } from "@/contexts/accessibility-context"

interface FeatureModalProps {
  featureId: string | null
  onClose: () => void
}

export function FeatureModal({ featureId, onClose }: FeatureModalProps) {
  const { announce } = useAccessibility()

  const handleClose = () => {
    onClose()
    announce("Feature modal closed")
  }

  const renderFeatureContent = () => {
    switch (featureId) {
      case "text-to-speech":
        return <TextToSpeech />
      case "speech-to-text":
        return <SpeechToText />
      case "visual-assistance":
        return <VisualAssistance />
      case "braille-support":
        return <BrailleSupport />
      case "aac-board":
        return <AACCommunication />
      case "emergency-sos":
        return <EmergencySOS />
      case "accessibility-settings":
        return <AccessibilitySettings />
      case "community-hub":
        return <CommunityHub />
      case "multi-language":
        return <MultiLanguage />
      default:
        return (
          <div className="text-center py-8">
            <p className="text-muted-foreground">Feature coming soon!</p>
          </div>
        )
    }
  }

  const getFeatureTitle = () => {
    switch (featureId) {
      case "text-to-speech":
        return "Text-to-Speech"
      case "speech-to-text":
        return "Speech-to-Text"
      case "visual-assistance":
        return "Visual Assistance"
      case "braille-support":
        return "Braille Support"
      case "aac-board":
        return "AAC Communication Board"
      case "emergency-sos":
        return "Emergency SOS"
      case "accessibility-settings":
        return "Accessibility Settings"
      case "community-hub":
        return "Community Hub"
      case "multi-language":
        return "Multi-language Support"
      default:
        return "Feature"
    }
  }

  return (
    <Dialog open={!!featureId} onOpenChange={handleClose}>
      <DialogContent className="max-w-7xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{getFeatureTitle()}</DialogTitle>
          <DialogDescription>Use this accessibility tool to enhance your digital experience.</DialogDescription>
        </DialogHeader>
        {renderFeatureContent()}
      </DialogContent>
    </Dialog>
  )
}
