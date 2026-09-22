"use client";

const MERCADO_PAGO_URL = "https://mpago.la/18fhBWP";

const features = [
  ["👤","Clientes e veículos","Cadastre clientes e veículos com telefone, placa, modelo, ano e quilometragem."],
  ["▤","Orçamentos em PDF","Crie orçamentos profissionais e envie por WhatsApp."],
  ["🔧","Ordens de serviço","Controle cada etapa do serviço até a entrega."],
  ["⬢","Estoque e compras","Gerencie peças, alertas de estoque e histórico."],
  ["▥","Financeiro completo","Acompanhe entradas, saídas e resultados da oficina."],
  ["▣","Relatórios e indicadores","Veja o desempenho da oficina com informações simples."],
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
        body{margin:0}
        .c10-wrap{max-width:1180px;margin:0 auto;padding:0 24px}
        .c10-nav{height:72px;display:flex;align-items:center;justify-content:space-between}
        .c10-links{display:flex;gap:26px;align-items:center}.c10-links a{color:#172033;text-decoration:none;font-size:13px;font-weight:800}
        .c10-btn{display:inline-flex;align-items:center;justify-content:center;gap:8px;padding:15px 22px;border-radius:8px;text-decoration:none;font-weight:900;font-size:15px}
        .c10-primary{background:#f59b32;color:#fff}.c10-secondary{border:1px solid #718096;color:#fff;background:transparent}
        .c10-hero{color:#fff;background:#111d31;position:relative;overflow:hidden}
        .c10-hero:before{content:"";position:absolute;inset:0;background:linear-gradient(90deg,rgba(10,20,35,.98) 0%,rgba(10,20,35,.9) 42%,rgba(10,20,35,.35) 100%),url("https://images.unsplash.com/photo-1711386689622-1cda23e10217?auto=format&fit=crop&fm=jpg&q=82&w=2200") center/cover no-repeat}
        .c10-hero-grid{position:relative;min-height:520px;display:grid;grid-template-columns:1fr 1.05fr;align-items:center;gap:40px;padding:62px 0}
        .c10-kicker,.c10-eyebrow{color:#f59b32;font-size:12px;font-weight:900;letter-spacing:.08em}.c10-hero h1{font-size:clamp(42px,6vw,67px);line-height:1.02;margin:14px 0}.c10-hero h1 span{color:#f59b32}.c10-hero p{font-size:17px;line-height:1.55;color:#e3e9f1;max-width:610px}
        .c10-actions{display:flex;gap:10px;margin-top:24px}.c10-pills{display:flex;gap:20px;flex-wrap:wrap;margin-top:20px;color:#d8e0ea;font-size:11px}.c10-pills span:before{content:"✓";color:#f59b32;font-weight:900;margin-right:6px}
        .c10-hero-photo{min-height:390px;border-radius:20px;background:linear-gradient(180deg,transparent 50%,rgba(9,17,30,.75)),url("https://images.unsplash.com/photo-1711386689622-1cda23e10217?auto=format&fit=crop&fm=jpg&q=82&w=1600") center/cover;box-shadow:0 25px 70px rgba(0,0,0,.32);position:relative}
        .c10-quote{position:absolute;right:20px;top:30px;max-width:180px;font-size:16px;font-weight:900;font-style:italic;text-align:right}.c10-checks{position:absolute;right:18px;bottom:18px;background:rgba(17,32,51,.88);border-radius:12px;padding:13px;width:190px}.c10-checks div{font-size:11px;margin:7px 0}.c10-checks b{color:#f59b32;margin-right:5px}
        .c10-modules{background:#fff;padding:14px 0;box-shadow:0 5px 20px rgba(0,0,0,.07)}.c10-module-grid{display:grid;grid-template-columns:repeat(6,1fr);gap:10px}.c10-module{text-align:center;padding:16px 8px;border-right:1px solid #e8edf3}.c10-module:last-child{border:0}.c10-module .ico{font-size:25px}.c10-module b{display:block;margin-top:6px;font-size:12px}
        .c10-section{padding:76px 0}.c10-title{font-size:39px;line-height:1.08;margin:8px 0 12px}.c10-sub{color:#687386;line-height:1.6;max-width:650px}.c10-dark{background:#111d31;color:#fff}.c10-dark .c10-sub{color:#d5dde8}
        .c10-split{display:grid;grid-template-columns:1fr 1fr;gap:42px;align-items:center}.c10-feature-list{margin-top:24px}.c10-feature-list div{margin:11px 0;font-size:14px}.c10-feature-list b{display:inline-flex;width:22px;height:22px;align-items:center;justify-content:center;background:#f59b32;color:#fff;border-radius:50%;margin-right:8px;font-size:12px}
        .c10-dashboard{background:#f5f7fa;border-radius:16px;padding:13px;box-shadow:0 22px 55px rgba(0,0,0,.22)}.c10-window{background:#fff;border-radius:12px;overflow:hidden}.c10-window-top{height:40px;background:#172033;color:#fff;padding:0 13px;display:flex;align-items:center;font-weight:900;font-size:12px}.c10-window-body{display:grid;grid-template-columns:120px 1fr;min-height:300px}.c10-side{background:#172033;color:#fff;padding:10px}.c10-side div{font-size:10px;padding:8px 5px;color:#cbd5e1}.c10-side .on{background:#2a3850;border-radius:5px;color:#fff}.c10-dash{padding:12px}.c10-statgrid{display:grid;grid-template-columns:repeat(3,1fr);gap:7px}.c10-stat{background:#fff;border:1px solid #e3e8ee;border-radius:7px;padding:8px}.c10-stat small{font-size:8px;color:#687386}.c10-stat b{display:block;font-size:15px;margin-top:4px}.c10-table{margin-top:9px;background:#fff;border:1px solid #e3e8ee;border-radius:7px;padding:9px}.c10-row{display:grid;grid-template-columns:1.1fr 1fr .8fr;gap:5px;padding:7px 0;border-bottom:1px solid #eef1f4;font-size:9px}.c10-row:last-child{border:0}
        .c10-devices{display:flex;align-items:end;justify-content:center;gap:12px;margin-top:24px}.c10-device{background:#111d31;border:7px solid #e7ebef;border-radius:12px;padding:7px;color:#fff;box-shadow:0 15px 30px rgba(0,0,0,.15)}.c10-device.phone{width:72px;height:135px}.c10-device.laptop{width:250px;height:155px}.c10-device.tablet{width:130px;height:165px}.c10-device .screen{height:100%;background:linear-gradient(145deg,#172033,#34465f);border-radius:5px;padding:10px;font-size:8px}.c10-device .screen b{display:block;color:#f59b32;font-size:12px;margin-bottom:10px}
        .c10-feature-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:14px;margin-top:30px}.c10-feature{padding:18px;background:#fff;border:1px solid #e7ebf0;border-radius:12px}.c10-feature .ico{font-size:23px}.c10-feature h3{margin:7px 0 5px;font-size:16px}.c10-feature p{margin:0;color:#687386;font-size:13px;line-height:1.45}
        .c10-steps{display:grid;grid-template-columns:repeat(3,1fr);gap:16px;margin-top:30px}.c10-step{background:#172033;color:#fff;border-radius:12px;padding:24px}.c10-step .num{color:#f59b32;font-weight:900;font-size:12px}.c10-step h3{margin:9px 0 5px}.c10-step p{margin:0;color:#cbd5e1;font-size:13px;line-height:1.5}
        .c10-price-wrap{display:grid;grid-template-columns:1fr 1.2fr 1fr;gap:20px;align-items:center;margin-top:30px}.c10-price-side{background:#fff;border:1px solid #e5eaf0;border-radius:12px;padding:22px}.c10-price{background:#fff;border:1px solid #e5eaf0;border-radius:14px;padding:25px;box-shadow:0 15px 40px rgba(23,32,51,.09)}.c10-price strong{font-size:43px}.c10-price ul{list-style:none;padding:0;margin:17px 0;text-align:left}.c10-price li{padding:6px 0;font-size:13px}.c10-price li:before{content:"✓";color:#f59b32;font-weight:900;margin-right:7px}
        .c10-faq{display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-top:25px}.c10-faq-item{background:#fff;border:1px solid #e5eaf0;border-radius:10px;padding:18px}.c10-faq-item b{font-size:14px}.c10-faq-item p{margin:7px 0 0;color:#687386;font-size:13px;line-height:1.45}
        .c10-cta{background:#111d31;color:#fff;padding:55px 24px;text-align:center}.c10-cta h2{font-size:38px;margin:0 0 10px}.c10-cta p{color:#cbd5e1;margin-bottom:22px}.c10-footer{background:#0b1423;color:#9ba8ba;text-align:center;padding:20px;font-size:11px}
        .c10-wa{position:fixed;right:18px;bottom:18px;width:58px;height:58px;border-radius:50%;background:#16a34a;color:#fff;display:flex;align-items:center;justify-content:center;font-size:28px;text-decoration:none;box-shadow:0 8px 25px rgba(0,0,0,.25);z-index:60}
        @media(max-width:850px){.c10-links{display:none}.c10-hero-grid,.c10-split{grid-template-columns:1fr}.c10-hero-grid{padding:46px 0}.c10-hero-photo{min-height:330px}.c10-module-grid{grid-template-columns:repeat(3,1fr)}.c10-feature-grid{grid-template-columns:1fr 1fr}.c10-price-wrap{grid-template-columns:1fr}.c10-price-side{display:none}.c10-devices{flex-wrap:wrap}.c10-laptop{order:1}}
        @media(max-width:520px){.c10-wrap{padding:0 16px}.c10-actions{flex-direction:column}.c10-btn{width:100%}.c10-module-grid{grid-template-columns:repeat(2,1fr)}.c10-module{border-bottom:1px solid #e8edf3}.c10-feature-grid,.c10-faq,.c10-steps{grid-template-columns:1fr}.c10-hero h1{font-size:43px}.c10-title{font-size:31px}.c10-hero-photo{min-height:290px}.c10-quote{font-size:13px;max-width:145px}.c10-checks{width:155px}.c10-window-body{grid-template-columns:90px 1fr}.c10-side div{font-size:8px}.c10-device.laptop{width:210px;height:135px}.c10-device.tablet{width:105px;height:135px}}
      `}</style>

      <header style={{background:"#fff",borderBottom:"1px solid #e7ebf0",position:"sticky",top:0,zIndex:50}}>
        <div className="c10-wrap c10-nav">
          <div style={{fontWeight:900,fontSize:20}}>CHAVE <span style={{background:"#f59b32",color:"#fff",padding:"5px 8px",borderRadius:7}}>10</span><small style={{display:"block",fontSize:7,color:"#687386",letterSpacing:".08em",marginTop:2}}>GESTÃO DE OFICINA</small></div>
          <nav className="c10-links"><a href="#funcionalidades">Funcionalidades</a><a href="#como-funciona">Como funciona</a><a href="#plano">Planos</a><a href="#depoimentos">Depoimentos</a><a href="#duvidas">Dúvidas</a></nav>
          <div style={{display:"flex",gap:8}}><a className="c10-btn" style={{padding:"10px 14px",fontSize:13,color:"#172033",background:"#f2f4f7"}} href="/login">Entrar</a><a className="c10-btn c10-primary" style={{padding:"10px 14px",fontSize:13}} href={MERCADO_PAGO_URL}>Começar agora →</a></div>
        </div>
      </header>

      <section className="c10-hero">
        <div className="c10-wrap c10-hero-grid">
          <div>
            <div className="c10-kicker">SISTEMA DE GESTÃO PARA OFICINAS MECÂNICAS</div>
            <h1>Sua oficina mais <span>organizada, lucrativa</span> e em um só lugar.</h1>
            <p>Controle clientes, veículos, orçamentos, ordens de serviço, estoque e financeiro de forma simples, rápida e segura.</p>
            <div className="c10-actions"><a className="c10-btn c10-primary" href={MERCADO_PAGO_URL}>Começar agora →</a><a className="c10-btn c10-secondary" href="#como-funciona">▷ Ver como funciona</a></div>
            <div className="c10-pills"><span>Sem instalação</span><span>Acesso pelo celular, computador, tablet e notebook</span><span>Pagamento via Mercado Pago</span><span>Suporte em português</span></div>
          </div>
          <div className="c10-hero-photo"><div className="c10-quote">“Mais tempo para o que realmente importa.”</div><div className="c10-checks"><div><b>✓</b>Mais controle</div><div><b>✓</b>Mais organização</div><div><b>✓</b>Mais lucro</div><div><b>✓</b>Mais tempo para você</div></div></div>
        </div>
      </section>

      <section className="c10-modules"><div className="c10-wrap c10-module-grid">{features.map(([icon,title])=><div className="c10-module" key={title}><div className="ico">{icon}</div><b>{title}</b></div>)}</div></section>

      <section className="c10-section c10-dark" id="funcionalidades"><div className="c10-wrap c10-split">
        <div><div className="c10-eyebrow">SISTEMA COMPLETO</div><h2 className="c10-title">Tudo que sua oficina precisa, sem complicação.</h2><p className="c10-sub">O Chave 10 foi feito para o dia a dia da oficina mecânica, com foco em produtividade, organização e lucro.</p><div className="c10-feature-list"><div><b>✓</b>Interface simples e intuitiva</div><div><b>✓</b>Funciona em qualquer dispositivo</div><div><b>✓</b>Dados seguros na nuvem</div><div><b>✓</b>Suporte em português</div><div><b>✓</b>Atualizações constantes</div><div><b>✓</b>Ideal para oficinas de todos os tamanhos</div></div></div>
        <div className="c10-dashboard"><div className="c10-window"><div className="c10-window-top">CHAVE 10 <span style={{marginLeft:"auto",fontWeight:400}}>Visão Geral</span></div><div className="c10-window-body"><div className="c10-side"><div className="on">Dashboard</div><div>Clientes</div><div>Veículos</div><div>Orçamentos</div><div>Ordens</div><div>Estoque</div><div>Financeiro</div></div><div className="c10-dash"><div className="c10-statgrid"><div className="c10-stat"><small>OS em andamento</small><b>12</b></div><div className="c10-stat"><small>Orçamentos</small><b>8</b></div><div className="c10-stat"><small>Financeiro</small><b>R$ 12.450</b></div></div><div className="c10-table"><b style={{fontSize:11}}>Ordens de Serviço</b><div className="c10-row"><b>OS 0012</b><span>João Silva</span><span>Em andamento</span></div><div className="c10-row"><b>OS 0011</b><span>Maria Souza</span><span>Concluída</span></div><div className="c10-row"><b>OS 0010</b><span>Carlos Lima</span><span>Aberta</span></div></div><div className="c10-table"><b style={{fontSize:11}}>Orçamentos Recentes</b><div style={{fontSize:18,fontWeight:900,marginTop:8}}>R$ 8.920</div></div></div></div></div></div>
      </div></section>

      <section className="c10-section" id="como-funciona"><div className="c10-wrap c10-split">
        <div><div className="c10-eyebrow">LIBERDADE PARA GERENCIAR</div><h2 className="c10-title">Acesse de onde estiver.</h2><p className="c10-sub">O Chave 10 funciona em qualquer dispositivo com internet. Use no celular, notebook, computador ou tablet e tenha sua oficina sempre na palma da sua mão.</p><div className="c10-devices"><div className="c10-device phone"><div className="screen"><b>10</b>Visão Geral</div></div><div className="c10-device laptop"><div className="screen"><b>CHAVE 10</b>Ordens · Clientes · Financeiro</div></div><div className="c10-device tablet"><div className="screen"><b>CHAVE 10</b>Estoque</div></div></div></div>
        <div><div className="c10-feature-grid">{features.slice(0,3).map(([icon,title,desc])=><div className="c10-feature" key={title}><div className="ico">{icon}</div><h3>{title}</h3><p>{desc}</p></div>)}</div></div>
      </div></section>

      <section className="c10-section" id="plano" style={{background:"#f6f8fb"}}><div className="c10-wrap" style={{textAlign:"center"}}><div className="c10-eyebrow">PLANO ÚNICO</div><h2 className="c10-title">Preço justo. Sem complicação.</h2><p className="c10-sub" style={{margin:"0 auto"}}>Todas as funcionalidades por um valor acessível. Sem taxa de instalação. Sem fidelidade.</p><div className="c10-price-wrap"><div className="c10-price-side"><b>🛡️ Seus dados protegidos</b><p style={{color:"#687386",fontSize:12,lineHeight:1.5}}>Utilizamos tecnologia para ajudar a garantir a segurança das suas informações.</p></div><div className="c10-price"><div style={{fontWeight:900}}>Chave 10</div><div><strong>R$ 29,99</strong> <span>/ mês</span></div><ul><li>Todos os módulos incluídos</li><li>Acesso em todos os dispositivos</li><li>Suporte via WhatsApp</li><li>Ativação rápida</li><li>Sem taxa de instalação</li><li>Sem fidelidade</li></ul><a className="c10-btn c10-primary" style={{width:"100%"}} href={MERCADO_PAGO_URL}>Começar agora →</a><div style={{fontSize:11,color:"#687386",marginTop:10}}>Pagamento processado pelo Mercado Pago.</div></div><div className="c10-price-side"><b>🤝 Pagamento seguro</b><p style={{color:"#687386",fontSize:12,lineHeight:1.5}}>Pagamento via Mercado Pago, com as opções disponíveis no checkout.</p><b>◷ Ativação rápida</b><p style={{color:"#687386",fontSize:12,lineHeight:1.5}}>Comece a usar o sistema após a ativação da assinatura.</p></div></div></div></section>

      <section className="c10-section" id="duvidas"><div className="c10-wrap"><div className="c10-eyebrow">DÚVIDAS FREQUENTES</div><h2 className="c10-title">Perguntas frequentes.</h2><div className="c10-faq"><div className="c10-faq-item"><b>Preciso instalar algum programa?</b><p>Não. O Chave 10 funciona pelo navegador e não exige instalação.</p></div><div className="c10-faq-item"><b>Posso usar em mais de um computador?</b><p>Sim. Você pode acessar de qualquer lugar, em quantos dispositivos precisar.</p></div><div className="c10-faq-item"><b>Como é o pagamento?</b><p>O pagamento é feito pelo Mercado Pago, com as opções disponíveis no checkout.</p></div><div className="c10-faq-item"><b>O que está incluso no plano?</b><p>Clientes, veículos, orçamentos, ordens de serviço, estoque e financeiro.</p></div></div></div></section>

      <section className="c10-cta"><h2>Pronto para levar sua oficina a um novo nível?</h2><p>Comece agora e veja a diferença na sua rotina.</p><a className="c10-btn c10-primary" href={MERCADO_PAGO_URL}>Começar agora →</a></section>
      <footer className="c10-footer">© 2026 Chave 10. Todos os direitos reservados. · <a href="/login" style={{color:"#cbd5e1"}}>Entrar</a></footer><a className="c10-wa" href="https://wa.me/" aria-label="WhatsApp">◉</a>
    </main>
  );
}
