"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../../lib/supabase";

type Office = { id: string; name: string; created_at: string };

export default function AdminPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [authorized, setAuthorized] = useState(false);
  const [offices, setOffices] = useState<Office[]>([]);
  const [error, setError] = useState("");

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

      const { data, error: officesError } = await supabase.rpc("admin_list_offices");
      if (officesError) {
        setError("Não foi possível carregar as oficinas.");
        setLoading(false);
        return;
      }

      setAuthorized(true);
      setOffices((data ?? []) as Office[]);
      setLoading(false);
    }
    load();
  }, [router]);

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
      <section style={{ ...card, maxWidth: 820 }}>
        <div style={brand}>CHAVE <span>10</span></div>
        <h1 style={{ margin: "18px 0 6px" }}>Administração</h1>
        <p style={muted}>Oficinas cadastradas na plataforma</p>
        <div style={stats}><strong>{offices.length}</strong><span>oficinas</span></div>
        <div style={{ marginTop: 24 }}>
          {offices.length === 0 ? <p style={muted}>Nenhuma oficina cadastrada.</p> : offices.map((office) => (
            <div key={office.id} style={row}>
              <div><strong>{office.name}</strong><div style={small}>ID: {office.id}</div></div>
              <div style={small}>{new Date(office.created_at).toLocaleDateString("pt-BR")}</div>
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
const stats: React.CSSProperties = { marginTop: 20, padding: 18, borderRadius: 10, background: "#f5f7fa", display: "flex", alignItems: "baseline", gap: 8 };
const row: React.CSSProperties = { display: "flex", justifyContent: "space-between", gap: 20, padding: "15px 0", borderBottom: "1px solid #e5e8ed" };
const small: React.CSSProperties = { fontSize: 12, color: "#687386", marginTop: 4 };
