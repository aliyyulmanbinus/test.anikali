"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { BookOpen, Clock, LogOut } from "lucide-react"
import AuthGuard from "@/components/auth-guard"

const packages = [
  {
    id: "A",
    name: "Paket A - Tes Kepribadian",
    description: "Tes untuk mengukur kepribadian dan karakter dasar",
    questionCount: 25,
    duration: "30 menit",
    difficulty: "Mudah",
  },
  {
    id: "B",
    name: "Paket B - Tes Kecerdasan",
    description: "Tes IQ dan kemampuan logika berpikir",
    questionCount: 30,
    duration: "45 menit",
    difficulty: "Sedang",
  },
  {
    id: "C",
    name: "Paket C - Tes Minat Bakat",
    description: "Tes untuk mengetahui minat dan bakat terpendam",
    questionCount: 35,
    duration: "40 menit",
    difficulty: "Mudah",
  },
  {
    id: "D",
    name: "Paket D - Tes Psikologi Kerja",
    description: "Tes untuk menilai kesesuaian dengan dunia kerja",
    questionCount: 40,
    duration: "50 menit",
    difficulty: "Sulit",
  },
  {
    id: "E",
    name: "Paket E - Tes Komprehensif",
    description: "Kombinasi semua jenis tes psikologi",
    questionCount: 50,
    duration: "60 menit",
    difficulty: "Sulit",
  },
]

function PackagesContent() {
  const handleStartTest = (packageId: string) => {
    // Clear any previous test results
    sessionStorage.removeItem("testResults")

    // Navigate to test page
    window.location.href = "/user/test"
  }

  const handleLogout = async () => {
    try {
      sessionStorage.removeItem("currentUser")
      window.location.href = "/"
    } catch (error) {
      console.error("Logout error:", error)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <h1 className="text-xl font-semibold text-gray-900">Sistem Psikotes Online</h1>
            <Button variant="outline" onClick={handleLogout}>
              <LogOut className="w-4 h-4 mr-2" />
              Keluar
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Pilih Paket Psikotes</h2>
          <p className="text-gray-600">Pilih paket tes yang sesuai dengan kebutuhan Anda</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {packages.map((pkg) => (
            <Card key={pkg.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex justify-between items-start mb-2">
                  <CardTitle className="text-lg">{pkg.name}</CardTitle>
                  <Badge
                    variant={
                      pkg.difficulty === "Mudah" ? "secondary" : pkg.difficulty === "Sedang" ? "default" : "destructive"
                    }
                  >
                    {pkg.difficulty}
                  </Badge>
                </div>
                <CardDescription className="text-sm">{pkg.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 mb-4">
                  <div className="flex items-center text-sm text-gray-600">
                    <BookOpen className="w-4 h-4 mr-2" />
                    {pkg.questionCount} Soal
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <Clock className="w-4 h-4 mr-2" />
                    Durasi: {pkg.duration}
                  </div>
                </div>
                <Button className="w-full" onClick={() => handleStartTest(pkg.id)}>
                  Mulai Mengerjakan
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </main>
    </div>
  )
}

export default function PackagesPage() {
  return (
    <AuthGuard requiredRole="user">
      <PackagesContent />
    </AuthGuard>
  )
}
