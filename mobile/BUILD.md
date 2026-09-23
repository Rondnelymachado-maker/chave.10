# Chave 10 Mobile — Build e publicação

Aplicativo mobile do Chave 10, isolado na branch `mobile-app`.

## Pré-requisitos

- Node.js instalado
- Conta Expo/EAS
- Variáveis públicas do Supabase configuradas:
  - `EXPO_PUBLIC_SUPABASE_URL`
  - `EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY`

O projeto usa Expo SDK 57, React Native 0.86 e Expo Router.

## 1. Instalação

```bash
cd mobile
npm install
```

Crie `.env` a partir de `.env.example` e informe a chave **publishable** do Supabase. Não coloque `service_role` no aplicativo.

## 2. Login no EAS

```bash
npx eas-cli login
npx eas-cli whoami
```

## 3. Build Android de teste

O perfil `preview` está configurado para gerar APK instalável:

```bash
npx eas-cli build --platform android --profile preview
```

Ao terminar, o EAS fornece a página/link para instalar o APK no aparelho.

## 4. Teste funcional

Executar no aparelho:

1. Login
2. Clientes
3. Criar veículo
4. Criar orçamento
5. Selecionar peça do estoque
6. Alterar manualmente o valor das peças
7. Gerar/compartilhar PDF
8. Enviar para WhatsApp
9. Converter orçamento em OS
10. Concluir OS
11. Confirmar baixa de estoque
12. Conferir lançamento no Financeiro
13. Consultar Histórico

Qualquer falha encontrada deve ser registrada e corrigida antes do build de produção.

## 5. Build Android de produção

Para a Google Play, o build de produção gera AAB:

```bash
npx eas-cli build --platform android --profile production
```

O AAB é o artefato apropriado para publicação na Google Play.

## 6. Build iOS

```bash
npx eas-cli build --platform ios --profile production
```

Para distribuição pela App Store/TestFlight, são necessárias as credenciais da conta Apple Developer.

## 7. Publicação

Depois dos builds de produção:

```bash
npx eas-cli submit --platform android --latest
npx eas-cli submit --platform ios --latest
```

A publicação exige as contas de desenvolvedor das respectivas lojas.

## Identidade do app

- Nome: **Chave 10**
- Android package: `com.chave10tec.app`
- iOS bundle identifier: `com.chave10tec.app`
- Versão inicial: `1.0.0`

## Regra de segurança

Nunca adicionar ao aplicativo:
- chave Supabase `service_role`
- senhas administrativas
- tokens privados

Somente a chave pública/publishable do Supabase deve ser usada no cliente.

## Estado do código

A branch `mobile-app` permanece separada da `main`. O sistema web de produção não deve ser alterado como parte do build mobile.
