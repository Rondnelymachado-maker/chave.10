"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { supabase } from "../lib/supabase";

export default function AuthGate({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [checking, setChecking] = useState(!pathname.startsWith("/login"));
  const [user, setUser] = useState<unknown>(null);
  const [accessBlocked, setAccessBlocked] = useState(false);
  const [trialEndsAt, setTrialEndsAt] = useState<string | null>(null);

  useEffect(() => {
    if (pathname.startsWith("/login")) {
      setChecking(false);
      return;
    }

    let active = true;

    async function checkAccess() {
      const { data } = await supabase.auth.getUser();
      if (!active) return;

      if (!data.user) {
        router.replace(`/login?next=${encodeURIComponent(pathname)}`);
        return;
      }

      setUser(data.user);

      // O RPC também converte um trial vencido para "suspended" antes de responder.
      const { data: access, error } = await supabase.rpc("get_my_office_access");
      if (!active) return;

      if (error) {
        // Em caso de falha transitória, não bloqueia uma conta já autenticada.
        setChecking(false);
        return;
      }

      const row = Array.isArray(access) ? access[0] : access;
      setTrialEndsAt(row?.trial_ends_at ?? null);

      // O administrador geral continua podendo entrar no painel Admin.
      const { data: profile } = await supabase
        .from("user_profiles")
        .select("role,is_active")
        .eq("user_id", data.user.id)
        .maybeSingle();

      const isAdmin = profile?.role === "admin" && profile?.is_active === true;
      const hasAccess = row?.has_access === true;

      if (!hasAccess && !isAdmin) {
        setAccessBlocked(true);
      }

      setChecking(false);
    }

    checkAccess();

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!session?.user && !pathname.startsWith("/login")) router.replace("/login");
      else if (session?.user) setUser(session.user);
    });

    return () => {
      active = false;
      listener.subscription.unsubscribe();
    };
  }, [pathname, router]);

  async function signOut() {
    await supabase.auth.signOut();
    router.replace("/login");
  }

  if (pathname.startsWith("/login")) return <>{children}</>;
  if (checking || !user) {
    return <main style={{ minHeight: "100vh", display: "grid", placeItems: "center", fontFamily: "Arial", color: "#172033" }}>Verificando acesso ao Chave 10...</main>;
  }

  if (accessBlocked) {
    const formattedTrial = trialEndsAt
      ? new Date(trialEndsAt).toLocaleDateString("pt-BR")
      : null;

    return (
      <main style={{ minHeight: "100vh", display: "grid", placeItems: "center", padding: 24, background: "#f6f7fb", fontFamily: "Arial", color: "#172033" }}>
        <section style={{ width: "100%", maxWidth: 520, background: "white", borderRadius: 16, padding: 32, textAlign: "center", boxShadow: "0 10px 35px rgba(0,0,0,.10)" }}>
          <div style={{ fontSize: 42, marginBottom: 12 }}>🔒</div>
          <h1 style={{ margin: "0 0 10px" }}>Acesso suspenso</h1>
          <p style={{ margin: "0 0 10px", lineHeight: 1.6 }}>
            O período de teste do Chave 10 terminou e não há uma assinatura ativa para esta oficina.
          </p>
          {formattedTrial && <p style={{ margin: "0 0 22px", color: "#667085" }}>Fim do teste: {formattedTrial}</p>}
          <p style={{ margin: "0 0 24px", lineHeight: 1.6 }}>Entre em contato com o suporte para ativar um plano e recuperar o acesso aos seus dados.</p>
          <button type="button" onClick={signOut} style={{ background: "#172033", color: "white", border: 0, borderRadius: 8, padding: "11px 18px", fontWeight: 700, cursor: "pointer" }}>Sair</button>
        </section>
      </main>
    );
  }

  return <>{children}<button type="button" onClick={signOut} style={{ position: "fixed", right: 18, bottom: 18, zIndex: 10000, background: "#172033", color: "white", border: 0, borderRadius: 8, padding: "10px 14px", fontWeight: 700, boxShadow: "0 5px 18px rgba(0,0,0,.18)", cursor: "pointer" }}>Sair</button></>;
}
