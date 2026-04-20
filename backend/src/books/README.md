# Books Resource

Represents books in the catalog. Books can be added manually or fetched automatically from OpenLibrary by ISBN.

## Fields

| Field | Type | Description |
|-------|------|-------------|
| id | UUID | Primary key, auto-generated |
| title | VARCHAR | Book title (required) |
| coverUrl | VARCHAR | Book cover image URL (nullable) |
| synopsis | TEXT | Book synopsis (nullable) |
| pages | INTEGER | Number of pages (nullable) |
| publishedDate | DATE | Original published date (nullable) |
| publisher | VARCHAR | Publisher name (nullable) |
| isbn | VARCHAR | ISBN identifier, unique (nullable) |
| siteUrl | VARCHAR | Book page URL (nullable) |
| openLibraryId | VARCHAR | OpenLibrary work ID, unique (nullable) |
| viewCount | INTEGER | Number of views, default 0 |
| authorId | UUID | FK to Author |
| createdAt | TIMESTAMP | Auto-generated creation timestamp |
| updatedAt | TIMESTAMP | Auto-generated update timestamp |

## Relations

- `author` — ManyToOne → Author
- `categories` — ManyToMany → Category (join table: `book_categories`)

## Endpoints

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| GET | /api/v1/books/popular | Public | Get popular books ordered by viewCount |
| GET | /api/v1/books/search?q= | Public | Full-text search via Elasticsearch |
| GET | /api/v1/books/isbn/:isbn | Public | Get book by ISBN (fetches from OpenLibrary if not cached) |
| GET | /api/v1/books/category/:id | Public | Get books by category, ordered by avg stars |
| GET | /api/v1/books/author/:id | Public | Get books by author |
| GET | /api/v1/books/:id | Public | Get book by UUID (increments viewCount) |
| POST | /api/v1/books | Admin JWT | Create a book |
| PATCH | /api/v1/books/:id | Admin JWT | Update a book |
| DELETE | /api/v1/books/:id | Admin JWT | Delete a book |

## Business Rules

- When a book is fetched by ISBN and not found locally, it is fetched from OpenLibrary and persisted automatically.
- Each GET /:id increments `viewCount` atomically.
- `isbn` and `openLibraryId` are unique to prevent duplicates.
- Indexing into Elasticsearch is done asynchronously via a Bull queue.
