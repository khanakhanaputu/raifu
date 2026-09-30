"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import {
  getPushSubscriptionState,
  isPushSupported,
  subscribeToPush,
  unsubscribeFromPush,
  type PushSubscriptionState,
} from "@/lib/push-client";
import { Card, Eyebrow, IconTile, Pill, ProgressBar, buttonClass, cx, fieldClass, FieldLabel } from "@/app/components/ui";
import {
  BellIcon,
  DeviceIcon,
  DownloadIcon,
  DropletIcon,
  LeafIcon,
  LogoutIcon,
  RefreshIcon,
  ShieldIcon,
  SlidersIcon,
  SnowflakeIcon,
  UserIcon,
  CheckCircleIcon,
} from "@/app/components/icons";
import { useRaifu } from "@/lib/store";
import { mealMeta } from "@/lib/store-types";
import { levelInfo, streakInfo, targetsOf } from "@/lib/selectors";
import {
  ACTIVITY_OPTIONS,
  GOAL_OPTIONS,
  bmiCategory,
  bodyMassIndex,
  calculateTargets,
  formatNumber,
  type ActivityLevel,
  type Goal,
  type Sex,
} from "@/lib/nutrition";
import { initials } from "@/lib/text";

const SECTIONS = [
  { id: "biometri", label: "Data Diri & Biometri", icon: <UserIcon className="h-4 w-4" /> },
  { id: "target", label: "Target Nutrisi & Kalori", icon: <SlidersIcon className="h-4 w-4" /> },
  { id: "notifikasi", label: "Notifikasi & Pengingat", icon: <BellIcon className="h-4 w-4" /> },
  { id: "privasi", label: "Privasi & Keamanan", icon: <ShieldIcon className="h-4 w-4" /> },
  { id: "integrasi", label: "Integrasi & Health Hub", icon: <DeviceIcon className="h-4 w-4" /> },
];

export function ProfilView() {
  const router = useRouter();
  const supabase = useMemo(() => createClient(), []);
  const { state, today, updateProfile, toggleReminder } = useRaifu();
  const streak = streakInfo(state, today);
  const level = levelInfo(state.profile.xp);
  const savedTargets = targetsOf(state);

  const exportCsv = () => {
    const header = [
      "Tanggal",
      "Jam",
      "Jenis Makan",
      "Nama Makanan",
      "Kalori (kkal)",
      "Protein (g)",
      "Karbohidrat (g)",
      "Lemak (g)",
      "Serat (g)",
      "Sumber",
    ];
    const escapeCsv = (value: string) =>
      /[",\r\n]/.test(value) ? `"${value.replace(/"/g, '""')}"` : value;

    const rows = [...state.entries]
      .sort((a, b) => (a.date === b.date ? a.time.localeCompare(b.time) : a.date.localeCompare(b.date)))
      .map((entry) =>
        [
          entry.date,
          entry.time,
          mealMeta(entry.mealType).label,
          entry.name,
          String(entry.kcal),
          String(entry.protein),
          String(entry.carbs),
          String(entry.fat),
          String(entry.fiber),
          entry.source,
        ]
          .map(escapeCsv)
          .join(","),
      );

    const csv = "﻿" + [header.map(escapeCsv).join(","), ...rows].join("\r\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `raifu-catatan-makanan-${today}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const [pushState, setPushState] = useState<PushSubscriptionState>("idle");
  const [pushBusy, setPushBusy] = useState(false);

  useEffect(() => {
    getPushSubscriptionState().then(setPushState);
  }, []);

  const handleTogglePush = async () => {
    if (!isPushSupported()) {
      setPushState("unsupported");
      return;
    }

    setPushBusy(true);
    try {
      if (pushState === "subscribed") {
        const result = await unsubscribeFromPush();
        setPushState(result.state);
      } else {
        const vapidKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;
        if (!vapidKey) {
          setPushState("error");
          return;
        }
        const result = await subscribeToPush(vapidKey);
        setPushState(result.state);
      }
    } catch {
      setPushState("error");
    } finally {
      setPushBusy(false);
    }
  };

  const pushCopy: Record<PushSubscriptionState, string> = {
    idle: "Aktifkan Notifikasi Push",
    unsupported: "Perangkat/browser ini tidak mendukung notifikasi push",
    denied: "Izin notifikasi ditolak — aktifkan lewat pengaturan browser",
    subscribed: "Notifikasi Aktif · Matikan",
    error: "Gagal mengaktifkan — coba lagi",
  };

  const formFromProfile = () => ({
    name: state.profile.name,
    email: state.profile.email,
    sex: state.profile.sex,
    age: String(state.profile.age),
    weightKg: String(state.profile.weightKg),
    heightCm: String(state.profile.heightCm),
    startWeightKg: String(state.profile.startWeightKg),
    targetWeightKg: String(state.profile.targetWeightKg),
    activity: state.profile.activity,
    goal: state.profile.goal,
  });

  const [form, setForm] = useState(formFromProfile);
  const [status, setStatus] = useState<string | null>(null);
  const [syncedProfile, setSyncedProfile] = useState(state.profile);

  if (syncedProfile !== state.profile) {
    setSyncedProfile(state.profile);
    setForm(formFromProfile());
  }

  const numeric = {
    age: Number(form.age) || 0,
    weightKg: Number(form.weightKg) || 0,
    heightCm: Number(form.heightCm) || 0,
    startWeightKg: Number(form.startWeightKg) || 0,
    targetWeightKg: Number(form.targetWeightKg) || 0,
  };

  const previewTargets = calculateTargets({
    sex: form.sex,
    age: numeric.age,
    weightKg: numeric.weightKg,
    heightCm: numeric.heightCm,
    activity: form.activity,
    goal: form.goal,
  });

  const bmi = bodyMassIndex(numeric.weightKg, numeric.heightCm);
  const category = bmiCategory(bmi);
  const lost = numeric.startWeightKg - numeric.weightKg;
  const toGo = numeric.weightKg - numeric.targetWeightKg;

  const macroShare = {
    carbs: Math.round(((previewTargets.carbs * 4) / previewTargets.kcal) * 100),
    protein: Math.round(((previewTargets.protein * 4) / previewTargets.kcal) * 100),
    fat: Math.round(((previewTargets.fat * 9) / previewTargets.kcal) * 100),
  };

  const set = <K extends keyof typeof form>(key: K, value: (typeof form)[K]) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const handleSave = (event: React.FormEvent) => {
    event.preventDefault();
    updateProfile({
      name: form.name.trim() || state.profile.name,
      email: form.email.trim() || state.profile.email,
      sex: form.sex,
      age: numeric.age,
      weightKg: numeric.weightKg,
      heightCm: numeric.heightCm,
      startWeightKg: numeric.startWeightKg,
      targetWeightKg: numeric.targetWeightKg,
      activity: form.activity,
      goal: form.goal,
    });
    setStatus(
      `Pengaturan tersimpan. Target harian diperbarui menjadi ${formatNumber(previewTargets.kcal)} kkal.`,
    );
  };

  return (
    <form onSubmit={handleSave} className="mx-auto max-w-[1400px] px-4 py-8 sm:px-6 lg:px-8">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
        <div className="max-w-2xl">
          <h1 className="font-serif text-3xl text-ink sm:text-4xl">
            Profil &amp; Preferensi Nutrisi
          </h1>
          <p className="mt-2 flex items-center gap-2 text-sm text-muted">
            <span className="h-1.5 w-1.5 rounded-full bg-sage" />
            Pengaturan Personal · Kontemplasi &amp; Profil
          </p>
          <p className="mt-3 text-sm leading-relaxed text-body">
            Kelola data fisik, target metabolisme harian, keamanan akun, dan frekuensi
            pengingat ritual konsistensi Anda.
          </p>
        </div>

        <Card className="flex items-center gap-4 p-4">
          <span>
            <span className="block text-xs tracking-[0.14em] text-muted uppercase">
              Ritual Terjaga
            </span>
            <span className="block font-serif text-xl text-ink">
              {streak.days} Hari Penuh
            </span>
          </span>
          <IconTile shrink={false}>
            <LeafIcon className="h-5 w-5" />
          </IconTile>
        </Card>
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-[280px_1fr]">
        <aside className="space-y-5 lg:sticky lg:top-24 lg:self-start">
          <Card className="p-4">
            <Eyebrow className="px-2">Kategori Pengaturan</Eyebrow>
            <ul className="mt-3 space-y-1">
              {SECTIONS.map((section) => (
                <li key={section.id}>
                  <a
                    href={`#${section.id}`}
                    className="flex items-center gap-3 rounded-md px-3 py-2.5 text-sm text-body transition-colors hover:bg-mist hover:text-sage"
                  >
                    <span className="text-sage">{section.icon}</span>
                    {section.label}
                  </a>
                </li>
              ))}
            </ul>
          </Card>

          <Card className="p-5">
            <Eyebrow>
              Hara Hachi Bu · <span className="font-jp">腹八分目</span>
            </Eyebrow>
            <p className="mt-3 text-sm leading-relaxed text-body">
              “Makanlah hingga 80% kenyang.” Penyesuaian biometrik berkala menjamin tubuh
              tetap beroperasi dalam harmoni alami tanpa beban berlebih.
            </p>
          </Card>

          <Card className="flex items-center gap-3 p-4">
            <RefreshIcon className="h-5 w-5 shrink-0 text-sage" />
            <p className="min-w-0 flex-1">
              <span className="block text-xs text-muted">Penyimpanan Akun</span>
              <span className="block text-sm text-ink">Tersinkron ke akun Anda</span>
            </p>
            <span className="h-2 w-2 shrink-0 rounded-full bg-sage" />
          </Card>
        </aside>

        <div className="space-y-6">
          <Card className="p-6">
            <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-5">
                <span className="grid h-16 w-16 shrink-0 place-items-center rounded-xl bg-sage-soft font-serif text-xl text-sage">
                  {initials(form.name)}
                </span>
                <div>
                  <p className="flex flex-wrap items-center gap-3">
                    <span className="font-serif text-2xl text-ink">{form.name}</span>
                    <Pill>{state.profile.joinedLabel}</Pill>
                  </p>
                  <p className="mt-1 text-sm text-body">
                    {form.email} · Waktu Lokal WIB (UTC+7)
                  </p>
                  <p className="mt-2 flex flex-wrap items-center gap-3 text-sm">
                    <span className="flex items-center gap-1.5 text-ink">
                      <LeafIcon className="h-4 w-4 text-sage" />
                      Tingkat {level.level}: {level.name}
                    </span>
                    <span className="text-muted tabular-nums">
                      {level.progress} / 1000 XP
                    </span>
                  </p>
                </div>
              </div>

              <p className="flex items-center gap-2 text-sm text-body">
                <SnowflakeIcon className="h-4 w-4 text-sage" />
                {streak.freezeAvailable} Jatah Streak Freeze Tersedia
              </p>
            </div>

            <div className="mt-6">
              <p className="flex items-center justify-between text-xs">
                <span className="text-body">
                  Progres Level Menuju &lsquo;{level.nextName}&rsquo;
                </span>
                <span className="text-muted">
                  {level.toNext} XP lagi untuk naik tingkat
                </span>
              </p>
              <ProgressBar className="mt-2" value={(level.progress / 1000) * 100} />
            </div>
          </Card>

          <Card id="biometri" className="scroll-mt-24 p-6">
            <div className="flex flex-wrap items-baseline justify-between gap-3">
              <div>
                <h2 className="font-serif text-xl text-ink">
                  01 · Biometrik Dasar: Data Fisik &amp; Tubuh
                </h2>
              </div>
              <Pill tone="neutral">
                {lost >= 0
                  ? `Turun ${lost.toFixed(1)} kg sejak awal`
                  : `Naik ${Math.abs(lost).toFixed(1)} kg sejak awal`}
              </Pill>
            </div>

            <div className="mt-6 grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
              <div>
                <FieldLabel htmlFor="nama">Nama Lengkap</FieldLabel>
                <input
                  id="nama"
                  value={form.name}
                  onChange={(event) => set("name", event.target.value)}
                  className={fieldClass}
                />
              </div>
              <div>
                <FieldLabel htmlFor="surel">Alamat Surel</FieldLabel>
                <input
                  id="surel"
                  type="email"
                  value={form.email}
                  onChange={(event) => set("email", event.target.value)}
                  className={fieldClass}
                />
              </div>
              <div>
                <FieldLabel htmlFor="usia">Usia (Tahun)</FieldLabel>
                <input
                  id="usia"
                  type="number"
                  min={13}
                  max={90}
                  value={form.age}
                  onChange={(event) => set("age", event.target.value)}
                  className={fieldClass}
                />
              </div>

              <div>
                <FieldLabel htmlFor="berat-awal">Berat Badan Awal (kg)</FieldLabel>
                <input
                  id="berat-awal"
                  type="number"
                  min={30}
                  max={250}
                  step="0.1"
                  value={form.startWeightKg}
                  onChange={(event) => set("startWeightKg", event.target.value)}
                  className={fieldClass}
                />
              </div>
              <div>
                <FieldLabel htmlFor="berat-kini">Berat Saat Ini (kg)</FieldLabel>
                <input
                  id="berat-kini"
                  type="number"
                  min={30}
                  max={250}
                  step="0.1"
                  value={form.weightKg}
                  onChange={(event) => set("weightKg", event.target.value)}
                  className={fieldClass}
                />
              </div>
              <div>
                <FieldLabel htmlFor="berat-target">Berat Sasaran (kg)</FieldLabel>
                <input
                  id="berat-target"
                  type="number"
                  min={30}
                  max={250}
                  step="0.1"
                  value={form.targetWeightKg}
                  onChange={(event) => set("targetWeightKg", event.target.value)}
                  className={fieldClass}
                />
                <p className="mt-1.5 text-xs text-muted">
                  {toGo > 0
                    ? `Sisa ${toGo.toFixed(1)} kg menuju target stabil`
                    : "Berat sasaran sudah tercapai"}
                </p>
              </div>

              <div>
                <FieldLabel htmlFor="tinggi">Tinggi Badan (cm)</FieldLabel>
                <input
                  id="tinggi"
                  type="number"
                  min={120}
                  max={230}
                  value={form.heightCm}
                  onChange={(event) => set("heightCm", event.target.value)}
                  className={fieldClass}
                />
                <p className="mt-1.5 text-xs text-muted">
                  Digunakan untuk kalkulasi basal BMR
                </p>
              </div>

              <div>
                <FieldLabel htmlFor="kelamin">Jenis Kelamin Biologis</FieldLabel>
                <select
                  id="kelamin"
                  value={form.sex}
                  onChange={(event) => set("sex", event.target.value as Sex)}
                  className={fieldClass}
                >
                  <option value="wanita">Wanita</option>
                  <option value="pria">Pria</option>
                  <option value="lainnya">Lainnya / Rerata</option>
                </select>
                <p className="mt-1.5 text-xs text-muted">Data biologis metabolisme</p>
              </div>

              <div className="rounded-lg bg-sage-soft p-4">
                <p className="flex items-center justify-between text-xs">
                  <span className="tracking-[0.1em] text-sage uppercase">
                    IMT Kalkulasi
                  </span>
                  <Pill tone="solid">{category.label}</Pill>
                </p>
                <p className="mt-2 flex items-baseline gap-2">
                  <span className="font-serif text-3xl text-ink tabular-nums">
                    {bmi.toFixed(1)}
                  </span>
                  <span className="text-xs text-body">kg/m² (Normal 18.5 – 22.9)</span>
                </p>
                <p className="mt-1 text-xs text-ink/70">
                  Kategori sehat standar WHO Asia Pasifik
                </p>
              </div>
            </div>
          </Card>

          <Card id="target" className="scroll-mt-24 p-6">
            <div className="flex flex-wrap items-baseline justify-between gap-3">
              <div>
                <h2 className="font-serif text-xl text-ink">
                  02 · Metabolisme &amp; Nutrisi: Target Gizi &amp; Niat Sehat
                </h2>
              </div>
              <p className="text-xs text-muted">Formula Keseimbangan Raifu</p>
            </div>

            <div className="mt-6 grid gap-5 lg:grid-cols-2">
              <div>
                <FieldLabel htmlFor="niat">Niat Nutrisi Utama</FieldLabel>
                <select
                  id="niat"
                  value={form.goal}
                  onChange={(event) => set("goal", event.target.value as Goal)}
                  className={fieldClass}
                >
                  {GOAL_OPTIONS.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <FieldLabel htmlFor="aktivitas">Ritme Aktivitas Harian</FieldLabel>
                <select
                  id="aktivitas"
                  value={form.activity}
                  onChange={(event) => set("activity", event.target.value as ActivityLevel)}
                  className={fieldClass}
                >
                  {ACTIVITY_OPTIONS.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label} — {option.description}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              <div className="flex items-center justify-between gap-4 rounded-lg bg-mist p-5">
                <p>
                  <span className="block text-xs tracking-[0.1em] text-muted uppercase">
                    Alokasi Kalori Harian
                  </span>
                  <span className="mt-1 flex items-baseline gap-1.5">
                    <span className="font-serif text-2xl text-ink tabular-nums">
                      {formatNumber(previewTargets.kcal)}
                    </span>
                    <span className="text-xs text-body">kkal / hari</span>
                  </span>
                  <span className="mt-1 block text-xs text-sage">
                    BMR: {formatNumber(previewTargets.bmr)} kkal + aktivitas
                  </span>
                </p>
                <IconTile tone="white">
                  <LeafIcon className="h-5 w-5" />
                </IconTile>
              </div>

              <div className="flex items-center justify-between gap-4 rounded-lg bg-mist p-5">
                <p>
                  <span className="block text-xs tracking-[0.1em] text-muted uppercase">
                    Target Hidrasi Berkala
                  </span>
                  <span className="mt-1 flex items-baseline gap-1.5">
                    <span className="font-serif text-2xl text-ink tabular-nums">
                      {formatNumber(previewTargets.waterMl)}
                    </span>
                    <span className="text-xs text-body">ml / hari</span>
                  </span>
                  <span className="mt-1 block text-xs text-sage">
                    Setara {Math.round(previewTargets.waterMl / 250)} cangkir air mineral
                  </span>
                </p>
                <IconTile tone="white">
                  <DropletIcon className="h-5 w-5" />
                </IconTile>
              </div>
            </div>

            <div className="mt-6">
              <p className="flex items-baseline justify-between text-xs">
                <span className="tracking-[0.1em] text-muted uppercase">
                  Komposisi Makronutrisi Harian
                </span>
                <span className="text-body">Total 100% Terdistribusi</span>
              </p>
              <div className="mt-3 flex h-2 overflow-hidden rounded-full bg-stone">
                <span className="bg-sage" style={{ width: `${macroShare.carbs}%` }} />
                <span className="bg-sage/60" style={{ width: `${macroShare.protein}%` }} />
                <span className="bg-sage/30" style={{ width: `${macroShare.fat}%` }} />
              </div>

              <ul className="mt-4 grid gap-3 sm:grid-cols-3">
                {[
                  {
                    label: `Karbohidrat (${macroShare.carbs}%)`,
                    value: previewTargets.carbs,
                    note: "Nasi merah, soba",
                    dot: "bg-sage",
                  },
                  {
                    label: `Protein (${macroShare.protein}%)`,
                    value: previewTargets.protein,
                    note: "Ikan kembung, tahu",
                    dot: "bg-sage/60",
                  },
                  {
                    label: `Lemak Sehat (${macroShare.fat}%)`,
                    value: previewTargets.fat,
                    note: "Wijen, zaitun, biji",
                    dot: "bg-sage/30",
                  },
                ].map((macro) => (
                  <li key={macro.label} className="rounded-lg bg-mist p-4">
                    <p className="flex items-center gap-2 text-xs text-body">
                      <span className={cx("h-2 w-2 rounded-full", macro.dot)} />
                      {macro.label}
                    </p>
                    <p className="mt-1.5 text-sm text-ink">
                      <span className="font-serif text-lg tabular-nums">
                        {macro.value} g
                      </span>
                      <span className="text-xs text-body"> · {macro.note}</span>
                    </p>
                  </li>
                ))}
              </ul>
            </div>
          </Card>

          <Card id="notifikasi" className="scroll-mt-24 p-6">
            <div className="flex flex-wrap items-baseline justify-between gap-3">
              <div>
                <h2 className="font-serif text-xl text-ink">
                  03 · Ritual Harian &amp; Disiplin: Notifikasi &amp; Pengingat
                </h2>
              </div>
              <p className="text-xs text-muted">Disampaikan Santun Tanpa Nada Keras</p>
            </div>

            <button
              type="button"
              disabled={pushBusy || pushState === "unsupported"}
              onClick={handleTogglePush}
              className={cx(
                "mt-5 rounded-lg px-4 py-2.5 text-sm font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-60",
                pushState === "subscribed"
                  ? "bg-sage-soft text-sage"
                  : "bg-sage text-white hover:bg-sage/90",
              )}
            >
              {pushCopy[pushState]}
            </button>

            <ul className="mt-6 space-y-3">
              {state.reminders.map((reminder) => (
                <li
                  key={reminder.id}
                  className={cx(
                    "flex items-center justify-between gap-5 rounded-lg p-4",
                    reminder.enabled ? "bg-sage-soft/60" : "bg-mist",
                  )}
                >
                  <div className="min-w-0">
                    <p className="flex flex-wrap items-center gap-3">
                      <span className="text-sm font-medium text-ink">
                        {reminder.label}
                      </span>
                      <Pill tone="outline">{reminder.time}</Pill>
                    </p>
                    <p className="mt-1 text-xs leading-relaxed text-body">
                      {reminder.description}
                    </p>
                  </div>

                  <button
                    type="button"
                    role="switch"
                    aria-checked={reminder.enabled}
                    aria-label={`Aktifkan ${reminder.label}`}
                    onClick={() => toggleReminder(reminder.id)}
                    className={cx(
                      "relative h-6 w-11 shrink-0 rounded-full transition-colors",
                      reminder.enabled ? "bg-sage" : "bg-stone",
                    )}
                  >
                    <span
                      className={cx(
                        "absolute top-0.5 h-5 w-5 rounded-full bg-white transition-all",
                        reminder.enabled ? "left-[22px]" : "left-0.5",
                      )}
                    />
                  </button>
                </li>
              ))}
            </ul>
          </Card>

          <div className="grid gap-6 lg:grid-cols-2">
            <Card id="privasi" className="scroll-mt-24 p-6">
              <h2 className="font-serif text-xl text-ink">
                04 · Privasi &amp; Keamanan: Kendali Data Pribadi
              </h2>
              <ul className="mt-5 space-y-3 text-sm leading-relaxed text-body">
                <li className="flex gap-3">
                  <ShieldIcon className="mt-0.5 h-4 w-4 shrink-0 text-sage" />
                  Seluruh catatan nutrisi tersimpan aman di akun Anda, tanpa pelacak
                  iklan komersial.
                </li>
                <li className="flex gap-3">
                  <ShieldIcon className="mt-0.5 h-4 w-4 shrink-0 text-sage" />
                  Foto makanan hanya dikirim ke model AI untuk dianalisis, tidak pernah
                  disimpan di server kami.
                </li>
              </ul>
              <button
                type="button"
                onClick={async () => {
                  await supabase.auth.signOut();
                  router.push("/masuk");
                }}
                className={buttonClass("secondary", "mt-5")}
              >
                <LogoutIcon className="h-4 w-4" />
                Keluar
              </button>
            </Card>

            <Card id="integrasi" className="scroll-mt-24 p-6">
              <h2 className="font-serif text-xl text-ink">
                05 · Integrasi &amp; Health Hub: Perangkat Terhubung
              </h2>
              <ul className="mt-5 space-y-3">
                <li className="flex flex-wrap items-center justify-between gap-4 rounded-lg bg-mist p-4">
                  <span>
                    <span className="flex items-center gap-3 text-sm text-ink">
                      <DownloadIcon className="h-4 w-4 text-sage" />
                      Ekspor Catatan Makanan (CSV)
                    </span>
                    <span className="mt-1 block pl-7 text-xs text-body">
                      {state.entries.length} catatan siap diunduh
                    </span>
                  </span>
                  <button
                    type="button"
                    onClick={exportCsv}
                    disabled={state.entries.length === 0}
                    className={buttonClass("secondary")}
                  >
                    <DownloadIcon className="h-4 w-4" />
                    Unduh CSV
                  </button>
                </li>
                {[
                  { name: "Apple Health / Google Fit" },
                  { name: "Timbangan Pintar Bluetooth" },
                ].map((item) => (
                  <li
                    key={item.name}
                    className="flex items-center justify-between gap-4 rounded-lg bg-mist p-4"
                  >
                    <span className="flex items-center gap-3 text-sm text-ink">
                      <DeviceIcon className="h-4 w-4 text-sage" />
                      {item.name}
                    </span>
                    <Pill tone="outline">Segera Hadir</Pill>
                  </li>
                ))}
              </ul>
            </Card>
          </div>

          <Card className="flex flex-col gap-5 p-6 lg:flex-row lg:items-center lg:justify-between">
            <p className="flex items-start gap-3 text-xs leading-relaxed text-body">
              <CheckCircleIcon className="mt-0.5 h-4 w-4 shrink-0 text-sage" />
              Semua kalkulasi makro disesuaikan otomatis saat data fisik disimpan. Target
              harian sekarang: {formatNumber(savedTargets.kcal)} kkal.
            </p>
            <div className="flex flex-wrap gap-3">
              <button
                type="button"
                onClick={() => {
                  setForm(formFromProfile());
                  setStatus(null);
                }}
                className={buttonClass("secondary")}
              >
                Batalkan Perubahan
              </button>
              <button type="submit" className={buttonClass("primary")}>
                <CheckCircleIcon className="h-4 w-4" />
                Simpan Perubahan Pengaturan
              </button>
            </div>
          </Card>

          {status && (
            <p
              role="status"
              className="rounded-lg bg-sage-soft px-4 py-3 text-sm text-sage"
            >
              {status}
            </p>
          )}
        </div>
      </div>
    </form>
  );
}
