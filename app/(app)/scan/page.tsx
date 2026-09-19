import type { Metadata } from "next";
import { ScanView } from "./scan-view";

export const metadata: Metadata = {
  title: "Scan Nutrisi",
  description:
    "Unggah atau ambil foto makanan untuk estimasi instan komposisi makro, serat alami, dan rekomendasi mindful nutrition.",
};

export default function ScanPage() {
  return <ScanView />;
}
