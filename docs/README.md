# Drema — Documentação

"Do sonho ao imóvel." Plataforma que conecta clientes a profissionais da construção civil através de uma jornada guiada: o cliente descreve o projeto, recebe profissionais com score de compatibilidade explicável, escolhe um e conversa.

Escopo destes documentos: **MVP**, validado em uma cidade/região piloto, por um founder solo (com apoio de IA). A visão de longo prazo (jornada automática, histórico do imóvel, IA de matching real, galeria de inspiração) está registrada como direção no roadmap, não especificada em detalhe — evita retrabalho quando o mercado responder.

## Índice

1. [Manifesto](MANIFESTO.md) — por que a Drema existe e princípios de produto
2. [Visão](VISAO.md) — pitch de posicionamento e direção de longo prazo
3. [Arquitetura](ARQUITETURA.md) — stack, topologia, decisões técnicas e porquês
4. [Banco de Dados](BANCO_DE_DADOS.md) — schema MySQL do MVP
5. [Fluxos](FLUXOS.md) — jornadas de cliente e profissional passo a passo
6. [Telas](TELAS.md) — inventário de telas do MVP
7. [Design System](DESIGN_SYSTEM.md) — tokens e componentes base
8. [Roadmap](ROADMAP.md) — fases pós-MVP e critério para avançar entre elas

## Estado atual

O loop essencial está implementado e validado ponta a ponta: cadastro (cliente/profissional), onboarding profissional, questionário guiado, cálculo de compatibilidade, match, chat. Rode `api/` e `web/` conforme o [README raiz](../README.md).

Pendências conhecidas, de propósito fora do escopo desta rodada: painel admin para aprovação de profissionais (hoje manual via banco), chat em tempo real (hoje é polling), galeria de inspiração.
