"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useAccessibility } from "@/contexts/accessibility-context"
import { useSpeechSynthesis } from "@/hooks/use-speech-synthesis"
import { MessageSquare, Volume2, Plus, Trash2, Grid3X3, RotateCcw, Download, Settings } from "lucide-react"

interface Symbol {
  id: string
  text: string
  category: string
  emoji: string
  color: string
}

const defaultSymbols: Symbol[] = [
  // Basic Needs
  { id: "1", text: "I want", category: "basic", emoji: "👋", color: "bg-blue-100 text-blue-800" },
  { id: "2", text: "I need", category: "basic", emoji: "🙋", color: "bg-blue-100 text-blue-800" },
  { id: "3", text: "Help", category: "basic", emoji: "🆘", color: "bg-red-100 text-red-800" },
  { id: "4", text: "Please", category: "basic", emoji: "🙏", color: "bg-green-100 text-green-800" },
  { id: "5", text: "Thank you", category: "basic", emoji: "🙏", color: "bg-green-100 text-green-800" },
  { id: "6", text: "Yes", category: "basic", emoji: "✅", color: "bg-green-100 text-green-800" },
  { id: "7", text: "No", category: "basic", emoji: "❌", color: "bg-red-100 text-red-800" },
  { id: "8", text: "Stop", category: "basic", emoji: "🛑", color: "bg-red-100 text-red-800" },

  // Feelings
  { id: "9", text: "Happy", category: "feelings", emoji: "😊", color: "bg-yellow-100 text-yellow-800" },
  { id: "10", text: "Sad", category: "feelings", emoji: "😢", color: "bg-blue-100 text-blue-800" },
  { id: "11", text: "Angry", category: "feelings", emoji: "😠", color: "bg-red-100 text-red-800" },
  { id: "12", text: "Tired", category: "feelings", emoji: "😴", color: "bg-purple-100 text-purple-800" },
  { id: "13", text: "Hungry", category: "feelings", emoji: "🍽️", color: "bg-orange-100 text-orange-800" },
  { id: "14", text: "Thirsty", category: "feelings", emoji: "🥤", color: "bg-blue-100 text-blue-800" },

  // Actions
  { id: "15", text: "Go", category: "actions", emoji: "🚶", color: "bg-green-100 text-green-800" },
  { id: "16", text: "Come", category: "actions", emoji: "👋", color: "bg-green-100 text-green-800" },
  { id: "17", text: "Eat", category: "actions", emoji: "🍽️", color: "bg-orange-100 text-orange-800" },
  { id: "18", text: "Drink", category: "actions", emoji: "🥤", color: "bg-blue-100 text-blue-800" },
  { id: "19", text: "Sleep", category: "actions", emoji: "🛏️", color: "bg-purple-100 text-purple-800" },
  { id: "20", text: "Play", category: "actions", emoji: "🎮", color: "bg-pink-100 text-pink-800" },

  // Places
  { id: "21", text: "Home", category: "places", emoji: "🏠", color: "bg-brown-100 text-brown-800" },
  { id: "22", text: "School", category: "places", emoji: "🏫", color: "bg-blue-100 text-blue-800" },
  { id: "23", text: "Hospital", category: "places", emoji: "🏥", color: "bg-red-100 text-red-800" },
  { id: "24", text: "Store", category: "places", emoji: "🏪", color: "bg-green-100 text-green-800" },
]

const categories = [
  { id: "all", label: "All Symbols", color: "bg-gray-100 text-gray-800" },
  { id: "basic", label: "Basic Needs", color: "bg-blue-100 text-blue-800" },
  { id: "feelings", label: "Feelings", color: "bg-yellow-100 text-yellow-800" },
  { id: "actions", label: "Actions", color: "bg-green-100 text-green-800" },
  { id: "places", label: "Places", color: "bg-purple-100 text-purple-800" },
]

export function AACCommunication() {
  const [symbols, setSymbols] = useState<Symbol[]>(defaultSymbols)
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [sentence, setSentence] = useState<Symbol[]>([])
  const [gridSize, setGridSize] = useState<"small" | "medium" | "large">("medium")
  const [isEditing, setIsEditing] = useState(false)
  const [newSymbol, setNewSymbol] = useState({ text: "", emoji: "", category: "basic" })

  const { announce } = useAccessibility()
  const { speak, supported: ttsSupported } = useSpeechSynthesis()

  // Load saved symbols and settings
  useEffect(() => {
    const savedSymbols = localStorage.getItem("aac-symbols")
    const savedSettings = localStorage.getItem("aac-settings")

    if (savedSymbols) {
      try {
        setSymbols(JSON.parse(savedSymbols))
      } catch (error) {
        console.error("Failed to load saved symbols:", error)
      }
    }

    if (savedSettings) {
      try {
        const settings = JSON.parse(savedSettings)
        setGridSize(settings.gridSize || "medium")
      } catch (error) {
        console.error("Failed to load saved settings:", error)
      }
    }
  }, [])

  // Save symbols and settings
  useEffect(() => {
    localStorage.setItem("aac-symbols", JSON.stringify(symbols))
  }, [symbols])

  useEffect(() => {
    localStorage.setItem("aac-settings", JSON.stringify({ gridSize }))
  }, [gridSize])

  const filteredSymbols =
    selectedCategory === "all" ? symbols : symbols.filter((symbol) => symbol.category === selectedCategory)

  const handleSymbolClick = (symbol: Symbol) => {
    const newSentence = [...sentence, symbol]
    setSentence(newSentence)
    announce(`Added ${symbol.text} to sentence`)
  }

  const handleSpeakSentence = () => {
    if (sentence.length === 0) {
      announce("No symbols selected to speak")
      return
    }

    const text = sentence.map((symbol) => symbol.text).join(" ")
    speak(text)
    announce(`Speaking: ${text}`)
  }

  const handleClearSentence = () => {
    setSentence([])
    announce("Sentence cleared")
  }

  const handleRemoveFromSentence = (index: number) => {
    const removedSymbol = sentence[index]
    const newSentence = sentence.filter((_, i) => i !== index)
    setSentence(newSentence)
    announce(`Removed ${removedSymbol.text} from sentence`)
  }

  const handleAddSymbol = () => {
    if (!newSymbol.text.trim() || !newSymbol.emoji.trim()) {
      announce("Please enter both text and emoji for the new symbol")
      return
    }

    const symbol: Symbol = {
      id: Date.now().toString(),
      text: newSymbol.text,
      emoji: newSymbol.emoji,
      category: newSymbol.category,
      color: categories.find((c) => c.id === newSymbol.category)?.color || "bg-gray-100 text-gray-800",
    }

    setSymbols([...symbols, symbol])
    setNewSymbol({ text: "", emoji: "", category: "basic" })
    announce(`Added new symbol: ${symbol.text}`)
  }

  const handleDeleteSymbol = (symbolId: string) => {
    const symbolToDelete = symbols.find((s) => s.id === symbolId)
    setSymbols(symbols.filter((s) => s.id !== symbolId))
    announce(`Deleted symbol: ${symbolToDelete?.text}`)
  }

  const handleExportBoard = () => {
    const boardData = {
      symbols,
      settings: { gridSize },
      exportDate: new Date().toISOString(),
    }

    const blob = new Blob([JSON.stringify(boardData, null, 2)], { type: "application/json" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `aac-board-${Date.now()}.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)

    announce("Communication board exported successfully")
  }

  const getGridClasses = () => {
    switch (gridSize) {
      case "small":
        return "grid-cols-6 md:grid-cols-8 lg:grid-cols-10"
      case "medium":
        return "grid-cols-4 md:grid-cols-6 lg:grid-cols-8"
      case "large":
        return "grid-cols-3 md:grid-cols-4 lg:grid-cols-6"
      default:
        return "grid-cols-4 md:grid-cols-6 lg:grid-cols-8"
    }
  }

  const getSymbolSize = () => {
    switch (gridSize) {
      case "small":
        return "h-16 w-16 text-xs"
      case "medium":
        return "h-20 w-20 text-sm"
      case "large":
        return "h-24 w-24 text-base"
      default:
        return "h-20 w-20 text-sm"
    }
  }

  return (
    <div className="w-full max-w-7xl mx-auto space-y-6">
      {/* Header and Controls */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="h-6 w-6" />
            AAC Communication Board
          </CardTitle>
          <CardDescription>
            Symbol-based communication with customizable layouts and text-to-speech integration.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Settings Row */}
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-2">
              <label htmlFor="category-select" className="text-sm font-medium">
                Category:
              </label>
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger id="category-select" className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category.id} value={category.id}>
                      {category.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center gap-2">
              <label htmlFor="grid-size" className="text-sm font-medium">
                Size:
              </label>
              <Select value={gridSize} onValueChange={(value: "small" | "medium" | "large") => setGridSize(value)}>
                <SelectTrigger id="grid-size" className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="small">Small</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="large">Large</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Button
              onClick={() => setIsEditing(!isEditing)}
              variant="outline"
              size="sm"
              className="flex items-center gap-2"
            >
              <Settings className="h-4 w-4" />
              {isEditing ? "Done Editing" : "Edit Board"}
            </Button>

            <Button
              onClick={handleExportBoard}
              variant="outline"
              size="sm"
              className="flex items-center gap-2 bg-transparent"
            >
              <Download className="h-4 w-4" />
              Export
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Sentence Builder */}
      <Card>
        <CardHeader>
          <CardTitle>Sentence Builder</CardTitle>
          <CardDescription>Tap symbols to build your message, then speak it aloud</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Sentence Display */}
          <div className="min-h-[80px] p-4 border-2 border-dashed border-muted-foreground/25 rounded-lg bg-muted/10">
            {sentence.length === 0 ? (
              <p className="text-muted-foreground text-center py-4">Tap symbols below to build your sentence</p>
            ) : (
              <div className="flex flex-wrap gap-2">
                {sentence.map((symbol, index) => (
                  <button
                    key={`${symbol.id}-${index}`}
                    onClick={() => handleRemoveFromSentence(index)}
                    className={`flex items-center gap-2 px-3 py-2 rounded-md ${symbol.color} hover:opacity-80 transition-opacity focus:outline-none focus:ring-2 focus:ring-ring`}
                    aria-label={`Remove ${symbol.text} from sentence`}
                  >
                    <span className="text-lg">{symbol.emoji}</span>
                    <span className="font-medium">{symbol.text}</span>
                    <Trash2 className="h-3 w-3" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Sentence Controls */}
          <div className="flex flex-wrap gap-2">
            {ttsSupported && (
              <Button
                onClick={handleSpeakSentence}
                disabled={sentence.length === 0}
                className="flex items-center gap-2"
              >
                <Volume2 className="h-4 w-4" />
                Speak Sentence
              </Button>
            )}

            <Button
              onClick={handleClearSentence}
              disabled={sentence.length === 0}
              variant="outline"
              className="flex items-center gap-2 bg-transparent"
            >
              <RotateCcw className="h-4 w-4" />
              Clear
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Add New Symbol (when editing) */}
      {isEditing && (
        <Card>
          <CardHeader>
            <CardTitle>Add New Symbol</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Input
                placeholder="Symbol text"
                value={newSymbol.text}
                onChange={(e) => setNewSymbol({ ...newSymbol, text: e.target.value })}
                aria-label="New symbol text"
              />

              <Input
                placeholder="Emoji (e.g., 😊)"
                value={newSymbol.emoji}
                onChange={(e) => setNewSymbol({ ...newSymbol, emoji: e.target.value })}
                aria-label="New symbol emoji"
              />

              <Select
                value={newSymbol.category}
                onValueChange={(value) => setNewSymbol({ ...newSymbol, category: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  {categories
                    .filter((c) => c.id !== "all")
                    .map((category) => (
                      <SelectItem key={category.id} value={category.id}>
                        {category.label}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>

              <Button onClick={handleAddSymbol} className="flex items-center gap-2">
                <Plus className="h-4 w-4" />
                Add Symbol
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Symbol Grid */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Grid3X3 className="h-5 w-5" />
            Communication Symbols
            <span className="text-sm font-normal text-muted-foreground">({filteredSymbols.length} symbols)</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className={`grid gap-3 ${getGridClasses()}`}>
            {filteredSymbols.map((symbol) => (
              <div key={symbol.id} className="relative">
                <button
                  onClick={() => handleSymbolClick(symbol)}
                  className={`${getSymbolSize()} ${symbol.color} rounded-lg border-2 border-transparent hover:border-accent focus:border-accent focus:outline-none transition-all duration-200 flex flex-col items-center justify-center gap-1 p-2`}
                  aria-label={`Add ${symbol.text} to sentence`}
                >
                  <span className="text-2xl">{symbol.emoji}</span>
                  <span className="font-medium text-center leading-tight">{symbol.text}</span>
                </button>

                {isEditing && (
                  <button
                    onClick={() => handleDeleteSymbol(symbol.id)}
                    className="absolute -top-2 -right-2 h-6 w-6 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500"
                    aria-label={`Delete ${symbol.text} symbol`}
                  >
                    <Trash2 className="h-3 w-3" />
                  </button>
                )}
              </div>
            ))}
          </div>

          {filteredSymbols.length === 0 && (
            <div className="text-center py-8">
              <p className="text-muted-foreground">No symbols found in this category.</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Usage Tips */}
      <Card>
        <CardHeader>
          <CardTitle>How to Use</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium mb-2">Building Sentences</h4>
              <ul className="space-y-1 text-sm text-muted-foreground">
                <li>• Tap symbols to add them to your sentence</li>
                <li>• Symbols appear in the sentence builder above</li>
                <li>• Tap the speak button to hear your message</li>
                <li>• Remove symbols by clicking them in the sentence</li>
              </ul>
            </div>

            <div>
              <h4 className="font-medium mb-2">Customization</h4>
              <ul className="space-y-1 text-sm text-muted-foreground">
                <li>• Filter symbols by category for easier access</li>
                <li>• Adjust symbol size for better visibility</li>
                <li>• Add custom symbols with your own text and emojis</li>
                <li>• Export your board to save or share settings</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
