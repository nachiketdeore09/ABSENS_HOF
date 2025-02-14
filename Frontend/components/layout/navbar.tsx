"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useDispatch, useSelector } from "react-redux";
import { ModeToggle } from "@/components/mode-toggle";
import { Menu, AlertTriangle } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

import { Loader } from "@/components/ui/loader";
import { logout } from "@/lib/slices/authSlice";

const routes = [
  {
    href: "/",
    label: "Home",
  },
  {
    href: "/report",
    label: "Report Missing",
  },
  {
    href: "/search",
    label: "Find Missing",
  },
  {
    href: "/alerts",
    label: "Alerts",
  },
  {
    href: "/dashboard",
    label: "Dashboard",
  },
];

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const dispatch = useDispatch();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  // Use the global auth state instead of local state.
  const user = useSelector((state: { auth: { user: any } }) => state.auth.user);
  const isLoggedIn = Boolean(user);

  // Reset loading state when the route changes
  useEffect(() => {
    setLoading(false);
  }, [pathname]);

  const handleLinkClick = () => {
    setLoading(true);
  };

  // Handle logout by dispatching the logout action and then redirecting.
  const handleLogout = () => {
    dispatch(logout());
    router.push("/");
  };

  // Base routes always visible.
  const routes = [
    { href: "/", label: "Home" },
    { href: "/find", label: "Find Missing" },
    { href: "/report", label: "Report Missing" },
    { href: "/alerts", label: "Alerts" },
  ];

  // Add the dashboard route if the user is logged in.
  if (isLoggedIn) {
    routes.push({ href: "/dashboard", label: "Dashboard" });
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-[#004d40] px-8">
      <div className="container flex h-16 items-center relative">
        {/* Desktop Navigation */}
        <div className="mr-4 hidden md:flex flex-1">
          <Link
            href="/"
            onClick={handleLinkClick}
            className="mr-6 flex items-center space-x-2"
          >
            <AlertTriangle className="h-6 w-6 text-white" />
            <span className="text-xl font-bold text-white">ABSENS</span>
          </Link>
          <nav className="flex items-center space-x-6 text-sm font-medium">
            {routes.map((route) => (
              <Link
                key={route.href}
                href={route.href}
                onClick={handleLinkClick}
                className={`transition-colors hover:text-white/80 ${
                  pathname === route.href ? "text-white" : "text-white/60"
                }`}
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
          <SheetContent
            side="left"
            className="bg-[#004d40] text-white border-r-0"
          >
            <Link
              href="/"
              onClick={() => {
                setOpen(false);
                handleLinkClick();
              }}
              className="flex items-center space-x-2 mb-8"
            >
              <AlertTriangle className="h-6 w-6" />
              <span className="text-xl font-bold">ABSENS</span>
            </Link>
            <nav className="flex flex-col gap-4">
              {routes.map((route) => (
                <Link
                  key={route.href}
                  href={route.href}
                  onClick={() => {
                    setOpen(false);
                    handleLinkClick();
                  }}
                  className={`text-lg font-medium transition-colors hover:text-white/80 ${
                    pathname === route.href ? "text-white" : "text-white/60"
                  }`}
                >
                  {route.label}
                </Link>
              ))}
            </nav>
          </SheetContent>
        </Sheet>

        {/* Right Side: Register or Logout button, plus ModeToggle */}
        <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
          <div className="w-full flex-1 md:w-auto md:flex-none"></div>
          {isLoggedIn ? (
            <Button
              variant="outline"
              className="mr-2 bg-red-500 text-white"
              onClick={handleLogout}
            >
              Logout
            </Button>
          ) : (
            <Button
              variant="outline"
              className="mr-2 bg-[#004d40] text-white"
              asChild
            >
              <Link href="/signup" onClick={handleLinkClick}>
                Register
              </Link>
            </Button>
          )}
          <ModeToggle />
        </div>

        {/* Loader overlay */}
        {loading && (
          <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/30">
            <Loader size="lg" overlay={true} />
          </div>
        )}
      </div>
    </header>
  );
}
