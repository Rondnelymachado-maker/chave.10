"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { supabase } from "../../../lib/supabase";

export default function CadastroVendasPage(){
  const [officeName,setOfficeName]=useState("");
  const [ownerName,setOwnerName]=useState("");
  const [email,setEmail]=useState("");
  const [phone,setPhone]=useState("");
  const [loading,setLoading]=useState(false);
  const [sent,setSent]=useState(false);
  const [error,setError]=useState("");

  async function submit(e:FormEvent){
    e.preventDefault();
    setError("");
    if(!officeName.trim()||!ownerName.trim()||!email.trim()){
      setError("Preencha o nome da oficina, responsável e e-mail.");
      return;
    }
    setLoading(true);
    const {error:e2}=await supabase.from("sales_leads").insert({office_name:officeName.trim(),owner_name:ownerName.trim(),email:email.trim().toLowerCase(),phone:phone.trim()||null,plan_interest:"basico",source:"pagina_vendas",status:"novo"});
    setLoading(false);
    if(e2){setError("Não foi possível enviar seu cadastro agora. Tente novamente.");return;}
    setSent(true);
  }

  if(sent) return <main style={page}><section style={card}><div style={brand}>CHAVE <span>10</span></div><div style={successIcon}>✓</div><h1 style={{marginBottom:8}}>Cadastro recebido!</h1><p style={muted}>Recebemos os dados da sua oficina. Em breve entraremos em contato para liberar o acesso ao Chave 10.</p><Link href="/vendas" style={button}>Voltar para a página de vendas</Link></section></main>;

  return <main style={page}><section style={card}>
    <Link href="/vendas" style={{textDecoration:"none",color:"#687386",fontWeight:700}}>← Voltar para vendas</Link>
    <div style={{...brand,marginTop:22}}>CHAVE <span>10</span></div>
    <h1 style={{fontSize:32,margin:"18px 0 8px"}}>Comece seu teste</h1>
    <p style={muted}>Deixe seus dados e solicite o acesso ao Chave 10 para sua oficina.</p>
    {error&&<div style={alert}>{error}</div>}
    <form onSubmit={submit} style={{display:"grid",gap:13,marginTop:22}}>
      <label>Nome da oficina<input value={officeName} onChange={e=>setOfficeName(e.target.value)} placeholder="Ex.: Oficina Machado" style={input}/></label>
      <label>Responsável<input value={ownerName} onChange={e=>setOwnerName(e.target.value)} placeholder="Seu nome" style={input}/></label>
      <label>E-mail<input type="email" value={email} onChange={e=>setEmail(e.target.value)} placeholder="voce@oficina.com" style={input}/></label>
      <label>WhatsApp <span style={{fontWeight:400,color:"#687386"}}>(opcional)</span><input value={phone} onChange={e=>setPhone(e.target.value)} placeholder="(85) 99999-9999" style={input}/></label>
      <div style={{background:"#f7f8fa",borderRadius:9,padding:12,fontSize:12,color:"#687386"}}>Plano Básico • R$ 29,99/mês • 14 dias de teste</div>
      <button disabled={loading} type="submit" style={button}>{loading?"Enviando...":"Solicitar meu teste grátis"}</button>
    </form>
    <p style={{fontSize:11,color:"#8a94a3",lineHeight:1.5,marginTop:16}}>Seus dados serão usados para contato comercial e ativação do acesso solicitado.</p>
  </section></main>;
}

const page:React.CSSProperties={minHeight:"100vh",background:"#f3f5f8",padding:20,display:"flex",alignItems:"center",justifyContent:"center",fontFamily:"Arial,sans-serif",color:"#172033"};
const card:React.CSSProperties={width:"100%",maxWidth:520,background:"white",borderRadius:18,padding:30,boxShadow:"0 12px 40px rgba(23,32,51,.12)"};
const brand:React.CSSProperties={fontWeight:900,fontSize:26};
const muted:React.CSSProperties={color:"#687386",lineHeight:1.55};
const input:React.CSSProperties={display:"block",width:"100%",boxSizing:"border-box",padding:12,marginTop:6,border:"1px solid #d7dce3",borderRadius:8,background:"white"};
const button:React.CSSProperties={display:"block",width:"100%",boxSizing:"border-box",textAlign:"center",border:0,borderRadius:9,padding:14,background:"#f59b32",color:"white",fontWeight:900,textDecoration:"none",cursor:"pointer",marginTop:4};
const alert:React.CSSProperties={marginTop:16,padding:11,borderRadius:8,background:"#fff0f0",border:"1px solid #efb4b4",color:"#9b2226",fontSize:13};
const successIcon:React.CSSProperties={width:54,height:54,borderRadius:"50%",background:"#e8f7ee",color:"#147a3d",display:"grid",placeItems:"center",fontSize:30,fontWeight:900,marginTop:25};
