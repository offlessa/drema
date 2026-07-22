# Drema — Fluxos (MVP)

## 1. Cadastro e login

```
Visitante → Escolhe "Sou cliente" ou "Sou profissional"
          → Cadastro (nome, e-mail, senha, cidade)
          → [se profissional] Onboarding de perfil (specialties, bio, documento)
             → status = pending → fica em curadoria manual (vocês aprovam no início — não escala,
               mas no MVP com poucos profissionais é o jeito certo de garantir qualidade)
          → Login
```

**Decisão de produto:** no MVP, aprovação de profissional é manual (vocês olham cada cadastro). Automatizar isso cedo é otimizar um problema que vocês ainda não têm (volume). Manual também vira uma vantagem: vocês aprendem quem são os bons profissionais da região antes de qualquer algoritmo.

## 2. Cliente cria uma necessidade

```
Cliente logado → "Nova necessidade"
              → Escolhe categoria/especialidade (lista fixa)
              → Descreve o que precisa (título + descrição)
              → Informa orçamento (opcional) e confirma cidade
              → Submete → status: open
              → Sistema dispara matching (síncrono ou job em fila)
```

## 3. Matching (sistema seleciona profissionais)

```
Job de matching é acionado quando need.status = open
  → Filtra professional_profiles: status=approved, specialty match, city dentro do raio de atuação
  → Ordena por: (1) avaliação futura — no MVP não existe, usar (2) profissionais com menos oportunidades
    abertas no momento (distribuir oportunidade, não sempre os mesmos) e (3) mais recentes/ativos
  → Seleciona N profissionais (ex: até 5)
  → Cria registros em opportunities (status=sent) + notifica por e-mail
  → need.status → matching
```

**Nota:** "melhores profissionais considerando avaliações/disponibilidade" do briefing original pressupõe dado histórico que não existe ainda. No MVP o critério é simples e honesto (match de categoria + cidade + distribuição justa). Sofisticar o ranking é trabalho de fase 2, com dado real de avaliações.

## 4. Profissional recebe e responde oportunidade

```
Profissional → Dashboard → "Oportunidades" (opportunities onde status=sent/viewed)
            → Abre oportunidade → status → viewed
            → Decide: enviar proposta OU recusar
                 → Envia proposta (preço, prazo, mensagem)
                     → opportunity.status → proposal_sent
                     → proposal criada (status=pending)
                     → need.status → proposals_received
                 → Recusa
                     → opportunity.status → declined
            → Se não responder em 48h → opportunity.status → expired (job agendado)
```

## 5. Cliente compara e escolhe

```
Cliente → Detalhe da necessidade → lista de propostas recebidas (lado a lado: preço, prazo, perfil do profissional)
       → Cliente aceita uma proposta
            → proposal.status → accepted
            → demais proposals da mesma need → status permanece pending/rejected (cliente pode rejeitar
              explicitamente as outras, ou elas ficam "não escolhidas" implicitamente)
            → conversation é criada automaticamente (client + professional)
            → need.status → closed
```

**Decisão:** o briefing diz "só depois conversa" — ou seja, chat só abre após aceite de proposta. Isso é uma escolha de produto forte e correta para o MVP: evita que profissionais tentem contornar a plataforma negociando fora dela antes de haver comprometimento (e protege uma futura fonte de receita por comissão).

## 6. Chat

```
Conversation criada → ambas as partes veem no menu "Mensagens"
                    → troca de mensagens (polling ou websocket via Pusher)
                    → sem workflow adicional no MVP (sem marcos, sem anexos de contrato — texto simples)
```

## 7. Estado vazio / sem match

Se o matching não encontra nenhum profissional (cidade sem cobertura ainda):
```
need.status → open, mas sem opportunities criadas
→ Cliente vê mensagem: "Ainda não temos profissionais dessa especialidade na sua região.
   Avisaremos assim que houver disponibilidade." + captura interesse (sinal de demanda para
   priorizar recrutamento de profissionais naquela categoria/região)
```
Esse é um fluxo pequeno, mas importante: em duas pontas de marketplace, o dia 1 quase sempre tem lado vazio. Tratar isso como dado de negócio (onde recrutar profissionais) em vez de erro silencioso é o que separa marketplace que morre de marketplace que aprende.
