# 05-003_ENVIRONMENT_SPEC.md


**Document ID:** 05-003
**Version:** 2.0.0

# Environment Specification

## Environments

Supported environments:

- local

- development

- staging

- production

# Required Variables

## Application

APP_NAME

NODE_ENV

PORT

## Database

DATABASE_URL

## Redis

REDIS_URL

## AI

OPENAI_API_KEY

ANTHROPIC_API_KEY

OPENAI_MODEL

ANTHROPIC_MODEL

## Authentication

JWT_SECRET

JWT_EXPIRES_IN

## Observability

LOG_LEVEL

OTEL_EXPORTER_ENDPOINT

# Optional

SENTRY_DSN

LANGFUSE_API_KEY

LANGSMITH_API_KEY

# Rules

Never commit secrets.

Every variable must:

- be documented

- have validation

- have default behavior where appropriate

Startup should fail fast when required variables are missing.

# Local Development

Required services:

- PostgreSQL

- Redis

Everything else should run via Docker Compose.
