"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { supabase } from "../lib/supabase";

export default function AuthGate({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [checking, setChecking] = useState(!pathname.startsWith("/login"));
  const [user, setUser] = useState<unknown>(null);

  useEffect(() => {
    if (pathname.startsWith("/login")) {
      setChecking(false);
      return;
    }
    let active = true;
    supabase.auth.getUser().then(({ data }) => {
      if (!active) return;
      if (!data.user) {
        router.replace(`/login?next=${encodeURIComponent(pathname)}`);
        return;
      }
      setUser(data.user);
      setChecking(false);
    });
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
  if (checking || !user) return <main style={{ minHeight: "100vh", display: "grid", placeItems: "center", fontFamily: "Arial", color: "#172033" }}>Verificando acesso ao Chave 10...</main>;

  return <>{children}<button type="button" onClick={signOut} style={{ position: "fixed", right: 18, bottom: 18, zIndex: 10000, background: "#172033", color: "white", border: 0, borderRadius: 8, padding: "10px 14px", fontWeight: 700, boxShadow: "0 5px 18px rgba(0,0,0,.18)", cursor: "pointer" }}>Sair</button></>;
}
