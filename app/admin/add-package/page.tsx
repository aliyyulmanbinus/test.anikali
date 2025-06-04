"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, Save } from "lucide-react"

export default function AddPackagePage() {
  const [packageData, setPackageData] = useState({
    name: "",
    description: "",
    duration: "",
    difficulty: "",
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Logic untuk menyimpan paket ke Firebase
    console.log("Saving package:", packageData)
  }

  const handleBack = () => {
    // Navigate back to dashboard
    console.log("Back to dashboard")
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
              <div className="space-y-2">
                <Label htmlFor="name">Nama Paket *</Label>
                <Input
                  id="name"
                  placeholder="Contoh: Paket A - Tes Kepribadian"
                  value={packageData.name}
                  onChange={(e) => setPackageData((prev) => ({ ...prev, name: e.target.value }))}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Deskripsi Paket *</Label>
                <Textarea
                  id="description"
                  placeholder="Jelaskan tujuan dan cakupan dari paket tes ini..."
                  value={packageData.description}
                  onChange={(e) => setPackageData((prev) => ({ ...prev, description: e.target.value }))}
                  rows={4}
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="duration">Durasi (menit)</Label>
                  <Input
                    id="duration"
                    type="number"
                    placeholder="30"
                    value={packageData.duration}
                    onChange={(e) => setPackageData((prev) => ({ ...prev, duration: e.target.value }))}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="difficulty">Tingkat Kesulitan</Label>
                  <select
                    id="difficulty"
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    value={packageData.difficulty}
                    onChange={(e) => setPackageData((prev) => ({ ...prev, difficulty: e.target.value }))}
                  >
                    <option value="">Pilih tingkat kesulitan</option>
                    <option value="Mudah">Mudah</option>
                    <option value="Sedang">Sedang</option>
                    <option value="Sulit">Sulit</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end space-x-4 pt-6">
                <Button type="button" variant="outline" onClick={handleBack}>
                  Batal
                </Button>
                <Button type="submit">
                  <Save className="w-4 h-4 mr-2" />
                  Simpan Paket
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
