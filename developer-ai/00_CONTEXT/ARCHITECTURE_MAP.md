# developer-ai/00_CONTEXT/ARCHITECTURE_MAP.md

# Architecture Map

Version: 3.0.0

## Logical Platforms

Opportunity OS still has three permanent logical platforms:

```text
Application Platform
        ↑
Intelligence Platform
        ↑
Data Acquisition Framework
```

Dependencies flow upward through contracts. Reverse dependencies and shortcuts are prohibited.

## Completed Foundation Layers

Engineering Kit v3.0 has completed the platform foundation needed before real provider/product capability begins:

```text
Runtime Configuration
Shared Foundation
Logging Foundation
Event Foundation
Database Foundation
Domain Foundation
Application Foundation
Dependency Injection & Composition
Infrastructure Composition
Connector SDK Foundation
Connector Runtime Foundation
Connector Host Foundation
Reddit Connector Foundation
Reddit Runtime
```

## Current Package Map

```text
packages/connectors-reddit
  ├─ Reddit connector contracts
  └─ deterministic fake-provider Reddit runtime

packages/connectors
  └─ generic Connector SDK contracts

packages/connector-runtime
  └─ generic runtime policy, state, metrics, telemetry, and harness contracts

packages/connector-host
  └─ host bootstrap, lifecycle, binding, health, execution, and test harness contracts

packages/infrastructure
  └─ infrastructure composition contracts

packages/container
  └─ dependency injection and composition contracts

packages/application
  └─ application-layer contracts

packages/domain
  └─ generic domain contracts

packages/database
  └─ Prisma and database foundation contracts

packages/events
  └─ event contracts

packages/shared
  └─ logging, context, validation, and shared contracts

packages/config, packages/types, packages/errors, packages/utils
  └─ base foundation packages
```

## Data Flow Target

Future product flow remains:

```text
External Data
↓
Raw Content
↓
Canonical Content
↓
Pain Points
↓
Clusters
↓
Trends
↓
Opportunities
↓
Reports
```

As of v3.0, only the foundation and deterministic Reddit runtime exist. Raw Content, Canonical Content, AI analysis, opportunities, APIs, and dashboard work are future milestones.

## Milestone 15 Boundary

Phase 2 Milestone 15 transitions from platform foundation to real provider capability.

Allowed next:

- Reddit provider transport architecture
- OAuth contract implementation
- API client abstraction
- HTTP transport abstraction
- request/response translation
- rate-limit and pagination parsing
- retry, timeout, and cancellation compatibility
- auth lifecycle
- safe provider errors
- telemetry contracts
- fake transport tests

Still prohibited:

- Raw Content persistence
- AI workflows
- opportunity generation
- REST APIs
- frontend
- scheduler
- worker
- business logic

## Golden Rule

If a task requires changing platform boundaries, stop and update the Engineering Kit first.
