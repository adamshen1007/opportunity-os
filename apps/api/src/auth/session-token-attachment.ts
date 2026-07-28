const responseSessionTokens = new WeakMap<object, string>();

export function attachSessionToken(response: object, sessionToken: string): void {
  responseSessionTokens.set(response, sessionToken);
}

export function takeAttachedSessionToken(response: object): string | undefined {
  const token = responseSessionTokens.get(response);
  responseSessionTokens.delete(response);
  return token;
}
