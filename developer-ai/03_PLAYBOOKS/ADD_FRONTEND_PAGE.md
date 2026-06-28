# .ai/03_PLAYBOOKS/ADD_FRONTEND_PAGE.md


Version: 2.0.0

# Purpose

This playbook defines the process for introducing a new page into the Opportunity OS web application.

The objective is to maintain a consistent user experience, architecture, and implementation approach.

# Prerequisites

Read:

- 03-007_FRONTEND_SPEC.md

- API_SPEC.md

- SERVICE_PATTERN.md

# Implementation Steps

## Step 1 — Confirm Information Architecture

Verify that the page fits within the documented navigation hierarchy.

If it introduces a new top-level section, update the Frontend Specification before implementation.

## Step 2 — Create Page Module

Create:

frontend/

└── pages/

└── \<page-name\>/

├── page.tsx

├── hooks.ts

├── components/

├── api.ts

├── types.ts

└── __tests__/

## Step 3 — API Integration

Use the shared typed API client.

Do not call HTTP libraries directly from UI components.

All server communication should be centralized through the API layer.

## Step 4 — State Management

Separate:

- server state

- UI state

- session preferences

Avoid duplicating backend business state in client storage.

## Step 5 — Accessibility

Verify:

- keyboard navigation

- focus order

- semantic HTML

- screen reader compatibility

- color contrast

Accessibility defects block completion.

## Step 6 — Performance

Confirm:

- lazy loading where appropriate

- efficient rendering

- virtualization for large datasets

- minimal unnecessary re-renders

## Step 7 — Testing

Include:

- component tests

- page integration tests

- accessibility checks

- API mocking

- routing tests

# Completion Checklist

- Page integrated into navigation

- API integration complete

- Accessibility verified

- Performance reviewed

- Tests passing
