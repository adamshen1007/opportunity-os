# .ai/02_PATTERNS/REPOSITORY_PATTERN.md


Version: 2.0.0

# Purpose

Repositories isolate persistence from business logic.

Services communicate with repositories—not directly with the database.

# Responsibilities

Repositories are responsible for:

- loading aggregates

- persisting aggregates

- querying projections

Repositories are **not** responsible for:

- business rules

- validation

- scoring

- orchestration

# Standard Structure

repository/

├── repository.ts

├── mapper.ts

├── queries.ts

├── models.ts

└── __tests__/

# Repository Rules

Repositories should:

- return domain objects

- hide SQL details

- avoid leaking ORM models

- encapsulate persistence concerns

Business services should not know whether persistence uses PostgreSQL, another SQL database, or a future storage implementation.

# Query Principles

Keep queries:

- explicit

- optimized

- readable

Avoid embedding business calculations in SQL.

Use the Scoring Engine and domain services for deterministic calculations.

# Transactions

Repositories participate in transactions when coordinated by the application layer.

Repositories should not create nested transaction boundaries unless required by the persistence technology.

# Testing

Repository tests include:

- CRUD operations

- transaction behavior

- constraint validation

- migration compatibility

# Checklist

Before merging a repository:

- No business logic

- Domain objects returned

- ORM isolated

- Queries documented

- Tests passing
