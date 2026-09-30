import { authorize, chatCompletion, clampInt, errorResponse, GROQ_TEXT_MODEL } from "@/lib/groq";

export const dynamic = "force-dynamic";

const MAX_TEXT_CHARS = 500;

const SYSTEM_PROMPT =
  "Anda mengubah ucapan pengguna tentang makanan yang baru dimakan menjadi estimasi gizi satu porsi wajar. Contoh: 'saya makan nasi goreng dan telur ceplok' -> perkirakan nasi goreng + telur ceplok porsi standar Indonesia. Jika ucapan menyebut lebih dari satu makanan, gabungkan menjadi satu entri dengan nama gabungan singkat. Jika bukan deskripsi makanan sama sekali, set isFood ke false.";

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

export async function POST(request: Request) {
  const auth = await authorize({
    unauthorized: "Silakan masuk untuk memakai catat via suara.",
    unconfigured: "Fitur ini belum dikonfigurasi di server.",
  });
  if ("response" in auth) return auth.response;

  const body = await request.json().catch(() => null);
  const text = body?.text as string | undefined;

  if (!text || !text.trim()) {
    return errorResponse("Tidak ada ucapan yang terdengar.", 400);
  }
  if (text.length > MAX_TEXT_CHARS) {
    return errorResponse("Teks terlalu panjang.", 413);
  }

  const completion = await chatCompletion(
    auth.apiKey,
    {
      model: GROQ_TEXT_MODEL,
      temperature: 0.3,
      max_completion_tokens: 300,
      response_format: { type: "json_schema", json_schema: RESULT_SCHEMA },
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: text },
      ],
    },
    {
      unreachable: "Tidak dapat menghubungi layanan AI.",
      rateLimited: "Terlalu banyak permintaan. Coba lagi sebentar lagi.",
      failed: "Gagal menganalisis ucapan. Coba lagi.",
    },
  );
  if ("response" in completion) return completion.response;

  const raw = completion.content;
  if (typeof raw !== "string") {
    return errorResponse("Respons AI tidak valid.", 502);
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
    return errorResponse("Respons AI tidak valid.", 502);
  }

  if (!result.isFood) {
    return errorResponse(
      "Sepertinya itu bukan deskripsi makanan. Coba ucapkan ulang, misal 'saya makan nasi dan ayam goreng'.",
      422,
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
