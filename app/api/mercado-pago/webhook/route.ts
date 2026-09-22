import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const type = body?.type || body?.topic;
    const id = String(body?.data?.id || body?.id || "");
    if (!id) return NextResponse.json({ received: true });

    const mpToken = process.env.MERCADOPAGO_ACCESS_TOKEN;
    if (!mpToken) return NextResponse.json({ received: true });

    if (type === "subscription_preapproval") {
      const response = await fetch(`https://api.mercadopago.com/preapproval/${encodeURIComponent(id)}`, {
        headers: { Authorization: `Bearer ${mpToken}` }
      });
      const subscription = await response.json();
      if (!response.ok) return NextResponse.json({ received: true });

      const reference = String(subscription?.external_reference || "");
      const officeId = reference.startsWith("chave10:") ? reference.slice(9) : "";
      if (!officeId) return NextResponse.json({ received: true });

      const mpStatus = String(subscription?.status || "").toLowerCase();
      const active = ["authorized","active"].includes(mpStatus);
      const status = active ? "active" : mpStatus === "cancelled" || mpStatus === "canceled" ? "canceled" : "pending";

      const periodStart = subscription?.date_created || new Date().toISOString();
      const periodEnd = subscription?.next_payment_date || null;

      await supabaseAdmin.from("office_subscriptions").update({
        status,
        checkout_status: mpStatus,
        provider: "mercado_pago",
        provider_subscription_id: String(subscription.id),
        current_period_start: periodStart,
        current_period_end: periodEnd,
        updated_at: new Date().toISOString()
      }).eq("office_id", officeId).eq("provider_subscription_id", String(subscription.id));

      if (active) {
        await supabaseAdmin.from("offices").update({ subscription_status: "active" }).eq("id", officeId);
      } else if (status === "canceled") {
        await supabaseAdmin.from("offices").update({ subscription_status: "canceled" }).eq("id", officeId);
      }
    }

    return NextResponse.json({ received: true });
  } catch {
    return NextResponse.json({ received: true });
  }
}

export async function GET() {
  return NextResponse.json({ ok: true, service: "chave10-mercadopago-webhook" });
}
