"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { Loader2 } from "lucide-react"

interface AuthGuardProps {
  children: React.ReactNode
  requiredRole?: "admin" | "user"
  redirectTo?: string
}

// Mock auth state for demo
let currentUser: any = null

export default function AuthGuard({ children, requiredRole, redirectTo = "/" }: AuthGuardProps) {
  const [loading, setLoading] = useState(true)
  const [authenticated, setAuthenticated] = useState(false)

  useEffect(() => {
    // Simulate auth check
    const checkAuth = () => {
      // Check if user is stored in sessionStorage (for demo)
      const storedUser = sessionStorage.getItem("currentUser")

      if (storedUser) {
        const user = JSON.parse(storedUser)
        currentUser = user

        // Check role if required
        if (requiredRole && user.role !== requiredRole) {
          window.location.href = redirectTo
          return
        }

        setAuthenticated(true)
      } else {
        window.location.href = redirectTo
      }

      setLoading(false)
    }

    // Simulate async auth check
    setTimeout(checkAuth, 500)
  }, [requiredRole, redirectTo])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Memuat...</p>
        </div>
      </div>
    )
  }

  if (!authenticated) {
    return null
  }

  return <>{children}</>
}
