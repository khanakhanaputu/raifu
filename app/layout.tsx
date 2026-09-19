import type { Metadata } from "next";
import { Inter } from "next/font/google";
import localFont from "next/font/local";
import "./globals.css";
import { RaifuProvider } from "@/lib/store";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

// Subset latin Shippori Mincho di-self-host: keluarga lengkapnya memuat ~120
// berkas subset Jepang yang membuat build bergantung pada jaringan.
const shippori = localFont({
  variable: "--font-shippori",
  display: "swap",
  src: [
    { path: "./fonts/shippori-mincho-400.woff2", weight: "400", style: "normal" },
    { path: "./fonts/shippori-mincho-600.woff2", weight: "600", style: "normal" },
  ],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://raifu.app"),
  title: {
    default: "Raifu — Track Your Life, Live Your Best",
    template: "%s · Raifu",
  },
  description:
    "Raifu membantu membangun kebiasaan hidup sehat lewat scan gizi berbasis AI, catatan makan harian, dan streak yang menjaga konsistensi tanpa rasa cemas.",
  keywords: [
    "tracking gizi",
    "scan makanan",
    "kalori harian",
    "hidup sehat",
    "mindful eating",
    "streak kebiasaan",
  ],
  openGraph: {
    title: "Raifu — Track Your Life, Live Your Best",
    description:
      "Platform tracking gizi harian dengan scan AI dan gamifikasi streak, dibalut ketenangan ala Jepang.",
    type: "website",
    locale: "id_ID",
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="id"
      className={`${inter.variable} ${shippori.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-cream text-body">
        <RaifuProvider>{children}</RaifuProvider>
      </body>
    </html>
  );
}
