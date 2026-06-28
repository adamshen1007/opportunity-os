# developer-ai/01_STANDARDS/LOGGING.md


Version: 2.0.0

# Purpose

Logging provides operational visibility.

Logs are for engineers and operators—not business logic.

Every service must emit structured, machine-readable logs.

# Logging Principles

Logs must be:

- structured

- searchable

- correlated

- minimal

- privacy-aware

# Required Fields

Every log entry includes:

- timestamp

- service name

- environment

- severity

- correlation ID

- request ID (if applicable)

- event name

- message

# Log Levels

DEBUG

Development diagnostics only.

Never enabled in production by default.

INFO

Expected business operations.

Examples:

- connector started

- workflow completed

- report generated

WARN

Recoverable problems.

Examples:

- retry scheduled

- degraded dependency

- slow response

ERROR

Unexpected failures requiring investigation.

Must include:

- error type

- correlation ID

- relevant identifiers

# Sensitive Data

Never log:

- secrets

- API keys

- tokens

- passwords

- personal credentials

- raw authentication headers

Log identifiers rather than sensitive payloads whenever possible.

# Correlation

Every workflow propagates the same Correlation ID.

This enables tracing from:

Connector Run

↓

Raw Content

↓

AI Workflow

↓

Opportunity

↓

API Response

# Observability

Logging complements:

- metrics

- tracing

- health checks

No single mechanism replaces another.

# Definition of Complete

Every service emits:

✓ startup log

✓ shutdown log

✓ success logs

✓ failure logs

✓ retry logs

✓ correlation IDs
