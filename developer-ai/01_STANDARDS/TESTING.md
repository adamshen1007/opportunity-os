# developer-ai/01_STANDARDS/TESTING.md


Version: 3.0.0

# Purpose

Testing is mandatory.

Every implementation must be verifiable without manual inspection.

# Testing Pyramid

Unit Tests

↓

Contract Tests

↓

Integration Tests

↓

End-to-End Tests

Most tests should be unit tests.

# Unit Tests

Every business service requires unit tests.

Tests should verify:

- deterministic behavior

- edge cases

- failure conditions

# Contract Tests

Required for:

- connectors

- events

- APIs

- AI workflow interfaces

Contract tests prevent integration regressions.

# Integration Tests

Verify interactions between services.

Examples:

Connector

↓

Normalization

↓

Pain Point Extraction

↓

Opportunity Generation

# AI Testing

Never test for exact wording.

Test:

- schema validity

- required fields

- deterministic post-processing

- confidence thresholds

Mock providers should be used wherever possible.

# Regression Tests

Every bug fix requires:

1.  a failing test

2.  the implementation fix

3.  the passing test

Regression tests are permanent.

# Coverage Goals

Business logic:

95%+

Infrastructure:

80%+

UI:

risk-based

Coverage is a quality signal, not the objective itself.

Meaningful assertions matter more than raw percentages.

# Definition of Tested

A feature is tested when:

✓ Unit tests pass

✓ Contract tests pass

✓ Integration tests pass

✓ Regression tests added

✓ CI passes

Only then is implementation complete.
