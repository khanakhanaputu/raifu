"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import {
  Card,
  Eyebrow,
  MacroRow,
  Pill,
  ProgressBar,
  ProgressRing,
  buttonClass,
  cx,
} from "@/app/components/ui";
import {
  BowlIcon,
  CheckCircleIcon,
  FlameIcon,
  JournalIcon,
  LeafIcon,
  ScanIcon,
  TrashIcon,
  PencilIcon,
  PlusIcon,
  SnowflakeIcon,
} from "@/app/components/icons";
import { useRaifu } from "@/lib/store";
import {
  badgesOf,
  entriesOn,
  isUnlocked,
  levelInfo,
  streakInfo,
  targetsOf,
  totalsOn,
} from "@/lib/selectors";
import { formatNumber, percentOf } from "@/lib/nutrition";
import { greetingFor, lastSevenDays, WEEKDAYS_SHORT, fromISODate } from "@/lib/date";
import { mealMeta } from "@/lib/store-types";
import { PHOTOS } from "@/lib/content";

export function DashboardView() {
  const { state, today, removeEntry } = useRaifu();
  const [clock, setClock] = useState<string | null>(null);
  const [greeting, setGreeting] = useState(() => greetingFor(new Date(0)));

  useEffect(() => {
    const now = new Date();
    // Disengaja: jam lokal baru boleh dibaca setelah hidrasi agar markup
    // server dan klien tidak berbeda.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setGreeting(greetingFor(now));
    setClock(
      now.toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" }),
    );
  }, []);

  const targets = targetsOf(state);
  const totals = totalsOn(state, today);
  const entries = entriesOn(state, today);
  const streak = streakInfo(state, today);
  const level = levelInfo(state.profile.xp);
  const badges = badgesOf(state, today).slice(0, 5);

  const kcalPercent = percentOf(totals.kcal, targets.kcal);
  const remaining = Math.max(0, targets.kcal - totals.kcal);
  const week = lastSevenDays(today);
  const weekTotals = week.map((date) => totalsOn(state, date).kcal);
  const weekMax = Math.max(targets.kcal, ...weekTotals, 1);

  return (
    <div className="mx-auto max-w-[1400px] space-y-6 px-4 py-8 sm:px-6 lg:px-8">
      <Card className="flex flex-col gap-6 p-6 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex items-start gap-4">
          <span className="grid h-12 w-12 shrink-0 place-items-center rounded-lg bg-sage-soft text-sage">
            <LeafIcon className="h-6 w-6" />
          </span>
          <div>
            <p className="text-xs text-muted">
              <span className="font-jp">{greeting.jp}</span>
              {clock && <> · {clock} WIB</>} ·{" "}
              <span className="text-sage">Terhubung</span>
            </p>
            <h1 className="mt-1 font-serif text-2xl text-ink sm:text-3xl">
              {greeting.id},{" "}
              <span className="text-sage">{state.profile.name.split(" ")[0]}</span>
            </h1>
            <div className="mt-3 flex flex-wrap items-center gap-3">
              <Pill>
                Level {level.level} · {level.name}
              </Pill>
              <span className="flex items-center gap-2">
                <ProgressBar
                  className="w-28"
                  value={(level.progress / 1000) * 100}
                  label="Progres level"
                />
                <span className="text-xs text-body tabular-nums">
                  {level.progress} / 1000 XP
                </span>
              </span>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap gap-3">
          <Link href="/scan" className={buttonClass("primary")}>
            <ScanIcon className="h-4 w-4" />
            Scan Makanan Baru
          </Link>
          <Link href="/food-log" className={buttonClass("secondary")}>
            <PlusIcon className="h-4 w-4" />
            Tambah Log Manual
          </Link>
        </div>
      </Card>

      <div className="grid gap-6 xl:grid-cols-[1.55fr_1fr]">
        <div className="space-y-6">
          <Card className="p-6">
            <div className="flex items-center justify-between gap-3">
              <h2 className="flex items-center gap-3 font-serif text-xl text-ink">
                Asupan Harian
                <Pill tone="neutral">Hari ini</Pill>
              </h2>
              <span className="font-jp text-xs text-muted">献立の調和</span>
            </div>

            <div className="mt-6 grid gap-6 sm:grid-cols-[auto_1fr] sm:items-center">
              <div className="rounded-xl bg-mist p-6 text-center">
                <ProgressRing value={kcalPercent} size={140} thickness={10}>
                  <span>
                    <span className="block font-serif text-2xl text-ink tabular-nums">
                      {formatNumber(totals.kcal)}
                    </span>
                    <span className="block text-xs text-muted">
                      / {formatNumber(targets.kcal)} kkal
                    </span>
                  </span>
                </ProgressRing>
                <p className="mt-4 text-xs leading-relaxed text-body">
                  Sisa {formatNumber(remaining)} kkal
                  <br />
                  (Target Tercapai {kcalPercent}%)
                </p>
              </div>

              <div className="space-y-4">
                <MacroRow label="Protein" value={totals.protein} target={targets.protein} />
                <MacroRow label="Karbohidrat" value={totals.carbs} target={targets.carbs} />
                <MacroRow label="Lemak Sehat" value={totals.fat} target={targets.fat} />
                <MacroRow label="Serat Pangan" value={totals.fiber} target={targets.fiber} />
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <h2 className="font-serif text-xl text-ink">Ritme Mingguan</h2>
                <p className="mt-1 text-sm text-body">
                  Konsistensi asupan kalori terhadap batas ideal harian
                </p>
              </div>
              <p className="flex items-center gap-4 text-xs text-muted">
                <span className="flex items-center gap-1.5">
                  <span className="h-px w-4 bg-muted" /> Target (
                  {formatNumber(targets.kcal)})
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full bg-sage" /> Kalori
                </span>
              </p>
            </div>

            <div className="relative mt-8 h-52">
              <div
                className="absolute inset-x-0 border-t border-dashed border-line"
                style={{ bottom: `${(targets.kcal / weekMax) * 100}%` }}
              />
              <ul className="flex h-full items-end gap-2 sm:gap-4">
                {week.map((date, index) => {
                  const value = weekTotals[index];
                  const isToday = date === today;
                  return (
                    <li key={date} className="flex h-full flex-1 flex-col justify-end">
                      {isToday && (
                        <span className="mb-1 text-center text-xs font-medium text-ink tabular-nums">
                          {formatNumber(value)}
                        </span>
                      )}
                      <span
                        className={cx(
                          "block w-full rounded-t-sm transition-[height] duration-500",
                          isToday ? "bg-sage" : "bg-sage-soft",
                        )}
                        style={{ height: `${(value / weekMax) * 100}%` }}
                        title={`${formatNumber(value)} kkal`}
                      />
                      <span
                        className={cx(
                          "mt-2 block text-center text-xs",
                          isToday ? "font-semibold text-ink" : "text-muted",
                        )}
                      >
                        {WEEKDAYS_SHORT[fromISODate(date).getDay()]}
                      </span>
                    </li>
                  );
                })}
              </ul>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <h2 className="flex items-center gap-3 font-serif text-xl text-ink">
                Jurnal Nutrisi Hari Ini
                <span className="text-sm font-normal text-muted">
                  {entries.length} Sajian
                </span>
              </h2>
              <Link
                href="/food-log"
                className="inline-flex items-center gap-1.5 text-sm text-sage hover:underline"
              >
                <PlusIcon className="h-4 w-4" />
                Tambah Menu
              </Link>
            </div>

            {entries.length === 0 ? (
              <p className="mt-6 rounded-lg border border-dashed border-line px-4 py-8 text-center text-sm text-body">
                Belum ada catatan hari ini. Mulai dari{" "}
                <Link href="/scan" className="text-sage hover:underline">
                  scan makanan
                </Link>{" "}
                atau tambah manual di Food Log.
              </p>
            ) : (
              <ul className="mt-5 space-y-3">
                {entries.map((entry) => {
                  const meta = mealMeta(entry.mealType);
                  return (
                    <li
                      key={entry.id}
                      className="flex items-center gap-4 rounded-lg bg-mist p-4"
                    >
                      <span className="grid h-10 w-10 shrink-0 place-items-center rounded-md bg-white text-sage">
                        {entry.mealType === "sarapan" ? (
                          <JournalIcon className="h-5 w-5" />
                        ) : entry.mealType === "camilan" ? (
                          <LeafIcon className="h-5 w-5" />
                        ) : (
                          <BowlIcon className="h-5 w-5" />
                        )}
                      </span>
                      <div className="min-w-0 flex-1">
                        <p className="text-xs tracking-[0.1em] text-muted uppercase">
                          {entry.time} · {meta.label}
                        </p>
                        <p className="truncate font-serif text-base text-ink">
                          {entry.name}
                        </p>
                        <p className="mt-0.5 text-xs text-body tabular-nums">
                          {formatNumber(entry.kcal)} kkal · P: {entry.protein}g · K:{" "}
                          {entry.carbs}g · L: {entry.fat}g
                        </p>
                      </div>
                      <div className="flex shrink-0 items-center gap-1">
                        <Link
                          href="/food-log"
                          aria-label={`Ubah ${entry.name}`}
                          className="grid h-8 w-8 place-items-center rounded-md text-muted transition-colors hover:bg-white hover:text-sage"
                        >
                          <PencilIcon className="h-4 w-4" />
                        </Link>
                        <button
                          type="button"
                          onClick={() => removeEntry(entry.id)}
                          aria-label={`Hapus ${entry.name}`}
                          className="grid h-8 w-8 place-items-center rounded-md text-muted transition-colors hover:bg-white hover:text-sage"
                        >
                          <TrashIcon className="h-4 w-4" />
                        </button>
                      </div>
                    </li>
                  );
                })}
              </ul>
            )}
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="p-6">
            <div className="flex items-start justify-between gap-3">
              <div>
                <h2 className="flex items-center gap-2 font-serif text-xl text-ink">
                  <FlameIcon className="h-5 w-5 text-sage" />
                  {streak.days} Hari Beruntun!
                </h2>
                <p className="mt-1 text-sm text-body">
                  Disiplin dan kesadaran hadir setiap hari
                </p>
              </div>
              <Pill>{streak.loggedToday ? "Aktif" : "Menunggu"}</Pill>
            </div>

            <div className="mt-5 flex items-center justify-between gap-3 rounded-lg bg-mist p-4">
              <p className="flex items-center gap-3">
                <SnowflakeIcon className="h-5 w-5 text-sage" />
                <span>
                  <span className="block text-sm font-medium text-ink">
                    Streak Freeze
                  </span>
                  <span className="block text-xs text-body">
                    Perlindungan absen otomatis
                  </span>
                </span>
              </p>
              <Pill tone="outline">{streak.freezeAvailable} / 1 Tersedia</Pill>
            </div>

            <ul className="mt-5 grid grid-cols-7 gap-1.5">
              {lastSevenDays(today).map((date) => {
                const logged = totalsOn(state, date).kcal > 0;
                const isToday = date === today;
                return (
                  <li key={date} className="text-center">
                    <span className="mb-1 block text-xs text-muted">
                      {WEEKDAYS_SHORT[fromISODate(date).getDay()][0]}
                    </span>
                    <span
                      className={cx(
                        "grid h-10 place-items-center rounded-md text-xs",
                        isToday
                          ? "bg-sage font-semibold text-white"
                          : logged
                            ? "bg-sage-soft text-sage"
                            : "bg-mist text-muted",
                      )}
                    >
                      {isToday ? fromISODate(date).getDate() : logged ? "✓" : "–"}
                    </span>
                  </li>
                );
              })}
            </ul>

            <div className="mt-5">
              <div className="flex items-baseline justify-between text-xs">
                <span className="text-body">Target Milestone Berikutnya</span>
                <span className="text-muted">{streak.daysToMilestone} hari lagi</span>
              </div>
              <ProgressBar
                className="mt-2"
                value={(streak.days / streak.nextMilestone) * 100}
                label="Progres milestone"
              />
              <p className="mt-2 text-xs text-body">
                Capai {streak.nextMilestone} hari untuk mengklaim badge prestisius:{" "}
                <span className="font-medium text-ink">
                  {streak.nextMilestone}-Day Master
                </span>
              </p>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between gap-3">
              <h2 className="font-serif text-xl text-ink">Pencapaian &amp; Medali</h2>
              <Link href="/streak" className="text-sm text-sage hover:underline">
                Lihat Semua
              </Link>
            </div>
            <ul className="mt-5 grid grid-cols-5 gap-2">
              {badges.map((badge) => {
                const unlocked = isUnlocked(badge);
                return (
                  <li key={badge.id} className="text-center">
                    <span
                      className={cx(
                        "grid h-12 w-full place-items-center rounded-lg text-lg",
                        unlocked ? "bg-sage-soft" : "bg-mist opacity-60",
                      )}
                      title={badge.description}
                    >
                      {unlocked ? badge.icon : "🔒"}
                    </span>
                    <span
                      className={cx(
                        "mt-1.5 block truncate text-[11px]",
                        unlocked ? "text-ink" : "text-muted",
                      )}
                    >
                      {badge.target} Hari
                    </span>
                  </li>
                );
              })}
            </ul>
          </Card>

          <Card className="p-6">
            <Eyebrow>Rekomendasi Camilan Sehat</Eyebrow>
            <div className="mt-4 flex gap-4">
              <span className="relative h-20 w-20 shrink-0 overflow-hidden rounded-lg bg-stone">
                <Image
                  src={PHOTOS.bowl}
                  alt="Edamame kukus dalam mangkuk keramik"
                  fill
                  sizes="80px"
                  className="object-cover"
                />
              </span>
              <div>
                <h3 className="font-serif text-lg leading-snug text-ink">
                  Kukus Edamame Garam Laut
                </h3>
                <p className="mt-1 text-sm leading-relaxed text-body">
                  Kaya isoflavon dan protein nabati ringan untuk pemulihan energi sore
                  hari tanpa lonjakan gula.
                </p>
                <p className="mt-3 flex flex-wrap items-center gap-2 text-xs">
                  <span className="text-body">120 kkal</span>
                  <Pill>11g Protein</Pill>
                </p>
              </div>
            </div>
          </Card>

          <div className="rounded-xl bg-sage-soft p-6">
            <p className="flex items-center gap-2 text-xs font-semibold tracking-[0.12em] text-sage uppercase">
              <CheckCircleIcon className="h-4 w-4" />
              Tips Siang Ini · Raifu Bot
            </p>
            <p className="mt-3 text-sm leading-relaxed text-ink/80">
              Tingkatkan asupan air mineral{" "}
              <span className="font-semibold text-ink">500ml</span> sebelum makan
              malam untuk membantu penyerapan serat makanan dan metabolisme istirahat
              yang optimal.
            </p>
            <Link
              href="/konsultasi"
              className="mt-4 inline-flex text-sm font-medium text-sage hover:underline"
            >
              Tanya Raifu Bot →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
