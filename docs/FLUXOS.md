# Drema — Fluxos (MVP)

> Substitui a versão anterior (necessidade → matching automático em massa → propostas). O fluxo atual é uma jornada guiada: o cliente escolhe um profissional entre os compatíveis, em vez do sistema empurrar a necessidade para vários profissionais responderem.

## 1. Cadastro e login

Igual ao desenho original: cliente ou profissional escolhem o papel no cadastro. Profissional preenche o onboarding (`/perfil-profissional`) e fica com `status=pending` até aprovação manual — decisão consciente de manter curadoria humana enquanto o volume for baixo (ver [BANCO_DE_DADOS.md](BANCO_DE_DADOS.md)).

## 2. Cliente descreve o projeto (Telas 4–5 do brief original)

```
Cliente logado → "Iniciar novo projeto" → escolhe objetivo (goal)
              → responde questionário guiado (localização, área, ambientes, estilo,
                orçamento, prazo, referências, descrição livre)
              → submete → cria project_brief
              → sistema calcula compatibilidade com todos os profissionais aprovados
                (MatchingService) e persiste até 5 matches (score ≥ 30) em `matches`
              → cliente é redirecionado para a tela de resultados
```

## 3. Resultado do match

```
Cliente vê cards ordenados por compatibilidade (nome, empresa, especialidade,
localização, estilos, "X% compatível")
              → clica em um card → vê o perfil completo do profissional
              → clica em "Tenho interesse"
                    → match.status → chatting
                    → conversation é criada automaticamente
                    → tela mostra "É uma combinação!" e redireciona para o chat
```

Diferença importante do desenho anterior: **o cliente é quem inicia o contato**, escolhendo entre os compatíveis — o profissional não precisa aceitar/recusar antes do chat abrir. Isso é mais simples de implementar e mais parecido com a experiência "Tinder de profissionais" do briefing. Se isso gerar volume de contato indesejado para os profissionais, o ajuste natural é dar a eles a opção de "pausar" recebimento de leads no próprio perfil — não implementado ainda.

## 4. Profissional recebe o lead

```
Profissional → Dashboard → lista de leads (matches onde ele é o profissional),
              ordenados por compatibilidade, mostrando resumo do projeto (objetivo,
              área, cidade, orçamento) e o score
              → se já existe conversation (cliente demonstrou interesse), tem link
                direto para o chat
```

Não existe mais o conceito de "recusar oportunidade" — como o cliente já escolheu ativamente aquele profissional, o próximo passo é sempre a conversa.

## 5. Chat

Igual ao desenho original: mensagens simples, sem marcos ou anexos formais. Hoje via polling (refetch a cada 4s) — WebSocket (Pusher, já previsto em [ARQUITETURA.md](ARQUITETURA.md)) é upgrade natural quando o volume justificar.

## 6. Estado vazio / sem match

```
Se nenhum profissional aprovado atinge o score mínimo (30):
  matches fica vazio → tela de resultados mostra "ainda não temos profissionais
  compatíveis" em vez de uma lista vazia sem explicação
```

Mesma lógica de antes: isso é sinal de negócio (onde recrutar profissionais), não erro — mas ainda não há captura automática desse interesse (ex: notificar o cliente quando surgir um profissional compatível). Fica para quando o volume de "zero match" for grande o suficiente para valer a pena.
