# Categories Resource

Represents book genres/subjects used to classify books. Categories are synced from OpenLibrary subjects or manually created.

## Fields

| Field | Type | Description |
|-------|------|-------------|
| id | UUID | Primary key, auto-generated |
| name | VARCHAR | Category name (required, unique) |
| pageUrl | VARCHAR | OpenLibrary subject page URL (nullable) |
| createdAt | TIMESTAMP | Auto-generated creation timestamp |

## Endpoints

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| GET | /api/v1/categories | Public | List all categories |
| GET | /api/v1/categories/:id | Public | Get category by ID |

## Business Rules

- Category `name` is unique — duplicates are prevented at the database level.
- Categories are created automatically when a book is fetched from OpenLibrary.
- Books and categories have a many-to-many relationship via the `book_categories` join table.
