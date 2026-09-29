"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Logo } from "./logo";
import {
  BellIcon,
  BookIcon,
  BowlIcon,
  ChatIcon,
  FlameIcon,
  GridIcon,
  JournalIcon,
  LeafIcon,
  ScanIcon,
} from "./icons";
import { useRaifu } from "@/lib/store";
import { streakInfo } from "@/lib/selectors";
import { cx } from "./ui";

// Tab bar produk — sengaja beda dari nav marketing (SiteNav): ikon+label
// dalam pil aktif, bukan garis-bawah ala tautan halaman. Tanpa "Beranda":
// begitu masuk, tidak ada alasan untuk kembali ke halaman pemasaran.
const NAV_ITEMS = [
  { href: "/dashboard", label: "Dashboard", icon: GridIcon },
  { href: "/scan", label: "Scan Nutrisi", icon: ScanIcon },
  { href: "/food-log", label: "Food Log", icon: JournalIcon },
  { href: "/streak", label: "Streak & Badges", icon: FlameIcon },
  { href: "/menu-sehat", label: "Menu Sehat", icon: BowlIcon },
  { href: "/konsultasi", label: "Konsultasi Bot", icon: ChatIcon },
  { href: "/edukasi", label: "Edukasi", icon: BookIcon },
] as const;

export function AppNav() {
  const pathname = usePathname();
  const { state, today } = useRaifu();
  const [open, setOpen] = useState(false);
  const streak = streakInfo(state, today);

  const isActive = (href: string) => pathname.startsWith(href);

  return (
    <header className="sticky top-0 z-50 border-b border-line bg-mist/90 backdrop-blur">
      <nav
        aria-label="Navigasi produk"
        className="mx-auto flex h-16 max-w-[1400px] items-center gap-4 px-4 sm:px-6 lg:px-8"
      >
        <Link href="/dashboard" className="shrink-0" aria-label="Raifu, ke Dashboard">
          <Logo showKatakanaWordmark />
        </Link>

        <ul className="hidden flex-1 items-center gap-1 xl:flex">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.href);
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  aria-current={active ? "page" : undefined}
                  className={cx(
                    "inline-flex items-center gap-2 rounded-md px-3 py-2 text-sm transition-colors",
                    active
                      ? "bg-sage text-white"
                      : "text-body hover:bg-white hover:text-sage",
                  )}
                >
                  <Icon className="h-4 w-4" />
                  {item.label}
                </Link>
              </li>
            );
          })}
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
            className="hidden h-11 w-11 items-center justify-center rounded-md text-body transition-colors hover:bg-white hover:text-sage sm:inline-flex"
            aria-label="Notifikasi"
          >
            <BellIcon className="h-5 w-5" />
          </button>

          <Link
            href="/profil"
            aria-label="Profil & pengaturan"
            className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-line bg-white transition-colors hover:border-sage"
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
            className="inline-flex h-11 w-11 items-center justify-center rounded-md border border-line text-ink xl:hidden"
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
            {NAV_ITEMS.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.href);
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    onClick={() => setOpen(false)}
                    className={cx(
                      "flex items-center gap-3 border-b border-line/70 py-3 text-sm last:border-0",
                      active ? "font-medium text-sage" : "text-body",
                    )}
                  >
                    <Icon className="h-4 w-4" />
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </header>
  );
}
