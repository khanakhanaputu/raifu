import type { Metadata } from "next";
import { StreakView } from "./streak-view";

export const metadata: Metadata = {
  title: "Streak, Kalender & Badges",
  description:
    "Riwayat konsistensi harian, kalender pencatatan, status streak freeze, dan galeri milestone Raifu.",
};

export default function StreakPage() {
  return <StreakView />;
}
