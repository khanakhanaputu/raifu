import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

const GROQ_VISION_MODEL = "qwen/qwen3.8-27b";
const MAX_IMAGE_BASE64_CHARS = 9_000_000; // ~6.5MB decoded, well under Groq's 20MB/request limit

const RESULT_SCHEMA = {
  name: "food_nutrition_estimate",
  strict: true,
  schema: {
    type: "object",
    additionalProperties: false,
    properties: {
      isFood: {
        type: "boolean",
        description: "false jika foto tidak menampilkan makanan atau minuman yang bisa dianalisis",
      },
      name: { type: "string", description: "Nama hidangan, singkat, dalam Bahasa Indonesia" },
      detail: {
        type: "string",
        description: "Deskripsi singkat 1 kalimat berisi komponen/bahan utama yang terlihat",
      },
      kcal: { type: "integer", description: "Estimasi total kalori (kkal), bilangan bulat non-negatif" },
      protein: { type: "integer", description: "Estimasi protein dalam gram, bilangan bulat non-negatif" },
      carbs: { type: "integer", description: "Estimasi karbohidrat dalam gram, bilangan bulat non-negatif" },
      fat: { type: "integer", description: "Estimasi lemak dalam gram, bilangan bulat non-negatif" },
      fiber: { type: "integer", description: "Estimasi serat dalam gram, bilangan bulat non-negatif" },
      sodiumMg: { type: "integer", description: "Estimasi natrium/sodium dalam mg, bilangan bulat non-negatif" },
      micros: {
        type: "array",
        items: { type: "string" },
        description: "2-3 catatan mikronutrien singkat, misal 'Vitamin C Tinggi'",
      },
      note: {
        type: "string",
        description:
          "1-2 kalimat catatan gizi bernada tenang dan tidak menghakimi, mengikuti filosofi Hara Hachi Bu (kenyang 80%), Bahasa Indonesia",
      },
    },
    required: ["isFood", "name", "detail", "kcal", "protein", "carbs", "fat", "fiber", "sodiumMg", "micros", "note"],
  },
} as const;

type GroqResult = {
  isFood: boolean;
  name: string;
  detail: string;
  kcal: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber: number;
  sodiumMg: number;
  micros: string[];
  note: string;
};

function clampInt(value: unknown, min = 0, max = 5000) {
  const num = Math.round(Number(value));
  if (!Number.isFinite(num)) return min;
  return Math.min(max, Math.max(min, num));
}

export async function POST(request: Request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return Response.json({ error: "Silakan masuk untuk menggunakan Scan Nutrisi." }, { status: 401 });
  }

  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) {
    return Response.json(
      { error: "Fitur scan AI belum dikonfigurasi di server." },
      { status: 503 },
    );
  }

  const body = await request.json().catch(() => null);
  const image = body?.image as string | undefined;

  if (!image || !/^data:image\/(jpeg|jpg|png|webp);base64,/.test(image)) {
    return Response.json({ error: "Format gambar tidak didukung." }, { status: 400 });
  }
  if (image.length > MAX_IMAGE_BASE64_CHARS) {
    return Response.json({ error: "Ukuran foto terlalu besar. Coba foto lain." }, { status: 413 });
  }

  let upstream: Response;
  try {
    upstream = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "content-type": "application/json",
        authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: GROQ_VISION_MODEL,
        temperature: 0.4,
        max_completion_tokens: 700,
        response_format: { type: "json_schema", json_schema: RESULT_SCHEMA },
        messages: [
          {
            role: "system",
            content:
              "Anda adalah asisten analisis gizi untuk aplikasi Raifu. Identifikasi hidangan pada foto dan berikan estimasi nutrisi yang realistis untuk satu porsi wajar seperti yang terlihat di foto. Jika foto sama sekali tidak menampilkan makanan/minuman, set isFood ke false dan isi field lain dengan nilai wajar apa adanya. Selalu tulis dalam Bahasa Indonesia dengan nada tenang, suportif, dan tidak menghakimi (filosofi Hara Hachi Bu: kenyang 80%, bukan diet ketat). Jangan gunakan kata 'buruk' atau 'terlarang' untuk makanan apa pun.",
          },
          {
            role: "user",
            content: [
              { type: "text", text: "Analisis foto makanan ini." },
              { type: "image_url", image_url: { url: image } },
            ],
          },
        ],
      }),
    });
  } catch {
    return Response.json(
      { error: "Tidak dapat menghubungi layanan AI. Periksa koneksi Anda." },
      { status: 502 },
    );
  }

  if (upstream.status === 429) {
    return Response.json(
      { error: "Terlalu banyak permintaan saat ini. Coba lagi sebentar lagi." },
      { status: 429 },
    );
  }
  if (!upstream.ok) {
    return Response.json({ error: "Gagal menganalisis foto. Coba lagi." }, { status: 502 });
  }

  const payload = await upstream.json().catch(() => null);
  const raw = payload?.choices?.[0]?.message?.content;
  if (typeof raw !== "string") {
    return Response.json({ error: "Respons AI tidak valid. Coba lagi." }, { status: 502 });
  }

  let result: GroqResult;
  try {
    result = JSON.parse(raw);
  } catch {
    return Response.json({ error: "Respons AI tidak valid. Coba lagi." }, { status: 502 });
  }

  if (!result.isFood) {
    return Response.json(
      { error: "Foto ini sepertinya bukan makanan atau minuman. Coba foto lain." },
      { status: 422 },
    );
  }

  return Response.json({
    name: String(result.name || "Hidangan Tidak Dikenali").slice(0, 80),
    detail: String(result.detail || "").slice(0, 200),
    kcal: clampInt(result.kcal, 0, 3000),
    protein: clampInt(result.protein, 0, 300),
    carbs: clampInt(result.carbs, 0, 400),
    fat: clampInt(result.fat, 0, 300),
    fiber: clampInt(result.fiber, 0, 100),
    sodiumMg: clampInt(result.sodiumMg, 0, 6000),
    micros: Array.isArray(result.micros) ? result.micros.slice(0, 4).map(String) : [],
    note: String(result.note || "").slice(0, 400),
  });
}
