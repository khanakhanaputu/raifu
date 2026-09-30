import { readJson, removeKey, writeJson } from "./local-storage";

const STORAGE_KEY = "raifu:nutritionist-booking:v1";

export type Booking = {
  nutritionistId: string;
  date: string;
  time: string;
  bookedAt: string;
};

export function getBooking(): Booking | null {
  return readJson<Booking | null>(STORAGE_KEY, null);
}

export function setBooking(booking: Booking) {
  writeJson(STORAGE_KEY, booking);
}

export function clearBooking() {
  removeKey(STORAGE_KEY);
}
