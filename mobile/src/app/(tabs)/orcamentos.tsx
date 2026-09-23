import { useEffect, useMemo, useState } from "react";
import { ActivityIndicator, Alert, FlatList, Modal, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";
import { supabase } from "@/lib/supabase";
import { getOfficeId } from "@/lib/office";

type Client={id:string;name:string;phone:string|null};
type Vehicle={id:string;client_id:string;plate:string|null;brand:string|null;model:string|null};
type Product={id:string;description:string;quantity:number;unit_price:number};
type Quote={id:string;number:string;client_id:string;vehicle_id:string|null;description:string|null;status:string;labor:number;parts:number;discount:number;total:number;created_at:string};
type Item={product_id:string;quantity:string;include_price:boolean};

const money=(v:string)=>{const n=Number(String(v||"").replace(/\./g,"").replace(",","."));return Number.isFinite(n)?n:0};
const brl=(n:number)=>`R$ ${Number(n||0).toLocaleString("pt-BR",{minimumFractionDigits:2})}`;

export default function Orcamentos(){
 const[loading,setLoading]=useState(true),[saving,setSaving]=useState(false),[items,setItems]=useState<Quote[]>([]);
 const[clients,setClients]=useState<Client[]>([]),[vehicles,setVehicles]=useState<Vehicle[]>([]),[products,setProducts]=useState<Product[]>([]);
 const[modal,setModal]=useState(false),[client,setClient]=useState(""),[vehicle,setVehicle]=useState(""),[description,setDescription]=useState(""),[labor,setLabor]=useState(""),[parts,setParts]=useState(""),[discount,setDiscount]=useState(""),[quoteItems,setQuoteItems]=useState<Item[]>([]);
 const[productPicker,setProductPicker]=useState<number|null>(null),[error,setError]=useState("");

 const load=async()=>{
  setLoading(true);setError("");
  try{
   const officeId=await getOfficeId();
   const[q,c,v,p]=await Promise.all([
    supabase.from("quotes").select("id,number,client_id,vehicle_id,description,status,labor,parts,discount,total,created_at").eq("office_id",officeId).order("created_at",{ascending:false}),
    supabase.from("clients").select("id,name,phone").eq("office_id",officeId).order("name"),
    supabase.from("vehicles").select("id,client_id,plate,brand,model").eq("office_id",officeId).order("created_at",{ascending:false}),
    supabase.from("products").select("id,description,quantity,unit_price").eq("office_id",officeId).order("description")
   ]);
   const e=q.error||c.error||v.error||p.error;if(e)throw e;
   setItems(q.data||[]);setClients(c.data||[]);setVehicles(v.data||[]);setProducts(p.data||[]);
  }catch(e){setError(e instanceof Error?e.message:"Não foi possível carregar os orçamentos.");}
  finally{setLoading(false)}
 };
 useEffect(()=>{load()},[]);
 const calcParts=useMemo(()=>quoteItems.reduce((sum,i)=>{const p=products.find(x=>x.id===i.product_id);return sum+(i.include_price&&p?money(i.quantity)*Number(p.unit_price||0):0)},0),[quoteItems,products]);
 const total=Math.max(0,money(labor)+(parts.trim()?money(parts):calcParts)-money(discount));
 const clientName=(id:string)=>clients.find(c=>c.id===id)?.name||"Cliente";
 const vehicleName=(id:string|null)=>{const v=vehicles.find(x=>x.id===id);return v?[v.brand,v.model].filter(Boolean).join(" ")||"Veículo":""};
 const reset=()=>{setClient("");setVehicle("");setDescription("");setLabor("");setParts("");setDiscount("");setQuoteItems([]);setError("")};
 const save=async()=>{
  if(!client){setError("Selecione o cliente.");return}
  if(!description.trim()){setError("Informe a descrição do serviço.");return}
  setSaving(true);setError("");
  try{
   const officeId=await getOfficeId();
   const partsValue=parts.trim()?money(parts):calcParts;
   const number=`ORC-${Date.now().toString().slice(-6)}`;
   const{data:q,error:e}=await supabase.from("quotes").insert({office_id:officeId,client_id:client,vehicle_id:vehicle||null,number,description:description.trim(),labor:money(labor),parts:partsValue,discount:money(discount),total,status:"Pendente"}).select("id").single();
   if(e||!q)throw e||new Error("Não foi possível salvar o orçamento.");
   const rows=quoteItems.filter(i=>i.product_id&&money(i.quantity)>0).map(i=>{const p=products.find(x=>x.id===i.product_id)!;const qty=money(i.quantity);return{quote_id:q.id,description:p.description,quantity:qty,unit_price:Number(p.unit_price||0),total:qty*Number(p.unit_price||0)}});
   if(rows.length){const{error:ie}=await supabase.from("quote_items").insert(rows);if(ie){await supabase.from("quotes").delete().eq("id",q.id);throw ie}}
   setModal(false);reset();await load();Alert.alert("Orçamento salvo",`${number} · ${brl(total)}`);
  }catch(e){setError(e instanceof Error?e.message:"Não foi possível salvar o orçamento.");}
  finally{setSaving(false)}
 };
 const statusColor=(s:string)=>s==="Convertido"?"#198754":s==="Aprovado"?"#1769aa":"#f59b32";
 if(loading)return <View style={s.center}><ActivityIndicator color="#f59b32"/></View>;
 return <View style={s.screen}>
  <FlatList
   data={items} keyExtractor={x=>x.id}
   contentContainerStyle={s.content}
   ListHeaderComponent={<>
    <View style={s.header}><View><Text style={s.title}>Orçamentos</Text><Text style={s.subtitle}>Crie e acompanhe propostas pelo celular.</Text></View><Pressable style={s.primary} onPress={()=>{reset();setModal(true)}}><Text style={s.primaryText}>+ Novo</Text></Pressable></View>
    {error?<View style={s.error}><Text style={s.errorText}>{error}</Text></View>:null}
   </>}
   ListEmptyComponent={<View style={s.empty}><Text style={s.emptyTitle}>Nenhum orçamento</Text><Text style={s.emptyText}>Toque em “+ Novo” para criar o primeiro.</Text></View>}
   renderItem={({item})=><View style={s.card}><View style={s.row}><Text style={s.number}>{item.number}</Text><Text style={[s.badge,{color:statusColor(item.status)}]}>{item.status}</Text></View><Text style={s.client}>{clientName(item.client_id)}</Text>{item.vehicle_id?<Text style={s.muted}>{vehicleName(item.vehicle_id)}</Text>:null}<Text style={s.service}>{item.description||"Serviço não informado"}</Text><View style={s.totalRow}><Text style={s.muted}>Total</Text><Text style={s.total}>{brl(item.total)}</Text></View></View>}
  />
  <Modal visible={modal} animationType="slide" onRequestClose={()=>!saving&&setModal(false)}>
   <View style={s.modal}><View style={s.modalHeader}><Text style={s.modalTitle}>Novo orçamento</Text><Pressable disabled={saving} onPress={()=>setModal(false)}><Text style={s.close}>×</Text></Pressable></View>
    <ScrollView contentContainerStyle={s.form}>
     <Text style={s.label}>Cliente *</Text>
     <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={s.chips}>{clients.map(c=><Pressable key={c.id} style={[s.chip,client===c.id&&s.chipActive]} onPress={()=>{setClient(c.id);setVehicle("")}}><Text style={[s.chipText,client===c.id&&s.chipTextActive]}>{c.name}</Text></Pressable>)}</ScrollView>
     <Text style={s.label}>Veículo</Text>
     <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={s.chips}>{vehicles.filter(v=>v.client_id===client).map(v=><Pressable key={v.id} style={[s.chip,vehicle===v.id&&s.chipActive]} onPress={()=>setVehicle(v.id)}><Text style={[s.chipText,vehicle===v.id&&s.chipTextActive]}>{[v.brand,v.model].filter(Boolean).join(" ")||"Veículo"}{v.plate?" · "+v.plate:""}</Text></Pressable>)}</ScrollView>
     <Text style={s.label}>Descrição do serviço *</Text><TextInput style={s.inputArea} multiline value={description} onChangeText={setDescription} placeholder="Ex.: troca de óleo e revisão" placeholderTextColor="#9aa3b2"/>
     <View style={s.section}><View style={s.row}><Text style={s.sectionTitle}>Peças</Text><Pressable style={s.smallButton} onPress={()=>{setQuoteItems(x=>[...x,{product_id:"",quantity:"1",include_price:true}]);setProductPicker(quoteItems.length)}}><Text style={s.smallButtonText}>+ Adicionar</Text></Pressable></View>
      {quoteItems.map((it,idx)=>{const p=products.find(x=>x.id===it.product_id);return <View key={idx} style={s.itemBox}><Pressable style={s.productSelect} onPress={()=>setProductPicker(idx)}><Text style={p?s.itemText:s.placeholder}>{p?p.description:"Selecionar peça"}</Text></Pressable><TextInput style={s.qty} keyboardType="decimal-pad" value={it.quantity} onChangeText={v=>setQuoteItems(xs=>xs.map((x,n)=>n===idx?{...x,quantity:v}:x))} placeholder="Qtd."/><Pressable onPress={()=>setQuoteItems(xs=>xs.filter((_,n)=>n!==idx))}><Text style={s.remove}>×</Text></Pressable><Pressable style={s.checkRow} onPress={()=>setQuoteItems(xs=>xs.map((x,n)=>n===idx?{...x,include_price:!x.include_price}:x))}><View style={[s.check,it.include_price&&s.checkOn]}>{it.include_price?<Text style={s.checkMark}>✓</Text>:null}</View><Text style={s.checkText}>Incluir preço {p?brl(p.unit_price):""}</Text></Pressable></View>})}
      {quoteItems.length===0?<Text style={s.muted}>Nenhuma peça adicionada.</Text>:null}
     </View>
     <Text style={s.label}>Mão de obra (R$)</Text><TextInput style={s.input} keyboardType="decimal-pad" value={labor} onChangeText={setLabor} placeholder="0,00" placeholderTextColor="#9aa3b2"/>
     <Text style={s.label}>Valor de peças (R$) — editável</Text><TextInput style={s.input} keyboardType="decimal-pad" value={parts||calcParts.toFixed(2).replace(".",",")} onChangeText={setParts} placeholder="0,00" placeholderTextColor="#9aa3b2"/>
     <Text style={s.hint}>Se você informar um valor, ele será usado manualmente no orçamento.</Text>
     <Text style={s.label}>Desconto (R$)</Text><TextInput style={s.input} keyboardType="decimal-pad" value={discount} onChangeText={setDiscount} placeholder="0,00" placeholderTextColor="#9aa3b2"/>
     <View style={s.summary}><Text style={s.summaryLabel}>Total do orçamento</Text><Text style={s.summaryValue}>{brl(total)}</Text></View>
     <Pressable style={[s.saveButton,saving&&s.disabled]} disabled={saving} onPress={save}><Text style={s.saveText}>{saving?"Salvando...":"Salvar orçamento"}</Text></Pressable>
    </ScrollView>
   </View>
  </Modal>
  <Modal visible={productPicker!==null} transparent animationType="slide" onRequestClose={()=>setProductPicker(null)}>
   <View style={s.overlay}><View style={s.picker}><Text style={s.pickerTitle}>Selecionar peça</Text><FlatList data={products} keyExtractor={x=>x.id} ListEmptyComponent={<Text style={s.muted}>Nenhuma peça cadastrada no estoque.</Text>} renderItem={({item})=><Pressable style={s.productRow} onPress={()=>{const idx=productPicker;if(idx!==null)setQuoteItems(xs=>xs.map((x,n)=>n===idx?{...x,product_id:item.id}:x));setProductPicker(null)}}><View><Text style={s.itemText}>{item.description}</Text><Text style={s.muted}>Estoque: {item.quantity} · {brl(item.unit_price)}</Text></View></Pressable>}/><Pressable style={s.cancelButton} onPress={()=>setProductPicker(null)}><Text>Cancelar</Text></Pressable></View></View>
  </Modal>
 </View>;
}
const s=StyleSheet.create({
 screen:{flex:1,backgroundColor:"#f5f7fa"},content:{padding:18,paddingBottom:30},center:{flex:1,alignItems:"center",justifyContent:"center",backgroundColor:"#f5f7fa"},
 header:{flexDirection:"row",justifyContent:"space-between",alignItems:"center",marginBottom:16},title:{fontSize:26,fontWeight:"800",color:"#172033"},subtitle:{color:"#687386",marginTop:3},primary:{backgroundColor:"#f59b32",paddingHorizontal:15,paddingVertical:11,borderRadius:10},primaryText:{color:"#fff",fontWeight:"800"},
 error:{backgroundColor:"#fff0f0",borderWidth:1,borderColor:"#efb4b4",padding:12,borderRadius:10,marginBottom:12},errorText:{color:"#9b2226"},card:{backgroundColor:"#fff",borderWidth:1,borderColor:"#e5e7eb",borderRadius:14,padding:16,marginBottom:11},row:{flexDirection:"row",justifyContent:"space-between",alignItems:"center"},number:{fontWeight:"800",fontSize:15,color:"#172033"},badge:{fontWeight:"800",fontSize:12},client:{fontSize:17,fontWeight:"800",color:"#172033",marginTop:10},muted:{color:"#687386",marginTop:4},service:{color:"#344054",marginTop:10},totalRow:{borderTopWidth:1,borderTopColor:"#eef0f3",marginTop:13,paddingTop:11,flexDirection:"row",justifyContent:"space-between"},total:{fontSize:17,fontWeight:"900",color:"#172033"},
 empty:{backgroundColor:"#fff",padding:25,borderRadius:14,alignItems:"center"},emptyTitle:{fontSize:18,fontWeight:"800",color:"#172033"},emptyText:{color:"#687386",marginTop:6},
 modal:{flex:1,backgroundColor:"#f5f7fa"},modalHeader:{backgroundColor:"#172033",paddingTop:55,paddingHorizontal:18,paddingBottom:16,flexDirection:"row",justifyContent:"space-between",alignItems:"center"},modalTitle:{fontSize:20,fontWeight:"800",color:"#fff"},close:{fontSize:30,color:"#fff"},form:{padding:18,paddingBottom:40},label:{fontSize:13,fontWeight:"800",color:"#344054",marginTop:12,marginBottom:5},input:{backgroundColor:"#fff",borderWidth:1,borderColor:"#d7dce3",borderRadius:10,padding:13,fontSize:16,color:"#172033"},inputArea:{backgroundColor:"#fff",borderWidth:1,borderColor:"#d7dce3",borderRadius:10,padding:13,fontSize:16,color:"#172033",minHeight:90,textAlignVertical:"top"},chips:{gap:8,paddingVertical:4},chip:{backgroundColor:"#fff",borderWidth:1,borderColor:"#d7dce3",borderRadius:20,paddingHorizontal:12,paddingVertical:9},chipActive:{backgroundColor:"#172033",borderColor:"#172033"},chipText:{color:"#344054"},chipTextActive:{color:"#fff",fontWeight:"800"},section:{backgroundColor:"#fff",borderWidth:1,borderColor:"#e5e7eb",borderRadius:12,padding:12,marginTop:15},sectionTitle:{fontSize:16,fontWeight:"800",color:"#172033"},smallButton:{backgroundColor:"#eef2f6",paddingHorizontal:10,paddingVertical:8,borderRadius:8},smallButtonText:{fontWeight:"800",color:"#172033"},itemBox:{borderTopWidth:1,borderTopColor:"#eef0f3",paddingTop:10,marginTop:10},productSelect:{backgroundColor:"#f8fafc",borderWidth:1,borderColor:"#d7dce3",borderRadius:9,padding:12},itemText:{color:"#172033",fontWeight:"700"},placeholder:{color:"#9aa3b2"},qty:{marginTop:7,width:90,backgroundColor:"#fff",borderWidth:1,borderColor:"#d7dce3",borderRadius:9,padding:10},remove:{position:"absolute",right:2,top:2,fontSize:24,color:"#9b2226"},checkRow:{flexDirection:"row",alignItems:"center",marginTop:8},check:{width:20,height:20,borderRadius:5,borderWidth:1,borderColor:"#b8c0cc",marginRight:7,alignItems:"center",justifyContent:"center"},checkOn:{backgroundColor:"#f59b32",borderColor:"#f59b32"},checkMark:{color:"#fff",fontWeight:"900"},checkText:{color:"#687386",fontSize:12},hint:{fontSize:11,color:"#687386",marginTop:4},summary:{backgroundColor:"#172033",borderRadius:12,padding:16,marginTop:16,flexDirection:"row",justifyContent:"space-between",alignItems:"center"},summaryLabel:{color:"#cbd2dc"},summaryValue:{color:"#fff",fontSize:20,fontWeight:"900"},saveButton:{backgroundColor:"#f59b32",borderRadius:11,padding:15,alignItems:"center",marginTop:15},saveText:{color:"#fff",fontWeight:"900",fontSize:16},disabled:{opacity:.6},
 overlay:{flex:1,backgroundColor:"rgba(0,0,0,.5)",justifyContent:"flex-end"},picker:{backgroundColor:"#fff",borderTopLeftRadius:18,borderTopRightRadius:18,maxHeight:"75%",padding:18},pickerTitle:{fontSize:20,fontWeight:"900",color:"#172033",marginBottom:12},productRow:{paddingVertical:13,borderBottomWidth:1,borderBottomColor:"#eef0f3"},cancelButton:{marginTop:12,padding:14,alignItems:"center",backgroundColor:"#eef2f6",borderRadius:10}
});