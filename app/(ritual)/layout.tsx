import Link from "next/link";
import { Logo } from "../components/logo";

export default function RitualLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <header className="border-b border-line bg-white">
        <div className="mx-auto flex h-16 max-w-[1400px] items-center justify-between px-4 sm:px-6 lg:px-8">
          <Link href="/" aria-label="Raifu, ke beranda">
            <Logo showKatakanaWordmark />
          </Link>
          <p className="text-xs font-medium tracking-[0.18em] text-ink uppercase">
            Langkah Sadar
          </p>
        </div>
      </header>
      <main className="flex-1 bg-cream">{children}</main>
    </>
  );
}
