"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { navLinks } from "@/lib/data";

export default function Header() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Firm up the bottom edge once the page leaves the top
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close the mobile menu on Escape while it is open.
  useEffect(() => {
    if (!mobileOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMobileOpen(false);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [mobileOpen]);

  return (
    <header
      className="sticky top-0 z-50 bg-background/95 backdrop-blur transition-all duration-200 border-b-[3px]"
      style={{
        borderBottomStyle: "dashed",
        borderBottomColor: scrolled ? "#2d2d2d" : "transparent",
      }}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div
          className={`flex items-center justify-between transition-[height] duration-300 ${
            scrolled ? "h-16" : "h-20"
          }`}
        >
          <Link href="/" className="flex items-center gap-3 shrink-0 group">
            <Image
              src="/images/rvce-logo.png"
              alt="RV College of Engineering"
              width={2000}
              height={820}
              priority
              className={`w-auto transition-[height] duration-300 ${
                scrolled ? "h-9" : "h-11"
              }`}
            />
            <span
              className="hidden xl:block w-px self-stretch bg-primary/15"
              aria-hidden="true"
            />
            <div className="hidden xl:block">
              <p className="text-sm font-display font-bold text-primary leading-tight">
                Industrial Engineering
              </p>
              <p className="text-xs text-text-muted leading-tight">
                &amp; Management
              </p>
            </div>
          </Link>

          <nav className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => {
              const active = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`px-3 py-2 text-base transition-transform duration-100 hover:-rotate-2 ${
                    active
                      ? "text-primary wavy-underline font-bold"
                      : "text-text-muted hover:text-primary wavy-hover"
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="lg:hidden p-2 border-[3px] border-primary bg-white shadow-sketch active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all duration-100"
            style={{ borderRadius: "var(--wobble-sm)" }}
            aria-label="Toggle navigation menu"
            aria-expanded={mobileOpen}
            aria-controls="mobile-nav"
          >
            <svg
              className="w-6 h-6 text-primary"
              fill="none"
              stroke="currentColor"
              strokeWidth={2.5}
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              {mobileOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>
        </div>
      </div>

      {mobileOpen && (
        <nav
          id="mobile-nav"
          className="lg:hidden border-t-[3px] border-dashed border-primary bg-background px-4 py-3"
        >
          {navLinks.map((link) => {
            const active = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className={`block px-3 py-2.5 text-lg ${
                  active
                    ? "text-primary wavy-underline font-bold"
                    : "text-text-muted hover:text-primary"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>
      )}
    </header>
  );
}
