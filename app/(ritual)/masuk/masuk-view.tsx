"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Card, Pill, buttonClass, cx, fieldClass, FieldLabel } from "@/app/components/ui";
import {
  ArrowRightIcon,
  EyeIcon,
  LeafIcon,
  MailIcon,
  ShieldIcon,
  StarIcon,
} from "@/app/components/icons";
import { PHOTOS } from "@/lib/content";

type Tab = "masuk" | "daftar";

const TREND = [38, 34, 36, 30, 32, 26, 28, 22, 24, 18, 20, 14, 16, 10];

export function MasukView() {
  const router = useRouter();
  const [tab, setTab] = useState<Tab>("masuk");
  const [showPassword, setShowPassword] = useState(false);
  const [values, setValues] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  const set = (key: keyof typeof values) => (value: string) =>
    setValues((prev) => ({ ...prev, [key]: value }));

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);

    if (tab === "daftar" && values.name.trim().length < 3) {
      setError("Nama lengkap minimal 3 karakter.");
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)) {
      setError("Masukkan alamat surel yang valid.");
      return;
    }
    if (values.password.length < 8) {
      setError("Kata sandi minimal 8 karakter sadar.");
      return;
    }

    setPending(true);
    router.push(tab === "daftar" ? "/onboarding" : "/dashboard");
  };

  return (
    <div className="mx-auto max-w-[1400px] px-4 py-8 sm:px-6 lg:px-8">
      <div className="grid gap-6 lg:grid-cols-[1.15fr_1fr] lg:gap-10">
        <section className="rounded-2xl bg-mist p-6 sm:p-10">
          <Pill className="bg-white">
            <span className="h-1.5 w-1.5 rounded-full bg-sage" />
            Ruang Hening · <span className="font-jp">静寂</span>
          </Pill>

          <h1 className="mt-6 font-serif text-3xl leading-tight text-ink sm:text-4xl lg:text-5xl">
            Makan dengan <span className="text-sage">Kesadaran</span>,<br />
            Hidup dengan Ketenangan.
          </h1>
          <p className="mt-5 max-w-xl text-sm leading-relaxed text-body sm:text-base">
            Kembali ke ritme alami tubuhmu. Melacak nutrisi dan kebiasaan harian tanpa
            kecemasan angka kalori berlebih, dirancang dengan kesederhanaan tradisi
            mindfulness Jepang.
          </p>

          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            <div className="relative aspect-[4/3] overflow-hidden rounded-xl bg-stone">
              <Image
                src={PHOTOS.salmonBoard}
                alt="Meja kayu dengan sajian tenang dan secangkir teh"
                fill
                sizes="(min-width: 640px) 320px, 100vw"
                className="object-cover"
                priority
              />
              <span className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-ink/80 to-transparent p-4">
                <span className="block text-xs tracking-[0.14em] text-white/70 uppercase">
                  Ritual Pagi
                </span>
                <span className="mt-1 block font-serif text-lg text-white">
                  Secangkir Sencha &amp; Fokus
                </span>
              </span>
            </div>

            <Card className="flex flex-col p-5">
              <p className="flex items-center gap-2 text-xs font-medium tracking-[0.12em] text-sage uppercase">
                <LeafIcon className="h-4 w-4" />
                Filosofi Okinawa
              </p>
              <h2 className="mt-3 font-serif text-lg leading-snug text-ink">
                <span className="font-jp">腹八分目</span> (Hara Hachi Bu)
              </h2>
              <p className="mt-3 flex-1 text-sm leading-relaxed text-body italic">
                “Makanlah hingga delapan puluh persen kenyang.” Memberi ruang bagi
                pencernaan dan napas untuk bergerak secara selaras dengan alam semesta.
              </p>
              <p className="mt-4 flex items-center justify-between border-t border-line pt-4 text-xs">
                <span className="tracking-[0.1em] text-muted uppercase">Harmoni Raga</span>
                <span className="font-medium text-ink">80% Kapasitas</span>
              </p>
            </Card>
          </div>

          <Card className="mt-4 p-5">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="text-xs tracking-[0.12em] text-muted uppercase">
                  Ritme Kesadaran Kolektif
                </p>
                <h2 className="mt-2 font-serif text-xl text-ink">
                  Keseimbangan 30 Hari Tanpa Stres
                </h2>
              </div>
              <p className="text-right">
                <span className="block font-serif text-2xl text-sage">98.4%</span>
                <span className="block text-xs text-muted">Kepuasan Batin</span>
              </p>
            </div>

            <svg
              viewBox="0 0 280 60"
              role="img"
              aria-label="Grafik tren ketenangan selama 30 hari"
              className="mt-5 h-20 w-full"
              preserveAspectRatio="none"
            >
              <polyline
                points={TREND.map((value, index) => `${(index / (TREND.length - 1)) * 280},${value}`).join(" ")}
                fill="none"
                stroke="var(--color-sage)"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                vectorEffect="non-scaling-stroke"
              />
              {[0, 6, 13].map((index) => (
                <circle
                  key={index}
                  cx={(index / (TREND.length - 1)) * 280}
                  cy={TREND[index]}
                  r="2.5"
                  fill="var(--color-sage)"
                />
              ))}
            </svg>

            <p className="mt-3 flex justify-between text-xs text-muted">
              <span>Hari 1: Awal Niat</span>
              <span>Hari 15: Ritme Lembut</span>
              <span>Hari 30: Kebiasaan Abadi</span>
            </p>
          </Card>

          <Card className="mt-4 bg-white/70 p-5">
            <p className="flex items-center gap-3">
              <span className="flex gap-0.5 text-sage" aria-label="Penilaian 5 dari 5">
                {Array.from({ length: 5 }).map((_, index) => (
                  <StarIcon key={index} className="h-3.5 w-3.5" />
                ))}
              </span>
              <span className="text-xs tracking-[0.1em] text-muted uppercase">
                30 Hari Konsisten
              </span>
            </p>
            <blockquote className="mt-3 text-sm leading-relaxed text-body italic">
              “Raifu mengubah cara pandangku terhadap makanan. Bukan lagi tentang
              menghitung gramase dengan cemas, melainkan mendengarkan sinyal tubuh dengan
              tenang.”
            </blockquote>
            <p className="mt-3 text-xs text-muted">
              Nadia A. — Praktisi Desain, Jakarta
            </p>
          </Card>
        </section>

        <section className="lg:pt-10">
          <Card className="p-6 sm:p-8">
            <div
              role="tablist"
              aria-label="Pilihan autentikasi"
              className="grid grid-cols-2 rounded-md bg-mist p-1"
            >
              {(
                [
                  { value: "masuk", label: "Masuk" },
                  { value: "daftar", label: "Daftar Akun Baru" },
                ] as const
              ).map((item) => (
                <button
                  key={item.value}
                  role="tab"
                  type="button"
                  aria-selected={tab === item.value}
                  onClick={() => {
                    setTab(item.value);
                    setError(null);
                  }}
                  className={cx(
                    "rounded px-4 py-2.5 text-sm tracking-[0.06em] uppercase transition-colors",
                    tab === item.value
                      ? "bg-white font-medium text-ink shadow-sm"
                      : "text-body hover:text-sage",
                  )}
                >
                  {item.label}
                </button>
              ))}
            </div>

            <h2 className="mt-7 font-serif text-2xl text-ink sm:text-3xl">
              {tab === "masuk" ? "Selamat Datang Kembali" : "Mulai Perjalanan Sadar"}
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-body">
              {tab === "masuk"
                ? "Lanjutkan perjalanan hidup sadar dan pencatatan penuh perhatian."
                : "Buat akun gratis, lalu susun target nutrisi personal dalam tiga langkah singkat."}
            </p>

            <div className="mt-6 grid grid-cols-2 gap-3">
              <button type="button" className={buttonClass("ghost")}>
                <span aria-hidden className="font-serif text-base text-sage">G</span>
                Google
              </button>
              <button type="button" className={buttonClass("ghost")}>
                <span aria-hidden className="text-base"></span>
                Apple ID
              </button>
            </div>

            <p className="my-6 flex items-center gap-4 text-xs tracking-[0.12em] text-muted uppercase">
              <span className="h-px flex-1 bg-line" />
              atau lanjutkan dengan surel
              <span className="h-px flex-1 bg-line" />
            </p>

            <form onSubmit={handleSubmit} noValidate className="space-y-4">
              {tab === "daftar" && (
                <div>
                  <FieldLabel htmlFor="nama-lengkap">Nama Lengkap</FieldLabel>
                  <input
                    id="nama-lengkap"
                    value={values.name}
                    onChange={(event) => set("name")(event.target.value)}
                    placeholder="Nama panggilan Anda"
                    className={fieldClass}
                  />
                </div>
              )}

              <div>
                <FieldLabel htmlFor="email">Alamat Surel</FieldLabel>
                <div className="relative">
                  <input
                    id="email"
                    type="email"
                    autoComplete="email"
                    value={values.email}
                    onChange={(event) => set("email")(event.target.value)}
                    placeholder="nama@raifu.id"
                    className={cx(fieldClass, "bg-mist pr-11")}
                  />
                  <MailIcon className="pointer-events-none absolute top-1/2 right-3.5 h-4 w-4 -translate-y-1/2 text-muted" />
                </div>
              </div>

              <div>
                <FieldLabel
                  htmlFor="sandi"
                  hint={
                    tab === "masuk" ? (
                      <button
                        type="button"
                        className="text-xs text-sage hover:underline"
                      >
                        Lupa Kata Sandi?
                      </button>
                    ) : undefined
                  }
                >
                  Kata Sandi
                </FieldLabel>
                <div className="relative">
                  <input
                    id="sandi"
                    type={showPassword ? "text" : "password"}
                    autoComplete={tab === "masuk" ? "current-password" : "new-password"}
                    value={values.password}
                    onChange={(event) => set("password")(event.target.value)}
                    placeholder="Minimal 8 karakter sadar"
                    className={cx(fieldClass, "bg-mist pr-11")}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((value) => !value)}
                    aria-label={showPassword ? "Sembunyikan kata sandi" : "Tampilkan kata sandi"}
                    className="absolute top-1/2 right-3 -translate-y-1/2 text-muted transition-colors hover:text-sage"
                  >
                    <EyeIcon className="h-4 w-4" />
                  </button>
                </div>
              </div>

              <label className="flex items-center gap-3 text-sm text-body">
                <input
                  type="checkbox"
                  defaultChecked
                  className="h-4 w-4 accent-[var(--color-sage)]"
                />
                {tab === "masuk"
                  ? "Ingat saya di perangkat ini"
                  : "Saya menyetujui ketentuan layanan Raifu"}
              </label>

              {error && (
                <p role="alert" className="rounded-md bg-mist px-3 py-2 text-xs text-ink">
                  {error}
                </p>
              )}

              <button
                type="submit"
                disabled={pending}
                className={buttonClass("primary", "w-full py-3.5 font-serif text-base")}
              >
                {tab === "masuk" ? "Masuk ke Raifu" : "Buat Akun & Lanjutkan"}
                <ArrowRightIcon className="h-4 w-4" />
              </button>
            </form>

            <p className="mt-6 flex items-start gap-3 text-xs leading-relaxed text-muted">
              <ShieldIcon className="mt-0.5 h-4 w-4 shrink-0 text-sage" />
              Enkripsi 256-bit standar medis · Privasi tanpa pelacak iklan komersial.
              Prototipe ini menyimpan data hanya di perangkat Anda.
            </p>
          </Card>
        </section>
      </div>
    </div>
  );
}
