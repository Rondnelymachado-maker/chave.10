import type { Metadata } from "next";
import "./globals.css";
import AuthGate from "./auth-gate";

const siteUrl = "https://chave10tec.com.br";

const structuredData = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebSite",
      "@id": siteUrl + "/#website",
      url: siteUrl + "/",
      name: "Chave 10",
      alternateName: "Chave10 Tec",
      inLanguage: "pt-BR",
      description:
        "Sistema online de gestão para oficinas mecânicas, com clientes, veículos, orçamentos, ordens de serviço, estoque e financeiro.",
    },
    {
      "@type": "SoftwareApplication",
      "@id": siteUrl + "/#software",
      name: "Chave 10",
      alternateName: "Chave10 Tec",
      url: siteUrl + "/",
      applicationCategory: "BusinessApplication",
      operatingSystem: "Web",
      inLanguage: "pt-BR",
      description:
        "Sistema de gestão online para oficinas mecânicas, com controle de clientes, veículos, orçamentos, ordens de serviço, estoque e financeiro.",
    },
  ],
};

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Chave 10 | Sistema de Gestão para Oficinas Mecânicas",
    template: "%s | Chave 10",
  },
  description:
    "Organize sua oficina mecânica com o Chave 10: controle de clientes, veículos, orçamentos, ordens de serviço, estoque e financeiro em um só sistema online.",
  alternates: {
    canonical: "/",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "pt_BR",
    url: siteUrl,
    siteName: "Chave 10",
    title: "Chave 10 | Sistema de Gestão para Oficinas Mecânicas",
    description:
      "Controle clientes, veículos, orçamentos, ordens de serviço, estoque e financeiro em um só lugar com o Chave 10.",
  },
  twitter: {
    card: "summary",
    title: "Chave 10 | Sistema de Gestão para Oficinas Mecânicas",
    description:
      "Gestão online para oficinas mecânicas: clientes, veículos, orçamentos, ordens de serviço, estoque e financeiro.",
  },
  verification: {
    google: "cLkHas05Alnpp3ufRFWe_vtnJaq5tPgvAKYuih6r61I",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <body>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
        <AuthGate>{children}</AuthGate>
      </body>
    </html>
  );
}
