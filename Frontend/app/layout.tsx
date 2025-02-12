import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Navbar from "@/components/layout/navbar";
import Footer from "@/components/layout/footer";
import { ThemeProvider } from "@/components/theme-provider";
import { Suspense } from "react";
import { Loader } from "@/components/ui/loader";
import type React from "react";
import { ClientProviders } from "@/components/ClientProviders";
import RefreshTokenProvider from "@/components/RefreshTokenProvider"; // Ensure correct path

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  preload: true,
  fallback: ["system-ui", "arial"],
});

export const metadata: Metadata = {
  title: "Modern Next.js Application",
  description: "A professional Next.js application with a modern design",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          {/* Wrap content with ClientProviders */}
          <ClientProviders>
            {/* Insert the client component that handles token refresh */}
            <RefreshTokenProvider />
            <div className="flex min-h-screen flex-col">
              <Navbar />
              <Suspense fallback={<Loader size="lg" />}>
                <main className="flex-1">{children}</main>
              </Suspense>
              <Footer />
            </div>
          </ClientProviders>
        </ThemeProvider>
      </body>
    </html>
  );
}
