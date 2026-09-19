import type { Metadata } from "next";
import { MasukView } from "./masuk-view";

export const metadata: Metadata = {
  title: "Masuk & Pendaftaran Akun",
  description:
    "Masuk atau buat akun Raifu untuk melanjutkan perjalanan hidup sadar dan pencatatan nutrisi penuh perhatian.",
};

export default function MasukPage() {
  return <MasukView />;
}
