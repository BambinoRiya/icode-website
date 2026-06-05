"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"

const navLinks = [
  { href: "/#systems", label: "Systems" },
  { href: "/#lab", label: "Lab" },
  { href: "/field-notes", label: "Field Notes" },
  { href: "/team", label: "Our Team" },
  { href: "/admin/login", label: "Admin", isAdmin: true },
]

export function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <motion.nav
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="fixed top-0 left-0 right-0 z-50 backdrop-blur-xl bg-[#FAFAF7]/80 border-b border-border"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <Image
              src="/logo.svg"
              alt="iCODE Abakwa"
              width={200}
              height={60}
              className="h-10 lg:h-12 w-auto"
              priority
            />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`transition-colors duration-200 text-sm font-medium ${
                  link.isAdmin
                    ? "px-3 py-1 rounded-full bg-[#e53888]/10 text-[#e53888] hover:bg-[#e53888]/20"
                    : "text-foreground/70 hover:text-[#e53888]"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* CTA Button */}
          <div className="hidden lg:block">
            <Link
              href="#join"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#e53888] text-white rounded-full text-sm font-medium hover:bg-[#d12d77] transition-colors duration-200 shadow-lg shadow-[#e53888]/25"
            >
              Join Us
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 text-foreground/70 hover:text-[#e53888] transition-colors"
            aria-label="Toggle menu"
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              {mobileMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="lg:hidden bg-[#FAFAF7]/95 backdrop-blur-xl border-b border-border"
          >
            <div className="px-4 py-4 space-y-3">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`block py-2 transition-colors text-base ${
                    link.isAdmin
                      ? "px-3 py-2 rounded-full bg-[#e53888]/10 text-[#e53888] hover:bg-[#e53888]/20"
                      : "text-foreground/70 hover:text-[#e53888]"
                  }`}
                >
                  {link.label}
                </Link>
              ))}
              <Link
                href="#join"
                onClick={() => setMobileMenuOpen(false)}
                className="block w-full text-center py-3 bg-[#e53888] text-white rounded-full text-sm font-medium hover:bg-[#d12d77] transition-colors mt-4"
              >
                Join Us
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  )
}
