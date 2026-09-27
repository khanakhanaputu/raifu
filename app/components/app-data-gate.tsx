"use client";

import { useRaifu } from "@/lib/store";
import { LeafIcon } from "./icons";

export function AppDataGate({ children }: { children: React.ReactNode }) {
  const { loading, error } = useRaifu();

  if (loading) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center gap-3 px-4 py-24 text-center">
        <span className="grid h-10 w-10 animate-pulse place-items-center rounded-lg bg-sage-soft text-sage">
          <LeafIcon className="h-5 w-5" />
        </span>
        <p className="text-sm text-body">Memuat data Anda…</p>
      </div>
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
