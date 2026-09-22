"use client";

import { useEffect, useMemo, useState } from "react";
import { supabase } from "../../lib/supabase";

type Product={id:string;description:string;quantity:number;unit_price:number;code:string|null};
type Movement={id:string;type:"entrada"|"saida";quantity:number;unit_price:number;description:string|null;created_at:string;product_id:string};

const money=(v:string)=>{const n=Number(v.replace(/\./g,"").replace(",","."));return Number.isFinite(n)?n:0};
const brl=(n:number)=>`R$ ${Number(n||0).toLocaleString("pt-BR",{minimumFractionDigits:2})}`;
const input:React.CSSProperties={width:"100%",padding:12,margin:"6px 0",border:"1px solid #d7dce3",borderRadius:8,boxSizing:"border-box"};

export default function Estoque(){
 const[products,setProducts]=useState<Product[]>([]),[movements,setMovements]=useState<Movement[]>([]);
 const[officeId,setOfficeId]=useState(""),[officeName,setOfficeName]=useState("Minha Oficina"),[loading,setLoading]=useState(true),[saving,setSaving]=useState(false),[error,setError]=useState("");
 const[showEntry,setShowEntry]=useState(false),[showExit,setShowExit]=useState(false);
 const[entryDescription,setEntryDescription]=useState(""),[entryQty,setEntryQty]=useState(""),[entryPrice,setEntryPrice]=useState("");
 const[exitProduct,setExitProduct]=useState(""),[exitQty,setExitQty]=useState("");

 async function resolveOffice(){
  const{data:userResult,error:ue}=await supabase.auth.getUser();
  if(ue||!userResult.user){setError("Sessão inválida. Faça login novamente.");return null}
  const{data:profile,error:pe}=await supabase.from("user_profiles").select("office_id").eq("user_id",userResult.user.id).single();
  if(pe||!profile?.office_id){setError(pe?.message||"Oficina do usuário não encontrada.");return null}
  const{data:office,error:oe}=await supabase.from("offices").select("id,name").eq("id",profile.office_id).single();
  if(oe||!office){setError(oe?.message||"Oficina não encontrada.");return null}
  setOfficeId(office.id);setOfficeName(office.name||"Minha Oficina");return office.id;
 }
 async function load(){
  setLoading(true);setError("");const id=officeId||await resolveOffice();if(!id){setLoading(false);return}
  const[p,m]=await Promise.all([
   supabase.from("products").select("id,description,quantity,unit_price,code").eq("office_id",id).order("description"),
   supabase.from("inventory_movements").select("id,type,quantity,unit_price,description,created_at,product_id").eq("office_id",id).order("created_at",{ascending:false}).limit(50)
  ]);
  const e=p.error||m.error;if(e)setError(e.message);setProducts(p.data||[]);setMovements(m.data||[]);setLoading(false);
 }
 useEffect(()=>{load()},[]);
 const totalItems=useMemo(()=>products.reduce((s,p)=>s+Number(p.quantity||0),0),[products]);
 const stockValue=useMemo(()=>products.reduce((s,p)=>s+Number(p.quantity||0)*Number(p.unit_price||0),0),[products]);
 function resetEntry(){setEntryDescription("");setEntryQty("");setEntryPrice("")}
 function resetExit(){setExitProduct("");setExitQty("")}
 async function entry(){
  setError("");const description=entryDescription.trim();const qty=money(entryQty);const price=money(entryPrice);
  if(!description){setError("Informe a descrição do produto.");return}if(qty<=0){setError("Informe uma quantidade maior que zero.");return}if(price<0){setError("Informe um preço válido.");return}
  const id=officeId||await resolveOffice();if(!id)return;setSaving(true);
  const{data:existing,error:findError}=await supabase.from("products").select("id,quantity").eq("office_id",id).ilike("description",description).maybeSingle();
  if(findError){setSaving(false);setError(findError.message);return}
  let productId="";
  if(existing){
   const{error:e}=await supabase.from("products").update({quantity:Number(existing.quantity||0)+qty,unit_price:price,updated_at:new Date().toISOString()}).eq("id",existing.id).eq("office_id",id);
   if(e){setSaving(false);setError(e.message);return}productId=existing.id;
  }else{
   const{data:p,error:e}=await supabase.from("products").insert({office_id:id,description,quantity:qty,unit_price:price}).select("id").single();
   if(e||!p){setSaving(false);setError(e?.message||"Não foi possível cadastrar o produto.");return}productId=p.id;
  }
  const{error:me}=await supabase.from("inventory_movements").insert({office_id:id,product_id:productId,type:"entrada",quantity:qty,unit_price:price,description:"Entrada de estoque"});
  setSaving(false);if(me){setError(me.message);return}setShowEntry(false);resetEntry();await load();
 }
 async function exit(){
  setError("");const qty=money(exitQty);const product=products.find(p=>p.id===exitProduct);
  if(!product){setError("Selecione o produto.");return}if(qty<=0){setError("Informe uma quantidade maior que zero.");return}if(qty>Number(product.quantity)){setError("Quantidade de saída maior que o estoque disponível.");return}
  const id=officeId||await resolveOffice();if(!id)return;setSaving(true);
  const{error:e}=await supabase.from("products").update({quantity:Number(product.quantity)-qty,updated_at:new Date().toISOString()}).eq("id",product.id).eq("office_id",id);
  if(e){setSaving(false);setError(e.message);return}
  const{error:me}=await supabase.from("inventory_movements").insert({office_id:id,product_id:product.id,type:"saida",quantity:qty,unit_price:Number(product.unit_price||0),description:"Saída de estoque"});
  setSaving(false);if(me){setError(me.message);return}setShowExit(false);resetExit();await load();
 }
 if(loading)return <main style={{padding:40,fontFamily:"Arial"}}>Carregando estoque...</main>;
 return <main className="stockPage" style={{minHeight:"100vh",background:"#f5f7fa",fontFamily:"Arial,sans-serif",color:"#172033",padding:28}}>
  <div className="stockInner" style={{maxWidth:1200,margin:"0 auto"}}>
   <div className="stockHeader" style={{display:"flex",justifyContent:"space-between",alignItems:"center",gap:16,marginBottom:22,flexWrap:"wrap"}}>
    <div><small style={{color:"#687386"}}>CHAVE 10 · {officeName}</small><h1 style={{margin:"5px 0"}}>Estoque</h1><p style={{margin:0,color:"#687386"}}>Controle de entradas, saídas, quantidades e preços.</p></div>
    <div className="stockActions" style={{display:"flex",gap:8}}><button type="button" onClick={()=>window.location.href="/"} style={{background:"white",color:"#172033",border:"1px solid #ccd2da",borderRadius:8,padding:"11px 16px",fontWeight:700}}>← Dashboard</button><button type="button" onClick={()=>{resetEntry();setShowEntry(true)}} style={{background:"#f59b32",color:"white",border:0,borderRadius:8,padding:"11px 16px",fontWeight:700}}>+ Entrada</button><button type="button" onClick={()=>{resetExit();setShowExit(true)}} style={{background:"#172033",color:"white",border:0,borderRadius:8,padding:"11px 16px",fontWeight:700}}>− Saída</button></div>
   </div>
   {error&&<div style={{padding:12,marginBottom:16,borderRadius:8,background:"#fff0f0",border:"1px solid #efb4b4",color:"#9b2226"}}>{error}</div>}
   <div className="stockMetrics" style={{display:"grid",gridTemplateColumns:"repeat(3,minmax(0,1fr))",gap:14,marginBottom:14}}>
    <div style={{background:"white",border:"1px solid #e5e7eb",borderRadius:12,padding:20}}><small>Produtos cadastrados</small><h2 style={{margin:"8px 0 0"}}>{products.length}</h2></div>
    <div style={{background:"white",border:"1px solid #e5e7eb",borderRadius:12,padding:20}}><small>Quantidade em estoque</small><h2 style={{margin:"8px 0 0"}}>{totalItems.toLocaleString("pt-BR")}</h2></div>
    <div style={{background:"white",border:"1px solid #e5e7eb",borderRadius:12,padding:20}}><small>Valor do estoque</small><h2 style={{margin:"8px 0 0"}}>{brl(stockValue)}</h2></div>
   </div>
   <div style={{background:"white",border:"1px solid #e5e7eb",borderRadius:12,overflow:"auto",padding:20}}>
    <h2 style={{marginTop:0}}>Produtos em estoque</h2>
    <table className="stockTable" style={{width:"100%",borderCollapse:"collapse"}}><thead><tr><th style={{textAlign:"left",padding:10,borderBottom:"2px solid #e5e7eb"}}>Descrição</th><th style={{textAlign:"right",padding:10,borderBottom:"2px solid #e5e7eb"}}>Quantidade</th><th style={{textAlign:"right",padding:10,borderBottom:"2px solid #e5e7eb"}}>Preço</th><th style={{textAlign:"right",padding:10,borderBottom:"2px solid #e5e7eb"}}>Total</th></tr></thead><tbody>{products.map(p=><tr key={p.id}><td style={{padding:10,borderBottom:"1px solid #eef0f3"}}><b>{p.description}</b></td><td style={{padding:10,borderBottom:"1px solid #eef0f3",textAlign:"right"}}>{Number(p.quantity).toLocaleString("pt-BR")}</td><td style={{padding:10,borderBottom:"1px solid #eef0f3",textAlign:"right"}}>{brl(p.unit_price)}</td><td style={{padding:10,borderBottom:"1px solid #eef0f3",textAlign:"right",fontWeight:700}}>{brl(Number(p.quantity)*Number(p.unit_price))}</td></tr>)}{!products.length&&<tr><td colSpan={4} style={{padding:30,textAlign:"center",color:"#687386"}}>Nenhum produto em estoque.</td></tr>}</tbody></table>
   </div>
   <div style={{background:"white",border:"1px solid #e5e7eb",borderRadius:12,overflow:"auto",padding:20,marginTop:14}}>
    <h2 style={{marginTop:0}}>Últimas movimentações</h2>
    <table className="stockTable" style={{width:"100%",borderCollapse:"collapse"}}><thead><tr><th style={{textAlign:"left",padding:10,borderBottom:"2px solid #e5e7eb"}}>Data</th><th style={{textAlign:"left",padding:10,borderBottom:"2px solid #e5e7eb"}}>Tipo</th><th style={{textAlign:"left",padding:10,borderBottom:"2px solid #e5e7eb"}}>Produto</th><th style={{textAlign:"right",padding:10,borderBottom:"2px solid #e5e7eb"}}>Quantidade</th><th style={{textAlign:"right",padding:10,borderBottom:"2px solid #e5e7eb"}}>Preço</th></tr></thead><tbody>{movements.map(m=><tr key={m.id}><td style={{padding:10,borderBottom:"1px solid #eef0f3"}}>{new Date(m.created_at).toLocaleDateString("pt-BR")}</td><td style={{padding:10,borderBottom:"1px solid #eef0f3"}}>{m.type==="entrada"?"Entrada":"Saída"}</td><td style={{padding:10,borderBottom:"1px solid #eef0f3"}}>{products.find(p=>p.id===m.product_id)?.description||"—"}</td><td style={{padding:10,borderBottom:"1px solid #eef0f3",textAlign:"right"}}>{Number(m.quantity).toLocaleString("pt-BR")}</td><td style={{padding:10,borderBottom:"1px solid #eef0f3",textAlign:"right"}}>{brl(m.unit_price)}</td></tr>)}</tbody></table>
   </div>
  </div>
  {showEntry&&<div style={{position:"fixed",inset:0,background:"rgba(0,0,0,.55)",display:"flex",alignItems:"center",justifyContent:"center",zIndex:9999,padding:20}}><div style={{background:"white",borderRadius:12,padding:24,width:"100%",maxWidth:520}}><div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}><h2>Entrada de estoque</h2><button type="button" onClick={()=>setShowEntry(false)}>×</button></div><input style={input} placeholder="Descrição do produto *" value={entryDescription} onChange={e=>setEntryDescription(e.target.value)}/><input style={input} placeholder="Quantidade *" inputMode="decimal" value={entryQty} onChange={e=>setEntryQty(e.target.value)}/><input style={input} placeholder="Preço unitário (R$) *" inputMode="decimal" value={entryPrice} onChange={e=>setEntryPrice(e.target.value)}/><div style={{display:"flex",justifyContent:"flex-end",gap:10,marginTop:16}}><button type="button" onClick={()=>setShowEntry(false)} disabled={saving}>Cancelar</button><button type="button" onClick={entry} disabled={saving} style={{background:"#f59b32",color:"white",border:0,borderRadius:8,padding:"10px 16px",fontWeight:700}}>{saving?"Salvando...":"Registrar entrada"}</button></div></div></div>}
  {showExit&&<div style={{position:"fixed",inset:0,background:"rgba(0,0,0,.55)",display:"flex",alignItems:"center",justifyContent:"center",zIndex:9999,padding:20}}><div style={{background:"white",borderRadius:12,padding:24,width:"100%",maxWidth:520}}><div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}><h2>Saída de estoque</h2><button type="button" onClick={()=>setShowExit(false)}>×</button></div><select style={input} value={exitProduct} onChange={e=>setExitProduct(e.target.value)}><option value="">Selecione o produto *</option>{products.map(p=><option key={p.id} value={p.id}>{p.description} · estoque: {p.quantity}</option>)}</select><input style={input} placeholder="Quantidade de saída *" inputMode="decimal" value={exitQty} onChange={e=>setExitQty(e.target.value)}/><div style={{display:"flex",justifyContent:"flex-end",gap:10,marginTop:16}}><button type="button" onClick={()=>setShowExit(false)} disabled={saving}>Cancelar</button><button type="button" onClick={exit} disabled={saving} style={{background:"#172033",color:"white",border:0,borderRadius:8,padding:"10px 16px",fontWeight:700}}>{saving?"Salvando...":"Registrar saída"}</button></div></div></div>}
 </main>
}