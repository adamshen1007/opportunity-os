# 05-001_TECH_STACK.md


**Document ID:** 05-001
**Version:** 3.0.0
**Status:** Approved (Bootstrap)
**Layer:** 4 – Repository Bootstrap
**Owner:** Architecture Team

# Purpose

This document defines the approved technology stack for Opportunity OS.

All implementations must conform to this stack unless superseded by an Architecture Decision Record (ADR).

# Design Principles

Technology choices prioritize:

- long-term maintainability

- strong type safety

- AI-assisted development

- scalability

- ecosystem maturity

- developer experience

Consistency is preferred over experimentation.

# Core Language

TypeScript (strict mode)

Reasons:

- end-to-end type safety

- shared types across foundation packages and future application entry points

- excellent AI tooling support

- mature ecosystem

# Backend

Runtime:

Node.js 24

Framework:

Fastify

Reasons:

- high performance

- schema-first validation

- strong TypeScript support

- plugin architecture

# Frontend

Framework:

Next.js (App Router)

React 19

Reasons:

- server components

- excellent DX

- mature ecosystem

- production-ready routing

# Deployment

Phase 3 Milestone 29 Private Beta deployment readiness is owned by `.github/workflows/deploy.yml` and `docs/04_IMPLEMENTATION/04-004_PRIVATE_BETA_DEPLOYMENT.md`.

The Slice A deployment configuration is a readiness gate:

- it uses Node.js 24 from `.node-version`
- it uses `pnpm@11.7.0`
- it runs `node scripts/verify-repository.mjs --phase phase-3-milestone-29`
- it runs lint, build, test, and Docker Compose config validation
- it targets the GitHub `private-beta` environment

A later scoped Private Beta task may attach a hosting provider, protected secrets, monitoring, backup execution, and release promotion.

Private Beta work must not introduce payments, subscriptions, enterprise features, notifications, CRM integrations, or multi-tenancy.

# Database

Primary:

PostgreSQL 16+

ORM:

Prisma

Reasons:

- type-safe client

- migration management

- excellent TypeScript integration

Optional:

pgvector

Used only for semantic search.

# Cache & Queues

Redis

Uses:

- distributed cache

- job queue

- rate limiting

- workflow coordination

# AI Providers

Supported through provider adapters.

MVP:

- OpenAI

- Anthropic

Future:

- Gemini

- DeepSeek

- Local models

Business logic must never depend on a specific provider.

# Infrastructure

Package Manager:

pnpm

Monorepo:

Turborepo

Containers:

Docker

CI:

GitHub Actions

# Testing

Unit:

Vitest

Integration:

Vitest

E2E:

Playwright

API:

Supertest

# Observability

Logging:

Pino

Metrics:

OpenTelemetry

Tracing:

OpenTelemetry

# Security

Authentication:

JWT

Validation:

Zod

Secrets:

Environment variables + Secret Manager

# Non-Approved Technologies

Avoid introducing:

- NestJS

- Express

- Sequelize

- MongoDB

- Yarn

- npm workspaces

without an approved ADR.
