import { describe, expect, it } from "vitest";
import {
  REDDIT_CONFIG_FIELD_KEYS,
  REDDIT_OAUTH_CONFIG_FIELD_KEYS,
  REDDIT_REQUIRED_CONFIG_FIELD_KEYS,
  REDDIT_SENSITIVE_CONFIG_FIELD_KEYS
} from "../index.js";

describe("reddit connector configuration contracts", () => {
  it("declares explicit config field keys", () => {
    expect(REDDIT_CONFIG_FIELD_KEYS).toEqual([
      "clientId",
      "clientSecret",
      "refreshToken",
      "accessToken",
      "userAgent",
      "readOnlyMode"
    ]);
  });

  it("marks secret-like credential fields as sensitive contracts", () => {
    expect(REDDIT_SENSITIVE_CONFIG_FIELD_KEYS).toEqual([
      "clientId",
      "clientSecret",
      "refreshToken",
      "accessToken"
    ]);
    expect(REDDIT_OAUTH_CONFIG_FIELD_KEYS).toEqual(REDDIT_SENSITIVE_CONFIG_FIELD_KEYS);
  });

  it("does not require future credentials for the current contract boundary", () => {
    expect(REDDIT_REQUIRED_CONFIG_FIELD_KEYS).toEqual([
      "userAgent",
      "readOnlyMode"
    ]);
  });
});
