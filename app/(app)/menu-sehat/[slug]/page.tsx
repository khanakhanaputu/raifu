import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Card, Eyebrow, Pill, buttonClass } from "@/app/components/ui";
import { BowlIcon, ClockIcon, LeafIcon } from "@/app/components/icons";
import { RECIPES } from "@/lib/content";
import { formatNumber } from "@/lib/nutrition";

export function generateStaticParams() {
  return RECIPES.map((recipe) => ({ slug: recipe.slug }));
}

export async function generateMetadata({
  params,
}: PageProps<"/menu-sehat/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const recipe = RECIPES.find((item) => item.slug === slug);
  if (!recipe) return { title: "Resep tidak ditemukan" };

  return {
    title: recipe.name,
    description: recipe.summary,
  };
}

export default async function RecipePage({ params }: PageProps<"/menu-sehat/[slug]">) {
  const { slug } = await params;
  const recipe = RECIPES.find((item) => item.slug === slug);
  if (!recipe) notFound();

  const related = RECIPES.filter((item) => item.slug !== recipe.slug).slice(0, 3);

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
      <Link
        href="/menu-sehat"
        className="text-sm text-sage transition-colors hover:underline"
      >
        ← Kembali ke Menu Sehat
      </Link>

      <article className="mt-6">
        <Eyebrow>{recipe.mealLabel} · Panduan Memasak</Eyebrow>
        <h1 className="mt-3 font-serif text-3xl leading-tight text-ink sm:text-4xl">
          {recipe.name}
        </h1>
        <p className="mt-4 max-w-2xl text-base leading-relaxed text-body">
          {recipe.summary}
        </p>

        <p className="mt-5 flex flex-wrap items-center gap-3">
          {recipe.tags.map((tag) => (
            <Pill key={tag}>{tag}</Pill>
          ))}
          <span className="flex items-center gap-1.5 text-sm text-body">
            <ClockIcon className="h-4 w-4" />
            {recipe.minutes} Menit
          </span>
          <span className="flex items-center gap-1.5 text-sm text-body">
            <BowlIcon className="h-4 w-4" />
            {recipe.difficulty}
          </span>
        </p>

        <div className="relative mt-8 aspect-[16/9] overflow-hidden rounded-xl bg-stone">
          <Image
            src={recipe.image}
            alt={recipe.name}
            fill
            sizes="(min-width: 1024px) 900px, 100vw"
            className="object-cover"
            priority
          />
        </div>

        <ul className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-5">
          {[
            { label: "Energi", value: `${formatNumber(recipe.kcal)} kkal` },
            { label: "Protein", value: `${recipe.protein} g` },
            { label: "Karbohidrat", value: `${recipe.carbs} g` },
            { label: "Lemak", value: `${recipe.fat} g` },
            { label: "Serat", value: `${recipe.fiber} g` },
          ].map((item) => (
            <li key={item.label} className="rounded-lg bg-mist p-4 text-center">
              <p className="text-xs text-muted">{item.label}</p>
              <p className="mt-1 font-serif text-lg text-ink tabular-nums">
                {item.value}
              </p>
            </li>
          ))}
        </ul>

        <div className="mt-10 grid gap-8 lg:grid-cols-[1fr_1.4fr]">
          <Card className="h-fit p-6">
            <h2 className="font-serif text-xl text-ink">Bahan</h2>
            <ul className="mt-4 space-y-2.5">
              {recipe.ingredients.map((ingredient) => (
                <li
                  key={ingredient}
                  className="flex gap-3 text-sm leading-relaxed text-body"
                >
                  <LeafIcon className="mt-0.5 h-4 w-4 shrink-0 text-sage" />
                  {ingredient}
                </li>
              ))}
            </ul>
          </Card>

          <div>
            <h2 className="font-serif text-xl text-ink">Langkah Memasak</h2>
            <ol className="mt-4 space-y-4">
              {recipe.steps.map((step, index) => (
                <li key={step} className="flex gap-4">
                  <span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-sage-soft text-sm font-medium text-sage">
                    {index + 1}
                  </span>
                  <p className="pt-1 text-sm leading-relaxed text-body">{step}</p>
                </li>
              ))}
            </ol>

            <p className="mt-8 rounded-lg bg-sage-soft p-5 text-sm leading-relaxed text-ink/80">
              Sajikan dalam piring berukuran sedang dan berhentilah saat perut terasa
              80% penuh. Sisakan ruang untuk napas yang tenang — inilah inti{" "}
              <span className="font-jp">腹八分目</span>.
            </p>
          </div>
        </div>
      </article>

      <section className="mt-12 border-t border-line pt-8">
        <h2 className="font-serif text-xl text-ink">Resep Lain yang Selaras</h2>
        <ul className="mt-5 grid gap-5 sm:grid-cols-3">
          {related.map((item) => (
            <li key={item.slug}>
              <Link
                href={`/menu-sehat/${item.slug}`}
                className="block overflow-hidden rounded-xl border border-line bg-white transition-colors hover:border-sage/50"
              >
                <span className="relative block aspect-[16/10] bg-stone">
                  <Image
                    src={item.image}
                    alt={item.name}
                    fill
                    sizes="(min-width: 640px) 280px, 100vw"
                    className="object-cover"
                  />
                </span>
                <span className="block p-4">
                  <span className="block font-serif text-base leading-snug text-ink">
                    {item.name}
                  </span>
                  <span className="mt-2 block text-xs text-body tabular-nums">
                    {formatNumber(item.kcal)} kkal · {item.minutes} menit
                  </span>
                </span>
              </Link>
            </li>
          ))}
        </ul>

        <Link href="/menu-sehat" className={buttonClass("secondary", "mt-8")}>
          Jelajahi Semua Resep
        </Link>
      </section>
    </div>
  );
}
