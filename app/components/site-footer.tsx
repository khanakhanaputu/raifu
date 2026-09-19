import Link from "next/link";
import { Logo } from "./logo";

const COLUMNS = [
  {
    title: "Produk",
    links: [
      { label: "Scan Gizi", href: "/scan" },
      { label: "Food Log Harian", href: "/food-log" },
      { label: "Dashboard Progres", href: "/dashboard" },
      { label: "Streak & Badges", href: "/streak" },
      { label: "Menu Sehat", href: "/menu-sehat" },
    ],
  },
  {
    title: "Perusahaan",
    links: [
      { label: "Tentang Raifu", href: "/tentang" },
      { label: "Edukasi & Artikel", href: "/edukasi" },
      { label: "Konsultasi Bot", href: "/konsultasi" },
      { label: "Masuk / Daftar", href: "/masuk" },
    ],
  },
  {
    title: "Bantuan",
    links: [
      { label: "FAQ", href: "/tentang" },
      { label: "Panduan Awal", href: "/onboarding" },
      { label: "Profil & Pengaturan", href: "/profil" },
      { label: "Kontak", href: "/tentang" },
    ],
  },
] as const;

export function SiteFooter() {
  return (
    <footer className="border-t border-line bg-white">
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-10">
        <div className="grid gap-10 md:grid-cols-[1.4fr_repeat(3,1fr)]">
          <div>
            <Logo showKatakanaWordmark />
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-body">
              Mindful Japanese Nutrition &amp; Ritual Habit Tracking. Menemani
              kebiasaan makan yang tenang, terukur, dan berkelanjutan.
            </p>
            <p className="mt-4 text-sm text-muted">halo@raifu.id</p>
          </div>

          {COLUMNS.map((col) => (
            <div key={col.title}>
              <h3 className="text-xs font-semibold tracking-[0.18em] text-ink uppercase">
                {col.title}
              </h3>
              <ul className="mt-4 space-y-2.5">
                {col.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm text-body transition-colors hover:text-sage"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 flex flex-col gap-2 border-t border-line pt-6 text-xs text-muted sm:flex-row sm:items-center sm:justify-between">
          <p>
            <span className="font-jp">ライフ</span> · Track Your Life, Live Your Best
          </p>
          <p>© {new Date().getFullYear()} Raifu. Dibuat dengan ketenangan dan ruang kosong.</p>
        </div>
      </div>
    </footer>
  );
}
