import { createClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return Response.json({ error: "Belum masuk." }, { status: 401 });
  }

  const body = await request.json().catch(() => null);
  const endpoint = body?.endpoint as string | undefined;

  if (!endpoint) {
    return Response.json({ error: "Endpoint tidak ditemukan." }, { status: 400 });
  }

  const { error } = await supabase
    .from("push_subscriptions")
    .delete()
    .eq("endpoint", endpoint)
    .eq("user_id", user.id);

  if (error) {
    return Response.json({ error: "Gagal menghapus subscription." }, { status: 500 });
  }

  return Response.json({ ok: true });
}
