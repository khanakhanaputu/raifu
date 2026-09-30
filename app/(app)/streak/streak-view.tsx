"use client";

import Link from "next/link";
import { useState } from "react";
import { Card, IconTile, Pill, ProgressBar, buttonClass, cx } from "@/app/components/ui";
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  ClockIcon,
  BowlIcon,
  CheckCircleIcon,
  LeafIcon,
  SnowflakeIcon,
} from "@/app/components/icons";
import { useRaifu } from "@/lib/store";
import {
  badgesOf,
  isUnlocked,
  levelInfo,
  streakInfo,
  totalsOn,
} from "@/lib/selectors";
import { formatNumber } from "@/lib/nutrition";
import {
  formatClock,
  fromISODate,
  monthLabel,
  monthMatrix,
  toISODate,
  WEEKDAYS_SHORT,
} from "@/lib/date";

type BadgeFilter = "semua" | "tercapai" | "terkunci";

export function StreakView() {
  const { state, today, activateFreeze } = useRaifu();
  const [monthAnchor, setMonthAnchor] = useState<string | null>(null);
  const [filter, setFilter] = useState<BadgeFilter>("semua");

  const anchor = monthAnchor ?? today;
  const streak = streakInfo(state, today);
  const level = levelInfo(state.profile.xp);
  const badges = badgesOf(state, today);
  const unlockedCount = badges.filter(isUnlocked).length;

  const cells = monthMatrix(anchor);
  const monthDays = cells.filter((cell) => cell.inMonth);
  const activeInMonth = monthDays.filter(
    (cell) => totalsOn(state, cell.iso).kcal > 0,
  ).length;

  const filtered = badges.filter((badge) =>
    filter === "semua"
      ? true
      : filter === "tercapai"
        ? isUnlocked(badge)
        : !isUnlocked(badge),
  );

  const entriesAnalyzed = state.entries.filter(
    (entry) => entry.source === "scan",
  ).length;
  const averageTime = averageLogTime(state.entries.map((entry) => entry.time));

  const shiftMonth = (delta: number) => {
    const date = fromISODate(anchor);
    setMonthAnchor(toISODate(new Date(date.getFullYear(), date.getMonth() + delta, 1)));
  };

  return (
    <div className="mx-auto max-w-[1400px] space-y-6 px-4 py-8 sm:px-6 lg:px-8">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <h1 className="font-serif text-3xl text-ink sm:text-4xl">
            Streak History &amp; Pencapaian
          </h1>
          <p className="mt-2 flex flex-wrap items-center gap-2 text-sm text-muted">
            <span className="font-jp text-ink">継続の美学</span>
            <span>· Keizoku No Bigaku · Ritual Konsistensi</span>
          </p>
        </div>
        <p className="max-w-sm text-sm leading-relaxed text-body lg:text-right">
          Menghargai ketenangan dalam setiap suapan, mencatat setiap nutrisi secara
          sadar tanpa desakan tergesa.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.4fr_1fr]">
        <Card className="p-6">
          <Pill>{streak.days} Hari Beruntun!</Pill>
          <h2 className="mt-4 font-serif text-2xl leading-snug text-ink">
            Hebat, {state.profile.name.split(" ")[0]}! Piring bernutrisi terjaga utuh.
          </h2>
          <p className="mt-3 max-w-xl text-sm leading-relaxed text-body">
            Anda konsisten mencatat santapan harian dan menjaga porsi mindful sesuai
            falsafah <em>Hara Hachi Bu</em> selama {streak.days} hari terakhir.
          </p>
          <p className="mt-6 flex flex-wrap items-center gap-6 text-sm">
            <span className="flex items-center gap-2 text-ink">
              <span className="h-2 w-2 rounded-full bg-sage" />
              Status: {streak.loggedToday ? "Ritme Aktif" : "Menunggu Catatan Hari Ini"}
            </span>
            <span className="flex items-center gap-2 text-body">
              <CheckCircleIcon className="h-4 w-4 text-sage" />
              Target Berikut: {streak.nextMilestone} Hari
            </span>
          </p>
        </Card>

        <Card className="p-6">
          <div className="flex items-start justify-between gap-3">
            <div>
              <h2 className="font-serif text-xl text-ink">Streak Freeze</h2>
              <p className="mt-1 text-sm text-body">Perlindungan Jatah Libur</p>
            </div>
            <Pill>{streak.freezeAvailable} Jatah Aktif</Pill>
          </div>
          <p className="mt-4 text-sm leading-relaxed text-body">
            Aktif otomatis jika Anda berhalangan mencatat santapan dalam sehari agar api
            kebiasaan tetap terlindungi dengan tenang.
          </p>
          <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
            <button
              type="button"
              onClick={() => activateFreeze(today)}
              disabled={streak.freezeAvailable === 0}
              className={buttonClass("secondary")}
            >
              <SnowflakeIcon className="h-4 w-4" />
              {streak.freezeAvailable === 0 ? "Jatah Terpakai" : "Gunakan Hari Ini"}
            </button>
            <p className="text-xs text-muted">Reset per bulan kalender</p>
          </div>
        </Card>
      </div>

      <Card className="p-6">
        <div className="flex flex-wrap items-center gap-4">
          <span className="grid h-11 w-11 shrink-0 place-items-center rounded-lg bg-sage-soft font-jp text-lg text-sage">
            弐
          </span>
          <div className="min-w-0 flex-1">
            <p className="flex flex-wrap items-center gap-3">
              <span className="font-serif text-xl text-ink">
                Level {level.level}: {level.name}
              </span>
              <Pill tone="neutral">{level.progress} / 1000 XP</Pill>
            </p>
            <p className="mt-1 text-sm text-body">
              Tersisa {level.toNext} XP menuju{" "}
              <span className="text-ink">Level {level.level + 1}: {level.nextName}</span>
            </p>
          </div>
          <p className="text-sm text-sage">+50 XP setiap catatan santapan →</p>
        </div>
        <ProgressBar
          className="mt-5"
          value={(level.progress / 1000) * 100}
          label="Progres level"
        />
      </Card>

      <div className="grid gap-6 lg:grid-cols-[1.6fr_1fr]">
        <Card className="p-6">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <h2 className="flex flex-wrap items-center gap-3 font-serif text-2xl text-ink">
                Kalender Presisi: {monthLabel(anchor)}
                <span className="font-jp text-sm text-muted">(神無月)</span>
              </h2>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => shiftMonth(-1)}
                aria-label="Bulan sebelumnya"
                className="grid h-11 w-11 place-items-center rounded-md border border-line text-muted transition-colors hover:text-sage"
              >
                <ChevronLeftIcon className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={() => setMonthAnchor(null)}
                className="rounded-md bg-mist px-3 py-1.5 text-xs text-ink transition-colors hover:text-sage"
              >
                Bulan Berjalan
              </button>
              <button
                type="button"
                onClick={() => shiftMonth(1)}
                aria-label="Bulan berikutnya"
                className="grid h-11 w-11 place-items-center rounded-md border border-line text-muted transition-colors hover:text-sage"
              >
                <ChevronRightIcon className="h-4 w-4" />
              </button>
            </div>
          </div>

          <div className="mt-6 grid grid-cols-7 gap-1.5 text-center text-xs tracking-[0.1em] text-muted uppercase">
            {WEEKDAYS_SHORT.map((day) => (
              <span key={day}>{day}</span>
            ))}
          </div>

          <ul className="mt-2 grid grid-cols-7 gap-1.5">
            {cells.map((cell) => {
              const kcal = totalsOn(state, cell.iso).kcal;
              const frozen = state.freezeDates.includes(cell.iso);
              const isToday = cell.iso === today;
              const logged = kcal > 0;

              return (
                <li
                  key={cell.iso}
                  className={cx(
                    "flex min-h-16 flex-col justify-between rounded-md p-2 text-left",
                    !cell.inMonth && "opacity-35",
                    isToday
                      ? "bg-sage text-white"
                      : logged
                        ? "bg-sage-soft"
                        : frozen
                          ? "bg-mist"
                          : "bg-mist/60",
                  )}
                >
                  <span className="flex items-center justify-between text-xs">
                    <span className={isToday ? "font-semibold" : "text-ink"}>
                      {cell.day}
                    </span>
                    {frozen ? (
                      <SnowflakeIcon className="h-3 w-3 text-sage" />
                    ) : logged ? (
                      <span className={isToday ? "text-white" : "text-sage"}>✓</span>
                    ) : null}
                  </span>
                  <span
                    className={cx(
                      "text-[10px] tabular-nums",
                      isToday ? "text-white/85" : "text-body",
                    )}
                  >
                    {frozen ? "Freeze" : logged ? `${formatNumber(kcal)} kkal` : "—"}
                  </span>
                </li>
              );
            })}
          </ul>

          <ul className="mt-5 flex flex-wrap gap-x-6 gap-y-2 text-xs text-body">
            <li className="flex items-center gap-2">
              <span className="h-3 w-3 rounded-sm bg-sage-soft" /> Selesai Dicatat
            </li>
            <li className="flex items-center gap-2">
              <SnowflakeIcon className="h-3.5 w-3.5 text-sage" /> Streak Freeze
              Digunakan
            </li>
            <li className="flex items-center gap-2">
              <span className="h-3 w-3 rounded-sm bg-sage" /> Hari Ini (Berlangsung)
            </li>
            <li className="flex items-center gap-2">
              <span className="h-3 w-3 rounded-sm bg-mist" /> Hari Mendatang / Kosong
            </li>
          </ul>
          <p className="mt-3 text-xs text-muted tabular-nums">
            {activeInMonth} / {monthDays.length} Hari Aktif (
            {Math.round((activeInMonth / monthDays.length) * 100)}%)
          </p>
        </Card>

        <div className="space-y-6">
          <Card className="p-6">
            <div className="flex items-start justify-between gap-3">
              <div>
                <h2 className="font-serif text-xl text-ink">
                  Metrik Perilaku: Statistik Konsistensi
                </h2>
              </div>
            </div>

            <ul className="mt-5 space-y-3">
              {[
                {
                  icon: <ClockIcon className="h-5 w-5" />,
                  label: "Rerata Jam Input",
                  caption: "Paling aktif sesudah makan",
                  value: averageTime,
                  unit: "WIB",
                },
                {
                  icon: <BowlIcon className="h-5 w-5" />,
                  label: "Total Santapan",
                  caption: "Tercatat dalam jurnal",
                  value: String(state.entries.length),
                  unit: "piring",
                },
                {
                  icon: <LeafIcon className="h-5 w-5" />,
                  label: "Dicatat via Scan",
                  caption: "Estimasi dari foto makanan",
                  value: String(entriesAnalyzed),
                  unit: "scan",
                },
              ].map((stat) => (
                <li
                  key={stat.label}
                  className="flex items-center gap-4 rounded-lg bg-mist p-4"
                >
                  <IconTile tone="white" rounded="md">
                    {stat.icon}
                  </IconTile>
                  <span className="min-w-0 flex-1">
                    <span className="block text-sm font-medium text-ink">
                      {stat.label}
                    </span>
                    <span className="block text-xs text-body">{stat.caption}</span>
                  </span>
                  <span className="text-right">
                    <span className="font-serif text-lg text-ink tabular-nums">
                      {stat.value}
                    </span>
                    <span className="ml-1 text-xs text-muted">{stat.unit}</span>
                  </span>
                </li>
              ))}
            </ul>
          </Card>

          <div className="rounded-xl bg-sage p-6 text-white">
            <p className="text-xs font-semibold tracking-[0.18em] uppercase opacity-80">
              Ritual Refleksi
            </p>
            <p className="mt-3 font-serif text-xl leading-snug">
              “Kenyang secukupnya, pikiran senantiasa jernih.”
            </p>
            <p className="mt-3 text-sm leading-relaxed text-white/80">
              Satu piring hari ini mengukuhkan stabilitas energi esok pagi.
            </p>
            <p className="mt-5 flex items-center justify-between text-xs text-white/70">
              Refleksi Mingguan
              <LeafIcon className="h-4 w-4" />
            </p>
          </div>
        </div>
      </div>

      <section>
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h2 className="flex flex-wrap items-center gap-3 font-serif text-2xl text-ink">
              Galeri Milestone &amp; Badges
              <Pill tone="neutral">
                {unlockedCount}/{badges.length} Terkumpul
              </Pill>
            </h2>
            <p className="mt-2 text-sm text-body">
              Setiap simbol mencerminkan komitmen terhadap apresiasi nutrisi murni.
            </p>
          </div>

          <div className="inline-flex rounded-md border border-line bg-white p-1">
            {(
              [
                { value: "semua", label: `Semua (${badges.length})` },
                { value: "tercapai", label: `Tercapai (${unlockedCount})` },
                {
                  value: "terkunci",
                  label: `Terkunci (${badges.length - unlockedCount})`,
                },
              ] as const
            ).map((tab) => (
              <button
                key={tab.value}
                type="button"
                onClick={() => setFilter(tab.value)}
                aria-pressed={filter === tab.value}
                className={cx(
                  "rounded px-3.5 py-1.5 text-xs transition-colors",
                  filter === tab.value
                    ? "bg-sage text-white"
                    : "text-body hover:text-sage",
                )}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        <ul className="mt-6 grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
          {filtered.map((badge) => {
            const unlocked = isUnlocked(badge);
            const percent = Math.min(
              100,
              Math.round((badge.progress / badge.target) * 100),
            );
            return (
              <li
                key={badge.id}
                className={cx(
                  "flex flex-col rounded-xl border bg-white p-5",
                  unlocked ? "border-sage/40" : "border-line",
                )}
              >
                <div className="flex items-start justify-between gap-3">
                  <span
                    className={cx(
                      "grid h-11 w-11 place-items-center rounded-lg text-xl",
                      unlocked ? "bg-sage-soft" : "bg-mist grayscale",
                    )}
                  >
                    {badge.icon}
                  </span>
                  {unlocked ? (
                    <Pill>Diraih ✓</Pill>
                  ) : (
                    <Pill tone="neutral">Terkunci</Pill>
                  )}
                </div>

                <h3 className="mt-4 font-serif text-lg text-ink">{badge.name}</h3>
                <p className="mt-2 flex-1 text-sm leading-relaxed text-body">
                  {badge.description}
                </p>

                <div className="mt-5 border-t border-line pt-4">
                  <p className="flex items-center justify-between text-xs">
                    <span className="text-muted">
                      {unlocked ? "Dianugerahkan" : `Progres ${badge.unit}`}
                    </span>
                    <span className="text-ink tabular-nums">
                      {Math.min(badge.progress, badge.target)} / {badge.target}{" "}
                      {badge.unit}
                    </span>
                  </p>
                  {!unlocked && <ProgressBar className="mt-2" value={percent} />}
                </div>
              </li>
            );
          })}
        </ul>
      </section>

      <Card className="flex flex-col gap-4 bg-mist p-6 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex items-start gap-4">
          <IconTile size="lg" tone="white">
            <LeafIcon className="h-5 w-5" />
          </IconTile>
          <div>
            <h2 className="font-serif text-xl text-ink">
              Filsafat Kaizen <span className="font-jp">(改善)</span>
            </h2>
            <p className="mt-1 max-w-2xl text-sm leading-relaxed text-body">
              Bukan kesempurnaan kilat yang kita cari, melainkan kebaikan 1% yang
              bertumbuh tenang setiap hari.
            </p>
          </div>
        </div>
        <Link href="/food-log" className={buttonClass("primary")}>
          Catat Santapan Berikutnya
        </Link>
      </Card>
    </div>
  );
}

function averageLogTime(times: string[]) {
  if (times.length === 0) return "–";
  const minutes = times.map((time) => {
    const [hour, minute] = time.split(":").map(Number);
    return (hour || 0) * 60 + (minute || 0);
  });
  const average = Math.round(
    minutes.reduce((sum, value) => sum + value, 0) / minutes.length,
  );
  return formatClock(Math.floor(average / 60), average % 60);
}
