"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useRaifu } from "@/lib/store";

function Bar({ className = "" }: { className?: string }) {
  return <span className={`block rounded bg-stone ${className}`} />;
}

/**
 * Kerangka pulsing generik yang meniru bentuk umum halaman produk (header +
 * grid kartu dua kolom) — tampil sesaat saat data Supabase pertama kali
 * dimuat, menggantikan spinner polos.
 */
function PageSkeleton() {
  return (
    <div
      aria-hidden
      className="mx-auto max-w-[1400px] animate-pulse space-y-6 px-4 py-8 sm:px-6 lg:px-8"
    >
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div className="space-y-3">
          <Bar className="h-3 w-32" />
          <Bar className="h-7 w-64" />
        </div>
        <Bar className="h-9 w-40 rounded-md" />
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.7fr_1fr]">
        <div className="space-y-4 rounded-xl border border-line bg-white p-6">
          <Bar className="h-4 w-40" />
          <Bar className="h-32 w-full rounded-lg" />
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {Array.from({ length: 4 }).map((_, index) => (
              <Bar key={index} className="h-16 rounded-lg" />
            ))}
          </div>
        </div>

        <div className="space-y-4 rounded-xl border border-line bg-white p-6">
          <Bar className="h-4 w-28" />
          <Bar className="h-20 w-full rounded-lg" />
          <Bar className="h-20 w-full rounded-lg" />
        </div>
      </div>
    </div>
  );
}

export function AppDataGate({ children }: { children: React.ReactNode }) {
  const { loading, error, state } = useRaifu();
  const router = useRouter();

  // Profil baru dari Supabase berisi angka nol (belum isi berat/tinggi/usia)
  // sampai onboarding selesai — biarkan angka itu terpakai di halaman produk
  // hanya akan menampilkan target gizi yang seolah nyata padahal kosong.
  useEffect(() => {
    if (!loading && !error && !state.onboarded) {
      router.replace("/onboarding");
    }
  }, [loading, error, state.onboarded, router]);

  if (loading || (!error && !state.onboarded)) {
    return (
      <>
        <span className="sr-only" role="status">
          Memuat data Anda…
        </span>
        <PageSkeleton />
      </>
    );
  }

  if (error) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center gap-3 px-4 py-24 text-center">
        <p className="max-w-sm text-sm leading-relaxed text-body">{error}</p>
      </div>
    );
  }

  return <>{children}</>;
}
