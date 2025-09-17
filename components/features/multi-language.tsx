"use client"

import { useState } from "react"
import { useAccessibility } from "@/contexts/accessibility-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Globe, Volume2, Type, Download, Check, AlertCircle, Languages, Eye } from "lucide-react"

interface Language {
  code: string
  name: string
  nativeName: string
  rtl: boolean
  available: boolean
  downloadSize?: string
  features: {
    ui: boolean
    tts: boolean
    stt: boolean
    braille: boolean
  }
}

const languages: Language[] = [
  {
    code: "en",
    name: "English",
    nativeName: "English",
    rtl: false,
    available: true,
    features: { ui: true, tts: true, stt: true, braille: true },
  },
  {
    code: "es",
    name: "Spanish",
    nativeName: "Español",
    rtl: false,
    available: true,
    downloadSize: "12 MB",
    features: { ui: true, tts: true, stt: true, braille: true },
  },
  {
    code: "fr",
    name: "French",
    nativeName: "Français",
    rtl: false,
    available: true,
    downloadSize: "11 MB",
    features: { ui: true, tts: true, stt: true, braille: true },
  },
  {
    code: "de",
    name: "German",
    nativeName: "Deutsch",
    rtl: false,
    available: true,
    downloadSize: "13 MB",
    features: { ui: true, tts: true, stt: true, braille: true },
  },
  {
    code: "it",
    name: "Italian",
    nativeName: "Italiano",
    rtl: false,
    available: true,
    downloadSize: "10 MB",
    features: { ui: true, tts: true, stt: true, braille: true },
  },
  {
    code: "pt",
    name: "Portuguese",
    nativeName: "Português",
    rtl: false,
    available: true,
    downloadSize: "11 MB",
    features: { ui: true, tts: true, stt: true, braille: true },
  },
  {
    code: "ar",
    name: "Arabic",
    nativeName: "العربية",
    rtl: true,
    available: false,
    downloadSize: "15 MB",
    features: { ui: true, tts: true, stt: false, braille: true },
  },
  {
    code: "zh",
    name: "Chinese (Simplified)",
    nativeName: "简体中文",
    rtl: false,
    available: false,
    downloadSize: "18 MB",
    features: { ui: true, tts: true, stt: true, braille: false },
  },
  {
    code: "ja",
    name: "Japanese",
    nativeName: "日本語",
    rtl: false,
    available: false,
    downloadSize: "16 MB",
    features: { ui: true, tts: true, stt: true, braille: true },
  },
  {
    code: "hi",
    name: "Hindi",
    nativeName: "हिन्दी",
    rtl: false,
    available: false,
    downloadSize: "14 MB",
    features: { ui: true, tts: true, stt: true, braille: false },
  },
]

export function MultiLanguage() {
  const [selectedLanguage, setSelectedLanguage] = useState("en")
  const [downloadingLanguages, setDownloadingLanguages] = useState<string[]>([])
  const [installedLanguages, setInstalledLanguages] = useState<string[]>(["en"])
  const [autoDetect, setAutoDetect] = useState(true)
  const [rtlSupport, setRtlSupport] = useState(true)
  const { announce, settings, updateSettings } = useAccessibility()

  const currentLanguage = languages.find((lang) => lang.code === selectedLanguage) || languages[0]

  const handleLanguageChange = (languageCode: string) => {
    const language = languages.find((lang) => lang.code === languageCode)
    if (!language) return

    if (!language.available) {
      announce(`${language.name} is not yet available. Coming soon.`)
      return
    }

    if (!installedLanguages.includes(languageCode)) {
      handleDownloadLanguage(languageCode)
      return
    }

    setSelectedLanguage(languageCode)
    updateSettings({ language: languageCode })
    announce(`Language changed to ${language.name}`)
  }

  const handleDownloadLanguage = (languageCode: string) => {
    const language = languages.find((lang) => lang.code === languageCode)
    if (!language || downloadingLanguages.includes(languageCode)) return

    setDownloadingLanguages((prev) => [...prev, languageCode])
    announce(`Downloading ${language.name} language pack...`)

    // Simulate download
    setTimeout(() => {
      setDownloadingLanguages((prev) => prev.filter((code) => code !== languageCode))
      setInstalledLanguages((prev) => [...prev, languageCode])
      setSelectedLanguage(languageCode)
      updateSettings({ language: languageCode })
      announce(`${language.name} language pack installed and activated`)
    }, 3000)
  }

  const getFeatureIcon = (feature: keyof Language["features"]) => {
    switch (feature) {
      case "ui":
        return <Globe className="h-4 w-4" />
      case "tts":
        return <Volume2 className="h-4 w-4" />
      case "stt":
        return <Languages className="h-4 w-4" />
      case "braille":
        return <Type className="h-4 w-4" />
    }
  }

  const getFeatureLabel = (feature: keyof Language["features"]) => {
    switch (feature) {
      case "ui":
        return "Interface"
      case "tts":
        return "Text-to-Speech"
      case "stt":
        return "Speech-to-Text"
      case "braille":
        return "Braille Support"
    }
  }

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <Globe className="h-8 w-8 text-primary" aria-hidden="true" />
        <div>
          <h1 className="text-3xl font-bold text-balance">Multi-language Support</h1>
          <p className="text-muted-foreground text-pretty">
            Access AccessibilityHub in your preferred language with full feature support
          </p>
        </div>
      </div>

      {/* Current Language Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Languages className="h-5 w-5" />
            Current Language Settings
          </CardTitle>
          <CardDescription>
            Your current language is {currentLanguage.nativeName} ({currentLanguage.name})
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="language-select">Primary Language</Label>
            <Select value={selectedLanguage} onValueChange={handleLanguageChange}>
              <SelectTrigger id="language-select">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {languages.map((language) => (
                  <SelectItem key={language.code} value={language.code} disabled={!language.available}>
                    <div className="flex items-center gap-2">
                      <span>{language.nativeName}</span>
                      <span className="text-muted-foreground">({language.name})</span>
                      {!language.available && <Badge variant="secondary">Coming Soon</Badge>}
                      {installedLanguages.includes(language.code) && <Check className="h-4 w-4 text-green-600" />}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center justify-between">
            <Label htmlFor="auto-detect">Auto-detect Language</Label>
            <Switch id="auto-detect" checked={autoDetect} onCheckedChange={setAutoDetect} />
          </div>

          <div className="flex items-center justify-between">
            <Label htmlFor="rtl-support">Right-to-Left Text Support</Label>
            <Switch id="rtl-support" checked={rtlSupport} onCheckedChange={setRtlSupport} />
          </div>
        </CardContent>
      </Card>

      {/* Language Features */}
      <Card>
        <CardHeader>
          <CardTitle>Language Features</CardTitle>
          <CardDescription>Available accessibility features for {currentLanguage.nativeName}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {Object.entries(currentLanguage.features).map(([feature, supported]) => (
              <div
                key={feature}
                className={`flex items-center gap-2 p-3 rounded-lg border ${
                  supported
                    ? "bg-green-50 border-green-200 dark:bg-green-950 dark:border-green-800"
                    : "bg-gray-50 border-gray-200 dark:bg-gray-950 dark:border-gray-800"
                }`}
              >
                {getFeatureIcon(feature as keyof Language["features"])}
                <div>
                  <p className="text-sm font-medium">{getFeatureLabel(feature as keyof Language["features"])}</p>
                  <p className={`text-xs ${supported ? "text-green-600 dark:text-green-400" : "text-gray-500"}`}>
                    {supported ? "Supported" : "Not Available"}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Available Languages */}
      <Card>
        <CardHeader>
          <CardTitle>Available Languages</CardTitle>
          <CardDescription>Download and install additional language packs</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {languages.map((language) => (
              <div key={language.code} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-3">
                  <div>
                    <h3 className="font-medium">{language.nativeName}</h3>
                    <p className="text-sm text-muted-foreground">{language.name}</p>
                  </div>
                  {language.rtl && (
                    <Badge variant="outline" className="text-xs">
                      <Eye className="h-3 w-3 mr-1" />
                      RTL
                    </Badge>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  {language.downloadSize && (
                    <span className="text-sm text-muted-foreground">{language.downloadSize}</span>
                  )}

                  {!language.available ? (
                    <Badge variant="secondary">Coming Soon</Badge>
                  ) : installedLanguages.includes(language.code) ? (
                    <div className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-green-600" />
                      <span className="text-sm text-green-600">Installed</span>
                    </div>
                  ) : downloadingLanguages.includes(language.code) ? (
                    <Button disabled size="sm">
                      Downloading...
                    </Button>
                  ) : (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleDownloadLanguage(language.code)}
                      className="flex items-center gap-1"
                    >
                      <Download className="h-4 w-4" />
                      Download
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Language Support Info */}
      <Card className="bg-muted/50">
        <CardContent className="pt-6">
          <div className="flex items-start gap-3">
            <AlertCircle className="h-5 w-5 text-blue-600 mt-0.5" />
            <div>
              <h3 className="font-semibold mb-2">Language Support Information</h3>
              <ul className="text-sm text-muted-foreground space-y-1 text-pretty">
                <li>• Language packs include UI translations and voice models</li>
                <li>• Some features may have limited support in certain languages</li>
                <li>• RTL languages automatically adjust interface direction</li>
                <li>• Downloaded languages work offline for most features</li>
                <li>• Community translations are welcome - contact us to contribute</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
