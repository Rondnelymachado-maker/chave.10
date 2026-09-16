import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export async function GET(request: Request) {
  const auth = request.headers.get("authorization");
  const expected = process.env.CRON_SECRET;

  if (expected && auth !== `Bearer ${expected}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !anonKey) {
    return NextResponse.json({ error: "Supabase configuration missing" }, { status: 500 });
  }

  const supabase = createClient(url, anonKey);
  const { error } = await supabase.rpc("enforce_trial_expiration");

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
