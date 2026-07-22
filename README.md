# Drema

Do sonho ao imóvel.

Plataforma que organiza a jornada da construção civil — do primeiro objetivo do cliente até a entrega, conectando-o aos profissionais certos.

## Estrutura

- [`api/`](api/) — backend Laravel (API REST)
- [`web/`](web/) — frontend React + Vite + TypeScript
- [`docs/`](docs/) — arquitetura, banco de dados, fluxos, telas, design system e roadmap do MVP

## Rodando localmente

Pré-requisitos: PHP 8.3+, Composer, MySQL 8, Node 20+.

```bash
# API (porta 8000)
cd api
cp .env.example .env   # ajuste DB_* se necessário
composer install
php artisan key:generate
php artisan migrate
php artisan serve

# Web (porta 5173)
cd web
cp .env.example .env
npm install
npm run dev
```

Comece pela documentação em [`docs/README.md`](docs/README.md) antes de mexer no código.
