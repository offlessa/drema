# Drema — Documentação

"Do sonho ao imóvel." Plataforma que conecta clientes a profissionais da construção civil, começando pelo loop essencial: necessidade → matching → proposta → chat.

Escopo destes documentos: **MVP**, validado em uma cidade/região piloto, por um founder solo (com apoio de IA). A visão de longo prazo (jornada automática, histórico do imóvel, IA de matching) está registrada como direção no roadmap, não especificada em detalhe — evita retrabalho quando o mercado responder.

## Índice

1. [Arquitetura](ARQUITETURA.md) — stack, topologia, decisões técnicas e porquês
2. [Banco de Dados](BANCO_DE_DADOS.md) — schema MySQL do MVP
3. [Fluxos](FLUXOS.md) — jornadas de cliente e profissional passo a passo
4. [Telas](TELAS.md) — inventário de telas do MVP
5. [Design System](DESIGN_SYSTEM.md) — tokens e componentes base
6. [Roadmap](ROADMAP.md) — fases pós-MVP e critério para avançar entre elas

## Próximo passo

Com a documentação do MVP fechada, o próximo passo é começar o desenvolvimento: scaffolding do backend Laravel (`api/`) e frontend React (`web/`), começando pelas tabelas e endpoints de autenticação + necessidades. Avise quando quiser seguir para essa etapa.
