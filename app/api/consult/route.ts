import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

// 20B, bukan 120B: tugasnya QA gizi singkat berbahasa Indonesia dengan
// system prompt ketat, bukan reasoning kompleks — 20B cukup, separuh biaya
// ($0.075/$0.30 per 1M token vs $0.15/$0.60), dan lebih cepat.
const GROQ_TEXT_MODEL = "openai/gpt-oss-20b";
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
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return Response.json({ error: "Silakan masuk untuk memakai Konsultasi Bot." }, { status: 401 });
  }

  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) {
    return Response.json({ error: "Fitur konsultasi AI belum dikonfigurasi di server." }, { status: 503 });
  }

  const body = await request.json().catch(() => null);
  const message = body?.message as string | undefined;
  const history = Array.isArray(body?.history) ? (body.history as ChatTurn[]) : [];
  const profile = body?.profile ?? {};

  if (!message || typeof message !== "string" || !message.trim()) {
    return Response.json({ error: "Pesan tidak boleh kosong." }, { status: 400 });
  }
  if (message.length > MAX_MESSAGE_CHARS) {
    return Response.json({ error: "Pesan terlalu panjang." }, { status: 413 });
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
      }),
    });
  } catch {
    return Response.json({ error: "Tidak dapat menghubungi layanan AI." }, { status: 502 });
  }

  if (upstream.status === 429) {
    return Response.json({ error: "Terlalu banyak permintaan. Coba lagi sebentar lagi." }, { status: 429 });
  }
  if (!upstream.ok) {
    return Response.json({ error: "Gagal mendapat jawaban. Coba lagi." }, { status: 502 });
  }

  const payload = await upstream.json().catch(() => null);
  const answer = payload?.choices?.[0]?.message?.content;
  if (typeof answer !== "string" || !answer.trim()) {
    return Response.json({ error: "Respons AI tidak valid. Coba lagi." }, { status: 502 });
  }

  return Response.json({ answer: answer.trim() });
}
