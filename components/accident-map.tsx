"use client"

import { useEffect, useRef } from "react"

interface AccidentMapProps {
  accidentLocation: { lat: number; lng: number }
  userLocation: { lat: number; lng: number }
}

export default function AccidentMap({ accidentLocation, userLocation }: AccidentMapProps) {
  const mapRef = useRef<HTMLDivElement>(null)

  // Calculate if we're using a fallback location (will be true when locations are very close)
  const isUsingFallback =
    Math.abs(userLocation.lat - (accidentLocation.lat - 0.01)) < 0.001 &&
    Math.abs(userLocation.lng - (accidentLocation.lng - 0.01)) < 0.001

  useEffect(() => {
    // This is a placeholder for actual map implementation
    // In a real application, you would use a mapping library like Google Maps, Mapbox, or Leaflet

    if (!mapRef.current) return

    const mapElement = mapRef.current

    // Create a simple visual representation of the map
    const canvas = document.createElement("canvas")
    canvas.width = mapElement.clientWidth
    canvas.height = mapElement.clientHeight
    mapElement.appendChild(canvas)

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Draw a simple map representation
    ctx.fillStyle = "#f0f0f0"
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    // Draw some "roads"
    ctx.strokeStyle = "#ddd"
    ctx.lineWidth = 10

    // Horizontal roads
    for (let y = 50; y < canvas.height; y += 100) {
      ctx.beginPath()
      ctx.moveTo(0, y)
      ctx.lineTo(canvas.width, y)
      ctx.stroke()
    }

    // Vertical roads
    for (let x = 50; x < canvas.width; x += 100) {
      ctx.beginPath()
      ctx.moveTo(x, 0)
      ctx.lineTo(x, canvas.height)
      ctx.stroke()
    }

    // Calculate positions (in this simple example, we're just mapping the coordinates to the canvas)
    const normalizePosition = (lat: number, lng: number) => {
      // This is a very simplified mapping - in a real app you'd use proper geo projection
      const x = (lng - accidentLocation.lng) * 10000 + canvas.width / 2
      const y = (accidentLocation.lat - lat) * 10000 + canvas.height / 2
      return { x, y }
    }

    const accidentPos = normalizePosition(accidentLocation.lat, accidentLocation.lng)
    const userPos = normalizePosition(userLocation.lat, userLocation.lng)

    // Draw route
    ctx.strokeStyle = "#3b82f6"
    ctx.lineWidth = 3
    ctx.beginPath()
    ctx.moveTo(userPos.x, userPos.y)
    ctx.lineTo(accidentPos.x, accidentPos.y)
    ctx.stroke()

    // Draw user location
    ctx.fillStyle = "#3b82f6"
    ctx.beginPath()
    ctx.arc(userPos.x, userPos.y, 8, 0, Math.PI * 2)
    ctx.fill()

    // Draw accident location
    ctx.fillStyle = "#ef4444"
    ctx.beginPath()
    ctx.arc(accidentPos.x, accidentPos.y, 10, 0, Math.PI * 2)
    ctx.fill()

    // Add labels
    ctx.fillStyle = "#000"
    ctx.font = "12px Arial"
    ctx.fillText("Your Location", userPos.x + 15, userPos.y)
    ctx.fillText("Accident", accidentPos.x + 15, accidentPos.y)

    // Add distance and ETA
    const distance = isUsingFallback
      ? 2.7 // Provide a realistic distance when using fallback
      : Math.sqrt(Math.pow(accidentPos.x - userPos.x, 2) + Math.pow(accidentPos.y - userPos.y, 2)) / 30 // Convert to miles (very rough approximation)

    const eta = Math.round(distance * 3) // Rough estimate: 3 minutes per mile

    ctx.fillStyle = "#000"
    ctx.font = "14px Arial"
    ctx.fillText(`Distance: ${distance.toFixed(1)} miles | ETA: ${eta} minutes`, 20, canvas.height - 20)

    return () => {
      if (mapElement.contains(canvas)) {
        mapElement.removeChild(canvas)
      }
    }
  }, [accidentLocation, userLocation])

  return (
    <div ref={mapRef} className="w-full h-full bg-gray-100">
      <div className="p-4 absolute top-0 left-0 bg-white bg-opacity-80 rounded-br-lg z-10">
        <p className="text-sm font-medium">This is a simplified map visualization.</p>
        <p className="text-xs text-gray-600">In a production app, integrate with Google Maps, Mapbox, or Leaflet.</p>
      </div>

      {isUsingFallback && (
        <div className="p-4 absolute top-0 right-0 bg-amber-50 bg-opacity-90 rounded-bl-lg z-10 max-w-[200px]">
          <p className="text-xs text-amber-700">
            Using simulated location. Geolocation access is restricted in this environment.
          </p>
        </div>
      )}
    </div>
  )
}