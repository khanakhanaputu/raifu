"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import { Card, FilterChip, IconTile, Pill, buttonClass, cx, fieldClass } from "@/app/components/ui";
import {
  BookmarkIcon,
  JournalIcon,
  LeafIcon,
  MailIcon,
  ArrowRightIcon,
} from "@/app/components/icons";
import { ARTICLES, ARTICLE_CATEGORIES } from "@/lib/content";
import { useRaifu } from "@/lib/store";
import { initials } from "@/lib/text";

export function EdukasiView() {
  const { state, updateProfile } = useRaifu();
  const [category, setCategory] = useState<string>(ARTICLE_CATEGORIES[0]);
  const [email, setEmail] = useState(state.profile.email);

  const featured = ARTICLES.find((article) => article.featured) ?? ARTICLES[0];

  const list = useMemo(
    () =>
      ARTICLES.filter(
        (article) =>
          article.slug !== featured.slug &&
          (category === ARTICLE_CATEGORIES[0] || article.category === category),
      ),
    [category, featured.slug],
  );

  return (
    <div className="mx-auto max-w-[1400px] space-y-8 px-4 py-8 sm:px-6 lg:px-8">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
        <div className="max-w-2xl">
          <h1 className="font-serif text-3xl text-ink sm:text-4xl">
            Edukasi &amp; Jurnal Keseimbangan Hidup
          </h1>
          <p className="mt-2 flex flex-wrap items-center gap-2 text-sm text-muted">
            Ruang Baca &amp; Ilmu Gizi ·
            <span className="font-jp text-ink">学びと養生</span>
          </p>
          <p className="mt-3 text-sm leading-relaxed text-body">
            Artikel mendalam seputar ilmu gizi modern, filosofi umur panjang Jepang, dan
            strategi membangun relasi damai dengan makanan sehari-hari.
          </p>
        </div>
        <Pill>
          <span className="h-1.5 w-1.5 rounded-full bg-sage" />
          {ARTICLES.length} Edisi Tersedia
        </Pill>
      </div>

      <div className="flex flex-wrap gap-2">
        {ARTICLE_CATEGORIES.map((item) => (
          <FilterChip
            key={item}
            active={category === item}
            onClick={() => setCategory(item)}
            variant="outline"
          >
            {item}
          </FilterChip>
        ))}
      </div>

      <Card className="grid overflow-hidden lg:grid-cols-2">
        <div className="relative aspect-[4/3] bg-stone lg:aspect-auto lg:min-h-96">
          <Image
            src={featured.image}
            alt={featured.title}
            fill
            sizes="(min-width: 1024px) 50vw, 100vw"
            className="object-cover"
            priority
          />
          <span className="absolute top-4 left-4 rounded bg-white/90 px-3 py-1.5 text-xs font-medium tracking-[0.1em] text-ink uppercase">
            Sorotan Utama
          </span>
        </div>

        <div className="flex flex-col justify-center p-6 sm:p-10">
          <p className="flex items-center gap-3 text-xs tracking-[0.12em] text-muted uppercase">
            {featured.topic}
            <span className="h-1 w-1 rounded-full bg-muted" />
            {featured.readMinutes} Menit Membaca
          </p>
          <h2 className="mt-4 font-serif text-2xl leading-snug text-ink sm:text-3xl">
            <Link
              href={`/edukasi/${featured.slug}`}
              className="transition-colors hover:text-sage"
            >
              {featured.title}
            </Link>
          </h2>
          <p className="mt-4 text-sm leading-relaxed text-body">{featured.excerpt}</p>

          <p className="mt-6 flex items-center gap-3">
            <span className="grid h-8 w-8 place-items-center rounded-full bg-sage-soft text-xs font-medium text-sage">
              {initials(featured.author, { stripTitles: true })}
            </span>
            <span className="text-sm text-ink">{featured.author}</span>
          </p>

          <div className="mt-6 flex items-center gap-4">
            <Link href={`/edukasi/${featured.slug}`} className={buttonClass("primary")}>
              Baca Selengkapnya
              <ArrowRightIcon className="h-4 w-4" />
            </Link>
            <button
              type="button"
              aria-label="Simpan artikel"
              className="grid h-10 w-10 place-items-center rounded-md text-muted transition-colors hover:bg-mist hover:text-sage"
            >
              <BookmarkIcon className="h-5 w-5" />
            </button>
          </div>
        </div>
      </Card>

      <ul className="grid gap-4 rounded-xl bg-mist p-5 sm:grid-cols-3">
        {[
          { icon: <JournalIcon className="h-5 w-5" />, value: `${ARTICLES.length} Jurnal`, label: "Riset Berbasis Bukti Medis" },
          { icon: <LeafIcon className="h-5 w-5" />, value: "80% Kapasitas", label: "Prinsip Kepuasan Otonom" },
          { icon: <BookmarkIcon className="h-5 w-5" />, value: "Ritual Harian", label: "Penyelarasan Tubuh & Jiwa" },
        ].map((stat) => (
          <li key={stat.value} className="flex items-center gap-4">
            <IconTile tone="white">
              {stat.icon}
            </IconTile>
            <span>
              <span className="block font-serif text-lg text-ink">{stat.value}</span>
              <span className="block text-xs text-body">{stat.label}</span>
            </span>
          </li>
        ))}
      </ul>

      <section>
        <div className="flex flex-wrap items-end justify-between gap-3">
          <h2 className="font-serif text-2xl text-ink">Koleksi Jurnal &amp; Telaah Terkini</h2>
          <p className="text-xs text-muted">
            Menampilkan {list.length} artikel esensial
          </p>
        </div>

        {list.length === 0 ? (
          <Card className="mt-5 px-6 py-12 text-center">
            <p className="font-serif text-lg text-ink">
              Belum ada artikel pada kategori ini
            </p>
            <p className="mt-2 text-sm text-body">
              Pilih kategori lain untuk menelusuri jurnal Raifu lainnya.
            </p>
          </Card>
        ) : (
          <ul className="mt-5 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {list.map((article) => (
              <li key={article.slug}>
                <Card className="flex h-full flex-col overflow-hidden">
                  <span className="relative block aspect-[16/10] bg-stone">
                    <Image
                      src={article.image}
                      alt={article.title}
                      fill
                      sizes="(min-width: 1280px) 400px, (min-width: 768px) 45vw, 100vw"
                      className="object-cover"
                    />
                    <span className="absolute top-3 left-3 rounded bg-white/90 px-2.5 py-1 text-xs text-ink">
                      {article.category.split(" & ")[0]}
                    </span>
                  </span>

                  <div className="flex flex-1 flex-col p-5">
                    <p className="text-xs text-muted">
                      {article.readMinutes} Menit Baca · {article.topic}
                    </p>
                    <h3 className="mt-2 font-serif text-lg leading-snug text-ink">
                      <Link
                        href={`/edukasi/${article.slug}`}
                        className="transition-colors hover:text-sage"
                      >
                        {article.title}
                      </Link>
                    </h3>
                    <p className="mt-3 flex-1 text-sm leading-relaxed text-body">
                      {article.excerpt}
                    </p>
                    <p className="mt-5 flex items-center justify-between border-t border-line pt-4">
                      <Link
                        href={`/edukasi/${article.slug}`}
                        className="text-sm text-sage hover:underline"
                      >
                        Baca Jurnal →
                      </Link>
                      <BookmarkIcon className="h-4 w-4 text-muted" />
                    </p>
                  </div>
                </Card>
              </li>
            ))}

            <li>
              <div className="flex h-full flex-col justify-center rounded-xl bg-sage-soft p-6">
                <span className="grid h-9 w-9 place-items-center rounded-full bg-white font-serif text-lg text-sage">
                  “
                </span>
                <p className="mt-4 font-serif text-xl leading-snug text-ink">
                  “Bukan tentang apa yang dilarang, melainkan seberapa hadir Anda saat
                  menikmatinya.”
                </p>
                <p className="mt-4 text-sm leading-relaxed text-ink/70">
                  Setiap kunyahan adalah jeda meditatif. Makanan bukan sekadar kalorimetri,
                  melainkan komunikasi intim antara alam dan regenerasi sel tubuh Anda.
                </p>
                <p className="mt-5 text-xs tracking-[0.12em] text-sage uppercase">
                  Kearifan Raifu · <span className="font-jp">ライフの知恵</span>
                </p>
              </div>
            </li>
          </ul>
        )}
      </section>

      <section className="rounded-xl bg-sage-soft px-6 py-12 text-center">
        <span className="mx-auto grid h-11 w-11 place-items-center rounded-full bg-white text-sage">
          <MailIcon className="h-5 w-5" />
        </span>
        <h2 className="mt-4 font-serif text-2xl text-ink sm:text-3xl">
          Wawasan Bebas Distraksi: Jurnal Mingguan Raifu
        </h2>
        <p className="mx-auto mt-3 max-w-lg text-sm leading-relaxed text-ink/70">
          Setiap Minggu pagi, dapatkan ringkasan riset nutrisi terapan, resep musiman
          mindful, dan catatan refleksi pendek langsung di kotak masuk Anda.
        </p>

        <form
          onSubmit={(event) => {
            event.preventDefault();
            if (!email.includes("@")) return;
            updateProfile({
              email,
              newsletterSubscribed: true,
            });
          }}
          className="mx-auto mt-6 flex max-w-lg flex-wrap items-center justify-center gap-3"
        >
          <label htmlFor="newsletter" className="sr-only">
            Alamat surel
          </label>
          <input
            id="newsletter"
            type="email"
            required
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="Alamat surel Anda…"
            className={cx(fieldClass, "max-w-xs flex-1")}
          />
          <button type="submit" className={buttonClass("primary")}>
            {state.profile.newsletterSubscribed
              ? "Perbarui Langganan"
              : "Dapatkan Wawasan Mingguan"}
          </button>
        </form>

        {state.profile.newsletterSubscribed && (
          <p role="status" className="mt-4 text-sm text-sage">
            Terima kasih atas minat Anda pada wawasan Raifu.
          </p>
        )}
      </section>
    </div>
  );
}
