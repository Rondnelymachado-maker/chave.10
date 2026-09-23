"use client";

const MERCADO_PAGO_URL = "https://mpago.la/18fhBWP";

export default function Home() {
  return (
    <main style={{margin:0,padding:0,background:"#fff",position:"relative",lineHeight:0}}>
      <div style={{position:"relative",width:"100%",maxWidth:1400,margin:"0 auto"}}>
        <img
          src="/11804D4D-7816-4B67-A3B8-4733DE7A9FDE.png"
          alt="Chave 10 — Gestão de Oficina"
          style={{display:"block",width:"100%",height:"auto"}}
        />
        <a href="/login" aria-label="Entrar" style={{position:"absolute",top:"1.5%",right:"15.5%",width:"12%",height:"4.5%",zIndex:5}} />
        <a href={MERCADO_PAGO_URL} aria-label="Começar agora" style={{position:"absolute",top:"1.5%",right:"2%",width:"14%",height:"4.5%",zIndex:5}} />
        <a href={MERCADO_PAGO_URL} aria-label="Assinar Chave 10" style={{position:"absolute",top:"68%",left:"38%",width:"24%",height:"6%",zIndex:5}} />
        <a href={MERCADO_PAGO_URL} aria-label="Começar agora" style={{position:"absolute",top:"91%",right:"3%",width:"20%",height:"5%",zIndex:5}} />
      </div>
    </main>
  );
}
