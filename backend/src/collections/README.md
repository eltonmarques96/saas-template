# Collections Resource

Represents user-created book collections (e.g., "Want to Read", "Favorites"). Each collection belongs to a user and can contain multiple books.

## Fields

| Field | Type | Description |
|-------|------|-------------|
| id | UUID | Primary key, auto-generated |
| name | VARCHAR | Collection name (required) |
| userId | UUID | FK to User (owner) |
| createdAt | TIMESTAMP | Auto-generated creation timestamp |
| updatedAt | TIMESTAMP | Auto-generated update timestamp |

## Relations

- `user` — ManyToOne → User (owner)
- `books` — ManyToMany → Book (join table: `collection_books`)

## Endpoints (all require JWT Bearer token)

| Method | Path | Description |
|--------|------|-------------|
| GET | /api/v1/collections | List all collections for the authenticated user |
| POST | /api/v1/collections | Create a new collection |
| GET | /api/v1/collections/:id | Get a collection by ID (ownership enforced) |
| PATCH | /api/v1/collections/:id | Update collection name (ownership enforced) |
| DELETE | /api/v1/collections/:id | Delete a collection (ownership enforced) |
| POST | /api/v1/collections/:id/books/:bookId | Add a book to the collection |
| DELETE | /api/v1/collections/:id/books/:bookId | Remove a book from the collection |

## Business Rules

- A user can only view and modify their own collections (ownership check via JWT userId).
- Attempting to access another user's collection returns 403 Forbidden.
- Adding a non-existent book returns 404 Not Found.
