"use client"

import { Loader2 } from "lucide-react"

export function Loader({ size = "default" }: { size?: "default" | "sm" | "lg" }) {
  const sizeClass = size === "sm" ? "w-4 h-4" : size === "lg" ? "w-8 h-8" : "w-6 h-6"

  return (
    <div className="flex justify-center items-center">
      <Loader2 className={`animate-spin ${sizeClass}`} />
    </div>
  )
}

