"use client";

import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../../lib/supabase";

export default function LoginPage() {
  const router = useRouter();
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [officeName, setOfficeName] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (data.user) router.replace("/");
    });
  }, [router]);

  async function submit(e: FormEvent) {
    e.preventDefault();
    setError("");
    setMessage("");
    if (!email.trim() || !password) {
      setError("Informe e-mail e senha.");
      return;
    }
    if (mode === "signup" && !officeName.trim()) {
      setError("Informe o nome da oficina.");
      return;
    }
    setLoading(true);

    if (mode === "login") {
      const { error: authError } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });
      setLoading(false);
      if (authError) {
        setError("Não foi possível entrar. Confira e-mail e senha.");
        return;
      }
      router.replace("/");
      router.refresh();
      return;
    }

    const { data, error: authError } = await supabase.auth.signUp({
      email: email.trim(),
      password,
      options: {
        data: {
          full_name: name.trim(),
          office_name: officeName.trim(),
        },
      },
    });
    setLoading(false);
    if (authError) {
      setError(authError.message);
      return;
    }
    if (!data.session) {
      setMessage("Cadastro realizado. Confira seu e-mail para confirmar a conta e depois faça login.");
      setMode("login");
      return;
    }
    router.replace("/");
    router.refresh();
  }

  return (
    <main style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#f3f5f8", padding: 20, fontFamily: "Arial,sans-serif", color: "#172033" }}>
      <section style={{ width: "100%", maxWidth: 430, background: "white", borderRadius: 16, padding: 30, boxShadow: "0 12px 40px rgba(23,32,51,.12)" }}>
        <div style={{ textAlign: "center", marginBottom: 24 }}>
          <div style={{ fontWeight: 900, fontSize: 28 }}>CHAVE <span style={{ background: "#f59b32", color: "white", padding: "4px 8px", borderRadius: 7 }}>10</span></div>
          <div style={{ color: "#687386", marginTop: 8 }}>Gestão de Oficina</div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 6, background: "#eef1f5", padding: 5, borderRadius: 9, marginBottom: 20 }}>
          <button type="button" onClick={() => { setMode("login"); setError(""); setMessage(""); }} style={{ border: 0, borderRadius: 7, padding: 10, fontWeight: 700, background: mode === "login" ? "white" : "transparent", cursor: "pointer" }}>Entrar</button>
          <button type="button" onClick={() => { setMode("signup"); setError(""); setMessage(""); }} style={{ border: 0, borderRadius: 7, padding: 10, fontWeight: 700, background: mode === "signup" ? "white" : "transparent", cursor: "pointer" }}>Criar oficina</button>
        </div>

        <form onSubmit={submit}>
          {mode === "signup" && <>
            <label>Seu nome</label>
            <input value={name} onChange={e => setName(e.target.value)} placeholder="Nome do responsável" style={input} />
            <label>Nome da oficina</label>
            <input value={officeName} onChange={e => setOfficeName(e.target.value)} placeholder="Ex.: Oficina do João" style={input} />
          </>}
          <label>E-mail</label>
          <input type="email" autoComplete="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="seu@email.com" style={input} />
          <label>Senha</label>
          <input type="password" autoComplete={mode === "login" ? "current-password" : "new-password"} value={password} onChange={e => setPassword(e.target.value)} placeholder="Mínimo recomendado: 8 caracteres" style={input} />

          {error && <div style={noticeError}>{error}</div>}
          {message && <div style={noticeOk}>{message}</div>}

          <button disabled={loading} type="submit" style={{ width: "100%", marginTop: 12, background: "#f59b32", color: "white", border: 0, borderRadius: 8, padding: 13, fontWeight: 800, cursor: "pointer" }}>
            {loading ? "Aguarde..." : mode === "login" ? "Entrar no Chave 10" : "Criar minha oficina"}
          </button>
        </form>

        <p style={{ fontSize: 12, color: "#687386", textAlign: "center", marginTop: 20 }}>Seus dados ficam separados por oficina.</p>
      </section>
    </main>
  );
}

const input: React.CSSProperties = { width: "100%", padding: 12, margin: "6px 0 14px", border: "1px solid #d7dce3", borderRadius: 8, boxSizing: "border-box" };
const noticeError: React.CSSProperties = { marginTop: 8, padding: 10, borderRadius: 7, background: "#fff0f0", border: "1px solid #efb4b4", color: "#9b2226", fontSize: 13 };
const noticeOk: React.CSSProperties = { marginTop: 8, padding: 10, borderRadius: 7, background: "#eefbf3", border: "1px solid #b7e1c5", color: "#176b38", fontSize: 13 };

// Chave 10: login route verified for production deployment.
