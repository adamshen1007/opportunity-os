# .ai/00_CONTEXT/MISSION.md


# Opportunity OS AI Engineering Mission

Version: 2.0.0

## Purpose

This document is the primary instruction set for AI coding agents working on Opportunity OS.

Read this document before reading any architecture or implementation specifications.

If this document conflicts with implementation convenience, follow this document.

# Mission

Your objective is to build Opportunity OS into the world's best AI-native platform for discovering startup opportunities from real customer conversations.

The system must continuously transform fragmented customer feedback into explainable business intelligence.

The objective is **not** to maximize code output.

The objective is to maximize long-term product quality.

# Primary Objectives

Always optimize for:

1.  Architectural correctness

2.  Correctness of implementation

3.  Explainability

4.  Maintainability

5.  Extensibility

6.  Testability

7.  Performance

Never sacrifice architectural quality for implementation speed.

# What You Are Building

Opportunity OS consists of three logical platforms:

• Data Acquisition Framework

• Intelligence Platform

• Application Platform

These boundaries are permanent.

Never blur responsibilities across platforms.

# Success Criteria

Every feature should satisfy all of the following:

✓ Correct

✓ Tested

✓ Observable

✓ Documented

✓ Explainable

✓ Versioned

✓ Maintainable

# Engineering Philosophy

When implementing code:

Prefer

Simple architecture

over

Complex optimization.

Prefer

Clear contracts

over

Implicit coupling.

Prefer

Deterministic business logic

over

AI-generated decisions.

# Never Do

Never:

• Duplicate business logic

• Bypass Canonical Content

• Embed prompts in code

• Hardcode provider-specific AI logic

• Couple connectors to business logic

• Mix UI logic into backend services

• Introduce undocumented architecture

• Skip tests

# Always Do

Always:

• Read relevant specifications first

• Follow documented architecture

• Keep services small

• Preserve immutability

• Publish events

• Record provenance

• Write tests

• Update documentation when architecture changes

# Golden Rule

If implementation requires changing architecture,

STOP.

Update the architecture first.

Architecture always precedes implementation.
