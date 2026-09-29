"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import {
  Card,
  Eyebrow,
  IconTile,
  Pill,
  ProgressRing,
  buttonClass,
  cx,
} from "@/app/components/ui";
import {
  BowlIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  DropletIcon,
  JournalIcon,
  LeafIcon,
  MicIcon,
  PencilIcon,
  PlusIcon,
  ScanIcon,
  TrashIcon,
} from "@/app/components/icons";
import { useRaifu } from "@/lib/store";
import { entriesOn, targetsOf, totalsOn } from "@/lib/selectors";
import { formatNumber, percentOf } from "@/lib/nutrition";
import { formatLongDate, shiftDate } from "@/lib/date";
import { MEAL_TYPES, type MealEntry, type MealType } from "@/lib/store-types";
import {
  MealFormDialog,
  draftFromEntry,
  draftFromEstimate,
  emptyDraft,
  type MealDraft,
  type MealFormValues,
} from "./meal-form";
import { VoiceLogDialog, type VoiceEstimate } from "./voice-log-dialog";
import { PHOTOS } from "@/lib/content";

function mealTypeForHour(hour: number): MealType {
  if (hour < 10) return "sarapan";
  if (hour < 15) return "siang";
  if (hour < 18) return "camilan";
  return "malam";
}

type DialogState =
  | { mode: "closed" }
  | { mode: "create"; draft: MealDraft }
  | { mode: "edit"; entry: MealEntry; draft: MealDraft };

export function FoodLogView() {
  const { state, today, addEntry, updateEntry, removeEntry, addWater } = useRaifu();
  const [date, setDate] = useState<string | null>(null);
  const [dialog, setDialog] = useState<DialogState>({ mode: "closed" });
  // Setiap pembukaan dialog memakai key baru agar formulir selalu mulai bersih.
  const [dialogKey, setDialogKey] = useState(0);
  const [voiceOpen, setVoiceOpen] = useState(false);

  const activeDate = date ?? today;
  const entries = entriesOn(state, activeDate);
  const totals = totalsOn(state, activeDate);
  const targets = targetsOf(state);
  const water = state.water[activeDate] ?? 0;
  const kcalPercent = percentOf(totals.kcal, targets.kcal);
  const isToday = activeDate === today;

  const grouped = useMemo(
    () =>
      MEAL_TYPES.map((meal) => ({
        meta: meal,
        items: entries.filter((entry) => entry.mealType === meal.value),
      })),
    [entries],
  );

  const openCreate = (mealType: MealType) => {
    setDialogKey((value) => value + 1);
    setDialog({ mode: "create", draft: emptyDraft(mealType) });
  };

  const openEdit = (entry: MealEntry) => {
    setDialogKey((value) => value + 1);
    setDialog({ mode: "edit", entry, draft: draftFromEntry(entry) });
  };

  const closeDialog = () => setDialog({ mode: "closed" });

  const handleVoiceParsed = (estimate: VoiceEstimate) => {
    setVoiceOpen(false);
    const now = new Date();
    const mealType = mealTypeForHour(now.getHours());
    setDialogKey((value) => value + 1);
    setDialog({
      mode: "create",
      draft: draftFromEstimate({
        ...estimate,
        mealType,
        time: `${`${now.getHours()}`.padStart(2, "0")}:${`${now.getMinutes()}`.padStart(2, "0")}`,
      }),
    });
  };

  const handleSubmit = (values: MealFormValues) => {
    if (dialog.mode === "create") {
      addEntry({ ...values, date: activeDate, tags: [], source: "manual" });
    } else if (dialog.mode === "edit") {
      updateEntry(dialog.entry.id, values);
    }
    closeDialog();
  };

  return (
    <div className="mx-auto max-w-[1400px] space-y-6 px-4 py-8 sm:px-6 lg:px-8">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
        <div className="max-w-xl">
          <h1 className="font-serif text-3xl text-ink sm:text-4xl">
            Catatan Nutrisi &amp; Ritual Makan
          </h1>
          <p className="mt-2 flex items-center gap-2 text-sm text-muted">
            <span className="h-1.5 w-1.5 rounded-full bg-sage" />
            Jurnal Nutrisi Harian
          </p>
          <p className="mt-3 text-sm leading-relaxed text-body">
            Setiap suapan adalah kesadaran. Pantau keseimbangan makro dan kebiasaan
            santapan Anda dengan ketenangan.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-1 rounded-md border border-line bg-white p-1">
            <button
              type="button"
              onClick={() => setDate(shiftDate(activeDate, -1))}
              aria-label="Hari sebelumnya"
              className="grid h-11 w-11 place-items-center rounded text-muted transition-colors hover:bg-mist hover:text-ink"
            >
              <ChevronLeftIcon className="h-4 w-4" />
            </button>
            <p className="min-w-44 px-2 text-center text-sm text-ink">
              {isToday ? "Hari Ini" : formatLongDate(activeDate)}
            </p>
            <button
              type="button"
              onClick={() => setDate(shiftDate(activeDate, 1))}
              aria-label="Hari berikutnya"
              disabled={isToday}
              className="grid h-11 w-11 place-items-center rounded text-muted transition-colors hover:bg-mist hover:text-ink disabled:opacity-40 disabled:hover:bg-transparent"
            >
              <ChevronRightIcon className="h-4 w-4" />
            </button>
          </div>

          <button
            type="button"
            onClick={() => setVoiceOpen(true)}
            className={buttonClass("secondary")}
          >
            <MicIcon className="h-4 w-4" />
            Catat via Suara
          </button>

          <button
            type="button"
            onClick={() => openCreate("sarapan")}
            className={buttonClass("primary")}
          >
            <PlusIcon className="h-4 w-4" />
            Tambah Makanan Manual
          </button>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.7fr_1fr]">
        <Card className="p-6">
          <div className="flex flex-wrap items-start justify-between gap-6">
            <div>
              <Eyebrow>Konsumsi Kumulatif</Eyebrow>
              <p className="mt-2 flex items-baseline gap-2">
                <span className="font-serif text-4xl text-ink tabular-nums">
                  {formatNumber(totals.kcal)}
                </span>
                <span className="text-lg text-muted">
                  / {formatNumber(targets.kcal)} kkal
                </span>
              </p>
              <p className="mt-2 text-sm text-body">
                Tersisa{" "}
                <span className="text-sage">
                  {formatNumber(Math.max(0, targets.kcal - totals.kcal))} kkal
                </span>{" "}
                untuk memenuhi target ritme metabolisme Anda hari ini.
              </p>
            </div>

            <div className="flex items-center gap-4 rounded-lg bg-mist p-4">
              <ProgressRing value={kcalPercent} size={64} thickness={6}>
                <span className="text-xs font-semibold text-ink tabular-nums">
                  {kcalPercent}%
                </span>
              </ProgressRing>
              <span>
                <span className="block text-xs tracking-[0.12em] text-muted uppercase">
                  Status Harian
                </span>
                <span className="block text-sm font-medium text-ink">
                  {kcalPercent < 50
                    ? "Masih Ada Ruang"
                    : kcalPercent <= 100
                      ? "Harmonis & Terkendali"
                      : "Melebihi Ritme"}
                </span>
              </span>
            </div>
          </div>

          <div className="mt-8">
            <div className="flex items-baseline justify-between text-xs">
              <span className="text-ink">Keseimbangan Makronutrien</span>
              <span className="text-body">Target Terpenuhi: {kcalPercent}%</span>
            </div>
            <div className="mt-3 flex h-2 overflow-hidden rounded-full bg-stone">
              <span
                className="bg-sage"
                style={{ width: `${percentOf(totals.carbs, targets.carbs) / 3}%` }}
              />
              <span
                className="bg-sage/60"
                style={{ width: `${percentOf(totals.protein, targets.protein) / 3}%` }}
              />
              <span
                className="bg-sage/30"
                style={{ width: `${percentOf(totals.fat, targets.fat) / 3}%` }}
              />
            </div>

            <ul className="mt-5 grid gap-4 sm:grid-cols-3">
              {[
                { label: "Karbo", value: totals.carbs, target: targets.carbs, dot: "bg-sage" },
                { label: "Protein", value: totals.protein, target: targets.protein, dot: "bg-sage/60" },
                { label: "Lemak", value: totals.fat, target: targets.fat, dot: "bg-sage/30" },
              ].map((macro) => (
                <li key={macro.label}>
                  <p className="flex items-center gap-2 text-xs tracking-[0.1em] text-muted uppercase">
                    <span className={cx("h-2 w-2 rounded-full", macro.dot)} />
                    {macro.label}
                  </p>
                  <p className="mt-1 text-sm text-ink tabular-nums">
                    <span className="font-semibold">{macro.value}g</span>
                    <span className="text-body"> / {macro.target}g</span>
                  </p>
                </li>
              ))}
            </ul>
          </div>
        </Card>

        <Card className="flex flex-col p-6">
          <div className="flex items-start justify-between gap-3">
            <h2 className="font-serif text-xl leading-snug text-ink">
              Prinsip Hara Hachi Bu: Makanlah hingga 80% kenyang.
            </h2>
            <LeafIcon className="h-5 w-5 shrink-0 text-sage" />
          </div>
          <p className="mt-3 text-sm leading-relaxed text-body">
            Memberi jeda 20 menit saat makan memungkinkan lambung mengirim sinyal
            kepuasan ke otak tanpa membebani pencernaan.
          </p>

          <div className="mt-auto flex flex-wrap items-center justify-between gap-3 pt-6">
            <p className="flex items-center gap-2 text-sm text-ink">
              <DropletIcon className="h-4 w-4 text-sage" />
              Hidrasi Hari Ini:{" "}
              <span className="font-semibold tabular-nums">
                {(water / 1000).toFixed(2)} L
              </span>
            </p>
            <button
              type="button"
              onClick={() => addWater(activeDate, 250)}
              className="rounded-md bg-sage-soft px-3 py-1.5 text-xs font-semibold text-sage transition-colors hover:bg-sage/15"
            >
              +250ML
            </button>
          </div>
        </Card>
      </div>

      <div className="space-y-5">
        {grouped.map(({ meta, items }) => {
          const subtotal = items.reduce((sum, entry) => sum + entry.kcal, 0);

          if (items.length === 0) {
            return (
              <Card
                key={meta.value}
                className="flex flex-col gap-4 border-dashed bg-white/60 p-6 lg:flex-row lg:items-center lg:justify-between"
              >
                <div className="flex items-start gap-4">
                  <IconTile>
                    <BowlIcon className="h-5 w-5" />
                  </IconTile>
                  <div>
                    <h2 className="flex flex-wrap items-center gap-2 font-serif text-xl text-ink">
                      {meta.label}
                      <span className="font-jp text-sm text-muted">{meta.kanji}</span>
                      <Pill tone="neutral">Belum Dicatat</Pill>
                    </h2>
                    <p className="mt-1 text-sm text-body">
                      Belum mencatat santapan {meta.label.toLowerCase()}? Lengkapi hari
                      ini untuk menjaga ritme mindfulness Anda.
                    </p>
                  </div>
                </div>
                <div className="flex flex-wrap gap-3">
                  <Link href="/scan" className={buttonClass("primary")}>
                    <ScanIcon className="h-4 w-4" />
                    Scan Makanan
                  </Link>
                  <button
                    type="button"
                    onClick={() => openCreate(meta.value)}
                    className={buttonClass("secondary")}
                  >
                    <PlusIcon className="h-4 w-4" />
                    Tambah Item
                  </button>
                </div>
              </Card>
            );
          }

          return (
            <Card key={meta.value} className="overflow-hidden">
              <div className="flex flex-wrap items-center justify-between gap-4 bg-mist px-6 py-4">
                <div className="flex items-center gap-4">
                  <IconTile tone="white">
                    <JournalIcon className="h-5 w-5" />
                  </IconTile>
                  <div>
                    <h2 className="flex flex-wrap items-center gap-2 font-serif text-xl text-ink">
                      {meta.label}
                      <span className="font-jp text-sm text-muted">{meta.kanji}</span>
                      {items.some((entry) => entry.source === "scan") && (
                        <Pill>
                          <ScanIcon className="h-3 w-3" />
                          Estimasi dari Scan
                        </Pill>
                      )}
                    </h2>
                    <p className="text-xs text-muted">
                      {items[0].time} WIB · {meta.caption}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-5">
                  <p className="text-right">
                    <span className="block text-xs tracking-[0.12em] text-muted uppercase">
                      Subtotal
                    </span>
                    <span className="font-serif text-lg text-ink tabular-nums">
                      {formatNumber(subtotal)}{" "}
                      <span className="text-sm text-muted">kkal</span>
                    </span>
                  </p>
                  <button
                    type="button"
                    onClick={() => openCreate(meta.value)}
                    className="inline-flex items-center gap-1.5 text-sm text-sage hover:underline"
                  >
                    <PlusIcon className="h-4 w-4" />
                    Tambah Item
                  </button>
                </div>
              </div>

              <ul className="divide-y divide-line">
                {items.map((entry) => (
                  <li key={entry.id} className="flex items-center gap-4 px-6 py-4">
                    {entry.image ? (
                      <span className="relative h-12 w-12 shrink-0 overflow-hidden rounded-md bg-stone">
                        <Image
                          src={entry.image}
                          alt=""
                          fill
                          sizes="48px"
                          className="object-cover"
                        />
                      </span>
                    ) : (
                      <span className="h-10 w-1 shrink-0 rounded-full bg-sage/70" />
                    )}

                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium text-ink">
                        {entry.name}
                      </p>
                      <p className="mt-1 flex flex-wrap items-center gap-2 text-xs text-body tabular-nums">
                        <span>{formatNumber(entry.kcal)} kkal</span>
                        <span className="text-muted">·</span>
                        <span>
                          P: {entry.protein}g · K: {entry.carbs}g · L: {entry.fat}g
                        </span>
                        {entry.tags.map((tag) => (
                          <Pill key={tag} tone="neutral">
                            {tag}
                          </Pill>
                        ))}
                      </p>
                    </div>

                    <div className="flex shrink-0 items-center">
                      <button
                        type="button"
                        onClick={() => openEdit(entry)}
                        aria-label={`Ubah ${entry.name}`}
                        className="grid h-11 w-11 place-items-center rounded-md text-muted transition-colors hover:bg-mist hover:text-sage"
                      >
                        <PencilIcon className="h-4 w-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => removeEntry(entry.id)}
                        aria-label={`Hapus ${entry.name}`}
                        className="grid h-11 w-11 place-items-center rounded-md text-muted transition-colors hover:bg-mist hover:text-sage"
                      >
                        <TrashIcon className="h-4 w-4" />
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            </Card>
          );
        })}
      </div>

      <Card className="grid gap-6 bg-mist p-6 lg:grid-cols-[1.6fr_1fr] lg:items-center">
        <div>
          <h2 className="font-serif text-2xl text-ink">
            Kearifan Dapur Raifu: Sup Bening Jamur Shimeji &amp; Tahu Sutra
          </h2>
          <p className="mt-3 max-w-xl text-sm leading-relaxed text-body">
            Rendah kalori (180 kkal), tinggi asam amino L-theanine untuk menenangkan
            sistem saraf sebelum istirahat malam. Siap dalam 15 menit.
          </p>
          <Link
            href="/menu-sehat"
            className="mt-4 inline-flex text-sm font-medium text-sage hover:underline"
          >
            Lihat panduan memasak →
          </Link>
        </div>
        <span className="relative aspect-[4/3] overflow-hidden rounded-lg bg-stone">
          <Image
            src={PHOTOS.ramen}
            alt="Sup bening hangat dengan jamur dan tahu"
            fill
            sizes="(min-width: 1024px) 360px, 100vw"
            className="object-cover"
          />
        </span>
      </Card>

      <MealFormDialog
        key={dialogKey}
        open={dialog.mode !== "closed"}
        title={dialog.mode === "edit" ? "Ubah Catatan Makanan" : "Tambah Makanan Manual"}
        initial={dialog.mode === "closed" ? emptyDraft("sarapan") : dialog.draft}
        onSubmit={handleSubmit}
        onClose={closeDialog}
      />

      {voiceOpen && (
        <VoiceLogDialog onClose={() => setVoiceOpen(false)} onParsed={handleVoiceParsed} />
      )}
    </div>
  );
}
