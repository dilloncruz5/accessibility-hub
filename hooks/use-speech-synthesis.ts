"use client"

import { useState, useEffect, useCallback } from "react"

interface SpeechSynthesisHook {
  speak: (text: string, options?: SpeechSynthesisUtterance) => void
  stop: () => void
  pause: () => void
  resume: () => void
  speaking: boolean
  supported: boolean
  voices: SpeechSynthesisVoice[]
  selectedVoice: SpeechSynthesisVoice | null
  setSelectedVoice: (voice: SpeechSynthesisVoice) => void
  rate: number
  setRate: (rate: number) => void
  pitch: number
  setPitch: (pitch: number) => void
  volume: number
  setVolume: (volume: number) => void
}

export function useSpeechSynthesis(): SpeechSynthesisHook {
  const [speaking, setSpeaking] = useState(false)
  const [supported, setSupported] = useState(false)
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([])
  const [selectedVoice, setSelectedVoice] = useState<SpeechSynthesisVoice | null>(null)
  const [rate, setRate] = useState(1)
  const [pitch, setPitch] = useState(1)
  const [volume, setVolume] = useState(1)

  useEffect(() => {
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      setSupported(true)

      const loadVoices = () => {
        const availableVoices = window.speechSynthesis.getVoices()
        setVoices(availableVoices)
        if (availableVoices.length > 0 && !selectedVoice) {
          setSelectedVoice(availableVoices[0])
        }
      }

      loadVoices()
      window.speechSynthesis.addEventListener("voiceschanged", loadVoices)

      return () => {
        window.speechSynthesis.removeEventListener("voiceschanged", loadVoices)
      }
    }
  }, [selectedVoice])

  const speak = useCallback(
    (text: string, options?: Partial<SpeechSynthesisUtterance>) => {
      if (!supported) return

      window.speechSynthesis.cancel()

      const utterance = new SpeechSynthesisUtterance(text)
      utterance.voice = selectedVoice
      utterance.rate = rate
      utterance.pitch = pitch
      utterance.volume = volume

      if (options) {
        Object.assign(utterance, options)
      }

      utterance.onstart = () => setSpeaking(true)
      utterance.onend = () => setSpeaking(false)
      utterance.onerror = () => setSpeaking(false)

      window.speechSynthesis.speak(utterance)
    },
    [supported, selectedVoice, rate, pitch, volume],
  )

  const stop = useCallback(() => {
    if (supported) {
      window.speechSynthesis.cancel()
      setSpeaking(false)
    }
  }, [supported])

  const pause = useCallback(() => {
    if (supported) {
      window.speechSynthesis.pause()
    }
  }, [supported])

  const resume = useCallback(() => {
    if (supported) {
      window.speechSynthesis.resume()
    }
  }, [supported])

  return {
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
  }
}
