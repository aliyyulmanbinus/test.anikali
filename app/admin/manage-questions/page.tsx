"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { ArrowLeft, Plus, Edit, Trash2, Save, AlertCircle } from "lucide-react"
import AuthGuard from "@/components/auth-guard"

const defaultPackages = [
  { id: "A", name: "Paket A - Tes Kepribadian" },
  { id: "B", name: "Paket B - Tes Kecerdasan" },
  { id: "C", name: "Paket C - Tes Minat Bakat" },
]

const sampleQuestions = [
  {
    id: 1,
    question: "Manakah dari pernyataan berikut yang paling menggambarkan diri Anda?",
    optionA: "Saya lebih suka bekerja dalam tim",
    optionB: "Saya lebih suka bekerja sendiri",
    optionC: "Saya fleksibel dalam kedua situasi",
    optionD: "Saya tidak memiliki preferensi khusus",
    correctAnswer: "C",
  },
  {
    id: 2,
    question: "Ketika menghadapi masalah yang sulit, Anda cenderung:",
    optionA: "Mencari bantuan dari orang lain",
    optionB: "Mencoba menyelesaikan sendiri terlebih dahulu",
    optionC: "Menganalisis masalah secara sistematis",
    optionD: "Menunda hingga menemukan solusi yang tepat",
    correctAnswer: "C",
  },
]

interface Question {
  id: number
  question: string
  optionA: string
  optionB: string
  optionC: string
  optionD: string
  correctAnswer: string
}

function ManageQuestionsContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const packageParam = searchParams.get("package")

  const [allPackages, setAllPackages] = useState(defaultPackages)
  const [selectedPackage, setSelectedPackage] = useState(packageParam || "")
  const [questions, setQuestions] = useState<Question[]>([])
  const [showAddForm, setShowAddForm] = useState(false)
  const [editingQuestion, setEditingQuestion] = useState<number | null>(null)
  const [error, setError] = useState("")

  const [newQuestion, setNewQuestion] = useState({
    question: "",
    optionA: "",
    optionB: "",
    optionC: "",
    optionD: "",
    correctAnswer: "",
  })

  // Load custom packages and questions on component mount
  useEffect(() => {
    const customPackages = JSON.parse(localStorage.getItem("customPackages") || "[]")
    const customPackageOptions = customPackages.map((pkg: any) => ({
      id: pkg.id,
      name: pkg.name,
    }))
    setAllPackages([...defaultPackages, ...customPackageOptions])

    // Load questions for selected package
    if (selectedPackage) {
      loadQuestionsForPackage(selectedPackage)
    }
  }, [selectedPackage])

  const loadQuestionsForPackage = (packageId: string) => {
    // For default packages, use sample questions
    if (["A", "B", "C"].includes(packageId)) {
      setQuestions(sampleQuestions)
    } else {
      // For custom packages, load from localStorage
      const customPackages = JSON.parse(localStorage.getItem("customPackages") || "[]")
      const selectedPkg = customPackages.find((pkg: any) => pkg.id === packageId)
      setQuestions(selectedPkg?.questions || [])
    }
  }

  const handleBack = () => {
    router.push("/admin/dashboard")
  }

  const validateQuestion = () => {
    if (!newQuestion.question.trim()) {
      setError("Pertanyaan harus diisi")
      return false
    }
    if (
      !newQuestion.optionA.trim() ||
      !newQuestion.optionB.trim() ||
      !newQuestion.optionC.trim() ||
      !newQuestion.optionD.trim()
    ) {
      setError("Semua pilihan jawaban harus diisi")
      return false
    }
    if (!newQuestion.correctAnswer) {
      setError("Jawaban benar harus dipilih")
      return false
    }
    return true
  }

  const handleAddQuestion = () => {
    if (!validateQuestion()) return

    const question: Question = {
      id: questions.length + 1,
      ...newQuestion,
    }

    const updatedQuestions = [...questions, question]
    setQuestions(updatedQuestions)
    saveQuestionsToStorage(selectedPackage, updatedQuestions)

    setNewQuestion({
      question: "",
      optionA: "",
      optionB: "",
      optionC: "",
      optionD: "",
      correctAnswer: "",
    })
    setShowAddForm(false)
    setError("")
  }

  const handleDeleteQuestion = (questionId: number) => {
    if (confirm("Apakah Anda yakin ingin menghapus soal ini?")) {
      const updatedQuestions = questions.filter((q) => q.id !== questionId)
      setQuestions(updatedQuestions)
      saveQuestionsToStorage(selectedPackage, updatedQuestions)
    }
  }

  const handleEditQuestion = (questionId: number) => {
    setEditingQuestion(questionId)
    const question = questions.find((q) => q.id === questionId)
    if (question) {
      setNewQuestion(question)
    }
  }

  const handleUpdateQuestion = () => {
    if (!validateQuestion()) return

    if (editingQuestion) {
      const updatedQuestions = questions.map((q) =>
        q.id === editingQuestion ? { ...newQuestion, id: editingQuestion } : q,
      )
      setQuestions(updatedQuestions)
      saveQuestionsToStorage(selectedPackage, updatedQuestions)

      setEditingQuestion(null)
      setNewQuestion({
        question: "",
        optionA: "",
        optionB: "",
        optionC: "",
        optionD: "",
        correctAnswer: "",
      })
      setError("")
    }
  }

  const saveQuestionsToStorage = (packageId: string, questionsToSave: Question[]) => {
    // Only save for custom packages
    if (!["A", "B", "C"].includes(packageId)) {
      const customPackages = JSON.parse(localStorage.getItem("customPackages") || "[]")
      const updatedPackages = customPackages.map((pkg: any) =>
        pkg.id === packageId ? { ...pkg, questions: questionsToSave, questionCount: questionsToSave.length } : pkg,
      )
      localStorage.setItem("customPackages", JSON.stringify(updatedPackages))
    }
  }

  const handleCancelEdit = () => {
    setShowAddForm(false)
    setEditingQuestion(null)
    setNewQuestion({
      question: "",
      optionA: "",
      optionB: "",
      optionC: "",
      optionD: "",
      correctAnswer: "",
    })
    setError("")
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center h-16">
            <Button variant="ghost" onClick={handleBack} className="mr-4">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Kembali
            </Button>
            <h1 className="text-xl font-semibold text-gray-900">Kelola Soal Paket</h1>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Package Selection */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Pilih Paket Soal</CardTitle>
            <CardDescription>Pilih paket yang ingin Anda kelola soalnya</CardDescription>
          </CardHeader>
          <CardContent>
            <Select value={selectedPackage} onValueChange={setSelectedPackage}>
              <SelectTrigger className="w-full md:w-1/2">
                <SelectValue placeholder="Pilih paket soal..." />
              </SelectTrigger>
              <SelectContent>
                {allPackages.map((pkg) => (
                  <SelectItem key={pkg.id} value={pkg.id}>
                    {pkg.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </CardContent>
        </Card>

        {selectedPackage && (
          <>
            {/* Add Question Form */}
            <Card className="mb-6">
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle>{editingQuestion ? "Edit Soal" : "Tambah Soal Baru"}</CardTitle>
                    <CardDescription>
                      {editingQuestion ? "Perbarui soal yang dipilih" : "Tambahkan soal baru ke paket ini"}
                    </CardDescription>
                  </div>
                  {!showAddForm && !editingQuestion && (
                    <Button onClick={() => setShowAddForm(true)}>
                      <Plus className="w-4 h-4 mr-2" />
                      Tambah Soal
                    </Button>
                  )}
                </div>
              </CardHeader>

              {(showAddForm || editingQuestion) && (
                <CardContent>
                  <div className="space-y-4">
                    {error && (
                      <Alert variant="destructive">
                        <AlertCircle className="h-4 w-4" />
                        <AlertDescription>{error}</AlertDescription>
                      </Alert>
                    )}

                    <div className="space-y-2">
                      <Label htmlFor="question">Pertanyaan *</Label>
                      <Textarea
                        id="question"
                        placeholder="Masukkan pertanyaan..."
                        value={newQuestion.question}
                        onChange={(e) => setNewQuestion((prev) => ({ ...prev, question: e.target.value }))}
                        rows={3}
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="optionA">Pilihan A *</Label>
                        <Input
                          id="optionA"
                          placeholder="Pilihan A"
                          value={newQuestion.optionA}
                          onChange={(e) => setNewQuestion((prev) => ({ ...prev, optionA: e.target.value }))}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="optionB">Pilihan B *</Label>
                        <Input
                          id="optionB"
                          placeholder="Pilihan B"
                          value={newQuestion.optionB}
                          onChange={(e) => setNewQuestion((prev) => ({ ...prev, optionB: e.target.value }))}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="optionC">Pilihan C *</Label>
                        <Input
                          id="optionC"
                          placeholder="Pilihan C"
                          value={newQuestion.optionC}
                          onChange={(e) => setNewQuestion((prev) => ({ ...prev, optionC: e.target.value }))}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="optionD">Pilihan D *</Label>
                        <Input
                          id="optionD"
                          placeholder="Pilihan D"
                          value={newQuestion.optionD}
                          onChange={(e) => setNewQuestion((prev) => ({ ...prev, optionD: e.target.value }))}
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label>Jawaban Benar *</Label>
                      <RadioGroup
                        value={newQuestion.correctAnswer}
                        onValueChange={(value) => setNewQuestion((prev) => ({ ...prev, correctAnswer: value }))}
                        className="flex space-x-4"
                      >
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="A" id="answerA" />
                          <Label htmlFor="answerA">A</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="B" id="answerB" />
                          <Label htmlFor="answerB">B</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="C" id="answerC" />
                          <Label htmlFor="answerC">C</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="D" id="answerD" />
                          <Label htmlFor="answerD">D</Label>
                        </div>
                      </RadioGroup>
                    </div>

                    <div className="flex justify-end space-x-2">
                      <Button variant="outline" onClick={handleCancelEdit}>
                        Batal
                      </Button>
                      <Button onClick={editingQuestion ? handleUpdateQuestion : handleAddQuestion}>
                        <Save className="w-4 h-4 mr-2" />
                        {editingQuestion ? "Perbarui Soal" : "Tambah Soal"}
                      </Button>
                    </div>
                  </div>
                </CardContent>
              )}
            </Card>

            {/* Questions List */}
            <Card>
              <CardHeader>
                <CardTitle>Daftar Soal ({questions.length})</CardTitle>
                <CardDescription>Soal-soal yang tersedia dalam paket ini</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {questions.length === 0 ? (
                    <div className="text-center py-8">
                      <p className="text-gray-500">Belum ada soal dalam paket ini</p>
                    </div>
                  ) : (
                    questions.map((question, index) => (
                      <div key={question.id} className="border rounded-lg p-4">
                        <div className="flex justify-between items-start mb-3">
                          <h3 className="font-medium text-sm text-gray-600">Soal {index + 1}</h3>
                          <div className="flex space-x-2">
                            <Button variant="outline" size="sm" onClick={() => handleEditQuestion(question.id)}>
                              <Edit className="w-4 h-4 mr-1" />
                              Edit
                            </Button>
                            <Button variant="destructive" size="sm" onClick={() => handleDeleteQuestion(question.id)}>
                              <Trash2 className="w-4 h-4 mr-1" />
                              Hapus
                            </Button>
                          </div>
                        </div>

                        <p className="font-medium mb-3">{question.question}</p>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                          <div
                            className={`p-2 rounded ${question.correctAnswer === "A" ? "bg-green-50 border border-green-200" : "bg-gray-50"}`}
                          >
                            <span className="font-medium">A.</span> {question.optionA}
                          </div>
                          <div
                            className={`p-2 rounded ${question.correctAnswer === "B" ? "bg-green-50 border border-green-200" : "bg-gray-50"}`}
                          >
                            <span className="font-medium">B.</span> {question.optionB}
                          </div>
                          <div
                            className={`p-2 rounded ${question.correctAnswer === "C" ? "bg-green-50 border border-green-200" : "bg-gray-50"}`}
                          >
                            <span className="font-medium">C.</span> {question.optionC}
                          </div>
                          <div
                            className={`p-2 rounded ${question.correctAnswer === "D" ? "bg-green-50 border border-green-200" : "bg-gray-50"}`}
                          >
                            <span className="font-medium">D.</span> {question.optionD}
                          </div>
                        </div>

                        <div className="mt-2 text-xs text-green-600">Jawaban benar: {question.correctAnswer}</div>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </>
        )}
      </main>
    </div>
  )
}

export default function ManageQuestionsPage() {
  return (
    <AuthGuard requiredRole="admin">
      <ManageQuestionsContent />
    </AuthGuard>
  )
}
