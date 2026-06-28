# 05-001_TECH_STACK.md


**Document ID:** 05-001
**Version:** 2.0.0
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

- shared types across backend/frontend

- excellent AI tooling support

- mature ecosystem

# Backend

Runtime:

Node.js 22 LTS

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
