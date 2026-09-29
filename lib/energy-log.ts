import type { EnergyLevel } from "./store-types";

/**
 * Catatan energi per-entri makanan disimpan lokal saja (localStorage), tidak
 * lewat Supabase — fitur ini murni wawasan pribadi di perangkat pengguna,
 * jadi tidak perlu kolom database baru / migrasi skema.
 */
const STORAGE_KEY = "raifu:energy-levels:v1";

function readMap(): Record<string, EnergyLevel> {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

function writeMap(map: Record<string, EnergyLevel>) {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(map));
  } catch {
    // localStorage bisa diblokir (mode privat) — catatan energi cukup hilang,
    // tidak menghalangi pencatatan makanan utama.
  }
}

export function getEnergyLevel(entryId: string): EnergyLevel | undefined {
  return readMap()[entryId];
}

export function setEnergyLevel(entryId: string, level: EnergyLevel | undefined) {
  const map = readMap();
  if (level) {
    map[entryId] = level;
  } else {
    delete map[entryId];
  }
  writeMap(map);
}

export function getAllEnergyLevels(): Record<string, EnergyLevel> {
  return readMap();
}
