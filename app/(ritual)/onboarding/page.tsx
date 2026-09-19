import type { Metadata } from "next";
import { OnboardingView } from "./onboarding-view";

export const metadata: Metadata = {
  title: "Onboarding & Personalisasi Target",
  description:
    "Susun profil biometrik, niat sehat, dan ritual harian Anda agar Raifu dapat menghitung target nutrisi personal.",
};

export default function OnboardingPage() {
  return <OnboardingView />;
}
