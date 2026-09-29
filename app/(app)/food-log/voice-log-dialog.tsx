"use client";

import { useEffect, useRef, useState } from "react";
import { buttonClass } from "@/app/components/ui";
import { MicIcon } from "@/app/components/icons";
import { isSpeechSupported, startListening, type SpeechController } from "@/lib/speech";

type Status = "idle" | "listening" | "analyzing" | "error";

export type VoiceEstimate = {
  name: string;
  kcal: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber: number;
};

export function VoiceLogDialog({
  onClose,
  onParsed,
}: {
  onClose: () => void;
  onParsed: (estimate: VoiceEstimate) => void;
}) {
  const [status, setStatus] = useState<Status>("idle");
  const [transcript, setTranscript] = useState("");
  const [error, setError] = useState<string | null>(null);
  const controllerRef = useRef<SpeechController | null>(null);
  const supported = isSpeechSupported();

  useEffect(
    () => () => {
      controllerRef.current?.stop();
    },
    [],
  );

  const begin = () => {
    setTranscript("");
    setError(null);
    setStatus("listening");
    controllerRef.current = startListening(
      (text, isFinal) => setTranscript((prev) => (isFinal ? `${prev} ${text}`.trim() : prev || text)),
      () => {
        // onDone dari browser — kalau pengguna belum menekan "Selesai", biarkan
        // status tetap seperti sebelumnya (idle/analyzing sudah menangani sendiri).
      },
      (message) => {
        setError(message);
        setStatus("error");
      },
    );
  };

  const finish = async () => {
    controllerRef.current?.stop();
    const text = transcript.trim();
    if (!text) {
      setError("Belum ada ucapan yang tertangkap. Coba lagi.");
      setStatus("error");
      return;
    }

    setStatus("analyzing");
    try {
      const res = await fetch("/api/parse-food", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ text }),
      });
      const payload = await res.json().catch(() => null);
      if (!res.ok || !payload) {
        setError(payload?.error ?? "Gagal menganalisis ucapan.");
        setStatus("error");
        return;
      }
      onParsed(payload);
    } catch {
      setError("Tidak dapat menghubungi layanan AI.");
      setStatus("error");
    }
  };

  return (
    <div className="fixed inset-0 z-[70] grid place-items-center bg-ink/30 p-4 backdrop-blur-sm">
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="voice-log-title"
        className="w-full max-w-md rounded-xl border border-line bg-white p-6 text-center shadow-xl"
      >
        <div className="flex items-start justify-between gap-4">
          <h2 id="voice-log-title" className="font-serif text-xl text-ink">
            Catat via Suara
          </h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Tutup"
            className="grid h-11 w-11 place-items-center rounded-md text-muted transition-colors hover:bg-mist hover:text-ink"
          >
            <svg viewBox="0 0 20 20" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.6">
              <path d="M5 5l10 10M15 5L5 15" strokeLinecap="round" />
            </svg>
          </button>
        </div>

        {!supported ? (
          <p className="mt-6 text-sm leading-relaxed text-body">
            Browser ini tidak mendukung input suara. Coba pakai Chrome atau Edge, atau
            gunakan &ldquo;Tambah Makanan Manual&rdquo; sebagai gantinya.
          </p>
        ) : (
          <>
            <button
              type="button"
              onClick={status === "listening" ? finish : begin}
              disabled={status === "analyzing"}
              aria-pressed={status === "listening"}
              className={`mx-auto mt-6 grid h-20 w-20 place-items-center rounded-full transition-colors ${
                status === "listening"
                  ? "animate-pulse bg-sage text-white"
                  : "bg-sage-soft text-sage hover:bg-sage/15"
              }`}
            >
              <MicIcon className="h-8 w-8" />
            </button>

            <p className="mt-4 text-sm text-body" aria-live="polite">
              {status === "idle" && "Tekan mikrofon, lalu ucapkan makanan Anda."}
              {status === "listening" && "Mendengarkan… tekan lagi jika sudah selesai."}
              {status === "analyzing" && "Menganalisis ucapan dengan AI…"}
              {status === "error" && error}
            </p>

            {transcript && status !== "error" && (
              <p className="mt-4 rounded-lg bg-mist p-3 text-sm text-ink italic">
                &ldquo;{transcript}&rdquo;
              </p>
            )}

            {status === "error" && (
              <button type="button" onClick={begin} className={buttonClass("secondary", "mt-4")}>
                Coba Lagi
              </button>
            )}

            <p className="mt-5 text-xs text-muted">
              Contoh: &ldquo;saya makan nasi goreng dan telur ceplok&rdquo;
            </p>
          </>
        )}
      </div>
    </div>
  );
}
