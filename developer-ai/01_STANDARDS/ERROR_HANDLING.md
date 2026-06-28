# developer-ai/01_STANDARDS/ERROR_HANDLING.md


Version: 2.0.0

# Purpose

This document defines the standard error handling strategy for Opportunity OS.

Every service must report failures consistently, predictably, and observably.

Errors should never be hidden or silently ignored.

# Error Philosophy

Errors are categorized as:

- Validation Errors

- Business Errors

- Infrastructure Errors

- External Dependency Errors

- Internal System Errors

Each category has different handling rules.

# Validation Errors

Examples:

- invalid API request

- malformed schema

- missing required field

Rules:

- never retry

- return meaningful client error

- log at INFO level

# Business Errors

Examples:

- Opportunity not found

- Unsupported connector

- Duplicate registration

Rules:

- never retry

- expose safe error message

- record business context

# Infrastructure Errors

Examples:

- database unavailable

- message broker timeout

- storage failure

Rules:

- retry when appropriate

- exponential backoff

- structured logging

- emit operational event

# External Dependency Errors

Examples:

- AI provider unavailable

- Reddit API timeout

- authentication expired

Rules:

- retry only for transient failures

- apply circuit breaker where appropriate

- preserve request context

# Internal Errors

Unexpected failures must:

- fail fast

- preserve stack trace

- include correlation ID

- never expose implementation details to users

# Retry Policy

Retry only when failure is likely transient.

Never retry:

- validation failures

- authorization failures

- deterministic business failures

# Error Response Rules

Every user-facing error includes:

- error code

- human-readable message

- request identifier

- correlation identifier (when available)

Stack traces remain internal.

# Definition of Complete

Every feature must define:

- expected failures

- retry behavior

- recovery strategy

- logging behavior

- monitoring behavior
