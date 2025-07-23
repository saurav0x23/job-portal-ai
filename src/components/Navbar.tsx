"use client";

import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";
import { Toggle } from "./ui/toggle";
import { MoonIcon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

export function Navbar() {
  const { theme, setTheme } = useTheme();
  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/jobs", label: "Jobs" },
    { href: "/resume", label: "Resume" },
    { href: "/contact", label: "Contact" },
    { href: "/about", label: "About" },
  ];

  return (
    <div className="w-full flex items-center justify-center p-4">
      <NavigationMenu className="w-full max-w-6xl flex items-center justify-between">
        <NavigationMenuLink href="/">
          <p className="text-lg font-bold">CAREERBOOST Ai</p>
          <div className=" hover:bg-foreground/70 h-0.5 w-full bg-foreground"></div>
        </NavigationMenuLink>
        <NavigationMenuList className="flex space-x-4 items-center">
          {navLinks.map((link) => (
            <NavigationMenuItem key={link.href}>
              <NavigationMenuLink href={link.href}>
                {link.label}
              </NavigationMenuLink>
            </NavigationMenuItem>
          ))}
        </NavigationMenuList>
        <NavigationMenuList className="flex items-center space-x-4">
          <NavigationMenuItem className="ml-auto flex items-center">
            <NavigationMenuLink
              href="/register"
              className="ml-2 border border-primary bg-foreground text-background px-4 py-2 rounded-md hover:bg-primary hover:text-background/90 transition-all duration-200 ease-in-out"
            >
              Get Started{" "}
            </NavigationMenuLink>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <Toggle
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            >
              {theme === "light" ? <MoonIcon size={20} /> : <Sun size={24} />}
            </Toggle>
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>
    </div>
  );
}
