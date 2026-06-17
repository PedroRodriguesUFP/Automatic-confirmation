# AutoFlow 🤖

> Automatizações de WhatsApp e marcações para negócios locais.

**"Pomos o seu negócio a responder sozinho — WhatsApp, marcações, lembretes."**

---

## Stack

| Componente | Tecnologia |
|---|---|
| Backend | Node.js + Express |
| Base de dados | PostgreSQL + Prisma |
| Frontend | React + Vite + Tailwind |
| WhatsApp | Meta Cloud API |
| Hosting | Railway + Vercel |

---

## Estrutura

```
autoflow/
├── backend/
│   ├── src/
│   │   ├── controllers/   # Lógica de cada rota
│   │   ├── routes/        # Definição das rotas
│   │   ├── services/      # Bot, WhatsApp API, Calendar
│   │   ├── jobs/          # Cron jobs (lembretes)
│   │   ├── middlewares/   # Auth, erros
│   │   ├── models/        # Tipos/interfaces
│   │   └── config/        # DB, env
│   └── prisma/
│       └── schema.prisma  # Modelos da base de dados
└── frontend/
    └── src/
        ├── pages/         # Dashboard, Marcações, Conversas, Definições
        ├── components/    # UI reutilizável
        ├── services/      # Chamadas à API
        ├── hooks/         # Custom hooks
        └── context/       # Estado global
```

---

## Como correr localmente

### Backend
```bash
cd backend
npm install
cp .env.example .env   # preencher variáveis
npm run db:generate
npm run db:migrate
npm run dev
```

### Frontend
```bash
cd frontend
npm install
cp .env.example .env
npm run dev
```

---

## Roadmap

- [ ] **Semana 1** — Validação com 5 negócios locais
- [ ] **Semana 2** — Bot WhatsApp funcional + dashboard base
- [ ] **Semana 3** — Google Calendar sync + página pública de marcação
- [ ] **Semana 4** — 1 cliente real (grátis, em troca de feedback)
- [ ] **Semana 6** — 3-5 clientes pagantes

---

## Equipa

| Nome | Role |
|---|---|
| Pedro | Full-stack |
| [Nome do colega] | Full-stack |
