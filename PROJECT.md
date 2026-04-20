# MyBookShelf — Plano Completo do Projeto

> Plataforma para descoberta, catalogação e avaliação de livros, com SSR para SEO, monetização por anúncios e suporte a múltiplos idiomas.

---

## 🎨 Identidade Visual

### Logo
O arquivo `logo.png` na raiz do projeto contém o ícone oficial: um livro aberto com marcador.

### Paleta de Cores
Tema inspirado em uma biblioteca clássica, baseado em tons de marrom quente.

| Token              | Hex       | Uso                                      |
|--------------------|-----------|------------------------------------------|
| `--color-espresso` | `#3B1F10` | Fundo escuro, headers, sidebar           |
| `--color-mahogany` | `#6B3A2A` | Primário (botões, links ativos)          |
| `--color-walnut`   | `#8B5E3C` | Secundário (hover, destaques)            |
| `--color-caramel`  | `#C4894F` | Acentos, estrelas de avaliação           |
| `--color-parchment`| `#F5E6D3` | Fundo claro, cards                       |
| `--color-cream`    | `#FBF5EE` | Background de páginas                    |
| `--color-ink`      | `#1C0F07` | Texto principal                          |
| `--color-muted`    | `#9E7B65` | Texto secundário, placeholders           |

### Tipografia
- **Títulos**: `Playfair Display` (serif, elegante)
- **Corpo**: `Inter` (sans-serif, legível)
- **Código/Labels**: `JetBrains Mono`

### Aplicação
- Frontend (Next.js): variáveis CSS globais em `globals.css`
- Mobile (Expo): tokens centralizados em `styles/theme.ts`

---

## 🏗️ Arquitetura

```
┌─────────────────────────────────────────────────────┐
│                     CLIENTES                         │
│  ┌─────────────┐  ┌──────────────┐  ┌────────────┐  │
│  │  Frontend   │  │   Mobile     │  │   Admin    │  │
│  │  (Next.js)  │  │ (Expo/RN)    │  │ (Next.js)  │  │
│  └──────┬──────┘  └──────┬───────┘  └─────┬──────┘  │
└─────────┼────────────────┼────────────────┼──────────┘
          │                │                │
          └────────────────┼────────────────┘
                           │
                    ┌──────▼──────┐
                    │ API Gateway │
                    │  (NestJS)   │
                    └──────┬──────┘
                           │
          ┌────────────────┼────────────────┐
          │                │                │
   ┌──────▼──────┐  ┌──────▼──────┐  ┌─────▼──────┐
   │  Books API  │  │ Search API  │  │  Auth/User │
   │  (NestJS)   │  │(Elasticsearch│  │  (NestJS)  │
   │  backend/   │  │  + NestJS)  │  │  backend/  │
   └──────┬──────┘  └─────────────┘  └─────┬──────┘
          │                                  │
   ┌──────▼──────────────────────────────────▼──────┐
   │                   PostgreSQL                    │
   └─────────────────────────────────────────────────┘
          │
   ┌──────▼──────┐
   │  OpenLibrary│
   │    API      │
   └─────────────┘
```

### Fluxo de Comunicação

1. **Frontend/Mobile/Admin → API Gateway (Backend NestJS)**
   - Protocolo: HTTPS + REST
   - Auth: JWT Bearer token (header `Authorization`)
   - CSRF: cookie `csrf-token` para mutações
   - Rate limiting: ThrottlerModule (10 req/min por IP)

2. **API Gateway → Elasticsearch (Serviço de Pesquisa)**
   - Chamada interna HTTP ao serviço Elasticsearch
   - Sincronização: ao criar/atualizar livro no PostgreSQL, indexar no Elasticsearch

3. **API Gateway → OpenLibrary**
   - Cache-ahead: busca primeiro no PostgreSQL, só consulta OpenLibrary se não encontrar
   - Resultado persistido no PostgreSQL e indexado no Elasticsearch

4. **Redis**
   - Cache de sessões JWT
   - Filas Bull: envio de e-mails (verificação, esqueceu senha)

---

## 🗄️ Banco de Dados (PostgreSQL)

### Tabelas Existentes

#### `user`
| Coluna      | Tipo      | Restrições              |
|-------------|-----------|-------------------------|
| id          | UUID (PK) | auto-gerado             |
| firstName   | VARCHAR   | NOT NULL                |
| lastName    | VARCHAR   | NOT NULL                |
| email       | VARCHAR   | NOT NULL, UNIQUE        |
| phone       | VARCHAR   | UNIQUE, NULLABLE        |
| password    | VARCHAR   | NOT NULL (bcrypt hash)  |
| activated   | BOOLEAN   | DEFAULT false           |
| enabled     | BOOLEAN   | DEFAULT true            |
| createdAt   | TIMESTAMP | auto                    |
| updatedAt   | TIMESTAMP | auto                    |

---

### Novas Tabelas

#### `author`
| Coluna      | Tipo      | Restrições              |
|-------------|-----------|-------------------------|
| id          | UUID (PK) | auto-gerado             |
| name        | VARCHAR   | NOT NULL                |
| pageUrl     | VARCHAR   | URL OpenLibrary         |
| photoUrl    | VARCHAR   | NULLABLE                |
| createdAt   | TIMESTAMP | auto                    |
| updatedAt   | TIMESTAMP | auto                    |

#### `category`
| Coluna      | Tipo      | Restrições              |
|-------------|-----------|-------------------------|
| id          | UUID (PK) | auto-gerado             |
| name        | VARCHAR   | NOT NULL, UNIQUE        |
| pageUrl     | VARCHAR   | URL OpenLibrary         |
| createdAt   | TIMESTAMP | auto                    |

#### `book`
| Coluna        | Tipo      | Restrições              |
|---------------|-----------|-------------------------|
| id            | UUID (PK) | auto-gerado             |
| title         | VARCHAR   | NOT NULL                |
| coverUrl      | VARCHAR   | NULLABLE                |
| synopsis      | TEXT      | NULLABLE                |
| pages         | INTEGER   | NULLABLE                |
| publishedDate | DATE      | NULLABLE                |
| publisher     | VARCHAR   | NULLABLE                |
| isbn          | VARCHAR   | UNIQUE, NULLABLE        |
| siteUrl       | VARCHAR   | URL OpenLibrary         |
| openLibraryId | VARCHAR   | UNIQUE (chave externa)  |
| viewCount     | INTEGER   | DEFAULT 0               |
| authorId      | UUID (FK) | → author.id             |
| createdAt     | TIMESTAMP | auto                    |
| updatedAt     | TIMESTAMP | auto                    |

#### `book_categories` (N:N)
| Coluna     | Tipo      |
|------------|-----------|
| bookId     | UUID (FK) → book.id     |
| categoryId | UUID (FK) → category.id |

#### `collection`
| Coluna      | Tipo      | Restrições              |
|-------------|-----------|-------------------------|
| id          | UUID (PK) | auto-gerado             |
| name        | VARCHAR   | NOT NULL                |
| userId      | UUID (FK) | → user.id               |
| createdAt   | TIMESTAMP | auto                    |
| updatedAt   | TIMESTAMP | auto                    |

#### `collection_books` (N:N)
| Coluna       | Tipo      |
|--------------|-----------|
| collectionId | UUID (FK) → collection.id |
| bookId       | UUID (FK) → book.id       |

#### `review`
| Coluna    | Tipo      | Restrições              |
|-----------|-----------|-------------------------|
| id        | UUID (PK) | auto-gerado             |
| userId    | UUID (FK) | → user.id               |
| bookId    | UUID (FK) | → book.id               |
| stars     | INTEGER   | CHECK (1–5), NOT NULL   |
| comment   | TEXT      | NULLABLE                |
| createdAt | TIMESTAMP | auto                    |
| updatedAt | TIMESTAMP | auto                    |

**UNIQUE constraint**: `(userId, bookId)` — um review por usuário por livro.

---

## 🛣️ Rotas da API

> Base URL: `/api/v1`
> Rotas marcadas com 🔒 exigem JWT Bearer token.

### Auth (`/auth`)
| Método | Rota              | Descrição                       |
|--------|-------------------|---------------------------------|
| POST   | `/auth/login`     | Login, retorna JWT              |
| GET    | `/auth/profile`   | 🔒 Perfil do usuário logado     |
| GET    | `/auth/csrf-token`| Gera CSRF token                 |

### Users (`/users`)
| Método | Rota                        | Descrição                       |
|--------|-----------------------------|--------------------------------------|
| POST   | `/users`                    | Cadastro de novo usuário             |
| POST   | `/users/forgotpassword`     | Solicitar redefinição de senha       |
| POST   | `/users/resetpassword`      | Redefinir senha com token            |
| PUT    | `/users/verify?token=`      | Verificar conta por e-mail           |
| GET    | `/users`                    | 🔒 Listar usuários (Admin)           |
| GET    | `/users/:id`                | 🔒 Buscar usuário por ID             |
| PATCH  | `/users/:id`                | 🔒 Atualizar usuário                 |
| DELETE | `/users/:id`                | 🔒 Remover usuário (Admin)           |

### Books (`/books`)
| Método | Rota                       | Descrição                                        |
|--------|----------------------------|--------------------------------------------------|
| GET    | `/books/search?q=`         | Busca via Elasticsearch (retorna preview)        |
| GET    | `/books/:id`               | Detalhes do livro (busca DB → OpenLibrary)       |
| GET    | `/books/isbn/:isbn`        | Busca por ISBN                                   |
| GET    | `/books/popular`           | Livros mais acessados (ordenado por viewCount)   |
| GET    | `/books/category/:id`      | Livros por categoria (ordenado por avaliação)    |
| GET    | `/books/author/:id`        | Livros por autor                                 |
| POST   | `/books`                   | 🔒 (Admin) Cadastro manual de livro              |
| PATCH  | `/books/:id`               | 🔒 (Admin) Atualizar livro                       |
| DELETE | `/books/:id`               | 🔒 (Admin) Remover livro                         |

### Authors (`/authors`)
| Método | Rota             | Descrição               |
|--------|------------------|-------------------------|
| GET    | `/authors`       | Listar autores          |
| GET    | `/authors/:id`   | Detalhes do autor       |

### Categories (`/categories`)
| Método | Rota               | Descrição               |
|--------|--------------------|-------------------------|
| GET    | `/categories`      | Listar categorias       |
| GET    | `/categories/:id`  | Detalhes da categoria   |

### Collections (`/collections`) 🔒
| Método | Rota                               | Descrição                         |
|--------|------------------------------------|-----------------------------------|
| GET    | `/collections`                     | Listar coleções do usuário        |
| POST   | `/collections`                     | Criar nova coleção                |
| GET    | `/collections/:id`                 | Ver coleção específica            |
| PATCH  | `/collections/:id`                 | Renomear coleção                  |
| DELETE | `/collections/:id`                 | Remover coleção                   |
| POST   | `/collections/:id/books/:bookId`   | Adicionar livro à coleção         |
| DELETE | `/collections/:id/books/:bookId`   | Remover livro da coleção          |

### Reviews (`/reviews`) 🔒
| Método | Rota                     | Descrição                         |
|--------|--------------------------|-----------------------------------|
| GET    | `/reviews/book/:bookId`  | Avaliações de um livro (público)  |
| POST   | `/reviews`               | Criar avaliação                   |
| PATCH  | `/reviews/:id`           | Editar avaliação própria          |
| DELETE | `/reviews/:id`           | Remover avaliação própria         |

---

## 📂 Estrutura de Projetos

```
mybookshelf/
├── logo.png                 # Logo do projeto
├── PROJECT.md               # Este arquivo
├── planning.md              # Planejamento original
├── backend/                 # NestJS — API + Auth + Books + Collections + Reviews
├── frontend/                # Next.js 15 — Site público + SSR + SEO + Adsense
├── mobile/                  # Expo React Native — App iOS/Android + Admob
└── admin/                   # Next.js — Painel administrativo
```

---

## 📋 Ordem de Implementação

> Princípio: **Server Fat, Client Thin** — toda validação ocorre no backend.

### Fase 1 — Backend: Entidades e Migrações
- [ ] Criar entidade `Author` + migração
- [ ] Criar entidade `Category` + migração
- [ ] Criar entidade `Book` + tabela N:N `book_categories` + migração
- [ ] Criar entidade `Collection` + tabela N:N `collection_books` + migração
- [ ] Criar entidade `Review` + migração

### Fase 2 — Backend: Books Service + OpenLibrary
- [ ] Criar módulo `books` (entity, service, controller, DTOs)
- [ ] Implementar integração com a API do OpenLibrary
- [ ] Lógica de cache-aside: DB → OpenLibrary → persist
- [ ] Incrementar `viewCount` ao acessar `/books/:id`

### Fase 3 — Backend: Elasticsearch
- [ ] Configurar cliente Elasticsearch no NestJS
- [ ] Criar índice `books` com campos: title, authorName, coverUrl, id, siteUrl
- [ ] Sincronizar ao criar/atualizar livros (via Bull queue para não bloquear request)
- [ ] Implementar rota `/books/search?q=`

### Fase 4 — Backend: Collections e Reviews
- [ ] Criar módulo `collections` (CRUD + add/remove book)
- [ ] Criar módulo `reviews` (CRUD com constraint user+book)

### Fase 5 — Frontend: Identidade Visual + Base
- [ ] Configurar paleta de cores e tipografia (`globals.css`)
- [ ] Criar componentes base: Header, Footer, BookCard, StarRating, SearchBar
- [ ] Aplicar logo
- [ ] Configurar i18n (next-intl) para EN, PT, ES, FR, DE

### Fase 6 — Frontend: Páginas Públicas (SSR/SSG)
- [ ] Homepage: barra de pesquisa + livros populares + categorias
- [ ] `/books/[id]` — Página do livro (ISR - on-demand revalidation)
- [ ] `/authors/[id]` — Página do autor (ISR)
- [ ] `/categories/[id]` — Página da categoria (ISR, ordenado por avaliação)
- [ ] Integrar Google Adsense

### Fase 7 — Frontend: Área Logada
- [ ] Manter fluxo existente: login, registro, verificação, forgot/reset password
- [ ] Página de coleções (listar, criar, adicionar/remover livros)
- [ ] Formulário de avaliação (estrelas + comentário)

### Fase 8 — Mobile: Identidade Visual + Base
- [ ] Centralizar tema em `styles/theme.ts` (mesma paleta do frontend)
- [ ] Configurar logo e splash screen
- [ ] Configurar i18n (react-i18next ou expo-localization)
- [ ] Configurar Admob (`react-native-google-mobile-ads`)

### Fase 9 — Mobile: Telas Principais
- [ ] Home: barra de pesquisa + populares + categorias
- [ ] Tela do livro (detalhes + avaliações)
- [ ] Tela do autor
- [ ] Tela da categoria
- [ ] Fluxo de autenticação (login, registro, forgot password)
- [ ] Telas de coleções (listar + gerenciar)

### Fase 10 — Admin: Painel
- [ ] Inicializar projeto Next.js com tema marrom
- [ ] Listar usuários com paginação
- [ ] Listar livros com número de visitas (viewCount)
- [ ] Dashboard com métricas gerais (total de livros, usuários, reviews)

---

## 🔒 Segurança

| Camada       | Medida                                                              |
|--------------|----------------------------------------------------------------------|
| Autenticação | JWT Bearer + refresh implícito via cookie httpOnly                  |
| CSRF         | Token CSRF obrigatório para POST/PUT/PATCH/DELETE                   |
| Rate Limit   | ThrottlerModule: 10 req/60s por IP                                  |
| Senhas       | Hash bcrypt (rounds: 12)                                            |
| Headers      | Helmet.js (XSS, HSTS, CSP, no-sniff)                               |
| Validação    | **Apenas no backend** via `class-validator` — nunca confiar no client|
| CORS         | Whitelist explícita de origens (frontend, mobile, admin)            |

---

## 🌐 Internacionalização

Ambos frontend e mobile suportarão os idiomas:
- 🇧🇷 Português (`pt`)
- 🇺🇸 Inglês (`en`)
- 🇪🇸 Espanhol (`es`)
- 🇫🇷 Francês (`fr`)
- 🇩🇪 Alemão (`de`)

Frontend: `next-intl` com arquivos de tradução em `messages/[locale].json`
Mobile: `expo-localization` + `i18n-js` com arquivos em `locales/[locale].json`

---

## 🛠️ Stack Técnica Resumida

| Camada    | Tecnologias                                                         |
|-----------|----------------------------------------------------------------------|
| Backend   | NestJS, TypeORM, PostgreSQL, Redis, Bull, Elasticsearch, Pino, Swagger |
| Frontend  | Next.js 15, TailwindCSS, Radix UI, React Hook Form, Zod, next-intl |
| Mobile    | Expo SDK 53, React Native, expo-router, styled-components, Admob    |
| Admin     | Next.js, TailwindCSS, Ant Design                                    |
| Infra     | Docker Compose, Prometheus, Grafana (observabilidade)               |
