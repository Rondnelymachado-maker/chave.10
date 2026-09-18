import Link from "next/link";

const features = [
  ["👥","Clientes","Cadastre e organize seus clientes."],
  ["🚗","Veículos","Tenha os veículos e dados dos clientes sempre à mão."],
  ["🧾","Orçamentos","Monte e acompanhe orçamentos de forma rápida."],
  ["🔧","Ordens de serviço","Transforme o orçamento em OS e acompanhe os serviços."],
  ["📚","Histórico","Consulte o histórico de serviços de cada veículo."],
  ["💰","Financeiro","Registre entradas e saídas e acompanhe o movimento da oficina."]
];

const steps = [
  ["01","Cadastre","Organize clientes e veículos em poucos passos."],
  ["02","Orce","Crie orçamentos e acompanhe cada serviço."],
  ["03","Execute","Transforme o orçamento em OS e mantenha o histórico atualizado."]
];

const faqs = [
  ["Quanto custa o Chave 10?","O plano apresentado nesta página custa R$ 29,99 por mês."],
  ["Existe período de teste?","Sim. O Chave 10 oferece 14 dias de teste para conhecer o sistema."],
  ["O sistema funciona online?","Sim. O acesso é feito online, pelo navegador, sem depender de instalação local."],
  ["Quais recursos estão incluídos?","Clientes, veículos, orçamentos, ordens de serviço, histórico de veículos e financeiro."],
  ["Já tenho acesso. Onde entro?","Use o botão Entrar para acessar o sistema com seu e-mail e senha."]
];

export default function VendasPage(){
  return (
    <main style={{minHeight:"100vh",background:"#f7f8fa",color:"#172033",fontFamily:"Inter,Arial,sans-serif"}}>
      <header style={{background:"#fff",borderBottom:"1px solid #e6e9ee",position:"sticky",top:0,zIndex:20}}>
        <div style={{maxWidth:1120,margin:"auto",padding:"15px 22px",display:"flex",alignItems:"center",justifyContent:"space-between"}}>
          <Link href="/vendas" style={{display:"flex",alignItems:"center",gap:10,textDecoration:"none",color:"#172033"}}>
            <span style={{width:42,height:42,borderRadius:10,background:"#f5b942",display:"grid",placeItems:"center",fontWeight:900}}>🔑</span>
            <span><b style={{display:"block",letterSpacing:1}}>CHAVE 10</b><small style={{color:"#718096"}}>Gestão para oficinas</small></span>
          </Link>
          <Link href="/login" style={{color:"#172033",textDecoration:"none",fontWeight:800}}>Entrar</Link>
        </div>
      </header>

      <section style={{maxWidth:1120,margin:"auto",padding:"76px 22px 70px",display:"grid",gridTemplateColumns:"1.15fr .85fr",gap:42,alignItems:"center"}}>
        <div>
          <span style={{display:"inline-block",background:"#fff4d5",color:"#805d00",padding:"8px 12px",borderRadius:999,fontSize:12,fontWeight:900}}>GESTÃO PARA OFICINAS MECÂNICAS</span>
          <h1 style={{fontSize:"clamp(42px,6vw,68px)",lineHeight:1.02,letterSpacing:-2,margin:"18px 0"}}>Organize sua oficina. Simplifique sua rotina.</h1>
          <p style={{fontSize:19,lineHeight:1.6,color:"#667085",maxWidth:650}}>Clientes, veículos, orçamentos, ordens de serviço, histórico e financeiro em um único sistema.</p>
          <div style={{display:"flex",gap:12,flexWrap:"wrap",marginTop:28}}>
            <a href="#plano" style={{background:"#f5b942",color:"#172033",textDecoration:"none",padding:"14px 22px",borderRadius:9,fontWeight:900}}>Ver plano e preço →</a>
            <Link href="/login" style={{background:"#fff",color:"#172033",textDecoration:"none",padding:"14px 22px",borderRadius:9,fontWeight:800,border:"1px solid #dce1e8"}}>Entrar no sistema</Link>
          </div>
          <p style={{fontSize:13,color:"#7b8794",marginTop:15}}>14 dias de teste • R$ 29,99/mês • Acesso online</p>
        </div>
        <div style={{background:"#172033",borderRadius:22,padding:28,color:"#fff",boxShadow:"0 20px 50px rgba(23,32,51,.16)"}}>
          <div style={{color:"#f5b942",fontWeight:900,fontSize:12,letterSpacing:1.5}}>CHAVE 10</div>
          <h2 style={{fontSize:30,lineHeight:1.15,margin:"10px 0 20px"}}>Tudo organizado em um só lugar.</h2>
          {["Clientes e veículos","Orçamentos e OS","Histórico de serviços","Financeiro","Acesso protegido"].map(item=>
            <div key={item} style={{padding:"12px 0",borderBottom:"1px solid #303b4d",color:"#e9edf3"}}>✓ {item}</div>
          )}
        </div>
      </section>

      <section style={{background:"#fff",padding:"64px 22px"}}>
        <div style={{maxWidth:1120,margin:"auto"}}>
          <div style={{textAlign:"center",maxWidth:700,margin:"0 auto 36px"}}>
            <h2 style={{fontSize:38,margin:"0 0 10px"}}>Feito para o dia a dia da oficina</h2>
            <p style={{color:"#667085",lineHeight:1.6}}>Menos informação espalhada. Mais controle da operação.</p>
          </div>
          <div className="featureGrid" style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:16}}>
            {features.map(([icon,title,description])=>(
              <article key={title} style={{border:"1px solid #e5e9ef",borderRadius:14,padding:22,background:"#fff"}}>
                <div style={{fontSize:28}}>{icon}</div>
                <h3 style={{margin:"13px 0 7px"}}>{title}</h3>
                <p style={{margin:0,color:"#667085",lineHeight:1.5}}>{description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section style={{maxWidth:1120,margin:"auto",padding:"70px 22px"}}>
        <div style={{textAlign:"center",maxWidth:700,margin:"0 auto 34px"}}>
          <h2 style={{fontSize:38,margin:"0 0 10px"}}>Como funciona</h2>
          <p style={{color:"#667085",lineHeight:1.6}}>Uma rotina simples para colocar a gestão da oficina em ordem.</p>
        </div>
        <div className="stepsGrid" style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:16}}>
          {steps.map(([number,title,description])=>(
            <article key={number} style={{background:"#fff",border:"1px solid #e5e9ef",borderRadius:14,padding:24}}>
              <div style={{fontSize:13,fontWeight:900,color:"#805d00"}}>{number}</div>
              <h3 style={{fontSize:22,margin:"10px 0 7px"}}>{title}</h3>
              <p style={{margin:0,color:"#667085",lineHeight:1.5}}>{description}</p>
            </article>
          ))}
        </div>
      </section>

      <section id="plano" style={{background:"#fff",padding:"70px 22px"}}>
        <div style={{maxWidth:760,margin:"auto"}}>
          <div style={{textAlign:"center",marginBottom:28}}>
            <span style={{fontSize:12,fontWeight:900,color:"#805d00",background:"#fff4d5",padding:"7px 10px",borderRadius:999}}>PLANO ÚNICO</span>
            <h2 style={{fontSize:40,margin:"14px 0 8px"}}>Chave 10</h2>
            <p style={{color:"#667085"}}>Uma solução completa para começar a organizar sua oficina.</p>
          </div>
          <article style={{background:"#fdfdfd",border:"2px solid #f5b942",borderRadius:20,padding:32,boxShadow:"0 15px 40px rgba(23,32,51,.08)"}}>
            <div style={{fontSize:13,fontWeight:900,color:"#667085"}}>PLANO BÁSICO</div>
            <div style={{display:"flex",alignItems:"baseline",gap:6,margin:"8px 0 4px",flexWrap:"wrap"}}>
              <span style={{fontSize:"clamp(40px,8vw,52px)",fontWeight:900}}>R$ 29,99</span><span style={{color:"#667085"}}>/mês</span>
            </div>
            <p style={{color:"#667085",lineHeight:1.5}}>Tenha os principais processos da oficina centralizados em um único sistema.</p>
            <div style={{display:"grid",gap:11,margin:"24px 0"}}>
              {["Clientes","Veículos","Orçamentos","Ordens de serviço","Histórico de veículos","Financeiro"].map(item=>
                <div key={item} style={{fontWeight:700}}>✓ {item}</div>
              )}
            </div>
            <Link href="/login" style={{display:"block",textAlign:"center",background:"#f5b942",color:"#172033",textDecoration:"none",padding:"15px",borderRadius:9,fontWeight:900}}>Começar agora</Link>
            <p style={{textAlign:"center",fontSize:12,color:"#7b8794",margin:"13px 0 0"}}>14 dias de teste para conhecer o sistema.</p>
          </article>
        </div>
      </section>

      <section style={{maxWidth:900,margin:"auto",padding:"70px 22px"}}>
        <div style={{textAlign:"center",marginBottom:30}}>
          <h2 style={{fontSize:36,margin:"0 0 10px"}}>Perguntas frequentes</h2>
          <p style={{color:"#667085"}}>Informações rápidas sobre o Chave 10.</p>
        </div>
        <div style={{display:"grid",gap:12}}>
          {faqs.map(([question,answer])=>(
            <details key={question} style={{background:"#fff",border:"1px solid #e5e9ef",borderRadius:12,padding:"17px 20px"}}>
              <summary style={{fontWeight:800,cursor:"pointer"}}>{question}</summary>
              <p style={{color:"#667085",lineHeight:1.55,margin:"12px 0 0"}}>{answer}</p>
            </details>
          ))}
        </div>
      </section>

      <section style={{background:"#172033",color:"#fff",padding:"62px 22px"}}>
        <div style={{maxWidth:850,margin:"auto",textAlign:"center"}}>
          <h2 style={{fontSize:40,margin:"0 0 12px"}}>Sua oficina merece mais organização.</h2>
          <p style={{color:"#b7c0ce",fontSize:17,lineHeight:1.6}}>Conheça o Chave 10 e centralize a gestão da sua oficina.</p>
          <Link href="/login" style={{display:"inline-block",marginTop:15,background:"#f5b942",color:"#172033",textDecoration:"none",padding:"14px 25px",borderRadius:9,fontWeight:900}}>Começar agora →</Link>
        </div>
      </section>

      <footer style={{padding:"25px 22px",textAlign:"center",color:"#7b8794",fontSize:12}}>© 2026 Chave 10 • Gestão para oficinas mecânicas</footer>
      <style>{"@media(max-width:850px){main section{grid-template-columns:1fr!important}.featureGrid,.stepsGrid{grid-template-columns:1fr!important}}"}</style>
    </main>
  );
}
