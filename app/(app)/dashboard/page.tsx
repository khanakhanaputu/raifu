import type { Metadata } from "next";
import { DashboardView } from "./dashboard-view";

export const metadata: Metadata = {
  title: "Dashboard Progres",
  description:
    "Ringkasan asupan gizi harian, ritme mingguan, streak, dan pencapaian Anda di Raifu.",
};

export default function DashboardPage() {
  return <DashboardView />;
}
