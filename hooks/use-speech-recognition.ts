"use client"

import { useState, useEffect, useCallback, useRef } from "react"
import type { SpeechRecognition, SpeechRecognitionEvent } from "web-speech-api"

interface SpeechRecognitionHook {
  transcript: string
  listening: boolean
  supported: boolean
  start: () => void
  stop: () => void
  reset: () => void
  language: string
  setLanguage: (language: string) => void
  continuous: boolean
  setContinuous: (continuous: boolean) => void
  interimResults: boolean
  setInterimResults: (interimResults: boolean) => void
}

export function useSpeechRecognition(): SpeechRecognitionHook {
  const [transcript, setTranscript] = useState("")
  const [listening, setListening] = useState(false)
  const [supported, setSupported] = useState(false)
  const [language, setLanguage] = useState("en-US")
  const [continuous, setContinuous] = useState(true)
  const [interimResults, setInterimResults] = useState(true)

  const recognitionRef = useRef<SpeechRecognition | null>(null)

  useEffect(() => {
    if (typeof window !== "undefined") {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
      if (SpeechRecognition) {
        setSupported(true)
        recognitionRef.current = new SpeechRecognition()
      }
    }
  }, [])

  useEffect(() => {
    if (!recognitionRef.current) return

    const recognition = recognitionRef.current
    recognition.continuous = continuous
    recognition.interimResults = interimResults
    recognition.lang = language

    recognition.onstart = () => setListening(true)
    recognition.onend = () => setListening(false)
    recognition.onerror = () => setListening(false)

    recognition.onresult = (event: SpeechRecognitionEvent) => {
      let finalTranscript = ""
      let interimTranscript = ""

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const result = event.results[i]
        if (result.isFinal) {
          finalTranscript += result[0].transcript
        } else {
          interimTranscript += result[0].transcript
        }
      }

      setTranscript((prev) => prev + finalTranscript + interimTranscript)
    }
  }, [continuous, interimResults, language])

  const start = useCallback(() => {
    if (recognitionRef.current && supported) {
      recognitionRef.current.start()
    }
  }, [supported])

  const stop = useCallback(() => {
    if (recognitionRef.current && supported) {
      recognitionRef.current.stop()
    }
  }, [supported])

  const reset = useCallback(() => {
    setTranscript("")
  }, [])

  return {
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
  }
}
