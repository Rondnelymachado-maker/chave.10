"use client";

const MERCADO_PAGO_URL = "https://mpago.la/18fhBWP";

const features = [
  ["👥","Clientes e veículos","Cadastre clientes, veículos, telefone, placa, modelo, ano e quilometragem."],
  ["🧾","Orçamentos em PDF","Monte orçamentos profissionais, calcule valores e gere PDF para enviar ao cliente."],
  ["🔧","Ordens de serviço","Transforme orçamento aprovado em OS e acompanhe o serviço até a entrega."],
  ["📦","Estoque","Cadastre peças, entradas e saídas e acompanhe o valor disponível em estoque."],
  ["💰","Financeiro","Visualize os recebimentos das ordens concluídas e acompanhe o movimento da oficina."],
  ["📱","Acesso pelo celular","Use o sistema pelo computador ou celular, direto pelo navegador."],
];

const steps = [
  ["01","Cadastre","Clientes, veículos e peças da sua oficina."],
  ["02","Organize","Crie orçamentos e ordens de serviço em poucos passos."],
  ["03","Controle","Acompanhe estoque, serviços e financeiro em um só lugar."],
];

export default function Home() {
  return (
    <main style={{minHeight:"100vh",fontFamily:"Arial,sans-serif",background:"#f6f8fb",color:"#172033"}}>
      <style>{`
        *{box-sizing:border-box}
        html{scroll-behavior:smooth}
        .c10-wrap{max-width:1180px;margin:0 auto;padding:0 22px}
        .c10-nav{height:74px;display:flex;align-items:center;justify-content:space-between}
        .c10-links{display:flex;gap:28px;align-items:center}
        .c10-links a{color:#172033;text-decoration:none;font-size:14px;font-weight:700}
        .c10-hero{background:linear-gradient(135deg,#111c30 0%,#263751 100%);color:#fff}
        .c10-hero-grid{min-height:610px;display:grid;grid-template-columns:1.05fr .95fr;align-items:center;gap:40px;padding:70px 0}
        .c10-kicker{display:inline-block;color:#f59b32;font-size:13px;font-weight:900;letter-spacing:.08em}
        .c10-hero h1{font-size:clamp(42px,6vw,68px);line-height:1.02;margin:16px 0}
        .c10-hero h1 span{color:#f59b32}
        .c10-hero p{font-size:19px;line-height:1.6;color:#dce3ec;max-width:650px}
        .c10-btn{display:inline-flex;align-items:center;justify-content:center;gap:8px;padding:15px 24px;border-radius:9px;text-decoration:none;font-weight:800;font-size:16px}
        .c10-primary{background:#f59b32;color:#fff}
        .c10-secondary{border:1px solid #718096;color:#fff;margin-left:10px}
        .c10-pills{display:flex;gap:22px;margin-top:22px;flex-wrap:wrap;color:#cbd5e1;font-size:13px}
        .c10-pills span:before{content:"✓";color:#f59b32;font-weight:900;margin-right:7px}
        .c10-visual{background:linear-gradient(145deg,#f9fafc,#dfe6ee);border-radius:24px;padding:18px;box-shadow:0 25px 60px rgba(0,0,0,.28)}
        .c10-window{background:#fff;border-radius:14px;overflow:hidden;box-shadow:0 12px 30px rgba(23,32,51,.18)}
        .c10-window-top{height:44px;background:#172033;color:#fff;display:flex;align-items:center;padding:0 16px;font-weight:800}
        .c10-window-body{display:grid;grid-template-columns:150px 1fr;min-height:330px}
        .c10-side{background:#172033;color:#fff;padding:14px}
        .c10-side div{padding:9px 6px;color:#d9e0e9;font-size:12px}
        .c10-side .on{background:#2a3850;border-radius:6px;color:#fff}
        .c10-dash{padding:16px;background:#f7f9fc}
        .c10-statgrid{display:grid;grid-template-columns:repeat(3,1fr);gap:8px}
        .c10-stat{background:#fff;border:1px solid #e5e9ef;border-radius:8px;padding:10px}
        .c10-stat small{color:#697586;font-size:9px}.c10-stat b{display:block;font-size:16px;margin-top:5px}
        .c10-table{margin-top:10px;background:#fff;border:1px solid #e5e9ef;border-radius:8px;padding:10px}
        .c10-row{display:grid;grid-template-columns:1.2fr 1fr .7fr;gap:8px;padding:8px 0;border-bottom:1px solid #eef1f4;font-size:10px}
        .c10-row:last-child{border-bottom:0}
        .c10-modules{background:#fff;padding:18px 0;box-shadow:0 4px 18px rgba(23,32,51,.06)}
        .c10-module-grid{display:grid;grid-template-columns:repeat(6,1fr);gap:12px}
        .c10-module{padding:18px 10px;text-align:center;border:1px solid #e8edf3;border-radius:12px;background:#fff}
        .c10-module .ico{font-size:26px}.c10-module b{display:block;margin-top:8px;font-size:13px}
        .c10-section{padding:85px 0}
        .c10-eyebrow{color:#f59b32;font-size:12px;font-weight:900;letter-spacing:.08em}
        .c10-title{font-size:40px;line-height:1.1;margin:10px 0 14px}
        .c10-sub{color:#687386;line-height:1.65;max-width:650px}
        .c10-feature-grid{display:grid;grid-template-columns:repeat(2,1fr);gap:16px;margin-top:35px}
        .c10-feature{background:#fff;border:1px solid #e7ebf0;border-radius:14px;padding:22px;display:flex;gap:15px}
        .c10-feature .ico{font-size:25px}.c10-feature h3{margin:0 0 7px;font-size:18px}.c10-feature p{margin:0;color:#687386;line-height:1.5;font-size:14px}
        .c10-steps{display:grid;grid-template-columns:repeat(3,1fr);gap:18px;margin-top:35px}
        .c10-step{background:#172033;color:#fff;border-radius:14px;padding:28px}
        .c10-step .num{color:#f59b32;font-weight:900;font-size:13px}.c10-step h3{margin:10px 0 6px}.c10-step p{color:#cbd5e1;margin:0;line-height:1.5}
        .c10-price{background:#fff;border:1px solid #e4e9ef;border-radius:18px;padding:30px;max-width:560px;margin:30px auto 0;box-shadow:0 18px 45px rgba(23,32,51,.08)}
        .c10-price-label{color:#687386;font-size:13px;font-weight:800}.c10-price h3{font-size:22px;margin:10px 0}.c10-price strong{font-size:46px}.c10-price ul{list-style:none;padding:0;margin:22px 0}.c10-price li{padding:8px 0;color:#344054}.c10-price li:before{content:"✓";color:#f59b32;font-weight:900;margin-right:8px}
        .c10-faq{display:grid;grid-template-columns:1fr 1fr;gap:14px;margin-top:30px}
        .c10-faq-item{background:#fff;border:1px solid #e7ebf0;border-radius:12px;padding:20px}.c10-faq-item b{display:block;margin-bottom:8px}.c10-faq-item p{margin:0;color:#687386;line-height:1.5;font-size:14px}
        .c10-cta{background:#111c30;color:#fff;text-align:center;padding:70px 22px}.c10-cta h2{font-size:40px;margin:0 0 12px}.c10-cta p{color:#cbd5e1;margin-bottom:25px}
        .c10-footer{background:#0c1525;color:#9ba8ba;padding:22px;text-align:center;font-size:12px}
        @media(max-width:800px){
          .c10-links{display:none}.c10-hero-grid{grid-template-columns:1fr;padding:52px 0}.c10-visual{order:2}.c10-hero h1{font-size:43px}.c10-module-grid{grid-template-columns:repeat(3,1fr)}.c10-feature-grid,.c10-faq{grid-template-columns:1fr}.c10-steps{grid-template-columns:1fr}.c10-section{padding:58px 0}.c10-title{font-size:32px}.c10-window-body{grid-template-columns:105px 1fr}.c10-side div{font-size:10px}.c10-statgrid{grid-template-columns:1fr 1fr}.c10-secondary{margin-left:0;margin-top:10px}.c10-actions{display:flex;flex-direction:column;align-items:flex-start;gap:0}
        }
        @media(max-width:480px){.c10-module-grid{grid-template-columns:repeat(2,1fr)}.c10-window-body{min-height:270px}.c10-side{display:none}.c10-window-body{display:block}.c10-dash{min-height:270px}.c10-btn{width:100%}}
      `}</style>

      <header style={{background:"#fff",borderBottom:"1px solid #e7ebf0",position:"sticky",top:0,zIndex:50}}>
        <div className="c10-wrap c10-nav">
          <div style={{fontWeight:900,fontSize:22}}>CHAVE <span style={{background:"#f59b32",color:"#fff",padding:"6px 9px",borderRadius:8}}>10</span><small style={{display:"block",fontSize:8,color:"#687386",letterSpacing:".08em",marginTop:3}}>GESTÃO DE OFICINA</small></div>
          <nav className="c10-links"><a href="#funcionalidades">Funcionalidades</a><a href="#como-funciona">Como funciona</a><a href="#plano">Plano</a><a href="#duvidas">Dúvidas</a></nav>
          <div style={{display:"flex",gap:8}}><a className="c10-btn" style={{padding:"10px 15px",fontSize:14,color:"#172033",background:"#f2f4f7"}} href="/login">Entrar</a><a className="c10-btn c10-primary" style={{padding:"10px 15px",fontSize:14}} href={MERCADO_PAGO_URL}>Começar agora →</a></div>
        </div>
      </header>

      <section className="c10-hero">
        <div className="c10-wrap c10-hero-grid">
          <div>
            <div className="c10-kicker">SISTEMA DE GESTÃO PARA OFICINAS MECÂNICAS</div>
            <h1>Sua oficina mais <span>organizada</span>, produtiva e sob controle.</h1>
            <p>Centralize clientes, veículos, orçamentos, ordens de serviço, estoque e financeiro em um único sistema simples de usar.</p>
            <div className="c10-actions" style={{marginTop:26}}><a className="c10-btn c10-primary" href={MERCADO_PAGO_URL}>Começar agora →</a><a className="c10-btn c10-secondary" href="#funcionalidades">Conhecer funcionalidades</a></div>
            <div className="c10-pills"><span>Sem instalação</span><span>Acesso pelo celular</span><span>Pagamento via Mercado Pago</span></div>
          </div>
          <div className="c10-visual">
            <div className="c10-window">
              <div className="c10-window-top">CHAVE <span style={{background:"#f59b32",padding:"3px 6px",borderRadius:5,marginLeft:5}}>10</span><span style={{marginLeft:"auto",fontSize:11,fontWeight:400}}>Painel da oficina</span></div>
              <div className="c10-window-body">
                <div className="c10-side"><div className="on">▦ Dashboard</div><div>♙ Clientes</div><div>▱ Veículos</div><div>▤ Orçamentos</div><div>⚙ Ordens de serviço</div><div>▦ Estoque</div><div>💰 Financeiro</div></div>
                <div className="c10-dash"><div className="c10-statgrid"><div className="c10-stat"><small>OS em andamento</small><b>8</b></div><div className="c10-stat"><small>Orçamentos</small><b>12</b></div><div className="c10-stat"><small>Clientes</small><b>25</b></div></div><div className="c10-table"><b style={{fontSize:12}}>Ordens de serviço</b><div className="c10-row"><b>OS-00124</b><span>Cliente</span><span>Em andamento</span></div><div className="c10-row"><b>OS-00123</b><span>Cliente</span><span>Concluída</span></div><div className="c10-row"><b>OS-00122</b><span>Cliente</span><span>Aberta</span></div></div><div className="c10-table"><b style={{fontSize:12}}>Controle financeiro</b><div style={{fontSize:20,fontWeight:900,marginTop:8}}>R$ 12.450,00</div></div></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="c10-modules"><div className="c10-wrap c10-module-grid">{features.map(([icon,title])=><div className="c10-module" key={title}><div className="ico">{icon}</div><b>{title}</b></div>)}</div></section>

      <section className="c10-section" id="funcionalidades"><div className="c10-wrap">
        <div className="c10-eyebrow">FUNCIONALIDADES</div><h2 className="c10-title">Tudo que sua oficina precisa, sem complicação.</h2><p className="c10-sub">Organize a rotina da oficina desde o cadastro do veículo até o fechamento da ordem de serviço e o acompanhamento financeiro.</p>
        <div className="c10-feature-grid">{features.map(([icon,title,desc])=><div className="c10-feature" key={title}><div className="ico">{icon}</div><div><h3>{title}</h3><p>{desc}</p></div></div>)}</div>
      </div></section>

      <section className="c10-section" id="como-funciona" style={{background:"#fff"}}><div className="c10-wrap">
        <div className="c10-eyebrow">COMO FUNCIONA</div><h2 className="c10-title">Uma rotina mais simples para sua oficina.</h2><p className="c10-sub">O Chave 10 conecta as principais etapas da gestão em um fluxo único.</p>
        <div className="c10-steps">{steps.map(([num,title,desc])=><div className="c10-step" key={num}><div className="num">{num}</div><h3>{title}</h3><p>{desc}</p></div>)}</div>
      </div></section>

      <section className="c10-section" id="plano"><div className="c10-wrap" style={{textAlign:"center"}}>
        <div className="c10-eyebrow">PLANO ÚNICO</div><h2 className="c10-title">Tudo em um só plano.</h2><p className="c10-sub" style={{margin:"0 auto"}}>Sem escolher módulos. Você tem acesso aos recursos disponíveis do Chave 10 por uma mensalidade única.</p>
        <div className="c10-price"><div className="c10-price-label">CHAVE 10</div><h3>Gestão completa para sua oficina</h3><div><strong>R$ 29,99</strong> <span>/ mês</span></div><ul style={{textAlign:"left"}}><li>Clientes e veículos</li><li>Orçamentos e geração de PDF</li><li>Ordens de serviço</li><li>Estoque e movimentações</li><li>Financeiro</li><li>Acesso pelo navegador</li></ul><a className="c10-btn c10-primary" style={{width:"100%"}} href={MERCADO_PAGO_URL}>Assinar por R$ 29,99/mês →</a><div style={{fontSize:12,color:"#687386",marginTop:12}}>Pagamento processado pelo Mercado Pago.</div></div>
      </div></section>

      <section className="c10-section" id="duvidas" style={{paddingTop:20}}><div className="c10-wrap">
        <div className="c10-eyebrow">DÚVIDAS</div><h2 className="c10-title">Perguntas frequentes.</h2>
        <div className="c10-faq">
          <div className="c10-faq-item"><b>Preciso instalar algum programa?</b><p>Não. O Chave 10 funciona pelo navegador, no computador ou celular.</p></div>
          <div className="c10-faq-item"><b>O que está incluído no plano?</b><p>Clientes, veículos, orçamentos, PDF, ordens de serviço, estoque e financeiro.</p></div>
          <div className="c10-faq-item"><b>Como faço para assinar?</b><p>Toque em “Começar agora” ou “Assinar” e continue o pagamento pelo Mercado Pago.</p></div>
          <div className="c10-faq-item"><b>Posso acessar pelo celular?</b><p>Sim. O sistema foi estruturado para funcionar também em telas menores.</p></div>
        </div>
      </div></section>

      <section className="c10-cta"><h2>Pronto para organizar sua oficina?</h2><p>Comece agora com o Chave 10 e centralize a gestão da sua oficina.</p><a className="c10-btn c10-primary" href={MERCADO_PAGO_URL}>Começar agora →</a></section>
      <footer className="c10-footer">© 2026 Chave 10 · Gestão de Oficina · <a href="/login" style={{color:"#cbd5e1"}}>Entrar</a></footer>
    </main>
  );
}
