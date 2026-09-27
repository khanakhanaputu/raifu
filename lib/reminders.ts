import type { ReminderId } from "./store-types";

export type ReminderMeta = {
  id: ReminderId;
  label: string;
  time: string;
  description: string;
  defaultEnabled: boolean;
};

export const REMINDER_CATALOG: ReminderMeta[] = [
  {
    id: "sarapan",
    label: "Pengingat Sarapan Pagi",
    time: "07:30 WIB",
    description:
      "Ajakan menenangkan untuk sarapan gizi seimbang sebelum memulai aktivitas harian.",
    defaultEnabled: true,
  },
  {
    id: "siang",
    label: "Pengingat Makan Siang Mindful",
    time: "12:00 WIB",
    description:
      "Mendorong makan tanpa distraksi gawai agar sinyal kenyang 80% terbaca jelas.",
    defaultEnabled: true,
  },
  {
    id: "malam",
    label: "Pengingat Jurnal Makan Malam",
    time: "19:30 WIB",
    description:
      "Waktu ideal menutup santap malam setidaknya 3 jam sebelum waktu istirahat tidur.",
    defaultEnabled: true,
  },
  {
    id: "streak",
    label: "Peringatan Preservasi Streak Harian",
    time: "21:00 WIB",
    description:
      "Peringatan halus jika catatan nutrisi belum lengkap agar rantai kebiasaan tidak terputus.",
    defaultEnabled: true,
  },
  {
    id: "hidrasi",
    label: "Pengingat Hidrasi Berkala",
    time: "Interval 2 Jam",
    description:
      "Petunjuk halus minum 250ml air untuk menjaga kelembapan seluler dan fokus mental.",
    defaultEnabled: false,
  },
];

export function reminderMeta(id: ReminderId): ReminderMeta {
  return REMINDER_CATALOG.find((item) => item.id === id) ?? REMINDER_CATALOG[0];
}
