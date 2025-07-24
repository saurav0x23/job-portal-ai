"use client";

import {
  Linkedin,
  Github,
  Twitter,
  Mail,
  ArrowUpRight,
  Sparkles,
} from "lucide-react";
import { Button } from "./ui/button";
import Link from "next/link";

const Footer = () => {
  const currentYear = new Date().getFullYear();
  const footerLinks = [
    {
      title: "Platform",
      links: [
        { name: "How it works", href: "/how-it-works" },
        { name: "Pricing", href: "/pricing" },
        { name: "Success Stories", href: "/success-stories" },
        { name: "API", href: "/api" },
      ],
    },
    {
      title: "Resources",
      links: [
        { name: "Blog", href: "/blog" },
        { name: "Career Tips", href: "/career-tips" },
        { name: "Resume Templates", href: "/templates" },
        { name: "Interview Prep", href: "/interview-prep" },
      ],
    },
    {
      title: "Company",
      links: [
        { name: "About Us", href: "/about" },
        { name: "Careers", href: "/careers" },
        { name: "Privacy Policy", href: "/privacy" },
        { name: "Terms of Service", href: "/terms" },
      ],
    },
  ];

  const socialLinks = [
    {
      icon: Linkedin,
      href: "https://linkedin.com/company/yourplatform",
      label: "LinkedIn",
    },
    {
      icon: Twitter,
      href: "https://twitter.com/yourplatform",
      label: "Twitter",
    },
    {
      icon: Github,
      href: "https://github.com/yourplatform",
      label: "GitHub",
    },
    {
      icon: Mail,
      href: "mailto:hello@yourplatform.com",
      label: "Email",
    },
  ];

  return (
    <footer className="relative bg-card border-t border-border/50">
      {/* Floating elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-20 left-1/4 w-48 h-48 bg-primary/10 rounded-full filter blur-3xl"></div>
        <div className="absolute bottom-10 right-1/3 w-64 h-64 bg-foreground/5 rounded-full filter blur-3xl"></div>
      </div>

      <div className="relative z-10 container px-6 py-12 mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12">
          {/* Platform info */}
          <div className="space-y-4">
            <Link href="/" className="flex items-center gap-2">
              <Sparkles className="w-6 h-6 text-primary" />
              <span className="text-xl font-bold">SkillSync</span>
            </Link>
            <p className="text-muted-foreground max-w-xs">
              The AI-powered job platform that helps you land your dream career
              faster.
            </p>

            {/* Newsletter signup */}
          </div>

          {/* Footer links */}
          {footerLinks.map((section) => (
            <div key={section.title} className="space-y-4">
              <h3 className="font-semibold text-lg">{section.title}</h3>
              <ul className="space-y-3">
                {section.links.map((link) => (
                  <li key={link.name}>
                    <Link
                      href={link.href}
                      className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors group"
                    >
                      {link.name}
                      <ArrowUpRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* Contact info */}
          <div className="space-y-4">
            <h3 className="font-semibold text-lg">Contact Us</h3>
            <address className="not-italic text-muted-foreground space-y-3">
              <p>123 Career Street</p>
              <p>San Francisco, CA 94107</p>
              <p>hello@skillsync.ai</p>
              <p>+1 (555) 123-4567</p>
            </address>

            {/* Social links */}
            <div className="flex gap-4 pt-2">
              {socialLinks.map((social) => (
                <Link
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-lg bg-muted hover:bg-primary/10 transition-colors"
                  aria-label={social.label}
                >
                  <social.icon className="w-5 h-5 text-muted-foreground hover:text-primary transition-colors" />
                </Link>
              ))}
            </div>
          </div>
        </div>


        {/* Bottom bar */}
        <div className="border-t border-border/50 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-muted-foreground">
            © {currentYear} SkillSync. All rights reserved.
          </p>

          <div className="flex gap-6">
            <Link
              href="/privacy"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              Privacy Policy
            </Link>
            <Link
              href="/terms"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              Terms of Service
            </Link>
            <Link
              href="/cookies"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              Cookie Policy
            </Link>
          </div>
        </div>
        
      </div>
    </footer>
  );
};

export default Footer;
