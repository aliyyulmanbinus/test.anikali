"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"
import { ChevronLeft, ChevronRight, AlertTriangle } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import AuthGuard from "@/components/auth-guard"

// Sample questions data with correct answers
const sampleQuestions = [
  {
    id: 1,
    question: "Manakah dari pernyataan berikut yang paling menggambarkan diri Anda?",
    options: [
      { value: "A", text: "Saya lebih suka bekerja dalam tim" },
      { value: "B", text: "Saya lebih suka bekerja sendiri" },
      { value: "C", text: "Saya fleksibel dalam kedua situasi" },
      { value: "D", text: "Saya tidak memiliki preferensi khusus" },
    ],
    correctAnswer: "C", // Jawaban yang benar
  },
  {
    id: 2,
    question: "Ketika menghadapi masalah yang sulit, Anda cenderung:",
    options: [
      { value: "A", text: "Mencari bantuan dari orang lain" },
      { value: "B", text: "Mencoba menyelesaikan sendiri terlebih dahulu" },
      { value: "C", text: "Menganalisis masalah secara sistematis" },
      { value: "D", text: "Menunda hingga menemukan solusi yang tepat" },
    ],
    correctAnswer: "C", // Jawaban yang benar
  },
  {
    id: 3,
    question: "Dalam situasi sosial, Anda biasanya:",
    options: [
      { value: "A", text: "Menjadi pusat perhatian" },
      { value: "B", text: "Mendengarkan lebih banyak daripada berbicara" },
      { value: "C", text: "Berpartisipasi aktif dalam diskusi" },
      { value: "D", text: "Mengamati situasi terlebih dahulu" },
    ],
    correctAnswer: "B", // Jawaban yang benar
  },
  {
    id: 4,
    question: "Ketika membuat keputusan penting, Anda lebih mengandalkan:",
    options: [
      { value: "A", text: "Intuisi dan perasaan" },
      { value: "B", text: "Fakta dan data" },
      { value: "C", text: "Saran dari orang lain" },
      { value: "D", text: "Pengalaman masa lalu" },
    ],
    correctAnswer: "B", // Jawaban yang benar
  },
  {
    id: 5,
    question: "Dalam mengelola waktu, Anda cenderung:",
    options: [
      { value: "A", text: "Membuat jadwal terperinci dan mengikutinya" },
      { value: "B", text: "Fleksibel dan beradaptasi sesuai kebutuhan" },
      { value: "C", text: "Fokus pada tenggat waktu" },
      { value: "D", text: "Menyelesaikan tugas pada menit-menit terakhir" },
    ],
    correctAnswer: "A", // Jawaban yang benar
  },
]

function TestContent() {
  const router = useRouter()
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState<Record<number, string>>({})
  const [selectedAnswer, setSelectedAnswer] = useState("")
  const [showWarning, setShowWarning] = useState(false)
  const [startTime, setStartTime] = useState<Date | null>(null)
  const [elapsedTime, setElapsedTime] = useState(0)

  // Set start time when component mounts
  useEffect(() => {
    setStartTime(new Date())
  }, [])

  // Update elapsed time every second
  useEffect(() => {
    if (!startTime) return

    const interval = setInterval(() => {
      const now = new Date()
      const elapsed = Math.floor((now.getTime() - startTime.getTime()) / 1000) // in seconds
      setElapsedTime(elapsed)
    }, 1000)

    return () => clearInterval(interval)
  }, [startTime])

  const progress = ((currentQuestion + 1) / sampleQuestions.length) * 100

  const handleNext = () => {
    if (selectedAnswer) {
      setAnswers((prev) => ({
        ...prev,
        [currentQuestion]: selectedAnswer,
      }))

      if (currentQuestion < sampleQuestions.length - 1) {
        setCurrentQuestion((prev) => prev + 1)
        setSelectedAnswer(answers[currentQuestion + 1] || "")
        setShowWarning(false)
      } else {
        // Calculate results
        const endTime = new Date()
        const durationInSeconds = startTime ? Math.floor((endTime.getTime() - startTime.getTime()) / 1000) : 0
        const minutes = Math.floor(durationInSeconds / 60)
        const seconds = durationInSeconds % 60
        const durationFormatted = `${minutes} menit ${seconds} detik`

        let correctCount = 0
        let incorrectCount = 0

        // Count correct and incorrect answers
        Object.entries(answers).forEach(([questionIndex, answer]) => {
          const index = Number.parseInt(questionIndex)
          if (sampleQuestions[index].correctAnswer === answer) {
            correctCount++
          } else {
            incorrectCount++
          }
        })

        // Add current question's answer
        if (sampleQuestions[currentQuestion].correctAnswer === selectedAnswer) {
          correctCount++
        } else {
          incorrectCount++
        }

        // Calculate score (0-100)
        const score = Math.round((correctCount / sampleQuestions.length) * 100)

        // Store results in sessionStorage
        const testResults = {
          packageName: "Paket A - Tes Kepribadian",
          score,
          correctAnswers: correctCount,
          totalQuestions: sampleQuestions.length,
          completionTime: durationFormatted,
          category: score >= 80 ? "Sangat Baik" : score >= 60 ? "Baik" : "Perlu Perbaikan",
          answers: { ...answers, [currentQuestion]: selectedAnswer },
          questions: sampleQuestions,
        }

        sessionStorage.setItem("testResults", JSON.stringify(testResults))

        // Navigate to results page
        router.push("/user/results")
      }
    } else {
      setShowWarning(true)
    }
  }

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion((prev) => prev - 1)
      setSelectedAnswer(answers[currentQuestion - 1] || "")
      setShowWarning(false)
    }
  }

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes}:${remainingSeconds < 10 ? "0" : ""}${remainingSeconds}`
  }

  const currentQ = sampleQuestions[currentQuestion]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <h1 className="text-xl font-semibold text-gray-900">Paket A - Tes Kepribadian</h1>
            <div className="flex items-center gap-4">
              <div className="text-sm text-gray-600">
                Waktu: <span className="font-medium">{formatTime(elapsedTime)}</span>
              </div>
              <div className="text-sm text-gray-600">
                Soal {currentQuestion + 1} dari {sampleQuestions.length}
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Progress Bar */}
      <div className="bg-white border-b">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Progress value={progress} className="w-full" />
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-medium">{currentQ.question}</CardTitle>
          </CardHeader>
          <CardContent>
            {showWarning && (
              <Alert variant="destructive" className="mb-4">
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>Silakan pilih jawaban terlebih dahulu</AlertDescription>
              </Alert>
            )}

            <RadioGroup value={selectedAnswer} onValueChange={setSelectedAnswer} className="space-y-4">
              {currentQ.options.map((option) => (
                <div
                  key={option.value}
                  className="flex items-start space-x-3 p-4 rounded-lg border hover:bg-gray-50 transition-colors"
                >
                  <RadioGroupItem value={option.value} id={option.value} className="mt-1" />
                  <Label htmlFor={option.value} className="flex-1 cursor-pointer text-sm leading-relaxed">
                    <span className="font-medium mr-2">{option.value}.</span>
                    {option.text}
                  </Label>
                </div>
              ))}
            </RadioGroup>

            {/* Navigation Buttons */}
            <div className="flex justify-between mt-8">
              <Button variant="outline" onClick={handlePrevious} disabled={currentQuestion === 0}>
                <ChevronLeft className="w-4 h-4 mr-2" />
                Sebelumnya
              </Button>

              <Button onClick={handleNext}>
                {currentQuestion === sampleQuestions.length - 1 ? "Selesai" : "Selanjutnya"}
                {currentQuestion !== sampleQuestions.length - 1 && <ChevronRight className="w-4 h-4 ml-2" />}
              </Button>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}

export default function TestPage() {
  return (
    <AuthGuard requiredRole="user">
      <TestContent />
    </AuthGuard>
  )
}
