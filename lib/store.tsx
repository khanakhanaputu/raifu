"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { createClient } from "./supabase/client";
import { todayISO } from "./date";
import { REMINDER_CATALOG } from "./reminders";
import {
  mealEntryPatchToRow,
  mealEntryToRow,
  profilePatchToRow,
  rowToMealEntry,
  rowToProfile,
  rowToReminder,
  type MealEntryRow,
  type ProfileRow,
  type ReminderRow,
} from "./supabase/mappers";
import type {
  MealEntry,
  Profile,
  RaifuState,
  ReminderId,
} from "./store-types";

const XP_PER_ENTRY = 50;
// Anchor tanggal sampai komponen ter-hidrasi, agar markup server & klien identik.
const INITIAL_TODAY = "2024-01-01";

type RaifuContextValue = {
  state: RaifuState;
  today: string;
  loading: boolean;
  error: string | null;
  addEntry: (entry: Omit<MealEntry, "id">) => MealEntry;
  updateEntry: (id: string, patch: Partial<Omit<MealEntry, "id">>) => void;
  removeEntry: (id: string) => void;
  addWater: (date: string, ml: number) => void;
  activateFreeze: (date: string) => void;
  toggleReminder: (id: ReminderId) => void;
  updateProfile: (patch: Partial<Profile> & { onboarded?: boolean }) => void;
};

const RaifuContext = createContext<RaifuContextValue | null>(null);

const EMPTY_PROFILE: Profile = {
  name: "",
  email: "",
  sex: "lainnya",
  age: 0,
  weightKg: 0,
  heightCm: 0,
  startWeightKg: 0,
  targetWeightKg: 0,
  activity: "ringan",
  goal: "jaga",
  joinedLabel: "",
  xp: 0,
};

function emptyState(): RaifuState {
  return {
    profile: EMPTY_PROFILE,
    entries: [],
    water: {},
    freezeDates: [],
    reminders: REMINDER_CATALOG.map((meta) => ({
      id: meta.id,
      label: meta.label,
      time: meta.time,
      description: meta.description,
      enabled: meta.defaultEnabled,
    })),
    onboarded: false,
  };
}

export function RaifuProvider({ children }: { children: React.ReactNode }) {
  const supabase = useMemo(() => createClient(), []);
  const [state, setState] = useState<RaifuState>(emptyState);
  const [today, setToday] = useState(INITIAL_TODAY);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const userIdRef = useRef<string | null>(null);

  useEffect(() => {
    // Disengaja: tanggal nyata baru dibaca setelah hidrasi agar markup server
    // dan klien identik saat render pertama.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setToday(todayISO());
  }, []);

  const loadForUser = useCallback(
    async (userId: string) => {
      setLoading(true);
      const [profileRes, entriesRes, waterRes, freezeRes, remindersRes] =
        await Promise.all([
          supabase.from("profiles").select("*").eq("id", userId).single(),
          supabase.from("meal_entries").select("*").eq("user_id", userId),
          supabase.from("water_logs").select("*").eq("user_id", userId),
          supabase.from("freeze_dates").select("*").eq("user_id", userId),
          supabase.from("reminders").select("*").eq("user_id", userId),
        ]);

      if (profileRes.error || !profileRes.data) {
        setError("Gagal memuat data Anda. Coba muat ulang halaman.");
        setLoading(false);
        return;
      }

      const profileRow = profileRes.data as ProfileRow;
      const entries = ((entriesRes.data ?? []) as MealEntryRow[]).map(rowToMealEntry);

      const water: Record<string, number> = {};
      for (const row of (waterRes.data ?? []) as { log_date: string; ml: number }[]) {
        water[row.log_date] = row.ml;
      }

      const freezeDates = ((freezeRes.data ?? []) as { freeze_date: string }[]).map(
        (row) => row.freeze_date,
      );
      const reminders = ((remindersRes.data ?? []) as ReminderRow[]).map(rowToReminder);

      setState({
        profile: rowToProfile(profileRow),
        entries,
        water,
        freezeDates,
        reminders,
        onboarded: profileRow.onboarded,
      });
      setError(null);
      setLoading(false);
    },
    [supabase],
  );

  useEffect(() => {
    let cancelled = false;

    supabase.auth.getSession().then(({ data: { session } }) => {
      if (cancelled) return;
      if (session?.user) {
        userIdRef.current = session.user.id;
        loadForUser(session.user.id);
      } else {
        userIdRef.current = null;
        setState(emptyState());
        setLoading(false);
      }
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        if (userIdRef.current !== session.user.id) {
          userIdRef.current = session.user.id;
          loadForUser(session.user.id);
        }
      } else {
        userIdRef.current = null;
        setState(emptyState());
        setLoading(false);
      }
    });

    return () => {
      cancelled = true;
      subscription.unsubscribe();
    };
  }, [supabase, loadForUser]);

  const addEntry = useCallback(
    (entry: Omit<MealEntry, "id">) => {
      const created: MealEntry = { ...entry, id: crypto.randomUUID() };
      const nextXp = state.profile.xp + XP_PER_ENTRY;

      setState((prev) => ({
        ...prev,
        entries: [...prev.entries, created],
        profile: { ...prev.profile, xp: nextXp },
      }));

      const userId = userIdRef.current;
      if (userId) {
        supabase
          .from("meal_entries")
          .insert(mealEntryToRow(created, userId))
          .then(({ error: insertError }) => {
            if (insertError) setError("Gagal menyimpan catatan makanan. Coba lagi.");
          });
        supabase
          .from("profiles")
          .update({ xp: nextXp })
          .eq("id", userId)
          .then(({ error: updateError }) => {
            if (updateError) setError("Gagal memperbarui XP. Coba lagi.");
          });
      }

      return created;
    },
    [supabase, state.profile.xp],
  );

  const updateEntry = useCallback(
    (id: string, patch: Partial<Omit<MealEntry, "id">>) => {
      setState((prev) => ({
        ...prev,
        entries: prev.entries.map((entry) =>
          entry.id === id ? { ...entry, ...patch } : entry,
        ),
      }));

      const userId = userIdRef.current;
      if (userId) {
        supabase
          .from("meal_entries")
          .update(mealEntryPatchToRow(patch))
          .eq("id", id)
          .eq("user_id", userId)
          .then(({ error: updateError }) => {
            if (updateError) setError("Gagal memperbarui catatan makanan. Coba lagi.");
          });
      }
    },
    [supabase],
  );

  const removeEntry = useCallback(
    (id: string) => {
      setState((prev) => ({
        ...prev,
        entries: prev.entries.filter((entry) => entry.id !== id),
      }));

      const userId = userIdRef.current;
      if (userId) {
        supabase
          .from("meal_entries")
          .delete()
          .eq("id", id)
          .eq("user_id", userId)
          .then(({ error: deleteError }) => {
            if (deleteError) setError("Gagal menghapus catatan makanan. Coba lagi.");
          });
      }
    },
    [supabase],
  );

  const addWater = useCallback(
    (date: string, ml: number) => {
      const nextMl = Math.max(0, (state.water[date] ?? 0) + ml);

      setState((prev) => ({
        ...prev,
        water: { ...prev.water, [date]: nextMl },
      }));

      const userId = userIdRef.current;
      if (userId) {
        supabase
          .from("water_logs")
          .upsert(
            { user_id: userId, log_date: date, ml: nextMl },
            { onConflict: "user_id,log_date" },
          )
          .then(({ error: upsertError }) => {
            if (upsertError) setError("Gagal menyimpan catatan hidrasi. Coba lagi.");
          });
      }
    },
    [supabase, state.water],
  );

  const activateFreeze = useCallback(
    (date: string) => {
      if (state.freezeDates.includes(date)) return;

      setState((prev) =>
        prev.freezeDates.includes(date)
          ? prev
          : { ...prev, freezeDates: [...prev.freezeDates, date] },
      );

      const userId = userIdRef.current;
      if (userId) {
        supabase
          .from("freeze_dates")
          .insert({ user_id: userId, freeze_date: date })
          .then(({ error: insertError }) => {
            if (insertError) setError("Gagal menyimpan freeze streak. Coba lagi.");
          });
      }
    },
    [supabase, state.freezeDates],
  );

  const toggleReminder = useCallback(
    (id: ReminderId) => {
      const current = state.reminders.find((reminder) => reminder.id === id);
      const nextEnabled = !(current?.enabled ?? false);

      setState((prev) => ({
        ...prev,
        reminders: prev.reminders.map((reminder) =>
          reminder.id === id ? { ...reminder, enabled: nextEnabled } : reminder,
        ),
      }));

      const userId = userIdRef.current;
      if (userId) {
        supabase
          .from("reminders")
          .update({ enabled: nextEnabled })
          .eq("user_id", userId)
          .eq("reminder_id", id)
          .then(({ error: updateError }) => {
            if (updateError) setError("Gagal memperbarui pengingat. Coba lagi.");
          });
      }
    },
    [supabase, state.reminders],
  );

  const updateProfile = useCallback(
    (patch: Partial<Profile> & { onboarded?: boolean }) => {
      const { onboarded, ...profilePatch } = patch;

      setState((prev) => ({
        ...prev,
        profile: { ...prev.profile, ...profilePatch },
        onboarded: onboarded ?? prev.onboarded,
      }));

      const userId = userIdRef.current;
      if (userId) {
        supabase
          .from("profiles")
          .update(profilePatchToRow(patch))
          .eq("id", userId)
          .then(({ error: updateError }) => {
            if (updateError) setError("Gagal menyimpan profil. Coba lagi.");
          });
      }
    },
    [supabase],
  );

  const value = useMemo<RaifuContextValue>(
    () => ({
      state,
      today,
      loading,
      error,
      addEntry,
      updateEntry,
      removeEntry,
      addWater,
      activateFreeze,
      toggleReminder,
      updateProfile,
    }),
    [
      state,
      today,
      loading,
      error,
      addEntry,
      updateEntry,
      removeEntry,
      addWater,
      activateFreeze,
      toggleReminder,
      updateProfile,
    ],
  );

  return <RaifuContext.Provider value={value}>{children}</RaifuContext.Provider>;
}

export function useRaifu() {
  const context = useContext(RaifuContext);
  if (!context) {
    throw new Error("useRaifu harus dipakai di dalam <RaifuProvider>");
  }
  return context;
}
