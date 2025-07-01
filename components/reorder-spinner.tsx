"use client"

import { Loader2 } from "lucide-react"

interface ReorderSpinnerProps {
  size?: "sm" | "md" | "lg"
  className?: string
}

export function ReorderSpinner({ size = "sm", className = "" }: ReorderSpinnerProps) {
  const sizeClasses = {
    sm: "h-4 w-4",
    md: "h-6 w-6",
    lg: "h-8 w-8",
  }

  return (
    <div className={`flex items-center justify-center ${className}`}>
      <Loader2 className={`${sizeClasses[size]} animate-spin text-blue-400`} />
    </div>
  )
}
