"use client"

import { Loader2 } from "lucide-react"

export function Loader({ size = "default", overlay = false }: { size?: "default" | "sm" | "lg", overlay?: boolean }) {
  const sizeClass = size === "sm" ? "w-4 h-4" : size === "lg" ? "w-8 h-8" : "w-6 h-6"
  const containerClass = overlay 
    ? "fixed inset-0 z-50 flex items-center justify-center bg-black/30"
    : "flex justify-center items-center"

  return (
    <div className={containerClass}>
      <Loader2 className={`animate-spin ${sizeClass}`} />
    </div>
  )
}
