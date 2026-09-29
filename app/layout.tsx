import type { Metadata, Viewport } from "next";
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
  appleWebApp: {
    title: "Raifu",
    statusBarStyle: "black-translucent",
  },
  icons: {
    icon: [{ url: "/icon-512.png", sizes: "512x512", type: "image/png" }],
    apple: [{ url: "/icon-192.png", sizes: "192x192", type: "image/png" }],
  },
};

export const viewport: Viewport = {
  themeColor: "#426449",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="id"
      className={`${inter.variable} ${shippori.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-cream text-body">
        <a
          href="#main-content"
          className="sr-only focus-visible:not-sr-only focus-visible:fixed focus-visible:top-4 focus-visible:left-4 focus-visible:z-[100] focus-visible:rounded-md focus-visible:bg-sage focus-visible:px-4 focus-visible:py-2.5 focus-visible:text-sm focus-visible:font-medium focus-visible:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
        >
          Lompat ke konten utama
        </a>
        <RaifuProvider>{children}</RaifuProvider>
      </body>
    </html>
  );
}
