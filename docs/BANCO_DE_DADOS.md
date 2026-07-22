# Drema — Banco de Dados (MVP)

MySQL 8. Convenção: tabelas no plural, snake_case, `id` bigint auto-increment, timestamps padrão Laravel (`created_at`, `updated_at`), soft deletes onde fizer sentido (dados que não podem sumir de vez: propostas, necessidades).

## Diagrama lógico (MVP)

```
users ──┬──< professional_profiles >──< professional_specialties >── specialties
        │
        └──< needs >──< opportunities >──< proposals
                            │                  │
                            │                  └── (proposal aceita vincula → conversations)
                            │
                        professional_profiles (FK)

conversations ──< messages
```

## Tabelas

### `users`
Conta única para cliente e profissional (uma pessoa pode ser as duas coisas no futuro).

| Campo | Tipo | Notas |
|---|---|---|
| id | bigint PK | |
| name | string | |
| email | string unique | |
| password | string | hash |
| phone | string nullable | |
| role | enum('client','professional','admin') | role **primária** da conta — ver nota abaixo |
| city | string | cidade para o piloto regional |
| state | string(2) | UF |
| email_verified_at | timestamp nullable | |
| created_at / updated_at | timestamp | |

> **Nota de design:** no MVP, `role` é suficiente (uma conta = um papel primário). Modelar "usuário pode ser cliente E profissional simultaneamente" adiciona complexidade de UI (trocar de contexto) que não se paga ainda. Se um profissional quiser postar uma necessidade como cliente, ele cria/usa uma conta separada por enquanto — decisão consciente de simplicidade, revisitar se virar reclamação recorrente.

### `professional_profiles`
1:1 com `users` (role = professional).

| Campo | Tipo | Notas |
|---|---|---|
| id | bigint PK | |
| user_id | bigint FK → users | unique |
| bio | text nullable | |
| document (CPF/CNPJ) | string | validação básica |
| document_type | enum('cpf','cnpj') | |
| service_radius_km | integer | raio de atuação a partir de `city` |
| portfolio_url | string nullable | link externo no MVP (não upload de galeria ainda) |
| status | enum('pending','approved','rejected') | curadoria manual no MVP — não automatizar aprovação ainda |
| created_at / updated_at | timestamp | |

### `specialties`
Catálogo fixo, curado por vocês (não user-generated no MVP).

| Campo | Tipo | Notas |
|---|---|---|
| id | bigint PK | |
| name | string | ex: "Projeto Estrutural", "Projeto Arquitetônico", "Topografia" |
| category | enum('engenharia','arquitetura','construcao','fornecimento','outros') | agrupamento para UI |
| slug | string unique | |

### `professional_specialties`
Pivot N:N.

| Campo | Tipo |
|---|---|
| professional_profile_id | FK |
| specialty_id | FK |

### `needs`
A "necessidade" criada pelo cliente. **No MVP não é um workflow de etapas** — é um pedido único e simples.

| Campo | Tipo | Notas |
|---|---|---|
| id | bigint PK | |
| client_id | bigint FK → users | |
| specialty_id | bigint FK → specialties | categoria escolhida |
| title | string | ex: "Preciso de projeto elétrico para casa de 120m²" |
| description | text | |
| city | string | herda do cliente, editável |
| budget_min / budget_max | decimal nullable | opcional, cliente pode não saber |
| status | enum('open','matching','proposals_received','closed') | |
| created_at / updated_at | timestamp | |

### `opportunities`
Um "match" entre uma necessidade e um profissional selecionado pelo sistema. Existe para rastrear quem foi convidado, mesmo que não responda.

| Campo | Tipo | Notas |
|---|---|---|
| id | bigint PK | |
| need_id | bigint FK → needs | |
| professional_profile_id | bigint FK | |
| status | enum('sent','viewed','proposal_sent','declined','expired') | |
| sent_at | timestamp | |
| expires_at | timestamp | janela para responder (ex: 48h) — evita necessidade "presa" esperando profissional inativo |

### `proposals`
| Campo | Tipo | Notas |
|---|---|---|
| id | bigint PK | |
| opportunity_id | bigint FK → opportunities | unique (1 proposta por oportunidade) |
| price | decimal | |
| estimated_days | integer | prazo estimado |
| message | text | |
| status | enum('pending','accepted','rejected') | |
| created_at / updated_at | timestamp | |

### `conversations`
Criada automaticamente quando uma proposta é aceita.

| Campo | Tipo |
|---|---|
| id | bigint PK |
| need_id | bigint FK → needs |
| proposal_id | bigint FK → proposals |
| client_id | bigint FK → users |
| professional_id | bigint FK → users |

### `messages`
| Campo | Tipo | Notas |
|---|---|---|
| id | bigint PK | |
| conversation_id | bigint FK | |
| sender_id | bigint FK → users | |
| body | text | |
| read_at | timestamp nullable | |
| created_at | timestamp | |

## Índices críticos desde o dia 1

- `needs(status, city, specialty_id)` — a query mais frequente do sistema é "quais necessidades abertas nesta cidade/especialidade" (matching).
- `opportunities(professional_profile_id, status)` — profissional listando suas oportunidades.
- `messages(conversation_id, created_at)` — paginação de chat.

## O que fica de fora do MVP (de propósito)

- Tabela de `reviews`/avaliações — sem histórico de propostas aceitas, não há dado confiável.
- Tabela de `payments`/transações — matching primeiro, dinheiro depois.
- Modelagem de "jornada" (steps, dependências entre etapas) — fica para quando o padrão de uso real mostrar quais sequências as pessoas realmente seguem. Modelar isso agora é apostar no que *achamos* que é a jornada, sem dado.
- Histórico do imóvel (property, property_history) — é o grande diferencial de longo prazo do produto, mas depende de ter obras concluídas na plataforma primeiro. Entra no roadmap fase 2.
