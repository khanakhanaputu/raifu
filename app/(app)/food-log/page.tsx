import type { Metadata } from "next";
import { FoodLogView } from "./food-log-view";

export const metadata: Metadata = {
  title: "Food Log Harian",
  description:
    "Catat, ubah, dan hapus santapan harian Anda beserta rincian makronutrisinya.",
};

export default function FoodLogPage() {
  return <FoodLogView />;
}
