"use client";

import { useEffect, useMemo, useState } from "react";
import { supabase } from "../lib/supabase";

type Tab = "dashboard" | "clientes" | "veiculos" | "orcamentos" | "os" | "historico";
type Client = { id: string; name: string; phone: string | null; email?: string | null };
type Vehicle = { id: string; client_id: string; plate: string | null; brand: string | null; model: string | null; year: number | null; mileage: number | null };
type Quote = { id: string; number: string; client_id: string; vehicle_id: string | null; description: string | null; status: string; labor: number; parts: number; discount: number; total: number; valid_until: string | null; notes: string | null; created_at: string };
type Order = { id: string; number: string; client_id: string; vehicle_id: string | null; description: string | null; status: string; labor: number; parts: number; discount: number; total: number; notes: string | null; created_at: string };

function money(value: string) {
  const normalized = value.replace(/\./g, "").replace(",", ".");
  const n = Number(normalized);
  return Number.isFinite(n) ? n : 0;
}

export default function Home() {
  const [tab, setTab] = useState<Tab>("dashboard");
  const [clients, setClients] = useState<Client[]>([]);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [officeId, setOfficeId] = useState("");
  const [loading, setLoading] = useState(true);
  const [savingOS, setSavingOS] = useState(false);
  const [error, setError] = useState("");
  const [showClient, setShowClient] = useState(false);
  const [showVehicle, setShowVehicle] = useState(false);
  const [showQuote, setShowQuote] = useState(false);
  const [showOS, setShowOS] = useState(false);

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [vehicleClient, setVehicleClient] = useState("");
  const [plate, setPlate] = useState("");
  const [brand, setBrand] = useState("");
  const [model, setModel] = useState("");
  const [year, setYear] = useState("");
  const [mileage, setMileage] = useState("");

  const [quoteClient, setQuoteClient] = useState("");
  const [quoteVehicle, setQuoteVehicle] = useState("");
  const [quoteDescription, setQuoteDescription] = useState("");
  const [quoteLabor, setQuoteLabor] = useState("");
  const [quoteParts, setQuoteParts] = useState("");
  const [quoteDiscount, setQuoteDiscount] = useState("");
  const [quoteValidUntil, setQuoteValidUntil] = useState("");
  const [quoteNotes, setQuoteNotes] = useState("");

  const [osClient, setOsClient] = useState("");
  const [osVehicle, setOsVehicle] = useState("");
  const [osService, setOsService] = useState("");
  const [osLabor, setOsLabor] = useState("");
  const [osParts, setOsParts] = useState("");
  const [osDiscount, setOsDiscount] = useState("");
  const [osNotes, setOsNotes] = useState("");

  const totalOS = useMemo(() => orders.reduce((s, o) => s + Number(o.total || 0), 0), [orders]);
  const activeOS = orders.filter(o => !["Concluída", "Entregue", "Cancelada"].includes(o.status)).length;

  async function loadData() {
    setLoading(true);
    setError("");

    const { data: offices, error: officeError } = await supabase.from("offices").select("id").limit(1);
    if (officeError) {
      setError(officeError.message);
      setLoading(false);
      return;
    }

    const id = offices?.[0]?.id;
    if (!id) {
      setError("Nenhuma oficina encontrada.");
      setLoading(false);
      return;
    }
    setOfficeId(id);

    const [{ data: c, error: ce }, { data: v, error: ve }, { data: q, error: qe }, { data: os, error: oe }] = await Promise.all([
      supabase.from("clients").select("id,name,phone,email").eq("office_id", id).order("created_at", { ascending: false }),
      supabase.from("vehicles").select("id,client_id,plate,brand,model,year,mileage").eq("office_id", id).order("created_at", { ascending: false }),
      supabase.from("quotes").select("id,number,client_id,vehicle_id,description,status,labor,parts,discount,total,valid_until,notes,created_at").eq("office_id", id).order("created_at", { ascending: false }),
      supabase.from("service_orders").select("id,number,client_id,vehicle_id,description,status,labor,parts,discount,total,notes,created_at").eq("office_id", id).order("created_at", { ascending: false })
    ]);

    const firstError = ce || ve || qe || oe;
    if (firstError) setError(firstError.message);
    setClients(c || []);
    setVehicles(v || []);
    setQuotes(q || []);
    setOrders((os || []) as Order[]);
    setLoading(false);
  }

  useEffect(() => { loadData(); }, []);

  async function addClient() {
    if (!name.trim()) { setError("Informe o nome do cliente."); return; }
    if (!officeId) { setError("Oficina não carregada."); return; }
    const { error: e } = await supabase.from("clients").insert({ office_id: officeId, name: name.trim(), phone: phone.trim() || null });
    if (e) { setError(e.message); return; }
    setName(""); setPhone(""); setShowClient(false); await loadData(); setTab("clientes");
  }

  async function addVehicle() {
    if (!officeId || !vehicleClient) { setError("Selecione o cliente do veículo."); return; }
    const { error: e } = await supabase.from("vehicles").insert({ office_id: officeId, client_id: vehicleClient, plate: plate.trim().toUpperCase() || null, brand: brand.trim() || null, model: model.trim() || null, year: year ? Number(year) : null, mileage: mileage ? Number(mileage) : null });
    if (e) { setError(e.message); return; }
    setVehicleClient(""); setPlate(""); setBrand(""); setModel(""); setYear(""); setMileage(""); setShowVehicle(false); await loadData(); setTab("veiculos");
  }

  function resetQuote() { setQuoteClient(""); setQuoteVehicle(""); setQuoteDescription(""); setQuoteLabor(""); setQuoteParts(""); setQuoteDiscount(""); setQuoteValidUntil(""); setQuoteNotes(""); }

  async function addQuote() {
    if (!officeId || !quoteClient) { setError("Selecione o cliente do orçamento."); return; }
    const labor = money(quoteLabor), parts = money(quoteParts), discount = money(quoteDiscount);
    const total = Math.max(0, labor + parts - discount);
    const number = `ORC-${Date.now().toString().slice(-6)}`;
    const { error: e } = await supabase.from("quotes").insert({ office_id: officeId, client_id: quoteClient, vehicle_id: quoteVehicle || null, number, description: quoteDescription.trim() || null, labor, parts, discount, total, valid_until: quoteValidUntil || null, notes: quoteNotes.trim() || null });
    if (e) { setError(e.message); return; }
    resetQuote(); setShowQuote(false); await loadData(); setTab("orcamentos");
  }

  async function updateQuoteStatus(id: string, status: string) {
    const { error: e } = await supabase.from("quotes").update({ status, updated_at: new Date().toISOString() }).eq("id", id);
    if (e) { setError(e.message); return; }
    await loadData();
  }

  function resetOS() { setOsClient(""); setOsVehicle(""); setOsService(""); setOsLabor(""); setOsParts(""); setOsDiscount(""); setOsNotes(""); }

  async function addOS() {
    setError("");
    if (!officeId) { setError("Oficina não carregada. Recarregue a página."); return; }
    if (!osClient) { setError("Selecione o cliente da OS."); return; }
    if (!osService.trim()) { setError("Informe o serviço da OS."); return; }

    setSavingOS(true);
    const labor = money(osLabor), parts = money(osParts), discount = money(osDiscount);
    const number = `OS-${Date.now().toString().slice(-6)}`;
    const payload = {
      office_id: officeId,
      client_id: osClient,
      vehicle_id: osVehicle || null,
      number,
      description: osService.trim(),
      labor,
      parts,
      discount,
      status: "Aberta",
      notes: osNotes.trim() || null
    };

    const { error: e } = await supabase.from("service_orders").insert(payload);
    if (e) {
      setSavingOS(false);
      setError(`Não foi possível salvar a OS: ${e.message}`);
      return;
    }

    resetOS();
    setShowOS(false);
    setSavingOS(false);
    setTab("os");
    await loadData();
  }

  async function updateOSStatus(id: string, status: string) {
    const patch: { status: string; updated_at: string; completed_at?: string | null; delivered_at?: string | null } = { status, updated_at: new Date().toISOString() };
    if (status === "Concluída") patch.completed_at = new Date().toISOString();
    if (status === "Entregue") patch.delivered_at = new Date().toISOString();
    const { error: e } = await supabase.from("service_orders").update(patch).eq("id", id);
    if (e) { setError(e.message); return; }
    await loadData();
  }

  const nav: [Tab, string, string][] = [["dashboard", "▦", "Dashboard"], ["clientes", "♙", "Clientes"], ["veiculos", "▱", "Veículos"], ["orcamentos", "▤", "Orçamentos"], ["os", "⚙", "Ordens de serviço"], ["historico", "↺", "Histórico"]];

  function openNew() {
    setError("");
    if (tab === "clientes") setShowClient(true);
    else if (tab === "veiculos") setShowVehicle(true);
    else if (tab === "orcamentos") setShowQuote(true);
    else { resetOS(); setShowOS(true); }
  }

  return (
    <main className="shell">
      <aside className="sidebar">
        <div className="brand"><span className="key">10</span><div><b>CHAVE 10</b><small>Gestão de Oficina</small></div></div>
        <nav>{nav.map(([key, icon, label]) => <button type="button" key={key} className={tab === key ? "nav active" : "nav"} onClick={() => setTab(key)}><span>{icon}</span>{label}</button>)}</nav>
        <div className="sideBottom"><div className="statusDot"></div><span>Oficina Demo</span></div>
      </aside>

      <section className="content">
        <header className="topbar"><div><span className="eyebrow">SISTEMA DE GESTÃO</span><h1>{nav.find(n => n[0] === tab)?.[2]}</h1></div><button type="button" className="primary" onClick={openNew}>{tab === "clientes" ? "+ Novo cliente" : tab === "veiculos" ? "+ Novo veículo" : tab === "orcamentos" ? "+ Novo orçamento" : "+ Nova OS"}</button></header>
        {error && <div style={{margin:"14px 34px 0",padding:"12px",background:"#fff0f0",border:"1px solid #f3b3b3",borderRadius:8,color:"#9b2226"}}>{error}</div>}
        {loading && <div className="page"><div className="panel">Carregando dados da oficina...</div></div>}
        {!loading && tab === "dashboard" && <Dashboard total={totalOS} active={activeOS} clients={clients.length} vehicles={vehicles.length} />}
        {!loading && tab === "clientes" && <Clients clients={clients} vehicles={vehicles} />}
        {!loading && tab === "veiculos" && <Vehicles clients={clients} vehicles={vehicles} />}
        {!loading && tab === "orcamentos" && <Quotes quotes={quotes} clients={clients} vehicles={vehicles} onStatus={updateQuoteStatus} />}
        {!loading && tab === "os" && <Orders orders={orders} clients={clients} vehicles={vehicles} onStatus={updateOSStatus} />}
        {!loading && tab === "historico" && <History orders={orders} clients={clients} vehicles={vehicles} />}

        {showClient && <div className="modalBackdrop"><div className="modal"><h2>Novo cliente</h2><input placeholder="Nome completo" value={name} onChange={e => setName(e.target.value)} /><input placeholder="Telefone" value={phone} onChange={e => setPhone(e.target.value)} /><div className="actions"><button type="button" onClick={() => setShowClient(false)}>Cancelar</button><button type="button" className="primary" onClick={addClient}>Salvar cliente</button></div></div></div>}

        {showVehicle && <div className="modalBackdrop"><div className="modal"><h2>Novo veículo</h2><select value={vehicleClient} onChange={e => setVehicleClient(e.target.value)} style={{width:"100%",padding:12,margin:"7px 0",border:"1px solid #d7dce3",borderRadius:8}}><option value="">Selecione o cliente</option>{clients.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}</select><input placeholder="Placa" value={plate} onChange={e => setPlate(e.target.value)} /><input placeholder="Marca" value={brand} onChange={e => setBrand(e.target.value)} /><input placeholder="Modelo" value={model} onChange={e => setModel(e.target.value)} /><input placeholder="Ano" inputMode="numeric" value={year} onChange={e => setYear(e.target.value)} /><input placeholder="Quilometragem" inputMode="numeric" value={mileage} onChange={e => setMileage(e.target.value)} /><div className="actions"><button type="button" onClick={() => setShowVehicle(false)}>Cancelar</button><button type="button" className="primary" onClick={addVehicle}>Salvar veículo</button></div></div></div>}

        {showQuote && <div className="modalBackdrop"><div className="modal wide"><h2>Novo orçamento</h2><select value={quoteClient} onChange={e => {setQuoteClient(e.target.value);setQuoteVehicle("");}} style={{width:"100%",padding:12,margin:"7px 0",border:"1px solid #d7dce3",borderRadius:8}}><option value="">Selecione o cliente *</option>{clients.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}</select><select value={quoteVehicle} onChange={e => setQuoteVehicle(e.target.value)} style={{width:"100%",padding:12,margin:"7px 0",border:"1px solid #d7dce3",borderRadius:8}}><option value="">Selecione o veículo</option>{vehicles.filter(v => v.client_id === quoteClient).map(v => <option key={v.id} value={v.id}>{[v.brand,v.model].filter(Boolean).join(" ")} {v.plate ? `· ${v.plate}` : ""}</option>)}</select><input placeholder="Descrição do serviço" value={quoteDescription} onChange={e => setQuoteDescription(e.target.value)} /><div className="formGrid"><input placeholder="Mão de obra (R$)" inputMode="decimal" value={quoteLabor} onChange={e => setQuoteLabor(e.target.value)} /><input placeholder="Peças (R$)" inputMode="decimal" value={quoteParts} onChange={e => setQuoteParts(e.target.value)} /></div><div className="formGrid"><input placeholder="Desconto (R$)" inputMode="decimal" value={quoteDiscount} onChange={e => setQuoteDiscount(e.target.value)} /><input type="date" value={quoteValidUntil} onChange={e => setQuoteValidUntil(e.target.value)} /></div><textarea placeholder="Observações" value={quoteNotes} onChange={e => setQuoteNotes(e.target.value)} style={{width:"100%",minHeight:80,padding:12,margin:"7px 0",border:"1px solid #d7dce3",borderRadius:8,fontFamily:"inherit"}} /><div className="quotePreview">Total: <strong>R$ {(money(quoteLabor)+money(quoteParts)-money(quoteDiscount)).toLocaleString("pt-BR",{minimumFractionDigits:2})}</strong></div><div className="actions"><button type="button" onClick={() => {setShowQuote(false);resetQuote();}}>Cancelar</button><button type="button" className="primary" onClick={addQuote}>Salvar orçamento</button></div></div></div>}

        {showOS && <div className="modalBackdrop"><div className="modal wide"><h2>Nova ordem de serviço</h2><p className="muted">A OS será gravada no banco de dados da oficina.</p><select value={osClient} onChange={e => {setOsClient(e.target.value);setOsVehicle("");}} style={{width:"100%",padding:12,margin:"7px 0",border:"1px solid #d7dce3",borderRadius:8}}><option value="">Selecione o cliente *</option>{clients.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}</select><select value={osVehicle} onChange={e => setOsVehicle(e.target.value)} style={{width:"100%",padding:12,margin:"7px 0",border:"1px solid #d7dce3",borderRadius:8}}><option value="">Selecione o veículo</option>{vehicles.filter(v => v.client_id === osClient).map(v => <option key={v.id} value={v.id}>{[v.brand,v.model].filter(Boolean).join(" ")} {v.plate ? `· ${v.plate}` : ""}</option>)}</select><input placeholder="Serviço realizado *" value={osService} onChange={e => setOsService(e.target.value)} /><div className="formGrid"><input placeholder="Mão de obra (R$)" inputMode="decimal" value={osLabor} onChange={e => setOsLabor(e.target.value)} /><input placeholder="Peças (R$)" inputMode="decimal" value={osParts} onChange={e => setOsParts(e.target.value)} /></div><input placeholder="Desconto (R$)" inputMode="decimal" value={osDiscount} onChange={e => setOsDiscount(e.target.value)} /><textarea placeholder="Observações" value={osNotes} onChange={e => setOsNotes(e.target.value)} style={{width:"100%",minHeight:80,padding:12,margin:"7px 0",border:"1px solid #d7dce3",borderRadius:8,fontFamily:"inherit"}} /><div className="quotePreview">Total da OS: <strong>R$ {Math.max(0,money(osLabor)+money(osParts)-money(osDiscount)).toLocaleString("pt-BR",{minimumFractionDigits:2})}</strong></div><div className="actions"><button type="button" disabled={savingOS} onClick={() => {setShowOS(false);resetOS();}}>Cancelar</button><button type="button" className="primary" disabled={savingOS} onClick={addOS}>{savingOS ? "Salvando..." : "Criar OS"}</button></div></div></div>}
      </section>
    </main>
  );
}

function Dashboard({total,active,clients,vehicles}:{total:number;active:number;clients:number;vehicles:number}){return <div className="page"><div className="welcome"><div><h2>Olá, gestor 👋</h2><p>Clientes, veículos, orçamentos e ordens de serviço conectados ao banco.</p></div></div><div className="cards"><Card title="Faturamento em OS" value={`R$ ${total.toLocaleString("pt-BR",{minimumFractionDigits:2})}`} note="OS cadastradas"/><Card title="OS em andamento" value={String(active)} note="Precisam de atenção"/><Card title="Clientes cadastrados" value={String(clients)} note="Banco de dados"/><Card title="Veículos cadastrados" value={String(vehicles)} note="Banco de dados"/></div></div>}
function Card({title,value,note}:{title:string;value:string;note:string}){return <div className="card"><span>{title}</span><strong>{value}</strong><small>{note}</small></div>}
function Clients({clients,vehicles}:{clients:Client[];vehicles:Vehicle[]}){return <div className="page"><div className="panel"><div className="panelHead"><h3>Clientes</h3><span>{clients.length} cadastrados</span></div><table><thead><tr><th>Cliente</th><th>Telefone</th><th>Veículos</th></tr></thead><tbody>{clients.length?clients.map(c=><tr key={c.id}><td><b>{c.name}</b></td><td>{c.phone||"—"}</td><td>{vehicles.filter(v=>v.client_id===c.id).length}</td></tr>):<tr><td colSpan={3}>Nenhum cliente cadastrado.</td></tr>}</tbody></table></div></div>}
function Vehicles({clients,vehicles}:{clients:Client[];vehicles:Vehicle[]}){return <div className="page"><div className="panel"><div className="panelHead"><h3>Veículos</h3><span>{vehicles.length} cadastrados</span></div><table><thead><tr><th>Veículo</th><th>Placa</th><th>Proprietário</th><th>Ano</th><th>KM</th></tr></thead><tbody>{vehicles.length?vehicles.map(v=><tr key={v.id}><td><b>{[v.brand,v.model].filter(Boolean).join(" ")||"Veículo"}</b></td><td>{v.plate||"—"}</td><td>{clients.find(c=>c.id===v.client_id)?.name||"—"}</td><td>{v.year||"—"}</td><td>{v.mileage?.toLocaleString("pt-BR")||"—"}</td></tr>):<tr><td colSpan={5}>Nenhum veículo cadastrado.</td></tr>}</tbody></table></div></div>}
function Quotes({quotes,clients,vehicles,onStatus}:{quotes:Quote[];clients:Client[];vehicles:Vehicle[];onStatus:(id:string,status:string)=>void}){const cn=(id:string)=>clients.find(c=>c.id===id)?.name||"—";const vn=(id:string|null)=>{const v=vehicles.find(x=>x.id===id);return v?`${[v.brand,v.model].filter(Boolean).join(" ")} ${v.plate?`· ${v.plate}`:""}`:"—"};return <div className="page"><div className="panel"><div className="panelHead"><h3>Orçamentos</h3><span>{quotes.length} cadastrados</span></div><table><thead><tr><th>Nº</th><th>Cliente</th><th>Veículo</th><th>Serviço</th><th>Total</th><th>Status</th><th>Ações</th></tr></thead><tbody>{quotes.length?quotes.map(q=><tr key={q.id}><td><b>{q.number}</b></td><td>{cn(q.client_id)}</td><td>{vn(q.vehicle_id)}</td><td>{q.description||"—"}</td><td>R$ {Number(q.total).toLocaleString("pt-BR",{minimumFractionDigits:2})}</td><td><span className={`badge ${q.status==="Aprovado"?"green":q.status==="Recusado"?"red":"blue"}`}>{q.status}</span></td><td>{q.status==="Pendente"&&<><button type="button" onClick={()=>onStatus(q.id,"Aprovado")}>Aprovar</button> <button type="button" onClick={()=>onStatus(q.id,"Recusado")}>Recusar</button></>}</td></tr>):<tr><td colSpan={7}>Nenhum orçamento cadastrado.</td></tr>}</tbody></table></div></div>}
function Orders({orders,clients,vehicles,onStatus}:{orders:Order[];clients:Client[];vehicles:Vehicle[];onStatus:(id:string,status:string)=>void}){const cn=(id:string)=>clients.find(c=>c.id===id)?.name||"—";const vn=(id:string|null)=>{const v=vehicles.find(x=>x.id===id);return v?`${[v.brand,v.model].filter(Boolean).join(" ")} ${v.plate?`· ${v.plate}`:""}`:"—"};return <div className="page"><div className="panel"><div className="panelHead"><h3>Ordens de serviço</h3><span>{orders.length} OS cadastradas</span></div><table><thead><tr><th>OS</th><th>Cliente</th><th>Veículo</th><th>Serviço</th><th>Valor</th><th>Status</th><th>Ações</th></tr></thead><tbody>{orders.length?orders.map(o=><tr key={o.id}><td><b>{o.number}</b></td><td>{cn(o.client_id)}</td><td>{vn(o.vehicle_id)}</td><td>{o.description||"—"}</td><td>R$ {Number(o.total).toLocaleString("pt-BR",{minimumFractionDigits:2})}</td><td><span className={o.status==="Concluída"||o.status==="Entregue"?"badge green":"badge blue"}>{o.status}</span></td><td><select value={o.status} onChange={e=>onStatus(o.id,e.target.value)} style={{padding:6,border:"1px solid #d7dce3",borderRadius:6}}><option>Aberta</option><option>Em andamento</option><option>Concluída</option><option>Entregue</option><option>Cancelada</option></select></td></tr>):<tr><td colSpan={7}>Nenhuma OS cadastrada. Clique em “+ Nova OS”.</td></tr>}</tbody></table></div></div>}
function History({orders,clients,vehicles}:{orders:Order[];clients:Client[];vehicles:Vehicle[]}){const cn=(id:string)=>clients.find(c=>c.id===id)?.name||"—";const vn=(id:string|null)=>{const v=vehicles.find(x=>x.id===id);return v?[v.brand,v.model].filter(Boolean).join(" "):"Veículo"};return <div className="page"><div className="panel"><h3>Histórico de serviços</h3><p className="muted">Histórico das ordens gravadas no banco de dados.</p><div className="timeline">{orders.map(o=><div className="event" key={o.id}><div className="dot"></div><div><b>{vn(o.vehicle_id)} — {o.description||"Serviço"}</b><p>{cn(o.client_id)} · {o.number} · {o.status}</p></div></div>)}{!orders.length&&<p>Nenhuma OS no histórico.</p>}</div></div></div>}
