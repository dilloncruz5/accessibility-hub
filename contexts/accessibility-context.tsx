"use client"

import type React from "react"
import { createContext, useContext, useReducer, useEffect } from "react"

interface AccessibilityState {
  fontSize: "sm" | "base" | "lg" | "xl" | "2xl"
  highContrast: boolean
  reducedMotion: boolean
  screenReaderMode: boolean
  keyboardNavigation: boolean
  voiceCommands: boolean
  announcements: string[]
}

type AccessibilityAction =
  | { type: "SET_FONT_SIZE"; payload: AccessibilityState["fontSize"] }
  | { type: "TOGGLE_HIGH_CONTRAST" }
  | { type: "TOGGLE_REDUCED_MOTION" }
  | { type: "TOGGLE_SCREEN_READER_MODE" }
  | { type: "TOGGLE_KEYBOARD_NAVIGATION" }
  | { type: "TOGGLE_VOICE_COMMANDS" }
  | { type: "ADD_ANNOUNCEMENT"; payload: string }
  | { type: "CLEAR_ANNOUNCEMENTS" }
  | { type: "LOAD_SETTINGS"; payload: Partial<AccessibilityState> }

const initialState: AccessibilityState = {
  fontSize: "base",
  highContrast: false,
  reducedMotion: false,
  screenReaderMode: false,
  keyboardNavigation: true,
  voiceCommands: false,
  announcements: [],
}

function accessibilityReducer(state: AccessibilityState, action: AccessibilityAction): AccessibilityState {
  switch (action.type) {
    case "SET_FONT_SIZE":
      return { ...state, fontSize: action.payload }
    case "TOGGLE_HIGH_CONTRAST":
      return { ...state, highContrast: !state.highContrast }
    case "TOGGLE_REDUCED_MOTION":
      return { ...state, reducedMotion: !state.reducedMotion }
    case "TOGGLE_SCREEN_READER_MODE":
      return { ...state, screenReaderMode: !state.screenReaderMode }
    case "TOGGLE_KEYBOARD_NAVIGATION":
      return { ...state, keyboardNavigation: !state.keyboardNavigation }
    case "TOGGLE_VOICE_COMMANDS":
      return { ...state, voiceCommands: !state.voiceCommands }
    case "ADD_ANNOUNCEMENT":
      return { ...state, announcements: [...state.announcements, action.payload] }
    case "CLEAR_ANNOUNCEMENTS":
      return { ...state, announcements: [] }
    case "LOAD_SETTINGS":
      return { ...state, ...action.payload }
    default:
      return state
  }
}

interface AccessibilityContextType {
  state: AccessibilityState
  dispatch: React.Dispatch<AccessibilityAction>
  announce: (message: string) => void
}

const AccessibilityContext = createContext<AccessibilityContextType | undefined>(undefined)

export function AccessibilityProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(accessibilityReducer, initialState)

  // Load settings from localStorage on mount
  useEffect(() => {
    const savedSettings = localStorage.getItem("accessibility-settings")
    if (savedSettings) {
      try {
        const parsed = JSON.parse(savedSettings)
        dispatch({ type: "LOAD_SETTINGS", payload: parsed })
      } catch (error) {
        console.error("Failed to load accessibility settings:", error)
      }
    }
  }, [])

  // Save settings to localStorage when state changes
  useEffect(() => {
    const settingsToSave = {
      fontSize: state.fontSize,
      highContrast: state.highContrast,
      reducedMotion: state.reducedMotion,
      screenReaderMode: state.screenReaderMode,
      keyboardNavigation: state.keyboardNavigation,
      voiceCommands: state.voiceCommands,
    }
    localStorage.setItem("accessibility-settings", JSON.stringify(settingsToSave))
  }, [state])

  // Apply font size class to document
  useEffect(() => {
    document.documentElement.className = document.documentElement.className.replace(/font-scale-\w+/g, "")
    document.documentElement.classList.add(`font-scale-${state.fontSize}`)
  }, [state.fontSize])

  // Apply high contrast mode
  useEffect(() => {
    if (state.highContrast) {
      document.documentElement.classList.add("high-contrast")
    } else {
      document.documentElement.classList.remove("high-contrast")
    }
  }, [state.highContrast])

  const announce = (message: string) => {
    dispatch({ type: "ADD_ANNOUNCEMENT", payload: message })
    // Clear announcement after 5 seconds
    setTimeout(() => {
      dispatch({ type: "CLEAR_ANNOUNCEMENTS" })
    }, 5000)
  }

  return (
    <AccessibilityContext.Provider value={{ state, dispatch, announce }}>
      {children}
      {/* Live region for screen reader announcements */}
      <div aria-live="polite" aria-atomic="true" className="sr-only" role="status">
        {state.announcements.map((announcement, index) => (
          <div key={index}>{announcement}</div>
        ))}
      </div>
    </AccessibilityContext.Provider>
  )
}

export function useAccessibility() {
  const context = useContext(AccessibilityContext)
  if (context === undefined) {
    throw new Error("useAccessibility must be used within an AccessibilityProvider")
  }
  return context
}
