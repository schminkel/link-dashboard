"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { EnhancedBackground } from "./enhanced-background"
import { Eye, EyeOff, Lock, LogOut } from "lucide-react"

interface PasswordProtectionProps {
  children: React.ReactNode
}

export function PasswordProtection({ children }: PasswordProtectionProps) {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  const CORRECT_PASSWORD = process.env.NEXT_PUBLIC_DASHBOARD_PASSWORD || "123"

  useEffect(() => {
    // Check if user is already authenticated
    const authStatus = localStorage.getItem("dashboard-authenticated")
    if (authStatus === "true") {
      setIsAuthenticated(true)
    }
    setIsLoading(false)
  }, [])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!password.trim()) {
      setError("Please enter a password")
      return
    }

    if (password.trim() === CORRECT_PASSWORD) {
      setIsAuthenticated(true)
      localStorage.setItem("dashboard-authenticated", "true")
      setError("")
    } else {
      setError("Incorrect password. Please try again.")
      setPassword("")
    }
  }

  const handleLogout = () => {
    setIsAuthenticated(false)
    localStorage.removeItem("dashboard-authenticated")
    setPassword("")
    setError("")
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <EnhancedBackground />
        <div className="text-slate-300">Loading...</div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <EnhancedBackground />
        <Card className="w-full max-w-md bg-slate-900/80 backdrop-blur-sm border-slate-700/50">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 p-3 bg-blue-600/20 rounded-xl backdrop-blur-sm border border-blue-500/20 w-fit">
              <Lock className="h-8 w-8 text-blue-400" />
            </div>
            <CardTitle className="text-2xl font-bold text-slate-100">Access Required</CardTitle>
            <p className="text-slate-400">Enter the password to access the Links Dashboard</p>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="relative">
                <Input
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter password (3-digit number)"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pr-10 bg-slate-800/50 border-slate-600 text-slate-100 placeholder-slate-400"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-2 top-1/2 -translate-y-1/2 h-6 w-6 p-0 text-slate-400 hover:text-slate-300"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
              </div>

              {error && (
                <div className="text-red-400 text-sm text-center bg-red-900/20 border border-red-500/30 rounded-md p-2">
                  {error}
                </div>
              )}

              <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white">
                Access Dashboard
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="relative">
      {children}
      {/* Logout Button - Bottom Right */}
      <div className="fixed bottom-4 right-4 z-50">
        <Button
          onClick={handleLogout}
          variant="outline"
          size="sm"
          className="h-10 w-10 p-0 bg-slate-900/80 backdrop-blur-sm border-slate-600 text-slate-400 hover:text-red-400 hover:bg-slate-800/80 rounded-full"
          title="Logout"
        >
          <LogOut className="h-4 w-4" />
          <span className="sr-only">Logout</span>
        </Button>
      </div>
    </div>
  )
}
