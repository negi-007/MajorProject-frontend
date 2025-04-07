"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { CheckCircle, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export default function AccidentVerification() {
  const router = useRouter();
  const [selectedThumbnail, setSelectedThumbnail] = useState(0);

  const accidentData = {
    id: "ACC-2025-04-05-001",
    location: { lat: 30.275224, lng: 77.989081 },
    timestamp: "2025-04-05T14:30:00Z",
    severity: "Medium",
  };

  const [formattedDate, setFormattedDate] = useState("");

  useEffect(() => {
    const date = new Date(accidentData.timestamp);
    setFormattedDate(date.toLocaleString());
  }, []);

  const thumbnails = [
    {
      id: 1,
      src: "/placeholder.svg?height=200&width=320",
      alt: "Collision frame 1",
      time: "00:05",
    },
    {
      id: 2,
      src: "/placeholder.svg?height=200&width=320",
      alt: "Collision frame 2",
      time: "00:08",
    },
    {
      id: 3,
      src: "/placeholder.svg?height=200&width=320",
      alt: "Collision frame 3",
      time: "00:12",
    },
  ];

  const handleProceed = () => {
    const { lat, lng } = accidentData.location;
    const googleMapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}&travelmode=driving`;
    window.open(googleMapsUrl, "_blank");
  };

  const handleDeny = () => {
    alert("Accident alert has been denied.");
  };

  const [loading, setLoading] = useState(true);

  return (
    <div className="space-y-6 text-slate-400">
      <Card className="overflow-hidden shadow-md rounded-lg bg-black/20 backdrop-blur-sm border border-white/10 p-6">
        <div className="aspect-video relative">
          {/* Loader Overlay */}
          {loading && (
            <div className="absolute inset-0 z-10 flex items-center justify-center bg-black/80 rounded-lg">
              <div className="w-10 h-10 border-4 border-purple-500/70 border-t-transparent rounded-full animate-spin" />
            </div>
          )}

          <video
            className="w-full h-full object-cover bg-black/50 rounded-lg"
            controls
            poster="/placeholder.svg?height=480&width=854"
            onCanPlayThrough={() => setLoading(false)}
          >
            <source src="#" type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        </div>

        <div className="p-4">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-lg font-medium text-purple-300">
              Accident ID: {accidentData.id}
            </h2>
            <span className="text-sm text-purple-300">{formattedDate}</span>
          </div>

          <h3 className="text-md font-medium mb-3 text-purple-300 leading-10 text-lg">
            Collision Detection Frames
          </h3>
          <div className="grid grid-cols-3 gap-3">
            {thumbnails.map((thumbnail, index) => (
              <div
                key={thumbnail.id}
                className={`relative cursor-pointer rounded-md overflow-hidden bg-black/50 border-2 text-center hover:text-lg transition-all ${
                  selectedThumbnail === index
                    ? "border-purple-400 shadow-sm text-purple-300"
                    : "border-white/10 text-slate-500 text-sm"
                }`}
                onClick={() => setSelectedThumbnail(index)}
              >
                <Image
                  src={thumbnail.src || "/placeholder.svg"}
                  alt={thumbnail.alt}
                  width={320}
                  height={200}
                  className="w-full h-auto object-cover"
                />
                <div className="absolute bottom-0 right-0 bg-black bg-opacity-70 text-slate-200 text-xs px-2 py-1 rounded-tl-md">
                  {thumbnail.time}
                </div>
              </div>
            ))}
          </div>
        </div>
      </Card>

      <div className="flex flex-col sm:flex-row gap-4 justify-center mt-6">
        <Button
          onClick={handleProceed}
          className="flex-1 bg-green-500/60 hover:bg-green-500 text-white py-3 rounded-md flex items-center justify-center gap-2"
        >
          <CheckCircle className="h-5 w-5" />
          <span>Proceed</span>
        </Button>

        <Button
          onClick={handleDeny}
          variant="destructive"
          className="flex-1 bg-red-500/60 hover:bg-red-500 py-3 rounded-md flex items-center justify-center gap-2"
        >
          <XCircle className="h-5 w-5" />
          <span>Deny</span>
        </Button>
      </div>

      <div className="text-center mt-4 text-sm text-slate-500">
        <p>
          If the button doesn't work, you can{" "}
          <a
            href={`https://www.google.com/maps/dir/?api=1&destination=${accidentData.location.lat},${accidentData.location.lng}&travelmode=driving`}
            className="text-purple-600 hover:underline"
            target="_blank"
            rel="noopener noreferrer"
          >
            click here
          </a>{" "}
          to open Google Maps directions directly.
        </p>
      </div>
    </div>
  );
}
