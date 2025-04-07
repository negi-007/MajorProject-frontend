import AccidentVerification from "@/components/accident-verification"
import "@/public/Background1.jpg"
import "@/public/Background2.jpg"
import "@/public/Background3.jpg"
import "@/public/Background4.jpg"

export default function HomePage() {
  return (
    <main className="min-h-screen bg-cover bg-center" style={{ backgroundImage: "url('/Background4.jpg')" }}>
      <div className="container max-w-4xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-semibold text-purple-300 mb-6">Accident Alert Verification</h1>
        <AccidentVerification />
      </div>
    </main>
  )
}