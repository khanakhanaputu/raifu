import { Logo } from "./logo";

export function AppFooter() {
  return (
    <footer className="border-t border-line bg-white">
      <div className="mx-auto flex max-w-[1400px] flex-col gap-3 px-4 py-6 text-xs text-muted sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
        <p className="flex items-center gap-2">
          <Logo size="sm" />
          <span className="font-jp">ライフ</span>
          <span>· Mindful Japanese Nutrition &amp; Ritual Habit Tracking</span>
        </p>
        <p>© {new Date().getFullYear()} Raifu. Negative space and intention.</p>
      </div>
    </footer>
  );
}
