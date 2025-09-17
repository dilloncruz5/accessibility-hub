"use client"

import { useState } from "react"
import { useAccessibility } from "@/contexts/accessibility-context"
import { useTheme } from "@/contexts/theme-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Slider } from "@/components/ui/slider"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Settings, Eye, Volume2, Type, Keyboard, Save, RotateCcw } from "lucide-react"

export function AccessibilitySettings() {
  const { settings, updateSettings, resetSettings } = useAccessibility()
  const { theme, setTheme } = useTheme()
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false)

  const handleSettingChange = (key: string, value: any) => {
    updateSettings({ [key]: value })
    setHasUnsavedChanges(true)
  }

  const handleSave = () => {
    // Settings are automatically saved via context
    setHasUnsavedChanges(false)
    // Announce save to screen readers
    const announcement = document.createElement("div")
    announcement.setAttribute("aria-live", "polite")
    announcement.setAttribute("aria-atomic", "true")
    announcement.className = "sr-only"
    announcement.textContent = "Settings saved successfully"
    document.body.appendChild(announcement)
    setTimeout(() => document.body.removeChild(announcement), 1000)
  }

  const handleReset = () => {
    resetSettings()
    setHasUnsavedChanges(false)
  }

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      <div className="flex items-center gap-3 mb-6">
        <Settings className="h-8 w-8 text-primary" aria-hidden="true" />
        <div>
          <h1 className="text-3xl font-bold text-balance">Accessibility Settings</h1>
          <p className="text-muted-foreground text-pretty">
            Customize your experience to meet your accessibility needs
          </p>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Visual Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Eye className="h-5 w-5" aria-hidden="true" />
              Visual Settings
            </CardTitle>
            <CardDescription>Adjust visual elements for better readability and comfort</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="theme-select">Theme</Label>
              <Select value={theme} onValueChange={setTheme}>
                <SelectTrigger id="theme-select">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="light">Light</SelectItem>
                  <SelectItem value="dark">Dark</SelectItem>
                  <SelectItem value="system">System</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="font-size">Font Size: {settings.fontSize}px</Label>
              <Slider
                id="font-size"
                min={12}
                max={24}
                step={1}
                value={[settings.fontSize]}
                onValueChange={([value]) => handleSettingChange("fontSize", value)}
                className="w-full"
                aria-describedby="font-size-desc"
              />
              <p id="font-size-desc" className="text-sm text-muted-foreground">
                Adjust text size for better readability
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="line-height">Line Height: {settings.lineHeight}</Label>
              <Slider
                id="line-height"
                min={1.2}
                max={2.0}
                step={0.1}
                value={[settings.lineHeight]}
                onValueChange={([value]) => handleSettingChange("lineHeight", value)}
                className="w-full"
              />
            </div>

            <div className="flex items-center justify-between">
              <Label htmlFor="high-contrast">High Contrast Mode</Label>
              <Switch
                id="high-contrast"
                checked={settings.highContrast}
                onCheckedChange={(checked) => handleSettingChange("highContrast", checked)}
              />
            </div>

            <div className="flex items-center justify-between">
              <Label htmlFor="reduce-motion">Reduce Motion</Label>
              <Switch
                id="reduce-motion"
                checked={settings.reduceMotion}
                onCheckedChange={(checked) => handleSettingChange("reduceMotion", checked)}
              />
            </div>
          </CardContent>
        </Card>

        {/* Audio Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Volume2 className="h-5 w-5" aria-hidden="true" />
              Audio Settings
            </CardTitle>
            <CardDescription>Configure audio feedback and speech settings</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <Label htmlFor="audio-feedback">Audio Feedback</Label>
              <Switch
                id="audio-feedback"
                checked={settings.audioFeedback}
                onCheckedChange={(checked) => handleSettingChange("audioFeedback", checked)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="speech-rate">Speech Rate: {settings.speechRate}x</Label>
              <Slider
                id="speech-rate"
                min={0.5}
                max={2.0}
                step={0.1}
                value={[settings.speechRate]}
                onValueChange={([value]) => handleSettingChange("speechRate", value)}
                className="w-full"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="speech-volume">Speech Volume: {Math.round(settings.speechVolume * 100)}%</Label>
              <Slider
                id="speech-volume"
                min={0}
                max={1}
                step={0.1}
                value={[settings.speechVolume]}
                onValueChange={([value]) => handleSettingChange("speechVolume", value)}
                className="w-full"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="speech-voice">Preferred Voice</Label>
              <Select
                value={settings.preferredVoice}
                onValueChange={(value) => handleSettingChange("preferredVoice", value)}
              >
                <SelectTrigger id="speech-voice">
                  <SelectValue placeholder="Select voice" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="default">Default</SelectItem>
                  <SelectItem value="female">Female</SelectItem>
                  <SelectItem value="male">Male</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Navigation Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Keyboard className="h-5 w-5" aria-hidden="true" />
              Navigation Settings
            </CardTitle>
            <CardDescription>Customize keyboard and mouse navigation preferences</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <Label htmlFor="keyboard-navigation">Enhanced Keyboard Navigation</Label>
              <Switch
                id="keyboard-navigation"
                checked={settings.keyboardNavigation}
                onCheckedChange={(checked) => handleSettingChange("keyboardNavigation", checked)}
              />
            </div>

            <div className="flex items-center justify-between">
              <Label htmlFor="focus-indicators">Visible Focus Indicators</Label>
              <Switch
                id="focus-indicators"
                checked={settings.focusIndicators}
                onCheckedChange={(checked) => handleSettingChange("focusIndicators", checked)}
              />
            </div>

            <div className="flex items-center justify-between">
              <Label htmlFor="skip-links">Skip Navigation Links</Label>
              <Switch
                id="skip-links"
                checked={settings.skipLinks}
                onCheckedChange={(checked) => handleSettingChange("skipLinks", checked)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="tab-timeout">Tab Timeout (seconds)</Label>
              <Slider
                id="tab-timeout"
                min={5}
                max={30}
                step={5}
                value={[settings.tabTimeout]}
                onValueChange={([value]) => handleSettingChange("tabTimeout", value)}
                className="w-full"
              />
            </div>
          </CardContent>
        </Card>

        {/* Language & Content Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Type className="h-5 w-5" aria-hidden="true" />
              Language & Content
            </CardTitle>
            <CardDescription>Set language preferences and content display options</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="language">Primary Language</Label>
              <Select value={settings.language} onValueChange={(value) => handleSettingChange("language", value)}>
                <SelectTrigger id="language">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="en">English</SelectItem>
                  <SelectItem value="es">Spanish</SelectItem>
                  <SelectItem value="fr">French</SelectItem>
                  <SelectItem value="de">German</SelectItem>
                  <SelectItem value="it">Italian</SelectItem>
                  <SelectItem value="pt">Portuguese</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center justify-between">
              <Label htmlFor="simplified-ui">Simplified Interface</Label>
              <Switch
                id="simplified-ui"
                checked={settings.simplifiedUI}
                onCheckedChange={(checked) => handleSettingChange("simplifiedUI", checked)}
              />
            </div>

            <div className="flex items-center justify-between">
              <Label htmlFor="auto-descriptions">Auto Image Descriptions</Label>
              <Switch
                id="auto-descriptions"
                checked={settings.autoDescriptions}
                onCheckedChange={(checked) => handleSettingChange("autoDescriptions", checked)}
              />
            </div>

            <div className="flex items-center justify-between">
              <Label htmlFor="captions">Auto-generate Captions</Label>
              <Switch
                id="captions"
                checked={settings.captions}
                onCheckedChange={(checked) => handleSettingChange("captions", checked)}
              />
            </div>
          </CardContent>
        </Card>
      </div>

      <Separator />

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-center">
        <div className="flex gap-2">
          <Button onClick={handleSave} disabled={!hasUnsavedChanges} className="flex items-center gap-2">
            <Save className="h-4 w-4" aria-hidden="true" />
            Save Settings
          </Button>
          <Button variant="outline" onClick={handleReset} className="flex items-center gap-2 bg-transparent">
            <RotateCcw className="h-4 w-4" aria-hidden="true" />
            Reset to Defaults
          </Button>
        </div>

        {hasUnsavedChanges && (
          <p className="text-sm text-muted-foreground" aria-live="polite">
            You have unsaved changes
          </p>
        )}
      </div>

      {/* Accessibility Info */}
      <Card className="bg-muted/50">
        <CardContent className="pt-6">
          <h3 className="font-semibold mb-2">Accessibility Information</h3>
          <p className="text-sm text-muted-foreground text-pretty">
            These settings are automatically saved and will persist across sessions. All changes take effect
            immediately. If you experience any issues, use the "Reset to Defaults" button to restore original settings.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
