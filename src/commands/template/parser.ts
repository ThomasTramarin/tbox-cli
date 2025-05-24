export enum Type {
  Variable,
  BuiltIn,
  Comment,
}

export interface Placeholder {
  type: Type;
  key: string;
  defaultValue?: string;
}

export const getPlaceholders = (content: string): Placeholder[] => {
  const regex = /\{\{([^}]+)\}\}/g;
  const matches = [...content.matchAll(regex)];

  if (matches.length === 0) return [];

  const seen = new Map<
    string,
    { type: Type; key: string; defaultValue?: string }
  >();

  return matches.map((match) => {
    const inner = match[1].trim();

    // Built-in placeholders start with "__"
    if (inner.startsWith("__")) {
      return {
        type: Type.BuiltIn,
        key: inner.slice(2),
      };
    }

    // Comments start with "!"
    if (inner.startsWith("!")) {
      return {
        type: Type.Comment,
        key: inner.slice(1),
      };
    }

    // Variables with optional default value separated by "="
    const [key, defaultValue = ""] = inner.split("=");
    return {
      type: Type.Variable,
      key: key.trim(),
      defaultValue: defaultValue.trim(),
    };
  });
};
