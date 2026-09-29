"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import {
  Card,
  Eyebrow,
  IconTile,
  Pill,
  buttonClass,
  cx,
} from "@/app/components/ui";
import {
  CheckCircleIcon,
  LeafIcon,
  PencilIcon,
  RefreshIcon,
  SparkleIcon,
  UploadIcon,
} from "@/app/components/icons";
import { useRaifu } from "@/lib/store";
import { targetsOf } from "@/lib/selectors";
import { formatNumber, percentOf } from "@/lib/nutrition";
import { compressDataUrl } from "@/lib/image";
import { SAMPLE_SCANS, type SampleScan } from "@/lib/content";
import type { MealType } from "@/lib/store-types";
import { CameraCapture } from "./camera-capture";

type Mode = "sampel" | "unggah" | "kamera";
type Status = "idle" | "analyzing" | "done" | "error";
type ResultSource = "sample" | "ai";

const PORTIONS = [
  { value: 0.5, label: "0.5x Ringan" },
  { value: 1, label: "1.0x Normal" },
  { value: 1.5, label: "1.5x Mengenyangkan" },
  { value: 2, label: "2.0x Dobel" },
];

function mealTypeForHour(hour: number): MealType {
  if (hour < 10) return "sarapan";
  if (hour < 15) return "siang";
  if (hour < 18) return "camilan";
  return "malam";
}

function readFileAsDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(new Error("Gagal membaca berkas."));
    reader.readAsDataURL(file);
  });
}

export function ScanView() {
  const { state, today, addEntry } = useRaifu();
  const targets = targetsOf(state);

  const [mode, setMode] = useState<Mode>("sampel");
  const [status, setStatus] = useState<Status>("done");
  const [source, setSource] = useState<ResultSource>("sample");
  const [sample, setSample] = useState<SampleScan>(SAMPLE_SCANS[0]);
  const [customImage, setCustomImage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [portion, setPortion] = useState(1);
  const [saved, setSaved] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const requestIdRef = useRef(0);

  useEffect(
    () => () => {
      // Membatalkan hasil analisis yang masih berjalan saat komponen dilepas.
      requestIdRef.current += 1;
    },
    [],
  );

  const pickSample = (item: SampleScan) => {
    requestIdRef.current += 1;
    setSaved(null);
    setErrorMessage(null);
    setPortion(1);
    setSource("sample");
    setSample(item);
    setCustomImage(null);
    setStatus("analyzing");
    const id = requestIdRef.current;
    window.setTimeout(() => {
      if (requestIdRef.current === id) setStatus("done");
    }, 900);
  };

  const analyzeWithAI = async (rawDataUrl: string) => {
    requestIdRef.current += 1;
    const id = requestIdRef.current;

    setSaved(null);
    setErrorMessage(null);
    setPortion(1);
    setSource("ai");
    setCustomImage(rawDataUrl);
    setStatus("analyzing");

    try {
      const compact = await compressDataUrl(rawDataUrl);
      const res = await fetch("/api/scan", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ image: compact }),
      });
      const payload = await res.json().catch(() => null);
      if (requestIdRef.current !== id) return; // dibatalkan oleh aksi baru

      if (!res.ok || !payload) {
        setErrorMessage(payload?.error ?? "Gagal menganalisis foto. Coba lagi.");
        setStatus("error");
        return;
      }

      setSample({ id: `ai-${crypto.randomUUID()}`, image: rawDataUrl, ...payload });
      setStatus("done");
    } catch {
      if (requestIdRef.current !== id) return;
      setErrorMessage("Tidak dapat menghubungi layanan AI. Periksa koneksi Anda.");
      setStatus("error");
    }
  };

  const handleFile = async (file: File | undefined) => {
    if (!file) return;
    try {
      const dataUrl = await readFileAsDataUrl(file);
      await analyzeWithAI(dataUrl);
    } catch {
      setErrorMessage("Gagal membaca berkas foto. Coba pilih foto lain.");
      setStatus("error");
    }
  };

  const retry = () => {
    if (source === "ai" && customImage) {
      analyzeWithAI(customImage);
    } else {
      pickSample(sample);
    }
  };

  const scaled = {
    kcal: Math.round(sample.kcal * portion),
    protein: Math.round(sample.protein * portion),
    carbs: Math.round(sample.carbs * portion),
    fat: Math.round(sample.fat * portion),
    fiber: Math.round(sample.fiber * portion),
    sodium: Math.round(sample.sodiumMg * portion),
  };

  const image = customImage ?? sample.image;
  const isRemote = image.startsWith("http");
  const hasResult = status === "done";

  const handleSave = () => {
    const now = new Date();
    addEntry({
      date: today,
      mealType: mealTypeForHour(now.getHours()),
      name: sample.name,
      time: `${`${now.getHours()}`.padStart(2, "0")}:${`${now.getMinutes()}`.padStart(2, "0")}`,
      kcal: scaled.kcal,
      protein: scaled.protein,
      carbs: scaled.carbs,
      fat: scaled.fat,
      fiber: scaled.fiber,
      tags: [source === "ai" ? "Scan AI" : "Contoh Scan"],
      source: "scan",
      image: isRemote ? image : undefined,
    });
    setSaved(`${sample.name} tersimpan ke Food Log hari ini (+50 XP).`);
  };

  return (
    <div className="mx-auto max-w-[1400px] space-y-6 px-4 py-8 sm:px-6 lg:px-8">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
        <div className="max-w-2xl">
          <h1 className="font-serif text-3xl text-ink sm:text-4xl">
            Analisis Visual Nutrisi
          </h1>
          <p className="mt-2 flex items-center gap-2 text-sm text-sage">
            AI Nutrition Scanner
            <span className="h-1 w-1 rounded-full bg-sage" />
            <span className="font-jp">スキャナー</span>
          </p>
          <p className="mt-3 text-sm leading-relaxed text-body">
            Unggah atau ambil foto makanan Anda untuk estimasi instan komposisi makro,
            serat alami, dan rekomendasi mindful Japanese nutrition — dianalisis
            langsung oleh model vision AI.
          </p>
        </div>

        <div
          role="tablist"
          aria-label="Sumber gambar"
          className="inline-flex rounded-md border border-line bg-white p-1"
        >
          {(
            [
              { value: "unggah", label: "Unggah File" },
              { value: "kamera", label: "Kamera Langsung" },
              { value: "sampel", label: "Pilihan Sampel" },
            ] as const
          ).map((tab) => (
            <button
              key={tab.value}
              role="tab"
              type="button"
              aria-selected={mode === tab.value}
              onClick={() => setMode(tab.value)}
              className={cx(
                "rounded px-4 py-2 text-sm transition-colors",
                mode === tab.value
                  ? "bg-sage text-white"
                  : "text-body hover:text-sage",
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {mode === "sampel" && (
        <div className="flex flex-wrap items-center gap-3">
          <Eyebrow>Contoh Menu:</Eyebrow>
          {SAMPLE_SCANS.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => pickSample(item)}
              className={cx(
                "rounded-full px-4 py-1.5 text-sm transition-colors",
                sample.id === item.id && !customImage
                  ? "bg-sage-soft font-medium text-sage"
                  : "bg-mist text-body hover:text-sage",
              )}
            >
              {item.name}
            </button>
          ))}
        </div>
      )}

      <div className="grid gap-6 xl:grid-cols-[1.15fr_1fr]">
        <div className="space-y-5">
          {mode === "kamera" && !customImage ? (
            <Card className="p-5">
              <CameraCapture onCapture={(dataUrl) => analyzeWithAI(dataUrl)} />
            </Card>
          ) : mode === "unggah" && !customImage ? (
            <Card className="p-5">
              <div
                onDragOver={(event) => event.preventDefault()}
                onDrop={(event) => {
                  event.preventDefault();
                  handleFile(event.dataTransfer.files[0]);
                }}
                className="grid aspect-[4/3] place-items-center rounded-lg border border-dashed border-line bg-mist/60 p-8 text-center"
              >
                <div>
                  <span className="mx-auto grid h-12 w-12 place-items-center rounded-full bg-sage-soft text-sage">
                    <UploadIcon className="h-6 w-6" />
                  </span>
                  <p className="mt-4 font-serif text-lg text-ink">
                    Letakkan foto makanan Anda di sini
                  </p>
                  <p className="mx-auto mt-2 max-w-sm text-sm leading-relaxed text-body">
                    Format JPG, PNG, atau WebP. Foto dikirim ke model vision AI untuk
                    dianalisis, lalu tidak disimpan di server kami.
                  </p>
                  <button
                    type="button"
                    onClick={() => fileRef.current?.click()}
                    className={buttonClass("primary", "mt-5")}
                  >
                    <UploadIcon className="h-4 w-4" />
                    Pilih Foto
                  </button>
                  <input
                    ref={fileRef}
                    type="file"
                    accept="image/*"
                    className="sr-only"
                    onChange={(event) => handleFile(event.target.files?.[0])}
                  />
                </div>
              </div>
            </Card>
          ) : (
            <Card className="overflow-hidden p-0">
              <div className="relative aspect-[4/3] bg-stone">
                {isRemote ? (
                  <Image
                    src={image}
                    alt={`Foto ${sample.name}`}
                    fill
                    sizes="(min-width: 1280px) 620px, 100vw"
                    className="object-cover"
                    priority
                  />
                ) : (
                  // Gambar dari kamera/berkas lokal memakai <img> karena sumbernya data URL.
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={image}
                    alt="Foto makanan yang Anda unggah"
                    className="h-full w-full object-cover"
                  />
                )}

                {status === "analyzing" && (
                  <div className="absolute inset-0 grid place-items-center bg-ink/45 backdrop-blur-[2px]">
                    <div className="text-center text-white">
                      <span className="mx-auto block h-10 w-10 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                      <p className="mt-4 text-sm">
                        {source === "ai"
                          ? "Menganalisis foto dengan AI…"
                          : "Menyiapkan contoh…"}
                      </p>
                    </div>
                  </div>
                )}

                {status === "error" && (
                  <div className="absolute inset-0 grid place-items-center bg-ink/55 p-6 text-center">
                    <div>
                      <p className="text-sm text-white">{errorMessage}</p>
                      <button
                        type="button"
                        onClick={retry}
                        className={buttonClass("secondary", "mt-4")}
                      >
                        <RefreshIcon className="h-4 w-4" />
                        Coba Lagi
                      </button>
                    </div>
                  </div>
                )}

                {status === "done" && (
                  <button
                    type="button"
                    onClick={retry}
                    aria-label="Pindai ulang"
                    className="absolute right-4 bottom-4 grid h-11 w-11 place-items-center rounded-full bg-white/90 text-ink transition-colors hover:text-sage"
                  >
                    <RefreshIcon className="h-4 w-4" />
                  </button>
                )}
              </div>
            </Card>
          )}

          <Card className="flex flex-wrap items-center justify-between gap-4 p-5">
            <p className="flex items-start gap-3">
              <IconTile>
                <SparkleIcon className="h-5 w-5" />
              </IconTile>
              <span>
                <span className="block text-sm font-medium text-ink">
                  {source === "ai" ? "Analisis AI Langsung" : "Estimasi Nutrisi"}
                </span>
                <span className="block text-xs text-body">
                  {source === "ai"
                    ? "Dianalisis langsung dari foto Anda oleh model vision AI"
                    : "Berdasarkan data hidangan serupa yang telah dikurasi"}
                </span>
              </span>
            </p>
            <p className="flex items-center gap-3 text-xs text-muted">
              Pencahayaan Alami
              <Pill tone="neutral">Optimal</Pill>
            </p>
          </Card>
        </div>

        <Card className="p-6">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="flex flex-wrap items-center gap-3">
                <Pill>{source === "ai" ? "Dianalisis AI" : "Estimasi dari Hidangan Serupa"}</Pill>
              </p>
              <h2 className="mt-3 font-serif text-2xl text-ink">{sample.name}</h2>
              <p className="mt-1 max-w-sm text-sm text-body">{sample.detail}</p>
            </div>
            <p className="text-right">
              <span className="flex items-baseline gap-1.5">
                <span className="font-serif text-4xl text-ink tabular-nums">
                  {formatNumber(scaled.kcal)}
                </span>
                <span className="text-sm text-muted">kkal</span>
              </span>
              <span className="mt-1 block text-xs text-body">
                {percentOf(scaled.kcal, targets.kcal)}% target harian
              </span>
            </p>
          </div>

          <div className="mt-6 rounded-lg bg-mist p-4">
            <div className="flex items-baseline justify-between text-xs">
              <span className="tracking-[0.1em] text-muted uppercase">
                Ukuran Porsi Konsumsi
              </span>
              <span className="text-ink">
                {portion.toFixed(1)}x{" "}
                {PORTIONS.find((item) => item.value === portion)?.label.split(" ")[1]}
              </span>
            </div>
            <div className="mt-3 flex gap-2">
              {PORTIONS.map((item) => (
                <button
                  key={item.value}
                  type="button"
                  onClick={() => setPortion(item.value)}
                  className={cx(
                    "flex-1 rounded-md px-2 py-2 text-xs transition-colors",
                    portion === item.value
                      ? "bg-sage text-white"
                      : "bg-white text-body hover:text-sage",
                  )}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          <div className="mt-6">
            <div className="flex items-baseline justify-between text-xs">
              <span className="tracking-[0.1em] text-muted uppercase">
                Distribusi Makronutrien
              </span>
              <span className="text-sage">Hara Hachi Bu Balance</span>
            </div>
            <div className="mt-3 flex h-2 overflow-hidden rounded-full bg-stone">
              <span
                className="bg-sage"
                style={{ width: `${(scaled.protein * 4 * 100) / (scaled.kcal || 1)}%` }}
              />
              <span
                className="bg-sage/60"
                style={{ width: `${(scaled.carbs * 4 * 100) / (scaled.kcal || 1)}%` }}
              />
              <span
                className="bg-sage/30"
                style={{ width: `${(scaled.fat * 9 * 100) / (scaled.kcal || 1)}%` }}
              />
            </div>

            <ul className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
              {[
                { label: "Protein", value: scaled.protein },
                { label: "Karbo", value: scaled.carbs },
                { label: "Lemak", value: scaled.fat },
                { label: "Serat", value: scaled.fiber },
              ].map((macro) => (
                <li key={macro.label} className="rounded-lg bg-mist p-3 text-center">
                  <p className="text-xs text-muted">{macro.label}</p>
                  <p className="mt-1 font-serif text-xl text-ink tabular-nums">
                    {macro.value}g
                  </p>
                </li>
              ))}
            </ul>
          </div>

          <div className="mt-6 rounded-lg bg-mist p-4">
            <div className="flex items-baseline justify-between text-xs">
              <span className="tracking-[0.1em] text-muted uppercase">
                Mikronutrisi Penting
              </span>
              <span className="text-body">Sodium: {scaled.sodium}mg</span>
            </div>
            <ul className="mt-3 flex flex-wrap gap-2">
              {sample.micros.map((micro) => (
                <li key={micro}>
                  <Pill tone="outline">{micro}</Pill>
                </li>
              ))}
            </ul>
          </div>

          <div className="mt-6 rounded-lg bg-sage-soft p-4">
            <p className="flex items-center gap-2 text-xs font-semibold tracking-[0.1em] text-sage uppercase">
              <LeafIcon className="h-4 w-4" />
              Catatan Nutrisi Mindful
            </p>
            <p className="mt-2 text-sm leading-relaxed text-ink/80">{sample.note}</p>
          </div>

          <div className="mt-6 space-y-3">
            <button
              type="button"
              onClick={handleSave}
              disabled={!hasResult}
              className={buttonClass("primary", "w-full")}
            >
              <CheckCircleIcon className="h-4 w-4" />
              Simpan ke Food Log Hari Ini (+50 XP)
            </button>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={retry}
                disabled={status === "analyzing"}
                className={buttonClass("ghost")}
              >
                <RefreshIcon className="h-4 w-4" />
                Scan Ulang
              </button>
              <button
                type="button"
                onClick={() => setPortion(1)}
                className={buttonClass("ghost")}
              >
                <PencilIcon className="h-4 w-4" />
                Reset Porsi
              </button>
            </div>
            {saved && (
              <p
                role="status"
                className="rounded-md bg-sage-soft px-3 py-2 text-center text-xs text-sage"
              >
                {saved}
              </p>
            )}
          </div>
        </Card>
      </div>

      <section>
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <h2 className="font-serif text-2xl text-ink">
              Contoh Pindaian: Coba Hidangan Sampel
            </h2>
          </div>
        </div>

        <ul className="mt-5 grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
          {SAMPLE_SCANS.map((item) => (
            <li key={item.id}>
              <button
                type="button"
                onClick={() => {
                  setMode("sampel");
                  pickSample(item);
                }}
                className="w-full overflow-hidden rounded-xl border border-line bg-white text-left transition-colors hover:border-sage/50"
              >
                <span className="relative block aspect-[4/3] bg-stone">
                  <Image
                    src={item.image}
                    alt={item.name}
                    fill
                    sizes="(min-width: 1280px) 300px, (min-width: 640px) 45vw, 100vw"
                    className="object-cover"
                  />
                  <span className="absolute top-3 right-3 rounded bg-white/90 px-2 py-1 text-xs text-ink">
                    Contoh
                  </span>
                </span>
                <span className="block p-4">
                  <span className="block font-serif text-base text-ink">
                    {item.name}
                  </span>
                  <span className="mt-2 flex items-center justify-between text-xs text-body tabular-nums">
                    <span>{formatNumber(item.kcal)} kkal</span>
                    <span>
                      P: {item.protein}g · K: {item.carbs}g
                    </span>
                  </span>
                </span>
              </button>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
