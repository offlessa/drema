# Drema — Design System (v0, implementado)

> Paleta e tipografia abaixo refletem o que está em `web/src/index.css` (tokens Tailwind v4 via `@theme`). Pivotado pela segunda vez: a v0 original (creme/verde-amarronzado/dourado) foi substituída por navy + teal para seguir a identidade visual da logo real (`web/public/logo-full.png`) — cores tiradas por amostragem de pixel do arquivo, não estimadas a olho.

## 1. Princípios

- **Confiança antes de estética.** Decisões caras (construir, reformar, contratar) exigem que o usuário sempre saiba onde está e em quem confiar.
- **A tela de resultado do match é o momento decisivo** — merece o maior cuidado visual do MVP: é onde o cliente decide em quem confiar.
- **Mobile-first**, mas com respiro visual — a referência é editorial (Houzz), não utilitária.

## 2. Cor (implementado em `index.css`)

| Token | Valor | Uso |
|---|---|---|
| `--color-surface` | `#ffffff` | fundo base |
| `--color-surface-alt` | `#eef2f6` | fundo de cards secundários, badges neutros, avatar placeholder |
| `--color-ink` | `#14213d` | texto principal |
| `--color-muted` | `#5b6b82` | texto secundário |
| `--color-border` | `#dce3ea` | bordas |
| `--color-primary` | `#0b2c52` (navy da logo) | ações principais, links, foco |
| `--color-primary-hover` | `#082140` | |
| `--color-teal` | `#2fb39b` (teal da logo) | destaques pontuais — eyebrow text, badges de especialidade, nunca em área grande |
| `--color-success` / `--color-warning` / `--color-danger` | verde/âmbar/terracota mutados | status (compatibilidade, pendências) |

Antes evitávamos azul de propósito (para não parecer "mais um marketplace" tipo Loft/QuintoAndar). Isso mudou: a logo real da marca é navy + teal, e a logo manda — consistência de marca vale mais que a preferência estética anterior. Branco como fundo dominante também foi decisão consciente desta vez (bate com o fundo da logo).

## 3. Tipografia

- **Display (títulos):** Poppins — via token `--font-display`, classe `font-display` (nome mantido nas telas por não valer o custo de renomear todo uso; o valor é que mudou de Fraunces/serif para Poppins/geométrico, para casar com a wordmark da logo).
- **Sans para UI:** Inter — corpo de texto, formulários, botões.
- Carregadas via Google Fonts em `index.html`. Escala Tailwind padrão, sem customização.

## 4. Logo

Assets derivados de `web/public/logo-full.png` (arquivo original, com tagline — usar só se precisar do lockup completo):
- `logo-icon.png` — só o símbolo (D + casa + caminho), para favicon e contextos compactos.
- `logo-horizontal.png` — símbolo + wordmark "Drema", sem tagline, para headers de tela.

## 5. Espaçamento

Escala padrão Tailwind (4px). Sem escala customizada.

## 6. Componentes base (implementados em `web/src/components/`)

| Componente | Onde é usado |
|---|---|
| `Button` (primary/secondary/ghost, loading) | toda ação |
| `Input`, `Select` | formulários (cadastro, questionário, onboarding profissional) |
| `MatchCard` | resultado do match — card com score de compatibilidade, o componente mais importante do produto |
| Cards de perfil, lead e conversa | compostos ad-hoc nas páginas por ora (`Dashboard`, `ProfessionalProfilePage`) — extrair para componentes reutilizáveis se o padrão se repetir mais |

Ainda não extraídos como componentes genéricos (deliberado — esperar repetição real antes de abstrair): `StatusBadge`, `EmptyState`, `Toast`. Hoje cada tela resolve isso inline.

## 7. Tom de voz

Direto, sem jargão técnico nem jargão de startup. Termos técnicos (ex: "ART") sempre explicados em uma frase quando aparecerem.

## 8. Próximo passo real (Figma)

Ainda não bloqueante — o MVP nasceu direto em código com esses tokens. Vale considerar Figma quando a galeria de inspiração (fase 1 do roadmap) entrar em cena, por ser uma peça mais visual/editorial.
