import { shiftDate } from "./date";
import type { MealEntry, RaifuState, Reminder } from "./store-types";
import { PHOTOS } from "./content";

/** Tanggal jangkar untuk render server agar hidrasi tetap deterministik. */
export const SEED_TODAY = "2024-10-24";

export const DEFAULT_REMINDERS: Reminder[] = [
  {
    id: "sarapan",
    label: "Pengingat Sarapan Pagi",
    time: "07:30 WIB",
    description:
      "Ajakan menenangkan untuk sarapan gizi seimbang sebelum memulai aktivitas harian.",
    enabled: true,
  },
  {
    id: "siang",
    label: "Pengingat Makan Siang Mindful",
    time: "12:00 WIB",
    description:
      "Mendorong makan tanpa distraksi gawai agar sinyal kenyang 80% terbaca jelas.",
    enabled: true,
  },
  {
    id: "malam",
    label: "Pengingat Jurnal Makan Malam",
    time: "19:30 WIB",
    description:
      "Waktu ideal menutup santap malam setidaknya 3 jam sebelum waktu istirahat tidur.",
    enabled: true,
  },
  {
    id: "streak",
    label: "Peringatan Preservasi Streak Harian",
    time: "21:00 WIB",
    description:
      "Peringatan halus jika catatan nutrisi belum lengkap agar rantai kebiasaan tidak terputus.",
    enabled: true,
  },
  {
    id: "hidrasi",
    label: "Pengingat Hidrasi Berkala",
    time: "Interval 2 Jam",
    description:
      "Petunjuk halus minum 250ml air untuk menjaga kelembapan seluler dan fokus mental.",
    enabled: false,
  },
];

type SeedMeal = Omit<MealEntry, "id" | "date">;

const TODAY_MEALS: SeedMeal[] = [
  {
    mealType: "sarapan",
    name: "Oatmeal Susu Almond & Pisang Cavendish",
    time: "07:30",
    kcal: 260,
    protein: 8,
    carbs: 45,
    fat: 5,
    fiber: 7,
    tags: ["Serat Tinggi"],
    source: "manual",
  },
  {
    mealType: "sarapan",
    name: "Kopi Hitam / Americano Mandheling",
    time: "07:45",
    kcal: 5,
    protein: 0,
    carbs: 1,
    fat: 0,
    fiber: 0,
    tags: ["Tanpa Gula"],
    source: "manual",
  },
  {
    mealType: "sarapan",
    name: "Rebusan Telur Kampung (2 Butir)",
    time: "07:50",
    kcal: 115,
    protein: 12,
    carbs: 1,
    fat: 8,
    fiber: 0,
    tags: ["Protein Alami"],
    source: "manual",
  },
  {
    mealType: "siang",
    name: "Salmon Teriyaki Bowl & Nasi Merah Organik",
    time: "12:45",
    kcal: 580,
    protein: 38,
    carbs: 62,
    fat: 18,
    fiber: 6,
    tags: ["Omega-3 Rich"],
    source: "scan",
    image: PHOTOS.teishoku,
  },
  {
    mealType: "siang",
    name: "Teh Hijau Oolong Hangat",
    time: "13:10",
    kcal: 0,
    protein: 0,
    carbs: 0,
    fat: 0,
    fiber: 0,
    tags: ["Tanpa Pemanis", "Antioksidan"],
    source: "manual",
  },
  {
    mealType: "siang",
    name: "Miso Soup Tradisional dengan Wakame & Tofu",
    time: "13:15",
    kcal: 100,
    protein: 6,
    carbs: 8,
    fat: 3,
    fiber: 2,
    tags: ["Probiotik Fermentasi"],
    source: "manual",
  },
  {
    mealType: "camilan",
    name: "Greek Yogurt & Tetesan Madu Murni",
    time: "16:15",
    kcal: 140,
    protein: 12,
    carbs: 14,
    fat: 2,
    fiber: 1,
    tags: ["Probiotik"],
    source: "manual",
  },
  {
    mealType: "camilan",
    name: "Kacang Almond Panggang (15 butir)",
    time: "16:40",
    kcal: 70,
    protein: 3,
    carbs: 3,
    fat: 6,
    fiber: 2,
    tags: ["Lemak Sehat"],
    source: "manual",
  },
];

/** Kalori historis 30 hari terakhir supaya kalender & grafik terasa hidup. */
const HISTORY_KCAL = [
  1420, 1550, 1390, 0, 1610, 1480, 1450, 1520, 1410, 1490, 1560, 1630, 1480,
  1440, 1510, 1395, 1470, 1530, 1610, 1500, 1455, 1585, 1390, 1620, 1470, 1540,
  1425, 1495, 1565,
];

function historyEntries(today: string): MealEntry[] {
  return HISTORY_KCAL.flatMap((kcal, index) => {
    if (kcal === 0) return [];
    const date = shiftDate(today, index - HISTORY_KCAL.length);
    const ratio = kcal / 1500;

    return [
      {
        id: `seed-${date}`,
        date,
        mealType: "siang" as const,
        name: "Ringkasan Santapan Harian",
        time: "12:30",
        kcal,
        protein: Math.round(96 * ratio),
        carbs: Math.round(168 * ratio),
        fat: Math.round(44 * ratio),
        fiber: Math.round(24 * ratio),
        tags: ["Arsip"],
        source: "manual" as const,
      },
    ];
  });
}

export function createSeedState(today: string): RaifuState {
  return {
    profile: {
      name: "Kenji Pratama",
      email: "kenji@raifu.id",
      sex: "pria",
      age: 28,
      weightKg: 58,
      heightCm: 165,
      startWeightKg: 62,
      targetWeightKg: 56,
      activity: "moderat",
      goal: "jaga",
      joinedLabel: "Anggota Sejak Sep 2024",
      xp: 680,
    },
    entries: [
      ...historyEntries(today),
      ...TODAY_MEALS.map((meal, index) => ({
        ...meal,
        id: `seed-today-${index}`,
        date: today,
      })),
    ],
    water: { [today]: 1750 },
    freezeDates: [shiftDate(today, -25)],
    reminders: DEFAULT_REMINDERS,
    onboarded: true,
  };
}
