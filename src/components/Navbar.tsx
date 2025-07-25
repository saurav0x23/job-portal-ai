"use client";

import Link from "next/link";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";
import { Toggle } from "./ui/toggle";
import { Menu, MoonIcon, Sun, X } from "lucide-react";
import { useTheme } from "next-themes";
import { createClient } from "@/utils/supabase/client";
import { useEffect, useState } from "react";

const supabase = createClient();

export function Navbar() {
  const [user, setUser] = useState(false);
  const [loading, setLoading] = useState(true);
  const [menuOpen, setMenuOpen] = useState(false);
  const { theme, setTheme } = useTheme();

  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/jobs", label: "Jobs" },
    { href: "/resume", label: "Resume" },
    { href: "/contact", label: "Contact" },
    { href: "/about", label: "About" },
  ];

  useEffect(() => {
    const fetchUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      setUser(!!user);
      setLoading(false);
    };

    fetchUser();
  }, []);

  // Close mobile menu when clicking outside or on escape
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setMenuOpen(false);
      }
    };

    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (menuOpen && !target.closest(".mobile-menu-container")) {
        setMenuOpen(false);
      }
    };

    if (menuOpen) {
      document.addEventListener("keydown", handleEscape);
      document.addEventListener("click", handleClickOutside);
      // Prevent body scroll when menu is open
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.removeEventListener("click", handleClickOutside);
      document.body.style.overflow = "unset";
    };
  }, [menuOpen]);

  const handleMenuToggle = () => {
    setMenuOpen(!menuOpen);
  };

  const handleMobileLinkClick = () => {
    setMenuOpen(false);
  };

  return (
    <header className="w-full sticky top-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex-shrink-0">
            <div className="flex items-center space-x-2">
              <span className="text-lg sm:text-xl font-bold text-foreground hover:text-primary transition-colors">
                SkillSync.
              </span>
              <div className="hidden sm:block hover:bg-primary h-0.5 w-8 bg-foreground transition-colors" />
            </div>
          </Link>

          {/* Desktop Navigation */}
          <NavigationMenu className="hidden lg:flex">
            <NavigationMenuList className="flex items-center space-x-1">
              {navLinks.map((link) => (
                <NavigationMenuItem key={link.href}>
                  <Link href={link.href} passHref legacyBehavior>
                    <NavigationMenuLink className="px-3 py-2 text-sm font-medium text-foreground hover:text-primary hover:bg-accent rounded-md transition-all duration-200">
                      {link.label}
                    </NavigationMenuLink>
                  </Link>
                </NavigationMenuItem>
              ))}
            </NavigationMenuList>
          </NavigationMenu>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center space-x-3">
            {!loading && (
              <Link
                href={user ? "/dashboard" : "/auth"}
                className="inline-flex items-center px-4 py-2 text-sm font-medium text-background bg-primary hover:bg-primary/90 border border-primary rounded-md transition-all duration-200 hover:shadow-md"
              >
                {user ? "Dashboard" : "Get Started"}
              </Link>
            )}

            <Toggle
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="p-2"
              aria-label="Toggle theme"
            >
              {theme === "light" ? <MoonIcon size={18} /> : <Sun size={18} />}
            </Toggle>
          </div>

          {/* Mobile Menu Button and Theme Toggle */}
          <div className="flex items-center space-x-2 md:hidden">
            <Toggle
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="p-2"
              aria-label="Toggle theme"
            >
              {theme === "light" ? <MoonIcon size={16} /> : <Sun size={16} />}
            </Toggle>

            <button
              onClick={handleMenuToggle}
              className="p-2 text-foreground hover:text-primary hover:bg-accent rounded-md transition-colors mobile-menu-container"
              aria-label="Toggle mobile menu"
              aria-expanded={menuOpen}
            >
              {menuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        {menuOpen && (
          <div className="md:hidden mobile-menu-container">
            <div className="px-2 pt-2 pb-3 space-y-1 bg-background border-t">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={handleMobileLinkClick}
                  className="block px-3 py-3 text-base font-medium text-foreground hover:text-primary hover:bg-accent rounded-md transition-all duration-200 border-b border-border/50 last:border-b-0"
                >
                  {link.label}
                </Link>
              ))}

              {!loading && (
                <div className="pt-4 pb-2">
                  <Link
                    href={user ? "/dashboard" : "/auth"}
                    onClick={handleMobileLinkClick}
                    className="block w-full text-center px-4 py-3 text-sm font-medium text-background bg-primary hover:bg-primary/90 border border-primary rounded-md transition-all duration-200"
                  >
                    {user ? "Dashboard" : "Get Started"}
                  </Link>
                </div>
              )}
            </div>

            {/* Mobile Menu Overlay */}
            <div
              className="fixed inset-0 bg-background/80 backdrop-blur-sm -z-10"
              onClick={() => setMenuOpen(false)}
            />
          </div>
        )}
      </div>
    </header>
  );
}
