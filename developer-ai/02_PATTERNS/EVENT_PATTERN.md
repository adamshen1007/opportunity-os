# developer-ai/02_PATTERNS/EVENT_PATTERN.md


Version: 3.0.0

# Purpose

This document defines the standard implementation pattern for domain and operational events.

Events are the primary communication mechanism between the Data Acquisition Framework, Intelligence Platform, and Application Platform.

All event implementations must follow this pattern.

# Event Principles

Events represent facts that have already occurred.

Examples:

- RawContentPersisted

- CanonicalContentCreated

- OpportunityCreated

Events are:

- immutable

- append-only

- versioned

- replayable

Events never represent commands.

# Standard Structure

events/

└── opportunity-created/

├── event.ts

├── payload.ts

├── schema.ts

├── publisher.ts

├── consumer.ts

└── __tests__/

Every event follows the same directory layout.

# Event Envelope

Every event contains:

- eventId

- eventType

- eventVersion

- category

- occurredAt

- correlationId

- causationId

- producer

- payload

The envelope is identical across all event types.

# Publisher Pattern

Publish events only after successful completion of the business transaction.

Do not publish events before persistence succeeds.

Publishers should be thin wrappers over the shared Event Publisher abstraction.

# Consumer Pattern

Consumers should:

1.  validate the event schema

2.  check version compatibility

3.  execute idempotently

4.  emit follow-up events only after successful processing

Consumers must tolerate duplicate delivery.

# Versioning

Breaking payload changes require a new event version.

Older versions remain supported until migration is complete.

Published events are never modified.

# Testing

Each event requires:

- schema validation tests

- serialization tests

- publisher tests

- consumer tests

- replay tests

- duplicate-delivery tests
