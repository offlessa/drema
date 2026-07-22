# Drema — Telas (MVP)

> Substitui a versão anterior (formulário simples de necessidade). O fluxo agora é uma jornada guiada de descoberta + match, conforme pivotado. Web responsivo, React + Vite + Tailwind, paleta creme/verde-amarronzado/dourado (ver [DESIGN_SYSTEM.md](DESIGN_SYSTEM.md)).

## Públicas

1. **Landing** (`/`) — proposta de valor + CTA "Encontrar meu profissional"
2. **Cadastro** (`/cadastro`) — com seletor cliente/profissional
3. **Login** (`/login`)

## Jornada guiada do cliente (autenticado)

4. **Objetivo** (`/comecar`) — "Qual é o seu objetivo?" (construir, reformar, interiores, comercial, área externa)
5. **Questionário** (`/questionario`) — localização, área, ambientes, estilo, orçamento, prazo, referências visuais, necessidades específicas → submete e cria o `project_brief`
6. **Resultado do match** (`/resultados/:briefId`) — cards com foto/inicial, nome, empresa, especialidade, localização, estilos, **% de compatibilidade**
7. **Perfil do profissional** (`/profissionais/:id`) — bio, experiência, faixa de investimento, estilos, portfólio (link), botão "Tenho interesse" quando veio de um match
8. **Confirmação de match** (estado dentro da própria tela de perfil) — "É uma combinação!" → abre a conversa automaticamente

## Área comum (pós-login)

9. **Dashboard** (`/dashboard`) — cliente: atalhos para novo projeto e conversas · profissional: lista de leads ou prompt de onboarding
10. **Conversas** (`/conversas`) — lista de conversas ativas
11. **Chat** (`/conversas/:id`) — mensagens (polling, sem WebSocket ainda)

## Área do profissional

12. **Onboarding/edição de perfil** (`/perfil-profissional`) — tipo (arquiteto/engenheiro/designer/construtora), empresa, bio, localização, raio de atuação, faixa de investimento, portfólio, estilos trabalhados
13. **Dashboard de leads** — dentro de `/dashboard`: cada lead mostra objetivo, área, cidade, orçamento e % de compatibilidade; link direto para a conversa quando o cliente já demonstrou interesse

## Admin (interno, ainda não construído)

14. **Fila de aprovação de profissionais** — hoje é feita manualmente via banco (`UPDATE professional_profiles SET status='approved'`). Construir com Filament é o próximo passo natural quando o volume justificar.

## Fora do MVP (não desenhar ainda)

- Galeria de inspiração estilo Houzz/ArchDaily (fotos de projetos, salvar referências) — cold-start de conteúdo, ver [ROADMAP.md](ROADMAP.md)
- Avaliações e reviews visíveis no perfil
- Pagamentos/checkout
- Ficha/histórico do imóvel
