# Drema — Design System (v0, ponto de partida)

Isto não substitui o trabalho no Figma — é a base de tokens e princípios que orienta tanto o Figma quanto os componentes React, para que os dois não divirjam.

## 1. Princípios

- **Confiança antes de estética.** O produto lida com decisões caras (construir, reformar, contratar). Cada tela deve responder "onde estou, o que falta, em quem confio" — nunca deixar o usuário sem saber o próximo passo.
- **Comparação é o momento decisivo.** A tela de comparar propostas é o coração do produto — merece o maior cuidado visual de todo o MVP.
- **Mobile-first.** Profissionais autônomos usam celular como ferramenta de trabalho no canteiro de obras.

## 2. Cor (tokens, placeholder até definir marca no Figma)

| Token | Uso | Placeholder |
|---|---|---|
| `--color-primary` | ações principais, links, foco | a definir (sugestão: terracota/laranja queimado — remete a construção/terra sem ser genérico como azul de fintech) |
| `--color-primary-hover` | | tom -10% luminosidade |
| `--color-success` | proposta aceita, status positivo | verde |
| `--color-warning` | pendente, aguardando | amarelo/âmbar |
| `--color-danger` | recusado, expirado | vermelho |
| `--color-neutral-900` a `--color-neutral-50` | texto, bordas, fundos | escala de cinza |

**Recomendação:** evitar azul como cor primária — é a cor "padrão" de todo SaaS/marketplace (Loft, QuintoAndar, a maioria dos concorrentes usam tons de azul/verde). Uma cor terrosa (terracota, ocre) reforça o posicionamento "construção civil" e diferencia visualmente de cara.

## 3. Tipografia

- Fonte: uma sans-serif humanista (ex: Inter, ou Sora para títulos com mais personalidade) — legível em telas pequenas, comum em produtos B2B/B2C sérios.
- Escala: `text-xs` (12) `text-sm` (14) `text-base` (16) `text-lg` (18) `text-xl` (20) `text-2xl` (24) `text-3xl` (30) — escala padrão Tailwind, não reinventar.

## 4. Espaçamento

Escala de 4px (padrão Tailwind: 1=4px, 2=8px, 4=16px, 6=24px, 8=32px...). Não criar escala customizada — consistência com a lib de utilitários evita decisões ad-hoc a cada tela.

## 5. Componentes base (necessários para o MVP)

| Componente | Onde é usado |
|---|---|
| `Button` (primary/secondary/ghost, com estado loading/disabled) | em toda ação |
| `Input`, `Textarea`, `Select` | formulários (necessidade, proposta, cadastro) |
| `Card` | listagens (necessidades, oportunidades) |
| `StatusBadge` | status de necessidade/oportunidade/proposta — cor semântica consistente em todo o app |
| `ProposalCard` | comparação de propostas — componente mais importante do produto |
| `ProfessionalAvatarCard` | identificação resumida do profissional (nome, especialidade, cidade) |
| `ChatBubble` + `ChatInput` | tela de mensagens |
| `EmptyState` | listas vazias (nenhuma necessidade, nenhuma oportunidade ainda) |
| `Toast/Alert` | feedback de ações (proposta enviada, etc.) |

Construir esses ~9 componentes primeiro, genéricos e reutilizáveis (props claras, sem lógica de negócio dentro deles) — todas as 15 telas do MVP são composições desses blocos.

## 6. Tom de voz

Direto, sem jargão técnico de construção civil nem jargão de startup. O cliente típico não sabe o que é "ART" ou "sondagem" — a UI deve explicar em uma frase quando usar termos técnicos (tooltip/hint), nunca assumir conhecimento prévio.

## 7. Próximo passo real (Figma)

Este documento é suficiente para começar a codar UI com Tailwind usando os tokens acima. O Figma entra quando vocês quiserem validar fluxo visual com usuários reais antes de codar cada tela nova — não é bloqueante para o MVP inicial, que pode nascer direto em código com esses tokens.
