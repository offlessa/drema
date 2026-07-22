# Drema — Banco de Dados (MVP)

> Este documento reflete o schema **efetivamente implementado** em `api/database/migrations/`. Substitui a versão anterior (baseada em `needs`/`opportunities`/`proposals`), trocada pelo fluxo de match guiado com score de compatibilidade — ver [FLUXOS.md](FLUXOS.md).

MySQL 8. Convenção: tabelas no plural, snake_case, `id` bigint auto-increment, timestamps padrão Laravel.

## Diagrama lógico

```
users ──┬──< professional_profiles >──< professional_style >── styles
        │                                    │
        └──< project_briefs >──< matches >───┘
                    │                │
                    │                └──< conversations >──< messages
                 style (FK)
```

## Tabelas

### `users`
Conta única para cliente e profissional.

| Campo | Tipo | Notas |
|---|---|---|
| id | bigint PK | |
| name, email, password | string | |
| role | enum('client','professional','admin') | role primária da conta |
| phone | string nullable | |
| city, state | string | cidade/UF do usuário |
| created_at / updated_at | timestamp | |

### `professional_profiles`
1:1 com `users` (role = professional). Onboarding profissional.

| Campo | Tipo | Notas |
|---|---|---|
| id | bigint PK | |
| user_id | bigint FK → users, unique | |
| professional_type | enum('architect','engineer','interior_designer','construction_company') | |
| company_name | string nullable | |
| bio | text nullable | |
| city, state | string | base para o score de localização |
| service_radius_km | int | raio de atuação |
| years_experience | int nullable | |
| budget_min, budget_max | decimal nullable | faixa de investimento atendida — usada no score de orçamento |
| portfolio_url | string nullable | link externo no MVP, sem galeria própria ainda |
| status | enum('pending','approved','rejected') | curadoria manual |

### `styles`
Catálogo fixo (Contemporâneo, Moderno, Minimalista, Industrial, Rústico, Clássico, Escandinavo, Tropical), seedado via `StyleSeeder`.

### `professional_style`
Pivot N:N entre `professional_profiles` e `styles` (estilos que o profissional trabalha).

### `project_briefs`
O questionário guiado preenchido pelo cliente (substitui a antiga `needs`).

| Campo | Tipo | Notas |
|---|---|---|
| id | bigint PK | |
| client_id | bigint FK → users | |
| goal | enum('build_house','renovate','interior_design','commercial_project','landscaping') | objetivo escolhido na Tela 2 |
| city, state | string | |
| area_m2 | int nullable | |
| rooms_count | tinyint nullable | |
| style_id | bigint FK → styles, nullable | estilo desejado |
| budget_min, budget_max | decimal nullable | |
| timeline | string nullable | |
| description | text nullable | necessidades específicas |
| reference_urls | json nullable | links de referência visual |

### `matches`
Substitui `opportunities`+`proposals`. Criado automaticamente pelo `MatchingService` ao submeter um `project_brief` — já vem com o score calculado, não é um convite que o profissional aceita/recusa.

| Campo | Tipo | Notas |
|---|---|---|
| id | bigint PK | |
| project_brief_id | bigint FK | |
| professional_profile_id | bigint FK | |
| compatibility_score | tinyint unsigned (0–100) | calculado por `MatchingService`, regra transparente — ver nota abaixo |
| status | enum('pending','chatting','closed') | `chatting` quando o cliente demonstra interesse |

> **Por que não é IA/black-box:** o score é uma soma de pesos explicáveis (tipo de profissional relevante para o objetivo, cidade/estado, sobreposição de orçamento, estilo em comum — ver `app/Services/MatchingService.php`). Sem histórico de matches/avaliações reais na plataforma, um modelo de ML não teria o que aprender; um "% de IA" fabricado seria só teatro. Isso vira modelo treinado de verdade quando houver dado real de matches aceitos/rejeitados para calibrar contra.

### `conversations`
Criada quando o cliente demonstra interesse em um match (não depende de proposta formal aceita, diferente do desenho anterior).

| Campo | Tipo |
|---|---|
| id | bigint PK |
| match_id | bigint FK → matches, unique |
| client_id, professional_id | bigint FK → users |

### `messages`
| Campo | Tipo | Notas |
|---|---|---|
| id | bigint PK | |
| conversation_id | bigint FK | |
| sender_id | bigint FK → users | |
| body | text | |
| read_at | timestamp nullable | ainda não usado pela UI (sem indicador de lida) |

## O que fica de fora do MVP (de propósito)

- `reviews`/avaliações — sem match fechado suficiente, não há dado confiável ainda.
- `payments`/transações.
- Upload de fotos de portfólio / galeria de inspiração (estilo Houzz) — cold-start de conteúdo; entra depois de termos profissionais reais cadastrados. Ver [ROADMAP.md](ROADMAP.md).
- Histórico do imóvel (property, property_history).
