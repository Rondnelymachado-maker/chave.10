# Chave 10 — MVP Real

Sistema SaaS para oficinas com Next.js + Supabase.

## Como colocar para funcionar
1. Instale Node.js 20+.
2. Crie um projeto no Supabase.
3. Rode `supabase/schema.sql` no SQL Editor.
4. Copie `.env.example` para `.env.local` e preencha as variáveis.
5. Rode `npm install`.
6. Rode `npm run dev`.
7. Abra http://localhost:3000.

O projeto inclui autenticação, multi-oficina via RLS, clientes, veículos, orçamentos, OS e histórico.

Para produção: configurar domínio, e-mail de autenticação, backups, políticas RLS revisadas e geração de PDF.
