"use client";

import { useEffect, useMemo, useState } from "react";
import { supabase } from "../../lib/supabase";

type Client = { id: string; name: string; phone: string | null };
type Vehicle = { id: string; client_id: string; plate: string | null; brand: string | null; model: string | null; year: number | null; mileage: number | null };
type Quote = { id: string; number: string; client_id: string; vehicle_id: string | null; description: string | null; status: string; labor: number; parts: number; discount: number; total: number };
type Order = { id: string; number: string; quote_id: string | null; client_id: string; vehicle_id: string | null; description: string | null; labor: number; parts: number; discount: number; total: number; status: string; notes: string | null; opened_at: string; completed_at: string | null; delivered_at: string | null };

const statuses = ["Aberta", "Em andamento", "Concluída", "Entregue", "Cancelada"];

export default function ServiceOrdersPage() {
  const [officeId, setOfficeId] = useState("");
  const [clients, setClients] = useState<Client[]>([]);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [clientId, setClientId] = useState("");
  const [vehicleId, setVehicleId] = useState("");
  const [quoteId, setQuoteId] = useState("");
  const [description, setDescription] = useState("");
  const [labor, setLabor] = useState("");
  const [parts, setParts] = useState("");
  const [discount, setDiscount] = useState("");
  const [notes, setNotes] = useState("");

  const total = useMemo(() => Math.max(0, (Number(labor) || 0) + (Number(parts) || 0) - (Number(discount) || 0)), [labor, parts, discount]);
  const pending = orders.filter(o => o.status === "Aberta" || o.status === "Em andamento").length;
  const completed = orders.filter(o => o.status === "Concluída" || o.status === "Entregue").length;

  async function load() {
    setLoading(true); setError("");
    const { data: offices, error: oe } = await supabase.from("offices").select("id").limit(1);
    if (oe || !offices?.[0]?.id) { setError(oe?.message || "Nenhuma oficina encontrada."); setLoading(false); return; }
    const id = offices[0].id; setOfficeId(id);
    const [cr, vr, qr, or] = await Promise.all([
      supabase.from("clients").select("id,name,phone").eq("office_id", id).order("created_at", { ascending: false }),
      supabase.from("vehicles").select("id,client_id,plate,brand,model,year,mileage").eq("office_id", id).order("created_at", { ascending: false }),
      supabase.from("quotes").select("id,number,client_id,vehicle_id,description,status,labor,parts,discount,total").eq("office_id", id).eq("status", "Aprovado").order("created_at", { ascending: false }),
      supabase.from("service_orders").select("id,number,quote_id,client_id,vehicle_id,description,labor,parts,discount,total,status,notes,opened_at,completed_at,delivered_at").eq("office_id", id).order("created_at", { ascending: false })
    ]);
    const err = cr.error || vr.error || qr.error || or.error;
    if (err) setError(err.message);
    setClients(cr.data || []); setVehicles(vr.data || []); setQuotes(qr.data || []); setOrders(or.data || []); setLoading(false);
  }

  useEffect(() => { load(); }, []);

  function reset() {
    setClientId(""); setVehicleId(""); setQuoteId(""); setDescription(""); setLabor(""); setParts(""); setDiscount(""); setNotes("");
  }

  function useQuote(id: string) {
    const q = quotes.find(x => x.id === id);
    if (!q) return;
    setQuoteId(q.id); setClientId(q.client_id); setVehicleId(q.vehicle_id || ""); setDescription(q.description || ""); setLabor(String(q.labor || 0)); setParts(String(q.parts || 0)); setDiscount(String(q.discount || 0));
  }

  async function createOrder() {
    if (!officeId || !clientId) { setError("Selecione o cliente."); return; }
    setSaving(true); setError("");
    const number = `OS-${Date.now().toString().slice(-6)}`;
    const { error: e } = await supabase.from("service_orders").insert({
      office_id: officeId, quote_id: quoteId || null, client_id: clientId, vehicle_id: vehicleId || null,
      number, description: description.trim() || null, labor: Number(labor) || 0, parts: Number(parts) || 0,
      discount: Number(discount) || 0, notes: notes.trim() || null
    });
    if (e) { setError(e.message); setSaving(false); return; }
    if (quoteId) await supabase.from("quotes").update({ status: "Aprovado" }).eq("id", quoteId);
    reset(); setShowForm(false); setSaving(false); await load();
  }

  async function updateStatus(order: Order, status: string) {
    const patch: Record<string, unknown> = { status, updated_at: new Date().toISOString() };
    if (status === "Concluída") patch.completed_at = new Date().toISOString();
    if (status === "Entregue") patch.delivered_at = new Date().toISOString();
    const { error: e } = await supabase.from("service_orders").update(patch).eq("id", order.id);
    if (e) { setError(e.message); return; }
    await load();
  }

  function clientName(id: string) { return clients.find(c => c.id === id)?.name || "—"; }
  function vehicleName(id: string | null) { const v = vehicles.find(x => x.id === id); return v ? `${[v.brand, v.model].filter(Boolean).join(" ")}${v.plate ? ` · ${v.plate}` : ""}` : "—"; }

  if (loading) return <main style={{padding:40,fontFamily:"Arial"}}>Carregando Ordens de Serviço...</main>;

  return <main style={{minHeight:"100vh",background:"#f6f7f9",fontFamily:"Arial,sans-serif",color:"#172033",padding:24}}>
    <div style={{maxWidth:1200,margin:"0 auto"}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:22}}>
        <div><small style={{color:"#667085"}}>CHAVE 10 · GESTÃO DE OFICINA</small><h1 style={{margin:"5px 0"}}>Ordens de Serviço</h1><p style={{margin:0,color:"#667085"}}>Controle real das OS conectadas ao Supabase.</p></div>
        <button onClick={() => { reset(); setShowForm(true); }} style={{background:"#f59b45",border:0,borderRadius:8,padding:"12px 18px",fontWeight:700,cursor:"pointer"}}>+ Nova OS</button>
      </div>
      {error && <div style={{padding:12,background:"#fff0f0",border:"1px solid #efb0b0",borderRadius:8,color:"#a61b1b",marginBottom:15}}>{error}</div>}
      <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:14,marginBottom:18}}>
        <Card title="OS abertas/em andamento" value={String(pending)} />
        <Card title="Concluídas/entregues" value={String(completed)} />
        <Card title="Faturamento em OS" value={`R$ ${orders.reduce((s,o)=>s+Number(o.total||0),0).toLocaleString("pt-BR",{minimumFractionDigits:2})}`} />
      </div>
      <section style={{background:"white",borderRadius:12,padding:18,boxShadow:"0 1px 4px rgba(0,0,0,.06)",overflowX:"auto"}}>
        <h2 style={{marginTop:0}}>Ordens de Serviço</h2>
        <table style={{width:"100%",borderCollapse:"collapse"}}><thead><tr>{["OS","Cliente","Veículo","Serviço","Total","Status","Ação"].map(x=><th key={x} style={{textAlign:"left",padding:10,borderBottom:"1px solid #eee",fontSize:13}}>{x}</th>)}</tr></thead>
        <tbody>{orders.length ? orders.map(o=><tr key={o.id}>{[
          <b key="n">{o.number}</b>, clientName(o.client_id), vehicleName(o.vehicle_id), o.description || "—", `R$ ${Number(o.total).toLocaleString("pt-BR",{minimumFractionDigits:2})}`,
          <select key="s" value={o.status} onChange={e=>updateStatus(o,e.target.value)} style={{padding:7,borderRadius:6,border:"1px solid #ddd"}}>{statuses.map(s=><option key={s}>{s}</option>)}</select>,
          <span key="a" style={{fontSize:12,color:"#667085"}}>{o.status === "Entregue" ? "Finalizada" : "Atualizar"}</span>
        ].map((cell,i)=><td key={i} style={{padding:10,borderBottom:"1px solid #f0f0f0"}}>{cell}</td>)}</tr>) : <tr><td colSpan={7} style={{padding:25,textAlign:"center",color:"#667085"}}>Nenhuma OS cadastrada ainda.</td></tr>}</tbody></table>
      </section>

      {showForm && <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,.45)",display:"flex",alignItems:"center",justifyContent:"center",padding:20,zIndex:10}}><div style={{background:"white",borderRadius:14,padding:24,width:"min(620px,100%)",maxHeight:"90vh",overflowY:"auto"}}>
        <h2 style={{marginTop:0}}>Nova Ordem de Serviço</h2>
        {quotes.length > 0 && <select value={quoteId} onChange={e=>useQuote(e.target.value)} style={input}><option value="">Criar sem orçamento</option>{quotes.map(q=><option key={q.id} value={q.id}>{q.number} · {q.description || "Serviço"} · R$ {Number(q.total).toLocaleString("pt-BR",{minimumFractionDigits:2})}</option>)}</select>}
        <select value={clientId} onChange={e=>{setClientId(e.target.value);setVehicleId("")}} style={input}><option value="">Selecione o cliente *</option>{clients.map(c=><option key={c.id} value={c.id}>{c.name}</option>)}</select>
        <select value={vehicleId} onChange={e=>setVehicleId(e.target.value)} style={input}><option value="">Selecione o veículo</option>{vehicles.filter(v=>v.client_id===clientId).map(v=><option key={v.id} value={v.id}>{[v.brand,v.model].filter(Boolean).join(" ")} {v.plate ? `· ${v.plate}` : ""}</option>)}</select>
        <input placeholder="Descrição do serviço" value={description} onChange={e=>setDescription(e.target.value)} style={input}/>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}><input placeholder="Mão de obra (R$)" inputMode="decimal" value={labor} onChange={e=>setLabor(e.target.value)} style={input}/><input placeholder="Peças (R$)" inputMode="decimal" value={parts} onChange={e=>setParts(e.target.value)} style={input}/></div>
        <input placeholder="Desconto (R$)" inputMode="decimal" value={discount} onChange={e=>setDiscount(e.target.value)} style={input}/>
        <textarea placeholder="Observações" value={notes} onChange={e=>setNotes(e.target.value)} style={{...input,minHeight:90}}/>
        <div style={{fontSize:18,fontWeight:700,margin:"12px 0"}}>Total: R$ {total.toLocaleString("pt-BR",{minimumFractionDigits:2})}</div>
        <div style={{display:"flex",justifyContent:"flex-end",gap:10}}><button onClick={()=>{setShowForm(false);reset()}} style={{padding:"10px 16px",border:0,borderRadius:8}}>Cancelar</button><button disabled={saving} onClick={createOrder} style={{background:"#f59b45",border:0,borderRadius:8,padding:"10px 16px",fontWeight:700}}>{saving ? "Salvando..." : "Salvar OS"}</button></div>
      </div></div>}
    </div>
  </main>;
}

const input: React.CSSProperties = {width:"100%",boxSizing:"border-box",padding:12,margin:"6px 0",border:"1px solid #d7dce3",borderRadius:8,fontSize:15};
function Card({title,value}:{title:string;value:string}) { return <div style={{background:"white",borderRadius:12,padding:18,boxShadow:"0 1px 4px rgba(0,0,0,.06)"}}><div style={{fontSize:13,color:"#667085"}}>{title}</div><strong style={{display:"block",fontSize:24,marginTop:8}}>{value}</strong></div>; }
