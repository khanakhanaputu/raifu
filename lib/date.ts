const DAY_MS = 24 * 60 * 60 * 1000;

export const WEEKDAYS_SHORT = ["Min", "Sen", "Sel", "Rab", "Kam", "Jum", "Sab"];
export const WEEKDAYS_INITIAL = ["M", "S", "S", "R", "K", "J", "S"];
export const MONTHS = [
  "Januari",
  "Februari",
  "Maret",
  "April",
  "Mei",
  "Juni",
  "Juli",
  "Agustus",
  "September",
  "Oktober",
  "November",
  "Desember",
];

export function toISODate(date: Date) {
  const year = date.getFullYear();
  const month = `${date.getMonth() + 1}`.padStart(2, "0");
  const day = `${date.getDate()}`.padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function fromISODate(iso: string) {
  const [year, month, day] = iso.split("-").map(Number);
  return new Date(year, (month ?? 1) - 1, day ?? 1);
}

export function shiftDate(iso: string, days: number) {
  return toISODate(new Date(fromISODate(iso).getTime() + days * DAY_MS));
}

export function todayISO() {
  return toISODate(new Date());
}

export function formatShortDate(iso: string) {
  const date = fromISODate(iso);
  return `${date.getDate()} ${MONTHS[date.getMonth()].slice(0, 3)}`;
}

export function formatLongDate(iso: string) {
  const date = fromISODate(iso);
  return `${WEEKDAYS_SHORT[date.getDay()]}, ${date.getDate()} ${
    MONTHS[date.getMonth()]
  } ${date.getFullYear()}`;
}

export function monthLabel(iso: string) {
  const date = fromISODate(iso);
  return `${MONTHS[date.getMonth()]} ${date.getFullYear()}`;
}

/** Matriks kalender bulanan (6 baris x 7 kolom) berisi tanggal ISO. */
export function monthMatrix(iso: string) {
  const date = fromISODate(iso);
  const first = new Date(date.getFullYear(), date.getMonth(), 1);
  const start = new Date(first.getTime() - first.getDay() * DAY_MS);

  return Array.from({ length: 42 }, (_, index) => {
    const current = new Date(start.getTime() + index * DAY_MS);
    return {
      iso: toISODate(current),
      day: current.getDate(),
      inMonth: current.getMonth() === date.getMonth(),
    };
  });
}

/** Tujuh hari terakhir (termasuk hari ini), urut dari paling lama. */
export function lastSevenDays(iso: string) {
  return Array.from({ length: 7 }, (_, index) => shiftDate(iso, index - 6));
}

export function greetingFor(date = new Date()) {
  const hour = date.getHours();
  if (hour < 11) return { id: "Selamat pagi", jp: "朝の調和" };
  if (hour < 15) return { id: "Selamat siang", jp: "昼の調和" };
  if (hour < 19) return { id: "Selamat sore", jp: "夕の調和" };
  return { id: "Selamat malam", jp: "夜の調和" };
}
