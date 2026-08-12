"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../../lib/supabase";

type Client = { id: string; name: string };
type Vehicle = { id: string; client_id: string; plate: string | null; brand: string | null; model: string | null };
type Quote = { id: string; number: string; client_id: string; vehicle_id: string | null; description: string | null; total: number };

export default function NovaOS() {
  const router = useRouter();
  const [clients, setClients] = useState<Client[]>([]);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [officeId, setOfficeId] = useState("");
  const [clientId, setClientId] = useState("");
  const [vehicleId, setVehicleId] = useState("");
  const [quoteId, setQuoteId] = useState("");
  const [description, setDescription] = useState("");
  const [labor, setLabor] = useState("");
  const [parts, setParts] = useState("");
  const [discount, setDiscount] = useState("");
  const [notes, setNotes] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const total = useMemo(() => Math.max(0, (Number(labor) || 0) + (Number(parts) || 0) - (Number(discount) || 0)), [labor, parts, discount]);

  useEffect(() => {
    async function load() {
      const { data: offices, error: oe } = await supabase.from("offices").select("id").limit(1);
      if (oe || !offices?.[0]?.id) { setError(oe?.message || "Nenhuma oficina encontrada."); return; }
      const id = offices[0].id;
      setOfficeId(id);
      const [{ data: c }, { data: v }, { data: q }] = await Promise.all([
        supabase.from("clients").select("id,name").eq("office_id", id).order("name"),
        supabase.from("vehicles").select("id,client_id,plate,brand,model").eq("office_id", id).order("created_at", { ascending: false }),
        supabase.from("quotes").select("id,number,client_id,vehicle_id,description,total").eq("office_id", id).eq("status", "Aprovado").order("created_at", { ascending: false })
      ]);
      setClients(c || []); setVehicles(v || []); setQuotes(q || []);
    }
    load();
  }, []);

  async function save() {
    if (!officeId || !clientId) { setError("Selecione o cliente."); return; }
    setSaving(true); setError("");
    const { data: last } = await supabase.from("service_orders").select("number").eq("office_id", officeId).order("created_at", { ascending: false }).limit(1);
    const lastNumber = last?.[0]?.number?.match(/(\d+)$/)?.[1];
    const next = String((Number(lastNumber) || 0) + 1).padStart(3, "0");
    const { error: e } = await supabase.from("service_orders").insert({
      office_id: officeId, quote_id: quoteId || null, client_id: clientId, vehicle_id: vehicleId || null,
      number: `OS-${next}`, description: description.trim() || null,
      labor: Number(labor) || 0, parts: Number(parts) || 0, discount: Number(discount) || 0,
      notes: notes.trim() || null, status: "Aberta"
    });
    setSaving(false);
    if (e) { setError(e.message); return; }
    router.push("/os");
    router.refresh();
  }

  return <main style={{minHeight:"100vh",background:"#f6f7f9",padding:32,fontFamily:"Arial, sans-serif"}}>
    <div style={{maxWidth:760,margin:"0 auto",background:"white",borderRadius:16,padding:28,boxShadow:"0 8px 30px rgba(0,0,0,.08)"}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:20}}><div><small style={{color:"#777"}}>CHAVE 10 · GESTÃO DE OFICINA</small><h1 style={{margin:"6px 0"}}>Nova ordem de serviço</h1></div><button onClick={() => router.push("/os")}>Voltar</button></div>
      {error && <div style={{background:"#fff0f0",border:"1px solid #efb1b1",padding:12,borderRadius:8,color:"#a11",marginBottom:14}}>{error}</div>}
      <label>Cliente *</label>
      <select value={clientId} onChange={e => {setClientId(e.target.value);setVehicleId("");setQuoteId("");}} style={{width:"100%",padding:12,margin:"7px 0 14px",border:"1px solid #d7dce3",borderRadius:8}}><option value="">Selecione o cliente</option>{clients.map(c=><option key={c.id} value={c.id}>{c.name}</option>)}</select>
      <label>Veículo</label>
      <select value={vehicleId} onChange={e=>setVehicleId(e.target.value)} style={{width:"100%",padding:12,margin:"7px 0 14px",border:"1px solid #d7dce3",borderRadius:8}}><option value="">Selecione o veículo</option>{vehicles.filter(v=>v.client_id===clientId).map(v=><option key={v.id} value={v.id}>{[v.brand,v.model].filter(Boolean).join(" ")} {v.plate?`· ${v.plate}`:""}</option>)}</select>
      <label>Orçamento aprovado</label>
      <select value={quoteId} onChange={e=>{const q=quotes.find(x=>x.id===e.target.value);setQuoteId(e.target.value);if(q){setDescription(q.description||"");setParts(String(q.total||0));}}} style={{width:"100%",padding:12,margin:"7px 0 14px",border:"1px solid #d7dce3",borderRadius:8}}><option value="">Sem orçamento vinculado</option>{quotes.filter(q=>q.client_id===clientId).map(q=><option key={q.id} value={q.id}>{q.number} · R$ {Number(q.total).toLocaleString("pt-BR",{minimumFractionDigits:2})}</option>)}</select>
      <input placeholder="Descrição do serviço" value={description} onChange={e=>setDescription(e.target.value)} style={{width:"100%",boxSizing:"border-box",padding:12,margin:"7px 0",border:"1px solid #d7dce3",borderRadius:8}} />
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:10}}><input placeholder="Mão de obra (R$)" inputMode="decimal" value={labor} onChange={e=>setLabor(e.target.value)} style={{padding:12,border:"1px solid #d7dce3",borderRadius:8}}/><input placeholder="Peças (R$)" inputMode="decimal" value={parts} onChange={e=>setParts(e.target.value)} style={{padding:12,border:"1px solid #d7dce3",borderRadius:8}}/><input placeholder="Desconto (R$)" inputMode="decimal" value={discount} onChange={e=>setDiscount(e.target.value)} style={{padding:12,border:"1px solid #d7dce3",borderRadius:8}}/></div>
      <textarea placeholder="Observações" value={notes} onChange={e=>setNotes(e.target.value)} style={{width:"100%",boxSizing:"border-box",minHeight:100,padding:12,margin:"14px 0",border:"1px solid #d7dce3",borderRadius:8}} />
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginTop:12}}><strong>Total: R$ {total.toLocaleString("pt-BR",{minimumFractionDigits:2})}</strong><button onClick={save} disabled={saving} style={{background:"#e89022",border:0,borderRadius:8,padding:"12px 20px",fontWeight:700,cursor:"pointer"}}>{saving?"Salvando...":"Salvar ordem de serviço"}</button></div>
    </div>
  </main>;
}
