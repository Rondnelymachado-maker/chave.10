import "./globals.css";
import AuthGate from "./auth-gate";
export const metadata={title:"Chave 10 | Gestão de Oficina",description:"MVP de gestão para oficinas mecânicas",verification:{google:"cLkHas05Alnpp3ufRFWe_vtnJaq5tPgvAKYuih6r61I"}};
export default function RootLayout({children}:{children:React.ReactNode}){return <html lang="pt-BR"><body><AuthGate>{children}</AuthGate></body></html>}
