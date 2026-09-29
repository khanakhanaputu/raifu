"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Logo } from "./logo";

const LINKS = [
  { href: "#fitur", label: "Fitur" },
  { href: "#kalkulator", label: "Kalkulator" },
  { href: "#filosofi", label: "Filosofi" },
  { href: "#testimoni", label: "Testimoni" },
];

const APP_LINKS = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/tentang", label: "Tentang" },
] as const;

export function SiteNav() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-50 border-b bg-white/90 backdrop-blur transition-colors ${
        scrolled ? "border-line" : "border-transparent"
      }`}
    >
      <nav
        aria-label="Navigasi utama"
        className="mx-auto flex h-16 max-w-7xl items-center gap-8 px-4 sm:px-6 lg:px-10"
      >
        <Link href="/" className="shrink-0" aria-label="Raifu, ke beranda">
          <Logo showKatakanaWordmark />
        </Link>

        <ul className="hidden flex-1 items-center gap-7 lg:flex">
          {LINKS.map((link) => (
            <li key={link.href}>
              <a
                href={link.href}
                className="text-sm text-body transition-colors hover:text-sage"
              >
                {link.label}
              </a>
            </li>
          ))}
          {APP_LINKS.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                className="text-sm text-body transition-colors hover:text-sage"
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>

        <div className="ml-auto flex items-center gap-3 lg:ml-0">
          <span className="hidden items-center gap-1.5 rounded-full bg-sage-soft px-3 py-1.5 text-xs font-medium text-sage sm:inline-flex">
            <LeafIcon className="h-3.5 w-3.5" />
            Gratis Selamanya
          </span>
          <Link
            href="/masuk"
            className="hidden text-sm font-medium text-ink transition-colors hover:text-sage sm:inline-block"
          >
            Masuk
          </Link>
          <Link
            href="/masuk"
            className="inline-flex items-center rounded-md bg-sage px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-sage-dark"
          >
            Mulai Sekarang
          </Link>

          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-controls="menu-mobile"
            className="inline-flex h-11 w-11 items-center justify-center rounded-md border border-line text-ink lg:hidden"
          >
            <span className="sr-only">{open ? "Tutup menu" : "Buka menu"}</span>
            <svg viewBox="0 0 20 20" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.6">
              {open ? (
                <path d="M5 5l10 10M15 5L5 15" strokeLinecap="round" />
              ) : (
                <path d="M3 6h14M3 10h14M3 14h14" strokeLinecap="round" />
              )}
            </svg>
          </button>
        </div>
      </nav>

      {open && (
        <div id="menu-mobile" className="border-t border-line bg-white lg:hidden">
          <ul className="mx-auto max-w-7xl px-4 py-2 sm:px-6">
            {LINKS.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className="block border-b border-line/70 py-3 text-sm text-body"
                >
                  {link.label}
                </a>
              </li>
            ))}
            {APP_LINKS.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className="block border-b border-line/70 py-3 text-sm text-body last:border-0"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </header>
  );
}

function LeafIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 16 16" className={className} fill="none" stroke="currentColor" strokeWidth="1.4">
      <path d="M13 3C7.5 3 4 5.5 4 9.5a3.5 3.5 0 003.5 3.5C11 13 13 9 13 3z" strokeLinejoin="round" />
      <path d="M11 5.5C8.5 7 6.5 9.5 5.5 13" strokeLinecap="round" />
    </svg>
  );
}
