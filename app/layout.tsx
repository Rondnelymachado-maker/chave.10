import "./globals.css";

export const metadata = {
  title: "Chave 10 | Gestão de Oficina",
  description: "MVP de gestão para oficinas mecânicas"
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return <html lang="pt-BR"><body>{children}</body></html>;
}
