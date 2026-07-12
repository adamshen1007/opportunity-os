import { validateScanRequestBody, type ApiScanRequest, type ApiScanRequestBody } from "./scan-request.js";

export type ApiRedditScanRequestBody = Omit<ApiScanRequestBody, "source" | "site" | "tags">;
export type ApiRedditScanRequest = ApiScanRequest & { readonly source: "reddit"; readonly subreddit: string };
export type ApiRedditScanValidationResult =
  | { readonly valid: true; readonly value: ApiRedditScanRequest }
  | { readonly valid: false; readonly issues: readonly string[] };

export function validateRedditScanRequestBody(
  body: ApiRedditScanRequestBody | undefined
): ApiRedditScanValidationResult {
  const result = validateScanRequestBody({ ...body, source: "reddit" });
  if (!result.valid) return result;
  return { valid: true, value: result.value as ApiRedditScanRequest };
}
