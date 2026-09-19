"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Card, Eyebrow, Pill, buttonClass, cx, fieldClass, FieldLabel } from "@/app/components/ui";
import {
  ArrowRightIcon,
  CheckCircleIcon,
  LeafIcon,
  SnowflakeIcon,
} from "@/app/components/icons";
import { useRaifu } from "@/lib/store";
import {
  ACTIVITY_OPTIONS,
  GOAL_OPTIONS,
  bmiCategory,
  bodyMassIndex,
  calculateTargets,
  formatNumber,
  type ActivityLevel,
  type Goal,
  type Sex,
} from "@/lib/nutrition";
import { PHOTOS } from "@/lib/content";
import type { ReminderId } from "@/lib/store-types";

const STEPS = [
  { title: "Preferensi Rasa", caption: "Ragam Pangan" },
  { title: "Biometri & Tujuan", caption: "Komposisi & Keseimbangan" },
  { title: "Ritual Harian", caption: "Pengingat Sadar" },
];

const TASTE_OPTIONS = [
  { id: "nusantara", label: "Nusantara", detail: "Tempe, ikan laut, sayur bening" },
  { id: "jepang", label: "Jepang Sehat", detail: "Miso, soba, ikan panggang" },
  { id: "nabati", label: "Nabati / Plant-Based", detail: "Tahu, kacang, biji-bijian" },
  { id: "seafood", label: "Seafood", detail: "Salmon, kembung, rumput laut" },
  { id: "rendah-gluten", label: "Rendah Gluten", detail: "Beras merah, soba murni" },
  { id: "rendah-laktosa", label: "Rendah Laktosa", detail: "Susu almond, santan encer" },
];

const RITUAL_OPTIONS: { id: ReminderId; label: string; detail: string }[] = [
  { id: "sarapan", label: "Pengingat Sarapan Pagi", detail: "07:30 WIB · memulai hari dengan seimbang" },
  { id: "siang", label: "Pengingat Makan Siang Mindful", detail: "12:00 WIB · makan tanpa distraksi gawai" },
  { id: "malam", label: "Pengingat Jurnal Makan Malam", detail: "19:30 WIB · tutup hari dengan tenang" },
  { id: "streak", label: "Preservasi Streak Harian", detail: "21:00 WIB · jaga rantai kebiasaan" },
  { id: "hidrasi", label: "Pengingat Hidrasi Berkala", detail: "Interval 2 jam · 250ml tiap kali" },
];

export function OnboardingView() {
  const router = useRouter();
  const { state, updateProfile, toggleReminder } = useRaifu();
  const [step, setStep] = useState(0);
  const [tastes, setTastes] = useState<string[]>(["nusantara", "jepang"]);
  const [form, setForm] = useState({
    sex: state.profile.sex as Sex,
    age: "28",
    weightKg: "58",
    heightCm: "165",
    activity: "ringan" as ActivityLevel,
    goal: "jaga" as Goal,
  });

  const numeric = {
    age: Number(form.age) || 0,
    weightKg: Number(form.weightKg) || 0,
    heightCm: Number(form.heightCm) || 0,
  };

  const targets = calculateTargets({
    sex: form.sex,
    age: numeric.age,
    weightKg: numeric.weightKg,
    heightCm: numeric.heightCm,
    activity: form.activity,
    goal: form.goal,
  });

  const bmi = bodyMassIndex(numeric.weightKg, numeric.heightCm);
  const category = bmiCategory(bmi);

  const macroShare = {
    protein: Math.round(((targets.protein * 4) / targets.kcal) * 100),
    carbs: Math.round(((targets.carbs * 4) / targets.kcal) * 100),
    fat: Math.round(((targets.fat * 9) / targets.kcal) * 100),
  };

  const finish = () => {
    updateProfile({
      sex: form.sex,
      age: numeric.age,
      weightKg: numeric.weightKg,
      heightCm: numeric.heightCm,
      startWeightKg: numeric.weightKg,
      targetWeightKg:
        form.goal === "turun"
          ? Math.round((numeric.weightKg - 2) * 10) / 10
          : form.goal === "naik"
            ? Math.round((numeric.weightKg + 2) * 10) / 10
            : numeric.weightKg,
      activity: form.activity,
      goal: form.goal,
    });
    router.push("/dashboard");
  };

  return (
    <div className="mx-auto max-w-[1400px] px-4 py-8 sm:px-6 lg:px-8">
      <div className="flex flex-wrap items-baseline justify-between gap-3">
        <Eyebrow>
          Ritual Masuk · Langkah {`${step + 1}`.padStart(2, "0")} dari 03
        </Eyebrow>
        <p className="text-sm text-body">{STEPS[step].caption}</p>
      </div>

      <ol className="mt-4 grid grid-cols-3 gap-3">
        {STEPS.map((item, index) => {
          const done = index < step;
          const active = index === step;
          return (
            <li key={item.title}>
              <div className="flex items-center gap-3">
                <span
                  className={cx(
                    "grid h-7 w-7 shrink-0 place-items-center rounded-full text-xs",
                    done
                      ? "bg-sage text-white"
                      : active
                        ? "bg-sage text-white"
                        : "bg-stone text-muted",
                  )}
                >
                  {done ? "✓" : index + 1}
                </span>
                <span
                  className={cx(
                    "h-0.5 flex-1 rounded-full",
                    index <= step ? "bg-sage" : "bg-stone",
                  )}
                />
              </div>
              <p
                className={cx(
                  "mt-2 text-xs",
                  active ? "font-medium text-ink" : "text-muted",
                )}
              >
                {item.title}
              </p>
            </li>
          );
        })}
      </ol>

      <div className="mt-8 grid gap-6 lg:grid-cols-[1.5fr_1fr]">
        <div className="space-y-6">
          {step === 0 && (
            <Card className="p-6 sm:p-8">
              <Pill>
                Ragam Rasa Anda · <span className="font-jp">味の好み</span>
              </Pill>
              <h1 className="mt-5 font-serif text-3xl leading-tight text-ink">
                Kenali Preferensi Rasa &amp; Bahan Pangan Anda
              </h1>
              <p className="mt-3 max-w-xl text-sm leading-relaxed text-body">
                Pilih kecenderungan pangan yang paling sering Anda nikmati. Raifu memakai
                data ini untuk menyusun rekomendasi menu yang realistis, bukan memaksakan
                pola asing.
              </p>

              <ul className="mt-6 grid gap-3 sm:grid-cols-2">
                {TASTE_OPTIONS.map((option) => {
                  const selected = tastes.includes(option.id);
                  return (
                    <li key={option.id}>
                      <button
                        type="button"
                        aria-pressed={selected}
                        onClick={() =>
                          setTastes((prev) =>
                            prev.includes(option.id)
                              ? prev.filter((item) => item !== option.id)
                              : [...prev, option.id],
                          )
                        }
                        className={cx(
                          "w-full rounded-lg border p-4 text-left transition-colors",
                          selected
                            ? "border-sage bg-sage-soft"
                            : "border-line bg-white hover:border-sage/50",
                        )}
                      >
                        <span className="flex items-center justify-between gap-3">
                          <span className="text-sm font-medium text-ink">
                            {option.label}
                          </span>
                          {selected && <CheckCircleIcon className="h-4 w-4 text-sage" />}
                        </span>
                        <span className="mt-1 block text-xs text-body">
                          {option.detail}
                        </span>
                      </button>
                    </li>
                  );
                })}
              </ul>

              <p className="mt-5 text-xs text-muted">
                {tastes.length} preferensi dipilih · dapat diubah kapan saja di halaman
                Profil.
              </p>
            </Card>
          )}

          {step === 1 && (
            <>
              <Card className="p-6 sm:p-8">
                <Pill>
                  Keseimbangan Alami · <span className="font-jp">心身の調和</span>
                </Pill>
                <h1 className="mt-5 font-serif text-3xl leading-tight text-ink">
                  Sesuaikan Ritme Nutrisi dengan Kebutuhan Tubuh Anda
                </h1>
                <p className="mt-3 max-w-xl text-sm leading-relaxed text-body">
                  Data ini membantu Raifu menghitung kebutuhan makronutrien, serat
                  harian, dan rekomendasi hidangan seimbang tanpa pembatasan ekstrem.
                </p>
              </Card>

              <Card className="p-6">
                <div className="flex items-baseline justify-between gap-3">
                  <h2 className="flex items-center gap-3 font-serif text-xl text-ink">
                    <span className="h-5 w-1 rounded-full bg-sage" />
                    1. Profil Diri &amp; Usia
                  </h2>
                  <Eyebrow>Dasar Metabolisme</Eyebrow>
                </div>

                <div className="mt-5 grid gap-5 sm:grid-cols-[1.4fr_1fr]">
                  <fieldset>
                    <legend className="mb-1.5 text-xs font-medium text-ink">
                      Jenis Kelamin Biologis
                    </legend>
                    <div className="grid grid-cols-3 gap-2">
                      {(
                        [
                          { value: "wanita", label: "Wanita", sign: "♀" },
                          { value: "pria", label: "Pria", sign: "♂" },
                          { value: "lainnya", label: "Lainnya", sign: "∞" },
                        ] as const
                      ).map((option) => (
                        <button
                          key={option.value}
                          type="button"
                          aria-pressed={form.sex === option.value}
                          onClick={() => setForm((prev) => ({ ...prev, sex: option.value }))}
                          className={cx(
                            "rounded-lg border px-3 py-3 text-center transition-colors",
                            form.sex === option.value
                              ? "border-sage bg-sage-soft text-ink"
                              : "border-line bg-white text-body hover:border-sage/50",
                          )}
                        >
                          <span className="block text-base">{option.sign}</span>
                          <span className="mt-1 block text-xs">{option.label}</span>
                        </button>
                      ))}
                    </div>
                  </fieldset>

                  <div>
                    <FieldLabel htmlFor="usia-onboarding">Usia (Tahun)</FieldLabel>
                    <input
                      id="usia-onboarding"
                      type="number"
                      min={13}
                      max={90}
                      value={form.age}
                      onChange={(event) =>
                        setForm((prev) => ({ ...prev, age: event.target.value }))
                      }
                      className={fieldClass}
                    />
                  </div>
                </div>
              </Card>

              <Card className="p-6">
                <div className="flex items-baseline justify-between gap-3">
                  <h2 className="flex items-center gap-3 font-serif text-xl text-ink">
                    <span className="h-5 w-1 rounded-full bg-sage" />
                    2. Dimensi Fisik
                  </h2>
                  <Eyebrow>Pengukuran Sadar</Eyebrow>
                </div>

                <div className="mt-6 space-y-6">
                  <SliderField
                    id="berat-onboarding"
                    label="Berat Badan"
                    unit="kg"
                    min={40}
                    max={140}
                    value={form.weightKg}
                    onChange={(value) => setForm((prev) => ({ ...prev, weightKg: value }))}
                  />
                  <SliderField
                    id="tinggi-onboarding"
                    label="Tinggi Badan"
                    unit="cm"
                    min={130}
                    max={210}
                    value={form.heightCm}
                    onChange={(value) => setForm((prev) => ({ ...prev, heightCm: value }))}
                  />
                </div>

                <div className="mt-6 flex flex-wrap items-center justify-between gap-4 rounded-lg bg-sage-soft p-4">
                  <p className="flex items-center gap-3">
                    <span className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-white text-sage">
                      <LeafIcon className="h-5 w-5" />
                    </span>
                    <span>
                      <span className="block text-xs tracking-[0.1em] text-sage uppercase">
                        Estimasi Indeks Massa Tubuh (IMT)
                      </span>
                      <span className="mt-1 flex items-center gap-2">
                        <span className="font-serif text-2xl text-ink tabular-nums">
                          {bmi.toFixed(1)}
                        </span>
                        <Pill tone="solid">{category.label}</Pill>
                      </span>
                    </span>
                  </p>
                  <p className="text-right text-xs text-ink/70">
                    Rentang Ideal
                    <span className="mt-0.5 block font-medium text-ink">18.5 – 24.9</span>
                  </p>
                </div>
              </Card>

              <Card className="p-6">
                <div className="flex items-baseline justify-between gap-3">
                  <h2 className="flex items-center gap-3 font-serif text-xl text-ink">
                    <span className="h-5 w-1 rounded-full bg-sage" />
                    3. Arah &amp; Niat Sehat Anda
                  </h2>
                  <Eyebrow>Ikigai Tubuh</Eyebrow>
                </div>

                <ul className="mt-5 space-y-3">
                  {GOAL_OPTIONS.map((option) => {
                    const selected = form.goal === option.value;
                    return (
                      <li key={option.value}>
                        <button
                          type="button"
                          aria-pressed={selected}
                          onClick={() => setForm((prev) => ({ ...prev, goal: option.value }))}
                          className={cx(
                            "w-full rounded-lg border p-4 text-left transition-colors",
                            selected
                              ? "border-sage bg-sage-soft"
                              : "border-line bg-mist hover:border-sage/40",
                          )}
                        >
                          <span className="flex flex-wrap items-center gap-3">
                            <span
                              className={cx(
                                "grid h-4 w-4 shrink-0 place-items-center rounded-full border-2",
                                selected ? "border-sage" : "border-muted",
                              )}
                            >
                              {selected && (
                                <span className="h-2 w-2 rounded-full bg-sage" />
                              )}
                            </span>
                            <span className="text-sm font-medium text-ink">
                              {option.label}
                            </span>
                            <Pill tone={selected ? "solid" : "neutral"}>{option.tag}</Pill>
                          </span>
                          <span className="mt-2 block pl-7 text-xs leading-relaxed text-body">
                            {option.description}
                          </span>
                        </button>
                      </li>
                    );
                  })}
                </ul>
              </Card>

              <Card className="p-6">
                <div className="flex items-baseline justify-between gap-3">
                  <h2 className="flex items-center gap-3 font-serif text-xl text-ink">
                    <span className="h-5 w-1 rounded-full bg-sage" />
                    4. Aktivitas &amp; Gerak Harian
                  </h2>
                  <Eyebrow>Ritme Gerak</Eyebrow>
                </div>

                <ul className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                  {ACTIVITY_OPTIONS.map((option) => {
                    const selected = form.activity === option.value;
                    return (
                      <li key={option.value}>
                        <button
                          type="button"
                          aria-pressed={selected}
                          onClick={() =>
                            setForm((prev) => ({ ...prev, activity: option.value }))
                          }
                          className={cx(
                            "h-full w-full rounded-lg border p-4 text-left transition-colors",
                            selected
                              ? "border-sage bg-sage-soft"
                              : "border-line bg-white hover:border-sage/50",
                          )}
                        >
                          <span className="block text-sm font-medium text-ink">
                            {option.label}
                          </span>
                          <span className="mt-1 block text-xs leading-relaxed text-body">
                            {option.description}
                          </span>
                        </button>
                      </li>
                    );
                  })}
                </ul>
              </Card>
            </>
          )}

          {step === 2 && (
            <Card className="p-6 sm:p-8">
              <Pill>
                Ritual Harian · <span className="font-jp">日々の習慣</span>
              </Pill>
              <h1 className="mt-5 font-serif text-3xl leading-tight text-ink">
                Atur Pengingat yang Menemani, Bukan Menekan
              </h1>
              <p className="mt-3 max-w-xl text-sm leading-relaxed text-body">
                Raifu mengirim ajakan santun pada waktu yang Anda pilih. Semua pengingat
                dapat dimatikan kapan saja tanpa memengaruhi streak Anda.
              </p>

              <ul className="mt-6 space-y-3">
                {RITUAL_OPTIONS.map((option) => {
                  const reminder = state.reminders.find((item) => item.id === option.id);
                  const enabled = reminder?.enabled ?? false;
                  return (
                    <li
                      key={option.id}
                      className={cx(
                        "flex items-center justify-between gap-5 rounded-lg p-4 transition-colors",
                        enabled ? "bg-sage-soft/60" : "bg-mist",
                      )}
                    >
                      <span className="min-w-0">
                        <span className="block text-sm font-medium text-ink">
                          {option.label}
                        </span>
                        <span className="mt-0.5 block text-xs text-body">
                          {option.detail}
                        </span>
                      </span>
                      <button
                        type="button"
                        role="switch"
                        aria-checked={enabled}
                        aria-label={`Aktifkan ${option.label}`}
                        onClick={() => toggleReminder(option.id)}
                        className={cx(
                          "relative h-6 w-11 shrink-0 rounded-full transition-colors",
                          enabled ? "bg-sage" : "bg-stone",
                        )}
                      >
                        <span
                          className={cx(
                            "absolute top-0.5 h-5 w-5 rounded-full bg-white transition-all",
                            enabled ? "left-[22px]" : "left-0.5",
                          )}
                        />
                      </button>
                    </li>
                  );
                })}
              </ul>
            </Card>
          )}
        </div>

        <div className="space-y-5 lg:sticky lg:top-24 lg:self-start">
          <Card className="p-6">
            <div className="flex items-center justify-between gap-3">
              <Eyebrow className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-sage" />
                Kalkulasi Cerdas Raifu
              </Eyebrow>
              <span className="text-xs text-body">Pembaruan Langsung</span>
            </div>

            <div className="mt-5 rounded-lg bg-mist p-5">
              <p className="text-xs tracking-[0.12em] text-muted uppercase">
                Target Asupan Harian
              </p>
              <p className="mt-2 flex items-baseline gap-2">
                <span className="font-serif text-4xl text-sage tabular-nums">
                  {formatNumber(targets.kcal)}
                </span>
                <span className="text-base text-body">kkal / hari</span>
              </p>
              <p className="mt-2 text-xs text-body">
                Dioptimasi untuk metabolisme stabil tanpa rasa lemas.
              </p>
            </div>

            <p className="mt-6 text-xs tracking-[0.1em] text-muted uppercase">
              Distribusi Makronutrien Esensial
            </p>
            <ul className="mt-3 space-y-3">
              {[
                { label: "Protein Alami", value: targets.protein, share: macroShare.protein },
                { label: "Karbohidrat Kompleks", value: targets.carbs, share: macroShare.carbs },
                { label: "Lemak Sehat", value: targets.fat, share: macroShare.fat },
              ].map((macro) => (
                <li key={macro.label}>
                  <p className="flex items-baseline justify-between gap-3 text-sm">
                    <span className="flex items-center gap-2 text-ink">
                      <span className="h-2 w-2 rounded-full bg-sage" />
                      {macro.label}
                    </span>
                    <span className="text-xs text-body tabular-nums">
                      <span className="font-semibold text-ink">{macro.value}</span> g (
                      {macro.share}%)
                    </span>
                  </p>
                  <span className="mt-2 block h-1.5 overflow-hidden rounded-full bg-sage-soft">
                    <span
                      className="block h-full rounded-full bg-sage transition-[width] duration-500"
                      style={{ width: `${macro.share * 2}%` }}
                    />
                  </span>
                </li>
              ))}
            </ul>

            <div className="mt-6 flex gap-3 rounded-lg bg-sage-soft p-4">
              <SnowflakeIcon className="mt-0.5 h-5 w-5 shrink-0 text-sage" />
              <p>
                <span className="block text-sm font-medium text-ink">
                  Proteksi Streak Alami (1x / Bulan)
                </span>
                <span className="mt-1 block text-xs leading-relaxed text-ink/70">
                  Hidup tidak linier. Saat Anda butuh istirahat atau jamuan perayaan
                  keluarga, konsistensi ritme Anda tetap aman tanpa rasa bersalah.
                </span>
              </p>
            </div>
          </Card>

          <Card className="flex items-start gap-4 p-5">
            <span className="relative h-16 w-16 shrink-0 overflow-hidden rounded-lg bg-stone">
              <Image
                src={PHOTOS.bowl}
                alt="Semangkuk hidangan seimbang"
                fill
                sizes="64px"
                className="object-cover"
              />
            </span>
            <p>
              <span className="block text-xs tracking-[0.12em] text-muted uppercase">
                Pendekatan Raifu
              </span>
              <span className="mt-1 block font-serif text-base text-ink">
                Nutrisi Tanpa Obsesi Timbangan
              </span>
              <span className="mt-1 block text-xs leading-relaxed text-body">
                Fokus pada rasa puas, kejernihan mental, dan nutrisi alami berkualitas
                tinggi tiap kali makan.
              </span>
            </p>
          </Card>
        </div>
      </div>

      <div className="mt-8 flex flex-wrap items-center justify-between gap-4 border-t border-line pt-6">
        <button
          type="button"
          onClick={() => setStep((value) => Math.max(0, value - 1))}
          disabled={step === 0}
          className="text-sm text-body transition-colors hover:text-sage disabled:opacity-40"
        >
          ← Kembali
        </button>

        <p className="hidden text-xs text-muted sm:block">
          Data tersimpan secara privat di perangkat Anda
        </p>

        {step < STEPS.length - 1 ? (
          <button
            type="button"
            onClick={() => setStep((value) => value + 1)}
            className={buttonClass("primary")}
          >
            Simpan &amp; Lanjut ke Langkah {step + 2}
            <ArrowRightIcon className="h-4 w-4" />
          </button>
        ) : (
          <button type="button" onClick={finish} className={buttonClass("primary")}>
            <CheckCircleIcon className="h-4 w-4" />
            Selesaikan &amp; Buka Dashboard
          </button>
        )}
      </div>
    </div>
  );
}

function SliderField({
  id,
  label,
  unit,
  min,
  max,
  value,
  onChange,
}: {
  id: string;
  label: string;
  unit: string;
  min: number;
  max: number;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <div>
      <div className="flex items-baseline justify-between gap-3">
        <label htmlFor={id} className="text-sm font-medium text-ink">
          {label}
        </label>
        <p className="flex items-baseline gap-1">
          <span className="font-serif text-2xl text-ink tabular-nums">{value}</span>
          <span className="text-xs text-muted">{unit}</span>
        </p>
      </div>
      <input
        id={id}
        type="range"
        min={min}
        max={max}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="mt-3 w-full accent-[var(--color-sage)]"
      />
      <p className="mt-1 flex justify-between text-xs text-muted">
        <span>
          {min} {unit}
        </span>
        <span>
          {Math.round((min + max) / 2)} {unit}
        </span>
        <span>
          {max} {unit}
        </span>
      </p>
    </div>
  );
}
