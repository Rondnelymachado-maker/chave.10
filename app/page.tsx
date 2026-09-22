"use client";

const MERCADO_PAGO_URL = "https://mpago.la/18fhBWP";

export default function Home() {
  return (
    <main style={{minHeight:"100vh",fontFamily:"Arial,sans-serif",background:"#f5f7fa",color:"#172033"}}>
      <header style={{padding:"22px 7%",display:"flex",justifyContent:"space-between",alignItems:"center",background:"#fff",borderBottom:"1px solid #e8ebf0",position:"sticky",top:0,zIndex:20}}>
        <div style={{fontWeight:900,fontSize:24}}>CHAVE <span style={{background:"#f59b32",color:"#fff",padding:"6px 9px",borderRadius:8}}>10</span></div>
        <a href="/login" style={{color:"#172033",textDecoration:"none",fontWeight:700}}>Entrar</a>
      </header>
      <section style={{padding:"72px 7% 55px",background:"linear-gradient(135deg,#172033 0%,#27354b 100%)",color:"#fff"}}>
        <div style={{maxWidth:1100,margin:"0 auto",display:"grid",gridTemplateColumns:"minmax(0,1.3fr) minmax(280px,.7fr)",gap:40,alignItems:"center"}}>
          <div>
            <div style={{display:"inline-block",background:"#f59b32",padding:"7px 12px",borderRadius:20,fontWeight:800,fontSize:13}}>GESTÃO DE OFICINA</div>
            <h1 style={{fontSize:"clamp(38px,6vw,64px)",lineHeight:1.05,margin:"18px 0 18px"}}>Sua oficina organizada em um só lugar.</h1>
            <p style={{fontSize:20,lineHeight:1.6,color:"#dbe2ec",maxWidth:680}}>Clientes, veículos, orçamentos, ordens de serviço, estoque e financeiro em um sistema simples para sua oficina.</p>
            <a href={MERCADO_PAGO_URL} style={{display:"inline-block",marginTop:24,background:"#f59b32",color:"#fff",textDecoration:"none",padding:"16px 28px",borderRadius:10,fontWeight:800,fontSize:18}}>Assinar por R$ 29,99/mês</a>
            <div style={{marginTop:12,fontSize:13,color:"#b9c3d1"}}>Pagamento seguro processado pelo Mercado Pago.</div>
          </div>
          <div style={{background:"#fff",color:"#172033",borderRadius:20,padding:28,boxShadow:"0 18px 45px rgba(0,0,0,.25)"}}>
            <div style={{fontSize:14,color:"#687386"}}>PLANO ÚNICO</div>
            <h2 style={{fontSize:28,margin:"8px 0"}}>Chave 10</h2>
            <div style={{fontSize:38,fontWeight:900}}>R$ 29,99 <span style={{fontSize:15,fontWeight:500}}>/ mês</span></div>
            <div style={{height:1,background:"#e7eaf0",margin:"20px 0"}} />
            {["Clientes e veículos","Orçamentos e PDF","Ordens de serviço","Estoque","Financeiro"].map(item=><div key={item} style={{padding:"9px 0",fontWeight:600}}>✓ {item}</div>)}
            <a href={MERCADO_PAGO_URL} style={{display:"block",textAlign:"center",marginTop:18,background:"#009ee3",color:"#fff",textDecoration:"none",padding:14,borderRadius:9,fontWeight:800}}>Começar agora</a>
          </div>
        </div>
      </section>
      <section style={{padding:"55px 7%",background:"#fff"}}>
        <div style={{maxWidth:1100,margin:"0 auto"}}>
          <h2 style={{fontSize:32,textAlign:"center",marginTop:0}}>Tudo que sua oficina precisa</h2>
          <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(180px,1fr))",gap:14,marginTop:28}}>
            {[
              ["👥","Clientes","Cadastro e organização dos clientes."],
              ["🚗","Veículos","Histórico e dados dos veículos."],
              ["📋","Orçamentos","Crie, gere PDF e compartilhe."],
              ["🔧","Ordens de serviço","Acompanhe cada serviço."],
              ["📦","Estoque","Controle entradas e saídas."],
              ["💰","Financeiro","Acompanhe os recebimentos das OS."]
            ].map(([icon,title,text])=><div key={title} style={{border:"1px solid #e5e7eb",borderRadius:12,padding:20}}><div style={{fontSize:28}}>{icon}</div><h3 style={{margin:"10px 0 6px"}}>{title}</h3><p style={{margin:0,color:"#687386",lineHeight:1.5}}>{text}</p></div>)}
          </div>
        </div>
      </section>
      <section style={{padding:"45px 7%",background:"#f5f7fa",textAlign:"center"}}>
        <h2 style={{fontSize:32,margin:"0 0 10px"}}>Comece a organizar sua oficina</h2>
        <p style={{color:"#687386"}}>Plano único de R$ 29,99 por mês.</p>
        <a href={MERCADO_PAGO_URL} style={{display:"inline-block",marginTop:12,background:"#f59b32",color:"#fff",textDecoration:"none",padding:"15px 28px",borderRadius:10,fontWeight:800}}>Assinar agora</a>
      </section>
      <footer style={{padding:25,textAlign:"center",background:"#172033",color:"#b9c3d1",fontSize:13}}>Chave 10 — Gestão de Oficina</footer>
    </main>
  );
}
