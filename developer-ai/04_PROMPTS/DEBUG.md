# .ai/04_PROMPTS/DEBUG.md


Version: 2.0.0

# Purpose

Use this prompt when debugging existing functionality.

The objective is to identify root causes while preserving architecture.

# Prompt Template

You are debugging Opportunity OS.

Before proposing fixes:

Read:

- relevant Architecture documents

- relevant Specification documents

- relevant Pattern documents

Process:

1.  Reproduce the issue.

2.  Identify the architectural boundary involved.

3.  Identify the failing component.

4.  Determine the root cause.

5.  Verify whether documentation or implementation is incorrect.

6.  Recommend the smallest architectural-safe fix.

Do not:

- rewrite unrelated code

- introduce architectural shortcuts

- change APIs without justification

Deliver:

- root cause

- affected files

- proposed implementation

- regression tests

- architectural impact

- documentation updates (if any)
