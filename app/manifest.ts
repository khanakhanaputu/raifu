import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Raifu — Track Your Life, Live Your Best",
    short_name: "Raifu",
    description:
      "Platform tracking gizi harian mindful ala Jepang: scan makanan AI, streak, dan rekomendasi menu sehat.",
    start_url: "/dashboard",
    display: "standalone",
    background_color: "#fcf9f8",
    theme_color: "#426449",
    lang: "id",
    icons: [
      { src: "/icon-192.png", sizes: "192x192", type: "image/png" },
      { src: "/icon-512.png", sizes: "512x512", type: "image/png" },
      { src: "/icon-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
    ],
  };
}
