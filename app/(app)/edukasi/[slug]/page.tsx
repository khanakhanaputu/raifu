import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Eyebrow, Pill, buttonClass } from "@/app/components/ui";
import { ARTICLES } from "@/lib/content";

export function generateStaticParams() {
  return ARTICLES.map((article) => ({ slug: article.slug }));
}

export async function generateMetadata({
  params,
}: PageProps<"/edukasi/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const article = ARTICLES.find((item) => item.slug === slug);
  if (!article) return { title: "Artikel tidak ditemukan" };

  return { title: article.title, description: article.excerpt };
}

export default async function ArticlePage({ params }: PageProps<"/edukasi/[slug]">) {
  const { slug } = await params;
  const article = ARTICLES.find((item) => item.slug === slug);
  if (!article) notFound();

  const more = ARTICLES.filter((item) => item.slug !== article.slug).slice(0, 2);

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 lg:px-8">
      <Link href="/edukasi" className="text-sm text-sage transition-colors hover:underline">
        ← Kembali ke Edukasi
      </Link>

      <article className="mt-6">
        <Eyebrow>{article.category}</Eyebrow>
        <h1 className="mt-3 font-serif text-3xl leading-tight text-ink sm:text-4xl">
          {article.title}
        </h1>

        <p className="mt-5 flex flex-wrap items-center gap-3 text-sm text-body">
          <span className="grid h-8 w-8 place-items-center rounded-full bg-sage-soft text-xs font-medium text-sage">
            {article.author
              .replace(/dr\.|Sp\.GK/g, "")
              .trim()
              .split(" ")
              .slice(0, 2)
              .map((word) => word[0])
              .join("")}
          </span>
          {article.author}
          <span className="h-1 w-1 rounded-full bg-muted" />
          {article.readMinutes} menit membaca
          <Pill tone="neutral">{article.topic}</Pill>
        </p>

        <div className="relative mt-8 aspect-[16/9] overflow-hidden rounded-xl bg-stone">
          <Image
            src={article.image}
            alt={article.title}
            fill
            sizes="(min-width: 768px) 768px, 100vw"
            className="object-cover"
            priority
          />
        </div>

        <p className="mt-8 border-l-2 border-sage pl-5 font-serif text-lg leading-relaxed text-ink">
          {article.excerpt}
        </p>

        <div className="mt-8 space-y-5">
          {article.body.map((paragraph) => (
            <p key={paragraph} className="text-base leading-relaxed text-body">
              {paragraph}
            </p>
          ))}
        </div>

        <p className="mt-10 rounded-xl bg-sage-soft p-6 text-sm leading-relaxed text-ink/80">
          Artikel ini merupakan materi edukasi umum. Untuk kondisi medis khusus,
          kehamilan, atau penyakit metabolik kronis, konsultasikan penyesuaian pola makan
          Anda dengan dokter spesialis gizi klinis.
        </p>
      </article>

      <section className="mt-12 border-t border-line pt-8">
        <h2 className="font-serif text-xl text-ink">Bacaan Berikutnya</h2>
        <ul className="mt-5 space-y-4">
          {more.map((item) => (
            <li key={item.slug}>
              <Link
                href={`/edukasi/${item.slug}`}
                className="flex gap-4 rounded-xl border border-line bg-white p-4 transition-colors hover:border-sage/50"
              >
                <span className="relative h-20 w-28 shrink-0 overflow-hidden rounded-lg bg-stone">
                  <Image
                    src={item.image}
                    alt=""
                    fill
                    sizes="112px"
                    className="object-cover"
                  />
                </span>
                <span className="min-w-0">
                  <span className="block text-xs text-muted">{item.category}</span>
                  <span className="mt-1 block font-serif text-base leading-snug text-ink">
                    {item.title}
                  </span>
                </span>
              </Link>
            </li>
          ))}
        </ul>

        <Link href="/edukasi" className={buttonClass("secondary", "mt-8")}>
          Jelajahi Semua Artikel
        </Link>
      </section>
    </div>
  );
}
