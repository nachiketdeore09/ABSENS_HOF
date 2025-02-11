"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { ModeToggle } from "@/components/mode-toggle"
import { Menu, AlertTriangle } from "lucide-react"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { useState, useEffect } from "react"

export default function Navbar() {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)
  const [isLoggedIn, setIsLoggedIn] = useState(false)

  useEffect(() => {
    // For example, assume the token is stored in localStorage under the key "token"
    const token = localStorage.getItem("token")
    if (token) {
      setIsLoggedIn(true)
    }
  }, [])

  // Base routes always visible
  const routes = [
    { href: "/", label: "Home" },
    { href: "/report", label: "Report Missing" },
    { href: "/search", label: "Search" },
    { href: "/alerts", label: "Alerts" },
  ]

  // Conditionally add the dashboard link if the user is logged in
  if (isLoggedIn) {
    routes.push({ href: "/dashboard", label: "Dashboard" })
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-[#004d40] px-8">
      <div className="container flex h-16 items-center">
        {/* Desktop Navigation */}
        <div className="mr-4 hidden md:flex flex-1">
          <Link href="/" className="mr-6 flex items-center space-x-2">
            <AlertTriangle className="h-6 w-6 text-white" />
            <span className="text-xl font-bold text-white">ABSENS</span>
          </Link>
          <nav className="flex items-center space-x-6 text-sm font-medium">
            {routes.map((route) => (
              <Link
                key={route.href}
                href={route.href}
                className={cn(
                  "transition-colors hover:text-white/80",
                  pathname === route.href ? "text-white" : "text-white/60"
                )}
              >
                {route.label}
              </Link>
            ))}
          </nav>
        </div>
        
        {/* Mobile Navigation using a Sheet */}
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild className="md:hidden">
            <Button variant="ghost" size="icon" className="mr-2 text-white">
              <Menu className="h-5 w-5" />
              <span className="sr-only">Toggle Menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="bg-[#004d40] text-white border-r-0">
            <Link href="/" className="flex items-center space-x-2 mb-8">
              <AlertTriangle className="h-6 w-6" />
              <span className="text-xl font-bold">ABSENS</span>
            </Link>
            <nav className="flex flex-col gap-4">
              {routes.map((route) => (
                <Link
                  key={route.href}
                  href={route.href}
                  className={cn(
                    "text-lg font-medium transition-colors hover:text-white/80",
                    pathname === route.href ? "text-white" : "text-white/60"
                  )}
                  onClick={() => setOpen(false)}
                >
                  {route.label}
                </Link>
              ))}
            </nav>
          </SheetContent>
        </Sheet>

        {/* Right Side: Register button or any additional controls */}
        <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
          <div className="w-full flex-1 md:w-auto md:flex-none"></div>
          {!isLoggedIn && (
            <Button variant="outline" className="mr-2 bg-[#004d40] text-white" asChild>
              <Link href="/signup">Register</Link>
            </Button>
          )}
          <ModeToggle />
        </div>
      </div>
    </header>
  )
}
