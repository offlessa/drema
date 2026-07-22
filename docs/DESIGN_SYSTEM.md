# Drema — Design System (v0, implementado)

> Paleta e tipografia abaixo refletem o que está em `web/src/index.css` (tokens Tailwind v4 via `@theme`). Pivotado de um placeholder terracota para uma paleta premium creme/verde-amarronzado/dourado, pedida explicitamente para posicionar a marca como "realizar sonhos", inspirada em Houzz/Apple/Pinterest.

## 1. Princípios

- **Confiança antes de estética.** Decisões caras (construir, reformar, contratar) exigem que o usuário sempre saiba onde está e em quem confiar.
- **A tela de resultado do match é o momento decisivo** — merece o maior cuidado visual do MVP: é onde o cliente decide em quem confiar.
- **Mobile-first**, mas com respiro visual — a referência é editorial (Houzz), não utilitária.

## 2. Cor (implementado em `index.css`)

| Token | Valor | Uso |
|---|---|---|
| `--color-cream` | `#f7f2e8` | fundo base |
| `--color-cream-dark` | `#efe7d6` | fundo de cards secundários, badges neutros |
| `--color-ink` | `#2b2a24` | texto principal |
| `--color-muted` | `#6c6559` | texto secundário |
| `--color-border` | `#e3dac6` | bordas |
| `--color-primary` | `#4f5f3f` (verde-amarronzado) | ações principais, links, foco |
| `--color-primary-hover` | `#3d4a31` | |
| `--color-gold` | `#b6905a` (dourado discreto) | destaques pontuais — eyebrow text, badges de especialidade, nunca em área grande |
| `--color-success` / `--color-warning` / `--color-danger` | verde/âmbar/terracota mutados | status (compatibilidade, pendências) — tons dessaturados para não destoar da paleta quente |

Evitado de propósito: azul (cor "padrão" de SaaS/marketplace — Loft, QuintoAndar) e branco puro como fundo dominante (fica frio; creme mantém o "premium quente" pedido).

## 3. Tipografia

- **Serif de destaque:** Fraunces — títulos (`font-serif`), dá o tom editorial/arquitetônico.
- **Sans para UI:** Inter — corpo de texto, formulários, botões.
- Carregadas via Google Fonts em `index.html`. Escala Tailwind padrão, sem customização.

## 4. Espaçamento

Escala padrão Tailwind (4px). Sem escala customizada.

## 5. Componentes base (implementados em `web/src/components/`)

| Componente | Onde é usado |
|---|---|
| `Button` (primary/secondary/ghost, loading) | toda ação |
| `Input`, `Select` | formulários (cadastro, questionário, onboarding profissional) |
| `MatchCard` | resultado do match — card com score de compatibilidade, o componente mais importante do produto |
| Cards de perfil, lead e conversa | compostos ad-hoc nas páginas por ora (`Dashboard`, `ProfessionalProfilePage`) — extrair para componentes reutilizáveis se o padrão se repetir mais |

Ainda não extraídos como componentes genéricos (deliberado — esperar repetição real antes de abstrair): `StatusBadge`, `EmptyState`, `Toast`. Hoje cada tela resolve isso inline.

## 6. Tom de voz

Direto, sem jargão técnico nem jargão de startup. Termos técnicos (ex: "ART") sempre explicados em uma frase quando aparecerem.

## 7. Próximo passo real (Figma)

Ainda não bloqueante — o MVP nasceu direto em código com esses tokens. Vale considerar Figma quando a galeria de inspiração (fase 1 do roadmap) entrar em cena, por ser uma peça mais visual/editorial.
