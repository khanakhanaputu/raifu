"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { Card, Eyebrow, IconTile, Pill, ProgressRing, buttonClass } from "@/app/components/ui";
import {
  CameraIcon,
  ChatIcon,
  LeafIcon,
  RefreshIcon,
  SendIcon,
  SparkleIcon,
} from "@/app/components/icons";
import { useRaifu } from "@/lib/store";
import { targetsOf, totalsOn } from "@/lib/selectors";
import { bodyMassIndex, formatNumber, percentOf } from "@/lib/nutrition";
import {
  FALLBACK_REPLY,
  PHOTOS,
  RELATED_TOPICS,
  SUGGESTED_PROMPTS,
  findBotReply,
  type FaqReply,
} from "@/lib/content";

type Message = {
  id: string;
  role: "bot" | "user";
  time: string;
  text: string;
  steps?: FaqReply["steps"];
  chips?: string[];
};

function clockNow() {
  const now = new Date();
  return `${`${now.getHours()}`.padStart(2, "0")}:${`${now.getMinutes()}`.padStart(2, "0")}`;
}

export function KonsultasiView() {
  const { state, today } = useRaifu();
  const targets = targetsOf(state);
  const totals = totalsOn(state, today);
  const remaining = Math.max(0, targets.kcal - totals.kcal);
  const bmi = bodyMassIndex(state.profile.weightKg, state.profile.heightCm);
  const firstName = state.profile.name.split(" ")[0];

  const greeting: Message = {
    id: "greeting",
    role: "bot",
    time: "--:--",
    text: `Konnichiwa, ${firstName}-san! Saya siap mendampingi perjalanan sehat Anda hari ini. Ada pertanyaan seputar porsi makan malam, keseimbangan makronutrisi harian, atau tips menerapkan mindful eating di tengah kesibukan kerja?`,
    chips: ["Pendekatan Holistik", `Presisi Kalori ${formatNumber(targets.kcal)} kkal`],
  };

  const [messages, setMessages] = useState<Message[]>([greeting]);
  const [input, setInput] = useState("");
  const [thinking, setThinking] = useState(false);
  const threadRef = useRef<HTMLDivElement>(null);
  const requestIdRef = useRef(0);

  useEffect(() => {
    threadRef.current?.scrollTo({
      top: threadRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [messages, thinking]);

  useEffect(
    () => () => {
      requestIdRef.current += 1; // batalkan respons yang masih menunggu saat unmount
    },
    [],
  );

  const send = async (text: string, historySource: Message[]) => {
    const question = text.trim();
    if (!question || thinking) return;

    const id = ++requestIdRef.current;
    const time = clockNow();
    setMessages((prev) => [
      ...prev,
      { id: `user-${id}`, role: "user", time, text: question },
    ]);
    setInput("");
    setThinking(true);

    const history = historySource.slice(-8).map((message) => ({
      role: message.role === "bot" ? ("assistant" as const) : ("user" as const),
      content: message.text,
    }));

    try {
      const res = await fetch("/api/consult", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          message: question,
          history,
          profile: {
            name: firstName,
            targetKcal: targets.kcal,
            weightKg: state.profile.weightKg,
            goal: state.profile.goal,
          },
        }),
      });
      const payload = await res.json().catch(() => null);
      if (requestIdRef.current !== id) return; // sudah di-reset / pesan baru dikirim

      if (res.ok && payload?.answer) {
        setMessages((prev) => [
          ...prev,
          { id: `bot-${id}`, role: "bot", time: clockNow(), text: payload.answer },
        ]);
      } else {
        // AI gagal (kuota/koneksi) — jatuh ke asisten template lokal sebagai cadangan.
        const match = findBotReply(question);
        setMessages((prev) => [
          ...prev,
          {
            id: `bot-${id}`,
            role: "bot",
            time: clockNow(),
            text: match?.answer ?? payload?.error ?? FALLBACK_REPLY,
            steps: match?.steps,
            chips: match?.chips,
          },
        ]);
      }
    } catch {
      if (requestIdRef.current !== id) return;
      const match = findBotReply(question);
      setMessages((prev) => [
        ...prev,
        {
          id: `bot-${id}`,
          role: "bot",
          time: clockNow(),
          text: match?.answer ?? FALLBACK_REPLY,
          steps: match?.steps,
          chips: match?.chips,
        },
      ]);
    } finally {
      if (requestIdRef.current === id) setThinking(false);
    }
  };

  const reset = () => {
    requestIdRef.current += 1;
    setThinking(false);
    setMessages([greeting]);
  };

  return (
    <div className="mx-auto max-w-[1400px] space-y-6 px-4 py-8 sm:px-6 lg:px-8">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
        <div className="max-w-2xl">
          <h1 className="font-serif text-3xl text-ink sm:text-4xl">
            Ruang Konsultasi Raifu Bot
          </h1>
          <div className="mt-2 flex flex-wrap items-center gap-3">
            <p className="text-sm text-muted">
              Asisten Gizi Sadar · <span className="font-jp">栄養対話</span>
            </p>
            <Pill>
              <span className="h-1.5 w-1.5 rounded-full bg-sage" />
              Raifu Bot (Aktif · AI)
            </Pill>
          </div>
          <p className="mt-3 text-sm leading-relaxed text-body">
            Tanyakan panduan nutrisi harian, ide resep rendah glikemik, atau konsultasi{" "}
            <em>mindful eating</em> berbasis kearifan gizi sains dan filosofi Jepang.
          </p>
        </div>

        <Card className="flex items-center gap-5 p-4">
          <IconTile>
            <ChatIcon className="h-5 w-5" />
          </IconTile>
          <p className="border-r border-line pr-5">
            <span className="block text-xs tracking-[0.12em] text-muted uppercase">
              Mode Percakapan
            </span>
            <span className="block text-sm font-medium text-ink">
              Hara Hachi Bu &amp; Makro Gizi
            </span>
          </p>
          <p>
            <span className="block text-xs tracking-[0.12em] text-muted uppercase">
              Sesi
            </span>
            <span className="block text-sm font-medium text-ink">
              {messages.length} pesan
            </span>
          </p>
        </Card>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <Eyebrow className="flex items-center gap-2">
          <SparkleIcon className="h-4 w-4" />
          Rekomendasi Prompt:
        </Eyebrow>
        {SUGGESTED_PROMPTS.map((prompt) => (
          <button
            key={prompt}
            type="button"
            onClick={() => send(prompt, messages)}
            className="rounded-full border border-line bg-white px-3.5 py-1.5 text-xs text-body transition-colors hover:border-sage hover:text-sage"
          >
            {prompt}
          </button>
        ))}
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.7fr_1fr]">
        <Card className="flex max-h-[42rem] flex-col overflow-hidden">
          <div className="flex items-center gap-3 border-b border-line bg-mist px-5 py-4">
            <span className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-sage font-jp text-sm text-white">
              楽
            </span>
            <div className="min-w-0 flex-1">
              <p className="flex flex-wrap items-center gap-2">
                <span className="font-serif text-base text-ink">
                  Asisten Edukasi Raifu
                </span>
                <Pill>Gizi Seimbang</Pill>
              </p>
              <p className="text-xs text-body">
                Menyelaraskan metabolisme dengan kesadaran makan
              </p>
            </div>
            <button
              type="button"
              onClick={reset}
              aria-label="Mulai percakapan baru"
              className="grid h-11 w-11 place-items-center rounded-md text-muted transition-colors hover:bg-white hover:text-sage"
            >
              <RefreshIcon className="h-4 w-4" />
            </button>
          </div>

          <div ref={threadRef} className="flex-1 space-y-5 overflow-y-auto p-5">
            {messages.map((message) =>
              message.role === "user" ? (
                <div key={message.id} className="flex justify-end gap-3">
                  <div className="max-w-lg">
                    <p className="mb-1 text-right text-xs text-muted">
                      {message.time} · {firstName}
                    </p>
                    <p className="rounded-lg rounded-tr-none bg-sage px-4 py-3 text-sm leading-relaxed text-white">
                      {message.text}
                    </p>
                  </div>
                  <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-sage-soft text-xs font-medium text-sage">
                    {firstName[0]}
                  </span>
                </div>
              ) : (
                <div key={message.id} className="flex gap-3">
                  <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-sage font-jp text-xs text-white">
                    楽
                  </span>
                  <div className="min-w-0 max-w-2xl">
                    <p className="mb-1 text-xs text-muted">
                      Raifu Bot{message.time !== "--:--" && ` · ${message.time}`}
                    </p>
                    <div className="rounded-lg rounded-tl-none bg-mist px-4 py-3">
                      <p className="text-sm leading-relaxed text-ink/90">
                        {message.text}
                      </p>

                      {message.steps && (
                        <ol className="mt-4 space-y-2">
                          {message.steps.map((step, index) => (
                            <li
                              key={step.title}
                              className="flex gap-3 rounded-md bg-white p-3"
                            >
                              <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-sage-soft text-xs text-sage">
                                {index + 1}
                              </span>
                              <span>
                                <span className="block text-sm font-medium text-ink">
                                  {step.title}
                                </span>
                                <span className="mt-0.5 block text-xs leading-relaxed text-body">
                                  {step.detail}
                                </span>
                              </span>
                            </li>
                          ))}
                        </ol>
                      )}

                      {message.chips && (
                        <p className="mt-3 flex flex-wrap gap-2">
                          {message.chips.map((chip) => (
                            <Pill key={chip} tone="outline">
                              <LeafIcon className="h-3 w-3" />
                              {chip}
                            </Pill>
                          ))}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              ),
            )}

            {thinking && (
              <div className="flex gap-3">
                <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-sage font-jp text-xs text-white">
                  楽
                </span>
                <p className="flex items-center gap-1.5 rounded-lg rounded-tl-none bg-mist px-4 py-4">
                  {[0, 150, 300].map((delay) => (
                    <span
                      key={delay}
                      className="h-1.5 w-1.5 animate-pulse rounded-full bg-sage"
                      style={{ animationDelay: `${delay}ms` }}
                    />
                  ))}
                </p>
              </div>
            )}
          </div>

          <form
            onSubmit={(event) => {
              event.preventDefault();
              send(input, messages);
            }}
            className="border-t border-line p-4"
          >
            <div className="flex items-center gap-2 rounded-lg bg-mist p-2">
              <span className="grid h-9 w-9 place-items-center rounded-md text-muted">
                <CameraIcon className="h-4 w-4" />
              </span>
              <input
                value={input}
                onChange={(event) => setInput(event.target.value)}
                placeholder="Ketik pertanyaan nutrisi, keluhan metabolisme, atau menu yang ingin dianalisis…"
                aria-label="Pesan untuk Raifu Bot"
                className="min-w-0 flex-1 bg-transparent text-sm text-ink outline-none placeholder:text-muted"
              />
              <button
                type="submit"
                disabled={!input.trim() || thinking}
                className={buttonClass("primary", "px-4 py-2")}
              >
                Kirim
                <SendIcon className="h-4 w-4" />
              </button>
            </div>
            <p className="mt-2 flex flex-wrap items-center justify-between gap-2 text-xs text-muted">
              <span>Jawaban dihasilkan AI · bukan pengganti konsultasi klinis</span>
              <span>Dukungan Bahasa Indonesia &amp; Nihongo</span>
            </p>
          </form>
        </Card>

        <div className="space-y-6">
          <Card className="p-5">
            <div className="flex items-center gap-3">
              <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-sage-soft font-serif text-sm text-sage">
                {firstName[0]}
              </span>
              <div className="min-w-0 flex-1">
                <p className="font-serif text-base text-ink">{state.profile.name}</p>
                <p className="text-xs text-body">
                  Target: {state.profile.goal === "turun" ? "Penurunan Bertahap" : state.profile.goal === "naik" ? "Peningkatan Massa" : "Pemeliharaan & Vitalitas"}
                </p>
              </div>
              <Pill>Aktif</Pill>
            </div>

            <ul className="mt-4 grid grid-cols-3 gap-2 text-center">
              {[
                { label: "Target Kalori", value: formatNumber(targets.kcal), unit: "kkal / hari" },
                { label: "Berat Badan", value: state.profile.weightKg.toFixed(1), unit: "kg" },
                { label: "Indeks IMT", value: bmi.toFixed(1), unit: "kg/m²" },
              ].map((stat) => (
                <li key={stat.label} className="rounded-lg bg-mist p-3">
                  <p className="text-[10px] tracking-[0.08em] text-muted uppercase">
                    {stat.label}
                  </p>
                  <p className="mt-1 font-serif text-lg text-ink tabular-nums">
                    {stat.value}
                  </p>
                  <p className="text-[10px] text-muted">{stat.unit}</p>
                </li>
              ))}
            </ul>

            <div className="mt-4 flex items-center gap-4 rounded-lg bg-mist p-4">
              <div className="min-w-0 flex-1">
                <p className="text-xs tracking-[0.12em] text-muted uppercase">
                  Sisa Kuota Kalori
                </p>
                <p className="mt-1 flex items-baseline gap-1.5">
                  <span className="font-serif text-2xl text-ink tabular-nums">
                    {formatNumber(remaining)}
                  </span>
                  <span className="text-xs text-body">kkal tersisa</span>
                </p>
              </div>
              <ProgressRing value={percentOf(totals.kcal, targets.kcal)} size={58} thickness={6}>
                <span className="text-[11px] font-semibold text-ink tabular-nums">
                  {percentOf(totals.kcal, targets.kcal)}%
                </span>
              </ProgressRing>
            </div>
          </Card>

          <Card className="overflow-hidden">
            <div className="flex items-center justify-between gap-3 px-5 pt-5">
              <Eyebrow>Inspirasi Piring Hari Ini</Eyebrow>
              <span className="text-xs text-sage">Ichijū-Sansai</span>
            </div>
            <div className="relative mt-4 aspect-[16/9] bg-stone">
              <Image
                src={PHOTOS.teishoku}
                alt="Set hidangan seimbang satu sup tiga lauk"
                fill
                sizes="(min-width: 1280px) 380px, 100vw"
                className="object-cover"
              />
              <p className="absolute inset-x-0 bottom-0 bg-ink/55 p-3 text-xs leading-relaxed text-white backdrop-blur-sm">
                Keseimbangan 1 Sup, 3 Lauk: prinsip kecukupan rasa alami tanpa bumbu
                sintetis berlebih.
              </p>
            </div>
          </Card>

          <Card className="p-5">
            <Eyebrow>Topik Diskusi Terkait</Eyebrow>
            <ul className="mt-4 divide-y divide-line">
              {RELATED_TOPICS.map((topic) => (
                <li key={topic.title} className="py-3 first:pt-0 last:pb-0">
                  <button
                    type="button"
                    onClick={() => send(topic.title, messages)}
                    className="text-left transition-colors hover:text-sage"
                  >
                    <span className="block font-serif text-base leading-snug text-ink">
                      {topic.title}
                    </span>
                    <span className="mt-1 block text-xs text-muted">{topic.meta}</span>
                  </button>
                </li>
              ))}
            </ul>
          </Card>

          <p className="rounded-xl bg-mist p-5 text-xs leading-relaxed text-body">
            <span className="font-medium text-ink">Catatan Kesadaran:</span> Raifu Bot
            memberikan panduan edukasi gizi holistik &amp; pembiasaan gaya hidup sadar.
            Untuk kondisi medis khusus, penanganan alergi akut, atau penyakit metabolik
            kronis, konsultasikan selalu dengan dokter spesialis gizi klinis.
          </p>
        </div>
      </div>
    </div>
  );
}
