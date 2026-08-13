"use client";

import { useEffect, useMemo, useState } from "react";
import { supabase } from "../../lib/supabase";

type Order={id:string;number:string;client_id:string;vehicle_id:string|null;description:string|null;status:string;labor:number;parts:number;discount:number;total:number;created_at:string};
type Client={id:string;name:string};
const brl=(n:number)=>`R$ ${Number(n||0).toLocaleString("pt-BR",{minimumFractionDigits:2})}`;
const date=(v:string)=>new Date(v).toLocaleDateString("pt-BR");

export default function Financeiro(){
 const[orders,setOrders]=useState<Order[]>([]),[clients,setClients]=useState<Client[]>([]),[loading,setLoading]=useState(true),[error,setError]=useState(""),[filter,setFilter]=useState("todos");
 useEffect(()=>{(async()=>{setLoading(true);const{data:offices,error:oe}=await supabase.from("offices").select("id").limit(1);if(oe||!offices?.[0]){setError(oe?.message||"Nenhuma oficina encontrada.");setLoading(false);return}const id=offices[0].id;const[o,c]=await Promise.all([supabase.from("service_orders").select("id,number,client_id,vehicle_id,description,status,labor,parts,discount,total,created_at").eq("office_id",id).order("created_at",{ascending:false}),supabase.from("clients").select("id,name").eq("office_id",id)]);if(o.error||c.error)setError(o.error?.message||c.error?.message||"Erro ao carregar financeiro.");setOrders(o.data||[]);setClients(c.data||[]);setLoading(false)})()},[]);
 const cn=(id:string)=>clients.find(c=>c.id===id)?.name||"—";
 const completed=orders.filter(o=>o.status==="Concluída"||o.status==="Entregue");
 const active=orders.filter(o=>o.status==="Aberta"||o.status==="Em andamento");
 const canceled=orders.filter(o=>o.status==="Cancelada");
 const revenue=completed.reduce((s,o)=>s+Number(o.total||0),0);
 const pending=active.reduce((s,o)=>s+Number(o.total||0),0);
 const labor=completed.reduce((s,o)=>s+Number(o.labor||0),0);
 const parts=completed.reduce((s,o)=>s+Number(o.parts||0),0);
 const discounts=completed.reduce((s,o)=>s+Number(o.discount||0),0);
 const visible=useMemo(()=>filter==="todos"?orders:filter==="recebido"?completed:filter==="pendente"?active:canceled,[orders,filter]);
 if(loading)return <main style={{padding:40,fontFamily:"Arial"}}>Carregando financeiro...</main>;
 return <main style={{minHeight:"100vh",background:"#f5f7fa",fontFamily:"Arial,sans-serif",color:"#172033",padding:28}}><div style={{maxWidth:1100,margin:"0 auto"}}><div style={{display:"flex",justifyContent:"space-between",alignItems:"center",gap:16,marginBottom:22,flexWrap:"wrap"}}><div><small style={{color:"#687386"}}>CHAVE 10</small><h1 style={{margin:"5px 0"}}>Financeiro</h1><p style={{margin:0,color:"#687386"}}>Visão financeira baseada nas ordens de serviço.</p></div><button onClick={()=>history.back()} style={secondary}>← Voltar</button></div>{error&&<div style={alert}>{error}</div>}<div style={{display:"grid",gridTemplateColumns:"repeat(4,minmax(0,1fr))",gap:14}}>{[["Faturamento realizado",brl(revenue)],["A receber / em andamento",brl(pending)],["Mão de obra",brl(labor)],["Peças",brl(parts)]].map(x=><div key={x[0]} style={card}><small>{x[0]}</small><h2 style={{margin:"8px 0 0"}}>{x[1]}</h2></div>)}</div><div style={{display:"grid",gridTemplateColumns:"1.5fr 1fr",gap:14,marginTop:14}}><div style={card}><h3 style={{marginTop:0}}>Resumo</h3><div style={row}><span>OS concluídas/entregues</span><b>{completed.length}</b></div><div style={row}><span>OS em andamento</span><b>{active.length}</b></div><div style={row}><span>OS canceladas</span><b>{canceled.length}</b></div><div style={row}><span>Descontos concedidos</span><b>{brl(discounts)}</b></div></div><div style={card}><h3 style={{marginTop:0}}>Filtros</h3><select value={filter} onChange={e=>setFilter(e.target.value)} style={input}><option value="todos">Todas as OS</option><option value="recebido">Concluídas / Entregues</option><option value="pendente">Abertas / Em andamento</option><option value="cancelada">Canceladas</option></select></div></div><div style={{...card,marginTop:14,overflow:"auto"}}><h3 style={{marginTop:0}}>Movimentações</h3><table style={{width:"100%",borderCollapse:"collapse",minWidth:700}}><thead><tr><th style={th}>Data</th><th style={th}>OS</th><th style={th}>Cliente</th><th style={th}>Status</th><th style={th}>Mão de obra</th><th style={th}>Peças</th><th style={th}>Total</th></tr></thead><tbody>{visible.map(o=><tr key={o.id}><td style={td}>{date(o.created_at)}</td><td style={td}><b>{o.number}</b></td><td style={td}>{cn(o.client_id)}</td><td style={td}>{o.status}</td><td style={td}>{brl(o.labor)}</td><td style={td}>{brl(o.parts)}</td><td style={{...td,fontWeight:700}}>{brl(o.total)}</td></tr>)}{!visible.length&&<tr><td colSpan={7} style={{padding:30,textAlign:"center",color:"#687386"}}>Nenhuma movimentação encontrada.</td></tr>}</tbody></table></div></div></main>
}
const card:React.CSSProperties={background:"white",border:"1px solid #e5e7eb",borderRadius:12,padding:20};
const row:React.CSSProperties={display:"flex",justifyContent:"space-between",padding:"11px 0",borderBottom:"1px solid #eef0f3"};
const input:React.CSSProperties={width:"100%",padding:11,border:"1px solid #d7dce3",borderRadius:8,boxSizing:"border-box"};
const th:React.CSSProperties={textAlign:"left",padding:10,borderBottom:"2px solid #e5e7eb",fontSize:12,color:"#687386"};
const td:React.CSSProperties={padding:10,borderBottom:"1px solid #eef0f3"};
const secondary:React.CSSProperties={background:"white",color:"#172033",border:"1px solid #ccd2da",borderRadius:7,padding:"10px 14px",fontWeight:700,cursor:"pointer"};
const alert:React.CSSProperties={padding:12,marginBottom:16,borderRadius:8,background:"#fff0f0",border:"1px solid #efb4b4",color:"#9b2226"};
