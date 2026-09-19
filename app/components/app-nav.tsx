"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Logo } from "./logo";
import { LeafIcon } from "./icons";
import { useRaifu } from "@/lib/store";
import { streakInfo } from "@/lib/selectors";
import { cx } from "./ui";

const NAV_ITEMS = [
  { href: "/", label: "Beranda" },
  { href: "/dashboard", label: "Dashboard" },
  { href: "/scan", label: "Scan Nutrisi" },
  { href: "/food-log", label: "Food Log" },
  { href: "/streak", label: "Streak & Badges" },
  { href: "/menu-sehat", label: "Menu Sehat" },
  { href: "/konsultasi", label: "Konsultasi Bot" },
  { href: "/edukasi", label: "Edukasi" },
] as const;

export function AppNav() {
  const pathname = usePathname();
  const { state, today } = useRaifu();
  const [open, setOpen] = useState(false);
  const streak = streakInfo(state, today);

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <header className="sticky top-0 z-50 border-b border-line bg-white/95 backdrop-blur">
      <nav
        aria-label="Navigasi aplikasi"
        className="mx-auto flex h-16 max-w-[1400px] items-center gap-6 px-4 sm:px-6 lg:px-8"
      >
        <Link href="/" className="shrink-0" aria-label="Raifu, ke beranda">
          <Logo showKatakanaWordmark />
        </Link>

        <ul className="hidden flex-1 items-center gap-1 xl:flex">
          {NAV_ITEMS.map((item) => (
            <li key={item.href}>
              <Link
                href={item.href}
                aria-current={isActive(item.href) ? "page" : undefined}
                className={cx(
                  "inline-flex h-16 items-center border-b-2 px-3 text-sm transition-colors",
                  isActive(item.href)
                    ? "border-sage font-medium text-sage"
                    : "border-transparent text-body hover:text-sage",
                )}
              >
                {item.label}
              </Link>
            </li>
          ))}
        </ul>

        <div className="ml-auto flex items-center gap-2 xl:ml-0">
          <Link
            href="/streak"
            className="hidden items-center gap-1.5 rounded-full bg-sage-soft px-3 py-1.5 text-xs font-medium text-sage transition-colors hover:bg-sage/15 sm:inline-flex"
          >
            <LeafIcon className="h-3.5 w-3.5" />
            {streak.days} Hari
          </Link>

          <button
            type="button"
            className="hidden h-9 w-9 items-center justify-center rounded-md text-body transition-colors hover:text-sage sm:inline-flex"
            aria-label="Notifikasi"
          >
            <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M18 8.5a6 6 0 10-12 0c0 5-2 6.5-2 6.5h16s-2-1.5-2-6.5z" strokeLinejoin="round" />
              <path d="M10.3 19a2 2 0 003.4 0" strokeLinecap="round" />
            </svg>
          </button>

          <Link
            href="/profil"
            aria-label="Profil & pengaturan"
            className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-line bg-white transition-colors hover:border-sage"
          >
            <span className="font-serif text-xs text-sage">
              {state.profile.name
                .split(" ")
                .slice(0, 2)
                .map((word) => word[0])
                .join("")}
            </span>
          </Link>

          <button
            type="button"
            onClick={() => setOpen((value) => !value)}
            aria-expanded={open}
            aria-controls="app-menu-mobile"
            className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-line text-ink xl:hidden"
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
        <div id="app-menu-mobile" className="border-t border-line bg-white xl:hidden">
          <ul className="mx-auto max-w-[1400px] px-4 py-2 sm:px-6">
            {NAV_ITEMS.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className={cx(
                    "block border-b border-line/70 py-3 text-sm last:border-0",
                    isActive(item.href) ? "font-medium text-sage" : "text-body",
                  )}
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </header>
  );
}
