import assert from "node:assert/strict";
import test from "node:test";
import { readHealthPayload, readMetaContent, requireReleaseSha } from "./verify-hosted-release.mjs";

test("reads the safe API health envelope", () => {
  const health = readHealthPayload({
    ok: true,
    data: {
      status: "ok",
      releaseSha: "a".repeat(40),
      dependencies: [{ name: "database", status: "ok" }]
    }
  });
  assert.equal(health.releaseSha, "a".repeat(40));
});

test("reads release and API metadata regardless of attribute order", () => {
  const html = '<meta content="https://api.example.com" name="opportunity-os-api-origin"><meta name="opportunity-os-release-sha" content="' + "b".repeat(40) + '">';
  assert.equal(readMetaContent(html, "opportunity-os-api-origin"), "https://api.example.com");
  assert.equal(readMetaContent(html, "opportunity-os-release-sha"), "b".repeat(40));
});

test("rejects missing or abbreviated release identifiers", () => {
  assert.throws(() => requireReleaseSha(undefined), /40-character Git commit SHA/u);
  assert.throws(() => requireReleaseSha("abc1234"), /40-character Git commit SHA/u);
});

test("safe failures do not include secret-like input values", () => {
  const secret = "secret-token-value";
  assert.throws(() => readHealthPayload({ token: secret }), (error) => {
    assert.equal(String(error).includes(secret), false);
    return true;
  });
});
