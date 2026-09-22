import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

function getSupabaseAdmin() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) throw new Error("Supabase server credentials are not configured.");
  return createClient(url, key);
}

export async function POST(req: NextRequest) {
  try {
    const token = req.headers.get("authorization")?.replace(/^Bearer\s+/i, "");
    if (!token) return NextResponse.json({ error: "Sessão não informada." }, { status: 401 });

    const { data: userData, error: userError } = await getSupabaseAdmin().auth.getUser(token);
    if (userError || !userData.user) return NextResponse.json({ error: "Sessão inválida." }, { status: 401 });

    const { data: profile, error: profileError } = await getSupabaseAdmin()
      .from("user_profiles").select("office_id").eq("user_id", userData.user.id).single();
    if (profileError || !profile?.office_id) return NextResponse.json({ error: "Oficina não encontrada." }, { status: 404 });

    const { data: plan, error: planError } = await getSupabaseAdmin()
      .from("plans").select("id,name,price_monthly").eq("slug","chave-10").eq("is_active",true).single();
    if (planError || !plan) return NextResponse.json({ error: "Plano Chave 10 não encontrado." }, { status: 404 });

    const { data: existing } = await getSupabaseAdmin()
      .from("office_subscriptions").select("id,status,provider_subscription_id")
      .eq("office_id", profile.office_id)
      .in("status", ["pending","authorized","active","trial"])
      .order("created_at",{ascending:false}).limit(1).maybeSingle();

    if (existing?.provider_subscription_id && ["pending","authorized","active"].includes(existing.status)) {
      const base = process.env.NEXT_PUBLIC_APP_URL || req.nextUrl.origin;
      return NextResponse.json({ checkoutUrl: `${base}/assinatura?status=already_started` });
    }

    const mpToken = process.env.MERCADOPAGO_ACCESS_TOKEN;
    if (!mpToken) return NextResponse.json({ error: "Mercado Pago ainda não está configurado no servidor." }, { status: 503 });

    const officeId = profile.office_id as string;
    const email = userData.user.email;
    if (!email) return NextResponse.json({ error: "O usuário precisa ter um e-mail cadastrado." }, { status: 400 });

    const base = process.env.NEXT_PUBLIC_APP_URL || req.nextUrl.origin;
    const externalReference = `chave10:${officeId}`;
    const mpResponse = await fetch("https://api.mercadopago.com/preapproval", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${mpToken}` },
      body: JSON.stringify({
        reason: "Chave 10 - Gestão de Oficina",
        external_reference: externalReference,
        payer_email: email,
        auto_recurring: { frequency: 1, frequency_type: "months", transaction_amount: Number(plan.price_monthly), currency_id: "BRL" },
        back_url: `${base}/assinatura?status=return`,
        status: "pending"
      })
    });

    const mp = await mpResponse.json();
    if (!mpResponse.ok || !mp?.id || !mp?.init_point) {
      return NextResponse.json({ error: mp?.message || "Mercado Pago não criou a assinatura.", details: mp }, { status: 502 });
    }

    const now = new Date().toISOString();
    const { error: saveError } = await getSupabaseAdmin().from("office_subscriptions").upsert({
      office_id: officeId,
      plan_id: plan.id,
      status: "pending",
      provider: "mercado_pago",
      provider_customer_id: String(mp.payer_id || ""),
      provider_subscription_id: String(mp.id),
      payment_method: "pix_or_card",
      checkout_status: "pending",
      updated_at: now
    }, { onConflict: "office_id" });

    if (saveError) return NextResponse.json({ error: saveError.message }, { status: 500 });

    return NextResponse.json({ checkoutUrl: mp.init_point });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Erro inesperado." }, { status: 500 });
  }
}
