import { reminderMeta } from "@/lib/reminders";
import type {
  MealEntry,
  Profile,
  Reminder,
  ReminderId,
} from "@/lib/store-types";
import type { ActivityLevel, Goal, Sex } from "@/lib/nutrition";

export type ProfileRow = {
  id: string;
  name: string;
  email: string;
  sex: Sex;
  age: number;
  weight_kg: number;
  height_cm: number;
  start_weight_kg: number;
  target_weight_kg: number;
  activity: ActivityLevel;
  goal: Goal;
  joined_label: string;
  xp: number;
  onboarded: boolean;
};

export function rowToProfile(row: ProfileRow): Profile {
  return {
    name: row.name,
    email: row.email,
    sex: row.sex,
    age: row.age,
    weightKg: row.weight_kg,
    heightCm: row.height_cm,
    startWeightKg: row.start_weight_kg,
    targetWeightKg: row.target_weight_kg,
    activity: row.activity,
    goal: row.goal,
    joinedLabel: row.joined_label,
    xp: row.xp,
  };
}

export function profilePatchToRow(
  patch: Partial<Profile> & { onboarded?: boolean },
): Partial<ProfileRow> {
  const row: Partial<ProfileRow> = {};
  if (patch.name !== undefined) row.name = patch.name;
  if (patch.email !== undefined) row.email = patch.email;
  if (patch.sex !== undefined) row.sex = patch.sex;
  if (patch.age !== undefined) row.age = patch.age;
  if (patch.weightKg !== undefined) row.weight_kg = patch.weightKg;
  if (patch.heightCm !== undefined) row.height_cm = patch.heightCm;
  if (patch.startWeightKg !== undefined) row.start_weight_kg = patch.startWeightKg;
  if (patch.targetWeightKg !== undefined) row.target_weight_kg = patch.targetWeightKg;
  if (patch.activity !== undefined) row.activity = patch.activity;
  if (patch.goal !== undefined) row.goal = patch.goal;
  if (patch.joinedLabel !== undefined) row.joined_label = patch.joinedLabel;
  if (patch.xp !== undefined) row.xp = patch.xp;
  if (patch.onboarded !== undefined) row.onboarded = patch.onboarded;
  return row;
}

export type MealEntryRow = {
  id: string;
  user_id: string;
  entry_date: string;
  meal_type: MealEntry["mealType"];
  name: string;
  entry_time: string;
  kcal: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber: number;
  tags: string[];
  source: MealEntry["source"];
  image: string | null;
};

export function rowToMealEntry(row: MealEntryRow): MealEntry {
  return {
    id: row.id,
    date: row.entry_date,
    mealType: row.meal_type,
    name: row.name,
    time: row.entry_time,
    kcal: row.kcal,
    protein: row.protein,
    carbs: row.carbs,
    fat: row.fat,
    fiber: row.fiber,
    tags: row.tags,
    source: row.source,
    image: row.image ?? undefined,
  };
}

export function mealEntryToRow(
  entry: MealEntry,
  userId: string,
): MealEntryRow {
  return {
    id: entry.id,
    user_id: userId,
    entry_date: entry.date,
    meal_type: entry.mealType,
    name: entry.name,
    entry_time: entry.time,
    kcal: entry.kcal,
    protein: entry.protein,
    carbs: entry.carbs,
    fat: entry.fat,
    fiber: entry.fiber,
    tags: entry.tags,
    source: entry.source,
    image: entry.image ?? null,
  };
}

export function mealEntryPatchToRow(
  patch: Partial<Omit<MealEntry, "id">>,
): Partial<MealEntryRow> {
  const row: Partial<MealEntryRow> = {};
  if (patch.date !== undefined) row.entry_date = patch.date;
  if (patch.mealType !== undefined) row.meal_type = patch.mealType;
  if (patch.name !== undefined) row.name = patch.name;
  if (patch.time !== undefined) row.entry_time = patch.time;
  if (patch.kcal !== undefined) row.kcal = patch.kcal;
  if (patch.protein !== undefined) row.protein = patch.protein;
  if (patch.carbs !== undefined) row.carbs = patch.carbs;
  if (patch.fat !== undefined) row.fat = patch.fat;
  if (patch.fiber !== undefined) row.fiber = patch.fiber;
  if (patch.tags !== undefined) row.tags = patch.tags;
  if (patch.source !== undefined) row.source = patch.source;
  if (patch.image !== undefined) row.image = patch.image ?? null;
  return row;
}

export type ReminderRow = {
  user_id: string;
  reminder_id: ReminderId;
  enabled: boolean;
};

export function rowToReminder(row: ReminderRow): Reminder {
  const meta = reminderMeta(row.reminder_id);
  return {
    id: row.reminder_id,
    label: meta.label,
    time: meta.time,
    description: meta.description,
    enabled: row.enabled,
  };
}
