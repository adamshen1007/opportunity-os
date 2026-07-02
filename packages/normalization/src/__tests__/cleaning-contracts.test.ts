import { describe, expect, it } from "vitest";
import {
  HTML_CLEANING_RULES,
  MARKDOWN_CLEANING_RULES,
  UNICODE_NORMALIZATION_FORMS,
  URL_NORMALIZATION_RULES,
  WHITESPACE_NORMALIZATION_RULES,
  type CleaningIssue,
  type DeterministicCleaningContract,
  type HtmlCleaningContract,
  type MarkdownCleaningContract,
  type UnicodeNormalizationContract,
  type UrlNormalizationContract,
  type WhitespaceNormalizationContract
} from "../index.js";
import { rawContentFixturePostEnvelope } from "@opportunity-os/raw-content";

const canonicalText = {
  id: "canonical-text.fixture",
  version: "1.0.0",
  format: "plain-text",
  sourceKind: "post",
  source: rawContentFixturePostEnvelope.content.source,
  text: "Fixture text",
  segments: [],
  normalizedAt: "2026-01-01T00:00:00.000Z"
} as const;

describe("cleaning contracts", () => {
  it("locks deterministic cleaning vocabularies", () => {
    expect(MARKDOWN_CLEANING_RULES).toEqual([
      "strip-frontmatter",
      "normalize-heading-markers",
      "normalize-list-markers",
      "unwrap-link-text",
      "preserve-code-blocks",
      "preserve-inline-code"
    ]);
    expect(HTML_CLEANING_RULES).toEqual([
      "remove-tags",
      "decode-safe-entities",
      "preserve-link-text",
      "preserve-list-boundaries",
      "preserve-table-cell-boundaries",
      "drop-script-style-content"
    ]);
    expect(UNICODE_NORMALIZATION_FORMS).toEqual(["NFC", "NFD", "NFKC", "NFKD"]);
    expect(WHITESPACE_NORMALIZATION_RULES).toEqual([
      "trim-boundaries",
      "collapse-horizontal-whitespace",
      "normalize-line-endings",
      "limit-consecutive-blank-lines",
      "preserve-paragraph-breaks"
    ]);
    expect(URL_NORMALIZATION_RULES).toEqual([
      "trim-url",
      "normalize-scheme-host-case",
      "remove-default-port",
      "preserve-path-case",
      "sort-query-parameters",
      "drop-fragment"
    ]);
  });

  it("models each cleaning contract without execution behavior", () => {
    const markdown: MarkdownCleaningContract = {
      stage: "markdown-cleaning",
      options: {
        enabledRules: ["unwrap-link-text"],
        preserveCodeBlocks: true,
        preserveInlineCode: true
      }
    };
    const html: HtmlCleaningContract = {
      stage: "html-cleaning",
      options: {
        enabledRules: ["remove-tags"],
        preserveLinkText: true,
        preserveStructuralBreaks: true
      }
    };
    const unicode: UnicodeNormalizationContract = {
      stage: "unicode-normalization",
      options: {
        form: "NFC",
        preserveEmoji: true,
        stripControlCharacters: true
      }
    };
    const whitespace: WhitespaceNormalizationContract = {
      stage: "whitespace-normalization",
      options: {
        enabledRules: ["normalize-line-endings"],
        lineEnding: "lf",
        maxConsecutiveBlankLines: 2
      }
    };
    const url: UrlNormalizationContract = {
      stage: "url-normalization",
      options: {
        allowedSchemes: ["https"],
        enabledRules: ["trim-url"],
        preserveTrackingParameters: false
      }
    };

    expect(markdown.stage).toBe("markdown-cleaning");
    expect(html.stage).toBe("html-cleaning");
    expect(unicode.options.form).toBe("NFC");
    expect(whitespace.options.lineEnding).toBe("lf");
    expect(url.options.allowedSchemes).toEqual(["https"]);
  });

  it("keeps cleaning inputs and outputs deterministic and safe", () => {
    const issue: CleaningIssue = {
      code: "cleaning.contract.warning",
      stage: "whitespace-normalization",
      severity: "warning",
      safeMessage: "Whitespace boundary requires deterministic handling.",
      range: {
        start: 0,
        end: 12
      }
    };

    const contract: DeterministicCleaningContract = {
      stage: "whitespace-normalization",
      input: {
        canonicalText,
        options: {
          enabledRules: ["trim-boundaries"]
        }
      },
      output: {
        canonicalText,
        changed: false,
        issues: [issue]
      }
    };

    expect(contract.output.issues).toHaveLength(1);
    expect(contract.output.issues[0]?.safeMessage).not.toContain("token");
  });
});
