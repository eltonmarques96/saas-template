# MyBookShelf — TASK.md

> Lista de tarefas executáveis por agente. Cada tarefa é **autossuficiente**: um agente pode executá-la sem outro rodando simultaneamente.
> As dependências indicam quais tarefas devem ter sido concluídas **antes** de iniciar esta.

---

## Legenda

- `[ ]` Pendente
- `[/]` Em andamento
- `[x]` Concluída
- **Deps:** IDs das tarefas que devem estar prontas antes desta

---

## 🗂️ Módulo 1 — Backend: Fundação de Dados

> Diretório: `backend/`
> Stack: NestJS + TypeORM + PostgreSQL
> Regra: **nunca expor dados sensíveis; usar apenas variáveis de ambiente via `process.env`**

---

### TASK-BE-01 `[x]` — Entidades e Migrações: Author, Category, Book

**Deps:** nenhuma

**O que fazer:**
1. Criar `src/authors/entities/author.entity.ts` com os campos: `id (UUID PK)`, `name`, `pageUrl`, `photoUrl (nullable)`, `createdAt`, `updatedAt`
2. Criar `src/categories/entities/category.entity.ts` com os campos: `id (UUID PK)`, `name (unique)`, `pageUrl`, `createdAt`
3. Criar `src/books/entities/book.entity.ts` com os campos: `id (UUID PK)`, `title`, `coverUrl`, `synopsis`, `pages`, `publishedDate`, `publisher`, `isbn (unique)`, `siteUrl`, `openLibraryId (unique)`, `viewCount (default 0)`, `authorId (FK → author)`, `categories (ManyToMany → category)`, `createdAt`, `updatedAt`
4. Configurar o relacionamento `@ManyToMany` entre `Book` e `Category` com a tabela intermediária `book_categories`
5. Configurar o relacionamento `@ManyToOne` entre `Book` e `Author`
6. Gerar e executar as migrações TypeORM:
   ```bash
   cd backend
   yarn migration:generate --name=CreateAuthorCategoryBook
   yarn migration:run
   ```
7. Registrar as entidades no `AppModule` via `TypeOrmModule.forFeature`
8. Criar os módulos básicos `AuthorsModule`, `CategoriesModule`, `BooksModule` sem service/controller completo ainda — apenas para exportar as entidades

**Validação:** Rodar `yarn test` e verificar que as migrações executam sem erro com PostgreSQL local (variáveis no `.env`).

---

### TASK-BE-02 `[x]` — Entidades e Migrações: Collection e Review

**Deps:** TASK-BE-01

**O que fazer:**
1. Criar `src/collections/entities/collection.entity.ts` com os campos: `id (UUID PK)`, `name`, `userId (FK → user)`, `books (ManyToMany → book)`, `createdAt`, `updatedAt`
2. Configurar relacionamento `@ManyToMany` entre `Collection` e `Book` com tabela `collection_books`
3. Configurar relacionamento `@ManyToOne` entre `Collection` e `User`
4. Criar `src/reviews/entities/review.entity.ts` com os campos: `id (UUID PK)`, `userId (FK → user)`, `bookId (FK → book)`, `stars (CHECK 1–5)`, `comment (nullable)`, `createdAt`, `updatedAt`
5. Adicionar `@Unique(['userId', 'bookId'])` na entidade `Review`
6. Gerar e executar migrações:
   ```bash
   cd backend
   yarn migration:generate --name=CreateCollectionReview
   yarn migration:run
   ```
7. Criar módulos básicos `CollectionsModule`, `ReviewsModule` (sem controller/service completos)

**Validação:** Rodar `yarn test` e confirmar que todas as tabelas existem no PostgreSQL.

---

## 🗂️ Módulo 2 — Backend: Módulo de Livros e OpenLibrary

### TASK-BE-03 `[x]` — Books: Service + Integração OpenLibrary

**Deps:** TASK-BE-01

**O que fazer:**
1. Instalar `@nestjs/axios` e `axios` no backend (se ainda não tiver)
2. Criar `src/books/books.service.ts` com os métodos:
   - `findById(id)` — busca no DB; se não encontrar, busca na OpenLibrary API, persiste e retorna
   - `findByIsbn(isbn)` — idem com ISBN
   - `findPopular(limit?)` — busca livros ordenados por `viewCount DESC`
   - `findByCategory(categoryId)` — busca livros de uma categoria, ordenados por média de estrelas
   - `findByAuthor(authorId)` — livros de um autor
   - `incrementViewCount(bookId)` — incrementar `viewCount` atomicamente
   - `create(dto)` — criação manual (admin)
   - `update(id, dto)` — atualização (admin)
   - `remove(id)` — remoção (admin)
3. Implementar `OpenLibraryService` em `src/books/openlibrary.service.ts`:
   - Chamar `https://openlibrary.org/api/books?bibkeys=ISBN:&format=json&jscmd=data`
   - Mapear resposta para a entidade `Book` + `Author` + `Category[]`
   - URL base em variável de ambiente `OPEN_LIBRARY_BASE_URL` (default: `https://openlibrary.org`)
4. Criar DTOs: `CreateBookDto`, `UpdateBookDto`, `ReturnBookDto` com `class-validator`
5. Criar `src/books/books.controller.ts` com todas as rotas especificadas em `PROJECT.md`:
   - `GET /books/popular`
   - `GET /books/search?q=` (placeholder; implementação real no TASK-BE-05)
   - `GET /books/isbn/:isbn`
   - `GET /books/category/:id`
   - `GET /books/author/:id`
   - `GET /books/:id`
   - `POST /books` (🔒 admin)
   - `PATCH /books/:id` (🔒 admin)
   - `DELETE /books/:id` (🔒 admin)
6. Criar `src/authors/authors.controller.ts` + service (GET /authors, GET /authors/:id)
7. Criar `src/categories/categories.controller.ts` + service (GET /categories, GET /categories/:id)
8. Registrar tudo no `AppModule`

**Variáveis de ambiente necessárias:**
```env
OPEN_LIBRARY_BASE_URL=https://openlibrary.org
```

**Validação:** Fazer requisição `GET /books/isbn/9780261102354` e verificar que livro é buscado no OpenLibrary e salvo no banco.

---

### TASK-BE-04 `[x]` — Elasticsearch: Indexação e Busca

**Deps:** TASK-BE-03

**O que fazer:**
1. Adicionar ao `docker-compose.yml` (backend) o serviço `elasticsearch:8.x`
2. Instalar `@elastic/elasticsearch` no backend
3. Criar `src/search/search.module.ts` e `search.service.ts`:
   - `indexBook(book)` — indexar/atualizar documento no índice `books`
   - `searchBooks(query)` — full-text search nos campos `title`, `authorName`; retorna: `{ id, title, authorName, coverUrl, siteUrl }`
   - `deleteBook(bookId)` — remover do índice
4. Integrar no `BooksService`:
   - Ao chamar `create()` → chamar `searchService.indexBook()` via Bull queue
   - Ao chamar `findById()` com livro novo (vindo da OpenLibrary) → enfileirar indexação
5. Implementar a rota `GET /books/search?q=` no `BooksController` usando `SearchService`
6. Configurar a fila Bull `book-indexing` com worker dedicado

**Variáveis de ambiente necessárias:**
```env
ELASTICSEARCH_NODE=http://localhost:9200
ELASTICSEARCH_USERNAME=elastic
ELASTICSEARCH_PASSWORD=
```

**Validação:** Buscar `GET /books/search?q=harry potter` e receber lista de livros em menos de 500ms.

---

### TASK-BE-05 `[x]` — Collections: CRUD completo

**Deps:** TASK-BE-02

**O que fazer:**
1. Criar `src/collections/collections.service.ts` com métodos:
   - `findAllByUser(userId)` — listar coleções do usuário autenticado
   - `findOne(id, userId)` — retorna coleção somente se pertencer ao usuário
   - `create(dto, userId)` — criar nova coleção
   - `update(id, dto, userId)` — renomear (verificar ownership)
   - `remove(id, userId)` — remover (verificar ownership)
   - `addBook(collectionId, bookId, userId)` — adicionar livro
   - `removeBook(collectionId, bookId, userId)` — remover livro
2. Criar `src/collections/collections.controller.ts` com rotas (todas 🔒):
   - `GET /collections`
   - `POST /collections`
   - `GET /collections/:id`
   - `PATCH /collections/:id`
   - `DELETE /collections/:id`
   - `POST /collections/:id/books/:bookId`
   - `DELETE /collections/:id/books/:bookId`
3. Criar DTOs: `CreateCollectionDto`, `UpdateCollectionDto`, `ReturnCollectionDto`
4. Toda operação de escrita deve validar que o usuário autenticado é o dono da coleção (proibir acesso a coleções alheias)

**Validação:** Criar coleção, adicionar livro, remover livro, deletar coleção — tudo via API com JWT válido.

---

### TASK-BE-06 `[x]` — Reviews: CRUD completo

**Deps:** TASK-BE-02

**O que fazer:**
1. Criar `src/reviews/reviews.service.ts` com métodos:
   - `findByBook(bookId)` — reviews públicas de um livro (com média de estrelas)
   - `create(dto, userId)` — criar review; lançar erro se usuário já avaliou este livro
   - `update(id, dto, userId)` — editar; verificar que o review pertence ao usuário
   - `remove(id, userId)` — deletar; verificar ownership
2. Criar `src/reviews/reviews.controller.ts` com rotas:
   - `GET /reviews/book/:bookId` (público)
   - `POST /reviews` (🔒)
   - `PATCH /reviews/:id` (🔒)
   - `DELETE /reviews/:id` (🔒)
3. Criar DTOs: `CreateReviewDto` (campos: `bookId`, `stars` 1-5, `comment`), `UpdateReviewDto`, `ReturnReviewDto`
4. Validar `stars` entre 1 e 5 com `@Min(1) @Max(5)` do `class-validator`

**Validação:** Criar review, tentar criar duplicado (deve retornar 409), atualizar e deletar.

---

## 🗂️ Módulo 3 — API Gateway

### TASK-BE-07 `[x]` — Configuração do API Gateway (NestJS)

**Deps:** TASK-BE-03, TASK-BE-04, TASK-BE-05, TASK-BE-06

**O que fazer:**
1. Configurar prefixo global `/api/v1` no `main.ts`
2. Confirmar e revisar configuração do `AuthGuard` (já existente) — garantir que protege todas as rotas não marcadas com `@Public()`
3. Configurar CORS com whitelist via variável de ambiente:
   ```env
   ALLOWED_ORIGINS=http://localhost:3000,http://localhost:4000,http://localhost:5000
   ```
4. Confirmar Helmet, ThrottlerModule e CSRF estão ativos para todas as rotas de mutação
5. Atualizar Swagger (`@nestjs/swagger`) com:
   - Título: "MyBookShelf API"
   - Versão: "1.0"
   - Bearer auth habilitado
   - Documentar todos os novos endpoints (Books, Authors, Categories, Collections, Reviews)
6. Adicionar `ValidationPipe` global com `whitelist: true` e `forbidNonWhitelisted: true`
7. Criar rota de health check `GET /health` (público) retornando status do banco e Redis

**Variáveis de ambiente necessárias:**
```env
ALLOWED_ORIGINS=http://localhost:3000,http://localhost:4000,http://localhost:5000
API_PREFIX=api/v1
```

**Validação:** Swagger disponível em `/api/docs`; rota `/api/v1/health` retorna `{ status: "ok" }`.

---

## 🗂️ Módulo 4 — Frontend (Next.js)

> Diretório: `frontend/`
> Stack: Next.js 15 + TailwindCSS + Axios
> Regra: nenhuma validação no client; apenas exibição e envio de dados para o backend

---

### TASK-FE-01 `[x]` — Identidade Visual e Design System

**Deps:** nenhuma

**O que fazer:**
1. Configurar variáveis CSS em `src/styles/globals.css`:
   ```css
   :root {
     --color-espresso: #3B1F10;
     --color-mahogany: #6B3A2A;
     --color-walnut: #8B5E3C;
     --color-caramel: #C4894F;
     --color-parchment: #F5E6D3;
     --color-cream: #FBF5EE;
     --color-ink: #1C0F07;
     --color-muted: #9E7B65;
   }
   ```
2. Configurar Google Fonts: `Playfair Display` (títulos) e `Inter` (corpo) no `layout.tsx`
3. Copiar `logo.png` da raiz para `frontend/public/logo.png`
4. Criar `src/lib/api.ts` com instância Axios base:
   - `baseURL` lida de `NEXT_PUBLIC_API_URL`
   - Interceptor de request: injeta JWT do cookie/localStorage
   - Interceptor de response: redireciona para `/login` em caso de 401
5. Criar `src/lib/apiClient.ts` com funções tipadas para cada endpoint da API
6. Configurar variável de ambiente `NEXT_PUBLIC_API_URL=http://localhost:3001/api/v1`

**Validação:** Página inicial carrega com fontes corretas e paleta de cores aplicada.

---

### TASK-FE-02 `[x]` — Componentes Base

**Deps:** TASK-FE-01

**O que fazer:**
Criar os seguintes componentes em `src/components/`:
1. `Header/Header.tsx` — logo + barra de pesquisa + nav (login/perfil) + seletor de idioma
2. `Footer/Footer.tsx` — links, copyright
3. `BookCard/BookCard.tsx` — card com capa, título, autor, estrelas médias; recebe props `Book`
4. `StarRating/StarRating.tsx` — exibe N estrelas (1–5) com cor caramel; prop `readonly` e modo interativo
5. `SearchBar/SearchBar.tsx` — input com debounce 300ms; ao digitar, chama `/books/search?q=`; exibe dropdown com resultados; ao clicar navega para `/books/[id]`
6. `AdBanner/AdBanner.tsx` — placeholder para Google Adsense (usa `NEXT_PUBLIC_ADSENSE_CLIENT`)
7. `LoadingSpinner/LoadingSpinner.tsx` — spinner animado com cor mahogany
8. `EmptyState/EmptyState.tsx` — ilustração + mensagem quando lista está vazia

**Validação:** Criar `src/pages/test-components.tsx` renderizando todos os componentes e verificar visual.

---

### TASK-FE-03 `[x]` — Configuração de i18n

**Deps:** TASK-FE-01

**O que fazer:**
1. Instalar `next-intl`
2. Criar arquivos de tradução em `frontend/messages/`:
   - `pt.json`, `en.json`, `es.json`, `fr.json`, `de.json`
   - Chaves mínimas: `home.title`, `home.search_placeholder`, `book.synopsis`, `book.pages`, `book.author`, `nav.login`, `nav.register`, `nav.my_collections`, `nav.logout`
3. Configurar `next.config.ts` com plugin do `next-intl`
4. Criar middleware de detecção de locale em `src/middleware.ts` (já existe, estender)
5. Atualizar `Header` (TASK-FE-02) com seletor de idioma que persiste preferência em cookie

**Validação:** Acessar `/?locale=en` e `/?locale=pt` e ver textos trocando.

---

### TASK-FE-04 `[x]` — Páginas Públicas: Homepage

**Deps:** TASK-FE-02, TASK-FE-03, TASK-BE-03

**O que fazer:**
1. Criar `src/pages/index.tsx` (ou `src/app/page.tsx`):
   - SSR: buscar `GET /books/popular` e `GET /categories`
   - Exibir: `SearchBar` no topo, seção "Livros Populares" com `BookCard` em grid, seção "Por Categoria" com lista de categorias linkando para `/categories/[id]`
2. Adicionar `<AdBanner>` entre seções
3. SEO: `<title>MyBookShelf — Descubra seus próximos livros</title>` + meta description

**Validação:** Página carrega com SSR (verificar `curl` retornando HTML com conteúdo), livros populares visíveis.

---

### TASK-FE-05 `[x]` — Páginas Públicas: Livro, Autor, Categoria (ISR)

**Deps:** TASK-FE-02, TASK-FE-03, TASK-BE-03

**O que fazer:**
1. Criar `src/pages/books/[id].tsx`:
   - ISR com `revalidate: false` (on-demand); página gerada uma vez e nunca regenerada automaticamente
   - Exibir: capa, título, autor (link), sinopse, páginas, editora, ISBN, categorias, estrelas médias, lista de avaliações
   - `<AdBanner>` após sinopse
   - SEO: title e description com nome do livro e autor
2. Criar `src/pages/authors/[id].tsx`:
   - SSG: `getStaticProps` + `getStaticPaths: { fallback: 'blocking' }`
   - Exibir: nome, foto (se houver), lista de livros do autor
3. Criar `src/pages/categories/[id].tsx`:
   - SSG com `fallback: 'blocking'`
   - Exibir: nome da categoria, livros ordenados por média de estrelas
   - `<AdBanner>` no início

**Validação:** Acessar `/books/[id-valido]` e verificar que a página está completa e SSG funciona.

---

### TASK-FE-06 `[x]` — Área Autenticada: Coleções e Avaliações

**Deps:** TASK-FE-02, TASK-BE-05, TASK-BE-06

**O que fazer:**
1. Manter e revisar fluxo existente: `/login`, `/register`, `/verify`, `/forgot-password`, `/reset-password` (já existem em `src/pages/`)
2. Criar `src/pages/dashboard/collections/index.tsx`:
   - Listar coleções do usuário (`GET /collections`)
   - Botão "Nova Coleção" abre modal com input de nome
   - Cada coleção mostra capa dos livros e tem botão para abrir/deletar
3. Criar `src/pages/dashboard/collections/[id].tsx`:
   - Exibir livros da coleção
   - Botão para remover livro da coleção
4. Em `src/pages/books/[id].tsx` (TASK-FE-05), quando usuário logado:
   - Exibir botão "Adicionar à Coleção" com dropdown das coleções
   - Exibir formulário de avaliação: `StarRating` interativo + textarea de comentário
   - Botão para enviar/atualizar/deletar própria avaliação

**Validação:** Criar coleção, adicionar livro via página do livro, visualizar coleção, avaliar livro.

---

## 🗂️ Módulo 5 — Mobile (Expo React Native)

> Diretório: `mobile/`
> Stack: Expo SDK 53 + expo-router + styled-components + Axios + Admob

---

### TASK-MOB-01 `[x]` — Tema, Logo e Configuração Base

**Deps:** nenhuma

**O que fazer:**
1. Criar `mobile/styles/theme.ts` com a paleta de cores idêntica ao frontend:
   ```ts
   export const colors = {
     espresso: '#3B1F10',
     mahogany: '#6B3A2A',
     walnut: '#8B5E3C',
     caramel: '#C4894F',
     parchment: '#F5E6D3',
     cream: '#FBF5EE',
     ink: '#1C0F07',
     muted: '#9E7B65',
   }
   ```
2. Copiar `logo.png` da raiz para `mobile/assets/images/logo.png`
3. Configurar splash screen e ícone do app com o logo (via `app.json`)
4. Criar `mobile/services/api.ts` com instância Axios:
   - `baseURL` de `EXPO_PUBLIC_API_URL`
   - Interceptor de request: injeta JWT do SecureStore
   - Interceptor de response: redireciona para tela de login em caso de 401
5. Instalar e configurar i18n:
   - Instalar `expo-localization` + `i18n-js`
   - Criar arquivos em `mobile/locales/`: `pt.json`, `en.json`, `es.json`, `fr.json`, `de.json`
6. Configurar Admob:
   - Inicializar `react-native-google-mobile-ads` em `app/_layout.tsx`
   - Criar `components/AdBanner.tsx` com banner Admob usando ID de variável de ambiente `EXPO_PUBLIC_ADMOB_BANNER_ID`

**Validação:** App abre com splash screen da logo, sem erros na inicialização.

---

### TASK-MOB-02 `[x]` — Componentes Base Mobile

**Deps:** TASK-MOB-01

**O que fazer:**
Criar em `mobile/components/`:
1. `BookCard.tsx` — card com imagem de capa, título, autor, estrelas; navegável para tela do livro
2. `StarRating.tsx` — linha de estrelas (readonly e interativo)
3. `SearchBar.tsx` — input com debounce 300ms chamando `/books/search?q=`; resultados em FlatList dropdown
4. `Header.tsx` — logo + título da tela + botão de perfil/login
5. `LoadingSpinner.tsx` — ActivityIndicator com cor mahogany
6. `EmptyState.tsx` — ícone + texto quando lista vazia

**Validação:** Tela de teste (`app/test.tsx`) renderizando todos os componentes sem erros.

---

### TASK-MOB-03 `[x]` — Telas: Home, Pesquisa e Detalhes do Livro

**Deps:** TASK-MOB-02, TASK-BE-03, TASK-BE-04

**O que fazer:**
1. `app/index.tsx` (Home):
   - `SearchBar` no topo
   - FlatList horizontal "Populares" (`GET /books/popular`)
   - FlatList de categorias linkando para tela de categoria
   - `AdBanner` entre seções
2. `app/books/[id].tsx`:
   - Buscar `GET /books/:id`
   - Exibir: capa (ScrollView), título, autor, sinopse, páginas, editora, ISBN
   - Lista de reviews (`GET /reviews/book/:id`) com `StarRating` readonly
   - `AdBanner` após sinopse
3. `app/search.tsx`:
   - FlatList com resultados de pesquisa em tempo real via `SearchBar`

**Validação:** Navegar pelo app: Home → clicar em livro → ver detalhes → voltar.

---

### TASK-MOB-04 `[x]` — Telas: Autor e Categoria

**Deps:** TASK-MOB-02, TASK-BE-03

**O que fazer:**
1. `app/authors/[id].tsx`:
   - Buscar `GET /authors/:id` e `GET /books/author/:id`
   - Exibir: foto (se houver), nome, FlatList de livros
2. `app/categories/[id].tsx`:
   - Buscar `GET /categories/:id` e `GET /books/category/:id`
   - Exibir: nome da categoria, FlatList de livros ordenados por avaliação
   - `AdBanner` no topo

**Validação:** Navegar de um livro para o autor e de uma categoria para a lista de livros.

---

### TASK-MOB-05 `[x]` — Autenticação Mobile

**Deps:** TASK-MOB-02

**O que fazer:**
1. Revisar e estilizar com o tema marrom as telas já existentes:
   - `app/index.tsx` (login) → aplicar tema
   - `app/register.tsx` → aplicar tema
   - `app/forgot-password.tsx` → aplicar tema
2. Criar `app/reset-password.tsx` (recebe token via deep link)
3. Criar contexto `contexts/AuthContext.tsx`:
   - Armazenar JWT em `expo-secure-store`
   - Funções: `login()`, `logout()`, `register()`
   - Expor `user`, `isAuthenticated`
4. Atualizar `app/_layout.tsx` para proteger rotas autenticadas

**Validação:** Fazer login, verificar que JWT é salvo, fazer logout e confirmar que rotas protegidas redirecionam.

---

### TASK-MOB-06 `[x]` — Telas Autenticadas: Coleções e Avaliações

**Deps:** TASK-MOB-05, TASK-BE-05, TASK-BE-06

**O que fazer:**
1. `app/(tabs)/collections.tsx`:
   - Listar coleções do usuário (`GET /collections`)
   - Botão "+" para criar nova coleção (modal com input)
2. `app/collections/[id].tsx`:
   - FlatList de livros da coleção
   - Swipe ou botão para remover livro
3. Em `app/books/[id].tsx` (TASK-MOB-03), quando autenticado:
   - Botão "Adicionar à Coleção" → bottom sheet com lista de coleções
   - Formulário de avaliação: `StarRating` interativo + TextInput para comentário
   - `POST /reviews` ou `PATCH /reviews/:id`

**Validação:** Criar coleção, adicionar livro, avaliar livro, ver avaliação na lista.

---

## 🗂️ Módulo 6 — Admin (Next.js)

> Diretório: `admin/`
> Acesso restrito a usuários admin

---

### TASK-ADM-01 `[x]` — Setup do Projeto Admin

**Deps:** nenhuma (backend auth já existe)

**O que fazer:**
1. Inicializar projeto Next.js em `admin/` (se não existir):
   ```bash
   cd admin
   npx create-next-app@latest ./ --typescript --tailwind --app --no-src-dir
   ```
2. Aplicar tema marrom: variáveis CSS idênticas ao frontend em `app/globals.css`
3. Copiar `logo.png` para `admin/public/logo.png`
4. Criar `lib/api.ts` com Axios apontando para `NEXT_PUBLIC_API_URL`
5. Criar layout de admin com sidebar:
   - Links: Dashboard, Usuários, Livros
   - Header com logo e botão de logout
6. Criar `middleware.ts` para proteger todas as rotas `/` — redireciona para `/login` se não autenticado
7. Criar página `/login` consumindo `POST /auth/login`

**Variáveis de ambiente:**
```env
NEXT_PUBLIC_API_URL=http://localhost:3001/api/v1
```

**Validação:** Acessar `/` sem login → redireciona para `/login`. Login funciona e redireciona para dashboard.

---

### TASK-ADM-02 `[x]` — Admin: Listagem de Usuários

**Deps:** TASK-ADM-01

**O que fazer:**
1. Criar `app/users/page.tsx`:
   - Tabela com paginação: nome, email, status (activated/enabled), data de cadastro
   - Dados de `GET /users` (protegido com JWT admin)
   - Botão para ativar/desativar usuário (`PATCH /users/:id`)
   - Botão para deletar usuário (`DELETE /users/:id`) com confirmação

**Validação:** Listar usuários, desativar um, verificar que o usuário não consegue mais logar.

---

### TASK-ADM-03 `[x]` — Admin: Listagem de Livros

**Deps:** TASK-ADM-01, TASK-BE-03

**O que fazer:**
1. Criar `app/books/page.tsx`:
   - Tabela com: capa (thumbnail), título, autor, ISBN, viewCount, data de cadastro
   - Dados de `GET /books/popular?limit=100` (ajustar endpoint para admin se necessário)
   - Busca/filtro local na tabela
   - Botão para deletar livro (`DELETE /books/:id`) com confirmação
2. Criar `app/books/[id]/page.tsx`:
   - Formulário de edição dos campos do livro
   - `PATCH /books/:id`

**Validação:** Listar livros com viewCount, editar título de um livro, confirmar atualização.

---

### TASK-ADM-04 `[x]` — Admin: Dashboard com Métricas

**Deps:** TASK-ADM-02, TASK-ADM-03

**O que fazer:**
1. Criar `app/dashboard/page.tsx` (rota raiz `/`):
   - Cards de KPI: Total de Livros, Total de Usuários, Total de Avaliações, Livro Mais Acessado
   - Tabela "Top 10 livros mais acessados" (viewCount)
   - Tabela "Últimos usuários cadastrados"
2. Criar endpoints de aggregate no backend se necessário (`GET /admin/stats`)

**Validação:** Dashboard carrega com métricas reais do banco.

---

## 🗂️ Módulo 7 — Observabilidade (ÚLTIMA FASE)

> **Deps:** Todos os módulos de Backend concluídos (TASK-BE-01 a TASK-BE-07)
> Stack: Prometheus + Grafana + Loki + Pino

---

### TASK-OBS-01 — Infraestrutura de Observabilidade (Docker Compose)

**Deps:** TASK-BE-07

**O que fazer:**
1. Adicionar ao `backend/docker-compose.yml` os serviços:
   ```yaml
   prometheus:
     image: prom/prometheus:latest
     volumes:
       - ./prometheus.yaml:/etc/prometheus/prometheus.yml
   
   grafana:
     image: grafana/grafana:latest
     ports:
       - "3100:3000"
     environment:
       - GF_SECURITY_ADMIN_PASSWORD=${GRAFANA_PASSWORD}
   
   loki:
     image: grafana/loki:latest
     ports:
       - "3101:3100"
   ```
2. Configurar `prometheus.yaml` para fazer scrape de `backend:3001/metrics`
3. Configurar datasource Loki no Grafana via provisioning
4. Configurar datasource Prometheus no Grafana via provisioning

**Variáveis de ambiente:**
```env
GRAFANA_PASSWORD=supersecret
LOKI_HOST=http://loki:3100
```

**Validação:** `docker-compose up` sobe todos os serviços; Grafana acessível em `localhost:3100`.

---

### TASK-OBS-02 — Instrumentação do NestJS

**Deps:** TASK-OBS-01

**O que fazer:**
1. Confirmar que `@willsoto/nestjs-prometheus` está configurado (já existe no `AppModule`)
2. Adicionar métricas customizadas com `prom-client`:
   - `http_requests_total` — contador por rota e status
   - `book_searches_total` — contador de buscas
   - `book_views_total` — contador de visualizações de livros
   - `openlibrary_requests_total` — requisições à API externa
3. Configurar `pino-loki` para enviar logs estruturados ao Loki:
   ```ts
   transport: {
     target: 'pino-loki',
     options: {
       host: process.env.LOKI_HOST,
       labels: { app: 'mybookshelf-backend' }
     }
   }
   ```
4. Garantir que todos os logs incluem: `requestId`, `userId` (quando autenticado), `route`, `duration`

**Validação:** Logs aparecem no Loki Explorer do Grafana; métricas visíveis em `localhost:3001/metrics`.

---

### TASK-OBS-03 — Dashboards no Grafana

**Deps:** TASK-OBS-02

**O que fazer:**
Criar os seguintes dashboards no Grafana (exportar como JSON e salvar em `backend/grafana/dashboards/`):

1. **Dashboard: API Overview**
   - Request rate (req/s) por rota
   - Error rate (%) por rota
   - P50/P95/P99 latência por rota
   - Uptime do serviço

2. **Dashboard: Business Metrics**
   - Livros mais buscados
   - Livros mais visualizados (top 10)
   - Reviews criadas por dia
   - Novos usuários por dia
   - Requisições ao OpenLibrary por hora

3. **Dashboard: Logs Explorer**
   - Painel Loki com filtro por `level` (error, warn, info)
   - Painel de erros com stack trace
   - Alertas para `level=error` > 5 ocorrências em 5 minutos

4. Configurar alertas no Grafana:
   - Error rate > 5% → notificação
   - Latência P95 > 2s → notificação

**Validação:** Gerar tráfego com `curl` nos endpoints principais e ver métricas atualizando em tempo real nos dashboards.

---

## 📊 Mapa de Dependências

```
TASK-BE-01 ──┬──► TASK-BE-02 ──────► TASK-BE-07
              │         └──────────► TASK-BE-04
              │
              └──► TASK-BE-03 ──────► TASK-BE-05
                                  └──► TASK-BE-06


TASK-FE-01 ──┬──► TASK-FE-02 ──┬──► TASK-FE-04 ──► TASK-FE-05 ──► TASK-FE-06
              └──► TASK-FE-03 ──┘

TASK-MOB-01 ──► TASK-MOB-02 ──┬──► TASK-MOB-03
                               ├──► TASK-MOB-04
                               └──► TASK-MOB-05 ──► TASK-MOB-06

TASK-ADM-01 ──► TASK-ADM-02
             └──► TASK-ADM-03 ──► TASK-ADM-04

[TASK-BE-07] ──► TASK-OBS-01 ──► TASK-OBS-02 ──► TASK-OBS-03
```

---

## 🚦 Ordem de Execução Recomendada

| Prioridade | Tarefa          | Pode rodar em paralelo com |
|------------|-----------------|----------------------------|
| 1          | TASK-BE-01      | TASK-FE-01, TASK-MOB-01, TASK-ADM-01 |
| 2          | TASK-BE-02      | TASK-FE-02, TASK-FE-03, TASK-MOB-02 |
| 3          | TASK-BE-03      | TASK-BE-04* (após BE-02)   |
| 4          | TASK-BE-04      | TASK-BE-05, TASK-BE-06     |
| 5          | TASK-BE-05      | TASK-BE-06, TASK-FE-04     |
| 6          | TASK-BE-06      | TASK-FE-05, TASK-MOB-03    |
| 7          | TASK-BE-07      | TASK-FE-06, TASK-MOB-04    |
| 8          | TASK-FE-04~06   | TASK-MOB-05~06, TASK-ADM-02~04 |
| 9 (último) | TASK-OBS-01~03  | —                          |

> **Após completar**: marcar a tarefa como `[x]` neste arquivo.
