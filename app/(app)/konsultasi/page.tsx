import type { Metadata } from "next";
import { KonsultasiView } from "./konsultasi-view";

export const metadata: Metadata = {
  title: "Konsultasi Bot Gizi",
  description:
    "Tanya jawab panduan nutrisi harian, ide resep rendah glikemik, dan penerapan mindful eating bersama Raifu Bot.",
};

export default function KonsultasiPage() {
  return <KonsultasiView />;
}
