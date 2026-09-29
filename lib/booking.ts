/**
 * Booking konsultasi ahli gizi mitra — fitur simulasi murni (guidebook
 * mengizinkan fitur interaktif tidak terhubung backend/database/API, lihat
 * poin C.1.f). Tersimpan di localStorage saja agar terasa persisten lintas
 * kunjungan tanpa perlu tabel/API baru.
 */
const STORAGE_KEY = "raifu:nutritionist-booking:v1";

export type Booking = {
  nutritionistId: string;
  date: string; // YYYY-MM-DD
  time: string; // HH:MM
  bookedAt: string; // ISO timestamp
};

export function getBooking(): Booking | null {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as Booking) : null;
  } catch {
    return null;
  }
}

export function setBooking(booking: Booking) {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(booking));
  } catch {
    // localStorage terblokir — booking tetap tampil untuk sesi berjalan lewat state React.
  }
}

export function clearBooking() {
  try {
    window.localStorage.removeItem(STORAGE_KEY);
  } catch {
    // no-op
  }
}
