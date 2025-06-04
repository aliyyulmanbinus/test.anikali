"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { ArrowLeft, Save, CheckCircle, AlertCircle } from "lucide-react"
import AuthGuard from "@/components/auth-guard"

interface PackageData {
  name: string
  description: string
  duration: string
  difficulty: string
}

function AddPackageContent() {
  const router = useRouter()
  const [packageData, setPackageData] = useState<PackageData>({
    name: "",
    description: "",
    duration: "",
    difficulty: "",
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)

  const handleInputChange = (field: keyof PackageData, value: string) => {
    setPackageData((prev) => ({ ...prev, [field]: value }))
    setError("") // Clear error when user types
  }

  const validateForm = () => {
    if (!packageData.name.trim()) {
      setError("Nama paket harus diisi")
      return false
    }
    if (!packageData.description.trim()) {
      setError("Deskripsi paket harus diisi")
      return false
    }
    if (!packageData.duration.trim()) {
      setError("Durasi harus diisi")
      return false
    }
    if (!packageData.difficulty) {
      setError("Tingkat kesulitan harus dipilih")
      return false
    }
    return true
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) return

    setLoading(true)
    setError("")

    try {
      // Simulate API call to save package
      await new Promise((resolve) => setTimeout(resolve, 1500))

      // Get existing packages from localStorage or create new array
      const existingPackages = JSON.parse(localStorage.getItem("customPackages") || "[]")

      // Create new package with unique ID
      const newPackage = {
        id: `CUSTOM_${Date.now()}`,
        name: packageData.name,
        description: packageData.description,
        duration: packageData.duration,
        difficulty: packageData.difficulty,
        questionCount: 0,
        createdAt: new Date().toISOString().split("T")[0],
        status: "Draft",
        questions: [],
      }

      // Add to existing packages
      existingPackages.push(newPackage)

      // Save to localStorage
      localStorage.setItem("customPackages", JSON.stringify(existingPackages))

      setSuccess(true)

      // Reset form
      setPackageData({
        name: "",
        description: "",
        duration: "",
        difficulty: "",
      })

      // Redirect to dashboard after 2 seconds
      setTimeout(() => {
        router.push("/admin/dashboard")
      }, 2000)
    } catch (error: any) {
      setError(error.message || "Terjadi kesalahan saat menyimpan paket")
    } finally {
      setLoading(false)
    }
  }

  const handleBack = () => {
    router.push("/admin/dashboard")
  }

  if (success) {
    return (
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <header className="bg-white shadow-sm border-b">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center h-16">
              <h1 className="text-xl font-semibold text-gray-900">Tambah Paket Soal Baru</h1>
            </div>
          </div>
        </header>

        {/* Success Message */}
        <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Card>
            <CardContent className="text-center py-12">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Paket Berhasil Dibuat!</h2>
              <p className="text-gray-600 mb-6">
                Paket soal "{packageData.name}" telah berhasil disimpan. Anda akan diarahkan ke dashboard dalam beberapa
                detik.
              </p>
              <Button onClick={handleBack}>Kembali ke Dashboard</Button>
            </CardContent>
          </Card>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center h-16">
            <Button variant="ghost" onClick={handleBack} className="mr-4">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Kembali
            </Button>
            <h1 className="text-xl font-semibold text-gray-900">Tambah Paket Soal Baru</h1>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Card>
          <CardHeader>
            <CardTitle>Informasi Paket Soal</CardTitle>
            <CardDescription>Masukkan detail paket soal psikotes yang akan dibuat</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <div className="space-y-2">
                <Label htmlFor="name">Nama Paket *</Label>
                <Input
                  id="name"
                  placeholder="Contoh: Paket F - Tes Kreativitas"
                  value={packageData.name}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                  disabled={loading}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Deskripsi Paket *</Label>
                <Textarea
                  id="description"
                  placeholder="Jelaskan tujuan dan cakupan dari paket tes ini..."
                  value={packageData.description}
                  onChange={(e) => handleInputChange("description", e.target.value)}
                  rows={4}
                  disabled={loading}
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="duration">Durasi (menit) *</Label>
                  <Input
                    id="duration"
                    type="number"
                    placeholder="30"
                    value={packageData.duration}
                    onChange={(e) => handleInputChange("duration", e.target.value)}
                    disabled={loading}
                    min="1"
                    max="180"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="difficulty">Tingkat Kesulitan *</Label>
                  <Select
                    value={packageData.difficulty}
                    onValueChange={(value) => handleInputChange("difficulty", value)}
                    disabled={loading}
                    required
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Pilih tingkat kesulitan" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Mudah">Mudah</SelectItem>
                      <SelectItem value="Sedang">Sedang</SelectItem>
                      <SelectItem value="Sulit">Sulit</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="flex justify-end space-x-4 pt-6">
                <Button type="button" variant="outline" onClick={handleBack} disabled={loading}>
                  Batal
                </Button>
                <Button type="submit" disabled={loading}>
                  {loading ? (
                    <>
                      <div className="w-4 h-4 mr-2 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Menyimpan...
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4 mr-2" />
                      Simpan Paket
                    </>
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}

export default function AddPackagePage() {
  return (
    <AuthGuard requiredRole="admin">
      <AddPackageContent />
    </AuthGuard>
  )
}
