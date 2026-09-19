"use client";

import { useMemo, useState } from "react";

const ACTIVITY = [
  { value: "1.2", label: "Sedentari (kerja duduk)" },
  { value: "1.375", label: "Ringan (jalan santai 1–3x)" },
  { value: "1.55", label: "Moderat (jalan santai / yoga 3x)" },
  { value: "1.725", label: "Aktif (latihan 5–6x)" },
];

const GOALS = [
  { value: "0.85", label: "Turun Berat dengan Tenang" },
  { value: "1", label: "Keseimbangan & Vitalitas" },
  { value: "1.12", label: "Naik Massa Sehat" },
];

/** Rasio makronutrien Raifu: 19% protein, 56% karbohidrat, 25% lemak sehat. */
const MACRO_SPLIT = { protein: 0.19, karbo: 0.56, lemak: 0.25 };
const KCAL_PER_GRAM = { protein: 4, karbo: 4, lemak: 9 };

export function NutritionCalculator() {
  const [sex, setSex] = useState<"pria" | "wanita">("wanita");
  const [weight, setWeight] = useState("62");
  const [height, setHeight] = useState("168");
  const [age, setAge] = useState("25");
  const [activity, setActivity] = useState("1.55");
  const [goal, setGoal] = useState("1");

  const result = useMemo(() => {
    const w = clamp(Number(weight), 30, 250);
    const h = clamp(Number(height), 120, 230);
    const a = clamp(Number(age), 13, 90);

    // Harris-Benedict (revisi Roza & Shizgal, 1984)
    const bmr =
      sex === "pria"
        ? 88.362 + 13.397 * w + 4.799 * h - 5.677 * a
        : 447.593 + 9.247 * w + 3.098 * h - 4.33 * a;

    const calories = Math.round((bmr * Number(activity) * Number(goal)) / 1) || 0;

    return {
      calories,
      protein: Math.round((calories * MACRO_SPLIT.protein) / KCAL_PER_GRAM.protein),
      karbo: Math.round((calories * MACRO_SPLIT.karbo) / KCAL_PER_GRAM.karbo),
      lemak: Math.round((calories * MACRO_SPLIT.lemak) / KCAL_PER_GRAM.lemak),
    };
  }, [sex, weight, height, age, activity, goal]);

  return (
    <div className="rounded-xl border border-line bg-white p-6 sm:p-8">
      <fieldset className="mb-6">
        <legend className="mb-2 text-xs font-medium tracking-[0.12em] text-muted uppercase">
          Profil Tubuh
        </legend>
        <div className="inline-flex rounded-md border border-line p-0.5">
          {(["wanita", "pria"] as const).map((option) => (
            <button
              key={option}
              type="button"
              onClick={() => setSex(option)}
              aria-pressed={sex === option}
              className={`rounded-[5px] px-4 py-1.5 text-sm capitalize transition-colors ${
                sex === option ? "bg-sage text-white" : "text-body hover:text-sage"
              }`}
            >
              {option}
            </button>
          ))}
        </div>
      </fieldset>

      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Berat Badan (kg)" id="berat">
          <input
            id="berat"
            type="number"
            inputMode="numeric"
            min={30}
            max={250}
            value={weight}
            onChange={(e) => setWeight(e.target.value)}
            className={inputClass}
          />
        </Field>

        <Field label="Tinggi Badan (cm)" id="tinggi">
          <input
            id="tinggi"
            type="number"
            inputMode="numeric"
            min={120}
            max={230}
            value={height}
            onChange={(e) => setHeight(e.target.value)}
            className={inputClass}
          />
        </Field>

        <Field label="Usia (tahun)" id="usia">
          <input
            id="usia"
            type="number"
            inputMode="numeric"
            min={13}
            max={90}
            value={age}
            onChange={(e) => setAge(e.target.value)}
            className={inputClass}
          />
        </Field>

        <Field label="Tingkat Aktivitas Harian" id="aktivitas">
          <select
            id="aktivitas"
            value={activity}
            onChange={(e) => setActivity(e.target.value)}
            className={inputClass}
          >
            {ACTIVITY.map((item) => (
              <option key={item.value} value={item.value}>
                {item.label}
              </option>
            ))}
          </select>
        </Field>

        <div className="sm:col-span-2">
          <Field label="Sasaran Pikiran &amp; Raga" id="sasaran">
            <select
              id="sasaran"
              value={goal}
              onChange={(e) => setGoal(e.target.value)}
              className={inputClass}
            >
              {GOALS.map((item) => (
                <option key={item.value} value={item.value}>
                  {item.label}
                </option>
              ))}
            </select>
          </Field>
        </div>
      </div>

      <div className="mt-6 rounded-lg bg-mist p-5">
        <p className="text-xs font-medium tracking-[0.14em] text-sage uppercase">
          Target Asupan Seimbang
        </p>
        <div className="mt-2 flex flex-wrap items-end justify-between gap-4">
          <p className="flex items-baseline gap-2">
            <span
              aria-live="polite"
              className="font-serif text-4xl leading-none text-sage tabular-nums"
            >
              {result.calories.toLocaleString("id-ID")}
            </span>
            <span className="text-sm text-body">kkal / hari</span>
          </p>
          <dl className="flex flex-wrap gap-x-6 gap-y-1 text-sm text-ink">
            <Macro label="Protein" value={`${result.protein}g`} />
            <Macro label="Karbo" value={`${result.karbo}g`} />
            <Macro label="Lemak" value={`${result.lemak}g`} />
          </dl>
        </div>
      </div>
    </div>
  );
}

const inputClass =
  "w-full rounded-md border border-line bg-white px-3.5 py-2.5 text-sm text-ink outline-none transition-colors focus:border-sage focus:ring-2 focus:ring-sage/20";

function Field({
  label,
  id,
  children,
}: {
  label: string;
  id: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label
        htmlFor={id}
        className="mb-1.5 block text-xs font-medium tracking-[0.06em] text-ink"
      >
        {label}
      </label>
      {children}
    </div>
  );
}

function Macro({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-baseline gap-1.5">
      <dt className="sr-only">{label}</dt>
      <dd className="font-semibold tabular-nums">{value}</dd>
      <span aria-hidden className="text-xs text-muted">
        {label}
      </span>
    </div>
  );
}

function clamp(value: number, min: number, max: number) {
  if (!Number.isFinite(value)) return min;
  return Math.min(Math.max(value, min), max);
}
