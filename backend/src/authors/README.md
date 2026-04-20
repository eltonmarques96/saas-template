# Authors Resource

Represents book authors synced from OpenLibrary or manually created.

## Fields

| Field | Type | Description |
|-------|------|-------------|
| id | UUID | Primary key, auto-generated |
| name | VARCHAR | Author full name (required) |
| pageUrl | VARCHAR | OpenLibrary author page URL (nullable) |
| photoUrl | VARCHAR | Author photo URL (nullable) |
| createdAt | TIMESTAMP | Auto-generated creation timestamp |
| updatedAt | TIMESTAMP | Auto-generated update timestamp |

## Endpoints

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| GET | /api/v1/authors | Public | List all authors |
| GET | /api/v1/authors/:id | Public | Get author by ID |

## Business Rules

- Authors are created automatically when a book is fetched from OpenLibrary.
- Authors can also be created manually via the admin interface.
- `pageUrl` stores the canonical OpenLibrary author URL for deduplication.
