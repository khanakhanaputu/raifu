import { AppNav } from "../components/app-nav";
import { AppFooter } from "../components/app-footer";
import { AppDataGate } from "../components/app-data-gate";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <AppNav />
      <main id="main-content" className="flex-1 bg-cream">
        <AppDataGate>{children}</AppDataGate>
      </main>
      <AppFooter />
    </>
  );
}
