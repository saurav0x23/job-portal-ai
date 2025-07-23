"use client";

import { ThemeProvider } from "@/components/theme-provider";
import "./globals.css";
import { Navbar } from "@/components/Navbar";
import Loader from "@/components/Loader";
import { useEffect, useState } from "react";

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
            </>
          )}
        </ThemeProvider>
      </body>
    </html>
  );
}
