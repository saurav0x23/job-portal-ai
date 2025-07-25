"use client";

import { ThemeProvider } from "@/components/theme-provider";
import "./globals.css";
import { Navbar } from "@/components/Navbar";
import Loader from "@/components/Loader";
import { useEffect, useState } from "react";
import { Toaster } from "@/components/ui/sonner";
import { createClient } from "@/utils/supabase/client";
import Footer from "@/components/Footer";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate loading for 1.5s; replace with actual logic if needed
    const timer = setTimeout(() => {
      setLoading(false);
    }, 4500);

    return () => clearTimeout(timer);
  }, []);

  // Disable scroll while loading
  useEffect(() => {
    if (loading) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
  }, [loading]);

  useEffect(() => {
    const checkAuth = async () => {
      const supabase = createClient();
      const {
        data: { session },
      } = await supabase.auth.getSession();

      const isPublicPage = ["/login", "/register"].includes(
        window.location.pathname
      );
      if (!session && !isPublicPage) {
        window.location.href = "/login";
      }
    };

    checkAuth();
  }, []);

  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen bg-background text-foreground">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {loading ? (
            <Loader />
          ) : (
            <>
              <Navbar />
              {children}
              <Footer />
              <Toaster richColors />
            </>
          )}
        </ThemeProvider>
      </body>
    </html>
  );
}
