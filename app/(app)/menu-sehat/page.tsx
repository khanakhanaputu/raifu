import type { Metadata } from "next";
import { MenuSehatView } from "./menu-sehat-view";

export const metadata: Metadata = {
  title: "Rekomendasi Menu Sehat",
  description:
    "Resep terkurasi dengan filosofi pangan seimbang Jepang & Nusantara untuk mendukung kestabilan metabolisme harian.",
};

export default function MenuSehatPage() {
  return <MenuSehatView />;
}
