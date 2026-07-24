# Drema — Roadmap

> Pivot registrado: o MVP evoluiu de "necessidade → matching em massa → proposta" para "questionário guiado → resultado com score de compatibilidade → cliente escolhe e conversa" (ver [FLUXOS.md](FLUXOS.md)). As fases abaixo foram ajustadas para refletir isso; o princípio de avançar só com métrica validada continua o mesmo.

## Fase 0 — MVP (foco atual)
Objetivo: provar que o questionário guiado + match com score gera contato de qualidade entre cliente e profissional, em **uma cidade/região piloto**.

Escopo: ver [ARQUITETURA.md](ARQUITETURA.md), [BANCO_DE_DADOS.md](BANCO_DE_DADOS.md), [TELAS.md](TELAS.md), [FLUXOS.md](FLUXOS.md).

Métrica de sucesso (definir antes de codar, não depois):
- % de questionários que geram ao menos 1 match acima do score mínimo
- % de matches em que o cliente demonstra interesse (abre conversa)
- tempo médio entre questionário respondido e primeira mensagem trocada
- profissionais aprovados ativos (com ao menos 1 lead) na cidade piloto

Sem essas métricas instrumentadas desde o dia 1, vocês não vão saber se o MVP "funcionou" — só terão opinião.

Instrumentado como comando Artisan (não como pipeline de eventos — todo dado necessário já existe em `project_briefs`/`matches`/`conversations`/`messages`, não precisa de infra nova):

```
php artisan metrics:fase0 [--city="Nome da Cidade"]
```

Ver `api/app/Console/Commands/Fase0Metrics.php`.

## Fase 1 — Consolidar o loop (pós-validação inicial)
Só entra aqui depois que a Fase 0 mostrar sinal real de tração na cidade piloto.

- Avaliações/reviews (agora existe dado real de conversas/matches fechados)
- Score de compatibilidade evolui de regra transparente para modelo calibrado com dado real de matches aceitos/rejeitados (ver nota em [BANCO_DE_DADOS.md](BANCO_DE_DADOS.md))
- Chat em tempo real via WebSocket (Pusher/Reverb, hoje é polling)
- Painel admin (Filament) para aprovação de profissionais, hoje manual via banco
- Galeria de inspiração (estilo Houzz/ArchDaily) — melhor momento é quando já existem profissionais com portfólio real para popular, evitando o "dia 1 vazio"
- Notificações push/WhatsApp
- Expansão para 2-3 cidades adicionais

## Fase 2 — Diferenciação (jornada + histórico do imóvel)
Aqui entra a visão de infraestrutura da construção civil do briefing original, com dado real embasando as decisões:

- Motor de "jornada" — sequência de etapas sugeridas por objetivo, construído a partir dos padrões observados nos `project_briefs` reais das fases 0/1
- Ficha do imóvel — histórico de projetos, materiais, garantias vinculado a um endereço
- Pagamentos/checkout dentro da plataforma (viabiliza comissão como receita)

## Fase 3 — Expansão de receita e rede
- Assinatura profissional (destaque, mais oportunidades)
- Marketplace de fornecedores de materiais
- Inteligência de mercado (dados agregados de preço/prazo por região — receita B2B para fornecedores/incorporadoras)
- IA para triagem de necessidade → especialidade automaticamente (reduz fricção no formulário de "nova necessidade")

## Princípio geral entre fases
Cada fase só começa quando a anterior tem métrica validada — não calendário. Startup que constrói fase 2 antes de confirmar que a fase 1 funciona está apostando dinheiro/tempo em vez de aprender com o mercado.
