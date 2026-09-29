import { shiftDate } from "./date";
import type { MealEntry, RaifuState } from "./store-types";
import { calculateTargets, type Biometrics, type NutritionTargets } from "./nutrition";

export type DayTotals = {
  kcal: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber: number;
};

export const EMPTY_TOTALS: DayTotals = {
  kcal: 0,
  protein: 0,
  carbs: 0,
  fat: 0,
  fiber: 0,
};

export function biometricsOf(state: RaifuState): Biometrics {
  return {
    sex: state.profile.sex,
    age: state.profile.age,
    weightKg: state.profile.weightKg,
    heightCm: state.profile.heightCm,
    activity: state.profile.activity,
    goal: state.profile.goal,
  };
}

export function targetsOf(state: RaifuState): NutritionTargets {
  return calculateTargets(biometricsOf(state));
}

export function entriesOn(state: RaifuState, date: string) {
  return state.entries
    .filter((entry) => entry.date === date)
    .sort((a, b) => a.time.localeCompare(b.time));
}

export function sumEntries(entries: MealEntry[]): DayTotals {
  return entries.reduce<DayTotals>(
    (acc, entry) => ({
      kcal: acc.kcal + entry.kcal,
      protein: acc.protein + entry.protein,
      carbs: acc.carbs + entry.carbs,
      fat: acc.fat + entry.fat,
      fiber: acc.fiber + entry.fiber,
    }),
    { ...EMPTY_TOTALS },
  );
}

export function totalsOn(state: RaifuState, date: string) {
  return sumEntries(entriesOn(state, date));
}

export function loggedDates(state: RaifuState) {
  return new Set(state.entries.map((entry) => entry.date));
}

export type StreakInfo = {
  days: number;
  loggedToday: boolean;
  freezeAvailable: number;
  activeDaysThisMonth: number;
  nextMilestone: number;
  daysToMilestone: number;
};

const MILESTONES = [3, 7, 14, 21, 30, 60, 100];

export function streakInfo(state: RaifuState, today: string): StreakInfo {
  const logged = loggedDates(state);
  const frozen = new Set(state.freezeDates);
  const loggedToday = logged.has(today);

  let days = 0;
  let cursor = loggedToday ? today : shiftDate(today, -1);
  while (logged.has(cursor) || frozen.has(cursor)) {
    days += 1;
    cursor = shiftDate(cursor, -1);
  }

  const month = today.slice(0, 7);
  const freezeUsedThisMonth = state.freezeDates.filter((date) =>
    date.startsWith(month),
  ).length;

  const activeDaysThisMonth = [...logged].filter((date) =>
    date.startsWith(month),
  ).length;

  const nextMilestone = MILESTONES.find((item) => item > days) ?? days;

  return {
    days,
    loggedToday,
    freezeAvailable: Math.max(0, 1 - freezeUsedThisMonth),
    activeDaysThisMonth,
    nextMilestone,
    daysToMilestone: Math.max(0, nextMilestone - days),
  };
}

export const LEVELS = [
  "Pemula Sadar",
  "Active Health Enthusiast",
  "Nutrition Artisan",
  "Master Gizi",
  "Sensei Keseimbangan",
];

export function levelInfo(xp: number) {
  const index = Math.min(LEVELS.length - 1, Math.floor(xp / 1000) + 1);
  return {
    level: index + 1,
    name: LEVELS[index],
    nextName: LEVELS[Math.min(LEVELS.length - 1, index + 1)],
    progress: xp % 1000,
    toNext: 1000 - (xp % 1000),
  };
}

export type Badge = {
  id: string;
  name: string;
  description: string;
  icon: string;
  target: number;
  progress: number;
  unit: string;
  awardedLabel?: string;
};

export function badgesOf(state: RaifuState, today: string): Badge[] {
  const streak = streakInfo(state, today);
  const distinctMeals = new Set(state.entries.map((entry) => entry.name)).size;
  const earlyBreakfasts = new Set(
    state.entries
      .filter((entry) => entry.mealType === "sarapan" && entry.time <= "08:30")
      .map((entry) => entry.date),
  ).size;
  const hydratedDays = Object.values(state.water).filter(
    (ml) => ml >= 1800,
  ).length;
  const curated = state.entries.filter((entry) => entry.source === "menu").length;

  return [
    {
      id: "langkah-awal",
      name: "Langkah Awal",
      description: "Konsisten mencatat santapan 3 hari berturut-turut tanpa jeda.",
      icon: "🌱",
      target: 3,
      progress: streak.days,
      unit: "Hari",
    },
    {
      id: "ritme-sepekan",
      name: "Ritme Sepekan",
      description: "Mempertahankan kesadaran asupan gizi selama 7 hari penuh.",
      icon: "🎋",
      target: 7,
      progress: streak.days,
      unit: "Hari",
    },
    {
      id: "dua-pekan-mindful",
      name: "Dua Pekan Mindful",
      description: "14 hari konsisten menjaga ketenangan pola makan dan hidrasi optimal.",
      icon: "🍵",
      target: 14,
      progress: streak.days,
      unit: "Hari",
    },
    {
      id: "master-30",
      name: "Master 30 Hari",
      description: "Konsistensi sebulan penuh mengukir jalan hidup sehat berkelanjutan.",
      icon: "⛩️",
      target: 30,
      progress: streak.days,
      unit: "Hari",
    },
    {
      id: "hara-hachi-bu",
      name: "Master Hara Hachi Bu",
      description: "10 hari berturut-turut berhenti makan saat perut mencapai 80% kenyang.",
      icon: "🥢",
      target: 10,
      progress: streak.days,
      unit: "Hari",
    },
    {
      id: "penjelajah-rasa",
      name: "Penjelajah Rasa",
      description: "Memindai 15 ragam hidangan Nusantara & Jepang yang berimbang.",
      icon: "🍱",
      target: 15,
      progress: distinctMeals,
      unit: "Resep",
    },
    {
      id: "fajar-bersahaja",
      name: "Fajar Bersahaja",
      description: "Mencatat sarapan pagi bernutrisi sebelum pukul 08:30 selama 7 hari.",
      icon: "🌅",
      target: 7,
      progress: earlyBreakfasts,
      unit: "Hari",
    },
    {
      id: "hidrasi-selaras",
      name: "Hidrasi Selaras",
      description: "Mencapai ritme hidrasi ideal 1.800ml atau lebih selama 7 hari.",
      icon: "💧",
      target: 7,
      progress: hydratedDays,
      unit: "Hari",
    },
    {
      id: "kurator-menu",
      name: "Kurator Menu",
      description: "Menambahkan 5 resep terkurasi Raifu ke dalam jurnal harian Anda.",
      icon: "📖",
      target: 5,
      progress: curated,
      unit: "Menu",
    },
    {
      id: "centurion",
      name: "Centurion Sehat",
      description: "100 hari legendaris hidup harmonis dengan nutrisi alami pilihan.",
      icon: "🗻",
      target: 100,
      progress: streak.days,
      unit: "Hari",
    },
  ];
}

export function isUnlocked(badge: Badge) {
  return badge.progress >= badge.target;
}

export type EnergyInsight = {
  sampleSize: number;
  tinggi: DayTotals & { count: number };
  rendah: DayTotals & { count: number };
  proteinGapPercent: number; // seberapa lebih tinggi protein di makanan berenergi "tinggi" vs "rendah"
  fiberGapGrams: number;
};

const MIN_SAMPLE_PER_GROUP = 2;

function averageOf(entries: MealEntry[]): DayTotals & { count: number } {
  if (entries.length === 0) return { ...EMPTY_TOTALS, count: 0 };
  const sum = sumEntries(entries);
  return {
    kcal: Math.round(sum.kcal / entries.length),
    protein: Math.round(sum.protein / entries.length),
    carbs: Math.round(sum.carbs / entries.length),
    fat: Math.round(sum.fat / entries.length),
    fiber: Math.round(sum.fiber / entries.length),
    count: entries.length,
  };
}

/**
 * Korelasi sederhana antara komposisi makro dan energi yang dirasakan
 * pengguna (ditag manual, tersimpan lokal — lihat `lib/energy-log.ts`).
 * Bukan model prediktif; murni rata-rata deskriptif dari riwayat pengguna
 * sendiri, ditampilkan hanya ketika datanya cukup untuk bermakna.
 */
export function energyInsight(state: RaifuState): EnergyInsight | null {
  const tinggiEntries = state.entries.filter((entry) => entry.energyLevel === "tinggi");
  const rendahEntries = state.entries.filter((entry) => entry.energyLevel === "rendah");

  if (
    tinggiEntries.length < MIN_SAMPLE_PER_GROUP ||
    rendahEntries.length < MIN_SAMPLE_PER_GROUP
  ) {
    return null;
  }

  const tinggi = averageOf(tinggiEntries);
  const rendah = averageOf(rendahEntries);
  const proteinGapPercent =
    rendah.protein > 0 ? Math.round(((tinggi.protein - rendah.protein) / rendah.protein) * 100) : 0;

  return {
    sampleSize: tinggiEntries.length + rendahEntries.length,
    tinggi,
    rendah,
    proteinGapPercent,
    fiberGapGrams: tinggi.fiber - rendah.fiber,
  };
}
