"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useAccessibility } from "@/contexts/accessibility-context"
import { useSpeechSynthesis } from "@/hooks/use-speech-synthesis"
import { Brain, Type, Volume2, Copy, Download, RotateCcw, FileText, Printer } from "lucide-react"

// Braille character mappings (Grade 1 Braille)
const brailleMap: { [key: string]: string } = {
  a: "⠁",
  b: "⠃",
  c: "⠉",
  d: "⠙",
  e: "⠑",
  f: "⠋",
  g: "⠛",
  h: "⠓",
  i: "⠊",
  j: "⠚",
  k: "⠅",
  l: "⠇",
  m: "⠍",
  n: "⠝",
  o: "⠕",
  p: "⠏",
  q: "⠟",
  r: "⠗",
  s: "⠎",
  t: "⠞",
  u: "⠥",
  v: "⠧",
  w: "⠺",
  x: "⠭",
  y: "⠽",
  z: "⠵",
  "1": "⠁",
  "2": "⠃",
  "3": "⠉",
  "4": "⠙",
  "5": "⠑",
  "6": "⠋",
  "7": "⠛",
  "8": "⠓",
  "9": "⠊",
  "0": "⠚",
  " ": "⠀",
  ".": "⠲",
  ",": "⠂",
  "?": "⠦",
  "!": "⠖",
  "'": "⠄",
  "-": "⠤",
  "/": "⠌",
  ":": "⠒",
  ";": "⠆",
}

// Reverse mapping for Braille to text
const textMap: { [key: string]: string } = Object.fromEntries(
  Object.entries(brailleMap).map(([key, value]) => [value, key]),
)

export function BrailleSupport() {
  const [inputText, setInputText] = useState("")
  const [brailleOutput, setBrailleOutput] = useState("")
  const [brailleInput, setBrailleInput] = useState("")
  const [textOutput, setTextOutput] = useState("")
  const [conversionMode, setConversionMode] = useState<"text-to-braille" | "braille-to-text">("text-to-braille")
  const [brailleGrade, setBrailleGrade] = useState<"grade1" | "grade2">("grade1")

  const { announce } = useAccessibility()
  const { speak, supported: ttsSupported } = useSpeechSynthesis()

  const convertTextToBraille = (text: string): string => {
    return text
      .toLowerCase()
      .split("")
      .map((char) => brailleMap[char] || char)
      .join("")
  }

  const convertBrailleToText = (braille: string): string => {
    return braille
      .split("")
      .map((char) => textMap[char] || char)
      .join("")
  }

  const handleTextToBraille = () => {
    if (!inputText.trim()) {
      announce("Please enter some text to convert to Braille")
      return
    }

    const braille = convertTextToBraille(inputText)
    setBrailleOutput(braille)
    announce("Text converted to Braille successfully")
  }

  const handleBrailleToText = () => {
    if (!brailleInput.trim()) {
      announce("Please enter some Braille to convert to text")
      return
    }

    const text = convertBrailleToText(brailleInput)
    setTextOutput(text)
    announce("Braille converted to text successfully")
  }

  const handleSpeakText = (text: string) => {
    if (text && ttsSupported) {
      speak(text)
      announce("Reading text aloud")
    }
  }

  const handleCopyBraille = async () => {
    if (brailleOutput) {
      try {
        await navigator.clipboard.writeText(brailleOutput)
        announce("Braille text copied to clipboard")
      } catch (error) {
        announce("Failed to copy Braille text to clipboard")
      }
    }
  }

  const handleCopyText = async () => {
    if (textOutput) {
      try {
        await navigator.clipboard.writeText(textOutput)
        announce("Converted text copied to clipboard")
      } catch (error) {
        announce("Failed to copy text to clipboard")
      }
    }
  }

  const handlePrintBraille = () => {
    if (brailleOutput) {
      const printWindow = window.open("", "_blank")
      if (printWindow) {
        printWindow.document.write(`
          <html>
            <head>
              <title>Braille Document</title>
              <style>
                body { 
                  font-family: 'Courier New', monospace; 
                  font-size: 24px; 
                  line-height: 2; 
                  padding: 20px;
                  background: white;
                  color: black;
                }
                .braille-text {
                  letter-spacing: 2px;
                  word-spacing: 8px;
                }
                .original-text {
                  font-size: 14px;
                  color: #666;
                  margin-top: 20px;
                  border-top: 1px solid #ccc;
                  padding-top: 20px;
                }
              </style>
            </head>
            <body>
              <h1>Braille Document</h1>
              <div class="braille-text">${brailleOutput}</div>
              <div class="original-text">
                <strong>Original Text:</strong><br>
                ${inputText}
              </div>
            </body>
          </html>
        `)
        printWindow.document.close()
        printWindow.print()
        announce("Braille document prepared for printing")
      }
    }
  }

  const handleDownloadBraille = () => {
    const content = `Braille Document\n\nOriginal Text:\n${inputText}\n\nBraille:\n${brailleOutput}\n\nGenerated: ${new Date().toLocaleString()}`

    const blob = new Blob([content], { type: "text/plain" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `braille-document-${Date.now()}.txt`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)

    announce("Braille document downloaded as text file")
  }

  const handleClearAll = () => {
    setInputText("")
    setBrailleOutput("")
    setBrailleInput("")
    setTextOutput("")
    announce("All fields cleared")
  }

  const sampleTexts = [
    "Hello World",
    "Welcome to AccessibilityHub",
    "The quick brown fox jumps over the lazy dog",
    "Braille is a tactile writing system used by people who are visually impaired",
  ]

  return (
    <div className="w-full max-w-6xl mx-auto space-y-6">
      {/* Main Braille Interface */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-6 w-6" />
            Braille Support
          </CardTitle>
          <CardDescription>
            Convert between text and Braille with visual dots display and printable output.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Mode Selection */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="space-y-2 flex-1">
              <label htmlFor="conversion-mode" className="text-sm font-medium">
                Conversion Mode
              </label>
              <Select
                value={conversionMode}
                onValueChange={(value: "text-to-braille" | "braille-to-text") => setConversionMode(value)}
              >
                <SelectTrigger id="conversion-mode">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="text-to-braille">Text to Braille</SelectItem>
                  <SelectItem value="braille-to-text">Braille to Text</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2 flex-1">
              <label htmlFor="braille-grade" className="text-sm font-medium">
                Braille Grade
              </label>
              <Select value={brailleGrade} onValueChange={(value: "grade1" | "grade2") => setBrailleGrade(value)}>
                <SelectTrigger id="braille-grade">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="grade1">Grade 1 (Uncontracted)</SelectItem>
                  <SelectItem value="grade2" disabled>
                    Grade 2 (Contracted) - Coming Soon
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Text to Braille Conversion */}
          {conversionMode === "text-to-braille" && (
            <div className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="input-text" className="text-sm font-medium">
                  Enter Text to Convert
                </label>
                <Textarea
                  id="input-text"
                  placeholder="Type your text here..."
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  className="min-h-[100px]"
                  aria-describedby="input-text-help"
                />
                <p id="input-text-help" className="text-xs text-muted-foreground">
                  {inputText.length} characters • Supports letters, numbers, and basic punctuation
                </p>
              </div>

              <div className="flex flex-wrap gap-2">
                <Button onClick={handleTextToBraille} disabled={!inputText.trim()}>
                  <Type className="h-4 w-4 mr-2" />
                  Convert to Braille
                </Button>

                {ttsSupported && (
                  <Button onClick={() => handleSpeakText(inputText)} variant="outline" disabled={!inputText.trim()}>
                    <Volume2 className="h-4 w-4 mr-2" />
                    Listen
                  </Button>
                )}
              </div>

              {/* Braille Output */}
              {brailleOutput && (
                <div className="space-y-4 p-4 border rounded-lg bg-muted/30">
                  <div className="space-y-2">
                    <label htmlFor="braille-output" className="text-sm font-medium">
                      Braille Output
                    </label>
                    <div
                      id="braille-output"
                      className="p-4 bg-background border rounded-md font-mono text-2xl leading-relaxed tracking-wider"
                      style={{ fontFamily: "Courier New, monospace" }}
                      aria-label="Braille representation of the input text"
                    >
                      {brailleOutput}
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    <Button onClick={handleCopyBraille} size="sm" variant="outline">
                      <Copy className="h-3 w-3 mr-2" />
                      Copy Braille
                    </Button>

                    <Button onClick={handlePrintBraille} size="sm" variant="outline">
                      <Printer className="h-3 w-3 mr-2" />
                      Print
                    </Button>

                    <Button onClick={handleDownloadBraille} size="sm" variant="outline">
                      <Download className="h-3 w-3 mr-2" />
                      Download
                    </Button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Braille to Text Conversion */}
          {conversionMode === "braille-to-text" && (
            <div className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="braille-input" className="text-sm font-medium">
                  Enter Braille to Convert
                </label>
                <Textarea
                  id="braille-input"
                  placeholder="Paste Braille characters here..."
                  value={brailleInput}
                  onChange={(e) => setBrailleInput(e.target.value)}
                  className="min-h-[100px] font-mono text-xl"
                  style={{ fontFamily: "Courier New, monospace" }}
                  aria-describedby="braille-input-help"
                />
                <p id="braille-input-help" className="text-xs text-muted-foreground">
                  {brailleInput.length} Braille characters • Paste or type Braille dots
                </p>
              </div>

              <Button onClick={handleBrailleToText} disabled={!brailleInput.trim()}>
                <Brain className="h-4 w-4 mr-2" />
                Convert to Text
              </Button>

              {/* Text Output */}
              {textOutput && (
                <div className="space-y-4 p-4 border rounded-lg bg-muted/30">
                  <div className="space-y-2">
                    <label htmlFor="text-output" className="text-sm font-medium">
                      Text Output
                    </label>
                    <div
                      id="text-output"
                      className="p-4 bg-background border rounded-md text-lg"
                      aria-label="Text representation of the Braille input"
                    >
                      {textOutput}
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    <Button onClick={handleCopyText} size="sm" variant="outline">
                      <Copy className="h-3 w-3 mr-2" />
                      Copy Text
                    </Button>

                    {ttsSupported && (
                      <Button onClick={() => handleSpeakText(textOutput)} size="sm" variant="outline">
                        <Volume2 className="h-3 w-3 mr-2" />
                        Listen
                      </Button>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Clear Button */}
          <div className="pt-4 border-t">
            <Button onClick={handleClearAll} variant="outline">
              <RotateCcw className="h-4 w-4 mr-2" />
              Clear All
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Sample Texts */}
      {conversionMode === "text-to-braille" && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Sample Texts
            </CardTitle>
            <CardDescription>Try these sample texts to explore Braille conversion</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {sampleTexts.map((sample, index) => (
                <button
                  key={index}
                  onClick={() => setInputText(sample)}
                  className="text-left p-3 rounded-md border hover:bg-muted transition-colors focus:outline-none focus:ring-2 focus:ring-ring"
                  aria-label={`Load sample text: ${sample}`}
                >
                  <p className="text-sm">{sample}</p>
                </button>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Braille Information */}
      <Card>
        <CardHeader>
          <CardTitle>About Braille</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium mb-2">Grade 1 Braille (Uncontracted)</h4>
              <ul className="space-y-1 text-sm text-muted-foreground">
                <li>• Each letter is represented by its own Braille character</li>
                <li>• Direct one-to-one correspondence with print letters</li>
                <li>• Easier to learn and understand</li>
                <li>• Used for beginners and specific applications</li>
              </ul>
            </div>

            <div>
              <h4 className="font-medium mb-2">Features</h4>
              <ul className="space-y-1 text-sm text-muted-foreground">
                <li>• Visual Braille dots display</li>
                <li>• Printable output for tactile reading</li>
                <li>• Copy and download functionality</li>
                <li>• Text-to-speech integration</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
