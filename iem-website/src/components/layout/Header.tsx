"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { navLinks } from "@/lib/data";

export default function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Firm up the bottom edge once the page leaves the top
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Every nav link sits in the viewport on desktop, and every route here is
  // static — so the default <Link> behaviour prefetches all ten full route
  // payloads (~65 kB compressed) on every single page view, most of which is
  // for pages the reader never opens. Prefetch on intent instead: pointing at
  // or tabbing to a link precedes the click by long enough to cover a payload
  // this small, so navigation still lands instantly.
  const prefetchOnIntent = useCallback(
    (href: string) => () => router.prefetch(href),
    [router],
  );

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
    <>
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
              {/* width/height describe the box the logo is PAINTED in (h-12
                  ≈ 112px wide at the source's 2.33 aspect), not the source
                  file's 2330px. next/image derives the srcset from them, so
                  overstating it made every page preload a 2048px-wide render
                  of a thumbnail-sized mark. */}
              <Image
                src="/images/rvce-logo.png"
                alt="RV College of Engineering"
                width={112}
                height={48}
                priority
                className={`w-auto transition-[height] duration-300 ${
                  scrolled ? "h-10" : "h-12"
                }`}
              />
              {/* Department lockup — shown wherever there's room: from sm up,
                  except lg→xl where the full nav row needs the width. */}
              <span
                className="hidden sm:block lg:hidden xl:block w-px self-stretch bg-primary/15"
                aria-hidden="true"
              />
              <div className="hidden sm:block lg:hidden xl:block">
                <p className="text-base font-display font-bold text-primary leading-tight">
                  Industrial Engineering
                </p>
                <p className="text-sm text-text-muted leading-tight">
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
                    prefetch={false}
                    onMouseEnter={prefetchOnIntent(link.href)}
                    onFocus={prefetchOnIntent(link.href)}
                    onTouchStart={prefetchOnIntent(link.href)}
                    className={`px-3 py-2 text-base ${
                      active
                        ? "text-primary wavy-underline font-bold"
                        : "text-text-muted glow-hover"
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
            className="lg:hidden border-t-[3px] border-dashed border-primary bg-background px-4 py-3 max-h-[calc(100svh-5.25rem)] overflow-y-auto"
          >
            {navLinks.map((link) => {
              const active = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  prefetch={false}
                  onTouchStart={prefetchOnIntent(link.href)}
                  onFocus={prefetchOnIntent(link.href)}
                  onClick={() => setMobileOpen(false)}
                  className={`block px-3 py-2.5 text-lg ${
                    active
                      ? "text-primary wavy-underline font-bold"
                      : "text-text-muted glow-hover"
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>
        )}
      </header>
    </>
  );
}
