"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { useAccessibility } from "@/contexts/accessibility-context"
import { AlertTriangle, Phone, MapPin, User, Plus, Trash2, Shield, CheckCircle } from "lucide-react"

interface EmergencyContact {
  id: string
  name: string
  phone: string
  relationship: string
  priority: number
}

interface EmergencyProfile {
  name: string
  medicalConditions: string
  medications: string
  allergies: string
  emergencyMessage: string
}

export function EmergencySOS() {
  const [contacts, setContacts] = useState<EmergencyContact[]>([])
  const [profile, setProfile] = useState<EmergencyProfile>({
    name: "",
    medicalConditions: "",
    medications: "",
    allergies: "",
    emergencyMessage: "This is an emergency. Please send help to my location.",
  })
  const [newContact, setNewContact] = useState({
    name: "",
    phone: "",
    relationship: "",
  })
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null)
  const [locationError, setLocationError] = useState<string | null>(null)
  const [isEmergencyActive, setIsEmergencyActive] = useState(false)
  const [emergencyTimer, setEmergencyTimer] = useState<number | null>(null)

  const { announce } = useAccessibility()

  // Load saved data
  useEffect(() => {
    const savedContacts = localStorage.getItem("emergency-contacts")
    const savedProfile = localStorage.getItem("emergency-profile")

    if (savedContacts) {
      try {
        setContacts(JSON.parse(savedContacts))
      } catch (error) {
        console.error("Failed to load emergency contacts:", error)
      }
    }

    if (savedProfile) {
      try {
        setProfile(JSON.parse(savedProfile))
      } catch (error) {
        console.error("Failed to load emergency profile:", error)
      }
    }
  }, [])

  // Save data
  useEffect(() => {
    localStorage.setItem("emergency-contacts", JSON.stringify(contacts))
  }, [contacts])

  useEffect(() => {
    localStorage.setItem("emergency-profile", JSON.stringify(profile))
  }, [profile])

  // Get current location
  const getCurrentLocation = () => {
    if (!navigator.geolocation) {
      setLocationError("Geolocation is not supported by this browser")
      announce("Geolocation is not supported by this browser")
      return
    }

    announce("Getting your current location...")
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        })
        setLocationError(null)
        announce("Location obtained successfully")
      },
      (error) => {
        let errorMessage = "Unable to get location"
        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMessage = "Location access denied by user"
            break
          case error.POSITION_UNAVAILABLE:
            errorMessage = "Location information unavailable"
            break
          case error.TIMEOUT:
            errorMessage = "Location request timed out"
            break
        }
        setLocationError(errorMessage)
        announce(errorMessage)
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 60000,
      },
    )
  }

  // Add emergency contact
  const handleAddContact = () => {
    if (!newContact.name.trim() || !newContact.phone.trim()) {
      announce("Please enter both name and phone number")
      return
    }

    const contact: EmergencyContact = {
      id: Date.now().toString(),
      name: newContact.name,
      phone: newContact.phone,
      relationship: newContact.relationship || "Emergency Contact",
      priority: contacts.length + 1,
    }

    setContacts([...contacts, contact])
    setNewContact({ name: "", phone: "", relationship: "" })
    announce(`Added emergency contact: ${contact.name}`)
  }

  // Remove emergency contact
  const handleRemoveContact = (contactId: string) => {
    const contactToRemove = contacts.find((c) => c.id === contactId)
    setContacts(contacts.filter((c) => c.id !== contactId))
    announce(`Removed emergency contact: ${contactToRemove?.name}`)
  }

  // Trigger emergency
  const handleEmergency = () => {
    if (contacts.length === 0) {
      announce("No emergency contacts configured. Please add contacts first.")
      return
    }

    setIsEmergencyActive(true)
    announce("Emergency SOS activated. Attempting to contact emergency contacts and get location.")

    // Get location
    getCurrentLocation()

    // Start countdown
    let countdown = 10
    setEmergencyTimer(countdown)

    const timer = setInterval(() => {
      countdown -= 1
      setEmergencyTimer(countdown)

      if (countdown <= 0) {
        clearInterval(timer)
        sendEmergencyMessages()
      }
    }, 1000)
  }

  // Cancel emergency
  const handleCancelEmergency = () => {
    setIsEmergencyActive(false)
    setEmergencyTimer(null)
    announce("Emergency SOS cancelled")
  }

  // Send emergency messages
  const sendEmergencyMessages = () => {
    const locationText = location
      ? `Location: https://maps.google.com/?q=${location.lat},${location.lng}`
      : "Location: Unable to determine location"

    const fullMessage = `${profile.emergencyMessage}\n\nName: ${profile.name}\nMedical Conditions: ${profile.medicalConditions || "None specified"}\nMedications: ${profile.medications || "None specified"}\nAllergies: ${profile.allergies || "None specified"}\n\n${locationText}\n\nSent from AccessibilityHub Emergency SOS`

    // In a real app, this would send actual SMS/calls
    contacts.forEach((contact, index) => {
      setTimeout(() => {
        // Simulate sending message
        console.log(`Sending emergency message to ${contact.name} (${contact.phone}):`, fullMessage)
        announce(`Emergency message sent to ${contact.name}`)
      }, index * 1000)
    })

    setIsEmergencyActive(false)
    setEmergencyTimer(null)
    announce("Emergency messages sent to all contacts")
  }

  // Test emergency system
  const handleTestSystem = () => {
    if (contacts.length === 0) {
      announce("No emergency contacts configured. Please add contacts first.")
      return
    }

    announce("Testing emergency system...")
    getCurrentLocation()

    // Simulate test message
    setTimeout(() => {
      announce("Emergency system test completed. All contacts would receive a test message.")
    }, 2000)
  }

  return (
    <div className="w-full max-w-6xl mx-auto space-y-6">
      {/* Emergency Button */}
      <Card className={`border-2 ${isEmergencyActive ? "border-red-500 bg-red-50" : "border-red-200"}`}>
        <CardContent className="pt-6">
          <div className="text-center space-y-4">
            {isEmergencyActive ? (
              <div className="space-y-4">
                <div className="h-32 w-32 mx-auto bg-red-500 rounded-full flex items-center justify-center animate-pulse">
                  <AlertTriangle className="h-16 w-16 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-red-600">EMERGENCY ACTIVE</h2>
                <p className="text-lg">Sending emergency messages in {emergencyTimer} seconds</p>
                <Button
                  onClick={handleCancelEmergency}
                  size="lg"
                  variant="outline"
                  className="border-red-500 text-red-600 hover:bg-red-50 bg-transparent"
                >
                  Cancel Emergency
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="h-32 w-32 mx-auto bg-red-500 rounded-full flex items-center justify-center hover:bg-red-600 transition-colors cursor-pointer">
                  <AlertTriangle className="h-16 w-16 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-red-600">EMERGENCY SOS</h2>
                <p className="text-muted-foreground max-w-md mx-auto">
                  Press and hold the emergency button to send your location and emergency information to your contacts
                </p>
                <div className="space-y-2">
                  <Button
                    onClick={handleEmergency}
                    size="lg"
                    className="bg-red-500 hover:bg-red-600 text-white px-8 py-4 text-lg"
                    disabled={contacts.length === 0}
                  >
                    <AlertTriangle className="h-6 w-6 mr-2" />
                    EMERGENCY
                  </Button>
                  {contacts.length === 0 && (
                    <p className="text-sm text-red-500">Add emergency contacts below to enable SOS</p>
                  )}
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Emergency Profile */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Emergency Profile
          </CardTitle>
          <CardDescription>This information will be sent to your emergency contacts</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label htmlFor="profile-name" className="text-sm font-medium">
                Full Name
              </label>
              <Input
                id="profile-name"
                value={profile.name}
                onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                placeholder="Your full name"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="medical-conditions" className="text-sm font-medium">
                Medical Conditions
              </label>
              <Input
                id="medical-conditions"
                value={profile.medicalConditions}
                onChange={(e) => setProfile({ ...profile, medicalConditions: e.target.value })}
                placeholder="Diabetes, heart condition, etc."
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="medications" className="text-sm font-medium">
                Current Medications
              </label>
              <Input
                id="medications"
                value={profile.medications}
                onChange={(e) => setProfile({ ...profile, medications: e.target.value })}
                placeholder="Insulin, blood thinners, etc."
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="allergies" className="text-sm font-medium">
                Allergies
              </label>
              <Input
                id="allergies"
                value={profile.allergies}
                onChange={(e) => setProfile({ ...profile, allergies: e.target.value })}
                placeholder="Penicillin, nuts, etc."
              />
            </div>
          </div>

          <div className="space-y-2">
            <label htmlFor="emergency-message" className="text-sm font-medium">
              Emergency Message
            </label>
            <Textarea
              id="emergency-message"
              value={profile.emergencyMessage}
              onChange={(e) => setProfile({ ...profile, emergencyMessage: e.target.value })}
              placeholder="Custom message to send in emergencies"
              className="min-h-[80px]"
            />
          </div>
        </CardContent>
      </Card>

      {/* Emergency Contacts */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Phone className="h-5 w-5" />
            Emergency Contacts
          </CardTitle>
          <CardDescription>Add trusted contacts who will be notified in case of emergency</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Add New Contact */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4 border rounded-lg bg-muted/30">
            <Input
              placeholder="Contact name"
              value={newContact.name}
              onChange={(e) => setNewContact({ ...newContact, name: e.target.value })}
              aria-label="Emergency contact name"
            />

            <Input
              placeholder="Phone number"
              type="tel"
              value={newContact.phone}
              onChange={(e) => setNewContact({ ...newContact, phone: e.target.value })}
              aria-label="Emergency contact phone number"
            />

            <Input
              placeholder="Relationship"
              value={newContact.relationship}
              onChange={(e) => setNewContact({ ...newContact, relationship: e.target.value })}
              aria-label="Relationship to emergency contact"
            />

            <Button onClick={handleAddContact} className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Add Contact
            </Button>
          </div>

          {/* Contact List */}
          {contacts.length > 0 ? (
            <div className="space-y-2">
              {contacts.map((contact, index) => (
                <div key={contact.id} className="flex items-center justify-between p-4 border rounded-lg bg-background">
                  <div className="flex items-center gap-4">
                    <div className="h-10 w-10 bg-accent rounded-full flex items-center justify-center text-accent-foreground font-medium">
                      {index + 1}
                    </div>
                    <div>
                      <p className="font-medium">{contact.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {contact.phone} • {contact.relationship}
                      </p>
                    </div>
                  </div>

                  <Button
                    onClick={() => handleRemoveContact(contact.id)}
                    size="sm"
                    variant="outline"
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              <Phone className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No emergency contacts added yet</p>
              <p className="text-sm">Add contacts above to enable emergency SOS</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Location and Testing */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Location Status */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="h-5 w-5" />
              Location Services
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Current Location</p>
                <p className="text-sm text-muted-foreground">
                  {location
                    ? `${location.lat.toFixed(6)}, ${location.lng.toFixed(6)}`
                    : locationError || "Location not available"}
                </p>
              </div>
              <Button onClick={getCurrentLocation} variant="outline" size="sm">
                Get Location
              </Button>
            </div>

            {locationError && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-md">
                <p className="text-sm text-red-600">{locationError}</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* System Testing */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              System Testing
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Test your emergency system to ensure everything works properly
            </p>

            <div className="space-y-2">
              <Button
                onClick={handleTestSystem}
                variant="outline"
                className="w-full flex items-center gap-2 bg-transparent"
                disabled={contacts.length === 0}
              >
                <CheckCircle className="h-4 w-4" />
                Test Emergency System
              </Button>

              {contacts.length === 0 && (
                <p className="text-xs text-red-500">Add emergency contacts to enable testing</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Important Information */}
      <Card className="border-amber-200 bg-amber-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-amber-800">
            <AlertTriangle className="h-5 w-5" />
            Important Information
          </CardTitle>
        </CardHeader>
        <CardContent className="text-amber-800">
          <ul className="space-y-2 text-sm">
            <li>
              • This is a supplementary emergency tool and should not replace calling 911 or local emergency services
            </li>
            <li>• Ensure your emergency contacts are aware they may receive emergency messages</li>
            <li>• Test your system regularly to ensure it works when needed</li>
            <li>• Keep your emergency profile information up to date</li>
            <li>• Location services must be enabled for accurate location sharing</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  )
}
