import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Card, Eyebrow, IconTile, Pill } from "@/app/components/ui";
import {
  BowlIcon,
  CheckCircleIcon,
  FlameIcon,
  JournalIcon,
  LeafIcon,
  MailIcon,
  ScanIcon,
  ShieldIcon,
} from "@/app/components/icons";
import { PHOTOS } from "@/lib/content";

export const metadata: Metadata = {
  title: "Tentang Raifu",
  description:
    "Tujuan platform Raifu, target pengguna yang dilayani, prinsip kerja produk, serta pertanyaan yang sering diajukan.",
};

const AUDIENCE = [
  {
    icon: <FlameIcon className="h-5 w-5" />,
    title: "Pemula yang Ingin Mulai Sehat",
    description:
      "Orang yang berkali-kali gagal konsisten karena aplikasi gizi terasa rumit, menghakimi, dan penuh angka yang membuat cemas.",
  },
  {
    icon: <JournalIcon className="h-5 w-5" />,
    title: "Pekerja Kantoran & Mahasiswa",
    description:
      "Mereka dengan jadwal padat yang butuh pencatatan cepat — cukup foto makanan — tanpa mengisi formulir panjang setiap kali makan.",
  },
  {
    icon: <BowlIcon className="h-5 w-5" />,
    title: "Penjaga Pola Makan Berkelanjutan",
    description:
      "Pengguna yang sudah sehat dan ingin mempertahankan ritme, memantau serat serta hidrasi, bukan sekadar mengejar defisit kalori.",
  },
];

const PRINCIPLES = [
  {
    title: "Tanpa Rasa Bersalah",
    description:
      "Tidak ada label makanan “buruk”. Raifu menampilkan keseimbangan mingguan, bukan vonis harian, sehingga satu hari di luar rencana tidak terasa seperti kegagalan.",
  },
  {
    title: "Konsistensi Lebih Penting dari Kesempurnaan",
    description:
      "Streak, badge, dan level dirancang sebagai apresiasi lembut. Streak Freeze memastikan hidup yang tidak linier tetap dihargai.",
  },
  {
    title: "Data Milik Penggunanya",
    description:
      "Pada prototipe ini seluruh catatan disimpan di perangkat Anda sendiri. Foto makanan diproses di peramban dan tidak diunggah ke server mana pun.",
  },
  {
    title: "Kearifan Jepang, Bahan Nusantara",
    description:
      "Prinsip Hara Hachi Bu dan struktur Ichiju Sansai diterjemahkan ke bahan lokal yang mudah didapat: tempe, ikan kembung, sayur bening, beras merah.",
  },
];

const FAQ = [
  {
    question: "Apakah hasil scan nutrisi akurat?",
    answer:
      "Hasil scan pada prototipe ini merupakan data estimasi untuk kebutuhan demonstrasi. Pada produk nyata, estimasi visual tetap berupa perkiraan dan sebaiknya dikoreksi manual bila Anda menimbang porsi secara presisi.",
  },
  {
    question: "Bagaimana target kalori saya dihitung?",
    answer:
      "Raifu memakai rumus Harris-Benedict (revisi Roza & Shizgal) untuk menghitung BMR dari berat, tinggi, usia, dan jenis kelamin biologis, lalu mengalikannya dengan faktor aktivitas serta niat sehat yang Anda pilih.",
  },
  {
    question: "Apa yang terjadi jika saya lupa mencatat sehari?",
    answer:
      "Anda memiliki satu jatah Streak Freeze setiap bulan kalender. Jatah ini melindungi rantai kebiasaan Anda saat berhalangan mencatat, tanpa perlu mengulang dari nol.",
  },
  {
    question: "Apakah Raifu menggantikan konsultasi dokter gizi?",
    answer:
      "Tidak. Raifu adalah pendamping kebiasaan dan media edukasi. Untuk kondisi medis khusus, kehamilan, alergi akut, atau penyakit metabolik kronis, konsultasikan pola makan Anda dengan dokter spesialis gizi klinis.",
  },
  {
    question: "Apakah data saya dikirim ke server?",
    answer:
      "Tidak pada prototipe ini. Seluruh catatan makanan, profil, dan pengaturan tersimpan di penyimpanan lokal peramban Anda dan dapat dipulihkan ke kondisi awal kapan saja dari halaman Profil.",
  },
];

export default function TentangPage() {
  return (
    <div className="mx-auto max-w-[1100px] space-y-12 px-4 py-10 sm:px-6 lg:px-8">
      <header className="max-w-3xl">
        <Eyebrow className="flex flex-wrap items-center gap-2">
          Tentang Platform · <span className="font-jp text-ink">ライフについて</span>
        </Eyebrow>
        <h1 className="mt-3 font-serif text-3xl leading-tight text-ink sm:text-4xl">
          Menemani Kebiasaan Sehat yang Bertahan, Bukan yang Memaksa
        </h1>
        <p className="mt-4 text-base leading-relaxed text-body">
          Raifu (<span className="font-jp">ライフ</span>) diambil dari kata Jepang yang
          berarti <em>life</em>. Platform ini lahir dari satu pengamatan sederhana:
          banyak orang berhenti mencatat asupan gizi bukan karena malas, melainkan karena
          proses pencatatannya melelahkan dan membuat cemas.
        </p>
      </header>

      <section className="grid gap-8 lg:grid-cols-[1.2fr_1fr] lg:items-center">
        <div>
          <Eyebrow>Tujuan Platform</Eyebrow>
          <h2 className="mt-3 font-serif text-2xl text-ink">
            Membuat Pencatatan Gizi Harian Terasa Ringan dan Berkelanjutan
          </h2>
          <p className="mt-4 text-sm leading-relaxed text-body">
            Raifu menggabungkan tiga hal: estimasi nutrisi berbasis foto agar pencatatan
            selesai dalam hitungan detik, visualisasi progres yang menenangkan agar
            pengguna memahami tubuhnya, dan gamifikasi streak yang menghargai konsistensi
            tanpa menghukum kegagalan.
          </p>
          <p className="mt-4 text-sm leading-relaxed text-body">
            Sasaran akhirnya bukan angka timbangan yang mengecil, melainkan relasi yang
            tenang antara manusia dan makanan — persis seperti falsafah{" "}
            <span className="font-jp">腹八分目</span> (Hara Hachi Bu) yang menjadi inti
            produk ini.
          </p>

          <ul className="mt-6 space-y-3">
            {[
              "Scan gizi makanan dengan estimasi makro instan",
              "Food log harian yang bisa ditambah, diubah, dan dihapus",
              "Dashboard progres dengan grafik mingguan dan target personal",
              "Streak, kalender konsistensi, dan galeri milestone",
            ].map((item) => (
              <li key={item} className="flex gap-3 text-sm leading-relaxed text-body">
                <CheckCircleIcon className="mt-0.5 h-4 w-4 shrink-0 text-sage" />
                {item}
              </li>
            ))}
          </ul>
        </div>

        <div className="relative aspect-[4/5] overflow-hidden rounded-xl bg-stone">
          <Image
            src={PHOTOS.teishoku}
            alt="Sajian seimbang tertata tenang di atas meja kayu"
            fill
            sizes="(min-width: 1024px) 420px, 100vw"
            className="object-cover"
          />
        </div>
      </section>

      <section>
        <Eyebrow>Target Pengguna</Eyebrow>
        <h2 className="mt-3 font-serif text-2xl text-ink">
          Dirancang untuk Siapa Raifu Dibuat
        </h2>
        <ul className="mt-6 grid gap-5 md:grid-cols-3">
          {AUDIENCE.map((item) => (
            <li key={item.title}>
              <Card className="h-full p-6">
                <IconTile shrink={false}>
                  {item.icon}
                </IconTile>
                <h3 className="mt-4 font-serif text-lg leading-snug text-ink">
                  {item.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-body">
                  {item.description}
                </p>
              </Card>
            </li>
          ))}
        </ul>
      </section>

      <section>
        <Eyebrow>Prinsip Kerja</Eyebrow>
        <h2 className="mt-3 font-serif text-2xl text-ink">Empat Komitmen Produk</h2>
        <ul className="mt-6 grid gap-5 md:grid-cols-2">
          {PRINCIPLES.map((item, index) => (
            <li key={item.title}>
              <Card className="h-full p-6">
                <p className="font-jp text-sm text-sage">
                  {["壱", "弐", "参", "肆"][index]}
                </p>
                <h3 className="mt-3 font-serif text-lg text-ink">{item.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-body">
                  {item.description}
                </p>
              </Card>
            </li>
          ))}
        </ul>
      </section>

      <section>
        <Eyebrow>Pertanyaan yang Sering Diajukan</Eyebrow>
        <h2 className="mt-3 font-serif text-2xl text-ink">FAQ</h2>
        <ul className="mt-6 space-y-3">
          {FAQ.map((item) => (
            <li key={item.question}>
              <details className="group rounded-xl border border-line bg-white p-5 open:border-sage/40">
                <summary className="flex cursor-pointer items-center justify-between gap-4 font-serif text-lg text-ink marker:content-none">
                  {item.question}
                  <span className="shrink-0 text-sage transition-transform group-open:rotate-45">
                    +
                  </span>
                </summary>
                <p className="mt-3 text-sm leading-relaxed text-body">{item.answer}</p>
              </details>
            </li>
          ))}
        </ul>
      </section>

      <section className="grid gap-6 rounded-xl bg-sage px-6 py-10 text-white sm:px-10 lg:grid-cols-[1.4fr_1fr] lg:items-center">
        <div>
          <p className="text-xs font-medium tracking-[0.18em] uppercase opacity-80">
            Kontak &amp; Kolaborasi
          </p>
          <h2 className="mt-3 font-serif text-2xl leading-snug sm:text-3xl">
            Punya masukan untuk membuat Raifu lebih menenangkan?
          </h2>
          <p className="mt-3 max-w-lg text-sm leading-relaxed text-white/80">
            Kami terbuka untuk kolaborasi dengan ahli gizi, komunitas kesehatan, dan
            pengguna yang ingin berbagi pengalaman perjalanan sehatnya.
          </p>
          <p className="mt-5 flex flex-wrap items-center gap-4 text-sm">
            <span className="inline-flex items-center gap-2">
              <MailIcon className="h-4 w-4" />
              halo@raifu.id
            </span>
            <span className="inline-flex items-center gap-2">
              <ShieldIcon className="h-4 w-4" />
              Privasi tanpa pelacak iklan
            </span>
          </p>
        </div>

        <div className="flex flex-wrap gap-3 lg:justify-end">
          <Link
            href="/scan"
            className="inline-flex items-center gap-2 rounded-md bg-white px-5 py-3 text-sm font-medium text-sage transition-colors hover:bg-sage-soft"
          >
            <ScanIcon className="h-4 w-4" />
            Coba Scan Nutrisi
          </Link>
          <Link
            href="/edukasi"
            className="inline-flex items-center gap-2 rounded-md border border-white/40 px-5 py-3 text-sm font-medium text-white transition-colors hover:bg-white/10"
          >
            <LeafIcon className="h-4 w-4" />
            Baca Edukasi
          </Link>
        </div>
      </section>

      <p className="flex flex-wrap items-center gap-3 text-xs text-muted">
        <Pill tone="neutral">Prototipe Kompetisi</Pill>
        Data nutrisi pada aplikasi ini bersifat contoh untuk keperluan demonstrasi
        antarmuka dan alur pengguna.
      </p>
    </div>
  );
}
