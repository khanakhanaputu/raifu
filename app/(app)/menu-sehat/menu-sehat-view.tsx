"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import { Card, Eyebrow, ProgressRing, buttonClass, cx, fieldClass } from "@/app/components/ui";
import {
  BowlIcon,
  ClockIcon,
  JournalIcon,
  LeafIcon,
  PlusIcon,
  SearchIcon,
  SlidersIcon,
} from "@/app/components/icons";
import { useRaifu } from "@/lib/store";
import { targetsOf, totalsOn } from "@/lib/selectors";
import { formatNumber, percentOf } from "@/lib/nutrition";
import { RECIPES, type Recipe } from "@/lib/content";
import { mealMeta, type MealType } from "@/lib/store-types";

const TIME_FILTERS = [
  { value: "semua", label: "Semua Waktu" },
  { value: "sarapan", label: "Sarapan" },
  { value: "siang", label: "Makan Siang" },
  { value: "malam", label: "Makan Malam" },
  { value: "camilan", label: "Camilan Rendah Glikemik" },
] as const;

const KCAL_FILTERS = [
  { value: "semua", label: "Semua" },
  { value: "rendah", label: "< 350 kkal" },
  { value: "sedang", label: "350 - 550 kkal" },
  { value: "tinggi", label: "> 550 kkal" },
] as const;

const FOCUS_FILTERS = [
  { value: "tinggi-protein", label: "Tinggi Protein" },
  { value: "rendah-karbo", label: "Rendah Karbo" },
  { value: "kaya-serat", label: "Kaya Serat" },
  { value: "fermentasi", label: "Fermentasi & Probiotik" },
] as const;

const ICHIJU_SANSAI = [
  {
    title: "Nasi / Biji Kompleks (Shushoku)",
    detail: "Sumber energi basal rendah glikemik",
  },
  {
    title: "Sup Fermentasi (Shirumono)",
    detail: "Hidrasi dan probiotik dashi/miso",
  },
  {
    title: "Lauk Utama Protein (Shusai)",
    detail: "Ikan laut dalam, tahu sutra, atau tempe",
  },
  {
    title: "2 Lauk Sayur / Fermentasi (Fukusai)",
    detail: "Mikronutrien, mineral rumput laut, serat",
  },
];

export function MenuSehatView() {
  const { state, today, addEntry } = useRaifu();
  const [query, setQuery] = useState("");
  const [time, setTime] = useState<(typeof TIME_FILTERS)[number]["value"]>("semua");
  const [kcal, setKcal] = useState<(typeof KCAL_FILTERS)[number]["value"]>("semua");
  const [focus, setFocus] = useState<string | null>(null);
  const [savedSlug, setSavedSlug] = useState<string | null>(null);

  const targets = targetsOf(state);
  const totals = totalsOn(state, today);
  const remaining = Math.max(0, targets.kcal - totals.kcal);

  const recipes = useMemo(() => {
    const text = query.trim().toLowerCase();
    return RECIPES.filter((recipe) => {
      if (time !== "semua" && recipe.mealType !== time) return false;
      if (kcal === "rendah" && recipe.kcal >= 350) return false;
      if (kcal === "sedang" && (recipe.kcal < 350 || recipe.kcal > 550)) return false;
      if (kcal === "tinggi" && recipe.kcal <= 550) return false;
      if (focus && !recipe.focus.includes(focus as Recipe["focus"][number])) return false;
      if (!text) return true;
      return (
        recipe.name.toLowerCase().includes(text) ||
        recipe.summary.toLowerCase().includes(text) ||
        recipe.ingredients.some((item) => item.toLowerCase().includes(text))
      );
    });
  }, [query, time, kcal, focus]);

  const handleAdd = (recipe: Recipe) => {
    addEntry({
      date: today,
      mealType: recipe.mealType,
      name: recipe.name,
      time: mealMeta(recipe.mealType as MealType).defaultTime,
      kcal: recipe.kcal,
      protein: recipe.protein,
      carbs: recipe.carbs,
      fat: recipe.fat,
      fiber: recipe.fiber,
      tags: recipe.tags.slice(0, 1),
      source: "menu",
      image: recipe.image,
    });
    setSavedSlug(recipe.slug);
  };

  return (
    <div className="mx-auto max-w-[1400px] space-y-6 px-4 py-8 sm:px-6 lg:px-8">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
        <div className="max-w-2xl">
          <Eyebrow className="flex flex-wrap items-center gap-2">
            Pilihan Bergizi Seimbang ·
            <span className="font-jp text-ink">滋養と調和</span>
          </Eyebrow>
          <h1 className="mt-3 font-serif text-3xl text-ink sm:text-4xl">
            Rekomendasi Menu &amp; Resep Mindful
          </h1>
          <p className="mt-3 text-sm leading-relaxed text-body">
            Resep terkurasi dengan filosofi pangan seimbang Jepang &amp; Nusantara untuk
            mendukung kestabilan metabolisme harian tanpa rasa bersalah.
          </p>
        </div>

        <Card className="flex items-center gap-4 bg-sage-soft p-4">
          <span className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-white text-sage">
            <LeafIcon className="h-5 w-5" />
          </span>
          <p>
            <span className="block text-xs tracking-[0.12em] text-sage uppercase">
              Ritual Hari Ini
            </span>
            <span className="block text-sm text-ink">
              80% Kenyang (<span className="font-jp">腹八分目</span> · Hara Hachi Bu)
            </span>
          </p>
        </Card>
      </div>

      <Card className="p-5">
        <div className="relative">
          <SearchIcon className="pointer-events-none absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2 text-muted" />
          <input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Cari resep, bahan (misal: salmon, tahu, tempe, edamame)…"
            aria-label="Cari resep"
            className={cx(fieldClass, "bg-mist pl-10")}
          />
        </div>

        <div className="mt-4 flex flex-wrap items-center gap-3">
          <Eyebrow className="w-28 shrink-0">Waktu Makan</Eyebrow>
          {TIME_FILTERS.map((item) => (
            <FilterChip
              key={item.value}
              active={time === item.value}
              onClick={() => setTime(item.value)}
            >
              {item.label}
            </FilterChip>
          ))}
        </div>

        <div className="mt-3 flex flex-wrap items-center gap-3">
          <Eyebrow className="w-28 shrink-0">Rentang Kalori</Eyebrow>
          {KCAL_FILTERS.map((item) => (
            <FilterChip
              key={item.value}
              active={kcal === item.value}
              onClick={() => setKcal(item.value)}
            >
              {item.label}
            </FilterChip>
          ))}
          <span className="hidden h-4 w-px bg-line sm:block" />
          <Eyebrow className="flex items-center gap-2">
            <SlidersIcon className="h-4 w-4" />
            Fokus Makro
          </Eyebrow>
          {FOCUS_FILTERS.map((item) => (
            <FilterChip
              key={item.value}
              active={focus === item.value}
              onClick={() => setFocus(focus === item.value ? null : item.value)}
            >
              {item.label}
            </FilterChip>
          ))}
        </div>
      </Card>

      <div className="grid gap-6 xl:grid-cols-[1.9fr_1fr]">
        <div>
          {recipes.length === 0 ? (
            <Card className="px-6 py-14 text-center">
              <p className="font-serif text-lg text-ink">Belum ada resep yang cocok</p>
              <p className="mx-auto mt-2 max-w-md text-sm text-body">
                Coba longgarkan filter kalori atau fokus makro, atau cari dengan nama
                bahan yang lebih umum.
              </p>
              <button
                type="button"
                onClick={() => {
                  setQuery("");
                  setTime("semua");
                  setKcal("semua");
                  setFocus(null);
                }}
                className={buttonClass("secondary", "mt-5")}
              >
                Atur Ulang Filter
              </button>
            </Card>
          ) : (
            <ul className="grid gap-5 md:grid-cols-2">
              {recipes.map((recipe) => (
                <li key={recipe.slug}>
                  <Card className="flex h-full flex-col overflow-hidden">
                    <span className="relative block aspect-[16/10] bg-stone">
                      <Image
                        src={recipe.image}
                        alt={recipe.name}
                        fill
                        sizes="(min-width: 1280px) 420px, (min-width: 768px) 45vw, 100vw"
                        className="object-cover"
                      />
                      <span className="absolute top-3 left-3 flex flex-wrap gap-2">
                        {recipe.tags.map((tag) => (
                          <span
                            key={tag}
                            className="rounded bg-white/90 px-2 py-1 text-xs text-ink"
                          >
                            {tag}
                          </span>
                        ))}
                      </span>
                      <span className="absolute right-3 bottom-3 rounded bg-sage/85 px-2.5 py-1 text-xs text-white backdrop-blur-sm">
                        {recipe.mealLabel}
                      </span>
                    </span>

                    <div className="flex flex-1 flex-col p-5">
                      <p className="flex flex-wrap items-center gap-4 text-xs text-body">
                        <span className="flex items-center gap-1.5">
                          <ClockIcon className="h-3.5 w-3.5" />
                          {recipe.minutes} Menit
                        </span>
                        <span className="flex items-center gap-1.5">
                          <BowlIcon className="h-3.5 w-3.5" />
                          {recipe.difficulty}
                        </span>
                        <span className="ml-auto font-medium text-ink tabular-nums">
                          {formatNumber(recipe.kcal)} kkal
                        </span>
                      </p>

                      <h2 className="mt-3 font-serif text-xl leading-snug text-ink">
                        <Link
                          href={`/menu-sehat/${recipe.slug}`}
                          className="transition-colors hover:text-sage"
                        >
                          {recipe.name}
                        </Link>
                      </h2>
                      <p className="mt-2 flex-1 text-sm leading-relaxed text-body">
                        {recipe.summary}
                      </p>

                      <ul className="mt-4 grid grid-cols-4 gap-2 rounded-lg bg-mist p-3 text-center">
                        {[
                          { label: "Protein", value: recipe.protein },
                          { label: "Karbo", value: recipe.carbs },
                          { label: "Lemak", value: recipe.fat },
                          { label: "Serat", value: recipe.fiber },
                        ].map((macro) => (
                          <li key={macro.label}>
                            <span className="block text-xs text-muted">
                              {macro.label}
                            </span>
                            <span className="mt-0.5 block text-sm font-semibold text-ink tabular-nums">
                              {macro.value}g
                            </span>
                          </li>
                        ))}
                      </ul>

                      <div className="mt-4 flex gap-2">
                        <button
                          type="button"
                          onClick={() => handleAdd(recipe)}
                          className={buttonClass("primary", "flex-1")}
                        >
                          <PlusIcon className="h-4 w-4" />
                          {savedSlug === recipe.slug
                            ? "Tersimpan ✓"
                            : "Food Log (+50 XP)"}
                        </button>
                        <Link
                          href={`/menu-sehat/${recipe.slug}`}
                          aria-label={`Panduan memasak ${recipe.name}`}
                          className={buttonClass("secondary", "px-3")}
                        >
                          <JournalIcon className="h-4 w-4" />
                        </Link>
                      </div>
                    </div>
                  </Card>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="space-y-6">
          <Card className="p-6">
            <div className="flex items-baseline justify-between gap-3">
              <Eyebrow>Prinsip Harmoni Makanan</Eyebrow>
              <span className="font-jp text-xs text-muted">一汁三菜</span>
            </div>
            <h2 className="mt-3 font-serif text-xl text-ink">Ichiju Sansai</h2>
            <p className="mt-3 text-sm leading-relaxed text-body">
              Struktur pangan tradisional Jepang: Satu Sup (一汁) &amp; Tiga Lauk (三菜).
              Menghadirkan keseimbangan elektrolit, protein bioavailabel, dan prebiotik
              secara alami.
            </p>

            <ol className="mt-5 space-y-2">
              {ICHIJU_SANSAI.map((item, index) => (
                <li
                  key={item.title}
                  className="flex items-start gap-3 rounded-lg bg-mist p-3"
                >
                  <span className="grid h-6 w-6 shrink-0 place-items-center rounded bg-sage text-xs text-white">
                    {index + 1}
                  </span>
                  <span>
                    <span className="block text-sm font-medium text-ink">
                      {item.title}
                    </span>
                    <span className="block text-xs text-body">{item.detail}</span>
                  </span>
                </li>
              ))}
            </ol>

            <p className="mt-5 rounded-lg bg-sage-soft p-4 text-sm leading-relaxed text-ink/80 italic">
              “Makanlah hingga perut terasa 80% penuh, sisakan 20% ruang untuk
              ketenangan napas dan proses cerna yang anggun.”
            </p>
          </Card>

          <Card className="p-6">
            <Eyebrow className="flex items-center gap-2">
              <SlidersIcon className="h-4 w-4" />
              Target Kalori Pribadi
            </Eyebrow>
            <h2 className="mt-3 font-serif text-xl text-ink">Target Harian Anda</h2>
            <p className="mt-2 text-sm leading-relaxed text-body">
              Berdasarkan profil metabolik dan ritme aktif Anda (
              {formatNumber(targets.kcal)} kkal / hari).
            </p>

            <div className="mt-5 flex items-center gap-5">
              <ProgressRing value={percentOf(totals.kcal, targets.kcal)} size={92} thickness={8}>
                <span>
                  <span className="block font-serif text-lg text-ink tabular-nums">
                    {formatNumber(totals.kcal)}
                  </span>
                  <span className="block text-[10px] text-muted">
                    / {formatNumber(targets.kcal)}
                  </span>
                </span>
              </ProgressRing>

              <dl className="flex-1 space-y-2 text-sm">
                <div className="flex justify-between gap-3">
                  <dt className="text-body">Tersisa:</dt>
                  <dd className="font-medium text-ink tabular-nums">
                    {formatNumber(remaining)} kkal
                  </dd>
                </div>
                <div className="flex justify-between gap-3">
                  <dt className="text-body">Rekomendasi:</dt>
                  <dd className="text-right font-medium text-ink">
                    {remaining > 500
                      ? "1 Porsi Makan Utama"
                      : remaining > 200
                        ? "1 Porsi Camilan Sehat"
                        : "Cukup untuk Hari Ini"}
                  </dd>
                </div>
                <div className="flex justify-between gap-3">
                  <dt className="text-body">Kekurangan Serat:</dt>
                  <dd className="font-medium text-ink tabular-nums">
                    {Math.max(0, targets.fiber - totals.fiber)} gram
                  </dd>
                </div>
              </dl>
            </div>

            <Link href="/food-log" className={buttonClass("ghost", "mt-5 w-full")}>
              Periksa Log Makanan Hari Ini
            </Link>
          </Card>

          <Card className="flex items-start gap-4 bg-mist p-5">
            <span className="grid h-11 w-11 shrink-0 place-items-center rounded-lg bg-white text-xl">
              🍵
            </span>
            <p>
              <span className="block text-xs tracking-[0.12em] text-muted uppercase">
                Kurator Nutrisi
              </span>
              <span className="mt-1 block text-sm font-medium text-ink">
                Rei Takahashi &amp; Tim Raifu
              </span>
              <span className="mt-1 block text-xs leading-relaxed text-body">
                Setiap menu dirancang untuk kestabilan ritme sirkadian tubuh.
              </span>
            </p>
          </Card>
        </div>
      </div>
    </div>
  );
}

function FilterChip({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={cx(
        "rounded-full px-3.5 py-1.5 text-xs transition-colors",
        active ? "bg-sage text-white" : "bg-mist text-body hover:text-sage",
      )}
    >
      {children}
    </button>
  );
}
