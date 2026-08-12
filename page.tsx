import Link from "next/link";
import {createServerClient} from "@supabase/ssr";
import {cookies} from "next/headers";
import {redirect} from "next/navigation";

async function sb(){const c=await cookies();return createServerClient(process.env.NEXT_PUBLIC_SUPABASE_URL!,process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,{cookies:{getAll(){return c.getAll()},setAll(){}}})}
export default async function Home(){const sup=await sb();const {data:{user}}=await sup.auth.getUser();if(!user)redirect("/login");
const [{count:clients},{count:vehicles},{count:quotes},{count:os}]=await Promise.all([
 sup.from("customers").select("*",{count:"exact",head:true}),
 sup.from("vehicles").select("*",{count:"exact",head:true}),
 sup.from("quotes").select("*",{count:"exact",head:true}).eq("status","sent"),
 sup.from("work_orders").select("*",{count:"exact",head:true}).in("status",["open","in_progress","waiting_part"])
]);
return <div className="wrap"><aside className="side"><div className="brand">🔑 CHAVE <span>10</span></div><Link href="/">Dashboard</Link><Link href="/clientes">👤 Clientes</Link><Link href="/veiculos">🚗 Veículos</Link><Link href="/orcamentos">💰 Orçamentos</Link><Link href="/os">🔧 Ordens de serviço</Link></aside><main className="content"><div className="top"><h1>Dashboard</h1><span>{user.email}</span></div><div className="cards"><div className="card"><small>Clientes</small><strong>{clients??0}</strong></div><div className="card"><small>Veículos</small><strong>{vehicles??0}</strong></div><div className="card"><small>Orçamentos pendentes</small><strong>{quotes??0}</strong></div><div className="card"><small>OS abertas</small><strong>{os??0}</strong></div></div><div className="panel"><h2>Chave 10 está conectado ao banco real</h2><p>Os dados exibidos acima vêm do Supabase e são isolados por oficina através de RLS.</p></div></main></div>}