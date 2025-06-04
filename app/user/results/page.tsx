"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, RotateCcw, Download, AlertTriangle } from "lucide-react"
import AuthGuard from "@/components/auth-guard"
import { useRouter } from "next/navigation"

interface TestResult {
  packageName: string
  score: number
  correctAnswers: number
  totalQuestions: number
  completionTime: string
  category: string
  answers: Record<number, string>
  questions: Array<{
    id: number
    question: string
    options: Array<{ value: string; text: string }>
    correctAnswer: string
  }>
}

function ResultsContent() {
  const router = useRouter()
  const [testResults, setTestResults] = useState<TestResult | null>(null)
  const [showAnswers, setShowAnswers] = useState(false)

  useEffect(() => {
    // Get results from sessionStorage
    const storedResults = sessionStorage.getItem("testResults")
    if (storedResults) {
      setTestResults(JSON.parse(storedResults))
    } else {
      // If no results, redirect to packages page
      router.push("/user/packages")
    }
  }, [router])

  const handleBackToPackages = () => {
    router.push("/user/packages")
  }

  const handleDownloadResults = () => {
    if (!testResults) return

    // Create a simple text representation of the results
    const content = `
HASIL PSIKOTES
==============
Paket: ${testResults.packageName}
Skor: ${testResults.score}
Jawaban Benar: ${testResults.correctAnswers} dari ${testResults.totalQuestions}
Waktu Pengerjaan: ${testResults.completionTime}
Kategori: ${testResults.category}

DETAIL JAWABAN:
${testResults.questions
  .map(
    (q, index) =>
      `${index + 1}. ${q.question}
   Jawaban Anda: ${testResults.answers[index] || "-"}
   Jawaban Benar: ${q.correctAnswer}
   ${testResults.answers[index] === q.correctAnswer ? "✓ Benar" : "✗ Salah"}
`,
  )
  .join("\n")}
    `

    // Create a blob and download it
    const blob = new Blob([content], { type: "text/plain" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `hasil-psikotes-${Date.now()}.txt`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-600"
    if (score >= 60) return "text-yellow-600"
    return "text-red-600"
  }

  const getScoreBadge = (score: number) => {
    if (score >= 80) return { variant: "default" as const, text: "Sangat Baik" }
    if (score >= 60) return { variant: "secondary" as const, text: "Baik" }
    return { variant: "destructive" as const, text: "Perlu Perbaikan" }
  }

  if (!testResults) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center p-8">
          <AlertTriangle className="w-12 h-12 text-yellow-500 mx-auto mb-4" />
          <h2 className="text-xl font-bold mb-2">Tidak Ada Data Hasil</h2>
          <p className="text-gray-600 mb-6">Anda belum menyelesaikan tes apapun.</p>
          <Button onClick={handleBackToPackages}>Kembali ke Halaman Paket</Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <h1 className="text-xl font-semibold text-gray-900">Hasil Psikotes</h1>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Success Message */}
        <div className="mb-8 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Selamat! Tes Berhasil Diselesaikan</h2>
          <p className="text-gray-600">Berikut adalah hasil dari tes yang telah Anda kerjakan</p>
        </div>

        {/* Results Card */}
        <Card className="mb-8">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">{testResults.packageName}</CardTitle>
              <Badge {...getScoreBadge(testResults.score)}>{getScoreBadge(testResults.score).text}</Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Score */}
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <div className={`text-3xl font-bold ${getScoreColor(testResults.score)}`}>{testResults.score}</div>
                <div className="text-sm text-gray-600 mt-1">Skor Total</div>
              </div>

              {/* Correct Answers */}
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <div className="text-3xl font-bold text-blue-600">
                  {testResults.correctAnswers}/{testResults.totalQuestions}
                </div>
                <div className="text-sm text-gray-600 mt-1">Jawaban Benar</div>
              </div>

              {/* Completion Time */}
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <div className="text-3xl font-bold text-purple-600">{testResults.completionTime}</div>
                <div className="text-sm text-gray-600 mt-1">Waktu Pengerjaan</div>
              </div>

              {/* Accuracy */}
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <div className="text-3xl font-bold text-orange-600">
                  {Math.round((testResults.correctAnswers / testResults.totalQuestions) * 100)}%
                </div>
                <div className="text-sm text-gray-600 mt-1">Akurasi</div>
              </div>
            </div>

            {/* Analysis */}
            <div className="mt-8 p-6 bg-blue-50 rounded-lg">
              <h3 className="font-semibold text-blue-900 mb-2">Analisis Hasil</h3>
              <p className="text-blue-800 text-sm leading-relaxed">
                {testResults.score >= 80
                  ? "Berdasarkan hasil tes kepribadian Anda, menunjukkan karakteristik yang sangat baik dalam hal kemampuan beradaptasi dan kerjasama tim. Anda memiliki kecenderungan untuk berpikir analitis dan mampu mengambil keputusan dengan baik dalam situasi yang menantang."
                  : testResults.score >= 60
                    ? "Hasil tes menunjukkan Anda memiliki kemampuan yang baik dalam beberapa aspek kepribadian. Ada beberapa area yang sudah kuat, namun masih ada ruang untuk pengembangan dalam aspek lainnya."
                    : "Hasil tes menunjukkan ada beberapa area kepribadian yang perlu dikembangkan lebih lanjut. Kami menyarankan untuk meningkatkan kemampuan adaptasi dan pengambilan keputusan dalam berbagai situasi."}
              </p>
            </div>

            {/* Toggle Detail Answers */}
            <div className="mt-6">
              <Button variant="outline" onClick={() => setShowAnswers(!showAnswers)} className="w-full">
                {showAnswers ? "Sembunyikan Detail Jawaban" : "Lihat Detail Jawaban"}
              </Button>
            </div>

            {/* Detail Answers */}
            {showAnswers && (
              <div className="mt-6 border rounded-lg divide-y">
                <div className="p-4 bg-gray-50 font-medium flex">
                  <div className="w-12 text-center">No.</div>
                  <div className="flex-1">Pertanyaan</div>
                  <div className="w-24 text-center">Jawaban Anda</div>
                  <div className="w-24 text-center">Jawaban Benar</div>
                  <div className="w-20 text-center">Status</div>
                </div>

                {testResults.questions.map((question, index) => {
                  const userAnswer = testResults.answers[index] || "-"
                  const isCorrect = userAnswer === question.correctAnswer
                  return (
                    <div key={question.id} className="p-4 flex items-start text-sm">
                      <div className="w-12 text-center">{index + 1}</div>
                      <div className="flex-1 pr-4">{question.question}</div>
                      <div className="w-24 text-center font-medium">{userAnswer}</div>
                      <div className="w-24 text-center font-medium">{question.correctAnswer}</div>
                      <div className="w-20 text-center">
                        {isCorrect ? (
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            Benar
                          </span>
                        ) : (
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                            Salah
                          </span>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button onClick={handleBackToPackages} size="lg" className="flex-1 sm:flex-none">
            <RotateCcw className="w-4 h-4 mr-2" />
            Kembali ke Halaman Paket
          </Button>
          <Button variant="outline" onClick={handleDownloadResults} size="lg" className="flex-1 sm:flex-none">
            <Download className="w-4 h-4 mr-2" />
            Unduh Hasil
          </Button>
        </div>
      </main>
    </div>
  )
}

export default function ResultsPage() {
  return (
    <AuthGuard requiredRole="user">
      <ResultsContent />
    </AuthGuard>
  )
}
