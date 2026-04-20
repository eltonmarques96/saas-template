# Reviews Resource

Represents user reviews for books. Each user can submit at most one review per book (enforced by a unique constraint on userId + bookId).

## Fields

| Field | Type | Description |
|-------|------|-------------|
| id | UUID | Primary key, auto-generated |
| stars | INTEGER | Star rating 1-5 (required, DB check constraint) |
| comment | TEXT | Optional text review |
| userId | UUID | FK to User |
| bookId | UUID | FK to Book |
| createdAt | TIMESTAMP | Auto-generated creation timestamp |
| updatedAt | TIMESTAMP | Auto-generated update timestamp |

## Relations

- `user` — ManyToOne → User
- `book` — ManyToOne → Book

## Endpoints

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| GET | /api/v1/reviews/book/:bookId | Public | Get all reviews for a book |
| POST | /api/v1/reviews | JWT | Create a review |
| PATCH | /api/v1/reviews/:id | JWT | Update your review |
| DELETE | /api/v1/reviews/:id | JWT | Delete your review |

## Business Rules

- A user may only submit one review per book. Attempting to create a second review returns 409 Conflict.
- Only the author of a review can update or delete it. Other users receive 403 Forbidden.
- `stars` must be between 1 and 5 (enforced at both DTO validation and DB level).
- GET /reviews/book/:bookId returns the average star rating alongside the review list.
