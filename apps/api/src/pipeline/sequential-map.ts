export async function mapSequentially<TInput, TOutput>(
  items: readonly TInput[],
  mapper: (item: TInput, index: number) => Promise<TOutput>
): Promise<readonly TOutput[]> {
  const results: TOutput[] = [];

  for (const [index, item] of items.entries()) {
    results.push(await mapper(item, index));
  }

  return results;
}
