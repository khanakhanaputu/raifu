export type Sex = "wanita" | "pria" | "lainnya";
export type ActivityLevel = "sedentari" | "ringan" | "moderat" | "aktif";
export type Goal = "turun" | "jaga" | "naik";

export type Biometrics = {
  sex: Sex;
  age: number;
  weightKg: number;
  heightCm: number;
  activity: ActivityLevel;
  goal: Goal;
};

export type NutritionTargets = {
  bmr: number;
  kcal: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber: number;
  waterMl: number;
};

export const ACTIVITY_OPTIONS: {
  value: ActivityLevel;
  label: string;
  description: string;
  factor: number;
}[] = [
  {
    value: "sedentari",
    label: "Sedentari",
    description: "Banyak duduk, kerja meja & mobilitas santai",
    factor: 1.2,
  },
  {
    value: "ringan",
    label: "Ringan / Jalan Santai",
    description: "5.000–8.000 langkah/hari atau yoga lembut",
    factor: 1.375,
  },
  {
    value: "moderat",
    label: "Moderat",
    description: "Latihan terencana 3x tiap minggu",
    factor: 1.55,
  },
  {
    value: "aktif",
    label: "Aktif Berolahraga",
    description: "Latihan terencana 5–6x tiap minggu",
    factor: 1.725,
  },
];

export const GOAL_OPTIONS: {
  value: Goal;
  label: string;
  tag: string;
  description: string;
  factor: number;
}[] = [
  {
    value: "turun",
    label: "Turunkan Berat Badan Bertahap",
    tag: "Mindful",
    description:
      "Defisit lembut dan penuh kesadaran (~300 kkal), mempertahankan rasa kenyang dengan nutrisi utuh dan padat serat.",
    factor: 0.85,
  },
  {
    value: "jaga",
    label: "Jaga Berat Badan & Kebugaran Metabolisme",
    tag: "Hara Hachi Bu",
    description:
      "Keseimbangan energi isokalori terinspirasi filosofi makan hingga 80% kenyang, menstabilkan gula darah & fokus harian.",
    factor: 1,
  },
  {
    value: "naik",
    label: "Tingkatkan Massa Otot & Stamina",
    tag: "Protein Alami",
    description:
      "Surplus terkontrol dengan densitas asam amino esensial dari tempe, ikan, kedelai edamame, dan biji-bijian rami.",
    factor: 1.12,
  },
];

const MACRO_SPLIT = { protein: 0.25, carbs: 0.48, fat: 0.27 };
const KCAL_PER_GRAM = { protein: 4, carbs: 4, fat: 9 };

export function clamp(value: number, min: number, max: number) {
  if (!Number.isFinite(value)) return min;
  return Math.min(Math.max(value, min), max);
}

/** BMR Harris-Benedict (revisi Roza & Shizgal, 1984). */
function basalMetabolicRate({ sex, age, weightKg, heightCm }: Biometrics) {
  const w = clamp(weightKg, 30, 250);
  const h = clamp(heightCm, 120, 230);
  const a = clamp(age, 13, 90);

  const pria = 88.362 + 13.397 * w + 4.799 * h - 5.677 * a;
  const wanita = 447.593 + 9.247 * w + 3.098 * h - 4.33 * a;

  if (sex === "pria") return pria;
  if (sex === "wanita") return wanita;
  return (pria + wanita) / 2;
}

function activityFactor(level: ActivityLevel) {
  return ACTIVITY_OPTIONS.find((item) => item.value === level)?.factor ?? 1.55;
}

function goalFactor(goal: Goal) {
  return GOAL_OPTIONS.find((item) => item.value === goal)?.factor ?? 1;
}

export function calculateTargets(bio: Biometrics): NutritionTargets {
  const bmr = basalMetabolicRate(bio);
  const kcal = Math.round(bmr * activityFactor(bio.activity) * goalFactor(bio.goal));

  return {
    bmr: Math.round(bmr),
    kcal,
    protein: Math.round((kcal * MACRO_SPLIT.protein) / KCAL_PER_GRAM.protein),
    carbs: Math.round((kcal * MACRO_SPLIT.carbs) / KCAL_PER_GRAM.carbs),
    fat: Math.round((kcal * MACRO_SPLIT.fat) / KCAL_PER_GRAM.fat),
    // Anjuran serat 14 g per 1.000 kkal (Dietary Guidelines).
    fiber: Math.round((kcal / 1000) * 14),
    // Hidrasi ~35 ml per kg berat badan, dibulatkan ke kelipatan 50 ml.
    waterMl: Math.round((clamp(bio.weightKg, 30, 250) * 35) / 50) * 50,
  };
}

export function bodyMassIndex(weightKg: number, heightCm: number) {
  const h = clamp(heightCm, 120, 230) / 100;
  return clamp(weightKg, 30, 250) / (h * h);
}

export function bmiCategory(bmi: number) {
  if (bmi < 18.5) return { label: "Di Bawah Ideal", tone: "warn" as const };
  if (bmi < 23) return { label: "Ideal / Sehat", tone: "good" as const };
  if (bmi < 25) return { label: "Cenderung Berlebih", tone: "warn" as const };
  return { label: "Perlu Penyelarasan", tone: "warn" as const };
}

export function formatNumber(value: number) {
  return value.toLocaleString("id-ID");
}

export function percentOf(value: number, target: number) {
  if (target <= 0) return 0;
  return clamp(Math.round((value / target) * 100), 0, 100);
}
