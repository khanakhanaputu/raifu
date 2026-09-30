"use client";

import { useEffect } from "react";
import Link from "next/link";
import { Logo } from "./components/logo";

export default function ErrorPage({
  error,
  retry,
}: {
  error: Error & { digest?: string };
  retry: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex min-h-full flex-1 flex-col items-center justify-center bg-cream px-4 py-24 text-center">
      <Link href="/" aria-label="Raifu, ke beranda" className="mb-10">
        <Logo size="lg" showKatakanaWordmark />
      </Link>

      <h1 className="font-serif text-2xl text-ink sm:text-3xl">
        Ada yang Tidak Selaras
      </h1>
      <p className="mt-3 max-w-sm text-sm leading-relaxed text-body">
        Terjadi kendala teknis yang tidak terduga. Tidak ada catatan Anda yang
        hilang — coba muat ulang halaman ini.
      </p>

      <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
        <button
          type="button"
          onClick={retry}
          className="inline-flex items-center rounded-md bg-sage px-5 py-3 text-sm font-medium text-white transition-colors hover:bg-sage-dark"
        >
          Coba Lagi
        </button>
        <Link
          href="/dashboard"
          className="inline-flex items-center rounded-md border border-line bg-white px-5 py-3 text-sm font-medium text-ink transition-colors hover:border-sage hover:text-sage"
        >
          Ke Dashboard
        </Link>
      </div>
    </div>
  );
}
