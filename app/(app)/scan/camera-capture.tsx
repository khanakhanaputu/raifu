"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { buttonClass } from "@/app/components/ui";
import { CameraIcon } from "@/app/components/icons";

/**
 * Pratinjau kamera perangkat. Stream dihentikan saat komponen dilepas agar
 * lampu indikator kamera tidak menyala setelah pengguna berpindah tab.
 */
export function CameraCapture({
  onCapture,
}: {
  onCapture: (dataUrl: string) => void;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [ready, setReady] = useState(false);

  const stop = useCallback(() => {
    streamRef.current?.getTracks().forEach((track) => track.stop());
    streamRef.current = null;
  }, []);

  useEffect(() => {
    let cancelled = false;

    async function start() {
      if (!navigator.mediaDevices?.getUserMedia) {
        setError("Perangkat ini tidak mendukung akses kamera langsung.");
        return;
      }
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: "environment" },
          audio: false,
        });
        if (cancelled) {
          stream.getTracks().forEach((track) => track.stop());
          return;
        }
        streamRef.current = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          setReady(true);
        }
      } catch {
        setError(
          "Akses kamera ditolak atau tidak tersedia. Gunakan tab Unggah File atau Pilihan Sampel.",
        );
      }
    }

    start();
    return () => {
      cancelled = true;
      stop();
    };
  }, [stop]);

  const capture = () => {
    const video = videoRef.current;
    if (!video) return;
    const canvas = document.createElement("canvas");
    canvas.width = video.videoWidth || 960;
    canvas.height = video.videoHeight || 720;
    const context = canvas.getContext("2d");
    if (!context) return;
    context.drawImage(video, 0, 0, canvas.width, canvas.height);
    onCapture(canvas.toDataURL("image/jpeg", 0.85));
    stop();
  };

  if (error) {
    return (
      <div className="grid aspect-[4/3] place-items-center rounded-lg bg-mist p-8 text-center">
        <p className="max-w-sm text-sm leading-relaxed text-body">{error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="relative aspect-[4/3] overflow-hidden rounded-lg bg-ink">
        <video
          ref={videoRef}
          autoPlay
          muted
          playsInline
          className="h-full w-full object-cover"
        />
        <span className="pointer-events-none absolute inset-8 rounded-lg border border-white/50" />
      </div>
      <button
        type="button"
        onClick={capture}
        disabled={!ready}
        className={buttonClass("primary", "w-full")}
      >
        <CameraIcon className="h-4 w-4" />
        Ambil Gambar Sekarang
      </button>
    </div>
  );
}
