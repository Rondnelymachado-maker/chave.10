"use client";

import { useMemo, useState } from "react";

type Tab = "dashboard" | "clientes" | "veiculos" | "orcamentos" | "os" | "historico";

const initialClients = [
  { id: 1, name: "João da Silva", phone: "(85) 99999-1111", vehicle: "Honda Civic 2020" },
  { id: 2, name: "Maria Oliveira", phone: "(85) 98888-2222", vehicle: "Toyota Corolla 2022" }
];

const initialOS = [
  { id: "OS-001", client: "João da Silva", vehicle: "Honda Civic", service: "Revisão completa", status: "Em andamento", total: 850 },
  { id: "OS-002", client: "Maria Oliveira", vehicle: "Toyota Corolla", service: "Troca de óleo", status: "Concluída", total: 320 }
];

export default function Home() {
  const [tab, setTab] = useState<Tab>("dashboard");
  const [clients, setClients] = useState(initialClients);
  const [orders, setOrders] = useState(initialOS);
  const [showClient, setShowClient] = useState(false);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");

  const totalOS = useMemo(() => orders.reduce((s, o) => s + o.total, 0), [orders]);
  const activeOS = orders.filter(o => o.status !== "Concluída").length;

  function addClient() {
    if (!name.trim()) return;
    setClients([...clients, { id: Date.now(), name, phone, vehicle: "Não informado" }]);
    setName(""); setPhone(""); setShowClient(false); setTab("clientes");
  }

  function addOS() {
    const id = `OS-${String(orders.length + 1).padStart(3, "0")}`;
    setOrders([...orders, { id, client: "Novo cliente", vehicle: "Veículo", service: "Novo serviço", status: "Aberta", total: 0 }]);
    setTab("os");
  }

  const nav: [Tab, string, string][] = [
    ["dashboard", "▦", "Dashboard"],
    ["clientes", "♙", "Clientes"],
    ["veiculos", "▱", "Veículos"],
    ["orcamentos", "▤", "Orçamentos"],
    ["os", "⚙", "Ordens de serviço"],
    ["historico", "↺", "Histórico"]
  ];

  return (
    <main className="shell">
      <aside className="sidebar">
        <div className="brand"><span className="key">10</span><div><b>CHAVE 10</b><small>Gestão de Oficina</small></div></div>
        <nav>{nav.map(([key, icon, label]) =>
          <button key={key} className={tab === key ? "nav active" : "nav"} onClick={() => setTab(key)}><span>{icon}</span>{label}</button>
        )}</nav>
        <div className="sideBottom"><div className="statusDot"></div><span>Oficina Demo</span></div>
      </aside>

      <section className="content">
        <header className="topbar">
          <div><span className="eyebrow">SISTEMA DE GESTÃO</span><h1>{nav.find(n => n[0] === tab)?.[2]}</h1></div>
          <button className="primary" onClick={() => tab === "clientes" ? setShowClient(true) : addOS()}>{tab === "clientes" ? "+ Novo cliente" : "+ Nova OS"}</button>
        </header>

        {tab === "dashboard" && <Dashboard total={totalOS} active={activeOS} clients={clients.length} onNewOS={addOS} />}
        {tab === "clientes" && <Clients clients={clients} />}
        {tab === "veiculos" && <Vehicles clients={clients} />}
        {tab === "orcamentos" && <Quotes />}
        {tab === "os" && <Orders orders={orders} />}
        {tab === "historico" && <History orders={orders} />}

        {showClient && <div className="modalBackdrop"><div className="modal"><h2>Novo cliente</h2><input placeholder="Nome completo" value={name} onChange={e => setName(e.target.value)} /><input placeholder="Telefone" value={phone} onChange={e => setPhone(e.target.value)} /><div className="actions"><button onClick={() => setShowClient(false)}>Cancelar</button><button className="primary" onClick={addClient}>Salvar cliente</button></div></div></div>}
      </section>
    </main>
  );
}

function Dashboard({ total, active, clients, onNewOS }: { total: number; active: number; clients: number; onNewOS: () => void }) {
  return <div className="page">
    <div className="welcome"><div><h2>Olá, gestor 👋</h2><p>Acompanhe sua oficina em um só lugar.</p></div><button className="secondary" onClick={onNewOS}>Abrir nova OS</button></div>
    <div className="cards">
      <Card title="Faturamento em OS" value={`R$ ${total.toLocaleString("pt-BR")}`} note="MVP demonstrativo" />
      <Card title="OS em andamento" value={String(active)} note="Precisam de atenção" />
      <Card title="Clientes cadastrados" value={String(clients)} note="Base da oficina" />
      <Card title="Orçamentos" value="4" note="2 aguardando aprovação" />
    </div>
    <div className="grid2"><section className="panel"><h3>Fluxo da oficina</h3><div className="flow"><span>Orçamento</span><b>→</b><span>OS</span><b>→</b><span>Execução</span><b>→</b><span>Entrega</span></div></section><section className="panel"><h3>Próximas ações</h3><ul className="clean"><li>✓ Revisar OS-001</li><li>○ Aprovar orçamento pendente</li><li>○ Cadastrar veículo de cliente</li></ul></section></div>
  </div>;
}

function Card({ title, value, note }: { title: string; value: string; note: string }) {
  return <div className="card"><span>{title}</span><strong>{value}</strong><small>{note}</small></div>;
}

function Clients({ clients }: { clients: typeof initialClients }) {
  return <div className="page"><div className="panel"><div className="panelHead"><h3>Clientes</h3><span>{clients.length} cadastrados</span></div><table><thead><tr><th>Cliente</th><th>Telefone</th><th>Veículo</th><th></th></tr></thead><tbody>{clients.map(c => <tr key={c.id}><td><b>{c.name}</b></td><td>{c.phone || "—"}</td><td>{c.vehicle}</td><td><button className="link">Ver cadastro</button></td></tr>)}</tbody></table></div></div>;
}

function Vehicles({ clients }: { clients: typeof initialClients }) {
  return <div className="page"><div className="panel"><div className="panelHead"><h3>Veículos</h3><button className="secondary">+ Cadastrar veículo</button></div><table><thead><tr><th>Veículo</th><th>Proprietário</th><th>Ano</th><th>Última OS</th></tr></thead><tbody>{clients.map((c, i) => <tr key={c.id}><td><b>{c.vehicle}</b></td><td>{c.name}</td><td>{2020 + i}</td><td>OS-00{i + 1}</td></tr>)}</tbody></table></div></div>;
}

function Quotes() {
  return <div className="page"><div className="cards"><Card title="Aguardando aprovação" value="2" note="Envie pelo WhatsApp" /><Card title="Aprovados" value="5" note="Prontos para OS" /><Card title="Conversão" value="71%" note="Últimos 30 dias" /></div><div className="panel"><div className="panelHead"><h3>Orçamentos recentes</h3><button className="primary">+ Novo orçamento</button></div><table><thead><tr><th>Número</th><th>Cliente</th><th>Serviço</th><th>Valor</th><th>Status</th></tr></thead><tbody><tr><td>ORC-004</td><td>João da Silva</td><td>Revisão</td><td>R$ 850</td><td><span className="badge yellow">Aguardando</span></td></tr><tr><td>ORC-003</td><td>Maria Oliveira</td><td>Freios</td><td>R$ 1.240</td><td><span className="badge green">Aprovado</span></td></tr></tbody></table></div></div>;
}

function Orders({ orders }: { orders: typeof initialOS }) {
  return <div className="page"><div className="panel"><div className="panelHead"><h3>Ordens de serviço</h3><span>{orders.length} OS</span></div><table><thead><tr><th>OS</th><th>Cliente</th><th>Veículo</th><th>Serviço</th><th>Valor</th><th>Status</th></tr></thead><tbody>{orders.map(o => <tr key={o.id}><td><b>{o.id}</b></td><td>{o.client}</td><td>{o.vehicle}</td><td>{o.service}</td><td>R$ {o.total.toLocaleString("pt-BR")}</td><td><span className={o.status === "Concluída" ? "badge green" : "badge blue"}>{o.status}</span></td></tr>)}</tbody></table></div></div>;
}

function History({ orders }: { orders: typeof initialOS }) {
  return <div className="page"><div className="panel"><h3>Histórico de serviços</h3><p className="muted">Linha do tempo das últimas intervenções dos veículos.</p><div className="timeline">{orders.map(o => <div className="event" key={o.id}><div className="dot"></div><div><b>{o.vehicle} — {o.service}</b><p>{o.client} · {o.id} · {o.status}</p></div></div>)}</div></div></div>;
}
