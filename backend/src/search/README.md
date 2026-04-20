# Search Module (Elasticsearch)

Provides full-text search capabilities for books using Elasticsearch 8.

## Architecture

- **SearchService** — wraps the `@elastic/elasticsearch` `Client` to index, search, and delete book documents.
- **BookIndexingProcessor** — a Bull `@Processor('book-indexing')` that consumes async index jobs submitted by `BooksService` after a book is created or fetched from OpenLibrary.
- **SearchModule** — registers the `book-indexing` Bull queue and exports `SearchService`.

## Elasticsearch Index: `books`

| Field | Type | Description |
|-------|------|-------------|
| id | keyword | Book UUID |
| title | text | Book title (searched) |
| authorName | text | Author name (searched) |
| coverUrl | keyword | Cover image URL |
| siteUrl | keyword | Site/OpenLibrary URL |

## Endpoints

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| GET | /api/v1/books/search?q=query | Public | Full-text search by title or author name |

## Environment Variables

```
ELASTICSEARCH_NODE=http://localhost:9200
ELASTICSEARCH_USERNAME=       # optional
ELASTICSEARCH_PASSWORD=       # optional
```

## Resilience

All Elasticsearch operations fail silently — the application logs a warning but does NOT crash if Elasticsearch is unavailable. This ensures the app continues to work without a search index at the cost of search functionality.

## Docker

Elasticsearch 8.13.0 single-node is included in `docker-compose.yml` with security disabled for local development.
