"use client"

import { useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
import { ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import AccidentMap from "@/components/accident-map"

export default function MapPage() {
  const searchParams = useSearchParams()
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null)

  const accidentId = searchParams.get("id") || "Unknown"
  const accidentLat = Number.parseFloat(searchParams.get("lat") || "0")
  const accidentLng = Number.parseFloat(searchParams.get("lng") || "0")

  useEffect(() => {
    // Set a default user location instead of relying on geolocation
    // This ensures the map works even when geolocation is disabled
    setUserLocation({
      // Default location slightly offset from accident location
      lat: accidentLat - 0.01,
      lng: accidentLng - 0.01,
    })

    // Try to get user's location, but don't rely on it
    if (navigator.geolocation) {
      try {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            setUserLocation({
              lat: position.coords.latitude,
              lng: position.coords.longitude,
            })
          },
          (error) => {
            console.log("Using fallback location - geolocation error:", error.message)
            // We already set a fallback location above, so no need to do anything here
          },
          { timeout: 5000, maximumAge: 60000 },
        )
      } catch (error) {
        console.log("Geolocation API unavailable, using fallback location")
        // Fallback already set above
      }
    }
  }, [accidentLat, accidentLng])

  return (
    <main className="min-h-screen bg-white">
      <div className="container max-w-4xl mx-auto px-4 py-8">
        <div className="flex items-center mb-6">
          <Button variant="ghost" className="mr-2" onClick={() => window.history.back()}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-2xl font-semibold text-gray-900">Accident Location</h1>
        </div>

        <Card className="overflow-hidden shadow-md rounded-lg mb-6">
          <div className="p-4 border-b">
            <h2 className="text-lg font-medium">Accident ID: {accidentId}</h2>
            <p className="text-sm text-gray-600">
              Coordinates: {accidentLat.toFixed(6)}, {accidentLng.toFixed(6)}
            </p>
          </div>

          <div className="h-[500px] relative">
            {userLocation ? (
              <AccidentMap accidentLocation={{ lat: accidentLat, lng: accidentLng }} userLocation={userLocation} />
            ) : (
              <div className="flex items-center justify-center h-full bg-gray-100">
                <p className="text-gray-600">Loading map with simulated location...</p>
              </div>
            )}
          </div>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card className="p-4">
            <h3 className="text-md font-medium mb-2">Emergency Services</h3>
            <ul className="space-y-2 text-sm">
              <li className="flex items-center">
                <span className="w-24 font-medium">Police:</span>
                <span>2.3 miles away (est. 7 min)</span>
              </li>
              <li className="flex items-center">
                <span className="w-24 font-medium">Ambulance:</span>
                <span>1.5 miles away (est. 5 min)</span>
              </li>
              <li className="flex items-center">
                <span className="w-24 font-medium">Fire Dept:</span>
                <span>3.1 miles away (est. 9 min)</span>
              </li>
            </ul>
          </Card>

          <Card className="p-4">
            <h3 className="text-md font-medium mb-2">Accident Details</h3>
            <ul className="space-y-2 text-sm">
              <li className="flex items-center">
                <span className="w-24 font-medium">Type:</span>
                <span>Vehicle Collision</span>
              </li>
              <li className="flex items-center">
                <span className="w-24 font-medium">Vehicles:</span>
                <span>2</span>
              </li>
              <li className="flex items-center">
                <span className="w-24 font-medium">Severity:</span>
                <span className="text-amber-600 font-medium">Medium</span>
              </li>
            </ul>
          </Card>
        </div>
      </div>
    </main>
  )
}

