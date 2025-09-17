"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Slider } from "@/components/ui/slider"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useSpeechSynthesis } from "@/hooks/use-speech-synthesis"
import { useAccessibility } from "@/contexts/accessibility-context"
import { Volume2, VolumeX, Play, Pause, Square, RotateCcw, Download, Copy, FileText } from "lucide-react"

export function TextToSpeech() {
  const [text, setText] = useState("")
  const [savedTexts, setSavedTexts] = useState<string[]>([])
  const {
    speak,
    stop,
    pause,
    resume,
    speaking,
    supported,
    voices,
    selectedVoice,
    setSelectedVoice,
    rate,
    setRate,
    pitch,
    setPitch,
    volume,
    setVolume,
  } = useSpeechSynthesis()
  const { announce } = useAccessibility()

  // Load saved texts from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("tts-saved-texts")
    if (saved) {
      try {
        setSavedTexts(JSON.parse(saved))
      } catch (error) {
        console.error("Failed to load saved texts:", error)
      }
    }
  }, [])

  // Save texts to localStorage
  useEffect(() => {
    localStorage.setItem("tts-saved-texts", JSON.stringify(savedTexts))
  }, [savedTexts])

  const handleSpeak = () => {
    if (!text.trim()) {
      announce("Please enter some text to speak")
      return
    }

    speak(text)
    announce("Starting text-to-speech playback")
  }

  const handleStop = () => {
    stop()
    announce("Stopped text-to-speech playback")
  }

  const handlePause = () => {
    pause()
    announce("Paused text-to-speech playback")
  }

  const handleResume = () => {
    resume()
    announce("Resumed text-to-speech playback")
  }

  const handleVoiceChange = (voiceURI: string) => {
    const voice = voices.find((v) => v.voiceURI === voiceURI)
    if (voice) {
      setSelectedVoice(voice)
      announce(`Selected voice: ${voice.name}`)
    }
  }

  const handleSaveText = () => {
    if (!text.trim()) return

    const newSavedTexts = [text, ...savedTexts.filter((t) => t !== text)].slice(0, 10)
    setSavedTexts(newSavedTexts)
    announce("Text saved to quick access list")
  }

  const handleLoadSavedText = (savedText: string) => {
    setText(savedText)
    announce("Loaded saved text")
  }

  const handleCopyText = async () => {
    if (!text.trim()) return

    try {
      await navigator.clipboard.writeText(text)
      announce("Text copied to clipboard")
    } catch (error) {
      announce("Failed to copy text to clipboard")
    }
  }

  const handleClearText = () => {
    setText("")
    announce("Text cleared")
  }

  const sampleTexts = [
    "Welcome to AccessibilityHub. This is a sample text to test the text-to-speech functionality.",
    "The quick brown fox jumps over the lazy dog. This sentence contains every letter of the alphabet.",
    "Accessibility is not a feature, it's a fundamental right. Everyone deserves equal access to information and technology.",
  ]

  if (!supported) {
    return (
      <Card className="w-full max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <VolumeX className="h-6 w-6" />
            Text-to-Speech Not Supported
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
      {/* Main TTS Interface */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Volume2 className="h-6 w-6" />
            Text-to-Speech
          </CardTitle>
          <CardDescription>
            Convert any text to natural-sounding speech with customizable voice settings.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Text Input */}
          <div className="space-y-2">
            <label htmlFor="tts-text" className="text-sm font-medium">
              Enter text to speak
            </label>
            <Textarea
              id="tts-text"
              placeholder="Type or paste your text here..."
              value={text}
              onChange={(e) => setText(e.target.value)}
              className="min-h-[120px] resize-y"
              aria-describedby="tts-text-help"
            />
            <p id="tts-text-help" className="text-xs text-muted-foreground">
              {text.length} characters • Supports multiple languages and special characters
            </p>
          </div>

          {/* Control Buttons */}
          <div className="flex flex-wrap gap-2">
            <Button
              onClick={handleSpeak}
              disabled={!text.trim() || speaking}
              className="flex items-center gap-2"
              aria-describedby="speak-button-help"
            >
              <Play className="h-4 w-4" />
              Speak
            </Button>
            <span id="speak-button-help" className="sr-only">
              Start reading the text aloud using text-to-speech
            </span>

            {speaking && (
              <>
                <Button onClick={handlePause} variant="outline" className="flex items-center gap-2 bg-transparent">
                  <Pause className="h-4 w-4" />
                  Pause
                </Button>
                <Button onClick={handleResume} variant="outline" className="flex items-center gap-2 bg-transparent">
                  <Play className="h-4 w-4" />
                  Resume
                </Button>
              </>
            )}

            <Button
              onClick={handleStop}
              variant="outline"
              disabled={!speaking}
              className="flex items-center gap-2 bg-transparent"
            >
              <Square className="h-4 w-4" />
              Stop
            </Button>

            <Button
              onClick={handleSaveText}
              variant="outline"
              disabled={!text.trim()}
              className="flex items-center gap-2 bg-transparent"
            >
              <Download className="h-4 w-4" />
              Save
            </Button>

            <Button
              onClick={handleCopyText}
              variant="outline"
              disabled={!text.trim()}
              className="flex items-center gap-2 bg-transparent"
            >
              <Copy className="h-4 w-4" />
              Copy
            </Button>

            <Button
              onClick={handleClearText}
              variant="outline"
              disabled={!text.trim()}
              className="flex items-center gap-2 bg-transparent"
            >
              <RotateCcw className="h-4 w-4" />
              Clear
            </Button>
          </div>

          {/* Voice Settings */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t">
            {/* Voice Selection */}
            <div className="space-y-2">
              <label htmlFor="voice-select" className="text-sm font-medium">
                Voice ({voices.length} available)
              </label>
              <Select value={selectedVoice?.voiceURI || ""} onValueChange={handleVoiceChange}>
                <SelectTrigger id="voice-select">
                  <SelectValue placeholder="Select a voice" />
                </SelectTrigger>
                <SelectContent>
                  {voices.map((voice) => (
                    <SelectItem key={voice.voiceURI} value={voice.voiceURI}>
                      {voice.name} ({voice.lang})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Speed Control */}
            <div className="space-y-2">
              <label htmlFor="rate-slider" className="text-sm font-medium">
                Speed: {rate.toFixed(1)}x
              </label>
              <Slider
                id="rate-slider"
                min={0.5}
                max={2}
                step={0.1}
                value={[rate]}
                onValueChange={(value) => setRate(value[0])}
                className="w-full"
                aria-describedby="rate-help"
              />
              <p id="rate-help" className="text-xs text-muted-foreground">
                Adjust speech speed from 0.5x (slow) to 2x (fast)
              </p>
            </div>

            {/* Pitch Control */}
            <div className="space-y-2">
              <label htmlFor="pitch-slider" className="text-sm font-medium">
                Pitch: {pitch.toFixed(1)}
              </label>
              <Slider
                id="pitch-slider"
                min={0}
                max={2}
                step={0.1}
                value={[pitch]}
                onValueChange={(value) => setPitch(value[0])}
                className="w-full"
                aria-describedby="pitch-help"
              />
              <p id="pitch-help" className="text-xs text-muted-foreground">
                Adjust voice pitch from 0 (low) to 2 (high)
              </p>
            </div>

            {/* Volume Control */}
            <div className="space-y-2">
              <label htmlFor="volume-slider" className="text-sm font-medium">
                Volume: {Math.round(volume * 100)}%
              </label>
              <Slider
                id="volume-slider"
                min={0}
                max={1}
                step={0.1}
                value={[volume]}
                onValueChange={(value) => setVolume(value[0])}
                className="w-full"
                aria-describedby="volume-help"
              />
              <p id="volume-help" className="text-xs text-muted-foreground">
                Adjust playback volume from 0% to 100%
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Quick Access and Sample Texts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Saved Texts */}
        {savedTexts.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Quick Access
              </CardTitle>
              <CardDescription>Recently saved texts for quick playback</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {savedTexts.map((savedText, index) => (
                  <button
                    key={index}
                    onClick={() => handleLoadSavedText(savedText)}
                    className="w-full text-left p-3 rounded-md border hover:bg-muted transition-colors focus:outline-none focus:ring-2 focus:ring-ring"
                    aria-label={`Load saved text: ${savedText.substring(0, 50)}${savedText.length > 50 ? "..." : ""}`}
                  >
                    <p className="text-sm truncate">
                      {savedText.substring(0, 100)}
                      {savedText.length > 100 && "..."}
                    </p>
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Sample Texts */}
        <Card>
          <CardHeader>
            <CardTitle>Sample Texts</CardTitle>
            <CardDescription>Try these sample texts to test different voices and settings</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {sampleTexts.map((sample, index) => (
                <button
                  key={index}
                  onClick={() => setText(sample)}
                  className="w-full text-left p-3 rounded-md border hover:bg-muted transition-colors focus:outline-none focus:ring-2 focus:ring-ring"
                  aria-label={`Load sample text: ${sample.substring(0, 50)}...`}
                >
                  <p className="text-sm">
                    {sample.substring(0, 80)}
                    {sample.length > 80 && "..."}
                  </p>
                </button>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
