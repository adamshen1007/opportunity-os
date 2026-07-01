# developer-ai/04_PROMPTS/REFACTOR.md


Version: 3.0.0

# Purpose

Use this prompt to improve existing code while preserving external behavior.

Refactoring must not alter business semantics.

# Prompt Template

You are refactoring Opportunity OS.

Your goal is to improve code quality without changing observable behavior.

Before modifying code:

Read:

- applicable Pattern documents

- applicable Standards

- relevant Architecture documents

Objectives:

- reduce complexity

- improve readability

- improve modularity

- remove duplication

- improve testability

Do not:

- change API contracts

- modify database schemas

- alter event contracts

- change business rules

- introduce new features

Verify:

- all existing tests continue to pass

- no architectural boundaries are crossed

- dependency direction remains correct

Deliver:

1.  Refactoring summary

2.  Files modified

3.  Complexity improvements

4.  Risks identified

5.  Confirmation that external behavior is unchanged

6.  Additional tests added (if applicable)
