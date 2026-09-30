import Image from "next/image";
import Link from "next/link";
import { SiteNav } from "./components/site-nav";
import { SiteFooter } from "./components/site-footer";
import { NutritionCalculator } from "./components/nutrition-calculator";
import {
  ArrowRightIcon,
  BowlIcon,
  CheckCircleIcon,
  FlameIcon,
  JournalIcon,
  LeafIcon,
  SaveIcon,
  ScanIcon,
  StarIcon,
} from "./components/icons";
import { initials } from "@/lib/text";

const HERO_STATS = [
  { value: "Instan", label: "Estimasi Nutrisi" },
  { value: "14+ Hari", label: "Rerata Streak Pemula" },
  { value: "10.000+", label: "Menu Terverifikasi" },
];

const ORDINAL_KANJI = ["壱", "弐", "参", "肆"];

const FEATURES = [
  {
    icon: ScanIcon,
    title: "AI Nutrition Scanner",
    description:
      "Cukup arahkan kamera ke hidanganmu. Raifu mengenali kandungan makronutrisi, perkiraan gramatur, dan indeks glikemik seketika.",
    note: "Presisi Instan",
  },
  {
    icon: FlameIcon,
    title: "Streak & Gamification",
    description:
      "Pertahankan konsistensi harian dengan ritual lembut. Raih medali kearifan, gunakan Streak Freeze saat liburan, dan rayakan kemajuan kecil.",
    note: "Motivasi Tanpa Stres",
  },
  {
    icon: JournalIcon,
    title: "Mindful Daily Log",
    description:
      "Jurnal visual minimalis yang mencatat bukan hanya kalori, tetapi juga tingkat energi, suasana hati, dan pola hidrasi tubuh setiap saat.",
    note: "Jurnal Berirama",
  },
  {
    icon: BowlIcon,
    title: "Menu Sehat Terkurasi",
    description:
      "Rekomendasi sajian seimbang berdasarkan bahan lokal dan filosofi masakan Jepang sehat: probiotik alami, tinggi serat, rendah sodium.",
    note: "Resep Teruji",
  },
];

const PHILOSOPHY_POINTS = [
  {
    title: "Bebas Rasa Bersalah (No Guilt Tracking)",
    description:
      "Tidak ada makanan “buruk”. Yang ada adalah kesadaran akan keseimbangan dalam ritme mingguan.",
  },
  {
    title: "Data Terstruktur, Pikiran Lapang",
    description:
      "AI kami mengambil beban kalkulasi sehingga Anda dapat menikmati setiap suapan dengan tenang.",
  },
];

const TESTIMONIALS = [
  {
    quote:
      "Aplikasi nutrisi pertama yang tidak membuat saya merasa cemas jika melebihi kuota 50 kalori. Desainnya sangat tenang dan foto scanner-nya sangat praktis.",
    name: "Anisa Saraswati",
    role: "Penggiat Mindfulness, Jakarta",
  },
  {
    quote:
      "Pendekatan Hara Hachi Bu di Raifu bikin saya berhenti overeating tanpa harus maksa diri diet ketat. Rasanya lebih seperti kebiasaan, bukan aturan.",
    name: "Kenji Pramana",
    role: "Pengguna Aktif, Bandung",
  },
  {
    quote:
      "Streak 30 hari pertama saya! Fitur freeze-nya sangat menyelamatkan saat dinas keluar kota tanpa harus merasa gagal menjaga pola makan.",
    name: "Reza Maulana",
    role: "Product Designer, Surabaya",
  },
];

const MACROS = [
  { label: "Protein", value: "34g", percent: 72 },
  { label: "Karbo", value: "42g", percent: 54 },
  { label: "Lemak Sehat", value: "18g", percent: 61 },
];

export default function Home() {
  return (
    <>
      <SiteNav />

      <main id="main-content" className="flex-1">
        <Hero />
        <Features />
        <Calculator />
        <Philosophy />
        <Testimonials />
        <FinalCta />
      </main>

      <SiteFooter />
    </>
  );
}

function Hero() {
  return (
    <section className="bg-cream">
      <div className="mx-auto grid max-w-7xl items-center gap-12 px-4 py-16 sm:px-6 lg:grid-cols-2 lg:gap-16 lg:px-10 lg:py-24">
        <div>
          <h1 className="font-serif text-4xl leading-[1.15] text-ink sm:text-5xl lg:text-[3.4rem]">
            Bangun Kebiasaan Sehat Setiap Hari Bersama{" "}
            <em className="text-sage italic">Raifu.</em>
          </h1>

          <p className="mt-6 max-w-xl text-base leading-relaxed text-body">
            Harmoni antara kearifan mindful eating ala Jepang dan kecerdasan AI.
            Pantau nutrisi harian secara presisi, pertahankan konsistensi streak
            tanpa beban rasa cemas.
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-3">
            <Link
              href="/masuk"
              className="inline-flex items-center gap-2 rounded-md bg-sage px-5 py-3 text-sm font-medium text-white transition-colors hover:bg-sage-dark"
            >
              Mulai Sekarang
              <ArrowRightIcon className="h-4 w-4" />
            </Link>
            <a
              href="#fitur"
              className="inline-flex items-center gap-2 rounded-md border border-line bg-white px-5 py-3 text-sm font-medium text-ink transition-colors hover:border-sage hover:text-sage"
            >
              Pelajari Fitur
              <CheckCircleIcon className="h-4 w-4" />
            </a>
          </div>

          <dl className="mt-12 grid max-w-lg grid-cols-3 gap-6">
            {HERO_STATS.map((stat) => (
              <div key={stat.label}>
                <dt className="sr-only">{stat.label}</dt>
                <dd>
                  <span className="block font-serif text-2xl text-ink">
                    {stat.value}
                  </span>
                  <span className="mt-1 block text-xs text-muted">
                    {stat.label}
                  </span>
                </dd>
              </div>
            ))}
          </dl>
        </div>

        <ScanPreviewCard />
      </div>
    </section>
  );
}

function ScanPreviewCard() {
  return (
    <div className="relative">
      <span className="absolute -top-4 right-2 z-10 inline-flex items-center gap-1.5 rounded-full border border-line bg-sage-soft px-3.5 py-2 text-xs font-semibold tracking-[0.08em] text-sage uppercase">
        <LeafIcon className="h-3.5 w-3.5" />
        14 Hari Streak
      </span>

      <figure className="rounded-2xl bg-white p-5 shadow-[0_24px_60px_-30px_rgba(28,27,27,0.35)] sm:p-6">
        <figcaption className="flex items-center gap-3">
          <span className="text-xs font-medium tracking-[0.18em] text-muted uppercase">
            Pindai Makanan
          </span>
          <span className="rounded-md bg-mist px-2.5 py-1 text-xs text-ink">
            Pratinjau Estimasi
          </span>
          <SaveIcon className="ml-auto h-5 w-5 text-sage" />
        </figcaption>

        <div className="relative mt-4 aspect-[4/3] overflow-hidden rounded-lg bg-stone">
          <Image
            src="https://images.unsplash.com/photo-1498654896293-37aacf113fd9?auto=format&fit=crop&w=1100&q=70"
            alt="Satu set hidangan seimbang di atas meja kayu, siap dipindai oleh Raifu"
            fill
            sizes="(min-width: 1024px) 560px, 100vw"
            className="object-cover"
            priority
          />

          <span className="absolute top-4 left-4 rounded-md bg-sage/85 px-3 py-1.5 text-xs text-white backdrop-blur-sm">
            Contoh Ilustrasi
          </span>

          <span
            aria-hidden
            className="absolute inset-x-6 top-1/2 h-px bg-white/80"
          />

          <span className="absolute right-4 bottom-4 rounded-md bg-sage/85 px-3 py-1.5 text-xs text-white backdrop-blur-sm">
            Hara Hachi Bu: 80% Kenyang
          </span>
        </div>

        <p className="mt-4 flex items-baseline justify-between gap-2 text-xs text-muted">
          <span>Salmon Teishoku Plate</span>
          <span>Porsi Terukur: ~240g</span>
        </p>

        <div className="mt-5 flex flex-wrap items-baseline justify-between gap-2">
          <p className="flex items-baseline gap-1.5">
            <span className="font-serif text-3xl text-ink tabular-nums">512</span>
            <span className="text-sm text-muted">kkal Total</span>
          </p>
          <p className="text-sm font-medium text-sage">Keseimbangan Sempurna</p>
        </div>

        <ul className="mt-4 grid gap-3 sm:grid-cols-3">
          {MACROS.map((macro) => (
            <li key={macro.label} className="rounded-lg bg-mist p-3.5">
              <p className="text-xs text-muted">{macro.label}</p>
              <p className="mt-1 text-sm font-semibold text-ink tabular-nums">
                {macro.value}
              </p>
              <span
                aria-hidden
                className="mt-2.5 block h-1.5 overflow-hidden rounded-full bg-sage-soft"
              >
                <span
                  className="block h-full rounded-full bg-sage"
                  style={{ width: `${macro.percent}%` }}
                />
              </span>
            </li>
          ))}
        </ul>

        <p className="mt-4 flex items-center justify-center gap-2 rounded-lg bg-stone py-3 text-sm font-medium text-ink">
          <CheckCircleIcon className="h-4 w-4" />
          Simpan ke Jurnal Pagi Ini
        </p>
      </figure>
    </div>
  );
}

function Features() {
  return (
    <section id="fitur" className="border-y border-line bg-mist">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-10 lg:py-20">
        <div className="grid gap-6 lg:grid-cols-[1.4fr_1fr] lg:items-end">
          <h2 className="max-w-2xl font-serif text-3xl leading-snug text-ink sm:text-4xl">
            Dirancang untuk Kesadaran Tubuh &amp; Ketenteraman Hati
          </h2>
          <p className="max-w-sm text-sm leading-relaxed text-body lg:pb-2">
            Fokus pada esensi nutrisi tanpa obsesi angka yang berlebihan,
            didukung algoritma cerdas yang intuitif.
          </p>
        </div>

        <ul className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {FEATURES.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <li
                key={feature.title}
                className="flex flex-col rounded-xl border border-line bg-white p-6 transition-colors hover:border-sage/40"
              >
                <div className="flex items-baseline gap-3">
                  <span
                    aria-hidden
                    className="font-serif text-3xl leading-none text-sage/60 tabular-nums"
                  >
                    {ORDINAL_KANJI[index]}
                  </span>
                  <h3 className="font-serif text-lg text-ink">{feature.title}</h3>
                </div>
                <p className="mt-3 text-sm leading-relaxed text-body">
                  {feature.description}
                </p>
                <p className="mt-6 flex items-center gap-2 border-t border-line pt-4 text-xs tracking-[0.12em] text-muted uppercase">
                  <Icon className="h-3.5 w-3.5 text-sage" />
                  {feature.note}
                </p>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}

function Calculator() {
  return (
    <section id="kalkulator" className="bg-cream">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-10 lg:py-20">
        <div className="rounded-2xl bg-stone p-6 sm:p-10">
          <div className="grid gap-10 lg:grid-cols-[1fr_1.25fr] lg:gap-14">
            <div>
              <h2 className="font-serif text-3xl leading-snug text-ink">
                Kalkulator Keseimbangan Nutrisi
              </h2>
              <p className="mt-4 text-sm leading-relaxed text-body">
                Sesuaikan sasaran kesehatan harian dengan ritme tubuh Anda.
                Temukan panduan asupan kalori dan makronutrisi yang tepat untuk
                mindful living.
              </p>

              <p className="mt-8 flex gap-3 rounded-lg bg-white p-4 text-xs leading-relaxed text-body">
                <CheckCircleIcon className="mt-0.5 h-4 w-4 shrink-0 text-sage" />
                Metode perhitungan Raifu menggunakan rumus Harris-Benedict yang
                disempurnakan dengan rasio serat dan karbohidrat kompleks.
              </p>
            </div>

            <NutritionCalculator />
          </div>
        </div>
      </div>
    </section>
  );
}

function Philosophy() {
  return (
    <section id="filosofi" className="border-t border-line bg-white">
      <div className="mx-auto grid max-w-7xl items-center gap-12 px-4 py-16 sm:px-6 lg:grid-cols-2 lg:gap-16 lg:px-10 lg:py-20">
        <figure className="relative aspect-[4/3] overflow-hidden rounded-xl bg-stone">
          <Image
            src="https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?auto=format&fit=crop&w=1100&q=70"
            alt="Sajian salmon di atas talenan kayu, ditata tenang dengan sumpit"
            fill
            sizes="(min-width: 1024px) 560px, 100vw"
            className="object-cover"
          />
          <figcaption className="absolute right-4 bottom-4 left-4 rounded-lg bg-white p-4">
            <p className="font-serif text-base text-ink">
              <span className="font-jp">腹八分目</span> · Hara Hachi Bu
            </p>
            <p className="mt-1 text-xs text-body">
              Berhenti makan saat 80% kenyang demi umur panjang.
            </p>
          </figcaption>
        </figure>

        <div>
          <h2 className="font-serif text-3xl leading-snug text-ink sm:text-4xl">
            Filosofi Raifu: Menjaga Hubungan Tenang Antara Manusia dan Makanan
          </h2>
          <p className="mt-5 text-base leading-relaxed text-body">
            Dalam budaya Jepang modern, makan bukan sekadar menghitung angka
            atau membatasi diri secara kaku. Ini adalah momen hening untuk
            menyadari apa yang menghidupi tubuh kita.
          </p>

          <ul className="mt-8 space-y-5">
            {PHILOSOPHY_POINTS.map((point) => (
              <li key={point.title} className="flex gap-3">
                <CheckCircleIcon className="mt-0.5 h-5 w-5 shrink-0 text-sage" />
                <div>
                  <h3 className="text-sm font-semibold text-ink">
                    {point.title}
                  </h3>
                  <p className="mt-1 text-sm leading-relaxed text-body">
                    {point.description}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

function Testimonials() {
  return (
    <section id="testimoni" className="border-t border-line bg-mist">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-10 lg:py-20">
        <div className="text-center">
          <h2 className="font-serif text-3xl text-ink sm:text-4xl">
            Cerita dari Mereka yang Menemukan Ketenangan
          </h2>
        </div>

        <ul className="mt-10 grid gap-5 lg:grid-cols-3">
          {TESTIMONIALS.map((item) => (
            <li
              key={item.name}
              className="flex flex-col rounded-xl border border-line bg-white p-6"
            >
              <p className="flex gap-0.5 text-sage" aria-label="Penilaian 5 dari 5">
                {Array.from({ length: 5 }).map((_, index) => (
                  <StarIcon key={index} className="h-3.5 w-3.5" />
                ))}
              </p>
              <blockquote className="mt-4 flex-1 text-sm leading-relaxed text-body italic">
                “{item.quote}”
              </blockquote>
              <figcaption className="mt-6 flex items-center gap-3 border-t border-line pt-5">
                <span
                  aria-hidden
                  className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-sage-soft font-serif text-sm text-sage"
                >
                  {initials(item.name)}
                </span>
                <span>
                  <span className="block text-sm font-semibold text-ink">
                    {item.name}
                  </span>
                  <span className="block text-xs text-muted">{item.role}</span>
                </span>
              </figcaption>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

function FinalCta() {
  return (
    <section id="tentang" className="bg-cream">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-10 lg:py-20">
        <div
          id="mulai"
          className="grid gap-8 rounded-2xl bg-sage px-6 py-12 sm:px-12 lg:grid-cols-[1.4fr_1fr] lg:items-center"
        >
          <div>
            <h2 className="max-w-xl font-serif text-3xl leading-snug text-white sm:text-4xl">
              Mulai Perjalanan Anda: Bawa Ketenangan ke Dalam Setiap Sajian Harian
            </h2>
            <p className="mt-4 max-w-lg text-sm leading-relaxed text-white/80">
              Daftar sekarang secara cuma-cuma dan rasakan kemudahan mencatat
              nutrisi tanpa kerumitan. Raifu dirancang untuk siapa pun yang
              ingin memulai kebiasaan sehat dengan tenang.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-4 lg:justify-end">
            <Link
              href="/masuk"
              className="inline-flex items-center rounded-md bg-white px-5 py-3 text-sm font-medium text-sage transition-colors hover:bg-sage-soft"
            >
              Buat Akun Gratis
            </Link>
            <Link
              href="/tentang"
              className="text-sm font-medium text-white/85 underline-offset-4 transition-colors hover:text-white hover:underline"
            >
              Pelajari Tentang Raifu
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
