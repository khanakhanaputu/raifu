"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { todayISO } from "./date";
import { createSeedState, SEED_TODAY } from "./seed";
import type {
  MealEntry,
  Profile,
  RaifuState,
  ReminderId,
} from "./store-types";

const STORAGE_KEY = "raifu:state:v1";
const XP_PER_ENTRY = 50;

type RaifuContextValue = {
  state: RaifuState;
  /** Tanggal hari ini; memakai tanggal jangkar sampai komponen ter-hidrasi. */
  today: string;
  hydrated: boolean;
  addEntry: (entry: Omit<MealEntry, "id">) => MealEntry;
  updateEntry: (id: string, patch: Partial<Omit<MealEntry, "id">>) => void;
  removeEntry: (id: string) => void;
  addWater: (date: string, ml: number) => void;
  activateFreeze: (date: string) => void;
  toggleReminder: (id: ReminderId) => void;
  updateProfile: (patch: Partial<Profile>) => void;
  resetAll: () => void;
};

const RaifuContext = createContext<RaifuContextValue | null>(null);

function loadState(): RaifuState | null {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as RaifuState;
    if (!parsed?.profile || !Array.isArray(parsed.entries)) return null;
    return parsed;
  } catch {
    return null;
  }
}

function saveState(state: RaifuState) {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // Penyimpanan bisa diblokir (mode privat); state tetap hidup di memori.
  }
}

function createId() {
  return `entry-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`;
}

export function RaifuProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<RaifuState>(() => createSeedState(SEED_TODAY));
  const [today, setToday] = useState(SEED_TODAY);
  const [hydrated, setHydrated] = useState(false);

  // Data tersimpan dan tanggal nyata baru dibaca setelah mount supaya markup
  // server dan klien identik saat hidrasi.
  useEffect(() => {
    const realToday = todayISO();
    // Disengaja: pembacaan localStorage & tanggal nyata harus terjadi setelah
    // hidrasi agar markup server dan klien identik pada render pertama.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setToday(realToday);
    setState(loadState() ?? createSeedState(realToday));
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (hydrated) saveState(state);
  }, [state, hydrated]);

  const addEntry = useCallback((entry: Omit<MealEntry, "id">) => {
    const created: MealEntry = { ...entry, id: createId() };
    setState((prev) => ({
      ...prev,
      entries: [...prev.entries, created],
      profile: { ...prev.profile, xp: prev.profile.xp + XP_PER_ENTRY },
    }));
    return created;
  }, []);

  const updateEntry = useCallback(
    (id: string, patch: Partial<Omit<MealEntry, "id">>) => {
      setState((prev) => ({
        ...prev,
        entries: prev.entries.map((entry) =>
          entry.id === id ? { ...entry, ...patch } : entry,
        ),
      }));
    },
    [],
  );

  const removeEntry = useCallback((id: string) => {
    setState((prev) => ({
      ...prev,
      entries: prev.entries.filter((entry) => entry.id !== id),
    }));
  }, []);

  const addWater = useCallback((date: string, ml: number) => {
    setState((prev) => ({
      ...prev,
      water: {
        ...prev.water,
        [date]: Math.max(0, (prev.water[date] ?? 0) + ml),
      },
    }));
  }, []);

  const activateFreeze = useCallback((date: string) => {
    setState((prev) =>
      prev.freezeDates.includes(date)
        ? prev
        : { ...prev, freezeDates: [...prev.freezeDates, date] },
    );
  }, []);

  const toggleReminder = useCallback((id: ReminderId) => {
    setState((prev) => ({
      ...prev,
      reminders: prev.reminders.map((reminder) =>
        reminder.id === id ? { ...reminder, enabled: !reminder.enabled } : reminder,
      ),
    }));
  }, []);

  const updateProfile = useCallback((patch: Partial<Profile>) => {
    setState((prev) => ({ ...prev, profile: { ...prev.profile, ...patch } }));
  }, []);

  const resetAll = useCallback(() => {
    const realToday = todayISO();
    setState(createSeedState(realToday));
  }, []);

  const value = useMemo<RaifuContextValue>(
    () => ({
      state,
      today,
      hydrated,
      addEntry,
      updateEntry,
      removeEntry,
      addWater,
      activateFreeze,
      toggleReminder,
      updateProfile,
      resetAll,
    }),
    [
      state,
      today,
      hydrated,
      addEntry,
      updateEntry,
      removeEntry,
      addWater,
      activateFreeze,
      toggleReminder,
      updateProfile,
      resetAll,
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
