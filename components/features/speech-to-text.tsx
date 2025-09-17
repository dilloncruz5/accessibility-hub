"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { useSpeechRecognition } from "@/hooks/use-speech-recognition"
import { useAccessibility } from "@/contexts/accessibility-context"
import { Mic, MicOff, Square, Download, Copy, RotateCcw, FileText, Languages } from "lucide-react"

export function SpeechToText() {
  const [savedTranscripts, setSavedTranscripts] = useState<string[]>([])
  const {
    transcript,
    listening,
    supported,
    start,
    stop,
    reset,
    language,
    setLanguage,
    continuous,
    setContinuous,
    interimResults,
    setInterimResults,
  } = useSpeechRecognition()
  const { announce } = useAccessibility()

  // Load saved transcripts from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("stt-saved-transcripts")
    if (saved) {
      try {
        setSavedTranscripts(JSON.parse(saved))
      } catch (error) {
        console.error("Failed to load saved transcripts:", error)
      }
    }
  }, [])

  // Save transcripts to localStorage
  useEffect(() => {
    localStorage.setItem("stt-saved-transcripts", JSON.stringify(savedTranscripts))
  }, [savedTranscripts])

  const handleStartListening = () => {
    start()
    announce("Started listening for speech input")
  }

  const handleStopListening = () => {
    stop()
    announce("Stopped listening for speech input")
  }

  const handleSaveTranscript = () => {
    if (!transcript.trim()) return

    const newSavedTranscripts = [transcript, ...savedTranscripts.filter((t) => t !== transcript)].slice(0, 10)
    setSavedTranscripts(newSavedTranscripts)
    announce("Transcript saved to quick access list")
  }

  const handleLoadSavedTranscript = (savedTranscript: string) => {
    // For STT, we'll just copy to clipboard since we can't "load" into the microphone
    navigator.clipboard.writeText(savedTranscript)
    announce("Saved transcript copied to clipboard")
  }

  const handleCopyTranscript = async () => {
    if (!transcript.trim()) return

    try {
      await navigator.clipboard.writeText(transcript)
      announce("Transcript copied to clipboard")
    } catch (error) {
      announce("Failed to copy transcript to clipboard")
    }
  }

  const handleClearTranscript = () => {
    reset()
    announce("Transcript cleared")
  }

  const handleDownloadTranscript = () => {
    if (!transcript.trim()) return

    const blob = new Blob([transcript], { type: "text/plain" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `transcript-${new Date().toISOString().split("T")[0]}.txt`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
    announce("Transcript downloaded as text file")
  }

  const supportedLanguages = [
    { code: "en-US", name: "English (US)" },
    { code: "en-GB", name: "English (UK)" },
    { code: "es-ES", name: "Spanish (Spain)" },
    { code: "es-MX", name: "Spanish (Mexico)" },
    { code: "fr-FR", name: "French (France)" },
    { code: "de-DE", name: "German (Germany)" },
    { code: "it-IT", name: "Italian (Italy)" },
    { code: "pt-BR", name: "Portuguese (Brazil)" },
    { code: "ru-RU", name: "Russian (Russia)" },
    { code: "ja-JP", name: "Japanese (Japan)" },
    { code: "ko-KR", name: "Korean (South Korea)" },
    { code: "zh-CN", name: "Chinese (Simplified)" },
    { code: "zh-TW", name: "Chinese (Traditional)" },
    { code: "ar-SA", name: "Arabic (Saudi Arabia)" },
    { code: "hi-IN", name: "Hindi (India)" },
  ]

  if (!supported) {
    return (
      <Card className="w-full max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MicOff className="h-6 w-6" />
            Speech-to-Text Not Supported
          </CardTitle>
          <CardDescription>
            Your browser doesn't support the Web Speech API. Please try using a modern browser like Chrome, Firefox, or
            Safari.
          </CardDescription>
        </CardHeader>
      </Card>
    )
  }

  return (
    <div className="w-full max-w-6xl mx-auto space-y-6">
      {/* Main STT Interface */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Mic className="h-6 w-6" />
            Speech-to-Text
          </CardTitle>
          <CardDescription>
            Convert your speech to text with real-time transcription and multi-language support.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Status Indicator */}
          <div className="flex items-center justify-center p-6 border-2 border-dashed rounded-lg">
            <div className="text-center">
              <div
                className={`mx-auto h-16 w-16 rounded-full flex items-center justify-center mb-4 ${
                  listening ? "bg-red-100 text-red-600 animate-pulse" : "bg-muted text-muted-foreground"
                }`}
              >
                {listening ? <Mic className="h-8 w-8" /> : <MicOff className="h-8 w-8" />}
              </div>
              <p className="text-lg font-medium">{listening ? "Listening..." : "Ready to listen"}</p>
              <p className="text-sm text-muted-foreground">
                {listening ? "Speak clearly into your microphone" : "Click start to begin speech recognition"}
              </p>
            </div>
          </div>

          {/* Control Buttons */}
          <div className="flex flex-wrap gap-2 justify-center">
            {!listening ? (
              <Button
                onClick={handleStartListening}
                size="lg"
                className="flex items-center gap-2"
                aria-describedby="start-listening-help"
              >
                <Mic className="h-4 w-4" />
                Start Listening
              </Button>
            ) : (
              <Button onClick={handleStopListening} variant="destructive" size="lg" className="flex items-center gap-2">
                <Square className="h-4 w-4" />
                Stop Listening
              </Button>
            )}
            <span id="start-listening-help" className="sr-only">
              Begin speech recognition to convert your speech to text
            </span>

            <Button
              onClick={handleSaveTranscript}
              variant="outline"
              disabled={!transcript.trim()}
              className="flex items-center gap-2 bg-transparent"
            >
              <Download className="h-4 w-4" />
              Save
            </Button>

            <Button
              onClick={handleCopyTranscript}
              variant="outline"
              disabled={!transcript.trim()}
              className="flex items-center gap-2 bg-transparent"
            >
              <Copy className="h-4 w-4" />
              Copy
            </Button>

            <Button
              onClick={handleDownloadTranscript}
              variant="outline"
              disabled={!transcript.trim()}
              className="flex items-center gap-2 bg-transparent"
            >
              <FileText className="h-4 w-4" />
              Download
            </Button>

            <Button
              onClick={handleClearTranscript}
              variant="outline"
              disabled={!transcript.trim()}
              className="flex items-center gap-2 bg-transparent"
            >
              <RotateCcw className="h-4 w-4" />
              Clear
            </Button>
          </div>

          {/* Transcript Display */}
          <div className="space-y-2">
            <label htmlFor="transcript-display" className="text-sm font-medium">
              Transcript
            </label>
            <Textarea
              id="transcript-display"
              value={transcript}
              readOnly
              placeholder="Your speech will appear here as text..."
              className="min-h-[120px] resize-y"
              aria-describedby="transcript-help"
            />
            <p id="transcript-help" className="text-xs text-muted-foreground">
              {transcript.length} characters • Real-time transcription with {language} language
            </p>
          </div>

          {/* Settings */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t">
            {/* Language Selection */}
            <div className="space-y-2">
              <label htmlFor="language-select" className="text-sm font-medium flex items-center gap-2">
                <Languages className="h-4 w-4" />
                Recognition Language
              </label>
              <Select value={language} onValueChange={setLanguage}>
                <SelectTrigger id="language-select">
                  <SelectValue placeholder="Select language" />
                </SelectTrigger>
                <SelectContent>
                  {supportedLanguages.map((lang) => (
                    <SelectItem key={lang.code} value={lang.code}>
                      {lang.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Recognition Settings */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <label htmlFor="continuous-switch" className="text-sm font-medium">
                  Continuous Recognition
                </label>
                <Switch
                  id="continuous-switch"
                  checked={continuous}
                  onCheckedChange={setContinuous}
                  aria-describedby="continuous-help"
                />
              </div>
              <p id="continuous-help" className="text-xs text-muted-foreground">
                Keep listening until manually stopped
              </p>

              <div className="flex items-center justify-between">
                <label htmlFor="interim-switch" className="text-sm font-medium">
                  Show Interim Results
                </label>
                <Switch
                  id="interim-switch"
                  checked={interimResults}
                  onCheckedChange={setInterimResults}
                  aria-describedby="interim-help"
                />
              </div>
              <p id="interim-help" className="text-xs text-muted-foreground">
                Display partial results while speaking
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Saved Transcripts */}
      {savedTranscripts.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Saved Transcripts
            </CardTitle>
            <CardDescription>Previously saved speech-to-text transcriptions</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {savedTranscripts.map((savedTranscript, index) => (
                <div key={index} className="p-3 rounded-md border bg-card">
                  <p className="text-sm mb-2">
                    {savedTranscript.substring(0, 200)}
                    {savedTranscript.length > 200 && "..."}
                  </p>
                  <Button
                    onClick={() => handleLoadSavedTranscript(savedTranscript)}
                    size="sm"
                    variant="outline"
                    className="flex items-center gap-2"
                  >
                    <Copy className="h-3 w-3" />
                    Copy to Clipboard
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Tips and Help */}
      <Card>
        <CardHeader>
          <CardTitle>Tips for Better Recognition</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li>• Speak clearly and at a moderate pace</li>
            <li>• Use a quiet environment with minimal background noise</li>
            <li>• Position your microphone 6-12 inches from your mouth</li>
            <li>• Pause briefly between sentences for better accuracy</li>
            <li>• Select the correct language for your speech</li>
            <li>• Grant microphone permissions when prompted</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  )
}