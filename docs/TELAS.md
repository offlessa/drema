# Drema — Telas (MVP)

Web responsivo (não app nativo). Layout pensado mobile-first — a maioria dos profissionais autônomos (eletricista, pedreiro, pequena empreiteira) usa celular como dispositivo primário.

## Públicas (sem login)

1. **Landing page** — proposta de valor, CTA "Sou cliente" / "Sou profissional". Pode ser página estática simples no MVP, sem investir em muito polimento ainda.
2. **Cadastro** (com seletor de papel: cliente/profissional)
3. **Login**

## Cliente

4. **Dashboard do cliente** — lista de necessidades criadas, com status (aberta, em matching, com propostas, fechada) + botão "Nova necessidade"
5. **Nova necessidade** — formulário: categoria, título, descrição, orçamento (opcional), cidade
6. **Detalhe da necessidade** — status atual, lista de propostas recebidas (cards comparáveis: preço, prazo, perfil resumido do profissional), ação de aceitar
7. **Perfil de profissional (visão do cliente)** — bio, especialidades, avaliações (placeholder no MVP — "em breve")
8. **Mensagens** — lista de conversas + thread de chat
9. **Meu perfil / configurações** — dados da conta, cidade

## Profissional

10. **Onboarding de profissional** — bio, documento (CPF/CNPJ), especialidades, raio de atuação, cidade. Tela de "aguardando aprovação" após submeter.
11. **Dashboard do profissional** — lista de oportunidades recebidas (novas, visualizadas, respondidas, expiradas)
12. **Detalhe da oportunidade** — descrição da necessidade do cliente + ação: enviar proposta ou recusar
13. **Enviar proposta** — formulário: preço, prazo estimado, mensagem
14. **Mensagens** — igual ao do cliente (componente compartilhado)
15. **Meu perfil / configurações** — editar perfil profissional

## Admin (interno, não é produto para usuário final)

16. **Fila de aprovação de profissionais** — aprovar/rejeitar cadastros pendentes (curadoria manual, ver [FLUXOS.md](FLUXOS.md))
17. **Lista de necessidades** — visão geral para debug/suporte (ex: identificar cidades sem cobertura)

> Pode começar como uma tela simples protegida por role=admin dentro do mesmo React app, ou até um painel Laravel Nova/Filament separado — não vale construir do zero agora. **Recomendo Filament**: é Laravel-nativo, gera CRUD admin em horas, e resolve as telas 16-17 sem você escrever UI nenhuma.

## Fora do MVP (não desenhar telas ainda)

- Jornada visual (linha do tempo de etapas tipo o exemplo do briefing) — é a peça mais vistosa da visão de longo prazo, mas também a que mais muda depois que vocês tiverem uso real. Desenhar agora é desenhar no escuro.
- Histórico do imóvel / ficha do imóvel
- Avaliações e reviews
- Pagamentos/checkout
- Marketplace de fornecedores
