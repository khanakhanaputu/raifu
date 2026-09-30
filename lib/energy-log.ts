import { readJson, writeJson } from "./local-storage";
import type { EnergyLevel } from "./store-types";

const STORAGE_KEY = "raifu:energy-levels:v1";

export function getAllEnergyLevels(): Record<string, EnergyLevel> {
  return readJson<Record<string, EnergyLevel>>(STORAGE_KEY, {});
}

export function setEnergyLevel(entryId: string, level: EnergyLevel | undefined) {
  const map = getAllEnergyLevels();
  if (level) {
    map[entryId] = level;
  } else {
    delete map[entryId];
  }
  writeJson(STORAGE_KEY, map);
}
