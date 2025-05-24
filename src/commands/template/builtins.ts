export const builtInFunctions: Record<string, () => string> = {
  year: () => new Date().getFullYear().toString(),
  uuid: () => crypto.randomUUID(),
};
