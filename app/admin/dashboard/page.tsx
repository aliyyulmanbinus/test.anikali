"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Plus, Search, Eye, Trash2, LogOut, Edit } from "lucide-react"
import AuthGuard from "@/components/auth-guard"

const defaultPackages = [
  {
    id: "A",
    name: "Paket A - Tes Kepribadian",
    description: "Tes untuk mengukur kepribadian dan karakter dasar",
    questionCount: 25,
    createdAt: "2024-01-15",
    status: "Aktif",
    isDefault: true,
  },
  {
    id: "B",
    name: "Paket B - Tes Kecerdasan",
    description: "Tes IQ dan kemampuan logika berpikir",
    questionCount: 30,
    createdAt: "2024-01-10",
    status: "Aktif",
    isDefault: true,
  },
  {
    id: "C",
    name: "Paket C - Tes Minat Bakat",
    description: "Tes untuk mengetahui minat dan bakat terpendam",
    questionCount: 35,
    createdAt: "2024-01-05",
    status: "Draft",
    isDefault: true,
  },
]

function AdminDashboardContent() {
  const router = useRouter()
  const [searchTerm, setSearchTerm] = useState("")
  const [packages, setPackages] = useState(defaultPackages)

  // Load custom packages from localStorage on component mount
  useEffect(() => {
    const customPackages = JSON.parse(localStorage.getItem("customPackages") || "[]")
    setPackages([...defaultPackages, ...customPackages])
  }, [])

  const handleDeletePackage = (packageId: string) => {
    // Don't allow deletion of default packages
    const packageToDelete = packages.find((pkg) => pkg.id === packageId)
    if (packageToDelete?.isDefault) {
      alert("Paket default tidak dapat dihapus")
      return
    }

    if (confirm("Apakah Anda yakin ingin menghapus paket ini?")) {
      // Remove from state
      const updatedPackages = packages.filter((pkg) => pkg.id !== packageId)
      setPackages(updatedPackages)

      // Update localStorage (only custom packages)
      const customPackages = updatedPackages.filter((pkg) => !pkg.isDefault)
      localStorage.setItem("customPackages", JSON.stringify(customPackages))
    }
  }

  const handleViewQuestions = (packageId: string) => {
    router.push(`/admin/manage-questions?package=${packageId}`)
  }

  const handleAddPackage = () => {
    router.push("/admin/add-package")
  }

  const handleEditPackage = (packageId: string) => {
    router.push(`/admin/edit-package?id=${packageId}`)
  }

  const handleLogout = async () => {
    try {
      sessionStorage.removeItem("currentUser")
      router.push("/")
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
              {filteredPackages.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-gray-500">Tidak ada paket yang ditemukan</p>
                </div>
              ) : (
                filteredPackages.map((pkg) => (
                  <div
                    key={pkg.id}
                    className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-semibold">{pkg.name}</h3>
                        <Badge variant={pkg.status === "Aktif" ? "default" : "secondary"}>{pkg.status}</Badge>
                        {pkg.isDefault && <Badge variant="outline">Default</Badge>}
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
                      {!pkg.isDefault && (
                        <Button variant="outline" size="sm" onClick={() => handleEditPackage(pkg.id)}>
                          <Edit className="w-4 h-4 mr-1" />
                          Edit
                        </Button>
                      )}
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleDeletePackage(pkg.id)}
                        disabled={pkg.isDefault}
                      >
                        <Trash2 className="w-4 h-4 mr-1" />
                        Hapus
                      </Button>
                    </div>
                  </div>
                ))
              )}
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
