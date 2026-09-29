# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

General Indonesian health-conscious adults tracking daily nutrition without strict calorie obsession. Situation: want to build sustainable healthy eating habits (weight maintenance, loss, or gain) with low anxiety. Job: log meals, understand macronutrient balance, stay consistent day to day. Clinical/dietitian-referred use is secondary evidence (testimonial), not the primary audience.

## Product Purpose

Raifu is a mindful nutrition-tracking app that blends AI-assisted food logging with a Japanese-inspired eating philosophy (Hara Hachi Bu — stop at 80% full). It helps users track daily nutrition, maintain streaks, and get menu/consultation guidance, while explicitly avoiding guilt-based calorie tracking. Success = users forming a calm, consistent daily logging habit (streaks) without diet anxiety.

## Positioning

"No guilt tracking": most nutrition apps frame calories as a strict budget to fear breaking; Raifu frames nutrition as rhythm and balance across a week, paired with the Hara Hachi Bu philosophy and AI-assisted logging to remove calculation burden. This mindful-eating + AI-scan combination, delivered with Indonesian-language, Japanese-philosophy branding, is the differentiator a generic macro tracker could not truthfully copy.

## Operating Context

- Web app (Next.js App Router), route groups: `(ritual)` for entry/onboarding (`/masuk`, `/onboarding`) and `(app)` for the logged-in product (`dashboard`, `food-log`, `scan`, `konsultasi`, `menu-sehat`, `streak`, `edukasi`, `profil`, `tentang`).
- Onboarding captures taste preferences, biometrics (sex, age, weight, height), activity level, goal, and daily reminder rituals; computes BMI and macro/calorie targets client-side (`lib/nutrition.ts`).
- State is backed by Supabase (Postgres + Auth), via `lib/store.tsx` and `lib/supabase/*`. Real email/password accounts; each user's profile, meal entries, water logs, freeze dates, and reminders are persisted server-side, scoped by Row Level Security to `auth.uid()`. Streak/badge/level numbers stay derived client-side from that data (`lib/selectors.ts`) — no separate stored counters. Requires `NEXT_PUBLIC_SUPABASE_URL`/`NEXT_PUBLIC_SUPABASE_ANON_KEY` env vars; see `supabase/schema.sql` for the schema.
- `konsultasi` (consultation) is a real LLM chat: `app/api/consult/route.ts` sends the message, recent turn history, and the user's live profile numbers (target kcal, weight, goal) to Groq's `openai/gpt-oss-120b` as a system-prompted Raifu persona (Hara Hachi Bu, no-guilt tone, clinical-referral disclaimer baked into the prompt). Not a clinical service. The old template matcher (`findBotReply`/`BOT_REPLIES` in `lib/content.ts`) is kept as a local, zero-latency fallback only for when the API call fails (quota/network) — never the primary path.
- `scan` (AI Nutrition Scanner) is a real vision-AI integration: `app/api/scan/route.ts` sends the (client-compressed) photo to Groq's `qwen/qwen3.8-27b` vision model with a strict JSON schema, requires `GROQ_API_KEY` server-side and an authenticated user, and returns a live nutrition estimate — image bytes are proxied through and never persisted. The "Pilihan Sampel" tab (and the "Contoh Pindaian" grid) stays a free, no-API-call canned demo using `SAMPLE_SCANS` from `lib/content.ts`, labeled distinctly in the UI ("Estimasi dari Hidangan Serupa" vs "Dianalisis AI") so the two are never conflated.

## Capabilities and Constraints

- Language: Indonesian (Bahasa Indonesia) primary UI copy, with occasional Japanese terms (e.g. 腹八分目 Hara Hachi Bu) as philosophy branding, not a translation requirement.
- Calorie/macro math uses a Harris-Benedict-based formula (per landing page copy) implemented in `lib/nutrition.ts`.
- Streak system includes a "Streak Freeze" / natural streak protection (1x/month) so missed days don't break the habit loop.
- Real backend: Supabase Postgres + Auth (email/password). Photo/image upload to Supabase Storage is explicitly out of scope — `scan-view.tsx` already discards locally-captured photos before they'd reach a persisted entry, so `MealEntry.image` stays a plain URL-or-empty text field.
- Real Groq backend (`GROQ_API_KEY`): vision model `qwen/qwen3.8-27b` in `app/api/scan/route.ts`, text model `openai/gpt-oss-120b` in `app/api/consult/route.ts`. Must be set in the deployment's environment (e.g. Vercel project settings), not just `.env.local`, or both features fail (scan 503s; consult falls back to the local template bot).

## Brand Commitments

- Name: Raifu. Voice: calm, mindful, non-clinical, encouraging — explicitly "no guilt" framing.
- Visual/philosophical identity: Japanese mindful-eating motifs (Hara Hachi Bu, Ichijū-Sansai "one soup three dishes", 楽 mark used as bot avatar), paired with sage-green/cream color palette and serif display type already in `app/globals.css` and `app/components/ui.tsx`.
- Existing disclaimer (in `konsultasi-view.tsx`): the consultation bot gives educational/lifestyle guidance only and is not a substitute for a clinical dietitian for medical conditions, acute allergies, or chronic metabolic disease. Preserve this disclaimer wherever consultation content appears.

## Evidence on Hand

- `Rancangan/` contains the original design mockups (PNG per screen) and a PDF plan (`Rancangan.pdf`) used as the source brief for this build — treat as incumbent visual/product reference, not confirmed data.
- Landing page stats ("94.8% Akurasi Scan AI", "10.000+ Menu Terverifikasi", testimonials) are marketing copy for a competition submission, not verified metrics or real testimonials — do not treat as evidence to extend or fact-check against; do not fabricate additional numbers or testimonials beyond what's already written.

## Product Principles

1. No-guilt tracking: never frame nutrition data as a strict pass/fail budget; favor weekly rhythm and balance over daily perfection.
2. Calm over clinical: copy and UI stay warm and mindful, not sterile/medical, except where a clinical disclaimer is required.
3. Consistency without pressure: gamification (streaks, badges, freeze) rewards habit-building but must always offer a no-penalty way to pause.
4. Honesty about demo scope: don't let UI copy or new features imply real AI/backend capability that doesn't exist without explicit confirmation.

## Accessibility & Inclusion

No formal accessibility standard or additional user-need requirement confirmed beyond ordinary web accessibility practice.
