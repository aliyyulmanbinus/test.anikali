"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Plus, Search, Eye, Trash2, LogOut, Edit } from "lucide-react"
import AuthGuard from "@/components/auth-guard"

const samplePackages = [
  {
    id: "A",
    name: "Paket A - Tes Kepribadian",
    description: "Tes untuk mengukur kepribadian dan karakter dasar",
    questionCount: 25,
    createdAt: "2024-01-15",
    status: "Aktif",
  },
  {
    id: "B",
    name: "Paket B - Tes Kecerdasan",
    description: "Tes IQ dan kemampuan logika berpikir",
    questionCount: 30,
    createdAt: "2024-01-10",
    status: "Aktif",
  },
  {
    id: "C",
    name: "Paket C - Tes Minat Bakat",
    description: "Tes untuk mengetahui minat dan bakat terpendam",
    questionCount: 35,
    createdAt: "2024-01-05",
    status: "Draft",
  },
]

function AdminDashboardContent() {
  const [searchTerm, setSearchTerm] = useState("")
  const [packages, setPackages] = useState(samplePackages)

  const handleDeletePackage = (packageId: string) => {
    setPackages((prev) => prev.filter((pkg) => pkg.id !== packageId))
  }

  const handleViewQuestions = (packageId: string) => {
    window.location.href = "/admin/manage-questions"
  }

  const handleAddPackage = () => {
    window.location.href = "/admin/add-package"
  }

  const handleLogout = async () => {
    try {
      sessionStorage.removeItem("currentUser")
      window.location.href = "/"
    } catch (error) {
      console.error("Logout error:", error)
    }
  }

  const filteredPackages = packages.filter(
    (pkg) =>
      pkg.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      pkg.description.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <h1 className="text-xl font-semibold text-gray-900">Dashboard Admin Psikotes</h1>
            <Button variant="outline" onClick={handleLogout}>
              <LogOut className="w-4 h-4 mr-2" />
              Keluar
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Paket</CardTitle>
              <div className="h-4 w-4 text-muted-foreground">📦</div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{packages.length}</div>
              <p className="text-xs text-muted-foreground">Paket soal tersedia</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Soal</CardTitle>
              <div className="h-4 w-4 text-muted-foreground">❓</div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{packages.reduce((sum, pkg) => sum + pkg.questionCount, 0)}</div>
              <p className="text-xs text-muted-foreground">Soal dalam semua paket</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Paket Aktif</CardTitle>
              <div className="h-4 w-4 text-muted-foreground">✅</div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{packages.filter((pkg) => pkg.status === "Aktif").length}</div>
              <p className="text-xs text-muted-foreground">Paket yang dapat diakses</p>
            </CardContent>
          </Card>
        </div>

        {/* Actions Bar */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Cari paket soal..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Button onClick={handleAddPackage}>
            <Plus className="w-4 h-4 mr-2" />
            Tambah Paket Baru
          </Button>
        </div>

        {/* Packages Table */}
        <Card>
          <CardHeader>
            <CardTitle>Daftar Paket Soal</CardTitle>
            <CardDescription>Kelola semua paket soal psikotes yang tersedia</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {filteredPackages.map((pkg) => (
                <div key={pkg.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-semibold">{pkg.name}</h3>
                      <Badge variant={pkg.status === "Aktif" ? "default" : "secondary"}>{pkg.status}</Badge>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">{pkg.description}</p>
                    <div className="flex items-center gap-4 text-xs text-gray-500">
                      <span>{pkg.questionCount} soal</span>
                      <span>Dibuat: {pkg.createdAt}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm" onClick={() => handleViewQuestions(pkg.id)}>
                      <Eye className="w-4 h-4 mr-1" />
                      Lihat Soal
                    </Button>
                    <Button variant="outline" size="sm">
                      <Edit className="w-4 h-4 mr-1" />
                      Edit
                    </Button>
                    <Button variant="destructive" size="sm" onClick={() => handleDeletePackage(pkg.id)}>
                      <Trash2 className="w-4 h-4 mr-1" />
                      Hapus
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}

export default function AdminDashboard() {
  return (
    <AuthGuard requiredRole="admin">
      <AdminDashboardContent />
    </AuthGuard>
  )
}
