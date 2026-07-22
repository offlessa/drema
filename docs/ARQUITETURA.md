# Drema — Arquitetura (MVP)

> Escopo: apenas o loop essencial do MVP (cadastro → necessidade → oportunidade → proposta → chat).
> A visão completa (jornadas automáticas, histórico do imóvel, IA) está em [ROADMAP.md](ROADMAP.md) como direção, não como especificação.

## 1. Decisão de topologia

**Duas aplicações separadas, um monorepo lógico (repos ou pastas distintas), comunicando via API REST:**

```
drema/
├── api/            # Laravel — API REST + lógica de negócio
├── web/            # React (Vite) — SPA consumida pelo cliente e profissional
└── docs/           # este diretório
```

**Por quê separar front e back (e não Laravel + Blade/Inertia):**
Vocês vão ter dois públicos com jornadas bem diferentes (cliente vs. profissional) e cedo ou tarde um app mobile (React Native reaproveita a mesma API). Separar agora custa quase nada e evita reescrever tudo quando o mobile chegar. Se fosse só um painel administrativo interno, eu recomendaria Inertia por simplicidade — mas não é o caso aqui.

**Por que não microserviços:** com um founder solo, um monólito Laravel bem organizado (módulos por domínio dentro da mesma app) é a escolha certa. Microserviços resolvem problema de escala de time, não de tráfego — vocês não têm esse problema ainda. Reavaliar quando houver múltiplos times e domínios claramente independentes.

## 2. Stack (MVP)

| Camada | Tecnologia | Observação |
|---|---|---|
| Frontend | React + Vite + TypeScript | TypeScript não é negociável — schema de dados (necessidade, proposta, profissional) muda com frequência no início; tipos evitam bugs silenciosos |
| Estado remoto | TanStack Query | cache/refetch de API, evita reinventar loading/error state |
| Estilo | Tailwind CSS | velocidade de execução solo + consistência via design tokens |
| Backend | Laravel 11 (API only, `laravel new drema-api --api`) | |
| Auth | Laravel Sanctum (SPA token-based) | mais simples que OAuth completo para MVP; migrar para Passport só se precisar de OAuth de terceiros |
| Banco | MySQL 8 | conforme definido |
| Filas/Jobs | Laravel Queue (driver `database` no MVP, migrar para Redis quando houver volume) | envio de notificações, matching de profissionais |
| Chat | Laravel Reverb (WebSockets nativo) ou Pusher (gerenciado) | recomendo começar com **Pusher** (free tier) — zero infra para gerenciar solo; migrar para Reverb quando o custo justificar |
| Storage de arquivos | S3-compatible (Cloudflare R2 ou AWS S3) | anexos de proposta, fotos de perfil |
| Hospedagem API | Laravel Forge + VPS (DigitalOcean/Hetzner) ou Laravel Cloud | Forge = menos vendor lock-in, você aprende a infra |
| Hospedagem Web | Vercel ou Netlify | deploy trivial, CDN grátis |
| Notificações | E-mail (Resend/Postmark) no MVP; push fica para quando houver app mobile | |

## 3. Por que não Next.js (contrariando a tendência)

Vocês definiram React puro (SPA), e eu concordo para o MVP: o produto é majoritariamente **pós-login** (dashboard de necessidades, oportunidades, chat) — não depende de SEO. A única página que se beneficiaria de SSR é a landing pública. Solução pragmática: landing simples separada (ou até uma página estática) e SPA para o app logado. Revisitar Next.js quando SEO de páginas de profissionais/imóveis virar canal de aquisição real (fase 2+).

## 4. Módulos do backend (dentro do monólito Laravel)

Organização por domínio, não por tipo técnico — evita "MegaController" e "MegaModel":

```
app/
├── Domain/
│   ├── User/            # autenticação, perfil, roles (client|professional)
│   ├── Professional/     # perfil profissional, especialidades
│   ├── Need/              # necessidades criadas pelo cliente
│   ├── Matching/          # seleção de profissionais para uma necessidade
│   ├── Opportunity/       # oportunidade enviada a um profissional
│   ├── Proposal/          # propostas enviadas
│   └── Chat/              # conversas e mensagens
├── Http/
│   ├── Controllers/Api/  # controllers finos, delegam para Actions/Services
│   └── Resources/         # API Resources (serialização)
└── ...
```

Cada domínio: Model, Migration, Service/Action (regra de negócio), Policy (autorização), Resource (serialização). Controllers ficam finos — só orquestram request → action → response.

## 5. Autorização

Duas roles no MVP: `client` e `professional` (mesma tabela `users`, campo `role`). Um mesmo CPF pode, no futuro, ser cliente e profissional — não modelar como tabelas separadas (evita duplicação de conta/login). Usar Laravel Policies por recurso (ex: só o dono da necessidade vê as propostas recebidas).

## 6. O que **não** fazer agora (overengineering a evitar)

- Não criar sistema de pagamentos/split ainda — MVP valida o *matching*, não a transação financeira.
- Não construir motor de "jornada automática" (árvore de etapas) — isso é fase 2. No MVP, a "necessidade" é uma categoria simples escolhida pelo cliente (texto livre + categoria), não um workflow.
- Não implementar sistema de avaliações/reviews ainda — sem propostas aceitas suficientes, não há dado para isso ser útil.
- Não criar app mobile nativo agora — SPA responsiva resolve para validar.
