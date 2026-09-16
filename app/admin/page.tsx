"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../../lib/supabase";

type Plan = { id: string; name: string; slug: string; price_monthly: number };
type Office = {
  id: string;
  name: string;
  created_at: string;
  subscription_status: string;
  trial_ends_at: string | null;
  plan_id: string | null;
  plan_name: string | null;
  plan_price_monthly: number | null;
};

const statuses = ["trial", "active", "past_due", "suspended", "canceled"];

export default function AdminPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [authorized, setAuthorized] = useState(false);
  const [offices, setOffices] = useState<Office[]>([]);
  const [plans, setPlans] = useState<Plan[]>([]);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState("");

  async function loadData() {
    const [{ data: officesData, error: officesError }, { data: plansData, error: plansError }] = await Promise.all([
      supabase.rpc("admin_list_offices"),
      supabase.from("plans").select("id,name,slug,price_monthly").eq("is_active", true).order("price_monthly")
    ]);
    if (officesError || plansError) {
      setError("Não foi possível carregar oficinas e planos.");
      return;
    }
    setOffices((officesData ?? []) as Office[]);
    setPlans((plansData ?? []) as Plan[]);
  }

  useEffect(() => {
    async function load() {
      const { data: userData } = await supabase.auth.getUser();
      if (!userData.user) {
        router.replace("/login?next=/admin");
        return;
      }

      const { data: profile, error: profileError } = await supabase
        .from("user_profiles")
        .select("role,is_active")
        .eq("user_id", userData.user.id)
        .maybeSingle();

      if (profileError || !profile || profile.role !== "admin" || !profile.is_active) {
        setAuthorized(false);
        setError("Acesso restrito ao administrador do Chave 10.");
        setLoading(false);
        return;
      }

      setAuthorized(true);
      await loadData();
      setLoading(false);
    }
    load();
  }, [router]);

  async function saveSubscription(office: Office, planId: string, status: string) {
    setSaving(office.id);
    setError("");
    const { error: updateError } = await supabase
      .from("office_subscriptions")
      .update({ plan_id: planId, status, updated_at: new Date().toISOString() })
      .eq("office_id", office.id);
    if (updateError) {
      setError("Não foi possível atualizar a assinatura de " + office.name + ".");
      setSaving("");
      return;
    }
    await loadData();
    setSaving("");
  }

  if (loading) {
    return <main style={page}><section style={card}>Carregando área administrativa...</section></main>;
  }

  if (!authorized) {
    return (
      <main style={page}>
        <section style={card}>
          <div style={brand}>CHAVE <span>10</span></div>
          <h1 style={{ marginBottom: 8 }}>Área administrativa</h1>
          <p style={muted}>{error}</p>
          <button onClick={() => router.replace("/")} style={button}>Voltar ao sistema</button>
        </section>
      </main>
    );
  }

  return (
    <main style={page}>
      <section style={{ ...card, maxWidth: 1050 }}>
        <div style={brand}>CHAVE <span>10</span></div>
        <h1 style={{ margin: "18px 0 6px" }}>Administração</h1>
        <p style={muted}>Oficinas, planos e assinaturas da plataforma</p>
        {error && <div style={alert}>{error}</div>}

        <div style={stats}><strong>{offices.length}</strong><span>oficinas cadastradas</span></div>

        <h2 style={{ margin: "28px 0 10px" }}>Planos disponíveis</h2>
        <div style={planGrid}>
          {plans.map((plan) => (
            <div key={plan.id} style={planCard}>
              <strong>{plan.name}</strong>
              <div style={{ fontSize: 22, marginTop: 6 }}>R$ {Number(plan.price_monthly).toFixed(2).replace(".", ",")}/mês</div>
            </div>
          ))}
        </div>

        <h2 style={{ margin: "28px 0 10px" }}>Assinaturas</h2>
        <div style={{ overflowX: "auto" }}>
          {offices.length === 0 ? <p style={muted}>Nenhuma oficina cadastrada.</p> : offices.map((office) => (
            <div key={office.id} style={row}>
              <div style={{ minWidth: 210 }}>
                <strong>{office.name}</strong>
                <div style={small}>Cadastro: {new Date(office.created_at).toLocaleDateString("pt-BR")}</div>
                {office.trial_ends_at && <div style={small}>Teste até: {new Date(office.trial_ends_at).toLocaleDateString("pt-BR")}</div>}
              </div>
              <div style={controls}>
                <select value={office.plan_id ?? ""} onChange={(e) => {
                  const planId = e.target.value;
                  if (planId) saveSubscription(office, planId, office.subscription_status);
                }} style={select} disabled={saving === office.id}>
                  <option value="">Plano</option>
                  {plans.map((plan) => <option key={plan.id} value={plan.id}>{plan.name}</option>)}
                </select>
                <select value={office.subscription_status} onChange={(e) => {
                  if (office.plan_id) saveSubscription(office, office.plan_id, e.target.value);
                }} style={select} disabled={saving === office.id || !office.plan_id}>
                  {statuses.map((status) => <option key={status} value={status}>{status}</option>)}
                </select>
                {office.plan_name && <span style={small}>R$ {Number(office.plan_price_monthly ?? 0).toFixed(2).replace(".", ",")}</span>}
                {saving === office.id && <span style={small}>Salvando...</span>}
              </div>
            </div>
          ))}
        </div>

        <button onClick={() => router.replace("/")} style={{ ...button, marginTop: 24 }}>Voltar ao sistema</button>
      </section>
    </main>
  );
}

const page: React.CSSProperties = { minHeight: "100vh", background: "#f3f5f8", padding: 24, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "Arial,sans-serif", color: "#172033" };
const card: React.CSSProperties = { width: "100%", maxWidth: 520, background: "white", borderRadius: 16, padding: 30, boxShadow: "0 12px 40px rgba(23,32,51,.12)" };
const brand: React.CSSProperties = { fontWeight: 900, fontSize: 26 };
const button: React.CSSProperties = { border: 0, borderRadius: 8, padding: "12px 16px", background: "#f59b32", color: "white", fontWeight: 800, cursor: "pointer" };
const muted: React.CSSProperties = { color: "#687386" };
const small: React.CSSProperties = { fontSize: 12, color: "#687386", marginTop: 4 };
const stats: React.CSSProperties = { marginTop: 20, padding: 18, borderRadius: 10, background: "#f5f7fa", display: "flex", alignItems: "baseline", gap: 8 };
const row: React.CSSProperties = { display: "flex", justifyContent: "space-between", alignItems: "center", gap: 20, padding: "15px 0", borderBottom: "1px solid #e5e8ed" };
const controls: React.CSSProperties = { display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap", justifyContent: "flex-end" };
const select: React.CSSProperties = { border: "1px solid #d8dde5", borderRadius: 8, padding: "10px 12px", background: "white", color: "#172033" };
const planGrid: React.CSSProperties = { display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(180px,1fr))", gap: 12 };
const planCard: React.CSSProperties = { border: "1px solid #e5e8ed", borderRadius: 10, padding: 16, background: "#fafbfc" };
const alert: React.CSSProperties = { marginTop: 16, padding: 12, borderRadius: 8, background: "#fff1f0", color: "#a33" };
