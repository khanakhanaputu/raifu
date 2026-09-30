import { createClient } from "@/lib/supabase/server";

const GROQ_URL = "https://api.groq.com/openai/v1/chat/completions";

export const GROQ_TEXT_MODEL = "openai/gpt-oss-20b";
export const GROQ_VISION_MODEL = "qwen/qwen3.8-27b";

type Failure = { response: Response };

type Messages = {
  unauthorized: string;
  unconfigured: string;
  unreachable: string;
  rateLimited: string;
  failed: string;
};

export function errorResponse(error: string, status: number) {
  return Response.json({ error }, { status });
}

export function clampInt(value: unknown, min: number, max: number) {
  const num = Math.round(Number(value));
  if (!Number.isFinite(num)) return min;
  return Math.min(max, Math.max(min, num));
}

export async function authorize(
  messages: Pick<Messages, "unauthorized" | "unconfigured">,
): Promise<{ apiKey: string } | Failure> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { response: errorResponse(messages.unauthorized, 401) };

  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) return { response: errorResponse(messages.unconfigured, 503) };

  return { apiKey };
}

export async function chatCompletion(
  apiKey: string,
  body: Record<string, unknown>,
  messages: Pick<Messages, "unreachable" | "rateLimited" | "failed">,
): Promise<{ content: unknown } | Failure> {
  let upstream: Response;
  try {
    upstream = await fetch(GROQ_URL, {
      method: "POST",
      headers: {
        "content-type": "application/json",
        authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify(body),
    });
  } catch {
    return { response: errorResponse(messages.unreachable, 502) };
  }

  if (upstream.status === 429) {
    return { response: errorResponse(messages.rateLimited, 429) };
  }
  if (!upstream.ok) {
    return { response: errorResponse(messages.failed, 502) };
  }

  const payload = await upstream.json().catch(() => null);
  return { content: payload?.choices?.[0]?.message?.content };
}
