import { AppNav } from "../components/app-nav";
import { AppFooter } from "../components/app-footer";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <AppNav />
      <main className="flex-1 bg-cream">{children}</main>
      <AppFooter />
    </>
  );
}
