"use client";

import { ThemeProvider } from "@/components/theme-provider";
import "./globals.css";
import { Navbar } from "@/components/Navbar";
import Loader from "@/components/Loader";
import { useEffect, useState } from "react";
import { Toaster } from "@/components/ui/sonner";
import { createClient } from "@/utils/supabase/client";

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

  const checkAuth = async () => {
    const supabase = createClient();
    const {
      data: { session },
    } = await supabase.auth.getSession();
    if (!session) {
      window.location.href = "/login"; // Redirect to login if not authenticated
    }
  };

  useEffect(() => {
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
              <Toaster richColors />
            </>
          )}
        </ThemeProvider>
      </body>
    </html>
  );
}
