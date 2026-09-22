"use client";

import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";

const MERCADO_PAGO_SUBSCRIPTION_URL = "https://mpago.la/18fhBWP";

export default function AssinaturaPage() {
  const [loading,setLoading]=useState(true);
  const [status,setStatus]=useState("");
  const [subscription,setSubscription]=useState<any>(null);
  const [error,setError]=useState("");

  async function load() {
    setLoading(true); setError("");
    const { data:user } = await supabase.auth.getUser();
    if (!user.user) { setError("Faça login no Chave 10 para continuar."); setLoading(false); return; }
    const { data:profile } = await supabase.from("user_profiles").select("office_id").eq("user_id",user.user.id).single();
    if (!profile?.office_id) { setError("Oficina não encontrada."); setLoading(false); return; }
    const { data } = await supabase.from("office_subscriptions").select("status,trial_ends_at,current_period_end,payment_method,checkout_status,provider_subscription_id,plans(name,price_monthly)").eq("office_id",profile.office_id).order("created_at",{ascending:false}).limit(1).maybeSingle();
    setSubscription(data);
    setLoading(false);
  }

  function subscribe() {
    window.location.href = MERCADO_PAGO_SUBSCRIPTION_URL;
  }

  useEffect(()=>{const params=new URLSearchParams(window.location.search);setStatus(params.get("status")||"");load();},[]);

  if(loading) return <main style={{padding:30,fontFamily:"Arial"}}>Carregando assinatura...</main>;

  return <main style={{minHeight:"100vh",background:"#f5f7fa",padding:"30px 18px",fontFamily:"Arial"}}>
    <div style={{maxWidth:560,margin:"0 auto"}}>
      <div style={{background:"#172033",color:"#fff",borderRadius:18,padding:24,marginBottom:18}}>
        <div style={{fontSize:14,opacity:.8}}>CHAVE 10</div>
        <h1 style={{margin:"8px 0",fontSize:28}}>Plano de gestão para oficina</h1>
        <div style={{fontSize:34,fontWeight:800}}>R$ 29,99 <span style={{fontSize:15,fontWeight:400}}>/ mês</span></div>
      </div>
      {status==="return" && <div style={{background:"#e9f8ef",padding:14,borderRadius:10,marginBottom:14}}>Retornamos do Mercado Pago. O status será atualizado após a confirmação.</div>}
      {status==="already_started" && <div style={{background:"#fff4dd",padding:14,borderRadius:10,marginBottom:14}}>Já existe um checkout de assinatura iniciado para esta oficina.</div>}
      {error && <div style={{background:"#fdecec",color:"#9b1c1c",padding:14,borderRadius:10,marginBottom:14}}>{error}</div>}
      <div style={{background:"#fff",borderRadius:18,padding:24,boxShadow:"0 5px 20px rgba(0,0,0,.06)"}}>
        <h2 style={{marginTop:0}}>Assinatura Chave 10</h2>
        <p>Pagamento pelo Mercado Pago.</p>
        <ul style={{lineHeight:1.8,paddingLeft:22}}>
          <li>Clientes e veículos</li><li>Orçamentos e PDF</li><li>Ordens de serviço</li><li>Estoque</li><li>Financeiro</li>
          <li><b>Pagamento recorrente pelo Mercado Pago</b></li>
        </ul>
        {subscription?.status==="active" ? <div style={{background:"#e9f8ef",padding:16,borderRadius:10,fontWeight:700}}>Assinatura ativa ✓</div> :
        <button onClick={subscribe} style={{width:"100%",padding:15,border:0,borderRadius:10,background:"#009ee3",color:"#fff",fontSize:17,fontWeight:700,cursor:"pointer"}}>Assinar por R$ 29,99/mês</button>}
        <p style={{fontSize:12,color:"#687386",marginTop:16}}>O pagamento e a cobrança recorrente são processados pelo Mercado Pago. O Chave 10 não armazena dados de cartão.</p>
      </div>
    </div>
  </main>;
}
