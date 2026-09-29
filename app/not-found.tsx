import Link from "next/link";
import { Logo } from "./components/logo";

export default function NotFound() {
  return (
    <div className="flex min-h-full flex-1 flex-col items-center justify-center bg-cream px-4 py-24 text-center">
      <Link href="/" aria-label="Raifu, ke beranda" className="mb-10">
        <Logo size="lg" showKatakanaWordmark />
      </Link>

      <p className="font-serif text-6xl text-sage">404</p>
      <h1 className="mt-4 font-serif text-2xl text-ink sm:text-3xl">
        Halaman Ini Tidak Ditemukan
      </h1>
      <p className="mt-3 max-w-sm text-sm leading-relaxed text-body">
        Sepertinya jalur ini belum — atau tidak lagi — ada. Mari kembali ke ritme
        yang sudah dikenal.
      </p>

      <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
        <Link
          href="/dashboard"
          className="inline-flex items-center rounded-md bg-sage px-5 py-3 text-sm font-medium text-white transition-colors hover:bg-sage-dark"
        >
          Ke Dashboard
        </Link>
        <Link
          href="/"
          className="inline-flex items-center rounded-md border border-line bg-white px-5 py-3 text-sm font-medium text-ink transition-colors hover:border-sage hover:text-sage"
        >
          Ke Beranda
        </Link>
      </div>
    </div>
  );
}
