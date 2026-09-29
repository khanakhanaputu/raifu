import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

// Model teks yang sama dengan /api/consult — ekstraksi terstruktur singkat,
// bukan reasoning kompleks, jadi 20B cukup (lebih murah & cepat dari 120B).
const GROQ_TEXT_MODEL = "openai/gpt-oss-20b";
const MAX_TEXT_CHARS = 500;

const RESULT_SCHEMA = {
  name: "voice_food_log_estimate",
  strict: true,
  schema: {
    type: "object",
    additionalProperties: false,
    properties: {
      isFood: {
        type: "boolean",
        description: "false jika ucapan sama sekali bukan deskripsi makanan/minuman",
      },
      name: { type: "string", description: "Nama hidangan, singkat, Bahasa Indonesia" },
      kcal: { type: "integer" },
      protein: { type: "integer" },
      carbs: { type: "integer" },
      fat: { type: "integer" },
      fiber: { type: "integer" },
    },
    required: ["isFood", "name", "kcal", "protein", "carbs", "fat", "fiber"],
  },
} as const;

function clampInt(value: unknown, min = 0, max = 3000) {
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
    return Response.json({ error: "Silakan masuk untuk memakai catat via suara." }, { status: 401 });
  }

  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) {
    return Response.json({ error: "Fitur ini belum dikonfigurasi di server." }, { status: 503 });
  }

  const body = await request.json().catch(() => null);
  const text = body?.text as string | undefined;

  if (!text || !text.trim()) {
    return Response.json({ error: "Tidak ada ucapan yang terdengar." }, { status: 400 });
  }
  if (text.length > MAX_TEXT_CHARS) {
    return Response.json({ error: "Teks terlalu panjang." }, { status: 413 });
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
        model: GROQ_TEXT_MODEL,
        temperature: 0.3,
        max_completion_tokens: 300,
        response_format: { type: "json_schema", json_schema: RESULT_SCHEMA },
        messages: [
          {
            role: "system",
            content:
              "Anda mengubah ucapan pengguna tentang makanan yang baru dimakan menjadi estimasi gizi satu porsi wajar. Contoh: 'saya makan nasi goreng dan telur ceplok' -> perkirakan nasi goreng + telur ceplok porsi standar Indonesia. Jika ucapan menyebut lebih dari satu makanan, gabungkan menjadi satu entri dengan nama gabungan singkat. Jika bukan deskripsi makanan sama sekali, set isFood ke false.",
          },
          { role: "user", content: text },
        ],
      }),
    });
  } catch {
    return Response.json({ error: "Tidak dapat menghubungi layanan AI." }, { status: 502 });
  }

  if (upstream.status === 429) {
    return Response.json({ error: "Terlalu banyak permintaan. Coba lagi sebentar lagi." }, { status: 429 });
  }
  if (!upstream.ok) {
    return Response.json({ error: "Gagal menganalisis ucapan. Coba lagi." }, { status: 502 });
  }

  const payload = await upstream.json().catch(() => null);
  const raw = payload?.choices?.[0]?.message?.content;
  if (typeof raw !== "string") {
    return Response.json({ error: "Respons AI tidak valid." }, { status: 502 });
  }

  let result: {
    isFood: boolean;
    name: string;
    kcal: number;
    protein: number;
    carbs: number;
    fat: number;
    fiber: number;
  };
  try {
    result = JSON.parse(raw);
  } catch {
    return Response.json({ error: "Respons AI tidak valid." }, { status: 502 });
  }

  if (!result.isFood) {
    return Response.json(
      { error: "Sepertinya itu bukan deskripsi makanan. Coba ucapkan ulang, misal 'saya makan nasi dan ayam goreng'." },
      { status: 422 },
    );
  }

  return Response.json({
    name: String(result.name || "Catatan Suara").slice(0, 80),
    kcal: clampInt(result.kcal, 0, 3000),
    protein: clampInt(result.protein, 0, 300),
    carbs: clampInt(result.carbs, 0, 400),
    fat: clampInt(result.fat, 0, 300),
    fiber: clampInt(result.fiber, 0, 100),
  });
}
