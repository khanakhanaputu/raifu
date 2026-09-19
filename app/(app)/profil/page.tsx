import type { Metadata } from "next";
import { ProfilView } from "./profil-view";

export const metadata: Metadata = {
  title: "Profil & Pengaturan",
  description:
    "Kelola data fisik, target metabolisme harian, dan frekuensi pengingat ritual konsistensi Anda.",
};

export default function ProfilPage() {
  return <ProfilView />;
}
