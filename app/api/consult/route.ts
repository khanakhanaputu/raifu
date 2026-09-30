import { authorize, chatCompletion, errorResponse, GROQ_TEXT_MODEL } from "@/lib/groq";

export const dynamic = "force-dynamic";

const MAX_HISTORY_TURNS = 8;
const MAX_MESSAGE_CHARS = 1000;

type ChatTurn = { role: "user" | "assistant"; content: string };

function buildSystemPrompt(profile: {
  name: string;
  targetKcal: number;
  weightKg: number;
  goal: string;
}) {
  const goalLabel =
    profile.goal === "turun"
      ? "penurunan berat badan bertahap"
      : profile.goal === "naik"
        ? "peningkatan massa otot"
        : "pemeliharaan berat & vitalitas";

  return `Anda adalah Raifu Bot, asisten konsultasi gizi di aplikasi Raifu. Bicara dalam Bahasa Indonesia (istilah Inggris umum boleh dipakai), nada tenang, suportif, tidak menggurui — mengikuti filosofi Jepang Hara Hachi Bu (berhenti makan saat 80% kenyang) dan prinsip "no guilt tracking": jangan pernah membingkai kalori sebagai anggaran ketat yang harus ditakuti.

Konteks pengguna saat ini: nama ${profile.name || "Pengguna"}, target kalori harian ${profile.targetKcal} kkal, berat badan ${profile.weightKg} kg, tujuan ${goalLabel}. Gunakan angka ini jika relevan dengan pertanyaan, tapi jangan memaksakan jika pertanyaan tidak terkait.

Jawab ringkas (maksimal sekitar 120 kata, boleh pakai daftar bernomor singkat jika membantu). Untuk kondisi medis khusus, alergi akut, kehamilan, atau penyakit metabolik kronis, selalu arahkan untuk konsultasi dengan dokter/ahli gizi klinis — Anda bukan pengganti tenaga medis. Tolak sopan permintaan di luar topik gizi, pola makan, dan gaya hidup sehat.`;
}

export async function POST(request: Request) {
  const auth = await authorize({
    unauthorized: "Silakan masuk untuk memakai Konsultasi Bot.",
    unconfigured: "Fitur konsultasi AI belum dikonfigurasi di server.",
  });
  if ("response" in auth) return auth.response;

  const body = await request.json().catch(() => null);
  const message = body?.message as string | undefined;
  const history = Array.isArray(body?.history) ? (body.history as ChatTurn[]) : [];
  const profile = body?.profile ?? {};

  if (!message || typeof message !== "string" || !message.trim()) {
    return errorResponse("Pesan tidak boleh kosong.", 400);
  }
  if (message.length > MAX_MESSAGE_CHARS) {
    return errorResponse("Pesan terlalu panjang.", 413);
  }

  const trimmedHistory = history
    .filter(
      (turn): turn is ChatTurn =>
        turn &&
        (turn.role === "user" || turn.role === "assistant") &&
        typeof turn.content === "string" &&
        turn.content.length <= MAX_MESSAGE_CHARS,
    )
    .slice(-MAX_HISTORY_TURNS);

  const completion = await chatCompletion(
    auth.apiKey,
    {
      model: GROQ_TEXT_MODEL,
      temperature: 0.6,
      max_completion_tokens: 500,
      messages: [
        {
          role: "system",
          content: buildSystemPrompt({
            name: String(profile.name ?? ""),
            targetKcal: Number(profile.targetKcal) || 0,
            weightKg: Number(profile.weightKg) || 0,
            goal: String(profile.goal ?? "jaga"),
          }),
        },
        ...trimmedHistory,
        { role: "user", content: message },
      ],
    },
    {
      unreachable: "Tidak dapat menghubungi layanan AI.",
      rateLimited: "Terlalu banyak permintaan. Coba lagi sebentar lagi.",
      failed: "Gagal mendapat jawaban. Coba lagi.",
    },
  );
  if ("response" in completion) return completion.response;

  const answer = completion.content;
  if (typeof answer !== "string" || !answer.trim()) {
    return errorResponse("Respons AI tidak valid. Coba lagi.", 502);
  }

  return Response.json({ answer: answer.trim() });
}
