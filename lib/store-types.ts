import type { ActivityLevel, Goal, Sex } from "./nutrition";

export type MealType = "sarapan" | "siang" | "malam" | "camilan";

export type MealEntry = {
  id: string;
  date: string; // YYYY-MM-DD
  mealType: MealType;
  name: string;
  time: string; // HH:MM
  kcal: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber: number;
  tags: string[];
  source: "manual" | "scan" | "menu";
  image?: string;
};

export type ReminderId =
  | "sarapan"
  | "siang"
  | "malam"
  | "streak"
  | "hidrasi";

export type Reminder = {
  id: ReminderId;
  label: string;
  time: string;
  description: string;
  enabled: boolean;
};

export type Profile = {
  name: string;
  email: string;
  sex: Sex;
  age: number;
  weightKg: number;
  heightCm: number;
  startWeightKg: number;
  targetWeightKg: number;
  activity: ActivityLevel;
  goal: Goal;
  joinedLabel: string;
  xp: number;
};

export type RaifuState = {
  profile: Profile;
  entries: MealEntry[];
  water: Record<string, number>; // YYYY-MM-DD -> ml
  freezeDates: string[];
  reminders: Reminder[];
  onboarded: boolean;
};

export const MEAL_TYPES: {
  value: MealType;
  label: string;
  kanji: string;
  caption: string;
  defaultTime: string;
}[] = [
  {
    value: "sarapan",
    label: "Sarapan",
    kanji: "朝食",
    caption: "Rutinitas Pagi",
    defaultTime: "07:30",
  },
  {
    value: "siang",
    label: "Makan Siang",
    kanji: "昼食",
    caption: "Santapan Utama",
    defaultTime: "12:45",
  },
  {
    value: "camilan",
    label: "Camilan Sore",
    kanji: "おやつ",
    caption: "Penenang Energi",
    defaultTime: "16:15",
  },
  {
    value: "malam",
    label: "Makan Malam",
    kanji: "夕食",
    caption: "Penutup Hari",
    defaultTime: "19:00",
  },
];

export function mealMeta(type: MealType) {
  return MEAL_TYPES.find((item) => item.value === type) ?? MEAL_TYPES[0];
}
