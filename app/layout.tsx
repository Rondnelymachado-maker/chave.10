import "./globals.css";
import AuthGate from "./auth-gate";

export const metadata = {
  title: "Chave 10 | Gestão de Oficina",
  description: "MVP de gestão para oficinas mecânicas"
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return <html lang="pt-BR"><body><AuthGate>{children}</AuthGate><a href="/financeiro" style={{position:"fixed",left:20,top:620,zIndex:99999,background:"#f59b32",color:"white",textDecoration:"none",padding:"12px 10px",borderRadius:8,fontFamily:"Arial,sans-serif",fontWeight:700,boxShadow:"0 4px 14px rgba(0,0,0,.25)",width:200,boxSizing:"border-box"}}>▣ &nbsp; Financeiro</a><a href="/admin" style={{position:"fixed",right:18,bottom:18,zIndex:99999,background:"#f59b32",color:"white",textDecoration:"none",padding:"11px 14px",borderRadius:8,fontFamily:"Arial,sans-serif",fontWeight:700,boxShadow:"0 4px 14px rgba(0,0,0,.18)"}}>⚙ Admin</a></body></html>;
}
