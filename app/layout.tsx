import "./globals.css";
import AuthGate from "./auth-gate";

export const metadata = {
  title: "Chave 10 | Gestão de Oficina",
  description: "MVP de gestão para oficinas mecânicas"
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return <html lang="pt-BR"><body><AuthGate>{children}</AuthGate><div style={{position:"fixed",right:18,bottom:18,zIndex:9998,display:"flex",gap:8}}><a href="/financeiro" style={{background:"#172033",color:"white",textDecoration:"none",padding:"11px 14px",borderRadius:8,fontFamily:"Arial,sans-serif",fontWeight:700,boxShadow:"0 4px 14px rgba(0,0,0,.18)"}}>R$ Financeiro</a><a href="/admin" style={{background:"#f59b32",color:"white",textDecoration:"none",padding:"11px 14px",borderRadius:8,fontFamily:"Arial,sans-serif",fontWeight:700,boxShadow:"0 4px 14px rgba(0,0,0,.18)"}}>⚙ Admin</a></div></body></html>;
}
