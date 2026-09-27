import webpush from "web-push";
import { createAdminClient } from "@/lib/supabase/admin";
import { reminderMeta } from "@/lib/reminders";
import type { ReminderId } from "@/lib/store-types";

export const dynamic = "force-dynamic";

const VALID_TYPES: ReminderId[] = ["sarapan", "siang", "malam", "streak", "hidrasi"];

export async function GET(request: Request) {
  const authHeader = request.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const type = new URL(request.url).searchParams.get("type") as ReminderId | null;
  if (!type || !VALID_TYPES.includes(type)) {
    return Response.json({ error: "Parameter type tidak valid." }, { status: 400 });
  }

  webpush.setVapidDetails(
    process.env.VAPID_SUBJECT!,
    process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!,
    process.env.VAPID_PRIVATE_KEY!,
  );

  const supabase = createAdminClient();

  const { data: enabledReminders, error: remindersError } = await supabase
    .from("reminders")
    .select("user_id")
    .eq("reminder_id", type)
    .eq("enabled", true);

  if (remindersError) {
    return Response.json({ error: remindersError.message }, { status: 500 });
  }

  const userIds = (enabledReminders ?? []).map((row) => row.user_id as string);
  if (userIds.length === 0) {
    return Response.json({ sent: 0, type });
  }

  const { data: subscriptions, error: subscriptionsError } = await supabase
    .from("push_subscriptions")
    .select("id, endpoint, p256dh, auth")
    .in("user_id", userIds);

  if (subscriptionsError) {
    return Response.json({ error: subscriptionsError.message }, { status: 500 });
  }

  const meta = reminderMeta(type);
  const payload = JSON.stringify({
    title: meta.label,
    body: meta.description,
    url: "/dashboard",
  });

  const results = await Promise.allSettled(
    (subscriptions ?? []).map(async (sub) => {
      try {
        await webpush.sendNotification(
          { endpoint: sub.endpoint, keys: { p256dh: sub.p256dh, auth: sub.auth } },
          payload,
        );
      } catch (err) {
        const statusCode = (err as { statusCode?: number }).statusCode;
        if (statusCode === 404 || statusCode === 410) {
          await supabase.from("push_subscriptions").delete().eq("id", sub.id);
        }
        throw err;
      }
    }),
  );

  const sent = results.filter((result) => result.status === "fulfilled").length;

  return Response.json({ sent, type });
}
