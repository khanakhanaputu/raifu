"use client";

import { useEffect, useId, useRef, useState } from "react";
import {
  buttonClass,
  fieldClass,
  FieldLabel,
} from "@/app/components/ui";
import { MEAL_TYPES, mealMeta, type MealEntry, type MealType } from "@/lib/store-types";

export type MealDraft = {
  name: string;
  mealType: MealType;
  time: string;
  kcal: string;
  protein: string;
  carbs: string;
  fat: string;
  fiber: string;
};

export function emptyDraft(mealType: MealType): MealDraft {
  return {
    name: "",
    mealType,
    time: mealMeta(mealType).defaultTime,
    kcal: "",
    protein: "",
    carbs: "",
    fat: "",
    fiber: "",
  };
}

export function draftFromEntry(entry: MealEntry): MealDraft {
  return {
    name: entry.name,
    mealType: entry.mealType,
    time: entry.time,
    kcal: String(entry.kcal),
    protein: String(entry.protein),
    carbs: String(entry.carbs),
    fat: String(entry.fat),
    fiber: String(entry.fiber),
  };
}

function toNumber(value: string) {
  const parsed = Number(value);
  return Number.isFinite(parsed) && parsed >= 0 ? Math.round(parsed) : 0;
}

export type MealFormValues = {
  name: string;
  mealType: MealType;
  time: string;
  kcal: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber: number;
};

export function MealFormDialog({
  open,
  title,
  initial,
  onSubmit,
  onClose,
}: {
  open: boolean;
  title: string;
  initial: MealDraft;
  onSubmit: (values: MealFormValues) => void;
  onClose: () => void;
}) {
  const id = useId();
  const [draft, setDraft] = useState(initial);
  const [error, setError] = useState<string | null>(null);
  const dialogRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const previouslyFocused = document.activeElement as HTMLElement | null;

    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
        return;
      }
      if (event.key !== "Tab" || !dialogRef.current) return;

      const focusable = dialogRef.current.querySelectorAll<HTMLElement>(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
      );
      if (focusable.length === 0) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      previouslyFocused?.focus();
    };
  }, [open, onClose]);

  if (!open) return null;

  const set = (key: keyof MealDraft) => (value: string) =>
    setDraft((prev) => ({ ...prev, [key]: value }));

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    const name = draft.name.trim();
    if (name.length < 3) {
      setError("Nama makanan minimal 3 karakter.");
      return;
    }
    const kcal = toNumber(draft.kcal);
    if (kcal <= 0) {
      setError("Isi estimasi kalori lebih dari 0.");
      return;
    }

    onSubmit({
      name,
      mealType: draft.mealType,
      time: draft.time || mealMeta(draft.mealType).defaultTime,
      kcal,
      protein: toNumber(draft.protein),
      carbs: toNumber(draft.carbs),
      fat: toNumber(draft.fat),
      fiber: toNumber(draft.fiber),
    });
  };

  return (
    <div className="fixed inset-0 z-[60] grid place-items-center bg-ink/30 p-4 backdrop-blur-sm">
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={`${id}-title`}
        className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-xl border border-line bg-white p-6 shadow-xl"
      >
        <div className="flex items-start justify-between gap-4">
          <h2 id={`${id}-title`} className="font-serif text-xl text-ink">
            {title}
          </h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Tutup formulir"
            className="grid h-11 w-11 place-items-center rounded-md text-muted transition-colors hover:bg-mist hover:text-ink"
          >
            <svg viewBox="0 0 20 20" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.6">
              <path d="M5 5l10 10M15 5L5 15" strokeLinecap="round" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-5 space-y-4" noValidate>
          <div>
            <FieldLabel htmlFor={`${id}-name`}>Nama Makanan</FieldLabel>
            <input
              autoFocus
              id={`${id}-name`}
              value={draft.name}
              onChange={(event) => set("name")(event.target.value)}
              placeholder="Misal: Nasi Merah & Ikan Kembung Bakar"
              className={fieldClass}
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <FieldLabel htmlFor={`${id}-type`}>Waktu Santap</FieldLabel>
              <select
                id={`${id}-type`}
                value={draft.mealType}
                onChange={(event) => {
                  const next = event.target.value as MealType;
                  setDraft((prev) => ({
                    ...prev,
                    mealType: next,
                    time: mealMeta(next).defaultTime,
                  }));
                }}
                className={fieldClass}
              >
                {MEAL_TYPES.map((item) => (
                  <option key={item.value} value={item.value}>
                    {item.label}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <FieldLabel htmlFor={`${id}-time`}>Jam</FieldLabel>
              <input
                id={`${id}-time`}
                type="time"
                value={draft.time}
                onChange={(event) => set("time")(event.target.value)}
                className={fieldClass}
              />
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <FieldLabel htmlFor={`${id}-kcal`}>Kalori (kkal)</FieldLabel>
              <input
                id={`${id}-kcal`}
                type="number"
                min={0}
                inputMode="numeric"
                value={draft.kcal}
                onChange={(event) => set("kcal")(event.target.value)}
                placeholder="380"
                className={fieldClass}
              />
            </div>
            <div>
              <FieldLabel htmlFor={`${id}-protein`}>Protein (g)</FieldLabel>
              <input
                id={`${id}-protein`}
                type="number"
                min={0}
                inputMode="numeric"
                value={draft.protein}
                onChange={(event) => set("protein")(event.target.value)}
                placeholder="24"
                className={fieldClass}
              />
            </div>
            <div>
              <FieldLabel htmlFor={`${id}-carbs`}>Karbohidrat (g)</FieldLabel>
              <input
                id={`${id}-carbs`}
                type="number"
                min={0}
                inputMode="numeric"
                value={draft.carbs}
                onChange={(event) => set("carbs")(event.target.value)}
                placeholder="45"
                className={fieldClass}
              />
            </div>
            <div>
              <FieldLabel htmlFor={`${id}-fat`}>Lemak (g)</FieldLabel>
              <input
                id={`${id}-fat`}
                type="number"
                min={0}
                inputMode="numeric"
                value={draft.fat}
                onChange={(event) => set("fat")(event.target.value)}
                placeholder="12"
                className={fieldClass}
              />
            </div>
          </div>

          <div>
            <FieldLabel htmlFor={`${id}-fiber`}>Serat (g)</FieldLabel>
            <input
              id={`${id}-fiber`}
              type="number"
              min={0}
              inputMode="numeric"
              value={draft.fiber}
              onChange={(event) => set("fiber")(event.target.value)}
              placeholder="6"
              className={fieldClass}
            />
          </div>

          {error && (
            <p role="alert" className="rounded-md bg-mist px-3 py-2 text-xs text-ink">
              {error}
            </p>
          )}

          <div className="flex flex-wrap justify-end gap-3 pt-2">
            <button type="button" onClick={onClose} className={buttonClass("secondary")}>
              Batalkan
            </button>
            <button type="submit" className={buttonClass("primary")}>
              Simpan Catatan
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
