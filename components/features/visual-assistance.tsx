"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { useAccessibility } from "@/contexts/accessibility-context"
import { useSpeechSynthesis } from "@/hooks/use-speech-synthesis"
import { Eye, Upload, FileImage, Volume2, Copy, Download, Loader2 } from "lucide-react"

export function VisualAssistance() {
  const [selectedImage, setSelectedImage] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [description, setDescription] = useState("")
  const [extractedText, setExtractedText] = useState("")
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [analysisType, setAnalysisType] = useState<"description" | "ocr" | null>(null)

  const fileInputRef = useRef<HTMLInputElement>(null)
  const { announce } = useAccessibility()
  const { speak, supported: ttsSupported } = useSpeechSynthesis()

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      setSelectedImage(file)
      setDescription("")
      setExtractedText("")

      // Create preview
      const reader = new FileReader()
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string)
      }
      reader.readAsDataURL(file)

      announce(`Image selected: ${file.name}`)
    }
  }

  const handleDragOver = (event: React.DragEvent) => {
    event.preventDefault()
  }

  const handleDrop = (event: React.DragEvent) => {
    event.preventDefault()
    const file = event.dataTransfer.files[0]
    if (file && file.type.startsWith("image/")) {
      setSelectedImage(file)
      setDescription("")
      setExtractedText("")

      // Create preview
      const reader = new FileReader()
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string)
      }
      reader.readAsDataURL(file)

      announce(`Image dropped: ${file.name}`)
    }
  }

  const analyzeImage = async (type: "description" | "ocr") => {
    if (!selectedImage) return

    setIsAnalyzing(true)
    setAnalysisType(type)

    try {
      // Simulate AI analysis (in a real app, this would call an AI service)
      await new Promise((resolve) => setTimeout(resolve, 2000))

      if (type === "description") {
        const mockDescription = `This image appears to show a ${selectedImage.name.includes("document") ? "document or text-based content" : "scene with various objects and elements"}. The image contains visual elements that would benefit from detailed description for accessibility purposes. In a production environment, this would be analyzed by computer vision AI to provide accurate, detailed descriptions of the visual content.`
        setDescription(mockDescription)
        announce("Image description generated successfully")
      } else {
        const mockText = `This is extracted text from the image. In a production environment, OCR (Optical Character Recognition) would analyze the image and extract any readable text content. The extracted text would appear here and could be read aloud or copied for further use.`
        setExtractedText(mockText)
        announce("Text extracted from image successfully")
      }
    } catch (error) {
      announce("Failed to analyze image. Please try again.")
    } finally {
      setIsAnalyzing(false)
      setAnalysisType(null)
    }
  }

  const handleSpeakDescription = () => {
    if (description) {
      speak(description)
      announce("Reading image description aloud")
    }
  }

  const handleSpeakExtractedText = () => {
    if (extractedText) {
      speak(extractedText)
      announce("Reading extracted text aloud")
    }
  }

  const handleCopyDescription = async () => {
    if (description) {
      try {
        await navigator.clipboard.writeText(description)
        announce("Image description copied to clipboard")
      } catch (error) {
        announce("Failed to copy description to clipboard")
      }
    }
  }

  const handleCopyExtractedText = async () => {
    if (extractedText) {
      try {
        await navigator.clipboard.writeText(extractedText)
        announce("Extracted text copied to clipboard")
      } catch (error) {
        announce("Failed to copy text to clipboard")
      }
    }
  }

  const handleDownloadResults = () => {
    const content = `Image Analysis Results\n\nFile: ${selectedImage?.name}\nDate: ${new Date().toLocaleString()}\n\n${description ? `Description:\n${description}\n\n` : ""}${extractedText ? `Extracted Text:\n${extractedText}` : ""}`

    const blob = new Blob([content], { type: "text/plain" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `image-analysis-${Date.now()}.txt`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)

    announce("Analysis results downloaded as text file")
  }

  return (
    <div className="w-full max-w-6xl mx-auto space-y-6">
      {/* Main Visual Assistance Interface */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Eye className="h-6 w-6" />
            Visual Assistance
          </CardTitle>
          <CardDescription>
            Upload images to get AI-powered descriptions and extract text using OCR technology.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Image Upload Area */}
          <div className="space-y-4">
            <label className="text-sm font-medium">Upload Image</label>
            <div
              className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-8 text-center hover:border-muted-foreground/50 transition-colors"
              onDragOver={handleDragOver}
              onDrop={handleDrop}
            >
              {imagePreview ? (
                <div className="space-y-4">
                  <img
                    src={imagePreview || "/placeholder.svg"}
                    alt="Uploaded image preview"
                    className="max-w-full max-h-64 mx-auto rounded-lg shadow-md"
                  />
                  <p className="text-sm text-muted-foreground">
                    {selectedImage?.name} ({Math.round((selectedImage?.size || 0) / 1024)} KB)
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="mx-auto h-16 w-16 rounded-full bg-muted flex items-center justify-center">
                    <FileImage className="h-8 w-8 text-muted-foreground" />
                  </div>
                  <div>
                    <p className="text-lg font-medium">Drop an image here or click to upload</p>
                    <p className="text-sm text-muted-foreground">Supports JPG, PNG, GIF, WebP files up to 10MB</p>
                  </div>
                </div>
              )}

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="sr-only"
                aria-describedby="upload-help"
              />
              <Button onClick={() => fileInputRef.current?.click()} variant="outline" className="mt-4">
                <Upload className="h-4 w-4 mr-2" />
                Choose Image
              </Button>
            </div>
            <p id="upload-help" className="text-xs text-muted-foreground">
              Upload an image to get AI-powered descriptions or extract text content
            </p>
          </div>

          {/* Analysis Buttons */}
          {selectedImage && (
            <div className="flex flex-wrap gap-4 pt-4 border-t">
              <Button
                onClick={() => analyzeImage("description")}
                disabled={isAnalyzing}
                className="flex items-center gap-2"
              >
                {isAnalyzing && analysisType === "description" ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
                Get Description
              </Button>

              <Button
                onClick={() => analyzeImage("ocr")}
                disabled={isAnalyzing}
                variant="outline"
                className="flex items-center gap-2"
              >
                {isAnalyzing && analysisType === "ocr" ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <FileImage className="h-4 w-4" />
                )}
                Extract Text (OCR)
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Results Section */}
      {(description || extractedText) && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Image Description */}
          {description && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Eye className="h-5 w-5" />
                  Image Description
                </CardTitle>
                <CardDescription>AI-generated description of the visual content</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Textarea
                  value={description}
                  readOnly
                  className="min-h-[120px] resize-y"
                  aria-label="AI-generated image description"
                />

                <div className="flex flex-wrap gap-2">
                  {ttsSupported && (
                    <Button onClick={handleSpeakDescription} size="sm" className="flex items-center gap-2">
                      <Volume2 className="h-3 w-3" />
                      Listen
                    </Button>
                  )}

                  <Button
                    onClick={handleCopyDescription}
                    size="sm"
                    variant="outline"
                    className="flex items-center gap-2 bg-transparent"
                  >
                    <Copy className="h-3 w-3" />
                    Copy
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Extracted Text */}
          {extractedText && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileImage className="h-5 w-5" />
                  Extracted Text
                </CardTitle>
                <CardDescription>Text content extracted using OCR technology</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Textarea
                  value={extractedText}
                  readOnly
                  className="min-h-[120px] resize-y"
                  aria-label="Text extracted from image using OCR"
                />

                <div className="flex flex-wrap gap-2">
                  {ttsSupported && (
                    <Button onClick={handleSpeakExtractedText} size="sm" className="flex items-center gap-2">
                      <Volume2 className="h-3 w-3" />
                      Listen
                    </Button>
                  )}

                  <Button
                    onClick={handleCopyExtractedText}
                    size="sm"
                    variant="outline"
                    className="flex items-center gap-2 bg-transparent"
                  >
                    <Copy className="h-3 w-3" />
                    Copy
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      )}

      {/* Download Results */}
      {(description || extractedText) && (
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium">Export Results</h3>
                <p className="text-sm text-muted-foreground">Download the analysis results as a text file</p>
              </div>
              <Button
                onClick={handleDownloadResults}
                variant="outline"
                className="flex items-center gap-2 bg-transparent"
              >
                <Download className="h-4 w-4" />
                Download
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Tips and Information */}
      <Card>
        <CardHeader>
          <CardTitle>Tips for Better Results</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium mb-2">Image Description</h4>
              <ul className="space-y-1 text-sm text-muted-foreground">
                <li>• Works best with clear, well-lit images</li>
                <li>• Provides detailed descriptions of objects, people, and scenes</li>
                <li>• Includes information about colors, composition, and context</li>
                <li>• Useful for understanding visual content</li>
              </ul>
            </div>

            <div>
              <h4 className="font-medium mb-2">Text Extraction (OCR)</h4>
              <ul className="space-y-1 text-sm text-muted-foreground">
                <li>• Best with high-contrast text on plain backgrounds</li>
                <li>• Supports multiple languages and fonts</li>
                <li>• Works with documents, signs, and printed text</li>
                <li>• Extracted text can be read aloud or copied</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
