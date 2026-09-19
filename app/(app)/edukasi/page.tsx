import type { Metadata } from "next";
import { EdukasiView } from "./edukasi-view";

export const metadata: Metadata = {
  title: "Edukasi & Artikel Gizi",
  description:
    "Artikel mendalam seputar ilmu gizi modern, filosofi umur panjang Jepang, dan strategi membangun relasi damai dengan makanan.",
};

export default function EdukasiPage() {
  return <EdukasiView />;
}
