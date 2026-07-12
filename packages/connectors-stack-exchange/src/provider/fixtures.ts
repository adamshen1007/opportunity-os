import type { StackExchangeSearchResult } from "./contracts.js";

export const STACK_EXCHANGE_FIXTURE_RESULT: StackExchangeSearchResult = {
  mode: "fixture",
  items: [
    {
      id: "question-fixture-1001",
      title: "How can a small team reduce repetitive deployment reviews?",
      bodyText: "Our release checklist is manual and errors are found late. We need a clearer workflow.",
      permalink: "https://stackoverflow.com/questions/1001/example",
      score: 18,
      answerCount: 4,
      tags: ["deployment", "automation"],
      createdAt: "2026-07-01T00:00:00.000Z",
      updatedAt: "2026-07-02T00:00:00.000Z",
      author: {
        id: "user-fixture-1",
        displayName: "Fixture Contributor",
        profileUrl: "https://stackoverflow.com/users/1/example"
      },
      site: "stackoverflow"
    }
  ],
  quota: {
    remaining: 9999,
    maximum: 10000,
    hasMore: false
  },
  attribution: {
    sourceName: "Stack Exchange",
    required: true
  }
};
